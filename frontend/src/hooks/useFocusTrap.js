import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within a container element when active.
 * Handles Tab / Shift+Tab cycling, Escape key dismissing, and focus restoration on unmount/close.
 *
 * @param {boolean} isOpen - Whether the dialog/drawer is currently open.
 * @param {function} [onClose] - Callback when Escape key is pressed.
 * @param {React.RefObject} [initialFocusRef] - Optional element ref to focus first.
 * @returns {React.RefObject} containerRef - Attach to the dialog wrapper element.
 */
export function useFocusTrap(isOpen, onClose, initialFocusRef) {
  const containerRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen || !containerRef.current) return;

    if (e.key === 'Escape' && onClose) {
      e.stopPropagation();
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !containerRef.current.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !containerRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;

    const timer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const focusable = containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          containerRef.current.focus?.();
        }
      }
    }, 50);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, handleKeyDown, initialFocusRef]);

  return containerRef;
}

export default useFocusTrap;
