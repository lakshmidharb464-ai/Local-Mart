import React from 'react';

export const BrandLogo = ({ variant = 'dark', theme, className = '', showTagline = true, iconOnly = false }) => {
  // Support both theme="light"|"dark" and variant="light"|"dark"
  const currentVariant = theme || variant;
  const isLightBg = currentVariant === 'light' || currentVariant === 'lightBg';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Leaf + Bag Icon Emblem */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 group">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300">
          <defs>
            <linearGradient id="logoLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
            <linearGradient id="logoHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#81C784" />
              <stop offset="100%" stopColor="#2E7D32" />
            </linearGradient>
          </defs>
          {/* Bag Handle */}
          <path d="M36 42 V28 C36 20 42 14 50 14 C58 14 64 20 64 28 V42" stroke="url(#logoHandleGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Leaf Body */}
          <path d="M22 42 H78 C78 42 82 78 50 88 C18 78 22 42 22 42 Z" fill="url(#logoLeafGrad)" />
          {/* Leaf Vein */}
          <path d="M50 44 Q52 64 68 76" stroke="#C8E6C9" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="font-display font-extrabold text-xl sm:text-2xl tracking-tight flex items-center">
            <span className={isLightBg ? 'text-farmGreen-900' : 'text-white'}>
              Local
            </span>
            <span className={isLightBg ? 'text-emerald-600 font-black' : 'text-emerald-400 font-black'}>
              Mart
            </span>
          </div>
          {showTagline && (
            <span className={`text-[9px] font-bold tracking-widest uppercase font-mono mt-0.5 ${isLightBg ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Direct Farm Market
            </span>
          )}
        </div>
      )}
    </div>
  );
};
