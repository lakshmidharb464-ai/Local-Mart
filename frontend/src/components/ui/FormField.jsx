import React, { useId } from 'react';

/**
 * FormField wraps a label, input/children, hint, and error message
 * into a single accessible unit.
 *
 * Usage:
 *   <FormField label="Full Name" error={errors.name?.message} required>
 *     <Input id={fieldId} {...register('name')} />
 *   </FormField>
 *
 * @param {object} props
 * @param {string} props.label - Field label.
 * @param {string} [props.hint] - Optional hint text below the input.
 * @param {string} [props.error] - Validation error message.
 * @param {boolean} [props.required] - Shows asterisk.
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children - The input/select element.
 */
export function FormField({ label, hint, error, required, className = '', children }) {
  const id = useId();

  // Clone child to inject id and aria-describedby
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean).join(' ');

  const child = React.Children.only(children);
  const clonedChild = React.cloneElement(child, {
    id: child.props.id || id,
    'aria-invalid': !!error || undefined,
    'aria-describedby': describedBy || undefined,
  });

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={child.props.id || id} className="text-sm font-semibold text-farmText">
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {clonedChild}

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-farmMuted">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
