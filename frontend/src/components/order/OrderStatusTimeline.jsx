import React from 'react';
import { Check, Clock } from 'lucide-react';

const ORDER_STATUSES = [
  { key: 'Pending',           label: 'Order Placed',      desc: 'Waiting for farmer to accept' },
  { key: 'Accepted',          label: 'Accepted',          desc: 'Farmer confirmed your order' },
  { key: 'Preparing',         label: 'Preparing',         desc: 'Being packed and prepared' },
  { key: 'Out for Delivery',  label: 'Out for Delivery',  desc: 'On the way to you' },
  { key: 'Delivered',         label: 'Delivered',         desc: 'Successfully delivered' },
];

const STATUS_ORDER_MAP = {
  Pending:           0,
  Accepted:          1,
  Preparing:         2,
  'Out for Delivery':3,
  'Ready for Pickup':3,
  Delivered:         4,
  Completed:         4,
  Cancelled:         -1,
};

/**
 * Visual order status timeline — shows progress through the fulfilment stages.
 *
 * @param {object} props
 * @param {string} props.status - Current order status string.
 * @param {'delivery'|'pickup'} [props.fulfillmentType='delivery']
 */
export function OrderStatusTimeline({ status, fulfillmentType = 'delivery' }) {
  const isCancelled = status === 'Cancelled';
  const currentIndex = STATUS_ORDER_MAP[status] ?? 0;

  const displayStatuses = fulfillmentType === 'pickup'
    ? ORDER_STATUSES.map(s =>
        s.key === 'Out for Delivery'
          ? { ...s, key: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Ready to collect at the farm' }
          : s
      )
    : ORDER_STATUSES;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl" role="status" aria-label="Order cancelled">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-500 font-bold text-sm" aria-hidden="true">✕</span>
        </div>
        <div>
          <p className="text-sm font-bold text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-600">This order was cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <ol
      className="flex flex-col gap-0"
      aria-label="Order status timeline"
    >
      {displayStatuses.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <li key={step.key} className="flex items-start gap-3" aria-current={isCurrent ? 'step' : undefined}>
            {/* Left: dot + line */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0
                  border-2 transition-all duration-300
                  ${isCompleted
                    ? 'bg-farmGreen-600 border-farmGreen-600'
                    : isCurrent
                      ? 'bg-white border-farmGreen-600 ring-4 ring-farmGreen-100'
                      : 'bg-white border-gray-200'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} aria-hidden="true" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-farmGreen-600 animate-pulse block" aria-hidden="true" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-200 block" aria-hidden="true" />
                )}
              </div>
              {/* Connector */}
              {index < displayStatuses.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-0.5 ${isCompleted ? 'bg-farmGreen-500' : 'bg-gray-200'}`}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Right: label + desc */}
            <div className="pb-6 pt-1">
              <p className={`text-sm font-bold transition-colors ${
                isCompleted ? 'text-farmGreen-700' : isCurrent ? 'text-farmGreen-700' : 'text-gray-400'
              }`}>
                {step.label}
                <span className="sr-only">
                  {isCompleted ? '(completed)' : isCurrent ? '(current)' : '(upcoming)'}
                </span>
              </p>
              {(isCompleted || isCurrent) && (
                <p className="text-xs text-farmMuted mt-0.5">{step.desc}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default OrderStatusTimeline;
