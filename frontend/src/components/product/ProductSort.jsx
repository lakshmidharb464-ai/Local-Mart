import React from 'react';
import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Relevance' },
  { value: 'distance',   label: 'Nearest first' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest',     label: 'Newest first' },
];

/**
 * Sort dropdown for product discovery.
 *
 * @param {object} props
 * @param {string} props.value - Currently selected sort value.
 * @param {function} props.onChange - Called with new sort value string.
 * @param {string} [props.className]
 */
export function ProductSort({ value, onChange, className = '' }) {
  const selectedLabel = SORT_OPTIONS.find(o => o.value === value)?.label || 'Sort';

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor="product-sort" className="sr-only">Sort products by</label>
      <select
        id="product-sort"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          appearance-none pl-3 pr-8 py-2 text-sm font-semibold text-farmText
          bg-white border border-gray-200 rounded-xl
          hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-farmGreen-500 focus:border-farmGreen-500
          transition-colors duration-150 cursor-pointer
        "
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 w-4 h-4 text-farmMuted pointer-events-none" aria-hidden="true" />
    </div>
  );
}

export default ProductSort;
