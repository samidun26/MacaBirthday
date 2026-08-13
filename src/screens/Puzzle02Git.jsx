import { useMemo } from 'react';
import { PuzzleFrame } from '../components/PuzzleFrame.jsx';
import { buildCommitDiff } from '../lib/gitDiff.js';

/**
 * PUZZLE 02 — GIT COMMIT
 *
 * A real-looking `git show`. The hidden branch name is an acrostic formed by the first
 * letters of the lines this commit ADDED — the green `+` rows. Untouched context lines
 * are decoys.
 *
 * The extraction rule is logical rather than arbitrary: "the branch is in what the commit
 * added" is a sentence that makes sense to anyone who's used git, and once she spots it
 * the answer falls out immediately.
 */
export function Puzzle02Git({ config, onSolve, onBack, onHintUsed, initiallySolved }) {
  const { word, branchPrefix } = config.puzzles.git;
  const { rows } = useMemo(() => buildCommitDiff(word), [word]);

  const fullBranch = `${branchPrefix}${word}`;

  return (
    <PuzzleFrame
      eyebrow="Puzzle 02 — Version control"
      title="Find the hidden branch."
      systemMessage="Somewhere in this commit is the name of the branch it belongs to. The commit will tell you — if you read it like a diff and not like a list."
      answer={word}
      alsoAccept={[fullBranch, `origin/${fullBranch}`, `origin/${word}`]}
      placeholder="branch name"
      inputLabel="Branch name"
      submitLabel="Checkout"
      wrongMessages={[
        'fatal: branch not found.',
        'Nope — that ref doesn\'t exist.',
        'Rejected. Try reading the diff again, not the whole file.',
      ]}
      hints={[
        'A diff has two kinds of lines: the ones that were already there, and the ones this commit added. Only one kind matters.',
        'Read the first letter of every green + line, from top to bottom.',
      ]}
      successTitle="Commit accepted"
      successNote="Not bad. But you're a designer too. Let's see if you notice what developers don't."
      nextLabel="Inspect design →"
      onNext={onSolve}
      onBack={onBack}
      onHintUsed={onHintUsed}
      initiallySolved={initiallySolved}
    >
      <div className="diff mono">
        <div className="diff__meta">
          commit <b>{config.age}.0.0</b>
          <br />
          Author: {config.yourName} &lt;{config.yourName.toLowerCase()}@localhost&gt;
          <br />
          Date:&nbsp;&nbsp; the best day of the year
        </div>

        <div className="diff__subject">feat: initialize birthday build</div>

        <div className="diff__hunk">@@ -20,7 +21,{rows.length} @@ her.traits</div>

        {rows.map((row) => (
          <div
            className={`diff__row${row.kind === 'added' ? ' diff__row--added' : ''}`}
            key={`${row.lineNo}-${row.text}`}
          >
            <span className="diff__lineno">{row.lineNo}</span>
            <span className="diff__gutter">{row.gutter}</span>
            <span className="diff__text">{row.text}</span>
          </div>
        ))}
      </div>

      <div className="todo-block">
        <div className="todo-block__title">TODO</div>
        <div className="todo-item todo-item--done">
          <span className="todo-item__box" aria-hidden="true">
            [x]
          </span>
          <span>make her smile</span>
        </div>
        <div className="todo-item todo-item--done">
          <span className="todo-item__box" aria-hidden="true">
            [x]
          </span>
          <span>make her curious</span>
        </div>
        <div className="todo-item todo-item--open">
          <span className="todo-item__box" aria-hidden="true">
            [ ]
          </span>
          <span>find the hidden branch</span>
        </div>
      </div>
    </PuzzleFrame>
  );
}
