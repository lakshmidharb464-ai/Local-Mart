import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FarmerSidebar } from './Farmer/FarmerSidebar';
import { useFarmerData } from '../hooks/useFarmerData';
import { Menu, X } from 'lucide-react';


const FarmerDashboardView = lazy(() => import('./Farmer/FarmerDashboardView').then(m => ({ default: m.FarmerDashboardView || m.default })));
const FarmerProducts = lazy(() => import('./Farmer/FarmerProducts').then(m => ({ default: m.FarmerProducts || m.default })));
const FarmerOrders = lazy(() => import('./Farmer/FarmerOrders').then(m => ({ default: m.FarmerOrders || m.default })));
const FarmerInventory = lazy(() => import('./Farmer/FarmerInventory').then(m => ({ default: m.FarmerInventory || m.default })));
const FarmerSales = lazy(() => import('./Farmer/FarmerSales').then(m => ({ default: m.FarmerSales || m.default })));
const FarmerSettings = lazy(() => import('./Farmer/FarmerSettings').then(m => ({ default: m.FarmerSettings || m.default })));
const FarmerHarvestPlanner = lazy(() => import('./Farmer/FarmerHarvestPlanner').then(m => ({ default: m.FarmerHarvestPlanner || m.default })));

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

  const validTabs = useMemo(() => ['dashboard', 'products', 'orders', 'inventory', 'sales', 'settings', 'seasons'], []);

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

  // Farmer-specific data from /api/farmer/* endpoints
  const {
    products,
    orders,
    isLoading,
    loadError,
    setProducts,
    setOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    refreshData,
  } = useFarmerData();

  const [farmStatus, setFarmStatus] = useState(() => {
    return localStorage.getItem('localfarm_farm_status') || 'open';
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('localfarm_farm_status', farmStatus);
    } catch (e) {
      console.error('Error saving farm status:', e);
    }
  }, [farmStatus]);

  // Derived metrics for navigation badges
  const pendingOrdersCount = useMemo(() => orders.filter(o => o.status === 'Pending').length, [orders]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock < 15).length, [products]);

  const renderActiveView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-emerald-700 text-sm font-medium animate-pulse">Loading your farm data...</p>
          </div>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-sm">
            <p className="text-red-600 font-semibold mb-3">{loadError}</p>
            <button
              onClick={refreshData}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }


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
        return <FarmerSettings farmStatus={farmStatus} setFarmStatus={setFarmStatus} />;
      case 'seasons':
        return <FarmerHarvestPlanner />;
      case 'dashboard':
      default:
        return (
          <FarmerDashboardView
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            setActiveTab={setActiveTab}
            setShowAddModal={setShowAddModal}
            farmStatus={farmStatus}
            setFarmStatus={setFarmStatus}
          />
        );
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-farmBg flex flex-col md:flex-row">
      
      {/* Desktop Fixed Persistent Sidebar */}
      <aside className="hidden md:flex flex-col h-screen shrink-0 sticky top-0 z-30">
        <FarmerSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          pendingOrdersCount={pendingOrdersCount}
          lowStockCount={lowStockCount}
          farmStatus={farmStatus}
          setFarmStatus={setFarmStatus}
        />
      </aside>

      {/* Mobile Header Bar & Sidebar Drawer */}
      <div className="md:hidden bg-farmGreen-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-emerald-800/60 shadow-md">
        <div className="font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span>🌱 LOCAL FARM</span>
          <span className="text-[10px] text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full font-mono">Farmer</span>
          <span className={`w-2 h-2 rounded-full ${farmStatus === 'open' ? 'bg-emerald-400 animate-pulse' : farmStatus === 'harvesting' ? 'bg-amber-400' : 'bg-rose-400'}`} />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={sidebarOpen}
          aria-controls="farmer-mobile-drawer"
          className="p-1.5 text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <MobileMenuDrawer
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
        farmStatus={farmStatus}
        setFarmStatus={setFarmStatus}
      />

      {/* Main Farmer Content Body */}
      <main className="flex-1 md:h-full overflow-y-auto p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <Suspense fallback={<ViewLoader />}>
          {renderActiveView()}
        </Suspense>
      </main>

    </div>
  );
};

const MobileMenuDrawer = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  pendingOrdersCount,
  lowStockCount,
  farmStatus,
  setFarmStatus
}) => {
  if (!sidebarOpen) return null;
  return (
    <div
      id="farmer-mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Farmer navigation drawer"
      className="fixed inset-0 z-50 md:hidden flex animate-fadeIn"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      <div className="relative z-10 w-72 bg-farmGreen-900 h-full shadow-2xl">
        <FarmerSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }} 
          pendingOrdersCount={pendingOrdersCount}
          lowStockCount={lowStockCount}
          farmStatus={farmStatus}
          setFarmStatus={setFarmStatus}
        />
      </div>
    </div>
  );
};

export default FarmerDashboard;
