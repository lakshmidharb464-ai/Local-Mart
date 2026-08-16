import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getLangCode } from '../../i18n';
import { 
  User, 
  Sprout, 
  MapPin, 
  Phone, 
  Mail, 
  Key, 
  Bell, 
  Save, 
  Camera, 
  ShieldCheck, 
  CreditCard, 
  Sliders, 
  Award,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  Smartphone,
  Landmark,
  Volume2,
  Check,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

export const FarmerSettings = () => {
  const { user, showToast } = useAuth();
  const { t, i18n } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState('profile');

  // 1. Profile Settings State
  const [name, setName] = useState(user?.name || 'Rajesh Kumar');
  const [email, setEmail] = useState(user?.email || 'rajesh.farmer@localfarm.in');
  const [phone, setPhone] = useState('+91 94401 22334');
  const [altPhone, setAltPhone] = useState('+91 98230 11223');
  const [profilePhoto, setProfilePhoto] = useState(user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80');

  // 2. Farm Details State
  const [farmName, setFarmName] = useState('Palamaner Organic Produce Collective');
  const [location, setLocation] = useState('Chittoor District, Andhra Pradesh');
  const [farmDescription, setFarmDescription] = useState('Certified organic farm in Chittoor District AP cultivating pesticide-free mangoes, tomatoes, desi ghee, and fresh greens.');
  const [organicCertified, setOrganicCertified] = useState(true);

  // 3. Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // 4. Notifications State
  const [newOrderAlerts, setNewOrderAlerts] = useState(true);
  const [orderStatusUpdates, setOrderStatusUpdates] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  // 5. Payment Settings State
  const [payoutMethod, setPayoutMethod] = useState('upi'); // 'upi' | 'bank'
  const [upiId, setUpiId] = useState('rajeshkumar@okaxis');
  const [bankName, setBankName] = useState('State Bank of India (SBI)');
  const [bankAccount, setBankAccount] = useState('389402948201');
  const [ifscCode, setIfscCode] = useState('SBIN0001420');

  // 6. Preferences State & Language Fix (ONLY Language is persisted in localStorage)
  const [language, setLanguage] = useState(() => localStorage.getItem('localfarm_lang') || 'Telugu (తెలుగు)');
  const [currency, setCurrency] = useState('₹ (INR)');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Save selected language persistently in localStorage and update i18n
  useEffect(() => {
    localStorage.setItem('localfarm_lang', language);
    const code = getLangCode(language);
    i18n.changeLanguage(code);
  }, [language, i18n]);

  // Handlers
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
      if (showToast) showToast('Avatar Updated ✨', 'New profile photo updated.');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (showToast) showToast('Profile Settings Saved! ✨', 'Personal information updated successfully.');
  };

  const handleSaveFarmDetails = (e) => {
    e.preventDefault();
    if (showToast) showToast('Farm Details Saved! 🌾', 'Farm branding and location updated.');
  };

  const handleUpdateSecurity = (e) => {
    e.preventDefault();
    if (!oldPassword) {
      if (showToast) showToast('Password Error', 'Please enter your current password.', 'error');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      if (showToast) showToast('Password Error', 'New passwords do not match.', 'error');
      return;
    }
    if (showToast) showToast('Security Updated 🔒', 'Password and 2FA settings successfully updated.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    if (showToast) showToast('Notifications Saved 🔔', 'SMS, WhatsApp and Order alert preferences saved.');
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    if (showToast) showToast('Payment Details Saved 💳', 'Direct Bank Payout & UPI details updated.');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem('localfarm_lang', language);
    const code = getLangCode(language);
    i18n.changeLanguage(code);
    if (showToast) {
      showToast('Language & Preferences Saved! 🌐', `Portal language updated to ${language}.`);
    }
  };

  const settingsTabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'farm', label: t('farm'), icon: Sprout },
    { id: 'security', label: t('security'), icon: Key },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'payment', label: t('payment'), icon: CreditCard },
    { id: 'preferences', label: t('preferences'), icon: Sliders },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn font-display">
      
      {/* Dynamic Farmer Profile Card Header */}
      <div className="relative bg-gradient-to-r from-farmGreen-900 via-farmGreen-800 to-emerald-950 rounded-[28px] p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-emerald-800/50">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={profilePhoto}
                alt="Farmer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-400/50 shadow-xl border border-white/20 shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <label 
                htmlFor="farmer-photo-upload"
                className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 rounded-full cursor-pointer shadow-md transition-all active:scale-90"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input 
                  id="farmer-photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('verifiedFarmer')}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-400/30">
                  🌐 {language}
                </span>
              </div>
              <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
                {name} — {farmName}
              </h1>
              <p className="text-xs text-emerald-200/90 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{location}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sub-Tab Bar - Ultra Clean & Fitted */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 border border-farmGreen-100/90 bg-white rounded-2xl p-1.5 gap-1.5 shadow-farm-sm">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-gradient-to-r from-farmGreen-800 to-farmGreen-900 text-white shadow-farm-md ring-2 ring-emerald-500/30 font-extrabold'
                  : 'text-farmMuted hover:bg-emerald-50/70 hover:text-farmGreen-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-farmGreen-700'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-farmGreen-100/80 shadow-farm-md w-full">
        
        {/* 1. Profile Settings */}
        {activeSubTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-farmGreen-900">{t('profileTitle')}</h3>
                  <p className="text-xs text-farmMuted">{t('profileSubtitle')}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('fullName')}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('email')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('phone')}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('altPhone')}</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t('saveProfile')}</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. Farm Details */}
        {activeSubTab === 'farm' && (
          <form onSubmit={handleSaveFarmDetails} className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-farmGreen-900">{t('farmTitle')}</h3>
                <p className="text-xs text-farmMuted">{t('farmSubtitle')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('farmName')}</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('farmLocation')}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none"
                  required
                />

                {/* Quick Location Presets */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] font-bold text-farmMuted">{t('quickPresets')}</span>
                  {[
                    'Chittoor District, Andhra Pradesh',
                    'Palamaner Agro Belt, AP',
                    'Madanapalle Market Yard, AP',
                    'Pune Rural Hub, MH'
                  ].map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-lg border border-emerald-200 cursor-pointer"
                    >
                      + {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organic Certification Switch */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{t('organicBadge')}</span>
                  </div>
                  <div className="text-emerald-800 text-xs mt-0.5">{t('organicDesc')}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setOrganicCertified(!organicCertified)}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
                    organicCertified ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                    organicCertified ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('farmStory')}</label>
                <textarea
                  rows={4}
                  value={farmDescription}
                  onChange={(e) => setFarmDescription(e.target.value)}
                  className="w-full p-3.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-medium text-farmGreen-900 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t('saveFarm')}</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. Security */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleUpdateSecurity} className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-xs">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-farmGreen-900">{t('securityTitle')}</h3>
                <p className="text-xs text-farmMuted">{t('securitySubtitle')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('currentPass')}</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-4 pr-10 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('newPass')}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('confirmPass')}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs outline-none font-medium"
                  />
                </div>
              </div>

              {/* 2-Factor Auth Toggle */}
              <div className="p-4 rounded-2xl bg-farmBg border border-farmGreen-100 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-farmGreen-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{t('twoFactor')}</span>
                  </div>
                  <div className="text-farmMuted text-xs mt-0.5">{t('twoFactorDesc')}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
                    twoFactorAuth ? 'bg-farmGreen-700' : 'bg-gray-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                    twoFactorAuth ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('saveSecurity')}</span>
              </button>
            </div>
          </form>
        )}

        {/* 4. Notifications */}
        {activeSubTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications} className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-farmGreen-900">{t('notifTitle')}</h3>
                <p className="text-xs text-farmMuted">{t('notifSubtitle')}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { state: newOrderAlerts, set: setNewOrderAlerts, title: t('newOrderAlert'), desc: t('newOrderDesc') },
                { state: whatsappAlerts, set: setWhatsappAlerts, title: t('whatsappAlert'), desc: t('whatsappDesc') },
                { state: orderStatusUpdates, set: setOrderStatusUpdates, title: t('pickupAlert'), desc: t('pickupDesc') },
                { state: lowStockAlerts, set: setLowStockAlerts, title: t('lowStockAlertNotif'), desc: t('lowStockDesc') },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-farmBg border border-farmGreen-100 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-farmGreen-900 text-sm">{item.title}</div>
                    <div className="text-farmMuted text-xs mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => item.set(!item.state)}
                    className={`w-12 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
                      item.state ? 'bg-farmGreen-700' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                      item.state ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t('saveNotif')}</span>
              </button>
            </div>
          </form>
        )}

        {/* 5. Payment Settings */}
        {activeSubTab === 'payment' && (
          <form onSubmit={handleSavePayment} className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-farmGreen-900">{t('paymentTitle')}</h3>
                <p className="text-xs text-farmMuted">{t('paymentSubtitle')}</p>
              </div>
            </div>

            {/* Payout Method Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setPayoutMethod('upi')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                  payoutMethod === 'upi'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                    : 'bg-farmBg border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-farmGreen-900 text-sm flex items-center justify-between">
                  <span>{t('upiInstant')}</span>
                  <CheckCircle2 className={`w-4 h-4 ${payoutMethod === 'upi' ? 'text-emerald-600' : 'text-gray-300'}`} />
                </div>
                <div className="text-farmMuted text-xs">{t('upiDesc')}</div>
              </div>

              <div 
                onClick={() => setPayoutMethod('bank')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                  payoutMethod === 'bank'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                    : 'bg-farmBg border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-farmGreen-900 text-sm flex items-center justify-between">
                  <span>{t('bankNeft')}</span>
                  <CheckCircle2 className={`w-4 h-4 ${payoutMethod === 'bank' ? 'text-emerald-600' : 'text-gray-300'}`} />
                </div>
                <div className="text-farmMuted text-xs">{t('bankDesc')}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('upiVpa')}</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. farmer@okaxis"
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('bankNameLabel')}</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('accNo')}</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('ifsc')}</label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t('savePayment')}</span>
              </button>
            </div>
          </form>
        )}

        {/* 6. Language & Preferences Fix */}
        {activeSubTab === 'preferences' && (
          <form onSubmit={handleSavePreferences} className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-farmGreen-900">{t('prefTitle')}</h3>
                <p className="text-xs text-farmMuted">{t('prefSubtitle')}</p>
              </div>
            </div>

            {/* Live Language Active Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between text-amber-900">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <div className="font-bold text-sm">{t('activePortalLang')} {language}</div>
                  <div className="text-xs text-amber-800">Selected portal language is saved & active across all farmer pages.</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs">
                {t('activeStatus')}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('selectLanguage')}</label>
                <select
                  value={language}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setLanguage(newLang);
                    localStorage.setItem('localfarm_lang', newLang);
                    const code = getLangCode(newLang);
                    i18n.changeLanguage(code);
                    if (showToast) showToast('Language Changed! 🌐', `Portal language set to ${newLang}.`);
                  }}
                  className="w-full px-4 py-3 bg-farmBg border-2 border-emerald-300 focus:border-emerald-600 focus:bg-white rounded-2xl text-sm font-bold text-farmGreen-900 outline-none cursor-pointer"
                >
                  <option value="Telugu (తెలుగు)">Telugu (తెలుగు - ఆంధ్రప్రదేశ్ & తెలంగాణ)</option>
                  <option value="English">English</option>
                  <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                  <option value="Marathi (मराठी)">Marathi (मराठी)</option>
                  <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                  <option value="Kannada (కన్నడ)">Kannada (కన్నడ)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-farmGreen-900 mb-1.5 block">{t('currencySymbol')}</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-farmGreen-600 focus:bg-white rounded-2xl text-xs font-semibold text-farmGreen-900 outline-none cursor-pointer"
                >
                  <option value="₹ (INR)">₹ (INR - Indian Rupee)</option>
                  <option value="$ (USD)">$ (USD - US Dollar)</option>
                </select>
              </div>

              {/* Sound Notification Switch */}
              <div className="p-4 rounded-2xl bg-farmBg border border-farmGreen-100 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-farmGreen-900 text-sm flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <span>{t('soundAlerts')}</span>
                  </div>
                  <div className="text-farmMuted text-xs mt-0.5">{t('soundDesc')}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
                    soundEnabled ? 'bg-farmGreen-700' : 'bg-gray-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                    soundEnabled ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t('savePreferences')}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default FarmerSettings;
