import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DeliverySidebar } from './Delivery/DeliverySidebar';
import { 
  INITIAL_DELIVERY_ORDERS, 
  INITIAL_DELIVERY_PROFILE, 
  INITIAL_DELIVERY_EARNINGS 
} from '../data/mockDeliveryData';
import { Menu, X, Truck } from 'lucide-react';

const DeliveryDashboardView = lazy(() => import('./Delivery/DeliveryDashboardView').then(m => ({ default: m.DeliveryDashboardView || m.default })));
const MyDeliveries = lazy(() => import('./Delivery/MyDeliveries').then(m => ({ default: m.MyDeliveries || m.default })));
const DeliveryTracking = lazy(() => import('./Delivery/DeliveryTracking').then(m => ({ default: m.DeliveryTracking || m.default })));
const OrderStatusView = lazy(() => import('./Delivery/OrderStatusView').then(m => ({ default: m.OrderStatusView || m.default })));
const DeliveryEarnings = lazy(() => import('./Delivery/DeliveryEarnings').then(m => ({ default: m.DeliveryEarnings || m.default })));
const DeliveryProfileSettings = lazy(() => import('./Delivery/DeliveryProfileSettings').then(m => ({ default: m.DeliveryProfileSettings || m.default })));

const ViewLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-emerald-700 text-xs font-medium animate-pulse">Loading view...</p>
    </div>
  </div>
);

export const DeliveryDashboard = () => {
  const { showToast } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => ['dashboard', 'deliveries', 'tracking', 'order-status', 'earnings', 'profile', 'settings'], []);

  const activeTab = useMemo(() => {
    const rawPath = location.pathname.replace(/^\/delivery\/?/, '');
    const cleanTab = rawPath.split('/')[0];
    if (validTabs.includes(cleanTab)) return cleanTab;
    return 'dashboard';
  }, [location.pathname, validTabs]);

  const setActiveTab = (tab) => {
    if (tab === 'dashboard') {
      navigate('/delivery');
    } else {
      navigate(`/delivery/${tab}`);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Master Delivery States
  const [orders, setOrders] = useState(INITIAL_DELIVERY_ORDERS);
  const [profile, setProfile] = useState(INITIAL_DELIVERY_PROFILE);
  const [earnings, setEarnings] = useState(INITIAL_DELIVERY_EARNINGS);
  const [selectedOrder, setSelectedOrder] = useState(INITIAL_DELIVERY_ORDERS[0]);

  // Master Status Updater adhering to main delivery flow
  const handleUpdateStatus = (orderId, newStatus, reason = null) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        const timeNow = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const updatedTimeline = [
          ...o.timeline,
          { 
            status: newStatus, 
            time: timeNow, 
            note: reason ? `Reason: ${reason}` : `Status advanced to ${newStatus}` 
          }
        ];

        return {
          ...o,
          status: newStatus,
          failureReason: reason || o.failureReason,
          deliveredTime: newStatus === 'Delivered' ? timeNow : o.deliveredTime,
          pickedUpTime: newStatus === 'Picked Up' ? timeNow : o.pickedUpTime,
          timeline: updatedTimeline
        };
      }
      return o;
    });

    setOrders(updatedOrders);

    // If order was delivered, update earnings state dynamically
    if (newStatus === 'Delivered') {
      const targetOrder = orders.find(o => o.id === orderId);
      if (targetOrder) {
        const payoutAdded = targetOrder.fee + targetOrder.tip;
        setEarnings(prev => ({
          ...prev,
          todayTotal: prev.todayTotal + payoutAdded,
          todayTrips: prev.todayTrips + 1,
          weeklyTotal: prev.weeklyTotal + payoutAdded,
          weeklyTrips: prev.weeklyTrips + 1
        }));
      }
    }

    if (showToast) {
      showToast(
        `Order ${orderId} Status Updated`,
        `Marked as ${newStatus}${reason ? `: ${reason}` : ''}`
      );
    }
  };

  const pendingCount = orders.filter(o => ['Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'].includes(o.status)).length;

  const renderActiveView = () => {
    switch (activeTab) {
      case 'deliveries':
        return (
          <MyDeliveries
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            setSelectedOrder={setSelectedOrder}
            setActiveTab={setActiveTab}
          />
        );
      case 'tracking':
        return (
          <DeliveryTracking
            orders={orders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            onUpdateStatus={handleUpdateStatus}
            showToast={showToast}
          />
        );
      case 'order-status':
        return (
          <OrderStatusView
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            showToast={showToast}
          />
        );
      case 'earnings':
        return (
          <DeliveryEarnings
            earnings={earnings}
            orders={orders}
            showToast={showToast}
          />
        );
      case 'profile':
        return (
          <DeliveryProfileSettings
            profile={profile}
            setProfile={setProfile}
            activeTab="profile"
            showToast={showToast}
          />
        );
      case 'settings':
        return (
          <DeliveryProfileSettings
            profile={profile}
            setProfile={setProfile}
            activeTab="settings"
            showToast={showToast}
          />
        );
      case 'dashboard':
      default:
        return (
          <DeliveryDashboardView
            orders={orders}
            earnings={earnings}
            profile={profile}
            onUpdateStatus={handleUpdateStatus}
            setActiveTab={setActiveTab}
            setSelectedOrder={setSelectedOrder}
          />
        );
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-farmBg flex flex-col md:flex-row">
      
      {/* Desktop Fixed Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen shrink-0 sticky top-0 z-30">
        <DeliverySidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          pendingCount={pendingCount}
        />
      </aside>

      {/* Mobile Header Bar & Sidebar Drawer */}
      <div className="md:hidden bg-farmGreen-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <Truck className="w-5 h-5 text-farmOrange-500" />
          <span>🌱 LOCAL FARM</span>
          <span className="text-[10px] text-amber-300 bg-white/10 px-2 py-0.5 rounded-full font-mono">Delivery</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-white hover:bg-white/10 rounded-lg cursor-pointer"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-72 bg-farmGreen-900 h-full">
            <DeliverySidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              pendingCount={pendingCount}
            />
          </div>
        </div>
      )}

      {/* Main Delivery Content Body */}
      <main className="flex-1 md:h-full overflow-y-auto p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <Suspense fallback={<ViewLoader />}>
          {renderActiveView()}
        </Suspense>
      </main>

    </div>
  );
};

export default DeliveryDashboard;
