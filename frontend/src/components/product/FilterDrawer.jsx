import React, { useEffect, useRef } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { ProductFilters } from './ProductFilters';

/**
 * Mobile filter drawer — slides up from bottom when open.
 * Traps focus inside and closes on Escape.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {object} props.filterProps - All props forwarded to ProductFilters.
 */
export function FilterDrawer({ isOpen, onClose, filterProps }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
      prev?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Product filters">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-farmGreen-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto motion-safe:animate-in motion-safe:slide-in-from-bottom motion-safe:duration-300">
        {/* Handle + header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-farmGreen-700" aria-hidden="true" />
            <h2 className="text-base font-bold text-farmText">Filters</h2>
            {filterProps.activeFilterCount > 0 && (
              <span className="bg-farmGreen-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {filterProps.activeFilterCount}
              </span>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-farmMuted hover:text-farmText hover:bg-gray-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Filter content */}
        <div className="p-5">
          <ProductFilters {...filterProps} />
        </div>

        {/* Apply button (close drawer) */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-farmGreen-600 hover:bg-farmGreen-700 text-white font-semibold rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 focus-visible:outline-offset-2"
          >
            Show {filterProps.resultCount} results
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterDrawer;
