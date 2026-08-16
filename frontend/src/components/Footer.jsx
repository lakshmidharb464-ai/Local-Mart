import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { Phone, Mail, MapPin, Send, Leaf, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const SOCIAL = [
  { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-400' },
  { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-sky-400' },
  { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:text-blue-400' },
  { icon: Youtube, label: 'YouTube', href: '#', color: 'hover:text-red-400' },
];

export const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast, openAuthModal } = useAuth();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscribed!', 'Thank you for joining our weekly harvest newsletter.');
    setEmail('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleNavClick = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const roleLinks = [
    { label: 'Customer Portal', action: () => openAuthModal('signin', 'Customer') },
    { label: 'Farmer Registration', action: () => openAuthModal('signup', 'Farmer') },
    { label: 'Delivery Partners', action: () => openAuthModal('signin', 'Delivery') },
    { label: 'Admin Governance', action: () => openAuthModal('signin', 'Admin') },
    { 
      label: 'Help & FAQ', 
      action: () => {
        handleNavClick('contact');
        showToast('LocalFarm Help Desk 🎧', 'Need assistance? Fill out the contact form or call +91 98230 11223.');
      } 
    },
  ];

  return (
    <footer className="relative overflow-hidden pt-20 pb-8" style={{ background: 'linear-gradient(180deg, #0A1F0E 0%, #0F2818 100%)' }}>

      {/* Background ambient */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.05) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,195,74,0.04) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/8">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <BrandLogo variant="dark" />
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-sm">
              Connecting local farmers directly with customers since 2021. Fresher food, fairer prices, stronger rural economies — one delivery at a time.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 pt-1">
              {SOCIAL.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    onClick={(e) => {
                      e.preventDefault();
                      showToast(`${s.label} Social`, `Connecting to Local Farm ${s.label} page.`);
                    }}
                    aria-label={s.label}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white/40 ${s.color} transition-all duration-300 hover:scale-110 hover:bg-white/10`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="font-display font-bold text-white text-sm mb-5 uppercase tracking-widest">Navigation</h5>
            <ul className="space-y-2.5 text-sm text-white/55">
              {[
                { label: 'Home', section: 'home' },
                { label: 'About Us', section: 'about' },
                { label: 'Services', section: 'services' },
                { label: 'Features', section: 'features' },
                { label: 'Contact', section: 'contact' },
              ].map((item, i) => (
                <li key={i}>
                  <button 
                    onClick={() => handleNavClick(item.section)}
                    className="hover:text-farmGreen-400 transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                  >
                    <span className="w-1 h-1 rounded-full bg-farmGreen-600 group-hover:bg-farmGreen-400 transition-colors" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Roles */}
          <div>
            <h5 className="font-display font-bold text-white text-sm mb-5 uppercase tracking-widest">Support & Roles</h5>
            <ul className="space-y-2.5 text-sm text-white/55">
              {roleLinks.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={item.action}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group cursor-pointer text-left font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                    <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h5 className="font-display font-bold text-white text-sm uppercase tracking-widest">Stay in the loop</h5>
            <p className="text-xs text-white/55 leading-relaxed">
              Weekly harvest updates, seasonal recipes, and farmer stories — every Sunday morning.
            </p>

            {submitted ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                <Leaf className="w-4 h-4 text-lime-400" />
                <span className="text-xs font-bold font-display">You're subscribed! 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full space-y-2">
                <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/15 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all shadow-inner">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-24 py-2 bg-transparent text-xs font-semibold text-white placeholder-white/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-farmGreen-700 hover:from-emerald-500 hover:to-farmGreen-600 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-102 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/35">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-farmGreen-600" />
            <p>© 2026 Local Farm Direct (Green Basket). All Rights Reserved.</p>
          </div>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'PRD Specs'].map((item, i) => (
              <a key={i} href="#" className="hover:text-white/80 transition-colors">{item}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};
