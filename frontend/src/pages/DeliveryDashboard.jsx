import React, { useState, useMemo, lazy, Suspense, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DeliverySidebar } from './Delivery/DeliverySidebar';
import { deliveryService } from '../services/deliveryService';
import { Menu, X, Truck } from 'lucide-react';

const DeliveryDashboardView = lazy(() => import('./Delivery/DeliveryDashboardView').then(m => ({ default: m.DeliveryDashboardView || m.default })));
const MyDeliveries = lazy(() => import('./Delivery/MyDeliveries').then(m => ({ default: m.MyDeliveries || m.default })));
const DeliveryTracking = lazy(() => import('./Delivery/DeliveryTracking').then(m => ({ default: m.DeliveryTracking || m.default })));
const OrderStatusView = lazy(() => import('./Delivery/OrderStatusView').then(m => ({ default: m.OrderStatusView || m.default })));
const DeliveryEarnings = lazy(() => import('./Delivery/DeliveryEarnings').then(m => ({ default: m.DeliveryEarnings || m.default })));
const DeliveryProfileSettings = lazy(() => import('./Delivery/DeliveryProfileSettings').then(m => ({ default: m.DeliveryProfileSettings || m.default })));
const DeliveryShiftSchedule = lazy(() => import('./Delivery/DeliveryShiftSchedule').then(m => ({ default: m.DeliveryShiftSchedule || m.default })));

const ViewLoader = () => (
  <div className="flex items-center justify-center py-20 animate-fadeIn">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-md"></div>
      <p className="text-emerald-800 text-xs font-black animate-pulse">Loading logistics panel...</p>
    </div>
  </div>
);

export const DeliveryDashboard = () => {
  const { showToast } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => ['dashboard', 'deliveries', 'tracking', 'order-status', 'earnings', 'profile', 'settings', 'schedule'], []);

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
  const [isLoading, setIsLoading]     = useState(true);

  // ── Real API State ────────────────────────────────────────────
  const [orders,         setOrders]         = useState([]);
  const [profile,        setProfile]        = useState(null);
  const [earnings,       setEarnings]       = useState({});
  const [selectedOrder,  setSelectedOrder]  = useState(null);

  // ── Load delivery data from real backend ──────────────────────
  const loadDeliveryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ordersRes, profileRes, earningsRes] = await Promise.allSettled([
        deliveryService.getOrders(),
        deliveryService.getProfile(),
        deliveryService.getEarnings(),
      ]);

      if (ordersRes.status === 'fulfilled') {
        const fetchedOrders = ordersRes.value;
        setOrders(fetchedOrders);
        // Auto-select first active order for tracking
        const activeOrder = fetchedOrders.find(o =>
          ['Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'].includes(o.status)
        );
        setSelectedOrder(activeOrder || fetchedOrders[0] || null);
      }
      if (profileRes.status === 'fulfilled') setProfile(profileRes.value);
      if (earningsRes.status === 'fulfilled') setEarnings(earningsRes.value);
    } catch (err) {
      console.error('[DeliveryDashboard] Failed to load:', err);
      if (showToast) showToast('Load Error', 'Could not fetch delivery data.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadDeliveryData();
  }, [loadDeliveryData]);

  // ── Status update — calls real backend then refreshes ─────────
  const handleUpdateStatus = useCallback(async (orderId, newStatus, reason = null) => {
    try {
      await deliveryService.updateOrderStatus(orderId, newStatus, reason || '');
      // Optimistic UI update
      setOrders(prev => prev.map(o => {
        if (o.id !== orderId) return o;
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...o,
          status: newStatus,
          failureReason: reason || o.failureReason,
          deliveredTime: newStatus === 'Delivered' ? timeNow : o.deliveredTime,
          pickedUpTime: newStatus === 'Picked Up' ? timeNow : o.pickedUpTime,
          timeline: [
            ...(o.timeline || []),
            { status: newStatus, time: timeNow, note: reason ? `Reason: ${reason}` : `Status advanced to ${newStatus}` }
          ]
        };
      }));
      if (showToast) showToast(`Order ${orderId} Updated`, `Marked as ${newStatus}${reason ? `: ${reason}` : ''}`);
    } catch (err) {
      console.error('[DeliveryDashboard] Status update failed:', err);
      if (showToast) showToast('Update Failed', err.message || 'Could not update order status.', 'error');
    }
  }, [showToast]);

  const pendingCount = orders.filter(o => ['Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'].includes(o.status)).length;

  const renderActiveView = () => {
    if (isLoading) return <ViewLoader />;
    switch (activeTab) {
      case 'deliveries':
        return (
          <MyDeliveries
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            setSelectedOrder={setSelectedOrder}
            setActiveTab={setActiveTab}
            showToast={showToast}
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
      case 'schedule':
        return <DeliveryShiftSchedule showToast={showToast} />;
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
      <div className="md:hidden bg-gradient-to-r from-[#071f15] via-[#0B3D2E] to-[#0D4233] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md border-b border-white/10">
        <div className="font-display font-black text-sm tracking-wider uppercase flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-400" />
          <span>🌱 LOCAL FARM</span>
          <span className="text-[10px] text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full font-mono font-bold">Delivery</span>
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
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-72 bg-[#071f15] h-full shadow-2xl">
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
      <main className="flex-1 md:h-full overflow-y-auto p-4 sm:p-7 w-full max-w-7xl mx-auto">
        <Suspense fallback={<ViewLoader />}>
          {renderActiveView()}
        </Suspense>
      </main>

    </div>
  );
};

export default DeliveryDashboard;
