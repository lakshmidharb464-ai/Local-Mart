import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Tractor,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';

export const AdminSidebar = ({ activeTab, setActiveTab, isDark = false, toggleDark, pendingCount = 0 }) => {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard, emoji: '🏠' },
    { id: 'farmers',   label: 'Farmers',        icon: Tractor,         emoji: '👨‍🌾' },
    { id: 'customers', label: 'Customers',      icon: Users,           emoji: '👥' },
    { id: 'delivery',  label: 'Delivery Fleet', icon: Truck,           emoji: '🛵' },
    { id: 'products',  label: 'Products',       icon: Package,         emoji: '📦' },
    { id: 'orders',    label: 'Orders',         icon: ShoppingCart,    emoji: '🛒' },
    { id: 'reports',   label: 'Reports',        icon: BarChart3,       emoji: '📊' },
    { id: 'settings',  label: 'Settings',       icon: Settings,        emoji: '⚙️' },
  ];

  // ── Dark vs Light surface tokens ──────────────────────────────
  const side = isDark
    ? 'adm-sidebar text-[#D4EAD9]'
    : 'bg-[#0A2312] text-white border-r border-farmGreen-800/40';
  const headerBorder = isDark ? 'border-[rgba(0,255,133,0.1)]' : 'border-emerald-800/50';
  const footerBorder = isDark ? 'border-[rgba(0,255,133,0.08)]' : 'border-emerald-800/50';
  const brandSubtext = isDark ? 'text-[#00FF85]' : 'text-emerald-400';
  const muted        = isDark ? 'text-[#7FA882]' : 'text-emerald-100/70';

  return (
    <aside
      className={`${isCollapsed ? 'w-[72px] p-3' : 'w-64 p-5'} h-full flex flex-col justify-between shrink-0 shadow-2xl overflow-y-auto relative z-30 font-display transition-all duration-300 ${side}`}
    >
      <div className="space-y-5">

        {/* ── Brand Header ── */}
        <div className={`pb-4 border-b ${headerBorder} flex ${isCollapsed ? 'flex-col items-center gap-3' : 'items-center justify-between gap-2'}`}>
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 ring-2 relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-[#00FF85] to-[#00CC6A] ring-[rgba(0,255,133,0.3)] shadow-[0_0_20px_rgba(0,255,133,0.3)]'
                : 'bg-gradient-to-br from-emerald-500 to-farmGreen-600 ring-emerald-400/40 shadow-lg shadow-emerald-500/20'
            }`}>
              <ShieldCheck className={`w-5 h-5 ${isDark ? 'text-[#06090A]' : 'text-white'}`} />
            </div>

            {!isCollapsed && (
              <div>
                <div className={`font-extrabold text-sm tracking-wider uppercase flex items-center gap-1.5 ${isDark ? 'text-[#D4EAD9]' : 'text-white'}`}>
                  LOCAL FARM
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5 ${brandSubtext}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#00FF85]' : 'bg-emerald-400'} animate-pulse`} />
                  <span>Admin Console</span>
                </div>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 border shadow-xs ${
              isDark
                ? 'bg-[rgba(0,255,133,0.06)] hover:bg-[rgba(0,255,133,0.12)] text-[#00FF85] border-[rgba(0,255,133,0.15)]'
                : 'bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 hover:text-white border-emerald-700/40'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft  className="w-4 h-4" />}
          </button>
        </div>

        {/* ── Notification Bell + Dark Toggle Row ── */}
        {!isCollapsed && (
          <div className={`flex items-center justify-between px-3 py-2.5 rounded-2xl ${isDark ? 'bg-[rgba(0,255,133,0.04)] border border-[rgba(0,255,133,0.08)]' : 'bg-emerald-900/40 border border-emerald-800/30'}`}>
            {/* Bell */}
            <div className="relative flex items-center gap-2">
              <Bell className={`w-4 h-4 ${isDark ? 'text-[#7FA882]' : 'text-emerald-300'}`} />
              {pendingCount > 0 && (
                <span className="adm-bell-badge">{pendingCount}</span>
              )}
              {!isCollapsed && (
                <span className={`text-[11px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-emerald-300/80'}`}>
                  {pendingCount > 0 ? `${pendingCount} pending` : 'No alerts'}
                </span>
              )}
            </div>

            {/* Dark Mode Toggle */}
            {toggleDark && (
              <button
                onClick={toggleDark}
                className="flex items-center gap-1.5 cursor-pointer"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark
                  ? <Moon  className="w-3.5 h-3.5 text-[#00FF85]" />
                  : <Sun   className="w-3.5 h-3.5 text-amber-300" />}
                <div className={`adm-toggle-track ${isDark ? '' : 'off'}`}>
                  <div className="adm-toggle-thumb" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center transition-all duration-200 cursor-pointer rounded-2xl
                  ${isCollapsed
                    ? `justify-center py-2.5 px-0 ${isActive
                        ? isDark
                          ? 'bg-[rgba(0,255,133,0.12)] adm-neon-glow-sm text-[#00FF85]'
                          : 'bg-emerald-600 text-white ring-2 ring-emerald-400/60 shadow-lg scale-105'
                        : isDark
                          ? 'text-[#7FA882] hover:bg-[rgba(0,255,133,0.06)] hover:text-[#D4EAD9]'
                          : 'text-emerald-100/70 hover:bg-emerald-900/60 hover:text-white'
                      }`
                    : `justify-between px-4 py-3 text-xs font-extrabold ${isActive
                        ? isDark
                          ? 'adm-nav-active'
                          : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 border-l-4 border-emerald-300 translate-x-1'
                        : isDark
                          ? 'text-[#7FA882] adm-nav-item hover:translate-x-1'
                          : 'text-emerald-100/80 hover:bg-emerald-900/80 hover:text-white hover:translate-x-1'
                      }`
                  }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <span className="text-base leading-none">{item.emoji}</span>
                  {!isCollapsed && (
                    <span className="tracking-wide text-xs font-extrabold">{item.label}</span>
                  )}
                </div>
                {!isCollapsed && isActive && (
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#00FF85] shadow-[0_0_6px_rgba(0,255,133,0.8)]' : 'bg-emerald-300 shadow-sm shadow-emerald-300'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Footer: Profile + Logout ── */}
      <div className={`pt-4 border-t ${footerBorder} space-y-3`}>
        {/* Profile Card */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'} rounded-2xl border ${
          isDark
            ? 'bg-[rgba(0,255,133,0.03)] border-[rgba(0,255,133,0.08)]'
            : 'bg-emerald-950/80 border-emerald-800/60 shadow-xs'
        }`}>
          <div className="relative shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
              alt="Admin"
              className={`w-9 h-9 rounded-full object-cover ring-2 ${isDark ? 'ring-[rgba(0,255,133,0.4)]' : 'ring-emerald-400/60'}`}
              loading="lazy"
            />
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${isDark ? 'bg-[#00FF85] border-[#06090A] shadow-[0_0_6px_rgba(0,255,133,0.6)]' : 'bg-emerald-400 border-emerald-950'}`} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className={`font-bold text-xs truncate ${isDark ? 'text-[#D4EAD9]' : 'text-white'}`}>
                {user?.name || 'Admin Officer'}
              </div>
              <div className={`text-[10px] truncate font-mono ${isDark ? 'text-[#7FA882]' : 'text-emerald-300/80'}`}>
                {user?.email || 'admin@localfarm.in'}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title={isCollapsed ? 'Logout Session' : undefined}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'py-2.5 rounded-2xl' : 'gap-2 px-3.5 py-2.5 rounded-2xl'} border text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
            isDark
              ? 'bg-[rgba(255,71,87,0.08)] hover:bg-[rgba(255,71,87,0.14)] border-[rgba(255,71,87,0.2)] text-[#FF6B7A] hover:border-[rgba(255,71,87,0.35)] hover:shadow-[0_0_16px_rgba(255,71,87,0.15)]'
              : 'bg-red-950/60 hover:bg-red-900/80 border-red-700/50 text-red-200 hover:text-white'
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout Session</span>}
        </button>
      </div>
    </aside>
  );
};
