import React, { useState, useEffect, useRef } from 'react';
import { Award, ShieldCheck, Sparkles, Trophy, Crown, Star } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

/**
 * 3 Unique Visual Badges with Custom Geometric Shapes, Metallic Gradients & Neon Glows
 * Derived 100% from Live Database Records (No Mock Overrides)
 */
export const getMemberTier = (orderCount = 0) => {
  const count = Math.max(0, Number(orderCount) || 0);

  if (count >= 30) {
    return {
      tier: 'Gold VIP',
      level: 'Gold',
      icon: Crown,
      shape: 'medallion', // Crowned Royal Medallion
      accentColor: 'text-amber-300',
      tagline: 'Top 1% VIP Privileges',
      gradient: 'from-amber-400 via-yellow-300 to-amber-600',
      pillBg: 'bg-gradient-to-r from-[#171408] via-[#241c05] to-[#171408]',
      borderColor: 'border-amber-400/60',
      glow: 'shadow-[0_0_24px_rgba(251,191,36,0.35)]',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-amber-950',
      minOrders: 30,
      nextTier: null,
      ordersNeeded: 0,
      discount: '15% Off',
      delivery: 'Free Express',
    };
  }

  if (count >= 10) {
    return {
      tier: 'Silver Star',
      level: 'Silver',
      icon: Trophy,
      shape: 'diamond', // Faceted Diamond Prism
      accentColor: 'text-slate-200',
      tagline: 'Preferred Buyer',
      gradient: 'from-slate-200 via-white to-slate-400',
      pillBg: 'bg-gradient-to-r from-[#0c141c] via-[#131d27] to-[#0c141c]',
      borderColor: 'border-slate-300/50',
      glow: 'shadow-[0_0_20px_rgba(148,163,184,0.3)]',
      iconBg: 'bg-gradient-to-tr from-slate-300 to-white text-slate-900',
      minOrders: 10,
      nextTier: 'Gold VIP',
      ordersNeeded: 30 - count,
      progressPct: Math.min(100, Math.round(((count - 10) / 20) * 100)),
      discount: '10% Off',
      delivery: 'Free @ ₹300',
    };
  }

  return {
    tier: 'Bronze',
    level: 'Bronze',
    icon: ShieldCheck,
    shape: 'hexagon', // Shield / Hexagon Emblem
    accentColor: 'text-amber-500',
    tagline: 'Community Member',
    gradient: 'from-amber-600 via-amber-500 to-amber-800',
    pillBg: 'bg-gradient-to-r from-[#170e06] via-[#241609] to-[#170e06]',
    borderColor: 'border-amber-700/50',
    glow: 'shadow-[0_0_14px_rgba(180,83,9,0.2)]',
    iconBg: 'bg-gradient-to-tr from-amber-700 to-amber-500 text-amber-100',
    minOrders: 0,
    nextTier: 'Silver Star',
    ordersNeeded: 10 - count,
    progressPct: Math.min(100, Math.round((count / 10) * 100)),
    discount: 'Farm Direct',
    delivery: 'Standard 2h',
  };
};

/**
 * Geometric Badge Emblem Visual Component
 */
const BadgeEmblem = ({ shape, Icon, iconBg, level }) => {
  if (shape === 'medallion') {
    // 🥇 Gold Medallion with rotating starburst outer ring
    return (
      <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300/70 animate-spin" style={{ animationDuration: '10s' }} />
        <div className={`w-5.5 h-5.5 rounded-full ${iconBg} flex items-center justify-center shadow-sm`}>
          <Crown className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>
    );
  }

  if (shape === 'diamond') {
    // 🥈 Silver Diamond Prism Shape
    return (
      <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
        <div className="w-5.5 h-5.5 rotate-45 rounded-md bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 p-[1.5px] shadow-sm">
          <div className="w-full h-full bg-[#0c141c] rounded-[3px] flex items-center justify-center">
            <Trophy className="w-3 h-3 text-slate-100 -rotate-45" />
          </div>
        </div>
      </div>
    );
  }

  // 🥉 Bronze Shield / Hexagon Shape
  return (
    <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
      <div className="w-5.5 h-6 bg-gradient-to-b from-amber-500 to-amber-800 rounded-b-xl rounded-t-sm flex items-center justify-center shadow-sm p-0.5">
        <div className="w-full h-full bg-[#170e06] rounded-b-[10px] rounded-t-[2px] flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </div>
    </div>
  );
};

