import { SadSoundChoice, SoundChoice } from '../types';
import { AudioStorageService } from './audioStorage';

let audioCtx: AudioContext | null = null;
let currentHtmlAudio: HTMLAudioElement | null = null;
let activeOscillators: OscillatorNode[] = [];
let audioStateListeners: Set<(isPlaying: boolean, soundId?: string) => void> = new Set();
let currentlyPlayingId: string | null = null;

function notifyAudioState(isPlaying: boolean, soundId?: string) {
  currentlyPlayingId = isPlaying ? soundId || null : null;
  audioStateListeners.forEach((listener) => listener(isPlaying, soundId));
}

export function subscribeAudioState(listener: (isPlaying: boolean, soundId?: string) => void) {
  audioStateListeners.add(listener);
  return () => {
    audioStateListeners.delete(listener);
  };
}

export function getCurrentPlayingSoundId(): string | null {
  return currentlyPlayingId;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Stop any ongoing audio playback (synth or custom audio file)
 */
export function stopAllAudio() {
  if (currentHtmlAudio) {
    try {
      currentHtmlAudio.pause();
      currentHtmlAudio.currentTime = 0;
      currentHtmlAudio = null;
    } catch {
      // ignore
    }
  }
  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // ignore
    }
  });
  activeOscillators = [];
  notifyAudioState(false);
}

/**
 * Play a custom audio data URL or blob URL
 */
export function playCustomAudioUrl(url: string, soundId = 'custom'): Promise<void> {
  stopAllAudio();
  return new Promise((resolve) => {
    try {
      const audio = new Audio(url);
      currentHtmlAudio = audio;
      notifyAudioState(true, soundId);

      audio.onended = () => {
        currentHtmlAudio = null;
        notifyAudioState(false);
        resolve();
      };
      audio.onerror = () => {
        currentHtmlAudio = null;
        notifyAudioState(false);
        resolve();
      };
      audio.play().catch((err) => {
        console.warn('Custom audio playback was prevented:', err);
        notifyAudioState(false);
        resolve();
      });
    } catch (err) {
      console.warn('Audio error:', err);
      notifyAudioState(false);
      resolve();
    }
  });
}

/**
 * Play standard task alert / notification sound
 */
export async function playAlertSound(choice: SoundChoice, customAudioUrl?: string) {
  if (!choice || choice === 'none') return;
  stopAllAudio();

  if (choice.startsWith('custom_') || customAudioUrl) {
    let urlToPlay = customAudioUrl;
    if (!urlToPlay && choice.startsWith('custom_')) {
      const toneId = choice.replace('custom_', '');
      try {
        const tone = await AudioStorageService.getTone(toneId);
        if (tone?.dataUrl) {
          urlToPlay = tone.dataUrl;
        }
      } catch (err) {
        console.warn('Failed to retrieve tone from AudioStorage:', err);
      }
    }
    if (urlToPlay) {
      playCustomAudioUrl(urlToPlay, choice);
      return;
    }
  }

  if (choice.startsWith('sad_') || choice.startsWith('arasko_sad_')) {
    playSadOverdueSound(choice as SadSoundChoice, customAudioUrl);
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    notifyAudioState(true, choice);

    if (choice === 'chime') {
      // Warm uplifting chord chime (F5, A5, C6)
      const freqs = [698.46, 880.0, 1046.5];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        activeOscillators.push(osc);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.85);
      });
      setTimeout(() => notifyAudioState(false), 950);
    } else if (choice === 'bell') {
      // Crisp metallic chime bell
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      activeOscillators.push(osc);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1318.5, now); // E6

      gain.gain.setValueAtTime(0.26, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
      setTimeout(() => notifyAudioState(false), 1250);
    } else if (choice === 'ping') {
      // Modern digital high ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      activeOscillators.push(osc);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now); // A6
      osc.frequency.exponentialRampToValueAtTime(2349.32, now + 0.12);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
      setTimeout(() => notifyAudioState(false), 400);
    } else if (choice === 'zen') {
      // Deep meditative Tibetan singing bowl tone (216Hz + harmonics)
      [216, 432, 648].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        activeOscillators.push(osc);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        const vol = idx === 0 ? 0.25 : 0.08 / idx;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.85);
      });
      setTimeout(() => notifyAudioState(false), 1900);
    } else if (choice === 'harp') {
      // Elegant ascending harp arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        activeOscillators.push(osc);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.95);
      });
      setTimeout(() => notifyAudioState(false), 1300);
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
    notifyAudioState(false);
  }
}

