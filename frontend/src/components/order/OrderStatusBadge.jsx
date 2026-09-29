import React from 'react';

const STATUS_CONFIG = {
  Pending:          { label: 'Pending',          color: 'bg-amber-50 text-amber-950 border-amber-300 font-bold' },
  Accepted:         { label: 'Accepted',          color: 'bg-blue-50 text-blue-950 border-blue-300 font-bold' },
  Preparing:        { label: 'Preparing',         color: 'bg-indigo-50 text-indigo-950 border-indigo-300 font-bold' },
  'Out for Delivery':{ label: 'Out for Delivery', color: 'bg-purple-50 text-purple-950 border-purple-300 font-bold' },
  'Ready for Pickup':{ label: 'Ready for Pickup', color: 'bg-teal-50 text-teal-950 border-teal-300 font-bold' },
  Delivered:        { label: 'Delivered',         color: 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold' },
  Completed:        { label: 'Completed',         color: 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold' },
  Cancelled:        { label: 'Cancelled',         color: 'bg-rose-50 text-rose-950 border-rose-300 font-bold' },
};

const STATUS_DOT = {
  Pending:           'bg-amber-500',
  Accepted:          'bg-blue-600',
  Preparing:         'bg-indigo-600',
  'Out for Delivery':'bg-purple-600',
  'Ready for Pickup':'bg-teal-600',
  Delivered:         'bg-emerald-600',
  Completed:         'bg-emerald-600',
  Cancelled:         'bg-rose-600',
};

/**
 * Coloured order status badge. Always shows text + dot (never color alone).
 *
 * @param {object} props
 * @param {string} props.status - Order status string.
 * @param {'sm'|'md'} [props.size='md']
 * @param {string} [props.className]
 */
export function OrderStatusBadge({ status, size = 'md', className = '' }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-50 text-gray-700 border-gray-200' };
  const dot = STATUS_DOT[status] || 'bg-gray-400';

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.color} ${sizes[size] || sizes.md} ${className}`}
      role="status"
      aria-label={`Order status: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export default OrderStatusBadge;
