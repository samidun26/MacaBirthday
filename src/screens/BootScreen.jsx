import { useCallback, useEffect, useRef, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/**
 * The boot sequence.
 *
 * Every line types itself out, reports OK with a plausible timing, and hands off to the
 * next. Tapping anywhere skips straight to the end — she may be opening this for the
 * third time, and a gift shouldn't make you sit through the intro.
 */

/* Stable pseudo-timings: same numbers on every visit, which reads as "real system"
 * rather than "random each refresh". */
function timingFor(index) {
  return 8 + ((index * 37) % 55);
}

function BootLine({ text, timing, onDone, isLast }) {
  const { shown, done } = useTypewriter(text, { speed: 16, tick: true });
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!done) return undefined;
    const timer = window.setTimeout(() => doneRef.current?.(), 110);
    return () => window.clearTimeout(timer);
  }, [done]);

  return (
    <div className="term-line">
      <span className="term-line__prefix" aria-hidden="true">
        ›
      </span>
      <span className="term-line__text">
        {shown}
        {!done && isLast ? <span className="cursor" /> : null}
      </span>
      {done ? (
        <span className="term-line__status">
          {timing}ms OK
        </span>
      ) : null}
    </div>
  );
}

export function BootScreen({ config, onComplete }) {
  const reduceMotion = useReducedMotion();
  const lines = config.bootLines;
  const [visible, setVisible] = useState(1);
  const [finished, setFinished] = useState(false);
  const cursorRef = useRef(1);

  const advance = useCallback(() => {
    if (cursorRef.current >= lines.length) {
      setFinished(true);
      return;
    }
    cursorRef.current += 1;
    setVisible(cursorRef.current);
  }, [lines.length]);

  const skip = useCallback(() => {
    cursorRef.current = lines.length;
    setVisible(lines.length);
    setFinished(true);
  }, [lines.length]);

  /* Reduced motion: no theatre, straight to the point. */
  useEffect(() => {
    if (reduceMotion) skip();
  }, [reduceMotion, skip]);

  /* Hold on SYSTEM READY for a beat so it lands, then move to the title card. */
  useEffect(() => {
    if (!finished) return undefined;
    const timer = window.setTimeout(onComplete, reduceMotion ? 200 : 900);
    return () => window.clearTimeout(timer);
  }, [finished, onComplete, reduceMotion]);

  const headline = useTypewriter('INITIALIZING BIRTHDAY BUILD...', {
    speed: 34,
    enabled: !reduceMotion,
  });

  return (
    <section
      className="screen boot"
      onClick={skip}
      role="presentation"
      aria-label="System boot sequence"
    >
      <div className="boot__brand">
        birthday systems bios · v{config.age}.0 · 64k ram ok
      </div>

      <h1 className="boot__headline">
        {headline.shown}
        {!headline.done ? <span className="cursor" /> : null}
      </h1>

      {headline.done ? (
        <div className="terminal">
          {lines.slice(0, visible).map((line, index) => (
            <BootLine
              key={line}
              text={line}
              timing={timingFor(index)}
              isLast={index === visible - 1}
              onDone={index === visible - 1 ? advance : undefined}
            />
          ))}

          {finished ? (
            <div className="term-line" style={{ marginTop: 'var(--space-3)' }}>
              <span className="term-line__prefix" aria-hidden="true">
                ✓
              </span>
              <span className="term-line__text" style={{ textShadow: '0 0 12px var(--green)' }}>
                SYSTEM READY
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The whole panel is tappable for convenience; this is the keyboard-reachable
          equivalent so skipping isn't mouse-only. */}
      {!finished && headline.done ? (
        <button className="boot__hint" type="button" onClick={skip}>
          tap anywhere to skip
        </button>
      ) : null}
    </section>
  );
}
