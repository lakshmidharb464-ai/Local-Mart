import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { FARMERS, PRODUCTS, ORDERS, CUSTOMERS, CATEGORIES } from '../../data/mockData';
import { Menu, X } from 'lucide-react';

const AdminDashboardView = lazy(() => import('./AdminDashboardView').then(m => ({ default: m.AdminDashboardView || m.default })));
const FarmerManagement = lazy(() => import('./FarmerManagement').then(m => ({ default: m.FarmerManagement || m.default })));
const ProductManagement = lazy(() => import('./ProductManagement').then(m => ({ default: m.ProductManagement || m.default })));
const OrderManagement = lazy(() => import('./OrderManagement').then(m => ({ default: m.OrderManagement || m.default })));
const CustomerManagement = lazy(() => import('./CustomerManagement').then(m => ({ default: m.CustomerManagement || m.default })));
const DeliveryManagement = lazy(() => import('./DeliveryManagement').then(m => ({ default: m.DeliveryManagement || m.default })));
const ReportsAnalytics = lazy(() => import('./ReportsAnalytics').then(m => ({ default: m.ReportsAnalytics || m.default })));
const AdminSettings = lazy(() => import('./AdminSettings').then(m => ({ default: m.AdminSettings || m.default })));

const ViewLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-emerald-700 text-xs font-medium animate-pulse">Loading view...</p>
    </div>
  </div>
);

const INITIAL_DELIVERY_PARTNERS = [
  {
    id: 'DP-101',
    name: 'Rohan Sharma',
    email: 'rohan.delivery@localfarm.in',
    phone: '+91 98765 43210',
    vehicleType: 'EV Scooter (Ather 450X)',
    vehicleNumber: 'MH 12 FX 4920',
    licenseNumber: 'DL-MH12-2022-00492',
    hubLocation: 'Pune West Metro Hub',
    totalDeliveries: 342,
    rating: 4.9,
    approvalStatus: 'Approved',
    accountStatus: 'Active',
    isOnline: true,
    joinedDate: '14 Jan 2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'DP-102',
    name: 'Suresh Verma',
    email: 'suresh.v@localfarm.in',
    phone: '+91 98221 55443',
    vehicleType: 'Motorcycle (Hero Splendor)',
    vehicleNumber: 'MH 12 GT 8812',
    licenseNumber: 'DL-MH12-2021-08812',
    hubLocation: 'Baner Express Hub',
    totalDeliveries: 189,
    rating: 4.85,
    approvalStatus: 'Approved',
    accountStatus: 'Active',
    isOnline: true,
    joinedDate: '02 Mar 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'DP-103',
    name: 'Ganesh Shinde',
    email: 'ganesh.rider@localfarm.in',
    phone: '+91 94220 77112',
    vehicleType: 'EV Scooter (Ola S1 Pro)',
    vehicleNumber: 'MH 12 AB 9910',
    licenseNumber: 'DL-MH12-2024-99102',
    hubLocation: 'Aundh Chilled Depot',
    totalDeliveries: 94,
    rating: 4.7,
    approvalStatus: 'Pending',
    accountStatus: 'Active',
    isOnline: false,
    joinedDate: '10 Aug 2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'DP-104',
    name: 'Vikram Deshmukh',
    email: 'vikram.cargo@localfarm.in',
    phone: '+91 91580 33221',
    vehicleType: 'Light Cargo Van',
    vehicleNumber: 'MH 12 CZ 1120',
    licenseNumber: 'DL-MH12-2019-11200',
    hubLocation: 'Hadapsar Central Hub',
    totalDeliveries: 420,
    rating: 4.95,
    approvalStatus: 'Approved',
    accountStatus: 'Active',
    isOnline: true,
    joinedDate: '15 Nov 2023',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  }
];

export const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => ['dashboard', 'farmers', 'products', 'orders', 'customers', 'delivery', 'reports', 'settings'], []);

  const activeTab = useMemo(() => {
    const rawPath = location.pathname.replace(/^\/admin\/?/, '');
    const cleanTab = rawPath.split('/')[0];
    if (validTabs.includes(cleanTab)) return cleanTab;
    return 'dashboard';
  }, [location.pathname, validTabs]);

  const setActiveTab = (tab) => {
    if (tab === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Admin Master States
  const [farmers, setFarmers] = useState(FARMERS);
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState(ORDERS);
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [deliveryPartners, setDeliveryPartners] = useState(INITIAL_DELIVERY_PARTNERS);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'farmers':
        return <FarmerManagement farmers={farmers} setFarmers={setFarmers} />;
      case 'products':
        return <ProductManagement products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} />;
      case 'orders':
        return <OrderManagement orders={orders} setOrders={setOrders} />;
      case 'customers':
        return <CustomerManagement customers={customers} setCustomers={setCustomers} />;
      case 'delivery':
        return <DeliveryManagement deliveryPartners={deliveryPartners} setDeliveryPartners={setDeliveryPartners} />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <AdminSettings />;
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
          />
        );
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-farmBg flex flex-col md:flex-row">
      
      {/* Desktop Fixed Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen shrink-0 sticky top-0 z-30">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Mobile Header Bar & Sidebar Drawer */}
      <div className="md:hidden bg-farmGreen-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="font-display font-bold text-sm tracking-wider uppercase">
          LOCAL FARM Admin Panel
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-white hover:bg-white/10 rounded-lg cursor-pointer"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuDrawer(sidebarOpen, setSidebarOpen, activeTab, setActiveTab)}

      {/* Main Admin Content Body */}
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
        <AdminSidebar 
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
