import { useMemo, useState } from 'react';
import { PuzzleFrame } from '../components/PuzzleFrame.jsx';
import { buildSpecimen } from '../lib/specimen.js';
import { sound } from '../lib/audio.js';

/**
 * PUZZLE 03 — DESIGN
 *
 * A type specimen sheet with a bug in it: a handful of glyphs sit three pixels off the
 * baseline and are set one weight heavier. Read in order, they spell the answer.
 *
 * The good part is the Guides toggle in the toolbar. It's not labelled as a hint and
 * nothing points at it — but reaching for guides when something looks off is pure muscle
 * memory for a designer. Flipping it draws the baseline under every cell and the broken
 * glyphs jump straight off the page.
 */
export function Puzzle03Design({ config, onSolve, onBack, onHintUsed, initiallySolved }) {
  const { word, prompt, hints } = config.puzzles.design;
  const [guides, setGuides] = useState(false);
  const cells = useMemo(() => buildSpecimen(word), [word]);

  return (
    <PuzzleFrame
      eyebrow="Puzzle 03 — Visual QA"
      title="Something in here is wrong."
      systemMessage={
        prompt ??
        "This specimen sheet shipped with a visual bug. Nobody on the dev team caught it. Find the word it's hiding."
      }
      answer={word}
      placeholder="our word"
      inputLabel="The hidden word"
      submitLabel="File bug"
      wrongMessages={[
        'Not the bug. Keep looking.',
        'Close, but the layout disagrees.',
        'Not that one. It is a word only the two of us use.',
      ]}
      hints={hints}
      successTitle="✓ Visual bug found"
      successNote="Okay... you found it. I guess I shouldn't have underestimated you."
      nextLabel="Load next module →"
      onNext={onSolve}
      onBack={onBack}
      onHintUsed={onHintUsed}
      initiallySolved={initiallySolved}
    >
      <div className={`specimen${guides ? ' specimen--guides' : ''}`}>
        <div className="specimen__toolbar">
          <span className="specimen__filename mono">birthday-grotesk.specimen</span>
          <button
            className="specimen__tool"
            type="button"
            data-active={guides}
            onClick={() => {
              setGuides((on) => !on);
              sound.tap();
            }}
            aria-pressed={guides}
          >
            <span aria-hidden="true">⌗</span> Guides
          </button>
          <span className="specimen__tool" aria-hidden="true">
            100%
          </span>
        </div>

        <div className="specimen__banner">
          <div className="specimen__display">Happy Birthday, {config.girlfriendName}</div>
          <div className="specimen__caption">Glyph set · regular 400 · 48 of 48</div>
        </div>

        <div className="specimen__grid" aria-hidden="true">
          {cells.map((cell, index) => (
            /* `data-v` rather than something like `data-misaligned`: she is entirely
               capable of opening DevTools, and a self-documenting attribute would hand
               her the answer before she'd looked at the sheet.
               Letters repeat across the sheet, so position is the only unique key. */
            // eslint-disable-next-line react/no-array-index-key
            <span className="specimen__cell" key={index} data-v={cell.off ? '1' : '0'}>
              {cell.char}
            </span>
          ))}
        </div>
      </div>

      {/* The grid is meaningless noise read aloud, so describe the task instead of
          transcribing it — and point at the hints, which carry the solution path. */}
      <p className="visually-hidden">
        This is a visual puzzle: a grid of letters in which a few break the baseline
        alignment. Read the misaligned letters in order to get the answer. The hint button
        below explains how to expose them.
      </p>
    </PuzzleFrame>
  );
}
