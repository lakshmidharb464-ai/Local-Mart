import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export const OrderManagement = ({ orders, setOrders }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusOptions = ['All', 'Pending', 'Accepted', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.items && o.items.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatusTab === 'All' || o.status === selectedStatusTab;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const activeDispatchOrders = orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Accepted').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenueGMV = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast('Order Status Updated', `Order ${orderId} changed to ${newStatus}.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-display">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-extrabold text-2xl text-farmGreen-950 tracking-tight">Order Fulfillment & Logistics</h2>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 shadow-2xs font-mono">
              {totalOrders} Live Orders
            </span>
          </div>
          <p className="text-xs text-farmMuted mt-1">Monitor farm-to-doorstep orders, update dispatch states, and track fulfillment metrics</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700" />
          <input
            type="text"
            placeholder="Search Order ID, customer, farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-farmBg border border-emerald-200/80 rounded-2xl text-xs font-semibold focus:outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setSelectedStatusTab('All')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedStatusTab === 'All'
              ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-farmGreen-950 mt-2">{totalOrders}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">All Orders Placed →</div>
        </div>

        <div 
          onClick={() => setSelectedStatusTab('Pending')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedStatusTab === 'Pending'
              ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-amber-500 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Pending Orders</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-amber-950 mt-2">{pendingOrders}</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">Awaiting farm acceptance ⏳</div>
        </div>

        <div 
          onClick={() => setSelectedStatusTab('Out for Delivery')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedStatusTab === 'Out for Delivery' || selectedStatusTab === 'Accepted'
              ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Active Dispatches</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-blue-950 mt-2">{activeDispatchOrders}</div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">En route to customers 🚚</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Total Sales GMV</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-purple-950 mt-2">₹{totalRevenueGMV.toLocaleString()}</div>
          <div className="text-[11px] text-purple-700 font-bold mt-1">Processed Order Revenue</div>
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
                  ? 'bg-[#0F2818] text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40 scale-[1.02]'
                  : 'bg-white text-[#0A2214] font-black border-2 border-emerald-200/90 hover:bg-emerald-100/70 hover:text-emerald-950 shadow-2xs'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-emerald-100/80 overflow-hidden shadow-farm-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-farmBg/80 border-b border-emerald-100 text-farmMuted font-black uppercase tracking-wider">
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
            <tbody className="divide-y divide-gray-100 font-semibold">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-emerald-50/50 transition-colors group">
                  
                  {/* Order ID */}
                  <td className="p-4 pl-6">
                    <div className="font-extrabold text-sm text-farmGreen-950 flex items-center gap-1.5">
                      <span className="hover:underline cursor-pointer" onClick={() => setSelectedOrder(ord)}>{ord.id}</span>
                    </div>
                    <div className="text-[11px] text-farmMuted font-medium mt-0.5">{ord.date}</div>
                  </td>

                  {/* Customer */}
                  <td className="p-4">
                    <div className="font-extrabold text-farmGreen-950 text-sm">{ord.customerName}</div>
                    <div className="text-[11px] text-farmMuted font-medium">{ord.customerEmail}</div>
                  </td>

                  {/* Producer Farmer */}
                  <td className="p-4">
                    <div className="font-bold text-farmGreen-950 flex items-center gap-1">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{ord.farmerName}</span>
                    </div>
                  </td>

                  {/* Items Summary */}
                  <td className="p-4 text-farmMuted font-medium max-w-xs truncate">{ord.items}</td>

                  {/* Amount */}
                  <td className="p-4 font-extrabold text-emerald-800 text-sm">₹{ord.total}</td>

                  {/* Fulfillment Status Select */}
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-2xl font-black text-xs outline-none border transition-all cursor-pointer shadow-2xs ${
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                        ord.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-950 border-blue-300' :
                        ord.status === 'Accepted' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                        ord.status === 'Cancelled' ? 'bg-red-100 text-red-950 border-red-300' :
                        'bg-gray-100 text-gray-900 border-gray-300'
                      }`}
                    >
                      {statusOptions.filter(s => s !== 'All').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-[11px] font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Manifest</span>
                    </button>
                  </td>

                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-xs text-farmMuted bg-farmBg/30 space-y-2">
                    <Package className="w-8 h-8 text-gray-400 mx-auto" />
                    <div className="font-bold text-farmGreen-950 text-sm">No Orders Found Matching Criteria</div>
                    <p className="text-[11px]">Try clearing search query or switching status filter tabs.</p>
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
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
            
            {/* Hero Header Banner */}
            <div className="bg-[#0F2818] bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] text-white p-6 sm:p-7 relative border-b border-emerald-700/50">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="absolute top-5 right-5 p-2 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-white/10 shrink-0">
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
                <div className="p-3.5 bg-farmBg rounded-2xl border border-emerald-100/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buyer Customer</span>
                  </div>
                  <div className="font-extrabold text-farmGreen-950 text-sm">{selectedOrder.customerName}</div>
                  <div className="text-[11px] text-farmMuted font-bold truncate">{selectedOrder.customerEmail}</div>
                </div>

                <div className="p-3.5 bg-farmBg rounded-2xl border border-emerald-100/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Agricultural Producer</span>
                  </div>
                  <div className="font-extrabold text-farmGreen-950 text-sm">{selectedOrder.farmerName}</div>
                  <div className="text-[11px] text-emerald-800 font-extrabold">Verified Local Farmer</div>
                </div>
              </div>

              {/* Items Breakdown List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between font-extrabold text-farmGreen-950">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <span>Purchased Produce Items</span>
                  </div>
                </div>

                <div className="p-3.5 bg-farmBg rounded-2xl border border-emerald-100/80 space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.items ? (
                    selectedOrder.items.split(',').map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200/60 shadow-2xs">
                        <span className="font-extrabold text-farmGreen-950">{item.trim()}</span>
                        <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">Fresh Picked</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-farmMuted italic">No items listed</div>
                  )}
                </div>
              </div>

              {/* Total Payment Row */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-farmGreen-950 block">Total Order Payment</span>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Farm Price Clear</span>
                  </span>
                </div>
                <div className="font-extrabold text-3xl text-farmGreen-950">
                  ₹{selectedOrder.total}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-3 bg-gradient-to-r from-farmGreen-800 to-emerald-900 hover:from-farmGreen-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
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
