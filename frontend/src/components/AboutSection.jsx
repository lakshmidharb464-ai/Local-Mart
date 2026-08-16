import React, { useState } from 'react';
import { STATS } from '../data/mockData';
import { User, Heart, TrendingUp, Sprout, Tractor, Users, ShoppingBag, MapPin, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal';

const StatCounter = ({ stat, trigger }) => {
  const count = useCountUp(stat.count, 2200, trigger);

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
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition-all duration-300 shadow-xl group hover:-translate-y-1.5 flex flex-col items-center justify-between text-center relative overflow-hidden cursor-pointer">
      <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-400/30 transition-all duration-300 shadow-md">
        <Icon className="w-6 h-6 text-emerald-300" />
      </div>

      <div className="space-y-1 my-1">
        <div className="font-display font-extrabold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-200 to-amber-300 leading-none tabular-nums group-hover:scale-105 transition-transform duration-300">
          {count.toLocaleString()}{stat.suffix}
        </div>
        <div className="text-xs font-bold text-white uppercase tracking-widest font-display pt-1">
          {stat.label}
        </div>
      </div>

      {stat.subtext && (
        <span className="mt-3 text-[11px] font-semibold text-emerald-200/90 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
          {stat.subtext}
        </span>
      )}
    </div>
  );
};

