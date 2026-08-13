import { sound } from '../lib/audio.js';

/**
 * The title card. First moment she sees the thing has a name and a version number.
 *
 * If she's been here before and got partway, we offer to pick up where she left off
 * rather than making her re-solve puzzles she already beat.
 */
export function TitleScreen({ config, onStart, onResume, resumeStep }) {
  const canResume = Boolean(onResume) && resumeStep > 0;

  return (
    <section className="screen hero">
      <p className="hero__eyebrow">player 1 detected</p>

      <h1 className="hero__title">
        {config.buildCodename} v{config.age}.0
      </h1>

      <p className="hero__subtitle">A Birthday Build</p>

      <div className="hero__status">
        <span className="status-dot" aria-hidden="true" />
        <span className="hero__status-label">Build status:</span>
        <b>Ready to deploy</b>
      </div>

      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <button
          className="btn btn--primary btn--lg"
          type="button"
          onClick={() => {
            sound.tap();
            onStart();
          }}
        >
          &#9654; Start build
        </button>
      </div>

      {canResume ? (
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: 'var(--space-3)' }}>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => {
              sound.tap();
              onResume();
            }}
          >
            Resume from step {String(resumeStep).padStart(2, '0')} →
          </button>
        </div>
      ) : null}

      <p className="hero__blink">— press start —</p>

      {/* Music can't autoplay (browsers block it, and it would be rude anyway), so the
          title screen points at the toggle. Otherwise she'd never know it was there. */}
      <p className="hero__sound">♫ turn the sound on — I wrote you a song</p>

      <p className="hero__meta">
        {config.age} modules · 6 stages · 1 player
      </p>
    </section>
  );
}
