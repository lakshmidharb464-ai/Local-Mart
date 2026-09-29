import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Truck, Store, Plus, Minus, Heart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { StockBadge } from '../ui/StockBadge';
import { formatCurrency } from '../../utils/currency';
import { formatDistanceShort } from '../../utils/distance';
import { getStockStatus } from '../../utils/stockStatus';

/**
 * Reusable ProductCard component.
 * Displays core product info with Add to Cart, wishlist, and quick-view actions.
 *
 * @param {object} props
 * @param {object} props.product - Product data object.
 * @param {function} [props.onQuickView] - Called with product on eye-icon click.
 * @param {boolean} [props.isWishlisted] - Whether this product is in wishlist.
 * @param {function} [props.onToggleWishlist] - Called with product to toggle wishlist.
 * @param {string} [props.currencySymbol='₹'] - Currency symbol from context.
 */
export const ProductCard = React.memo(function ProductCard({
  product,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
  currencySymbol = '₹',
}) {
  const { addToCart, cartItems } = useCart();
  const [addedFeedback, setAddedFeedback] = useState(false);

  const cartItem = cartItems.find(i => i.product.id === product.id);
  const cartQty = cartItem?.quantity || 0;
  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = stockStatus === 'out';

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1600);
  }, [addToCart, product, isOutOfStock]);

  const handleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  }, [onToggleWishlist, product]);

  const handleQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  }, [onQuickView, product]);

  return (
    <article className="group bg-white rounded-xl border border-gray-100 hover:border-farmGreen-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Product Image */}
      <Link
        to={`/products/${product.id}`}
        className="block relative aspect-[4/3] overflow-hidden bg-farmGreen-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
        aria-label={`View details for ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient overlay — subtle, for readability not decoration */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" aria-hidden="true" />

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5" aria-hidden="true">
          {product.organic && (
            <span className="px-2 py-0.5 rounded-full bg-farmGreen-600 text-white text-[10px] font-bold">
              Farmer-reported organic
            </span>
          )}
        </div>

        {/* Top-right actions */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`Quick view ${product.name}`}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-farmText flex items-center justify-center shadow-sm transition-transform hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
          {onToggleWishlist && (
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-farmText'}`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* In-cart quantity indicator */}
        {cartQty > 0 && (
          <div className="absolute bottom-2 right-2 bg-farmGreen-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full" aria-label={`${cartQty} in cart`}>
            {cartQty} in cart
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {/* Farm info */}
        <div className="flex items-center gap-1 text-farmMuted">
          <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
          <Link
            to={`/farms/${product.farmerId || product.id}`}
            className="text-[11px] font-medium truncate hover:text-farmGreen-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 rounded-sm"
            onClick={e => e.stopPropagation()}
          >
            {product.farmerName}
          </Link>
          {typeof product.distanceKm === 'number' && (
            <span className="text-[11px] shrink-0 ml-auto">· {formatDistanceShort(product.distanceKm)}</span>
          )}
        </div>

        {/* Product name */}
        <Link
          to={`/products/${product.id}`}
          className="text-sm font-bold text-farmText leading-tight hover:text-farmGreen-700 transition-colors line-clamp-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 rounded-sm"
        >
          {product.name}
        </Link>

        {/* Price */}
        <p className="text-base font-extrabold text-farmText font-display">
          {formatCurrency(product.price, currencySymbol)}
          <span className="text-xs font-semibold text-farmMuted ml-1">/ {product.unit}</span>
        </p>

        {/* Stock + fulfillment row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <StockBadge count={product.stock} size="sm" />
          <div className="flex items-center gap-1.5" aria-label="Fulfillment options">
            <Truck className="w-3 h-3 text-farmMuted" aria-hidden="true" title="Delivery available" />
            <Store className="w-3 h-3 text-farmMuted" aria-hidden="true" title="Pickup available" />
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          className={`
            mt-auto w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
            text-sm font-semibold transition-all duration-200
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 focus-visible:outline-offset-2
            ${isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : addedFeedback
                ? 'bg-farmGreen-600 text-white scale-95'
                : 'bg-farmGreen-600 hover:bg-farmGreen-700 active:scale-95 text-white'
            }
          `}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : addedFeedback ? (
            <>
              <span aria-hidden="true">✓</span> Added!
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
});

export default ProductCard;
