/**
 * The reward beat after every solved puzzle: a ring that pulses out, a checkmark that
 * draws itself, and one line of the app being pleased with her.
 */
export function SuccessBanner({ title, note }) {
  return (
    <div className="success" role="status">
      <div className="success__ring">
        <svg className="success__check" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="4 12.5 9.5 18 20 6.5" />
        </svg>
      </div>
      <div className="success__text">
        <strong>{title}</strong>
        {note ? <span>{note}</span> : null}
      </div>
    </div>
  );
}
