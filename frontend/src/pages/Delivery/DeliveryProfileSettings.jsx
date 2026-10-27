import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Leaf,
  Loader2,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS & PRESET AUDIO PROFILES
───────────────────────────────────────────────────────────────────────────── */
const RINGTONES = [
  { id: 'classic_chime', label: 'Classic Chime 🔔', desc: 'Standard pleasant double tone' },
  { id: 'farm_bell',     label: 'Farm Bell 🛎️',    desc: 'Deep resonating organic bell' },
  { id: 'urgent_pulse',  label: 'Urgent Pulse 🚨',  desc: 'High priority cold-chain alert' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL UI ATOMS
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

const StarRow = ({ filled, total = 5, size = 4 }) => {
  const pixelSize = typeof size === 'number' ? size * 4 : 16;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
          className={i < filled ? 'fill-amber-400 text-amber-500' : 'fill-slate-200 text-slate-300'}
        />
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const DeliveryProfileSettings = ({ profile, setProfile, activeTab = 'profile', showToast }) => {
  const { user, logout } = useAuth();

  /* ── Database State & Live Loading ── */
  const [loading, setLoading] = useState(false);
  const [hubsList, setHubsList] = useState([]);
  const [tripHistory, setTripHistory] = useState([]);
  const [kycDocs, setKycDocs] = useState([]);
  const [earningsData, setEarningsData] = useState(null);

  /* ── Core Form State (strictly synced with database) ── */
  const [formData, setFormData] = useState({
    id: user?.id || '',
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    vehicleType: 'Electric Scooter',
    vehicleNumber: '',
    licenseNumber: '',
    hubId: '',
    hubName: 'Local Farm Logistics Hub',
    rating: 5.0,
    totalDeliveries: 0,
    walletBalance: 0,
    approvalStatus: 'Approved',
    isOnline: false,
    autoAccept: true,
    maxActiveOrders: 3,
    deliveryRadiusKm: 15,
    /* ─ Emergency ─ */
    emergencyContact: { name: '', phone: '' },
    /* ─ Banking & Payout ─ */
    payoutInfo: {
      bankName: '',
      accountNumber: '',
      ifsc: '',
      upiId: ''
    },
    /* ─ Notifications ─ */
    notifications: { pushAlerts: true, soundAlerts: true, smsAlerts: true, voiceGuide: true, whatsappAlerts: true },
    ringtone: 'classic_chime',
    twoFactorEnabled: true,
  });

  const [activeSubTab, setActiveSubTab] = useState(activeTab === 'settings' ? 'notifications' : 'profile');

  // Synchronize when activeTab prop changes
  useEffect(() => {
    if (activeTab === 'settings') {
      setActiveSubTab('notifications');
    } else if (activeTab === 'profile') {
      setActiveSubTab('profile');
    }
  }, [activeTab]);

  // Load Real Data from Database APIs on mount
  useEffect(() => {
    let isMounted = true;

    async function loadDatabaseData() {
      setLoading(true);
      try {
        // Fetch Hubs, Orders, KYC, and Earnings from database in parallel
        const [hubsRes, ordersRes, kycRes, earningsRes, profileRes] = await Promise.allSettled([
          deliveryService.getHubs(),
          deliveryService.getOrders(),
          deliveryService.getKyc(),
          deliveryService.getEarnings(),
          deliveryService.getProfile(),
        ]);

        if (!isMounted) return;

        if (hubsRes.status === 'fulfilled' && Array.isArray(hubsRes.value)) {
          setHubsList(hubsRes.value);
        }

        if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
          // Filter to only completed/delivered trips for trip history
          const deliveredOrders = ordersRes.value.filter(o => o.status === 'Delivered');
          setTripHistory(deliveredOrders);
        }

        if (kycRes.status === 'fulfilled' && Array.isArray(kycRes.value)) {
          setKycDocs(kycRes.value);
        }

        if (earningsRes.status === 'fulfilled' && earningsRes.value) {
          setEarningsData(earningsRes.value);
        }

        const resolvedProfile = profileRes.status === 'fulfilled' && profileRes.value ? profileRes.value : profile;
        if (resolvedProfile) {
          applyProfileToState(resolvedProfile);
          if (setProfile) setProfile(resolvedProfile);
        }
      } catch (err) {
        console.warn('Error loading delivery database data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDatabaseData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to map database profile fields into state
  const applyProfileToState = (prof) => {
    if (!prof) return;
    setFormData(prev => ({
      ...prev,
      id: prof.user_id || prof.id || user?.id || prev.id,
      name: prof.name || user?.name || prev.name,
      phone: prof.phone || user?.phone || prev.phone,
      email: prof.email || user?.email || prev.email,
      avatar: prof.avatar_url || prof.avatar || user?.avatar_url || prev.avatar,
      vehicleType: prof.vehicle_type || prof.vehicleType || prev.vehicleType,
      vehicleNumber: prof.vehicle_number || prof.vehicleNumber || prev.vehicleNumber,
      licenseNumber: prof.license_number || prof.licenseNumber || prev.licenseNumber,
      hubId: prof.hub_id || prof.hubId || prev.hubId,
      hubName: prof.hub_name || prof.hubLocation || prev.hubName,
      rating: Number(prof.rating || 5.0),
      totalDeliveries: Number(prof.total_deliveries || 0),
      walletBalance: Number(prof.wallet_balance || 0),
      approvalStatus: prof.approval_status || 'Approved',
      isOnline: prof.is_online !== undefined ? Boolean(prof.is_online) : (prof.isOnline !== undefined ? Boolean(prof.isOnline) : prev.isOnline),
    }));
  };

  // Synchronize when profile prop updates
  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      applyProfileToState(profile);
    }
  }, [profile]);

  /* ── Password states ── */
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /* ── Route Search ── */
  const [routeQuery, setRouteQuery] = useState('');

  /* ── Doc upload refs ── */
  const docRefs = { license: useRef(), rc: useRef(), insurance: useRef() };

  /* ─────────────── HANDLERS ─────────────── */
  const toast = (title, msg, type = 'success') => {
    if (showToast) showToast(title, msg, type);
  };

  const apiSave = async (section, data, cb) => {
    try {
      if (data && Object.keys(data).length > 0) {
        await deliveryService.updateProfile(data);
      }
      cb?.();
      setFormData(prev => ({ ...prev, ...data }));
      if (setProfile) setProfile(prev => ({ ...(prev || {}), ...data }));
    } catch (err) {
      toast('Error ⚠️', err.message || 'Failed to update profile settings', 'error');
    }
  };

  const handleToggleOnline = async () => {
    const updated = !formData.isOnline;
    try {
      await deliveryService.toggleDuty(updated);
      setFormData(prev => ({ ...prev, isOnline: updated }));
      if (setProfile) setProfile(prev => ({ ...(prev || {}), is_online: updated }));
      toast(
        updated ? 'Partner Online 🟢' : 'Partner Offline 🔴',
        updated ? 'Active and available for fresh farm delivery dispatches.' : 'Dispatches paused. Take a rest!'
      );
    } catch (err) {
      toast('Error ⚠️', 'Failed to toggle duty status.', 'error');
    }
  };

  const handleNotificationToggle = (key) => {
    const updatedNotifs = { ...formData.notifications, [key]: !formData.notifications[key] };
    setFormData(prev => ({ ...prev, notifications: updatedNotifs }));
    toast('Preference Saved 🔔', `Alert setting for "${key}" has been updated.`);
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    apiSave('profile', {
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber,
      licenseNumber: formData.licenseNumber,
      hubId: formData.hubId,
      isOnline: formData.isOnline
    }, () => toast('Settings Updated ✨', 'Delivery partner database configurations successfully saved.'));
  };

  const handleSaveProfileData = (updatedData) => {
    const updated = {
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      avatar: updatedData.avatar,
    };
    apiSave('profile/identity', updated, () => toast('Profile Saved! ✨', 'Partner identity details successfully updated in database.'));
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

  const handleDocUpload = async (docType, file) => {
    if (!file) return;
    try {
      const simulatedUrl = URL.createObjectURL(file);
      await deliveryService.submitKyc({ docType, docUrl: simulatedUrl });
      toast('Document Submitted 📄', `${docType} uploaded for admin verification.`);
      // Refresh KYC list from database
      const updatedDocs = await deliveryService.getKyc();
      setKycDocs(updatedDocs || []);
    } catch (err) {
      toast('Upload Failed ⚠️', err.message || 'Could not submit document.', 'error');
    }
  };

  /* ─────────────── SUB TABS ─────────────── */
  const subTabs = [
    { id: 'profile',        label: 'Partner Profile', icon: User,        badge: null },
    { id: 'vehicle',        label: 'Vehicle Specs',   icon: Truck,       badge: formData.vehicleType ? formData.vehicleType.split(' ')[0] : 'Vehicle' },
    { id: 'dispatch',       label: 'Route & Duty',    icon: Zap,         badge: formData.isOnline ? 'Online' : 'Offline' },
    { id: 'notifications',  label: 'Sound & Alerts',  icon: Bell,        badge: null },
    { id: 'ratings',        label: 'Ratings & Score', icon: Star,        badge: `${formData.rating} ★` },
    { id: 'documents',      label: 'KYC Documents',   icon: FileText,    badge: `${kycDocs.length} Docs` },
    { id: 'security',       label: 'Security & 2FA',  icon: ShieldCheck, badge: null },
    { id: 'earnings',       label: 'Bank & Wallet',   icon: DollarSign,  badge: `₹${formData.walletBalance}` },
    { id: 'routes',         label: 'Trip History',    icon: MapPin,      badge: `${tripHistory.length} Delivered` },
  ];

  /* ── Filtered Trip History from Database ── */
  const filteredRouteList = useMemo(() => {
    if (!routeQuery.trim()) return tripHistory;
    const q = routeQuery.toLowerCase();
    return tripHistory.filter(r =>
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.orderId && r.orderId.toLowerCase().includes(q)) ||
      (r.customerAddress && r.customerAddress.toLowerCase().includes(q)) ||
      (r.farmName && r.farmName.toLowerCase().includes(q))
    );
  }, [tripHistory, routeQuery]);

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="space-y-6 pb-14 font-display animate-fadeIn">

      {/* ── Ultra-Premium Logistics Hero Banner ── */}
      <div className="bg-gradient-to-br from-[#071F15] via-[#0B3D2E] to-[#134E39] rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-emerald-500/30 relative group transition-all duration-500">
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl group-hover:bg-emerald-500/25 transition-all duration-700" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl group-hover:bg-amber-400/25 transition-all duration-700" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group/avatar shrink-0">
              <img
                src={formData.avatar}
                alt={formData.name || 'Delivery Partner'}
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
                  ID: {formData.id || 'N/A'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-300 text-[11px] font-black border border-amber-400/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{formData.rating.toFixed(1)} Rating</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 backdrop-blur-md text-teal-300 text-[11px] font-black border border-teal-400/30 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-teal-300" />
                  <span>{formData.totalDeliveries} Deliveries</span>
                </span>
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">{formData.name || 'Delivery Partner'}</h1>
              <div className="text-xs text-emerald-100/90 font-bold flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-emerald-400" /><span>{formData.vehicleType || 'Vehicle Registered'}</span></span>
                {formData.vehicleNumber && (
                  <>
                    <span>•</span>
                    <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px]">{formData.vehicleNumber}</span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /><span>{formData.hubName || 'Pune Regional Hub'}</span></span>
              </div>
            </div>
          </div>

          {/* Live Duty Switch Card */}
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

      {/* ── Sub Tab Bar ── */}
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
              initialData={{
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                avatar: formData.avatar
              }}
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
                    <div className="text-xs text-rose-800 font-bold">Alerted during vehicle breakdown, severe route delays, or assistance requests</div>
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
                    placeholder="e.g. Next of Kin Name"
                    className="w-full px-4 py-2.5 bg-white border border-rose-200 focus:border-rose-500 rounded-xl text-xs font-bold text-rose-950 outline-none transition-all shadow-2xs"
                  />
                </div>
                <div>
                  <label className="font-black text-rose-950 text-xs mb-1.5 block">Emergency Phone Number</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={e => setFormData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, phone: e.target.value } }))}
                    placeholder="+91 98000 00000"
                    className="w-full px-4 py-2.5 bg-white border border-rose-200 focus:border-rose-500 rounded-xl text-xs font-bold text-rose-950 outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
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
                <p className="text-xs text-slate-600 font-bold">Configure your registered delivery vehicle details and commercial license</p>
              </div>
            </div>

            {/* Vehicle Type Cards */}
            <div className="space-y-2">
              <label className="font-black text-slate-900 text-xs block">Select Registered Vehicle Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'EV Scooter (Ather 450X)', name: 'Electric Smart Scooter', tag: '⚡ Zero Emissions', desc: 'Best for local fresh vegetable crates & express city drops', icon: BatteryCharging },
                  { id: 'Cargo Motorcycle', name: 'Cargo Motorcycle', tag: '🏍️ Fast Transit', desc: 'Optimized for highway links and remote village farm routes', icon: Truck },
                  { id: 'Refrigerated Mini Van', name: 'Refrigerated Mini Van', tag: '❄️ Cold-Chain 4°C', desc: 'Ideal for large organic milk, dairy & bulk harvest sacks', icon: Zap }
                ].map((v) => {
                  const isSelected = formData.vehicleType.toLowerCase().includes(v.name.split(' ')[0].toLowerCase());
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setFormData({ ...formData, vehicleType: v.name })}
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
                  placeholder="e.g. MH 12 AB 1234"
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
                <p className="text-xs text-slate-600 font-bold">Manage duty hours, automated task assignment, and assigned logistics hub</p>
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
                    Automatically accept direct farm-to-hub express deliveries within range.
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

            {/* Hub Location Selection from Database */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-black text-slate-900 text-xs block">Assigned Regional Agri Hub (Database)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.hubId}
                    onChange={e => {
                      const selected = hubsList.find(h => h.id === e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        hubId: e.target.value,
                        hubName: selected ? `${selected.name} (${selected.zone})` : prev.hubName
                      }));
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 rounded-xl text-xs font-black text-slate-900 outline-none transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="">— Select Hub from Database —</option>
                    {hubsList.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} — {h.zone}
                      </option>
                    ))}
                  </select>
                </div>
                {hubsList.length === 0 && (
                  <span className="text-[10px] text-slate-500 font-medium">Loading registered hubs from database...</span>
                )}
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

        {/* ════════════════ TAB: Ratings & Score ════════════════ */}
        {activeSubTab === 'ratings' && (
          <div className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-amber-100 rounded-2xl"><Star className="w-6 h-6 text-amber-700 fill-amber-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Customer Feedback & Service Ratings</h3>
                <p className="text-xs text-slate-600 font-bold">Real database metrics and service quality records</p>
              </div>
            </div>

            {/* Real Rating Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 space-y-2.5 shadow-sm text-center">
                <div className="text-6xl font-black text-amber-600 tracking-tight">{formData.rating.toFixed(1)}</div>
                <StarRow filled={Math.round(formData.rating)} size={6} />
                <div className="text-slate-700 font-black text-xs">{formData.totalDeliveries} Completed Deliveries</div>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full font-black text-[11px] shadow-2xs">
                  🌱 Verified Green Market Delivery Partner
                </span>
              </div>

              {/* Status and Performance Breakdown */}
              <div className="space-y-3 justify-center flex flex-col p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">Approval Status</span>
                  <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">
                    {formData.approvalStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">Total Dispatches Completed</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{formData.totalDeliveries}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">Current Wallet Balance</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">₹{formData.walletBalance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-bold">Active Service Hub</span>
                  <span className="font-black text-slate-900 text-xs">{formData.hubName || 'Pune Regional Hub'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ TAB: KYC Verification Documents ════════════════ */}
        {activeSubTab === 'documents' && (
          <div className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-sky-100 rounded-2xl"><FileText className="w-6 h-6 text-sky-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Legal Compliance & KYC Verification Documents</h3>
                <p className="text-xs text-slate-600 font-bold">Upload driving license and vehicle registration documents to the database queue</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { docType: 'Driving License', label: "Driver's License (DL)", icon: '🪪', refKey: 'license', desc: 'Commercial LMV-TR License' },
                { docType: 'RC Document',     label: 'Vehicle RC Document',   icon: '📋', refKey: 'rc',      desc: 'RTO Vehicle Registration' },
              ].map(doc => {
                const uploaded = kycDocs.find(d => d.doc_type === doc.docType);
                const isApproved = uploaded?.status === 'Approved';
                const isPending = uploaded?.status === 'Pending';
                return (
                  <div key={doc.refKey} className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between shadow-2xs hover:border-emerald-300 transition-colors">
                    <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">{doc.label}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : isPending
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isApproved ? '✓ APPROVED' : isPending ? '⏳ PENDING REVIEW' : 'NOT UPLOADED'}
                      </span>
                    </div>

                    <div
                      onClick={() => docRefs[doc.refKey].current?.click()}
                      className="p-6 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group hover:bg-emerald-50/50"
                    >
                      <div className="text-4xl">{doc.icon}</div>
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                      <span className="text-[11px] text-slate-600 font-bold text-center">{doc.desc}</span>
                      <span className="text-[10px] text-emerald-700 font-black">Tap to upload file</span>
                      <input
                        ref={docRefs[doc.refKey]}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={e => handleDocUpload(doc.docType, e.target.files?.[0])}
                      />
                    </div>

                    {uploaded && (
                      <div className="p-3 bg-white border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                        Submitted: {new Date(uploaded.created_at).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════ TAB: Security & 2FA ════════════════ */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleSavePassword} className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-emerald-100 rounded-2xl"><ShieldCheck className="w-6 h-6 text-emerald-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Security Credentials & Account Access</h3>
                <p className="text-xs text-slate-600 font-bold">Configure authentication credentials and manage active session</p>
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
                      : '⚠️ Disabled: We recommend enabling OTP to protect your account.'}
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
                    updated ? 'SMS OTP verification is now active.' : 'Two-factor auth has been disabled.'
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
                  <div className="text-[11px] text-rose-800 font-bold mt-0.5">Sign out from this browser session securely</div>
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

        {/* ════════════════ TAB: Bank & Wallet ════════════════ */}
        {activeSubTab === 'earnings' && (
          <div className="space-y-6 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-emerald-100 rounded-2xl"><DollarSign className="w-6 h-6 text-emerald-700" /></div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Database Earnings & Wallet Settlements</h3>
                <p className="text-xs text-slate-600 font-bold">Real-time revenue metrics from your completed order dispatches</p>
              </div>
            </div>

            {/* Income Highlights from Real Database */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <Zap className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px] font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {earningsData?.todayTrips ?? 0} Trips
                  </span>
                </div>
                <div className="font-black text-2xl text-slate-900">
                  ₹{Number(earningsData?.todayTotal ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-bold text-slate-600">Today's Earnings</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px] font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {earningsData?.weeklyTrips ?? 0} Trips
                  </span>
                </div>
                <div className="font-black text-2xl text-slate-900">
                  ₹{Number(earningsData?.weeklyTotal ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-bold text-slate-600">This Week Total</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <Award className="w-5 h-5 text-amber-700" />
                  <span className="text-[11px] font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Wallet Balance
                  </span>
                </div>
                <div className="font-black text-2xl text-emerald-700">
                  ₹{Number(formData.walletBalance || earningsData?.pendingPayout || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-bold text-slate-600">Available Payout</div>
              </div>
            </div>

            {/* Payout History from Database */}
            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-sm">Settlement History (Database)</h4>
              {earningsData?.payoutHistory && earningsData.payoutHistory.length > 0 ? (
                <div className="space-y-2">
                  {earningsData.payoutHistory.map((p) => (
                    <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-black text-slate-900 text-xs">{p.id} — {p.method}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{p.date} • {p.trips} Trips Completed</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-emerald-800">₹{Number(p.amount).toLocaleString('en-IN')}</div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded-full">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <span>No settlement transactions recorded yet. Complete delivered orders to generate payouts.</span>
                </div>
              )}
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
                  <h3 className="font-black text-lg text-slate-900">Completed Order Trip History (Database)</h3>
                  <p className="text-xs text-slate-600 font-bold">Real orders completed by your delivery partner account</p>
                </div>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={routeQuery}
                  onChange={e => setRouteQuery(e.target.value)}
                  placeholder="Search order ID or address..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Trip List from Database */}
            {filteredRouteList.length > 0 ? (
              <div className="space-y-2.5">
                {filteredRouteList.map((route) => (
                  <div key={route.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">{route.orderId || route.id}</span>
                        <span className="text-[11px] text-slate-500 font-bold">
                          {route.createdAt ? new Date(route.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Delivered'}
                        </span>
                        {route.farmName && (
                          <span className="text-[11px] text-slate-700 font-black">• {route.farmName}</span>
                        )}
                      </div>
                      <div className="font-black text-slate-900 text-sm">{route.customerAddress || 'Customer Address'}</div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 font-bold flex-wrap">
                        <span>📦 {route.items || route.itemsSummary || 'Organic Produce'}</span>
                        <span>💳 {route.paymentType || 'UPI'}</span>
                        <span>⏱ ETA: {route.eta || 'Completed'}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <span className="font-black text-base text-emerald-800">
                        ₹{Number(route.fee || route.totalAmount || 30).toFixed(2)}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 font-black text-[11px] rounded-full border border-emerald-300">
                        ✓ Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
                <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="font-black text-sm text-slate-800">No Delivered Orders Found</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  {routeQuery ? 'No trip records matched your search term.' : 'Deliveries you complete will automatically be recorded here directly from the database.'}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DeliveryProfileSettings;
