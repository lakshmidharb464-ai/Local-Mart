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
  Check
} from 'lucide-react';

export const DeliveryDashboardView = ({ orders = [], earnings = { todayTotal: 0 }, profile = {}, onUpdateStatus, setActiveTab, setSelectedOrder }) => {
  const todaysDeliveries = orders.filter(o => o.assignedTime?.includes('Today') || o.id);
  const pendingDeliveries = orders.filter(o => ['Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'].includes(o.status));
  const completedDeliveries = orders.filter(o => o.status === 'Delivered');
  const activeOrder = orders.find(o => o.status === 'Out for Delivery') || orders.find(o => o.status === 'Picked Up') || orders.find(o => o.status === 'Accepted');

  const handleAction = (order, targetStatus) => {
    onUpdateStatus(order.id, targetStatus);
  };

  return (
    <div className="space-y-6 pb-12 font-display animate-fadeIn">
      
      {/* Glassmorphism Hero Banner */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none">
          <Truck className="w-72 h-72 text-white" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-xs font-black text-emerald-300 border border-emerald-400/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profile.isOnline !== false ? 'Active Online Duty • Ready for Dispatch' : 'Offline Mode'}</span>
            </div>
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
              Welcome back, {profile.name || 'Rohan Sharma'}! 🚚
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
              Vehicle: <strong>{profile.vehicleType || 'EV Scooter (Zero Emission)'}</strong> • Hub: <strong>{profile.hubLocation || 'Pune Central'}</strong> • Rating: <strong>⭐ {profile.rating || '4.9'}</strong>
            </p>
          </div>

          {/* Today's Earnings Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-right min-w-[220px] shrink-0 shadow-lg">
            <div className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">Today's Total Payout</div>
            <div className="font-black text-3xl text-white font-mono mt-0.5">
              ₹{(earnings.todayTotal || 345).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-300 font-extrabold mt-1 flex items-center justify-end gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{todaysDeliveries.length} Trips completed today</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 font-black">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Assigned Tasks</div>
            <div className="font-black text-2xl text-farmGreen-950">{todaysDeliveries.length}</div>
            <div className="text-[11px] text-emerald-700 font-extrabold">Active for today</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Pending Tasks</div>
            <div className="font-black text-2xl text-amber-600">{pendingDeliveries.length}</div>
            <div className="text-[11px] text-amber-700 font-extrabold">Requires action</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 font-black">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Delivered Orders</div>
            <div className="font-black text-2xl text-blue-700">{completedDeliveries.length}</div>
            <div className="text-[11px] text-blue-700 font-extrabold">Successfully completed</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 font-black">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-farmMuted">Total Payout + Tips</div>
            <div className="font-black text-2xl text-emerald-800 font-mono">₹{earnings.todayTotal || 345}</div>
            <div className="text-[11px] text-emerald-700 font-extrabold">Base fare + tips</div>
          </div>
        </div>

      </div>

      {/* Active Order Spotlight */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-[#0d2516] to-farmGreen-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-500/30 space-y-4 relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs tracking-wider animate-pulse flex items-center gap-1 shadow-xs">
                <Zap className="w-3.5 h-3.5" />
                <span>ACTIVE TASK SPOTLIGHT</span>
              </span>
              <span className="font-mono font-black text-base text-white">{activeOrder.id} ({activeOrder.orderId})</span>
            </div>
            <span className="text-xs font-black bg-white/20 text-white px-3 py-1 rounded-full border border-white/20">
              ● {activeOrder.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 text-xs">
              <div className="text-emerald-300 font-black uppercase tracking-wider text-[10px]">Farm Pickup Point</div>
              <div className="font-black text-sm text-white">{activeOrder.farmName}</div>
              <div className="text-emerald-100/90 font-medium flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{activeOrder.farmAddress}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-amber-300 font-black uppercase tracking-wider text-[10px]">Customer Destination</div>
              <div className="font-black text-sm text-white">{activeOrder.customerName}</div>
              <div className="text-amber-100/90 font-medium flex items-start gap-1.5">
                <Navigation className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{activeOrder.customerAddress}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-bold">
              <div>
                <span className="text-emerald-200/80">Distance:</span> <strong className="text-white font-mono">{activeOrder.distance || '2.8 km'}</strong>
              </div>
              <div>
                <span className="text-emerald-200/80">Est. Payout:</span> <strong className="text-emerald-300 font-mono font-black text-sm">₹{(activeOrder.fee || 45) + (activeOrder.tip || 15)}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (setSelectedOrder) setSelectedOrder(activeOrder);
                  if (setActiveTab) setActiveTab('tracking');
                }}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Live Map Tracking 🗺️</span>
              </button>

              {activeOrder.status === 'Out for Delivery' && (
                <button
                  onClick={() => handleAction(activeOrder, 'Delivered')}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Delivered 🎉</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Main Delivery Flow Wizard Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
        <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Standard Delivery Execution Workflow</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
          {[
            { step: '1', title: 'Assigned', emoji: '📦' },
            { step: '2', title: 'Accept', emoji: '🟢' },
            { step: '3', title: 'Pickup', emoji: '🌾' },
            { step: '4', title: 'Start', emoji: '🛵' },
            { step: '5', title: 'Navigate', emoji: '🗺️' },
            { step: '6', title: 'Arrive', emoji: '🏠' },
            { step: '7', title: 'OTP PIN', emoji: '🔑' },
            { step: '8', title: 'Earned', emoji: '💰' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50/80 p-3 rounded-2xl border border-gray-200 flex flex-col items-center hover:bg-emerald-50/50 transition-colors">
              <span className="text-xl mb-1">{item.emoji}</span>
              <span className="text-[10px] text-farmMuted font-black uppercase">Step {item.step}</span>
              <span className="text-xs font-black text-farmGreen-950 mt-0.5">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Deliveries Quick List */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base sm:text-lg text-farmGreen-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Assigned & Pending Orders ({pendingDeliveries.length})</span>
          </h3>
          <button 
            onClick={() => {
              if (setActiveTab) setActiveTab('deliveries');
            }}
            className="text-xs font-black text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
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
              <div key={del.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-200 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-farmGreen-950 font-mono">{del.id}</span>
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                      {del.priority}
                    </span>
                    <span className="text-xs text-farmMuted font-bold">• {del.distance || '2.8 km'}</span>
                  </div>
                  <div className="text-xs text-farmGreen-950 font-bold">
                    <strong>Pickup:</strong> {del.farmName} ➔ <strong>Delivery:</strong> {del.customerName} ({del.customerAddress})
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                  <span className="font-black text-sm text-emerald-800 font-mono">
                    +₹{(del.fee || 45) + (del.tip || 15)}
                  </span>
                  
                  {del.status === 'Assigned' && (
                    <button
                      onClick={() => handleAction(del, 'Accepted')}
                      className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black cursor-pointer shadow-2xs active:scale-95 transition-all"
                    >
                      Accept Task 🟢
                    </button>
                  )}
                  {del.status === 'Accepted' && (
                    <button
                      onClick={() => handleAction(del, 'Picked Up')}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black cursor-pointer shadow-2xs active:scale-95 transition-all"
                    >
                      Confirm Pickup 🧺
                    </button>
                  )}
                  {del.status === 'Picked Up' && (
                    <button
                      onClick={() => handleAction(del, 'Out for Delivery')}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-2xs active:scale-95 transition-all"
                    >
                      Start Delivery 🛵
                    </button>
                  )}
                  {del.status === 'Out for Delivery' && (
                    <button
                      onClick={() => handleAction(del, 'Delivered')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-2xs active:scale-95 transition-all"
                    >
                      Mark Delivered 🎉
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
