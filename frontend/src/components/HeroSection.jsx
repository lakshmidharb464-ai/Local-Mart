import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, 
  Leaf, 
  ChevronRight, 
  Sprout, 
  Sparkles
} from 'lucide-react';

const TRUST_STATS = [
  { value: '100% Direct', label: 'Local City Farms' },
  { value: '50+ Farms', label: 'Nearby Growers' },
  { value: '< 2 hrs', label: 'Express Delivery' },
  { value: '85% Payout', label: 'Direct to Farmers' },
];

export const HeroSection = () => {
  const { openAuthModal } = useAuth();
  const [visible, setVisible] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [basketImgError, setBasketImgError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollToMarketplace = () => {
    const el = document.getElementById('marketplace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      aria-label="Welcome to LocalFarm Direct"
      className="relative pt-24 sm:pt-28 pb-0 overflow-hidden bg-gradient-to-br from-[#06170a] via-[#0b2414] to-[#12361b]"
    >
      {/* Subtle ambient lighting glows */}
      <div 
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)' }} 
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }} 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[580px] pb-10">

          {/* ── LEFT: Text Content & Interactive Search (7 cols on lg) ── */}
          <div
            className={`lg:col-span-7 flex flex-col justify-center transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Live Trust Pill */}
            <div className="inline-flex items-center gap-2 self-start mb-4 px-3.5 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/60 backdrop-blur-md shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-emerald-100 text-xs font-bold tracking-wider uppercase">
                Hyper-Local · Harvested at Sunrise
              </span>
            </div>

            {/* Main Headline */}
            <h1 
              className="font-display font-black leading-tight text-white mb-4 tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)' }}
            >
              <span className="text-emerald-100">Fresh From Farm, </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                Direct to Table.
              </span>
            </h1>

            <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed mb-6 max-w-xl font-body">
              Connecting conscious consumers with verified local farmers in our city. Enjoy zero-middleman pricing, 100% fresh harvest traceability, and express 2-hour delivery.
            </p>

            {/* Dual Core CTAs (P0 Usability) */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                id="hero-shop-now"
                onClick={() => scrollToMarketplace()}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl font-display font-extrabold text-sm text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 active:scale-95 cursor-pointer bg-gradient-to-r from-emerald-600 to-farmGreen-600 hover:from-emerald-500 hover:to-farmGreen-500 border border-emerald-400/40 focus:outline-none focus:ring-3 focus:ring-emerald-400/50"
              >
                <span>Shop Fresh Produce</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-4 h-4 text-white" />
                </span>
              </button>

              <button
                id="hero-become-farmer"
                onClick={() => openAuthModal('signup', 'Farmer')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-display font-bold text-sm border border-emerald-300/30 text-emerald-100 hover:text-white hover:bg-emerald-900/40 hover:border-emerald-400/50 backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none focus:ring-3 focus:ring-emerald-400/40"
              >
                <Sprout className="w-4 h-4 text-amber-400" />
                <span>Sell Your Harvest</span>
              </button>
            </div>

            {/* Trust Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-emerald-500/20 max-w-xl">
              {TRUST_STATS.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-display font-black text-white text-xl sm:text-2xl leading-tight">
                    {s.value}
                  </span>
                  <span className="text-emerald-200/80 text-[11px] font-bold mt-0.5 uppercase tracking-wider">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Hero Visual + Floating Cards (5 cols on lg) ── */}
          <div className="lg:col-span-5 relative flex justify-center items-end h-[380px] sm:h-[480px] w-full">

            {/* Main hero image with graceful fallback */}
            {!heroImgError ? (
              <img
                src="/hero_farmer_banner.jpg"
                alt="Local organic farmer holding fresh harvested produce"
                onError={() => setHeroImgError(true)}
                className={`relative z-10 h-[92%] max-h-[480px] w-auto object-contain object-bottom transition-all duration-1000 select-none ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                draggable={false}
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="relative z-10 h-[85%] w-full max-w-md rounded-3xl bg-emerald-950/60 border border-emerald-400/30 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center text-white mb-6 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                  <Sprout className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-xl mb-1">Direct from Local City Farms</h3>
                <p className="text-xs text-emerald-200/90">Harvested fresh daily at sunrise and delivered within 2 hours.</p>
              </div>
            )}

            {/* Floating: Product Card (bottom right) */}
            <div
              className={`absolute bottom-4 right-0 sm:right-2 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3 flex items-center gap-3 transition-all duration-1000 delay-300 border border-emerald-100 animate-hero-float ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ minWidth: 180 }}
            >
              {!basketImgError ? (
                <img 
                  src="/hero_veggie_basket.jpg" 
                  alt="Fresh Organic Produce Crate" 
                  onError={() => setBasketImgError(true)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover flex-shrink-0" 
                  loading="lazy" 
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold text-xs">
                  🥗
                </div>
              )}
              <div>
                <div className="font-display font-bold text-gray-900 text-xs mb-0.5">Family Veggie Crate</div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-700 text-sm">₹549</span>
                  <span className="text-[11px] text-gray-400 line-through">₹699</span>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Saved 20%</span>
              </div>
            </div>

            {/* Floating: Delivery badge (top left) */}
            <div
              className={`hidden sm:flex absolute top-6 left-0 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-emerald-100 transition-all duration-1000 delay-200 animate-hero-float-alt ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
              }`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-600 shadow-sm">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg. Delivery</div>
                <div className="font-display font-extrabold text-gray-900 text-xs">Under 2 Hours</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom organic curve transition */}
      <div className="relative w-full" style={{ marginTop: -2 }} aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 50 }}>
          <path d="M0 60 C360 0 1080 0 1440 60 L1440 60 L0 60 Z" fill="#FAF9F5" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

