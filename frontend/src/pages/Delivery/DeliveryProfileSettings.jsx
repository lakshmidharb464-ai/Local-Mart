import React, { useState, useRef, useMemo } from 'react';
import { Profile } from '../../components/Profile';
import { deliveryService } from '../../services/deliveryService';
import {
  User,
  Settings,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  Bell,
  Power,
  LogOut,
  Check,
  Star,
  Volume2,
  Lock,
  Save,
  Camera,
  BatteryCharging,
  MapPin,
  Sparkles,
  Zap,
  Key,
  Shield,
  CheckCircle2,
  Sliders,
  Play,
  FileText,
  Upload,
  X,
  Plus,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  Music,
  Smartphone,
  Package,
  Weight,
  Ruler,
  Radio,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  CreditCard,
  QrCode,
  Download,
  Search,
  CheckSquare,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS & PRESET DATA
───────────────────────────────────────────────────────────────────────────── */
const ZONE_OPTIONS = [
  'Pune Central Hub', 'Kothrud Market', 'Wakad Bypass', 'Hinjewadi IT Phase 1-3',
  'Baner Express Route', 'Aundh Green Zone', 'Viman Nagar Cold Hub', 'Hadapsar Mandi',
  'Kondhwa South', 'Swargate Terminal'
];

const RINGTONES = [
  { id: 'classic_chime', label: 'Classic Chime 🔔', desc: 'Standard pleasant double tone' },
  { id: 'farm_bell',     label: 'Farm Bell 🛎️',    desc: 'Deep resonating organic bell' },
  { id: 'urgent_pulse',  label: 'Urgent Pulse 🚨',  desc: 'High priority cold-chain alert' },
];

const MOCK_REVIEWS = [
  { id: 1, customer: 'Priya Sharma', rating: 5, tag: '⚡ Fast Delivery', comment: 'Delivered organic tomatoes and leafy greens in crisp cold condition! Very polite rider.', date: '25 Aug 2026' },
  { id: 2, customer: 'Amit Rao', rating: 5, tag: '🥬 Careful Handling', comment: 'Apples and eggs were packaged with zero damage. Highly recommended partner!', date: '24 Aug 2026' },
  { id: 3, customer: 'Nisha Kulkarni', rating: 4, tag: '⏱️ On Time', comment: 'Right on schedule before breakfast. Seamless OTP verification at door.', date: '23 Aug 2026' },
  { id: 4, customer: 'Ravi Teja', rating: 5, tag: '😊 Polite Rider', comment: 'Always cheerful and helpful with heavy farm crates. Great service!', date: '22 Aug 2026' },
  { id: 5, customer: 'Sunita Mehra', rating: 5, tag: '🌱 Eco Friendly', comment: 'Love that deliveries arrive via electric vehicle with reusable crates.', date: '21 Aug 2026' },
];

const MOCK_ROUTES = [
  { id: 'ORD-4821', area: 'Baner Road, Pune', hub: 'West Sector Hub', dist: '5.2 km', time: '22 min', earnings: '₹85', date: '25 Aug 2026', items: '4 Fresh Crates', rating: 5 },
  { id: 'ORD-4820', area: 'Wakad Circle, Pune', hub: 'Highway Cold Link', dist: '8.4 km', time: '31 min', earnings: '₹115', date: '25 Aug 2026', items: '6 Produce Boxes', rating: 5 },
  { id: 'ORD-4819', area: 'Hinjewadi Phase 2', hub: 'TechPark Green Hub', dist: '11.2 km', time: '38 min', earnings: '₹145', date: '25 Aug 2026', items: '8 Organic Packs', rating: 4 },
  { id: 'ORD-4818', area: 'Aundh Market, Pune', hub: 'Aundh Green Hub', dist: '6.8 km', time: '25 min', earnings: '₹95', date: '24 Aug 2026', items: '3 Veg Baskets', rating: 5 },
  { id: 'ORD-4817', area: 'Viman Nagar, Pune', hub: 'East Regional Center', dist: '9.3 km', time: '35 min', earnings: '₹125', date: '24 Aug 2026', items: '5 Dairy & Greens', rating: 5 },
  { id: 'ORD-4816', area: 'Kothrud Main Road', hub: 'Kothrud Farmer Center', dist: '4.9 km', time: '19 min', earnings: '₹75', date: '24 Aug 2026', items: '2 Fruit Hampers', rating: 5 },
  { id: 'ORD-4815', area: 'Pashan, Pune West', hub: 'West Sector Hub', dist: '7.1 km', time: '27 min', earnings: '₹95', date: '23 Aug 2026', items: '4 Vegetable Crates', rating: 4 },
  { id: 'ORD-4814', area: 'Swargate, Central Pune', hub: 'Central Agri Hub', dist: '12.4 km', time: '44 min', earnings: '₹165', date: '23 Aug 2026', items: '7 Bulk Sacks', rating: 5 },
  { id: 'ORD-4813', area: 'Hadapsar South', hub: 'East Regional Center', dist: '13.8 km', time: '49 min', earnings: '₹185', date: '22 Aug 2026', items: '10 Harvest Boxes', rating: 5 },
  { id: 'ORD-4812', area: 'Kondhwa Colony', hub: 'South Agri Link', dist: '10.2 km', time: '37 min', earnings: '₹135', date: '22 Aug 2026', items: '5 Produce Packs', rating: 4 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL UI ATOMS (High-Contrast & Accessible)
───────────────────────────────────────────────────────────────────────────── */
const Toggle = ({ value, onChange, disabled }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    aria-label="Toggle setting"
    className={`w-13 h-7 rounded-full transition-all cursor-pointer relative shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
      value ? 'bg-emerald-600 shadow-inner' : 'bg-slate-300'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
  >
    <span className={`w-5.5 h-5.5 rounded-full bg-white absolute top-0.75 transition-all shadow-md flex items-center justify-center ${
      value ? 'left-6.5 text-emerald-700' : 'left-1 text-slate-400'
    }`}>
      {value ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
    </span>
  </button>
);

const ZoneChip = ({ label, onRemove, color = 'emerald' }) => {
  const styles = {
    emerald: 'bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200',
    rose: 'bg-rose-100 text-rose-950 border-rose-300 hover:bg-rose-200'
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition-colors shadow-2xs ${styles[color] || styles.emerald}`}>
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
        aria-label={`Remove ${label}`}
      >
        <X className="w-3 h-3 stroke-[2.5]" />
      </button>
    </span>
  );
};

const StarRow = ({ filled, total = 5, size = 4 }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: total }).map((_, i) => (
      <Star
        key={i}
        className={`w-${size} h-${size} ${i < filled ? 'fill-amber-400 text-amber-500' : 'fill-slate-200 text-slate-300'}`}
      />
    ))}
  </span>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const DeliveryProfileSettings = ({ profile = {}, setProfile, activeTab = 'profile', showToast }) => {
  const { logout } = useAuth();

  /* ── Core formData ── */
  const [formData, setFormData] = useState({
    id: 'DEL-8802',
    name: 'Rohan Sharma',
    phone: '+91 98765 43210',
    email: 'rohan.delivery@greenmarket.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    vehicleType: 'EV Scooter (Ather 450X)',
    vehicleNumber: 'MH 12 FX 4920',
    licenseNumber: 'DL-14202688091',
    hubLocation: 'Pune Central Hub (Chittoor AP Route)',
    rating: 4.9,
    isOnline: true,
    autoAccept: true,
    maxActiveOrders: 3,
    /* ─ Emergency ─ */
    emergencyContact: { name: 'Sita Sharma (Spouse)', phone: '+91 98450 01122' },
    /* ─ Banking & Payout ─ */
    payoutInfo: {
      bankName: 'HDFC Bank Ltd.',
      accountNumber: '•••• •••• 4921',
      ifsc: 'HDFC0001248',
      upiId: 'rohan.sharma@okhdfcbank'
    },
    /* ─ Vehicle extra ─ */
    insuranceExpiry: '2027-03-15',
    batteryHealthPct: 94,
    estRangeKm: 68,
    maxLoadKg: 50,
    cargoDims: { lengthCm: 80, widthCm: 60, heightCm: 50 },
    /* ─ Dispatch extra ─ */
    deliveryRadiusKm: 15,
    preferredZones: ['Pune Central Hub', 'Kothrud Market', 'Baner Express Route'],
    avoidZones: ['Kondhwa South'],
    /* ─ Notifications ─ */
    notifications: { pushAlerts: true, soundAlerts: true, smsAlerts: true, voiceGuide: true, whatsappAlerts: true },
    ringtone: 'classic_chime',
    /* ─ Security ─ */
    twoFactorEnabled: true,
    /* ─ Ratings ─ */
    ratings: { average: 4.9, total: 312, breakdown: { 5: 260, 4: 38, 3: 10, 2: 3, 1: 1 } },
    recentReviews: MOCK_REVIEWS,
    /* ─ Documents ─ */
    documents: {
      license:   { file: null, preview: null, expiry: '2030-05-01', status: 'VERIFIED' },
      rc:        { file: null, preview: null, expiry: '2028-11-20', status: 'VERIFIED' },
      insurance: { file: null, preview: null, expiry: '2027-03-15', status: 'VERIFIED' }
    },
    ...profile
  });

  const [activeSubTab, setActiveSubTab] = useState(activeTab === 'settings' ? 'notifications' : 'profile');

  /* ── Password states ── */
  const [oldPassword, setOldPassword]         = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /* ── Zone input ── */
  const [zoneInput,      setZoneInput]      = useState('');
  const [avoidZoneInput, setAvoidZoneInput] = useState('');

  /* ── Review filter ── */
  const [ratingFilter, setRatingFilter]     = useState('all');

  /* ── Route Search ── */
  const [routeQuery, setRouteQuery]         = useState('');

  /* ── Doc upload refs ── */
  const docRefs = { license: useRef(), rc: useRef(), insurance: useRef() };

  /* ─────────────── HANDLERS ─────────────── */
  const toast = (title, msg, type = 'success') => {
    if (showToast) showToast(title, msg, type);
  };

  const apiSave = async (section, data, cb) => {
    try {
      if (data && Object.keys(data).length > 0) {
        await deliveryService.updateProfile(data).catch(e => console.warn('Delivery profile save sync:', e));
      }
      cb?.();
      setFormData(prev => ({ ...prev, ...data }));
      if (setProfile) setProfile(prev => ({ ...prev, ...data }));
    } catch (err) {
      toast('Error ⚠️', err.message, 'error');
    }
  };

  const handleToggleOnline = () => {
    const updated = !formData.isOnline;
    apiSave('dispatch', { isOnline: updated }, () =>
      toast(
        updated ? 'Partner Online 🟢' : 'Partner Offline 🔴',
        updated ? 'Active and available for fresh farm delivery dispatches.' : 'Dispatches paused. Take a rest!'
      )
    );
  };

  const handleNotificationToggle = (key) => {
    const updatedNotifs = { ...formData.notifications, [key]: !formData.notifications[key] };
    apiSave('notifications', { notifications: updatedNotifs }, () =>
      toast('Preference Saved 🔔', `Alert setting for "${key}" has been updated.`)
    );
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    apiSave('profile', {}, () => toast('Settings Updated ✨', 'Delivery partner dispatch configurations saved.'));
  };

  const handleSaveProfileData = (updatedData) => {
    const updated = { name: updatedData.name, email: updatedData.email, phone: updatedData.phone, avatar: updatedData.avatar };
    apiSave('profile/identity', updated, () => toast('Profile Saved! ✨', 'Partner identity details successfully updated.'));
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast('Password Mismatch ⚠️', 'New passwords do not match. Please verify.', 'error');
      return;
    }
    toast('Security Updated 🔒', 'Account authentication password successfully refreshed.');
    setOldPassword(''); setNewPassword(''); setConfirmPassword('');
  };

  const handlePlaySoundTest = () => {
    toast('🔊 Alert Chime Test', `Playing "${RINGTONES.find(r => r.id === formData.ringtone)?.label || 'Chime'}" preview.`);
  };

  const handleDocUpload = (type, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    const updated = {
      ...formData.documents,
      [type]: { ...formData.documents[type], file, preview, status: 'PENDING_REVIEW' }
    };
    setFormData(prev => ({ ...prev, documents: updated }));
    toast('Document Uploaded 📄', `${type.toUpperCase()} document uploaded. Tap Save Documents to submit.`);
  };

  const handleSaveDocs = (e) => {
    e.preventDefault();
    apiSave('documents', { documents: formData.documents }, () =>
      toast('Documents Saved 📎', 'All verification certificates submitted to hub manager.')
    );
  };

  const addZone = (type) => {
    const val = type === 'preferred' ? zoneInput.trim() : avoidZoneInput.trim();
    if (!val) return;
    const field = type === 'preferred' ? 'preferredZones' : 'avoidZones';
    if (!formData[field].includes(val)) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], val] }));
      toast('Zone Added 📍', `Added "${val}" to ${type === 'preferred' ? 'preferred' : 'avoid'} routes.`);
    }
    type === 'preferred' ? setZoneInput('') : setAvoidZoneInput('');
  };

  const removeZone = (type, zone) => {
    const field = type === 'preferred' ? 'preferredZones' : 'avoidZones';
    setFormData(prev => ({ ...prev, [field]: prev[field].filter(z => z !== zone) }));
  };

  /* ─────────────── SUB TABS ─────────────── */
  const subTabs = [
    { id: 'profile',        label: 'Partner Profile', icon: User,        badge: null },
    { id: 'vehicle',        label: 'Vehicle Specs',   icon: Truck,       badge: 'EV 94%' },
    { id: 'dispatch',       label: 'Route & Duty',    icon: Zap,         badge: formData.isOnline ? 'Online' : 'Offline' },
    { id: 'notifications',  label: 'Sound & Alerts',  icon: Bell,        badge: null },
    { id: 'ratings',        label: 'Ratings & Tips',  icon: Star,        badge: `${formData.ratings.average} ★` },
    { id: 'documents',      label: 'Certificates',    icon: FileText,    badge: '3 Verified' },
    { id: 'security',       label: 'Security & 2FA',  icon: ShieldCheck, badge: null },
    { id: 'earnings',       label: 'Bank & Payouts',  icon: DollarSign,  badge: null },
    { id: 'routes',         label: 'Trip History',    icon: MapPin,      badge: '10 Recent' },
  ];

  /* ── Filtered reviews ── */
  const filteredReviews = useMemo(() => {
    if (ratingFilter === 'all') return formData.recentReviews;
    return formData.recentReviews.filter(r => r.rating === Number(ratingFilter));
  }, [formData.recentReviews, ratingFilter]);

  /* ── Filtered routes ── */
  const filteredRouteList = useMemo(() => {
    if (!routeQuery.trim()) return MOCK_ROUTES;
    const q = routeQuery.toLowerCase();
    return MOCK_ROUTES.filter(r => r.id.toLowerCase().includes(q) || r.area.toLowerCase().includes(q) || r.hub.toLowerCase().includes(q));
  }, [routeQuery]);

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="space-y-6 pb-14 font-display animate-fadeIn">

      {/* ── Ultra-Premium Electric Eco-Green Logistics Hero Banner ── */}
      <div className="bg-gradient-to-br from-[#071F15] via-[#0B3D2E] to-[#134E39] rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-emerald-500/30 relative group transition-all duration-500">
        {/* Multi-layer glowing ambient highlights */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl group-hover:bg-emerald-500/25 transition-all duration-700" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl group-hover:bg-amber-400/25 transition-all duration-700" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group/avatar shrink-0">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-emerald-400/70 shadow-xl border-2 border-white/20 group-hover/avatar:scale-105 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 font-mono text-[11px] font-black border border-emerald-400/30">
                  ID: {formData.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-300 text-[11px] font-black border border-amber-400/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{formData.rating} Top Rated</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 backdrop-blur-md text-teal-300 text-[11px] font-black border border-teal-400/30 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-teal-300" />
                  <span>Eco Partner</span>
                </span>
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">{formData.name}</h1>
              <div className="text-xs text-emerald-100/90 font-bold flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-emerald-400" /><span>{formData.vehicleType}</span></span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /><span>{formData.hubLocation}</span></span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><BatteryCharging className="w-3.5 h-3.5 text-emerald-300" /><span>EV Battery: {formData.batteryHealthPct}% ({formData.estRangeKm} km range)</span></span>
              </div>
            </div>
          </div>

          {/* Quick Online/Offline Duty Card */}
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shadow-xl">
            <div className="text-center sm:text-left">
              <div className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">Live Duty Status</div>
              <div className="font-black text-sm text-white flex items-center gap-2 mt-0.5">
                <span className={`w-3 h-3 rounded-full ${formData.isOnline ? 'bg-emerald-400 animate-pulse ring-4 ring-emerald-400/30' : 'bg-rose-500'}`} />
                <span>{formData.isOnline ? 'Active for Farm Dispatch' : 'Duty Suspended (Offline)'}</span>
              </div>
            </div>
            <button
              onClick={handleToggleOnline}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                formData.isOnline
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:from-emerald-300 hover:to-teal-300'
                  : 'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{formData.isOnline ? 'Go Offline' : 'Go Online Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub Tab Bar — Sticky & High Contrast Glassmorphic Floating Pill Bar ── */}
      <div className="sticky top-2 z-20 flex items-center gap-2 overflow-x-auto p-2.5 bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-200/80 shadow-lg shadow-emerald-950/5 scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-98 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/50 scale-[1.02]'
                  : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 border border-slate-200/80 hover:border-emerald-300'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-950'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Main Tab Content Box ── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100/80 shadow-md shadow-emerald-950/5 space-y-6">

        {/* ════════════════ TAB: Partner Profile ════════════════ */}
        {activeSubTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <Profile
              initialData={{ name: formData.name, email: formData.email, phone: formData.phone, avatar: formData.avatar }}
              userRole="Delivery Partner"
              onSave={handleSaveProfileData}
              showToast={showToast}
            />

            {/* Emergency SOS Contact Card */}
            <div className="p-6 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-100 rounded-xl"><Phone className="w-5 h-5 text-rose-700" /></div>
                  <div>
                    <div className="font-black text-base text-rose-950">Emergency SOS Contact</div>
                    <div className="text-xs text-rose-800 font-bold">Instantly alerted during breakdown, severe delay, or medical assistance</div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-rose-200/70 text-rose-950 rounded-full font-black text-[11px] border border-rose-300">
                  🆘 24/7 SOS Enabled
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-black text-rose-950 text-xs mb-1.5 block">Contact Name & Relation</label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={e => setFormData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, name: e.target.value } }))}
                    placeholder="e.g. Sita Sharma (Spouse)"
                    className="w-full px-4 py-2.5 bg-white border border-rose-200 focus:border-rose-500 rounded-xl text-xs font-bold text-rose-950 outline-none transition-all shadow-2xs"
                  />
                </div>
                <div>
                  <label className="font-black text-rose-950 text-xs mb-1.5 block">Emergency Phone Number</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={e => setFormData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, phone: e.target.value } }))}
                    placeholder="+91 98450 01122"
                    className="w-full px-4 py-2.5 bg-white border border-rose-200 focus:border-rose-500 rounded-xl text-xs font-bold text-rose-950 outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => toast('📞 Emergency Test Ping', 'Dialing simulated ping to emergency contact.', 'info')}
                  className="px-4 py-2 bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 rounded-xl text-xs font-black cursor-pointer transition-all"
                >
                  Test SOS Ping
                </button>
                <button
                  type="button"
                  onClick={() => apiSave('profile/emergency', { emergencyContact: formData.emergencyContact }, () => toast('Emergency Contact Saved 🆘', 'Emergency contact successfully updated.'))}
                  className="px-5 py-2 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer active:scale-95 transition-all shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save SOS Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ TAB: Vehicle Specs ════════════════ */}
        {activeSubTab === 'vehicle' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-amber-100 rounded-2xl"><Truck className="w-6 h-6 text-amber-800" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Vehicle Specifications & Cold-Chain Capacity</h3>
                <p className="text-xs text-slate-600 font-bold">Configure registered delivery vehicle details, battery telemetry & payload parameters</p>
              </div>
            </div>

            {/* Vehicle Type Cards */}
            <div className="space-y-2">
              <label className="font-black text-slate-900 text-xs block">Select Active Transport Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'EV Scooter (Ather 450X)',    name: 'EV Smart Scooter',    tag: '⚡ Zero Emissions', desc: 'Best for local urban baskets & express deliveries', icon: BatteryCharging },
                  { id: 'Motorcycle (Hero Splendor)', name: 'Cargo Motorcycle',    tag: '🏍️ Fast Transit',   desc: 'Optimized for highway links and remote village routes', icon: Truck },
                  { id: 'Cold-Chain Mini Van',        name: 'Refrigerated Mini Van', tag: '❄️ Cold-Chain 4°C', desc: 'Ideal for large organic milk, dairy & harvest sacks', icon: Zap }
                ].map((v) => {
                  const isSelected = formData.vehicleType.includes(v.name.split(' ')[0]);
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setFormData({ ...formData, vehicleType: v.id })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2.5 ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-600 shadow-md ring-2 ring-emerald-300/60'
                          : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-800'}`}>
                          {v.tag}
                        </span>
                      </div>
                      <div className="font-black text-slate-900 text-sm">{v.name}</div>
                      <div className="text-[11px] text-slate-600 font-bold leading-relaxed">{v.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registration Plate + Commercial License */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <label className="font-black text-slate-900 text-xs block">Vehicle License Plate (RTO Number)</label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  placeholder="e.g. MH 12 FX 4920"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 rounded-xl font-mono font-black text-xs text-slate-900 outline-none uppercase shadow-2xs"
                  required
                />
                <span className="text-[10px] text-slate-500 font-bold">Must match commercial registration certificate (RC)</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <label className="font-black text-slate-900 text-xs block">Commercial Driving License (DL No.)</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="e.g. DL-14202688091"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 rounded-xl font-mono font-black text-xs text-slate-900 outline-none uppercase shadow-2xs"
                  required
                />
                <span className="text-[10px] text-slate-500 font-bold">Valid for light transport vehicles (LMV-TR)</span>
              </div>
            </div>

            {/* EV Battery & Insurance Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-950 flex items-center gap-1.5"><BatteryCharging className="w-4 h-4 text-emerald-700" /> EV Battery Telemetry</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-xs font-black">{formData.batteryHealthPct}% Health</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-emerald-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${formData.batteryHealthPct}%` }} />
                  </div>
                  <span className="font-black text-xs text-emerald-900">{formData.estRangeKm} km Est. Range</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                <label className="font-black text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" /> Insurance Expiry Policy
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={e => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white border border-blue-300 focus:border-blue-600 rounded-xl font-black text-xs text-slate-900 outline-none shadow-2xs"
                  />
                  <span className="px-3 py-1.5 bg-blue-200 text-blue-950 rounded-xl text-[11px] font-black shrink-0">
                    Active • 220 Days Left
                  </span>
                </div>
              </div>
            </div>

            {/* Load Capacity & Cargo Dims */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-700" />
                  <span className="font-black text-slate-900 text-sm">Cargo Box & Payload Parameters</span>
                </div>
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Approx. 6 Standard Farm Crates
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-black text-slate-800 text-xs block flex items-center gap-1"><Weight className="w-3.5 h-3.5 text-emerald-700" /> Max Payload (kg)</label>
                  <input
                    type="number" min="1" max="1000"
                    value={formData.maxLoadKg}
                    onChange={e => setFormData({ ...formData, maxLoadKg: +e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 rounded-xl font-black text-xs text-slate-900 outline-none shadow-2xs"
                  />
                </div>
                {['lengthCm', 'widthCm', 'heightCm'].map(dim => (
                  <div key={dim} className="space-y-1">
                    <label className="font-black text-slate-800 text-xs block flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-emerald-700" /> {dim.replace('Cm', ' (cm)')}
                    </label>
                    <input
                      type="number" min="1"
                      value={formData.cargoDims[dim]}
                      onChange={e => setFormData({ ...formData, cargoDims: { ...formData.cargoDims, [dim]: +e.target.value } })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 rounded-xl font-black text-xs text-slate-900 outline-none shadow-2xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button type="submit" className="px-7 py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all">
                <Save className="w-4 h-4 text-amber-300" /> Save Vehicle Specifications
              </button>
            </div>
          </form>
        )}

        {/* ════════════════ TAB: Availability & Dispatch ════════════════ */}
        {activeSubTab === 'dispatch' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-blue-100 rounded-2xl"><Zap className="w-6 h-6 text-blue-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Availability & Dispatch Radius Settings</h3>
                <p className="text-xs text-slate-600 font-bold">Manage duty hours, automated task assignment, and preferred geo-fence zones</p>
              </div>
            </div>

            {/* Online Toggle & Auto-Accept */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-black text-sm text-slate-900">Live Dispatch Switch</div>
                  <div className="text-slate-600 text-xs font-bold leading-relaxed">
                    {formData.isOnline
                      ? '🟢 You are online. Hub managers can assign urgent farm dispatches.'
                      : '🔴 You are offline. No new orders will be assigned.'}
                  </div>
                </div>
                <Toggle value={formData.isOnline} onChange={handleToggleOnline} />
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-black text-sm text-slate-900">Auto-Accept Fast Dispatches</div>
                  <div className="text-slate-600 text-xs font-bold leading-relaxed">
                    Automatically accept direct farm-to-hub express deliveries within 5 km.
                  </div>
                </div>
                <Toggle
                  value={formData.autoAccept}
                  onChange={() => {
                    const upd = !formData.autoAccept;
                    setFormData(prev => ({ ...prev, autoAccept: upd }));
                    toast('Auto-Accept Updated ⚡', upd ? 'Auto-accept enabled for express routes.' : 'Auto-accept disabled. Manual confirm required.');
                  }}
                />
              </div>
            </div>

            {/* Hub Location & Active Order Limit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-black text-slate-900 text-xs block">Assigned Regional Agri Hub</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.hubLocation}
                    onChange={e => setFormData({ ...formData, hubLocation: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 rounded-xl text-xs font-black text-slate-900 outline-none transition-all shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 text-xs block">Max Active Orders Concurrently</label>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 font-black text-xs rounded-full">
                    {formData.maxActiveOrders} Orders Max
                  </span>
                </div>
                <input
                  type="range" min="1" max="6" step="1"
                  value={formData.maxActiveOrders}
                  onChange={e => setFormData({ ...formData, maxActiveOrders: +e.target.value })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>1 (Single drop)</span><span>3 (Standard batch)</span><span>6 (Max capacity)</span>
                </div>
              </div>
            </div>

            {/* Delivery Radius Slider */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-700" /> Max Delivery Radius Geo-Fence
                </label>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full font-mono font-black text-xs">
                  {formData.deliveryRadiusKm} km Radius
                </span>
              </div>
              <input
                type="range" min="5" max="50" step="1"
                value={formData.deliveryRadiusKm}
                onChange={e => setFormData({ ...formData, deliveryRadiusKm: +e.target.value })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                <span>5 km (Local Farmers Market)</span>
                <span>25 km (City-wide Express)</span>
                <span>50 km (Regional Cold-Chain Corridor)</span>
              </div>
            </div>

            {/* Preferred Zones */}
            <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
              <label className="font-black text-emerald-950 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Preferred Delivery Corridors (High Priority)
              </label>
              <div className="flex flex-wrap gap-2 min-h-8">
                {formData.preferredZones.map(z => (
                  <ZoneChip key={z} label={z} onRemove={() => removeZone('preferred', z)} color="emerald" />
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={zoneInput}
                  onChange={e => setZoneInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-emerald-300 focus:border-emerald-600 rounded-xl text-xs font-bold text-slate-900 outline-none shadow-2xs"
                >
                  <option value="">— Select corridor to add —</option>
                  {ZONE_OPTIONS.filter(z => !formData.preferredZones.includes(z)).map(z => <option key={z} value={z}>{z}</option>)}
                </select>
                <button type="button" onClick={() => addZone('preferred')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1 shadow-xs active:scale-95">
                  <Plus className="w-3.5 h-3.5" /> Add Corridor
                </button>
              </div>
            </div>

            {/* Avoid Zones */}
            <div className="p-5 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
              <label className="font-black text-rose-950 text-xs flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-700" /> Excluded / Heavy Traffic Zones to Avoid
              </label>
              <div className="flex flex-wrap gap-2 min-h-8">
                {formData.avoidZones.map(z => (
                  <ZoneChip key={z} label={z} onRemove={() => removeZone('avoid', z)} color="rose" />
                ))}
                {formData.avoidZones.length === 0 && <span className="text-[11px] text-rose-400 font-bold italic">No zones marked to avoid</span>}
              </div>
              <div className="flex gap-2">
                <select
                  value={avoidZoneInput}
                  onChange={e => setAvoidZoneInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-rose-300 focus:border-rose-500 rounded-xl text-xs font-bold text-slate-900 outline-none shadow-2xs"
                >
                  <option value="">— Select zone to avoid —</option>
                  {ZONE_OPTIONS.filter(z => !formData.avoidZones.includes(z)).map(z => <option key={z} value={z}>{z}</option>)}
                </select>
                <button type="button" onClick={() => addZone('avoid')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1 shadow-xs active:scale-95">
                  <Plus className="w-3.5 h-3.5" /> Exclude Zone
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button type="submit" className="px-7 py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all">
                <Save className="w-4 h-4 text-amber-300" /> Save Dispatch Settings
              </button>
            </div>
          </form>
        )}

        {/* ════════════════ TAB: Sound & Alerts ════════════════ */}
        {activeSubTab === 'notifications' && (
          <div className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-2xl"><Bell className="w-6 h-6 text-amber-800" /></div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Notification & Alert Audio Preferences</h3>
                  <p className="text-xs text-slate-600 font-bold">Manage urgent dispatch ringtones, turn-by-turn spoken guidance & SMS fallbacks</p>
                </div>
              </div>
              <button
                onClick={handlePlaySoundTest}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Test Ringtone Audio 🔊
              </button>
            </div>

            {/* Alert Toggles */}
            <div className="space-y-3">
              {[
                { key: 'pushAlerts',     icon: Bell,          title: 'Push Notifications for New Dispatches', desc: 'Instant popup alert when an organic farm order is assigned to your vehicle' },
                { key: 'soundAlerts',    icon: Volume2,       title: 'High-Priority Loud Chime',             desc: 'Play ringing audible chime notification for express and cold-chain deliveries' },
                { key: 'voiceGuide',     icon: Radio,         title: 'Spoken Turn-by-Turn Navigation Voice',  desc: 'Audio speech guidance for pickup gates and drop locations while driving' },
                { key: 'smsAlerts',      icon: MessageSquare, title: 'SMS Customer Fallback Backup',          desc: 'Receive customer phone numbers and gate PIN via offline SMS in low signal areas' },
                { key: 'whatsappAlerts', icon: Smartphone,    title: 'WhatsApp Dispatch Sync',               desc: 'Send order waybills and Google Maps links directly to your registered WhatsApp' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 hover:border-emerald-300 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-emerald-700 shadow-2xs">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-black text-slate-900 text-sm">{item.title}</div>
                        <div className="text-slate-600 text-xs font-bold leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                    <Toggle value={formData.notifications[item.key]} onChange={() => handleNotificationToggle(item.key)} />
                  </div>
                );
              })}
            </div>

            {/* Ringtone Selector Cards */}
            <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
              <label className="font-black text-purple-950 text-xs flex items-center gap-1.5">
                <Music className="w-4 h-4 text-purple-700" /> Incoming Order Ringtone Profile
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {RINGTONES.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, ringtone: r.id }));
                      toast(`🎵 Ringtone: ${r.label}`, 'Tap "Test Ringtone Audio" to preview sound.');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                      formData.ringtone === r.id
                        ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-300'
                        : 'bg-white text-purple-950 border-purple-200 hover:border-purple-400'
                    }`}
                  >
                    <div className="font-black text-xs flex items-center justify-between">
                      <span>{r.label}</span>
                      {formData.ringtone === r.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`text-[11px] font-bold ${formData.ringtone === r.id ? 'text-purple-100' : 'text-purple-700'}`}>
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ TAB: Ratings & Tips ════════════════ */}
        {activeSubTab === 'ratings' && (
          <div className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-amber-100 rounded-2xl"><Star className="w-6 h-6 text-amber-700 fill-amber-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Customer Feedback & Service Ratings</h3>
                <p className="text-xs text-slate-600 font-bold">Aggregated reviews, customer compliments & bonus eligibility metrics</p>
              </div>
            </div>

            {/* Score & Distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 space-y-2.5 shadow-sm">
                <div className="text-6xl font-black text-amber-600 tracking-tight">{formData.ratings.average}</div>
                <StarRow filled={Math.round(formData.ratings.average)} size={6} />
                <div className="text-slate-700 font-black text-xs">{formData.ratings.total} Verified Customer Reviews</div>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full font-black text-[11px] shadow-2xs">
                  🏆 Top 2% Delivery Partner in Region
                </span>
              </div>

              {/* Breakdown bars */}
              <div className="space-y-2.5 justify-center flex flex-col p-4 bg-slate-50 rounded-3xl border border-slate-200">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = formData.ratings.breakdown[star] || 0;
                  const pct   = Math.round((count / formData.ratings.total) * 100);
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="font-black text-xs text-slate-800 w-12 flex items-center gap-1">{star} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /></span>
                      <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-14 text-right text-slate-700 font-mono font-black text-xs">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compliments & Tags */}
            <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
              <div className="font-black text-emerald-950 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" /> Partner Compliment Badges Earned
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { tag: '⚡ Lightning Fast (142)', color: 'amber' },
                  { tag: '🥬 Crisp & Fresh Handling (98)', color: 'emerald' },
                  { tag: '😊 Polite & Courteous (115)', color: 'blue' },
                  { tag: '🌱 Eco EV Champion (84)', color: 'teal' },
                  { tag: '🚪 Exact Door Delivery (76)', color: 'purple' }
                ].map((c, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-950 font-black text-xs shadow-2xs">
                    {c.tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Filter & Reviews List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-slate-900 text-sm">Recent Customer Reviews</div>
                <div className="flex gap-1.5">
                  {['all', '5', '4'].map(f => (
                    <button
                      key={f}
                      onClick={() => setRatingFilter(f)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                        ratingFilter === f ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {f === 'all' ? 'All Reviews' : `${f} Stars`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                {filteredReviews.map(review => (
                  <div key={review.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-emerald-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-sm shadow-xs">
                          {review.customer[0]}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-xs">{review.customer}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.tag && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px]">
                            {review.tag}
                          </span>
                        )}
                        <StarRow filled={review.rating} size={3.5} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 font-medium italic pl-10">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ TAB: Certificates & Compliance ════════════════ */}
        {activeSubTab === 'documents' && (
          <form onSubmit={handleSaveDocs} className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-sky-100 rounded-2xl"><FileText className="w-6 h-6 text-sky-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Legal Compliance & Verification Documents</h3>
                <p className="text-xs text-slate-600 font-bold">Upload driving license, vehicle registration, and active third-party insurance certificate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'license',   label: "Driver's License (DL)", icon: '🪪', refKey: 'license', desc: 'Valid Commercial LMV License' },
                { key: 'rc',        label: 'Vehicle RC Book',       icon: '📋', refKey: 'rc',      desc: 'RTO Registration Certificate' },
                { key: 'insurance', label: 'Vehicle Insurance',     icon: '🛡️', refKey: 'insurance', desc: 'Comprehensive or 3rd Party Cover' },
              ].map(doc => {
                const d = formData.documents[doc.key];
                const isVerified = d.status === 'VERIFIED';
                return (
                  <div key={doc.key} className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between shadow-2xs hover:border-emerald-300 transition-colors">
                    {/* Top Status */}
                    <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">{doc.label}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isVerified ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-amber-100 text-amber-950 border border-amber-300'
                      }`}>
                        {isVerified ? '✓ VERIFIED' : 'PENDING'}
                      </span>
                    </div>

                    {/* Upload dropzone */}
                    <div
                      onClick={() => docRefs[doc.refKey].current?.click()}
                      className="p-6 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group hover:bg-emerald-50/50"
                    >
                      {d.preview ? (
                        <img src={d.preview} alt={doc.label} className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-sm" />
                      ) : (
                        <>
                          <div className="text-4xl">{doc.icon}</div>
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                        </>
                      )}
                      <span className="text-[11px] text-slate-600 font-bold text-center">{doc.desc}</span>
                      <span className="text-[10px] text-emerald-700 font-black">{d.preview ? 'Tap to re-upload' : 'JPG, PNG, PDF (< 5MB)'}</span>
                      <input
                        ref={docRefs[doc.refKey]}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={e => handleDocUpload(doc.key, e.target.files?.[0])}
                      />
                    </div>

                    {/* Expiry control */}
                    <div className="p-3 bg-white border-t border-slate-200 space-y-1">
                      <label className="font-black text-slate-800 block text-[10px]">Certificate Expiry Date</label>
                      <input
                        type="date"
                        value={formData.documents[doc.key].expiry}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, [doc.key]: { ...prev.documents[doc.key], expiry: e.target.value } }
                        }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl font-black text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button type="submit" className="px-7 py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all">
                <Save className="w-4 h-4 text-amber-300" /> Save Compliance Documents
              </button>
            </div>
          </form>
        )}

        {/* ════════════════ TAB: Security & 2FA ════════════════ */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleSavePassword} className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-emerald-100 rounded-2xl"><ShieldCheck className="w-6 h-6 text-emerald-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Security Credentials & Account Access</h3>
                <p className="text-xs text-slate-600 font-bold">Configure SMS two-factor verification, update password, and manage active session devices</p>
              </div>
            </div>

            {/* 2FA Toggle */}
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-blue-100 rounded-xl"><Smartphone className="w-5 h-5 text-blue-700" /></div>
                <div>
                  <div className="font-black text-blue-950 text-sm">Two-Factor Authentication (SMS OTP)</div>
                  <div className="text-xs text-blue-800 font-bold mt-0.5">
                    {formData.twoFactorEnabled
                      ? '🔒 Active: Login requires instant OTP sent to your registered phone number.'
                      : '⚠️ Disabled: We strongly recommend enabling OTP to protect your dispatch account.'}
                  </div>
                </div>
              </div>
              <Toggle
                value={formData.twoFactorEnabled}
                onChange={() => {
                  const updated = !formData.twoFactorEnabled;
                  setFormData(prev => ({ ...prev, twoFactorEnabled: updated }));
                  toast(
                    updated ? '2FA Enabled 🔐' : '2FA Disabled',
                    updated ? 'SMS OTP verification is now mandatory for every login.' : 'Two-factor auth has been disabled.'
                  );
                }}
              />
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-black text-slate-900 text-xs block">Current Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none font-mono text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-black text-slate-900 text-xs block">New Security Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none font-mono text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-black text-slate-900 text-xs block">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Logout Card */}
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-black text-rose-950 text-xs">Active Session Management</div>
                  <div className="text-[11px] text-rose-800 font-bold mt-0.5">Sign out from this browser session or revoke all mobile dispatch tokens</div>
                </div>
                <button
                  type="button" onClick={logout}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-2 active:scale-95"
                >
                  <LogOut className="w-4 h-4" /> Logout Session Now
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button type="submit" className="px-7 py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all">
                <ShieldCheck className="w-4 h-4 text-amber-300" /> Update Password Credentials
              </button>
            </div>
          </form>
        )}

        {/* ════════════════ TAB: Bank & Payouts ════════════════ */}
        {activeSubTab === 'earnings' && (
          <div className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-emerald-100 rounded-2xl"><DollarSign className="w-6 h-6 text-emerald-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Bank Account & Weekly Payout Preferences</h3>
                <p className="text-xs text-slate-600 font-bold">Configure direct bank deposit / UPI ID and monitor automated Tuesday settlements</p>
              </div>
            </div>

            {/* Bank Card / UPI Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-[#071F15] to-[#0B3D2E] text-white rounded-3xl border border-emerald-500/30 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-300" />
                    <span className="font-black text-sm text-white">Direct Bank Settlement</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-300 rounded-full font-mono text-[10px] font-black border border-emerald-400/30">
                    PRIMARY
                  </span>
                </div>
                <div className="font-mono text-lg font-black tracking-wider text-emerald-200">
                  {formData.payoutInfo.accountNumber}
                </div>
                <div className="flex justify-between items-end text-xs text-emerald-100 font-bold">
                  <div>
                    <div className="text-[10px] text-emerald-400 uppercase">Bank Name</div>
                    <div>{formData.payoutInfo.bankName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-400 uppercase">IFSC Code</div>
                    <div className="font-mono">{formData.payoutInfo.ifsc}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <span className="font-black text-sm text-slate-900">Instant UPI VPA Payout</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded-full font-mono text-[10px] font-black">
                    BACKUP
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono font-black text-xs text-slate-900 flex items-center justify-between">
                  <span>{formData.payoutInfo.upiId}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-600 font-bold leading-relaxed">
                  Fast payouts for extra trip incentives are credited directly to this UPI address every Sunday night.
                </div>
              </div>
            </div>

            {/* Income Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Today's Deliveries", value: '₹480', sub: '6 Trips Completed', color: 'emerald', icon: Zap },
                { label: 'This Week Earnings', value: '₹2,840', sub: '38 Trips Completed', color: 'teal', icon: TrendingUp },
                { label: 'This Month Total', value: '₹11,260', sub: '148 Trips Completed', color: 'amber', icon: Award },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <Icon className="w-5 h-5 text-emerald-700" />
                      <span className="text-[11px] font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full">{c.sub}</span>
                    </div>
                    <div className="font-black text-2xl text-slate-900">{c.value}</div>
                    <div className="text-xs font-bold text-slate-600">{c.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Incentive Milestone Targets */}
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-4">
              <div className="font-black text-amber-950 text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" /> Active Weekly Incentive Target Milestones
              </div>
              {[
                { goal: 'Complete 50 Deliveries / Week', reward: '+₹500 Fuel Bonus', current: 38, target: 50 },
                { goal: 'Achieve 200 Deliveries / Month', reward: '+₹2,000 Milestone Bonus', current: 148, target: 200 },
                { goal: 'Maintain 4.8+ Rating (Monthly)', reward: '+₹300 Quality Bonus', current: 4.9, target: 4.8, isRating: true },
              ].map((m, i) => {
                const pct = Math.min(100, Math.round((m.current / m.target) * 100));
                const achieved = m.current >= m.target;
                return (
                  <div key={i} className={`p-4 rounded-2xl border ${achieved ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">{m.goal}</span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${achieved ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-950 border border-amber-300'}`}>
                        {achieved ? '✓ Target Achieved!' : m.reward}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${achieved ? 'bg-emerald-600' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                      <span>{m.isRating ? `${m.current} ★ current score` : `${m.current} of ${m.target} completed`}</span>
                      <span>{pct}% complete</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════ TAB: Trip History ════════════════ */}
        {activeSubTab === 'routes' && (
          <div className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-2xl"><MapPin className="w-6 h-6 text-blue-700" /></div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Completed Route & Trip Telemetry History</h3>
                  <p className="text-xs text-slate-600 font-bold">Audit delivery distance, transit time performance, and payout records</p>
                </div>
              </div>
              {/* Search filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={routeQuery}
                  onChange={e => setRouteQuery(e.target.value)}
                  placeholder="Search order ID or area..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Avg Transit Duration', value: '28 min', icon: Clock },
                { label: 'Avg Route Distance', value: '7.4 km', icon: MapPin },
                { label: 'Deliveries Today', value: '6 Drops', icon: Package },
                { label: 'Eco CO2 Saved', value: '14.2 kg', icon: Leaf },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1 shadow-2xs">
                    <Icon className="w-4.5 h-4.5 text-emerald-700 mx-auto" />
                    <div className="font-black text-base text-slate-900">{s.value}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Route List */}
            <div className="space-y-2.5">
              {filteredRouteList.map((route) => (
                <div key={route.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">{route.id}</span>
                      <span className="text-[11px] text-slate-500 font-bold">{route.date}</span>
                      <span className="text-[11px] text-slate-700 font-black">• {route.hub}</span>
                    </div>
                    <div className="font-black text-slate-900 text-sm">{route.area}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-bold flex-wrap">
                      <span>📍 {route.dist}</span>
                      <span>⏱ {route.time}</span>
                      <span>📦 {route.items}</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <span className="font-black text-base text-emerald-800">{route.earnings}</span>
                    <span className="flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {route.rating}.0 Rating
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DeliveryProfileSettings;
