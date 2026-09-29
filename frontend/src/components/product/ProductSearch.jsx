import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Controlled search bar for product discovery.
 *
 * @param {object} props
 * @param {string} props.value - Controlled search query.
 * @param {function} props.onChange - Called with new string value.
 * @param {string} [props.placeholder='Search produce, farm, or category...']
 * @param {boolean} [props.autoFocus]
 * @param {string} [props.className]
 */
export function ProductSearch({ value, onChange, placeholder = 'Search produce, farm, or category...', autoFocus = false, className = '' }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        className="absolute left-4 w-4 h-4 text-farmMuted pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        aria-label="Search products"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 py-3 text-sm font-medium
          bg-white border border-gray-200 rounded-xl
          text-farmText placeholder:text-farmMuted
          focus:outline-none focus:ring-2 focus:ring-farmGreen-500 focus:border-farmGreen-500
          hover:border-gray-300 transition-colors duration-150
        "
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full text-farmMuted hover:text-farmText hover:bg-gray-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default ProductSearch;
