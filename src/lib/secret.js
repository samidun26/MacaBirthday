/**
 * The secret account, locked behind her own answers.
 *
 * The Instagram handle is encrypted with a key derived from the solutions to all six
 * puzzles. Nothing can decrypt it until the puzzles are actually solved — so the reveal
 * is genuinely *earned*, not just hidden behind a CSS class.
 *
 * This is a birthday present, not a vault: the cipher is a seeded XOR stream, which is
 * trivially breakable by someone determined. That's the right trade-off. It defeats
 * "View Source", which is the only attacker that matters here.
 *
 * This module is imported by BOTH the browser app and `npm run lock`, so it must stay
 * dependency-free and run unchanged in Node and the browser.
 */

import { canonical, firstLetter } from './text.js';

const MAGIC = 'HERv21::';

/* ---------------------------------------------------------------- hashing / keystream */

function fnv1a(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** xorshift32, seeded from the key. Deterministic across Node and browsers. */
function createKeystream(seed) {
  let state = seed >>> 0 || 0x9e3779b9;
  return () => {
    state ^= (state << 13) >>> 0;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= (state << 5) >>> 0;
    state >>>= 0;
    return state & 0xff;
  };
}

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/* ------------------------------------------------------------------------ the key */

/**
 * The order code produced by the food puzzle — the first letters of the correct dishes.
 * With the default menu this spells CAKE.
 */
export function foodOrderCode(food) {
  return food.courses
    .map((course) => firstLetter(course.options[course.correct].name))
    .join('');
}

/**
 * Builds the decryption key out of the six canonical puzzle answers.
 *
 * Anything that changes an answer changes the key — which is why `npm run lock` has to
 * be re-run after you edit the config. The app detects a stale payload and tells you.
 */
export function deriveKey(config) {
  const { binary, git, design, food, memory, finalAuth } = config.puzzles;
  return [
    canonical(binary.word),
    canonical(git.word),
    canonical(design.word),
    canonical(foodOrderCode(food)),
    canonical(memory.answer),
    canonical(finalAuth.answer),
  ].join('|');
}

/* ------------------------------------------------------------------ encrypt / decrypt */

export function encryptSecret(payload, key) {
  const plaintext = MAGIC + JSON.stringify(payload);
  const bytes = new TextEncoder().encode(plaintext);
  const next = createKeystream(fnv1a(key));
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) out[i] = bytes[i] ^ next();
  return bytesToBase64(out);
}

export function decryptSecret(encoded, key) {
  try {
    const bytes = base64ToBytes(encoded);
    const next = createKeystream(fnv1a(key));
    const out = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 1) out[i] = bytes[i] ^ next();
    const text = new TextDecoder().decode(out);
    if (!text.startsWith(MAGIC)) return null; // wrong key
    return JSON.parse(text.slice(MAGIC.length));
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------------- resolution */

/**
 * Returns the account to reveal.
 *
 * - No `secretPayload` in the config → plain-text mode, straight from the config.
 * - `secretPayload` present → decrypt it with the key derived from her answers.
 *
 * `error` is only ever populated when a locked payload can't be opened, which means the
 * config drifted after locking. The UI surfaces that to *you*, not to her.
 */
export function resolveSecret(config) {
  if (!config.secretPayload) {
    return {
      username: config.secretInstagramUsername,
      url: config.secretInstagramUrl,
      locked: false,
      error: null,
    };
  }

  const opened = decryptSecret(config.secretPayload, deriveKey(config));
  if (!opened) {
    return {
      username: config.secretInstagramUsername,
      url: config.secretInstagramUrl,
      locked: true,
      error:
        'The encrypted payload does not match the current puzzle answers. ' +
        'Re-run `npm run lock` after editing birthday.config.js.',
    };
  }

  return { username: opened.username, url: opened.url, locked: true, error: null };
}
