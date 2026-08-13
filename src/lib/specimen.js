/**
 * Puzzle 03 generator.
 *
 * Produces a glyph grid for a fake type specimen sheet. Most letters sit perfectly on
 * the baseline; a handful are nudged up a few pixels and set a touch heavier. Those
 * letters, read in order, spell the answer.
 *
 * Cells are laid out with CSS grid, so DOM order *is* reading order at every breakpoint —
 * the hidden word reads correctly whether the grid is 4 columns wide on an iPhone or 10
 * on a desktop.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Tiny deterministic PRNG so the sheet looks identical on every visit. */
function seededRandom(seed) {
  let state = seed >>> 0 || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function seedFrom(text) {
  let seed = 7;
  for (let i = 0; i < text.length; i += 1) seed = (Math.imul(seed, 31) + text.charCodeAt(i)) >>> 0;
  return seed;
}

/**
 * @param {string} word the word to hide
 * @param {number} cellCount roughly how many glyphs to render
 * @returns {Array<{char: string, off: boolean}>}
 */
export function buildSpecimen(word, cellCount = 48) {
  const letters = String(word).toUpperCase().replace(/[^A-Z]/g, '').split('');
  if (letters.length === 0) return [];

  const total = Math.max(cellCount, letters.length * 4);
  const random = seededRandom(seedFrom(word));

  /* Spread the hidden letters evenly across the sheet with a little deterministic
   * jitter, so they never land in a suspiciously regular pattern. */
  const stride = Math.floor(total / letters.length);
  const positions = letters.map((_, index) => {
    const jitter = Math.floor(random() * Math.max(1, stride - 1));
    return Math.min(total - 1, index * stride + jitter);
  });

  const hidden = new Map();
  positions.forEach((position, index) => hidden.set(position, letters[index]));

  const cells = [];
  for (let i = 0; i < total; i += 1) {
    if (hidden.has(i)) {
      cells.push({ char: hidden.get(i), off: true });
    } else {
      cells.push({ char: ALPHABET[Math.floor(random() * ALPHABET.length)], off: false });
    }
  }
  return cells;
}
