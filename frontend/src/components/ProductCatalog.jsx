import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Flame,
  ArrowRight
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Button } from './ui/Button';

export const ProductCatalog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { products } = useMarketplace();

  const [headerRef, headerVisible] = useScrollReveal();
  const [controlsRef, controlsVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal();

  // Listen for search triggers from HeroSection or Navbar
  React.useEffect(() => {
    const handleSetSearch = (e) => {
      if (typeof e.detail === 'string') {
        setSearchQuery(e.detail);
        if (e.detail) {
          setSelectedCategory('all');
        }
      }
    };
    window.addEventListener('localfarm:set-search', handleSetSearch);
    return () => window.removeEventListener('localfarm:set-search', handleSetSearch);
  }, []);

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
    return products.filter((p) => p.category === catId).length;
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.farmer && p.farmer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getCartQty = (productId) => {
    const item = cartItems.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleQtyChange = (product, change) => {
    const current = getCartQty(product.id);
    updateQuantity(product.id, current + change);
  };

  return (
    <section id="marketplace" className="py-24 bg-gradient-to-b from-farmBg via-white to-farmBg relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-14 reveal ${headerVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-4 border border-emerald-200 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm-Fresh Harvest Marketplace</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-tight">
            Picked at Dawn. <span className="text-emerald-700">Delivered by Dusk.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
            Support local organic growers across Pune with hyper-fresh produce harvested to order with transparent farm pricing.
          </p>
        </div>

        {/* Controls: Search Bar & Horizontal Category Filter */}
        <div ref={controlsRef} className={`space-y-6 mb-12 reveal ${controlsVisible ? 'visible' : ''}`}>
          
          {/* Live Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search farm-fresh tomatoes, mangoes, pure A2 milk, raw honey..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills with Mobile Scroll Cue */}
          <div className="relative">
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-2 scroll-smooth scroll-mask-right sm:[mask-image:none]">
              {CATEGORIES.map((cat) => {
                const Icon = getCategoryIcon(cat.id);
                const count = getCategoryCount(cat.id);
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20 scale-102 border border-emerald-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100/80 border border-gray-200 shadow-2xs'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white/90 backdrop-blur-md rounded-3xl border border-emerald-900/10 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <Carrot className="w-8 h-8 text-emerald-600 animate-bounce" />
            </div>
            <h3 className="text-gray-900 font-extrabold font-display text-base">No harvest items found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              {searchQuery ? `We couldn't find anything matching "${searchQuery}".` : 'No products available in this category.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-farmGreen-700 hover:from-emerald-500 hover:to-farmGreen-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              Reset All Filters
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
                  {/* Direct Link to Product Details */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${product.name}`}
                    className="relative h-52 overflow-hidden bg-emerald-50/50 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                    onClick={() => navigate(`/products/${product.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/products/${product.id}`);
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

                    {/* Stock Alert Pill */}
                    {isLowStock && (
                      <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                        Only {product.stock} left!
                      </div>
                    )}

                    {/* Quick Info Bar Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span className="truncate max-w-[120px]">{product.farmName || product.farmer || 'Pune Valley Farm'}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-emerald-300">
                        <Calendar className="w-3 h-3" />
                        <span>Fresh</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-extrabold text-emerald-700 tracking-wider uppercase">
                          {product.category || 'Farm Produce'}
                        </span>
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span className="text-[11px] font-black text-amber-900 font-mono">
                            {product.rating || '4.9'}
                          </span>
                        </div>
                      </div>

                      <h3
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="font-display font-extrabold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description || 'Harvested directly by local farmers with zero chemical fertilizers and swift cold-chain delivery.'}
                      </p>
                    </div>

                    {/* Price & Action Section */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="font-display font-black text-2xl text-emerald-950 tracking-tight">
                            ₹{product.price}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 ml-1">
                            /{product.unit || 'kg'}
                          </span>
                        </div>
                        {product.harvestDate && (
                          <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-emerald-600" /> Harvested: {product.harvestDate}
                          </span>
                        )}
                      </div>

                      {/* Interactive Cart Quantity Controls or Add Button */}
                      {inCartQty > 0 ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-1 shadow-2xs">
                          <button
                            aria-label={`Decrease quantity of ${product.name}`}
                            onClick={() => handleQtyChange(product, -1)}
                            className="w-8 h-8 rounded-xl bg-white border border-emerald-300 flex items-center justify-center shadow-xs text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer active:scale-95"
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
    </section>
  );
};

export default ProductCatalog;
