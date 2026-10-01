/**
 * Tiny synthesized UI sounds (no audio files). Off by default; the visitor opts in
 * from the theme panel. Everything is generated with the Web Audio API.
 */
const KEY = 'sound';
export const SOUND_EVENT = 'apple-epi:sound';

let ctx: AudioContext | null = null;

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(SOUND_EVENT));
  if (on) playSound('chime');
}

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  const c = audio();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  gain.gain.setValueAtTime(0.0001, c.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, c.currentTime + start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration + 0.05);
}

export type SoundKind = 'tick' | 'pop' | 'chime';

export function playSound(kind: SoundKind) {
  if (kind === 'tick') {
    tone(1800, 0, 0.05, 0.05, 'triangle');
  } else if (kind === 'pop') {
    tone(520, 0, 0.09, 0.07);
    tone(780, 0.04, 0.09, 0.05);
  } else {
    tone(784, 0, 0.35, 0.08);
    tone(988, 0.09, 0.35, 0.07);
    tone(1319, 0.18, 0.5, 0.06);
  }
}

/** Plays only when the visitor has opted in. */
export function sound(kind: SoundKind) {
  if (isSoundOn()) playSound(kind);
}