/**
 * Play emotional / sad / melancholic tones for overdue tasks
 */
export function playSadOverdueSound(choice: SadSoundChoice, customAudioUrl?: string) {
  if (!choice || choice === 'none') return;
  stopAllAudio();

  if (choice.startsWith('custom_') || customAudioUrl) {
    if (customAudioUrl) {
      playCustomAudioUrl(customAudioUrl, choice);
      return;
    }
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    notifyAudioState(true, choice);

    if (choice === 'arasko_sad_1') {
      // "اراسكو الحزين 1" - Deep Oriental Melancholic Ney & Violin Solo (D Minor / Bayati Phrygian phrase)
      // Expressive legato with slow pitch bends, soulful vibrato, and dynamic breathy resonance
      const notes = [
        { freq: 293.66, bendTo: 311.13, start: 0.0, dur: 0.65, vol: 0.22 }, // D4 -> slight bend Eb4
        { freq: 349.23, bendTo: 369.99, start: 0.55, dur: 0.75, vol: 0.25 }, // F4 -> F#4 inflection
        { freq: 329.63, bendTo: 311.13, start: 1.2, dur: 0.65, vol: 0.21 }, // E4 -> Eb4 weeping drop
        { freq: 293.66, bendTo: 277.18, start: 1.75, dur: 0.8, vol: 0.23 }, // D4 -> C#4 leading tone
        { freq: 293.66, bendTo: 293.66, start: 2.45, dur: 1.6, vol: 0.26 }, // D4 deep resolution with warm swell
      ];

      notes.forEach((item) => {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        activeOscillators.push(osc, subOsc, vibrato);

        osc.type = 'sawtooth';
        subOsc.type = 'sine'; // Warm woodwind / ney body tone

        // Breathy warm lowpass filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, now + item.start);
        filter.frequency.linearRampToValueAtTime(1100, now + item.start + 0.2);
        filter.frequency.exponentialRampToValueAtTime(450, now + item.start + item.dur);
        filter.Q.setValueAtTime(4.0, now + item.start);

        // Expressive vibrato (5.2Hz)
        vibrato.frequency.setValueAtTime(5.2, now + item.start);
        vibratoGain.gain.setValueAtTime(5.5, now + item.start);
        vibrato.connect(osc.frequency);
        vibrato.connect(subOsc.frequency);

        // Pitch glide & bend
        osc.frequency.setValueAtTime(item.freq, now + item.start);
        subOsc.frequency.setValueAtTime(item.freq * 0.5, now + item.start); // Sub octave warm bass
        if (item.bendTo !== item.freq) {
          osc.frequency.linearRampToValueAtTime(item.bendTo, now + item.start + item.dur * 0.4);
          osc.frequency.linearRampToValueAtTime(item.freq, now + item.start + item.dur * 0.85);
        }

        // Amplitude envelope (soft swell and lingering release)
        gain.gain.setValueAtTime(0, now + item.start);
        gain.gain.linearRampToValueAtTime(item.vol, now + item.start + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + item.start + item.dur);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        vibrato.start(now + item.start);
        osc.start(now + item.start);
        subOsc.start(now + item.start);

        vibrato.stop(now + item.start + item.dur + 0.05);
        osc.stop(now + item.start + item.dur + 0.05);
        subOsc.stop(now + item.start + item.dur + 0.05);
      });
      setTimeout(() => notifyAudioState(false), 4200);
    } else if (choice === 'arasko_sad_2') {
      // "اراسكو الحزين 2" - Somber Elegiac Cello & Deep Bowed Strings (E minor sorrowful elegy)
      const chordLayers = [
        {
          bass: 164.81, // E3
          lead: 329.63, // E4
          harmony: 392.0, // G4 (Minor 3rd)
          time: 0.0,
          dur: 1.2,
        },
        {
          bass: 146.83, // D3
          lead: 293.66, // D4
          harmony: 369.99, // F#4
          time: 1.0,
          dur: 1.2,
        },
        {
          bass: 130.81, // C3
          lead: 261.63, // C4
          harmony: 329.63, // E4
          time: 2.0,
          dur: 1.3,
        },
        {
          bass: 123.47, // B2
          lead: 246.94, // B3
          harmony: 311.13, // D#4 (Harmonic minor dominant)
          time: 3.1,
          dur: 1.8,
        },
      ];

      chordLayers.forEach((layer) => {
        [layer.bass, layer.lead, layer.harmony].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          const vibrato = ctx.createOscillator();
          const vibratoGain = ctx.createGain();

          activeOscillators.push(osc, vibrato);

          osc.type = idx === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + layer.time);

          // Cello chamber filter
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(idx === 0 ? 400 : 900, now + layer.time);
          filter.Q.setValueAtTime(2.5, now + layer.time);

          vibrato.frequency.setValueAtTime(4.8, now + layer.time);
          vibratoGain.gain.setValueAtTime(idx === 0 ? 1.5 : 3.5, now + layer.time);
          vibrato.connect(osc.frequency);

          const vol = idx === 0 ? 0.22 : 0.14;
          gain.gain.setValueAtTime(0, now + layer.time);
          gain.gain.linearRampToValueAtTime(vol, now + layer.time + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + layer.time + layer.dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          vibrato.start(now + layer.time);
          osc.start(now + layer.time);

          vibrato.stop(now + layer.time + layer.dur + 0.05);
          osc.stop(now + layer.time + layer.dur + 0.05);
        });
      });
      setTimeout(() => notifyAudioState(false), 5100);
    } else if (choice === 'sad_oud_lament') {
      // "تقاسيم عود أندلسية حزينة" - Sorrowful Oriental Oud Pluck & Drone Strings
      const oudNotes = [
        { freq: 220.0, start: 0.0, dur: 0.8, vol: 0.3 }, // A3
        { freq: 246.94, start: 0.5, dur: 0.7, vol: 0.28 }, // B3
        { freq: 261.63, start: 1.0, dur: 0.8, vol: 0.32 }, // C4
        { freq: 293.66, start: 1.6, dur: 0.9, vol: 0.3 }, // D4
        { freq: 277.18, start: 2.3, dur: 0.8, vol: 0.26 }, // C#4 (Bayati/Hijaz flavor)
        { freq: 220.0, start: 2.9, dur: 1.6, vol: 0.35 }, // A3 Final linger
      ];

      // Drone base string (A2)
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      const droneFilter = ctx.createBiquadFilter();
      activeOscillators.push(droneOsc);
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(110.0, now);
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(280, now);
      droneGain.gain.setValueAtTime(0, now);
      droneGain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);
      droneOsc.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start(now);
      droneOsc.stop(now + 4.3);

      oudNotes.forEach((n) => {
        const osc = ctx.createOscillator();
        const bodyOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        activeOscillators.push(osc, bodyOsc);

        osc.type = 'triangle';
        bodyOsc.type = 'sine';

        osc.frequency.setValueAtTime(n.freq, now + n.start);
        bodyOsc.frequency.setValueAtTime(n.freq * 2, now + n.start);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(n.freq * 1.8, now + n.start);
        filter.Q.setValueAtTime(3.0, now + n.start);

        // Acoustic pluck attack
        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(n.vol, now + n.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

        osc.connect(filter);
        bodyOsc.connect(gain);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.start);
        bodyOsc.start(now + n.start);
        osc.stop(now + n.start + n.dur + 0.05);
        bodyOsc.stop(now + n.start + n.dur + 0.05);
      });
      setTimeout(() => notifyAudioState(false), 4600);
    } else if (choice === 'sad_qanun_sigh') {
      // "شجن القانون والكمان الحزين" - Shimmering Oriental Qanun Tremolos & Weeping Strings
      const qanunNotes = [
        { freq: 440.0, time: 0.0, dur: 0.3, vol: 0.2 },
        { freq: 440.0, time: 0.12, dur: 0.3, vol: 0.18 },
        { freq: 415.3, time: 0.4, dur: 0.4, vol: 0.22 }, // G#4
        { freq: 370.0, time: 0.8, dur: 0.5, vol: 0.24 }, // F#4
        { freq: 329.63, time: 1.3, dur: 0.6, vol: 0.25 }, // E4
        { freq: 293.66, time: 1.9, dur: 0.8, vol: 0.26 }, // D4
        { freq: 261.63, time: 2.6, dur: 1.5, vol: 0.28 }, // C4 lingering
      ];

      qanunNotes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        activeOscillators.push(osc);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now + n.time);
        filter.Q.setValueAtTime(2.0, now + n.time);

        gain.gain.setValueAtTime(0, now + n.time);
        gain.gain.linearRampToValueAtTime(n.vol, now + n.time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });
      setTimeout(() => notifyAudioState(false), 4200);
    } else if (choice === 'sad_violin') {
      // Sorrowful slow weeping violin minor phrase (D4 -> F4 -> E4 -> D4 with rich vibrato)
      const phrase = [
        { freq: 293.66, start: 0.0, dur: 0.7, vol: 0.22 }, // D4
        { freq: 349.23, start: 0.6, dur: 0.8, vol: 0.24 }, // F4
        { freq: 329.63, start: 1.3, dur: 0.7, vol: 0.2 }, // E4
        { freq: 293.66, start: 1.9, dur: 1.4, vol: 0.25 }, // D4 resolution
      ];

      phrase.forEach((item) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();

        activeOscillators.push(osc, vibrato);

        osc.type = 'sawtooth';

        // Lowpass filter to make it warm, woody, and emotional like a violin/cello
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now + item.start);
        filter.Q.setValueAtTime(3.5, now + item.start);

        // Vibrato
        vibrato.frequency.setValueAtTime(5.5, now + item.start);
        vibratoGain.gain.setValueAtTime(4.0, now + item.start);
        vibrato.connect(osc.frequency);

        osc.frequency.setValueAtTime(item.freq, now + item.start);

        gain.gain.setValueAtTime(0, now + item.start);
        gain.gain.linearRampToValueAtTime(item.vol, now + item.start + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + item.start + item.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        vibrato.start(now + item.start);
        osc.start(now + item.start);

        vibrato.stop(now + item.start + item.dur + 0.05);
        osc.stop(now + item.start + item.dur + 0.05);
      });
      setTimeout(() => notifyAudioState(false), 3400);
    } else if (choice === 'sad_piano') {
      // Gentle sorrowful piano minor chords (A minor -> F -> D minor -> E)
      const chords = [
        { notes: [220.0, 261.63, 329.63], time: 0.0, dur: 1.1 }, // Am (A3, C4, E4)
        { notes: [174.61, 261.63, 349.23], time: 0.9, dur: 1.1 }, // F (F3, C4, F4)
        { notes: [146.83, 220.0, 293.66], time: 1.8, dur: 1.1 }, // Dm (D3, A3, D4)
        { notes: [164.81, 246.94, 329.63], time: 2.7, dur: 1.5 }, // Em (E3, B3, E4)
      ];

      chords.forEach((chord) => {
        chord.notes.forEach((freq, nIdx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          activeOscillators.push(osc);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + chord.time + nIdx * 0.04);

          gain.gain.setValueAtTime(0, now + chord.time + nIdx * 0.04);
          gain.gain.linearRampToValueAtTime(0.18, now + chord.time + nIdx * 0.04 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + chord.time + chord.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + chord.time + nIdx * 0.04);
          osc.stop(now + chord.time + chord.dur + 0.05);
        });
      });
      setTimeout(() => notifyAudioState(false), 4400);
    } else if (choice === 'sad_sigh') {
      // Poignant descending sigh tone with smooth resonant sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      activeOscillators.push(osc);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(164.81, now + 1.6); // A4 down to E3

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 1.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.85);
      setTimeout(() => notifyAudioState(false), 1900);
    } else if (choice === 'sad_rain') {
      // Somber distant temple bell in minor third with descending reverb simulation
      const bells = [
        { freq: 440.0, time: 0.0, dur: 1.5 }, // A4
        { freq: 523.25, time: 0.5, dur: 1.4 }, // C5
        { freq: 392.0, time: 1.1, dur: 1.8 }, // G4
        { freq: 329.63, time: 1.7, dur: 2.0 }, // E4
      ];

      bells.forEach((b) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        activeOscillators.push(osc);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(b.freq, now + b.time);

        gain.gain.setValueAtTime(0, now + b.time);
        gain.gain.linearRampToValueAtTime(0.2, now + b.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + b.time + b.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + b.time);
        osc.stop(now + b.time + b.dur + 0.05);
      });
      setTimeout(() => notifyAudioState(false), 3800);
    } else if (choice === 'sad_defeat') {
      // Retro/synth descending defeat theme (C5 -> B4 -> Bb4 -> A4 -> Ab4 -> G4 slow drop)
      const steps = [523.25, 493.88, 466.16, 440.0, 392.0, 329.63];
      steps.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        activeOscillators.push(osc);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.22);

        gain.gain.setValueAtTime(0, now + idx * 0.22);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.22 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.22 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.22);
        osc.stop(now + idx * 0.22 + 0.5);
      });
      setTimeout(() => notifyAudioState(false), 2000);
    } else if (choice === 'sad_alarm') {
      // Urgent gloomy warning double pulse
      [0.0, 0.4, 0.9, 1.3].forEach((tOff) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        activeOscillators.push(osc);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now + tOff);
        osc.frequency.linearRampToValueAtTime(196, now + tOff + 0.25);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now + tOff);

        gain.gain.setValueAtTime(0, now + tOff);
        gain.gain.linearRampToValueAtTime(0.2, now + tOff + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + tOff + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + tOff);
        osc.stop(now + tOff + 0.32);
      });
      setTimeout(() => notifyAudioState(false), 1800);
    }
  } catch (err) {
    console.warn('Sad sound playback error:', err);
    notifyAudioState(false);
  }
}

