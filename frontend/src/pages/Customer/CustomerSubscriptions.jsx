import React, { useState } from 'react';
import { 
  Calendar, 
  CalendarX,
  CalendarCheck,
  Plus, 
  Minus,
  Trash2, 
  Clock, 
  Check, 
  Bell, 
  Save, 
  Power,
  Sparkles, 
  Percent, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Info,
  Zap,
  User,
  Package,
  Flame,
  Plane,
  CalendarRange,
  X
} from 'lucide-react';

export const CustomerSubscriptions = ({ showToast }) => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 'sub-1',
      name: 'Organic Desi Cow Milk',
      qty: '2 Litres',
      frequency: 'Daily',
      price: 160,
      originalPrice: 180,
      nextDelivery: 'Tomorrow, 7:00 AM',
      isActive: true,
      skipNext: false,
      farmer: 'Rajesh Kumar',
      whatsappNotify: true,
      streak: 12
    },
    {
      id: 'sub-2',
      name: 'Fresh Farm Eggs (Cage-Free)',
      qty: '1 Dozen',
      frequency: 'Every Tue & Fri',
      price: 120,
      originalPrice: 140,
      nextDelivery: 'Tuesday, 8:00 AM',
      isActive: true,
      skipNext: false,
      farmer: 'Rajesh Kumar',
      whatsappNotify: false,
      streak: 8
    },
    {
      id: 'sub-3',
      name: 'Hydroponic Salad Greens Mix',
      qty: '500g',
      frequency: 'Weekly',
      price: 240,
      originalPrice: 270,
      nextDelivery: 'August 28, 9:00 AM',
      isActive: false,
      skipNext: false,
      farmer: 'Venkata Swamy',
      whatsappNotify: true,
      streak: 4
    }
  ]);

  // Statistics
  const totalDeliveries = 142;
  const lifetimeSavings = 1840;
  const activeStreak = 12; // weeks

  // Vacation Mode State
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [vacationActive, setVacationActive] = useState(false);
  const [vacationStart, setVacationStart] = useState('2026-09-20');
  const [vacationEnd, setVacationEnd] = useState('2026-09-28');

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [customItem, setCustomItem] = useState('Organic A2 Gir Cow Milk');
  const [customQty, setCustomQty] = useState('1 Litre');
  const [customFreq, setCustomFreq] = useState('Daily');
  const [customPrice, setCustomPrice] = useState(90);
  const [customOriginal, setCustomOriginal] = useState(105);
  const [customFarmer, setCustomFarmer] = useState('Rajesh Kumar');
  const [customWhatsapp, setCustomWhatsapp] = useState(true);

  // Preset Bundles
  const subscriptionPresets = [
    { name: 'Fresh A2 Cow Milk', price: 90, originalPrice: 105, frequency: 'Daily', qty: '1 Litre', farmer: 'Rajesh Kumar' },
    { name: 'Cage-Free Desi Eggs', price: 120, originalPrice: 140, frequency: 'Every Mon & Thu', qty: '1 Dozen', farmer: 'Rajesh Kumar' },
    { name: 'Weekly Organic Vegetable Box', price: 350, originalPrice: 400, frequency: 'Weekly', qty: '5 kg Assorted', farmer: 'Venkata Swamy' }
  ];

  const handleToggleActive = (id) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        const nextState = !sub.isActive;
        if (showToast) {
          showToast(
            nextState ? 'Subscription Resumed 🟢' : 'Subscription Paused ⏸️',
            `${sub.name} delivery cycle is now ${nextState ? 'active' : 'on-hold'}.`
          );
        }
        return { ...sub, isActive: nextState, skipNext: false };
      }
      return sub;
    }));
  };

  const handleToggleSkipNext = (id) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        const nextState = !sub.skipNext;
        if (showToast) {
          showToast(
            nextState ? 'Delivery Skipped ⏭️' : 'Delivery Resumed 🟢',
            nextState ? `Next delivery of ${sub.name} will be skipped.` : `Next delivery of ${sub.name} is back on schedule.`
          );
        }
        return { ...sub, skipNext: nextState };
      }
      return sub;
    }));
  };

  const handleCancelSub = (id) => {
    const target = subscriptions.find(sub => sub.id === id);
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    if (showToast) {
      showToast('Subscription Cancelled 🛑', `${target?.name || 'Item'} subscription has been ended.`);
    }
  };

  const handleToggleWhatsapp = (id) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        const nextState = !sub.whatsappNotify;
        if (showToast) {
          showToast('Alerts Updated 🔔', `WhatsApp reminder for ${sub.name} is now ${nextState ? 'enabled' : 'disabled'}.`);
        }
        return { ...sub, whatsappNotify: nextState };
      }
      return sub;
    }));
  };

  const handleQtyChange = (id, delta) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        let newQty = sub.qty;
        if (sub.qty.includes('g')) {
          const val = parseInt(sub.qty);
          const nextVal = Math.max(100, val + delta * 250);
          newQty = `${nextVal}g`;
        } else {
          newQty = sub.qty.replace(/(\d+)/, (match) => {
            const next = Math.max(1, parseInt(match) + delta);
            return next;
          });
        }
        if (showToast) {
          showToast('Quantity Updated 📦', `${sub.name} batch set to ${newQty}.`);
        }
        return { ...sub, qty: newQty };
      }
      return sub;
    }));
  };

  const handleDeliverToday = (id) => {
    const sub = subscriptions.find(s => s.id === id);
    if (showToast) {
      showToast('Express Boost Requested ⚡', `Farmer ${sub?.farmer || 'Partner'} is preparing an extra delivery for today!`);
    }
  };

  const handleAddCustomSubscription = (e) => {
    e.preventDefault();
    const newSub = {
      id: `sub-${Date.now()}`,
      name: customItem,
      qty: customQty,
      frequency: customFreq,
      price: Number(customPrice),
      originalPrice: Number(customOriginal),
      nextDelivery: 'Starting Tomorrow, 7:00 AM',
      isActive: true,
      skipNext: false,
      farmer: customFarmer,
      whatsappNotify: customWhatsapp
    };
    setSubscriptions([...subscriptions, newSub]);
    setShowAddForm(false);
    if (showToast) {
      showToast('Subscription Started 🎉', `Successfully subscribed to ${customItem} (${customFreq}).`);
    }
  };

  const handleSubscribePreset = (preset) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      name: preset.name,
      qty: preset.qty,
      frequency: preset.frequency,
      price: preset.price,
      originalPrice: preset.originalPrice,
      nextDelivery: 'Starting Tomorrow, 7:00 AM',
      isActive: true,
      skipNext: false,
      farmer: preset.farmer,
      whatsappNotify: true
    };
    setSubscriptions([...subscriptions, newSub]);
    if (showToast) {
      showToast('Preset Subscription Active 📅', `Successfully subscribed to ${preset.name} (${preset.frequency}).`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-display pb-16">
      
      {/* Premium Gradient Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-farmGreen-950 to-teal-950 text-white p-6 sm:p-8 rounded-[28px] relative shadow-xl border border-emerald-800/40">
        <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Direct-from-Farm Delivery Planner</span>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Harvest Subscriptions
            </h1>
            <p className="text-xs text-emerald-200/90 font-medium mt-1">
              Automate fresh morning drops of raw dairy, organic greens, and fresh poultry boxes.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setShowVacationModal(true)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer ${
                vacationActive
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>{vacationActive ? 'Vacation Active ✈️' : 'Pause for Vacation'}</span>
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Custom Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vacation Active Alert Banner */}
      {vacationActive && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-emerald-500/10 border-2 border-amber-400/50 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-farmGreen-950 flex items-center gap-2">
                <span>Vacation Mode Active</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">ON HOLD</span>
              </h4>
              <p className="text-xs text-farmMuted font-bold mt-0.5">
                All daily and weekly drops paused from <strong>{vacationStart}</strong> until <strong>{vacationEnd}</strong>. Zero billing applied.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setVacationActive(false);
              if (showToast) showToast('Deliveries Resumed! 🚚', 'Vacation mode turned off. Scheduled drops back on track.');
            }}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs transition-all active:scale-95 shrink-0"
          >
            Resume Now
          </button>
        </div>
      )}

      {/* Option C: Dashboard Metrics Summary Log */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-farm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Completed Deliveries</div>
            <div className="font-black text-lg text-farmGreen-950 mt-0.5">{totalDeliveries} Drops</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-farm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
            <Percent className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Subscription Savings</div>
            <div className="font-black text-lg text-emerald-700 mt-0.5">₹{lifetimeSavings} Saved</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-farm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Active Delivery Streak</div>
            <div className="font-black text-lg text-teal-800 mt-0.5">{activeStreak} Weeks</div>
          </div>
        </div>
      </div>

      {/* Expandable Custom Subscription Form */}
      {showAddForm && (
        <form onSubmit={handleAddCustomSubscription} className="bg-white p-6 sm:p-8 rounded-[24px] border border-emerald-100/80 shadow-farm-md space-y-5 animate-scaleIn text-xs font-semibold">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-farmGreen-950">Add Custom Delivery Schedule</h3>
              <p className="text-xs text-farmMuted">Configure a custom interval for your preferred farm crop</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Select Farm Produce</label>
              <select
                value={customItem}
                onChange={(e) => {
                  setCustomItem(e.target.value);
                  // Auto-fill price depending on selection
                  if (e.target.value.includes('Milk')) {
                    setCustomPrice(90); setCustomOriginal(105); setCustomQty('1 Litre');
                  } else if (e.target.value.includes('Eggs')) {
                    setCustomPrice(120); setCustomOriginal(140); setCustomQty('1 Dozen');
                  } else {
                    setCustomPrice(180); setCustomOriginal(200); setCustomQty('1 kg');
                  }
                }}
                className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs text-farmGreen-950"
              >
                <option value="Organic A2 Gir Cow Milk">Organic A2 Gir Cow Milk (Dairy)</option>
                <option value="Cage-Free Desi Eggs">Cage-Free Desi Eggs (Poultry)</option>
                <option value="Premium Vine Tomatoes">Premium Vine Tomatoes (Vegetables)</option>
                <option value="Fresh Hydroponic Spinach">Fresh Hydroponic Spinach (Greens)</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Quantity Batch</label>
              <input
                type="text"
                value={customQty}
                onChange={(e) => setCustomQty(e.target.value)}
                placeholder="e.g. 2 kg or 3 Litres"
                className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs text-farmGreen-950"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Delivery Interval / Frequency</label>
              <select
                value={customFreq}
                onChange={(e) => setCustomFreq(e.target.value)}
                className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs text-farmGreen-950"
              >
                <option value="Daily">Daily morning drops</option>
                <option value="Every Mon & Thu">Bi-weekly: Every Mon & Thu</option>
                <option value="Every Tue & Fri">Bi-weekly: Every Tue & Fri</option>
                <option value="Weekly">Weekly (Every Sunday)</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Fulfilling Producer</label>
              <select
                value={customFarmer}
                onChange={(e) => setCustomFarmer(e.target.value)}
                className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs text-farmGreen-950"
              >
                <option value="Rajesh Kumar">Rajesh Kumar (Palamaner Collective)</option>
                <option value="Venkata Swamy">Venkata Swamy (Chittoor Organic Greens)</option>
              </select>
            </div>
          </div>

          {/* Option G: Whatsapp Notifications Checkbox */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <div className="font-extrabold text-farmGreen-950">WhatsApp Delivery Alert</div>
              <p className="text-[10px] text-farmMuted font-bold">Receive morning dispatcher updates and ETA details directly on WhatsApp</p>
            </div>
            <button
              type="button"
              onClick={() => setCustomWhatsapp(!customWhatsapp)}
              className={`w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer shadow-inner relative flex items-center ${
                customWhatsapp ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                customWhatsapp ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="pt-2 flex justify-end gap-3 font-display">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Start Subscription</span>
            </button>
          </div>
        </form>
      )}

      {/* Subscriptions List Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-emerald-100/80 shadow-farm-md space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-farmGreen-950">Active Subscriptions</h3>
          <p className="text-xs text-farmMuted font-bold">Inspect, pause, or reschedule recurring farm deliveries</p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-farmMuted font-bold">No active subscriptions found. Browse presets below to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map((sub) => {
              const discountPercent = Math.round(((sub.originalPrice - sub.price) / sub.originalPrice) * 100);
              const streakCount = sub.streak || 8;
              const streakProgress = Math.min(100, (streakCount / 15) * 100);

              return (
                <div 
                  key={sub.id} 
                  className={`p-5 rounded-2xl border transition-all duration-300 relative group/card hover:-translate-y-1 hover:shadow-lg ${
                    sub.isActive && !sub.skipNext
                      ? 'bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 border-emerald-500/80 shadow-md ring-2 ring-emerald-500/10'
                      : sub.skipNext
                        ? 'bg-amber-50/30 border-amber-400 shadow-sm opacity-95'
                        : 'bg-gray-50/80 border-gray-200 opacity-80'
                  }`}
                >
                  {/* Card Header: Product Name, Farmer, & Save Badge */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-display font-black text-sm text-farmGreen-950 truncate">
                          {sub.name}
                        </h4>
                        {sub.isActive && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[9px] rounded-full uppercase tracking-wider shadow-xs shrink-0 flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                            Save {discountPercent}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-farmMuted font-bold">
                        <span className="flex items-center gap-1 text-emerald-800">
                          <User className="w-3 h-3 text-emerald-600" /> {sub.farmer}
                        </span>
                        <span>·</span>
                        <span>{sub.frequency}</span>
                      </div>
                    </div>

                    {/* Quantity Stepper (Icon-Only Buttons) */}
                    <div className="flex items-center gap-1.5 bg-farmBg/80 p-1 rounded-xl border border-emerald-100/80 shadow-2xs shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(sub.id, -1)}
                        title="Decrease batch quantity"
                        className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-all active:scale-85 cursor-pointer shadow-2xs border border-gray-200/60"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-[11px] text-farmGreen-950 px-1.5 min-w-[50px] text-center">
                        {sub.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(sub.id, 1)}
                        title="Increase batch quantity"
                        className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-all active:scale-85 cursor-pointer shadow-2xs border border-gray-200/60"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Highlights Bar: Price & Next Delivery Pulse */}
                  <div className="pt-3.5 pb-2.5 grid grid-cols-2 gap-2">
                    {/* Price & Billing Cycle */}
                    <div className="p-2.5 rounded-xl bg-white/80 border border-gray-100 shadow-2xs flex flex-col justify-center">
                      <span className="text-[9px] text-farmMuted font-black uppercase tracking-wider">Per Drop Price</span>
                      <div className="font-black text-sm text-farmGreen-950 flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-emerald-700">₹{sub.price}</span>
                        <span className="text-[10px] text-gray-400 line-through">₹{sub.originalPrice}</span>
                      </div>
                    </div>

                    {/* Next Run Countdown Pulse */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50/60 to-teal-50/30 border border-emerald-200/60 shadow-2xs flex flex-col justify-center relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-emerald-800 font-black uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" /> Next Drop
                        </span>
                        {sub.isActive && !sub.skipNext && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                      </div>
                      <div className="font-extrabold text-[11px] text-farmGreen-950 mt-0.5 truncate">
                        {sub.skipNext ? (
                          <span className="text-amber-700 font-black flex items-center gap-1">
                            <CalendarX className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Skipped
                          </span>
                        ) : sub.isActive ? (
                          sub.nextDelivery
                        ) : (
                          <span className="text-gray-400 font-bold">On Hold</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Streak & Milestone Progress Indicator */}
                  <div className="space-y-1 py-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-farmMuted flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500 animate-pulse" /> Delivery Streak
                      </span>
                      <span className="text-emerald-800 font-black">{streakCount} Drops Completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-600 rounded-full transition-all duration-700" 
                        style={{ width: `${streakProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Bar (100% Icon-Only with Tooltips & Micro-Animations) */}
                  <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-2">
                    
                    {/* 1. Express Deliver Today Boost Button */}
                    <button
                      type="button"
                      onClick={() => handleDeliverToday(sub.id)}
                      title="Express Deliver Today (Trigger Instant Drop)"
                      className="w-9 h-9 rounded-xl bg-amber-50 hover:bg-gradient-to-br hover:from-amber-400 hover:to-amber-500 text-amber-700 hover:text-white border border-amber-200/80 hover:border-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group"
                    >
                      <Zap className="w-4 h-4 group-hover:animate-bounce" />
                    </button>

                    {/* 2. Pause / Resume Toggle Button (Power Toggle) */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(sub.id)}
                      title={sub.isActive ? "Pause Deliveries (Power Off)" : "Resume Deliveries (Power On)"}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group ${
                        sub.isActive 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border-gray-300'
                      }`}
                    >
                      <Power className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </button>

                    {/* 3. Skip Next Delivery Button (Calendar Schedule Toggle) */}
                    {sub.isActive && (
                      <button
                        type="button"
                        onClick={() => handleToggleSkipNext(sub.id)}
                        title={sub.skipNext ? "Resume Next Scheduled Delivery" : "Skip Next Scheduled Delivery"}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group ${
                          sub.skipNext
                            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {sub.skipNext ? (
                          <CalendarCheck className="w-4 h-4 text-amber-800 group-hover:scale-110 transition-transform" />
                        ) : (
                          <CalendarX className="w-4 h-4 text-emerald-800 group-hover:scale-110 transition-transform" />
                        )}
                      </button>
                    )}

                    {/* 4. WhatsApp Notification Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleWhatsapp(sub.id)}
                      title={sub.whatsappNotify ? "WhatsApp Reminders: Active 🔔 (Click to Mute)" : "WhatsApp Reminders: Off 🔕 (Click to Enable)"}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group ${
                        sub.whatsappNotify
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-600 shadow-emerald-500/20'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 border-gray-200'
                      }`}
                    >
                      <Bell className={`w-4 h-4 ${sub.whatsappNotify ? 'animate-wiggle' : ''}`} />
                    </button>

                    {/* 5. Cancel Subscription Button */}
                    <button
                      type="button"
                      onClick={() => handleCancelSub(sub.id)}
                      title="Cancel Subscription 🛑"
                      className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-gradient-to-br hover:from-rose-500 hover:to-red-600 text-rose-500 hover:text-white border border-rose-200/80 hover:border-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group ml-auto"
                    >
                      <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preset Subscriptions Selector */}
      <div className="p-6 bg-gradient-to-br from-emerald-800 to-farmGreen-950 text-white rounded-[24px] shadow-lg border border-emerald-700/30 space-y-4">
        <div>
          <h4 className="font-extrabold text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Recommended Fresh presets</span>
          </h4>
          <p className="text-xs text-emerald-100/90 font-medium">Subscribe in one click for instant morning dispatches.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {subscriptionPresets.map((preset) => (
            <div key={preset.name} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
              <div>
                <div className="font-extrabold text-xs text-white leading-tight">{preset.name}</div>
                <div className="text-[10px] text-emerald-200 font-medium mt-1">{preset.qty} · {preset.frequency}</div>
                <div className="text-[9px] text-emerald-300 font-bold mt-1">Farmed by: {preset.farmer}</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs text-emerald-300">₹{preset.price}</span>
                  <span className="text-[10px] text-white/50 line-through">₹{preset.originalPrice}</span>
                </div>
                <button
                  onClick={() => handleSubscribePreset(preset)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-lg text-[10px] font-black cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vacation Pause Modal */}
      {showVacationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 font-display animate-scaleUp">
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-farmGreen-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Vacation Pause Mode</h4>
                  <p className="text-xs text-emerald-300 font-medium">Temporarily hold all scheduled deliveries</p>
                </div>
              </div>
              <button onClick={() => setShowVacationModal(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-farmMuted font-bold leading-relaxed">
                Traveling or away from home? Pause your morning milk, fresh eggs, and veggies with 1 tap. You won't be charged during your vacation.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-farmGreen-950 block mb-1">Pause From</label>
                  <input
                    type="date"
                    value={vacationStart}
                    onChange={(e) => setVacationStart(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-emerald-600 bg-emerald-50/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-farmGreen-950 block mb-1">Resume On</label>
                  <input
                    type="date"
                    value={vacationEnd}
                    onChange={(e) => setVacationEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-emerald-600 bg-emerald-50/40"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automatic resume on {vacationEnd} morning harvest.</span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowVacationModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVacationActive(true);
                    setShowVacationModal(false);
                    if (showToast) showToast('Vacation Mode Activated ✈️', `Deliveries paused from ${vacationStart} to ${vacationEnd}.`);
                  }}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Confirm Vacation Pause
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
