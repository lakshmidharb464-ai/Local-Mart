import React, { useState, useCallback, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Search,
  Star,
  Heart,
  ShoppingCart,
  Sprout,
  Clock,
  MapPin,
  Eye,
  LayoutGrid,
  ListFilter,
  Sparkles,
  Check,
  Leaf,
  Package,
  ArrowUpDown,
  Filter,
  Plus,
  Minus,
  SlidersHorizontal,
  X,
} from 'lucide-react';

/* ─── Warm Organic Product Card (matches CustomerHome design system) ── */
const ProductCard = React.memo(({ prod, isWishlisted, onWishlist, onQuickView, onAddToCart, cartQty = 0, onQtyChange }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback((e) => {
    e.stopPropagation();
    if (onQtyChange) {
      onQtyChange(prod, 1);
    } else {
      onAddToCart(prod);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }, [onAddToCart, onQtyChange, prod]);

  return (
    <div className="group bg-white rounded-3xl border border-emerald-100/70 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer font-display hover:-translate-y-1.5">

      {/* ── Image ── */}
      <div
        className="relative overflow-hidden bg-emerald-50/40 shrink-0"
        style={{ height: 210 }}
        onClick={() => onQuickView(prod)}
      >
        <img
          src={prod.image}
          alt={prod.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Subtle bottom fade for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Organic badge */}
        {prod.organic && (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black text-white bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-md">
            <Leaf className="w-2.5 h-2.5" /> Organic
          </span>
        )}

        {/* Category badge */}
        <span className={`absolute ${prod.organic ? 'top-9' : 'top-3'} left-3 z-10 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-white/90 backdrop-blur-sm text-farmGreen-800 border border-emerald-100`}>
          {prod.category}
        </span>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(prod); }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md border ${
            isWishlisted
              ? 'bg-rose-500 border-rose-500 scale-110'
              : 'bg-white/90 border-white hover:bg-rose-50 hover:border-rose-200 hover:scale-105'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${
            isWishlisted ? 'text-white fill-white' : 'text-gray-400'
          }`} />
        </button>

        {/* Harvest date + Quick View */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-between items-end">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            <Clock className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[9px] font-bold text-white">{prod.harvestDate}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/95 px-3 py-1 rounded-full text-[10px] font-black text-farmGreen-950 shadow opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-2.5 h-2.5" /> Quick View
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">

        {/* Name & Farmer */}
        <div onClick={() => onQuickView(prod)}>
          <h3 className="font-display font-extrabold text-[15px] text-farmGreen-950 leading-snug m-0 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {prod.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5">
            <Sprout className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-700 truncate">{prod.farmerName}</span>
            <span className="text-[10px] text-gray-300">·</span>
            <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
            <span className="text-[10px] font-medium text-gray-400 truncate">{prod.farmerLocation}</span>
          </div>
        </div>

        {/* Price + Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-black text-xl text-farmGreen-950">₹{prod.price}</span>
            <span className="text-[10px] font-medium text-gray-400">/{prod.unit}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            <span className="text-[10px] font-black text-amber-700">{prod.rating}</span>
            <span className="text-[9px] font-medium text-amber-500">({prod.reviewsCount})</span>
          </div>
        </div>

        {/* Stock indicator */}
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            prod.stock > 10 ? 'bg-emerald-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]'
            : prod.stock > 0 ? 'bg-amber-500'
            : 'bg-rose-500'
          }`} />
          <span className={`text-[10px] font-bold ${
            prod.stock > 10 ? 'text-emerald-700'
            : prod.stock > 0 ? 'text-amber-600'
            : 'text-rose-500'
          }`}>
            {prod.stock > 10 ? 'In Stock' : prod.stock > 0 ? `Only ${prod.stock} left` : 'Sold Out'}
          </span>
        </div>

        {/* CTA — qty stepper if already in cart, else Add button */}
        {cartQty > 0 ? (
          <div
            className="flex items-center justify-between bg-emerald-50/80 rounded-2xl p-1 border border-emerald-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => { e.stopPropagation(); if (onQtyChange) onQtyChange(prod, -1); }}
              className="w-8 h-8 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-rose-500 hover:text-white hover:border-rose-500 flex items-center justify-center transition-all duration-200 cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-black text-xs text-emerald-900">{cartQty} in basket</span>
            <button
              onClick={(e) => { e.stopPropagation(); if (onQtyChange) onQtyChange(prod, 1); }}
              className="w-8 h-8 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <Button
            onClick={handleAdd}
            disabled={prod.stock === 0}
            variant={added ? 'secondary' : 'primary'}
            size="sm"
            icon={added ? Check : prod.stock === 0 ? undefined : ShoppingCart}
            className="w-full rounded-2xl text-xs"
          >
            {added ? 'Added to Basket!' : prod.stock === 0 ? 'Out of Stock' : 'Add to Basket'}
          </Button>
        )}
      </div>
    </div>
  );
});

