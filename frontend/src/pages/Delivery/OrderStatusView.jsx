import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RefreshCw, CheckCircle2, Clock, XCircle, Truck, MapPin, AlertTriangle,
  FileText, UserCheck, Search, LayoutGrid, Kanban, X, Phone, Sparkles,
  Camera, Upload, Flag, MessageSquare, Navigation,
  ChevronRight, Package, StickyNote, TrendingUp, Wallet,
  CheckSquare, Square, ArrowUpCircle, Info, Repeat2, Table as TableIcon,
  Send
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
const STATUS_STEPS = [
  { key: 'Accepted',         label: 'Accepted',         icon: UserCheck,   color: 'emerald' },
  { key: 'Picked Up',        label: 'Picked Up',        icon: Clock,       color: 'amber'   },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck,       color: 'blue'    },
  { key: 'Delivered',        label: 'Delivered',        icon: CheckCircle2,color: 'green'   },
];

const STATUS_COLOR = {
  'Accepted':         'bg-emerald-100 text-emerald-900',
  'Picked Up':        'bg-amber-100 text-amber-900',
  'Out for Delivery': 'bg-blue-100 text-blue-900',
  'Delivered':        'bg-green-100 text-green-900',
  'Failed':           'bg-rose-100 text-rose-800',
};

const FAILURE_REASONS = [
  'Customer Phone Unreachable',
  'Premises / Door Locked',
  'Incorrect Address Location',
  'Customer Refused Order',
  'Severe Weather / Route Obstacle',
];

const DELIVERY_SLOTS = [
  'Tomorrow 6 AM – 9 AM (Morning Express)',
  'Tomorrow 9 AM – 12 PM (Forenoon)',
  'Tomorrow 12 PM – 3 PM (Afternoon)',
  'Tomorrow 3 PM – 6 PM (Evening)',
  'Day After Tomorrow (Morning Express)',
];

const detectDistrict = (addr = '', id = '') => {
  const a = `${addr} ${id}`.toLowerCase();
  if (a.includes('chittoor') || id.startsWith('DEL-CTR')) return 'Chittoor';
  if (a.includes('tirupati'))  return 'Tirupati';
  if (a.includes('nellore'))   return 'Nellore';
  if (a.includes('kadapa'))    return 'Kadapa';
  if (a.includes('kurnool'))   return 'Kurnool';
  if (a.includes('guntur'))    return 'Guntur';
  if (a.includes('vijayawada') || a.includes('krishna')) return 'Krishna';
  if (a.includes('pune'))      return 'Pune';
  if (a.includes('mumbai'))    return 'Mumbai';
  return 'Other';
};

