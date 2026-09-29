import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, MapPin } from 'lucide-react';
import { QuantitySelector } from '../ui/QuantitySelector';
import { StockBadge } from '../ui/StockBadge';
import { Alert } from '../ui/Alert';
import { formatCurrency } from '../../utils/currency';
import { getStockStatus } from '../../utils/stockStatus';

/**
 * Single item row inside the Cart.
 *
 * @param {object} props
 * @param {object} props.item - { product, quantity }
 * @param {function} props.onUpdateQuantity - (productId, newQty) => void
 * @param {function} props.onRemove - (productId) => void
 * @param {string} [props.currencySymbol='₹']
 */
export function CartItem({ item, onUpdateQuantity, onRemove, currencySymbol = '₹' }) {
  const { product, quantity } = item;
  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = stockStatus === 'out';
  // Warn if user has more in cart than current stock
  const exceedsStock = product.stock > 0 && quantity > product.stock;

  return (
    <article className="flex flex-col gap-3 py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex gap-3">
        {/* Product image */}
        <Link
          to={`/products/${product.id}`}
          className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-farmGreen-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* Product name + remove */}
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/products/${product.id}`}
              className="text-sm font-bold text-farmText line-clamp-2 hover:text-farmGreen-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 rounded-sm"
            >
              {product.name}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              aria-label={`Remove ${product.name} from cart`}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Farm + distance */}
          <div className="flex items-center gap-1 text-farmMuted">
            <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span className="text-xs truncate">{product.farmerName}</span>
          </div>

          {/* Price + stock */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-farmMuted">
              {formatCurrency(product.price, currencySymbol)} / {product.unit}
            </span>
            <StockBadge count={product.stock} size="sm" />
          </div>
        </div>
      </div>

      {/* Quantity + line total */}
      <div className="flex items-center justify-between gap-4 pl-[76px]">
        <QuantitySelector
          value={quantity}
          onChange={(qty) => onUpdateQuantity(product.id, qty)}
          min={1}
          max={product.stock || undefined}
          label={`${product.name} quantity`}
          size="sm"
        />
        <p className="text-sm font-extrabold text-farmText font-display shrink-0">
          {formatCurrency(product.price * quantity, currencySymbol)}
        </p>
      </div>

      {/* Stock warning — shown if cart quantity exceeds available stock */}
      {exceedsStock && (
        <div className="pl-[76px]">
          <Alert variant="warning">
            Only {product.stock} {product.unit} available. Quantity adjusted on checkout.
          </Alert>
        </div>
      )}

      {isOutOfStock && (
        <div className="pl-[76px]">
          <Alert variant="error">
            This item is now out of stock and will be removed at checkout.
          </Alert>
        </div>
      )}
    </article>
  );
}

export default CartItem;
