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
  Award,
  Sparkles
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const TICKER_ITEMS = [
  { icon: Truck, label: 'Same-Day Delivery' },
  { icon: ShieldCheck, label: 'Verified Farmers' },
  { icon: Leaf, label: 'Zero Middleman' },
  { icon: Award, label: 'Freshness Guarantee' },
  { icon: Sparkles, label: '100% Direct Sourced' },
  { icon: IndianRupee, label: '85% Farmer Share' },
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
    { icon: IndianRupee, title: 'Fair Direct Pricing', desc: '85% goes directly to the farmer, giving you harvest-fresh produce at honest rates.' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: '256-bit encrypted checkout, UPI, cards, wallets, COD — fraud-protected every transaction.' },
    { icon: Zap, title: 'Fast Hyper-Local Delivery', desc: 'Same-day across local city hubs. Cold-chain logistics keep produce at field-fresh temperature.' },
    { icon: Navigation, title: 'Live Order Tracking', desc: 'Watch your order travel from farm to door in real-time, ETA accurate to 15 minutes.' },
    { icon: CheckCircle, title: 'Quality Assurance', desc: 'Every batch graded at source. Not fresh enough? Refund initiated automatically.' },
    { icon: Headphones, title: '24×7 Customer Support', desc: 'Real humans, any hour, in regional languages. Avg response under 90 seconds.' },
  ];

  const [headerRef, headerVisible] = useScrollReveal();
  const [tickerRef, tickerVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal();

  // Double items for seamless loop
  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#F8FAF8] via-[#F1F8F2] to-white">

      {/* Background decorative circles */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.06) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} 
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(139,195,74,0.07) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-2xl mx-auto text-center mb-12 reveal ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            Why Trust Us
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-farmGreen-950 mt-5 mb-4 leading-tight tracking-tight">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Local Farm Direct
            </span>
          </h2>
          <p className="text-farmMuted text-base sm:text-lg max-w-lg mx-auto font-bold">
            Eight reasons families across 142 villages have switched their weekly fresh-food shop to us.
          </p>
        </div>

        {/* ── Animated Ticker Strip (With Hover Pause) ── */}
        <div
          ref={tickerRef}
          className={`mb-14 reveal ${tickerVisible ? 'visible' : ''}`}
        >
          <div
            className="ticker-wrap rounded-2xl overflow-hidden py-4 shadow-xl border border-emerald-900/40 bg-gradient-to-r from-[#071a0b] via-[#102a16] to-[#071a0b]"
            title="Hover to pause ticker"
          >
            <div className="animate-marquee flex items-center">
              {tickerDouble.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2.5 mx-6 text-white/95 text-sm font-bold font-display shrink-0"
                  >
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-xs">
                      <Icon className="w-4 h-4 text-amber-300" />
                    </span>
                    <span>{item.label}</span>
                    <span className="ml-4 text-emerald-500/40">•</span>
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
                className={`group bg-white border border-emerald-900/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-400/40 cursor-default reveal ${gridVisible ? 'visible' : ''}`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Number badge */}
                <div className="text-xs font-black text-emerald-800/80 font-mono tracking-widest mb-1.5 flex items-center gap-1">
                  <span>0{idx + 1}</span>
                  <span className="w-4 h-px bg-emerald-200 group-hover:w-8 transition-all duration-300" />
                </div>

                <h4 className="font-display font-extrabold text-base text-farmGreen-950 mb-2 group-hover:text-emerald-700 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-farmMuted text-xs font-medium leading-relaxed">
                  {feat.desc}
                </p>

                {/* Bottom accent line */}
                <div className={`mt-5 h-1 rounded-full bg-gradient-to-r ${grad} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;

