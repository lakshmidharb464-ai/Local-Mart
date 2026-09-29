import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { farmerService } from '../../services/farmerService';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Clock, 
  Check, 
  Bell, 
  Save, 
  Play, 
  Pause, 
  Sparkles, 
  TrendingUp, 
  Info, 
  ArrowRight, 
  MessageSquare, 
  Send, 
  Award, 
  Percent 
} from 'lucide-react';

export const FarmerHarvestPlanner = () => {
  const { showToast } = useAuth();

  // Default initial seasons
  const defaultSeasons = [
    {
      id: 'h-1',
      name: 'Alphonso Mangoes',
      startDate: '2026-04-15',
      endDate: '2026-06-25',
      expectedVolume: 1500,
      currentYield: 1120,
      status: 'Active',
      buyerNotified: true,
      lastBroadcastMsg: 'Pesticide-free Alphonso mangoes ready!'
    },
    {
      id: 'h-2',
      name: 'Vine-Ripened Tomatoes',
      startDate: '2026-08-01',
      endDate: '2026-10-30',
      expectedVolume: 800,
      currentYield: 350,
      status: 'Active',
      buyerNotified: false,
      lastBroadcastMsg: ''
    },
    {
      id: 'h-3',
      name: 'Hydroponic Salad Greens',
      startDate: '2026-09-01',
      endDate: '2026-12-15',
      expectedVolume: 500,
      currentYield: 0,
      status: 'Scheduled',
      buyerNotified: false,
      lastBroadcastMsg: ''
    }
  ];

  // Primary State with backend sync & localStorage fallback
  const [seasons, setSeasons] = useState(() => {
    try {
      const saved = localStorage.getItem('localfarm_harvest_seasons');
      return saved ? JSON.parse(saved) : defaultSeasons;
    } catch {
      return defaultSeasons;
    }
  });

  useEffect(() => {
    farmerService.getHarvestPlans()
      .then(plans => {
        if (plans && plans.length > 0) {
          setSeasons(plans);
        }
      })
      .catch(err => console.warn('[HarvestPlanner] Using local plans:', err));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('localfarm_harvest_seasons', JSON.stringify(seasons));
    } catch (e) {
      console.error('Error saving harvest seasons:', e);
    }
  }, [seasons]);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expectedVolume, setExpectedVolume] = useState('');

  // Broadcaster State
  const [broadcastingId, setBroadcastingId] = useState(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  // Dashboard Stats
  const stats = useMemo(() => {
    const active = seasons.filter(s => s.status === 'Active').length;
    const totalYield = seasons.reduce((sum, s) => sum + s.expectedVolume, 0);
    const completedYield = seasons.reduce((sum, s) => sum + s.currentYield, 0);
    const progressPercent = totalYield > 0 ? Math.round((completedYield / totalYield) * 100) : 0;
    return { active, totalYield, completedYield, progressPercent };
  }, [seasons]);

  const getSeasonColumns = (start, end) => {
    if (!start || !end) return { startCol: 1, endCol: 7 };
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return { startCol: 1, endCol: 7 };
    }
    const startMonth = startDateObj.getMonth();
    const endMonth = endDateObj.getMonth();
    const getColIndex = (m) => {
      if (m < 3) return 1; // Jan-Mar -> Apr (1)
      if (m > 9) return 7; // Nov-Dec -> Oct+ (7)
      return m - 2; // Apr (3-2=1) to Oct (9-2=7)
    };
    let startCol = getColIndex(startMonth);
    let endCol = getColIndex(endMonth);
    if (startCol > endCol) {
      const temp = startCol;
      startCol = endCol;
      endCol = temp;
    }
    return { startCol, endCol };
  };

  const getCategoryColor = (name) => {
    const n = name.toLowerCase();
    if (n.includes('mango') || n.includes('fruit')) {
      return 'from-amber-400 to-orange-500 text-amber-950';
    }
    if (n.includes('tomato') || n.includes('vegetable')) {
      return 'from-red-500 to-rose-600 text-white';
    }
    if (n.includes('salad') || n.includes('greens') || n.includes('spinach')) {
      return 'from-emerald-500 to-teal-600 text-white';
    }
    return 'from-teal-600 to-emerald-700 text-white';
  };

  const getCropEmoji = (name) => {
    const n = name.toLowerCase();
    if (n.includes('mango') || n.includes('fruit')) return '🥭';
    if (n.includes('tomato') || n.includes('vegetable')) return '🍅';
    if (n.includes('salad') || n.includes('greens') || n.includes('spinach')) return '🥬';
    return '🌱';
  };

  const handleAddSeason = async (e) => {
    e.preventDefault();
    const newSeason = {
      id: `h-${Date.now()}`,
      name,
      startDate,
      endDate,
      expectedVolume: Number(expectedVolume),
      currentYield: 0,
      status: 'Scheduled',
      buyerNotified: false,
      lastBroadcastMsg: ''
    };
    try {
      await farmerService.createHarvestPlan(newSeason).catch(err => console.warn('Sync plan error:', err));
    } catch (e) {
      console.warn('Harvest plan sync error:', e);
    }
    setSeasons(prev => [...prev, newSeason]);
    setName('');
    setStartDate('');
    setEndDate('');
    setExpectedVolume('');
    setShowAddForm(false);
    if (showToast) {
      showToast('Harvest Schedule Saved 🌾', `${name} added to timeline.`);
    }
  };

  const handleDeleteSeason = (id) => {
    const target = seasons.find(s => s.id === id);
    setSeasons(seasons.filter(s => s.id !== id));
    if (showToast) {
      showToast('Schedule Removed 🗑️', `${target?.name || 'Item'} season has been cleared.`);
    }
  };

  const handleStartBroadcast = (id) => {
    const target = seasons.find(s => s.id === id);
    setBroadcastMsg(`Fresh ${target.name} harvest begins soon! Subscriptions are now open. Order now for direct doorstep morning delivery.`);
    setBroadcastingId(id);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      await farmerService.broadcastHarvestAlert({ planId: broadcastingId, message: broadcastMsg }).catch(err => console.warn('Sync broadcast error:', err));
    } catch (e) {
      console.warn('Broadcast sync error:', e);
    }
    setSeasons(seasons.map(s => {
      if (s.id === broadcastingId) {
        return {
          ...s,
          buyerNotified: true,
          lastBroadcastMsg: broadcastMsg
        };
      }
      return s;
    }));
    const target = seasons.find(s => s.id === broadcastingId);
    setBroadcastingId(null);
    if (showToast) {
      showToast('Notification Broadcasted 🔔', `Sent update for ${target?.name || 'Crop'} to subscribed buyers!`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-display pb-16">
      
      {/* Dark Emerald Header Card */}
      <div className="bg-[#0F2818] bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] text-white p-6 sm:p-8 rounded-[28px] relative shadow-xl border border-emerald-700/40">
        <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-farmGreen-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-farmGreen-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-farmGold-300 animate-pulse" />
              <span>Verified Seller Season Planner</span>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Harvest Planner
            </h1>
            <p className="text-xs text-emerald-200/90 font-medium mt-1">
              Plan your upcoming harvest seasons, track expected crop yields (kg), and notify waiting buyers in advance.
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            title="Create Season Track"
            className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-900 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Overview Cards & Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1 */}
        <div className="glass-surface p-5 rounded-2xl border border-farmGreen-200/40 shadow-glass flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="w-12 h-12 rounded-xl bg-farmGreen-50/60 text-farmGreen-700 flex items-center justify-center shadow-sm">
            <Play className="w-5 h-5 fill-emerald-700 text-farmGreen-700" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Active Seasons</div>
            <div className="font-extrabold text-lg text-farmGreen-950 mt-0.5">{stats.active} Crop Tracks</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-surface p-5 rounded-2xl border border-farmGreen-200/40 shadow-glass flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="w-12 h-12 rounded-xl bg-farmGold-50/60 text-farmGold-700 flex items-center justify-center shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Total Scheduled Yield</div>
            <div className="font-extrabold text-lg text-farmGreen-950 mt-0.5">{stats.totalYield} kg</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-surface p-5 rounded-2xl border border-farmGreen-200/40 shadow-glass flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-sm">
            <Percent className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Harvest Target Completed</div>
            <div className="font-extrabold text-lg text-farmGreen-700 mt-0.5">{stats.progressPercent}% Yielded</div>
          </div>
        </div>
      </div>

      {/* Option K: Visual Crop Timeline Grid (Colored Tracks) */}
      <div className="glass-surface p-6 sm:p-8 rounded-[28px] border border-farmGreen-200/40 shadow-farm-md space-y-4">
        <div>
          <h3 className="font-extrabold text-lg text-farmGreen-950">Crop Harvest Timeline</h3>
          <p className="text-xs text-farmMuted font-bold">Chronological Gantt planner maps seasonal timelines across agricultural calendars</p>
        </div>

        <div className="overflow-x-auto border border-farmSage-100/40 rounded-2xl">
          <div className="min-w-[650px] divide-y divide-gray-100">
            {/* Header Months row */}
            <div className="flex bg-white/70 text-[10px] font-black uppercase tracking-wider text-farmMuted py-3.5 px-4">
              <div className="w-48 text-left shrink-0">Crop name</div>
              <div className="flex-1 grid grid-cols-7 text-center">
                <div>Apr</div>
                <div>May</div>
                <div>Jun</div>
                <div>Jul</div>
                <div>Aug</div>
                <div>Sep</div>
                <div>Oct+</div>
              </div>
            </div>

            {/* Crop Tracks rows */}
            {seasons.map((season) => {
              const { startCol, endCol } = getSeasonColumns(season.startDate, season.endDate);
              const emoji = getCropEmoji(season.name);
              const colorClass = getCategoryColor(season.name);

              return (
                <div key={season.id} className="flex py-4.5 px-4 items-center gap-0">
                  <div className="w-48 text-left font-extrabold text-xs text-farmGreen-950 truncate pr-3 shrink-0 flex items-center gap-1.5">
                    <span className="text-base shrink-0">{emoji}</span>
                    <span className="truncate">{season.name}</span>
                  </div>
                  
                  {/* Timeline progress track spanning appropriate grids with vertical helper dividers */}
                  <div className="flex-1 h-8 bg-farmSage-100/40/50 rounded-2xl relative overflow-hidden border border-gray-250/20 shadow-inner flex items-center">
                    {/* Background grid vertical dividers for easy month tracing */}
                    <div className="absolute inset-0 grid grid-cols-7 pointer-events-none divide-x divide-gray-200/50">
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                    </div>

                    <div 
                      className={`absolute top-1 bottom-1 rounded-xl bg-gradient-to-r ${colorClass} border border-white/10 flex items-center justify-center min-w-[60px] shadow-sm transition-all duration-300 hover:scale-[1.01]`}
                      style={{
                        left: `${((startCol - 1) / 7) * 100}%`,
                        width: `${((endCol - startCol + 1) / 7) * 100}%`
                      }}
                    >
                      <span className="text-[9px] font-black uppercase tracking-wider drop-shadow-sm truncate px-2">
                        {season.startDate} to {season.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expandable Creation Form */}
      {showAddForm && (
        <form onSubmit={handleAddSeason} className="glass-surface p-6 sm:p-8 rounded-[24px] border border-farmGreen-200/40 shadow-farm-md space-y-4 animate-scaleIn text-xs font-semibold">
          <div className="flex items-center gap-3 pb-4 border-b border-farmSage-100/40">
            <div className="p-2.5 bg-farmGreen-50/60 text-farmGreen-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-farmGreen-950">Add Crop Season Track</h3>
              <p className="text-xs text-farmMuted font-bold">Establish expected dates and targets for the seasonal harvest</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-farmGreen-950 mb-1.5 block">Crop Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Devgad Alphonso Mangoes"
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl  font-bold text-xs"
                required
              />
            </div>

            <div>
              <label className="font-bold text-farmGreen-950 mb-1.5 block">Expected Season Yield (kg)</label>
              <input
                type="number"
                value={expectedVolume}
                onChange={(e) => setExpectedVolume(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl  font-bold text-xs"
                required
              />
            </div>

            <div>
              <label className="font-bold text-farmGreen-950 mb-1.5 block">Season Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl  font-bold text-xs cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="font-bold text-farmGreen-950 mb-1.5 block">Season End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl  font-bold text-xs cursor-pointer"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 font-display">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 bg-white/50 hover:bg-farmSage-100/40 border border-farmSage-200/50 rounded-xl text-xs font-bold text-farmMuted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Schedule</span>
            </button>
          </div>
        </form>
      )}

      {/* Crop details grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-farmGreen-950">Yield Progress Tracker</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {seasons.map((season) => {
            const progressPercent = season.expectedVolume > 0 ? Math.round((season.currentYield / season.expectedVolume) * 100) : 0;
            const emoji = getCropEmoji(season.name);

            return (
              <div 
                key={season.id}
                className="glass-surface p-6 rounded-3xl border border-farmGreen-200/30/90 shadow-glass flex flex-col justify-between space-y-4 hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative overflow-hidden group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl">{emoji}</span>
                      <h4 className="font-extrabold text-base text-farmGreen-950 truncate">{season.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 ${
                        season.status === 'Active' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm' : 'bg-gray-400'
                      }`}>
                        {season.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        {season.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-farmMuted font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-farmGreen-600 shrink-0" />
                      <span>Cycle: {season.startDate} to {season.endDate}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteSeason(season.id)}
                    title="Delete Season Track"
                    className="w-9 h-9 bg-rose-50 hover:bg-farmTerracotta-100 text-farmTerracotta-700 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer border border-farmTerracotta-200/80 shadow-2xs shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Target Progression Ring & Metrics Panel */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-emerald-50/20 border border-farmGreen-200/40 rounded-2xl gap-4 shadow-2xs">
                  {/* SVG radial ring progress tracker with glowing filter */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="25" className="stroke-gray-200 fill-transparent" strokeWidth="4.5" />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="25" 
                        className="stroke-emerald-500 fill-transparent transition-all duration-1000 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]" 
                        strokeWidth="4.5" 
                        strokeDasharray={2 * Math.PI * 25}
                        strokeDashoffset={2 * Math.PI * 25 * (1 - progressPercent / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-farmGreen-950">{progressPercent}%</span>
                  </div>

                  <div className="flex-1 text-right">
                    <div className="text-[10px] text-farmGreen-800 font-extrabold uppercase tracking-wider">Harvest Yield Target</div>
                    <div className="font-extrabold text-base text-farmGreen-950 mt-0.5">
                      {season.currentYield} kg / <span className="text-farmGreen-700 font-black">{season.expectedVolume} kg</span>
                    </div>
                  </div>
                </div>

                {/* Broadcast Notifications composer panel */}
                <div className="pt-3 border-t border-farmSage-100/40 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    {season.buyerNotified ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-farmGreen-800 font-extrabold truncate">
                        <Check className="w-3.5 h-3.5 text-farmGreen-600 shrink-0" />
                        <span>Buyers Notified: "{season.lastBroadcastMsg}"</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] text-farmMuted font-bold">
                        <Info className="w-3.5 h-3.5 text-farmSage-400 shrink-0" />
                        <span>Broadcast alert not sent yet</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartBroadcast(season.id)}
                    title="Broadcast Updates to 142 Subscribed Buyers"
                    className="w-9 h-9 bg-farmGreen-50/60 hover:bg-farmGreen-100/80 border border-emerald-200 text-farmGreen-800 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer shadow-2xs shrink-0 ml-3"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broadcast Modal Composer Popup */}
      {broadcastingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form 
            onSubmit={handleSendBroadcast}
            className="bg-white rounded-[24px] p-6 max-w-md w-full border border-farmGreen-200/30 shadow-2xl space-y-4 animate-scaleIn text-xs font-semibold"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-farmSage-100/40">
              <MessageSquare className="w-5 h-5 text-farmGreen-700" />
              <h3 className="font-extrabold text-base text-farmGreen-950">Compose Buyer Broadcast</h3>
            </div>

            <div>
              <label className="font-bold text-farmGreen-950 mb-1.5 block">Alert Message Details</label>
              <textarea
                rows="4"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Compose announcement for crop harvest..."
                className="w-full p-3 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:border-emerald-500 rounded-xl font-medium  resize-none leading-relaxed text-farmGreen-950"
                required
              />
              <p className="text-[10px] text-farmMuted font-bold mt-1.5 italic">
                * Alert notification will be immediately dispatched to 142 customer profiles currently subscribed to your harvest alerts.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 font-display pt-2">
              <button
                type="button"
                onClick={() => setBroadcastingId(null)}
                className="px-4 py-2.5 bg-white/50 hover:bg-farmSage-100/40 border border-farmSage-200/50 rounded-xl font-bold text-farmMuted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-farmGreen-700 hover:bg-farmGreen-600 text-white rounded-xl font-black flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to 142 Buyers</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

