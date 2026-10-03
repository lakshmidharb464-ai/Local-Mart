import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Truck, 
  Power, 
  Eye, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  CreditCard, 
  Plus, 
  UserPlus,
  Users,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Award,
  Navigation,
  CheckCircle,
  Clock,
  Edit3,
  Save,
  Check,
  Smartphone,
  FileText,
  RotateCcw
} from 'lucide-react';

export const DeliveryManagement = ({ deliveryPartners, setDeliveryPartners, isDark = false }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingPartner, setViewingPartner] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setEditingPartner(null);
        setViewingPartner(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [newPartner, setNewPartner] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'EV Scooter (Ather 450X)',
    vehicleNumber: 'MH-12-EV-9821',
    hubLocation: 'Chittoor District AP Hub',
    licenseNumber: 'DL-MH12-20230098',
    isOnline: true,
    accountStatus: 'Active',
    approvalStatus: 'Approved',
    rating: 5.0,
    totalDeliveries: 0,
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80'
  });

  const filteredPartners = useMemo(() => {
    return deliveryPartners.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.phone && p.phone.includes(searchQuery)) ||
        (p.vehicleNumber && p.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.hubLocation && p.hubLocation.toLowerCase().includes(searchQuery.toLowerCase()));

      if (statusFilter === 'All') return matchesSearch;
      if (statusFilter === 'Online') return matchesSearch && p.isOnline;
      if (statusFilter === 'Pending') return matchesSearch && p.approvalStatus === 'Pending';
      if (statusFilter === 'Approved') return matchesSearch && p.approvalStatus === 'Approved';
      if (statusFilter === 'Inactive') return matchesSearch && p.accountStatus === 'Inactive';
      return matchesSearch;
    });
  }, [deliveryPartners, searchQuery, statusFilter]);

  const { totalDrivers, onlineDrivers, pendingApprovals, approvedCount } = useMemo(() => {
    return {
      totalDrivers: deliveryPartners.length,
      onlineDrivers: deliveryPartners.filter(p => p.isOnline).length,
      pendingApprovals: deliveryPartners.filter(p => p.approvalStatus === 'Pending').length,
      approvedCount: deliveryPartners.filter(p => p.approvalStatus === 'Approved').length,
    };
  }, [deliveryPartners]);

  const handleToggleOnline = (id, currentVal, name) => {
    setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, isOnline: !currentVal } : p));
    showToast('Duty Status Updated', `${name} is now ${!currentVal ? 'Online (On Duty)' : 'Offline (Off Duty)'}.`);
  };

  const handleToggleAccountStatus = (id, currentStatus, name) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, accountStatus: newStatus } : p));
    showToast('Account Status Updated', `${name} is now ${newStatus}.`);
  };

  const handleApprove = (id, name) => {
    setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, approvalStatus: 'Approved' } : p));
    showToast('Driver Approved', `${name} is now verified and active.`);
  };

  const handleReject = (id, name) => {
    setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, approvalStatus: 'Rejected' } : p));
    showToast('Driver Rejected', `${name}'s application was declined.`, 'error');
  };

  const handleAddPartner = (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone) {
      showToast('Validation Error', 'Please complete the driver name and phone number.', 'error');
      return;
    }

    const created = {
      id: `DEL-00${deliveryPartners.length + 1}`,
      ...newPartner,
      totalDeliveries: 0,
      joinedDate: 'Today'
    };

    setDeliveryPartners([created, ...deliveryPartners]);
    setShowAddModal(false);
    setNewPartner({
      name: '',
      phone: '',
      email: '',
      vehicleType: 'EV Scooter (Ather 450X)',
      vehicleNumber: 'MH-12-EV-9821',
      hubLocation: 'Chittoor District AP Hub',
      licenseNumber: 'DL-MH12-20230098',
      isOnline: true,
      accountStatus: 'Active',
      approvalStatus: 'Approved',
      rating: 5.0,
      totalDeliveries: 0,
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80'
    });
    showToast('Delivery Partner Registered', `${created.name} onboarded successfully!`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setDeliveryPartners(deliveryPartners.map(p => p.id === editingPartner.id ? editingPartner : p));
    setEditingPartner(null);
    showToast('Profile Updated', 'Driver details saved successfully.');
  };

  return (
    <div className="space-y-6 font-display pb-8">
      {/* Header Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark 
          ? 'adm-glass border-[rgba(0,255,133,0.08)]' 
          : 'bg-white border-emerald-100/80 shadow-farm-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`font-extrabold text-2xl tracking-tight ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
              Delivery Boy & Fleet Management
            </h2>
            <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-2xs font-mono ${
              isDark 
                ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border-[rgba(0,255,133,0.25)]' 
                : 'bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}>
              {totalDrivers} Active Riders
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
            Manage delivery personnel, fleet dispatch, onboarding & status verification
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} />
            <input
              type="text"
              placeholder="Search rider name, phone, hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none transition-all ${
                isDark 
                  ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.12)] text-[#D4EAD9] placeholder-[#7FA882]/50 focus:border-[#00FF85]' 
                  : 'bg-farmBg border border-emerald-200/80 rounded-2xl text-[#0A2214] placeholder-gray-400 focus:border-farmGreen-600 focus:bg-white'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full ${isDark ? 'text-[#7FA882] hover:text-[#D4EAD9]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95 ${
              isDark 
                ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                : 'bg-gradient-to-r from-farmGreen-700 via-emerald-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Delivery Boy</span>
          </button>
        </div>
      </div>

      {/* Interactive Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Fleet */}
        <div 
          onClick={() => setStatusFilter('All')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'All'
              ? isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.4)] adm-neon-glow-sm scale-[1.01]' 
                : 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
              : isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.08)] hover:border-[rgba(0,255,133,0.2)]' 
                : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Total Fleet
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
            {totalDrivers}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`}>
            Click to view all riders →
          </div>
        </div>

        {/* Card 2: Online Now */}
        <div 
          onClick={() => setStatusFilter('Online')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Online'
              ? isDark 
                ? 'adm-glass border-[rgba(0,191,255,0.4)] shadow-[0_0_15px_rgba(0,191,255,0.2)] scale-[1.01]' 
                : 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-400/20'
              : isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.08)] hover:border-[rgba(0,191,255,0.25)]' 
                : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Online Now
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(0,191,255,0.1)] text-[#5CD9FF]' : 'bg-blue-100 text-blue-800'
            }`}>
              <Navigation className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#D4EAD9]' : 'text-blue-950'}`}>
            {onlineDrivers}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#5CD9FF]' : 'text-blue-700'}`}>
            Active on delivery duty 🟢
          </div>
        </div>

        {/* Card 3: Pending Audits */}
        <div 
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Pending'
              ? isDark 
                ? 'adm-glass border-[rgba(251,184,58,0.4)] shadow-[0_0_15px_rgba(251,184,58,0.2)] scale-[1.01]' 
                : 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-400/20'
              : isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.08)] hover:border-[rgba(251,184,58,0.25)]' 
                : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Pending Audits
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(251,184,58,0.1)] text-[#FBB83A]' : 'bg-amber-100 text-amber-800'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#FBB83A]' : 'text-amber-950'}`}>
            {pendingApprovals}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#FBB83A]' : 'text-amber-700'}`}>
            Riders awaiting verification ⏳
          </div>
        </div>

        {/* Card 4: Verified Fleet */}
        <div 
          onClick={() => setStatusFilter('Approved')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Approved'
              ? isDark 
                ? 'adm-glass border-[rgba(212,167,69,0.4)] shadow-[0_0_15px_rgba(212,167,69,0.2)] scale-[1.01]' 
                : 'bg-purple-50/80 border-purple-500 shadow-md ring-2 ring-purple-400/20'
              : isDark 
                ? 'adm-glass border-[rgba(0,255,133,0.08)] hover:border-[rgba(212,167,69,0.25)]' 
                : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Verified Fleet
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(212,167,69,0.1)] text-[#D4A745]' : 'bg-purple-100 text-purple-800'
            }`}>
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'adm-gold-text' : 'text-purple-950'}`}>
            {approvedCount}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#D4A745]' : 'text-purple-700'}`}>
            4.9 ⭐ Avg Fleet Rating
          </div>
        </div>
      </div>

      {/* Filter Pills Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'All', label: `All (${totalDrivers})` },
            { id: 'Online', label: `🟢 On Duty (${onlineDrivers})` },
            { id: 'Pending', label: `⏳ Pending (${pendingApprovals})` },
            { id: 'Approved', label: `🛡️ Verified (${approvedCount})` },
            { id: 'Inactive', label: `⛔ Inactive` }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer min-w-[80px] text-center ${
                  isActive
                    ? isDark
                      ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.4)] shadow-[0_0_12px_rgba(0,255,133,0.2)] scale-[1.02]'
                      : 'bg-emerald-700 text-white shadow-md border border-emerald-800 scale-[1.02]'
                    : isDark
                      ? 'text-[#7FA882] border border-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.06)] hover:text-[#D4EAD9]'
                      : 'bg-white text-farmGreen-950 font-bold border border-emerald-200/80 hover:bg-emerald-50 hover:text-emerald-900 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={`text-xs font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
          Showing <span className={`font-extrabold ${isDark ? 'text-[#00FF85]' : 'text-farmGreen-900'}`}>{filteredPartners.length}</span> of {totalDrivers} riders
        </div>
      </div>

      {/* Delivery Partners Table */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        isDark 
          ? 'adm-glass border-[rgba(0,255,133,0.08)]' 
          : 'bg-white border-emerald-100/80 shadow-farm-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b font-black uppercase tracking-wider ${
              isDark 
                ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.08)] text-[#7FA882]' 
                : 'bg-farmBg/80 border-emerald-100 text-farmMuted'
            }`}>
              <tr>
                <th className="p-4 pl-6">Rider Details</th>
                <th className="p-4">Vehicle & Hub Zone</th>
                <th className="p-4">Deliveries & Rating</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Online Duty</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 pr-6 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-semibold ${
              isDark ? 'divide-[rgba(0,255,133,0.04)]' : 'divide-gray-100'
            }`}>
              {filteredPartners.map((partner) => (
                <tr 
                  key={partner.id} 
                  className={`transition-colors group ${
                    isDark ? 'adm-row hover:bg-[rgba(0,255,133,0.025)]' : 'hover:bg-emerald-50/50'
                  }`}
                >
                  
                  {/* Rider Info */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                          alt={partner.name} 
                          className={`w-11 h-11 rounded-2xl object-cover shrink-0 ring-2 shadow-sm ${
                            isDark ? 'ring-[rgba(0,255,133,0.3)]' : 'ring-emerald-200'
                          }`} 
                          loading="lazy"
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                          isDark ? 'border-[#06090A]' : 'border-white'
                        } ${
                          partner.isOnline ? 'bg-emerald-500 ring-2 ring-emerald-400/50 animate-pulse' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-extrabold text-sm flex items-center gap-1.5 ${
                          isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'
                        }`}>
                          <span className="hover:underline cursor-pointer" onClick={() => setViewingPartner(partner)}>
                            {partner.name}
                          </span>
                          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isDark 
                              ? 'bg-[rgba(0,255,133,0.08)] text-[#00FF85] border-[rgba(0,255,133,0.2)]' 
                              : 'bg-emerald-100/80 text-emerald-900 border-emerald-200'
                          }`}>
                            {partner.id}
                          </span>
                        </div>
                        <div className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
                          {partner.email} · {partner.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Vehicle & Hub */}
                  <td className="p-4">
                    <div className={`font-bold ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{partner.vehicleType}</div>
                    <div className={`text-[11px] font-mono font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{partner.vehicleNumber}</div>
                    <div className={`text-[11px] font-bold flex items-center gap-1 mt-0.5 ${isDark ? 'text-[#00FF85]' : 'text-emerald-800'}`}>
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{partner.hubLocation}</span>
                    </div>
                  </td>

                  {/* Deliveries & Rating */}
                  <td className="p-4">
                    <div className={`font-extrabold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{partner.totalDeliveries || 0} Trips</div>
                    <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 border ${
                      isDark 
                        ? 'bg-[rgba(251,184,58,0.1)] text-[#FBB83A] border-[rgba(251,184,58,0.25)]' 
                        : 'bg-amber-50 text-amber-700 border-amber-200/60'
                    }`}>
                      ⭐ {partner.rating || 5.0} Rating
                    </div>
                  </td>

                  {/* Verification */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      partner.approvalStatus === 'Approved' 
                        ? isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border-[rgba(0,255,133,0.3)]' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : partner.approvalStatus === 'Pending'
                        ? isDark ? 'bg-[rgba(251,184,58,0.1)] text-[#FBB83A] border-[rgba(251,184,58,0.3)] animate-pulse' : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                        : isDark ? 'bg-[rgba(255,77,77,0.1)] text-[#FF6B6B] border-[rgba(255,77,77,0.3)]' : 'bg-red-100 text-red-900 border-red-300'
                    }`}>
                      {partner.approvalStatus === 'Approved' && <CheckCircle className="w-3 h-3" />}
                      {partner.approvalStatus === 'Pending' && <Clock className="w-3 h-3" />}
                      <span>{partner.approvalStatus}</span>
                    </span>
                  </td>

                  {/* Online Duty Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleOnline(partner.id, partner.isOnline, partner.name)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                        partner.isOnline 
                          ? isDark 
                            ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border border-[rgba(0,255,133,0.25)] hover:bg-[rgba(0,255,133,0.2)]' 
                            : 'bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs hover:bg-emerald-200' 
                          : isDark 
                            ? 'bg-[rgba(255,255,255,0.05)] text-[#7FA882] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)]' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${partner.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                      <span>{partner.isOnline ? 'On Duty' : 'Off Duty'}</span>
                    </button>
                  </td>

                  {/* Account Status */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleAccountStatus(partner.id, partner.accountStatus, partner.name)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                        partner.accountStatus === 'Active'
                          ? isDark 
                            ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border border-[rgba(0,255,133,0.25)] hover:bg-[rgba(0,255,133,0.2)]' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : isDark 
                            ? 'bg-[rgba(255,77,77,0.1)] text-[#FF6B6B] border border-[rgba(255,77,77,0.25)] hover:bg-[rgba(255,77,77,0.2)]' 
                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{partner.accountStatus}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-1.5">
                    {partner.approvalStatus === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(partner.id, partner.name)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-extrabold hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(partner.id, partner.name)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-[11px] font-extrabold hover:bg-red-600 transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setViewingPartner(partner)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isDark 
                          ? 'text-[#00FF85] bg-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.16)] border border-[rgba(0,255,133,0.2)]' 
                          : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                      title="Inspect Full Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setEditingPartner(partner)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isDark 
                          ? 'text-[#D4EAD9] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)]' 
                          : 'text-farmGreen-800 bg-farmBg hover:bg-emerald-100/80'
                      }`}
                      title="Edit Rider Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}

              {filteredPartners.length === 0 && (
                <tr>
                  <td colSpan="7" className={`p-12 text-center text-xs space-y-3 ${
                    isDark ? 'bg-[rgba(255,255,255,0.01)] text-[#7FA882]' : 'bg-farmBg/30 text-farmMuted'
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border ${
                      isDark ? 'bg-[rgba(0,255,133,0.05)] border-[rgba(0,255,133,0.15)] text-[#00FF85]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      <Truck className="w-6 h-6 opacity-80" />
                    </div>
                    <div className={`font-bold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>No Delivery Boys Match Your Criteria</div>
                    <p className="text-[11px] max-w-sm mx-auto">Try clearing your search query or resetting the filter tabs.</p>
                    {(searchQuery || statusFilter !== 'All') && (
                      <button
                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                          isDark 
                            ? 'bg-[rgba(0,255,133,0.12)] text-[#00FF85] border border-[rgba(0,255,133,0.3)] hover:bg-[rgba(0,255,133,0.2)]' 
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Filters & Search</span>
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Rider Profile Drawer Modal */}
      {viewingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className={`rounded-3xl max-w-lg w-full shadow-2xl border overflow-hidden relative animate-scaleUp ${
            isDark 
              ? 'bg-[#0A120D] border-[rgba(0,255,133,0.15)] text-[#D4EAD9]' 
              : 'bg-white border-emerald-100/80 text-farmGreen-950'
          }`}>
            
            {/* Hero Header Banner */}
            <div className={`p-6 sm:p-7 relative border-b ${
              isDark 
                ? 'bg-gradient-to-r from-[#040805] via-[#0A160F] to-[#081F12] border-[rgba(0,255,133,0.15)] text-white' 
                : 'bg-gradient-to-r from-farmGreen-900 via-emerald-800 to-farmGreen-950 border-emerald-700/50 text-white'
            }`}>
              <button 
                onClick={() => setViewingPartner(null)} 
                className="absolute top-5 right-5 p-2 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={viewingPartner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={viewingPartner.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
                    loading="lazy"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-farmGreen-950 ${
                    viewingPartner.isOnline ? 'bg-emerald-400 animate-ping' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-xl text-white tracking-tight">{viewingPartner.name}</h3>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                      {viewingPartner.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-200/90 mt-1 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{viewingPartner.hubLocation}</span>
                  </div>
                </div>
              </div>

              {/* Quick Communication & Duty Pills */}
              <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <a 
                    href={`tel:${viewingPartner.phone}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Call {viewingPartner.phone}</span>
                  </a>
                </div>

                <button
                  onClick={() => handleToggleOnline(viewingPartner.id, viewingPartner.isOnline, viewingPartner.name)}
                  className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                    viewingPartner.isOnline ? 'bg-emerald-400 text-emerald-950 shadow-sm' : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  {viewingPartner.isOnline ? '🟢 On Duty' : '🔴 Off Duty'}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5">
              
              {/* Vehicle & License Card */}
              <div className={`p-4 rounded-2xl border space-y-2.5 text-xs font-semibold ${
                isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-farmBg border-emerald-100/80'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} />
                    <span className={`font-bold ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Vehicle:</span>
                    <span className={`font-bold ${isDark ? 'text-[#00FF85]' : 'text-emerald-900'}`}>{viewingPartner.vehicleType}</span>
                  </div>
                  <span className={`font-mono text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border shadow-2xs ${
                    isDark 
                      ? 'bg-[rgba(0,255,133,0.08)] text-[#00FF85] border-[rgba(0,255,133,0.2)]' 
                      : 'bg-white text-farmGreen-950 border-gray-200'
                  }`}>
                    {viewingPartner.vehicleNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} />
                  <span className={`font-bold ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Driving License:</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{viewingPartner.licenseNumber}</span>
                </div>
              </div>

              {/* Stats Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isDark 
                    ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.15)]' 
                    : 'bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-emerald-200 shadow-2xs'
                }`}>
                  <div className={`text-[11px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-[#00FF85]' : 'text-emerald-800'
                  }`}>Completed Trips</div>
                  <div className={`font-extrabold text-3xl ${isDark ? 'text-[#D4EAD9]' : 'text-emerald-950'}`}>{viewingPartner.totalDeliveries || 0}</div>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isDark 
                    ? 'bg-[rgba(251,184,58,0.04)] border-[rgba(251,184,58,0.15)]' 
                    : 'bg-gradient-to-br from-amber-50 to-amber-100/40 border-amber-200 shadow-2xs'
                }`}>
                  <div className={`text-[11px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-[#FBB83A]' : 'text-amber-800'
                  }`}>Rating Score</div>
                  <div className={`font-extrabold text-3xl ${isDark ? 'text-[#FBB83A]' : 'text-amber-950'}`}>⭐ {viewingPartner.rating || 5.0}</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  onClick={() => setViewingPartner(null)}
                  className={`w-full py-3 font-extrabold text-xs rounded-2xl transition-all active:scale-95 cursor-pointer ${
                    isDark 
                      ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                      : 'bg-gradient-to-r from-farmGreen-800 to-emerald-900 hover:from-farmGreen-700 hover:to-emerald-800 text-white shadow-lg'
                  }`}
                >
                  Close Profile
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Add New Delivery Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleAddPartner} className={`rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border overflow-hidden relative animate-scaleUp ${
            isDark 
              ? 'bg-[#0A120D] border-[rgba(0,255,133,0.15)] text-[#D4EAD9]' 
              : 'bg-white border-emerald-100/80 text-farmGreen-950'
          }`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center pb-3 border-b ${
              isDark ? 'border-[rgba(0,255,133,0.08)]' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-extrabold text-lg ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Add New Delivery Partner</h3>
                  <p className={`text-xs ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>Register a new rider for local farm logistics & dispatch</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'text-[#7FA882] hover:text-[#D4EAD9] hover:bg-[rgba(255,255,255,0.05)]' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Full Name *</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Ramesh Patil"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Phone Number *</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newPartner.phone}
                  onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none font-mono transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Vehicle Type</label>
                <select
                  value={newPartner.vehicleType}
                  onChange={(e) => setNewPartner({ ...newPartner, vehicleType: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9]' 
                      : 'bg-farmBg border border-gray-200 text-farmGreen-950'
                  }`}
                >
                  <option value="EV Scooter (Ather 450X)" className={isDark ? 'bg-[#0A120D]' : ''}>EV Scooter (Ather 450X)</option>
                  <option value="Motorcycle (Hero Splendor)" className={isDark ? 'bg-[#0A120D]' : ''}>Motorcycle (Hero Splendor)</option>
                  <option value="Cold-Chain Mini Van" className={isDark ? 'bg-[#0A120D]' : ''}>Cold-Chain Mini Van</option>
                  <option value="Delivery Bicycle" className={isDark ? 'bg-[#0A120D]' : ''}>Delivery Bicycle</option>
                </select>
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Vehicle Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. MH-12-AB-1234"
                  value={newPartner.vehicleNumber}
                  onChange={(e) => setNewPartner({ ...newPartner, vehicleNumber: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none font-mono uppercase transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Assigned Hub Location</label>
                <input
                  type="text"
                  placeholder="e.g. Chittoor District AP Hub"
                  value={newPartner.hubLocation}
                  onChange={(e) => setNewPartner({ ...newPartner, hubLocation: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={`px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  isDark 
                    ? 'border-[rgba(0,255,133,0.15)] text-[#7FA882] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#D4EAD9]' 
                    : 'border-gray-200 text-farmMuted hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-2xl text-xs font-bold font-display flex items-center gap-2 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                    : 'bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Partner</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Partner Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleSaveEdit} className={`rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border overflow-hidden relative animate-scaleUp ${
            isDark 
              ? 'bg-[#0A120D] border-[rgba(0,255,133,0.15)] text-[#D4EAD9]' 
              : 'bg-white border-emerald-100/80 text-farmGreen-950'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${
              isDark ? 'border-[rgba(0,255,133,0.08)]' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-extrabold text-lg ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Edit Delivery Partner</h3>
                  <p className={`text-xs ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>Update rider details & assigned logistics hub</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingPartner(null)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'text-[#7FA882] hover:text-[#D4EAD9] hover:bg-[rgba(255,255,255,0.05)]' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Full Name</label>
                <input
                  type="text"
                  autoFocus
                  value={editingPartner.name}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Phone Number</label>
                <input
                  type="text"
                  value={editingPartner.phone}
                  onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none font-mono transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Vehicle Type</label>
                <input
                  type="text"
                  value={editingPartner.vehicleType}
                  onChange={(e) => setEditingPartner({ ...editingPartner, vehicleType: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                />
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Vehicle Registration Number</label>
                <input
                  type="text"
                  value={editingPartner.vehicleNumber}
                  onChange={(e) => setEditingPartner({ ...editingPartner, vehicleNumber: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none font-mono uppercase transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Hub Location</label>
                <input
                  type="text"
                  value={editingPartner.hubLocation}
                  onChange={(e) => setEditingPartner({ ...editingPartner, hubLocation: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingPartner(null)}
                className={`px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  isDark 
                    ? 'border-[rgba(0,255,133,0.15)] text-[#7FA882] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#D4EAD9]' 
                    : 'border-gray-200 text-farmMuted hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-2xl text-xs font-bold font-display flex items-center gap-2 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                    : 'bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
