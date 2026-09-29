import React, { useId } from 'react';

/**
 * Accessible Toggle (switch) component.
 *
 * @param {object} props
 * @param {string} [props.label] - Label text.
 * @param {string} [props.description] - Optional description.
 * @param {boolean} props.checked - Controlled checked state.
 * @param {function} props.onChange - onChange handler.
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 */
export const Toggle = React.forwardRef(({
  label,
  description,
  checked,
  disabled,
  id: propId,
  className = '',
  ...rest
}, ref) => {
  const autoId = useId();
  const id = propId || autoId;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={id}
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          className="sr-only peer"
          {...rest}
        />
        <label
          htmlFor={id}
          className={`
            relative inline-flex w-11 h-6 rounded-full cursor-pointer
            transition-colors duration-200 ease-in-out
            peer-focus-visible:ring-2 peer-focus-visible:ring-farmGreen-500 peer-focus-visible:ring-offset-2
            peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
            ${checked ? 'bg-farmGreen-600' : 'bg-gray-300'}
          `}
          aria-hidden="true"
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
              transition-transform duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </label>
      </div>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label htmlFor={id} className={`text-sm font-medium cursor-pointer select-none ${disabled ? 'opacity-50' : 'text-farmText'}`}>
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-farmMuted">{description}</p>
          )}
        </div>
      )}
    </div>
  );
});

Toggle.displayName = 'Toggle';
export default Toggle;
