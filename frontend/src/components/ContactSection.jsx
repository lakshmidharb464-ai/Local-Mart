import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, MapPin, ArrowRight, Sparkles, Copy, ExternalLink } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Direct Helpline',
    value: '+91 98765 43210',
    subtext: 'Available 7 AM - 9 PM daily',
    gradient: 'from-emerald-500 to-green-600',
    href: 'tel:+919876543210',
    actionType: 'call'
  },
  {
    icon: Mail,
    label: 'Support & Inquiries',
    value: 'hello@localfarmdirect.in',
    subtext: 'Response within 90 minutes',
    gradient: 'from-blue-500 to-indigo-600',
    href: 'mailto:hello@localfarmdirect.in',
    actionType: 'email'
  },
  {
    icon: MapPin,
    label: 'Central Hub',
    value: 'Farm Hub, Baner, Pune 411045',
    subtext: 'Distribution & cold storage center',
    gradient: 'from-amber-500 to-orange-500',
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
    <section id="contact" className="py-24 bg-white relative overflow-hidden font-display">

      {/* Decorative blobs */}
      <div 
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.07) 0%, transparent 70%)' }} 
        aria-hidden="true"
      />
      <div 
        className="absolute -top-16 right-0 w-72 h-72 rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(255,152,0,0.05) 0%, transparent 70%)' }} 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className={`relative rounded-[32px] overflow-hidden reveal ${sectionVisible ? 'visible' : ''} bg-gradient-to-br from-[#06170a] via-[#103817] to-[#1c5525] shadow-2xl border border-emerald-500/20`}
        >
          {/* Internal ambient blobs */}
          <div 
            className="absolute top-0 left-1/4 w-72 h-72 rounded-full pointer-events-none" 
            style={{ background: 'radial-gradient(circle, rgba(168,240,96,0.08) 0%, transparent 70%)' }} 
            aria-hidden="true"
          />
          <div 
            className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none" 
            style={{ background: 'radial-gradient(circle, rgba(255,152,0,0.06) 0%, transparent 70%)' }} 
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 sm:p-14 lg:p-16 relative z-10">

            {/* Left: CTA */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-lime-300 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Get in Touch
              </span>

              <h2 className="font-extrabold text-3xl sm:text-4xl text-white mt-5 mb-4 leading-tight tracking-tight">
                Questions about{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-200 to-amber-300">
                  ordering, farming,
                </span>{' '}
                or partnerships?
              </h2>

              <p className="text-emerald-100/75 text-base sm:text-lg leading-relaxed mb-8 max-w-md font-medium">
                Our support desk responds in under 90 seconds during business hours — and we're always one click away whenever you need order guidance.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => openAuthModal('signup', 'Customer')}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-farmGreen-950 transition-all duration-300 shadow-lg hover:shadow-lime-400/30 active:scale-95 cursor-pointer bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-400 hover:from-lime-200 hover:to-emerald-300"
                >
                  <span className="font-extrabold text-sm">Join Marketplace Today</span>
                  <span className="w-8 h-8 rounded-full bg-farmGreen-950/15 flex items-center justify-center group-hover:bg-farmGreen-950/25 transition-all group-hover:translate-x-1 duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Contact info cards */}
            <div className="space-y-4">
              {CONTACT_INFO.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <a
                    key={idx}
                    href={info.href}
                    onClick={(e) => handleCardClick(info, e)}
                    target={info.actionType === 'map' ? '_blank' : undefined}
                    rel={info.actionType === 'map' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-white/12 group transition-all duration-300 hover:border-white/30 hover:bg-white/12 bg-white/5 backdrop-blur-xl shadow-md cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-emerald-200/60 uppercase tracking-widest font-black mb-0.5">{info.label}</div>
                      <div className="font-extrabold text-white text-sm sm:text-base group-hover:text-lime-300 transition-colors truncate">
                        {info.value}
                      </div>
                      <div className="text-[11px] text-white/50 font-medium mt-0.5">
                        {info.subtext}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 ml-auto group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 shrink-0" />
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
