import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Compass, 
  ExternalLink, 
  Truck, 
  Radio, 
  Share2, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Zap, 
  AlertTriangle, 
  Copy, 
  Check, 
  Battery, 
  Signal, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Camera, 
  KeyRound, 
  ShoppingBag, 
  X, 
  ShieldAlert,
  AlertOctagon, 
  CornerUpRight, 
  ArrowUp,
  Sparkles
} from 'lucide-react';

export const DeliveryTracking = ({ orders = [], selectedOrder, setSelectedOrder, onUpdateStatus, showToast }) => {
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Failed');
  const currentOrder = (selectedOrder && orders.find(o => o.id === selectedOrder.id))
    ? selectedOrder
    : activeOrders[0] || orders[0];

  // Map & Simulation States
  const [mapMode, setMapMode] = useState('dark'); // 'dark' | 'satellite' | 'terrain'
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [progress, setProgress] = useState(35); // 0 to 100% position on route
  const [showTraffic, setShowTraffic] = useState(true);
  const [selectedWaypoint, setSelectedWaypoint] = useState(null); // 'farm' | 'rider' | 'customer'
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);

  // Rider Action States
  const [hasArrived, setHasArrived] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  // Modals State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [codConfirmed, setCodConfirmed] = useState(false);

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueReason, setIssueReason] = useState('Customer Phone Unreachable');
  const [issueNotes, setIssueNotes] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Animated Route Progress Interval
  useEffect(() => {
    let interval;
    if (isPlaying && currentOrder && currentOrder.status === 'Out for Delivery') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            return 98; // Stay near destination
          }
          return prev + 0.5 * simSpeed;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, currentOrder]);

  // Reset arrival & checklist on order change
  useEffect(() => {
    setHasArrived(false);
    setCheckedItems({});
    setOtpInput('');
    setOtpError('');
    setPhotoUploaded(false);
    setCodConfirmed(false);
    setProgress(currentOrder?.status === 'Out for Delivery' ? 45 : currentOrder?.status === 'Picked Up' ? 10 : 0);
  }, [currentOrder?.id]);

  const handleOpenGoogleMaps = () => {
    if (!currentOrder) return;
    const destination = encodeURIComponent(currentOrder.customerAddress);
    const origin = encodeURIComponent(currentOrder.farmAddress);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=bicycling`;
    window.open(mapsUrl, '_blank');
  };

  const handleCopyAddress = () => {
    if (!currentOrder) return;
    navigator.clipboard.writeText(currentOrder.customerAddress);
    setCopiedAddress(true);
    if (showToast) showToast('Address Copied! 📋', 'Customer delivery address copied to clipboard.');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleMarkArrived = () => {
    setHasArrived(true);
    if (showToast) {
      showToast('Arrival Notification Sent! 🔔', `Customer ${currentOrder.customerName} alerted of rider arrival.`);
    }
  };

  const handleToggleItemCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleOpenOtpModal = () => {
    setOtpInput('');
    setOtpError('');
    setShowOtpModal(true);
  };

  const handleVerifyOtpAndComplete = (e) => {
    e.preventDefault();
    if (otpInput.length !== 4) {
      setOtpError('Please enter a valid 4-digit customer OTP PIN (e.g. 4920).');
      return;
    }
    if (currentOrder?.paymentType?.includes('Cash') && !codConfirmed) {
      setOtpError('Please confirm Cash Collection before completing COD order.');
      return;
    }

    onUpdateStatus(currentOrder.id, 'Delivered');
    setShowOtpModal(false);
    if (showToast) {
      showToast('Delivery Completed! 🎉', `Order ${currentOrder.id} successfully handed to ${currentOrder.customerName}.`);
    }
  };

  const handleReportIssueSubmit = (e) => {
    e.preventDefault();
    const finalReason = issueNotes ? `${issueReason}: ${issueNotes}` : issueReason;
    onUpdateStatus(currentOrder.id, 'Failed', finalReason);
    setShowIssueModal(false);
    setIssueNotes('');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://localfarm.in/track/${currentOrder?.id || 'DEL-991'}`);
    setCopiedShareLink(true);
    if (showToast) showToast('Tracking Link Copied! 📋', 'Live tracking URL copied to clipboard.');
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  // Turn-by-turn route steps with Chittoor District AP regional route support
  const isChittoorDistrict = currentOrder?.district?.includes('Chittoor') || 
    currentOrder?.customerAddress?.includes('Chittoor') || 
    currentOrder?.customerAddress?.includes('Andhra Pradesh') || 
    currentOrder?.id?.startsWith('DEL-CTR');

  const routeSteps = isChittoorDistrict ? [
    {
      step: 1,
      instruction: `Depart from ${currentOrder?.farmName || 'Palamaner Agro Corridor'}`,
      detail: 'Head East on NH-140 Palamaner - Chittoor Express Corridor (1.2 km)',
      distance: '1.2 km',
      icon: ArrowUp,
      segmentPct: 15
    },
    {
      step: 2,
      instruction: 'Merge straight onto Chittoor Bypass & High-Speed Highway Line',
      detail: 'Continue past Kanipakam Cross Road towards Town Center (4.3 km)',
      distance: '4.3 km',
      icon: CornerUpRight,
      segmentPct: 55
    },
    {
      step: 3,
      instruction: `Arrive at Landmark: ${currentOrder?.customerLandmark || 'Near Chittoor Railway Station'}`,
      detail: 'Turn into destination lane at MSR Circle, Chittoor Town, Andhra Pradesh',
      distance: '0.9 km',
      icon: MapPin,
      segmentPct: 90
    }
  ] : [
    {
      step: 1,
      instruction: `Depart from ${currentOrder?.farmName || 'Farm Hub'}`,
      detail: 'Head South towards Baner Main Road (500m)',
      distance: '0.5 km',
      icon: ArrowUp,
      segmentPct: 15
    },
    {
      step: 2,
      instruction: 'Turn Right onto University Flyover & Kothrud Bypass',
      detail: 'Merge smoothly and stay in middle lane (2.8 km)',
      distance: '2.8 km',
      icon: CornerUpRight,
      segmentPct: 55
    },
    {
      step: 3,
      instruction: `Arrive at Landmark: ${currentOrder?.customerLandmark || 'Customer Landmark'}`,
      detail: 'Turn right at Ideal Colony Ground gate into building lane',
      distance: '0.9 km',
      icon: MapPin,
      segmentPct: 90
    }
  ];

  // Dynamic calculated remaining metrics
  const totalDistanceKm = parseFloat(currentOrder?.distance || '4.2');
  const remainingDistanceKm = Math.max(0, (totalDistanceKm * (1 - progress / 100))).toFixed(1);
  const remainingEtaMins = Math.max(1, Math.round((parseFloat(currentOrder?.eta || '18')) * (1 - progress / 100)));

  return (
    <div className="space-y-6 pb-12 font-display animate-fadeIn">

      {/* Glassmorphism Header Bar */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-lg relative">
              <Navigation className="w-7 h-7 text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE TELEMETRY • EV SCOOTER
                </span>
                {isChittoorDistrict && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs">
                    📍 Chittoor District (AP)
                  </span>
                )}
                {currentOrder?.priority && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase border border-white/20">
                    {currentOrder.priority}
                  </span>
                )}
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                Live GPS Delivery Tracking
              </h1>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                {isChittoorDistrict 
                  ? 'NH-140 Palamaner - Chittoor Town Express Corridor • Chittoor District, AP' 
                  : 'Turn-by-turn route navigation, EV telemetry & customer OTP delivery PIN'}
              </p>
            </div>
          </div>

          {/* Order Selector & Quick Action Bar */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {orders.length > 0 && (
              <div className="min-w-[220px]">
                <label className="text-[10px] font-black text-emerald-300 uppercase block mb-1">Active Order Selection</label>
                <select
                  value={currentOrder?.id || ''}
                  onChange={(e) => {
                    const found = orders.find(o => o.id === e.target.value);
                    if (found && setSelectedOrder) setSelectedOrder(found);
                  }}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-white rounded-xl px-3.5 py-2 outline-none cursor-pointer shadow-xs"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id} className="text-slate-950 font-bold">
                      {o.id} — {o.customerName} ({o.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 sm:pt-4">
              <button
                onClick={() => setShowShareModal(true)}
                title="Share Live Tracking"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4 text-emerald-300" />
              </button>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'Mute Voice Guide' : 'Enable Voice Guide'}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  voiceEnabled ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40' : 'bg-white/10 text-white/50 border-white/20'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  if (showToast) showToast('Emergency SOS Alert Sent 🚨', 'Dispatch control & hub manager notified.');
                }}
                title="Emergency SOS Alert"
                className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 transition-all cursor-pointer shadow-xs"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column (2 Cols): Interactive Map & Telemetry Dashboard */}
          <div className="lg:col-span-2 space-y-6">

            {/* Interactive Live Map Simulator Box */}
            <div className={`rounded-3xl overflow-hidden border shadow-xl relative min-h-[460px] flex flex-col justify-between p-5 transition-all ${
              mapMode === 'satellite' ? 'bg-slate-950 border-slate-800' :
              mapMode === 'terrain' ? 'bg-emerald-950 border-emerald-900' :
              'bg-[#061408] border-emerald-900/60'
            }`}>

              {/* Map Background Grid Visual Layer */}
              <div className={`absolute inset-0 pointer-events-none opacity-30 ${
                mapMode === 'satellite' 
                  ? 'bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]'
                  : mapMode === 'terrain'
                  ? 'bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]'
                  : 'bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:18px_18px]'
              }`} />

              {/* Top Controls Overlay Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-white shadow-md">
                
                {/* Mode Selector Buttons */}
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 text-xs font-black">
                  <button
                    onClick={() => setMapMode('dark')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                      mapMode === 'dark' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Dark Vector
                  </button>
                  <button
                    onClick={() => setMapMode('satellite')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                      mapMode === 'satellite' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Satellite
                  </button>
                  <button
                    onClick={() => setMapMode('terrain')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                      mapMode === 'terrain' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Terrain
                  </button>
                </div>

                {/* Simulation Control Bar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isPlaying ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause Motion' : 'Play Live GPS'}</span>
                  </button>

                  <button
                    onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 5 : 1)}
                    className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 text-[11px] font-mono font-black rounded-xl cursor-pointer"
                  >
                    {simSpeed}x Speed
                  </button>

                  <button
                    onClick={() => setProgress(10)}
                    title="Reset Vehicle to Pickup"
                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setShowTraffic(!showTraffic)}
                    className={`p-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                      showTraffic ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'bg-white/10 text-slate-400 border-white/15'
                    }`}
                    title="Toggle Live Traffic Layer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Regional GPS Lock Banner */}
              <div className="relative z-10 my-2 px-4 py-2 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 text-xs flex flex-wrap items-center justify-between gap-2 text-white shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono font-black text-[11px] text-emerald-300">
                    {isChittoorDistrict 
                      ? 'GPS LOCK: Chittoor District (AP) Corridor • 13.2172° N, 79.1003° E' 
                      : 'GPS LOCK: Express Route Corridor • 18.5204° N, 73.8567° E'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-amber-300 font-black">
                  {currentOrder?.route || (isChittoorDistrict ? 'NH-140 Palamaner-Chittoor Highway' : 'Express Route')}
                </div>
              </div>

              {/* Main Animated Route Display */}
              <div className="relative z-10 py-8 px-4 my-auto w-full max-w-2xl mx-auto flex flex-col justify-center">

                {/* Status Alert Overlay if arrived */}
                {hasArrived && (
                  <div className="mb-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/50 text-emerald-200 text-xs font-black p-3 rounded-2xl text-center flex items-center justify-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Rider Arrived at Customer Location ({currentOrder.customerName})</span>
                  </div>
                )}

                {/* Waypoints & EV Scooter Dynamic Animated Route Line */}
                <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 py-6 px-2">

                  {/* Connecting Route Line */}
                  <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-3 bg-slate-900 rounded-full overflow-hidden hidden sm:block border border-white/10">
                    {/* Traffic Lines */}
                    {showTraffic && (
                      <div className="absolute inset-0 flex">
                        <div className="w-1/3 h-full bg-emerald-500/80" />
                        <div className="w-1/3 h-full bg-amber-500/80" />
                        <div className="w-1/3 h-full bg-emerald-500/80" />
                      </div>
                    )}
                    {/* Animated Progress Polyline */}
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-500 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                      style={{ width: `${Math.max(5, Math.min(95, progress))}%` }}
                    />
                  </div>

                  {/* Farm Pickup Pin */}
                  <button
                    onClick={() => setSelectedWaypoint(selectedWaypoint === 'farm' ? null : 'farm')}
                    className="relative z-10 flex flex-col items-center group cursor-pointer outline-none"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg border-2 border-white transform group-hover:scale-110 transition-all">
                      <MapPin className="w-7 h-7 text-emerald-200" />
                    </div>
                    <div className="mt-2 bg-slate-900/90 text-white text-[11px] px-3 py-1.5 rounded-xl border border-white/15 shadow-md text-center">
                      <div className="font-black text-emerald-300">Pickup Farm</div>
                      <div className="truncate max-w-[130px] text-slate-300 font-bold">{currentOrder.farmName}</div>
                    </div>
                  </button>

                  {/* Dynamic EV Scooter Vehicle Position */}
                  <div 
                    className="relative z-20 flex flex-col items-center transition-all duration-300 my-4 sm:my-0"
                    style={{
                      transform: window.innerWidth > 640 ? `translateX(${((progress - 50) / 50) * 120}px)` : 'none'
                    }}
                  >
                    <div className="bg-gradient-to-r from-amber-400 to-emerald-500 text-slate-950 px-3.5 py-2 rounded-2xl text-xs font-black shadow-xl border-2 border-white flex items-center gap-2 animate-pulse">
                      <Truck className="w-4 h-4 text-slate-950" />
                      <span>EV Scooter (MH 12 FX 4920)</span>
                    </div>

                    <div className="mt-1 bg-slate-950/90 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border border-amber-400/40 shadow-inner flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-300 animate-spin" />
                      <span>28 km/h • 84% Battery</span>
                    </div>
                  </div>

                  {/* Customer Home Pin */}
                  <button
                    onClick={() => setSelectedWaypoint(selectedWaypoint === 'customer' ? null : 'customer')}
                    className="relative z-10 flex flex-col items-center group cursor-pointer outline-none"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg border-2 border-white transform group-hover:scale-110 transition-all">
                      <Navigation className="w-7 h-7 text-blue-200" />
                    </div>
                    <div className="mt-2 bg-slate-900/90 text-white text-[11px] px-3 py-1.5 rounded-xl border border-white/15 shadow-md text-center">
                      <div className="font-black text-blue-300">Customer Home</div>
                      <div className="truncate max-w-[130px] text-slate-300 font-bold">{currentOrder.customerName}</div>
                    </div>
                  </button>

                </div>

              </div>

              {/* Bottom Address Overlay & Google Maps Link */}
              <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="text-white text-xs space-y-0.5 flex-1 pr-2 font-bold">
                  <div className="text-emerald-300 text-[10px] uppercase font-black tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Destination Address</span>
                  </div>
                  <div className="font-black text-white text-sm truncate">{currentOrder.customerAddress}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyAddress}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black border border-white/15 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleOpenGoogleMaps}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Maps 🗺️</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Live GPS Telemetry Indicator Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
                <div className="text-farmMuted text-[10px] font-black uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Est. Time Remaining</span>
                </div>
                <div className="font-mono font-black text-lg text-farmGreen-950">
                  {remainingEtaMins} mins
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
                <div className="text-farmMuted text-[10px] font-black uppercase flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-blue-500" />
                  <span>Distance Left</span>
                </div>
                <div className="font-mono font-black text-lg text-farmGreen-950">
                  {remainingDistanceKm} km
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
                <div className="text-farmMuted text-[10px] font-black uppercase flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-600" />
                  <span>EV Battery</span>
                </div>
                <div className="font-mono font-black text-lg text-emerald-800">
                  84% (Charge OK)
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
                <div className="text-farmMuted text-[10px] font-black uppercase flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5 text-emerald-500" />
                  <span>GPS Lock Accuracy</span>
                </div>
                <div className="font-mono font-black text-lg text-farmGreen-950">
                  ±1.8m (High)
                </div>
              </div>
            </div>

            {/* Turn-by-Turn Route Guidance Instructions */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600" />
                  <span>Turn-by-Turn GPS Navigation Guidance</span>
                </h3>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Optimal Route Locked
                </span>
              </div>

              <div className="space-y-2.5">
                {routeSteps.map((s, idx) => {
                  const Icon = s.icon;
                  const isSelected = selectedStepIndex === idx;

                  return (
                    <div
                      key={s.step}
                      onClick={() => setSelectedStepIndex(isSelected ? null : idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                          : 'bg-gray-50/80 hover:bg-emerald-50/40 border-gray-200'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        idx === 0 ? 'bg-emerald-100 text-emerald-900' :
                        idx === 1 ? 'bg-amber-100 text-amber-900' :
                        'bg-emerald-800 text-white'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1">
                        <div className="font-extrabold text-farmGreen-950 text-xs flex items-center justify-between">
                          <span>{s.instruction}</span>
                          <span className="text-farmMuted text-[11px] font-mono font-black">{s.distance}</span>
                        </div>
                        <div className="text-farmMuted text-[11px] font-medium mt-0.5">{s.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Produce Package Item Verification Checklist */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span>Produce Package Item Verification</span>
                </h3>
                <span className="text-xs text-farmMuted font-bold">
                  {Object.keys(checkedItems).filter(k => checkedItems[k]).length} / {Array.isArray(currentOrder.items) ? currentOrder.items.length : 1} Checked
                </span>
              </div>

              <div className="space-y-2">
                {Array.isArray(currentOrder.items) ? (
                  currentOrder.items.map((item, idx) => {
                    const isChecked = !!checkedItems[idx];

                    return (
                      <label
                        key={idx}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                          isChecked ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50/80 border-gray-200 hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleItemCheck(idx)}
                            className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                          />
                          <span className={`text-xs font-extrabold ${isChecked ? 'line-through text-emerald-800' : 'text-farmGreen-950'}`}>
                            {item.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-farmMuted font-mono font-bold">{item.qty}</span>
                          <span className="font-black text-emerald-800 font-mono">₹{item.price}</span>
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 font-extrabold text-xs text-farmGreen-950">
                    {currentOrder.items || 'Fresh Produce Package'}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (1 Col): Delivery Controls & Customer Info */}
          <div className="space-y-6">

            {/* Action & Status Workflow Control Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-base text-farmGreen-950">
                  Rider Action Panel
                </h3>
                <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-black text-xs">
                  ● {currentOrder.status}
                </span>
              </div>

              {/* Arrival Alert Button */}
              {!hasArrived ? (
                <button
                  onClick={handleMarkArrived}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Radio className="w-4 h-4 animate-pulse text-slate-950" />
                  <span>Mark as Arrived at Spot 📍</span>
                </button>
              ) : (
                <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-black text-center border border-emerald-200 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Arrival Alert Sent to Customer</span>
                </div>
              )}

              {/* Delivery Workflow Action Controls */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black text-farmGreen-950 uppercase tracking-wider">Order Status Transitions</div>

                {currentOrder.status === 'Assigned' && (
                  <button
                    onClick={() => onUpdateStatus(currentOrder.id, 'Accepted')}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    Accept Delivery Task 🟢
                  </button>
                )}

                {currentOrder.status === 'Accepted' && (
                  <button
                    onClick={() => onUpdateStatus(currentOrder.id, 'Picked Up')}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    Confirm Pickup From Farm 🧺
                  </button>
                )}

                {currentOrder.status === 'Picked Up' && (
                  <button
                    onClick={() => onUpdateStatus(currentOrder.id, 'Out for Delivery')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    Start Delivery 🛵
                  </button>
                )}

                {currentOrder.status === 'Out for Delivery' && (
                  <button
                    onClick={handleOpenOtpModal}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                    <span>OTP Delivery PIN 🔑</span>
                  </button>
                )}

                {currentOrder.status === 'Delivered' && (
                  <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-black border border-emerald-200 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Order Successfully Delivered!</span>
                  </div>
                )}

                {currentOrder.status !== 'Delivered' && (
                  <button
                    onClick={() => setShowIssueModal(true)}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-black cursor-pointer transition-all mt-2 flex items-center justify-center gap-1.5"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Report Delivery Issue / Unable to Deliver</span>
                  </button>
                )}
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="font-black text-sm text-farmGreen-950 border-b border-gray-100 pb-2">
                Customer Details
              </h3>

              <div className="space-y-3 text-xs font-bold">
                <div>
                  <div className="text-farmMuted text-[10px] font-black uppercase">Customer Name</div>
                  <div className="font-extrabold text-sm text-farmGreen-950">{currentOrder.customerName}</div>
                </div>

                <div>
                  <div className="text-farmMuted text-[10px] font-black uppercase">Direct Contact</div>
                  <a
                    href={`tel:${currentOrder.customerPhone || '9876543210'}`}
                    className="mt-1 inline-flex items-center gap-2 text-emerald-800 font-extrabold bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-all shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call {currentOrder.customerPhone || '9876543210'}</span>
                  </a>
                </div>

                <div>
                  <div className="text-farmMuted text-[10px] font-black uppercase">Payment Summary</div>
                  <div className="p-3 rounded-2xl border mt-1 font-extrabold bg-emerald-50 border-emerald-200 text-emerald-950">
                    {currentOrder.paymentType || 'UPI Direct (Paid)'}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 text-farmMuted font-bold">
          No active order available for tracking.
        </div>
      )}

      {/* OTP Delivery Verification Modal */}
      {showOtpModal && currentOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-emerald-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">
                    Verify Customer OTP ({currentOrder.id})
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">Enter 4-digit PIN provided by {currentOrder.customerName}</p>
                </div>
              </div>
              <button onClick={() => setShowOtpModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyOtpAndComplete} className="space-y-4">
              <div className="space-y-1 text-center">
                <label className="text-xs font-black text-farmGreen-950 block">Enter 4-Digit Delivery PIN</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => {
                    setOtpInput(e.target.value.replace(/[^0-9]/g, ''));
                    setOtpError('');
                  }}
                  placeholder="4 9 2 0"
                  className="w-48 mx-auto text-center tracking-[0.5em] text-2xl font-mono font-black p-3 bg-gray-50 border-2 border-emerald-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {otpError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs text-center font-bold">
                  {otpError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-extrabold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Verify OTP & Mark Delivered 🎉</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delivery Issue Modal */}
      {showIssueModal && currentOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-rose-200 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600 pb-3 border-b border-gray-100">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-black text-base text-farmGreen-950">
                  Report Delivery Issue ({currentOrder.id})
                </h3>
                <p className="text-xs text-farmMuted font-bold">Specify cause for unfulfilled delivery</p>
              </div>
            </div>

            <form onSubmit={handleReportIssueSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-farmGreen-950 block">Select Reason</label>
                <select
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-xs font-extrabold rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Customer Phone Unreachable">Customer Phone Unreachable</option>
                  <option value="Premises / Door Locked">Premises / Door Locked</option>
                  <option value="Incorrect Customer Address">Incorrect Customer Address</option>
                  <option value="Customer Refused Order">Customer Refused Order</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-extrabold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 text-white font-black text-xs rounded-xl hover:bg-rose-700 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Submit Issue Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Tracking Link Modal */}
      {showShareModal && currentOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-emerald-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">
                    Share Live Tracking Link
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">Send live GPS tracking link to customer</p>
                </div>
              </div>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-mono break-all text-farmGreen-950 font-bold">
                https://localfarm.in/track/{currentOrder.id}
              </div>

              <button
                onClick={handleCopyShareLink}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                {copiedShareLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedShareLink ? 'Link Copied!' : 'Copy Live Tracking Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DeliveryTracking;
