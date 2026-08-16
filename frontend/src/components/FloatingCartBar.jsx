import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, Sparkles, Zap, Leaf } from 'lucide-react';

export const FloatingCartBar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { cartItems, subtotal, setIsCartOpen } = useCart();
  const [hov, setHov] = useState(false);
  const [bump, setBump] = useState(false);
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
      setTimeout(() => setBump(false), 500);
    }
    prevCount.current = totalItemsCount;
  }, [totalItemsCount]);

  if (activeTab === 'cart' || cartItems.length === 0) return null;

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

  return (
    <>
      <style>{`
        @keyframes slideUpCart {
          from { opacity: 0; transform: translateX(-50%) translateY(30px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes badgeBumpCart {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.4); }
        }
        @keyframes shimmerGreen {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-[580px] px-4 font-display"
        style={{
          animation: 'slideUpCart 0.45s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        {/* Free Delivery Top Progress Bar */}
        {!freeDelivery && (
          <div className="bg-[#071a0b]/95 backdrop-blur-xl border border-lime-400/20 border-b-0 rounded-t-2xl px-5 py-2 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-black text-gray-300">
              <span>
                Add <span className="text-lime-300 font-extrabold">₹{remaining}</span> more for <span className="text-lime-300">FREE Delivery 🎉</span>
              </span>
              <Leaf className="w-3.5 h-3.5 text-lime-300 animate-pulse" />
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 300) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Floating Container matching User Screenshot */}
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          className={`bg-gradient-to-r from-[#06180a] via-[#0b2413] to-[#06180a] text-white p-3.5 sm:p-4 shadow-2xl border border-emerald-500/30 transition-all duration-300 flex items-center justify-between gap-3 ${
            freeDelivery ? 'rounded-3xl' : 'rounded-b-3xl'
          } ${hov ? 'scale-[1.01] -translate-y-1 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-emerald-400/50' : ''}`}
        >

          {/* Left Section: Icon + Price info */}
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            
            {/* Green Icon Box with Orange Badge */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center shadow-lg border border-emerald-400/30">
                <ShoppingBag className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              
              <span 
                className={`absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] rounded-full bg-amber-500 text-white text-[11px] font-black flex items-center justify-center border-2 border-[#06180a] shadow-md ${
                  bump ? 'scale-125' : ''
                } transition-transform`}
              >
                {totalItemsCount}
              </span>
            </div>

            {/* Price & Details */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-[10px] font-black text-lime-400 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Harvest Basket Total</span>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30 text-[10px] font-black flex items-center gap-1">
                  <span>Free Delivery</span>
                  <span>🎉</span>
                </span>
              </div>

              <div className="font-black text-2xl text-white leading-none tracking-tight">
                ₹{totalPrice.toLocaleString()}
              </div>

              <div className="text-[11px] text-gray-300 font-bold flex items-center gap-1.5">
                <span>{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Free delivery</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right Action Button matching Screenshot */}
          <button
            onClick={handleOpenCart}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-lime-400 via-lime-300 to-lime-400 hover:from-lime-300 hover:to-lime-200 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-lime-200 shrink-0"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span className="whitespace-nowrap">View Basket & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </>
  );
};

export default FloatingCartBar;
