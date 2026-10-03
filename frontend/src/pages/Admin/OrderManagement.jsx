import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  ShoppingCart, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  X, 
  Receipt, 
  User, 
  Mail, 
  Sprout, 
  ShoppingBag, 
  ShieldCheck, 
  Calendar,
  CheckCircle,
  Package,
  TrendingUp,
  MapPin,
  ArrowRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const OrderManagement = ({ orders, setOrders, isDark = false }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const statusOptions = ['All', 'Pending', 'Accepted', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            o.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (o.items && o.items.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = selectedStatusTab === 'All' || o.status === selectedStatusTab;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatusTab]);

  const { totalOrders, pendingOrders, activeDispatchOrders, deliveredOrders, totalRevenueGMV } = useMemo(() => {
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'Pending').length,
      activeDispatchOrders: orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Accepted').length,
      deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
      totalRevenueGMV: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    };
  }, [orders]);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast('Order Status Updated', `Order ${orderId} changed to ${newStatus}.`);
  };

  return (
    <div className="space-y-6 font-display pb-8">
      {/* Header Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark 
          ? 'adm-glass border-[rgba(0,255,133,0.08)]' 
          : 'bg-white border-emerald-100/80 shadow-farm-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`font-extrabold text-2xl tracking-tight ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
              Order Fulfillment & Logistics
            </h2>
            <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-2xs font-mono ${
              isDark 
                ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border-[rgba(0,255,133,0.25)]' 
                : 'bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}>
              {totalOrders} Live Orders
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
            Monitor farm-to-doorstep orders, update dispatch states, and track fulfillment metrics
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} />
          <input
            type="text"
            placeholder="Search Order ID, customer, farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none transition-all ${
              isDark 
                ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.12)] text-[#D4EAD9] placeholder-[#7FA882]/50 focus:border-[#00FF85]' 
                : 'bg-farmBg border border-emerald-200/80 rounded-2xl text-[#0A2214] placeholder-gray-400 focus:border-farmGreen-600 focus:bg-white'
            }`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 ${isDark ? 'text-[#7FA882] hover:text-[#D4EAD9]' : 'text-gray-400 hover:text-gray-600'}`}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div 
          onClick={() => setSelectedStatusTab('All')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedStatusTab === 'All'
              ? isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.4)] adm-neon-glow-sm scale-[1.01]' 
                : 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
              : isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.08)] hover:border-[rgba(0,255,133,0.2)]' 
                : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Total Orders
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
            {totalOrders}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`}>
            All Orders Placed →
          </div>
        </div>

        {/* Pending Orders */}
        <div 
          onClick={() => setSelectedStatusTab('Pending')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedStatusTab === 'Pending'
              ? isDark 
                ? 'adm-glass border-[rgba(251,184,58,0.4)] shadow-[0_0_15px_rgba(251,184,58,0.2)] scale-[1.01]' 
                : 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-400/20'
              : isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.08)] hover:border-[rgba(251,184,58,0.25)]' 
                : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Pending Orders
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(251,184,58,0.1)] text-[#FBB83A]' : 'bg-amber-100 text-amber-800'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#FBB83A]' : 'text-amber-950'}`}>
            {pendingOrders}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#FBB83A]' : 'text-amber-700'}`}>
            Awaiting farm acceptance ⏳
          </div>
        </div>

        {/* Active Dispatches */}
        <div 
          onClick={() => setSelectedStatusTab('Out for Delivery')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedStatusTab === 'Out for Delivery' || selectedStatusTab === 'Accepted'
              ? isDark 
                ? 'adm-glass border-[rgba(0,191,255,0.4)] shadow-[0_0_15px_rgba(0,191,255,0.2)] scale-[1.01]' 
                : 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-400/20'
              : isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.08)] hover:border-[rgba(0,191,255,0.25)]' 
                : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Active Dispatches
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(0,191,255,0.1)] text-[#5CD9FF]' : 'bg-blue-100 text-blue-800'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#5CD9FF]' : 'text-blue-950'}`}>
            {activeDispatchOrders}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#5CD9FF]' : 'text-blue-700'}`}>
            En route to customers 🚚
          </div>
        </div>

        {/* Total GMV */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${
          isDark 
            ? 'adm-glass border-[rgba(0,255,133,0.08)]' 
            : 'bg-white border-emerald-100/80 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Total Sales GMV
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(212,167,69,0.1)] text-[#D4A745]' : 'bg-purple-100 text-purple-800'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'adm-gold-text' : 'text-purple-950'}`}>
            ₹{totalRevenueGMV.toLocaleString()}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#D4A745]' : 'text-purple-700'}`}>
            Processed Order Revenue
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
        {statusOptions.map((st) => {
          const count = st === 'All' ? orders.length : orders.filter(o => o.status === st).length;
          const isActive = selectedStatusTab === st;
          return (
            <button
              key={st}
              onClick={() => setSelectedStatusTab(st)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 whitespace-nowrap cursor-pointer min-w-[80px] text-center ${
                isActive
                  ? isDark
                    ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.4)] shadow-[0_0_12px_rgba(0,255,133,0.2)] scale-[1.02]'
                    : 'bg-emerald-700 text-white shadow-md border border-emerald-800 scale-[1.02]'
                  : isDark
                    ? 'text-[#7FA882] border border-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.06)] hover:text-[#D4EAD9]'
                    : 'bg-white text-farmGreen-950 font-bold border border-emerald-200/80 hover:bg-emerald-50 hover:text-emerald-900 shadow-2xs'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        isDark 
          ? 'adm-glass border-[rgba(0,255,133,0.08)]' 
          : 'bg-white border-emerald-100/80 shadow-farm-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b font-black uppercase tracking-wider ${
              isDark 
                ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.08)] text-[#7FA882]' 
                : 'bg-farmBg/80 border-emerald-100 text-farmMuted'
            }`}>
              <tr>
                <th className="p-4 pl-6">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Producer Farmer</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-semibold ${
              isDark ? 'divide-[rgba(0,255,133,0.04)]' : 'divide-gray-100'
            }`}>
              {filteredOrders.map((ord) => (
                <tr 
                  key={ord.id} 
                  className={`transition-colors group ${
                    isDark ? 'adm-row hover:bg-[rgba(0,255,133,0.025)]' : 'hover:bg-emerald-50/50'
                  }`}
                >
                  
                  {/* Order ID */}
                  <td className="p-4 pl-6">
                    <div className={`font-extrabold text-sm flex items-center gap-1.5 ${
                      isDark ? 'text-[#00FF85]' : 'text-farmGreen-950'
                    }`}>
                      <span className="hover:underline cursor-pointer" onClick={() => setSelectedOrder(ord)}>{ord.id}</span>
                    </div>
                    <div className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{ord.date}</div>
                  </td>

                  {/* Customer */}
                  <td className="p-4">
                    <div className={`font-extrabold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{ord.customerName}</div>
                    <div className={`text-[11px] font-medium ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{ord.customerEmail}</div>
                  </td>

                  {/* Producer Farmer */}
                  <td className="p-4">
                    <div className={`font-bold flex items-center gap-1 ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                      <Sprout className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#00FF85]' : 'text-emerald-600'}`} />
                      <span>{ord.farmerName}</span>
                    </div>
                  </td>

                  {/* Items Summary */}
                  <td className={`p-4 font-medium max-w-xs truncate ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{ord.items}</td>

                  {/* Amount */}
                  <td className={`p-4 font-extrabold text-sm ${isDark ? 'adm-gold-text' : 'text-emerald-800'}`}>₹{ord.total}</td>

                  {/* Fulfillment Status Select */}
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-2xl font-black text-xs outline-none border transition-all cursor-pointer shadow-2xs ${
                        isDark 
                          ? ord.status === 'Delivered' ? 'bg-[rgba(0,255,133,0.12)] text-[#00FF85] border-[rgba(0,255,133,0.3)]' :
                            ord.status === 'Out for Delivery' ? 'bg-[rgba(0,191,255,0.12)] text-[#5CD9FF] border-[rgba(0,191,255,0.3)]' :
                            ord.status === 'Accepted' ? 'bg-[rgba(251,184,58,0.12)] text-[#FBB83A] border-[rgba(251,184,58,0.3)]' :
                            ord.status === 'Cancelled' ? 'bg-[rgba(255,77,77,0.12)] text-[#FF6B6B] border-[rgba(255,77,77,0.3)]' :
                            'bg-[rgba(255,255,255,0.05)] text-[#D4EAD9] border-[rgba(255,255,255,0.1)]'
                          : ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                            ord.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-950 border-blue-300' :
                            ord.status === 'Accepted' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                            ord.status === 'Cancelled' ? 'bg-red-100 text-red-950 border-red-300' :
                            'bg-gray-100 text-gray-900 border-gray-300'
                      }`}
                    >
                      {statusOptions.filter(s => s !== 'All').map(s => (
                        <option key={s} value={s} className={isDark ? 'bg-[#0A120D] text-[#D4EAD9]' : 'bg-white text-gray-900'}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        isDark 
                          ? 'bg-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.16)] text-[#00FF85] border border-[rgba(0,255,133,0.2)]' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manifest</span>
                    </button>
                  </td>

                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className={`p-12 text-center text-xs space-y-3 ${
                    isDark ? 'bg-[rgba(255,255,255,0.01)] text-[#7FA882]' : 'bg-farmBg/30 text-farmMuted'
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border ${
                      isDark ? 'bg-[rgba(0,255,133,0.05)] border-[rgba(0,255,133,0.15)] text-[#00FF85]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      <Package className="w-6 h-6 opacity-80" />
                    </div>
                    <div className={`font-bold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                      No Orders Found Matching Criteria
                    </div>
                    <p className="text-[11px] max-w-sm mx-auto">Try clearing your search query or switching status filter tabs.</p>
                    {(searchQuery || selectedStatusTab !== 'All') && (
                      <button
                        onClick={() => { setSearchQuery(''); setSelectedStatusTab('All'); }}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                          isDark 
                            ? 'bg-[rgba(0,255,133,0.12)] text-[#00FF85] border border-[rgba(0,255,133,0.3)] hover:bg-[rgba(0,255,133,0.2)]' 
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Filters & Search</span>
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Manifest Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className={`rounded-3xl max-w-lg w-full shadow-2xl border overflow-hidden relative animate-scaleUp ${
            isDark 
              ? 'bg-[#0A120D] border-[rgba(0,255,133,0.15)] text-[#D4EAD9]' 
              : 'bg-white border-emerald-100/80 text-farmGreen-950'
          }`}>
            
            {/* Hero Header Banner */}
            <div className={`p-6 sm:p-7 relative border-b ${
              isDark 
                ? 'bg-gradient-to-r from-[#040805] via-[#0A160F] to-[#081F12] border-[rgba(0,255,133,0.15)] text-white' 
                : 'bg-gradient-to-r from-farmGreen-900 via-emerald-800 to-farmGreen-950 border-emerald-700/50 text-white'
            }`}>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="absolute top-5 right-5 p-2 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-2xl border shrink-0 ${
                  isDark ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border-[rgba(0,255,133,0.3)]' : 'bg-emerald-500/20 text-emerald-300 border-white/10'
                }`}>
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xl text-white tracking-tight">Order Manifest</h3>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-200/90 mt-1 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{selectedOrder.date}</span>
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-emerald-200">Fulfillment State:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  selectedOrder.status === 'Delivered' ? 'bg-emerald-400 text-emerald-950' :
                  selectedOrder.status === 'Out for Delivery' ? 'bg-blue-400 text-blue-950' :
                  selectedOrder.status === 'Accepted' ? 'bg-amber-400 text-amber-950' :
                  'bg-gray-700 text-white'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5">
              
              {/* Customer & Producer Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3.5 rounded-2xl border space-y-1 ${
                  isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-farmBg border-emerald-100/80'
                }`}>
                  <div className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-[#00FF85]' : 'text-emerald-800'
                  }`}>
                    <User className="w-3.5 h-3.5" />
                    <span>Buyer Customer</span>
                  </div>
                  <div className={`font-extrabold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{selectedOrder.customerName}</div>
                  <div className={`text-[11px] font-bold truncate ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{selectedOrder.customerEmail}</div>
                </div>

                <div className={`p-3.5 rounded-2xl border space-y-1 ${
                  isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-farmBg border-emerald-100/80'
                }`}>
                  <div className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-[#00FF85]' : 'text-emerald-800'
                  }`}>
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Agricultural Producer</span>
                  </div>
                  <div className={`font-extrabold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{selectedOrder.farmerName}</div>
                  <div className={`text-[11px] font-extrabold ${isDark ? 'text-[#00FF85]' : 'text-emerald-800'}`}>Verified Local Farmer</div>
                </div>
              </div>

              {/* Items Breakdown List */}
              <div className="space-y-2 text-xs">
                <div className={`flex items-center justify-between font-extrabold ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className={`w-4 h-4 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} />
                    <span>Purchased Produce Items</span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border space-y-2 max-h-40 overflow-y-auto ${
                  isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-farmBg border-emerald-100/80'
                }`}>
                  {selectedOrder.items ? (
                    selectedOrder.items.split(',').map((item, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl border shadow-2xs ${
                        isDark 
                          ? 'bg-[rgba(255,255,255,0.04)] border-[rgba(0,255,133,0.1)]' 
                          : 'bg-white border-emerald-200/60'
                      }`}>
                        <span className={`font-extrabold ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{item.trim()}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-900'
                        }`}>Fresh Picked</span>
                      </div>
                    ))
                  ) : (
                    <div className={`text-xs italic ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>No items listed</div>
                  )}
                </div>
              </div>

              {/* Total Payment Row */}
              <div className={`pt-3 border-t flex items-center justify-between ${
                isDark ? 'border-[rgba(0,255,133,0.08)]' : 'border-gray-100'
              }`}>
                <div>
                  <span className={`font-extrabold text-sm block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Total Order Payment</span>
                  <span className={`text-[11px] font-bold flex items-center gap-1 mt-0.5 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Direct Farm Price Clear</span>
                  </span>
                </div>
                <div className={`font-extrabold text-3xl ${isDark ? 'adm-gold-text' : 'text-farmGreen-950'}`}>
                  ₹{selectedOrder.total}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className={`w-full py-3 font-extrabold text-xs rounded-2xl transition-all active:scale-95 cursor-pointer ${
                    isDark 
                      ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                      : 'bg-gradient-to-r from-farmGreen-800 to-emerald-900 hover:from-farmGreen-700 hover:to-emerald-800 text-white shadow-lg'
                  }`}
                >
                  Close Manifest
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