/* ─── Main CustomerProducts ──────────────────────── */
export const CustomerProducts = ({ products, toggleWishlist, wishlist, onOpenQuickBuy }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();

  // Search — raw state for input, debounced value for filtering
  const [rawSearch, setRawSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search by 300ms to avoid heavy re-renders on every keystroke
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(rawSearch), 300);
    return () => clearTimeout(t);
  }, [rawSearch]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [priceMax, setPriceMax] = useState(1000);
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grocery'];
  const maxProductPrice = useMemo(() => Math.max(...(products.map(p => p.price) || [1000]), 100), [products]);

  // Cart helpers
  const getCartQty = useCallback((id) =>
    (cartItems.find(i => (i.product?.id ?? i.id) === id)?.quantity || 0),
    [cartItems]
  );

  const handleQtyChange = useCallback((prod, delta) => {
    const existing = cartItems.find(i => (i.product?.id ?? i.id) === prod.id);
    if (!existing && delta > 0) { addToCart(prod); return; }
    if (existing) {
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        if (updateQuantity) updateQuantity(prod.id, 0);
      } else {
        if (updateQuantity) updateQuantity(prod.id, newQty);
      }
    }
  }, [cartItems, addToCart, updateQuantity]);

  const handleToggleWishlist = useCallback((prod) => toggleWishlist(prod), [toggleWishlist]);
  const handleOpenQuickBuy = useCallback((p) => onOpenQuickBuy && onOpenQuickBuy(p), [onOpenQuickBuy]);

  const activeFilterCount = (showOrganicOnly ? 1 : 0) + (priceMax < maxProductPrice ? 1 : 0);

  const filteredProducts = useMemo(() => products
    .filter(p => {
      const q = debouncedSearch.toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.farmerName.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesPrice = p.price <= priceMax;
      const matchesOrganic = !showOrganicOnly || p.organic === true;
      return matchesSearch && matchesCat && matchesPrice && matchesOrganic;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.rating - a.rating;
    }),
    [products, debouncedSearch, selectedCategory, sortBy, priceMax, showOrganicOnly]
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-16">

      {/* ── Header Banner ── */}
      <div
        className="rounded-3xl p-6"
        style={{
          background: 'linear-gradient(135deg, #071a0b 0%, #0d2214 50%, #1b3a1f 100%)',
          border: '1px solid rgba(34,197,94,0.14)',
          boxShadow: '0 8px 32px rgba(5,20,11,0.30)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Farm Harvest Marketplace</span>
            </div>
            <h2
              className="font-display font-extrabold text-2xl text-white leading-tight"
            >
              Fresh Village Crops <span style={{ color: '#22c55e' }}>&amp;</span> Organic Produce
            </h2>
            <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Buy directly from <strong style={{ color: '#fff' }}>142 local growers</strong>. Inspected for 100% organic certification.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Layout Toggle */}
            <div
              className="flex items-center p-1 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              {[
                { mode: 'grid', Icon: LayoutGrid, label: 'Grid' },
                { mode: 'table', Icon: ListFilter, label: 'Table' },
              ].map(({ mode, Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={`${label} View`}
                  className="p-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200"
                  style={{
                    background: viewMode === mode ? 'rgba(34,197,94,0.25)' : 'transparent',
                    color: viewMode === mode ? '#22c55e' : 'rgba(255,255,255,0.5)',
                    boxShadow: viewMode === mode ? '0 2px 8px rgba(34,197,94,0.2)' : 'none',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold outline-none cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
              }}
            >
              <option value="popular" style={{ background: '#0d2214' }}>Sort: Popularity ⭐</option>
              <option value="price-asc" style={{ background: '#0d2214' }}>Price: Low to High ⬆</option>
              <option value="price-desc" style={{ background: '#0d2214' }}>Price: High to Low ⬇</option>
            </select>

            {/* Search */}
            <div
              className="relative flex items-center rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <Search className="w-4 h-4 absolute left-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.45)' }} />
              <input
                type="text"
                placeholder="Search produce or farmer..."
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
                className="w-full sm:w-52 pl-10 pr-4 py-2 text-xs font-medium outline-none bg-transparent"
                style={{ color: '#fff' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Filter Pills + Filters Row ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-farmGreen-800 to-emerald-600 text-white shadow-md scale-[1.03]'
                  : 'bg-white text-farmGreen-700 border border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-md'
              }`}
            >
              {cat}{cat === 'All' ? ` (${products.length})` : ''}
            </button>
          ))}
        </div>

        {/* Filters toggle button */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
            showFilters || activeFilterCount > 0
              ? 'bg-farmGreen-800 text-white border-farmGreen-700'
              : 'bg-white text-farmGreen-700 border-emerald-200 hover:border-emerald-400'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Expandable Filter Panel ── */}
      {showFilters && (
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 flex flex-wrap items-center gap-5 shadow-sm animate-fadeIn">
          {/* Price Range */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-farmGreen-950">Max Price:</span>
            <input
              type="range"
              min={0}
              max={maxProductPrice}
              step={10}
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="w-28 accent-emerald-700 cursor-pointer"
            />
            <span className="text-xs font-black text-emerald-700 min-w-[3rem]">≤ ₹{priceMax}</span>
          </div>

          {/* Organic Only Toggle */}
          <button
            onClick={() => setShowOrganicOnly(v => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
              showOrganicOnly
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400'
            }`}
          >
            <Leaf className="w-3 h-3" /> Organic Only
          </button>

          {/* Reset link */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setShowOrganicOnly(false); setPriceMax(maxProductPrice); }}
              className="text-xs text-rose-500 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      )}

      {/* ── Results count ── */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-farmGreen-800 to-emerald-500" />
        <p className="text-xs font-bold text-farmGreen-700">
          Showing <strong className="text-farmGreen-950">{filteredProducts.length}</strong> farm-fresh products
          {activeFilterCount > 0 && <span className="text-gray-400 font-medium"> (filtered)</span>}
        </p>
      </div>

      {/* ── Grid Cards ── */}
      {viewMode === 'grid' && (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  prod={prod}
                  isWishlisted={wishlist.some(w => w.id === prod.id)}
                  onWishlist={handleToggleWishlist}
                  onQuickView={handleOpenQuickBuy}
                  onAddToCart={addToCart}
                  cartQty={getCartQty(prod.id)}
                  onQtyChange={handleQtyChange}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products found"
              description="Try a different category, adjust your price filter, or clear your search to explore fresh farm produce."
              actionLabel="Clear All Filters"
              onAction={() => { setSelectedCategory('All'); setRawSearch(''); setShowOrganicOnly(false); setPriceMax(maxProductPrice); }}
            />
          )}
        </>
      )}

      {/* ── Table View ── */}
      {viewMode === 'table' && (
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: '#fff', border: '1.5px solid #d8eed9', boxShadow: '0 4px 20px rgba(15,40,24,0.06)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ background: 'linear-gradient(90deg, #f5f8f5, #f0f6f1)', borderBottom: '1.5px solid #d8eed9', color: '#4b6355' }}
                >
                  <th className="p-4">Produce Item</th>
                  <th className="p-4">Farmer & Location</th>
                  <th className="p-4">Harvest Freshness</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y" style={{ color: '#0d2214', borderColor: '#f0f6f1' }}>
                {filteredProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    className="transition-all duration-200"
                    style={{ color: '#0d2214' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f8f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image} alt={prod.name}
                          className="w-11 h-11 rounded-xl object-cover"
                          style={{ border: '1.5px solid #d8eed9' }}
                          loading="lazy"
                        />
                        <div>
                          <div
                            className="font-display font-extrabold text-farmGreen-950"
                          >
                            {prod.name}
                          </div>
                          <div className="text-[11px]" style={{ color: '#4b6355' }}>{prod.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold" style={{ color: '#0d2214' }}>{prod.farmerName}</div>
                      <div className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: '#4b6355' }}>
                        <MapPin className="w-3 h-3" style={{ color: '#22c55e' }} />
                        <span>{prod.farmerLocation || 'Pune Rural'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}
                      >
                        🟢 Harvested Today
                      </span>
                    </td>
                    <td className="p-4 text-right font-display font-extrabold text-sm text-farmGreen-950">
                      ₹{prod.price} <span className="text-xs font-normal text-farmMuted">/{prod.unit}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onOpenQuickBuy(prod)}
                          className="px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all duration-200"
                          style={{ background: '#f5f8f5', border: '1.5px solid #d8eed9', color: '#1a6b3c' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#1a6b3c'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#f5f8f5'; e.currentTarget.style.color = '#1a6b3c'; }}
                        >
                          Quick Buy
                        </button>
                        <button
                          onClick={() => addToCart(prod)}
                          className="px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all duration-200"
                          style={{ background: 'linear-gradient(135deg,#1a6b3c,#22c55e)', color: '#fff', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }}
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

export default CustomerProducts;
