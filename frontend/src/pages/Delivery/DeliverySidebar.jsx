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
  ChevronRight,
  Calendar,
  User,
  Settings,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const DeliverySidebar = ({ activeTab, setActiveTab, pendingCount = 0 }) => {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const mainNavItems = [
    { id: 'dashboard',    label: 'Dashboard Overview', icon: LayoutDashboard },
    { 
      id: 'deliveries',   
      label: 'My Deliveries',  
      icon: Package, 
      badge: pendingCount > 0 ? `${pendingCount} Active` : null,
      badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-black shadow-sm'
    },
    { id: 'tracking',     label: 'Live GPS Tracking', icon: Navigation },
    { id: 'order-status', label: 'Order Status Flow', icon: RefreshCw },
    { id: 'earnings',     label: 'Earnings & Payouts', icon: Wallet },
    { id: 'schedule',     label: 'Shift Schedule', icon: Calendar },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20 p-3' : 'w-64 p-5'} bg-gradient-to-b from-[#071f15] via-[#0B3D2E] to-[#082419] text-white h-full flex flex-col justify-between shrink-0 shadow-2xl border-r border-white/[0.06] overflow-y-auto font-display transition-all duration-300 relative`}>
      
      {/* Ambient glow backgrounds */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-28 h-28 bg-amber-500/[0.06] rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4 relative z-10">
        {/* Brand Header & Toggle Button */}
        <div className={`pb-3 border-b border-white/[0.08] flex ${isCollapsed ? 'flex-col items-center gap-3 justify-center' : 'items-center justify-between gap-2'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20 border border-emerald-400/30">
              <Truck className="w-5 h-5 text-emerald-100" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-extrabold text-sm tracking-wide uppercase text-white flex items-center gap-1.5">
                  <span className="text-emerald-400">🌱</span>
                  <span>LOCAL FARM</span>
                </div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold flex items-center gap-1.5 mt-0.5">
                  <span>Delivery Fleet</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] text-white/70 hover:text-emerald-300 transition-all cursor-pointer shrink-0 border border-white/[0.06]"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Duty Status Switcher Card */}
        <div className={`p-2.5 rounded-2xl border transition-all duration-300 ${
          isOnline 
            ? 'bg-emerald-950/40 border-emerald-500/30 shadow-xs' 
            : 'bg-stone-900/50 border-white/10'
        }`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]' : 'bg-gray-500'}`} />
                <span className="text-xs font-bold text-white">
                  {isOnline ? 'Active On-Duty' : 'Offline Duty'}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer transition-all ${
                isOnline 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-sm' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isOnline ? 'Go Offline' : 'Go Online'}
            >
              {isCollapsed ? (isOnline ? 'ON' : 'OFF') : (isOnline ? 'ONLINE' : 'GO ONLINE')}
            </button>
          </div>
        </div>

        {/* Main Navigation Items */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const isHovered = hoveredItem === item.id;
            const ItemIcon = item.icon;
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center transition-all duration-200 cursor-pointer ${
                    isCollapsed
                      ? `justify-center py-2.5 rounded-2xl relative ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600/70 to-teal-700/60 text-white ring-2 ring-emerald-400/40 shadow-lg scale-105'
                            : 'text-white/60 hover:bg-white/[0.08] hover:text-white'
                        }`
                      : `justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600/70 to-teal-700/60 text-white shadow-md border-l-[3px] border-emerald-400 ring-1 ring-emerald-400/30'
                            : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                        }`
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ItemIcon className={`w-4.5 h-4.5 transition-transform duration-200 ${isActive ? 'text-emerald-300' : 'text-emerald-400/70 group-hover:scale-110'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor} ${isCollapsed ? 'absolute -top-1 -right-1' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                  {!isCollapsed && isActive && !item.badge && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>

                {/* Collapsed Tooltip */}
                {isCollapsed && isHovered && (
                  <div className="sidebar-tooltip">
                    {item.label}
                    {item.badge && <span className="ml-1.5 text-amber-300">· {item.badge}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="pt-3 border-t border-white/[0.08] space-y-1 relative z-10">
        
        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          title={isCollapsed ? 'Driver Profile' : undefined}
          className={`w-full flex items-center transition-all cursor-pointer ${
            isCollapsed
              ? `justify-center py-2.5 rounded-2xl ${
                  activeTab === 'profile'
                    ? 'bg-emerald-600/60 text-white ring-2 ring-emerald-400/40 shadow-sm'
                    : 'text-white/60 hover:bg-white/[0.08] hover:text-white'
                }`
              : `justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'profile'
                    ? 'bg-emerald-600/60 text-white shadow-sm border-l-[3px] border-emerald-400'
                    : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                }`
          }`}
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-emerald-400" />
            {!isCollapsed && <span>Driver Profile</span>}
          </div>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          title={isCollapsed ? 'Fleet Settings' : undefined}
          className={`w-full flex items-center transition-all cursor-pointer ${
            isCollapsed
              ? `justify-center py-2.5 rounded-2xl ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600/60 text-white ring-2 ring-emerald-400/40 shadow-sm'
                    : 'text-white/60 hover:bg-white/[0.08] hover:text-white'
                }`
              : `justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600/60 text-white shadow-sm border-l-[3px] border-emerald-400'
                    : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                }`
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-emerald-400" />
            {!isCollapsed && <span>Fleet Settings</span>}
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'py-2 rounded-2xl' : 'gap-2 px-3 py-2 rounded-xl'} bg-white/[0.05] hover:bg-rose-500/20 hover:text-rose-300 text-white/70 text-xs font-bold transition-all cursor-pointer mt-2 border border-white/[0.06]`}
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* Partner Accreditation Card */}
        <div className={`pt-2.5 flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 px-1'} border-t border-white/[0.06] mt-1.5`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-stone-950 font-black text-xs flex items-center justify-center border border-white/20 shrink-0 shadow-md">
            {user?.name ? user.name.charAt(0) : 'R'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-white truncate">
                {user?.name || 'Rohan Sharma'}
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold truncate flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Verified EV Courier</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};
