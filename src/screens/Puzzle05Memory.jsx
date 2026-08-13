import { useRef, useState } from 'react';
import { PuzzleFrame } from '../components/PuzzleFrame.jsx';
import { useTypewriter } from '../hooks/useTypewriter.js';
import { matchesAnswer } from '../lib/text.js';

/**
 * PUZZLE 05 — PERSONAL MEMORY
 *
 * The one puzzle that can't be solved by being clever. No pattern, no extraction rule,
 * no hidden mechanic — just a fact about the two of us that isn't written down anywhere
 * on the page.
 *
 * She types the answer directly into the UPDATE statement, which is a much better feeling
 * than filling in a form field: she's repairing the database, not answering a quiz.
 */
export function Puzzle05Memory({ config, onSolve, onBack, onHintUsed, initiallySolved }) {
  const memory = config.puzzles.memory;
  const records = memory.records;
  const target = records.find((record) => record.redacted) ?? records[records.length - 1];

  const [value, setValue] = useState(initiallySolved ? memory.answer : '');
  const inputRef = useRef(null);

  const query = useTypewriter("SELECT * FROM memories WHERE importance = 'very_high';", {
    speed: 22,
  });

  return (
    <PuzzleFrame
      eyebrow="Puzzle 05 — Long-term storage"
      title="One row didn't survive."
      systemMessage={memory.question}
      wrongMessages={[
        'ERROR: value rejected. That\'s not what the row says.',
        'No rows affected. Try again.',
        'The database remembers differently.',
      ]}
      hints={memory.hints}
      successTitle="1 row affected"
      successNote="You remembered. Of course you did."
      nextLabel="Final authentication →"
      onNext={onSolve}
      onBack={onBack}
      onHintUsed={onHintUsed}
      initiallySolved={initiallySolved}
    >
      {({ solved, markSolved, markWrong }) => (
        <>
          <div className="sql">
            <div className="sql__bar">
              <span>DATABASE:</span>
              <b>OUR_MEMORIES</b>
              <span style={{ marginLeft: 'auto' }}>connected</span>
              <span className="status-dot" aria-hidden="true" />
            </div>

            <div className="sql__query">
              <span className="sql__kw">{query.shown}</span>
              {!query.done ? <span className="cursor" /> : null}
            </div>

            {query.done ? (
              <div className="sql__rows">
                <div className="sql__colhead" aria-hidden="true">
                  <span>id</span>
                  <span>key</span>
                  <span>value</span>
                </div>

                {records.map((record) => {
                  const isTarget = record.id === target.id;
                  const restored = isTarget && solved;
                  return (
                    <div
                      className={`record${isTarget ? ' record--target' : ''}${
                        restored ? ' record--restored' : ''
                      }`}
                      key={record.id}
                    >
                      <span className="record__id">{record.id}</span>
                      <span className="record__key">{record.key}</span>
                      <span className="record__value">
                        {isTarget && !solved ? (
                          <>
                            <span className="record__redacted">████████████████</span>{' '}
                            <span className="record__note">— row corrupted</span>
                          </>
                        ) : (
                          (isTarget ? memory.answer : record.value)
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {query.done && !solved ? (
              <form
                className="sql__update"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!value.trim()) {
                    markWrong('Empty string. The row deserves better.');
                    return;
                  }
                  if (matchesAnswer(value, memory.answer, memory.alsoAccept)) {
                    markSolved();
                  } else {
                    markWrong();
                    inputRef.current?.select();
                  }
                }}
              >
                <span className="sql__kw">UPDATE</span> memories <span className="sql__kw">SET</span>{' '}
                value = &apos;
                <input
                  ref={inputRef}
                  className="sql__inline-input"
                  type="text"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder="the missing value"
                  aria-label="The missing value"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  enterKeyHint="go"
                />
                &apos; <span className="sql__kw">WHERE</span> id ={' '}
                <span className="sql__str">{target.id}</span>;
                <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
                  <button className="btn btn--primary" type="submit">
                    Execute
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </>
      )}
    </PuzzleFrame>
  );
}
