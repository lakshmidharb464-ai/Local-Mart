import React from 'react';
import { getStockStatus, getStockLabel, getStockColors } from '../../utils/stockStatus';

/**
 * Stock status badge — communicates availability with both color AND text.
 * Never uses color alone (accessibility requirement).
 *
 * @param {object} props
 * @param {number} props.count - Raw stock count.
 * @param {number} [props.lowThreshold=15] - Threshold below which stock is "low".
 * @param {'sm'|'md'} [props.size='md']
 * @param {string} [props.className]
 */
export function StockBadge({ count, lowThreshold = 15, size = 'md', className = '' }) {
  const status = getStockStatus(count, lowThreshold);
  const label = getStockLabel(count, lowThreshold);
  const { bg, text, dot, border } = getStockColors(status);

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${bg} ${text} ${border} ${sizes[size] || sizes.md} ${className}`}
      role="status"
      aria-label={`Stock status: ${label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} aria-hidden="true" />
      {label}
    </span>
  );
}

export default StockBadge;
