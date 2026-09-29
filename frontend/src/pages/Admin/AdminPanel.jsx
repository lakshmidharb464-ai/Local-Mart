import React, { useState, useMemo, lazy, Suspense, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

const AdminDashboardView = lazy(() => import('./AdminDashboardView').then(m => ({ default: m.AdminDashboardView || m.default })));
const FarmerManagement   = lazy(() => import('./FarmerManagement').then(m => ({ default: m.FarmerManagement || m.default })));
const ProductManagement  = lazy(() => import('./ProductManagement').then(m => ({ default: m.ProductManagement || m.default })));
const OrderManagement    = lazy(() => import('./OrderManagement').then(m => ({ default: m.OrderManagement || m.default })));
const CustomerManagement = lazy(() => import('./CustomerManagement').then(m => ({ default: m.CustomerManagement || m.default })));
const DeliveryManagement = lazy(() => import('./DeliveryManagement').then(m => ({ default: m.DeliveryManagement || m.default })));
const ReportsAnalytics   = lazy(() => import('./ReportsAnalytics').then(m => ({ default: m.ReportsAnalytics || m.default })));
const AdminSettings      = lazy(() => import('./AdminSettings').then(m => ({ default: m.AdminSettings || m.default })));

const ViewLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00FF85] animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#D4A745] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
      </div>
      <p className="text-[#7FA882] text-xs font-bold tracking-wider uppercase animate-pulse">Loading module...</p>
    </div>
  </div>
);

const FAB_CONFIG = {
  dashboard: { label: 'Analytics Hub',   icon: '📊' },
  farmers:   { label: 'Add Farmer',      icon: '👨‍🌾' },
  customers: { label: 'Add Customer',    icon: '👤' },
  delivery:  { label: 'Add Rider',       icon: '🛵' },
  products:  { label: 'Add Product',     icon: '📦' },
  orders:    { label: 'Export Orders',   icon: '📋' },
  reports:   { label: 'Export Report',   icon: '⬇️' },
  settings:  { label: 'Save Settings',   icon: '💾' },
};