export const AboutSection = () => {
  const [headerRef, headerVisible] = useScrollReveal();
  const [leftRef, leftVisible] = useScrollReveal();
  const [rightRef, rightVisible] = useScrollReveal();
  const [benefitsRef, benefitsVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();

  const [activeItem, setActiveItem] = useState(null);

  const missionItems = [
    {
      id: 'mission',
      label: 'Our Mission',
      icon: TrendingUp,
      barColor: 'bg-emerald-600',
      barGlow: 'group-hover:shadow-[0_0_15px_rgba(22,163,74,0.5)]',
      textColor: 'text-emerald-700',
      bgHover: 'hover:bg-emerald-50/40',
      iconBg: 'bg-emerald-100 text-emerald-700',
      text: "Put more of every food dollar back into the hands of the people who actually grow our food — while giving customers produce that's days fresher than the supermarket shelf.",
      impact: '80% Revenue Direct to Farmers'
    },
    {
      id: 'vision',
      label: 'Our Vision',
      icon: Sprout,
      barColor: 'bg-amber-500',
      barGlow: 'group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      textColor: 'text-amber-700',
      bgHover: 'hover:bg-amber-50/40',
      iconBg: 'bg-amber-100 text-amber-700',
      text: 'A food system where the distance between farm and plate is measured in kilometers, not weeks. Where farmers know their customers by name.',
      impact: 'Same-Day Harvest & Delivery'
    },
    {
      id: 'why',
      label: 'Why We Exist',
      icon: Heart,
      barColor: 'bg-rose-500',
      barGlow: 'group-hover:shadow-[0_0_15px_rgba(244,63,94,0.5)]',
      textColor: 'text-rose-600',
      bgHover: 'hover:bg-rose-50/40',
      iconBg: 'bg-rose-100 text-rose-600',
      text: 'Traditional supply chains take 40–60% margin. We collapse that distance — farmers keep 80%, customers pay 20% less, food arrives within hours of harvest.',
      impact: 'Eliminating Middlemen Margins'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden font-display">

      {/* Background Decorative Element */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-2xl mx-auto text-center mb-16 reveal ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full shadow-2xs">
            <Sprout className="w-4 h-4 text-emerald-700" />
            Who We Are
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-farmGreen-950 mt-4 mb-3 leading-tight tracking-tight">
            About{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 bg-clip-text text-transparent">Local Farm Direct</span>
          </h2>
          <p className="text-farmMuted text-base sm:text-lg font-bold">
            We're rebuilding the food supply chain — shorter, fairer, fresher.
          </p>
        </div>

        {/* Main Grid: Mission Cards List + Collage Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">

          {/* Left: Mission / Vision / Why We Exist Cards */}
          <div
            ref={leftRef}
            className={`space-y-6 reveal-left ${leftVisible ? 'visible' : ''}`}
          >
            {missionItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeItem === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(isSelected ? null : item.id)}
                  className={`group relative pl-6 pr-5 py-4 sm:py-5 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent ${item.bgHover} ${
                    isSelected ? 'bg-gray-50 border-gray-200 shadow-md scale-[1.01]' : ''
                  }`}
                >
                  {/* Vertical Left Bar Accent matching Screenshot */}
                  <div 
                    className={`absolute left-0 top-1 bottom-1 w-1.5 rounded-full ${item.barColor} transition-all duration-300 ${item.barGlow} group-hover:w-2`} 
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-xl ${item.iconBg} transition-transform group-hover:scale-110`}>
                          <Icon className={`w-4 h-4 ${item.textColor}`} />
                        </div>
                        <h3 className="font-extrabold text-xl text-farmGreen-950 tracking-tight">
                          {item.label}
                        </h3>
                      </div>

                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-gray-200 shadow-2xs text-gray-700">
                        {item.impact}
                      </span>
                    </div>

                    <p className="text-farmMuted font-bold leading-relaxed text-sm sm:text-base pl-0.5">
                      {item.text}
                    </p>

                    {isSelected && (
                      <div className="pt-2 animate-fadeIn flex items-center gap-2 text-xs font-black text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Interactive Impact Verified • Zero Middlemen Commission</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Modern Farm Photo Collage */}
          <div
            ref={rightRef}
            className={`relative h-[420px] sm:h-[480px] max-w-md mx-auto w-full reveal-right ${rightVisible ? 'visible' : ''}`}
          >
            {/* Main image */}
            <div className="absolute top-0 left-0 w-[72%] h-[68%] rounded-3xl overflow-hidden shadow-2xl img-zoom border-2 border-emerald-100">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
                alt="Green farm field"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Secondary image */}
            <div className="absolute bottom-0 right-0 w-[60%] h-[54%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white img-zoom">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
                alt="Vegetable crates"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Year badge */}
            <div
              className="absolute top-4 right-4 rounded-2xl p-4 text-center z-10 border border-emerald-100 shadow-lg"
              style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', minWidth: 90 }}
            >
              <div className="font-extrabold text-3xl text-emerald-800 leading-none">2021</div>
              <div className="text-[10px] text-farmMuted uppercase tracking-widest mt-1 font-black">Since</div>
            </div>

            {/* Floating organic badge */}
            <div
              className="absolute -left-4 bottom-24 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl z-20 border border-lime-400/40"
              style={{
                background: 'linear-gradient(135deg, #0d2516, #16381d)',
                animation: 'heroFloatAlt 5s ease-in-out infinite'
              }}
            >
              <Sprout className="w-4 h-4 text-amber-300" />
              <span className="text-white font-black text-xs">100% Organic Direct</span>
            </div>

            <style>{`
              @keyframes heroFloatAlt {
                0%, 100% { transform: translateY(-5px); }
                50% { transform: translateY(5px); }
              }
            `}</style>
          </div>
        </div>

        {/* Benefits Cards: For Farmers & For Customers */}
        <div
          ref={benefitsRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-16`}
        >
          {[
            {
              icon: User,
              title: 'For Farmers',
              iconColor: 'text-emerald-700',
              bg: 'from-emerald-50/70 via-white to-farmBg',
              border: 'border-emerald-200',
              accent: 'bg-emerald-600',
              items: [
                'Fair, transparent pricing — keep 80% of every sale',
                'Direct customer relationships, no middlemen',
                'Predictable demand, less food waste',
                'Free onboarding, tools, and logistics support'
              ],
              delay: 'delay-100',
            },
            {
              icon: Heart,
              title: 'For Customers',
              iconColor: 'text-amber-700',
              bg: 'from-amber-50/70 via-white to-farmBg',
              border: 'border-amber-200',
              accent: 'bg-amber-500',
              items: [
                'Produce harvested hours, not weeks, before delivery',
                'Know exactly which farm your food came from',
                'Pay 20% less than supermarket prices',
                'Same-day delivery, live order tracking'
              ],
              delay: 'delay-250',
            }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-3xl p-7 shadow-xs hover:shadow-md transition-all duration-300 reveal ${benefitsVisible ? 'visible' : ''} ${card.delay}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-2xs border border-gray-100`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h4 className="font-extrabold text-xl text-farmGreen-950">{card.title}</h4>
                </div>
                <ul className="space-y-3">
                  {card.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-farmMuted text-xs sm:text-sm font-bold">
                      <span className={`w-2 h-2 rounded-full ${card.accent} mt-1.5 shrink-0`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Animated Stats Strip */}
        <div
          ref={statsRef}
          className={`relative rounded-[32px] p-8 sm:p-12 overflow-hidden border border-emerald-500/20 shadow-2xl reveal ${statsVisible ? 'visible' : ''}`}
          style={{ background: 'linear-gradient(135deg, #071a0b 0%, #0d2516 40%, #16381d 80%, #1a4423 100%)' }}
        >
          {/* Live Banner Header */}
          <div className="flex items-center justify-center gap-2 mb-8 relative z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20" />
            <span className="text-amber-300 font-mono text-xs font-black tracking-widest uppercase">
              Real-Time Direct Farm Marketplace Impact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {STATS.map((stat, idx) => (
              <StatCounter key={idx} stat={stat} trigger={statsVisible} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
