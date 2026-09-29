import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { CustomerNavbar } from './Customer/CustomerNavbar';
import { FloatingCartBar } from '../components/FloatingCartBar';
import { MobileBottomNav } from '../components/MobileBottomNav';

const CustomerHome = lazy(() => import('./Customer/CustomerHome').then(m => ({ default: m.CustomerHome || m.default })));
const CustomerProducts = lazy(() => import('./Customer/CustomerProducts').then(m => ({ default: m.CustomerProducts || m.default })));
const CustomerWishlist = lazy(() => import('./Customer/CustomerWishlist').then(m => ({ default: m.CustomerWishlist || m.default })));
const CustomerCartCheckout = lazy(() => import('./Customer/CustomerCartCheckout').then(m => ({ default: m.CustomerCartCheckout || m.default })));
const CustomerOrders = lazy(() => import('./Customer/CustomerOrders').then(m => ({ default: m.CustomerOrders || m.default })));
const CustomerProfileSettings = lazy(() => import('./Customer/CustomerProfileSettings').then(m => ({ default: m.CustomerProfileSettings || m.default })));
const CustomerSubscriptions = lazy(() => import('./Customer/CustomerSubscriptions').then(m => ({ default: m.CustomerSubscriptions || m.default })));
const ProduceDetailModal = lazy(() => import('./Customer/ProduceDetailModal').then(m => ({ default: m.ProduceDetailModal || m.default })));

const ViewLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-emerald-700 text-xs font-medium animate-pulse">Loading view...</p>
    </div>
  </div>
);

export const CustomerDashboard = ({ setActiveView }) => {
  const { showToast } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => ['home', 'products', 'wishlist', 'cart', 'orders', 'profile', 'settings', 'subscriptions'], []);

  const activeTab = useMemo(() => {
    const rawPath = location.pathname.replace(/^\/customer\/?/, '');
    const cleanTab = rawPath.split('/')[0];
    if (validTabs.includes(cleanTab)) return cleanTab;
    return 'home';
  }, [location.pathname, validTabs]);

  const setActiveTab = (tab) => {
    if (tab === 'home') {
      navigate('/customer');
    } else {
      navigate(`/customer/${tab}`);
    }
  };


  // Master Customer States from Shared Marketplace
  const { products, orders: customerOrders, placeOrder, setOrders: setCustomerOrders } = useMarketplace();
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);

  // Persisted Customer Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('localfarm_wishlist');
      return saved ? JSON.parse(saved) : (products.slice(0, 2) || []);
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('localfarm_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist]);

  const toggleWishlist = (product) => {
    if (wishlist.some(w => w.id === product.id)) {
      setWishlist(wishlist.filter(w => w.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const addNewCustomerOrder = (newOrder) => {
    placeOrder(newOrder);
  };

  const handleOpenQuickBuy = (product) => {
    setQuickBuyProduct(product);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'products':
        return (
          <CustomerProducts
            products={products}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onOpenQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'wishlist':
        return (
          <CustomerWishlist
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            setActiveTab={setActiveTab}
          />
        );
      case 'cart':
        return (
          <CustomerCartCheckout
            setActiveTab={setActiveTab}
            addNewCustomerOrder={addNewCustomerOrder}
          />
        );
      case 'orders':
        return (
          <CustomerOrders
            orders={customerOrders}
            setOrders={setCustomerOrders}
          />
        );
      case 'profile':
        return <CustomerProfileSettings key="profile" initialSubTab="profile" />;
      case 'subscriptions':
        return <CustomerSubscriptions showToast={showToast} />;
      case 'settings':
        return <CustomerProfileSettings key="settings" initialSubTab="security" />;
      case 'home':
      default:
        return (
          <CustomerHome
            products={products}
            setActiveTab={setActiveTab}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onOpenQuickBuy={handleOpenQuickBuy}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-farmBg flex flex-col relative">
      
      {/* Top Navbar Header */}
      <CustomerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlistCount={wishlist.length}
      />

      {/* Main Customer Content Body */}
      <main className="flex-1 p-4 sm:p-8 w-full max-w-7xl mx-auto pb-28">
        <Suspense fallback={<ViewLoader />}>
          {renderActiveView()}
        </Suspense>
      </main>

      {/* Quick-Buy & Produce Details Modal */}
      {quickBuyProduct && (
        <Suspense fallback={null}>
          <ProduceDetailModal
            product={quickBuyProduct}
            onClose={() => setQuickBuyProduct(null)}
            toggleWishlist={toggleWishlist}
            isWishlisted={wishlist.some(w => w.id === quickBuyProduct.id)}
            setActiveTab={setActiveTab}
          />
        </Suspense>
      )}

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Ergonomic Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlistCount={wishlist.length}
      />

    </div>
  );
};

export default CustomerDashboard;