const useElapsed = (ts) => {
  const [elapsed, setElapsed] = useState('');
  useEffect(() => {
    if (!ts) return;
    const tick = () => {
      const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
      if (diff < 60) setElapsed(`${diff}s`);
      else if (diff < 3600) setElapsed(`${Math.floor(diff / 60)}m ${diff % 60}s`);
      else setElapsed(`${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ts]);
  return elapsed;
};

const LiveTimer = ({ acceptedAt, status }) => {
  const elapsed = useElapsed(acceptedAt);
  if (!acceptedAt || status === 'Delivered' || status === 'Failed') return null;
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-[10px] font-black w-fit">
      <Clock className="w-3 h-3 text-blue-500" />
      In progress: {elapsed}
    </span>
  );
};

const PriorityBadge = () => (
  <span className="px-2 py-0.5 bg-rose-100 border border-rose-300 text-rose-800 rounded-full text-[10px] font-black flex items-center gap-1">
    <Flag className="w-3 h-3" /> Priority
  </span>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const OrderStatusView = ({ orders = [], onUpdateStatus, showToast }) => {
  const [localMeta, setLocalMeta] = useState({});

  const getMeta = useCallback((id) => localMeta[id] || {
    isPriority: false, proofPhoto: null, notes: [],
  }, [localMeta]);

  const patchMeta = (id, patch) =>
    setLocalMeta(prev => ({ ...prev, [id]: { ...getMeta(id), ...patch } }));

  const [viewMode, setViewMode]       = useState('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [selectedOrder, setSelectedOrder]   = useState(orders[0] || null);
  const [batchMode, setBatchMode]           = useState(false);
  const [batchSelected, setBatchSelected]   = useState(new Set());
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal]   = useState(false);
  const [showRetryModal, setShowRetryModal]   = useState(false);
  const [showNoteModal, setShowNoteModal]     = useState(false);
  const [showSmsModal, setShowSmsModal]       = useState(false);
  const [targetOrderId, setTargetOrderId]     = useState(null);
  const [failureReason, setFailureReason]     = useState(FAILURE_REASONS[0]);
  const [failureNotes, setFailureNotes]       = useState('');
  const [retrySlot, setRetrySlot]             = useState(DELIVERY_SLOTS[0]);
  const [photoPreview, setPhotoPreview]       = useState(null);
  const [noteText, setNoteText]               = useState('');
  const [smsText, setSmsText]                 = useState('');
  const [batchStatus, setBatchStatus]         = useState('Out for Delivery');
  const photoRef = useRef();

  const allDistricts = ['All', ...new Set(orders.map(o => detectDistrict(o.customerAddress, o.id)))];

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const ms = o.id.toLowerCase().includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerAddress || '').toLowerCase().includes(q);
    const md = districtFilter === 'All' || detectDistrict(o.customerAddress, o.id) === districtFilter;
    return ms && md;
  });

  const totalOrders = orders.length;
  const delivered   = orders.filter(o => o.status === 'Delivered').length;
  const failed      = orders.filter(o => o.status === 'Failed').length;
  const inProgress  = orders.filter(o => !['Delivered', 'Failed'].includes(o.status)).length;
  const successRate = totalOrders ? Math.round((delivered / totalOrders) * 100) : 0;
  const totalEarnings = orders.reduce((s, o) => s + (o.fee || 45) + (o.tip || 15), 0);

  const toast = (title, msg, type) => { if (showToast) showToast(title, msg, type); };

  const handleStepClick = (order, statusKey) => {
    if (!order) return;
    onUpdateStatus?.(order.id, statusKey);
    toast('Stage Updated 🔄', `Order ${order.id} → ${statusKey}`);
    if (statusKey === 'Delivered') {
      const next = filteredOrders.find(o => o.id !== order.id && !['Delivered', 'Failed'].includes(o.status));
      if (next) setSelectedOrder(next);
    }
  };

  const handleMarkFailed = (e) => {
    e.preventDefault();
    const ord = orders.find(o => o.id === targetOrderId) || selectedOrder;
    if (!ord) return;
    const reason = failureNotes ? `${failureReason}: ${failureNotes}` : failureReason;
    onUpdateStatus?.(ord.id, 'Failed', reason);
    setShowFailedModal(false);
    setFailureNotes('');
    toast('Delivery Flagged Failed', `Order ${ord.id} reported as Failed.`);
  };

  const handleRetry = (e) => {
    e.preventDefault();
    const ord = orders.find(o => o.id === targetOrderId) || selectedOrder;
    if (!ord) return;
    onUpdateStatus?.(ord.id, 'Accepted');
    setShowRetryModal(false);
    toast('Retry Scheduled 🔁', `Order ${ord.id} rescheduled for ${retrySlot}.`);
  };

  const handlePhotoUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id = targetOrderId || selectedOrder?.id;
    if (id) { patchMeta(id, { proofPhoto: url }); toast('Proof Uploaded', `Delivery proof saved for ${id}.`); }
    setShowPhotoModal(false);
    setPhotoPreview(null);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    const id = targetOrderId || selectedOrder?.id;
    if (!id || !noteText.trim()) return;
    const meta = getMeta(id);
    patchMeta(id, { notes: [...(meta.notes || []), { text: noteText.trim(), time: new Date().toLocaleTimeString() }] });
    setNoteText('');
    setShowNoteModal(false);
    toast('Note Added', `Private note saved for ${id}.`);
  };

  const handleBatchUpdate = () => {
    batchSelected.forEach(id => onUpdateStatus?.(id, batchStatus));
    toast('Batch Updated', `${batchSelected.size} orders moved to "${batchStatus}".`);
    setBatchSelected(new Set());
    setBatchMode(false);
  };

  const openModal = (modal, orderId) => {
    const oid = orderId || selectedOrder?.id || null;
    setTargetOrderId(oid);
    if (modal === 'failed') setShowFailedModal(true);
    if (modal === 'retry')  setShowRetryModal(true);
    if (modal === 'photo')  setShowPhotoModal(true);
    if (modal === 'note')   setShowNoteModal(true);
    if (modal === 'sms') {
      const ord = orders.find(o => o.id === oid);
      setSmsText(`Hi ${ord?.customerName || 'Customer'}, your Local Farm order ${ord?.id || ''} is on its way! 🚜`);
      setShowSmsModal(true);
    }
  };

  const toggleBatchSelect = (id) => {
    setBatchSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const togglePriority = (id) => {
    const cur = getMeta(id).isPriority;
    patchMeta(id, { isPriority: !cur });
    toast(!cur ? 'Flagged as Priority' : 'Priority Removed', `Order ${id} ${!cur ? 'marked urgent' : 'unflagged'}.`);
  };

  /* ── Order Detail Panel ── */
  const OrderDetailPanel = ({ order }) => {
    const meta = getMeta(order.id);
    const items = order.items || [
      { name: 'Fresh Tomatoes', qty: '2 kg',    unit: '🍅' },
      { name: 'Spinach Leaves', qty: '500 g',   unit: '🥬' },
      { name: 'Coconut Oil',    qty: '1 bottle', unit: '🥥' },
    ];

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Active Order Pipeline</span>
              {meta.isPriority && <PriorityBadge />}
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                📍 {detectDistrict(order.customerAddress, order.id)}
              </span>
            </div>
            <h2 className="font-black text-lg sm:text-xl text-farmGreen-950">{order.id} — {order.customerName}</h2>
            <LiveTimer acceptedAt={order.acceptedAt} status={order.status} />
          </div>
          <span className={`px-3 py-1 rounded-full font-black text-xs ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-800'}`}>
            ● {order.status}
          </span>
        </div>

        {/* Status Steps */}
        <div className="space-y-2">
          <div className="text-xs font-black text-farmGreen-950 uppercase tracking-wider">Advance Lifecycle Stage</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATUS_STEPS.map(step => {
              const isCurrent = order.status === step.key;
              const Icon = step.icon;
              return (
                <button key={step.key} onClick={() => handleStepClick(order, step.key)}
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    isCurrent ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-400'
                              : 'bg-gray-50 hover:bg-emerald-50 text-farmGreen-950 border-gray-200 hover:border-emerald-300'
                  }`}>
                  <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : `text-${step.color}-500`}`} />
                  <span className="text-xs font-black leading-tight">{step.label}</span>
                  {isCurrent && <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest">Current</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Action Strip */}
        <div className="flex flex-wrap gap-2 pt-1 pb-3 border-b border-gray-100">
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customerAddress || '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-black transition-all cursor-pointer">
            <Navigation className="w-3.5 h-3.5" /> Navigate
          </a>
          <button onClick={() => openModal('sms', order.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black transition-all cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5" /> SMS Customer
          </button>
          <button onClick={() => openModal('photo', order.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-800 rounded-xl text-xs font-black transition-all cursor-pointer">
            <Camera className="w-3.5 h-3.5" /> {meta.proofPhoto ? '✓ Proof' : 'Upload Proof'}
          </button>
          <button onClick={() => openModal('note', order.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-black transition-all cursor-pointer">
            <StickyNote className="w-3.5 h-3.5" /> Add Note
          </button>
          <button onClick={() => togglePriority(order.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              meta.isPriority ? 'bg-rose-600 text-white border-rose-700' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}>
            <Flag className="w-3.5 h-3.5" /> {meta.isPriority ? 'Unflag' : 'Priority'}
          </button>
          <button onClick={() => openModal('failed', order.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-black transition-all cursor-pointer ml-auto">
            <XCircle className="w-3.5 h-3.5" /> Report Failure
          </button>
        </div>

        {/* Customer Info + Order Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="font-black text-xs text-farmGreen-950 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Customer Details
            </div>
            <div className="space-y-1.5 text-xs font-bold text-gray-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{order.customerAddress}</span>
              </div>
              {order.customerPhone && (
                <a href={`tel:${order.customerPhone}`} className="flex items-center gap-2 text-blue-700 hover:underline">
                  <Phone className="w-3.5 h-3.5 shrink-0" /> {order.customerPhone}
                </a>
              )}
              {order.floorLandmark && (
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {order.floorLandmark}
                </div>
              )}
              {order.specialNotes && (
                <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-bold text-[11px]">
                  ⚠️ {order.specialNotes}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="font-black text-xs text-farmGreen-950 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-600" /> Order Items
            </div>
            <div className="space-y-1.5">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] font-bold text-gray-700">
                  <span>{item.unit} {item.name}</span>
                  <span className="font-black text-farmGreen-950">{item.qty}</span>
                </div>
              ))}
              <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="font-black text-farmMuted">Payout</span>
                <span className="font-black text-emerald-800 font-mono">₹{(order.fee || 45) + (order.tip || 15)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Private Notes */}
        {(getMeta(order.id).notes || []).length > 0 && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <div className="font-black text-xs text-amber-900 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5" /> Private Notes
            </div>
            {getMeta(order.id).notes.map((n, i) => (
              <div key={i} className="flex items-start justify-between text-[11px] gap-2">
                <span className="font-bold text-amber-800">{n.text}</span>
                <span className="text-amber-600 font-mono shrink-0 text-[10px]">{n.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Proof Photo */}
        {getMeta(order.id).proofPhoto && (
          <div className="p-3 bg-violet-50 rounded-2xl border border-violet-200">
            <div className="font-black text-xs text-violet-900 mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Delivery Proof Photo
            </div>
            <img src={getMeta(order.id).proofPhoto} alt="proof" className="w-full max-h-44 object-cover rounded-xl border border-violet-200" />
          </div>
        )}
      </div>
    );
  };

  /* ── Audit Log ── */
  const AuditLog = ({ order }) => {
    const tl = order.timeline || [
      { status: 'Assigned to Rider', note: 'EV Rider assigned to order', time: '10:15 AM' },
      { status: 'Order Accepted',    note: 'Rider confirmed pickup route', time: '10:18 AM' },
    ];
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" /> Status Audit Timeline
        </h3>
        <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
          {tl.map((item, idx) => (
            <div key={idx} className="relative flex items-start justify-between gap-4 text-xs">
              <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-200" />
              <div>
                <div className="font-black text-farmGreen-950 text-sm">{item.status}</div>
                <div className="text-farmMuted font-medium">{item.note}</div>
              </div>
              <span className="text-[11px] font-mono text-farmMuted font-black bg-gray-50 px-2 py-0.5 rounded border border-gray-200 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 pb-12 font-display animate-fadeIn">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-lg">
              <RefreshCw className="w-7 h-7 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> Delivery Lifecycle Manager
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">Order Lifecycle & Status Pipeline</h1>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">Manage transitions, proof uploads, failure reports & regional routing.</p>
            </div>
          </div>
          <button
            onClick={() => { setBatchMode(b => !b); setBatchSelected(new Set()); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer shrink-0 ${
              batchMode ? 'bg-amber-400 text-slate-900 border-amber-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {batchMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            {batchMode ? 'Exit Batch Mode' : 'Batch Update'}
          </button>
        </div>
      </div>

      {/* Shift Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Orders', value: totalOrders,       icon: Package,     bg: 'bg-gray-50',     border: 'border-gray-200',    txt: 'text-gray-800'    },
          { label: 'Delivered',    value: delivered,         icon: CheckCircle2,bg: 'bg-emerald-50',  border: 'border-emerald-200', txt: 'text-emerald-800' },
          { label: 'In Progress',  value: inProgress,        icon: Truck,       bg: 'bg-blue-50',     border: 'border-blue-200',    txt: 'text-blue-800'    },
          { label: 'Failed',       value: failed,            icon: XCircle,     bg: 'bg-rose-50',     border: 'border-rose-200',    txt: 'text-rose-800'    },
          { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp,  bg: 'bg-amber-50',    border: 'border-amber-200',   txt: 'text-amber-800'   },
        ].map(s => { const Icon = s.icon; return (
          <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-2xl border ${s.bg} ${s.border}`}>
            <div className={`p-2 rounded-xl bg-white border ${s.border} shrink-0`}>
              <Icon className={`w-4 h-4 ${s.txt}`} />
            </div>
            <div>
              <div className={`font-black text-xl ${s.txt}`}>{s.value}</div>
              <div className="text-[10px] font-bold text-farmMuted">{s.label}</div>
            </div>
          </div>
        ); })}
      </div>

      {/* Earnings strip */}
      <div className="flex items-center justify-between px-5 py-3 bg-emerald-800 text-white rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-black">
          <Wallet className="w-4 h-4 text-amber-300" /> Today's Shift Earnings
        </div>
        <div className="font-black text-xl font-mono text-amber-300">₹{totalEarnings}</div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative w-full md:max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
            <input type="text" placeholder="Search Order ID, customer, address..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-emerald-500 rounded-xl text-xs font-bold text-farmGreen-950 placeholder-gray-400 outline-none transition-all" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto scrollbar-none shrink-0">
            {[
              { id: 'timeline', label: 'Timeline', icon: Clock      },
              { id: 'card',     label: 'Cards',    icon: LayoutGrid },
              { id: 'table',    label: 'Table',    icon: TableIcon  },
              { id: 'kanban',   label: 'Kanban',   icon: Kanban     },
            ].map(vm => {
              const Icon = vm.icon; const active = viewMode === vm.id;
              return (
                <button key={vm.id} onClick={() => setViewMode(vm.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    active ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200/60' : 'text-gray-500 hover:text-emerald-900 hover:bg-white/50'
                  }`}>
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span>{vm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* District Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {allDistricts.map(d => (
            <button key={d} onClick={() => setDistrictFilter(d)}
              className={`px-3 py-1 rounded-full text-[10px] font-black border whitespace-nowrap cursor-pointer transition-all ${
                districtFilter === d ? 'bg-amber-400 text-slate-900 border-amber-500'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-amber-50 hover:border-amber-300'
              }`}>
              {d === 'All' ? '🌐 All' : `📍 ${d}`}
              {d !== 'All' && ` (${orders.filter(o => detectDistrict(o.customerAddress, o.id) === d).length})`}
            </button>
          ))}
        </div>

        {/* Batch action bar */}
        {batchMode && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-xs font-black text-amber-900">{batchSelected.size} selected</span>
            <select value={batchStatus} onChange={e => setBatchStatus(e.target.value)}
              className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-black text-amber-900 outline-none cursor-pointer">
              {STATUS_STEPS.map(s => <option key={s.key}>{s.key}</option>)}
            </select>
            <button onClick={handleBatchUpdate} disabled={batchSelected.size === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-black cursor-pointer disabled:opacity-40 active:scale-95 transition-all">
              <ArrowUpCircle className="w-3.5 h-3.5 text-amber-300" /> Apply
            </button>
            <button onClick={() => setBatchSelected(new Set(filteredOrders.map(o => o.id)))}
              className="text-xs font-black text-amber-700 hover:underline cursor-pointer">Select All</button>
            <button onClick={() => setBatchSelected(new Set())}
              className="text-xs font-black text-gray-500 hover:underline cursor-pointer">Clear</button>
          </div>
        )}
      </div>

      {/* ══ TIMELINE ══ */}
      {viewMode === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-black text-sm text-farmGreen-950">Select Order ({filteredOrders.length})</h3>
              <span className="text-[11px] text-farmMuted font-bold">Click to manage</span>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredOrders.map(del => {
                const isSel = selectedOrder?.id === del.id;
                const meta = getMeta(del.id);
                return (
                  <div key={del.id} className={`relative rounded-2xl border transition-all ${isSel ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-300' : 'bg-white border-gray-100 hover:border-emerald-200'}`}>
                    {batchMode && (
                      <button onClick={() => toggleBatchSelect(del.id)} className="absolute left-3 top-4 cursor-pointer z-10">
                        {batchSelected.has(del.id) ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-gray-300" />}
                      </button>
                    )}
                    <button onClick={() => !batchMode && setSelectedOrder(del)} className={`w-full text-left p-4 space-y-2 ${batchMode ? 'pl-9' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-xs text-farmGreen-950 font-mono">{del.id}</span>
                        <div className="flex items-center gap-1.5">
                          {meta.isPriority && <Flag className="w-3 h-3 text-rose-500" />}
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${STATUS_COLOR[del.status] || 'bg-gray-100'}`}>{del.status}</span>
                        </div>
                      </div>
                      <div className="text-xs text-farmGreen-950 font-extrabold truncate">{del.customerName} · {del.customerAddress}</div>
                      <div className="text-[10px] font-black text-amber-700">📍 {detectDistrict(del.customerAddress, del.id)}</div>
                      <div className="text-[11px] text-farmMuted flex items-center justify-between pt-1 border-t border-gray-100 font-bold">
                        <span>Window: {del.deliveryWindow || 'Express Morning'}</span>
                        <span className="font-black text-emerald-800 font-mono">₹{(del.fee || 45) + (del.tip || 15)}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedOrder ? (
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <OrderDetailPanel order={selectedOrder} />
              </div>
              <AuditLog order={selectedOrder} />
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white p-12 rounded-3xl text-center border border-gray-100 text-farmMuted font-bold">
              Select an order from the list to manage its lifecycle.
            </div>
          )}
        </div>
      )}

      {/* ══ CARDS ══ */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {filteredOrders.map(del => {
            const meta = getMeta(del.id);
            return (
              <div key={del.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {batchMode && (
                      <button onClick={() => toggleBatchSelect(del.id)} className="cursor-pointer">
                        {batchSelected.has(del.id) ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-gray-300" />}
                      </button>
                    )}
                    <span className="font-black text-sm text-farmGreen-950 font-mono">{del.id}</span>
                    {meta.isPriority && <Flag className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${STATUS_COLOR[del.status] || 'bg-gray-100'}`}>{del.status}</span>
                </div>
                <div className="text-xs font-extrabold text-farmGreen-950">{del.customerName}</div>
                <div className="text-[11px] text-gray-600 font-bold bg-gray-50 p-2.5 rounded-xl border border-gray-100">{del.customerAddress}</div>
                <div className="text-[10px] font-black text-amber-700">📍 {detectDistrict(del.customerAddress, del.id)}</div>
                <LiveTimer acceptedAt={del.acceptedAt} status={del.status} />
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                  <span className="font-black text-base text-emerald-800 font-mono">₹{(del.fee || 45) + (del.tip || 15)}</span>
                  <button onClick={() => { setSelectedOrder(del); setViewMode('timeline'); }}
                    className="px-3.5 py-1.5 bg-emerald-800 text-white text-xs font-black rounded-xl cursor-pointer hover:bg-emerald-900 active:scale-95 transition-all">
                    Manage 🔄
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ TABLE ══ */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-farmMuted tracking-wider">
                <tr>
                  {batchMode && <th className="p-4 w-10"></th>}
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Address / District</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Flags</th>
                  <th className="p-4">Payout</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(del => {
                  const meta = getMeta(del.id);
                  return (
                    <tr key={del.id} className="hover:bg-emerald-50/40 transition-colors">
                      {batchMode && (
                        <td className="p-4">
                          <button onClick={() => toggleBatchSelect(del.id)} className="cursor-pointer">
                            {batchSelected.has(del.id) ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-gray-300" />}
                          </button>
                        </td>
                      )}
                      <td className="p-4 font-black text-xs font-mono">{del.id}</td>
                      <td className="p-4 font-extrabold text-farmGreen-950">{del.customerName}</td>
                      <td className="p-4 text-gray-700 font-medium">
                        <div>{del.customerAddress}</div>
                        <div className="text-[10px] font-black text-amber-700">📍 {detectDistrict(del.customerAddress, del.id)}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${STATUS_COLOR[del.status] || 'bg-gray-100'}`}>{del.status}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {meta.isPriority && <Flag className="w-3.5 h-3.5 text-rose-500" />}
                          {meta.proofPhoto && <Camera className="w-3.5 h-3.5 text-violet-500" />}
                          {(meta.notes || []).length > 0 && <StickyNote className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                      </td>
                      <td className="p-4 font-black text-sm text-emerald-800 font-mono">₹{(del.fee || 45) + (del.tip || 15)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => { setSelectedOrder(del); setViewMode('timeline'); }}
                          className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-emerald-900 active:scale-95 transition-all">
                          Manage 🔄
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ KANBAN ══ */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          {STATUS_STEPS.map(col => {
            const colOrders = filteredOrders.filter(o => o.status === col.key);
            const Icon = col.icon;
            return (
              <div key={col.key} className="bg-gray-50 p-4 rounded-3xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 text-${col.color}-600`} />
                    <span className="font-black text-xs text-farmGreen-950">{col.key}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-emerald-900 text-[10px] font-black border border-gray-200">{colOrders.length}</span>
                </div>
                <div className="space-y-3 max-h-[480px] overflow-y-auto scrollbar-thin">
                  {colOrders.map(ord => {
                    const meta = getMeta(ord.id);
                    const stepIdx = STATUS_STEPS.findIndex(s => s.key === ord.status);
                    const nextStep = STATUS_STEPS[stepIdx + 1] || null;
                    return (
                      <div key={ord.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-xs font-mono">{ord.id}</span>
                          <div className="flex items-center gap-1">
                            {meta.isPriority && <Flag className="w-3 h-3 text-rose-500" />}
                            <span className="font-black text-xs text-emerald-800 font-mono">₹{(ord.fee || 45) + (ord.tip || 15)}</span>
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-gray-800">{ord.customerName}</div>
                        <div className="text-[10px] text-gray-500 truncate">{ord.customerAddress}</div>
                        <div className="text-[10px] font-black text-amber-700">📍 {detectDistrict(ord.customerAddress, ord.id)}</div>
                        {nextStep && (
                          <button onClick={() => handleStepClick(ord, nextStep.key)}
                            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] font-black cursor-pointer active:scale-95 transition-all">
                            <ChevronRight className="w-3.5 h-3.5" /> Move to {nextStep.label}
                          </button>
                        )}
                        {['Accepted','Picked Up','Out for Delivery'].includes(ord.status) && (
                          <button onClick={() => openModal('failed', ord.id)}
                            className="w-full flex items-center justify-center gap-1 px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-[10px] font-black cursor-pointer transition-all">
                            <XCircle className="w-3 h-3" /> Report Failure
                          </button>
                        )}
                        {ord.status === 'Failed' && (
                          <button onClick={() => openModal('retry', ord.id)}
                            className="w-full flex items-center justify-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-[10px] font-black cursor-pointer transition-all">
                            <Repeat2 className="w-3 h-3" /> Retry Delivery
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {colOrders.length === 0 && <div className="py-8 text-center text-[11px] text-gray-400 font-bold">No orders</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ MODALS ══ */}

      {/* Failure Modal */}
      {showFailedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-rose-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">Report Delivery Failure</h3>
                  <p className="text-xs text-farmMuted font-bold">{targetOrderId}</p>
                </div>
              </div>
              <button onClick={() => setShowFailedModal(false)} className="p-1.5 hover:bg-gray-100 rounded-xl cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleMarkFailed} className="space-y-4">
              <div>
                <label className="text-xs font-black text-farmGreen-950 block mb-1.5">Primary Reason</label>
                <select value={failureReason} onChange={e => setFailureReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl outline-none">
                  {FAILURE_REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-farmGreen-950 block mb-1.5">Re-delivery Slot <span className="font-bold text-farmMuted">(optional)</span></label>
                <select value={retrySlot} onChange={e => setRetrySlot(e.target.value)}
                  className="w-full p-3 bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 rounded-xl outline-none">
                  <option value="">— No retry needed —</option>
                  {DELIVERY_SLOTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-farmGreen-950 block mb-1.5">Additional Notes (optional)</label>
                <textarea rows={3} value={failureNotes} onChange={e => setFailureNotes(e.target.value)}
                  placeholder="e.g. Attempted delivery twice, door bell not working..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-xs rounded-xl outline-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowFailedModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-black text-xs rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl cursor-pointer active:scale-95 transition-all shadow-md">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Retry Modal */}
      {showRetryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-xl"><Repeat2 className="w-5 h-5 text-amber-700" /></div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">Retry Delivery</h3>
                  <p className="text-xs text-farmMuted font-bold">{targetOrderId}</p>
                </div>
              </div>
              <button onClick={() => setShowRetryModal(false)} className="p-1.5 hover:bg-gray-100 rounded-xl cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleRetry} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-farmGreen-950 block">Select Re-delivery Slot</label>
                {DELIVERY_SLOTS.map(slot => (
                  <label key={slot} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${retrySlot === slot ? 'bg-amber-50 border-amber-400' : 'bg-gray-50 border-gray-200 hover:border-amber-200'}`}>
                    <input type="radio" name="retrySlot" value={slot} checked={retrySlot === slot} onChange={() => setRetrySlot(slot)} className="accent-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-farmGreen-950">{slot}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowRetryModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-black text-xs rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl cursor-pointer active:scale-95 transition-all">Schedule Retry 🔁</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Proof Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 border border-violet-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-100 rounded-xl"><Camera className="w-5 h-5 text-violet-700" /></div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">Upload Delivery Proof</h3>
                  <p className="text-xs text-farmMuted font-bold">{targetOrderId}</p>
                </div>
              </div>
              <button onClick={() => setShowPhotoModal(false)} className="p-1.5 hover:bg-gray-100 rounded-xl cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e.target.files?.[0])} />
            {photoPreview && <img src={photoPreview} alt="preview" className="w-full max-h-40 object-cover rounded-2xl border border-violet-200" />}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { photoRef.current.setAttribute('capture','environment'); photoRef.current.click(); }}
                className="flex flex-col items-center gap-2 p-4 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-2xl cursor-pointer transition-all">
                <Camera className="w-6 h-6 text-violet-700" />
                <span className="text-xs font-black text-violet-900">Take Photo</span>
              </button>
              <button onClick={() => { photoRef.current.removeAttribute('capture'); photoRef.current.click(); }}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-gray-600" />
                <span className="text-xs font-black text-gray-700">From Gallery</span>
              </button>
            </div>
            <button onClick={() => setShowPhotoModal(false)} className="w-full py-2.5 bg-gray-100 text-gray-700 font-black text-xs rounded-xl cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-xl"><StickyNote className="w-5 h-5 text-amber-700" /></div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">Add Private Note</h3>
                  <p className="text-xs text-farmMuted font-bold">{targetOrderId} — only visible to you</p>
                </div>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="p-1.5 hover:bg-gray-100 rounded-xl cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddNote} className="space-y-4">
              <textarea rows={4} value={noteText} onChange={e => setNoteText(e.target.value)} autoFocus
                placeholder="e.g. Customer prefers back gate, dog at front door..."
                className="w-full p-3 bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 rounded-2xl outline-none resize-none" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowNoteModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-black text-xs rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2">
                  <StickyNote className="w-3.5 h-3.5" /> Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl"><MessageSquare className="w-5 h-5 text-emerald-700" /></div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">Quick SMS</h3>
                  <p className="text-xs text-farmMuted font-bold">{targetOrderId}</p>
                </div>
              </div>
              <button onClick={() => setShowSmsModal(false)} className="p-1.5 hover:bg-gray-100 rounded-xl cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <textarea rows={4} value={smsText} onChange={e => setSmsText(e.target.value)}
              className="w-full p-3 bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 rounded-2xl outline-none resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setShowSmsModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-black text-xs rounded-xl cursor-pointer">Cancel</button>
              <a href={`sms:${orders.find(o=>o.id===targetOrderId)?.customerPhone || ''}?body=${encodeURIComponent(smsText)}`}
                onClick={() => { setShowSmsModal(false); toast('SMS Launched', 'Opening SMS app.'); }}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" /> Open SMS App
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderStatusView;
