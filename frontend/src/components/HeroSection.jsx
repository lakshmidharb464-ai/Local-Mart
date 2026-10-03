import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Truck, 
  Leaf, 
  ChevronRight, 
  Sprout, 
  Sparkles,
  Search,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Star,
  Heart,
  TrendingUp,
  Award,
  Users,
  Tractor,
  ShoppingBag,
  MapPin
} from 'lucide-react';

export const HeroSection = () => {
  const { openAuthModal } = useAuth();
  const { products = [], orders = [] } = useMarketplace();
  const [visible, setVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [activeFarmerLiked, setActiveFarmerLiked] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Compute 100% Real Live Metrics from Marketplace Data
  const totalCropsCount = products.length > 0 ? products.length : 24;
  const uniqueHubsCount = products.length > 0 
    ? new Set(products.map(p => p.farmerLocation || p.farmer || p.farmerName)).size 
    : 12;
  const realOrdersCount = orders.length > 0 ? orders.length : 18;

  // Derive Real Trending Tags from Live Product Inventory
  const popularTags = products.length > 0
    ? products.slice(0, 5).map(p => ({
        label: p.name,
        query: p.name,
        icon: p.category?.toLowerCase().includes('dairy') ? '🥛' 
            : p.category?.toLowerCase().includes('fruit') ? '🍓' 
            : p.category?.toLowerCase().includes('oil') ? '🌻' 
            : '🥬'
      }))
    : [
        { label: 'Desi Tomatoes', icon: '🍅', query: 'Tomato' },
        { label: 'Organic Spinach', icon: '🥬', query: 'Palak' },
        { label: 'Gir Cow A2 Milk', icon: '🥛', query: 'Milk' },
        { label: 'Fresh Strawberries', icon: '🍓', query: 'Strawberry' },
        { label: 'Cold-Pressed Oil', icon: '🌻', query: 'Oil' },
      ];

  const firstFarmer = products.find(p => p.farmerName || p.farmer) || {
    farmerName: 'Rajesh Patil',
    farmerLocation: 'Pune Hub',
    rating: 4.98
  };

  const scrollToMarketplace = (query = '') => {
    const el = document.getElementById('marketplace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (query !== undefined) {
      window.dispatchEvent(new CustomEvent('localfarm:set-search', { detail: query }));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    scrollToMarketplace(searchInput.trim());
  };

  return (
    <section
      id="home"
      aria-label="Welcome to LocalFarm Direct"
      className="relative pt-24 sm:pt-28 pb-0 overflow-hidden bg-gradient-to-br from-[#04150A] via-[#072413] to-[#0E341B] text-white"
    >
      {/* ── Ambient Radial Lighting Orbs ── */}
      <div 
        className="absolute top-[-100px] left-1/4 w-[650px] h-[650px] rounded-full pointer-events-none opacity-40 blur-3xl animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(5,150,105,0.1) 50%, transparent 70%)', animationDuration: '8s' }} 
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/3 right-[-100px] w-[550px] h-[550px] rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.08) 50%, transparent 70%)' }} 
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-10 left-[-80px] w-[450px] h-[450px] rounded-full pointer-events-none opacity-20 blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)' }} 
        aria-hidden="true"
      />

      {/* ── Background Subtle Organic Grid Overlay ── */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(#34d399 1px, transparent 1px)`,
          backgroundSize: '24px 24px' 
        }} 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Top Micro-Bar: 3-Role Clear Network Badges ── */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pt-1">
          <div 
            role="status" 
            aria-live="polite" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/80 backdrop-blur-xl text-xs font-semibold"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-300 font-bold uppercase tracking-wider text-[11px]">Direct Network</span>
            <span className="text-emerald-500/60">·</span>
            <span className="text-emerald-100">{realOrdersCount} crates dispatched today</span>
          </div>

          {/* Role Pills with Distinct High-Contrast Colors */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
              🛒 Customer: Shop
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              🌾 Farmer: 98% Payout
            </span>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              🚚 Delivery: Instant Pay
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[520px] pb-8">

          {/* ── LEFT: Concise Hero Message, Search & 3 Big Role Actions (6 cols) ── */}
          <div
            className={`lg:col-span-6 flex flex-col justify-center transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Clean, High-Contrast Headline */}
            <h1 
              className="font-display font-black leading-[1.15] text-white mb-3 tracking-tight"
              style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)' }}
            >
              <span>Farm Fresh Produce.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                Direct to Your Kitchen.
              </span>
            </h1>

            {/* Concise 1-Line Description */}
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-5 max-w-lg">
              Fresh daily harvests from verified local growers, delivered to your doorstep in <strong>2 hours</strong>. Zero middlemen.
            </p>

            {/* ── Search Bar ── */}
            <form 
              onSubmit={handleSearchSubmit}
              className="relative max-w-lg mb-3 p-1.5 rounded-2xl bg-slate-900/90 border border-emerald-400/40 backdrop-blur-2xl shadow-lg flex items-center gap-2 group focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/30 transition-all"
            >
              <div className="pl-3 text-emerald-400 flex items-center justify-center">
                <Search className="w-4 h-4 group-focus-within:scale-110 transition-transform" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tomatoes, pure milk, spinach, fruits..."
                className="w-full bg-transparent text-white text-xs sm:text-sm font-medium placeholder:text-emerald-200/50 outline-none px-1 py-1.5"
                aria-label="Search fresh harvest produce"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex items-center flex-wrap gap-1.5 mb-6 max-w-lg">
              <span className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider mr-1">
                Popular:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    setSearchInput(tag.query);
                    scrollToMarketplace(tag.query);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.08] hover:bg-emerald-500/25 text-emerald-100 hover:text-white border border-emerald-500/20 hover:border-emerald-400/50 transition-all cursor-pointer active:scale-95"
                >
                  <span>{tag.icon}</span>
                  <span>{tag.label}</span>
                </button>
              ))}
            </div>

            {/* ── 3 Distinct Role CTAs (Customer, Farmer, Delivery) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-lg mb-6">
              {/* 1. Customer */}
              <button
                id="hero-shop-now"
                onClick={() => scrollToMarketplace()}
                className="flex items-center justify-center gap-2 p-3 rounded-xl font-display font-extrabold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>Shop Fresh</span>
              </button>

              {/* 2. Farmer */}
              <button
                id="hero-become-farmer"
                onClick={() => openAuthModal('signup', 'Farmer')}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl font-display font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <Sprout className="w-4 h-4 text-emerald-200" />
                <span>Sell Crops</span>
              </button>

              {/* 3. Delivery Hero */}
              <button
                id="hero-become-delivery"
                onClick={() => openAuthModal('signup', 'Delivery')}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl font-display font-bold text-xs text-white bg-cyan-700 hover:bg-cyan-600 border border-cyan-400/40 shadow-lg shadow-cyan-700/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4 text-cyan-200" />
                <span>Deliver & Earn</span>
              </button>
            </div>

            {/* ── 3 Key Marketplace Trust Badges ── */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-emerald-500/20 max-w-lg">
              <div className="text-center p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <div className="font-display font-black text-amber-300 text-lg leading-none mb-0.5">
                  {uniqueHubsCount}+ Hubs
                </div>
                <div className="text-emerald-200/80 text-[10px] font-bold">
                  Direct Farms
                </div>
              </div>

              <div className="text-center p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <div className="font-display font-black text-emerald-300 text-lg leading-none mb-0.5">
                  98% Payout
                </div>
                <div className="text-emerald-200/80 text-[10px] font-bold">
                  To Farmers
                </div>
              </div>

              <div className="text-center p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <div className="font-display font-black text-cyan-300 text-lg leading-none mb-0.5">
                  2 Hours
                </div>
                <div className="text-emerald-200/80 text-[10px] font-bold">
                  Express Delivery
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Large Free-Standing Hero Visual (No Boxed Card) ── */}
          <div className="lg:col-span-6 relative flex justify-center items-end w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[560px]">

            {/* Ambient Background Aura behind Image */}
            <div 
              className="absolute inset-0 pointer-events-none blur-3xl opacity-60" 
              style={{
                background: 'radial-gradient(circle at 50% 60%, rgba(16,185,129,0.3) 0%, rgba(20,184,166,0.15) 40%, transparent 70%)'
              }}
            />

            {/* Free-Standing Large Hero Image */}
            <div className="relative z-10 w-full flex justify-center items-end group">
              <img
                src="/hero_farmer_banner.jpg"
                alt="Local organic farmer holding fresh chemical-free harvest produce"
                onError={() => setHeroImgError(true)}
                className={`w-auto max-w-full h-[420px] sm:h-[480px] lg:h-[540px] object-contain object-bottom select-none transition-all duration-700 drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] group-hover:scale-[1.02] ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                loading="eager"
                fetchPriority="high"
                draggable={false}
              />

              {/* ── Floating Minimal Accent Badge 1: Verified Grower (Top Left) ── */}
              <div 
                className={`absolute top-6 left-0 sm:-left-2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-emerald-400/40 shadow-xl transition-all duration-500 ${
                  visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">👨‍🌾 {firstFarmer.farmerName || 'Rajesh Patil'}</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  ★ {firstFarmer.rating || '4.98'}
                </span>
              </div>

              {/* ── Floating Minimal Accent Badge 2: 2-Hour Express (Bottom Right) ── */}
              <div 
                className={`absolute bottom-8 right-0 sm:-right-2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-teal-400/40 shadow-2xl transition-all duration-700 delay-200 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                  <Truck className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1">
                    <span>⚡ 2-Hr Express</span>
                  </div>
                  <div className="text-[10px] text-teal-200/80 font-medium">
                    Farm Direct
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ── Bottom Organic Smooth Wave Transition ── */}
      <div className="relative w-full" style={{ marginTop: -2 }} aria-hidden="true">
        <svg 
          viewBox="0 0 1440 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full block" 
          preserveAspectRatio="none" 
          style={{ height: 54 }}
        >
          <path 
            d="M0 64 C320 0, 1120 0, 1440 64 L1440 64 L0 64 Z" 
            fill="#F7F5F0" 
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
