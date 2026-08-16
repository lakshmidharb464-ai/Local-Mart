import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Calendar, 
  MapPin, 
  Receipt, 
  X, 
  ShoppingBag, 
  Sprout, 
  Package, 
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Download,
  RotateCcw,
  Sparkles,
  Navigation,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileText,
  BadgePercent,
  Compass,
  LayoutList,
  Table,
  LayoutGrid,
  Activity
} from 'lucide-react';

export const CustomerOrders = ({ orders, setOrders }) => {
  const { showToast } = useAuth();
  const { addToCart } = useCart();
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'active' | 'delivered' | 'cancelled'
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'table' | 'grid' | 'timeline'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [modalTab, setModalTab] = useState('receipt'); // 'receipt' | 'live-tracker'

  // Copy order ID
  const handleCopyOrderId = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
    }
    setCopiedId(id);
    showToast('Copied to Clipboard', `Order ID ${id} copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Confirm cancel order
  const handleConfirmCancel = () => {
    if (!orderToCancel) return;
    setOrders(orders.map(o => o.id === orderToCancel.id ? { 
      ...o, 
      status: 'Cancelled',
      timeline: [
        ...(o.timeline || []),
        { title: 'Cancelled', time: 'Just now', done: true, desc: `Cancelled: ${cancelReason}` }
      ]
    } : o));
    showToast('Order Cancelled', `Order ${orderToCancel.id} has been cancelled.`);
    setOrderToCancel(null);
  };

  const handleDownloadInvoice = (orderId) => {
    showToast('Invoice Downloaded', `PDF Tax Invoice for ${orderId} downloaded successfully!`);
  };

  const handleReorder = (order) => {
    if (order.itemsList && order.itemsList.length > 0) {
      order.itemsList.forEach(item => {
        addToCart({
          id: `reorder_${order.id}_${item.name}`,
          name: item.name,
          price: item.price,
          unit: item.qty,
          image: item.img || order.image
        }, 1);
      });
    } else {
      addToCart({
        id: `reorder_${order.id}`,
        name: order.items || 'Harvest Produce Box',
        price: order.total || 450,
        unit: 'box',
        image: order.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80'
      }, 1);
    }
    showToast('Basket Reordered', `Items from ${order.id} added to your cart!`);
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  // Status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
          badgeGradient: 'from-emerald-500 to-green-600',
          dotBg: 'bg-emerald-500',
          icon: CheckCircle2,
          label: 'Delivered',
          stepIdx: 3
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-blue-50 text-blue-900 border-blue-300/80',
          badgeGradient: 'from-blue-600 to-cyan-600',
          dotBg: 'bg-blue-500',
          icon: Truck,
          label: 'Out for Delivery',
          stepIdx: 2,
          isLive: true
        };
      case 'Accepted':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300/80',
          badgeGradient: 'from-amber-500 to-orange-500',
          dotBg: 'bg-amber-500',
          icon: Sprout,
          label: 'Accepted by Farm',
          stepIdx: 1
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 text-rose-900 border-rose-300/80',
          badgeGradient: 'from-rose-500 to-red-600',
          dotBg: 'bg-rose-500',
          icon: XCircle,
          label: 'Cancelled',
          stepIdx: -1
        };
      case 'Pending':
      default:
        return {
          bg: 'bg-amber-50/80 text-amber-900 border-amber-300/60',
          badgeGradient: 'from-amber-500 to-yellow-600',
          dotBg: 'bg-amber-400',
          icon: Clock,
          label: 'Pending Approval',
          stepIdx: 0
        };
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      // Filter by status tab
      if (activeFilter === 'active' && !['Pending', 'Accepted', 'Out for Delivery'].includes(ord.status)) return false;
      if (activeFilter === 'delivered' && ord.status !== 'Delivered') return false;
      if (activeFilter === 'cancelled' && ord.status !== 'Cancelled') return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = ord.id?.toLowerCase().includes(q);
        const matchesItems = ord.items?.toLowerCase().includes(q);
        const matchesFarmer = ord.farmer?.toLowerCase().includes(q);
        return matchesId || matchesItems || matchesFarmer;
      }
      return true;
    });
  }, [orders, activeFilter, searchQuery]);

  const activeCount = orders.filter(o => ['Pending', 'Accepted', 'Out for Delivery'].includes(o.status)).length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl font-display pb-20">
      
      {/* Header Overview Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl"
        style={{ 
          background: 'linear-gradient(135deg, #071a0b 0%, #0d2214 45%, #183d20 100%)', 
          border: '1px solid rgba(168,240,96,0.18)' 
        }}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-farmGreen-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE HARVEST LOGISTICS</span>
            </div>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              My Orders & Live Dispatch Tracking
            </h2>
            <p className="text-xs text-white/60 font-medium leading-relaxed">
              Track farm-to-doorstep dispatch in real-time, view verified farmer receipts, & manage deliveries seamlessly.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-3.5 text-center transition-all hover:bg-white/10 hover:border-emerald-400/40 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-white/50 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Package className="w-3 h-3 text-emerald-400" />
                <span>Total</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white leading-none">{orders.length}</div>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-400/25 rounded-2xl p-3 sm:p-3.5 text-center transition-all hover:bg-emerald-500/20 hover:border-emerald-400/50 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-emerald-200/80 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Truck className="w-3 h-3 text-emerald-300 animate-pulse" />
                <span>Active</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 leading-none">{activeCount}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-3.5 text-center transition-all hover:bg-white/10 hover:border-emerald-400/40 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-white/50 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3 h-3 text-[#a8f060]" />
                <span>Delivered</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#a8f060] leading-none">{deliveredCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls: Filter Pills, View Mode Switcher, & Search Input */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { key: 'all', label: 'All Orders', count: orders.length, icon: Package },
            { key: 'active', label: 'Active Dispatch', count: activeCount, isLive: activeCount > 0, icon: Truck },
            { key: 'delivered', label: 'Delivered', count: deliveredCount, icon: CheckCircle2 },
            { key: 'cancelled', label: 'Cancelled', count: cancelledCount, icon: XCircle }
          ].map(tab => {
            const TabIcon = tab.icon;
            const isSelected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-farmGreen-800 to-farmGreen-950 text-white shadow-sm ring-1 ring-emerald-500/30'
                    : 'text-farmMuted hover:text-farmGreen-900 hover:bg-emerald-50/60'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : tab.isLive ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
                {tab.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher + Search Input Container */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher Pills */}
          <div className="flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl shrink-0 border border-gray-200/60">
            {[
              { id: 'card', label: 'Cards', icon: LayoutList },
              { id: 'table', label: 'Table', icon: Table },
              { id: 'grid', label: 'Grid', icon: LayoutGrid },
              { id: 'timeline', label: 'Feed', icon: Activity }
            ].map(vm => {
              const IconComp = vm.icon;
              const isVmSelected = viewMode === vm.id;
              return (
                <button
                  key={vm.id}
                  onClick={() => setViewMode(vm.id)}
                  title={`${vm.label} View`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isVmSelected
                      ? 'bg-white text-emerald-950 shadow-xs border border-emerald-200/60'
                      : 'text-gray-500 hover:text-emerald-900 hover:bg-white/50'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isVmSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className="text-[11px] font-extrabold">{vm.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-emerald-600/70 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order, farm…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-farmGreen-500 rounded-xl text-xs font-bold text-farmGreen-950 placeholder-gray-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Container */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-farmGreen-950">No orders found</h3>
            <p className="text-xs text-farmMuted max-w-sm mx-auto">
              {searchQuery ? `No orders matched your search "${searchQuery}".` : 'You do not have any orders in this category.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-farmGreen-50 text-farmGreen-800 rounded-xl text-xs font-bold hover:bg-farmGreen-100 transition-all cursor-pointer"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════
             MODE 1: CARD VIEW (MATCHES SCREENSHOT EXACTLY)
          ══════════════════════════════════════════════════ */}
          {viewMode === 'card' && (
            <div className="space-y-5">
              {filteredOrders.map((ord) => {
                const config = getStatusConfig(ord.status);
                const StatusIcon = config.icon;
                const isExpanded = expandedOrderId === ord.id;
                const isOutForDelivery = ord.status === 'Out for Delivery';
                const isCancelled = ord.status === 'Cancelled';
                const isDelivered = ord.status === 'Delivered';

                const steps = ['Pending', 'Accepted', 'Out for Delivery', 'Delivered'];
                const currentStepIdx = config.stepIdx;

                return (
                  <div 
                    key={ord.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-farm-md hover:shadow-farm-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Top Order Card Header */}
                    <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/30">
                      
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-3.5">
                        <div className="relative shrink-0">
                          <img 
                            src={ord.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80'} 
                            alt={ord.items}
                            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
                          />
                          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${config.dotBg} ring-2 ring-white`} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-base sm:text-lg text-farmGreen-950 tracking-tight flex items-center gap-1.5">
                              <span>{ord.id}</span>
                              <button 
                                onClick={() => handleCopyOrderId(ord.id)}
                                className="text-gray-400 hover:text-farmGreen-700 transition-colors p-0.5 rounded cursor-pointer"
                                title="Copy Order ID"
                              >
                                {copiedId === ord.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </h3>

                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold shadow-2xs ${config.bg}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span>{config.label}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-medium text-farmMuted flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span>{ord.date}</span>
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span className="truncate">{ord.address}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Total Price & Inspection Trigger */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <div className="font-black text-xl sm:text-2xl text-farmGreen-950 tracking-tight">
                            ₹{ord.total}
                          </div>
                          <div className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                            {ord.paymentMethod || 'Cash on Delivery'}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setModalTab('receipt');
                          }}
                          className="px-4 py-2.5 bg-farmGreen-900 hover:bg-farmGreen-950 text-white rounded-2xl font-extrabold text-xs shadow-farm-sm hover:shadow-farm-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Inspect Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Sub-Item Box & Quick Actions */}
                    <div className="p-4 sm:p-5 bg-white space-y-4">
                      <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-xs sm:text-sm text-farmGreen-950 truncate">
                              {ord.items}
                            </div>
                            <div className="text-[11px] text-farmMuted font-medium flex items-center gap-1.5 flex-wrap">
                              <span className="text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded text-[10px]">
                                Verified Farm
                              </span>
                              <span>Producer: <strong>{ord.farmer}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={() => toggleExpand(ord.id)}
                            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-emerald-300 text-farmGreen-950 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          >
                            <span>View Items</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleReorder(ord)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reorder</span>
                          </button>

                          {!isCancelled && !isDelivered && (
                            <button
                              onClick={() => setOrderToCancel(ord)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel Order</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Items List Drawer */}
                      {isExpanded && ord.itemsList && (
                        <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2.5 animate-fadeIn">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-farmMuted mb-1">
                            Harvest Items in Package
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ord.itemsList.map((item, idx) => (
                              <div key={idx} className="p-2.5 bg-white rounded-xl border border-gray-100 flex items-center gap-2.5 shadow-2xs">
                                <img src={item.img || ord.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-xs text-farmGreen-950 truncate">{item.name}</div>
                                  <div className="text-[10px] text-gray-500">{item.qty} · ₹{item.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dispatch Journey Status Bar */}
                      {!isCancelled && (
                        <div className="pt-2 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {isOutForDelivery ? (
                                <span className="flex h-2.5 w-2.5 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                                </span>
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              )}
                              <span className="text-farmGreen-950 font-extrabold">Dispatch Journey Status:</span>
                            </div>

                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-extrabold ${
                              isOutForDelivery 
                                ? 'bg-blue-50 text-blue-900 border-blue-200' 
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}>
                              <Clock className="w-3.5 h-3.5" />
                              <span>{ord.eta || '25-35 mins'}</span>
                            </div>
                          </div>

                          {/* 4-Step Stepper Progress Bar */}
                          <div className="relative pt-1">
                            <div className="grid grid-cols-4 gap-2">
                              {steps.map((step, idx) => {
                                const isCompleted = currentStepIdx >= idx;
                                const isCurrent = currentStepIdx === idx;

                                return (
                                  <div key={step} className="space-y-1.5 text-center">
                                    <div className={`h-2.5 rounded-full transition-all duration-500 relative ${
                                      isCompleted 
                                        ? 'bg-gradient-to-r from-emerald-500 to-farmGreen-700 shadow-xs' 
                                        : 'bg-gray-200/80'
                                    } ${isCurrent ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}`}>
                                      {isCurrent && (
                                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-md border-2 border-white animate-pulse" />
                                      )}
                                    </div>
                                    <div className="pt-0.5">
                                      <div className={`text-[11px] font-extrabold truncate ${
                                        isCompleted ? 'text-farmGreen-950' : 'text-gray-400'
                                      }`}>
                                        {step}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════
             MODE 2: TABLE VIEW
          ══════════════════════════════════════════════════ */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-farm-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold border-collapse">
                  <thead>
                    <tr className="bg-farmBg/80 text-farmGreen-950 font-extrabold border-b border-gray-100">
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Produce & Farmer</th>
                      <th className="p-4">Destination Pin</th>
                      <th className="p-4">Total & Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-farmGreen-950">
                    {filteredOrders.map(ord => {
                      const config = getStatusConfig(ord.status);
                      const StatusIcon = config.icon;
                      return (
                        <tr key={ord.id} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="p-4">
                            <div className="font-extrabold text-sm text-farmGreen-950">{ord.id}</div>
                            <div className="text-[10px] text-farmMuted font-medium">{ord.date}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-xs text-farmGreen-950 truncate max-w-[180px]">{ord.items}</div>
                            <div className="text-[10px] text-emerald-700 font-bold">{ord.farmer}</div>
                          </td>
                          <td className="p-4 max-w-[160px] truncate text-[11px] text-farmMuted font-medium">
                            {ord.address}
                          </td>
                          <td className="p-4">
                            <div className="font-black text-sm text-emerald-800">₹{ord.total}</div>
                            <div className="text-[10px] text-gray-500">{ord.paymentMethod || 'COD'}</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${config.bg}`}>
                              <StatusIcon className="w-3 h-3" />
                              <span>{config.label}</span>
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => { setSelectedOrder(ord); setModalTab('receipt'); }}
                                className="p-2 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-900 rounded-xl transition-all cursor-pointer"
                                title="Inspect Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReorder(ord)}
                                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-all cursor-pointer"
                                title="Reorder"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
             MODE 3: GRID VIEW
          ══════════════════════════════════════════════════ */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map(ord => {
                const config = getStatusConfig(ord.status);
                const StatusIcon = config.icon;
                return (
                  <div key={ord.id} className="bg-white rounded-3xl border border-gray-100 shadow-farm-md hover:shadow-farm-lg transition-all p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden h-36 bg-gray-100">
                        <img src={ord.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80'} alt={ord.items} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full border text-[10px] font-extrabold backdrop-blur-md shadow-md ${config.bg}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {config.label}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-sm text-farmGreen-950">{ord.id}</span>
                          <span className="font-black text-base text-emerald-700">₹{ord.total}</span>
                        </div>
                        <h4 className="font-bold text-xs text-farmGreen-950 truncate mb-1">{ord.items}</h4>
                        <p className="text-[10px] text-farmMuted font-medium">Producer: {ord.farmer}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedOrder(ord); setModalTab('receipt'); }}
                        className="flex-1 py-2 bg-farmGreen-900 text-white rounded-xl font-extrabold text-xs hover:bg-farmGreen-950 transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                      <button
                        onClick={() => handleReorder(ord)}
                        className="py-2 px-3 bg-emerald-50 text-emerald-800 rounded-xl font-extrabold text-xs hover:bg-emerald-100 transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════
             MODE 4: TIMELINE FEED VIEW
          ══════════════════════════════════════════════════ */}
          {viewMode === 'timeline' && (
            <div className="relative pl-6 space-y-6 border-l-2 border-emerald-300/60 ml-3">
              {filteredOrders.map(ord => {
                const config = getStatusConfig(ord.status);
                const StatusIcon = config.icon;
                return (
                  <div key={ord.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full ${config.dotBg} ring-4 ring-white flex items-center justify-center text-white shadow-md`}>
                      <StatusIcon className="w-3.5 h-3.5 text-white" />
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-farm-md p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-base text-farmGreen-950">{ord.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${config.bg}`}>
                              {config.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-farmMuted font-medium">{ord.date} · {ord.farmer}</span>
                        </div>
                        <span className="font-black text-lg text-emerald-700">₹{ord.total}</span>
                      </div>

                      <p className="text-xs font-bold text-farmGreen-950">{ord.items}</p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-farmMuted font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="truncate max-w-[200px]">{ord.address}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedOrder(ord); setModalTab('receipt'); }}
                            className="px-3 py-1.5 bg-farmGreen-900 text-white rounded-xl font-extrabold text-xs hover:bg-farmGreen-950 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─── Cancel Order Confirmation Dialog Modal ─── */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-5 animate-scaleUp">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-farmGreen-950">Cancel Order {orderToCancel.id}?</h3>
              <p className="text-xs text-farmMuted leading-relaxed">
                Are you sure you want to cancel this harvest delivery request? This action cannot be reversed.
              </p>
            </div>

            <div>
              <label className="text-xs font-extrabold text-farmGreen-950 mb-1.5 block">Select Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-farmGreen-950 outline-none focus:border-rose-400"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery time too long">Delivery time too long</option>
                <option value="Changed delivery address">Changed delivery address</option>
                <option value="Found alternative produce">Found alternative produce</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setOrderToCancel(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-xs transition-all cursor-pointer"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Inspect Details & Tax Invoice Modal ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100 text-xs font-semibold animate-scaleUp">
            
            {/* Modal Top Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#071a0b] via-[#0d2214] to-[#183d20] text-white sticky top-0 z-20 shadow-md">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-white">Order Details #{selectedOrder.id}</h3>
                      <button 
                        onClick={() => handleCopyOrderId(selectedOrder.id)}
                        className="text-emerald-300/80 hover:text-white transition-colors cursor-pointer"
                        title="Copy Order ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-200/80 font-medium">Placed on {selectedOrder.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Sub-Tab Selector */}
              <div className="flex items-center gap-2 border-t border-emerald-800/60 pt-3">
                {[
                  { id: 'receipt', label: '📄 Tax Invoice & Receipt', icon: FileText },
                  { id: 'live-tracker', label: '🚚 Live Dispatch Journey', icon: Truck },
                  { id: 'producer', label: '🌾 Farm Producer Info', icon: Sprout }
                ].map(t => {
                  const isTabActive = modalTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setModalTab(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isTabActive
                          ? 'bg-emerald-400 text-emerald-950 shadow-xs'
                          : 'text-emerald-200/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 sm:p-6 space-y-5">
              
              {/* TAB 1: TAX INVOICE & RECEIPT */}
              {modalTab === 'receipt' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Assigned Farmer Banner */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50/80 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Organic Farmer</span>
                      </span>
                      <div className="font-extrabold text-sm text-farmGreen-950">{selectedOrder.farmer}</div>
                      <div className="text-[11px] text-farmMuted font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Delivery Address: {selectedOrder.address}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right border-t sm:border-t-0 border-emerald-200/60 pt-2 sm:pt-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Total Invoice Amount</span>
                      <div className="font-black text-2xl text-emerald-800">₹{selectedOrder.total}</div>
                      <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {selectedOrder.paymentMethod || 'Cash on Delivery'}
                      </span>
                    </div>
                  </div>

                  {/* Itemized Package Items Breakdown */}
                  <div className="space-y-2">
                    <div className="font-extrabold text-xs text-farmGreen-950 flex items-center justify-between">
                      <span>Package Items Breakdown</span>
                      <span className="text-farmMuted font-medium text-[11px]">
                        {selectedOrder.itemsList ? selectedOrder.itemsList.length : 1} Item(s)
                      </span>
                    </div>

                    {selectedOrder.itemsList && selectedOrder.itemsList.length > 0 ? (
                      <div className="space-y-2">
                        {selectedOrder.itemsList.map((item, i) => (
                          <div key={i} className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img src={item.img || selectedOrder.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200" />
                              <div>
                                <div className="font-extrabold text-xs text-farmGreen-950">{item.name}</div>
                                <div className="text-[10px] text-farmMuted font-medium">Quantity: {item.qty}</div>
                              </div>
                            </div>
                            <div className="font-black text-xs text-farmGreen-950">₹{item.price}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={selectedOrder.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80'} alt={selectedOrder.items} className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200" />
                          <div>
                            <div className="font-extrabold text-xs text-farmGreen-950">{selectedOrder.items}</div>
                            <div className="text-[10px] text-farmMuted font-medium">Farm Direct Produce Box</div>
                          </div>
                        </div>
                        <div className="font-black text-xs text-farmGreen-950">₹{selectedOrder.total}</div>
                      </div>
                    )}
                  </div>

                  {/* Invoice Summary Calculation */}
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2 text-xs">
                    <div className="flex justify-between text-farmMuted">
                      <span>Harvest Subtotal</span>
                      <span className="font-bold text-farmGreen-950">₹{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between text-farmMuted">
                      <span>Farm-to-Door Delivery</span>
                      <span className="font-bold text-emerald-700">FREE 🎉</span>
                    </div>
                    <div className="flex justify-between text-farmMuted">
                      <span>Taxes & GST (Included)</span>
                      <span className="font-bold text-farmGreen-950">₹0</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-black text-sm text-farmGreen-950">Grand Total</span>
                      <span className="font-black text-xl text-emerald-800">₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE DISPATCH JOURNEY */}
              {modalTab === 'live-tracker' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-blue-950">Dispatch Progress Tracker</div>
                        <div className="text-[11px] text-blue-700 font-medium">Estimated Arrival: <strong>{selectedOrder.eta || '25-35 mins'}</strong></div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse">
                      LIVE
                    </span>
                  </div>

                  {/* Rider Contact Card */}
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg">
                        🛵
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-farmGreen-950">Rohan Sharma (Delivery Partner)</div>
                        <div className="text-[10px] text-farmMuted">Ather EV Scooter · MH 12 FX 4920</div>
                      </div>
                    </div>
                    <a
                      href="tel:+919876543210"
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Courier</span>
                    </a>
                  </div>

                  {/* Journey Timeline */}
                  <div className="space-y-3 pt-2">
                    {[
                      { title: 'Order Placed', time: selectedOrder.date, done: true, desc: 'Sent to producer ' + selectedOrder.farmer },
                      { title: 'Farm Harvesting & Packing', time: '10 mins ago', done: true, desc: 'Freshly harvested & quality checked' },
                      { title: 'Courier Agent Picked Up', time: 'In Progress', done: selectedOrder.status === 'Out for Delivery' || selectedOrder.status === 'Delivered', desc: 'Loaded in climate-controlled bag' },
                      { title: 'Delivered to Doorstep', time: selectedOrder.status === 'Delivered' ? 'Completed' : 'Pending', done: selectedOrder.status === 'Delivered', desc: selectedOrder.address }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${step.done ? 'bg-emerald-600 text-white font-bold' : 'bg-gray-200 text-gray-400'}`}>
                          {step.done ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-farmGreen-950">{step.title}</span>
                            <span className="text-[10px] text-gray-500 font-medium">{step.time}</span>
                          </div>
                          <p className="text-[11px] text-farmMuted font-medium mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FARM PRODUCER INFO */}
              {modalTab === 'producer' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-gradient-to-r from-[#071a0b] via-[#0d2214] to-[#183d20] text-white rounded-2xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
                        🌾
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold mb-1">
                          <Sprout className="w-3 h-3" />
                          <span>100% Certified Organic Estate</span>
                        </div>
                        <h4 className="font-black text-base text-white">{selectedOrder.farmer}</h4>
                        <p className="text-xs text-emerald-200/80">Pune & Satara Organic Farming Collective</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/60 text-xs">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-emerald-300/80 block">Harvest Standard</span>
                        <strong className="text-white font-extrabold">A2 Dairy & Chemical-Free</strong>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-emerald-300/80 block">Direct Farm Rating</span>
                        <strong className="text-[#a8f060] font-extrabold">4.9 ★★★★★ (240+ reviews)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Footer */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder.id)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF Tax Invoice</span>
                  </button>

                  <button
                    onClick={() => { handleReorder(selectedOrder); setSelectedOrder(null); }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reorder Package</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-extrabold text-xs cursor-pointer transition-all active:scale-95"
                >
                  Close Window
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerOrders;
