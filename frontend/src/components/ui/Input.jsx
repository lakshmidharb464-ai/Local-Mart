import React, { useId } from 'react';

/**
 * Standardized Unified Input Component for LocalFarm Direct
 */
export const Input = ({
  label,
  error,
  icon: Icon,
  id,
  className = '',
  wrapperClassName = '',
  required = false,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-farmGreen-950 font-display flex items-center gap-1"
        >
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-farmMuted pointer-events-none flex items-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          required={required}
          className={`w-full py-2.5 rounded-2xl border bg-white text-xs font-semibold text-farmGreen-950 font-body placeholder:text-gray-400 transition-all duration-200 focus:outline-none ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-farmGreen-200 focus:border-farmGreen-600 focus:ring-2 focus:ring-farmGreen-500/20'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
