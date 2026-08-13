/**
 * The background music: an original chiptune love song.
 *
 * A NOTE ON WHY IT'S ORIGINAL. The ask was for a current romantic hit, pixelated. A
 * chiptune cover still reproduces the melody, and the melody is the copyrighted part —
 * changing the instrument doesn't change that. So this is written from scratch in the
 * same register: slow, warm, major key, the kind of thing an end-credits screen would
 * play. The chord movement underneath (I–V–vi–IV) is a common progression, which is not
 * protectable; the tune on top is mine.
 *
 * Synthesised live through the same AudioContext as the sound effects — no audio files,
 * nothing to download, and it loops seamlessly for as long as she's reading.
 *
 * It never starts on its own. It plays only while the header's sound toggle is on.
 */

import { getAudioContext } from './audio.js';

const BPM = 84;
const STEP = 60 / BPM / 2; // one eighth note
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.12;

const SEMITONES = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

/** "A4" → 440. */
function freq(name) {
  const match = /^([A-G]#?)(-?\d)$/.exec(name);
  if (!match) return 0;
  const midi = SEMITONES[match[1]] + (Number(match[2]) + 1) * 12;
  return 440 * 2 ** ((midi - 69) / 12);
}

/* Eight bars, eight eighth-notes each. `null` holds the previous note's space. */
const LEAD = [
  ['E4', null, 'G4', null, 'C5', null, null, 'B4'],
  ['A4', null, 'G4', null, 'D4', null, 'G4', null],
  ['C5', null, 'B4', null, 'A4', null, null, 'G4'],
  ['F4', null, 'A4', null, 'C5', null, null, null],
  ['E5', null, 'D5', null, 'C5', null, 'G4', null],
  ['D5', null, 'B4', null, 'G4', null, null, 'A4'],
  ['C5', null, 'E5', null, 'D5', null, 'C5', null],
  ['A4', null, 'G4', null, 'F4', null, null, null],
];

/* One chord per bar: C – G – Am – F, twice. */
const BASS = ['C2', 'G2', 'A2', 'F2', 'C2', 'G2', 'A2', 'F2'];
const ARP = [
  ['C4', 'E4', 'G4', 'E4'],
  ['B3', 'D4', 'G4', 'D4'],
  ['A3', 'C4', 'E4', 'C4'],
  ['A3', 'C4', 'F4', 'C4'],
  ['C4', 'E4', 'G4', 'E4'],
  ['B3', 'D4', 'G4', 'D4'],
  ['A3', 'C4', 'E4', 'C4'],
  ['A3', 'C4', 'F4', 'C4'],
];

const TOTAL_STEPS = LEAD.length * 8;

let master = null;
let timer = null;
let step = 0;
let nextTime = 0;
let running = false;

function voice(ctx, frequency, at, duration, { type = 'square', gain = 0.05, detune = 0 } = {}) {
  if (!frequency) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, at);
  osc.detune.setValueAtTime(detune, at);

  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(gain, at + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  osc.connect(env).connect(master);
  osc.start(at);
  osc.stop(at + duration + 0.03);
}

function scheduleStep(ctx, index, at) {
  const bar = Math.floor(index / 8) % LEAD.length;
  const beat = index % 8;

  const lead = LEAD[bar][beat];
  if (lead) {
    /* Two slightly detuned squares — the classic chip "wide lead". */
    voice(ctx, freq(lead), at, 0.42, { gain: 0.045, detune: -6 });
    voice(ctx, freq(lead), at, 0.42, { gain: 0.03, detune: +7 });
  }

  if (beat === 0 || beat === 4) {
    voice(ctx, freq(BASS[bar]), at, 0.34, { type: 'triangle', gain: 0.075 });
  }

  if (beat % 2 === 1) {
    const notes = ARP[bar];
    voice(ctx, freq(notes[((beat - 1) / 2) % notes.length]), at, 0.16, {
      type: 'square',
      gain: 0.016,
    });
  }
}

function tick() {
  const ctx = getAudioContext();
  if (!ctx || !running) return;

  while (nextTime < ctx.currentTime + SCHEDULE_AHEAD) {
    scheduleStep(ctx, step, nextTime);
    step = (step + 1) % TOTAL_STEPS;
    nextTime += STEP;
  }
}

export function startMusic() {
  const ctx = getAudioContext();
  if (!ctx || running) return;

  if (!master) {
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }

  running = true;
  step = 0;
  nextTime = ctx.currentTime + 0.08;

  /* Fade in rather than snapping on — a square wave arriving at full level is a jolt. */
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.2);

  tick();
  timer = window.setInterval(tick, LOOKAHEAD_MS);
}

export function stopMusic() {
  running = false;
  window.clearInterval(timer);
  timer = null;

  const ctx = getAudioContext();
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
  }
}

export function isMusicPlaying() {
  return running;
}
