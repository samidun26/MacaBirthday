import { sound } from '../lib/audio.js';

/**
 * The persistent window: title bar, progress rail, body, status bar.
 *
 * Screens swap inside `children` while this frame stays put, which is what sells the
 * illusion that she's using one piece of software rather than clicking through slides.
 */
export function Shell({
  fileName,
  version,
  totalSteps,
  currentStep, // 1-based; 0 means "not in the puzzle flow yet"
  solvedCount,
  hintsUsed,
  branchLabel,
  soundOn,
  onToggleSound,
  versionGlow,
  onVersionClick,
  onEggClick,
  children,
}) {
  return (
    <div className="app">
      <div className="shell">
        <header className="shell__header">
          <div className="titlebar">
            <div className="titlebar__dots" aria-hidden="true">
              <span className="titlebar__dot" />
              <span className="titlebar__dot" />
              <span className="titlebar__dot" />
            </div>

            <div className="titlebar__file">
              <span style={{ opacity: 0.55 }}>~/birthday/</span>
              <strong>{fileName}</strong>
            </div>

            <div className="titlebar__actions">
              <button
                className={`version-badge${versionGlow ? ' version-badge--near' : ''}`}
                type="button"
                onClick={onVersionClick}
                title="v"
              >
                v{version}
              </button>
              <button
                className="icon-btn"
                type="button"
                data-active={soundOn}
                onClick={() => {
                  onToggleSound();
                  sound.tap();
                }}
                aria-pressed={soundOn}
              >
                ♫ {soundOn ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {currentStep > 0 ? (
            <div className="rail">
              <div
                className="rail__steps"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-valuenow={currentStep}
                aria-label="Birthday build progress"
              >
                {Array.from({ length: totalSteps }, (_, index) => {
                  const position = index + 1;
                  const state =
                    position < currentStep ? 'done' : position === currentStep ? 'active' : 'todo';
                  return <span className="rail__step" key={position} data-state={state} />;
                })}
              </div>
              <div className="rail__label">
                STAGE <b>{String(Math.min(currentStep, totalSteps)).padStart(2, '0')}</b>/
                {String(totalSteps).padStart(2, '0')}
              </div>
            </div>
          ) : null}
        </header>

        <main className="shell__body">{children}</main>

        <footer className="statusbar">
          <span className="statusbar__item statusbar__item--branch" title="current branch">
            <span aria-hidden="true">⑂</span>
            {branchLabel}
          </span>
          <span className="statusbar__item">
            <span aria-hidden="true" style={{ color: 'var(--mint-deep)' }}>
              ✓
            </span>
            {solvedCount} solved
          </span>
          {hintsUsed > 0 ? (
            <span className="statusbar__item statusbar__item--hints">
              <span aria-hidden="true" style={{ color: 'var(--lavender-deep)' }}>
                ◆
              </span>
              {hintsUsed} {hintsUsed === 1 ? 'hint' : 'hints'}
            </span>
          ) : null}
          <span className="statusbar__spacer" />
          {/* Looks like a code comment. Is actually a door. */}
          <button
            className="statusbar__egg"
            type="button"
            onClick={onEggClick}
            aria-label="Open developer notes"
          >
            //
          </button>
        </footer>
      </div>
    </div>
  );
}
