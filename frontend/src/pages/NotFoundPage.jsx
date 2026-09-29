import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout, Home, ShoppingBag, Search, ArrowRight, Compass,
} from 'lucide-react';

/* ── Floating leaf that drifts with subtle bounce ────────────── */
const FloatingLeaf = ({ style }) => (
  <span
    className="pointer-events-none select-none absolute text-emerald-400/20 animate-bounce"
    style={style}
    aria-hidden="true"
  >
    🌿
  </span>
);

const LEAVES = [
  { bottom: '8%', left: '6%', fontSize: '1.4rem', animationDuration: '3.2s', animationDelay: '0s' },
  { bottom: '14%', left: '82%', fontSize: '1rem', animationDuration: '2.7s', animationDelay: '0.6s' },
  { bottom: '5%', left: '50%', fontSize: '1.6rem', animationDuration: '3.8s', animationDelay: '1.1s' },
  { bottom: '20%', left: '92%', fontSize: '0.9rem', animationDuration: '2.5s', animationDelay: '0.3s' },
  { bottom: '30%', left: '3%', fontSize: '1.1rem', animationDuration: '3.5s', animationDelay: '1.5s' },
];

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      className="min-h-[88vh] flex items-center justify-center p-4 sm:p-8 font-display"
      style={{ background: 'linear-gradient(160deg, #050f07 0%, #091a0e 55%, #0d2516 100%)' }}
    >
      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(46,166,114,0.13) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,167,69,0.11) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Main card ── */}
      <div
        className={`relative max-w-2xl w-full rounded-3xl p-6 sm:p-12 text-center overflow-hidden
          border border-emerald-500/20 shadow-2xl
          transition-all duration-700 ease-out

          
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{
          background: 'linear-gradient(145deg, rgba(11,61,46,0.92) 0%, rgba(7,26,12,0.97) 100%)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        }}
        role="main"
        aria-labelledby="nf-title"
      >
        {/* Gradient top border accent */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(46,166,114,0.5), rgba(212,167,69,0.4), transparent)' }}
          aria-hidden="true"
        />

        {/* Floating leaves */}
        {LEAVES.map((s, i) => <FloatingLeaf key={i} style={s} />)}

        {/* ── 404 badge ── */}
        <div className={`relative z-10 flex flex-col items-center gap-4 mb-6
          transition-all duration-700 delay-100 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Number */}
          <div className="relative inline-block">
            <span
              className="font-black leading-none tracking-widest select-none"
              style={{
                fontSize: 'clamp(5rem, 16vw, 8.5rem)',
                background: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 25%, #D4A745 65%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 24px rgba(46,166,114,0.4))',
              }}
            >
              404
            </span>
            {/* Bouncing compass */}
            <span
              className="absolute -top-2 -right-4 sm:-right-6 animate-bounce"
              style={{ animationDuration: '2s' }}
              aria-hidden="true"
            >
              <span
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl shadow-md"
                style={{
                  background: 'rgba(212,167,69,0.2)',
                  border: '1px solid rgba(212,167,69,0.4)',
                }}
              >
                <Compass className="w-5 h-5 text-amber-300" />
              </span>
            </span>
          </div>

          {/* Pill tag */}
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-300 shadow-xs"
            style={{
              background: 'rgba(46,166,114,0.15)',
              border: '1px solid rgba(46,166,114,0.35)',
            }}
          >
            <Sprout className="w-3.5 h-3.5 text-lime-400" />
            Crop Route Not Found
          </span>
        </div>

        {/* ── Heading & description ── */}
        <div className={`relative z-10 space-y-3 max-w-lg mx-auto mb-8
          transition-all duration-700 delay-150 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1
            id="nf-title"
            className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug"
          >
            Lost in the Farm Fields 🌾
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/70 leading-relaxed">
            The produce category, page, or route you're looking for has been harvested,
            relocated, or doesn't exist in our marketplace.
          </p>
        </div>

        {/* ── Search bar ── */}
        <form
          onSubmit={handleSearch}
          className={`relative z-10 max-w-md mx-auto mb-8
            transition-all duration-700 delay-200 ease-out
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          aria-label="Search the marketplace"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-emerald-400 pointer-events-none" aria-hidden="true" />
            <input
              id="nf-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organic kale, mangoes, tomatoes…"
              className="w-full pl-11 pr-26 py-3.5 rounded-2xl text-sm text-white placeholder-emerald-200/40 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(52,211,153,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              type="submit"
              id="nf-search-btn"
              className="absolute right-2 px-4 py-2 rounded-xl text-xs font-extrabold text-farmGreen-950 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-emerald-400 to-lime-300"
            >
              Search
            </button>
          </div>
        </form>

        {/* ── Action buttons ── */}
        <div className={`relative z-10 flex flex-wrap items-center justify-center gap-3
          transition-all duration-700 delay-300 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          <button
            id="nf-go-home"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-extrabold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg bg-gradient-to-r from-emerald-600 to-farmGreen-700 border border-emerald-400/30"
          >
            <Home className="w-4 h-4 text-amber-300" aria-hidden="true" />
            Return to Homepage
          </button>

          <button
            id="nf-browse-market"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-emerald-200 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-white/10 hover:bg-white/15 border border-white/15"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" aria-hidden="true" />
            Browse Marketplace
            <ArrowRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          </button>
        </div>

        {/* Gradient bottom border accent */}
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,167,69,0.25), transparent)' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default NotFoundPage;


