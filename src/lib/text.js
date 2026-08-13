/**
 * Text normalisation used for every answer check in the experience.
 *
 * The goal is that she never fails a puzzle because of a capital letter, a typo'd
 * space, an accent or a stray apostrophe. We compare the "shape" of the answer only.
 */

/** Lowercase, strip accents, drop everything that isn't a letter or digit. */
export function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** Uppercase A–Z0–9 form. Used to build the encryption key so it's stable. */
export function canonical(value) {
  return normalize(value).toUpperCase();
}

/** True when `input` matches the answer or any of the accepted alternates. */
export function matchesAnswer(input, answer, alsoAccept = []) {
  const attempt = normalize(input);
  if (!attempt) return false;
  return [answer, ...alsoAccept].some((candidate) => normalize(candidate) === attempt);
}

/** First A–Z letter of a string, uppercased. Skips emoji, quotes, spaces. */
export function firstLetter(value) {
  return canonical(value).charAt(0);
}

/** "01001000 01000101 01010010" for a given word. */
export function toBinary(word) {
  return String(word)
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}
