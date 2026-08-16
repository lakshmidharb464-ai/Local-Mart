import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  Key, 
  Bell, 
  Save, 
  Camera, 
  LogOut, 
  ShieldCheck, 
  Home,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Building,
  Briefcase,
  Navigation,
  Copy,
  Check,
  Compass,
  Map,
  Truck
} from 'lucide-react';

export const CustomerProfileSettings = ({ initialSubTab = 'profile' }) => {
  const { user, showToast, logout } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  // Profile State
  const [name, setName] = useState(user?.name || 'Anita Sharma');
  const [email, setEmail] = useState(user?.email || 'anita.sharma@gmail.com');
  const [phone, setPhone] = useState('+91 98450 67123');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  // Address State & Detailed Fields
  const [addressTag, setAddressTag] = useState('Home');
  const [houseNo, setHouseNo] = useState('Flat 402, Green Acres');
  const [streetArea, setStreetArea] = useState('Baner Road');
  const [landmark, setLandmark] = useState('Near Baner Bio Diversity Park');
  const [city, setCity] = useState('Pune');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pincode, setPincode] = useState('411045');
  const [deliveryInstruction, setDeliveryInstruction] = useState('Leave with gate security');
  const [isLocating, setIsLocating] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const fullFormattedAddress = useMemo(() => {
    const parts = [houseNo, streetArea, landmark ? `Landmark: ${landmark}` : '', `${city}, ${stateName} - ${pincode}`];
    return parts.filter(Boolean).join(', ');
  }, [houseNo, streetArea, landmark, city, stateName, pincode]);

  const [savedAddress, setSavedAddress] = useState(fullFormattedAddress);

  // Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notifications State
  const [orderTrackingAlerts, setOrderTrackingAlerts] = useState(true);
  const [harvestOffers, setHarvestOffers] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile Saved', 'Customer information updated successfully.');
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setSavedAddress(fullFormattedAddress);
    showToast('Address Updated', `Delivery address saved for ${addressTag} (${pincode}).`);
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setHouseNo('Plot 18, Emerald Enclave');
      setStreetArea('Koregaon Park Main Rd');
      setLandmark('Opposite German Bakery');
      setCity('Pune');
      setStateName('Maharashtra');
      setPincode('411001');
      setIsLocating(false);
      showToast('GPS Location Detected', 'Address fields auto-filled with current location.');
    }, 700);
  };

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullFormattedAddress);
    }
    setCopiedAddress(true);
    showToast('Copied to Clipboard', 'Delivery address copied.');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    showToast('Password Updated', 'Security password successfully changed.');
    setOldPassword('');
    setNewPassword('');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    showToast('Notifications Saved', 'Alert preferences updated.');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      showToast('Avatar Updated', 'New customer profile photo uploaded.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn font-display pb-16">
      
      {/* Dark Emerald Hero Header Card */}
      <div className="bg-[#0F2818] bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] text-white p-6 sm:p-8 rounded-[28px] relative overflow-hidden shadow-2xl border border-emerald-700/40">
        {/* Subtle background glow effect */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src={avatar} 
                alt={name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-400/80 shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300" 
              />
              <label 
                htmlFor="customer-photo-upload"
                className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 rounded-full cursor-pointer shadow-md transition-all active:scale-90"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input 
                  id="customer-photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-2xl text-white tracking-tight">{name}</h2>
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium">{email} · {phone}</p>
              <div className="text-[10px] text-emerald-300/80 flex items-center gap-1.5 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Secure Farm-Direct Account</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/40 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Switcher Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 pt-1">
        {[
          { id: 'profile', label: '👤 Profile Info', icon: User },
          { id: 'address', label: '📍 Delivery Address', icon: MapPin },
          { id: 'security', label: '🔒 Security Controls', icon: Key },
          { id: 'notifications', label: '🔔 Notifications', icon: Bell }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-farmGreen-800 to-farmGreen-900 text-white shadow-farm-md scale-105 ring-2 ring-emerald-500/30'
                  : 'bg-white text-farmGreen-800 border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Centered Main Form Container Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-emerald-100/80 shadow-farm-md">
        
        {/* 1. Profile Info Form */}
        {activeSubTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs font-semibold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-farmGreen-700 text-white flex items-center justify-center shadow-md shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-farmGreen-950">Customer Profile Details</h3>
                <p className="text-xs text-farmMuted">Update account information & personal contact credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Mobile Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-gray-100">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl font-display font-extrabold text-xs shadow-farm-md hover:shadow-farm-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Info</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. Delivery Address Form */}
        {activeSubTab === 'address' && (
          <form onSubmit={handleSaveAddress} className="space-y-6 text-xs font-semibold animate-fadeIn">
            {/* Header with GPS Auto Detect */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-farmGreen-950">Default Delivery Address</h3>
                  <p className="text-xs text-farmMuted">Primary destination for fresh morning harvest drop-offs</p>
                </div>
              </div>

              {/* Use GPS Button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting Location...' : 'Use Current Location'}</span>
              </button>
            </div>

            {/* Address Type Tag Selection */}
            <div>
              <label className="font-extrabold text-farmGreen-950 mb-2 block">Address Label / Tag</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { tag: 'Home', icon: Home, desc: 'Apartment / Residence' },
                  { tag: 'Work', icon: Briefcase, desc: 'Office / Workplace' },
                  { tag: 'Farm', icon: Building, desc: 'Estate / Warehouse' },
                  { tag: 'Other', icon: Map, desc: 'Custom Destination' }
                ].map(({ tag, icon: IconComponent, desc }) => {
                  const isSelected = addressTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setAddressTag(tag)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/30 shadow-xs'
                          : 'bg-farmBg/40 border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-gray-400'}`} />
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="mt-2">
                        <div className="font-extrabold text-xs">{tag}</div>
                        <div className="text-[10px] text-gray-500 font-normal leading-tight">{desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Structured Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Flat, House No. & Building / Apartment</label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. Flat 402, Green Acres"
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Street Address & Area</label>
                <input
                  type="text"
                  value={streetArea}
                  onChange={(e) => setStreetArea(e.target.value)}
                  placeholder="e.g. Baner Road"
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Baner Bio Diversity Park"
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">City / District</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Pincode / Postal Code</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 411045"
                  className="w-full px-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                  required
                />
              </div>
            </div>

            {/* Delivery Instructions Options */}
            <div>
              <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Drop-off Instruction for Courier</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Leave with gate security',
                  'Ring doorbell twice',
                  'Call upon arrival',
                  'Leave at front door'
                ].map((opt) => {
                  const isOptSelected = deliveryInstruction === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDeliveryInstruction(opt)}
                      className={`p-2.5 rounded-xl border text-center text-[11px] font-bold transition-all cursor-pointer ${
                        isOptSelected
                          ? 'bg-farmGreen-900 text-white border-farmGreen-900 shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address Visual Dynamic Preview Card */}
            <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-600 text-white rounded-lg">
                    <Home className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-extrabold text-xs text-blue-950">Active Delivery Pin Preview</span>
                  <span className="bg-blue-200 text-blue-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {addressTag}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  {copiedAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-xs text-blue-950 font-bold leading-relaxed pt-1">
                {fullFormattedAddress || 'Complete address fields above to see live preview...'}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-800/80 pt-1 border-t border-blue-200/60 font-medium">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Instruction: <strong>{deliveryInstruction}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Courier partners will navigate directly to this address.</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3 flex justify-end border-t border-gray-100">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl font-display font-extrabold text-xs shadow-farm-md hover:shadow-farm-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Update Delivery Address</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. Security Form */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleUpdatePassword} className="space-y-5 text-xs font-semibold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-800 text-white flex items-center justify-center shadow-md shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-farmGreen-950">Security Controls</h3>
                <p className="text-xs text-farmMuted">Update customer account password & login credentials</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-gray-100">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl font-display font-extrabold text-xs shadow-farm-md hover:shadow-farm-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        )}

        {/* 4. Notifications Form */}
        {activeSubTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications} className="space-y-5 text-xs font-semibold animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-farmOrange-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-farmGreen-950">Notification Alert Preferences</h3>
                <p className="text-xs text-farmMuted">Manage WhatsApp & SMS order notifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-farmBg/80 rounded-2xl border border-emerald-100">
                <div>
                  <div className="font-extrabold text-farmGreen-950 text-sm">Real-Time Dispatch Tracking</div>
                  <div className="text-[11px] text-farmMuted font-bold mt-0.5">Receive instant SMS alerts when rider picks up harvest</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderTrackingAlerts(!orderTrackingAlerts)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    orderTrackingAlerts ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    orderTrackingAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-farmBg/80 rounded-2xl border border-emerald-100">
                <div>
                  <div className="font-extrabold text-farmGreen-950 text-sm">Fresh Harvest Offers</div>
                  <div className="text-[11px] text-farmMuted font-bold mt-0.5">Get notified when seasonal fruits are picked fresh</div>
                </div>
                <button
                  type="button"
                  onClick={() => setHarvestOffers(!harvestOffers)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    harvestOffers ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    harvestOffers ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-gray-100">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-2xl font-display font-extrabold text-xs shadow-farm-md hover:shadow-farm-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Notification Settings</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
