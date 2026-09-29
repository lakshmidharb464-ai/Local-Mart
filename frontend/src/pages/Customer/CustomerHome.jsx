import React, { useState, useCallback, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Search, Heart, Star, ShoppingCart, Eye,
  Leaf, Sprout, MapPin, ChevronRight, Check,
  X, Truck, ShieldCheck, Package, ArrowRight,
  Zap, Plus, Minus, TrendingUp, Clock, Award,
  Flame, BadgePercent
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

/* ═══════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════ */
const Toast = ({ name, onClose }) => (
  <div className="fixed bottom-24 sm:bottom-12 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-white/95 backdrop-blur-md border border-emerald-200/80 px-5 py-3 rounded-2xl shadow-organic-lg min-w-[280px] animate-slideUp font-display">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-farmGreen-600 flex items-center justify-center shrink-0 shadow-sm">
      <Check className="w-4 h-4 text-white" />
    </div>
    <div className="flex-1">
      <div className="text-xs font-black text-farmGreen-950 leading-tight">{name}</div>
      <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Added to basket ✓</div>
    </div>
    <button
      onClick={onClose}
      className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 p-1.5 rounded-lg transition-colors cursor-pointer"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════
   PRODUCT CARD — Warm organic white card with premium hover
   ═══════════════════════════════════════════════════ */
const ProductCard = React.memo(({ prod, isWishlisted, onWishlist, onQuickView, onAddToCart, cartQty, onQtyChange }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(prod);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onClick={() => onQuickView(prod)}
      className="group bg-white rounded-3xl border border-emerald-100/70 hover:border-emerald-300 shadow-farm-sm hover:shadow-organic-lg transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer font-display hover:-translate-y-1.5"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square sm:h-52 w-full overflow-hidden bg-emerald-50/40 shrink-0">
        <img
          src={prod.image}
          alt={prod.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-60 group-hover:opacity-75 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {prod.organic && (
            <Badge variant="organic" size="sm">Organic</Badge>
          )}
          {prod.category && (
            <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 w-fit">
              {prod.category}
            </span>
          )}
        </div>

        {/* Action Controls (Quick View & Wishlist) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(prod); }}
            title="Quick View"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-farmGreen-950 flex items-center justify-center shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onWishlist(prod); }}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 hover:bg-white text-gray-500 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Harvest Date Pill */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/15 z-10">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-black text-white">{prod.harvestDate}</span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-farmGreen-950 leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {prod.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500 font-medium">
            <Sprout className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate font-bold text-farmGreen-900">{prod.farmerName}</span>
            <span className="text-gray-300">·</span>
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate text-gray-400">{prod.farmerLocation}</span>
          </div>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div>
            <span className="font-black text-base sm:text-lg text-farmGreen-950">₹{prod.price}</span>
            <span className="text-xs text-gray-400 font-semibold ml-0.5">/{prod.unit}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-black text-amber-900">{prod.rating}</span>
            <span className="text-[10px] text-amber-700 font-medium">({prod.reviewsCount})</span>
          </div>
        </div>

        {/* Cart Controls */}
        <div className="pt-1">
          {cartQty > 0 ? (
            <div className="flex items-center justify-between bg-emerald-50/80 rounded-2xl p-1 border border-emerald-200" onClick={e => e.stopPropagation()}>
              <button
                onClick={(e) => { e.stopPropagation(); onQtyChange(prod, -1); }}
                className="w-7 h-7 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-black text-xs text-emerald-900 px-2">
                {cartQty} in basket
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onQtyChange(prod, 1); }}
                className="w-7 h-7 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Button
              onClick={handleAdd}
              variant={added ? 'secondary' : 'primary'}
              size="sm"
              className="w-full text-xs font-bold py-2 rounded-xl"
              icon={added ? Check : ShoppingCart}
            >
              {added ? 'Added!' : 'Add to Basket'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════
   ═══════════════════════════════════════════════════ */
const CatCard = React.memo(({ cat, count, onClick }) => (
  <button
    onClick={onClick}
    className="group bg-transparent border-0 p-0 cursor-pointer flex flex-col font-display text-left w-full focus:outline-none"
  >
    <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden relative border-2 border-transparent group-hover:border-emerald-400 shadow-sm group-hover:shadow-organic transition-all duration-300 group-hover:-translate-y-1">
      <img
        src={cat.image}
        alt={cat.name}
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-farmGreen-950/90 via-farmGreen-950/30 to-transparent group-hover:from-farmGreen-950/80 transition-colors" />

      <div className="absolute bottom-2.5 left-3 right-3">
        <div className="font-black text-xs sm:text-sm text-white leading-tight drop-shadow-xs">{cat.name}</div>
        <div className="text-[10px] text-emerald-300 font-bold mt-0.5 flex items-center gap-1 opacity-90 group-hover:opacity-100">
          <span>{count} items</span>
          <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  </button>
));

/* ═══════════════════════════════════════════════════
   FARMER CARD
   ═══════════════════════════════════════════════════ */
const FarmerCard = React.memo(({ farmer }) => (
  <div className="group flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-emerald-100/80 hover:border-emerald-300 shadow-farm-sm hover:shadow-organic-md transition-all duration-300 hover:-translate-y-1 cursor-default font-display relative overflow-hidden">
    <div className="relative shrink-0">
      <img
        src={farmer.image}
        alt={farmer.name}
        className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-100 group-hover:border-emerald-400 transition-colors"
        loading="lazy"
      />
      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
    </div>

    <div className="flex-1 min-w-0">
      <div className="font-black text-xs sm:text-sm text-farmGreen-950 truncate">{farmer.name}</div>
      <div className="text-[11px] text-gray-500 font-semibold truncate mt-0.5">{farmer.specialty}</div>
      <div className="flex items-center gap-2 mt-2">
        <span className="flex items-center gap-1 text-[10px] text-gray-400">
          <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
          <span className="truncate">{farmer.location}</span>
        </span>
        <span className="flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          {farmer.rating}
        </span>
        <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Verified
        </span>
      </div>
    </div>

    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
  </div>
));

/* ═══════════════════════════════════════════════════
   PERK STRIP ITEM
   ═══════════════════════════════════════════════════ */
const PerkItem = ({ icon: Icon, text, gradient }) => (
  <div className="flex items-center gap-3 bg-white rounded-2xl border border-emerald-100/70 hover:border-emerald-300 p-3 sm:p-3.5 shadow-farm-sm hover:shadow-organic transition-all hover:-translate-y-0.5 cursor-default font-display w-full">
    <div className={`w-9 h-9 rounded-xl ${gradient} text-white flex items-center justify-center shrink-0 shadow-xs`}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="font-black text-xs text-farmGreen-950 leading-snug">{text}</span>
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN CustomerHome
   ═══════════════════════════════════════════════════ */
export const CustomerHome = ({ products = [], setActiveTab, toggleWishlist, wishlist = [], onOpenQuickBuy }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [toast, setToast] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 60);
    // Load real farmers from backend
    apiClient('/admin/farmers')
      .then(res => setFarmers((res?.farmers || []).filter(f => f.approval_status === 'Approved' || f.approvalStatus === 'Approved')))
      .catch(() => setFarmers([]));
    return () => clearTimeout(t);
  }, []);

  const displayFarmers = React.useMemo(() => {
    if (farmers.length > 0) return farmers;
    const map = new Map();
    products.forEach(p => {
      if (p.farmerName && !map.has(p.farmerName)) {
        map.set(p.farmerName, {
          id: p.farmerId || p.farmerName,
          name: p.farmerName,
          specialty: p.category || 'Organic Produce',
          location: p.farmerLocation || 'Local Farm Hub',
          rating: p.rating || 4.9,
          image: p.farmerAvatar || p.image || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=80',
        });
      }
    });
    return Array.from(map.values()).slice(0, 6);
  }, [farmers, products]);

  const handleAdd = useCallback((prod) => {
    addToCart(prod);
    setToast(prod.name);
    setTimeout(() => setToast(null), 2800);
  }, [addToCart]);

  const getCartItem = (productId) => cartItems.find(item => item.product?.id === productId || item.id === productId);
  const getCartQty = (productId) => getCartItem(productId)?.quantity || 0;

  const handleQtyChange = (product, delta) => {
    const item = getCartItem(product.id);
    if (!item && delta > 0) { addToCart(product); return; }
    if (!item) return;
    updateQuantity(product.id, item.quantity + delta);
  };

  const approved = products.filter(p => p.status === 'Approved' || !p.status);
  const cats = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grocery'];
  const filtered = approved.filter(p => {
    const matchCat = activeCat === 'All' || p.category === activeCat;
    const matchSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.farmerName?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });



  const catConfig = [
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80' },
    { name: 'Fruits',     image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=500&q=80' },
    { name: 'Dairy',      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80' },
    { name: 'Grocery',    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80' },
  ];

  const getCatCount = (name) => approved.filter(p => p.category === name).length;

  const perks = [
    { icon: Truck, text: 'Same-Day Delivery', gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-700' },
    { icon: ShieldCheck, text: 'Verified Farmers', gradient: 'bg-gradient-to-br from-sky-500 to-blue-700' },
    { icon: Leaf, text: 'Zero Middleman', gradient: 'bg-gradient-to-br from-emerald-600 to-farmGreen-800' },
    { icon: Award, text: 'Freshness Guarantee', gradient: 'bg-gradient-to-br from-amber-500 to-amber-700' },
  ];

  return (
    <div className="font-display pb-20 space-y-6">
      {toast && <Toast name={toast} onClose={() => setToast(null)} />}

      {/* ── Seasonal Harvest Awareness Banner ── */}
      {!bannerDismissed && (
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-800 to-farmGreen-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold border border-emerald-600/50 shadow-sm">
          <span className="flex items-center gap-2">
            <span className="text-base">🌧️</span>
            <span><strong>Monsoon Harvest Season:</strong>&nbsp;Extra fresh leafy greens &amp; tomatoes from Chittoor farms this week.</span>
          </span>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-emerald-300 hover:text-white ml-4 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════
          § 1 HERO — CINEMATIC SPLIT PANEL
      ══════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#05170a] via-[#0c2313] to-[#15381f] border border-emerald-500/20 shadow-xl flex flex-col lg:flex-row min-h-[360px]">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        {/* LEFT PANEL: Hero Typography & Search */}
        <div
          className={`w-full lg:w-[56%] p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative z-10 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 backdrop-blur-md mb-4 w-fit shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 text-[10px] font-black uppercase tracking-wider">Fresh · Organic · Local</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-3">
            Farm-Fresh Groceries,{' '}
            <span className="text-emerald-400 italic">Direct to Your Home</span>
          </h1>

          <p className="text-gray-300/80 text-xs sm:text-sm leading-relaxed mb-6 max-w-md font-semibold">
            Shop from <strong className="text-white font-extrabold">142 verified local farmers</strong> — zero middleman, zero compromise on freshness.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tomatoes, A2 milk, mangoes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && search) {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full pl-11 pr-24 py-3 sm:py-3.5 bg-white rounded-2xl text-xs sm:text-sm font-bold text-farmGreen-950 placeholder-gray-400 outline-none shadow-lg border border-transparent focus:border-emerald-400 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-farmGold-600 to-farmGold-500 hover:from-farmGold-500 hover:to-farmGold-400 text-farmGreen-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button
              onClick={() => setActiveTab('products')}
              variant="primary"
              size="md"
              icon={Zap}
              className="px-6 py-3"
            >
              Shop Now
            </Button>
            <Button
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              variant="secondary"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-5 py-3 backdrop-blur-md"
            >
              Browse Products
            </Button>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
            {[
              { val: '142+', label: 'Local Farms', icon: Sprout },
              { val: '100%', label: 'Organic', icon: Leaf },
              { val: '2hr', label: 'Avg Delivery', icon: Truck },
              { val: '4.9★', label: '12k+ Reviews', icon: Star },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-black text-xs sm:text-sm text-emerald-300 leading-tight">{s.val}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Hero Image with Floating Pills */}
        <div
          className={`w-full lg:w-[44%] relative min-h-[260px] lg:min-h-auto overflow-hidden transition-all duration-1000 ${
            heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
          }`}
        >
          <img
            src="/hero_basket_banner.jpg"
            alt="Fresh farm produce basket"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#05170a] via-transparent to-transparent opacity-80" />

          {/* Floating Feature Pills */}
          <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md border border-emerald-400/30 px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-black text-white">100% Certified Organic</span>
          </div>

          <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-black text-white">Fast Local Dispatch</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          § 2 PERKS STRIP
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {perks.map((p, i) => <PerkItem key={i} {...p} />)}
      </div>

      {/* ══════════════════════════════════════════
          § 3 BROWSE BY CATEGORY
      ══════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-emerald-100/80 p-5 sm:p-6 shadow-farm-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-black text-base sm:text-lg text-farmGreen-950">Browse by Category</h2>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">Fresh produce sorted by harvest category</p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {catConfig.map(cat => (
            <CatCard
              key={cat.name}
              cat={cat}
              count={getCatCount(cat.name)}
              onClick={() => {
                setActiveCat(cat.name);
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          § 4 PRODUCTS CATALOG SECTION
      ══════════════════════════════════════════ */}
      <div id="products-section" className="space-y-4">
        {/* Section Header & Tabs */}
        <div className="bg-white rounded-3xl border border-emerald-100/80 p-5 sm:p-6 shadow-farm-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-farmGreen-950 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Our Fresh Harvest</span>
              </h2>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                Verified farm-direct produce · {filtered.length} items available
              </p>
            </div>

            <button
              onClick={() => setActiveTab('products')}
              className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 hover:text-emerald-950 cursor-pointer self-start sm:self-auto"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {cats.map(cat => {
              const isSelected = activeCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span>{cat}</span>
                  {cat !== 'All' && (
                    <span className={`ml-1.5 text-[10px] ${isSelected ? 'text-emerald-200' : 'text-gray-500'}`}>
                      ({getCatCount(cat)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(prod => (
            <ProductCard
              key={prod.id}
              prod={prod}
              isWishlisted={wishlist.some(w => w.id === prod.id)}
              onWishlist={toggleWishlist}
              onQuickView={p => onOpenQuickBuy && onOpenQuickBuy(p)}
              onAddToCart={handleAdd}
              cartQty={getCartQty(prod.id)}
              onQtyChange={handleQtyChange}
            />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 px-4 bg-white rounded-3xl border border-emerald-100 shadow-farm-sm">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="font-extrabold text-base text-farmGreen-950">No crops found</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">Try another search keyword or switch category filters.</p>
              <Button
                onClick={() => { setActiveCat('All'); setSearch(''); }}
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          § 5 LOCAL FARMERS
      ══════════════════════════════════════════ */}
      <div className="space-y-3">
        <div>
          <h2 className="font-display font-black text-base sm:text-lg text-farmGreen-950 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <span>Meet Your Local Farmers</span>
          </h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Verified local growers behind every harvest</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayFarmers.map(f => <FarmerCard key={f.id} farmer={f} />)}
        </div>
      </div>
    </div>
  );
};
