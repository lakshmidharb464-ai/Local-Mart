import { useState, useEffect } from 'react';

/**
 * Debounces a rapidly changing value by the specified delay.
 * Prevents expensive filtering/recalculation on every keystroke
 * (e.g. product search, order search).
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 300ms)
 * @returns {*} The debounced value, updated only after the delay expires
 *
 * @example
 * const [raw, setRaw] = useState('');
 * const query = useDebounce(raw, 300);
 * // Use `query` for filtering — fires at most once per 300ms idle window
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
