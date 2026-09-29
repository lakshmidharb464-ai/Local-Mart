import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/BrandLogo';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Boxes, 
  TrendingUp, 
  LogOut, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  Settings
} from 'lucide-react';

export const FarmerSidebar = ({ 
  activeTab, 
  setActiveTab, 
  pendingOrdersCount = 0, 
  lowStockCount = 0,
  farmStatus = 'open',
  setFarmStatus
}) => {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Crop Catalog', icon: Package },
    { 
      id: 'orders', 
      label: 'Customer Orders', 
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : null,
      badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-black shadow-sm'
    },
    { 
      id: 'inventory', 
      label: 'Stock & Inventory', 
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-black shadow-sm'
    },
    { id: 'seasons', label: 'Harvest Planner', icon: Calendar },
    { id: 'sales', label: 'Sales & Earnings', icon: TrendingUp },
  ];

  const statusConfigs = {
    open: { label: 'Open for Orders', dot: 'bg-emerald-400 animate-pulse', text: 'text-emerald-300', bg: 'bg-emerald-900/30 border-emerald-500/20' },
    harvesting: { label: 'Harvesting Today', dot: 'bg-farmGold-500 animate-pulse', text: 'text-farmGold-300', bg: 'bg-farmGold-900/30 border-farmGold-500/20' },
    paused: { label: 'Farm Orders Paused', dot: 'bg-farmTerracotta-400', text: 'text-farmTerracotta-300', bg: 'bg-farmTerracotta-900/30 border-farmTerracotta-500/20' }
  };

  return (
    <aside className={`${isCollapsed ? 'w-20 p-3' : 'w-64 p-5'} bg-gradient-to-b from-[#071f15] via-[#0B3D2E] to-[#082419] text-white h-full flex flex-col justify-between shrink-0 shadow-2xl border-r border-white/[0.06] overflow-y-auto font-display transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative`}>
      
      {/* Subtle glass shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-farmGold-600/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-emerald-500/[0.05] rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4 relative z-10">
        
        {/* Brand Header & Toggle Icon */}
        <div className={`pb-3 border-b border-white/[0.08] flex ${isCollapsed ? 'flex-col items-center gap-3 justify-center' : 'items-center justify-between gap-2'}`}>
          {!isCollapsed ? (
            <BrandLogo variant="dark" />
          ) : (
            <div className="mx-auto">
              <BrandLogo variant="dark" iconOnly={true} />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white/70 hover:text-farmGold-400 transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer shrink-0 border border-white/[0.06] hover:border-farmGold-600/30"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Dedicated Farmer Profile Icon Card (Interactive) */}
        <div 
          onClick={() => setActiveTab('settings')}
          className={`${isCollapsed ? 'p-2 flex justify-center' : 'p-3'} rounded-2xl border transition-all duration-300 cursor-pointer group ${
            activeTab === 'settings' 
              ? 'bg-gradient-to-r from-farmGreen-800/80 to-farmGreen-700/60 border-farmGold-500/40 shadow-gold-glow ring-1 ring-farmGold-500/30' 
              : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-farmGold-500/25'
          }`}
          title={isCollapsed ? `${user?.name || 'Farmer Profile'} — Farm Settings` : "View & Edit Farmer Profile"}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="relative shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name || 'Farmer Profile'}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-farmGold-500/60 shadow-sm group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0B3D2E] animate-pulse" title="Online & Active" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-xs text-white truncate group-hover:text-farmGold-300 transition-colors flex items-center gap-1">
                  <span>{user?.name || 'Rajesh Kumar'}</span>
                  <Award className="w-3.5 h-3.5 text-farmGold-400 shrink-0" />
                </div>
                <div className="text-[10px] text-farmGold-400/80 font-medium truncate flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Verified Organic Producer</span>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Farm Operational Status Switcher */}
        {!isCollapsed ? (
          <div className={`p-2.5 rounded-2xl border backdrop-blur-sm ${statusConfigs[farmStatus]?.bg || statusConfigs.open.bg} transition-all`}>
            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
              <span className="text-white/50 text-[10px] uppercase tracking-wider font-extrabold">Farm Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${statusConfigs[farmStatus]?.dot}`} />
                <span className={`text-[10px] font-extrabold ${statusConfigs[farmStatus]?.text}`}>{statusConfigs[farmStatus]?.label}</span>
              </div>
            </div>
            {setFarmStatus && (
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/[0.06] text-[10px]">
                <button
                  type="button"
                  onClick={() => setFarmStatus('open')}
                  aria-label="Set Farm Status: Open for Orders"
                  className={`py-1 rounded-lg font-extrabold text-center transition-all cursor-pointer ${farmStatus === 'open' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'}`}
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => setFarmStatus('harvesting')}
                  aria-label="Set Farm Status: Harvesting Today"
                  className={`py-1 rounded-lg font-extrabold text-center transition-all cursor-pointer ${farmStatus === 'harvesting' ? 'bg-farmGold-600 text-white shadow-xs' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'}`}
                >
                  Harvest
                </button>
                <button
                  type="button"
                  onClick={() => setFarmStatus('paused')}
                  aria-label="Set Farm Status: Paused"
                  className={`py-1 rounded-lg font-extrabold text-center transition-all cursor-pointer ${farmStatus === 'paused' ? 'bg-farmTerracotta-500 text-white shadow-xs' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'}`}
                >
                  Pause
                </button>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="flex justify-center p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] cursor-pointer hover:bg-white/[0.08] transition-all"
            title={`Farm Status: ${statusConfigs[farmStatus]?.label}`}
            aria-label={`Farm Status: ${statusConfigs[farmStatus]?.label}`}
            role="button"
            tabIndex={0}
            onClick={() => setFarmStatus && setFarmStatus(farmStatus === 'open' ? 'harvesting' : farmStatus === 'harvesting' ? 'paused' : 'open')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFarmStatus && setFarmStatus(farmStatus === 'open' ? 'harvesting' : farmStatus === 'harvesting' ? 'paused' : 'open');
              }
            }}
          >
            <span className={`w-3 h-3 rounded-full ${statusConfigs[farmStatus]?.dot}`} />
          </div>
        )}

        {/* Main Navigation Section */}
        <nav className="space-y-1" aria-label="Farmer portal navigation">
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
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group/nav ${
                    isCollapsed
                      ? `justify-center py-2.5 rounded-2xl relative ${
                          isActive
                            ? 'bg-gradient-to-r from-farmGreen-700/70 to-farmGreen-600/50 text-white ring-2 ring-farmGold-500/40 shadow-gold-glow scale-105'
                            : 'text-white/50 hover:bg-white/[0.07] hover:text-white'
                        }`
                      : `justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold ${
                          isActive
                            ? 'bg-gradient-to-r from-farmGreen-700/70 to-farmGreen-600/50 text-white shadow-gold-glow border-l-[3px] border-farmGold-500 scale-[1.02] ring-1 ring-farmGold-500/20'
                            : 'text-white/50 hover:bg-white/[0.06] hover:text-white/90'
                        }`
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ItemIcon className={`w-4.5 h-4.5 transition-all duration-300 group-hover/nav:scale-110 ${isActive ? 'text-farmGold-400 drop-shadow-[0_0_6px_rgba(212,167,69,0.4)]' : 'text-farmGold-600/60 group-hover/nav:text-farmGold-400/80'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {/* Badges */}
                  {isCollapsed ? (
                    item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-farmGold-500 animate-goldPulse" />
                    )
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-farmGold-400 animate-goldPulse" />}
                    </div>
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && isHovered && (
                  <div className="sidebar-tooltip">
                    <span>{item.label}</span>
                    {item.badge && <span className="text-[10px] text-farmGold-300">({item.badge})</span>}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Section: Settings & Logout */}
      <div className="pt-3 border-t border-white/[0.08] space-y-1.5 relative z-10">
        <div className="relative">
          <button
            onClick={() => setActiveTab('settings')}
            onMouseEnter={() => setHoveredItem('settings')}
            onMouseLeave={() => setHoveredItem(null)}
            title={isCollapsed ? 'Farm Settings' : undefined}
            aria-label="Farm Settings"
            aria-current={activeTab === 'settings' ? 'page' : undefined}
            className={`w-full flex items-center transition-all duration-300 cursor-pointer group/nav ${
              isCollapsed
                ? `justify-center py-2.5 rounded-2xl ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-farmGreen-700/70 to-farmGreen-600/50 text-white ring-2 ring-farmGold-500/40 shadow-gold-glow'
                      : 'text-white/50 hover:bg-white/[0.07] hover:text-white'
                  }`
                : `justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-farmGreen-700/70 to-farmGreen-600/50 text-white shadow-gold-glow border-l-[3px] border-farmGold-500'
                      : 'text-white/50 hover:bg-white/[0.06] hover:text-white/90'
                  }`
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className={`w-4.5 h-4.5 transition-all duration-300 group-hover/nav:scale-110 ${activeTab === 'settings' ? 'text-farmGold-400 drop-shadow-[0_0_6px_rgba(212,167,69,0.4)]' : 'text-farmGold-600/60 group-hover/nav:text-farmGold-400/80'}`} />
              {!isCollapsed && <span>Farm Settings</span>}
            </div>
          </button>

          {isCollapsed && hoveredItem === 'settings' && (
            <div className="sidebar-tooltip">Farm Settings</div>
          )}
        </div>

        <button
          onClick={logout}
          title={isCollapsed ? 'Sign Out' : undefined}
          aria-label="Sign Out"
          className={`w-full flex items-center justify-center ${isCollapsed ? 'py-2.5 rounded-2xl' : 'gap-2 px-3 py-2.5 rounded-xl'} bg-white/[0.05] hover:bg-red-500/15 hover:text-red-300 text-white/60 text-xs font-extrabold transition-all duration-300 cursor-pointer mt-1 border border-white/[0.04] hover:border-red-500/20`}
        >
          <LogOut className="w-4 h-4 text-red-400/70" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

    </aside>
  );
};
