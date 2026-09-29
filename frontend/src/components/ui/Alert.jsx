import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

const VARIANTS = {
  info:    { icon: Info,          bg: 'bg-blue-50',    border: 'border-blue-300',   text: 'text-blue-950 font-medium',   iconColor: 'text-blue-600' },
  success: { icon: CheckCircle2,  bg: 'bg-emerald-50', border: 'border-emerald-300',text: 'text-emerald-950 font-medium',iconColor: 'text-emerald-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50',   border: 'border-amber-300',  text: 'text-amber-950 font-medium',  iconColor: 'text-amber-600' },
  error:   { icon: XCircle,       bg: 'bg-rose-50',    border: 'border-rose-300',   text: 'text-rose-950 font-medium',    iconColor: 'text-rose-600' },
};

/**
 * Inline alert banner — use for contextual feedback within a page section.
 * For transient notifications, use Toast instead.
 *
 * @param {object} props
 * @param {'info'|'success'|'warning'|'error'} [props.variant='info']
 * @param {string} [props.title] - Bold heading text.
 * @param {string|React.ReactNode} [props.children] - Body text.
 * @param {function} [props.onDismiss] - If provided, shows an × dismiss button.
 * @param {string} [props.className]
 */
export function Alert({ variant = 'info', title, children, onDismiss, className = '' }) {
  const { icon: Icon, bg, border, text, iconColor } = VARIANTS[variant] || VARIANTS.info;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex gap-3 p-4 rounded-xl border ${bg} ${border} ${text} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {children && <div className={`text-sm ${title ? 'mt-0.5' : ''}`}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className={`shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-current`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
