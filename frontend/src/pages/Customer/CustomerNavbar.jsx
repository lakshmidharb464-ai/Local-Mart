import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  Home, Leaf, Heart, ShoppingCart, PackageCheck,
  Settings, LogOut, Sprout, Menu, X, ChevronRight,
  ShieldCheck, MapPin, Star, Search, Bell, User,
  Sparkles, Award, Lock, ChevronDown, CheckCircle2
} from 'lucide-react';

/* ── Icon pill nav item ── */
const NavPill = ({ item, isActive, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-extrabold transition-all duration-200 cursor-pointer relative whitespace-nowrap ${
        isActive
          ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-700/20 border-emerald-400/40 text-emerald-300 shadow-sm ring-1 ring-emerald-400/30'
          : hov
            ? 'bg-white/10 text-white border-white/10'
            : 'bg-transparent text-white/70 border-transparent'
      }`}
    >
      <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : hov ? 'text-white' : 'text-emerald-400/70'}`} />
      <span>{item.label}</span>
      {item.badge > 0 && (
        <span className="min-w-[18px] h-4 rounded-full px-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
      {/* Active bottom accent bar */}
      {isActive && (
        <span className="absolute -bottom-1 left-3 right-3 h-[2px] rounded-full bg-emerald-400 shadow-xs" />
      )}
    </button>
  );
};

/* ── Icon-only action button ── */
const IconBtn = ({ icon: Icon, badge, label, onClick, isActive }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={label}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 ring-1 ring-emerald-400/30 shadow-xs'
          : hov
            ? 'bg-white/15 border-white/20 text-white'
            : 'bg-white/5 border-white/10 text-white/70'
      }`}
    >
      <Icon className="w-4 h-4" />
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[8px] font-black flex items-center justify-center ring-2 ring-[#071a0b]">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
};

export const CustomerNavbar = ({ activeTab, setActiveTab, wishlistCount = 0 }) => {
  const { logout, user } = useAuth();
  const { cartItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const mainNav = [
    { id: 'home',     label: 'Home',      icon: Home },
    { id: 'products', label: 'Products',   icon: Leaf },
    { id: 'wishlist', label: 'Wishlist',   icon: Heart,        badge: wishlistCount },
    { id: 'orders',   label: 'My Orders',  icon: PackageCheck },
  ];

  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
  const userName = user?.name || 'nanibhai2026';
  const displayFirstName = userName.split(' ')[0];

  return (
    <header className="sticky top-0 z-50 bg-[#071a0b] bg-gradient-to-r from-[#071a0b] via-[#0d2214] to-[#14331c] border-b border-white/10 shadow-xl font-display">

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Left: Brand Logo & Title */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-black text-base text-white tracking-tight leading-none">
              Local <span className="text-emerald-400">Farm</span>
            </div>
            <div className="text-[9px] font-extrabold text-emerald-300/80 tracking-widest uppercase leading-tight">
              Customer Portal
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-7 bg-white/10 shrink-0" />

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 flex-1">
          {mainNav.map(item => (
            <NavPill
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        {/* Right: Actions & User Profile Pill */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Search Toggle Button & Popover */}
          <div ref={searchRef} className="relative">
            <IconBtn icon={Search} label="Search Produce" onClick={() => setSearchOpen(v => !v)} isActive={searchOpen} />
            {searchOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 z-50 animate-fadeIn">
                <div className="bg-white rounded-2xl p-2.5 shadow-2xl border border-emerald-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600 ml-2 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search organic crops, farmers..."
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { setActiveTab('products'); setSearchOpen(false); } }}
                    className="w-full text-xs font-bold text-farmGreen-950 placeholder-gray-400 outline-none pr-2"
                  />
                  {searchVal && (
                    <button onClick={() => setSearchVal('')} className="p-1 text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <IconBtn icon={ShoppingCart} badge={cartCount} label="View Cart" onClick={() => setActiveTab('cart')} isActive={activeTab === 'cart'} />

          {/* Wishlist Icon (Desktop) */}
          <div className="hidden sm:block">
            <IconBtn icon={Heart} badge={wishlistCount} label="Wishlist" onClick={() => setActiveTab('wishlist')} isActive={activeTab === 'wishlist'} />
          </div>

          {/* Settings Icon */}
          <IconBtn icon={Settings} label="Settings" onClick={() => setActiveTab('settings')} isActive={activeTab === 'settings'} />

          {/* Vertical Divider */}
          <div className="w-px h-7 bg-white/10 shrink-0 mx-1" />

          {/* Interactive Customer Profile Button & Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(v => !v)}
              className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                profileOpen
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 ring-2 ring-emerald-400/30 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }`}
            >
              {/* Avatar Photo with Ring & Online Status Dot */}
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={userName}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-400/80 shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#071a0b]" />
              </div>

              {/* Customer Info & Tier Badge */}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-extrabold text-white leading-tight max-w-[100px] truncate">
                  {userName}
                </div>
                <div className="text-[10px] font-extrabold text-emerald-300/90 flex items-center gap-1 leading-tight">
                  <Award className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Gold Buyer</span>
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${profileOpen ? 'rotate-180 text-emerald-300' : ''}`} />
            </button>

            {/* Rich Customer Profile Dropdown Card */}
            {profileOpen && (
              <div className="absolute top-full right-0 mt-2.5 w-72 z-50 animate-scaleUp">
                <div className="bg-[#0b2112] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden text-white font-display">
                  
                  {/* Customer Banner Header */}
                  <div className="p-4 bg-gradient-to-r from-emerald-900 to-farmGreen-950 border-b border-emerald-800/60 flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img src={avatar} alt={userName} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0b2112]" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="font-extrabold text-sm text-white truncate">{userName}</h4>
                      <p className="text-[11px] text-emerald-200/70 truncate">{user?.email || 'anita.sharma@gmail.com'}</p>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Verified Gold Buyer</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Stat Chips */}
                  <div className="p-3 grid grid-cols-2 gap-2 border-b border-emerald-900/60">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] text-white/50 block leading-tight">Delivery Pin</span>
                        <strong className="text-[11px] font-bold text-white truncate block">Baner, Pune</strong>
                      </div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] text-white/50 block leading-tight">Member Rank</span>
                        <strong className="text-[11px] font-bold text-amber-300 truncate block">Gold Tier</strong>
                      </div>
                    </div>
                  </div>

                  {/* Quick Dropdown Links */}
                  <div className="p-2 space-y-1">
                    {[
                      { icon: User, label: 'Customer Profile Info', tab: 'profile' },
                      { icon: PackageCheck, label: 'My Orders & Dispatch', tab: 'orders' },
                      { icon: MapPin, label: 'Delivery Address Pin', tab: 'settings' },
                      { icon: Settings, label: 'Account Settings', tab: 'settings' }
                    ].map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => { setActiveTab(item.tab); setProfileOpen(false); }}
                          className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-emerald-100 hover:text-white hover:bg-emerald-500/20 transition-all flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Sign Out Button */}
                  <div className="p-2 pt-0">
                    <button
                      onClick={logout}
                      className="w-full p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out Customer</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-xl bg-white/10 text-white cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0b2112] border-t border-white/10 p-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {[...mainNav, { id: 'profile', label: 'Profile', icon: User }, { id: 'settings', label: 'Settings', icon: Settings }].map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                  className={`p-3 rounded-xl text-xs font-extrabold flex items-center justify-between border cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComp className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={logout}
            className="w-full p-3 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-400/30 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Customer</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default CustomerNavbar;
