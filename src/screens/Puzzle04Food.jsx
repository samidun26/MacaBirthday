import { useState } from 'react';
import { PuzzleFrame } from '../components/PuzzleFrame.jsx';
import { foodOrderCode } from '../lib/secret.js';
import { sound } from '../lib/audio.js';

/**
 * PUZZLE 04 — FOOD
 *
 * A birthday menu she has to order from correctly. No text input, no arithmetic — just
 * "prove you know what she'd order", which is a far more personal question than any sum.
 *
 * There are two honest routes to the answer, and both feel good:
 *   1. She knows her own taste (or knows what I'd say her taste is).
 *   2. She notices the first letters of the right dishes spell a word.
 *
 * The second route means it's never guesswork, and it's self-verifying — when the letters
 * spell CAKE she knows she's right before she even submits.
 */
export function Puzzle04Food({ config, onSolve, onBack, onHintUsed, initiallySolved }) {
  const food = config.puzzles.food;
  const { courses } = food;

  /* Coming back to a solved puzzle? Show the order she got right. */
  const [picks, setPicks] = useState(() =>
    initiallySolved ? courses.map((course) => course.correct) : courses.map(() => null),
  );

  const complete = picks.every((pick) => pick !== null);
  const orderCode = foodOrderCode(food);

  const chosenDishes = picks.map((pick, index) =>
    pick === null ? null : courses[index].options[pick],
  );

  return (
    <PuzzleFrame
      eyebrow="Puzzle 04 — Appetite"
      title="Order for her."
      systemMessage={`The kitchen at ${food.restaurantName} already knows her order. Prove that you do too — one dish per course.`}
      wrongMessages={[
        'Chef says no. That\'s not what she\'d order.',
        'Order rejected. She would be politely disappointed.',
        'Not her order. Think about what she actually reaches for.',
      ]}
      hints={food.hints}
      successTitle="Order confirmed"
      successNote="That's exactly what she'd get. Every time."
      nextLabel="Query memories →"
      onNext={onSolve}
      onBack={onBack}
      onHintUsed={onHintUsed}
      initiallySolved={initiallySolved}
    >
      {({ solved, markSolved, markWrong }) => (
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
                      const selected = picks[courseIndex] === optionIndex;
                      return (
                        <button
                          className="menu__item"
                          type="button"
                          key={option.name}
                          data-selected={selected}
                          aria-pressed={selected}
                          disabled={solved}
                          onClick={() => {
                            sound.tap();
                            setPicks((current) => {
                              const next = [...current];
                              next[courseIndex] = optionIndex;
                              return next;
                            });
                          }}
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
                disabled={!complete}
                onClick={() => {
                  const correct = picks.every(
                    (pick, index) => pick === courses[index].correct,
                  );
                  if (correct) markSolved();
                  else markWrong();
                }}
              >
                {complete ? 'Place order' : `Pick one per course (${picks.filter((p) => p !== null).length}/${courses.length})`}
              </button>
            </div>
          ) : null}

          {solved ? (
            <div className="receipt">
              <div className="receipt__row">
                <span>{food.restaurantName}</span>
                <span>TABLE {config.age}</span>
              </div>
              <div className="receipt__rule" />
              {chosenDishes.map((dish, index) =>
                dish ? (
                  <div className="receipt__row" key={dish.name}>
                    <span>
                      <b>{dish.name.charAt(0)}</b>
                      {dish.name.slice(1)}
                    </span>
                    <span>{courses[index].course.toLowerCase()}</span>
                  </div>
                ) : null,
              )}
              <div className="receipt__rule" />
              <div className="receipt__row">
                <span>total</span>
                <span>
                  <b>priceless</b>
                </span>
              </div>
              {food.orderCodeIsWord ? (
                <>
                  <div className="receipt__rule" />
                  <div className="receipt__code">
                    <span style={{ letterSpacing: 0, fontSize: 'var(--text-xs)' }}>
                      ORDER CODE
                    </span>
                    <span>{orderCode}</span>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </PuzzleFrame>
  );
}
