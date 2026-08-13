import { useEffect, useRef } from 'react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * ↑ ↑ ↓ ↓ ← → ← → B A
 *
 * Tracks a rolling window rather than resetting on the first wrong key, so a fumbled
 * attempt that recovers still counts.
 */
export function useKonami(onUnlock) {
  const buffer = useRef([]);
  const callback = useRef(onUnlock);
  callback.current = onUnlock;

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      buffer.current = [...buffer.current, key].slice(-SEQUENCE.length);
      if (SEQUENCE.every((expected, index) => buffer.current[index] === expected)) {
        buffer.current = [];
        callback.current?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
