import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocalLocation } from '../hooks/useLocalLocation';
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
  Store,
  MapPin,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ activeView, setActiveView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const { location: selectedLocation, setLocation } = useLocalLocation();
  const scrollTicking = useRef(false);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const HUB_LOCATIONS = [
    { label: 'All Local Hubs', value: '' },
    { label: 'Pune Rural Hub', value: 'Pune' },
    { label: 'Baner & West Hub', value: 'Baner' },
    { label: 'Kothrud & South Hub', value: 'Kothrud' },
    { label: 'Aundh & Central Hub', value: 'Aundh' },
    { label: 'Hadapsar & East Hub', value: 'Hadapsar' },
  ];

  // Throttled Scroll Listener using requestAnimationFrame for optimal 60fps performance
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          if (location.pathname === '/') {
            const sections = ['home', 'about', 'services', 'marketplace', 'features', 'contact'];
            for (const id of [...sections].reverse()) {
              const el = document.getElementById(id);
              if (el && window.scrollY >= el.offsetTop - 150) {
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

  // Close mobile menu & location menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setLocationMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', to: '/', id: 'home', icon: Home, isRoute: true },
    { label: 'Shop Produce', to: '/products', id: 'products', icon: Store, isRoute: true },
    { label: 'About', to: '/#about', id: 'about', icon: Sprout, isRoute: false },
    { label: 'Services', to: '/#services', id: 'services', icon: Truck, isRoute: false },
    { label: 'Features', to: '/#features', id: 'features', icon: Sparkles, isRoute: false },
    { label: 'Contact', to: '/#contact', id: 'contact', icon: Phone, isRoute: false },
  ];

  const handleNavClick = useCallback((link) => {
    setMobileMenuOpen(false);
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

    // Smooth scroll to section with header offset
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2.5 shadow-lg bg-farmGreen-950/95 backdrop-blur-xl border-b border-farmGreen-700/40' : 'py-3.5 shadow-md bg-farmGreen-900/95 backdrop-blur-lg border-b border-farmGreen-800/60'
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
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg group cursor-pointer"
            aria-label="LocalFarm Direct Homepage"
          >
            <BrandLogo variant="dark" />
          </Link>

          {/* Center Floating Glass Capsule Pill Navbar */}
          <nav
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/12 shadow-inner transition-all duration-300"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeLink === link.id;
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link);
                  }}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${isActive
                      ? 'bg-emerald-500/25 text-white font-bold border border-emerald-400/40 shadow-xs'
                      : 'text-emerald-100/85 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 text-emerald-300"
                  />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full ml-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* Location Selector Pill */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLocationMenuOpen(!locationMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.07] hover:bg-white/15 border border-white/15 text-emerald-200 hover:text-white text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Select Local Farm Hub"
                aria-expanded={locationMenuOpen}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="max-w-[110px] truncate">
                  {selectedLocation ? selectedLocation : 'All Hubs'}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-300/70 shrink-0" />
              </button>

              {locationMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLocationMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-farmGreen-950/98 border border-emerald-800/60 shadow-2xl backdrop-blur-xl p-2 z-50 animate-scaleIn">
                    <div className="text-[10px] font-bold text-emerald-400/80 px-2.5 py-1 uppercase tracking-wider">
                      Select Local Agri Hub
                    </div>
                    {HUB_LOCATIONS.map((loc) => (
                      <button
                        key={loc.label}
                        onClick={() => {
                          setLocation(loc.value);
                          setLocationMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${selectedLocation === loc.value
                            ? 'bg-emerald-500/25 text-white font-bold'
                            : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        <span>{loc.label}</span>
                        {selectedLocation === loc.value && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Circular Glass Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer bg-white/[0.07] border border-white/15 text-emerald-200 hover:text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group"
              title="View Cart Drawer"
              aria-label={`View shopping cart with ${totalCartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2] transition-transform duration-200 group-hover:scale-110" />
              {totalCartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-farmGreen-950 text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-farmGreen-950 shadow-md bg-amber-400 animate-scaleIn"
                >
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/dashboard"
                  onClick={() => {
                    if (setActiveView) setActiveView('dashboard');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-farmGreen-700 hover:from-emerald-500 hover:to-farmGreen-600 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer border border-emerald-400/30 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{user?.role ? user.role.toUpperCase() : 'USER'} DASHBOARD</span>
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-emerald-200/80 hover:text-rose-300 rounded-full hover:bg-rose-500/20 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Clean Login Button */}
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full text-emerald-100 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Login
                </button>

                {/* Elegant Organic Register CTA Button */}
                <button
                  onClick={() => openAuthModal('signup')}
                  className="group px-5 py-2 text-xs font-bold text-white rounded-full transition-all duration-200 shadow-md hover:shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-emerald-600 to-farmGreen-600 hover:from-emerald-500 hover:to-farmGreen-500 border border-emerald-400/40 hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-emerald-200 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Backdrop */}
        {mobileMenuOpen && (
          <>
            {/* Tap-outside Backdrop */}
            <div
              className="fixed inset-0 top-16 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <div className="relative z-50 lg:hidden px-4 pt-3 pb-5 space-y-2 mt-2 mx-4 rounded-2xl bg-farmGreen-950/98 border border-emerald-800/40 shadow-2xl backdrop-blur-xl animate-fadeIn">
              
              {/* Mobile Location Selector */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mb-2">
                <div className="text-[10px] font-bold text-emerald-400/80 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Delivering To</span>
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-farmGreen-900 border border-emerald-700/50 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-400"
                >
                  {HUB_LOCATIONS.map((loc) => (
                    <option key={loc.label} value={loc.value} className="bg-farmGreen-950 text-white">
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeLink === link.id;
                return (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${isActive
                        ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold'
                        : 'text-emerald-100/80 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-emerald-900/40 flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => { openAuthModal('signin'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-center text-xs font-semibold text-emerald-200 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-center text-xs font-bold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-farmGreen-700 hover:from-emerald-500 hover:to-farmGreen-600 shadow-sm transition-all cursor-pointer"
                  >
                    Register
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

