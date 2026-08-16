import React from 'react';
import { useCart } from '../../context/CartContext';
import { Heart, Trash2, ShoppingCart, Sprout, Star, ArrowRight } from 'lucide-react';

export const CustomerWishlist = ({ wishlist, toggleWishlist, setActiveTab }) => {
  const { addToCart } = useCart();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl shadow-farm-md" style={{ background: 'linear-gradient(135deg, #071a0b 0%, #0d2214 50%, #1b3a1f 100%)', border: '1px solid rgba(168,240,96,0.12)' }}>
        <div>
          <h2 className="font-display font-extrabold text-2xl" style={{ color: '#fff' }}>My Saved Wishlist</h2>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Bookmark your favorite village farm crops for quick re-ordering · {wishlist.length} items saved</p>
        </div>

        <button
          onClick={() => setActiveTab('products')}
          className="px-5 py-2.5 rounded-2xl text-xs font-black font-display shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg,#a8f060,#6fcf37)', color: '#071a0b' }}
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Wishlist Items Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((prod) => (
            <div key={prod.id} className="bg-white rounded-3xl p-4 flex flex-col justify-between space-y-3 card-hover" style={{ border: '1.5px solid #f0f4f0', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div className="space-y-3">
                <div className="relative h-40 rounded-2xl overflow-hidden bg-farmBg">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0F2818] text-emerald-300 shadow-sm">
                    {prod.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-sm text-farmGreen-950 line-clamp-1">{prod.name}</h3>
                  <div className="text-[11px] text-farmMuted font-semibold mt-1 flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{prod.farmerName}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="font-display font-extrabold text-base text-farmGreen-950">
                      ₹{prod.price} <span className="text-xs font-normal text-farmMuted">/{prod.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{prod.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => addToCart(prod)}
                  className="flex-1 py-2.5 rounded-2xl text-xs font-black font-display flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#2e7d32,#1b5e20)', color: '#fff', boxShadow: '0 4px 14px rgba(46,125,50,0.28)' }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>+ Add to Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(prod)}
                  className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-2xl border border-rose-100 transition-colors cursor-pointer hover:scale-110"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald-100/80 p-12 text-center space-y-4 shadow-farm-sm font-display">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-farmGreen-950">Your Wishlist is Empty</h3>
            <p className="text-xs text-farmMuted font-medium mt-1">Save your favorite organic produce to order them quickly anytime.</p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="px-6 py-2.5 bg-[#0F2818] hover:bg-emerald-950 text-white rounded-2xl text-xs font-black shadow-md border border-emerald-500 cursor-pointer active:scale-95 transition-all"
          >
            Browse Harvest Products
          </button>
        </div>
      )}
    </div>
  );
};
