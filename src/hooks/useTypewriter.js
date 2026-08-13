import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion.js';
import { sound } from '../lib/audio.js';

/**
 * Types a string out one character at a time.
 *
 * Returns a `skip` function — impatience is a valid way to read a birthday card, and
 * every typewriter in this app is tap-to-skip. Reduced-motion users get the full text
 * immediately.
 */
export function useTypewriter(text, { speed = 24, delay = 0, enabled = true, tick = false } = {}) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
  }, []);

  useEffect(() => {
    stop();

    if (!enabled || reduceMotion || !text) {
      setCount(text ? text.length : 0);
      return undefined;
    }

    setCount(0);
    let position = 0;

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        position += 1;
        setCount(position);
        /* Only click on every third character — one per glyph is a machine gun. */
        if (tick && position % 3 === 0) sound.tick();
        if (position >= text.length) stop();
      }, speed);
    }, delay);

    return stop;
  }, [text, speed, delay, enabled, reduceMotion, tick, stop]);

  const skip = useCallback(() => {
    stop();
    setCount(text ? text.length : 0);
  }, [stop, text]);

  return {
    shown: text ? text.slice(0, count) : '',
    done: !text || count >= text.length,
    skip,
  };
}
