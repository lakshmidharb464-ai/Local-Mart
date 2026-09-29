import React from 'react';
import { Home, Store, ShoppingBag, Heart, User, PackageCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * Ergonomic Mobile Bottom Navigation Bar
 * Designed for one-thumb mobile browsing with 44px+ touch targets.
 */
export const MobileBottomNav = ({ activeTab, setActiveTab, wishlistCount = 0 }) => {
  const { cartItems, setIsCartOpen } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Shop', icon: Store },
    { id: 'orders', label: 'Orders', icon: PackageCheck },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistCount },
    { id: 'cart_trigger', label: 'Basket', icon: ShoppingBag, badge: cartCount, isCart: true },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-farmGreen-700/10 shadow-[0_-4px_24px_rgba(11,61,46,0.08)] px-2 py-1.5"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const handleClick = () => {
            // 10ms haptic pulse on supported mobile devices
            if (navigator.vibrate) navigator.vibrate(10);
            if (item.isCart) {
              setIsCartOpen(true);
            } else if (setActiveTab) {
              setActiveTab(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`relative min-w-[56px] min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-farmGreen-700 font-extrabold'
                  : 'text-farmMuted hover:text-farmGreen-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-farmGreen-600 stroke-[2.25]' : 'stroke-[1.75]'
                  }`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-farmGold-600 text-white text-[9px] font-black flex items-center justify-center px-1 border border-white shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-farmGreen-600 animate-scaleIn" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
