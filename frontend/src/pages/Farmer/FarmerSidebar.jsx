import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
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
  ChevronRight
} from 'lucide-react';

export const FarmerSidebar = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, emoji: '🏠' },
    { id: 'products', label: t('products'), icon: Package, emoji: '📦' },
    { id: 'orders', label: t('orders'), icon: ShoppingCart, emoji: '🛒' },
    { id: 'inventory', label: t('inventory'), icon: Boxes, emoji: '📊' },
    { id: 'sales', label: t('sales'), icon: TrendingUp, emoji: '💰' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20 p-3' : 'w-64 p-5'} bg-[#0A2214] bg-gradient-to-b from-[#08170D] via-[#0A2214] to-[#0F2818] text-white h-full flex flex-col justify-between shrink-0 shadow-farm-xl border-r border-emerald-950/80 overflow-y-auto font-display transition-all duration-300 relative`}>
      
      <div className="space-y-5">
        
        {/* Brand Header & Toggle Icon */}
        <div className={`pb-4 border-b border-white/10 flex ${isCollapsed ? 'flex-col items-center gap-3 justify-center' : 'items-center justify-between gap-2'}`}>
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
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer shrink-0 border border-white/10 shadow-xs"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-emerald-400" /> : <ChevronLeft className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Dedicated Farmer Profile Icon Card (Interactive) */}
        <div 
          onClick={() => setActiveTab('settings')}
          className={`${isCollapsed ? 'p-2 flex justify-center' : 'p-3'} rounded-2xl border transition-all cursor-pointer group ${
            activeTab === 'settings' 
              ? 'bg-farmGreen-700 border-emerald-400 shadow-md' 
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-400/50'
          }`}
          title={isCollapsed ? `${user?.name || 'Farmer Profile'} — ${t('settings')}` : "View & Edit Farmer Profile"}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="relative shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name || 'Farmer Profile'}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-400/80 shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-farmGreen-900" title="Online & Active" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="font-display font-extrabold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
                  {user?.name || 'Rajesh Kumar'}
                </div>
                <div className="text-[10px] text-emerald-300/90 font-medium truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{t('verifiedFarmer')}</span>
                </div>
                <div className="text-[9px] text-white/50 truncate mt-0.5">
                  📍 Chittoor District, AP
                </div>
              </div>
            )}
          </div>
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
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.emoji}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && isActive && <div className="w-1.5 h-1.5 rounded-full bg-farmOrange-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Section: Settings & Logout */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <button
          onClick={() => setActiveTab('settings')}
          title={isCollapsed ? t('settings') : undefined}
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
            {!isCollapsed && <span>{t('settings')}</span>}
          </div>
        </button>

        <button
          onClick={logout}
          title={isCollapsed ? t('logout') : undefined}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'py-2.5 rounded-2xl' : 'gap-2 px-3 py-2.5 rounded-xl'} bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-white/80 text-xs font-bold transition-all cursor-pointer mt-1`}
        >
          <LogOut className="w-4 h-4 text-red-400" />
          {!isCollapsed && <span>🚪 {t('logout')}</span>}
        </button>
      </div>

    </aside>
  );
};
