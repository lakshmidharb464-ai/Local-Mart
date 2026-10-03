import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Heart, 
  Sprout, 
  Tractor, 
  Users, 
  ShoppingBag, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Zap 
} from 'lucide-react';
import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal';

const StatCounter = ({ stat, trigger }) => {
  const count = useCountUp(stat.count, 2000, trigger);

  const getStatIcon = (iconType) => {
    switch (iconType) {
      case 'farmer': return Tractor;
      case 'customer': return Users;
      case 'product': return ShoppingBag;
      case 'village': return MapPin;
      default: return Sprout;
    }
  };

  const Icon = getStatIcon(stat.iconType);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition-all duration-300 shadow-xl flex flex-col items-center justify-between text-center group cursor-default">
      <div className="w-11 h-11 rounded-2xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-5 h-5 text-emerald-300" />
      </div>

      <div className="space-y-1 my-1">
        <div className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-200 to-amber-300 leading-none tabular-nums">
          {count.toLocaleString()}{stat.suffix}
        </div>
        <div className="text-xs font-bold text-white uppercase tracking-wider font-display pt-1">
          {stat.label}
        </div>
      </div>

      {stat.subtext && (
        <span className="mt-2 text-[10px] sm:text-[11px] font-semibold text-emerald-200/90 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          {stat.subtext}
        </span>
      )}
    </div>
  );
};

export const AboutSection = () => {
  const { products } = useMarketplace();
  const [headerRef, headerVisible] = useScrollReveal();
  const [audienceRef, audienceVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();

  const [activeAudienceTab, setActiveAudienceTab] = useState('all');

  const stats = React.useMemo(() => {
    const set = new Set(products.map(p => p.farmerName).filter(Boolean));
    const activeFarmers = Math.max(set.size, 12);
    const activeProducts = Math.max(products.length, 24);
    return [
      { label: 'Active Farm Hubs', count: activeFarmers, suffix: '+', subtext: 'Verified Regional Growers', iconType: 'farmer' },
      { label: 'Direct Value to Farmers', count: 98, suffix: '%', subtext: 'Direct Payout to Growers', iconType: 'customer' },
      { label: 'Fresh Harvests Listed', count: activeProducts, suffix: '+', subtext: 'Updated Daily from Fields', iconType: 'product' },
      { label: 'Farm Belts Connected', count: 18, suffix: '+', subtext: 'Direct Supply Routes', iconType: 'village' }
    ];
  }, [products]);

  const AUDIENCES = [
    {
      id: 'customer',
      role: 'For Customers',
      tag: 'Fresh & Chemical-Free',
      icon: ShoppingBag,
      theme: {
        badge: 'bg-amber-500/20 text-amber-900 border-amber-300',
        bg: 'from-amber-50/60 via-white to-amber-50/20',
        border: 'border-amber-200 hover:border-amber-400',
        iconBg: 'bg-amber-100 text-amber-700',
        bullet: 'bg-amber-500',
        highlight: 'text-amber-800'
      },
      headline: 'Farm to Plate in 2 Hours',
      points: [
        'Harvested at sunrise, at your door in 2 hours',
        '20% lower price than supermarket retail',
        '100% chemical-free with farm trace'
      ]
    },
    {
      id: 'farmer',
      role: 'For Farmers',
      tag: 'Zero Middlemen',
      icon: Sprout,
      theme: {
        badge: 'bg-emerald-500/20 text-emerald-900 border-emerald-300',
        bg: 'from-emerald-50/60 via-white to-emerald-50/20',
        border: 'border-emerald-200 hover:border-emerald-400',
        iconBg: 'bg-emerald-100 text-emerald-700',
        bullet: 'bg-emerald-600',
        highlight: 'text-emerald-800'
      },
      headline: '98% Direct Revenue Payout',
      points: [
        'Keep 98% of your crop sale value',
        'Direct bank deposit within 24 hours',
        'Free doorstep harvest collection & tools'
      ]
    },
    {
      id: 'delivery',
      role: 'For Delivery Heroes',
      tag: 'Instant Daily Earnings',
      icon: Truck,
      theme: {
        badge: 'bg-cyan-500/20 text-cyan-900 border-cyan-300',
        bg: 'from-cyan-50/60 via-white to-cyan-50/20',
        border: 'border-cyan-200 hover:border-cyan-400',
        iconBg: 'bg-cyan-100 text-cyan-700',
        bullet: 'bg-cyan-600',
        highlight: 'text-cyan-800'
      },
      headline: 'Flexible Express Routes',
      points: [
        'Earn up to ₹800/day on local clusters',
        'Instant daily wallet withdrawals',
        'Optimized smart route navigation'
      ]
    }
  ];

  return (
    <section id="about" className="py-20 sm:py-24 bg-gradient-to-b from-[#F7F5F0] via-white to-[#F7F5F0] relative overflow-hidden font-display">

      {/* Ambient Radial Lighting Overlay */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header: Punchy & Clear */}
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-12 sm:mb-14 reveal ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-900 bg-emerald-100/90 border border-emerald-300/60 px-4 py-1.5 rounded-full shadow-xs">
            <Sprout className="w-4 h-4 text-emerald-700" />
            Direct Farm Supply Model
          </span>
          <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl text-farmGreen-950 mt-3 mb-3 leading-tight tracking-tight">
            How LocalFarm Direct Works
          </h2>
          <p className="text-farmMuted text-sm sm:text-base font-bold max-w-xl mx-auto">
            A 100% direct marketplace connecting growers, families, and express delivery heroes with zero middlemen.
          </p>
        </div>

        {/* ── 3 Target Audience Value Pillars (Customer, Farmer, Delivery) ── */}
        <div
          ref={audienceRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 reveal ${audienceVisible ? 'visible' : ''}`}
        >
          {AUDIENCES.map((aud) => {
            const Icon = aud.icon;
            return (
              <div
                key={aud.id}
                className={`rounded-3xl p-6 bg-gradient-to-br ${aud.theme.bg} border-2 ${aud.theme.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`p-2.5 rounded-2xl ${aud.theme.iconBg} shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${aud.theme.badge}`}>
                      {aud.tag}
                    </span>
                  </div>

                  {/* Target Audience Title & Headline */}
                  <h3 className="text-xs font-black uppercase tracking-wider text-farmMuted mb-1">
                    {aud.role}
                  </h3>
                  <h4 className={`text-xl font-extrabold ${aud.theme.highlight} mb-4 leading-snug`}>
                    {aud.headline}
                  </h4>

                  {/* 3 Punchy Benefit Points */}
                  <ul className="space-y-2.5 mb-6">
                    {aud.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${aud.theme.highlight}`} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Visual Guarantee */}
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Verified Process
                  </span>
                  <span className="text-emerald-700 font-extrabold">100% Direct</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Real-Time Marketplace Impact Stats Strip ── */}
        <div
          ref={statsRef}
          className={`relative rounded-[32px] p-6 sm:p-10 overflow-hidden border border-emerald-500/30 shadow-2xl reveal ${statsVisible ? 'visible' : ''} bg-gradient-to-br from-[#04150A] via-[#072413] to-[#0E341B]`}
        >
          {/* Subtle Ambient Lighting */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6 relative z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20" />
            <span className="text-amber-300 font-mono text-xs font-black tracking-widest uppercase">
              Live Direct Marketplace Network
            </span>
          </div>

          {/* 4 Clean Real Stat Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {stats.map((stat, idx) => (
              <StatCounter key={idx} stat={stat} trigger={statsVisible} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;

