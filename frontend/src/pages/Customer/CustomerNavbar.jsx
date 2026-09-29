import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  Home, Leaf, Heart, ShoppingCart, PackageCheck,
  Settings, LogOut, Sprout, Menu, X, ChevronRight,
  ShieldCheck, MapPin, Search, Bell, User,
  Sparkles, Award, Lock, ChevronDown, CheckCircle2,
  Calendar
} from 'lucide-react';

/* ─── NavPill ─────────────────────────────────────── */
const NavPill = ({ item, isActive, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer relative whitespace-nowrap"
      style={{
        background: isActive
          ? 'rgba(34,197,94,0.15)'
          : hov ? 'rgba(255,255,255,0.12)' : 'transparent',
        borderColor: isActive
          ? 'rgba(34,197,94,0.4)'
          : hov ? 'rgba(255,255,255,0.18)' : 'transparent',
        color: isActive ? '#fff' : hov ? '#fff' : 'rgba(255,255,255,0.78)',
        transform: hov && !isActive ? 'translateY(-1px)' : 'none',
        boxShadow: isActive ? '0 2px 12px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <item.icon
        className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
        style={{ color: isActive ? '#22c55e' : hov ? '#fff' : 'rgba(134,239,172,0.8)' }}
      />
      <span>{item.label}</span>

      {item.badge > 0 && (
        <span
          className="min-w-[18px] h-4 rounded-full px-1.5 flex items-center justify-center text-[9px] font-black animate-bounceIn"
          style={{
            background: 'linear-gradient(135deg,#d97706,#f59e0b)',
            color: '#fff',
            boxShadow: '0 2px 6px rgba(217,119,6,0.4)',
          }}
        >
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}

      {/* Glowing active underline bar */}
      {isActive && (
        <span
          className="absolute -bottom-1 left-3 right-3 rounded-full animate-scaleIn"
          style={{
            height: 2,
            background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
            boxShadow: '0 0 8px rgba(34,197,94,0.7)',
          }}
        />
      )}
    </button>
  );
};

/* ─── IconBtn ──────────────────────────────────────── */
const IconBtn = ({ icon: Icon, badge, label, onClick, isActive }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={label}
      className="group relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer"
      style={{
        background: isActive ? 'rgba(34,197,94,0.18)' : hov ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
        borderColor: isActive ? 'rgba(34,197,94,0.45)' : hov ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)',
        color: '#fff',
        transform: hov ? 'translateY(-2px) scale(1.06)' : 'scale(1)',
        boxShadow: isActive ? '0 4px 14px rgba(34,197,94,0.25)' : hov ? '0 4px 10px rgba(0,0,0,0.2)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
      {badge > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-4 rounded-full flex items-center justify-center px-1 text-[8px] font-black border-2 animate-bounceIn"
          style={{
            background: 'linear-gradient(135deg,#d97706,#f59e0b)',
            color: '#fff',
            borderColor: '#0A2312',
            boxShadow: '0 2px 6px rgba(217,119,6,0.4)',
          }}
        >
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
};

/* ─── Main CustomerNavbar ──────────────────────────── */
export const CustomerNavbar = ({ activeTab, setActiveTab, wishlistCount = 0 }) => {
  const { logout, user } = useAuth();
  const { cartItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // Scroll shadow intensification
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    { id: 'home',          label: 'Home',          icon: Home },
    { id: 'products',      label: 'Products',       icon: Leaf },
    { id: 'wishlist',      label: 'Wishlist',       icon: Heart,        badge: wishlistCount },
    { id: 'subscriptions', label: 'Subscriptions',  icon: Calendar },
    { id: 'orders',        label: 'My Orders',      icon: PackageCheck },
  ];

  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
  const userName = user?.name || 'nanibhai2026';

  return (
    <header
      className="sticky top-0 z-50 font-display transition-all duration-300"
      style={{
        background: 'linear-gradient(90deg, #071710 0%, #0d2318 45%, #112c1d 75%, #071710 100%)',
        borderBottom: '1px solid rgba(34,197,94,0.14)',
        boxShadow: scrolled
          ? '0 8px 32px rgba(5,20,11,0.45), 0 2px 0 rgba(34,197,94,0.12)'
          : '0 2px 12px rgba(5,20,11,0.25)',
      }}
    >
      {/* Subtle shimmer bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)' }}
      />

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Left: Brand Logo & Title */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
            }}
          >
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <div
              className="font-display font-black text-white leading-tight text-[17px] tracking-tight"
            >
              Local <span style={{ color: '#22c55e' }}>Farm</span>
            </div>
            <div className="text-[9px] font-extrabold uppercase tracking-widest leading-tight mt-0.5" style={{ color: 'rgba(134,239,172,0.75)' }}>
              Customer Portal
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-7 shrink-0" style={{ background: 'rgba(255,255,255,0.10)' }} />

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

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Search */}
          <div ref={searchRef} className="relative">
            <IconBtn icon={Search} label="Search Produce" onClick={() => setSearchOpen(v => !v)} isActive={searchOpen} />
            {searchOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 z-50 animate-popIn">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1.5px solid #d8eed9',
                    boxShadow: '0 20px 60px rgba(5,20,11,0.25), 0 4px 14px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="px-4 pt-3 pb-1.5 flex items-center gap-2 border-b" style={{ borderColor: '#f0f6f1' }}>
                    <span className="font-display text-[10px] font-black uppercase tracking-wider text-farmMuted">
                      Search Produce
                    </span>
                  </div>
                  <div className="p-3 flex items-center gap-2">
                    <Search className="w-4 h-4 shrink-0" style={{ color: '#22c55e' }} />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Tomatoes, A2 milk, organic mangoes…"
                      value={searchVal}
                      onChange={e => setSearchVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { setActiveTab('products'); setSearchOpen(false); } }}
                      className="w-full text-xs font-bold outline-none"
                      style={{ color: '#0d2214', background: 'transparent' }}
                    />
                    {searchVal && (
                      <button onClick={() => setSearchVal('')} className="p-1 rounded-lg cursor-pointer transition-colors" style={{ color: '#9ca3af' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#0d2214'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <IconBtn icon={ShoppingCart} badge={cartCount} label="View Cart" onClick={() => setActiveTab('cart')} isActive={activeTab === 'cart'} />

          {/* Wishlist (Desktop) */}
          <div className="hidden sm:block">
            <IconBtn icon={Heart} badge={wishlistCount} label="Wishlist" onClick={() => setActiveTab('wishlist')} isActive={activeTab === 'wishlist'} />
          </div>

          {/* Settings */}
          <IconBtn icon={Settings} label="Settings" onClick={() => setActiveTab('settings')} isActive={activeTab === 'settings'} />

          {/* Vertical Divider */}
          <div className="w-px h-7 shrink-0 mx-1" style={{ background: 'rgba(255,255,255,0.10)' }} />

          {/* Profile Button & Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(v => !v)}
              className="group flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all duration-300 cursor-pointer"
              style={{
                background: profileOpen ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.06)',
                borderColor: profileOpen ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.10)',
                transform: profileOpen ? 'scale(1.01)' : 'scale(1)',
                boxShadow: profileOpen ? '0 4px 16px rgba(34,197,94,0.2)' : 'none',
              }}
              onMouseEnter={e => { if (!profileOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; } }}
              onMouseLeave={e => { if (!profileOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={avatar} alt={userName}
                  className="w-8 h-8 rounded-xl object-cover"
                  style={{ border: '2px solid rgba(34,197,94,0.7)' }}
                  loading="lazy"
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: '#22c55e', border: '2px solid #071710' }}
                />
              </div>

              {/* User Info */}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-extrabold text-white leading-tight max-w-[96px] truncate">{userName}</div>
                <div className="text-[10px] font-bold flex items-center gap-1 leading-tight mt-0.5" style={{ color: 'rgba(134,239,172,0.85)' }}>
                  <Award className="w-3 h-3" style={{ color: '#d97706', fill: '#d97706' }} />
                  <span>Gold Buyer</span>
                </div>
              </div>

              <ChevronDown
                className="w-3.5 h-3.5 text-white/50 transition-transform duration-300"
                style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              />
            </button>

            {/* ── Profile Dropdown Card ── */}
            {profileOpen && (
              <div className="absolute top-full right-0 mt-3.5 w-72 z-50 animate-popIn">
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1.5px solid #d8eed9',
                    boxShadow: '0 24px 60px rgba(5,20,11,0.22), 0 4px 16px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-4 flex items-center gap-3"
                    style={{ background: 'linear-gradient(135deg, #f5f8f5 0%, #ecf7ee 100%)', borderBottom: '1.5px solid #d8eed9' }}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={avatar} alt={userName}
                        className="w-12 h-12 rounded-2xl object-cover"
                        style={{ border: '2.5px solid #22c55e', boxShadow: '0 0 0 4px rgba(34,197,94,0.15)' }}
                        loading="lazy"
                      />
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full animate-pulse"
                        style={{ background: '#22c55e', border: '2px solid #fff' }}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4
                        className="font-display font-extrabold text-sm truncate text-farmGreen-950"
                      >
                        {userName}
                      </h4>
                      <p className="text-[11px] truncate" style={{ color: '#4b6355' }}>{user?.email || 'anita.sharma@gmail.com'}</p>
                      <div
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                        style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a' }}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Gold Buyer</span>
                      </div>
                    </div>
                  </div>

                  {/* Stat Chips */}
                  <div className="p-3 grid grid-cols-2 gap-2" style={{ borderBottom: '1px solid #f0f6f1' }}>
                    {[
                      { icon: MapPin, label: 'Delivery Pin', val: 'Baner, Pune', color: '#16a34a' },
                      { icon: Award, label: 'Member Rank', val: 'Gold Tier', color: '#d97706' },
                    ].map(({ icon: Icon, label, val, color }) => (
                      <div
                        key={label}
                        className="p-2 rounded-xl flex items-center gap-2 transition-all duration-200 cursor-default"
                        style={{ background: '#f5f8f5', border: '1.5px solid #e4ede7' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ecf7ee'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f5f8f5'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                        <div className="min-w-0">
                          <span className="text-[9px] block leading-tight" style={{ color: '#4b6355' }}>{label}</span>
                          <strong className="text-[11px] font-bold truncate block" style={{ color }}>{val}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Links */}
                  <div className="p-2 space-y-0.5">
                    {[
                      { icon: User,         label: 'Customer Profile Info',   tab: 'profile' },
                      { icon: PackageCheck, label: 'My Orders & Dispatch',     tab: 'orders' },
                      { icon: MapPin,       label: 'Delivery Address Pin',     tab: 'settings' },
                      { icon: Settings,     label: 'Account Settings',         tab: 'settings' },
                    ].map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => { setActiveTab(item.tab); setProfileOpen(false); }}
                          className="w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between cursor-pointer group transition-all duration-200"
                          style={{ color: '#0d2214' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,107,60,0.07)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComp className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" style={{ color: '#22c55e' }} />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" style={{ color: '#9ca3af' }} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Sign Out */}
                  <div className="p-2 pt-0">
                    <button
                      onClick={logout}
                      className="w-full p-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 group"
                      style={{ background: 'rgba(239,68,68,0.07)', color: '#dc2626', border: '1.5px solid rgba(239,68,68,0.18)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(220,38,38,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-xl cursor-pointer transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.10)', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div
          className="md:hidden p-4 space-y-3 animate-slideUp"
          style={{ background: '#071710', borderTop: '1px solid rgba(34,197,94,0.12)' }}
        >
          <div className="grid grid-cols-2 gap-2">
            {[...mainNav, { id: 'profile', label: 'Profile', icon: User }, { id: 'settings', label: 'Settings', icon: Settings }].map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                  className="p-3 rounded-xl text-xs font-extrabold flex items-center justify-between border cursor-pointer transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                    borderColor: isActive ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#22c55e' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <IconComp className="w-4 h-4" style={{ color: isActive ? '#22c55e' : 'rgba(134,239,172,0.7)' }} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-black"
                      style={{ background: '#d97706', color: '#fff' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={logout}
            className="w-full p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
            style={{ background: 'rgba(239,68,68,0.18)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default CustomerNavbar;
