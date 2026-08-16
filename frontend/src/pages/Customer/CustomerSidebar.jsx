import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  Home, 
  Leaf, 
  Heart, 
  ShoppingCart, 
  PackageCheck, 
  User, 
  Settings, 
  LogOut, 
  Sprout 
} from 'lucide-react';

export const CustomerSidebar = ({ activeTab, setActiveTab, wishlistCount = 0 }) => {
  const { logout, user } = useAuth();
  const { cartItems } = useCart();
  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home, emoji: '🏠' },
    { id: 'products', label: 'Products', icon: Leaf, emoji: '🥬' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, emoji: '❤️', badge: wishlistCount },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, emoji: '🛒', badge: cartTotalItems },
    { id: 'orders', label: 'My Orders', icon: PackageCheck, emoji: '📦' },
  ];

  return (
    <aside className="w-64 bg-farmGreen-900 text-white h-full flex flex-col justify-between p-5 shrink-0 shadow-farm-xl border-r border-farmGreen-800 overflow-y-auto">
      
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-farmGreen-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display font-extrabold text-sm tracking-wide uppercase text-white flex items-center gap-1.5">
              <span>🌱 LOCAL FARM</span>
            </div>
            <div className="text-[11px] text-emerald-300 uppercase tracking-widest font-semibold">
              Customer Portal
            </div>
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                  isActive
                    ? 'bg-farmGreen-700 text-white shadow-sm border-l-4 border-farmOrange-500'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-farmOrange-500 text-white shadow-xs">
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-farmOrange-400" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Section: Profile, Settings & Logout */}
      <div className="pt-5 border-t border-white/10 space-y-1.5">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-farmGreen-700 text-white shadow-sm border-l-4 border-farmOrange-500'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="text-sm">👤</span>
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-farmGreen-700 text-white shadow-sm border-l-4 border-farmOrange-500'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="text-sm">⚙️</span>
          <span>Settings</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-white/80 text-xs font-bold transition-all cursor-pointer mt-1"
        >
          <LogOut className="w-4 h-4" />
          <span>🚪 Logout</span>
        </button>

        {/* User Badge */}
        <div className="pt-3 flex items-center gap-2.5 px-1 border-t border-white/10">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover border border-white/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="font-display font-bold text-xs text-white truncate">
              {user?.name || 'Customer Account'}
            </div>
            <div className="text-[10px] text-emerald-300/80 truncate">Verified Local Buyer</div>
          </div>
        </div>
      </div>

    </aside>
  );
};
