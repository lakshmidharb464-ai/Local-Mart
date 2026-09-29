import React from 'react';
import { 
  Truck, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  Navigation, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
  KeyRound,
  Check,
  BatteryCharging,
  Gauge,
  Calendar,
  Package
} from 'lucide-react';

/* --- Tiny reusable SVG area sparkline --- */
const Sparkline = ({ data = [5, 8, 7, 10, 9, 12, 14], color = '#10B981', gradientId }) => {
  const w = 70, h = 30;
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
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="2.5" fill={color} stroke="white" strokeWidth="1" />
    </svg>
  );
};

export const DeliveryDashboardView = ({ 
  orders = [], 
  earnings = { todayTotal: 0 }, 
  profile = {}, 
  onUpdateStatus, 
  setActiveTab, 
  setSelectedOrder 
}) => {
  const todaysDeliveries = orders.filter(o => o.assignedTime?.includes('Today') || o.id);
  const pendingDeliveries = orders.filter(o => ['Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'].includes(o.status));
  const completedDeliveries = orders.filter(o => o.status === 'Delivered');
  const activeOrder = orders.find(o => o.status === 'Out for Delivery') || orders.find(o => o.status === 'Picked Up') || orders.find(o => o.status === 'Accepted');

  const handleAction = (order, targetStatus) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
    } catch {
      // Ignore vibration errors
    }
    if (onUpdateStatus) onUpdateStatus(order.id, targetStatus);
  };

  return (
    <div className="space-y-6 pb-12 font-display animate-fadeIn">
      
      {/* Glassmorphism Hero Banner */}
      <div className="bg-gradient-to-r from-[#071f15] via-[#0B3D2E] to-[#0D4233] text-white p-6 sm:p-8 rounded-3xl shadow-farm-lg border border-white/[0.08] relative overflow-hidden">
        {/* Animated glowing orbs */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/[0.1] rounded-full blur-3xl pointer-events-none animate-orbFloat" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-500/[0.08] rounded-full blur-3xl pointer-events-none animate-orbFloat" style={{ animationDelay: '2s' }} />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-xs font-black text-emerald-300 border border-emerald-400/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span>{profile.isOnline !== false ? 'Active Online Duty • Ready for Dispatch' : 'Offline Mode'}</span>
            </div>
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
              Welcome back, {profile.name || 'Rohan Sharma'}! ⚡
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100/90 font-semibold pt-1">
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-sm border border-white/10">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                {profile.vehicleType || 'EV Scooter (Zero Emission)'}
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-sm border border-white/10 tabular-nums">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                Battery: <strong className="text-emerald-300">88% (Est. 65 km)</strong>
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-sm border border-white/10 tabular-nums">
                ⭐ Rating: <strong className="text-amber-300">{profile.rating || '4.9'} / 5.0</strong>
              </span>
            </div>
          </div>

          {/* Today's Earnings Card */}
          <div className="bg-white/[0.08] backdrop-blur-md p-5 rounded-3xl border border-white/15 text-right min-w-[220px] shrink-0 shadow-lg space-y-1">
            <div className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Today's Total Payout</div>
            <div className="font-black text-3xl text-white font-mono tabular-nums">
              ₹{(earnings.todayTotal || 345).toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-300 font-extrabold flex items-center justify-end gap-1 tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{todaysDeliveries.length} Trips completed today</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <div className="glass-surface p-5 rounded-3xl border border-farmGreen-200/40 shadow-glass flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Assigned Tasks</div>
            <div className="font-black text-2xl text-farmGreen-950">{todaysDeliveries.length}</div>
            <div className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active for today</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-black shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <Sparkline data={[4, 6, 5, 8, 7, 9, todaysDeliveries.length]} color="#10B981" gradientId="spk-assigned" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-surface p-5 rounded-3xl border border-amber-200/50 shadow-glass flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Pending Tasks</div>
            <div className="font-black text-2xl text-amber-700">{pendingDeliveries.length}</div>
            <div className="text-[11px] text-amber-700 font-extrabold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Requires action</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-black shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <Sparkline data={[2, 4, 3, 5, 3, 4, pendingDeliveries.length]} color="#F59E0B" gradientId="spk-pending" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-surface p-5 rounded-3xl border border-blue-200/50 shadow-glass flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Delivered Orders</div>
            <div className="font-black text-2xl text-blue-700">{completedDeliveries.length}</div>
            <div className="text-[11px] text-blue-700 font-extrabold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>100% On-time</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-11 h-11 rounded-2xl bg-blue-100/80 text-blue-800 flex items-center justify-center font-black shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <Sparkline data={[1, 3, 5, 4, 6, 8, completedDeliveries.length]} color="#3B82F6" gradientId="spk-delivered" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-surface p-5 rounded-3xl border border-emerald-200/60 shadow-glass flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Total Payout + Tips</div>
            <div className="font-black text-2xl text-emerald-900 font-mono">₹{earnings.todayTotal || 345}</div>
            <div className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Base fare + tips</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-black shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
            <Sparkline data={[120, 180, 240, 210, 290, 310, earnings.todayTotal || 345]} color="#059669" gradientId="spk-earnings" />
          </div>
        </div>

      </div>

      {/* Active Order Spotlight Card */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-[#071f15] via-[#0B3D2E] to-[#0D4233] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-400/30 space-y-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-400/[0.08] rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-black text-xs tracking-wider animate-pulse flex items-center gap-1 shadow-sm">
                <Zap className="w-3.5 h-3.5" />
                <span>ACTIVE TASK SPOTLIGHT</span>
              </span>
              <span className="font-mono font-black text-base text-white">{activeOrder.id} ({activeOrder.orderId})</span>
            </div>
            <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full backdrop-blur-sm">
              ● {activeOrder.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            <div className="space-y-2 text-xs bg-white/[0.04] p-4 rounded-2xl border border-white/[0.06] flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-emerald-300 font-black uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Farm Pickup Point</span>
                </div>
                <div className="font-black text-sm text-white">{activeOrder.farmName}</div>
                <div className="text-emerald-100/80 font-medium">
                  {activeOrder.farmAddress}
                </div>
              </div>
              <div className="pt-2">
                <a
                  href={`tel:${activeOrder.farmPhone || '+919876543210'}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[11px] font-black transition-all active:scale-95"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Farmer</span>
                </a>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-white/[0.04] p-4 rounded-2xl border border-white/[0.06] flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-amber-300 font-black uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Customer Destination</span>
                </div>
                <div className="font-black text-sm text-white">{activeOrder.customerName}</div>
                <div className="text-amber-100/80 font-medium">
                  {activeOrder.customerAddress}
                </div>
              </div>
              <div className="pt-2">
                <a
                  href={`tel:${activeOrder.customerPhone || '+919123456780'}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-[11px] font-black transition-all active:scale-95"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Customer</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 text-xs font-bold">
              <div>
                <span className="text-emerald-200/80">Distance:</span> <strong className="text-white font-mono">{activeOrder.distance || '2.8 km'}</strong>
              </div>
              <div>
                <span className="text-emerald-200/80">Est. Payout:</span> <strong className="text-amber-300 font-mono font-black text-sm">₹{(activeOrder.fee || 45) + (activeOrder.tip || 15)}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (setSelectedOrder) setSelectedOrder(activeOrder);
                  if (setActiveTab) setActiveTab('tracking');
                }}
                className="px-4 py-2 rounded-2xl bg-white/[0.1] hover:bg-white/[0.2] text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border border-white/15 active:scale-95 shadow-md"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Live Map Tracking</span>
              </button>

              {activeOrder.status === 'Out for Delivery' && (
                <button
                  onClick={() => handleAction(activeOrder, 'Delivered')}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 text-xs font-black transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>Mark as Delivered</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Standard Delivery Execution Workflow */}
      <div className="glass-surface rounded-3xl p-5 sm:p-6 border border-farmGreen-200/30 shadow-glass space-y-4">
        <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Standard Delivery Execution Workflow</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
          {[
            { step: '1', title: 'Assigned', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
            { step: '2', title: 'Accept', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { step: '3', title: 'Pickup', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
            { step: '4', title: 'Start', icon: Truck, color: 'text-teal-600', bg: 'bg-teal-50' },
            { step: '5', title: 'Navigate', icon: Navigation, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { step: '6', title: 'Arrive', icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-50' },
            { step: '7', title: 'OTP PIN', icon: KeyRound, color: 'text-amber-700', bg: 'bg-amber-100' },
            { step: '8', title: 'Earned', icon: IndianRupee, color: 'text-emerald-700', bg: 'bg-emerald-100' },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="p-3 rounded-2xl border border-farmSage-100/40 bg-white/60 flex flex-col items-center hover:bg-emerald-50/60 transition-colors">
                <div className={`p-2 rounded-xl ${item.bg} ${item.color} mb-1.5`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-farmMuted font-black uppercase">Step {item.step}</span>
                <span className="text-xs font-black text-farmGreen-950 mt-0.5">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Deliveries Quick List */}
      <div className="glass-surface rounded-3xl p-6 border border-farmGreen-200/30 shadow-glass space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base sm:text-lg text-farmGreen-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Assigned & Pending Orders ({pendingDeliveries.length})</span>
          </h3>
          <button 
            onClick={() => {
              if (setActiveTab) setActiveTab('deliveries');
            }}
            className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {pendingDeliveries.length === 0 ? (
            <div className="text-center py-10 text-farmMuted text-xs font-bold">
              No pending deliveries at the moment! All tasks are clear.
            </div>
          ) : (
            pendingDeliveries.map((del) => (
              <div key={del.id} className="p-4 rounded-2xl border border-farmSage-200/50 bg-white/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-300 transition-all shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-farmGreen-950 font-mono">{del.id}</span>
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {del.priority || 'Express'}
                    </span>
                    <span className="text-xs text-farmMuted font-bold">• {del.distance || '2.8 km'}</span>
                  </div>
                  <div className="text-xs text-farmGreen-950 font-bold">
                    <strong>Pickup:</strong> {del.farmName} ➔ <strong>Delivery:</strong> {del.customerName} ({del.customerAddress})
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-farmSage-100/40">
                  <span className="font-black text-sm text-emerald-800 font-mono">
                    +₹{(del.fee || 45) + (del.tip || 15)}
                  </span>
                  
                  {del.status === 'Assigned' && (
                    <button
                      onClick={() => handleAction(del, 'Accepted')}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      Accept Task
                    </button>
                  )}
                  {del.status === 'Accepted' && (
                    <button
                      onClick={() => handleAction(del, 'Picked Up')}
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 rounded-xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      Confirm Pickup
                    </button>
                  )}
                  {del.status === 'Picked Up' && (
                    <button
                      onClick={() => handleAction(del, 'Out for Delivery')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      Start Delivery
                    </button>
                  )}
                  {del.status === 'Out for Delivery' && (
                    <button
                      onClick={() => handleAction(del, 'Delivered')}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default DeliveryDashboardView;
