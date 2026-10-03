import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, MapPin, ArrowRight, Sparkles, Copy, ExternalLink } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Direct Helpline',
    value: '+91 98765 43210',
    subtext: 'Available 7 AM – 9 PM daily',
    gradient: 'from-emerald-500 to-teal-600',
    iconColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/20 border-emerald-400/40',
    href: 'tel:+919876543210',
    actionType: 'call'
  },
  {
    icon: Mail,
    label: 'Support & Inquiries',
    value: 'hello@localfarmdirect.in',
    subtext: 'Guaranteed response within 90 mins',
    gradient: 'from-cyan-500 to-blue-600',
    iconColor: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/20 border-cyan-400/40',
    href: 'mailto:hello@localfarmdirect.in',
    actionType: 'email'
  },
  {
    icon: MapPin,
    label: 'Central Distribution Hub',
    value: 'Farm Hub, Baner, Pune 411045',
    subtext: 'Cold-chain storage & daily dispatch',
    gradient: 'from-amber-500 to-orange-500',
    iconColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/20 border-amber-400/40',
    href: 'https://maps.google.com/?q=Baner,Pune',
    actionType: 'map'
  },
];

export const ContactSection = () => {
  const { openAuthModal, showToast } = useAuth();
  const [sectionRef, sectionVisible] = useScrollReveal();

  const handleCardClick = (info, e) => {
    if (info.actionType === 'map') {
      e.preventDefault();
      if (showToast) {
        showToast('Central Farm Hub 📍', 'Opening LocalFarm central distribution hub in Baner, Pune.');
      }
      window.open(info.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-[#F7F5F0] relative overflow-hidden font-display">

      {/* Ambient background blur */}
      <div 
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl" 
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)' }} 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className={`relative rounded-[32px] overflow-hidden reveal ${sectionVisible ? 'visible' : ''} bg-gradient-to-br from-[#04150A] via-[#072413] to-[#0E341B] shadow-2xl border-2 border-emerald-500/30`}
        >
          {/* Internal ambient backlights */}
          <div 
            className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none opacity-30 blur-3xl" 
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)' }} 
            aria-hidden="true"
          />
          <div 
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none opacity-25 blur-3xl" 
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)' }} 
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 lg:p-16 relative z-10">

            {/* Left: CTA & Headline (7 cols) */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-400/40 px-4 py-1.5 rounded-full shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                24/7 Dedicated Support
              </span>

              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white mt-4 mb-4 leading-tight tracking-tight">
                Questions about{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                  ordering or farming?
                </span>
              </h2>

              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-medium">
                Our local agri-support team responds in under <strong>90 seconds</strong> during harvest hours. We are here to support customers, farmers, and delivery heroes.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openAuthModal('signup', 'Customer')}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-400/25 hover:scale-[1.02] active:scale-95 cursor-pointer border border-amber-300"
                >
                  <span>Join Marketplace Today</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Right: Crisp Contact Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-3.5">
              {CONTACT_INFO.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <a
                    key={idx}
                    href={info.href}
                    onClick={(e) => handleCardClick(info, e)}
                    target={info.actionType === 'map' ? '_blank' : undefined}
                    rel={info.actionType === 'map' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 sm:p-4.5 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/70 bg-slate-950/80 hover:bg-slate-900/90 backdrop-blur-xl shadow-lg group transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                  >
                    <div className={`w-11 h-11 rounded-xl ${info.badgeBg} border flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${info.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-emerald-300 font-black uppercase tracking-wider mb-0.5">
                        {info.label}
                      </div>
                      <div className="font-extrabold text-white text-sm sm:text-base group-hover:text-amber-300 transition-colors truncate">
                        {info.value}
                      </div>
                      <div className="text-[11px] text-emerald-100/75 font-medium mt-0.5">
                        {info.subtext}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400/50 group-hover:text-amber-300 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                  </a>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
