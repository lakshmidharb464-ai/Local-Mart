import React, { useState, useMemo, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowUpRight, 
  BarChart3,
  Download,
  Wallet,
  ShieldCheck,
  Percent,
  Search,
  Filter,
  ArrowDownRight,
  Sparkles,
  Layers,
  Clock,
  Check,
  Copy,
  Receipt,
  X,
  CreditCard,
  Building2,
  ChevronRight,
  PieChart,
  Sprout
} from 'lucide-react';

/* ─── Beautiful SVG Area Chart Panel ───────────────────────────────────── */
const AreaChartPanel = ({ chartPoints, chartMetric, setChartMetric, selectedDayFilter, setSelectedDayFilter, timeframe, maxSales, maxOrders }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const W = 560, H = 200, PAD = 16;

  const values = chartPoints.map(d => chartMetric === 'revenue' ? d.sales : d.orders);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;

  const pts = chartPoints.map((d, i) => ({
    x: PAD + (i / (chartPoints.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((values[i] - minVal) / range) * (H - PAD * 2),
    ...d,
    val: values[i],
  }));

  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${lineD} L${(W - PAD).toFixed(1)},${H} L${PAD},${H} Z`;

  const formatVal = v => chartMetric === 'revenue' ? `₹${v.toLocaleString('en-IN')}` : `${v} orders`;

  return (
    <div className="lg:col-span-2 glass-surface p-6 rounded-3xl border border-farmGreen-200/30 shadow-glass space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-farmSage-100/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-farmGreen-100/80 text-farmGreen-700 rounded-2xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-farmGreen-950">{timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Revenue Trend</h3>
            <p className="text-[11px] text-farmMuted font-semibold">Hover over points to inspect values · Click to filter transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-farmSage-100/40 p-1 rounded-xl shrink-0">
          {[{ k: 'revenue', label: 'Revenue (₹)' }, { k: 'orders', label: 'Orders (#)' }].map(m => (
            <button
              key={m.k}
              onClick={() => setChartMetric(m.k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartMetric === m.k ? 'bg-white text-farmGreen-950 shadow-sm' : 'text-farmMuted hover:text-farmGreen-950'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter pill */}
      {selectedDayFilter && (
        <div className="flex items-center justify-between px-3 py-2 bg-farmGreen-50/60 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 animate-fadeIn">
          <span>Showing transactions for: <strong>{selectedDayFilter}</strong></span>
          <button onClick={() => setSelectedDayFilter(null)} className="text-farmGreen-700 hover:underline cursor-pointer">Show All</button>
        </div>
      )}

      {/* SVG Area Chart */}
      <div className="relative w-full overflow-hidden" style={{ height: H + 8 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: H }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="sales-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartMetric === 'revenue' ? '#10b981' : '#6366f1'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={chartMetric === 'revenue' ? '#10b981' : '#6366f1'} stopOpacity="0.01" />
            </linearGradient>
            {/* Horizontal grid lines */}
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(f => {
            const y = PAD + f * (H - PAD * 2);
            return <line key={f} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#f0f4f0" strokeWidth="1" />;
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#sales-area-grad)" />

          {/* Line */}
          <path d={lineD} stroke={chartMetric === 'revenue' ? '#059669' : '#4f46e5'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Interactive points */}
          {pts.map((p, i) => {
            const isHovered = hoveredIdx === i;
            const isSelected = selectedDayFilter === p.label;
            return (
              <g key={i}>
                {/* Hit area */}
                <rect
                  x={p.x - 20}
                  y={0}
                  width={40}
                  height={H}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onClick={() => setSelectedDayFilter(isSelected ? null : p.label)}
                />
                {/* Vertical guide on hover */}
                {isHovered && <line x1={p.x} y1={PAD} x2={p.x} y2={H - 8} stroke="#d1fae5" strokeWidth="1" strokeDasharray="4,3" />}
                {/* Dot */}
                <circle cx={p.x} cy={p.y} r={isHovered || isSelected ? 6 : 3.5} fill={chartMetric === 'revenue' ? '#059669' : '#4f46e5'} stroke="white" strokeWidth="2" className="transition-all duration-150" />
                {/* Tooltip bubble */}
                {isHovered && (
                  <g>
                    <rect x={p.x - 44} y={p.y - 36} width={88} height={28} rx="6" fill="#0B3D2E" />
                    <text x={p.x} y={p.y - 26} textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="sans-serif">
                      {p.label}
                    </text>
                    <text x={p.x} y={p.y - 15} textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                      {formatVal(p.val)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex items-center justify-between px-4 mt-1">
          {pts.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedDayFilter(selectedDayFilter === p.label ? null : p.label)}
              className={`text-[10px] font-bold transition-all cursor-pointer ${selectedDayFilter === p.label ? 'text-farmGreen-950 font-black' : 'text-farmMuted hover:text-farmGreen-950'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-farmMuted pt-1 border-t border-farmSage-100/40 font-semibold">
        <span>
          Peak: <strong className="text-farmGreen-950">{chartPoints.reduce((a, b) => (chartMetric === 'revenue' ? b.sales > a.sales : b.orders > a.orders) ? b : a, chartPoints[0])?.label}</strong>
          {' '}<strong className="text-farmGreen-950">{formatVal(Math.max(...values))}</strong>
        </span>
        <span className="text-farmGreen-700 font-bold">Zero platform fees · 100% yours</span>
      </div>
    </div>
  );
};

export const FarmerSales = ({ orders = [] }) => {
  const { showToast, currencySymbol } = useAuth();

  const [timeframe, setTimeframe] = useState('weekly'); // 'daily' | 'weekly' | 'monthly' | 'yearly'
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [selectedDayFilter, setSelectedDayFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'highest' | 'lowest'
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('12450');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Initial sales baseline calculations
  const completedOrders = useMemo(() => {
    return orders.filter(o => ['Delivered', 'Out for Delivery', 'Accepted'].includes(o.status));
  }, [orders]);

  const baseGrossSales = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.total || 0), 0) + 48200; // Base historical + current
  }, [orders]);

  // Commission saved under 0% middleman model (vs typical 18% market fee)
  const commissionSaved = Math.round(baseGrossSales * 0.18);

  // Timeframe-specific sales data
  const timeframeData = {
    daily: {
      gross: 4250,
      ordersCount: 8,
      avgBasket: 531,
      chart: [
        { label: '6 AM', sales: 420, orders: 1, topItem: 'A2 Cow Milk' },
        { label: '8 AM', sales: 980, orders: 2, topItem: 'Organic Tomatoes' },
        { label: '10 AM', sales: 1100, orders: 2, topItem: 'Hydroponic Spinach' },
        { label: '12 PM', sales: 650, orders: 1, topItem: 'Desi Ghee' },
        { label: '2 PM', sales: 300, orders: 1, topItem: 'Fresh Coriander' },
        { label: '4 PM', sales: 800, orders: 1, topItem: 'Alphonso Mangoes' },
      ]
    },
    weekly: {
      gross: 24650,
      ordersCount: 42,
      avgBasket: 586,
      chart: [
        { label: 'Mon', sales: 2400, orders: 4, topItem: 'Hydroponic Spinach' },
        { label: 'Tue', sales: 3100, orders: 6, topItem: 'A2 Gir Cow Milk' },
        { label: 'Wed', sales: 2800, orders: 5, topItem: 'Vine Tomatoes' },
        { label: 'Thu', sales: 4200, orders: 7, topItem: 'Desi Cow Butter' },
        { label: 'Fri', sales: 5100, orders: 9, topItem: 'Devgad Alphonso' },
        { label: 'Sat', sales: 6800, orders: 12, topItem: 'Fresh Farm Bundle' },
        { label: 'Sun', sales: 5400, orders: 9, topItem: 'A2 Gir Cow Milk' },
      ]
    },
    monthly: {
      gross: 98400,
      ordersCount: 168,
      avgBasket: 585,
      chart: [
        { label: 'Week 1', sales: 21200, orders: 36, topItem: 'Vine Tomatoes' },
        { label: 'Week 2', sales: 25400, orders: 44, topItem: 'A2 Gir Cow Milk' },
        { label: 'Week 3', sales: 27800, orders: 48, topItem: 'Alphonso Mangoes' },
        { label: 'Week 4', sales: 24000, orders: 40, topItem: 'Organic Veggies' },
      ]
    },
    yearly: {
      gross: 1184000,
      ordersCount: 1980,
      avgBasket: 597,
      chart: [
        { label: 'Jan', sales: 84000, orders: 145, topItem: 'Winter Greens' },
        { label: 'Feb', sales: 92000, orders: 158, topItem: 'Strawberries' },
        { label: 'Mar', sales: 108000, orders: 182, topItem: 'Mango Harvest' },
        { label: 'Apr', sales: 124000, orders: 210, topItem: 'Alphonso Special' },
        { label: 'May', sales: 118000, orders: 195, topItem: 'Summer Melons' },
        { label: 'Jun', sales: 96000, orders: 160, topItem: 'Leafy Spinach' },
        { label: 'Jul', sales: 104000, orders: 175, topItem: 'Desi Dairy' },
        { label: 'Aug', sales: 112000, orders: 190, topItem: 'Fresh Harvest' },
      ]
    }
  };

  const currentDataset = timeframeData[timeframe];
  const chartPoints = currentDataset.chart;
  const maxSales = Math.max(...chartPoints.map(d => d.sales));
  const maxOrders = Math.max(...chartPoints.map(d => d.orders));

  // Category sales breakdown
  const categorySales = [
    { name: 'Organic Vegetables', percent: 42, amount: 41320, color: 'bg-farmGreen-600', barColor: 'from-emerald-500 to-green-600' },
    { name: 'A2 Dairy & Ghee', percent: 34, amount: 33450, color: 'bg-amber-500', barColor: 'from-amber-400 to-orange-500' },
    { name: 'Orchard Fruits', percent: 16, amount: 15740, color: 'bg-rose-500', barColor: 'from-rose-400 to-pink-500' },
    { name: 'Herbs & Cold-Pressed', percent: 8, amount: 7890, color: 'bg-cyan-500', barColor: 'from-cyan-400 to-blue-500' },
  ];

  // Top selling produce list
  const topProduceItems = [
    { name: 'Pure A2 Gir Cow Milk', sold: '340 Liters', revenue: '₹27,200', growth: '+24%', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80' },
    { name: 'Vine-Ripened Organic Tomatoes', sold: '480 kg', revenue: '₹19,200', growth: '+18%', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80' },
    { name: 'Crisp Hydroponic Spinach', sold: '290 bunches', revenue: '₹8,700', growth: '+12%', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=200&q=80' },
    { name: 'Devgad Alphonso Mangoes', sold: '35 dozen', revenue: '₹22,750', growth: '+32%', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80' },
  ];

  // Extended transactions list combining prop orders with historical transactions
  const transactionsList = useMemo(() => {
    const historical = [
      {
        id: 'ORD-8821',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.s@gmail.com',
        items: 'Vine Tomatoes (2kg), Hydroponic Spinach (1 bunch)',
        total: 110,
        status: 'Out for Delivery',
        paymentMethod: 'UPI (Paid)',
        date: 'Today, 10:15 AM',
        payoutStatus: 'Settled',
        netFarmerShare: 110,
        dayLabel: 'Sun'
      },
      {
        id: 'ORD-8820',
        customerName: 'Priya Joshi',
        customerEmail: 'priya.j@outlook.com',
        items: 'A2 Gir Cow Milk (2L), Devgad Alphonso Mangoes (1 dozen)',
        total: 810,
        status: 'Delivered',
        paymentMethod: 'Credit Card',
        date: 'Yesterday, 4:30 PM',
        payoutStatus: 'Settled',
        netFarmerShare: 810,
        dayLabel: 'Sat'
      },
      {
        id: 'ORD-8819',
        customerName: 'Vikram Mehta',
        customerEmail: 'vikram.m@techcorp.io',
        items: 'Hydroponic Spinach (3 bunches), Organic Oranges (2kg)',
        total: 330,
        status: 'Accepted',
        paymentMethod: 'Cash on Delivery',
        date: 'Yesterday, 11:20 AM',
        payoutStatus: 'Pending Dispatch',
        netFarmerShare: 330,
        dayLabel: 'Sat'
      },
      {
        id: 'ORD-8818',
        customerName: 'Sneha Rane',
        customerEmail: 'sneha.rane@yahoo.co.in',
        items: 'Cold-Pressed Groundnut Oil (2L)',
        total: 480,
        status: 'Delivered',
        paymentMethod: 'UPI (Paid)',
        date: '09 Aug 2026, 6:45 PM',
        payoutStatus: 'Settled',
        netFarmerShare: 480,
        dayLabel: 'Fri'
      },
      {
        id: 'ORD-8815',
        customerName: 'Rohan Deshpande',
        customerEmail: 'rohan.d@kothrud.in',
        items: 'Fresh Organic Milk (3L), Vine Tomatoes (1kg)',
        total: 280,
        status: 'Delivered',
        paymentMethod: 'UPI (Paid)',
        date: '08 Aug 2026, 8:10 AM',
        payoutStatus: 'Settled',
        netFarmerShare: 280,
        dayLabel: 'Thu'
      },
      {
        id: 'ORD-8812',
        customerName: 'Ananya Roy',
        customerEmail: 'ananya.roy@gmail.com',
        items: 'Devgad Alphonso Mangoes (2 dozen)',
        total: 1300,
        status: 'Delivered',
        paymentMethod: 'Net Banking',
        date: '07 Aug 2026, 3:20 PM',
        payoutStatus: 'Settled',
        netFarmerShare: 1300,
        dayLabel: 'Wed'
      }
    ];

    // Combine prop orders if any unique
    const merged = [...historical];
    orders.forEach(o => {
      if (!merged.find(m => m.id === o.id)) {
        merged.push({
          ...o,
          payoutStatus: 'Settled',
          netFarmerShare: o.total,
          dayLabel: 'Today'
        });
      }
    });
    return merged;
  }, [orders]);

  // Filtered & sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactionsList
      .filter(t => {
        // Selected day filter from chart click
        if (selectedDayFilter && t.dayLabel !== selectedDayFilter && selectedDayFilter !== 'All') return false;

        // Payment mode filter
        if (paymentFilter === 'upi' && !t.paymentMethod?.includes('UPI')) return false;
        if (paymentFilter === 'card' && !t.paymentMethod?.includes('Card') && !t.paymentMethod?.includes('Banking')) return false;
        if (paymentFilter === 'cod' && !t.paymentMethod?.includes('Cash')) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesId = t.id?.toLowerCase().includes(q);
          const matchesCust = t.customerName?.toLowerCase().includes(q);
          const matchesItems = t.items?.toLowerCase().includes(q);
          return matchesId || matchesCust || matchesItems;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return (b.total || 0) - (a.total || 0);
        if (sortBy === 'lowest') return (a.total || 0) - (b.total || 0);
        return 0; // default newest
      });
  }, [transactionsList, selectedDayFilter, paymentFilter, searchQuery, sortBy]);

  const handleCopyId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    showToast('Copied to Clipboard', `Transaction ${id} copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportStatement = () => {
    showToast('Report Generated', `Earnings statement (${timeframe.toUpperCase()}) downloaded as CSV & PDF.`);
  };

  const handleExecutePayout = () => {
    setIsProcessingPayout(true);
    setTimeout(() => {
      setIsProcessingPayout(false);
      setShowPayoutModal(false);
      showToast('Payout Initiated', `₹${payoutAmount} transferred to HDFC Bank A/C **4920 via IMPS.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl font-display pb-20">
      
      {/* ─── Hero Overview Banner ─── */}
      <div 
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl"
        style={{ 
          background: 'linear-gradient(135deg, #071a0b 0%, #0d2516 45%, #183d20 100%)', 
          border: '1px solid rgba(168,240,96,0.18)' 
        }}
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#a8f060]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-farmGreen-600/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold tracking-wide">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>DIRECT FARM REVENUE HUB</span>
            </div>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Sales, Earnings & Payout Analytics
            </h2>
            <p className="text-xs text-white/60 font-medium leading-relaxed">
              Real-time revenue monitoring with <strong>100% direct-to-farm bank settlement</strong> and <strong>0% middleman deduction</strong>.
            </p>
          </div>

          {/* Timeframe Pill Switcher & Payout CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Timeframe Pills */}
            <div className="flex items-center bg-white/[0.07] backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
              {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setSelectedDayFilter(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[#a8f060] text-[#071a0b] shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.07]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportStatement}
                className="w-10 h-10 rounded-2xl bg-white/[0.07] hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer shadow-md"
                title="Download Earnings Statement (CSV & PDF)"
              >
                <Download className="w-5 h-5 text-emerald-300" />
              </button>

              <button
                onClick={() => setShowPayoutModal(true)}
                className="px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/20"
                style={{ 
                  background: 'linear-gradient(135deg, #a8f060, #6fcf37)', 
                  color: '#071a0b',
                  boxShadow: '0 4px 18px rgba(168,240,96,0.35)'
                }}
              >
                <Wallet className="w-4 h-4" />
                <span>Instant Payout</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ─── 4 Dynamic Metric KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: `${timeframe.toUpperCase()} GROSS SALES`, value: `₹${currentDataset.gross.toLocaleString('en-IN')}`, sub: '+21.4% vs last period', subBadge: true, icon: TrendingUp, iconBg: 'bg-farmGreen-100/80', iconColor: 'text-farmGreen-700', border: 'border-farmGreen-200/30' },
          { label: '0% COMMISSION SAVED', value: `₹${commissionSaved.toLocaleString('en-IN')}`, sub: '100% revenue direct to bank', subPulse: true, icon: ShieldCheck, iconBg: 'bg-teal-100', iconColor: 'text-teal-700', border: 'border-teal-100', accent: 'from-teal-50/60' },
          { label: 'COMPLETED ORDERS', value: `${currentDataset.ordersCount}`, sub: '99.4% on-time fulfillment', icon: ShoppingBag, iconBg: 'bg-blue-100', iconColor: 'text-blue-700', border: 'border-blue-100' },
          { label: 'AVG BASKET (AOV)', value: `₹${currentDataset.avgBasket}`, sub: '~2.8 items per order', icon: Receipt, iconBg: 'bg-farmGold-100', iconColor: 'text-farmGold-700', border: 'border-amber-100' },
        ].map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.accent || 'from-white'} to-white p-5 rounded-3xl border-2 ${card.border} shadow-glass hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-3 group`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-farmMuted uppercase tracking-widest leading-tight max-w-[70%]">{card.label}</span>
              <div className={`p-2 ${card.iconBg} ${card.iconColor} rounded-xl group-hover:scale-110 transition-transform shadow-sm`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="font-black text-3xl text-farmGreen-950 leading-none tracking-tight font-mono tabular-nums">{card.value}</div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-farmMuted">
              {card.subBadge && <span className="px-2 py-0.5 rounded-full bg-farmGreen-100/80 text-emerald-900 font-black text-[10px]">{card.sub}</span>}
              {card.subPulse && <><span className="w-2 h-2 rounded-full bg-farmGreen-600 animate-pulse" /><span className="text-farmGreen-800 font-bold">{card.sub}</span></>}
              {!card.subBadge && !card.subPulse && <span>{card.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ─── SVG Area Chart & Category Mix ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Smooth SVG Area Chart (2 cols) */}
        <AreaChartPanel
          chartPoints={chartPoints}
          chartMetric={chartMetric}
          setChartMetric={setChartMetric}
          selectedDayFilter={selectedDayFilter}
          setSelectedDayFilter={setSelectedDayFilter}
          timeframe={timeframe}
          maxSales={maxSales}
          maxOrders={maxOrders}
        />

        {/* Right: Produce Sales Mix & Top Items (1 col) */}
        <div className="glass-surface p-6 sm:p-7 rounded-3xl border border-farmGreen-200/40 shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-farmSage-100/40">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-farmGreen-700" />
                <h3 className="font-extrabold text-base text-farmGreen-950">Produce Sales Mix</h3>
              </div>
              <span className="text-[11px] font-bold text-farmGreen-800 bg-farmGreen-50/60 px-2 py-0.5 rounded-full">
                4 Categories
              </span>
            </div>

            {/* Category Bars */}
            <div className="space-y-3.5">
              {categorySales.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-farmGreen-950">{cat.name}</span>
                    <span className="text-emerald-900 font-extrabold">₹{cat.amount.toLocaleString()} ({cat.percent}%)</span>
                  </div>
                  <div className="h-2.5 bg-farmSage-100/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${cat.barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Earning Harvest Produce */}
          <div className="pt-4 border-t border-farmSage-100/40 space-y-3">
            <div className="text-xs font-extrabold text-farmGreen-950 uppercase tracking-wider">
              Top Earning Produce
            </div>
            
            <div className="space-y-2.5">
              {topProduceItems.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/70 border border-farmSage-100/40 hover:bg-farmGreen-50/60/40 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={item.img} alt={item.name} className="w-9 h-9 rounded-xl object-cover border shrink-0" loading="lazy" />
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-farmGreen-950 truncate">{item.name}</div>
                      <div className="text-[10px] text-farmMuted font-bold">{item.sold}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-xs text-emerald-900">{item.revenue}</div>
                    <div className="text-[10px] text-farmGreen-600 font-bold">{item.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ─── Completed Transactions & Orders Ledger ─── */}
      <div className="glass-surface rounded-3xl border border-farmGreen-200/40 p-6 sm:p-7 shadow-sm space-y-5">
        
        {/* Ledger Header & Search/Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-farmSage-100/40">
          <div>
            <h3 className="font-extrabold text-lg text-farmGreen-950">Earnings & Payout Ledger</h3>
            <p className="text-xs text-farmMuted font-semibold">Direct customer payments settled instantly to your bank account</p>
          </div>

          {/* Search & Mode Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-farmSage-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order ID, buyer…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-white/50 border border-farmSage-200/50 focus:border-emerald-500 rounded-xl text-xs font-bold text-farmGreen-950 placeholder-farmSage-400  transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-farmSage-400 p-0.5">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Payment Filter Pill */}
            <div className="flex items-center gap-1 bg-farmSage-100/40 p-1 rounded-xl text-xs font-bold">
              {['all', 'upi', 'card', 'cod'].map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentFilter(m)}
                  className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-black transition-all cursor-pointer ${
                    paymentFilter === m ? 'bg-white text-farmGreen-950 shadow-sm' : 'text-farmMuted hover:text-farmGreen-950'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-1.5 bg-white/50 border border-farmSage-200/50 rounded-xl text-xs font-bold text-farmGreen-950  cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>

          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/40 backdrop-blur-sm/80 border-b border-farmGreen-100 text-farmMuted font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-2xl">Order ID</th>
                <th className="p-3.5">Customer & Harvest Items</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Gross Total</th>
                <th className="p-3.5">Net Payout (100%)</th>
                <th className="p-3.5 text-right rounded-r-2xl">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((ord) => (
                <tr key={ord.id} className="hover:bg-farmGreen-50/60/30 transition-colors group">
                  
                  {/* Order ID with Copy */}
                  <td className="p-3.5 font-black text-farmGreen-950">
                    <button
                      onClick={() => handleCopyId(ord.id)}
                      className="flex items-center gap-1.5 hover:text-farmGreen-700 cursor-pointer"
                      title="Copy ID"
                    >
                      <span>{ord.id}</span>
                      {copiedId === ord.id ? (
                        <Check className="w-3 h-3 text-farmGreen-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-300 group-hover:text-farmGreen-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </td>

                  {/* Customer & Produce */}
                  <td className="p-3.5">
                    <div className="font-extrabold text-farmGreen-950">{ord.customerName}</div>
                    <div className="text-[11px] text-farmMuted truncate max-w-xs font-semibold">{ord.items}</div>
                  </td>

                  {/* Date */}
                  <td className="p-3.5 text-farmMuted font-semibold">
                    {ord.date}
                  </td>

                  {/* Payment */}
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 bg-farmGreen-50/60 border border-farmGreen-200/30 text-farmGreen-800 rounded-full font-bold text-[11px]">
                      {ord.paymentMethod || 'UPI (Paid)'}
                    </span>
                  </td>

                  {/* Gross Total */}
                  <td className="p-3.5 font-extrabold text-farmGreen-950">
                    ₹{ord.total}
                  </td>

                  {/* Net Payout */}
                  <td className="p-3.5">
                    <div className="font-black text-farmGreen-800 text-sm">₹{ord.netFarmerShare}</div>
                    <div className="text-[10px] text-farmGreen-600 font-bold">0% fee deducted</div>
                  </td>

                  {/* Action Inspect Button */}
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedTransaction(ord)}
                      className="px-3 py-1.5 bg-white/40 backdrop-blur-sm hover:bg-farmGreen-100/80 border border-emerald-200 text-emerald-950 rounded-xl font-bold text-xs transition-all cursor-pointer active:scale-95"
                    >
                      Inspect
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ─── Instant Payout Modal / Drawer ─── */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="glass-surface rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-farmGreen-200/30 space-y-6 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-farmSage-100/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-farmGreen-600/15 text-farmGreen-800 rounded-2xl border border-emerald-200">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-farmGreen-950">Instant Payout Request</h3>
                  <p className="text-xs text-farmMuted font-semibold">Immediate IMPS bank transfer</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPayoutModal(false)}
                className="p-1.5 text-farmSage-400 hover:text-gray-600 rounded-full hover:bg-farmSage-100/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Available Balance Box */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-farmBg rounded-2xl border border-emerald-200/80 space-y-1">
              <div className="text-xs font-bold text-farmGreen-800">Ready for Instant Withdrawal</div>
              <div className="font-black text-3xl text-farmGreen-950">{currencySymbol}12,450.00</div>
              <div className="text-[11px] text-farmGreen-700 font-bold">100% Cleared Harvest Earnings</div>
            </div>

            {/* Destination Bank / Account */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-farmGreen-950 block">Destination Bank Account:</label>
              <div className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-farmGreen-50/60/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-farmGreen-700" />
                  <div>
                    <div className="font-extrabold text-xs text-farmGreen-950">HDFC Bank · A/C **4920</div>
                    <div className="text-[10px] text-farmMuted font-bold">IFSC: HDFC0001492 · Rajesh Kumar</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-farmGreen-600" />
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-farmGreen-950 block">Withdrawal Amount ({currencySymbol}):</label>
              <div className="grid grid-cols-4 gap-2">
                {['2000', '5000', '10000', '12450'].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setPayoutAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      payoutAmount === amt
                        ? 'bg-farmGreen-900 text-white border-farmGreen-900 shadow-sm'
                        : 'bg-white/50 border-farmSage-200/50 text-farmGreen-950 hover:bg-farmSage-100/40'
                    }`}
                  >
                    {amt === '12450' ? `All (${currencySymbol}12k)` : `${currencySymbol}${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer CTA */}
            <button
              onClick={handleExecutePayout}
              disabled={isProcessingPayout}
              className="w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
              style={{ 
                background: 'linear-gradient(135deg, #a8f060, #6fcf37)', 
                color: '#071a0b',
                boxShadow: '0 4px 18px rgba(168,240,96,0.35)'
              }}
            >
              {isProcessingPayout ? (
                <span>Initiating IMPS Transfer…</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Transfer {currencySymbol}{payoutAmount} to Bank</span>
                </>
              )}
            </button>

          </div>
        </div>
      )}

      {/* ─── Transaction Detail Breakdown Modal ─── */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-surface rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_24px_64px_rgba(7,26,11,0.16)] border border-emerald-500/10 space-y-6 relative overflow-hidden animate-scaleUp">
            
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-farmGreen-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-farmSage-100/40 pb-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/60 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(16,185,129,0.08)]">
                  <Receipt className="w-6 h-6 text-farmGreen-700 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg text-farmGreen-950">Payout Settlement</h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-farmGreen-500/10 text-farmGreen-700 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-farmGreen-600 animate-pulse" />
                      <span>Settled</span>
                    </span>
                  </div>
                  <p className="text-xs text-farmMuted font-bold mt-0.5">
                    Order <strong className="text-farmGreen-950">{selectedTransaction.id}</strong> • {selectedTransaction.date || 'Today, 10:30 AM'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="w-8 h-8 rounded-full bg-white/50 hover:bg-farmSage-100/40 text-farmMuted flex items-center justify-center transition-all cursor-pointer shrink-0 border border-farmSage-100/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer & Order Details Card */}
            <div className="p-5 bg-gradient-to-r from-gray-50 to-emerald-50/20 rounded-2xl border border-farmGreen-200/30/50 space-y-3.5 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Customer Profile</span>
                <span className="font-extrabold text-xs text-farmGreen-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-[10px] font-black flex items-center justify-center border border-white shadow-sm">
                    {selectedTransaction.customerName?.charAt(0) || 'C'}
                  </span>
                  {selectedTransaction.customerName}
                </span>
              </div>
              
              <div className="flex items-start justify-between gap-3 pt-3.5 border-t border-farmGreen-200/30/60">
                <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider shrink-0 mt-0.5">Items Delivered</span>
                <span className="font-bold text-xs text-farmGreen-950 text-right leading-relaxed max-w-[240px]">
                  {selectedTransaction.items}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-farmGreen-200/30/60">
                <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Payment Method</span>
                <span className="px-2.5 py-1 rounded-full bg-farmGreen-500/10 text-farmGreen-800 text-[11px] font-black border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-farmGreen-600" />
                  <span>{selectedTransaction.paymentMethod || 'UPI Paid'}</span>
                </span>
              </div>
            </div>

            {/* Financial Ledger Calculation */}
            <div className="p-5 bg-gradient-to-b from-emerald-50/40 to-teal-50/40 rounded-2xl border border-emerald-500/15 space-y-3 text-xs font-bold relative z-10">
              <div className="flex justify-between items-center text-farmMuted">
                <span>Customer Order Total</span>
                <span className="font-black text-farmGreen-950 font-mono text-sm">{currencySymbol}{selectedTransaction.total}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-850">
                <span>Platform Commission Rate</span>
                <span className="font-extrabold bg-farmGreen-600/15 text-farmGreen-800 border border-emerald-500/25 px-2 py-0.5 rounded-full text-[10px]">0.00% (FREE)</span>
              </div>
              <div className="flex justify-between items-center text-emerald-850">
                <span>Payment Gateway Processing</span>
                <span className="font-extrabold bg-farmGreen-500/10 text-emerald-850 border border-emerald-500/10 px-2.5 py-0.5 rounded-full text-[10px]">{currencySymbol}0.00 (Platform Covered)</span>
              </div>
              
              <div className="pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-farmGreen-950 block">Net Farmer Direct Credit</span>
                  <span className="text-[10px] text-farmGreen-700 font-bold tracking-wide">Transferred to HDFC Bank A/C **4920</span>
                </div>
                <div className="text-right">
                  <span className="text-farmGreen-800 text-3xl font-mono font-black tracking-tight">
                    {currencySymbol}{selectedTransaction.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button
                onClick={() => {
                  handleCopyId(selectedTransaction.id);
                }}
                className="py-3 px-4 bg-white/50 hover:bg-farmSage-100/40 text-gray-800 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-97 border border-farmSage-200/50/50 cursor-pointer shadow-2xs"
              >
                <Copy className="w-4 h-4 text-gray-600 shrink-0" />
                <span>Copy Receipt ID</span>
              </button>

              <button
                onClick={() => {
                  showToast('PDF Downloaded 📄', `Tax invoice for ${selectedTransaction.id} saved.`);
                  setSelectedTransaction(null);
                }}
                className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-97 shadow-[0_4px_14px_rgba(16,185,129,0.25)] border border-emerald-500/25 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Download Invoice</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerSales;

