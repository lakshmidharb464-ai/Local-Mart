import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { Mail, Send, Leaf, Instagram, Twitter, Facebook, Youtube, CheckCircle2 } from 'lucide-react';

const SOCIAL = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com', color: 'hover:text-pink-400' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: 'hover:text-sky-400' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com', color: 'hover:text-blue-400' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com', color: 'hover:text-red-400' },
];

export const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast, openAuthModal } = useAuth();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      if (showToast) showToast('Invalid Email', 'Please provide a valid email address.', 'error');
      return;
    }
    showToast('Subscribed! 🌾', 'Thank you for joining our weekly harvest newsletter.');
    setEmail('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
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
    }, 50);
  };

  const roleLinks = [
    { label: 'Customer Portal', action: () => openAuthModal('signin', 'Customer') },
    { label: 'Farmer Registration', action: () => openAuthModal('signup', 'Farmer') },
    { label: 'Delivery Partners', action: () => openAuthModal('signin', 'Delivery') },
    { label: 'Admin Governance', action: () => openAuthModal('signin', 'Admin') },
    { 
      label: 'Help & Support Desk', 
      action: () => {
        handleNavClick('contact');
        showToast('LocalFarm Help Desk 🎧', 'Our support team is available 7 AM - 9 PM daily.');
      } 
    },
  ];

  return (
    <footer className="relative overflow-hidden pt-20 pb-8 bg-gradient-to-b from-[#06170a] via-[#091f0e] to-[#040e06] text-white font-display border-t border-emerald-950">

      {/* Background ambient lighting */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.06) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} 
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(139,195,74,0.05) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <BrandLogo variant="dark" />
            </div>
            <p className="text-sm text-emerald-100/60 leading-relaxed max-w-sm font-medium">
              Connecting local farmers directly with families since 2021. Fresher produce, transparent pricing, and zero middleman commissions.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 pt-1">
              {SOCIAL.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (s.href === '#') {
                        e.preventDefault();
                        showToast(`${s.label} Social`, `Connecting to Local Farm ${s.label} page.`);
                      }
                    }}
                    aria-label={`Visit our ${s.label} page`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-emerald-200/60 ${s.color} transition-all duration-300 hover:scale-110 hover:bg-white/10 bg-white/5 border border-white/10 shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h5 className="font-extrabold text-white text-xs mb-5 uppercase tracking-widest text-emerald-300">Marketplace Navigation</h5>
            <ul className="space-y-3 text-sm text-emerald-100/70 font-medium">
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
                    className="hover:text-emerald-300 transition-colors flex items-center gap-2 group cursor-pointer text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 group-hover:bg-emerald-400 group-hover:scale-125 transition-all" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Portals */}
          <div>
            <h5 className="font-extrabold text-white text-xs mb-5 uppercase tracking-widest text-emerald-300">Support & Portals</h5>
            <ul className="space-y-3 text-sm text-emerald-100/70 font-medium">
              {roleLinks.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={item.action}
                    className="hover:text-emerald-300 transition-colors flex items-center gap-2 group cursor-pointer text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 group-hover:scale-125 transition-transform" />
                    <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-widest text-emerald-300">Weekly Harvest Digest</h5>
            <p className="text-xs text-emerald-100/60 leading-relaxed font-medium">
              Get seasonal recipes, harvest schedules, and farmer updates every Sunday morning.
            </p>

            {submitted ? (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 shadow-sm animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span className="text-xs font-bold font-display">You're subscribed! 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full space-y-2">
                <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/15 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all shadow-inner">
                  <Mail className="w-4 h-4 text-emerald-300 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email address for weekly harvest newsletter"
                    className="w-full pl-9 pr-22 py-2 bg-transparent text-xs font-semibold text-white placeholder-emerald-100/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-farmGreen-600 hover:from-emerald-500 hover:to-farmGreen-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-102 active:scale-95 border border-emerald-400/30"
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/45 font-medium">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
            <p>© {new Date().getFullYear()} Local Farm Direct (Green Market). All Rights Reserved.</p>
          </div>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Farmer Code of Conduct'].map((item, i) => (
              <a key={i} href="#" onClick={(e) => e.preventDefault()} className="hover:text-emerald-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

