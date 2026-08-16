import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Navigation, 
  RefreshCw, 
  Wallet, 
  LogOut, 
  Truck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const DeliverySidebar = ({ activeTab, setActiveTab, pendingCount = 0 }) => {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '🏠' },
    { id: 'deliveries', label: 'My Deliveries', icon: Package, emoji: '📦', badge: pendingCount },
    { id: 'tracking', label: 'Tracking', icon: Navigation, emoji: '🗺️' },
    { id: 'order-status', label: 'Order Status', icon: RefreshCw, emoji: '🔄' },
    { id: 'earnings', label: 'Earnings', icon: Wallet, emoji: '💰' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20 p-3' : 'w-64 p-5'} bg-[#0A2214] bg-gradient-to-b from-[#08170D] via-[#0A2214] to-[#0F2818] text-white h-full flex flex-col justify-between shrink-0 shadow-farm-xl border-r border-emerald-950/80 overflow-y-auto font-display transition-all duration-300 relative`}>
      
      <div className="space-y-5">
        {/* Brand Header & Toggle Icon */}
        <div className={`pb-4 border-b border-white/10 flex ${isCollapsed ? 'flex-col items-center gap-3 justify-center' : 'items-center justify-between gap-2'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-farmOrange-500 to-amber-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-display font-extrabold text-sm tracking-wide uppercase text-white flex items-center gap-1.5">
                  <span>🌱 LOCAL FARM</span>
                </div>
                <div className="text-[11px] text-emerald-300 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <span>Delivery Panel</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer shrink-0 border border-white/10"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-emerald-400" /> : <ChevronLeft className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Main Navigation Section */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center transition-all cursor-pointer ${
                  isCollapsed
                    ? `justify-center py-2.5 rounded-2xl ${
                        isActive
                          ? 'bg-farmGreen-700 text-white ring-2 ring-emerald-400/60 shadow-md scale-105'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    : `justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-display ${
                        isActive
                          ? 'bg-farmGreen-700 text-white shadow-sm border-l-4 border-farmOrange-500'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center relative' : 'gap-2.5'}`}>
                  <span className="text-base">{item.emoji}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] bg-farmOrange-500 text-white font-mono font-extrabold ${isCollapsed ? 'ml-1' : ''}`}>
                    {item.badge}
                  </span>
                )}
                {!isCollapsed && isActive && !item.badge && <div className="w-1.5 h-1.5 rounded-full bg-farmOrange-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Section: Profile, Settings & Logout */}
      <div className="pt-4 border-t border-white/10 space-y-1">
        <button
          onClick={() => setActiveTab('profile')}
          title={isCollapsed ? 'Profile' : undefined}
          className={`w-full flex items-center transition-all cursor-pointer ${
            isCollapsed
              ? `justify-center py-2.5 rounded-2xl ${
                  activeTab === 'profile'
                    ? 'bg-farmGreen-700 text-white ring-2 ring-emerald-400/60 shadow-md'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              : `justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-display ${
                  activeTab === 'profile'
                    ? 'bg-farmGreen-700 text-white shadow-sm border-l-4 border-farmOrange-500'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">👤</span>
            {!isCollapsed && <span>Profile</span>}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          title={isCollapsed ? 'Settings' : undefined}
          className={`w-full flex items-center transition-all cursor-pointer ${
            isCollapsed
              ? `justify-center py-2.5 rounded-2xl ${
                  activeTab === 'settings'
                    ? 'bg-farmGreen-700 text-white ring-2 ring-emerald-400/60 shadow-md'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              : `justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-display ${
                  activeTab === 'settings'
                    ? 'bg-farmGreen-700 text-white shadow-sm border-l-4 border-farmOrange-500'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">⚙️</span>
            {!isCollapsed && <span>Settings</span>}
          </div>
        </button>

        <button
          onClick={logout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'py-2.5 rounded-2xl' : 'gap-2 px-3 py-2.5 rounded-xl'} bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-white/80 text-xs font-bold transition-all cursor-pointer mt-2`}
        >
          <LogOut className="w-4 h-4 text-red-400" />
          {!isCollapsed && <span>🚪 Logout</span>}
        </button>

        {/* Partner Profile Badge */}
        <div className={`pt-3 flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 px-1'} border-t border-white/10 mt-2`}>
          <div className="w-8 h-8 rounded-full bg-farmOrange-500 text-white font-bold text-xs flex items-center justify-center border border-white/20 shrink-0 shadow-sm" title={user?.name || 'Rohan Sharma'}>
            {user?.name ? user.name.charAt(0) : 'R'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="font-display font-bold text-xs text-white truncate">
                {user?.name || 'Rohan Sharma'}
              </div>
              <div className="text-[10px] text-emerald-300/80 truncate flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified Delivery Partner</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};