export const MemberRank = ({ 
  orderCount, 
  compact = true, 
  showTooltip = true, 
  tooltipPosition = 'bottom', 
  tooltipAlign = 'left' 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate initial count authentically from props or user state
  const fallbackCount = Number(
    orderCount ??
    user?.profile?.order_count ?? 
    user?.orderCount ?? 
    user?.order_count ?? 
    0
  );

  const [liveOrderCount, setLiveOrderCount] = useState(fallbackCount);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Sync state if props or auth user profile changes
  useEffect(() => {
    if (orderCount !== undefined && orderCount !== null) {
      setLiveOrderCount(Number(orderCount));
    }
  }, [orderCount]);

  // Fetch authentic live customer metrics directly from database
  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated) {
      apiClient('/customers/tier')
        .then(res => {
          if (isMounted && res && res.success && typeof res.orderCount === 'number') {
            setLiveOrderCount(res.orderCount);
          }
        })
        .catch(() => {
          // If network error occurs, retain the user's authentic profile count
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id]);

  const tier = getMemberTier(liveOrderCount);
  const Icon = tier.icon;

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative inline-block z-30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Visual Compact Badge Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${tier.pillBg} border ${tier.borderColor} ${tier.glow} transition-all duration-300 select-none cursor-pointer hover:scale-105 active:scale-95 group focus:outline-none`}
      >
        {/* Geometric Emblem */}
        <BadgeEmblem 
          shape={tier.shape} 
          Icon={Icon} 
          iconBg={tier.iconBg} 
          level={tier.level} 
        />

        {/* Minimal Label */}
        <div className="flex items-center gap-1.5 font-display text-left">
          <span className={`text-xs font-black tracking-tight ${tier.accentColor}`}>
            {tier.tier}
          </span>
          <span className="text-[10px] font-bold text-white/50 bg-white/10 px-1.5 py-0.5 rounded-full font-mono">
            {liveOrderCount}
          </span>
        </div>
      </button>

      {/* Visual Minimalist Popover Tooltip */}
      {showTooltip && (
        <div 
          className={`absolute w-64 p-3.5 bg-[#08120b]/95 backdrop-blur-xl border ${tier.borderColor} rounded-2xl shadow-2xl z-50 transition-all duration-200 text-left font-display ${
            tooltipAlign === 'left' ? 'left-0' : tooltipAlign === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0'
          } ${
            tooltipPosition === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
          } ${
            isOpen 
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
              : 'opacity-0 translate-y-1.5 scale-95 pointer-events-none'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BadgeEmblem shape={tier.shape} Icon={Icon} iconBg={tier.iconBg} level={tier.level} />
              <div>
                <h4 className="text-xs font-black text-white leading-none">{tier.tier}</h4>
                <p className="text-[10px] text-emerald-400 font-bold mt-0.5">{tier.tagline}</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-white/80 bg-white/10 px-2 py-0.5 rounded-full font-mono">
              {liveOrderCount} Orders
            </span>
          </div>

          {/* Quick Perks Chips */}
          <div className="grid grid-cols-2 gap-1.5 my-2.5">
            <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 text-center">
              <span className="text-[9px] text-white/50 uppercase font-bold block">Savings</span>
              <span className="text-xs font-black text-emerald-400">{tier.discount}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 text-center">
              <span className="text-[9px] text-white/50 uppercase font-bold block">Delivery</span>
              <span className="text-xs font-black text-amber-300">{tier.delivery}</span>
            </div>
          </div>

          {/* Next Tier Progress Bar */}
          {tier.nextTier ? (
            <div className="space-y-1 pt-1 border-t border-white/10">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-white/60">Next: {tier.nextTier}</span>
                <span className="text-emerald-400">{tier.ordersNeeded} orders left</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${tier.gradient} rounded-full transition-all duration-500`}
                  style={{ width: `${tier.progressPct}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="pt-1 border-t border-white/10 flex items-center justify-center gap-1 text-[10px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3" />
              <span>Highest VIP Tier Active</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberRank;
