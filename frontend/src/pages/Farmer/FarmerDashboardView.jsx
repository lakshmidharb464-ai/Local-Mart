import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ChevronRight, 
  Sprout, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Send, 
  Zap, 
  Check, 
  FileText, 
  Truck,
  Sparkles,
  Leaf,
  BarChart3,
  IndianRupee,
  X
} from 'lucide-react';

/* --- Tiny reusable SVG area sparkline --- */
const AreaSparkline = ({ data, color = '#2EA672', gradientId }) => {
  if (!data || data.length < 2) return null;
  const w = 80, h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2
  ]);
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  const lastPt = pts[pts.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={color} stroke="white" strokeWidth="1.5" />
    </svg>
  );
};

/* --- Premium metric card with glassmorphism --- */
const MetricCard = ({ label, value, sub, subColor, icon: Icon, iconBg, iconColor, borderAccent, sparkData, sparkColor, gradientId, trend, trendUp, onClick, staggerClass }) => (
  <button
    onClick={onClick}
    className={`text-left w-full glass-surface glass-surface-hover p-5 rounded-3xl border ${borderAccent} space-y-3 hover:shadow-glass-lg hover:-translate-y-2 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group relative overflow-hidden animate-staggerIn ${staggerClass || ''}`}
  >
    {/* Glass shimmer on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ backgroundSize: '200% 100%', animation: 'glassShimmer 2s ease-in-out' }} />

    <div className="flex items-center justify-between relative z-10">
      <span className="text-[11px] font-black text-farmMuted uppercase tracking-widest group-hover:text-farmGreen-900 transition-colors">
        {label}
      </span>
      <div className={`p-2.5 ${iconBg} ${iconColor} rounded-2xl group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
    </div>

    <div className="flex items-end justify-between relative z-10">
      <div>
        <div className="font-black text-3xl text-farmGreen-950 leading-none">{value}</div>
        <div className={`text-[11px] font-semibold mt-1.5 flex items-center gap-1 ${subColor}`}>
          {sub}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <AreaSparkline data={sparkData} color={sparkColor} gradientId={gradientId} />
        {trend && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 backdrop-blur-sm ${trendUp ? 'bg-emerald-100/80 text-emerald-800' : 'bg-rose-100/80 text-rose-800'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  </button>
);

/* --- Main Component --- */
export const FarmerDashboardView = ({ 
  products = [], 
  setProducts,
  orders = [], 
  setOrders,
  setActiveTab, 
  setShowAddModal,
  farmStatus = 'open',
  setFarmStatus
}) => {
  const { t } = useTranslation();
  const { showToast } = useAuth();

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTemplate, setBroadcastTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [restockingId, setRestockingId] = useState(null);

  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const todayOrdersCount = pendingOrders.length || 3;
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockProducts = products.filter(p => p.stock < 15);

  const handleQuickAdvanceOrder = (orderId, currentStatus) => {
    let nextStatus = 'Accepted';
    if (currentStatus === 'Pending') nextStatus = 'Accepted';
    else if (currentStatus === 'Accepted') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') nextStatus = 'Delivered';

    if (setOrders) setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    if (showToast) showToast('Order Updated', `Order ${orderId} progressed to ${nextStatus}`);
  };

  const handleQuickRestock = (productId, productName) => {
    setRestockingId(productId);
    setTimeout(() => {
      if (setProducts) setProducts(products.map(p => p.id === productId ? { ...p, stock: (p.stock || 0) + 25 } : p));
      setRestockingId(null);
      if (showToast) showToast('Restocked', `Added +25 units to ${productName}.`);
    }, 400);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setShowBroadcastModal(false);
      setBroadcastTemplate('');
      setCustomMessage('');
      if (showToast) showToast('Broadcast Sent 📢', 'Notification delivered to 142 subscribed households.');
    }, 700);
  };

  const broadcastTemplates = [
    { label: '🌾 Harvest Ready Today', msg: 'Fresh morning harvest of organic produce is ready! Order today for same-day farm-to-table delivery.' },
    { label: '💚 Weekend Special', msg: 'Weekend special: 15% off all organic vegetables this Saturday & Sunday. Direct from our farm, zero middleman!' },
    { label: '📦 New Lot Available', msg: 'A fresh lot of organic produce has arrived. Limited stock — order now for priority delivery.' },
    { label: '🚜 Farm Open for Orders', msg: 'Our farm is now open for orders. All produce freshly harvested today. Free delivery above ₹500.' },
  ];

  const statusConfig = {
    open: { label: 'Open for Orders', dot: 'bg-emerald-400 animate-pulse', chip: 'bg-emerald-50/80 text-emerald-800 border-emerald-200/60 backdrop-blur-sm' },
    harvesting: { label: 'Harvesting Today', dot: 'bg-farmGold-500 animate-pulse', chip: 'bg-farmGold-50/80 text-farmGold-900 border-farmGold-200/60 backdrop-blur-sm' },
    paused: { label: 'Orders Paused', dot: 'bg-farmTerracotta-400', chip: 'bg-farmTerracotta-50/80 text-farmTerracotta-700 border-farmTerracotta-200/60 backdrop-blur-sm' },
  };
  const sc = statusConfig[farmStatus] || statusConfig.open;

  return (
    <div className="space-y-5 animate-fadeIn pb-10">

      {/* ——— Hero Welcome Banner ——————————————————————————————————————————————————— */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#071f15] via-[#0B3D2E] to-[#0D4233] rounded-3xl p-6 sm:p-8 text-white shadow-farm-lg border border-white/[0.06]">
        {/* Animated floating orbs */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-farmGold-500/[0.08] rounded-full blur-3xl pointer-events-none animate-orbFloat" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-farmTerracotta-400/[0.08] rounded-full blur-3xl pointer-events-none animate-orbFloat" style={{ animationDelay: '2s' }} />
        <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-400/[0.06] rounded-full blur-2xl pointer-events-none animate-orbFloat" style={{ animationDelay: '4s' }} />
        
        {/* Subtle particle dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-farmGold-400/30 rounded-full animate-dotPulse" style={{
              left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`
            }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: greeting */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-farmGold-500/15 border border-farmGold-400/25 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Sprout className="w-8 h-8 text-farmGold-400" />
            </div>
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold border mb-2 ${sc.chip}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
              <h1 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Good Morning! 🌾
              </h1>
              <p className="text-xs text-white/60 mt-1 max-w-lg">
                Your listings are live with <strong className="text-farmGold-400">0% platform fees</strong>. Revenue goes directly to you.
              </p>
            </div>
          </div>

          {/* Right: CTA buttons */}
          <div className="flex gap-2.5 shrink-0">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.07] hover:bg-white/[0.14] text-white rounded-2xl text-xs font-semibold transition-all border border-white/[0.08] hover:border-farmGold-500/25 cursor-pointer hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              <Send className="w-3.5 h-3.5 text-farmGold-400" />
              <span>Broadcast</span>
            </button>
            <button
              onClick={() => { setActiveTab('products'); if (setShowAddModal) setShowAddModal(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-900 font-black rounded-2xl text-xs transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="font-extrabold text-stone-900">Add Crop</span>
            </button>
          </div>
        </div>
      </div>

      {/* —— 4 Metric Cards ——————————————————————————————————————————————————————— */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <MetricCard
          label={t('totalCrops') || 'Total Crops'}
          value={totalProducts}
          sub={<><CheckCircle2 className="w-3.5 h-3.5" /><span>Active Listings</span></>}
          subColor="text-farmGreen-600"
          icon={Package}
          iconBg="bg-farmGreen-100"
          iconColor="text-farmGreen-700"
          borderAccent="border-farmGreen-200/50 hover:border-farmGold-300/50"
          sparkData={[8, 9, 11, 10, 12, 13, totalProducts]}
          sparkColor="#2EA672"
          gradientId="spark-products"
          trend="+2 this week"
          trendUp={true}
          onClick={() => setActiveTab('products')}
          staggerClass="stagger-1"
        />
        <MetricCard
          label="Today's Orders"
          value={`${todayOrdersCount}`}
          sub={<><Clock className="w-3.5 h-3.5" /><span>{pendingOrders.length} Pending</span></>}
          subColor="text-blue-600"
          icon={ShoppingCart}
          iconBg="bg-blue-100/80"
          iconColor="text-blue-700"
          borderAccent="border-blue-200/50 hover:border-farmGold-300/50"
          sparkData={[2, 5, 3, 7, 4, 6, todayOrdersCount]}
          sparkColor="#3b82f6"
          gradientId="spark-orders"
          trend="+18% vs yesterday"
          trendUp={true}
          onClick={() => setActiveTab('orders')}
          staggerClass="stagger-2"
        />
        <MetricCard
          label="Total Earnings"
          value={`₹${(totalSales + 48200).toLocaleString('en-IN')}`}
          sub={<><ArrowUpRight className="w-3.5 h-3.5" /><span>0% Commission</span></>}
          subColor="text-farmGold-700"
          icon={IndianRupee}
          iconBg="bg-farmGold-100"
          iconColor="text-farmGold-700"
          borderAccent="border-farmGold-200/50 hover:border-farmGold-400/50"
          sparkData={[28000, 32000, 31000, 38000, 42000, 46000, totalSales + 48200]}
          sparkColor="#D4A745"
          gradientId="spark-sales"
          trend="+24.3% MoM"
          trendUp={true}
          onClick={() => setActiveTab('sales')}
          staggerClass="stagger-3"
        />
        <MetricCard
          label="Low-Stock Alert"
          value={`${lowStockProducts.length} Items`}
          sub={lowStockProducts.length > 0 ? 'Need restocking soon' : 'All stock healthy'}
          subColor={lowStockProducts.length > 0 ? 'text-farmTerracotta-600' : 'text-farmGreen-600'}
          icon={AlertTriangle}
          iconBg={lowStockProducts.length > 0 ? 'bg-farmTerracotta-100' : 'bg-farmGreen-100'}
          iconColor={lowStockProducts.length > 0 ? 'text-farmTerracotta-700' : 'text-farmGreen-700'}
          borderAccent={lowStockProducts.length > 0 ? 'border-farmTerracotta-200/50 hover:border-farmTerracotta-400/50' : 'border-farmGreen-200/50 hover:border-farmGreen-300/50'}
          sparkData={[6, 5, 7, 8, 5, lowStockProducts.length + 2, lowStockProducts.length]}
          sparkColor={lowStockProducts.length > 0 ? '#C67B5C' : '#2EA672'}
          gradientId="spark-stock"
          trend={lowStockProducts.length > 0 ? `${lowStockProducts.length} critical` : 'All clear'}
          trendUp={lowStockProducts.length === 0}
          onClick={() => setActiveTab('inventory')}
          staggerClass="stagger-4"
        />
      </div>

      {/* —— Main 2-column grid: Content (left) + Side Panel (right) ———— */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* —— LEFT COLUMN (2/3) —— */}
        <div className="xl:col-span-2 space-y-5">

          {/* Quick Action Shortcuts */}
          <div className="glass-surface px-5 py-3.5 rounded-2xl border border-farmGreen-200/30 flex flex-wrap items-center gap-3 animate-staggerIn stagger-5">
            <div className="flex items-center gap-2 mr-1">
              <div className="p-1.5 rounded-lg bg-farmGold-100/80 text-farmGold-700">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-[11px] text-farmGreen-950 uppercase tracking-wider">Quick Actions:</span>
            </div>
            {[
              { label: 'Crop Catalog', icon: Package, color: 'text-farmGreen-600', tab: 'products' },
              { label: 'Restock', icon: Zap, color: 'text-farmGold-600', tab: 'inventory' },
              { label: 'Harvest Plan', icon: Sprout, color: 'text-teal-600', tab: 'seasons' },
              { label: 'Payout', icon: BarChart3, color: 'text-blue-600', tab: 'sales' },
              { label: 'All Orders', icon: ShoppingCart, color: 'text-purple-600', tab: 'orders' },
            ].map(({ label, icon: Icon, color, tab }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3.5 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-farmGold-50/80 text-farmGreen-950 text-xs font-bold border border-farmSage-200/50 hover:border-farmGold-300/50 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-sm"
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="glass-surface p-5 rounded-3xl border border-farmGreen-200/30 animate-staggerIn stagger-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-farmSage-100/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-farmGreen-50/80 text-farmGreen-700 rounded-xl border border-farmGreen-100/60 shadow-sm">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-farmGreen-950">Recent Customer Orders</h3>
                  <p className="text-[11px] text-farmMuted">Advance orders through fulfilment pipeline</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-farmGreen-700 hover:text-farmGold-700 flex items-center gap-1 cursor-pointer hover:underline underline-offset-2 shrink-0 transition-colors"
              >
                View All ({orders.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-8 h-8 text-farmGreen-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-farmMuted">No orders yet. Share your farm link to attract buyers!</p>
                </div>
              ) : orders.slice(0, 5).map(ord => {
                const statusStyles = {
                  'Pending': 'bg-farmGold-100/70 text-farmGold-900 border-farmGold-200/60',
                  'Accepted': 'bg-blue-100/70 text-blue-900 border-blue-200/60',
                  'Out for Delivery': 'bg-purple-100/70 text-purple-900 border-purple-200/60',
                  'Delivered': 'bg-farmGreen-100/70 text-farmGreen-900 border-farmGreen-200/60',
                };
                const statusBarColors = {
                  'Pending': 'bg-gradient-to-b from-farmGold-400 to-farmGold-500',
                  'Accepted': 'bg-gradient-to-b from-blue-400 to-blue-500',
                  'Out for Delivery': 'bg-gradient-to-b from-purple-400 to-purple-500',
                  'Delivered': 'bg-gradient-to-b from-farmGreen-400 to-farmGreen-500',
                };
                return (
                  <div key={ord.id} className="p-3.5 bg-white/50 backdrop-blur-sm rounded-2xl border border-farmSage-100/40 flex items-center gap-3 text-xs hover:bg-farmGold-50/30 hover:border-farmGold-200/40 transition-all group/order">
                    {/* Status colour bar */}
                    <div className={`w-1 h-10 rounded-full shrink-0 ${statusBarColors[ord.status] || 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-farmGreen-950">{ord.id}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border backdrop-blur-sm ${statusStyles[ord.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-farmMuted mt-0.5 truncate">{ord.customerName} · {ord.items}</div>
                      <div className="font-black text-farmGreen-950 mt-0.5">₹{ord.total?.toLocaleString('en-IN')}</div>
                    </div>
                    {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleQuickAdvanceOrder(ord.id, ord.status)}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-black shadow-sm transition-all flex items-center gap-1 cursor-pointer shrink-0 bg-farmGreen-950 hover:bg-farmGreen-800 active:scale-95 text-white hover:shadow-md group-hover/order:scale-105"
                      >
                        {ord.status === 'Pending' ? (
                          <><Check className="w-3 h-3 text-farmGold-400" /><span>Accept</span></>
                        ) : ord.status === 'Accepted' ? (
                          <><Truck className="w-3 h-3 text-farmGold-300" /><span>Dispatch</span></>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3 text-farmGold-300" /><span>Delivered</span></>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* —— RIGHT COLUMN (1/3) — Side Panel ——————————————————————————————— */}
        <div className="space-y-4">

          {/* Farm Performance Summary */}
          <div className="glass-dark-surface rounded-3xl p-5 text-white border border-white/[0.06] animate-staggerIn stagger-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-farmGold-500/15 rounded-xl border border-farmGold-400/20 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-farmGold-400" />
              </div>
              <span className="font-black text-sm text-white">Farm Performance</span>
              <span className="ml-auto text-[10px] font-bold text-farmGold-400 bg-farmGold-900/40 px-2 py-0.5 rounded-full border border-farmGold-700/30 backdrop-blur-sm">This Month</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Revenue', value: `₹${(totalSales + 48200).toLocaleString('en-IN')}`, pct: 78, color: 'bg-gradient-to-r from-farmGold-500 to-farmGold-400' },
                { label: 'Orders Fulfilled', value: `${orders.filter(o => o.status === 'Delivered').length + 24}`, pct: 92, color: 'bg-gradient-to-r from-blue-400 to-blue-500' },
                { label: 'Customer Satisfaction', value: '4.9 ★', pct: 98, color: 'bg-gradient-to-r from-farmGold-400 to-amber-400' },
                { label: 'Stock Health', value: lowStockProducts.length > 0 ? `${lowStockProducts.length} low` : 'Excellent', pct: lowStockProducts.length > 0 ? 45 : 95, color: lowStockProducts.length > 0 ? 'bg-gradient-to-r from-farmTerracotta-400 to-farmTerracotta-500' : 'bg-gradient-to-r from-teal-400 to-emerald-400' },
              ].map(stat => (
                <div key={stat.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 font-semibold">{stat.label}</span>
                    <span className="font-black text-white">{stat.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color} rounded-full progress-fill-animated`} style={{ width: `${stat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-white/40">Powered by LocalFarm Direct</span>
              <span className="text-farmGold-400 font-black">🌿 0% Fee</span>
            </div>
          </div>

          {/* Low-Stock Alerts Panel */}
          <div className="glass-surface rounded-3xl border border-farmGreen-200/30 p-5 animate-staggerIn stagger-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-farmTerracotta-50 text-farmTerracotta-600 rounded-xl border border-farmTerracotta-100">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-farmGreen-950">Stock Alerts</h3>
                  <p className="text-[10px] text-farmMuted">Restock before sellout</p>
                </div>
              </div>
              {lowStockProducts.length > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-farmTerracotta-100/80 text-farmTerracotta-700 border border-farmTerracotta-200/60 backdrop-blur-sm">
                  {lowStockProducts.length} critical
                </span>
              )}
            </div>

            <div className="space-y-2">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 4).map(p => {
                  const pct = Math.min(100, Math.round((p.stock / 20) * 100));
                  return (
                    <div key={p.id} className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/50 border border-farmSage-100/40 hover:bg-farmTerracotta-50/30 hover:border-farmTerracotta-200/40 transition-all backdrop-blur-sm">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-farmSage-200/50 shadow-sm" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-[11px] text-farmGreen-950 truncate">{p.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex-1 h-1.5 bg-farmSage-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full progress-fill-animated ${pct < 30 ? 'bg-gradient-to-r from-farmTerracotta-400 to-farmTerracotta-500' : 'bg-gradient-to-r from-farmGold-400 to-farmGold-500'}`} style={{ width: `${Math.max(pct, 5)}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-farmTerracotta-600">{p.stock} {p.unit}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickRestock(p.id, p.name)}
                        disabled={restockingId === p.id}
                        className="w-8 h-8 bg-farmGreen-700 hover:bg-farmGreen-600 active:scale-95 text-white font-black text-[11px] rounded-xl shadow-sm transition-all cursor-pointer shrink-0 flex items-center justify-center hover:shadow-md"
                      >
                        {restockingId === p.id ? '...' : <Plus className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 space-y-2">
                  <div className="w-10 h-10 bg-farmGreen-100/80 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
                    <CheckCircle2 className="w-5 h-5 text-farmGreen-600" />
                  </div>
                  <p className="font-black text-xs text-farmGreen-700">All stock healthy!</p>
                  <p className="text-[10px] text-farmMuted">No items need restocking.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('inventory')}
              className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-farmGreen-700 hover:text-farmGold-700 bg-farmGreen-50/60 hover:bg-farmGold-50/60 border border-farmGreen-100/60 hover:border-farmGold-200/50 transition-all cursor-pointer flex items-center justify-center gap-1 backdrop-blur-sm"
            >
              Manage Full Inventory <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Today's Schedule Card */}
          <div className="glass-surface rounded-3xl border border-farmGold-200/30 p-5 animate-staggerIn stagger-7">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-farmGold-50/80 rounded-xl border border-farmGold-100/60">
                <FileText className="w-4 h-4 text-farmGold-700" />
              </div>
              <h3 className="font-black text-sm text-farmGreen-950">Today's Schedule</h3>
            </div>
            <div className="space-y-2">
              {[
                { time: '5:30 AM', task: 'Morning harvest - tomatoes & spinach', done: true },
                { time: '8:00 AM', task: 'Package & dispatch 3 pending orders', done: false, urgent: true },
                { time: '11:00 AM', task: 'Update crop prices (market day)', done: false },
                { time: '4:00 PM', task: 'Irrigation check - north field', done: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-colors ${item.done ? 'opacity-50' : 'hover:bg-farmGold-50/30'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${item.done ? 'bg-farmGreen-500 border-farmGreen-500' : item.urgent ? 'border-farmGold-500 animate-goldPulse' : 'border-farmSage-300'}`}>
                    {item.done && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`font-black text-[10px] ${item.urgent ? 'text-farmGold-700' : 'text-farmMuted'}`}>{item.time}</span>
                    <p className={`font-semibold leading-tight mt-0.5 ${item.done ? 'line-through text-farmSage-400' : 'text-farmGreen-950'}`}>{item.task}</p>
                  </div>
                  {item.urgent && !item.done && <span className="text-[9px] font-black px-1.5 py-0.5 bg-farmGold-100/80 text-farmGold-800 rounded-full border border-farmGold-200/60 shrink-0 backdrop-blur-sm animate-pulse">NOW</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- Broadcast Modal --- */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl animate-fadeIn">
          <div className="glass-surface rounded-3xl max-w-lg w-full shadow-glass-lg border border-white/30 overflow-hidden animate-scaleIn">
            <div className="bg-gradient-to-r from-farmGreen-950 to-farmGreen-800 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/[0.1] rounded-2xl backdrop-blur-sm border border-white/[0.08]">
                  <Send className="w-5 h-5 text-farmGold-400" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Broadcast to Buyers</h3>
                  <p className="text-[11px] text-farmGold-300/80">Notify 142 subscribed households instantly</p>
                </div>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="text-white/40 hover:text-white p-1.5 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-farmGreen-950 mb-2 uppercase tracking-wide">Quick Templates</label>
                <div className="grid grid-cols-2 gap-2">
                  {broadcastTemplates.map(t => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => { setBroadcastTemplate(t.label); setCustomMessage(t.msg); }}
                      className={`text-left p-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer backdrop-blur-sm ${broadcastTemplate === t.label ? 'border-farmGold-500 bg-farmGold-50/80 text-farmGreen-950 shadow-gold-glow' : 'border-farmSage-200/50 bg-white/40 text-farmGreen-950 hover:border-farmGold-300/50 hover:bg-farmGold-50/40'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {customMessage && (
                <div>
                  <label className="block text-xs font-black text-farmGreen-950 mb-1.5 uppercase tracking-wide">Message Preview</label>
                  <textarea
                    rows={3}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full p-3 bg-white/50 backdrop-blur-sm border border-farmSage-200/50 rounded-2xl text-xs text-farmGreen-950 input-premium resize-none"
                  />
                </div>
              )}

              <div className="p-3 bg-farmGreen-50/60 rounded-2xl border border-farmGreen-100/60 flex items-center gap-2 text-xs text-farmGreen-800 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-farmGreen-600 shrink-0" />
                <span>0% commission applies to all orders generated from this broadcast.</span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={() => setShowBroadcastModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-farmMuted border border-farmSage-200/50 hover:bg-farmSage-50/50 transition-all cursor-pointer backdrop-blur-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting || !customMessage}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-farmGold-600 to-farmGold-500 hover:from-farmGold-500 hover:to-farmGold-400 disabled:opacity-50 text-farmGreen-950 rounded-xl text-xs font-black shadow-gold-glow hover:shadow-gold-glow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isBroadcasting ? (
                    <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-farmGreen-950 border-t-transparent rounded-full animate-spin" />Sending...</span>
                  ) : (
                    <><Send className="w-3.5 h-3.5" /><span>Send to 142 Buyers</span></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerDashboardView;