export function playWorkoutBeep(type: 'countdown' | 'complete') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    activeOscillators.push(osc);

    if (type === 'countdown') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1320, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    }
  } catch (err) {
    console.warn(err);
  }
}

export function triggerVibration(patternOrEnabled?: boolean | number | number[], maybePattern?: number[]) {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  try {
    if (typeof patternOrEnabled === 'boolean') {
      if (!patternOrEnabled) return;
      navigator.vibrate(maybePattern || [80, 40, 80]);
    } else if (typeof patternOrEnabled === 'number') {
      navigator.vibrate(patternOrEnabled);
    } else if (Array.isArray(patternOrEnabled)) {
      navigator.vibrate(patternOrEnabled);
    } else {
      navigator.vibrate([80, 40, 80]);
    }
  } catch {
    // Ignore unsupported browser sandbox errors
  }
}

/**
 * Plays triumphant fanfare synthesizer harmony for streak milestones (7 or 30 days)
 */
export function playStreakCelebrationSound(streakCount = 7) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    stopAllAudio();

    const now = ctx.currentTime;
    notifyAudioState(true, `streak_celebration_${streakCount}`);

    const is30 = streakCount >= 30;
    // Triumphant rising arpeggio chord progression
    const notes = is30
      ? [
          { f: 523.25, t: 0.0, d: 0.25 }, // C5
          { f: 659.25, t: 0.12, d: 0.25 }, // E5
          { f: 783.99, t: 0.24, d: 0.25 }, // G5
          { f: 1046.5, t: 0.36, d: 0.35 }, // C6
          { f: 1318.5, t: 0.5, d: 0.8 }, // E6
          { f: 1567.98, t: 0.65, d: 1.3 }, // G6
        ]
      : [
          { f: 523.25, t: 0.0, d: 0.2 }, // C5
          { f: 659.25, t: 0.1, d: 0.2 }, // E5
          { f: 783.99, t: 0.2, d: 0.25 }, // G5
          { f: 1046.5, t: 0.32, d: 1.1 }, // C6
        ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      activeOscillators.push(osc);

      osc.type = is30 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0, now + n.t);
      gain.gain.linearRampToValueAtTime(0.24, now + n.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    });

    const totalDurMs = (notes[notes.length - 1].t + notes[notes.length - 1].d) * 1000 + 100;
    setTimeout(() => notifyAudioState(false), totalDurMs);
  } catch (e) {
    console.warn('Celebration sound playback error:', e);
  }
}

