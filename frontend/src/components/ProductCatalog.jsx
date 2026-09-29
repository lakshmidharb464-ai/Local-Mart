import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { useCart } from '../context/CartContext';
import { useMarketplace } from '../context/MarketplaceContext';
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
  X,
  Package,
  Clock,
  Flame
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PrdModal } from './PrdModal';
import { Button } from './ui/Button';

export const ProductCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { products } = useMarketplace();

  const [headerRef, headerVisible] = useScrollReveal();
  const [controlsRef, controlsVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal();

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'Organic Veggies':
      case 'Vegetables':
        return Carrot;
      case 'Seasonal Picks':
      case 'Fruits':
        return Sparkles;
      case 'Dairy & Eggs':
      case 'Dairy':
        return Milk;
      case 'Bulk Farm Boxes':
        return Package;
      case 'Grocery & Oils':
      case 'Grocery':
        return ShoppingBag;
      default:
        return Sparkles;
    }
  };

  const getCategoryCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter(p => p.category === catId).length;
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter(prod => {
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        (prod.name && prod.name.toLowerCase().includes(q)) ||
        (prod.farmerName && prod.farmerName.toLowerCase().includes(q)) ||
        (prod.farmerLocation && prod.farmerLocation.toLowerCase().includes(q)) ||
        (prod.category && prod.category.toLowerCase().includes(q))
      );
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const getCartItem = (productId) => cartItems.find(item => item.product.id === productId);
  const getCartQty = (productId) => getCartItem(productId)?.quantity || 0;

  const handleQtyChange = (product, delta) => {
    const item = getCartItem(product.id);
    if (!item && delta > 0) {
      addToCart(product, 1);
      return;
    }
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, newQty);
    }
  };

  return (
    <section id="marketplace" aria-label="Marketplace Produce Catalog" className="py-24 sm:py-28 bg-[#FAFAF9] relative overflow-hidden">

      {/* Ambient background decoration */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 reveal ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-4 py-1.5 rounded-full shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            DIRECT FARM-TO-CONSUMER MARKETPLACE
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-gray-900 mt-4 mb-3 leading-tight tracking-tight">
            Fresh Harvested Today,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-farmGreen-600">
              On Your Table Tonight
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Order 100% organic produce directly from verified local growers. Zero middlemen, fair compensation for farmers, and guaranteed peak nutrient value.
          </p>
        </div>

        {/* Interactive Controls Bar Card */}
        <div
          ref={controlsRef}
          className={`bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-gray-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 mb-10 reveal ${controlsVisible ? 'visible' : ''}`}
        >
          {/* Category Discovery Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1" role="tablist" aria-label="Product Categories">
            {CATEGORIES.map(cat => {
              const Icon = getCategoryIcon(cat.id);
              const isActive = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${isActive
                      ? 'bg-gradient-to-r from-emerald-700 to-farmGreen-700 text-white shadow-md font-extrabold scale-102'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50/80 hover:text-emerald-900 hover:border-emerald-300'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Accessible Real-time Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <label htmlFor="marketplace-search-input" className="sr-only">Search produce or farmer</label>
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
            <input
              id="marketplace-search-input"
              type="text"
              placeholder="Filter produce, location, or farm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear Search"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-800 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-emerald-50/50 rounded-3xl border-2 border-dashed border-emerald-200">
            <Sparkles className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="text-gray-700 font-bold font-display text-base">No produce matching your current filter.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => {
              const inCartQty = getCartQty(product.id);
              const isLowStock = product.stock && product.stock <= 15;
              const delays = ['delay-100', 'delay-150', 'delay-200', 'delay-250', 'delay-300', 'delay-400', 'delay-500', 'delay-600'];

              return (
                <div
                  key={product.id}
                  className={`bg-white border border-gray-200/90 rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 reveal ${gridVisible ? 'visible' : ''} ${delays[idx % delays.length]}`}
                >
                  {/* Image Container with Badges */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Quick view ${product.name}`}
                    className="relative h-52 overflow-hidden bg-emerald-50/50 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                    onClick={() => setSelectedProduct(product)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProduct(product);
                      }
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

                    {/* Badges: Organic & Category */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.organic && (
                        <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-emerald-800 shadow-md flex items-center gap-1 border border-emerald-200">
                          <Leaf className="w-3 h-3 text-emerald-600" />
                          100% Organic
                        </span>
                      )}
                      {product.category === 'Bulk Farm Boxes' && (
                        <span className="bg-amber-500/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black text-white shadow-md flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          20% Bulk Saver
                        </span>
                      )}
                    </div>

                    {/* Harvest Freshness Tag */}
                    <div className="absolute bottom-3 left-3 bg-gray-950/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{product.harvestDate || 'Harvested Today'}</span>
                    </div>

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <span className="bg-white/95 text-gray-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-2xl transform group-hover:scale-105 transition-transform flex items-center gap-1.5 border border-emerald-100">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Farmer location & Distance */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 mb-1.5">
                        <div className="flex items-center gap-1 truncate max-w-[70%]">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{product.farmerName} · {product.farmerLocation}</span>
                        </div>
                        {product.distanceKm && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                            {product.distanceKm} km
                          </span>
                        )}
                      </div>

                      <h3
                        role="button"
                        tabIndex={0}
                        aria-label={`View details for ${product.name}`}
                        className="font-display font-bold text-base text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
                        onClick={() => setSelectedProduct(product)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedProduct(product);
                          }
                        }}
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      {/* Real-time Stock indicator */}
                      <div className="mb-2.5">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Low stock: Only {product.stock} {product.unit} left!
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            <Check className="w-3 h-3 text-emerald-600" />
                            In Stock ({product.stock} {product.unit} available)
                          </span>
                        )}
                      </div>

                      {/* Category Tag & Price Row */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mb-4">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {product.category}
                        </span>
                        <div className="font-display font-black text-lg text-gray-900">
                          ₹{product.price}
                          <span className="text-xs font-normal text-gray-500">/{product.unit}</span>
                        </div>
                      </div>

                      {/* Add to Basket / Quantity Stepper */}
                      {inCartQty > 0 ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-1.5">
                          <button
                            aria-label={`Decrease quantity of ${product.name}`}
                            onClick={() => handleQtyChange(product, -1)}
                            className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all cursor-pointer active:scale-95"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-display font-extrabold text-xs text-emerald-950">
                            {inCartQty} in basket
                          </span>
                          <button
                            aria-label={`Increase quantity of ${product.name}`}
                            onClick={() => handleQtyChange(product, 1)}
                            className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center shadow-xs text-white hover:bg-emerald-800 transition-all cursor-pointer active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full justify-center !rounded-2xl !bg-emerald-700 hover:!bg-emerald-600 font-extrabold shadow-sm"
                          onClick={() => addToCart(product)}
                          icon={Plus}
                        >
                          Add to Basket
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <PrdModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
};

export default ProductCatalog;
