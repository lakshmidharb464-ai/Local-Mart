import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  ChevronDown,
  User,
  Shield,
  Check
} from 'lucide-react';

export const Navbar = ({ activeView, setActiveView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const scrollTicking = useRef(false);

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Role Badge Styling Config with Human-Friendly Color Gradients
  const ROLE_CONFIG = {
    Admin: { 
      label: 'Admin', 
      color: 'from-purple-500 to-indigo-600', 
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40', 
      icon: Shield,
      path: '/admin'
    },
    Farmer: { 
      label: 'Farmer', 
      color: 'from-emerald-500 to-farmGreen-600', 
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', 
      icon: Sprout,
      path: '/farmer'
    },
    Delivery: { 
      label: 'Delivery Hero', 
      color: 'from-amber-500 to-orange-600', 
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', 
      icon: Truck,
      path: '/delivery'
    },
    Customer: { 
      label: 'Food Lover', 
      color: 'from-teal-500 to-emerald-600', 
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40', 
      icon: User,
      path: '/customer'
    },
  };

  const currentRoleStyle = ROLE_CONFIG[user?.role] || ROLE_CONFIG.Customer;

  // Throttled Scroll Listener using requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          if (location.pathname === '/') {
            const sections = ['home', 'about', 'services', 'marketplace', 'features', 'contact'];
            for (const id of [...sections].reverse()) {
              const el = document.getElementById(id);
              if (el && window.scrollY >= el.offsetTop - 160) {
                setActiveLink(id);
                break;
              }
            }
          }
          scrollTicking.current = false;
        });
        scrollTicking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close menus on Escape key press or outside click & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', to: '/', id: 'home', icon: Home, isRoute: true },
    { label: 'About', to: '/#about', id: 'about', icon: Sprout, isRoute: false },
    { label: 'Services', to: '/#services', id: 'services', icon: Truck, isRoute: false },
    { label: 'Features', to: '/#features', id: 'features', icon: Sparkles, isRoute: false },
    { label: 'Contact', to: '/#contact', id: 'contact', icon: Phone, isRoute: false },
  ];

  const handleNavClick = useCallback((link) => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    if (link.isRoute) {
      if (link.to === '/' && location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(link.to);
      }
      if (setActiveView) setActiveView('landing');
      setActiveLink(link.id);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
    }
    if (setActiveView) setActiveView('landing');
    setActiveLink(link.id);

    setTimeout(() => {
      const targetEl = document.getElementById(link.id);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else if (link.id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  }, [location.pathname, navigate, setActiveView]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2.5 bg-slate-950/90 backdrop-blur-2xl border-b border-emerald-500/25 shadow-[0_12px_35px_rgba(0,0,0,0.6)]'
            : 'py-3.5 bg-farmGreen-950/90 backdrop-blur-xl border-b border-emerald-800/40 shadow-md'
        }`}
      >
        {/* Subtle Ambient Glowing Line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 via-amber-300/50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* 1. Brand Logo with Micro Glow & Human Touch */}
          <Link
            to="/"
            onClick={() => {
              if (setActiveView) setActiveView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl py-1 px-1.5 transition-transform duration-200 active:scale-95 shrink-0"
            aria-label="LocalFarm Direct Homepage"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-amber-500/10 to-teal-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <BrandLogo variant="dark" />
          </Link>

          {/* 2. Distinct Center Floating Island Pill Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-slate-900/70 backdrop-blur-2xl border border-emerald-500/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.3)]"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => {
              const isActive = (link.isRoute && location.pathname === link.to) || (!link.isRoute && location.pathname === '/' && activeLink === link.id);
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link);
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-emerald-600/30 text-white font-bold border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                      : 'text-emerald-100/80 hover:text-white hover:bg-white/[0.08] border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isActive ? 'text-emerald-300 scale-110' : 'text-emerald-400/80 group-hover:scale-105'
                    }`}
                  />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full ml-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* 3. Right Action Controls: Cart and User Session */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Glowing Interactive Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer bg-slate-900/80 border border-emerald-500/35 text-emerald-200 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group shadow-sm"
              title="Shopping Cart"
              aria-label={`Shopping cart with ${totalCartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:scale-110 text-emerald-300" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-slate-950 text-[10px] font-black min-w-[19px] h-[19px] rounded-full flex items-center justify-center px-1 border-2 border-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-scaleIn">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Session / Auth Controls */}
            {isAuthenticated ? (
              <div className="relative">
                {/* Account Chip Button */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-800/95 border border-emerald-500/40 text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-emerald-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group"
                  aria-expanded={userMenuOpen}
                  aria-label="User profile menu"
                >
                  {/* Role Avatar Dot */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-tr ${currentRoleStyle.color} text-white text-xs font-black shadow-inner`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left leading-none">
                    <span className="text-xs font-bold text-white max-w-[90px] truncate">
                      {user?.name ? user.name.split(' ')[0] : 'Account'}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 border ${currentRoleStyle.badge}`}>
                      {user?.role || 'Customer'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-emerald-300/70 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Popover Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-slate-950/98 border border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-2.5 z-50 animate-scaleIn">
                      {/* Header Info */}
                      <div className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 mb-2">
                        <div className="text-xs font-extrabold text-white truncate">{user?.name || 'LocalFarm Member'}</div>
                        <div className="text-[11px] text-emerald-300/70 truncate font-mono mt-0.5">{user?.email}</div>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Active Role: {user?.role || 'Customer'}</span>
                        </div>
                      </div>

                      {/* Menu Actions */}
                      <div className="space-y-1">
                        <NavLink
                          to="/dashboard"
                          onClick={() => {
                            if (setActiveView) setActiveView('dashboard');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-md transition-all cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-200" />
                          <span>Launch {user?.role || 'User'} Dashboard</span>
                        </NavLink>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-all cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Sign In Button */}
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full text-emerald-100 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Sign In
                </button>

                {/* Shimmer Register CTA */}
                <button
                  onClick={() => openAuthModal('signup')}
                  className="relative group px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-extrabold text-slate-950 rounded-full transition-all duration-300 shadow-[0_0_18px_rgba(245,158,11,0.35)] hover:shadow-[0_0_24px_rgba(245,158,11,0.6)] flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 border border-amber-300 hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Join Market</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-emerald-200 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/30 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-300" /> : <Menu className="w-5 h-5 text-emerald-300" />}
            </button>
          </div>
        </div>

        {/* 4. Mobile Glass Drawer with Backdrop */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-[60px] bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <div className="relative z-50 lg:hidden px-4 pt-3 pb-5 space-y-2 mt-2 mx-3 rounded-2xl bg-slate-950/98 border border-emerald-600/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-fadeIn">
              
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = (link.isRoute && location.pathname === link.to) || (!link.isRoute && location.pathname === '/' && activeLink === link.id);
                  return (
                    <NavLink
                      key={link.label}
                      to={link.to}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link);
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 text-emerald-200 border border-emerald-400/40 font-bold'
                          : 'text-emerald-100/80 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span>{link.label}</span>
                      </div>
                      {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />}
                    </NavLink>
                  );
                })}
              </div>

              {/* Mobile Auth Actions */}
              {isAuthenticated ? (
                <div className="pt-3 border-t border-emerald-900/40 flex flex-col gap-2 mt-2">
                  <NavLink
                    to="/dashboard"
                    onClick={() => {
                      if (setActiveView) setActiveView('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 shadow-md flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-200" />
                    <span>Go to {user?.role || 'User'} Dashboard</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-emerald-900/40 flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => { openAuthModal('signin'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-center text-xs font-semibold text-emerald-200 bg-white/[0.06] hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-center text-xs font-bold text-slate-950 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-md transition-all cursor-pointer"
                  >
                    Join Market / Register
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Navbar;
