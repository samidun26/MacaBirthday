import { useEffect } from 'react';

/** Transient notifications — easter eggs, achievements, the occasional aside. */
export function ToastLayer({ toasts, onExpire }) {
  return (
    <div className="toast-layer" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onExpire={onExpire} />
      ))}
    </div>
  );
}

function Toast({ toast, onExpire }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onExpire(toast.id), toast.duration ?? 4200);
    return () => window.clearTimeout(timer);
  }, [toast.id, toast.duration, onExpire]);

  return (
    <div className="toast">
      {toast.icon ? (
        <span className="toast__icon" aria-hidden="true">
          {toast.icon}
        </span>
      ) : null}
      <div className="toast__body">
        {toast.title ? <div className="toast__title">{toast.title}</div> : null}
        <div className="toast__text">{toast.text}</div>
      </div>
    </div>
  );
}