export const AdminPanel = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { showToast } = useAuth();

  // ── Dark mode ────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('adminDarkMode') !== 'false'; }
    catch { return true; }
  });
  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      try { localStorage.setItem('adminDarkMode', String(next)); } catch {}
      return next;
    });
  };

  // ── Active tab via URL ────────────────────────────────────────
  const validTabs = useMemo(() => ['dashboard', 'farmers', 'products', 'orders', 'customers', 'delivery', 'reports', 'settings'], []);
  const activeTab = useMemo(() => {
    const rawPath  = location.pathname.replace(/^\/admin\/?/, '');
    const cleanTab = rawPath.split('/')[0];
    return validTabs.includes(cleanTab) ? cleanTab : 'dashboard';
  }, [location.pathname, validTabs]);

  const setActiveTab = (tab) => {
    if (tab === 'dashboard') navigate('/admin');
    else navigate(`/admin/${tab}`);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading]     = useState(true);

  // ── Real API State ─────────────────────────────────────────────
  const [farmers,          setFarmers]          = useState([]);
  const [products,         setProducts]         = useState([]);
  const [orders,           setOrders]           = useState([]);
  const [customers,        setCustomers]        = useState([]);
  const [categories,       setCategories]       = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  // ── Load all admin data from real backend ─────────────────────
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        farmersData,
        productsData,
        ordersData,
        customersData,
        fleetData,
        categoriesData,
      ] = await Promise.allSettled([
        adminService.getFarmers(),
        adminService.getProducts(),
        adminService.getOrders(),
        adminService.getCustomers(),
        adminService.getDeliveryFleet(),
        adminService.getCategories(),
      ]);

      if (farmersData.status === 'fulfilled')   setFarmers(farmersData.value);
      if (productsData.status === 'fulfilled')  setProducts(productsData.value);
      if (ordersData.status === 'fulfilled')    setOrders(ordersData.value);
      if (customersData.status === 'fulfilled') setCustomers(customersData.value);
      if (fleetData.status === 'fulfilled')     setDeliveryPartners(fleetData.value);
      if (categoriesData.status === 'fulfilled') setCategories(categoriesData.value);
    } catch (err) {
      console.error('[AdminPanel] Failed to load data:', err);
      if (showToast) showToast('Load Error', 'Could not fetch admin data from server.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ── Notification counts ───────────────────────────────────────
  const pendingCount = useMemo(() =>
    farmers.filter(f => f.approvalStatus === 'Pending' || f.approval_status === 'Pending').length +
    deliveryPartners.filter(d => d.approvalStatus === 'Pending' || d.approval_status === 'Pending').length +
    products.filter(p => p.status === 'Pending').length,
  [farmers, deliveryPartners, products]);

  // ── Render active view ────────────────────────────────────────
  const renderActiveView = () => {
    if (isLoading) return <ViewLoader />;
    switch (activeTab) {
      case 'farmers':   return <FarmerManagement   farmers={farmers}     setFarmers={setFarmers} isDark={isDark} refreshData={loadAllData} />;
      case 'products':  return <ProductManagement  products={products}   setProducts={setProducts} categories={categories} setCategories={setCategories} isDark={isDark} refreshData={loadAllData} />;
      case 'orders':    return <OrderManagement    orders={orders}       setOrders={setOrders} isDark={isDark} refreshData={loadAllData} />;
      case 'customers': return <CustomerManagement customers={customers} setCustomers={setCustomers} isDark={isDark} refreshData={loadAllData} />;
      case 'delivery':  return <DeliveryManagement deliveryPartners={deliveryPartners} setDeliveryPartners={setDeliveryPartners} isDark={isDark} refreshData={loadAllData} />;
      case 'reports':   return <ReportsAnalytics isDark={isDark} />;
      case 'settings':  return <AdminSettings isDark={isDark} />;
      case 'dashboard':
      default:
        return (
          <AdminDashboardView
            farmers={farmers}
            customers={customers}
            products={products}
            orders={orders}
            deliveryPartners={deliveryPartners}
            setActiveTab={setActiveTab}
            isDark={isDark}
          />
        );
    }
  };

  const fab = FAB_CONFIG[activeTab] || FAB_CONFIG.dashboard;

  const surface = isDark
    ? 'bg-[#06090A] text-[#D4EAD9]'
    : 'bg-farmBg text-[#1A2E1D]';

  return (
    <div className={`min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row ${surface} ${isDark ? 'admin-midnight' : ''}`}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col shrink-0 sticky top-0 z-30 h-screen">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDark={isDark}
          toggleDark={toggleDark}
          pendingCount={pendingCount}
        />
      </aside>

      {/* ── Mobile Header ── */}
      <div className={`md:hidden p-4 flex items-center justify-between sticky top-0 z-40 ${isDark ? 'bg-[#060C08] border-b border-[rgba(0,255,133,0.08)]' : 'bg-farmGreen-900 text-white'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm font-black ${isDark ? 'bg-[#00FF85] text-[#06090A]' : 'bg-white text-emerald-900'}`}>🌿</div>
          <span className={`font-display font-bold text-sm tracking-wider uppercase ${isDark ? 'text-[#D4EAD9]' : 'text-white'}`}>
            LOCAL FARM Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="relative">
              <span className="text-xl">🔔</span>
              <span className="adm-bell-badge">{pendingCount}</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-lg cursor-pointer ${isDark ? 'text-[#00FF85] hover:bg-[rgba(0,255,133,0.08)]' : 'text-white hover:bg-white/10'}`}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-72 h-full">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }}
              isDark={isDark}
              toggleDark={toggleDark}
              pendingCount={pendingCount}
            />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className={`flex-1 md:h-full overflow-y-auto p-4 sm:p-8 w-full max-w-7xl mx-auto`}>
        <Suspense fallback={<ViewLoader />}>
          <div key={activeTab} className="adm-tab-enter">
            {renderActiveView()}
          </div>
        </Suspense>
      </main>

      {/* ── Floating Action Button ── */}
      <div className="adm-fab-wrap">
        <span className="adm-fab-label">{fab.label}</span>
        <button
          className="adm-fab"
          onClick={() => {
            if (activeTab === 'reports' || activeTab === 'orders') return;
            window.dispatchEvent(new CustomEvent('adm-fab-click', { detail: { tab: activeTab } }));
          }}
          title={fab.label}
          aria-label={fab.label}
        >
          <span className="text-xl relative z-10">{fab.icon}</span>
        </button>
      </div>
    </div>
  );
};
