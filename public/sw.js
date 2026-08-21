// Arasko Service Worker - Cache-First Offline Architecture
const CACHE_NAME = 'arasko-v1.0.0';
const OFFLINE_FALLBACK_URL = '/';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// Install Event: Precaching static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW] Pre-caching asset error (handled):', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Clear outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[SW] Clearing outdated cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event: Pure Cache-First Strategy for all static assets and dynamic offline fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore chrome-extension or other non-http schemes
  if (!url.protocol.startsWith('http')) return;

  // Navigation requests (HTML / SPA route changes)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately, refresh in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
            })
            .catch(() => {
              // Network failed, cache served
            });
          return cachedResponse;
        }

        // Not in cache, try network
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            // Network failed - return cached index.html or root
            const fallback = (await caches.match('/index.html')) || (await caches.match(OFFLINE_FALLBACK_URL));
            if (fallback) return fallback;
            return new Response('Arasko is offline. Please reopen when online or cached.', {
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
          });
      })
    );
    return;
  }

  // Static Assets & Resources: Cache-First Strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache immediately
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache it
      return fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.origin === location.origin || url.hostname.includes('googleapis') || url.hostname.includes('gstatic'))
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failure: return fallback or 408
          if (request.destination === 'image') {
            return caches.match('/icon-192.png');
          }
          return new Response('', { status: 408, statusText: 'Offline Network Timeout' });
        });
    })
  );
});
