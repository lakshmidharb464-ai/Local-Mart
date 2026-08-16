import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_SETTINGS } from '../../data/mockData';
import { 
  Settings, 
  User, 
  Store, 
  Bell, 
  Shield, 
  Save, 
  Key, 
  Lock, 
  CheckCircle2, 
  Mail, 
  Camera, 
  UserCheck, 
  ShieldCheck, 
  DollarSign, 
  Sliders,
  Eye,
  EyeOff,
  Check,
  Smartphone,
  CheckCircle,
  Sparkles,
  MapPin,
  Laptop
} from 'lucide-react';

export const AdminSettings = () => {
  const { showToast, user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('profile');

  // Admin Profile States
  const [profileName, setProfileName] = useState(user?.name || INITIAL_SETTINGS.profile?.name || 'Lakshmidhar B');
  const [profileEmail, setProfileEmail] = useState(user?.email || INITIAL_SETTINGS.profile?.email || 'admin@greenmarket.in');
  const [profilePhoto, setProfilePhoto] = useState(INITIAL_SETTINGS.profile?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Marketplace Settings States
  const [storeName, setStoreName] = useState(INITIAL_SETTINGS.marketplace?.storeName || 'GreenMarket Direct Farm');
  const [deliveryFee, setDeliveryFee] = useState(INITIAL_SETTINGS.marketplace?.deliveryFee || 45);
  const [minOrder, setMinOrder] = useState(INITIAL_SETTINGS.marketplace?.minOrderAmount || 200);
  const [currency, setCurrency] = useState(INITIAL_SETTINGS.marketplace?.currency || '₹ (INR)');
  const [hubLocation, setHubLocation] = useState('Chittoor District AP Hub');

  // Notification States
  const [newOrderAlert, setNewOrderAlert] = useState(INITIAL_SETTINGS.notifications?.newOrderAlert ?? true);
  const [farmerRegAlert, setFarmerRegAlert] = useState(INITIAL_SETTINGS.notifications?.farmerRegAlert ?? true);
  const [lowStockAlert, setLowStockAlert] = useState(INITIAL_SETTINGS.notifications?.lowStockAlert ?? true);
  const [regionalChittoorAlert, setRegionalChittoorAlert] = useState(true);

  // Security States
  const [twoFactorAuth, setTwoFactorAuth] = useState(INITIAL_SETTINGS.security?.twoFactorAuth ?? true);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        if (showToast) showToast('Profile Photo Updated 📷', 'New admin avatar uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (showToast) showToast('Admin Profile Saved 👤', 'Profile information updated successfully!');
  };

  const handleSaveMarketplace = (e) => {
    e.preventDefault();
    if (showToast) showToast('Marketplace Settings Saved 🏪', 'Platform fees & configuration updated.');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    if (showToast) showToast('Notification Preferences Saved 🔔', 'System alert settings updated.');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (showToast) showToast('Security Settings Updated 🛡️', 'Two-Factor Auth and password settings saved.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn font-display pb-12">
      
      {/* Glassmorphism Top Banner */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Platform Governance • System Settings</span>
            </div>
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
              Admin & Platform Settings
            </h1>
            <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
              Manage system administrator credentials, marketplace pricing, alert preferences, and security controls.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 flex items-center justify-center font-bold shadow-lg">
              <Settings className="w-6 h-6 animate-spin-slow text-amber-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex justify-center border border-gray-100 bg-white rounded-3xl p-2 gap-1.5 overflow-x-auto shadow-xs scrollbar-none">
        {[
          { id: 'profile', label: 'Admin Profile', icon: User },
          { id: 'marketplace', label: 'Farm Marketplace', icon: Store },
          { id: 'notifications', label: 'Alert Preferences', icon: Bell },
          { id: 'security', label: 'Security Controls', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* 1. Admin Profile Tab */}
        {activeSubTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
            
            <div className="bg-[#0d2516] text-white p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-800">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-white/10 shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white tracking-tight">Admin Profile Information</h3>
                  <p className="text-xs text-emerald-200/80 font-medium mt-0.5">Manage your administrator identity, credentials, and profile picture</p>
                </div>
              </div>

              <span className="px-3.5 py-1 bg-amber-400 text-slate-950 font-black rounded-full text-xs uppercase tracking-wider shadow-xs">
                System Admin
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-xs font-extrabold">
              
              {/* Profile Photo Upload Box */}
              <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  <img 
                    src={profilePhoto} 
                    alt="Admin Avatar" 
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-300 shadow-md transition-transform group-hover:scale-105" 
                  />
                  <label className="absolute inset-0 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-5 h-5 mb-1 text-amber-300" />
                    <span className="text-[10px] font-black">Upload</span>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="font-black text-sm text-farmGreen-950">Administrator Avatar</div>
                  <p className="text-[11px] text-farmMuted font-bold">Supports PNG, JPG, or WEBP images for display in navigation header.</p>
                  
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer active:scale-95">
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>Change Profile Photo 📷</span>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-black text-farmGreen-950 mb-1.5 block">Admin Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-extrabold text-farmGreen-950 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-black text-farmGreen-950 mb-1.5 block">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-extrabold text-farmGreen-950 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password Update Block */}
              <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Key className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-black text-farmGreen-950 text-xs uppercase tracking-wider">Security & Password Update</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-farmMuted mb-1 block text-[11px]">Current Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 focus:border-emerald-600 rounded-2xl text-xs outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-farmMuted mb-1 block text-[11px]">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 focus:border-emerald-600 rounded-2xl text-xs outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save Profile Changes</span>
                </button>
              </div>

            </div>
          </form>
        )}

        {/* 2. Farm Marketplace Tab */}
        {activeSubTab === 'marketplace' && (
          <form onSubmit={handleSaveMarketplace} className="space-y-6 animate-fadeIn">
            <div className="bg-[#0d2516] text-white p-6 sm:p-7 flex items-center gap-3.5 border-b border-emerald-800">
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-white/10 shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white tracking-tight">Farm Marketplace Configuration</h3>
                <p className="text-xs text-emerald-200/80 font-medium mt-0.5">Set store branding, delivery pricing, and regional hub locations</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-xs font-extrabold">
              <div>
                <label className="font-black text-farmGreen-950 mb-1.5 block">Store / Platform Name *</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-black text-farmGreen-950 mb-1.5 block">Standard Delivery Fee (₹) *</label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="font-black text-farmGreen-950 mb-1.5 block">Minimum Order Amount (₹) *</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-black text-farmGreen-950 mb-1.5 block">Regional Hub Dispatch Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={hubLocation}
                      onChange={(e) => setHubLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-black text-farmGreen-950 mb-1.5 block">Platform Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-black text-farmGreen-950 outline-none cursor-pointer"
                  >
                    <option value="₹ (INR)">₹ (INR - Indian Rupee)</option>
                    <option value="$ (USD)">$ (USD - US Dollar)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save Marketplace Settings</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 3. Notifications Tab */}
        {activeSubTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications} className="space-y-6 animate-fadeIn">
            <div className="bg-[#0d2516] text-white p-6 sm:p-7 flex items-center gap-3.5 border-b border-emerald-800">
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-white/10 shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white tracking-tight">System Alert Preferences</h3>
                <p className="text-xs text-emerald-200/80 font-medium mt-0.5">Control automated notifications for order dispatches, producer KYCs & regional stock</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4 text-xs font-extrabold">
              
              {/* Toggle Card 1 */}
              <div 
                onClick={() => setNewOrderAlert(!newOrderAlert)}
                className="flex items-center justify-between p-5 bg-gray-50/80 rounded-2xl border border-gray-200 cursor-pointer hover:bg-emerald-50/50 transition-all"
              >
                <div>
                  <div className="font-black text-farmGreen-950 text-sm">New Order Dispatch Alerts</div>
                  <div className="text-[11px] text-farmMuted font-bold mt-0.5">Receive real-time notifications when buyers place fresh produce orders</div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                  newOrderAlert ? 'bg-emerald-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    newOrderAlert ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Toggle Card 2 */}
              <div 
                onClick={() => setFarmerRegAlert(!farmerRegAlert)}
                className="flex items-center justify-between p-5 bg-gray-50/80 rounded-2xl border border-gray-200 cursor-pointer hover:bg-emerald-50/50 transition-all"
              >
                <div>
                  <div className="font-black text-farmGreen-950 text-sm">Farmer Onboarding KYC Alerts</div>
                  <div className="text-[11px] text-farmMuted font-bold mt-0.5">Get instant alerts when a new agricultural producer submits verification documents</div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                  farmerRegAlert ? 'bg-emerald-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    farmerRegAlert ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Toggle Card 3 */}
              <div 
                onClick={() => setLowStockAlert(!lowStockAlert)}
                className="flex items-center justify-between p-5 bg-gray-50/80 rounded-2xl border border-gray-200 cursor-pointer hover:bg-emerald-50/50 transition-all"
              >
                <div>
                  <div className="font-black text-farmGreen-950 text-sm">Low Stock Inventory Warnings</div>
                  <div className="text-[11px] text-farmMuted font-bold mt-0.5">Trigger warning banner when farm inventory drops below 10 units</div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                  lowStockAlert ? 'bg-emerald-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    lowStockAlert ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Toggle Card 4 - Chittoor AP Regional Alerts */}
              <div 
                onClick={() => setRegionalChittoorAlert(!regionalChittoorAlert)}
                className="flex items-center justify-between p-5 bg-amber-50/60 rounded-2xl border border-amber-200 cursor-pointer hover:bg-amber-100/60 transition-all"
              >
                <div>
                  <div className="font-black text-amber-950 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-800" />
                    <span>📍 Chittoor District (AP) Express Alerts</span>
                  </div>
                  <div className="text-[11px] text-amber-900 font-bold mt-0.5">High-priority alerts for NH-140 Palamaner route dispatches & farmer payouts</div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                  regionalChittoorAlert ? 'bg-amber-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    regionalChittoorAlert ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save Notification Preferences</span>
                </button>
              </div>

            </div>
          </form>
        )}

        {/* 4. Security Tab */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleSaveSecurity} className="space-y-6 animate-fadeIn">
            <div className="bg-[#0d2516] text-white p-6 sm:p-7 flex items-center gap-3.5 border-b border-emerald-800">
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-white/10 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white tracking-tight">Security & Active Session Controls</h3>
                <p className="text-xs text-emerald-200/80 font-medium mt-0.5">Configure multi-factor authentication & inspect active administrator sessions</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5 text-xs font-extrabold">
              
              {/* 2FA Toggle Switch */}
              <div 
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className="flex items-center justify-between p-5 bg-gray-50/80 rounded-2xl border border-gray-200 cursor-pointer hover:bg-emerald-50/50 transition-all"
              >
                <div>
                  <div className="font-black text-farmGreen-950 text-sm">Two-Factor Authentication (2FA)</div>
                  <div className="text-[11px] text-farmMuted font-bold mt-0.5">Require multi-factor authenticator code during admin account sign-in</div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                  twoFactorAuth ? 'bg-emerald-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Active Session Box */}
              <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between font-black text-farmGreen-950 text-xs">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-emerald-600" />
                    <span>Active Session Audit Log</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (showToast) showToast('Sessions Terminated 🔒', 'Logged out from all other active devices.');
                    }}
                    className="text-[10px] text-rose-600 hover:underline font-black cursor-pointer"
                  >
                    Sign Out Other Sessions
                  </button>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-200">
                  <span className="font-black text-farmGreen-950">Windows 11 • Chrome Browser</span>
                  <span className="text-emerald-900 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full font-black text-[10px]">
                    Active Now 🟢
                  </span>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save Security Controls</span>
                </button>
              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default AdminSettings;
