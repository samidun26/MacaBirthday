import { useCallback, useEffect, useRef, useState } from 'react';
import { HintPanel } from './HintPanel.jsx';
import { SuccessBanner } from './SuccessBanner.jsx';
import { sound } from '../lib/audio.js';
import { matchesAnswer } from '../lib/text.js';

/**
 * The chassis every puzzle is built on.
 *
 * Owns the parts that must feel identical in all five puzzles: the header, the system
 * message, the answer field, wrong-answer feedback, the hint drawer, the success banner
 * and the advance button. Each puzzle only supplies its own middle section.
 *
 * Puzzles that need a custom interaction (the food menu, for instance) pass a function
 * as `children` and drive the frame with `markSolved` / `markWrong`.
 */

/* Playful, never scolding. Cycled so the same message never lands twice in a row. */
const DEFAULT_WRONG = [
  'Hmm... that doesn\'t compile.',
  'ERROR 404: Brain.exe not found.',
  'Build failed. Zero warnings, one wrong answer.',
  'Not quite. Rolling back to the last good state.',
];

export function PuzzleFrame({
  eyebrow,
  title,
  systemLabel = 'System message',
  systemMessage,
  children,
  /* Built-in answer field. Omit for puzzles that supply their own interaction. */
  answer,
  alsoAccept = [],
  placeholder = 'type your answer',
  inputLabel = 'Your answer',
  submitLabel = 'Submit',
  wrongMessages = DEFAULT_WRONG,
  hints = [],
  successTitle,
  successNote,
  nextLabel,
  onNext,
  onBack,
  onHintUsed,
  /* Called the moment the puzzle is solved (before she taps Next). */
  onSolved,
  /* True when she's navigating back to a puzzle she already beat — the frame comes
   * back up in its solved state instead of making her do it twice. */
  initiallySolved = false,
  autoFocus = false,
}) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(initiallySolved ? 'success' : 'idle');
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(initiallySolved);
  const attemptsRef = useRef(0);
  const solvedRef = useRef(initiallySolved);
  const inputRef = useRef(null);
  const nextRef = useRef(null);

  /* Guarded by a ref, not by state, so it stays idempotent under StrictMode's
   * double-invocation and can never fire `onSolved` twice. */
  const markSolved = useCallback(() => {
    if (solvedRef.current) return;
    solvedRef.current = true;
    setSolved(true);
    setStatus('success');
    setFeedback(null);
    sound.success();
    onSolved?.();
  }, [onSolved]);

  const markWrong = useCallback(
    (message) => {
      const attemptIndex = attemptsRef.current;
      attemptsRef.current += 1;

      setStatus('error');
      setAttempts(attemptsRef.current);
      setFeedback(message ?? wrongMessages[attemptIndex % wrongMessages.length]);
      sound.error();

      /* Let the shake finish, then return to neutral so she can retype cleanly. */
      window.setTimeout(() => setStatus((current) => (current === 'error' ? 'idle' : current)), 500);
    },
    [wrongMessages],
  );

  const submit = useCallback(
    (event) => {
      event?.preventDefault();
      if (solved) return;
      if (!value.trim()) {
        markWrong('Empty input. Bold strategy.');
        return;
      }
      if (matchesAnswer(value, answer, alsoAccept)) {
        markSolved();
      } else {
        markWrong();
      }
    },
    [solved, value, answer, alsoAccept, markSolved, markWrong],
  );

  /* Move focus to the advance button on success: keyboard users can just hit Enter
   * twice, and screen readers announce the win. */
  useEffect(() => {
    if (solved && nextRef.current) {
      const timer = window.setTimeout(() => nextRef.current?.focus(), 420);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [solved]);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const nudgeHint = attempts >= 3 && !solved && hints.length > 0;

  return (
    <section className="screen card" aria-labelledby="puzzle-title">
      {eyebrow ? <div className="card__eyebrow">{eyebrow}</div> : null}
      <h1 className="card__title" id="puzzle-title">
        {title}
      </h1>

      {systemMessage ? (
        <div className="sysmsg">
          <span className="sysmsg__label">{systemLabel}</span>
          {systemMessage}
        </div>
      ) : null}

      {typeof children === 'function' ? children({ solved, markSolved, markWrong }) : children}

      {answer && !solved ? (
        <form className="answer" data-state={status} onSubmit={submit}>
          <div className="answer__field">
            <label className="visually-hidden" htmlFor="puzzle-answer">
              {inputLabel}
            </label>
            <input
              id="puzzle-answer"
              ref={inputRef}
              className="answer__input"
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={placeholder}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              enterKeyHint="go"
              aria-invalid={status === 'error'}
            />
          </div>
          <button className="btn btn--primary" type="submit">
            {submitLabel}
          </button>
        </form>
      ) : null}

      {feedback && !solved ? (
        <p className="feedback feedback--error" role="status">
          <span aria-hidden="true">✕</span>
          <span>{feedback}</span>
        </p>
      ) : null}

      {nudgeHint ? (
        <p className="feedback feedback--muted">
          <span aria-hidden="true">›</span>
          <span>There&apos;s a hint below. No judgement.</span>
        </p>
      ) : null}

      {!solved && hints.length > 0 ? <HintPanel hints={hints} onHintUsed={onHintUsed} /> : null}

      {solved ? <SuccessBanner title={successTitle} note={successNote} /> : null}

      <div className="btn-row">
        {onBack ? (
          <button className="btn btn--ghost" type="button" onClick={onBack}>
            ← Back
          </button>
        ) : null}
        <span style={{ flex: 1 }} />
        {solved ? (
          <button className="btn btn--primary" type="button" ref={nextRef} onClick={onNext}>
            {nextLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
