import React, { useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'border-farmGreen-200 bg-white text-farmGreen-900',
  error:   'border-red-200 bg-white text-red-900',
  warning: 'border-amber-200 bg-white text-amber-900',
  info:    'border-blue-200 bg-white text-blue-900',
};

const DOT_STYLES = {
  success: 'bg-farmGreen-500',
  error:   'bg-red-500',
  warning: 'bg-amber-400',
  info:    'bg-blue-500',
};

/**
 * Toast notification component.
 * Rendered inside AuthContext; announced via aria-live region.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.message]
 * @param {'success'|'error'|'warning'|'info'} [props.type='success']
 * @param {function} props.onDismiss
 */
export function Toast({ title, message, type = 'success', onDismiss }) {
  const Icon = ICONS[type] || ICONS.success;
  const timerRef = useRef(null);

  // Allow keyboard dismiss
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`
        flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-lg border
        min-w-[280px] max-w-[360px]
        motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in motion-safe:duration-300
        ${STYLES[type] || STYLES.success}
      `}
    >
      {/* Colored dot indicator */}
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${DOT_STYLES[type] || DOT_STYLES.success}`} aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-tight">{title}</p>
        {message && <p className="text-xs mt-0.5 opacity-80 font-medium">{message}</p>}
      </div>

      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-current"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * ToastContainer — fixed-position wrapper for the toast.
 * Place near the bottom of the component tree.
 */
export function ToastContainer({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div
      className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-2"
      aria-label="Notifications"
    >
      <Toast {...toast} onDismiss={onDismiss} />
    </div>
  );
}

export default Toast;
