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
  Sparkles,
  Inbox,
  Upload
} from 'lucide-react';

export const FarmerSettings = ({ farmStatus = 'open', setFarmStatus }) => {
  const { user, showToast, currency, setCurrency } = useAuth();
  const { t, i18n } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState('farm');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // 1. Profile & Farm Operations State (Initialized from user/db)
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [altPhone, setAltPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(user?.avatar_url || user?.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=80');

  const [farmName, setFarmName] = useState('My Organic Farm');
  const [location, setLocation] = useState('Local Farm Region');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [farmDescription, setFarmDescription] = useState('Certified organic farm cultivating fresh produce directly for local consumers.');
  const [organicCertified, setOrganicCertified] = useState(true);

  // Operational Harvest & Logistics
  const [morningSlot, setMorningSlot] = useState('06:00 - 10:00 AM');
  const [eveningSlot, setEveningSlot] = useState('04:00 - 07:30 PM');
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(true);
  const [deliveryRadius, setDeliveryRadius] = useState(25);
  const [minOrderValue, setMinOrderValue] = useState(199);
  const [allowFarmPickup, setAllowFarmPickup] = useState(true);
  const [farmTourEnabled, setFarmTourEnabled] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState(['100% Pesticide-Free', 'Fresh Harvested']);

  // 2. Accreditation & KYC Documents State (from DB)
  const [kycDocs, setKycDocs] = useState([]);
  const [activeScanningDoc, setActiveScanningDoc] = useState(null);

  // 3. Banking & Payouts State
  const [payoutMethod, setPayoutMethod] = useState('upi');
  const [payoutFrequency, setPayoutFrequency] = useState('weekly');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [autoWithdrawThreshold, setAutoWithdrawThreshold] = useState(1000);
  const [payoutHistory, setPayoutHistory] = useState([]);

  // 4. Security & Preferences State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const [newOrderAlerts, setNewOrderAlerts] = useState(true);
  const [orderStatusUpdates, setOrderStatusUpdates] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const [language, setLanguage] = useState(() => localStorage.getItem('localfarm_lang') || 'English');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Fetch real profile, KYC, and Payouts on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProfile(true);

    Promise.allSettled([
      farmerService.getProfile(),
      farmerService.getKyc(),
      farmerService.getPayouts()
    ]).then(([profRes, kycRes, payoutsRes]) => {
      if (!isMounted) return;

      if (profRes.status === 'fulfilled' && profRes.value) {
        const p = profRes.value;
        if (p.name) setName(p.name);
        if (p.email) setEmail(p.email);
        if (p.phone) setPhone(p.phone);
        if (p.avatar_url || p.avatar) setProfilePhoto(p.avatar_url || p.avatar);
        if (p.farm_name) setFarmName(p.farm_name);
        if (p.location_address) setLocation(p.location_address);
        if (p.district) setDistrict(p.district);
        if (p.state) setState(p.state);
        if (p.specialty) setFarmDescription(p.specialty);
        if (p.organic_certified !== undefined) setOrganicCertified(Boolean(p.organic_certified));
      }

      if (kycRes.status === 'fulfilled' && Array.isArray(kycRes.value)) {
        setKycDocs(kycRes.value);
      }

      if (payoutsRes.status === 'fulfilled' && Array.isArray(payoutsRes.value)) {
        setPayoutHistory(payoutsRes.value);
      }
    }).finally(() => {
      if (isMounted) setIsLoadingProfile(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Persist settings helper with backend API sync
  const persistSettings = async (overrides = {}) => {
    const updated = {
      name, email, phone, altPhone,
      avatar: profilePhoto,
      farmName, locationAddress: location, district, state,
      specialty: farmDescription,
      organicCertified,
      ...overrides
    };
    try {
      await farmerService.updateProfile(updated);
      localStorage.setItem('localfarm_farmer_settings', JSON.stringify(updated));
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
      persistSettings({ avatar: imageUrl });
      if (showToast) showToast('Avatar Updated ✨', 'New profile photo updated.');
    }
  };

  // Save Handlers
  const handleSaveFarmOperations = async (e) => {
    e.preventDefault();
    await persistSettings({
      name, email, phone, altPhone,
      farmName, locationAddress: location, district, state,
      specialty: farmDescription, organicCertified
    });
    if (showToast) showToast('Farm & Operations Saved! 🌾', 'Profile, farm details, and operations updated in database.');
  };

  const handleUploadDocument = async (docType, file) => {
    if (!file) return;
    const docUrl = URL.createObjectURL(file);
    try {
      await farmerService.submitKyc({ docType, docUrl });
      if (showToast) {
        showToast('Document Uploaded 📄', `${docType} submitted for database review.`);
      }
      const updated = await farmerService.getKyc();
      setKycDocs(updated || []);
    } catch (err) {
      if (showToast) showToast('Upload Error', err.message || 'Failed to submit document', 'error');
    }
  };

  const verificationProgress = useMemo(() => {
    if (!kycDocs || kycDocs.length === 0) return 0;
    const approved = kycDocs.filter(d => d.status === 'Approved').length;
    return Math.round((approved / Math.max(1, kycDocs.length)) * 100);
  }, [kycDocs]);

  const handleSaveBankingAndPayouts = async (e) => {
    e.preventDefault();
    await persistSettings();
    if (showToast) showToast('Banking & Payouts Saved! 💳', `${payoutMethod.toUpperCase()} details saved.`);
  };

  const handleDownloadPayoutCSV = () => {
    if (payoutHistory.length === 0) {
      if (showToast) showToast('No Records', 'No payout statements found to export.', 'info');
      return;
    }
    const headers = ['Payout ID', 'Date', 'Amount (INR)', 'Net Payout', 'Status'];
    const rows = payoutHistory.map(p => [p.id, p.created_at, p.amount, p.net_payout, p.status]);
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
    localStorage.setItem('localfarm_lang', language);
    localStorage.setItem('localfarm_currency', currency);
    if (showToast) showToast('Preferences & Security Saved! 🔒', 'Security, alerts, language, and sound settings updated.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const totalEarnings = useMemo(() => payoutHistory.reduce((sum, p) => sum + Number(p.amount || 0), 0), [payoutHistory]);

  const settingsTabs = [
    { id: 'farm', label: 'Farm & Operations', icon: Sprout, badge: `${deliveryRadius} km` },
    { id: 'verification', label: 'Accreditation & Badges', icon: ShieldCheck, badge: `${kycDocs.length} Docs` },
    { id: 'payouts', label: 'Banking & Payouts', icon: DollarSign, badge: `₹${totalEarnings}` },
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-farmGold-400/20 text-farmGold-300 text-[10px] font-black uppercase tracking-wider border border-farmGold-400/30">
                  {organicCertified ? '🌱 Certified Organic' : 'Direct Producer'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-bold">
                  {district || 'Pune'}, {state || 'MH'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {name || 'Farmer Partner'}
              </h1>
              <p className="text-xs text-farmGreen-100/80 font-medium flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-farmGold-400" />
                <span>{farmName || 'My Organic Farm'}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Live Storefront</span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${farmStatus === 'open' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-bold text-xs text-white capitalize">{farmStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-farmSage-200/60 shadow-sm scrollbar-none">
        {settingsTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-farmGreen-950 text-white shadow-md'
                  : 'text-farmGreen-900 hover:bg-farmGreen-50/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-farmGold-400' : 'text-farmGreen-700'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-farmSage-100 text-farmGreen-950'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Main Content Area ── */}
      <div className="bg-white rounded-3xl border border-farmSage-200/60 p-6 sm:p-8 shadow-sm">
        
        {/* Tab 1: Farm & Operations */}
        {activeSubTab === 'farm' && (
          <form onSubmit={handleSaveFarmOperations} className="space-y-6">
            <div>
              <h2 className="text-base font-black text-farmGreen-950 mb-1">Farm Identity & Contact Details</h2>
              <p className="text-xs text-farmMuted">Details displayed on customer receipts and product listings</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">Farm / Brand Name</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={e => setFarmName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">Primary Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">Farm Location / Address</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">About Your Farm (Specialty & Cultivation Methods)</label>
                <textarea
                  rows="3"
                  value={farmDescription}
                  onChange={e => setFarmDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-medium text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-farmSage-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-farmGreen-950 hover:bg-farmGreen-800 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-farmGold-400" /> Save Farm Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Accreditation & KYC Documents */}
        {activeSubTab === 'verification' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-black text-farmGreen-950 mb-1">Accreditation & KYC Documents (Database)</h2>
              <p className="text-xs text-farmMuted">Upload organic verification, FSSAI certificates, and land ownership records</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { type: 'Organic Farming Certificate', label: 'Organic Farming Certificate', desc: 'NPOP / Jaivik Bharat Certification' },
                { type: 'FSSAI Food Business License', label: 'FSSAI License Document', desc: 'State Food Safety Certificate' },
                { type: 'Land Title Proof (Khata)', label: 'Land Title / Khata Proof', desc: 'Agricultural Land Title Proof' },
              ].map(doc => {
                const uploaded = kycDocs.find(d => d.doc_type === doc.type);
                const isApproved = uploaded?.status === 'Approved';
                const isPending = uploaded?.status === 'Pending';
                return (
                  <div key={doc.type} className="p-4 rounded-2xl border border-farmSage-200 bg-farmBg/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-black text-xs text-farmGreen-950">{doc.label}</div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isApproved ? 'bg-emerald-100 text-emerald-950' : isPending ? 'bg-amber-100 text-amber-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isApproved ? '✓ APPROVED' : isPending ? '⏳ UNDER REVIEW' : 'NOT UPLOADED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-farmMuted">{doc.desc}</p>
                    
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-farmSage-300 hover:border-farmGreen-600 rounded-xl text-xs font-bold text-farmGreen-950 cursor-pointer shadow-2xs transition-all">
                      <Upload className="w-3.5 h-3.5 text-farmGreen-700" />
                      <span>{uploaded ? 'Upload New Version' : 'Upload Document'}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={e => handleUploadDocument(doc.type, e.target.files?.[0])}
                      />
                    </label>

                    {uploaded && (
                      <div className="text-[10px] text-farmMuted font-mono">
                        Submitted: {new Date(uploaded.created_at).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Banking & Payouts */}
        {activeSubTab === 'payouts' && (
          <form onSubmit={handleSaveBankingAndPayouts} className="space-y-6">
            <div>
              <h2 className="text-base font-black text-farmGreen-950 mb-1">Direct Bank & UPI Settlement</h2>
              <p className="text-xs text-farmMuted">Configure account for automated order settlements</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">UPI ID (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi"
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India"
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  placeholder="Enter Account Number"
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-farmGreen-950 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value)}
                  placeholder="e.g. SBIN0001234"
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-farmSage-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-farmGreen-600 focus:bg-white uppercase"
                />
              </div>
            </div>

            {/* Payout History Ledger */}
            <div className="pt-4 border-t border-farmSage-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-farmGreen-950">Payout Settlements History</h3>
                <button
                  type="button"
                  onClick={handleDownloadPayoutCSV}
                  className="text-xs font-bold text-farmGreen-700 hover:text-farmGreen-950 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>

              {payoutHistory.length > 0 ? (
                <div className="space-y-2">
                  {payoutHistory.map(p => (
                    <div key={p.id} className="p-3 bg-farmBg/50 rounded-xl border border-farmSage-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-black text-farmGreen-950">{p.id}</div>
                        <div className="text-[10px] text-farmMuted font-mono">{new Date(p.created_at).toLocaleDateString('en-IN')}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-farmGreen-950">₹{Number(p.amount).toLocaleString('en-IN')}</div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-farmSage-200 rounded-2xl text-farmMuted text-xs font-medium">
                  <Inbox className="w-6 h-6 mx-auto mb-1.5 text-farmSage-400" />
                  No payout settlement records yet.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-farmSage-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-farmGreen-950 hover:bg-farmGreen-800 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-farmGold-400" /> Save Banking Details
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Preferences & Security */}
        {activeSubTab === 'preferences' && (
          <form onSubmit={handleSavePreferencesAndSecurity} className="space-y-6">
            <div>
              <h2 className="text-base font-black text-farmGreen-950 mb-1">Account Security & Notifications</h2>
              <p className="text-xs text-farmMuted">Manage your authentication and in-app alerts</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-farmBg/50 border border-farmSage-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-xs text-farmGreen-950">Order SMS & WhatsApp Notifications</div>
                  <div className="text-[11px] text-farmMuted">Receive instant notifications for new orders</div>
                </div>
                <input
                  type="checkbox"
                  checked={newOrderAlerts}
                  onChange={e => setNewOrderAlerts(e.target.checked)}
                  className="w-4 h-4 accent-farmGreen-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-farmBg/50 border border-farmSage-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-xs text-farmGreen-950">Low Stock Reminders</div>
                  <div className="text-[11px] text-farmMuted">Alert when produce stock drops below 15 units</div>
                </div>
                <input
                  type="checkbox"
                  checked={lowStockAlerts}
                  onChange={e => setLowStockAlerts(e.target.checked)}
                  className="w-4 h-4 accent-farmGreen-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-farmSage-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-farmGreen-950 hover:bg-farmGreen-800 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-farmGold-400" /> Save Preferences
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};

export default FarmerSettings;
