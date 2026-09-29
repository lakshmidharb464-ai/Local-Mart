import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Sparkles, MapPin, Check, Plus, Minus, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';

/**
 * ProductQuickViewModal — Accessible modal to preview product details and add to cart without navigating away.
 *
 * @param {object} props
 * @param {object|null} props.product - The product object to display.
 * @param {function} props.onClose - Callback to close modal.
 */
export function ProductQuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { currencySymbol, showToast } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    if (showToast) {
      showToast('Added to Basket! 🧺', `${quantity}x ${product.name} added to your basket.`);
    }
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <Modal
      isOpen={Boolean(product)}
      onClose={onClose}
      title={product.name}
      size="lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {/* Product Image */}
        <div className="relative aspect-square sm:aspect-auto rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isOrganic && (
            <span className="absolute top-3 left-3 bg-farmGreen-600/95 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-farmGold-300" />
              100% Organic
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Category & Farm */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-farmGreen-50 text-farmGreen-800 font-semibold px-2.5 py-0.5 rounded-full border border-farmGreen-100">
                {product.category}
              </span>
              {product.farmerName && (
                <span className="text-farmMuted flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-farmGreen-600" />
                  {product.farmerName}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-farmText font-display">
                {formatCurrency(product.price, currencySymbol)}
              </span>
              <span className="text-xs text-farmMuted">/ {product.unit || 'unit'}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-farmMuted leading-relaxed">
              {product.description || 'Locally harvested fresh produce, harvested sustainably at peak ripeness.'}
            </p>

            {/* Stock status */}
            <div className="pt-1">
              {isOutOfStock ? (
                <span className="inline-block text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-block text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Only {product.stock} left in stock!
                </span>
              ) : (
                <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Action section */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-2 text-gray-500 hover:text-farmText hover:bg-gray-200 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-semibold text-farmText min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    disabled={quantity >= (product.stock || 99)}
                    aria-label="Increase quantity"
                    className="p-2 text-gray-500 hover:text-farmText hover:bg-gray-200 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-farmGreen-600 hover:bg-farmGreen-700 text-white transition-all shadow-sm active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-farmGold-300" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBasket className="w-4 h-4" />
                      Add to Basket
                    </>
                  )}
                </button>
              </div>
            )}

            <Link
              to={`/products/${product.id}`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-farmGreen-700 hover:text-farmGreen-900 transition-colors"
            >
              View Full Product Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProductQuickViewModal;
