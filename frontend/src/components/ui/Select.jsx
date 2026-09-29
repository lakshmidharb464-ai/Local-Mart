import React, { useId } from 'react';

/**
 * Accessible Select dropdown component.
 *
 * @param {object} props
 * @param {string} [props.label] - Visible label above the select.
 * @param {Array<{value: string, label: string}>} props.options - Options list.
 * @param {string} [props.placeholder] - Placeholder option label (value = '').
 * @param {string} [props.error] - Error message string.
 * @param {string} [props.className] - Extra classes for the wrapper div.
 */
export const Select = React.forwardRef(({
  label,
  options = [],
  placeholder,
  error,
  id: propId,
  className = '',
  disabled,
  required,
  ...rest
}, ref) => {
  const autoId = useId();
  const id = propId || autoId;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-farmText"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-4 py-3 rounded-xl border bg-white text-farmText text-sm
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-farmGreen-500 focus:border-farmGreen-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
