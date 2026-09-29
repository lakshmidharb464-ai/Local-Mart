import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { farmerService } from '../../services/farmerService';
import { useTranslation } from 'react-i18next';
import { getLangCode } from '../../i18n';
import { 
  Sprout, 
  MapPin, 
  Phone, 
  Mail, 
  Key, 
  Bell, 
  Save, 
  Camera, 
  ShieldCheck, 
  Award,
  Globe,
  CheckCircle2,
  Lock,
  Landmark,
  Volume2,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  FileUp,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Download,
  Navigation,
  Store,
  HeartHandshake,
  Sliders,
  Sparkles
} from 'lucide-react';

export const FarmerSettings = ({ farmStatus = 'open', setFarmStatus }) => {
  const { user, showToast, currency, setCurrency } = useAuth();
  const { t, i18n } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState('farm');

  // Load initial persisted operational settings
  const savedSettings = useMemo(() => {
    try {
      const stored = localStorage.getItem('localfarm_farmer_settings');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  // 1. Profile & Farm Operations State
  const [name, setName] = useState(user?.name || savedSettings.name || 'Rajesh Kumar');
  const [email, setEmail] = useState(user?.email || savedSettings.email || 'rajesh.farmer@localfarm.in');
  const [phone, setPhone] = useState(savedSettings.phone || '+91 94401 22334');
  const [altPhone, setAltPhone] = useState(savedSettings.altPhone || '+91 98230 11223');
  const [profilePhoto, setProfilePhoto] = useState(user?.avatar || savedSettings.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80');

  const [farmName, setFarmName] = useState(savedSettings.farmName || 'Green Valley Organic Farm');
  const [location, setLocation] = useState(savedSettings.location || 'Organic Farm Zone, Sector 4');
  const [farmDescription, setFarmDescription] = useState(savedSettings.farmDescription || 'Certified organic farm cultivating pesticide-free vegetables, seasonal fruits, dairy, and fresh greens.');
  const [organicCertified, setOrganicCertified] = useState(savedSettings.organicCertified ?? true);

  // Operational Harvest & Logistics
  const [morningSlot, setMorningSlot] = useState(savedSettings.morningSlot || '06:00 - 10:00 AM');
  const [eveningSlot, setEveningSlot] = useState(savedSettings.eveningSlot || '04:00 - 07:30 PM');
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(savedSettings.autoAcceptOrders ?? true);
  const [deliveryRadius, setDeliveryRadius] = useState(savedSettings.deliveryRadius || 18);
  const [minOrderValue, setMinOrderValue] = useState(savedSettings.minOrderValue || 299);
  const [allowFarmPickup, setAllowFarmPickup] = useState(savedSettings.allowFarmPickup ?? true);
  const [farmTourEnabled, setFarmTourEnabled] = useState(savedSettings.farmTourEnabled ?? true);
  const [selectedBadges, setSelectedBadges] = useState(savedSettings.selectedBadges || ['100% Pesticide-Free', 'NPOP Organic', 'Same-Day Harvested']);

  // 2. Accreditation & Verification State
  const [verificationDocs, setVerificationDocs] = useState(savedSettings.verificationDocs || {
    organicCert: {
      fileName: 'organic_farm_certificate_2026.pdf',
      status: 'Approved',
      uploadDate: '2026-05-12'
    },
    fssaiLicense: {
      fileName: 'fssai_state_license_cert.pdf',
      status: 'Approved',
      uploadDate: '2026-06-18'
    },
    landRegistry: {
      fileName: 'land_patta_certificate.jpg',
      status: 'Under Review',
      uploadDate: '2026-08-20'
    }
  });
  const [activeScanningDoc, setActiveScanningDoc] = useState(null);

  // 3. Banking & Payouts State
  const [payoutMethod, setPayoutMethod] = useState(savedSettings.payoutMethod || 'upi');
  const [payoutFrequency, setPayoutFrequency] = useState(savedSettings.payoutFrequency || 'daily');
  const [upiId, setUpiId] = useState(savedSettings.upiId || 'rajeshkumar@okaxis');
  const [bankName, setBankName] = useState(savedSettings.bankName || 'State Bank of India (SBI)');
  const [bankAccount, setBankAccount] = useState(savedSettings.bankAccount || '389402948201');
  const [ifscCode, setIfscCode] = useState(savedSettings.ifscCode || 'SBIN0001420');
  const [autoWithdrawThreshold, setAutoWithdrawThreshold] = useState(savedSettings.autoWithdrawThreshold || 1000);

  // 4. Security & Preferences State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(savedSettings.twoFactorAuth ?? true);

  const [newOrderAlerts, setNewOrderAlerts] = useState(savedSettings.newOrderAlerts ?? true);
  const [orderStatusUpdates, setOrderStatusUpdates] = useState(savedSettings.orderStatusUpdates ?? true);
  const [lowStockAlerts, setLowStockAlerts] = useState(savedSettings.lowStockAlerts ?? true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(savedSettings.whatsappAlerts ?? true);

  const [language, setLanguage] = useState(() => localStorage.getItem('localfarm_lang') || 'English');
  const [soundEnabled, setSoundEnabled] = useState(savedSettings.soundEnabled ?? true);

  // Payout History
  const [payoutHistory] = useState([
    { id: 'PO-001', date: '2026-08-20', amount: 4820, status: 'Paid', method: 'UPI', orders: 18 },
    { id: 'PO-002', date: '2026-08-13', amount: 3650, status: 'Paid', method: 'Bank Transfer', orders: 14 },
    { id: 'PO-003', date: '2026-08-06', amount: 5210, status: 'Paid', method: 'UPI', orders: 22 },
    { id: 'PO-004', date: '2026-08-27', amount: 2940, status: 'Pending', method: 'UPI', orders: 11 },
    { id: 'PO-005', date: '2026-07-30', amount: 6180, status: 'Paid', method: 'Bank Transfer', orders: 26 },
  ]);

  // Persist settings helper with backend API sync
  const persistSettings = async (overrides = {}) => {
    const updated = {
      name, email, phone, altPhone, profilePhoto,
      farmName, location, farmDescription, organicCertified,
      morningSlot, eveningSlot, autoAcceptOrders, deliveryRadius, minOrderValue, allowFarmPickup, farmTourEnabled, selectedBadges,
      verificationDocs, twoFactorAuth,
      newOrderAlerts, orderStatusUpdates, lowStockAlerts, whatsappAlerts,
      payoutMethod, payoutFrequency, upiId, bankName, bankAccount, ifscCode, autoWithdrawThreshold,
      soundEnabled,
      ...overrides
    };
    localStorage.setItem('localfarm_farmer_settings', JSON.stringify(updated));
    try {
      await farmerService.updateProfile(updated).catch(err => console.warn('Farmer profile sync error:', err));
    } catch (e) {
      console.warn('Sync error:', e);
    }
  };

  // Sync language
  useEffect(() => {
    localStorage.setItem('localfarm_lang', language);
    const code = getLangCode(language);
    i18n.changeLanguage(code);
  }, [language, i18n]);

  // Photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
      persistSettings({ profilePhoto: imageUrl });
      if (showToast) showToast('Avatar Updated ✨', 'New profile photo updated.');
    }
  };

  // Save Handlers
  const handleSaveFarmOperations = (e) => {
    e.preventDefault();
    persistSettings({
      name, email, phone, altPhone,
      farmName, location, farmDescription, organicCertified,
      morningSlot, eveningSlot, autoAcceptOrders, deliveryRadius, minOrderValue, allowFarmPickup, farmTourEnabled, selectedBadges
    });
    if (showToast) showToast('Farm & Operations Saved! 🌾', 'Profile, harvest slots, delivery radius, and branding updated.');
  };

  const handleUploadDocument = (docKey, fileName) => {
    setVerificationDocs(prev => ({
      ...prev,
      [docKey]: {
        fileName,
        status: 'Scanning',
        uploadDate: new Date().toISOString().split('T')[0]
      }
    }));
    setActiveScanningDoc(docKey);

    setTimeout(() => {
      setVerificationDocs(prev => {
        const updated = {
          ...prev,
          [docKey]: {
            ...prev[docKey],
            status: 'Under Review'
          }
        };
        persistSettings({ verificationDocs: updated });
        return updated;
      });
      setActiveScanningDoc(null);
      if (showToast) {
        showToast('Document Uploaded 📄', 'OCR agricultural validation scan complete. Status: Under Review.');
      }
    }, 1800);
  };

  const verificationProgress = useMemo(() => {
    let completedCount = 0;
    const docList = Object.values(verificationDocs);
    docList.forEach(doc => {
      if (doc.status === 'Approved') completedCount += 1.0;
      if (doc.status === 'Under Review') completedCount += 0.5;
    });
    return Math.round((completedCount / docList.length) * 100);
  }, [verificationDocs]);

  const handleSaveBankingAndPayouts = (e) => {
    e.preventDefault();
    persistSettings({
      payoutMethod, payoutFrequency, upiId, bankName, bankAccount, ifscCode, autoWithdrawThreshold
    });
    if (showToast) showToast('Banking & Payouts Saved! 💳', `${payoutMethod.toUpperCase()} details and ${payoutFrequency} frequency updated.`);
  };

  const handleDownloadPayoutCSV = () => {
    const headers = ['Payout ID', 'Date', 'Orders Completed', 'Amount (INR)', 'Method', 'Status'];
    const rows = payoutHistory.map(p => [p.id, p.date, p.orders, p.amount, p.method, p.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `localfarm_payout_statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Statement Downloaded 📥', 'Payout ledger CSV successfully generated.');
  };

  const handleSavePreferencesAndSecurity = (e) => {
    e.preventDefault();
    if (oldPassword && newPassword && newPassword !== confirmPassword) {
      if (showToast) showToast('Password Error', 'New passwords do not match.', 'error');
      return;
    }
    persistSettings({
      twoFactorAuth, newOrderAlerts, whatsappAlerts, orderStatusUpdates, lowStockAlerts, soundEnabled
    });
    localStorage.setItem('localfarm_lang', language);
    localStorage.setItem('localfarm_currency', currency);
    if (showToast) showToast('Preferences & Security Saved! 🔒', 'Security, alerts, language, and sound settings updated.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const totalEarnings = useMemo(() => payoutHistory.reduce((sum, p) => sum + p.amount, 0), [payoutHistory]);
  const pendingSettlement = useMemo(() => payoutHistory.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0), [payoutHistory]);
  const thisMonthPayouts = useMemo(() => payoutHistory.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0), [payoutHistory]);

  // Streamlined, high-impact 4-tab navigation
  const settingsTabs = [
    { id: 'farm', label: 'Farm & Operations', icon: Sprout, badge: `${deliveryRadius} km` },
    { id: 'verification', label: 'Accreditation & Badges', icon: ShieldCheck, badge: `${verificationProgress}%` },
    { id: 'payouts', label: 'Banking & Payouts', icon: DollarSign, badge: `₹${(totalEarnings / 1000).toFixed(1)}k` },
    { id: 'preferences', label: 'Preferences & Security', icon: Sliders, badge: language.split(' ')[0] },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn font-display">
      
      {/* Farmer Profile Card Header */}
      <div className="relative bg-gradient-to-br from-[#0A2312] via-[#183D22] to-[#257036] rounded-[32px] p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-farmGreen-700/40 group transition-all duration-500">
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-farmGreen-400/15 rounded-full blur-3xl group-hover:bg-farmGreen-400/25 transition-all duration-700" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-farmOrange-400/10 rounded-full blur-3xl group-hover:bg-farmOrange-400/20 transition-all duration-700" />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group/avatar shrink-0">
              <img
                src={profilePhoto}
                alt="Farmer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-emerald-400/60 shadow-farm-lg border border-white/20 group-hover/avatar:scale-105 group-hover/avatar:ring-emerald-300 transition-all duration-300"
                loading="lazy"
              />
              <label 
                htmlFor="farmer-photo-upload"
                className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-r from-emerald-400 to-amber-300 hover:from-emerald-300 hover:to-amber-200 text-slate-950 rounded-full cursor-pointer shadow-lg transition-all active:scale-90 group-hover/avatar:scale-110"
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

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-farmGreen-500/20 backdrop-blur-md text-emerald-300 font-mono text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Producer</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 backdrop-blur-md text-farmGold-300 font-mono text-[11px] font-bold border border-amber-400/30 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-farmGold-400" />
                  <span>{language}</span>
                </span>
                {setFarmStatus && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = farmStatus === 'open' ? 'closed' : 'open';
                      setFarmStatus(next);
                      if (showToast) showToast(
                        next === 'open' ? 'Farm Open 🌾' : 'Farm Closed / Hiatus 🛑',
                        `Your farm is now ${next === 'open' ? 'actively accepting buyer orders' : 'paused from accepting new orders'}.`
                      );
                    }}
                    className={`px-3 py-0.5 rounded-full font-mono text-[11px] font-black border transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      farmStatus === 'open'
                        ? 'bg-farmGreen-600/25 border-emerald-400/50 text-emerald-300 hover:bg-farmGreen-600/40'
                        : 'bg-farmTerracotta-500/25 border-rose-400/50 text-rose-300 hover:bg-farmTerracotta-500/40'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${farmStatus === 'open' ? 'bg-farmGreen-500 animate-pulse' : 'bg-rose-400'}`} />
                    <span>Farm: {farmStatus === 'open' ? 'Open & Harvesting' : 'Paused / Hiatus'}</span>
                  </button>
                )}
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {name} — {farmName}
              </h1>
              <p className="text-xs text-emerald-200/90 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-farmGold-400 shrink-0" />
                <span>{location}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Streamlined Sub-Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-200/60 shadow-lg shadow-emerald-950/5 scrollbar-none">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`group flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-98 ${
                isActive
                  ? 'bg-gradient-to-r from-farmGreen-800 via-farmGreen-900 to-emerald-950 text-white shadow-md shadow-emerald-900/25 ring-2 ring-emerald-400/50 scale-[1.02]'
                  : 'bg-white/70 text-farmGreen-950 hover:bg-farmGreen-50/60/80 hover:text-emerald-950 border border-farmSage-100/40 hover:border-emerald-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-farmGold-300' : 'text-farmGreen-700'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-farmGreen-100/80 text-emerald-900'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div className="glass-surface p-6 sm:p-8 rounded-[28px] border border-farmGreen-100/80 shadow-farm-md w-full">
        
        {/* ─── TAB 1: FARM & OPERATIONS ─── */}
        {activeSubTab === 'farm' && (
          <form onSubmit={handleSaveFarmOperations} className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-farmSage-100/40">
              <div className="p-3 bg-farmGreen-50/60 text-farmGreen-700 rounded-2xl border border-farmGreen-200/30 shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-farmGreen-950">Farm Branding & Operational Controls</h3>
                <p className="text-xs text-farmMuted">Manage your personal contact info, farm location, harvest slots, and delivery reach</p>
              </div>
            </div>

            {/* Personal Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Farmer Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950 "
                  required
                />
              </div>
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950 "
                  required
                />
              </div>
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Primary Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950 "
                  required
                />
              </div>
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Alternate Emergency Phone</label>
                <input
                  type="text"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950 "
                />
              </div>
            </div>

            {/* Farm Branding */}
            <div className="space-y-4 pt-2 border-t border-farmSage-100/40">
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Farm Title / Registered Name</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950 "
                  required
                />
              </div>

              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Farm Physical Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950 "
                  required
                />

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] font-bold text-farmMuted">Quick Presets:</span>
                  {[
                    'North Green Belt, Zone A',
                    'East Agricultural Hub',
                    'Central Organic Valley',
                    'South Riverside Farm Zone'
                  ].map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className="px-2.5 py-1 bg-farmGreen-50/60 hover:bg-farmGreen-100/80 text-emerald-900 text-[10px] font-bold rounded-lg border border-emerald-200 cursor-pointer"
                    >
                      + {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Harvest & Dispatch Operating Windows */}
            <div className="p-4 bg-farmGold-50/60/60 border border-farmGold-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-farmGold-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-farmGold-700" />
                  <span>Harvest & Dispatch Time Windows</span>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-200/80 text-farmGold-900 rounded-full font-mono text-[10px] font-black">
                  Active Schedule
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-farmGold-900 uppercase tracking-wide block mb-1">Morning Harvest Window</label>
                  <select
                    value={morningSlot}
                    onChange={(e) => setMorningSlot(e.target.value)}
                    className="w-full p-2.5 bg-white border border-farmGold-200 rounded-xl text-xs font-bold text-farmGreen-950  cursor-pointer"
                  >
                    <option value="05:30 - 09:00 AM">05:30 AM – 09:00 AM (Early Dew Harvest)</option>
                    <option value="06:00 - 10:00 AM">06:00 AM – 10:00 AM (Standard Morning)</option>
                    <option value="07:00 - 11:00 AM">07:00 AM – 11:00 AM (Late Morning)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-farmGold-900 uppercase tracking-wide block mb-1">Evening Harvest Window</label>
                  <select
                    value={eveningSlot}
                    onChange={(e) => setEveningSlot(e.target.value)}
                    className="w-full p-2.5 bg-white border border-farmGold-200 rounded-xl text-xs font-bold text-farmGreen-950  cursor-pointer"
                  >
                    <option value="03:30 - 06:30 PM">03:30 PM – 06:30 PM (Early Evening)</option>
                    <option value="04:00 - 07:30 PM">04:00 PM – 07:30 PM (Peak Sunset Dispatch)</option>
                    <option value="05:00 - 08:30 PM">05:00 PM – 08:30 PM (Night Market Dispatch)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Logistics & Radius Configuration */}
            <div className="p-4 bg-farmGreen-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-farmGreen-700" />
                  <span>Direct Delivery Zone & Order Minimum</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full font-mono text-[10px] font-black">
                  {deliveryRadius} km Radius
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-emerald-900 mb-1">
                    <span>Maximum Direct Delivery Reach</span>
                    <span className="font-black text-farmGreen-700">{deliveryRadius} km</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="45"
                    step="1"
                    value={deliveryRadius}
                    onChange={(e) => setDeliveryRadius(+e.target.value)}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-farmGreen-100/80 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-farmMuted mt-1">
                    <span>3 km (Hyperlocal)</span>
                    <span>20 km (Suburban)</span>
                    <span>45 km (Metro Hub)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-black text-emerald-950 uppercase tracking-wide block mb-1">Free Delivery Minimum (₹)</label>
                    <input
                      type="number"
                      min="99"
                      max="1500"
                      step="50"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(+e.target.value)}
                      className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-black text-farmGreen-950  font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-emerald-950 uppercase tracking-wide block mb-1">Instant Auto-Accept Orders</label>
                    <div className="flex items-center justify-between p-2 bg-white border border-emerald-200 rounded-xl">
                      <span className="text-xs font-bold text-farmGreen-950">Auto-Confirm</span>
                      <button
                        type="button"
                        onClick={() => setAutoAcceptOrders(!autoAcceptOrders)}
                        className={`w-10 h-5 rounded-full transition-all cursor-pointer relative shrink-0 ${
                          autoAcceptOrders ? 'bg-farmGreen-700' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                          autoAcceptOrders ? 'left-5.5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Gate Pickup & Agri-Tourism Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-white/40 backdrop-blur-sm border border-farmSage-200/50 rounded-2xl flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-farmGreen-950 text-xs flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-farmGreen-700" />
                    <span>Farm Gate Direct Pickup</span>
                  </div>
                  <div className="text-[10px] text-farmMuted mt-0.5">Allow buyers to collect fresh harvest with 10% discount</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowFarmPickup(!allowFarmPickup)}
                  className={`w-10 h-5 rounded-full transition-all cursor-pointer relative shrink-0 ${
                    allowFarmPickup ? 'bg-farmGreen-700' : 'bg-gray-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                    allowFarmPickup ? 'left-5.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div className="p-3.5 bg-white/40 backdrop-blur-sm border border-farmSage-200/50 rounded-2xl flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-farmGreen-950 text-xs flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-farmGreen-700" />
                    <span>Agri-Tourism & Weekend Tours</span>
                  </div>
                  <div className="text-[10px] text-farmMuted mt-0.5">Let families book guided tours & tree adoption</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFarmTourEnabled(!farmTourEnabled)}
                  className={`w-10 h-5 rounded-full transition-all cursor-pointer relative shrink-0 ${
                    farmTourEnabled ? 'bg-farmGreen-700' : 'bg-gray-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                    farmTourEnabled ? 'left-5.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-farmGreen-950 mb-1.5 block">Farm Story & Agricultural Philosophy</label>
              <textarea
                rows={4}
                value={farmDescription}
                onChange={(e) => setFarmDescription(e.target.value)}
                className="w-full p-3.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-medium text-farmGreen-950  resize-none leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-farmSage-100/40 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Farm & Operations</span>
              </button>
            </div>
          </form>
        )}

        {/* ─── TAB 2: ACCREDITATION & BADGES ─── */}
        {activeSubTab === 'verification' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-farmSage-100/40">
              <div className="p-3 bg-farmGreen-50/60 text-farmGreen-700 rounded-2xl border border-farmGreen-200/30 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-farmGreen-950">Producer Accreditation & Trust Badges</h3>
                <p className="text-xs text-farmMuted">Upload government agricultural credentials & display consumer trust badges on your products</p>
              </div>
            </div>

            {/* Compliance Progress Indicator */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-farmGreen-200/40 shadow-2xs space-y-3">
              <div className="flex items-center justify-between font-extrabold text-farmGreen-950">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-farmGreen-600" />
                  <span>Farmer Verification Score</span>
                </span>
                <span>{verificationProgress}% Completed</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${verificationProgress}%` }} 
                />
              </div>
              <p className="text-[10px] text-farmMuted font-bold leading-relaxed">
                * Upload FSSAI licenses, Land credentials, and Organic certificates. Accounts with 100% verification score get a <strong>Verified Seller Badge</strong> and priority placement in buyer search results!
              </p>
            </div>

            {/* Document Upload Panels */}
            <div className="space-y-4">
              {[
                { key: 'organicCert', label: 'Organic Farming Certificate', desc: 'Accreditation proof from agricultural agency (PGIM, NPOP, etc.)', type: 'PDF / JPEG' },
                { key: 'fssaiLicense', label: 'FSSAI Food Business License', desc: 'Government food processing & distribution license index', type: 'PDF / PNG' },
                { key: 'landRegistry', label: 'Agricultural Land Title Proof (Khata)', desc: 'Land registry ownership proof for farming verification', type: 'PDF / JPG' }
              ].map((doc) => {
                const info = verificationDocs[doc.key];
                const isScanning = activeScanningDoc === doc.key;
                
                return (
                  <div key={doc.key} className="p-5 rounded-2xl border border-farmSage-200/50 bg-white shadow-2xs hover:border-emerald-200 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <FileText className="w-4 h-4 text-farmGreen-700 shrink-0" />
                        <h5 className="font-extrabold text-sm text-farmGreen-950 truncate">{doc.label}</h5>
                        
                        {info.status === 'Approved' && (
                          <span className="px-2 py-0.5 bg-farmGreen-600 text-white font-black text-[9px] rounded-full uppercase tracking-wider">
                            Verified ✓
                          </span>
                        )}
                        {info.status === 'Under Review' && (
                          <span className="px-2 py-0.5 bg-farmGold-50/600 text-white font-black text-[9px] rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <span>Reviewing</span> ⏳
                          </span>
                        )}
                        {info.status === 'Scanning' && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white font-black text-[9px] rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <span>Scanning OCR</span> ⏳
                          </span>
                        )}
                        {info.status === 'Not Uploaded' && (
                          <span className="px-2 py-0.5 bg-gray-300 text-slate-800 font-black text-[9px] rounded-full uppercase tracking-wider">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-farmMuted font-bold mt-0.5">{doc.desc}</p>
                      {info.fileName && (
                        <p className="text-[10px] text-farmGreen-700 font-extrabold truncate mt-1">
                          File: {info.fileName} · Uploaded: {info.uploadDate}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      {isScanning ? (
                        <div className="w-44 py-3 bg-blue-50 text-blue-700 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider animate-pulse">
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                          <span>Reading document...</span>
                        </div>
                      ) : (
                        <label 
                          className="w-44 py-3 border-2 border-dashed border-emerald-300/80 hover:border-emerald-500/80 bg-farmGreen-50/60/10 hover:bg-farmGreen-50/60/20 text-farmGreen-800 hover:text-emerald-950 rounded-2xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 text-center px-2"
                        >
                          <FileUp className="w-4 h-4 text-farmGreen-600" />
                          <span>{info.fileName ? 'Re-upload File' : 'Upload Document'}</span>
                          <span className="text-[8px] text-farmSage-400 font-normal mt-0.5">Supports {doc.type}</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadDocument(doc.key, file.name);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Badges Multi-Select */}
            <div className="p-5 bg-farmGreen-50/60/70 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-farmGreen-700" />
                    <span>Display Consumer Trust Badges</span>
                  </div>
                  <div className="text-farmGreen-800 text-xs mt-0.5">Selected trust badges are shown on all your product cards in the customer catalog.</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-200/60">
                {[
                  '100% Pesticide-Free',
                  'NPOP Organic',
                  'Same-Day Harvested',
                  'Rainforest Alliance',
                  'Direct Farm Gate',
                  'Hydroponic Pure'
                ].map((badge) => {
                  const isSelected = selectedBadges.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => {
                        const updated = isSelected ? selectedBadges.filter(b => b !== badge) : [...selectedBadges, badge];
                        setSelectedBadges(updated);
                        persistSettings({ selectedBadges: updated });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-farmGreen-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-white text-farmGreen-950 border-farmSage-200/50 hover:border-emerald-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {badge}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: BANKING & PAYOUTS ─── */}
        {activeSubTab === 'payouts' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-farmSage-100/40 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-farmGreen-50/60 text-farmGreen-700 rounded-2xl border border-farmGreen-200/30 shadow-sm">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-farmGreen-950">Banking, Settlements & Payout Ledger</h3>
                  <p className="text-xs text-farmMuted">Configure your direct UPI/Bank payout method and review earnings statements</p>
                </div>
              </div>

              <button
                onClick={handleDownloadPayoutCSV}
                className="px-4 py-2.5 bg-farmGreen-700 hover:bg-farmGreen-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Statement (CSV)</span>
              </button>
            </div>

            {/* Earnings Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Farm Earnings', value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'emerald' },
                { label: 'Pending Settlement', value: `₹${pendingSettlement.toLocaleString('en-IN')}`, icon: Clock, color: 'amber' },
                { label: 'This Month Payouts', value: `₹${thisMonthPayouts.toLocaleString('en-IN')}`, icon: Calendar, color: 'blue' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className={`p-5 rounded-2xl bg-${card.color}-50 border border-${card.color}-100 space-y-2`}>
                    <Icon className={`w-5 h-5 text-${card.color}-700`} />
                    <div className={`font-black text-2xl text-${card.color}-800`}>{card.value}</div>
                    <div className={`text-[11px] font-bold text-${card.color}-700`}>{card.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Banking Setup Form */}
            <form onSubmit={handleSaveBankingAndPayouts} className="space-y-4 pt-2 border-t border-farmSage-100/40">
              <h4 className="font-black text-sm text-farmGreen-950">Linked Bank / UPI Payout Method</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPayoutMethod('upi')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                    payoutMethod === 'upi'
                      ? 'bg-farmGreen-50/60 border-emerald-500 ring-2 ring-emerald-300'
                      : 'bg-white/40 backdrop-blur-sm border-farmSage-200/50 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-farmGreen-950 text-sm flex items-center justify-between">
                    <span>Instant UPI Payout</span>
                    <CheckCircle2 className={`w-4 h-4 ${payoutMethod === 'upi' ? 'text-farmGreen-600' : 'text-gray-300'}`} />
                  </div>
                  <div className="text-farmMuted text-xs">Direct transfer via Google Pay, PhonePe, or BHIM VPA</div>
                </div>

                <div 
                  onClick={() => setPayoutMethod('bank')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                    payoutMethod === 'bank'
                      ? 'bg-farmGreen-50/60 border-emerald-500 ring-2 ring-emerald-300'
                      : 'bg-white/40 backdrop-blur-sm border-farmSage-200/50 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-farmGreen-950 text-sm flex items-center justify-between">
                    <span>Bank Transfer (NEFT/IMPS)</span>
                    <CheckCircle2 className={`w-4 h-4 ${payoutMethod === 'bank' ? 'text-farmGreen-600' : 'text-gray-300'}`} />
                  </div>
                  <div className="text-farmMuted text-xs">Direct credit to savings or current bank account</div>
                </div>
              </div>

              {/* Settlement Frequency */}
              <div className="p-4 bg-farmGreen-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-farmGreen-700" />
                    <span>Settlement Frequency & Auto-Withdrawal</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full font-mono text-[10px] font-black uppercase">
                    {payoutFrequency}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'daily', label: 'Instant Daily', desc: 'Settled every evening at 8:00 PM' },
                    { id: 'weekly', label: 'Weekly (Mondays)', desc: 'Consolidated transfer every Monday' },
                    { id: 'biweekly', label: 'Bi-Weekly', desc: 'Settled on the 1st & 15th' }
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setPayoutFrequency(freq.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        payoutFrequency === freq.id
                          ? 'bg-farmGreen-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-white text-farmGreen-950 border-farmSage-200/50 hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-extrabold text-xs">{freq.label}</div>
                      <div className={`text-[10px] mt-0.5 ${payoutFrequency === freq.id ? 'text-emerald-100' : 'text-farmMuted'}`}>
                        {freq.desc}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <label className="text-[10px] font-black text-emerald-950 uppercase tracking-wide block">Auto-Withdrawal Threshold (₹)</label>
                    <span className="text-[10px] text-farmMuted">Minimum balance required to trigger automatic transfer</span>
                  </div>
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    step="500"
                    value={autoWithdrawThreshold}
                    onChange={(e) => setAutoWithdrawThreshold(+e.target.value)}
                    className="w-32 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-black text-farmGreen-950  font-mono"
                  />
                </div>
              </div>

              {/* UPI and Bank Details inputs */}
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">UPI Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. farmer@okaxis"
                    className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950 "
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950 "
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-farmGreen-950 mb-1.5 block">Account Number</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950  font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-farmGreen-950 mb-1.5 block">IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950  font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Banking Details</span>
                </button>
              </div>
            </form>

            {/* Payout History Ledger */}
            <div className="pt-4 border-t border-farmSage-100/40 space-y-3">
              <h4 className="font-black text-sm text-farmGreen-950">Recent Bank Settlements</h4>
              <div className="rounded-2xl border border-farmSage-200/50 overflow-hidden">
                <div className="hidden sm:grid grid-cols-5 gap-0 bg-white/50 border-b border-farmSage-200/50 px-4 py-2.5 text-[10px] font-black text-farmMuted uppercase tracking-wider">
                  <span>Payout ID</span><span>Date</span><span>Orders</span><span>Amount</span><span>Status</span>
                </div>
                {payoutHistory.map((payout, idx) => (
                  <div
                    key={payout.id}
                    className={`grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-0 px-4 py-3.5 border-b border-farmSage-100/40 last:border-0 text-xs font-bold ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-white/50/40'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-farmMuted">{payout.id}</span>
                    <span className="text-farmGreen-950">{payout.date}</span>
                    <span className="text-farmMuted">{payout.orders} orders</span>
                    <span className="font-black text-farmGreen-700">₹{payout.amount.toLocaleString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black w-fit ${
                      payout.status === 'Paid'
                        ? 'bg-farmGreen-100/80 text-farmGreen-800'
                        : 'bg-farmGold-100 text-amber-800'
                    }`}>{payout.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: PREFERENCES & SECURITY ─── */}
        {activeSubTab === 'preferences' && (
          <form onSubmit={handleSavePreferencesAndSecurity} className="space-y-6 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-farmSage-100/40">
              <div className="p-3 bg-farmGreen-50/60 text-farmGreen-700 rounded-2xl border border-farmGreen-200/30 shadow-sm">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-farmGreen-950">Portal Preferences, Alerts & Security</h3>
                <p className="text-xs text-farmMuted">Manage your regional language, currency, SMS/WhatsApp notifications, and 2FA protection</p>
              </div>
            </div>

            {/* Language & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Portal Language</label>
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
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm border-2 border-emerald-300 focus:border-emerald-600 focus:glass-surface rounded-2xl text-xs font-bold text-farmGreen-950  cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Currency Display</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs font-semibold text-farmGreen-950  cursor-pointer"
                >
                  <option value="₹ (INR)">₹ (INR - Indian Rupee)</option>
                  <option value="$ (USD)">$ (USD - US Dollar)</option>
                </select>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-2 border-t border-farmSage-100/40">
              <h4 className="font-black text-sm text-farmGreen-950">Real-Time Alerts & Notification Channels</h4>
              {[
                { state: newOrderAlerts, set: setNewOrderAlerts, title: 'Instant Order Alerts', desc: 'Sound and banner notification whenever a customer places an order' },
                { state: whatsappAlerts, set: setWhatsappAlerts, title: 'WhatsApp Dispatch Updates', desc: 'Direct WhatsApp alerts for scheduled morning & evening dispatches' },
                { state: lowStockAlerts, set: setLowStockAlerts, title: 'Low Inventory Warnings', desc: 'Alert when crop inventory drops below 15 units' },
                { state: soundEnabled, set: setSoundEnabled, title: 'Audio Chime Alerts', desc: 'Play notification audio sound when new orders arrive' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-sm border border-farmSage-200/50/80 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-farmGreen-950 text-xs">{item.title}</div>
                    <div className="text-farmMuted text-[11px] mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => item.set(!item.state)}
                    className={`w-11 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
                      item.state ? 'bg-farmGreen-700' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                      item.state ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Password & 2FA */}
            <div className="space-y-4 pt-2 border-t border-farmSage-100/40">
              <h4 className="font-black text-sm text-farmGreen-950">Security & Password</h4>

              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password to change"
                    className="w-full pl-4 pr-10 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs  font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-farmSage-400 hover:text-farmMuted cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs  font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:border-farmGreen-600 focus:glass-surface rounded-2xl text-xs  font-medium"
                  />
                </div>
              </div>

              {/* 2-Factor Auth */}
              <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-farmGreen-100 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-farmGreen-950 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-farmGreen-700" />
                    <span>Two-Factor SMS / OTP Authentication</span>
                  </div>
                  <div className="text-farmMuted text-xs mt-0.5">Require OTP confirmation whenever logging in from a new device</div>
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

            <div className="pt-3 border-t border-farmSage-100/40 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences & Security</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default FarmerSettings;

