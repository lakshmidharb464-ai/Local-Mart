import React, { useState, useEffect, useRef } from 'react';
import { Award, ShieldCheck, Sparkles, Trophy } from 'lucide-react';

export const getMemberTier = (orderCount = 0) => {
  if (orderCount >= 30) {
    return {
      tier: 'Gold Tier',
      level: 'Gold',
      icon: Award,
      badgeColor: 'text-amber-400',
      bgColor: 'bg-[#061e0e]',
      borderColor: 'border-amber-500/30',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
      minOrders: 30,
      nextTier: null,
      ordersNeeded: 0,
      perks: ['Free Express Delivery', '15% Off All Orders', 'Priority Farm Harvest']
    };
  }
  if (orderCount >= 10) {
    return {
      tier: 'Silver Tier',
      level: 'Silver',
      icon: Trophy,
      badgeColor: 'text-slate-300',
      bgColor: 'bg-[#061e0e]',
      borderColor: 'border-slate-400/30',
      glow: 'shadow-[0_0_12px_rgba(203,213,225,0.15)]',
      minOrders: 10,
      nextTier: 'Gold Tier',
      ordersNeeded: 30 - orderCount,
      progressPct: Math.min(100, Math.round(((orderCount - 10) / 20) * 100)),
      perks: ['10% Off Orders', 'Free Standard Delivery on ₹300+']
    };
  }
  return {
    tier: 'Bronze Tier',
    level: 'Bronze',
    icon: ShieldCheck,
    badgeColor: 'text-amber-600',
    bgColor: 'bg-[#061e0e]',
    borderColor: 'border-amber-700/30',
    glow: 'shadow-xs',
    minOrders: 0,
    nextTier: 'Silver Tier',
    ordersNeeded: 10 - orderCount,
    progressPct: Math.min(100, Math.round((orderCount / 10) * 100)),
    perks: ['Welcome Buyer Status', 'Standard Delivery']
  };
};

export const MemberRank = ({ orderCount = 35, compact = false, showTooltip = true, tooltipPosition = 'bottom', tooltipAlign = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const tierInfo = getMemberTier(orderCount);
  const Icon = tierInfo.icon;

  // Handle click outside to close the tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (compact) {
    return (
      <div 
        ref={containerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Dark Green Pill matching User Image */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl ${tierInfo.bgColor} border ${tierInfo.borderColor} ${tierInfo.glow} transition-all duration-300 select-none cursor-pointer hover:scale-105 active:scale-95`}
        >
          {/* Yellow/Gold Ribbon Icon */}
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <Award className={`w-4 h-4 ${tierInfo.badgeColor} fill-current stroke-[1.5]`} />
          </div>

          <div className="flex flex-col leading-none text-left">
            <span className="text-[10px] font-semibold text-white/60 tracking-tight">Member Rank</span>
            <span className={`text-xs font-black tracking-tight ${tierInfo.badgeColor}`}>
              {tierInfo.tier}
            </span>
          </div>
        </div>

        {/* Tooltip Card */}
        {showTooltip && (
          <div 
            className={`absolute w-60 p-3.5 bg-[#05170a]/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl z-50 transition-all duration-200 text-left font-display ${
              tooltipAlign === 'left'
                ? 'left-0'
                : tooltipAlign === 'center'
                  ? 'left-1/2 -translate-x-1/2'
                  : 'right-0'
            } ${
              tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            } ${
              isOpen 
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                : 'opacity-0 translate-y-1 scale-95 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{tierInfo.tier} Member</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {orderCount} Orders
              </span>
            </div>

            {tierInfo.nextTier ? (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-emerald-200/90">
                  <span>Next: {tierInfo.nextTier}</span>
                  <span className="text-emerald-400">{tierInfo.ordersNeeded} orders to upgrade</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800/40">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${tierInfo.progressPct}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-2.5 text-[10px] font-extrabold text-amber-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Highest VIP Member Status Active! 🎉</span>
              </p>
            )}

            <div className="mt-3 pt-2 border-t border-emerald-900/40 space-y-1">
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Tier Privileges</span>
              {tierInfo.perks.map((p, idx) => (
                <div key={idx} className="text-[10px] font-semibold text-emerald-200/90 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl ${tierInfo.bgColor} border ${tierInfo.borderColor} ${tierInfo.glow} shadow-md`}
    >
      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
        <Award className={`w-5 h-5 ${tierInfo.badgeColor} fill-current stroke-[1.5]`} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] font-semibold text-gray-400 tracking-tight">Member Rank</span>
        <span className={`text-sm font-black tracking-tight ${tierInfo.badgeColor}`}>
          {tierInfo.tier}
        </span>
      </div>
    </div>
  );
};

export default MemberRank;
