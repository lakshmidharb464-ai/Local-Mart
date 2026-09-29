import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MemberRank } from '../../components/MemberRank';
import { Profile } from '../../components/Profile';
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
  Truck,
  Plus,
  Trash2,
  Clock,
  Sliders
} from 'lucide-react';

export const CustomerProfileSettings = ({ initialSubTab = 'profile' }) => {
  const { user, showToast, logout } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  // Profile State
  const [name, setName] = useState(user?.name || 'Anita Sharma');
  const [email, setEmail] = useState(user?.email || 'anita.sharma@gmail.com');
  const [phone, setPhone] = useState('+91 98450 67123');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  // Option A: Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      tag: 'Home',
      houseNo: 'Flat 402, Green Acres',
      streetArea: 'Baner Road',
      landmark: 'Near Baner Bio Diversity Park',
      city: 'Pune',
      stateName: 'Maharashtra',
      pincode: '411045',
      deliveryInstruction: 'Leave with gate security',
      isDefault: true
    },
    {
      id: 'addr-2',
      tag: 'Work',
      houseNo: '12th Floor, Cyber Towers',
      streetArea: 'Senapati Bapat Road',
      landmark: 'Opposite Marriott Hotel',
      city: 'Pune',
      stateName: 'Maharashtra',
      pincode: '411016',
      deliveryInstruction: 'Call upon arrival',
      isDefault: false
    }
  ]);

  // Form States for Adding/Editing Address
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  const [formTag, setFormTag] = useState('Home');
  const [formHouseNo, setFormHouseNo] = useState('');
  const [formStreetArea, setFormStreetArea] = useState('');
  const [formLandmark, setFormLandmark] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formStateName, setFormStateName] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formInstruction, setFormInstruction] = useState('Leave with gate security');

  const [isLocating, setIsLocating] = useState(false);
  const [copiedAddressId, setCopiedAddressId] = useState(null);

  // Option C: Subscriptions State
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 'sub-1',
      name: 'Organic Desi Cow Milk',
      qty: '2 Litres',
      frequency: 'Daily',
      price: 160,
      nextDelivery: 'Tomorrow, 7:00 AM',
      isActive: true
    },
    {
      id: 'sub-2',
      name: 'Fresh Farm Eggs (Cage-Free)',
      qty: '1 Dozen',
      frequency: 'Every Tue & Fri',
      price: 120,
      nextDelivery: 'Tuesday, 8:00 AM',
      isActive: true
    },
    {
      id: 'sub-3',
      name: 'Hydroponic Salad Greens Mix',
      qty: '500g',
      frequency: 'Weekly',
      price: 240,
      nextDelivery: 'August 28, 9:00 AM',
      isActive: false
    }
  ]);

  const subscriptionPresets = [
    { name: 'Fresh A2 Cow Milk', price: 90, frequency: 'Daily', qty: '1 Litre' },
    { name: 'Cage-Free Desi Eggs', price: 120, frequency: 'Every Mon & Thu', qty: '1 Dozen' },
    { name: 'Weekly Organic Vegetable Box', price: 350, frequency: 'Weekly', qty: '5 kg Assorted' }
  ];

  // Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notifications State
  const [orderTrackingAlerts, setOrderTrackingAlerts] = useState(true);
  const [harvestOffers, setHarvestOffers] = useState(true);

  // Order Preferences State
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning 6–9 AM');
  const [dietaryFilters, setDietaryFilters] = useState(['Organic Only']);
  const [prefLanguage, setPrefLanguage] = useState('English');
  const [themeMode, setThemeMode] = useState('Light');
  const [whatsappSubAlerts, setWhatsappSubAlerts] = useState(true);

  // Profile Save Callback
  const handleSaveProfileData = (updatedData) => {
    setName(updatedData.name);
    setEmail(updatedData.email);
    setPhone(updatedData.phone);
    setAvatar(updatedData.avatar);
    showToast('Profile Saved', 'Customer information updated successfully.');
  };

  // Address Handlers
  const handleStartAddNewAddress = () => {
    setEditingAddressId(null);
    setFormTag('Home');
    setFormHouseNo('');
    setFormStreetArea('');
    setFormLandmark('');
    setFormCity('');
    setFormStateName('');
    setFormPincode('');
    setFormInstruction('Leave with gate security');
    setIsEditingAddress(true);
  };

  const handleStartEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setFormTag(addr.tag);
    setFormHouseNo(addr.houseNo);
    setFormStreetArea(addr.streetArea);
    setFormLandmark(addr.landmark || '');
    setFormCity(addr.city);
    setFormStateName(addr.stateName);
    setFormPincode(addr.pincode);
    setFormInstruction(addr.deliveryInstruction);
    setIsEditingAddress(true);
  };

  const handleSaveAddressForm = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      // Update
      setAddresses(addresses.map(addr => addr.id === editingAddressId ? {
        ...addr,
        tag: formTag,
        houseNo: formHouseNo,
        streetArea: formStreetArea,
        landmark: formLandmark,
        city: formCity,
        stateName: formStateName,
        pincode: formPincode,
        deliveryInstruction: formInstruction
      } : addr));
      showToast('Address Updated 📍', `${formTag} delivery address has been updated.`);
    } else {
      // Add
      const newAddr = {
        id: `addr-${Date.now()}`,
        tag: formTag,
        houseNo: formHouseNo,
        streetArea: formStreetArea,
        landmark: formLandmark,
        city: formCity,
        stateName: formStateName,
        pincode: formPincode,
        deliveryInstruction: formInstruction,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddr]);
      showToast('Address Saved 📍', `${formTag} delivery destination successfully registered.`);
    }
    setIsEditingAddress(false);
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    const selected = addresses.find(addr => addr.id === id);
    showToast('Default Address Saved', `${selected?.tag || 'Location'} set as primary delivery destination.`);
  };

  const handleDeleteAddress = (id) => {
    const target = addresses.find(addr => addr.id === id);
    if (target?.isDefault) {
      showToast('Action Denied ⚠️', 'Cannot delete your active default address. Set another default first.', 'error');
      return;
    }
    setAddresses(addresses.filter(addr => addr.id !== id));
    showToast('Address Deleted 🗑️', `${target?.tag || 'Location'} address has been removed.`);
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setFormHouseNo('Plot 18, Emerald Enclave');
      setFormStreetArea('Koregaon Park Main Rd');
      setFormLandmark('Opposite German Bakery');
      setFormCity('Pune');
      setFormStateName('Maharashtra');
      setFormPincode('411001');
      setIsLocating(false);
      showToast('GPS Location Detected', 'Address fields auto-filled with current location.');
    }, 700);
  };

  const handleCopyAddressText = (addr) => {
    const text = `${addr.houseNo}, ${addr.streetArea}, ${addr.landmark ? `Landmark: ${addr.landmark}, ` : ''}${addr.city}, ${addr.stateName} - ${addr.pincode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedAddressId(addr.id);
    showToast('Copied to Clipboard', 'Delivery address copied.');
    setTimeout(() => setCopiedAddressId(null), 2000);
  };

  // Subscription Handlers
  const handleToggleSubActive = (id) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        const nextState = !sub.isActive;
        showToast(
          nextState ? 'Subscription Resumed 🟢' : 'Subscription Paused ⏸️',
          `${sub.name} delivery cycle is now ${nextState ? 'active' : 'on-hold'}.`
        );
        return { ...sub, isActive: nextState };
      }
      return sub;
    }));
  };

  const handleCancelSubscription = (id) => {
    const target = subscriptions.find(sub => sub.id === id);
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    showToast('Subscription Cancelled 🛑', `${target?.name || 'Item'} subscription has been ended.`);
  };

  const handleAddPresetSubscription = (preset) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      name: preset.name,
      qty: preset.qty,
      frequency: preset.frequency,
      price: preset.price,
      nextDelivery: 'Starting Tomorrow, 7:00 AM',
      isActive: true
    };
    setSubscriptions([...subscriptions, newSub]);
    showToast('Subscription Active 📅', `Successfully subscribed to ${preset.name} (${preset.frequency}).`);
  };

  // Password & Notification Handlers
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn font-display pb-16">
      
      {/* Ultra-Premium Glassmorphism Hero Header Card */}
      <div className="bg-gradient-to-br from-[#0A2312] via-[#183D22] to-[#257036] text-white p-6 sm:p-8 rounded-[32px] relative shadow-2xl border border-farmGreen-600/30 transition-all duration-500 overflow-hidden group">
        {/* Multi-layer glowing ambient shapes */}
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-farmGreen-400/15 rounded-full blur-3xl group-hover:bg-farmGreen-400/25 transition-all duration-700" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-farmOrange-500/15 rounded-full blur-3xl group-hover:bg-farmOrange-500/25 transition-all duration-700" />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative group/avatar shrink-0">
              <img 
                src={avatar} 
                alt={name} 
                className="rounded-2xl object-cover ring-4 ring-farmGreen-400/80 shadow-xl group-hover/avatar:scale-105 group-hover/avatar:ring-farmGreen-300 transition-all duration-300" 
                style={{ width: 88, height: 88 }}
                loading="lazy"
              />
              <label 
                className="absolute -bottom-1.5 -right-1.5 p-2 bg-gradient-to-r from-farmGreen-400 to-farmOrange-400 hover:from-farmGreen-300 hover:to-farmOrange-300 text-slate-950 rounded-full cursor-pointer shadow-lg transition-all duration-300 active:scale-90 group-hover/avatar:scale-110"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setAvatar(imageUrl);
                      showToast('Avatar Updated ✨', 'New customer profile photo uploaded.');
                    }
                  }} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{name}</h2>
                <span className="bg-farmGreen-400/20 backdrop-blur-md text-farmGreen-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-farmGreen-400/30 flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-farmOrange-400" /> Verified Buyer
                </span>
              </div>
              <p className="text-xs text-farmGreen-200/90 font-medium">{email} · {phone}</p>
              
              {/* Member Rank Component */}
              <div className="pt-1">
                <MemberRank orderCount={user?.orderCount || 35} compact={true} tooltipPosition="bottom" tooltipAlign="left" />
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-[18px] py-2.5 bg-red-500/10 hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-700 hover:text-white hover:border-transparent text-rose-200 border border-rose-500/30 rounded-2xl text-xs font-black transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 shadow-sm hover:shadow-lg hover:shadow-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Switcher — Ultra-Glassmorphic Floating Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-white/80 backdrop-blur-xl rounded-3xl border border-farmGreen-200/60 shadow-lg shadow-farmGreen-950/5 scrollbar-none">
        {[
          { id: 'profile',       label: 'Profile Info',      icon: User,    badge: 'Gold' },
          { id: 'address',       label: 'Saved Addresses',   icon: MapPin,  badge: addresses.length },
          { id: 'security',      label: 'Security Controls', icon: Key },
          { id: 'notifications', label: 'Notifications',     icon: Bell },
          { id: 'preferences',   label: 'Preferences',       icon: Sliders },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setIsEditingAddress(false);
              }}
              className={`group px-[18px] sm:px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-farmGreen-800 via-farmGreen-700 to-farmGreen-950 text-white shadow-md shadow-farmGreen-900/25 ring-2 ring-farmGreen-400/50 scale-[1.03]'
                  : 'bg-gray-50/80 text-gray-700 hover:bg-farmGreen-50/80 hover:text-farmGreen-950 border border-gray-100 hover:border-farmGreen-200/80'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Centered Main Form Container Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-emerald-100/80 shadow-farm-md">
        
        {/* Option D: Profile Subtab with Savings Rank Stats */}
        {activeSubTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Membership Tier & Savings Panel */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 p-6 rounded-[24px] border border-emerald-100/80 shadow-farm-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-lg shadow-sm">
                    🥇
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-farmGreen-950">Gold Buyer Status</h3>
                    <p className="text-xs text-farmMuted font-bold">Progress to Emerald Rank: 35 / 50 Orders</p>
                  </div>
                </div>
                
                {/* Stats indicators */}
                <div className="flex items-center gap-5">
                  <div className="text-center sm:text-right">
                    <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Total Orders</div>
                    <div className="font-black text-lg text-farmGreen-950">35</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center sm:text-right">
                    <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Lifetime Savings</div>
                    <div className="font-black text-lg text-emerald-700">₹2,450</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-extrabold text-farmGreen-950">
                  <span>Gold Member (Tier 2)</span>
                  <span>70% to Emerald (Tier 3)</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-emerald-500 to-emerald-600 rounded-full transition-all duration-1000" style={{ width: '70%' }} />
                </div>
                <p className="text-[10px] text-farmMuted font-medium italic">
                  * Reach Emerald status (50 orders) to unlock free delivery on all orders and custom priority harvest notifications!
                </p>
              </div>
            </div>

            <Profile
              initialData={{ name, email, phone, avatar }}
              userRole="Customer"
              onSave={handleSaveProfileData}
              showToast={showToast}
            />
          </div>
        )}

        {/* Option A: Saved Addresses Form & List */}
        {activeSubTab === 'address' && (
          <div className="space-y-6 animate-fadeIn">
            {isEditingAddress ? (
              <form onSubmit={handleSaveAddressForm} className="space-y-6 text-xs font-semibold">
                {/* Header with GPS Auto Detect */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-farmGreen-950">
                        {editingAddressId ? 'Edit Delivery Destination' : 'Add New Delivery Destination'}
                      </h3>
                      <p className="text-xs text-farmMuted">Provide detailed delivery mapping for fresh-farm couriers</p>
                    </div>
                  </div>

                  {/* Use GPS Button */}
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="group px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl font-bold text-xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Navigation className={`w-3.5 h-3.5 text-emerald-600 transition-all group-hover:rotate-12 ${isLocating ? 'animate-spin' : ''}`} />
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
                      const isSelected = formTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setFormTag(tag)}
                          className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 ${
                            isSelected
                              ? 'bg-gradient-to-br from-emerald-50/50 via-emerald-100/30 to-teal-50/20 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-md scale-[1.02]'
                              : 'bg-farmBg/40 border-gray-200 text-gray-700 hover:bg-emerald-50/20 hover:border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-gray-400'}`} />
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-scaleIn" />}
                          </div>
                          <div className="mt-2.5">
                            <div className="font-extrabold text-xs">{tag}</div>
                            <div className="text-[10px] text-gray-500 font-normal leading-tight mt-0.5">{desc}</div>
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
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                        <Building className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formHouseNo}
                        onChange={(e) => setFormHouseNo(e.target.value)}
                        placeholder="e.g. Flat 402, Green Acres"
                        className="w-full pl-11 pr-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Street Address & Area</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formStreetArea}
                        onChange={(e) => setFormStreetArea(e.target.value)}
                        placeholder="e.g. Baner Road"
                        className="w-full pl-11 pr-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Landmark (Optional)</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                        <Compass className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formLandmark}
                        onChange={(e) => setFormLandmark(e.target.value)}
                        placeholder="e.g. Near Baner Bio Diversity Park"
                        className="w-full pl-11 pr-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-extrabold text-farmGreen-950 mb-1.5 block">City / District</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                        <Navigation className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="e.g. Pune"
                        className="w-full pl-11 pr-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-extrabold text-farmGreen-950 mb-1.5 block">State</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                        <Map className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formStateName}
                        onChange={(e) => setFormStateName(e.target.value)}
                        placeholder="e.g. Maharashtra"
                        className="w-full pl-11 pr-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Pincode / Postal Code</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                        <Building className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formPincode}
                        onChange={(e) => setFormPincode(e.target.value)}
                        placeholder="e.g. 411045"
                        className="w-full pl-11 pr-4 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
                        required
                      />
                    </div>
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
                      const isOptSelected = formInstruction === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormInstruction(opt)}
                          className={`p-2.5 rounded-xl border text-center text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
                            isOptSelected
                              ? 'bg-gradient-to-r from-emerald-800 to-farmGreen-950 text-white border-transparent shadow-[0_2px_8px_rgba(16,185,129,0.15)] font-extrabold'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 transition-all cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="group w-9 h-9 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-farm-md cursor-pointer"
                    title="Save Address"
                  >
                    <Save className="w-4 h-4 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-farmGreen-950">Saved Delivery Addresses</h3>
                      <p className="text-xs text-farmMuted font-bold">Manage locations for fresh farm morning dispatches</p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartAddNewAddress}
                    className="group w-9 h-9 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md cursor-pointer"
                    title="Add New Location"
                  >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Saved Address Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all duration-300 relative ${
                        addr.isDefault 
                          ? 'bg-gradient-to-br from-emerald-50/20 via-emerald-50/40 to-teal-50/10 border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                          : 'bg-white border-gray-200 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                            {addr.tag === 'Home' ? <Home className="w-3.5 h-3.5" /> : 
                             addr.tag === 'Work' ? <Briefcase className="w-3.5 h-3.5" /> : 
                             addr.tag === 'Farm' ? <Building className="w-3.5 h-3.5" /> : 
                             <Map className="w-3.5 h-3.5" />}
                          </span>
                          <span className="font-extrabold text-xs text-farmGreen-950">{addr.tag}</span>
                          {addr.isDefault && (
                            <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyAddressText(addr)}
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-lg border border-gray-200 cursor-pointer"
                            title="Copy address"
                          >
                            {copiedAddressId === addr.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleStartEditAddress(addr)}
                            className="px-2 py-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-100 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-3 space-y-2">
                        <p className="text-xs text-farmGreen-950 font-bold leading-relaxed">
                          {addr.houseNo}, {addr.streetArea}, {addr.landmark ? `Landmark: ${addr.landmark}, ` : ''}{addr.city}, {addr.stateName} - {addr.pincode}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold pt-1.5 border-t border-dashed border-gray-100">
                          <Truck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Delivery instructions: <strong className="text-farmGreen-950">{addr.deliveryInstruction}</strong></span>
                        </div>
                      </div>

                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="w-full mt-4 py-2 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-gray-600 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                        >
                          Deliver to this address by default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
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
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950"
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
                className="group px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-display font-extrabold text-xs shadow-farm-md hover:shadow-farm-lg hover:shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Lock className="w-4 h-4 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
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
              <div className="flex items-center justify-between p-4 bg-farmBg/85 rounded-2xl border border-emerald-100/80 shadow-2xs hover:border-emerald-200/80 transition-all duration-300">
                <div>
                  <div className="font-extrabold text-farmGreen-950 text-sm">Real-Time Dispatch Tracking</div>
                  <div className="text-[11px] text-farmMuted font-bold mt-0.5">Receive instant SMS alerts when rider picks up harvest</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderTrackingAlerts(!orderTrackingAlerts)}
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-300 cursor-pointer shadow-inner relative flex items-center ${
                    orderTrackingAlerts ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-spring ${
                    orderTrackingAlerts ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-farmBg/85 rounded-2xl border border-emerald-100/80 shadow-2xs hover:border-emerald-200/80 transition-all duration-300">
                <div>
                  <div className="font-extrabold text-farmGreen-950 text-sm">Fresh Harvest Offers</div>
                  <div className="text-[11px] text-farmMuted font-bold mt-0.5">Get notified when seasonal fruits are picked fresh</div>
                </div>
                <button
                  type="button"
                  onClick={() => setHarvestOffers(!harvestOffers)}
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-300 cursor-pointer shadow-inner relative flex items-center ${
                    harvestOffers ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-spring ${
                    harvestOffers ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-gray-100">
              <button
                type="submit"
                className="group px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-display font-extrabold text-xs shadow-farm-md hover:shadow-farm-lg hover:shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <span>Save Notification Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* ── 5. Subscriptions Tab ── */}
        {activeSubTab === 'subscriptions' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-farmGreen-950">Active Subscriptions</h3>
                <p className="text-xs text-farmMuted font-bold">Manage your recurring farm-fresh delivery schedules</p>
              </div>
            </div>

            {/* Active Subscription Cards */}
            <div className="space-y-3">
              {subscriptions.map(sub => (
                <div key={sub.id} className={`p-5 rounded-2xl border transition-all ${sub.isActive ? 'bg-white border-emerald-200 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-farmGreen-950 truncate">{sub.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                          sub.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>{sub.isActive ? '● Active' : '⏸ Paused'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-farmMuted font-bold flex-wrap">
                        <span>📦 {sub.qty}</span>
                        <span>🔁 {sub.frequency}</span>
                        <span className="text-emerald-700 font-black">₹{sub.price}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-bold">
                        <Clock className="w-3 h-3" />
                        <span>Next: <strong>{sub.nextDelivery}</strong></span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleSubActive(sub.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer transition-all active:scale-95 ${
                          sub.isActive
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {sub.isActive ? '⏸ Pause' : '▶ Resume'}
                      </button>
                      <button
                        onClick={() => handleCancelSubscription(sub.id)}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-black text-rose-700 bg-rose-50 hover:bg-rose-100 cursor-pointer transition-all active:scale-95"
                      >
                        🛑 Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {subscriptions.length === 0 && (
                <div className="py-10 text-center text-farmMuted text-xs font-bold">No active subscriptions. Add one from the presets below!</div>
              )}
            </div>

            {/* Quick Add Presets */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span className="font-extrabold text-sm text-farmGreen-950">Add Preset Subscription</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {subscriptionPresets.map((preset, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2 hover:border-emerald-300 transition-all">
                    <div className="font-extrabold text-sm text-farmGreen-950">{preset.name}</div>
                    <div className="text-[11px] text-farmMuted font-bold">{preset.qty} · {preset.frequency}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-emerald-700">₹{preset.price}/cycle</span>
                      <button
                        onClick={() => handleAddPresetSubscription(preset)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-black cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Subscribe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp alerts for subscriptions */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-200">
              <div>
                <div className="font-extrabold text-green-950 text-sm">📱 WhatsApp Subscription Reminders</div>
                <div className="text-[11px] text-green-800 font-bold mt-0.5">Receive WhatsApp alerts before each scheduled subscription delivery</div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappSubAlerts(!whatsappSubAlerts)}
                className={`w-12 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
                  whatsappSubAlerts ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                  whatsappSubAlerts ? 'left-6' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* ── 6. Order Preferences Tab ── */}
        {activeSubTab === 'preferences' && (
          <form
            onSubmit={e => { e.preventDefault(); showToast('Preferences Saved ✨', 'Your order preferences, language & theme updated.'); }}
            className="space-y-6 text-xs font-semibold animate-fadeIn"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 text-white flex items-center justify-center shadow-md shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-farmGreen-950">Order Preferences & App Settings</h3>
                <p className="text-xs text-farmMuted font-bold">Customise delivery time slots, dietary filters, language, and theme</p>
              </div>
            </div>

            {/* Preferred Delivery Time Slot */}
            <div className="space-y-2">
              <label className="font-extrabold text-farmGreen-950 block">Preferred Delivery Time Slot</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Morning 6–9 AM', 'Afternoon 12–2 PM', 'Evening 5–8 PM'].map(slot => (
                  <button
                    key={slot} type="button"
                    onClick={() => setPreferredTimeSlot(slot)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      preferredTimeSlot === slot
                        ? 'bg-gradient-to-r from-emerald-800 to-farmGreen-950 text-white border-transparent shadow-md font-extrabold'
                        : 'bg-farmBg/40 border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200'
                    }`}
                  >
                    <div className="text-xl mb-1">{slot.includes('Morning') ? '🌅' : slot.includes('Afternoon') ? '☀️' : '🌆'}</div>
                    <div className="text-[11px] font-extrabold">{slot}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Filters */}
            <div className="space-y-2">
              <label className="font-extrabold text-farmGreen-950 block">Dietary Preference Filters</label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian Only', 'Organic Only', 'Dairy-Free', 'Gluten-Free', 'Vegan', 'Low-Sodium'].map(filter => {
                  const isSelected = dietaryFilters.includes(filter);
                  return (
                    <button
                      key={filter} type="button"
                      onClick={() => setDietaryFilters(prev =>
                        isSelected ? prev.filter(f => f !== filter) : [...prev, filter]
                      )}
                      className={`px-3.5 py-2 rounded-full text-[11px] font-extrabold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{filter}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-farmMuted font-bold">Selected filters prioritise matching products in search results.</p>
            </div>

            {/* Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">App Language</label>
                <select
                  value={prefLanguage}
                  onChange={e => setPrefLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:border-emerald-500 rounded-2xl text-xs font-bold text-farmGreen-950 outline-none cursor-pointer"
                >
                  {['English', 'Telugu (తెలుగు)', 'Hindi (हिन्दी)', 'Marathi (मराठी)', 'Tamil (தமிழ்)'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Theme Mode */}
              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1.5 block">App Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Light', icon: '☀️' },
                    { id: 'Dark', icon: '🌙' },
                    { id: 'System', icon: '⚙️' },
                  ].map(t => (
                    <button
                      key={t.id} type="button"
                      onClick={() => setThemeMode(t.id)}
                      className={`py-2.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                        themeMode === t.id
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-200'
                      }`}
                    >
                      {t.icon} {t.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-gray-100">
              <button
                type="submit"
                className="group px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-display font-extrabold text-xs shadow-farm-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
