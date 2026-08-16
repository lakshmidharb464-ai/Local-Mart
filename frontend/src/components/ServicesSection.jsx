import React from 'react';
import {
  Carrot,
  Apple,
  Milk,
  ShoppingBag,
  Truck,
  Store,
  ArrowUpRight
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SERVICE_CONFIG = [
  {
    icon: Carrot,
    title: 'Fresh Vegetables',
    desc: 'Leafy greens, root vegetables, seasonal specialties — picked the morning of delivery, never in cold storage.',
    gradient: 'from-orange-400 to-red-500',
    lightBg: 'from-orange-50 to-red-50',
    tag: 'Daily harvest'
  },
  {
    icon: Apple,
    title: 'Organic Fruits',
    desc: 'Mangoes, berries, citrus, bananas — tree-ripened, chemical-free, and delivered at peak flavor.',
    gradient: 'from-rose-400 to-pink-500',
    lightBg: 'from-rose-50 to-pink-50',
    tag: 'Chemical-free'
  },
  {
    icon: Milk,
    title: 'Dairy Products',
    desc: 'Fresh milk, paneer, ghee, curd from grass-fed cattle on partner farms — pasteurized, never powdered.',
    gradient: 'from-blue-400 to-indigo-500',
    lightBg: 'from-blue-50 to-indigo-50',
    tag: 'Grass-fed'
  },
  {
    icon: ShoppingBag,
    title: 'Grocery Items',
    desc: 'Stone-ground flours, unpolished rice, cold-pressed oils, pulses — minimally processed, maximally nutritious.',
    gradient: 'from-amber-400 to-yellow-500',
    lightBg: 'from-amber-50 to-yellow-50',
    tag: 'Unprocessed'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Same-day delivery in metros, next-day everywhere else. Live tracking farm to doorstep, cold-chain for perishables.',
    gradient: 'from-emerald-400 to-green-600',
    lightBg: 'from-emerald-50 to-green-50',
    tag: 'Same-day'
  },
  {
    icon: Store,
    title: 'Farmer Marketplace',
    desc: 'A direct-to-customer storefront for every farmer. List products, set prices, build a following — zero commission.',
    gradient: 'from-violet-400 to-purple-600',
    lightBg: 'from-violet-50 to-purple-50',
    tag: 'Zero commission'
  }
];

export const ServicesSection = () => {
  const [headerRef, headerVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal();

  return (
    <section id="services" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F1F8F2 0%, #ECFDF5 100%)' }}>

      {/* Large decorative background text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] font-black text-farmGreen-500/[0.025] pointer-events-none select-none whitespace-nowrap leading-none font-display"
      >
        FRESH
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div
          ref={headerRef}
          className={`max-w-2xl mx-auto text-center mb-16 reveal ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-farmGreen-700 bg-white border border-farmGreen-200 px-4 py-1.5 rounded-full shadow-sm">
            What We Offer
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-farmGreen-900 mt-5 mb-4 leading-tight">
            Services Built Around{' '}
            <span className="gradient-text">Freshness</span>
          </h2>
          <p className="text-farmMuted text-base sm:text-lg">
            From daily-harvested vegetables to a full marketplace for farmer goods — everything to eat local, eat better.
          </p>
        </div>

        {/* Service Cards */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CONFIG.map((srv, idx) => {
            const Icon = srv.icon;
            const delays = ['delay-100', 'delay-150', 'delay-200', 'delay-250', 'delay-300', 'delay-400'];
            return (
              <div
                key={idx}
                className={`group bg-white border border-white rounded-3xl overflow-hidden shadow-farm-sm card-hover cursor-default reveal ${gridVisible ? 'visible' : ''} ${delays[idx]}`}
              >
                {/* Top color bar */}
                <div className={`h-1.5 bg-gradient-to-r ${srv.gradient}`} />

                <div className="p-7">
                  {/* Icon + Tag row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${srv.gradient} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-all duration-400`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-gradient-to-r ${srv.lightBg} text-farmGreen-800 border border-farmGreen-100`}>
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-farmGreen-900 mb-3 group-hover:text-farmGreen-700 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-farmMuted text-sm leading-relaxed mb-5">
                    {srv.desc}
                  </p>

                  {/* Learn more link */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-farmGreen-600 group-hover:gap-2.5 transition-all duration-300">
                    <span>Learn more</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
