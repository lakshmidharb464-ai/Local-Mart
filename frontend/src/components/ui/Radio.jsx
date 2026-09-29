import React, { useId } from 'react';

/**
 * Accessible Radio button component — use multiple inside a <fieldset>.
 *
 * @param {object} props
 * @param {string} props.label - Visible label text.
 * @param {string} [props.description] - Optional sub-label text.
 * @param {string} [props.value] - This radio's value.
 * @param {string} [props.checked] - Whether this radio is selected.
 * @param {string} [props.name] - Radio group name.
 * @param {string} [props.className]
 */
export const Radio = React.forwardRef(({
  label,
  description,
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
          type="radio"
          id={id}
          checked={checked}
          disabled={disabled}
          className="sr-only peer"
          {...rest}
        />
        {/* Custom styled radio circle */}
        <label
          htmlFor={id}
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer
            transition-all duration-150
            peer-focus-visible:ring-2 peer-focus-visible:ring-farmGreen-500 peer-focus-visible:ring-offset-2
            peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
            ${checked
              ? 'border-farmGreen-600 bg-white'
              : 'border-gray-300 bg-white hover:border-farmGreen-400'
            }
          `}
          aria-hidden="true"
        >
          {checked && (
            <span className="w-2.5 h-2.5 rounded-full bg-farmGreen-600 block" />
          )}
        </label>
      </div>
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
    </div>
  );
});

Radio.displayName = 'Radio';
export default Radio;
