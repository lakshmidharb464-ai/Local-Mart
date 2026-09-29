/**
 * Derives stock status from a numeric count.
 * @param {number} count - Available stock units.
 * @param {number} [lowThreshold=15] - Below this value is considered "low".
 * @returns {'in' | 'low' | 'out'} Stock status identifier.
 */
export function getStockStatus(count, lowThreshold = 15) {
  if (typeof count !== 'number' || count <= 0) return 'out';
  if (count <= lowThreshold) return 'low';
  return 'in';
}

/**
 * Returns a human-readable stock label.
 * @param {number} count
 * @param {number} [lowThreshold=15]
 * @returns {string}
 */
export function getStockLabel(count, lowThreshold = 15) {
  const status = getStockStatus(count, lowThreshold);
  if (status === 'out') return 'Out of stock';
  if (status === 'low') return `Only ${count} left`;
  return 'In stock';
}

/**
 * Returns Tailwind colour tokens for each stock status.
 * @param {'in' | 'low' | 'out'} status
 * @returns {{ bg: string, text: string, dot: string }}
 */
export function getStockColors(status) {
  switch (status) {
    case 'out':
      return { bg: 'bg-rose-50', text: 'text-rose-900', dot: 'bg-rose-600', border: 'border-rose-300' };
    case 'low':
      return { bg: 'bg-amber-50', text: 'text-amber-950 font-bold', dot: 'bg-amber-500', border: 'border-amber-300' };
    case 'in':
    default:
      return { bg: 'bg-emerald-50', text: 'text-emerald-950 font-bold', dot: 'bg-emerald-600', border: 'border-emerald-300' };
  }
}
