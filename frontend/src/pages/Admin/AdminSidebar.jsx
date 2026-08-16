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
  ChevronRight
} from 'lucide-react';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '🏠' },
    { id: 'farmers', label: 'Farmers', icon: Tractor, emoji: '👨‍🌾' },
    { id: 'customers', label: 'Customers', icon: Users, emoji: '👥' },
    { id: 'delivery', label: 'Delivery Boys', icon: Truck, emoji: '🛵' },
    { id: 'products', label: 'Products', icon: Package, emoji: '📦' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, emoji: '🛒' },
    { id: 'reports', label: 'Reports', icon: BarChart3, emoji: '📊' },
    { id: 'settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20 p-3' : 'w-64 p-5'} bg-[#0A2214] text-white h-full flex flex-col justify-between shrink-0 shadow-2xl border-r border-emerald-900/60 overflow-y-auto relative z-30 font-display transition-all duration-300`}>
      
      <div className="space-y-5">
        {/* Brand Header & Toggle Icon */}
        <div className={`pb-4 border-b border-emerald-800/50 flex ${isCollapsed ? 'flex-col items-center gap-3 justify-center' : 'items-center justify-between gap-2'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-farmGreen-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-extrabold text-sm tracking-wider uppercase text-white flex items-center gap-1.5">
                  <span>LOCAL FARM</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Admin Console</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 hover:text-white transition-all cursor-pointer shrink-0 border border-emerald-700/40 shadow-xs"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-emerald-300" /> : <ChevronLeft className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center transition-all duration-200 cursor-pointer ${
                  isCollapsed
                    ? `justify-center py-2.5 rounded-2xl ${
                        isActive
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-950/60 scale-105'
                          : 'text-emerald-100/70 hover:bg-emerald-900/60 hover:text-white'
                      }`
                    : `justify-between px-4 py-3 rounded-2xl text-xs font-extrabold ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 border-l-4 border-emerald-300 translate-x-1'
                          : 'text-emerald-100/80 hover:bg-emerald-900/80 hover:text-white hover:translate-x-1'
                      }`
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <span className="text-base">{item.emoji}</span>
                  {!isCollapsed && <span className="tracking-wide text-xs font-extrabold">{item.label}</span>}
                </div>
                {!isCollapsed && isActive && (
                  <div className="w-2 h-2 rounded-full bg-emerald-300 shadow-sm shadow-emerald-300" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Profile & Logout */}
      <div className="pt-4 border-t border-emerald-800/50 space-y-3">
        <div className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'} rounded-2xl bg-emerald-950/80 border border-emerald-800/60 shadow-xs`}>
          <div className="relative shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
              alt="Admin"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400/60"
              title={isCollapsed ? (user?.name || 'Admin Officer') : undefined}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-950" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-white truncate">
                {user?.name || 'Admin Officer'}
              </div>
              <div className="text-[10px] text-emerald-300/80 truncate font-mono">{user?.email || 'admin@localfarm.in'}</div>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          title={isCollapsed ? 'Logout Session' : undefined}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'py-2.5 rounded-2xl' : 'gap-2 px-3.5 py-2.5 rounded-2xl'} bg-red-950/60 hover:bg-red-900/80 border border-red-700/50 text-red-200 hover:text-white text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95 shadow-sm`}
        >
          <LogOut className="w-4 h-4 text-red-400" />
          {!isCollapsed && <span>Logout Session</span>}
        </button>
      </div>

    </aside>
  );
};
