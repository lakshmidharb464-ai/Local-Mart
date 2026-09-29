import React from 'react';
import { formatCurrency } from '../../utils/currency';

/**
 * Order summary block showing subtotal, delivery fee, and total.
 *
 * @param {object} props
 * @param {number} props.subtotal
 * @param {number} props.deliveryFee
 * @param {number} props.total
 * @param {string} [props.fulfillmentType='delivery'] - 'delivery' | 'pickup'
 * @param {string} [props.currencySymbol='₹']
 * @param {string} [props.className]
 */
export function CartSummary({
  subtotal,
  deliveryFee,
  total,
  fulfillmentType = 'delivery',
  currencySymbol = '₹',
  className = '',
}) {
  const isPickup = fulfillmentType === 'pickup';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-farmMuted">Subtotal</span>
        <span className="font-semibold text-farmText">{formatCurrency(subtotal, currencySymbol)}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-farmMuted">
          {isPickup ? 'Pickup' : 'Delivery fee'}
        </span>
        <span className={`font-semibold ${isPickup || deliveryFee === 0 ? 'text-farmGreen-600' : 'text-farmText'}`}>
          {isPickup ? 'Free' : deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee, currencySymbol)}
        </span>
      </div>

      {!isPickup && deliveryFee === 0 && subtotal > 0 && (
        <p className="text-xs text-farmGreen-700 font-medium">
          🎉 Free delivery on orders above {formatCurrency(300, currencySymbol)}
        </p>
      )}

      <hr className="border-gray-200 my-1" />

      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-farmText">Total</span>
        <span className="text-xl font-extrabold text-farmText font-display">
          {formatCurrency(isPickup ? subtotal : total, currencySymbol)}
        </span>
      </div>
    </div>
  );
}

export default CartSummary;
