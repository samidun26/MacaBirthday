/**
 * Puzzle 02 generator.
 *
 * Builds a believable `git show` diff whose ADDED lines (the green `+` rows) spell out
 * the hidden branch name with their first letters.
 *
 * The whole diff is generated from the config word, so changing `puzzles.git.word` to
 * anything A–Z rewrites the commit automatically and the puzzle still works.
 */

/** Themed feature-list entries, indexed by their first letter. */
const WORD_BANK = {
  a: ['audacity', 'affection (undocumented)', 'appetite for dessert', 'ambition'],
  b: ['bad puns', 'butterflies (unhandled)', 'birthday cake', 'bravery'],
  c: ['chaos', 'caffeine', 'cuteness overload', 'confidence'],
  d: ['dessert privileges', 'daydreams', 'dumb jokes at 2am', 'design taste'],
  e: ['endless snacks', 'excellent taste', 'energy (variable)', 'excuses to see her'],
  f: ['forever (work in progress)', 'freckles', 'fried chicken cravings', 'favourite fonts'],
  g: ['good mornings', 'giggles', 'grand plans', 'grudges against slow wifi'],
  h: ['hugs', 'hot sauce tolerance', 'handwriting nobody can read', 'humming while coding'],
  i: ['inside jokes', 'impulse purchases', 'infinite patience', 'ideas at midnight'],
  j: ['joy', 'jokes only we understand', 'jealousy over the last bite'],
  k: ['kindness', 'kerning opinions', 'kitchen experiments'],
  l: ['laughter', 'late-night calls', 'long walks', 'loud opinions about spacing'],
  m: ['midnight snacks', 'matcha', 'mischief', 'making me laugh mid-sentence'],
  n: ['nap dependencies', 'nonsense conversations', 'new playlists'],
  o: ['overthinking', 'one more episode', 'opinions about padding'],
  p: ['playlists', 'plans we never follow', 'pixel-perfect everything'],
  q: ['questionable decisions', 'quiet mornings', 'quick snack runs'],
  r: ['random road trips', 'ridiculous nicknames', 'rest days'],
  s: ['stolen fries', 'sarcasm', 'stubbornness', 'soft launches'],
  t: ['takeout receipts', 'terrible sleep schedule', 'tiny victories'],
  u: ['unread messages', 'unhinged voice notes', 'undo history'],
  v: ['very specific cravings', 'voice notes', 'vetoing my playlist'],
  w: ['weekend plans', 'warm hands', 'weird dreams'],
  x: ['x-large portions', 'xoxo (deprecated)', 'x-ray vision for my snacks'],
  y: ['yapping', 'yes to dessert', 'yearly traditions'],
  z: ['zero chill', 'zoomies at midnight', 'zen mode'],
};

/** Untouched lines. Straight from the original commit — good red herrings. */
const CONTEXT_POOL = [
  'happiness',
  'food',
  'memories',
  'love',
  'chaos',
  'questionable decisions',
  'good taste',
  'a snack budget',
];

/**
 * @param {string} word the acrostic to hide, e.g. "maca"
 * @returns {{rows: Array<{gutter: string, kind: string, text: string, lineNo: number}>, added: string[]}}
 */
export function buildCommitDiff(word) {
  const letters = String(word).toLowerCase().replace(/[^a-z]/g, '').split('');

  /* Pick a themed entry per letter. Repeated letters get different entries so a word
   * like "maca" never shows the same line twice. */
  const seen = {};
  const added = letters.map((letter, index) => {
    const bank = WORD_BANK[letter];
    if (!bank) return letter; // impossible for a–z, but never render undefined
    const occurrence = seen[letter] ?? 0;
    seen[letter] = occurrence + 1;
    return bank[(occurrence * 3 + index) % bank.length];
  });

  /* Context lines that don't collide with anything we just added. */
  const context = CONTEXT_POOL.filter((line) => !added.includes(line)).slice(
    0,
    Math.max(4, letters.length + 2),
  );

  /* Interleave: context, added, context, added, ... so the acrostic is spread through
   * the diff rather than sitting in one obvious block at the bottom. */
  const rows = [];
  let addedIndex = 0;
  let contextIndex = 0;
  let lineNo = 20;

  while (addedIndex < added.length || contextIndex < context.length) {
    if (contextIndex < context.length) {
      lineNo += 1;
      rows.push({ gutter: ' ', kind: 'context', text: context[contextIndex], lineNo });
      contextIndex += 1;
    }
    if (addedIndex < added.length) {
      lineNo += 1;
      rows.push({ gutter: '+', kind: 'added', text: added[addedIndex], lineNo });
      addedIndex += 1;
    }
  }

  return { rows, added };
}
