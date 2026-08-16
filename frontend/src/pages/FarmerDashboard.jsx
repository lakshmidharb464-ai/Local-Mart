import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FarmerSidebar } from './Farmer/FarmerSidebar';
import { PRODUCTS, ORDERS } from '../data/mockData';
import { Menu, X } from 'lucide-react';

const FarmerDashboardView = lazy(() => import('./Farmer/FarmerDashboardView').then(m => ({ default: m.FarmerDashboardView || m.default })));
const FarmerProducts = lazy(() => import('./Farmer/FarmerProducts').then(m => ({ default: m.FarmerProducts || m.default })));
const FarmerOrders = lazy(() => import('./Farmer/FarmerOrders').then(m => ({ default: m.FarmerOrders || m.default })));
const FarmerInventory = lazy(() => import('./Farmer/FarmerInventory').then(m => ({ default: m.FarmerInventory || m.default })));
const FarmerSales = lazy(() => import('./Farmer/FarmerSales').then(m => ({ default: m.FarmerSales || m.default })));
const FarmerSettings = lazy(() => import('./Farmer/FarmerSettings').then(m => ({ default: m.FarmerSettings || m.default })));

const ViewLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-emerald-700 text-xs font-medium animate-pulse">Loading view...</p>
    </div>
  </div>
);

export const FarmerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => ['dashboard', 'products', 'orders', 'inventory', 'sales', 'settings'], []);

  const activeTab = useMemo(() => {
    const rawPath = location.pathname.replace(/^\/farmer\/?/, '');
    const cleanTab = rawPath.split('/')[0];
    if (validTabs.includes(cleanTab)) return cleanTab;
    return 'dashboard';
  }, [location.pathname, validTabs]);

  const setActiveTab = (tab) => {
    if (tab === 'dashboard') {
      navigate('/farmer');
    } else {
      navigate(`/farmer/${tab}`);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Master Farmer States
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState(ORDERS);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'products':
        return (
          <FarmerProducts
            products={products}
            setProducts={setProducts}
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
          />
        );
      case 'orders':
        return <FarmerOrders orders={orders} setOrders={setOrders} />;
      case 'inventory':
        return <FarmerInventory products={products} setProducts={setProducts} />;
      case 'sales':
        return <FarmerSales orders={orders} />;
      case 'settings':
        return <FarmerSettings />;
      case 'dashboard':
      default:
        return (
          <FarmerDashboardView
            products={products}
            orders={orders}
            setActiveTab={setActiveTab}
            setShowAddModal={setShowAddModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-farmBg flex flex-col md:flex-row">
      
      {/* Desktop Fixed Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen shrink-0 sticky top-0 z-30">
        <FarmerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Mobile Header Bar & Sidebar Drawer */}
      <div className="md:hidden bg-farmGreen-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span>🌱 LOCAL FARM</span>
          <span className="text-[10px] text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full font-mono">Farmer</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-white hover:bg-white/10 rounded-lg cursor-pointer"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuDrawer(sidebarOpen, setSidebarOpen, activeTab, setActiveTab)}

      {/* Main Farmer Content Body */}
      <main className="flex-1 md:h-full overflow-y-auto p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <Suspense fallback={<ViewLoader />}>
          {renderActiveView()}
        </Suspense>
      </main>

    </div>
  );
};

const mobileMenuDrawer = (sidebarOpen, setSidebarOpen, activeTab, setActiveTab) => {
  if (!sidebarOpen) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
      <div className="relative z-10 w-72 bg-farmGreen-900 h-full">
        <FarmerSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }} 
        />
      </div>
    </div>
  );
};

export default FarmerDashboard;
