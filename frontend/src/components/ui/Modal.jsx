import React from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/**
 * Accessible modal dialog with focus trap and Escape key close.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {function} props.onClose - Called when close is requested.
 * @param {string} [props.title] - Modal heading (required for accessibility).
 * @param {string} [props.description] - Optional description below title.
 * @param {React.ReactNode} props.children - Modal body content.
 * @param {string} [props.size='md'] - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} [props.hideClose] - Hide the × close button.
 */
export function Modal({ isOpen, onClose, title, description, children, size = 'md', hideClose = false }) {
  const SIZES = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  const overlayRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-desc' : undefined}
      ref={overlayRef}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-farmGreen-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${SIZES[size]} max-h-[90vh] overflow-y-auto motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200`}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-gray-100">
            <div>
              {title && (
                <h2 id="modal-title" className="text-xl font-bold text-farmText font-display">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-desc" className="text-sm text-farmMuted mt-1">
                  {description}
                </p>
              )}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-farmText hover:bg-gray-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
