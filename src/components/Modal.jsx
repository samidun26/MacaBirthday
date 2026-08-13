import { useEffect, useRef } from 'react';

/** Small dialog used by the hidden TODO easter egg. Escape and backdrop both close it. */
export function Modal({ title, children, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal card" role="dialog" aria-modal="true" aria-label={title}>
        <div className="card__eyebrow">{title}</div>
        {children}
        <button className="btn btn--block" type="button" ref={closeRef} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
