import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BrandLogo } from './BrandLogo';
import {
  ShoppingBag,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Home,
  Sprout,
  Truck,
  Phone,
  Store
} from 'lucide-react';

export const Navbar = ({ activeView, setActiveView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['home', 'about', 'services', 'marketplace', 'features', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActiveLink(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/#home', id: 'home', icon: Home },
    { label: 'About', to: '/#about', id: 'about', icon: Sprout },
    { label: 'Services', to: '/#services', id: 'services', icon: Truck },
    { label: 'Shop', to: '/#marketplace', id: 'marketplace', icon: Store },
    { label: 'Features', to: '/#features', id: 'features', icon: Sparkles },
    { label: 'Contact', to: '/#contact', id: 'contact', icon: Phone },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-2.5 bg-[#051408]/95 backdrop-blur-xl border-b border-emerald-500/20 shadow-2xl'
            : 'py-4 bg-[#05170a] border-b border-emerald-900/40 shadow-xl'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo with Link */}
          <Link
            to="/"
            onClick={() => {
              if (setActiveView) setActiveView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 focus:outline-none group cursor-pointer"
          >
            <BrandLogo variant="dark" />
          </Link>

          {/* Center Floating Glass Capsule Pill Navbar */}
          <nav
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-full shadow-2xl border border-white/30 transition-all duration-300"
            style={{
              background: 'rgba(220, 233, 223, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeLink === link.id;
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={(e) => {
                    if (location.pathname !== '/') {
                      navigate('/');
                    }
                    if (setActiveView) setActiveView('landing');
                    setActiveLink(link.id);

                    // Smooth scroll to section
                    const targetEl = document.getElementById(link.id);
                    if (targetEl) {
                      targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer bg-white text-emerald-950 shadow-xs border hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-md font-black'
                      : 'border-transparent hover:border-slate-800 hover:shadow-md'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-emerald-800'}`} />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse ml-0.5" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Controls matching User Screenshot */}
          <div className="flex items-center gap-4">

            {/* Circular Green Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-108 active:scale-95 cursor-pointer border-2 border-emerald-500 ring-4 ring-emerald-900/60"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#05170a] shadow-md animate-pulse">
                {totalCartCount > 0 ? totalCartCount : 5}
              </span>
            </button>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/dashboard"
                  onClick={() => {
                    if (setActiveView) setActiveView('dashboard');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black text-white bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md cursor-pointer border border-emerald-400/30 active:scale-95"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                  <span>{user?.role ? user.role.toUpperCase() : 'USER'} DASHBOARD</span>
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-emerald-200/80 hover:text-rose-400 rounded-full hover:bg-rose-500/20 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Mint Green Login Text */}
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-1.5 text-sm font-black text-emerald-400 hover:text-white transition-all cursor-pointer"
                >
                  Login
                </button>

                {/* Rounded Teal Register Pill Button */}
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-5 py-2.5 text-sm font-black text-white rounded-full bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-emerald-400/40 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden px-4 pt-3 pb-6 space-y-1 mt-2 mx-4 rounded-3xl bg-[#0a2311]/95 border border-emerald-500/30 shadow-2xl backdrop-blur-xl animate-fadeIn"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => {
                    if (location.pathname !== '/') {
                      navigate('/');
                    }
                    if (setActiveView) setActiveView('landing');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-black text-emerald-100 hover:bg-emerald-800/40 rounded-2xl transition-all"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
            {!isAuthenticated && (
              <div className="pt-3 border-t border-emerald-800/50 flex flex-col gap-2">
                <button
                  onClick={() => { openAuthModal('signin'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center font-black text-emerald-300 bg-white/10 rounded-2xl"
                >Login</button>
                <button
                  onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center font-black text-white rounded-2xl bg-emerald-600"
                >Register</button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
