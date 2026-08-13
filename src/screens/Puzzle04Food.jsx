import { useState } from 'react';
import { PuzzleFrame } from '../components/PuzzleFrame.jsx';
import { sound } from '../lib/audio.js';

/**
 * PUZZLE 04 — THE CANTEEN TRAY
 *
 * The one screen that isn't a test.
 *
 * She takes whatever she wants, as much as she wants, and every combination is accepted.
 * It exists so that halfway through a set of puzzles she runs into a list of her own
 * favourite food and just gets to enjoy it for a minute.
 *
 * The only rule is `minPicks` — the tray can't leave empty.
 */
export function Puzzle04Food({ config, onSolve, onBack, onHintUsed, initiallySolved }) {
  const food = config.puzzles.food;
  const { courses } = food;
  const minPicks = food.minPicks ?? 1;

  /* Selection is a Set of "courseIndex:optionIndex" keys — multi-select within a course
   * and across courses, no radio-button behaviour anywhere. */
  const [picked, setPicked] = useState(() => new Set());

  const toggle = (key) => {
    sound.tap();
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const chosen = [...picked]
    .map((key) => {
      const [c, o] = key.split(':').map(Number);
      return { course: courses[c].course, ...courses[c].options[o] };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const enough = chosen.length >= minPicks;

  return (
    <PuzzleFrame
      eyebrow="Puzzle 04 — Appetite"
      title="Build your tray."
      systemMessage={`Everything at ${food.restaurantName} is yours today. Take whatever you want — as much as you want. There is no wrong answer on this screen.`}
      hints={food.hints}
      successTitle="Tray accepted"
      successNote="Good choices. Obviously."
      nextLabel="Query memories →"
      onNext={onSolve}
      onBack={onBack}
      onHintUsed={onHintUsed}
      initiallySolved={initiallySolved}
    >
      {({ solved, markSolved }) => (
        <>
          <div className="menu">
            <div className="menu__head">
              <div className="menu__title">{food.restaurantName}</div>
              <div className="menu__tagline">{food.tagline}</div>
            </div>

            <div className="menu__body">
              {courses.map((course, courseIndex) => (
                <div
                  className="menu__course"
                  key={course.course}
                  role="group"
                  aria-label={course.course}
                >
                  <div className="menu__course-label">{course.course}</div>

                  <div className="menu__options">
                    {course.options.map((option, optionIndex) => {
                      const key = `${courseIndex}:${optionIndex}`;
                      const selected = picked.has(key);
                      return (
                        <button
                          className="menu__item"
                          type="button"
                          key={option.name}
                          data-selected={selected}
                          aria-pressed={selected}
                          disabled={solved}
                          onClick={() => toggle(key)}
                        >
                          <span className="menu__emoji" aria-hidden="true">
                            {option.emoji}
                          </span>
                          <span className="menu__text">
                            <span className="menu__name">{option.name}</span>
                            {option.note ? (
                              <span className="menu__note">{option.note}</span>
                            ) : null}
                          </span>
                          <span className="menu__tick" aria-hidden="true">
                            ✓
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!solved ? (
            <div className="btn-row">
              <button
                className="btn btn--primary btn--block"
                type="button"
                disabled={!enough}
                onClick={markSolved}
              >
                {enough
                  ? `Take the tray (${chosen.length})`
                  : `Pick at least ${minPicks} thing${minPicks === 1 ? '' : 's'}`}
              </button>
            </div>
          ) : null}

          {/* Picks aren't persisted across navigation, so coming BACK to a tray she
              already collected would otherwise print a receipt with no items on it. */}
          {solved && chosen.length > 0 ? (
            <div className="receipt">
              <div className="receipt__row">
                <span>{food.restaurantName}</span>
                <span>TABLE {config.age}</span>
              </div>
              <div className="receipt__rule" />
              {chosen.map((dish) => (
                <div className="receipt__row" key={dish.name}>
                  <span>
                    {dish.emoji} {dish.name}
                  </span>
                  <span>{dish.course.toLowerCase()}</span>
                </div>
              ))}
              <div className="receipt__rule" />
              <div className="receipt__row">
                <span>total</span>
                <span>
                  <b>on me, always</b>
                </span>
              </div>
            </div>
          ) : null}
        </>
      )}
    </PuzzleFrame>
  );
}
