import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Star, Truck, Leaf, ShieldCheck, ChevronRight } from 'lucide-react';

const TRUST_STATS = [
  { value: '142+', label: 'Local Villages' },
  { value: '4.9★', label: '12k+ Reviews' },
  { value: '2 hrs', label: 'Avg. Delivery' },
  { value: '100%', label: 'Organic' },
];

const FLOATING_PRODUCT = {
  name: 'Fresh Vegetables Basket',
  price: '₹18',
  original: '₹24',
  image: '/hero_veggie_basket.jpg',
};

export const HeroSection = () => {
  const { openAuthModal } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToMarketplace = () => {
    const el = document.getElementById('marketplace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative pt-24 pb-0 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A1F0E 0%, #0F2818 40%, #163320 70%, #1a4025 100%)' }}
    >
      {/* Subtle ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.08) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,195,74,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-end min-h-[560px]">

          {/* ── LEFT: Text Content ── */}
          <div
            className={`pb-16 lg:pb-20 flex flex-col justify-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 self-start mb-5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-lime-300 text-xs font-bold tracking-widest uppercase">Same-Day Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black leading-none text-white mb-5" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}>
              <span className="block" style={{ color: '#a8f060' }}>Local</span>
              <span className="block text-white">Farm</span>
              <span className="block" style={{ color: '#a8f060' }}>Direct</span>
            </h1>

            <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-md font-body">
              Shop from thousands of farm-fresh fruits, vegetables, dairy, and daily essentials at unbeatable prices — straight from 142 local villages.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button
                id="hero-shop-now"
                onClick={scrollToMarketplace}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-display font-bold text-sm text-farmGreen-950 transition-all duration-300 hover:gap-4 hover:shadow-2xl active:scale-95"
                style={{ background: 'linear-gradient(135deg, #a8f060, #6fcf37)' }}
              >
                <span>Shop Now</span>
                <span className="w-7 h-7 rounded-full bg-farmGreen-900/20 flex items-center justify-center group-hover:bg-farmGreen-900/30 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>

              <button
                id="hero-become-farmer"
                onClick={() => openAuthModal('signup', 'Farmer')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-display font-bold text-sm border border-white/25 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 active:scale-95"
              >
                <Leaf className="w-4 h-4 text-lime-400" />
                <span>Become a Farmer</span>
              </button>
            </div>

            {/* Trust Stats Row */}
            <div className="flex flex-wrap gap-6">
              {TRUST_STATS.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-display font-extrabold text-white text-xl leading-none">{s.value}</span>
                  <span className="text-white/45 text-xs font-body mt-0.5 uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Hero Image + Floating Cards ── */}
          <div className="relative flex justify-center lg:justify-end items-end h-[500px] sm:h-[560px]">

            {/* Main hero person image — bottom-aligned so person stands at bottom edge */}
            <img
              src="/hero_farmer_banner.jpg"
              alt="Local farm delivery hero"
              className={`relative z-10 h-[90%] w-auto object-contain object-bottom transition-all duration-1000 select-none ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              draggable={false}
            />

            {/* Floating: Product Card (bottom right) */}
            <div
              className={`absolute bottom-10 right-2 sm:right-6 z-20 bg-white rounded-2xl shadow-farm-xl p-3 flex items-center gap-3 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ minWidth: 180, animation: 'heroFloat 5s ease-in-out infinite' }}
            >
              <img src="/hero_veggie_basket.jpg" alt="Fresh Vegetables" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div>
                <div className="font-display font-bold text-farmGreen-900 text-xs mb-0.5">Fresh Vegetables</div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-farmGreen-800 text-sm">₹18.00</span>
                  <span className="text-[11px] text-farmMuted line-through">₹24.00</span>
                </div>
              </div>
            </div>

            {/* Floating: Delivery badge (top left) */}
            <div
              className={`absolute top-10 left-4 z-20 flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full shadow-farm-md transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
              style={{ animation: 'heroFloatAlt 6s ease-in-out infinite' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
                <Truck className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-farmMuted font-medium">Avg. Delivery</div>
                <div className="font-display font-bold text-farmGreen-900 text-xs">Under 2 Hours</div>
              </div>
            </div>

            {/* Floating: Rating badge (mid right) */}
            <div
              className={`absolute top-1/3 -right-2 sm:right-0 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-farm-md transition-all duration-1000 delay-400 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
              style={{ animation: 'heroFloat 7s ease-in-out infinite' }}
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-display font-bold text-farmGreen-900 text-xs">4.9 · 12k+ Reviews</span>
            </div>

            {/* Floating: Organic badge (mid left) */}
            <div
              className={`absolute top-1/2 left-0 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full shadow-farm-md transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
              style={{ animation: 'heroFloatAlt 5s ease-in-out infinite' }}
            >
              <ShieldCheck className="w-4 h-4 text-farmGreen-600" />
              <span className="font-display font-bold text-farmGreen-900 text-xs">100% Organic</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom white curve separator */}
      <div className="relative w-full" style={{ marginTop: -2 }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 60 }}>
          <path d="M0 60 C360 0 1080 0 1440 60 L1440 60 L0 60 Z" fill="#F8F9FA" />
        </svg>
      </div>

      {/* Keyframes injected inline for float animations */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes heroFloatAlt {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </section>
  );
};
