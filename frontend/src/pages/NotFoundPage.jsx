import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Home, ShoppingBag, Search, MapPin, ArrowRight, RefreshCw, Compass, HelpCircle } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/#marketplace');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 font-display animate-fadeIn">
      <div className="max-w-3xl w-full bg-gradient-to-b from-[#071a0b] via-[#0d2516] to-[#071a0b] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-emerald-500/20 relative overflow-hidden text-center space-y-8">
        
        {/* Glowing Background Orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 404 Glowing Badge */}
        <div className="relative z-10 inline-flex flex-col items-center">
          <div className="relative">
            <span className="font-black text-8xl sm:text-9xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-lime-300 drop-shadow-lg select-none">
              404
            </span>
            <div className="absolute -top-3 -right-6 p-2 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 animate-bounce">
              <Compass className="w-8 h-8" />
            </div>
          </div>
          
          <span className="mt-2 px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest border border-emerald-400/30 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-lime-300" />
            <span>Crop Route Not Found</span>
          </span>
        </div>

        {/* Main Header & Description */}
        <div className="space-y-3 max-w-xl mx-auto relative z-10">
          <h1 className="font-black text-2xl sm:text-4xl text-white tracking-tight leading-snug">
            Oops! Lost in the Farm Fields 🌾
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/80 font-bold leading-relaxed">
            The page, produce item, or route you are looking for has been moved, harvested, or never existed in our direct farm market.
          </p>
        </div>

        {/* Interactive Produce Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative z-10">
          <div className="relative">
            <Search className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organic kale, mangoes, tomatoes..."
              className="w-full pl-12 pr-28 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 focus:border-emerald-400 rounded-2xl text-xs font-black text-white placeholder-emerald-200/50 outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Navigation Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow-lg flex items-center gap-2 border border-emerald-400/30 hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4 text-amber-300" />
            <span>Return to Homepage 🏠</span>
          </button>

          <button
            onClick={() => navigate('/#marketplace')}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-200 text-xs font-black transition-all cursor-pointer border border-white/15 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            <span>Browse Direct Market 🥬</span>
          </button>

          <button
            onClick={() => navigate('/#contact')}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-200 text-xs font-black transition-all cursor-pointer border border-white/15 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>Contact Farm Support 💬</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
