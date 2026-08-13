/**
 * Optional sound.
 *
 * Rules, deliberately strict:
 *   1. Nothing ever plays until she turns it on. No autoplay, ever.
 *   2. The AudioContext isn't even created until she taps the toggle, which keeps iOS
 *      Safari happy (it only allows audio contexts to start from a user gesture).
 *   3. Every tone is synthesised — no audio files, nothing to download, nothing to 404.
 *
 * The experience is designed to be complete in silence. This is seasoning.
 */

let context = null;
let enabled = false;

function ensureContext() {
  if (context) return context;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  return context;
}

export function setSoundEnabled(next) {
  enabled = Boolean(next);
  if (enabled) {
    const ctx = ensureContext();
    /* Safari suspends new contexts until a gesture resumes them. */
    if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
  }
  return enabled;
}

export function isSoundEnabled() {
  return enabled;
}

/** One soft sine blip. Everything else is built from these. */
function tone(frequency, { at = 0, duration = 0.12, gain = 0.05, type = 'sine' } = {}) {
  const ctx = ensureContext();
  if (!ctx) return;

  const start = ctx.currentTime + at;
  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);

  /* Short attack, exponential release — avoids the click you get from hard cutoffs. */
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(envelope).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function play(builder) {
  if (!enabled) return;
  try {
    builder();
  } catch {
    /* Audio is never allowed to break the experience. */
  }
}

export const sound = {
  /** Typewriter / keystroke tick. */
  tick: () => play(() => tone(880 + Math.random() * 120, { duration: 0.035, gain: 0.014, type: 'square' })),
  /** Button press. */
  tap: () => play(() => tone(520, { duration: 0.07, gain: 0.03, type: 'triangle' })),
  /** Correct answer. */
  success: () =>
    play(() => {
      tone(659.25, { duration: 0.14, gain: 0.05 });
      tone(987.77, { at: 0.1, duration: 0.22, gain: 0.045 });
    }),
  /** Wrong answer — a gentle "nope", never harsh. */
  error: () =>
    play(() => {
      tone(196, { duration: 0.16, gain: 0.04, type: 'triangle' });
      tone(164.81, { at: 0.09, duration: 0.2, gain: 0.035, type: 'triangle' });
    }),
  /** The final unlock. A little arpeggio worth waiting six puzzles for. */
  unlock: () =>
    play(() => {
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((frequency, index) => {
        tone(frequency, { at: index * 0.09, duration: 0.5, gain: 0.05 });
      });
    }),
};
