import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Navigation, 
  Search, 
  Filter, 
  Eye,
  X,
  Map,
  Copy,
  Check,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
  Radio,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  KeyRound,
  Truck,
  Building2,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export const MyDeliveries = ({ orders = [], onUpdateStatus, setSelectedOrder, setActiveTab, showToast }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all'); // 'all' | 'chittoor'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'table' | 'route'
  
  // Modals
  const [previewOrder, setPreviewOrder] = useState(null);
  const [otpOrder, setOtpOrder] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isOnlineDuty, setIsOnlineDuty] = useState(true);

  const filteredOrders = orders.filter((del) => {
    const matchesSearch = 
      del.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.customerAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.farmName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? ['Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'].includes(del.status) :
      del.status.toLowerCase() === filterStatus.toLowerCase();

    const matchesPriority = 
      selectedPriority === 'all' ? true : del.priority === selectedPriority;

    const matchesRegion = 
      filterRegion === 'all' ? true :
      filterRegion === 'chittoor' ? (
        del.district?.includes('Chittoor') || 
        del.customerAddress?.includes('Chittoor') || 
        del.customerAddress?.includes('Andhra Pradesh') || 
        del.id?.startsWith('DEL-CTR')
      ) : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesRegion;
  });

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'High Priority':
        return 'bg-rose-100/90 text-rose-800 border-rose-300';
      case 'Cold Chain':
        return 'bg-cyan-100/90 text-cyan-900 border-cyan-300';
      case 'Express':
        return 'bg-amber-100/90 text-amber-950 border-amber-300 font-extrabold';
      default:
        return 'bg-emerald-100/90 text-emerald-900 border-emerald-300';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black shadow-2xs';
      case 'Out for Delivery':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black animate-pulse shadow-2xs';
      case 'Picked Up':
        return 'bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-black shadow-2xs';
      case 'Accepted':
        return 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-black shadow-2xs';
      case 'Failed':
        return 'bg-gradient-to-r from-rose-600 to-red-700 text-white font-black shadow-2xs';
      case 'Assigned':
      default:
        return 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-black shadow-2xs';
    }
  };

  const handleCopyAddress = (id, text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    if (showToast) showToast('Address Copied! 📋', 'Delivery location copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenOtpModal = (order) => {
    setOtpOrder(order);
    setOtpInput('');
    setOtpError('');
  };

  const handleConfirmOtpDelivery = (e) => {
    e.preventDefault();
    if (otpInput.length !== 4) {
      setOtpError('Please enter valid 4-digit OTP provided by customer (Demo OTP: 4920).');
      return;
    }
    if (otpOrder) {
      onUpdateStatus(otpOrder.id, 'Delivered');
      if (showToast) showToast('Delivery Success! 🎉', `Order ${otpOrder.id} verified with OTP PIN & marked as delivered.`);
      setOtpOrder(null);
    }
  };

  const chittoorCount = orders.filter(o => 
    o.district?.includes('Chittoor') || 
    o.customerAddress?.includes('Chittoor') || 
    o.customerAddress?.includes('Andhra Pradesh') || 
    o.id?.startsWith('DEL-CTR')
  ).length;

  const totalEarningsToday = orders.reduce((sum, o) => sum + (o.fee || 45) + (o.tip || 15), 0);

  return (
    <div className="space-y-6 pb-12 font-display animate-fadeIn">
      
      {/* Glassmorphism Header Banner */}
      <div className="bg-gradient-to-r from-[#071f15] via-[#0B3D2E] to-[#0D4233] text-white p-6 sm:p-7 rounded-3xl shadow-farm-lg border border-white/[0.08] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/[0.08] rounded-full blur-3xl pointer-events-none animate-orbFloat" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-500/[0.08] rounded-full blur-3xl pointer-events-none animate-orbFloat" style={{ animationDelay: '2.5s' }} />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-lg">
              <Truck className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                  Courier Fleet Dispatch
                </span>
                <button
                  onClick={() => setIsOnlineDuty(!isOnlineDuty)}
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                    isOnlineDuty ? 'bg-emerald-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isOnlineDuty ? 'bg-stone-950 animate-ping' : 'bg-gray-400'}`} />
                  <span>{isOnlineDuty ? 'DUTY ONLINE' : 'DUTY PAUSED'}</span>
                </button>
              </div>

              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                My Delivery Tasks & Orders
              </h1>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                Review farm pickups, inspect customer addresses & verify delivery with OTP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/[0.08] backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-right shadow-md">
              <span className="text-[10px] text-amber-300 font-bold uppercase block">Est. Payout Today</span>
              <span className="text-xl font-black text-white font-mono">₹{totalEarningsToday.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs, View Switcher & Search */}
      <div className="glass-surface p-3.5 sm:p-4 rounded-3xl border border-farmGreen-200/30 shadow-glass space-y-3">
        
        {/* Row 1: Status Filter Tabs (Left) & View Switcher (Right) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border-b border-farmSage-100/40 pb-3">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Tasks', count: orders.length },
              { id: 'active', label: 'Active Dispatch', count: orders.filter(o => ['Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'].includes(o.status)).length },
              { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
              { id: 'failed', label: 'Failed / Returned', count: orders.filter(o => o.status === 'Failed').length }
            ].map(tab => {
              const isSelected = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-sm ring-1 ring-emerald-400/40'
                      : 'text-farmMuted hover:text-farmGreen-950 hover:bg-emerald-50/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-farmSage-100/60 text-farmGreen-950'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher Pills */}
          <div className="flex items-center gap-1 bg-farmSage-100/40 p-1 rounded-xl shrink-0 border border-farmSage-200/50 self-start lg:self-auto">
            {[
              { id: 'card', label: 'Cards', icon: LayoutGrid },
              { id: 'table', label: 'Table', icon: TableIcon },
              { id: 'route', label: 'Route List', icon: MapPin }
            ].map(vm => {
              const IconComp = vm.icon;
              const isVmSelected = viewMode === vm.id;
              return (
                <button
                  key={vm.id}
                  onClick={() => setViewMode(vm.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isVmSelected
                      ? 'bg-white text-farmGreen-950 shadow-xs border border-emerald-200/60'
                      : 'text-farmMuted hover:text-farmGreen-950 hover:bg-white/50'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isVmSelected ? 'text-emerald-600' : 'text-farmSage-400'}`} />
                  <span className="text-[11px] font-extrabold">{vm.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Row 2: Search Input & Region Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
            <input
              type="text"
              placeholder="Search order ID, customer name, address, Chittoor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white/70 hover:bg-white focus:bg-white border border-farmSage-200/50 focus:border-emerald-500 rounded-xl text-xs font-bold text-farmGreen-950 placeholder-farmSage-400 outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-farmSage-400 hover:text-gray-600 p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setFilterRegion(filterRegion === 'chittoor' ? 'all' : 'chittoor')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
                filterRegion === 'chittoor'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 border-amber-400 font-black shadow-xs'
                  : 'bg-white/70 border-farmSage-200/50 text-amber-900 hover:bg-amber-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-800" />
              <span>Chittoor Hub ({chittoorCount})</span>
            </button>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-white/70 border border-farmSage-200/50 text-xs font-extrabold text-farmGreen-950 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="High Priority">High Priority</option>
              <option value="Express">Express</option>
              <option value="Cold Chain">Cold Chain</option>
            </select>
          </div>

        </div>

      </div>

      {/* VIEW 1: CARDS VIEW */}
      {viewMode === 'card' && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="glass-surface rounded-3xl p-12 text-center border border-farmSage-100/40 shadow-sm space-y-3">
              <Package className="w-12 h-12 text-emerald-600 mx-auto opacity-50" />
              <h3 className="font-extrabold text-base text-farmGreen-950">No matching delivery orders found</h3>
              <p className="text-xs text-farmMuted max-w-sm mx-auto">
                Try adjusting your search query or region filter tabs.
              </p>
            </div>
          ) : (
            filteredOrders.map((del) => {
              const isChittoor = del.district?.includes('Chittoor') || del.customerAddress?.includes('Chittoor') || del.id?.startsWith('DEL-CTR');

              return (
                <div 
                  key={del.id}
                  className="glass-surface rounded-3xl border border-farmGreen-200/30 p-5 sm:p-6 shadow-glass hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
                >
                  {/* Top Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-farmSage-100/40">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="font-black text-base text-farmGreen-950 font-mono">
                        {del.id} <span className="text-xs text-farmMuted font-mono">({del.orderId})</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getPriorityBadgeStyle(del.priority)}`}>
                        {del.priority}
                      </span>
                      {isChittoor && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[10px] font-black border border-amber-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-700" />
                          <span>Chittoor Hub</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeStyle(del.status)}`}>
                        ● {del.status}
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-farmMuted font-black block uppercase">Partner Earnings</span>
                        <span className="font-mono font-black text-base text-emerald-800">
                          ₹{(del.fee || 45) + (del.tip || 15)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Farm Location Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Farm Pickup Card */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
                      <div className="text-[10px] font-black text-emerald-900 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Pickup Point (Farm Depot)</span>
                        </span>
                        <a 
                          href={`tel:${del.farmPhone || '9876543210'}`} 
                          className="text-emerald-950 hover:underline flex items-center gap-1 font-extrabold bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200 text-xs shadow-2xs"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{del.farmPhone || '9876543210'}</span>
                        </a>
                      </div>
                      <div className="font-extrabold text-sm text-farmGreen-950">{del.farmName}</div>
                      <div className="text-xs text-farmMuted font-bold flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{del.farmAddress}</span>
                      </div>
                    </div>

                    {/* Customer Dropoff Card */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                      <div className="text-[10px] font-black text-amber-950 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-amber-600" />
                          <span>Customer Destination</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyAddress(del.id, del.customerAddress)}
                            className="text-[10px] font-black text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === del.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === del.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <a 
                            href={`tel:${del.customerPhone || '9876543210'}`} 
                            className="text-amber-950 hover:underline flex items-center gap-1 font-extrabold bg-white/80 px-2 py-0.5 rounded-md border border-amber-300 text-xs shadow-2xs"
                          >
                            <Phone className="w-3 h-3 text-amber-600" />
                            <span>{del.customerPhone || '9876543210'}</span>
                          </a>
                        </div>
                      </div>
                      <div className="font-extrabold text-sm text-farmGreen-950">{del.customerName}</div>
                      <div className="text-xs text-farmMuted font-bold flex items-start gap-1.5">
                        <Navigation className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-farmGreen-950">{del.customerAddress}</div>
                          <div className="text-[10px] text-amber-900 font-extrabold italic mt-0.5">
                            Landmark: {del.customerLandmark || 'Near Main Gate / Landmark'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items & Payment Breakdown */}
                  <div className="space-y-2">
                    <div className="text-xs font-black text-farmGreen-950 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>Order Produce Items ({del.items ? (Array.isArray(del.items) ? del.items.length : 1) : 1})</span>
                      </span>
                      <button
                        onClick={() => setPreviewOrder(del)}
                        className="text-emerald-800 hover:text-emerald-950 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick Preview</span>
                      </button>
                    </div>
                    
                    <div className="bg-white/60 rounded-2xl p-3.5 border border-farmSage-200/50 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                      <div className="space-y-1">
                        {Array.isArray(del.items) ? (
                          del.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-farmGreen-950">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              <span><strong>{item.name}</strong> × {item.qty}</span>
                              <span className="text-farmMuted font-mono text-[11px]">(₹{item.price})</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-farmGreen-950 font-extrabold">{del.items || 'Fresh Farm Produce Package'}</div>
                        )}
                      </div>

                      <div className="text-right border-l pl-4 border-farmSage-200/50">
                        <div className="text-[10px] text-farmMuted font-black uppercase">Payment Type</div>
                        <div className="font-extrabold text-xs text-farmGreen-950">{del.paymentType || 'UPI Paid Direct'}</div>
                        <div className="text-[11px] text-emerald-800 font-mono font-black mt-0.5">
                          Total: ₹{del.totalAmount || 110}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Controls */}
                  <div className="pt-3.5 border-t border-farmSage-100/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs text-farmMuted font-bold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{del.deliveryWindow || 'Express Morning Pick'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Est: {del.distance || '2.8 km'} ({del.eta || '15 mins'})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => {
                          if (setSelectedOrder) setSelectedOrder(del);
                          if (setActiveTab) setActiveTab('tracking');
                        }}
                        className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-800 to-farmGreen-950 text-white text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
                      >
                        <Navigation className="w-4 h-4 text-amber-300" />
                        <span>Live GPS Map</span>
                      </button>

                      {del.status === 'Assigned' && (
                        <button
                          onClick={() => onUpdateStatus(del.id, 'Accepted')}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                        >
                          Accept Task
                        </button>
                      )}

                      {del.status === 'Accepted' && (
                        <button
                          onClick={() => onUpdateStatus(del.id, 'Picked Up')}
                          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 rounded-2xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                        >
                          Confirm Pickup
                        </button>
                      )}

                      {del.status === 'Picked Up' && (
                        <button
                          onClick={() => onUpdateStatus(del.id, 'Out for Delivery')}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                        >
                          Start Delivery
                        </button>
                      )}

                      {del.status === 'Out for Delivery' && (
                        <button
                          onClick={() => handleOpenOtpModal(del)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-black cursor-pointer shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <KeyRound className="w-4 h-4 text-amber-300" />
                          <span>Verify OTP & Deliver</span>
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
        <div className="glass-surface rounded-3xl border border-farmGreen-200/30 shadow-glass overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-white/70 border-b border-farmSage-100/40 text-[10px] font-black uppercase text-farmMuted tracking-wider">
                <tr>
                  <th className="p-4">Delivery ID</th>
                  <th className="p-4">Farm Pickup</th>
                  <th className="p-4">Customer Destination</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Fee + Tip</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(del => (
                  <tr key={del.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-black text-xs text-farmGreen-950 font-mono">{del.id}</div>
                      <div className="text-[10px] text-farmMuted font-mono">{del.orderId}</div>
                    </td>
                    <td className="p-4 font-bold text-farmGreen-950">{del.farmName}</td>
                    <td className="p-4">
                      <div className="font-extrabold text-farmGreen-950">{del.customerName}</div>
                      <div className="text-[10px] text-farmMuted">{del.customerAddress}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] ${getStatusBadgeStyle(del.status)}`}>
                        {del.status}
                      </span>
                    </td>
                    <td className="p-4 font-black text-sm text-emerald-800 font-mono">
                      ₹{(del.fee || 45) + (del.tip || 15)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => { if (setSelectedOrder) setSelectedOrder(del); if (setActiveTab) setActiveTab('tracking'); }}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
                      >
                        GPS Map
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: ROUTE LIST VIEW */}
      {viewMode === 'route' && (
        <div className="glass-surface rounded-3xl border border-farmGreen-200/30 p-6 shadow-glass space-y-4 animate-fadeIn">
          <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Optimal Multi-Stop Delivery Route Sequence</span>
          </h3>

          <div className="space-y-4 relative before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
            {filteredOrders.map((del, idx) => (
              <div key={del.id} className="relative pl-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 hover:bg-emerald-50/50 rounded-2xl transition-all border border-transparent hover:border-emerald-200">
                <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white shadow-xs" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-farmGreen-950 font-mono">Stop #{idx + 1}: {del.id}</span>
                    <span className="text-[10px] text-farmMuted font-bold">• {del.distance || '2.8 km'}</span>
                  </div>
                  <div className="text-xs font-bold text-farmGreen-950 mt-0.5">
                    Pickup: <strong>{del.farmName}</strong> ➔ Deliver: <strong>{del.customerName}</strong> ({del.customerAddress})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeStyle(del.status)}`}>
                    {del.status}
                  </span>
                  <button
                    onClick={() => { if (setSelectedOrder) setSelectedOrder(del); if (setActiveTab) setActiveTab('tracking'); }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
                  >
                    Start Navigation ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Delivery OTP Verification Modal */}
      {otpOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="glass-surface rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-emerald-200 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-farmSage-100/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                  <KeyRound className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">
                    Verify Customer OTP Delivery PIN
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">Order {otpOrder.id} • {otpOrder.customerName}</p>
                </div>
              </div>
              <button onClick={() => setOtpOrder(null)} className="w-8 h-8 rounded-full bg-farmSage-100/60 hover:bg-gray-200 text-farmMuted flex items-center justify-center transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmOtpDelivery} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-farmGreen-950 block">
                  Ask customer for 4-Digit Delivery PIN
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 4920"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center tracking-widest text-2xl font-mono font-black p-3 bg-white border-2 border-emerald-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs"
                />
                {otpError && (
                  <div className="text-xs font-bold text-rose-600">{otpError}</div>
                )}
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between font-extrabold">
                <span>Payment Verification:</span>
                <span>{otpOrder.paymentType || 'UPI Direct (Paid)'}</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOtpOrder(null)}
                  className="px-4 py-2.5 bg-farmSage-100/60 text-farmGreen-950 font-extrabold text-xs rounded-xl hover:bg-farmSage-200/60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Verify OTP & Deliver</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Quick Order Items Preview Modal */}
      {previewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="glass-surface rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-emerald-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-farmSage-100/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">
                    Order Details ({previewOrder.id})
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">Customer: {previewOrder.customerName}</p>
                </div>
              </div>
              <button onClick={() => setPreviewOrder(null)} className="w-8 h-8 rounded-full bg-farmSage-100/60 hover:bg-gray-200 text-farmMuted flex items-center justify-center transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-white/70 rounded-2xl border border-emerald-100 space-y-1 font-bold">
                <div className="text-farmMuted text-[10px] uppercase font-black">Destination Address</div>
                <div className="text-farmGreen-950">{previewOrder.customerAddress}</div>
                <div className="text-emerald-800 text-[11px]">Landmark: {previewOrder.customerLandmark || 'Near Main Gate / Landmark'}</div>
              </div>

              <div className="space-y-2">
                <div className="font-black text-farmGreen-950">Package Items Breakdown</div>
                <div className="space-y-1.5">
                  {Array.isArray(previewOrder.items) ? (
                    previewOrder.items.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-white border border-farmSage-200/50 rounded-xl flex items-center justify-between font-extrabold">
                        <span className="text-farmGreen-950">{item.name}</span>
                        <span className="font-mono text-farmMuted">{item.qty} — ₹{item.price}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 bg-white border border-farmSage-200/50 rounded-xl font-extrabold text-farmGreen-950">
                      {previewOrder.items || 'Fresh Farm Produce Package'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-farmSage-100/40 font-black text-sm">
                <span>Total Amount:</span>
                <span className="text-emerald-800 font-mono">₹{previewOrder.totalAmount || 110} ({previewOrder.paymentType || 'UPI Paid'})</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyDeliveries;
