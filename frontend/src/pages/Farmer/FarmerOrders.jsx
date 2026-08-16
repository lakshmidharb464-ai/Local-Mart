import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  X, 
  Receipt, 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  ShoppingBag,
  Box,
  Check,
  Phone,
  Navigation,
  LayoutGrid,
  Table as TableIcon,
  Kanban,
  MapPin,
  Sparkles,
  Printer,
  ChevronRight,
  PackageCheck,
  Building2,
  ArrowUpRight
} from 'lucide-react';

export const FarmerOrders = ({ orders = [], setOrders }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'table' | 'grid' | 'timeline' | 'kanban' | 'map'

  const statusOptions = ['All', 'Pending', 'Accepted', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.items && o.items.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatusTab === 'All' || o.status === selectedStatusTab;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (showToast) showToast('Order Status Updated 📦', `Order ${orderId} status set to ${newStatus}.`);
  };

  const handleAcceptOrder = (orderId) => {
    handleUpdateStatus(orderId, 'Accepted');
  };

  const handleRejectOrder = (orderId) => {
    handleUpdateStatus(orderId, 'Cancelled');
  };

  // Metrics
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const acceptedCount = orders.filter(o => o.status === 'Accepted').length;
  const outCount = orders.filter(o => o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenueSum = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-display">
      
      {/* Glassmorphism Header Banner */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-lg">
              <Box className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Produce Packing & Dispatch Pipeline</span>
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                Incoming Customer Orders
              </h1>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                Pack fresh crops from field crates, attach tax invoices & dispatch via local EV riders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-right">
              <span className="text-[10px] text-emerald-300 font-bold uppercase block">Pipeline Value</span>
              <span className="text-lg font-black text-white font-mono">₹{totalRevenueSum.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Status Tabs, Search & 6 View Switcher Pills */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        
        {/* Tier 1: Full-Width Status Filter Tabs */}
        <div className="border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {statusOptions.map((st) => {
              const count = st === 'All' ? orders.length : orders.filter(o => o.status === st).length;
              const isActive = selectedStatusTab === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatusTab(st)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-farmGreen-800 to-farmGreen-950 text-white shadow-sm ring-1 ring-emerald-500/30'
                      : 'text-farmMuted hover:text-farmGreen-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <span>{st}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 2: Search Input (Left) & 6 View Mode Switcher Pills (Right) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-xs lg:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
            <input
              type="text"
              placeholder="Search Order ID, Customer name or produce items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-farmGreen-500 rounded-xl text-xs font-bold text-farmGreen-950 placeholder-gray-400 outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 6 View Mode Switcher Pills */}
          <div className="flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl shrink-0 border border-gray-200/60 overflow-x-auto scrollbar-none">
            {[
              { id: 'card', label: 'Cards', icon: LayoutGrid },
              { id: 'table', label: 'Table', icon: TableIcon },
              { id: 'grid', label: 'Grid', icon: Box },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'kanban', label: 'Kanban', icon: Kanban },
              { id: 'map', label: 'Dispatch Map', icon: MapPin }
            ].map(vm => {
              const IconComp = vm.icon;
              const isVmSelected = viewMode === vm.id;
              return (
                <button
                  key={vm.id}
                  onClick={() => setViewMode(vm.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
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

        </div>

      </div>

      {/* VIEW 1: CARDS VIEW */}
      {viewMode === 'card' && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
              <Box className="w-12 h-12 text-emerald-600 mx-auto opacity-50" />
              <h3 className="font-extrabold text-base text-farmGreen-950">No matching orders found</h3>
              <p className="text-xs text-farmMuted max-w-sm mx-auto">
                Try selecting a different status tab or clearing your search term.
              </p>
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const isPending = ord.status === 'Pending';
              const isAccepted = ord.status === 'Accepted';

              return (
                <div 
                  key={ord.id}
                  className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-base text-farmGreen-950 font-mono">{ord.id}</span>
                      <span className="text-xs text-farmMuted font-medium">• {ord.date}</span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900' :
                        ord.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-900 animate-pulse' :
                        ord.status === 'Accepted' ? 'bg-amber-100 text-amber-900' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        ● {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-lg text-emerald-800 font-mono">₹{ord.total}</span>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-extrabold cursor-pointer border border-emerald-200/80 transition-all"
                      >
                        View Manifest 📄
                      </button>
                    </div>
                  </div>

                  {/* Customer & Items Snippet */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-[10px] font-extrabold text-farmMuted uppercase">Customer & Delivery Location</div>
                      <div className="font-extrabold text-farmGreen-950">{ord.customerName} ({ord.customerEmail})</div>
                      <div className="text-farmMuted text-[11px] font-bold flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ord.address || 'Kothrud, Pune'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-extrabold text-farmMuted uppercase">Produce Items To Pack</div>
                      <div className="font-bold text-farmGreen-950 bg-gray-50/80 p-2.5 rounded-xl border border-gray-200/80">
                        {ord.items}
                      </div>
                    </div>
                  </div>

                  {/* Producer Direct Actions & Packing Workflow */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    
                    {/* Rider Assignment Snippet */}
                    <div className="flex items-center gap-2 text-xs text-farmMuted font-bold">
                      <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Assigned Partner: <strong className="text-farmGreen-950 font-black">Rohan Sharma (EV Scooter)</strong></span>
                    </div>

                    {/* Packing Action Triggers */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleAcceptOrder(ord.id)}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-extrabold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
                          >
                            Accept & Pack 📦
                          </button>
                          <button
                            onClick={() => handleRejectOrder(ord.id)}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Out for Delivery')}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black text-xs shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Hand Over to Delivery Rider 🚚</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-farmMuted tracking-wider">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Produce Items</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-4">
                      <div className="font-black text-xs text-farmGreen-950 font-mono">{ord.id}</div>
                      <div className="text-[10px] text-farmMuted">{ord.date}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-xs text-farmGreen-950">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-500">{ord.address || 'Kothrud, Pune'}</div>
                    </td>
                    <td className="p-4 font-bold text-farmGreen-900 max-w-xs truncate">
                      {ord.items}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900' :
                        ord.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-900' :
                        ord.status === 'Accepted' ? 'bg-amber-100 text-amber-900' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 font-black text-sm text-emerald-800 font-mono">
                      ₹{ord.total}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-extrabold cursor-pointer border border-emerald-200"
                      >
                        Manifest 📄
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {filteredOrders.map(ord => (
            <div key={ord.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-farmGreen-950 font-mono">{ord.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900">
                    {ord.status}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-farmGreen-900">{ord.customerName}</div>
                <div className="text-[11px] font-semibold text-gray-600 bg-gray-50 p-2 rounded-xl">
                  {ord.items}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="font-black text-base text-emerald-800 font-mono">₹{ord.total}</span>
                <button
                  onClick={() => setSelectedOrder(ord)}
                  className="px-3 py-1 bg-emerald-800 text-white text-xs font-extrabold rounded-xl cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 4: TIMELINE DISPATCH VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 animate-fadeIn">
          <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Order Dispatch Timeline Pipeline</span>
          </h3>

          <div className="space-y-4 relative before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
            {filteredOrders.map((ord, idx) => (
              <div key={ord.id} className="relative pl-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 hover:bg-emerald-50/40 rounded-2xl transition-all">
                <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-farmGreen-950 font-mono">{ord.id}</span>
                    <span className="text-[10px] text-gray-500 font-bold">• {ord.date}</span>
                  </div>
                  <div className="text-xs font-bold text-farmGreen-900 mt-0.5">{ord.customerName} — {ord.items}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900">
                    {ord.status}
                  </span>
                  <button onClick={() => setSelectedOrder(ord)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold cursor-pointer">
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
          {['Pending', 'Accepted', 'Out for Delivery', 'Delivered'].map(statusCol => {
            const colOrders = filteredOrders.filter(o => o.status === statusCol);
            return (
              <div key={statusCol} className="bg-gray-50/80 p-4 rounded-3xl border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-black text-xs text-farmGreen-950 uppercase">{statusCol}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-emerald-900 text-[10px] font-black border border-gray-200">
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colOrders.map(ord => (
                    <div key={ord.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-farmGreen-950 font-mono">{ord.id}</span>
                        <span className="font-black text-xs text-emerald-800">₹{ord.total}</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-700">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-500 truncate">{ord.items}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 6: DISPATCH MAP ROUTE */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Live Delivery Dispatch Route Map</span>
            </h3>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pune Hub Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {filteredOrders.map(ord => (
              <div key={ord.id} className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-farmGreen-950 font-mono">{ord.id}</span>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    📍 {ord.address || 'Kothrud, Pune'}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-farmGreen-900">{ord.customerName}</div>
                <div className="text-[10px] text-gray-600 font-medium">Assigned Rider: Rohan Sharma (EV Scooter)</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manifest Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl border border-emerald-100 overflow-hidden relative animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-farmGreen-800 text-white flex items-center justify-center shadow-md shrink-0">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                      Crop Packing Sheet
                    </span>
                    <span className="text-xs font-mono text-farmGreen-950 font-black">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <h3 className="font-black text-base sm:text-lg text-farmGreen-950 truncate">
                    Order Packing & Dispatch Sheet
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details Summary Card */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-emerald-50/40 rounded-2xl border border-emerald-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-farmMuted uppercase block">Customer Details</span>
                  <div className="font-black text-farmGreen-950 text-sm mt-0.5">{selectedOrder.customerName}</div>
                  <div className="text-farmMuted text-[11px] font-bold">{selectedOrder.customerEmail}</div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-black text-[10px]">
                  ● {selectedOrder.status}
                </span>
              </div>
              
              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-farmGreen-950 font-bold">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedOrder.address || 'Kothrud Farm Route, Pune'}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  Verified Route 📍
                </span>
              </div>
            </div>

            {/* Produce Packing Checklist Card */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-farmGreen-950 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-emerald-600" />
                  <span>Produce Items To Pack:</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-black bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  ✓ Fresh Field Harvest
                </span>
              </div>
              
              <div className="p-3.5 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 rounded-2xl border border-emerald-200 space-y-2.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-emerald-600 rounded cursor-pointer w-4 h-4" />
                  <div className="min-w-0">
                    <span className="font-extrabold text-farmGreen-950 text-xs block leading-snug">
                      {selectedOrder.items}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                      Inspected for Farm Fresh Quality & Cold-Crated
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Courier Rider Assignment Card */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-farmMuted font-bold uppercase block">Courier Courier Rider</span>
                  <span className="font-extrabold text-farmGreen-950">Rohan Sharma (EV Scooter)</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (showToast) showToast('Rider Alert Sent 📞', 'Dispatch partner notified to pick up crate.');
                }}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-black cursor-pointer shadow-2xs flex items-center gap-1 active:scale-95 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Courier</span>
              </button>
            </div>

            {/* Payment & Total */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-farmMuted text-[10px] uppercase font-extrabold block">Payment Settlement</span>
                <span className="font-black text-xs text-emerald-800 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{selectedOrder.paymentMethod || 'UPI Paid (Direct to Farmer Bank)'}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-farmMuted text-[10px] uppercase font-extrabold block">Order Total</span>
                <div className="font-black text-2xl text-farmGreen-950 font-mono">
                  ₹{selectedOrder.total}
                </div>
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  showToast('Printing Slip 🖨️', `Printing packing manifest for ${selectedOrder.id}...`);
                  window.print();
                }}
                className="py-3 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-emerald-700" />
                <span>Print Packing Slip</span>
              </button>
              
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-3 bg-gradient-to-r from-farmGreen-800 to-farmGreen-950 hover:from-farmGreen-700 hover:to-farmGreen-900 text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Close Manifest
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerOrders;
