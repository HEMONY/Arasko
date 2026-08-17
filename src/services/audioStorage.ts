import { CustomToneItem } from '../types';

const DB_NAME = 'arasko_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_audio_tones';

/**
 * Generates an authentic, lightweight PCM WAV base64 Data URL for the preloaded Arasko tones
 */
function generateAraskoWavDataUrl(type: '1' | '2'): string {
  if (typeof window === 'undefined') return '';
  const sampleRate = 22050;
  const duration = type === '1' ? 4.2 : 5.1;
  const numSamples = Math.floor(sampleRate * duration);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // 'RIFF' header
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + dataSize, true);
  view.setUint32(8, 0x57415645, false); // 'WAVE'
  view.setUint32(12, 0x666d7420, false); // 'fmt '
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, 1, true); // NumChannels (Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  view.setUint32(36, 0x64617461, false); // 'data'
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    if (type === '1') {
      // Arasko Sad 1: Oriental Phrygian Bayati phrase on Ney/Violin
      const notes = [
        { freq: 293.66, bend: 311.13, start: 0.0, dur: 0.65 },
        { freq: 349.23, bend: 369.99, start: 0.55, dur: 0.75 },
        { freq: 329.63, bend: 311.13, start: 1.2, dur: 0.65 },
        { freq: 293.66, bend: 277.18, start: 1.75, dur: 0.8 },
        { freq: 293.66, bend: 293.66, start: 2.45, dur: 1.6 },
      ];

      for (const n of notes) {
        if (t >= n.start && t < n.start + n.dur) {
          const nt = t - n.start;
          const prog = nt / n.dur;
          const curFreq = n.freq + (n.bend - n.freq) * Math.sin(prog * Math.PI);
          const vibrato = Math.sin(2 * Math.PI * 5.2 * nt) * 4.0;
          const env = Math.sin(Math.min(Math.PI, (nt / n.dur) * Math.PI));
          const wave =
            Math.sin(2 * Math.PI * (curFreq + vibrato) * t) * 0.6 +
            Math.sin(2 * Math.PI * (curFreq * 0.5) * t) * 0.3;
          sample += wave * env * 0.45;
        }
      }
    } else {
      // Arasko Sad 2: Somber Elegiac Cello & Descending Strings
      const chords = [
        { bass: 164.81, lead: 329.63, harm: 392.0, start: 0.0, dur: 1.2 },
        { bass: 146.83, lead: 293.66, harm: 369.99, start: 1.0, dur: 1.2 },
        { bass: 130.81, lead: 261.63, harm: 329.63, start: 2.0, dur: 1.3 },
        { bass: 123.47, lead: 246.94, harm: 311.13, start: 3.1, dur: 1.8 },
      ];

      for (const c of chords) {
        if (t >= c.start && t < c.start + c.dur) {
          const ct = t - c.start;
          const env = Math.sin(Math.min(Math.PI, (ct / c.dur) * Math.PI));
          const vib = Math.sin(2 * Math.PI * 4.8 * ct) * 2.5;
          const wave =
            Math.sin(2 * Math.PI * c.bass * t) * 0.4 +
            Math.sin(2 * Math.PI * (c.lead + vib) * t) * 0.35 +
            Math.sin(2 * Math.PI * c.harm * t) * 0.25;
          sample += wave * env * 0.4;
        }
      }
    }

    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

// Built-in registered tones with guaranteed presence
export const REGISTERED_ARASKO_TONES: CustomToneItem[] = [
  {
    id: 'arasko_sad_1',
    name: 'Arasko Sad 1',
    category: 'sad',
    durationSeconds: 4.2,
    fileName: 'arasko_sad_1.wav',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'arasko_sad_2',
    name: 'Arasko Sad 2',
    category: 'sad',
    durationSeconds: 5.1,
    fileName: 'arasko_sad_2.wav',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

// Open IndexedDB safely with fallback
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => resolve(null);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    } catch {
      resolve(null);
    }
  });
}

export const AudioStorageService = {
  /**
   * Registers or ensures default Arasko Sad 1 and Arasko Sad 2 are saved in IndexedDB
   */
  async ensurePreloadedTones(): Promise<void> {
    try {
      const db = await openDB();
      if (!db) return;

      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      for (const registeredTone of REGISTERED_ARASKO_TONES) {
        const req = store.get(registeredTone.id);
        req.onsuccess = () => {
          if (!req.result) {
            const dataUrl =
              registeredTone.id === 'arasko_sad_1'
                ? generateAraskoWavDataUrl('1')
                : generateAraskoWavDataUrl('2');
            store.put({
              ...registeredTone,
              dataUrl,
            });
          }
        };
      }
    } catch (e) {
      console.warn('AudioStorageService ensurePreloadedTones warning:', e);
    }
  },

  async saveTone(tone: CustomToneItem): Promise<boolean> {
    try {
      const db = await openDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put(tone);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        });
      }
      return false;
    } catch (e) {
      console.warn('AudioStorageService save error:', e);
      return false;
    }
  },

  async getTone(id: string): Promise<CustomToneItem | null> {
    try {
      // Check built-in registered Arasko tones first for instant fallback
      const registered = REGISTERED_ARASKO_TONES.find((t) => t.id === id);

      const db = await openDB();
      if (!db) {
        if (registered) {
          return {
            ...registered,
            dataUrl:
              registered.id === 'arasko_sad_1'
                ? generateAraskoWavDataUrl('1')
                : generateAraskoWavDataUrl('2'),
          };
        }
        return null;
      }

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result) {
            resolve(req.result);
          } else if (registered) {
            resolve({
              ...registered,
              dataUrl:
                registered.id === 'arasko_sad_1'
                  ? generateAraskoWavDataUrl('1')
                  : generateAraskoWavDataUrl('2'),
            });
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(registered || null);
      });
    } catch {
      const registered = REGISTERED_ARASKO_TONES.find((t) => t.id === id);
      return registered || null;
    }
  },

  async getAllTones(): Promise<CustomToneItem[]> {
    try {
      // Ensure default registered tones are synced
      await this.ensurePreloadedTones();

      const db = await openDB();
      if (!db) {
        return REGISTERED_ARASKO_TONES.map((t) => ({
          ...t,
          dataUrl:
            t.id === 'arasko_sad_1'
              ? generateAraskoWavDataUrl('1')
              : generateAraskoWavDataUrl('2'),
        }));
      }

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const list: CustomToneItem[] = req.result || [];
          // Ensure Arasko Sad 1 and Arasko Sad 2 exist in the list
          for (const reg of REGISTERED_ARASKO_TONES) {
            if (!list.some((item) => item.id === reg.id)) {
              list.unshift({
                ...reg,
                dataUrl:
                  reg.id === 'arasko_sad_1'
                    ? generateAraskoWavDataUrl('1')
                    : generateAraskoWavDataUrl('2'),
              });
            }
          }
          resolve(list);
        };
        req.onerror = () => resolve(REGISTERED_ARASKO_TONES);
      });
    } catch {
      return REGISTERED_ARASKO_TONES;
    }
  },

  async deleteTone(id: string): Promise<boolean> {
    try {
      // Protect default registered system tones from deletion
      if (id === 'arasko_sad_1' || id === 'arasko_sad_2') {
        return false;
      }

      const db = await openDB();
      if (!db) return false;
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  },
};
