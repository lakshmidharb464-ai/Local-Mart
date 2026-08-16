import React from 'react';
import {
  Sun,
  Users,
  IndianRupee,
  ShieldCheck,
  Zap,
  Navigation,
  CheckCircle,
  Headphones,
  Truck,
  Leaf,
  Star,
  Award
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const TICKER_ITEMS = [
  { icon: Truck, label: 'Same-Day Delivery' },
  { icon: ShieldCheck, label: 'Verified Farmers' },
  { icon: Leaf, label: 'Zero Middleman' },
  { icon: Award, label: 'Freshness Guarantee' },
  { icon: Star, label: '4.9★ Rated' },
  { icon: IndianRupee, label: '20% Cheaper' },
  { icon: CheckCircle, label: 'Quality Assured' },
  { icon: Headphones, label: '24×7 Support' },
];

const FEATURE_GRADIENTS = [
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-green-600',
  'from-lime-400 to-emerald-500',
  'from-blue-400 to-indigo-500',
  'from-yellow-400 to-amber-500',
  'from-teal-400 to-cyan-500',
  'from-green-400 to-teal-500',
  'from-violet-400 to-purple-500',
];

export const FeaturesSection = () => {
  const features = [
    { icon: Sun, title: 'Fresh Daily Harvest', desc: 'Produce picked at sunrise, on your table by sunset. Nothing sits in a warehouse.' },
    { icon: Users, title: 'Direct from Farmers', desc: 'No middlemen. Every rupee goes further — for you, and for the people growing your food.' },
    { icon: IndianRupee, title: 'Affordable Prices', desc: 'Average basket costs 20% less than supermarket equivalents, no quality compromise.' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: '256-bit encrypted checkout, UPI, cards, wallets, COD — fraud-protected every transaction.' },
    { icon: Zap, title: 'Fast Delivery', desc: 'Same-day in 18 cities. Cold-chain logistics keep produce at field-fresh temperature.' },
    { icon: Navigation, title: 'Live Order Tracking', desc: 'Watch your order travel from farm to door in real-time, ETA accurate to 15 minutes.' },
    { icon: CheckCircle, title: 'Quality Assurance', desc: 'Every batch graded at source. Not fresh enough? Refund initiated automatically.' },
    { icon: Headphones, title: '24×7 Customer Support', desc: 'Real humans, any hour, in 8 regional languages. Avg response under 90 seconds.' },
  ];

  const [headerRef, headerVisible] = useScrollReveal();
  const [tickerRef, tickerVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal();

  // Double items for seamless loop
  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section id="features" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F8F9FA 0%, #F1F8F2 100%)' }}>

      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.06) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,195,74,0.07) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-2xl mx-auto text-center mb-12 reveal ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-farmGreen-700 bg-farmGreen-100 border border-farmGreen-200 px-4 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-farmGreen-500 text-farmGreen-500" />
            Why Trust Us
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-farmGreen-900 mt-5 mb-4 leading-tight">
            Why Choose{' '}
            <span className="gradient-text">Local Farm Direct</span>
          </h2>
          <p className="text-farmMuted text-base sm:text-lg max-w-lg mx-auto">
            Eight reasons families across 142 villages have switched their weekly fresh-food shop to us.
          </p>
        </div>

        {/* ── Animated Ticker Strip ── */}
        <div
          ref={tickerRef}
          className={`mb-14 reveal ${tickerVisible ? 'visible' : ''}`}
        >
          <div
            className="ticker-wrap rounded-2xl overflow-hidden py-4"
            style={{
              background: 'linear-gradient(135deg, #0A1F0E 0%, #163320 100%)',
              boxShadow: '0 8px 32px rgba(10,31,14,0.20)'
            }}
          >
            <div className="animate-marquee">
              {tickerDouble.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 mx-6 text-white/90 text-sm font-semibold font-display"
                  >
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-lime-400" />
                    </span>
                    {item.label}
                    <span className="ml-4 text-white/20">•</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const grad = FEATURE_GRADIENTS[idx % FEATURE_GRADIENTS.length];
            return (
              <div
                key={idx}
                className={`group bg-white border border-farmGreen-700/10 rounded-2xl p-6 card-hover cursor-default reveal ${gridVisible ? 'visible' : ''} delay-${[100,150,200,250,300,400,500,600][idx] || 100}`}
                style={{ boxShadow: '0 2px 12px rgba(15,40,24,0.05)' }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 icon-bounce`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Number badge */}
                <div className="text-[11px] font-bold text-farmMuted/50 uppercase tracking-widest mb-1">
                  0{idx + 1}
                </div>

                <h4 className="font-display font-bold text-base text-farmGreen-900 mb-2 group-hover:text-farmGreen-700 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-farmMuted text-xs leading-relaxed">
                  {feat.desc}
                </p>

                {/* Bottom accent line */}
                <div className={`mt-5 h-0.5 rounded-full bg-gradient-to-r ${grad} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
