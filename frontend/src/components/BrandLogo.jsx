import React, { useId, memo } from 'react';

export const BrandLogo = memo(({ 
  variant = 'dark', 
  theme, 
  className = '', 
  showTagline = true, 
  iconOnly = false 
}) => {
  // Support both theme="light"|"dark" and variant="light"|"dark"
  const currentVariant = theme || variant;
  const isLightBg = currentVariant === 'light' || currentVariant === 'lightBg';
  
  // Generate unique IDs for SVG gradients to prevent multi-instance collisions
  const baseId = useId();
  const leafGradId = `logoLeafGrad-${baseId}`;
  const handleGradId = `logoHandleGrad-${baseId}`;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} aria-label="LocalFarm Direct Brand Logo">
      {/* Leaf + Bag Icon Emblem */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 group">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={leafGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34A853" />
              <stop offset="100%" stopColor="#183D22" />
            </linearGradient>
            <linearGradient id={handleGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A5D6A7" />
              <stop offset="100%" stopColor="#257036" />
            </linearGradient>
          </defs>
          {/* Bag Handle */}
          <path d="M36 42 V28 C36 20 42 14 50 14 C58 14 64 20 64 28 V42" stroke={`url(#${handleGradId})`} strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Leaf Body */}
          <path d="M22 42 H78 C78 42 82 78 50 88 C18 78 22 42 22 42 Z" fill={`url(#${leafGradId})`} />
          {/* Leaf Vein */}
          <path d="M50 44 Q52 64 68 76" stroke="#D8EAD6" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.95" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="font-display font-extrabold text-xl sm:text-2xl tracking-tight flex items-center">
            <span className={isLightBg ? 'text-farmGreen-950' : 'text-white'}>
              Local
            </span>
            <span className={isLightBg ? 'text-farmGreen-700 font-black' : 'text-farmGreen-400 font-black'}>
              Mart
            </span>
          </div>
          {showTagline && (
            <span className={`text-[9px] font-bold tracking-widest uppercase font-mono mt-0.5 ${isLightBg ? 'text-farmGreen-800' : 'text-farmGreen-200'}`}>
              Direct Farm Market
            </span>
          )}
        </div>
      )}
    </div>
  );
});

BrandLogo.displayName = 'BrandLogo';

