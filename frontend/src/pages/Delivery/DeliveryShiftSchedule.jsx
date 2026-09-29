import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  Clock,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
  CalendarDays,
  Save,
  Plus,
  Zap,
  Star,
  Coffee,
  Sunrise,
  Sunset,
  Sparkles,
  MapPin,
  Check,
  ShieldCheck,
  Building
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS & PRESETS
───────────────────────────────────────────────────────────────────────────── */
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_FULL  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Time slots: 06:00 – 22:00
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 6;
  return { value: h, label: `${h.toString().padStart(2, '0')}:00` };
});

const LEAVE_REASONS = [
  'Personal Rest / Family Event',
  'Medical / Health Issue',
  'Vehicle Maintenance & Battery Servicing',
  'Severe Weather / Farm Route Blockage',
  'Festival / Public Holiday',
  'Other Reason'
];

const SHIFT_PRESETS = [
  { id: 'morning_express', label: '⚡ Morning Harvest Express', hours: '06:00 – 14:00 (8h)', startH: 6, endH: 14, desc: 'Early organic vegetable & dairy delivery routes' },
  { id: 'full_day_agro',   label: '🌞 Full Day Agro Standard',  hours: '08:00 – 18:00 (10h)', startH: 8, endH: 18, desc: 'Farm-to-consumer regular express schedule' },
  { id: 'evening_rush',    label: '🌙 Evening Community Rush', hours: '14:00 – 22:00 (8h)', startH: 14, endH: 22, desc: 'High-volume residential dinner baskets' },
];

const HUBS = [
  { id: 'pune_central', name: 'Pune Central Hub (Main)', zone: 'Central Zone' },
  { id: 'chittoor_link', name: 'Chittoor AP Cold Link Hub', zone: 'Inter-State Express' },
  { id: 'kothrud_mandi', name: 'Kothrud Mandi Distribution Center', zone: 'West Corridor' },
  { id: 'hinjewadi_agro', name: 'Hinjewadi Tech Agri Station', zone: 'Phase 1-3 Zone' },
];

const INITIAL_SCHEDULE = DAYS_SHORT.reduce((acc, d) => ({
  ...acc,
  [d]: {
    enabled: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(d),
    startH: 8,
    endH: 18,
    hub: 'pune_central'
  }
}), {});

const LAST_WEEK_TEMPLATE = DAYS_SHORT.reduce((acc, d) => ({
  ...acc,
  [d]: {
    enabled: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(d),
    startH: d === 'Sat' ? 9 : 8,
    endH:   d === 'Sat' ? 14 : 18,
    hub: 'pune_central'
  }
}), {});

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
const fmt = (h) => `${h.toString().padStart(2, '0')}:00`;

const hoursWorked = (s) => s.enabled ? Math.max(0, s.endH - s.startH) : 0;

const detectConflicts = (schedule) => {
  const conflicts = [];
  DAYS_SHORT.forEach((day, i) => {
    if (i === 0) return;
    const prev = schedule[DAYS_SHORT[i - 1]];
    const curr = schedule[day];
    if (prev.enabled && curr.enabled) {
      const restHours = (24 - prev.endH) + curr.startH;
      if (restHours < 8) {
        conflicts.push({ day, prevDay: DAYS_SHORT[i - 1], restHours: restHours.toFixed(1) });
      }
    }
  });
  return conflicts;
};

const getCellState = (schedule, day, hour) => {
  const s = schedule[day];
  if (!s.enabled) return 'off';
  if (hour >= s.startH && hour < s.endH) return 'active';
  return 'inactive';
};

