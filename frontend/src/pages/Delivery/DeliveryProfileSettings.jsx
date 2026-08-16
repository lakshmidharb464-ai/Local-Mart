import React, { useState } from 'react';
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
  Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DeliveryProfileSettings = ({ profile = {}, setProfile, activeTab = 'profile', showToast }) => {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({ 
    id: 'DEL-8802',
    name: 'Rohan Sharma',
    phone: '9876543210',
    email: 'rohan.delivery@greenmarket.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    vehicleType: 'EV Scooter (Ather 450X)',
    vehicleNumber: 'MH 12 FX 4920',
    licenseNumber: 'DL-14202688091',
    hubLocation: 'Pune Central Hub (Chittoor AP Route)',
    rating: 4.9,
    isOnline: true,
    notifications: { pushAlerts: true, soundAlerts: true, smsAlerts: true, voiceGuide: true },
    ...profile 
  });

  const [activeSubTab, setActiveSubTab] = useState(activeTab === 'settings' ? 'notifications' : 'profile');

  // Password & Security States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggleOnline = () => {
    const updated = !formData.isOnline;
    setFormData({ ...formData, isOnline: updated });
    if (setProfile) setProfile({ ...formData, isOnline: updated });

    if (showToast) {
      showToast(
        updated ? 'Partner Online 🟢' : 'Partner Offline 🔴',
        updated ? 'Active and available for farm delivery dispatches.' : 'Delivery dispatches paused.'
      );
    }
  };

  const handleNotificationToggle = (key) => {
    const updatedNotifs = {
      ...formData.notifications,
      [key]: !formData.notifications[key]
    };
    setFormData({ ...formData, notifications: updatedNotifs });
    if (setProfile) setProfile({ ...formData, notifications: updatedNotifs });

    if (showToast) {
      showToast('Notification Settings Saved 🔔', `Preference for ${key} updated.`);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (setProfile) setProfile({ ...formData });
    if (showToast) {
      showToast('Profile Saved! ✨', 'Delivery partner profile and vehicle specifications updated.');
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      if (showToast) showToast('Password Error ⚠️', 'New passwords do not match.', 'error');
      return;
    }
    if (showToast) showToast('Security Updated 🔒', 'Account password successfully updated.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePlaySoundTest = () => {
    if (showToast) {
      showToast('🔊 Playing Alert Chime', 'Testing high-priority order alert chime sound.');
    }
  };

  const subTabs = [
    { id: 'profile', label: 'Partner Identity', icon: User, badge: null },
    { id: 'vehicle', label: 'Vehicle Specs', icon: Truck, badge: 'EV Ready' },
    { id: 'dispatch', label: 'Availability & Hub', icon: Zap, badge: formData.isOnline ? 'Online' : 'Offline' },
    { id: 'notifications', label: 'Alerts & Sound', icon: Bell, badge: null },
    { id: 'security', label: 'Security', icon: ShieldCheck, badge: null },
  ];

  return (
    <div className="space-y-6 pb-12 font-display animate-fadeIn">
      
      {/* Premium Glassmorphism Hero Banner */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-white/10 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar Profile Ring */}
            <div className="relative group shrink-0">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-emerald-400/40 shadow-xl border-2 border-white/20"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black border border-emerald-400/30">
                  PARTNER ID: {formData.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>{formData.rating} Rating</span>
                </span>
              </div>

              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-wide">
                {formData.name}
              </h1>

              <p className="text-xs text-emerald-100/80 font-medium flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{formData.vehicleType}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formData.hubLocation}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Toggle Banner */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="text-center sm:text-left">
              <div className="text-[10px] text-emerald-300 font-black uppercase tracking-wider">Live Duty Status</div>
              <div className="font-black text-sm text-white flex items-center gap-1.5 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${formData.isOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                <span>{formData.isOnline ? 'Active for Dispatch' : 'Duty Off'}</span>
              </div>
            </div>

            <button
              onClick={handleToggleOnline}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                formData.isOnline
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{formData.isOnline ? 'Switch Offline' : 'Switch Online'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Sub Navigation Tab Bar */}
      <div className="flex border border-gray-100 bg-white rounded-3xl p-2 gap-1.5 overflow-x-auto shadow-xs scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-gray-50 text-gray-700 hover:bg-emerald-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        
        {/* SUBTAB 1: Partner Identity */}
        {activeSubTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs font-extrabold animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-farmGreen-950">Partner Personal Identity</h3>
                  <p className="text-xs text-farmMuted font-bold">Update verified driver contact info & profile media</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-black text-[10px] border border-emerald-200">
                Verified Driver ✓
              </span>
            </div>

            {/* Photo Avatar Banner */}
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={formData.avatar}
                alt="Partner"
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-300 shadow-md"
              />
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="font-black text-farmGreen-950">Delivery Partner Avatar</div>
                <div className="text-farmMuted text-[11px]">Displayed on customer tracking maps and farmer dispatch receipts</div>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-black text-xs border border-emerald-200 transition-all cursor-pointer flex items-center gap-2 shadow-2xs active:scale-95"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>Upload New Avatar 📷</span>
              </button>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-black text-farmGreen-950 mb-1.5 block">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-farmGreen-950 mb-1.5 block">Phone Number (OTP Verification)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-farmGreen-950 mb-1.5 block">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-farmGreen-950 mb-1.5 block">Assigned Regional Hub</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.hubLocation}
                    onChange={(e) => setFormData({ ...formData, hubLocation: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Save Identity Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* SUBTAB 2: Vehicle Specs */}
        {activeSubTab === 'vehicle' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs font-extrabold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                <Truck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-black text-lg text-farmGreen-950">Vehicle Specifications & License</h3>
                <p className="text-xs text-farmMuted font-bold">Configure registered delivery vehicle details & cold-chain capability</p>
              </div>
            </div>

            {/* Vehicle Mode Selector Cards */}
            <div className="space-y-2">
              <label className="font-black text-farmGreen-950 block">Select Vehicle Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'EV Scooter (Ather 450X)', name: 'EV Scooter', tag: 'Eco Friendly ⚡', icon: BatteryCharging },
                  { id: 'Motorcycle (Hero Splendor)', name: 'Motorcycle', tag: 'Fast Transit 🏍️', icon: Truck },
                  { id: 'Cold-Chain Mini Van', name: 'Cold-Chain Van', tag: 'Refrigerated ❄️', icon: Zap }
                ].map((v) => {
                  const isSelected = formData.vehicleType.includes(v.name);
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setFormData({ ...formData, vehicleType: v.id })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-300'
                          : 'bg-gray-50/80 border-gray-200 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {v.tag}
                        </span>
                      </div>
                      <div className="font-black text-farmGreen-950 text-sm">{v.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-black text-farmGreen-950 mb-1.5 block">Vehicle Registration / License Plate</label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl font-mono font-black text-xs text-farmGreen-950 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-black text-farmGreen-950 mb-1.5 block">Commercial Driver's License (DL)</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl font-mono font-black text-xs text-farmGreen-950 outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Save Vehicle Specs</span>
              </button>
            </div>
          </form>
        )}

        {/* SUBTAB 3: Availability & Dispatch Hub */}
        {activeSubTab === 'dispatch' && (
          <div className="space-y-6 text-xs font-extrabold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-blue-100 text-blue-900 rounded-2xl">
                <Zap className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-black text-lg text-farmGreen-950">Availability & Dispatch Radius</h3>
                <p className="text-xs text-farmMuted font-bold">Manage live duty status and delivery zone assignments</p>
              </div>
            </div>

            <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-black text-base text-farmGreen-950">Online Dispatch Switch</div>
                  <div className="text-farmMuted text-xs mt-0.5 font-bold">
                    {formData.isOnline 
                      ? 'Active in system. Farmers & hub managers can route orders to your vehicle.'
                      : 'Currently offline. No new orders will be assigned.'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleOnline}
                  className={`w-14 h-8 rounded-full transition-all cursor-pointer relative shrink-0 ${
                    formData.isOnline ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${
                    formData.isOnline ? 'left-6.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: Alerts & Sound */}
        {activeSubTab === 'notifications' && (
          <div className="space-y-6 text-xs font-extrabold animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                  <Bell className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-farmGreen-950">Notification & Sound Alert Preferences</h3>
                  <p className="text-xs text-farmMuted font-bold">Control order alert sounds, SMS backups & voice navigation prompts</p>
                </div>
              </div>

              <button
                onClick={handlePlaySoundTest}
                className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs border border-amber-200 transition-all cursor-pointer flex items-center gap-2 shadow-2xs active:scale-95"
              >
                <Play className="w-4 h-4 fill-amber-700" />
                <span>Test Alert Sound 🔊</span>
              </button>
            </div>

            <div className="space-y-3">
              {[
                { key: 'pushAlerts', title: 'New Order Push Notifications', desc: 'Instant popup alerts when a new farm order is assigned to your vehicle' },
                { key: 'soundAlerts', title: 'High-Priority Order Sound Alert', desc: 'Play ringing chime notification on receiving express or cold-chain tasks' },
                { key: 'smsAlerts', title: 'SMS Backup Notifications', desc: 'Receive SMS fallback with customer phone and address details' },
                { key: 'voiceGuide', title: 'Voice Navigation Assistant', desc: 'Spoken turn-by-turn navigation prompts while driving' },
              ].map((item) => (
                <div key={item.key} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="font-black text-farmGreen-950 text-sm">{item.title}</div>
                    <div className="text-farmMuted text-xs font-bold">{item.desc}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNotificationToggle(item.key)}
                    className={`w-12 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
                      formData.notifications[item.key] ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                      formData.notifications[item.key] ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 5: Security */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleSavePassword} className="space-y-6 text-xs font-extrabold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-black text-lg text-farmGreen-950">Security & Account Credentials</h3>
                <p className="text-xs text-farmMuted font-bold">Update password authentication & manage logged-in sessions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-black text-farmGreen-950 mb-1.5 block">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-black text-farmGreen-950 mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-black text-farmGreen-950 mb-1.5 block">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Logout Session Control Card */}
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-black text-rose-950 text-xs">Active Session Control</div>
                  <div className="text-[11px] text-rose-800 font-bold mt-0.5">Log out from this device or clear all saved auth tokens</div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Now</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Update Security Password</span>
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};

export default DeliveryProfileSettings;
