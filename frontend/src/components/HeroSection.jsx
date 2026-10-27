import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Truck,
  Leaf,
  ChevronRight,
  Sprout,
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
  ShoppingBag,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const HeroSection = () => {
  const { openAuthModal } = useAuth();
  const { products = [], orders = [] } = useMarketplace();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const totalCropsCount = products.length > 0 ? products.length : 24;
  const uniqueHubsCount = products.length > 0
    ? new Set(products.map(p => p.farmerLocation || p.farmer || p.farmerName)).size
    : 12;

  const firstFarmer = products.find(p => p.farmerName || p.farmer) || {
    farmerName: 'Rajesh Patil',
    farmerLocation: 'Nashik Farm Belt',
    rating: 4.98
  };

  const scrollToMarketplace = (query = '') => {
    const el = document.getElementById('marketplace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (query !== undefined && query !== '') {
      window.dispatchEvent(new CustomEvent('localfarm:set-search', { detail: query }));
    }
  };

  return (
    <section
      id="home"
      aria-label="Welcome to LocalFarm Direct"
      className="relative pt-24 sm:pt-28 pb-12 overflow-hidden bg-gradient-to-br from-[#031508] via-[#062413] to-[#0A3018] text-white"
    >
      {/* ── Ambient Radial Lighting Orbs ── */}
      <div
        className="absolute top-[-120px] left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none opacity-35 blur-3xl animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(5,150,105,0.1) 50%, transparent 70%)', animationDuration: '9s' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.08) 50%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* ── Background Subtle Organic Grid Overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#34d399 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Clean Top Hook Indicator (De-cluttered) ── */}
        <div className="flex items-center justify-between mb-8 pt-1">
          <div
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/70 backdrop-blur-md text-xs font-semibold shadow-inner"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-300 font-bold uppercase tracking-wider text-[11px]">
              Direct Farm-to-Fork Network
            </span>
            <span className="text-emerald-500/50">·</span>
            <span className="text-emerald-100 font-medium">100% Zero Middlemen</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-200/80">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Direct Fair Pricing for Farmers & Consumers
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-10">

          {/* ── LEFT: High-Impact Hook & 2 Primary Actions (Shop & Sell) ── */}
          <div
            className={`lg:col-span-6 flex flex-col justify-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            {/* Powerful Problem-Solving Headline */}
            <h1
              className="font-display font-black leading-[1.12] text-white mb-4 tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)' }}
            >
              <span>Stop Paying Middlemen.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                Direct Farm Freshness.
              </span>
            </h1>

            {/* Clear, High-Empathy Value Hook */}
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              Middlemen exploit farmers with low payouts and inflate retail prices for stale produce.
              <strong> LocalFarm connects you directly</strong> — guaranteeing <strong>98% payouts to farmers</strong> and
              morning harvests delivered to your doorstep in <strong>2 hours</strong>.
            </p>

            {/* ── Primary 2 Core Actions (Shop & Sell) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mb-8">
              {/* 1. Shop Produce (Customer Flow) */}
              <button
                id="hero-shop-now"
                onClick={() => scrollToMarketplace()}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-display font-extrabold text-sm text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 hover:from-amber-200 hover:to-amber-300 shadow-xl shadow-amber-400/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>Shop Fresh Produce</span>
                <ArrowRight className="w-4 h-4 text-slate-950/70" />
              </button>

              {/* 2. Sell Crops (Farmer Flow) */}
              <button
                id="hero-become-farmer"
                onClick={() => openAuthModal('signup', 'Farmer')}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-display font-bold text-sm text-white bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400/50 shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <Sprout className="w-4 h-4 text-emerald-300" />
                <span>Sell Your Harvest</span>
              </button>
            </div>

            {/* ── 3 Key Trust Metrics ── */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-emerald-500/20 max-w-lg">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-center">
                <div className="font-display font-black text-amber-300 text-lg sm:text-xl leading-tight">
                  {uniqueHubsCount}+ Hubs
                </div>
                <div className="text-emerald-200/80 text-[11px] font-semibold mt-0.5">
                  Direct Verified Farms
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-center">
                <div className="font-display font-black text-emerald-300 text-lg sm:text-xl leading-tight">
                  98% Payout
                </div>
                <div className="text-emerald-200/80 text-[11px] font-semibold mt-0.5">
                  Direct to Farmers
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-center">
                <div className="font-display font-black text-cyan-300 text-lg sm:text-xl leading-tight">
                  2 Hours
                </div>
                <div className="text-emerald-200/80 text-[11px] font-semibold mt-0.5">
                  Farm-to-Doorstep
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Seamless Farmer Image with Edge Blending & Floating Trust Badges ── */}
          <div className="lg:col-span-6 relative flex justify-center items-center w-full min-h-[460px] sm:min-h-[520px]">

            {/* Ambient Background Aura */}
            <div
              className="absolute inset-0 pointer-events-none blur-3xl opacity-50"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.3) 0%, rgba(20,184,166,0.15) 50%, transparent 75%)'
              }}
            />

            {/* Blended Farmer Visual Frame */}
            <div className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.7)] group bg-emerald-950/20 backdrop-blur-sm">
              <div className="relative">
                <img
                  src="/hero_farmer_banner.jpg"
                  alt="Verified local organic farmer holding fresh chemical-free harvest produce"
                  className={`w-full h-[400px] sm:h-[460px] object-cover object-top select-none transition-all duration-700 group-hover:scale-[1.03] ${visible ? 'opacity-100' : 'opacity-0'
                    }`}
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)'
                  }}
                  loading="eager"
                  fetchpriority="high"
                  draggable={false}
                />

                {/* Soft Edge Vignette Gradient Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#062413] via-transparent to-transparent opacity-80"
                  aria-hidden="true"
                />

                {/* ── Floating Badge 1: Verified Farmer (Top Left) ── */}
                <div
                  className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-emerald-400/40 shadow-xl transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">👨‍🌾 {firstFarmer.farmerName || 'Rajesh Patil'}</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    ★ {firstFarmer.rating || '4.98'}
                  </span>
                </div>

                {/* ── Floating Badge 2: Direct 98% Payout (Top Right) ── */}
                <div
                  className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/90 backdrop-blur-xl border border-emerald-400/50 shadow-xl transition-all duration-500 delay-100 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-[11px] font-extrabold text-emerald-200">Zero Brokerage</span>
                </div>

                {/* ── Floating Badge 3: 2-Hour Express (Bottom Left) ── */}
                <div
                  className={`absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-teal-400/30 shadow-2xl transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">
                        Harvested Today · 5:30 AM
                      </div>
                      <div className="text-[11px] text-teal-200/80 font-medium">
                        Packed & dispatched in 2 hours
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      100% Fresh
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>



      </div>
    </section>
  );
};

export default HeroSection;