/* ─────────────────────────────────────────────────────────────────────────────
   MINI MONTH CALENDAR
───────────────────────────────────────────────────────────────────────────── */
const MiniMonthCalendar = ({ schedule }) => {
  const [offset, setOffset] = useState(0);
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = (viewDate.getDay() + 6) % 7; // Mon=0

  const getWorkingState = (date) => {
    if (!date) return null;
    const dow = (new Date(viewDate.getFullYear(), viewDate.getMonth(), date).getDay() + 6) % 7;
    const day = DAYS_SHORT[dow];
    const s = schedule[day];
    if (!s.enabled) return 'off';
    const hours = s.endH - s.startH;
    if (hours < 6) return 'partial';
    return 'working';
  };

  const cells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button onClick={() => setOffset(o => o - 1)} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer transition-all shadow-2xs">
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>
        <span className="font-black text-slate-900 text-base">
          {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => setOffset(o => o + 1)} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer transition-all shadow-2xs">
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {DAYS_SHORT.map(d => (
          <div key={d} className="text-xs font-black text-slate-500 py-1">{d}</div>
        ))}
        {cells.map((date, i) => {
          const state = getWorkingState(date);
          const isToday = date === today.getDate() && offset === 0;
          return (
            <div
              key={i}
              className={`h-11 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                !date ? 'opacity-0' :
                isToday ? 'ring-2 ring-emerald-500 shadow-xs' : ''
              } ${
                state === 'working' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' :
                state === 'partial' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                state === 'off'     ? 'bg-slate-200/60 text-slate-400' : ''
              }`}
            >
              {date && (
                <span className="flex flex-col items-center leading-none gap-1">
                  <span>{date}</span>
                  {state === 'working' && <span className="text-[9px] font-mono font-black text-emerald-700">✓ Full</span>}
                  {state === 'partial' && <span className="text-[9px] font-mono font-black text-amber-700">◑ Half</span>}
                  {state === 'off'     && <span className="text-[9px] font-mono font-black text-slate-400">Off</span>}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-black text-slate-700 pt-2 border-t border-slate-200 flex-wrap">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-200 border border-emerald-400 inline-block" /> Scheduled Shift</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400 inline-block" /> Short / Half Shift</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-400 inline-block" /> Scheduled Rest Day</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   LEAVE REQUEST MODAL
───────────────────────────────────────────────────────────────────────────── */
const LeaveRequestForm = ({ showToast, onClose }) => {
  const [form, setForm] = useState({ date: '', reason: '', note: '', substituteRider: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.reason) {
      if (showToast) showToast('Missing Fields ⚠️', 'Please select a date and reason for your leave request.', 'error');
      return;
    }
    if (showToast) showToast('Leave Request Submitted 📅', `Day off requested for ${form.date} (${form.reason}). Hub manager will review shortly.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-2xl"><Coffee className="w-6 h-6 text-amber-800" /></div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Request Scheduled Leave</h3>
              <p className="text-xs text-slate-600 font-bold">Submit advance day-off notice for regional hub approval</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-black text-slate-900 text-xs block">Date of Requested Leave</label>
              <input
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl text-xs font-black text-slate-900 outline-none shadow-2xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-black text-slate-900 text-xs block">Reason Category</label>
              <select
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl text-xs font-black text-slate-900 outline-none shadow-2xs"
                required
              >
                <option value="">— Select reason —</option>
                {LEAVE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-black text-slate-900 text-xs block">Substitute Delivery Partner <span className="font-bold text-slate-500">(optional)</span></label>
            <input
              type="text"
              value={form.substituteRider}
              onChange={e => setForm(f => ({ ...f, substituteRider: e.target.value }))}
              placeholder="e.g. Anand K. (DEL-8814)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl text-xs font-black text-slate-900 outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-black text-slate-900 text-xs block">Additional Notes / Explanations</label>
            <textarea
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              rows={3}
              placeholder="Describe any emergency details or handover status for your hub manager..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl text-xs font-bold text-slate-900 outline-none resize-none shadow-2xs"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-black text-xs hover:bg-slate-50 cursor-pointer transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95">
              <Save className="w-4 h-4 text-amber-300" /> Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const DeliveryShiftSchedule = ({ showToast }) => {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [view, setView]         = useState('grid');   // 'grid' | 'month' | 'list'
  const [showLeave, setShowLeave] = useState(false);
  const [activeHub, setActiveHub] = useState('pune_central');

  /* ── Computed stats ── */
  const totalHours   = useMemo(() => DAYS_SHORT.reduce((sum, d) => sum + hoursWorked(schedule[d]), 0), [schedule]);
  const workingDays  = useMemo(() => DAYS_SHORT.filter(d => schedule[d].enabled).length, [schedule]);
  const restHours    = 168 - totalHours; // 168h in a week
  const conflicts    = useMemo(() => detectConflicts(schedule), [schedule]);

  /* ── Apply Shift Preset ── */
  const applyPreset = (preset) => {
    setSchedule(prev => {
      const next = { ...prev };
      DAYS_SHORT.forEach(d => {
        if (next[d].enabled) {
          next[d] = { ...next[d], startH: preset.startH, endH: preset.endH };
        }
      });
      return next;
    });
    if (showToast) showToast(`Preset Applied ⚡`, `All active working days set to "${preset.label}".`);
  };

  /* ── Grid cell click: toggle one hour slot ── */
  const handleCellClick = useCallback((day, hour) => {
    setSchedule(prev => {
      const s = { ...prev[day] };
      if (!s.enabled) {
        return { ...prev, [day]: { ...s, enabled: true, startH: hour, endH: hour + 1 } };
      }
      const newStart = Math.min(s.startH, hour);
      const newEnd   = Math.max(s.endH, hour + 1);
      return { ...prev, [day]: { ...s, startH: newStart, endH: newEnd } };
    });
  }, []);

  /* ── Column header click: toggle whole day ── */
  const handleDayToggle = useCallback((day) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  }, []);

  /* ── Time input change ── */
  const handleTimeChange = (day, field, val) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [field]: parseInt(val) } }));
  };

  /* ── Copy last week ── */
  const handleCopyLastWeek = () => {
    setSchedule(LAST_WEEK_TEMPLATE);
    if (showToast) showToast('Template Applied 📋', 'Weekly schedule pre-filled from last week.');
  };

  /* ── Export ── */
  const handleExport = () => {
    if (showToast) showToast('Preparing Schedule PDF 📄', 'Opening print preview dialog...');
    setTimeout(() => window.print(), 300);
  };

  /* ── Save ── */
  const handleSave = () => {
    if (showToast) showToast('Schedule Confirmed! 📅', 'Weekly delivery shift schedule successfully updated.');
  };

  return (
    <div className="space-y-6 pb-14 font-display animate-fadeIn">

      {/* ── Ultra-Premium Logistics Hero Banner ── */}
      <div className="bg-gradient-to-br from-[#071F15] via-[#0B3D2E] to-[#134E39] rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-emerald-500/30 relative group transition-all duration-500">
        {/* Glow ambient */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl group-hover:bg-emerald-500/25 transition-all duration-700" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl group-hover:bg-amber-400/25 transition-all duration-700" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/30 shadow-lg">
              <Calendar className="w-8 h-8 text-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-black border border-emerald-400/30">
                  WEEK 35 • AUG 2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black border border-amber-400/30 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>{totalHours}h Planned</span>
                </span>
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">Delivery Shift & Roster Planner</h1>
              <p className="text-xs text-emerald-100/80 font-bold">Configure weekly availability, assign hub stations & request advance leave</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyLastWeek}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              <Copy className="w-4 h-4 text-amber-300" /> Copy Last Week
            </button>
            <button
              onClick={() => setShowLeave(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Request Leave
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-300" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Presets & Regional Hub Switcher ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hub Selector */}
        <div className="p-5 bg-white rounded-3xl border border-emerald-100/80 shadow-md shadow-emerald-950/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900 text-xs flex items-center gap-1.5"><Building className="w-4 h-4 text-emerald-700" /> Operating Agri Hub</span>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>
          <select
            value={activeHub}
            onChange={e => setActiveHub(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl font-black text-xs text-slate-900 outline-none shadow-2xs cursor-pointer"
          >
            {HUBS.map(h => (
              <option key={h.id} value={h.id}>{h.name} — {h.zone}</option>
            ))}
          </select>
          <div className="text-[11px] text-slate-500 font-bold">Dispatches and pickup crates are routed to this hub base.</div>
        </div>

        {/* 1-Tap Shift Presets */}
        <div className="lg:col-span-2 p-5 bg-white rounded-3xl border border-emerald-100/80 shadow-md shadow-emerald-950/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900 text-xs flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-600" /> 1-Tap Fast Shift Presets</span>
            <span className="text-[11px] text-slate-500 font-bold">Applies to all active workdays</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SHIFT_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer shadow-2xs group active:scale-95"
              >
                <div className="font-black text-xs text-slate-900 group-hover:text-emerald-950">{p.label}</div>
                <div className="text-[10px] font-black text-emerald-700 mt-0.5">{p.hours}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled Workdays', value: `${workingDays} / 7 Days`, icon: Zap, color: 'emerald' },
          { label: 'Weekly Planned Hours', value: `${totalHours} Hours`, icon: Clock, color: 'teal' },
          { label: 'Rest & Recovery Time', value: `${restHours} Hours`, icon: Coffee, color: 'amber' },
          { label: 'Shift Rest Conflicts', value: conflicts.length > 0 ? `${conflicts.length} Notice` : '✓ Optimal', icon: AlertTriangle, color: conflicts.length ? 'rose' : 'emerald' }
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-5 rounded-3xl bg-white border border-emerald-100/80 shadow-md shadow-emerald-950/5 flex items-center gap-3.5">
              <div className="p-3 bg-slate-100 rounded-2xl shrink-0 text-emerald-700 shadow-2xs">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-lg text-slate-900 font-mono tabular-nums">{stat.value}</div>
                <div className="text-[11px] font-bold text-slate-500">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Conflict Warnings ── */}
      {conflicts.length > 0 && (
        <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 font-black text-rose-950 text-sm">
            <AlertTriangle className="w-4.5 h-4.5 text-rose-700" />
            {conflicts.length} Shift Rest Gap Warning{conflicts.length > 1 ? 's' : ''} Detected
          </div>
          {conflicts.map((c, i) => (
            <div key={i} className="text-xs text-rose-800 font-bold pl-6 leading-relaxed">
              • Only <strong>{c.restHours}h</strong> rest between {c.prevDay} shift end and {c.day} shift start. We recommend at least 8 hours of rest for road safety.
            </div>
          ))}
        </div>
      )}

      {/* ── View Toggle + Content ── */}
      <div className="bg-white rounded-3xl border border-emerald-100/80 shadow-md shadow-emerald-950/5 overflow-hidden">

        {/* Tab bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 border-b border-slate-100">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {[
              { id: 'grid',  icon: LayoutGrid,  label: 'Week Matrix Grid' },
              { id: 'list',  icon: List,         label: 'Day Roster Pickers' },
              { id: 'month', icon: CalendarDays, label: 'Monthly Summary' },
            ].map(v => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    view === v.id
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${view === v.id ? 'text-amber-300' : ''}`} />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95 shadow-md"
          >
            <Save className="w-4 h-4 text-amber-300" /> Save Schedule Roster
          </button>
        </div>

        {/* ════════════ GRID VIEW ════════════ */}
        {view === 'grid' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-xs font-bold border-separate border-spacing-1.5">
              <thead>
                <tr>
                  <th className="w-16 text-left text-slate-500 font-black pb-2 pl-2">Time</th>
                  {DAYS_SHORT.map((day) => {
                    const s = schedule[day];
                    return (
                      <th key={day} className="text-center pb-2">
                        <button
                          onClick={() => handleDayToggle(day)}
                          className={`w-full py-2.5 rounded-2xl font-black text-xs cursor-pointer transition-all border shadow-2xs ${
                            s.enabled
                              ? 'bg-emerald-800 text-white border-emerald-700 hover:bg-emerald-700'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          <div>{day}</div>
                          <div className="text-[10px] font-bold mt-0.5 opacity-90 font-mono">
                            {s.enabled ? `${fmt(s.startH)}–${fmt(s.endH)}` : 'Off Duty'}
                          </div>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map(slot => (
                  <tr key={slot.value}>
                    <td className="text-slate-500 font-black text-[11px] pr-2 text-right align-middle whitespace-nowrap font-mono">
                      {slot.label}
                    </td>
                    {DAYS_SHORT.map(day => {
                      const state = getCellState(schedule, day, slot.value);
                      return (
                        <td key={day} className="text-center">
                          <button
                            onClick={() => handleCellClick(day, slot.value)}
                            title={`${day} ${slot.label}`}
                            className={`w-full h-8 rounded-xl transition-all cursor-pointer flex items-center justify-center text-xs font-black border ${
                              state === 'active'
                                ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 shadow-2xs'
                                : state === 'inactive'
                                ? 'bg-slate-50 border-slate-200 text-slate-300 hover:bg-emerald-50 hover:border-emerald-300'
                                : 'bg-slate-100/60 border-slate-200 text-slate-300 hover:bg-emerald-50'
                            }`}
                          >
                            {state === 'active' ? '✓' : state === 'off' ? '—' : ''}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-slate-500 font-bold mt-4 pl-2 flex items-center gap-1.5">
              💡 <span>Click a <strong>Day Header</strong> to toggle availability on/off · Click any <strong>Time Slot</strong> to expand active shift hours.</span>
            </p>
          </div>
        )}

        {/* ════════════ LIST VIEW ════════════ */}
        {view === 'list' && (
          <div className="p-6 space-y-3">
            {DAYS_SHORT.map((day, i) => {
              const s = schedule[day];
              const hours = hoursWorked(s);
              return (
                <div
                  key={day}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    s.enabled ? 'bg-slate-50 border-slate-200 hover:border-emerald-300' : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Day label + toggle */}
                    <div className="flex items-center gap-3.5 w-44 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`w-13 h-7 rounded-full transition-all cursor-pointer relative shrink-0 ${s.enabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
                      >
                        <span className={`w-5.5 h-5.5 rounded-full bg-white absolute top-0.75 transition-all shadow-md flex items-center justify-center ${s.enabled ? 'left-6.5 text-emerald-700' : 'left-1 text-slate-400'}`}>
                          {s.enabled ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                        </span>
                      </button>
                      <div>
                        <div className={`font-black text-sm ${s.enabled ? 'text-slate-900' : 'text-slate-400'}`}>{DAYS_FULL[i]}</div>
                        <div className="text-[11px] font-bold text-slate-500">{s.enabled ? `${hours}h Active Shift` : 'Scheduled Day Off'}</div>
                      </div>
                    </div>

                    {/* Time pickers */}
                    <div className={`flex flex-wrap items-center gap-3 flex-1 transition-opacity ${!s.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                        <Sunrise className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-black text-slate-600">Start:</span>
                        <select
                          value={s.startH}
                          onChange={e => handleTimeChange(day, 'startH', e.target.value)}
                          className="font-mono font-black text-xs text-slate-900 outline-none cursor-pointer bg-transparent"
                        >
                          {TIME_SLOTS.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <span className="text-slate-400 font-black">→</span>

                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                        <Sunset className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-black text-slate-600">End:</span>
                        <select
                          value={s.endH}
                          onChange={e => handleTimeChange(day, 'endH', e.target.value)}
                          className="font-mono font-black text-xs text-slate-900 outline-none cursor-pointer bg-transparent"
                        >
                          {TIME_SLOTS.filter(t => t.value > s.startH).map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Hours badge */}
                      {s.enabled && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full text-xs font-black">
                          {hours} Hours Total
                        </span>
                      )}

                      {/* Conflict badge */}
                      {conflicts.some(c => c.day === day) && (
                        <span className="px-3 py-1 bg-rose-100 text-rose-950 rounded-full text-[11px] font-black flex items-center gap-1 border border-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-700" /> Short Rest Gap
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════ MONTH VIEW ════════════ */}
        {view === 'month' && (
          <div className="p-6 sm:p-8">
            <MiniMonthCalendar schedule={schedule} />
          </div>
        )}

      </div>

      {/* ── Leave Modal ── */}
      {showLeave && <LeaveRequestForm showToast={showToast} onClose={() => setShowLeave(false)} />}
    </div>
  );
};

export default DeliveryShiftSchedule;
