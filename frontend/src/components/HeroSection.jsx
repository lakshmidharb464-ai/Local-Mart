import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Truck,
  Leaf,
  ChevronRight,
  Sprout,
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
      className="relative min-h-[620px] lg:min-h-[680px] pt-24 sm:pt-28 pb-12 overflow-hidden bg-[#031508] text-white flex items-center"
    >
      {/* ── FULL COVER HERO IMAGE POSITIONED ON THE RIGHT ── */}
      <div className="absolute right-0 top-14 sm:top-18 lg:top-20 bottom-0 w-full lg:w-[54%] xl:w-[50%] z-0 overflow-hidden pointer-events-none">
        <img
          src="/hero_farmer_banner.jpg"
          alt="Verified local organic farmer holding fresh chemical-free harvest produce"
          className={`w-full h-full object-cover object-[center_top] select-none transition-all duration-1000 ${visible ? 'opacity-95 scale-100' : 'opacity-0 scale-105'
            }`}
          loading="eager"
          fetchpriority="high"
          draggable={false}
        />

        {/* Seamless Edge Blends: Left blend to text side, bottom blend to About, top blend below navbar */}
        <div className="absolute inset-y-0 left-0 w-36 sm:w-56 bg-gradient-to-r from-[#031508] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#062413] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-16 sm:h-20 bg-gradient-to-b from-[#031508] to-transparent" />
        {/* Subtle mobile overlay so text remains legible on smaller screens */}
        <div className="absolute inset-0 bg-[#031508]/75 lg:hidden" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-6">

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

          {/* ── RIGHT: Interactive Floating Badges Integrated Directly Over the Cover Visual ── */}
          <div className="lg:col-span-6 relative flex flex-col justify-between w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] py-2">

            {/* Top Interactive Badges */}
            <div className="flex items-center justify-between gap-3 w-full">
              {/* Floating Badge 1: Verified Farmer */}
              <div
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-slate-950/85 backdrop-blur-xl border border-emerald-400/40 shadow-xl hover:scale-105 hover:border-emerald-400/70 transition-all duration-300 cursor-pointer ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">👨‍🌾 Rajesh Kumar</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  ★ 5
                </span>
              </div>

              {/* Floating Badge 2: Direct 98% Payout */}
              <div
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-emerald-950/90 backdrop-blur-xl border border-emerald-400/50 shadow-xl hover:scale-105 hover:border-emerald-400/80 transition-all duration-300 delay-100 cursor-pointer ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-[11px] font-extrabold text-emerald-200">Zero Brokerage</span>
              </div>
            </div>

            {/* Bottom Interactive Badge: 2-Hour Express */}
            <div
              className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-teal-400/35 shadow-2xl hover:scale-[1.01] hover:border-teal-400/60 transition-all duration-500 delay-200 cursor-pointer ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
                  <Truck className="w-5 h-5" />
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
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  100% Fresh
                </span>
              </div>
            </div>

          </div>

        </div>



      </div>
    </section>
  );
};

export default HeroSection;
