import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  'tray collected',
  'memory restored',
  'answered yes',
];

/**
 * One credential line. Tapping it copies the value — on a phone, retyping
 * "angelsunderthebed" into a login form is exactly the kind of friction that would
 * spoil the moment.
 */
function Credential({ label, value }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      sound.tap();
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* Clipboard blocked (insecure origin, old browser, permissions). The value is
       * plainly visible either way, so this is a convenience, not a dependency. */
    }
  }, [value]);

  return (
    <button className="cred" type="button" onClick={copy} title={`Copy ${label.toLowerCase()}`}>
      <span className="cred__label">{label}</span>
      <span className="cred__value">{value}</span>
      <span className="cred__copy" aria-hidden="true">
        {copied ? 'copied!' : 'tap to copy'}
      </span>
    </button>
  );
}

/**
 * THE REVEAL
 *
 * Everything before this was build-up. This screen gets confetti, the only pulsing
 * button in the app, and the message — in that order, because she should read it before
 * she taps through to log in.
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
        <p className="reveal__win">★ you win ★</p>

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
          There is an account waiting for you. It is yours.
        </p>

        <div className="creds">
          <div className="creds__title">Login</div>
          <Credential label="Username" value={secret.username} />
          <Credential label="Password" value={secret.password} />
        </div>

        <a
          className="btn btn--primary btn--lg btn--block reveal__cta"
          href={secret.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.tap()}
        >
          Log in and see →
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
              <span style={{ marginLeft: 'auto', color: 'var(--mint-deep)' }}>✓</span>
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
