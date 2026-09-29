import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, Sparkles, Zap, Leaf, ChevronDown, ChevronUp } from 'lucide-react';

export const FloatingCartBar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { cartItems, subtotal, setIsCartOpen } = useCart();
  const [hov, setHov] = useState(false);
  const [bump, setBump] = useState(false);
  // Default to minimized on customer dashboard (activeTab is provided)
  const [isMinimized, setIsMinimized] = useState(!!activeTab);
  const prevCount = useRef(0);

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    return sum + price * item.quantity;
  }, 0);

  // Animate badge bump when items are added
  useEffect(() => {
    if (totalItemsCount > prevCount.current) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 500);
      return () => clearTimeout(timer);
    }
    prevCount.current = totalItemsCount;
  }, [totalItemsCount]);

  if (activeTab === 'cart' || activeTab === 'settings' || activeTab === 'profile' || cartItems.length === 0) return null;

  const freeDelivery = subtotal > 300;
  const remaining = freeDelivery ? 0 : 300 - subtotal;

  const handleOpenCart = () => {
    if (setActiveTab) {
      setActiveTab('cart');
    }
    navigate('/customer/cart');
    if (setIsCartOpen) {
      setIsCartOpen(true);
    }
  };

  const handleToggleDrawer = (e) => {
    e.stopPropagation();
    if (setIsCartOpen) {
      setIsCartOpen(true);
    }
  };

  return (
    <>
      {/* ── Minimized Compact FAB Pill (Bottom Right) ── */}
      {isMinimized ? (
        <div
          className="fixed bottom-6 right-5 z-40 safe-bottom animate-slideInRight"
          role="region"
          aria-label="Floating Basket Summary"
        >
          <div
            className="flex items-center gap-0 rounded-full shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 bg-gradient-to-br from-[#071a0b] to-[#183D22] border border-emerald-500/40"
          >
            {/* Cart icon + badge — click opens drawer */}
            <button
              onClick={handleToggleDrawer}
              className="relative flex items-center justify-center w-11 h-11 shrink-0 transition-all active:scale-90 cursor-pointer bg-gradient-to-r from-emerald-600 to-farmGreen-600"
              title="Open cart drawer"
              aria-label={`Open harvest basket with ${totalItemsCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {/* Count badge */}
              <span
                className={`absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] rounded-full text-farmGreen-950 bg-amber-400 text-[9px] font-black flex items-center justify-center border border-[#0A2312] transition-transform duration-300 ${
                  bump ? 'scale-125' : 'scale-100'
                }`}
              >
                {totalItemsCount}
              </span>
            </button>

            {/* Price — click goes to cart page */}
            <button
              onClick={handleOpenCart}
              className="flex flex-col items-start px-3 py-1 cursor-pointer focus:outline-none"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                Basket
              </span>
              <span className="text-sm font-black text-white leading-tight">
                ₹{totalPrice.toLocaleString()}
              </span>
            </button>

            {/* Expand chevron */}
            <button
              onClick={() => setIsMinimized(false)}
              className="flex items-center justify-center w-8 h-11 cursor-pointer transition-all hover:bg-white/10 text-emerald-300"
              title="Expand cart bar"
              aria-label="Expand basket details"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ── Full Expanded Floating Bar ── */
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-[580px] px-4 font-display safe-bottom animate-slideUp"
          role="region"
          aria-label="Expanded Harvest Basket Notification"
        >
          {/* Free Delivery Top Progress Bar */}
          {!freeDelivery && (
            <div className="bg-[#071a0b]/95 backdrop-blur-xl border border-emerald-500/30 border-b-0 rounded-t-2xl px-5 py-2 flex flex-col gap-1.5 shadow-lg">
              <div className="flex items-center justify-between text-[11px] font-black text-emerald-100">
                <span>
                  Add <span className="text-amber-400 font-extrabold">₹{remaining}</span> more for <span className="text-emerald-300">FREE Express Delivery 🎉</span>
                </span>
                <Leaf className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-lime-400 to-amber-400 transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  style={{ width: `${Math.min((subtotal / 300) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Floating Container */}
          <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            className={`relative bg-gradient-to-r from-[#071a0b] via-[#103817] to-[#071a0b] text-white p-3.5 sm:p-4 shadow-2xl border border-emerald-500/40 ring-1 ring-white/10 transition-all duration-300 flex items-center justify-between gap-3 ${
              freeDelivery ? 'rounded-3xl' : 'rounded-b-3xl'
            } ${hov ? 'scale-[1.01] -translate-y-1 shadow-[0_24px_70px_rgba(10,35,18,0.7)] border-emerald-400/60' : ''}`}
          >
            {/* Minimize Bar Control */}
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-[#071a0b] hover:bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-md transition-all cursor-pointer z-10"
              title="Minimize Floating Cart Bar"
              aria-label="Minimize floating cart bar"
            >
              <span>Minimize</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Left Section: Icon Box + Price info */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">

              {/* Green Icon Box with Orange Badge (Clicking opens Quick Drawer!) */}
              <div 
                onClick={handleToggleDrawer}
                className="relative shrink-0 group/bag cursor-pointer"
                title="Click to open Quick Cart Drawer"
                role="button"
                tabIndex={0}
                aria-label="Open Cart Drawer"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-farmGreen-700 flex items-center justify-center shadow-lg border border-emerald-400/40 group-hover/bag:scale-105 active:scale-95 transition-all duration-300">
                  <ShoppingBag className="w-6 h-6 text-white stroke-[2.2]" />
                </div>

                <span
                  className={`absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] rounded-full bg-amber-400 text-farmGreen-950 text-[11px] font-black flex items-center justify-center border-2 border-[#071a0b] shadow-md transition-all duration-300 ${
                    bump ? 'scale-125' : ''
                  }`}
                >
                  {totalItemsCount}
                </span>
              </div>

              {/* Price & Details */}
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Harvest Basket Total</span>
                  </div>

                  {freeDelivery ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-black flex items-center gap-1">
                      <span>Free Delivery</span>
                      <span>🎉</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-emerald-200/80 border border-white/10 text-[10px] font-black flex items-center gap-1">
                      <span>Standard Shipping</span>
                    </span>
                  )}
                </div>

                <div className="font-black text-2xl text-white leading-none tracking-tight">
                  ₹{totalPrice.toLocaleString()}
                </div>

                <div className="text-[11px] text-emerald-200/90 font-bold flex items-center gap-1.5">
                  <span>{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}</span>
                  <span>•</span>
                  {freeDelivery ? (
                    <span className="text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Free delivery</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>+₹30 Delivery Fee</span>
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Right Action Button */}
            <button
              onClick={handleOpenCart}
              className="group px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-farmGreen-600 hover:from-emerald-500 hover:to-farmGreen-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.03] active:scale-97 transition-all duration-300 cursor-pointer border border-emerald-400/40 shrink-0"
            >
              <Zap className="w-4 h-4 fill-white group-hover:scale-110 transition-transform duration-300" />
              <span className="whitespace-nowrap font-black">View & Checkout</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default FloatingCartBar;

