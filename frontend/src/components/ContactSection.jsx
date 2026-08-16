import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Call us',
    value: '+91 98765 43210',
    gradient: 'from-green-500 to-emerald-600',
    href: 'tel:+919876543210'
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'hello@localfarmdirect.in',
    gradient: 'from-blue-500 to-indigo-600',
    href: 'mailto:hello@localfarmdirect.in'
  },
  {
    icon: MapPin,
    label: 'Visit us',
    value: 'Farm Hub, Baner, Pune 411045',
    gradient: 'from-orange-500 to-red-500',
    href: '#'
  },
];

export const ContactSection = () => {
  const { openAuthModal } = useAuth();
  const [sectionRef, sectionVisible] = useScrollReveal();

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.07) 0%, transparent 70%)' }} />
      <div className="absolute -top-16 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,152,0,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className={`relative rounded-[32px] overflow-hidden reveal ${sectionVisible ? 'visible' : ''}`}
          style={{
            background: 'linear-gradient(135deg, #0A1F0E 0%, #1B5E20 45%, #2E7D32 100%)',
            boxShadow: '0 32px 80px rgba(10,31,14,0.30)'
          }}
        >
          {/* Internal ambient blobs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,240,96,0.07) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,152,0,0.05) 0%, transparent 70%)' }} />

          {/* Decorative top grain */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-10 sm:p-16 relative z-10">

            {/* Left: CTA */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-lime-300 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                Get in Touch
              </span>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-5 mb-4 leading-tight">
                Questions about{' '}
                <span style={{ color: '#a8f060' }}>ordering, farming,</span>{' '}
                or partnerships?
              </h2>

              <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
                Our team responds in under 90 seconds during business hours — and we're a phone call away any time you need help with an order.
              </p>

              <button
                onClick={() => openAuthModal('signup', 'Customer')}
                className="btn-glow inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-farmGreen-900 transition-all duration-300 group"
                style={{ background: 'linear-gradient(135deg, #a8f060, #6fcf37)', boxShadow: '0 8px 32px rgba(168,240,96,0.3)' }}
              >
                <span>Get Started Today</span>
                <span className="w-8 h-8 rounded-full bg-farmGreen-900/15 flex items-center justify-center group-hover:bg-farmGreen-900/25 transition-all group-hover:translate-x-1 duration-300">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>

            {/* Right: Contact info cards */}
            <div className="space-y-4">
              {CONTACT_INFO.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <a
                    key={idx}
                    href={info.href}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/12 group transition-all duration-300 hover:border-white/25 hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-white/55 uppercase tracking-widest font-semibold mb-0.5">{info.label}</div>
                      <div className="font-display font-semibold text-white text-sm group-hover:text-lime-300 transition-colors">{info.value}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/25 ml-auto group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300" />
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
