import React, { useId } from 'react';
import { Check } from 'lucide-react';

/**
 * Accessible Checkbox component.
 *
 * @param {object} props
 * @param {string} props.label - Visible label text.
 * @param {string} [props.description] - Optional description line below label.
 * @param {string} [props.error] - Error message.
 * @param {boolean} [props.checked]
 * @param {function} [props.onChange]
 * @param {string} [props.className]
 */
export const Checkbox = React.forwardRef(({
  label,
  description,
  error,
  id: propId,
  className = '',
  checked,
  disabled,
  ...rest
}, ref) => {
  const autoId = useId();
  const id = propId || autoId;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={description ? `${id}-desc` : error ? `${id}-error` : undefined}
          className="sr-only peer"
          {...rest}
        />
        {/* Custom styled checkbox */}
        <label
          htmlFor={id}
          className={`
            w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer
            transition-all duration-150
            peer-focus-visible:ring-2 peer-focus-visible:ring-farmGreen-500 peer-focus-visible:ring-offset-2
            peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
            ${checked
              ? 'bg-farmGreen-600 border-farmGreen-600'
              : error
                ? 'border-red-400 bg-white hover:border-red-500'
                : 'border-gray-300 bg-white hover:border-farmGreen-400'
            }
          `}
          aria-hidden="true"
        >
          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </label>
      </div>
      <div className="flex flex-col gap-0.5">
        {label && (
          <label htmlFor={id} className={`text-sm font-medium cursor-pointer select-none ${disabled ? 'opacity-50' : 'text-farmText'}`}>
            {label}
          </label>
        )}
        {description && (
          <p id={`${id}-desc`} className="text-xs text-farmMuted">
            {description}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
