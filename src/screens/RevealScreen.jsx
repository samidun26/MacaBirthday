import { useEffect, useMemo, useRef } from 'react';
import { burstConfetti } from '../lib/confetti.js';
import { resolveSecret } from '../lib/secret.js';
import { sound } from '../lib/audio.js';

/* Short deterministic hashes so the changelog looks like real commit history. */
function fakeHash(seed) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0').slice(0, 7);
}

const CHANGELOG = [
  'identity verified',
  'hidden branch found',
  'visual bug filed',
  'order confirmed',
  'memory restored',
  'authentication passed',
];

/**
 * THE REVEAL
 *
 * Everything before this was build-up. This screen gets confetti, the only pulsing
 * button in the app, and the message — in that order, because she should read it before
 * she taps through to Instagram.
 */
export function RevealScreen({ config, onRestart }) {
  const canvasRef = useRef(null);
  const secret = useMemo(() => resolveSecret(config), [config]);
  const paragraphs = config.finalMessage.split(/\n\s*\n/).filter(Boolean);

  useEffect(() => {
    const stop = burstConfetti(canvasRef.current);
    return stop;
  }, []);

  return (
    <>
      <canvas className="confetti-canvas" ref={canvasRef} aria-hidden="true" />

      <section className="screen reveal">
        <div className="reveal__badge">
          <span className="status-dot" aria-hidden="true" />
          Deployment complete
        </div>

        <p className="reveal__eyebrow">shipped to production</p>

        <h1 className="reveal__title">
          {config.buildCodename} v{config.age}.0
        </h1>

        <p className="reveal__status">
          STATUS: <b>PRODUCTION</b>
        </p>

        <div className="letter">
          <div className="letter__body">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {config.signature ? <div className="letter__signature">— {config.signature}</div> : null}
        </div>

        <p className="reveal__status" style={{ marginBottom: 'var(--space-4)' }}>
          Your birthday build has been deployed.
        </p>

        <div>
          <span className="handle">
            <span aria-hidden="true">◎</span>
            {secret.username}
          </span>
        </div>

        <a
          className="btn btn--primary btn--lg btn--block reveal__cta"
          href={secret.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.tap()}
        >
          Open the secret account →
        </a>

        {/* Only ever renders for the person who built this — she'll never see it. */}
        {secret.error ? <div className="dev-warning">⚠ Config notice: {secret.error}</div> : null}

        <div className="changelog">
          <div className="changelog__title">Build log</div>
          {CHANGELOG.map((entry, index) => (
            <div className="changelog__row" key={entry}>
              <span className="changelog__hash">{fakeHash(entry)}</span>
              <b>
                {String(index + 1).padStart(2, '0')} · {entry}
              </b>
              <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>✓</span>
            </div>
          ))}
          <div className="changelog__row" style={{ marginTop: 'var(--space-2)' }}>
            <span className="changelog__hash">{fakeHash(config.girlfriendName)}</span>
            <b>happy birthday, {config.girlfriendName}</b>
            <span style={{ marginLeft: 'auto' }} aria-hidden="true">
              ❤️
            </span>
          </div>
        </div>

        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <button className="btn btn--ghost" type="button" onClick={onRestart}>
            ↻ Run it again
          </button>
        </div>
      </section>
    </>
  );
}
