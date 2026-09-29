import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { formatCurrency } from '../utils/currency';
import {
  ShoppingBag, X, Plus, Minus, Trash2,
  ArrowRight, Leaf, Truck,
  Sparkles, ShieldCheck
} from 'lucide-react';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems, isCartOpen, setIsCartOpen,
    updateQuantity, removeFromCart,
    subtotal, deliveryFee, total
  } = useCart();
  const { currencySymbol = '₹' } = useAuth();

  const [removingId, setRemovingId] = useState(null);

  // Focus trap for accessible dialog behavior
  const drawerRef = useFocusTrap(isCartOpen, () => setIsCartOpen(false));

  if (!isCartOpen) return null;

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 250);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const freeDelivery = subtotal > 300;
  const remaining = Math.max(0, 300 - subtotal);

  return (
    <div
      ref={drawerRef}
      className="fixed inset-0 z-50 overflow-hidden font-display"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-farmGreen-950/70 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md flex flex-col bg-[#F5F8F5] shadow-2xl animate-slideLeft">

          {/* ── Header ── */}
          <div className="bg-gradient-to-br from-[#071a0b] via-[#0d2516] to-[#183D22] p-5 border-b border-white/10 shrink-0 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-farmGreen-700 flex items-center justify-center shadow-md border border-emerald-400/30">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 id="drawer-title" className="font-extrabold text-base text-white tracking-tight">
                    Your Harvest Basket
                  </h3>
                  <p className="text-[11px] text-emerald-300 font-bold">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} · Farm-Direct Produce
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Close harvest basket drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free delivery progress */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <div className="flex items-center gap-1.5">
                  <Truck className={`w-3.5 h-3.5 ${freeDelivery ? 'text-amber-300' : 'text-emerald-300'}`} />
                  <span className={freeDelivery ? 'text-amber-300 font-extrabold' : 'text-emerald-100'}>
                    {freeDelivery ? '🎉 FREE Express Delivery Unlocked!' : `Add ${formatCurrency(remaining, currencySymbol)} more for FREE delivery`}
                  </span>
                </div>
                <span className="text-white/60 text-[11px] font-mono">
                  {formatCurrency(subtotal, currencySymbol)}/{formatCurrency(300, currencySymbol)}
                </span>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-300 transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min((subtotal / 300) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Cart Items List ── */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-base text-farmGreen-950 mb-1">Your basket is empty</h4>
                <p className="text-xs text-farmMuted mb-6 font-medium">Add fresh organic fruits, veggies, and grains to get started.</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    const el = document.getElementById('marketplace');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-farmGreen-700 hover:from-emerald-500 hover:to-farmGreen-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Browse Fresh Marketplace
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all duration-300 ${
                    removingId === product.id ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100'
                  }`}
                >
                  {/* Product image */}
                  <div className="relative shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl border border-gray-100"
                      loading="lazy"
                    />
                    {product.organic && (
                      <span className="absolute -bottom-1.5 -left-1.5 bg-gradient-to-r from-lime-400 to-emerald-500 text-farmGreen-950 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                        100%
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold text-xs text-farmGreen-950 truncate">
                      {product.name}
                    </h5>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                      {formatCurrency(product.price, currencySymbol)}/{product.unit} · {product.farmerName || 'Local Farm'}
                    </p>
                    <div className="font-black text-xs text-emerald-700 mt-1">
                      {formatCurrency(product.price * quantity, currencySymbol)}
                    </div>
                  </div>

                  {/* Qty stepper with large touch targets */}
                  <div className="flex items-center gap-1 bg-emerald-50/70 p-1 rounded-xl border border-emerald-200/60 shrink-0">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 flex items-center justify-center text-xs font-bold transition-all shadow-2xs cursor-pointer border border-emerald-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-farmGreen-950">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-farmGreen-700 text-white flex items-center justify-center text-xs font-bold transition-all shadow-2xs hover:brightness-110 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 border border-rose-200 flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title="Remove item"
                    aria-label={`Remove ${product.name} from basket`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ── Footer Checkout Block ── */}
          {cartItems.length > 0 && (
            <div className="bg-white border-t border-emerald-900/10 p-5 shrink-0 shadow-lg">

              {/* Price summary */}
              <div className="bg-[#F8FAF8] rounded-2xl p-3.5 border border-emerald-900/10 mb-3.5 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-farmGreen-950">{formatCurrency(subtotal, currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold items-center">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <Truck className={`w-3 h-3 ${freeDelivery ? 'text-emerald-600' : 'text-gray-400'}`} /> Delivery Fee
                  </span>
                  <span className={`font-black ${freeDelivery ? 'text-emerald-600' : 'text-farmGreen-950'}`}>
                    {freeDelivery ? 'FREE 🎉' : formatCurrency(deliveryFee, currencySymbol)}
                  </span>
                </div>
                <div className="h-px bg-emerald-900/10 my-1" />
                <div className="flex justify-between items-center text-sm font-extrabold text-farmGreen-950">
                  <span>Total Amount</span>
                  <span className="text-lg text-emerald-700 font-black">{formatCurrency(total, currencySymbol)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mb-3.5">
                {[
                  { icon: ShieldCheck, text: 'Secure Checkout' },
                  { icon: Leaf, text: '100% Farm Fresh' },
                  { icon: Truck, text: 'Fast Delivery' },
                ].map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="flex items-center justify-center gap-1 bg-emerald-50/60 border border-emerald-200/50 rounded-lg p-1.5 text-center">
                      <Icon className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="text-[9px] font-black text-emerald-900 truncate">{b.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-farmGreen-500 hover:from-lime-300 hover:to-emerald-400 text-farmGreen-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-farmGreen-950" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-farmGreen-950" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

