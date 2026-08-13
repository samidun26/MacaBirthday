import { useState } from 'react';
import { sound } from '../lib/audio.js';

/**
 * The safety net.
 *
 * Hints reveal one at a time — the first is a nudge, the last is close to a giveaway.
 * Nobody should ever be stuck on a birthday present, but she also shouldn't be handed
 * the answer on the first tap.
 */
export function HintPanel({ hints, onHintUsed }) {
  const [revealed, setRevealed] = useState(0);

  if (!hints || hints.length === 0) return null;

  const showNext = () => {
    setRevealed((count) => Math.min(count + 1, hints.length));
    sound.tap();
    onHintUsed?.();
  };

  const exhausted = revealed >= hints.length;

  return (
    <div className="hint">
      {!exhausted ? (
        <button className="hint__toggle" type="button" onClick={showNext}>
          <span aria-hidden="true">◆</span>
          {revealed === 0 ? 'Need a hint?' : 'Another hint?'}
        </button>
      ) : null}

      {hints.slice(0, revealed).map((hint, index) => (
        <p className="hint__body" key={hint}>
          <span className="hint__icon" aria-hidden="true">
            ◆
          </span>
          <span>
            <strong className="mono" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              HINT {index + 1}
              {' · '}
            </strong>
            {hint}
          </span>
        </p>
      ))}
    </div>
  );
}
