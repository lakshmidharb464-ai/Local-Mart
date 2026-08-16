import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Star, 
  Heart, 
  ShoppingCart, 
  Sprout, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Zap, 
  Eye,
  LayoutGrid,
  ListFilter,
  Sparkles
} from 'lucide-react';

export const CustomerProducts = ({ products, toggleWishlist, wishlist, onOpenQuickBuy }) => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grocery'];

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.rating - a.rating;
    });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl shadow-farm-md" style={{ background: 'linear-gradient(135deg, #071a0b 0%, #0d2214 50%, #1b3a1f 100%)', border: '1px solid rgba(168,240,96,0.12)' }}>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2" style={{ background: 'rgba(168,240,96,0.12)', border: '1px solid rgba(168,240,96,0.25)', color: '#a8f060' }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Farm Harvest Marketplace</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl" style={{ color: '#fff' }}>
            Fresh Village Crops & Organic Produce
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Buy directly from 142 local growers. Inspected for 100% organic certification.
          </p>
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Layout Toggle */}
          <div className="flex items-center bg-farmBg p-1 rounded-2xl border border-emerald-100">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                viewMode === 'grid' ? 'bg-farmGreen-700 text-white shadow-xs' : 'text-farmMuted hover:text-farmGreen-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                viewMode === 'table' ? 'bg-farmGreen-700 text-white shadow-xs' : 'text-farmMuted hover:text-farmGreen-900'
              }`}
              title="Market Table View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-farmBg border border-emerald-200 rounded-2xl text-xs font-bold text-farmGreen-900 outline-none cursor-pointer"
          >
            <option value="popular">Sort: Popularity ⭐</option>
            <option value="price-asc">Price: Low to High ⬆</option>
            <option value="price-desc">Price: High to Low ⬇</option>
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
            <input
              type="text"
              placeholder="Search produce or farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-farmBg border border-farmGreen-200 rounded-2xl text-xs focus:outline-none focus:border-farmGreen-600"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 font-display">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 20px', borderRadius: 999, fontSize: 12,
              fontWeight: 800, cursor: 'pointer', border: 'none',
              fontFamily: 'Plus Jakarta Sans, sans-serif', whiteSpace: 'nowrap',
              background: selectedCategory === cat
                ? 'linear-gradient(135deg, #2e7d32, #1b5e20)'
                : '#fff',
              color: selectedCategory === cat ? '#fff' : '#2e7d32',
              boxShadow: selectedCategory === cat
                ? '0 4px 16px rgba(46,125,50,0.3)'
                : '0 1px 4px rgba(0,0,0,0.07)',
              outline: selectedCategory !== cat ? '1.5px solid #c8e6c9' : 'none',
              transform: selectedCategory === cat ? 'scale(1.05)' : 'scale(1)',
              transition: 'all .22s cubic-bezier(.22,1,.36,1)',
            }}
          >
            {cat} {cat === 'All' ? `(${products.length})` : ''}
          </button>
        ))}
      </div>

      {/* 1. GRID CARDS VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const isWishlisted = wishlist.some(w => w.id === prod.id);
            const inStock = prod.stock > 0 && !prod.isUnavailable;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-emerald-100/80 p-4 flex flex-col justify-between space-y-3 group card-hover"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1.5px solid #f0f4f0' }}
              >
                <div className="space-y-3">
                  
                  {/* Image Container with Badges */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-farmBg">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer" 
                      onClick={() => onOpenQuickBuy(prod)}
                    />
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isWishlisted ? 'bg-rose-500 text-white shadow-md' : 'bg-white/80 text-gray-700 hover:bg-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* Freshness Badge */}
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] p-1.5 rounded-xl font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1 text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>98% Fresh</span>
                      </span>
                      <span className="text-amber-300">Harvest: {prod.harvestDate || 'Today'}</span>
                    </div>

                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-farmGreen-900 text-emerald-300 shadow-sm">
                      {prod.category}
                    </span>
                  </div>

                  {/* Info Details */}
                  <div className="space-y-1.5">
                    <h3 
                      onClick={() => onOpenQuickBuy(prod)}
                      className="font-display font-extrabold text-sm text-farmGreen-900 line-clamp-1 cursor-pointer hover:text-emerald-700 transition-colors"
                    >
                      {prod.name}
                    </h3>
                    
                    <div className="text-[11px] text-farmMuted flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-farmGreen-800">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{prod.farmerName}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {inStock ? `${prod.stock} ${prod.unit}s left` : 'Sold out'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                      <div className="font-display font-extrabold text-base text-farmGreen-900">
                        ₹{prod.price} <span className="text-xs font-normal text-farmMuted">/{prod.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{prod.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onOpenQuickBuy(prod)}
                    className="p-2.5 bg-farmBg hover:bg-emerald-100 text-farmGreen-900 rounded-2xl border border-emerald-200 transition-all cursor-pointer"
                    title="Inspect Details & Portion Sizes"
                  >
                    <Eye className="w-4 h-4 text-emerald-700" />
                  </button>

                  <button
                    disabled={!inStock}
                    onClick={() => addToCart(prod)}
                    className={`flex-1 py-2.5 rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      inStock ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                    style={inStock ? {
                      background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
                      color: '#fff',
                      boxShadow: '0 4px 14px rgba(46,125,50,0.28)',
                    } : {
                      background: '#f3f4f6',
                      color: '#9ca3af',
                    }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{inStock ? '+ Add to Basket' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. MARKET TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-emerald-100/80 shadow-farm-sm overflow-hidden p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-emerald-100 text-xs font-bold text-farmMuted uppercase tracking-wider bg-farmBg/60">
                  <th className="p-3">Produce Item</th>
                  <th className="p-3">Farmer & Location</th>
                  <th className="p-3">Harvest Freshness</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-farmText">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-farmBg/40 transition-all">
                    <td className="p-3 flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-100" />
                      <div>
                        <div className="font-extrabold text-farmGreen-900">{prod.name}</div>
                        <div className="text-[11px] text-farmMuted">{prod.category}</div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-farmGreen-900">{prod.farmerName}</div>
                      <div className="text-[11px] text-farmMuted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{prod.farmerLocation || 'Pune Rural'}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        🟢 Harvested Today
                      </span>
                    </td>

                    <td className="p-3 text-right font-display font-extrabold text-sm text-farmGreen-900">
                      ₹{prod.price} <span className="text-xs font-normal text-farmMuted">/{prod.unit}</span>
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onOpenQuickBuy(prod)}
                          className="px-3 py-1.5 bg-farmBg hover:bg-emerald-100 text-farmGreen-900 rounded-xl font-bold text-[11px] cursor-pointer"
                        >
                          Quick Buy
                        </button>
                        <button
                          onClick={() => addToCart(prod)}
                          className="px-3 py-1.5 bg-farmGreen-700 hover:bg-farmGreen-800 text-white rounded-xl font-bold text-[11px] cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
