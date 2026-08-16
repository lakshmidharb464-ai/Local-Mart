import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingCart, 
  MapPin, 
  Sprout, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Plus, 
  Minus, 
  Award,
  Zap,
  Info
} from 'lucide-react';

export const ProduceDetailModal = ({ product, onClose, toggleWishlist, isWishlisted, setActiveTab }) => {
  const { addToCart } = useCart();
  const { showToast } = useAuth();

  const [selectedPack, setSelectedPack] = useState({ size: '1', multiplier: 1, label: `1 ${product.unit}`, discount: 0 });
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const packOptions = [
    { size: '1', multiplier: 1, label: `1 ${product.unit}`, discount: 0 },
    { size: '2', multiplier: 2, label: `2 ${product.unit}s (5% OFF)`, discount: 0.05 },
    { size: '5', multiplier: 5, label: `5 ${product.unit}s (15% OFF)`, discount: 0.15 },
  ];

  const basePricePerUnit = product.price;
  const unitDiscountedPrice = basePricePerUnit * (1 - selectedPack.discount);
  const itemTotal = Math.round(unitDiscountedPrice * selectedPack.multiplier * quantity);

  const handleAddToCart = () => {
    // Add item with specified pack size & quantity to cart
    for (let i = 0; i < quantity * selectedPack.multiplier; i++) {
      addToCart(product);
    }
    if (showToast) {
      showToast('Added to Basket! 🧺', `${quantity} × ${selectedPack.label} of ${product.name} added to cart.`);
    }
  };

  const handleInstantBuyNow = () => {
    handleAddToCart();
    onClose();
    if (setActiveTab) setActiveTab('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" style={{ background: 'rgba(5,15,8,0.75)', backdropFilter: 'blur(16px)' }}>
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden relative max-h-[90vh] flex flex-col" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,240,96,0.15)' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, zIndex: 20, width: 34, height: 34, borderRadius: '50%', background: 'rgba(5,15,8,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.8)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(5,15,8,0.75)'}
        >
          <X style={{ width: 15, height: 15 }} />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Top Grid: Image + Farm Provenance Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Image Preview */}
            <div className="relative h-64 md:h-full rounded-3xl overflow-hidden bg-farmBg border border-emerald-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 left-3 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  isWishlisted ? 'bg-rose-500 text-white shadow-md' : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20 text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-300 font-bold text-[11px] uppercase tracking-wider">
                  <span>Harvest Freshness Gauge</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>98% Fresh</span>
                  </span>
                </div>
                <div className="text-[11px] text-white/80 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Harvested: {product.harvestDate || 'Today 5:30 AM'}</span>
                </div>
              </div>
            </div>

            {/* Right Product Details & Farm Provenance */}
            <div className="space-y-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-farmGreen-900 text-emerald-300">
                  {product.category}
                </span>
                <h2 className="font-display font-extrabold text-2xl text-farmGreen-900 mt-2 leading-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating} ({product.reviewsCount || 142} Reviews)</span>
                  </div>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    100% Organic Certified
                  </span>
                </div>
              </div>

              {/* Farmer Provenance Card */}
              <div className="p-3.5 bg-gradient-to-r from-farmBg to-emerald-50/40 rounded-2xl border border-emerald-100/80 space-y-2 text-xs">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farm Origin & Provenance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center border-2 border-white shrink-0 shadow-sm">
                    {product.farmerName ? product.farmerName.charAt(0) : 'R'}
                  </div>
                  <div>
                    <div className="font-extrabold text-farmGreen-900 text-sm">{product.farmerName || 'Rajesh Kumar'}</div>
                    <div className="text-[11px] text-farmMuted flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{product.farmerLocation || 'Pune Rural Hub'} (4.2 km away)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-farmMuted leading-relaxed">
                {product.description || 'Vine-ripened organic produce harvested without synthetic pesticides directly from village farms.'}
              </p>
            </div>
          </div>

          {/* Pack Size Selector (Buy First Concept) */}
          <div className="p-5 bg-farmBg rounded-3xl border border-emerald-100/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-farmGreen-900 uppercase tracking-wider">Select Pack Quantity & Savings</span>
              <span className="text-emerald-700 font-bold">Standard Price: ₹{product.price}/{product.unit}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {packOptions.map((pack) => {
                const isSelected = selectedPack.size === pack.size;
                return (
                  <button
                    key={pack.size}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    style={{
                      padding: '12px 8px', borderRadius: 16, textAlign: 'center',
                      cursor: 'pointer', transition: 'all .22s cubic-bezier(.22,1,.36,1)',
                      border: isSelected ? 'none' : '1.5px solid #e0ece0',
                      background: isSelected
                        ? 'linear-gradient(135deg,#2e7d32,#1b5e20)'
                        : '#fff',
                      color: isSelected ? '#fff' : '#0d2214',
                      boxShadow: isSelected
                        ? '0 6px 20px rgba(46,125,50,0.35), 0 0 0 3px rgba(168,240,96,0.25)'
                        : '0 1px 4px rgba(0,0,0,0.06)',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 11, marginBottom: 4 }}>{pack.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: isSelected ? '#a8f060' : '#2e7d32' }}>
                      ₹{Math.round(basePricePerUnit * (1 - pack.discount) * pack.multiplier)}
                    </div>
                    {pack.discount > 0 && (
                      <div style={{ fontSize: 9, fontWeight: 800, marginTop: 3, background: isSelected ? 'rgba(168,240,96,0.2)' : '#f0faf0', color: isSelected ? '#a8f060' : '#2e7d32', padding: '1px 6px', borderRadius: 99, display: 'inline-block' }}>
                        {(pack.discount * 100).toFixed(0)}% OFF
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quantity +/- Control */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/80 text-xs">
              <span className="font-bold text-farmGreen-900">Number of Packs:</span>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-farmBg flex items-center justify-center text-farmGreen-900 hover:bg-gray-200 cursor-pointer font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-display font-extrabold text-sm text-farmGreen-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 cursor-pointer font-bold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <div>
              <div className="text-[10px] font-bold uppercase text-farmMuted">Calculated Total</div>
              <div className="font-display font-extrabold text-2xl text-farmGreen-900">
                ₹{itemTotal}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAddToCart}
                style={{ flex: 1, padding: '12px 20px', borderRadius: 16, background: '#f0faf0', border: '1.5px solid #c8e6c9', color: '#2e7d32', fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all .22s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2e7d32'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(46,125,50,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0faf0'; e.currentTarget.style.color = '#2e7d32'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <ShoppingCart style={{ width: 15, height: 15 }} />
                <span>+ Add to Basket</span>
              </button>

              <button
                type="button"
                onClick={handleInstantBuyNow}
                style={{ flex: 1, padding: '12px 20px', borderRadius: 16, background: 'linear-gradient(135deg,#FF9800,#F57C00)', color: '#fff', fontWeight: 900, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 6px 22px rgba(255,152,0,0.4)', transition: 'all .22s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 32px rgba(255,152,0,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 22px rgba(255,152,0,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Zap style={{ width: 14, height: 14, fill: '#fff' }} />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
