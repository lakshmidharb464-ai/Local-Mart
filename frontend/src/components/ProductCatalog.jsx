import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { useCart } from '../context/CartContext';
import {
  Search,
  Star,
  Plus,
  Check,
  Sparkles,
  Carrot,
  Apple,
  Milk,
  ShoppingBag,
  MapPin,
  Calendar,
  Minus,
  Leaf,
  X
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PrdModal } from './PrdModal';

export const ProductCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, cartItems, updateQuantity } = useCart();

  const [headerRef, headerVisible] = useScrollReveal();
  const [controlsRef, controlsVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal();

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'Vegetables': return Carrot;
      case 'Fruits': return Apple;
      case 'Dairy': return Milk;
      case 'Grocery': return ShoppingBag;
      default: return Sparkles;
    }
  };

  const getCategoryCount = (catId) => {
    if (catId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter(p => p.category === catId).length;
  };

  const filteredProducts = PRODUCTS.filter(prod => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartItem = (productId) => cartItems.find(item => item.product.id === productId);
  const getCartQty = (productId) => getCartItem(productId)?.quantity || 0;

  const handleQtyChange = (product, delta) => {
    const item = getCartItem(product.id);
    if (!item && delta > 0) { addToCart(product); return; }
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      updateQuantity ? updateQuantity(product.id, 0) : addToCart(product); // fallback
    } else {
      updateQuantity ? updateQuantity(product.id, newQty) : addToCart(product);
    }
  };

  return (
    <section id="marketplace" className="py-28 bg-white relative overflow-hidden">

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.04) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-12 reveal ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-farmGreen-800 bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 rounded-full shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            DIRECT FARM-TO-CONSUMER MARKETPLACE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-farmGreen-900 mt-5 mb-4 leading-tight">
            Fresh Harvested Today,{' '}
            <span className="gradient-text">On Your Table Tonight</span>
          </h2>
          <p className="text-farmMuted text-base sm:text-lg leading-relaxed">
            Shop 100% organic produce directly from verified local farm families in Andhra Pradesh & Maharashtra. Zero middleman markup, guaranteed farm freshness.
          </p>
        </div>

        {/* Controls Bar Card */}
        <div
          ref={controlsRef}
          className={`bg-farmBg/80 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-farmGreen-700/15 shadow-farm-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-10 reveal ${controlsVisible ? 'visible' : ''}`}
        >
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            {CATEGORIES.map(cat => {
              const Icon = getCategoryIcon(cat.id);
              const isActive = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 text-white shadow-md ring-2 ring-emerald-400/40 font-extrabold scale-102'
                      : 'bg-white text-farmMuted border border-gray-200/80 hover:bg-emerald-50 hover:text-farmGreen-900 hover:border-emerald-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
            <input
              type="text"
              placeholder="Search produce or farmer location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs font-semibold text-farmGreen-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all font-body placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-farmGreen-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-farmGreen-50 rounded-3xl border-2 border-dashed border-farmGreen-200">
            <Sparkles className="w-10 h-10 text-farmGreen-300 mx-auto mb-3" />
            <p className="text-farmMuted font-semibold font-display">No products match your search or filter.</p>
            <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="mt-3 text-sm text-farmGreen-700 underline font-bold cursor-pointer">
              Clear filters
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product, idx) => {
              const inCartQty = getCartQty(product.id);
              const delays = ['delay-100','delay-150','delay-200','delay-250','delay-300','delay-400','delay-500','delay-600'];
              return (
                <div
                  key={product.id}
                  className={`bg-white border border-farmGreen-700/10 rounded-3xl overflow-hidden flex flex-col group card-hover reveal ${gridVisible ? 'visible' : ''} ${delays[idx % delays.length]}`}
                  style={{ boxShadow: '0 2px 14px rgba(15,40,24,0.06)' }}
                >
                  {/* Image with Robust onError fallback */}
                  <div className="relative h-52 overflow-hidden bg-farmGreen-50 img-zoom cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-farmGreen-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {product.organic && (
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-emerald-800 shadow-md flex items-center gap-1 border border-emerald-200">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        100% Organic
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 bg-farmGreen-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{product.harvestDate}</span>
                    </div>

                    {/* Quick view on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/95 text-farmGreen-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-xl transform group-hover:scale-105 transition-transform flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{product.farmerName} · {product.farmerLocation}</span>
                      </div>

                      <h3 className="font-display font-extrabold text-base text-farmGreen-900 mb-1.5 group-hover:text-farmGreen-700 transition-colors line-clamp-1 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        {product.name}
                      </h3>

                      <p className="text-xs text-farmMuted line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      {/* Stock & Rating & Price */}
                      <div className="flex items-center justify-between pt-3 border-t border-farmGreen-100/70 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-farmGreen-900 text-xs">{product.rating}</span>
                          <span className="text-farmMuted text-[11px]">({product.reviewsCount})</span>
                        </div>
                        <div className="font-display font-extrabold text-lg text-farmGreen-900">
                          ₹{product.price}
                          <span className="text-xs font-normal text-farmMuted">/{product.unit}</span>
                        </div>
                      </div>

                      {/* Add to Cart / Qty Controls */}
                      {inCartQty > 0 ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-full p-1.5">
                          <button
                            onClick={() => handleQtyChange(product, -1)}
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-farmGreen-700 hover:bg-farmGreen-700 hover:text-white transition-all cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-display font-extrabold text-xs text-emerald-900">{inCartQty} in basket</span>
                          <button
                            onClick={() => handleQtyChange(product, 1)}
                            className="w-8 h-8 rounded-full bg-farmGreen-700 flex items-center justify-center shadow-sm text-white hover:bg-farmGreen-800 transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full py-2.5 rounded-full font-display font-bold text-xs flex items-center justify-center gap-2 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-md"
                          style={{ background: 'linear-gradient(135deg, #2E7D32, #388E3C)', boxShadow: '0 4px 12px rgba(46,125,50,0.25)' }}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add to Basket</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <PrdModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
};
