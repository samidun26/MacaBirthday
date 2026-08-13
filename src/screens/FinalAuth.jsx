import { useEffect, useState } from 'react';
import { PuzzleFrame } from '../components/PuzzleFrame.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { sound } from '../lib/audio.js';

const TOTAL_BLOCKS = 20;

/**
 * FINAL AUTHENTICATION
 *
 * The last gate. Deliberately the easiest question in the whole experience — by this
 * point she's earned it, and the answer is the punchline rather than the obstacle.
 *
 * Solving it doesn't show a success banner like the other puzzles. It hands off to a
 * full authentication sequence instead, because the finale should feel different from
 * the five beats that preceded it.
 */
export function FinalAuth({ config, onComplete, onHintUsed }) {
  const [phase, setPhase] = useState('question');

  if (phase === 'question') {
    return (
      <PuzzleFrame
        eyebrow="Final authentication"
        title="One last question."
        systemLabel="System"
        systemMessage="You've made it this far. Five out of five. There's one thing left to tell me before I hand this over."
        answer={config.puzzles.finalAuth.answer}
        alsoAccept={config.puzzles.finalAuth.alsoAccept}
        placeholder="deployment target"
        inputLabel="Deployment target"
        submitLabel="Authenticate"
        wrongMessages={[
          'Authentication failed. Where would you actually look for it?',
          'Not that one. Somewhere you already open every day.',
          'Denied. Think less "hosting provider", more "app on your phone".',
        ]}
        hints={config.puzzles.finalAuth.hints}
        onSolved={() => setPhase('authenticating')}
        onHintUsed={onHintUsed}
        autoFocus
      >
        <div className="auth-level">
          <span className="auth-level__label">Access level</span>
          <span className="auth-level__value">BIRTHDAY_ADMIN</span>
        </div>

        <p className="card__lede" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
          {config.puzzles.finalAuth.question}
        </p>
      </PuzzleFrame>
    );
  }

  return <AuthSequence onComplete={onComplete} />;
}

/** AUTHENTICATING… → 100% → ACCESS GRANTED. */
function AuthSequence({ onComplete }) {
  const reduceMotion = useReducedMotion();
  const [percent, setPercent] = useState(0);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setPercent(100);
      setGranted(true);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setPercent((current) => {
        if (current >= 100) return 100;
        /* Slightly uneven steps read as "real work happening" rather than a linear
         * fake. It still always finishes in about two seconds. */
        return Math.min(100, current + 2 + Math.round(Math.random() * 4));
      });
    }, 55);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  useEffect(() => {
    if (percent < 100 || granted) return undefined;
    const timer = window.setTimeout(() => {
      setGranted(true);
      sound.unlock();
    }, 260);
    return () => window.clearTimeout(timer);
  }, [percent, granted]);

  useEffect(() => {
    if (!granted) return undefined;
    const timer = window.setTimeout(onComplete, reduceMotion ? 400 : 2100);
    return () => window.clearTimeout(timer);
  }, [granted, onComplete, reduceMotion]);

  const filled = Math.round((percent / 100) * TOTAL_BLOCKS);

  return (
    <section className="screen card" aria-live="polite">
      <div className="card__eyebrow">Authenticating</div>

      <div className="terminal">
        <div className="term-line">
          <span className="term-line__prefix" aria-hidden="true">
            ›
          </span>
          <span className="term-line__text">AUTHENTICATING...</span>
        </div>

        <div style={{ margin: 'var(--space-3) 0' }}>
          <div className="authbar">
            <div className="authbar__fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="authbar__blocks">
            {'█'.repeat(filled)}
            <span style={{ opacity: 0.18 }}>{'█'.repeat(TOTAL_BLOCKS - filled)}</span>{' '}
            <span style={{ color: 'var(--text-dim)' }}>{percent}%</span>
          </div>
        </div>

        {granted ? (
          <div className="auth-granted">
            <div className="auth-granted__title">ACCESS GRANTED.</div>
            <div className="auth-granted__sub">BIRTHDAY BUILD FOUND.</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
