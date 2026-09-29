import React, { useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * Accessible quantity selector: − / value / +
 *
 * @param {object} props
 * @param {number} props.value - Current quantity.
 * @param {function} props.onChange - Called with new quantity number.
 * @param {number} [props.min=1] - Minimum allowed value.
 * @param {number} [props.max] - Maximum allowed value (e.g. stock count).
 * @param {string} [props.label] - Hidden label for screen readers, e.g. "Tomatoes quantity".
 * @param {boolean} [props.disabled]
 * @param {string} [props.size='md'] - 'sm' | 'md' | 'lg'
 * @param {string} [props.className]
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
  label = 'Quantity',
  disabled = false,
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: { btn: 'w-7 h-7', icon: 'w-3.5 h-3.5', text: 'w-8 text-sm' },
    md: { btn: 'w-9 h-9', icon: 'w-4 h-4', text: 'w-10 text-base' },
    lg: { btn: 'w-11 h-11', icon: 'w-5 h-5', text: 'w-12 text-lg' },
  };
  const s = sizes[size] || sizes.md;

  const decrement = useCallback(() => {
    if (value > min) onChange(value - 1);
  }, [value, min, onChange]);

  const increment = useCallback(() => {
    if (max === undefined || value < max) onChange(value + 1);
  }, [value, max, onChange]);

  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden ${className}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || atMin}
        aria-label={`Decrease ${label}`}
        className={`
          ${s.btn} flex items-center justify-center
          text-farmText hover:bg-farmGreen-50 hover:text-farmGreen-700
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-150
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 focus-visible:outline-offset-[-2px]
        `}
      >
        <Minus className={s.icon} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <output
        aria-live="polite"
        aria-atomic="true"
        className={`${s.text} text-center font-bold text-farmText select-none tabindex-0`}
      >
        {value}
        <span className="sr-only"> {label}</span>
      </output>

      <button
        type="button"
        onClick={increment}
        disabled={disabled || atMax}
        aria-label={`Increase ${label}`}
        className={`
          ${s.btn} flex items-center justify-center
          text-farmText hover:bg-farmGreen-50 hover:text-farmGreen-700
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-150
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 focus-visible:outline-offset-[-2px]
        `}
      >
        <Plus className={s.icon} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}

export default QuantitySelector;
