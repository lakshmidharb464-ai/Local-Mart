import React, { useState } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck, 
  MapPin, 
  AlertTriangle,
  Send,
  FileText,
  UserCheck,
  Search,
  Filter,
  Check,
  ShieldAlert,
  Navigation,
  ArrowRight,
  LayoutGrid,
  Table as TableIcon,
  Kanban,
  Box,
  X,
  Phone,
  Sparkles
} from 'lucide-react';

export const OrderStatusView = ({ orders = [], onUpdateStatus, showToast }) => {
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [failureReason, setFailureReason] = useState('Customer Phone Unreachable');
  const [customNotes, setCustomNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('all'); // 'all' | 'chittoor'
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'card' | 'table' | 'kanban'

  const filteredOrders = orders.filter((del) => {
    const matchesSearch = 
      del.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.customerAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = 
      filterRegion === 'all' ? true :
      filterRegion === 'chittoor' ? (
        del.district?.includes('Chittoor') || 
        del.customerAddress?.includes('Chittoor') || 
        del.customerAddress?.includes('Andhra Pradesh') || 
        del.id?.startsWith('DEL-CTR')
      ) : true;

    return matchesSearch && matchesRegion;
  });

  const statusSteps = [
    { key: 'Accepted', label: 'Accepted', icon: UserCheck, color: 'text-[#10b981]' },
    { key: 'Picked Up', label: 'Picked Up', icon: Clock, color: 'text-amber-500' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, color: 'text-blue-500' },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-500' }
  ];

  const handleStepClick = (statusKey) => {
    if (!selectedOrder) return;
    onUpdateStatus(selectedOrder.id, statusKey);
    if (showToast) showToast('Lifecycle Stage Updated 🔄', `Order ${selectedOrder.id} set to ${statusKey}.`);
  };

  const handleMarkFailedSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const finalReason = customNotes ? `${failureReason}: ${customNotes}` : failureReason;
    onUpdateStatus(selectedOrder.id, 'Failed', finalReason);
    setShowFailedModal(false);
    setCustomNotes('');
    if (showToast) {
      showToast('Delivery Flagged as Failed ⚠️', `Order ${selectedOrder.id} marked as Failed/Unable to Deliver.`);
    }
  };

  const chittoorCount = orders.filter(o => 
    o.district?.includes('Chittoor') || 
    o.customerAddress?.includes('Chittoor') || 
    o.customerAddress?.includes('Andhra Pradesh') || 
    o.id?.startsWith('DEL-CTR')
  ).length;

  return (
    <div className="space-y-6 pb-12 font-display animate-fadeIn">
      
      {/* Glassmorphism Header Banner */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 backdrop-blur-md border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 shadow-lg">
              <RefreshCw className="w-7 h-7 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Delivery Lifecycle Manager</span>
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                Order Lifecycle & Status Pipeline
              </h1>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                Manage status transitions, view audit logs, record failure reasons & track regional progress.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilterRegion(filterRegion === 'chittoor' ? 'all' : 'chittoor')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border ${
                filterRegion === 'chittoor'
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                  : 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>📍 Chittoor AP ({chittoorCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: View Switcher & Search */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Box */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name or location..."
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

        {/* 4 View Mode Switcher Pills */}
        <div className="flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl shrink-0 border border-gray-200/60 overflow-x-auto scrollbar-none">
          {[
            { id: 'timeline', label: 'Timeline Pipeline', icon: Clock },
            { id: 'card', label: 'Cards View', icon: LayoutGrid },
            { id: 'table', label: 'Table View', icon: TableIcon },
            { id: 'kanban', label: 'Kanban Board', icon: Kanban }
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

      {/* VIEW 1: TIMELINE PIPELINE SPLIT VIEW */}
      {viewMode === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Order Selection List */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-black text-sm text-farmGreen-950">
                Select Order ({filteredOrders.length})
              </h3>
              <span className="text-[11px] text-farmMuted font-bold">Click to manage</span>
            </div>

            {/* Order Cards List */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredOrders.map((del) => {
                const isSelected = selectedOrder?.id === del.id;
                const isChittoor = del.district?.includes('Chittoor') || del.customerAddress?.includes('Chittoor') || del.id?.startsWith('DEL-CTR');

                return (
                  <button
                    key={del.id}
                    onClick={() => setSelectedOrder(del)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-2 ring-emerald-300'
                        : 'bg-white border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-farmGreen-950 font-mono">{del.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        del.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900' :
                        del.status === 'Failed' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-900'
                      }`}>
                        {del.status}
                      </span>
                    </div>

                    <div className="text-xs text-farmGreen-950 font-extrabold truncate">
                      {del.customerName} · {del.customerAddress}
                    </div>

                    {isChittoor && (
                      <div className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block">
                        📍 Chittoor District (AP)
                      </div>
                    )}

                    <div className="text-[11px] text-farmMuted flex items-center justify-between pt-1 border-t border-gray-100 font-bold">
                      <span>Window: {del.deliveryWindow || 'Express Morning'}</span>
                      <span className="font-black text-emerald-800 font-mono">₹{(del.fee || 45) + (del.tip || 15)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Active Order Pipeline & Lifecycle Stepper */}
          {selectedOrder ? (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Status Pipeline Controls Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Active Order Pipeline</span>
                      {(selectedOrder.district?.includes('Chittoor') || selectedOrder.customerAddress?.includes('Chittoor')) && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                          📍 Chittoor District, AP Route
                        </span>
                      )}
                    </div>
                    <h2 className="font-black text-lg sm:text-xl text-farmGreen-950 mt-0.5">
                      {selectedOrder.id} — {selectedOrder.customerName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-farmMuted">Status:</span>
                    <span className="px-3.5 py-1 rounded-full bg-emerald-800 text-white font-black text-xs shadow-xs">
                      ● {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Status Step Transition Buttons */}
                <div className="space-y-3">
                  <div className="text-xs font-black text-farmGreen-950 uppercase tracking-wider">Advance Delivery Lifecycle Stage</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {statusSteps.map((step) => {
                      const isCurrent = selectedOrder.status === step.key;
                      const Icon = step.icon;

                      return (
                        <button
                          key={step.key}
                          onClick={() => handleStepClick(step.key)}
                          className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer active:scale-95 ${
                            isCurrent
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-400'
                              : 'bg-gray-50/80 hover:bg-emerald-50 text-farmGreen-950 border-gray-200'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : step.color}`} />
                          <span className="text-xs font-black">{step.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Issue & Failure Trigger */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs text-farmMuted font-bold">Encountered an obstacle or customer unavailable?</span>
                  <button
                    onClick={() => setShowFailedModal(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Report Unable to Deliver</span>
                  </button>
                </div>
              </div>

              {/* Audit Timeline & Activity Log */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>Order Status Audit Timeline & History Log</span>
                </h3>

                <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                  {(selectedOrder.timeline || [
                    { status: 'Assigned to Rider', note: 'EV Rider assigned to order', time: '10:15 AM' },
                    { status: 'Order Accepted', note: 'Rider confirmed pickup route', time: '10:18 AM' }
                  ]).map((item, idx) => (
                    <div key={idx} className="relative flex items-start justify-between gap-4 text-xs">
                      <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-200" />
                      <div>
                        <div className="font-black text-farmGreen-950 text-sm">{item.status}</div>
                        <div className="text-farmMuted text-xs font-medium">{item.note}</div>
                      </div>
                      <span className="text-[11px] font-mono text-farmMuted font-black bg-gray-50 px-2 py-0.5 rounded border border-gray-200 shrink-0">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-2 bg-white p-12 rounded-3xl text-center border border-gray-100 text-farmMuted font-bold">
              Select an order from the list to manage status pipeline.
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CARDS VIEW */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {filteredOrders.map(del => (
            <div key={del.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-farmGreen-950 font-mono">{del.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900">
                    {del.status}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-farmGreen-950">{del.customerName}</div>
                <div className="text-[11px] text-gray-600 font-bold bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {del.customerAddress}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="font-black text-base text-emerald-800 font-mono">₹{(del.fee || 45) + (del.tip || 15)}</span>
                <button
                  onClick={() => { setSelectedOrder(del); setViewMode('timeline'); }}
                  className="px-3.5 py-1.5 bg-emerald-800 text-white text-xs font-black rounded-xl cursor-pointer shadow-2xs"
                >
                  Manage Lifecycle 🔄
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-farmMuted tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Status Stage</th>
                  <th className="p-4">Partner Payout</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(del => (
                  <tr key={del.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-4 font-black text-xs text-farmGreen-950 font-mono">{del.id}</td>
                    <td className="p-4 font-extrabold text-farmGreen-950">{del.customerName}</td>
                    <td className="p-4 font-medium text-gray-700">{del.customerAddress}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900">
                        {del.status}
                      </span>
                    </td>
                    <td className="p-4 font-black text-sm text-emerald-800 font-mono">
                      ₹{(del.fee || 45) + (del.tip || 15)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => { setSelectedOrder(del); setViewMode('timeline'); }}
                        className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-black cursor-pointer"
                      >
                        Manage 🔄
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: KANBAN STATUS BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
          {['Accepted', 'Picked Up', 'Out for Delivery', 'Delivered'].map(statusCol => {
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
                        <span className="font-black text-xs text-emerald-800 font-mono">₹{(ord.fee || 45) + (ord.tip || 15)}</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-800">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-500 font-medium truncate">{ord.customerAddress}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unable to Deliver Reason Modal */}
      {showFailedModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-rose-200 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600 pb-3 border-b border-gray-100">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-black text-base text-farmGreen-950">
                  Report Delivery Failure ({selectedOrder.id})
                </h3>
                <p className="text-xs text-farmMuted font-bold">Specify cause for unfulfilled delivery</p>
              </div>
            </div>

            <form onSubmit={handleMarkFailedSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-farmGreen-950 block">Select Primary Reason</label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-xs font-extrabold rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Customer Phone Unreachable">Customer Phone Unreachable</option>
                  <option value="Premises / Door Locked">Premises / Door Locked</option>
                  <option value="Incorrect Address Location">Incorrect Address Location</option>
                  <option value="Customer Refused Order">Customer Refused Order</option>
                  <option value="Severe Weather / Route Obstacle">Severe Weather / Route Obstacle</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-farmGreen-950 block">Notes & Details (Optional)</label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Attempted delivery twice at customer address..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFailedModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-extrabold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 text-white font-black text-xs rounded-xl hover:bg-rose-700 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Submit Failure Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderStatusView;
