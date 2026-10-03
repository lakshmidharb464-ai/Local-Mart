import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Edit, 
  UserCheck, 
  Power, 
  ShieldAlert, 
  X, 
  User, 
  MapPin, 
  Sprout, 
  Phone, 
  Save, 
  Edit3, 
  ShieldCheck, 
  Plus, 
  UserPlus, 
  Mail,
  Tractor,
  Award,
  Clock,
  TrendingUp,
  Eye,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const FarmerManagement = ({ farmers, setFarmers, isDark = false }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [viewingFarmer, setViewingFarmer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setEditingFarmer(null);
        setViewingFarmer(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [newFarmer, setNewFarmer] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Pune Rural Hub',
    experience: '5 Years Organic Farming',
    specialty: 'Organic Vegetables & Fruits',
    approvalStatus: 'Approved',
    accountStatus: 'Active',
    badge: 'Certified Producer'
  });

  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const matchesSearch = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.phone.includes(searchQuery);

      if (statusFilter === 'All') return matchesSearch;
      if (statusFilter === 'Approved') return matchesSearch && f.approvalStatus === 'Approved';
      if (statusFilter === 'Pending') return matchesSearch && f.approvalStatus === 'Pending';
      if (statusFilter === 'Inactive') return matchesSearch && f.accountStatus === 'Inactive';
      return matchesSearch;
    });
  }, [farmers, searchQuery, statusFilter]);

  const { totalFarmers, approvedFarmers, pendingFarmers, totalEarningsSum } = useMemo(() => {
    return {
      totalFarmers: farmers.length,
      approvedFarmers: farmers.filter(f => f.approvalStatus === 'Approved').length,
      pendingFarmers: farmers.filter(f => f.approvalStatus === 'Pending').length,
      totalEarningsSum: farmers.reduce((sum, f) => sum + (f.totalEarnings || 0), 0),
    };
  }, [farmers]);

  const handleApprove = (id, name) => {
    setFarmers(farmers.map(f => f.id === id ? { ...f, approvalStatus: 'Approved' } : f));
    showToast('Farmer Approved', `${name} account has been approved.`);
  };

  const handleReject = (id, name) => {
    setFarmers(farmers.map(f => f.id === id ? { ...f, approvalStatus: 'Rejected' } : f));
    showToast('Farmer Rejected', `${name} application set to rejected.`, 'error');
  };

  const handleToggleActive = (id, currentStatus, name) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setFarmers(farmers.map(f => f.id === id ? { ...f, accountStatus: newStatus } : f));
    showToast('Status Updated', `${name} account is now ${newStatus}.`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingFarmer) return;

    setFarmers(farmers.map(f => f.id === editingFarmer.id ? editingFarmer : f));
    setEditingFarmer(null);
    showToast('Farmer Details Updated', 'Changes saved successfully.');
  };

  const handleAddFarmer = (e) => {
    e.preventDefault();
    if (!newFarmer.name || !newFarmer.phone) {
      showToast('Validation Error', 'Please enter farmer name and phone number.', 'error');
      return;
    }

    const created = {
      id: `f${farmers.length + 1}`,
      name: newFarmer.name,
      email: newFarmer.email || `${newFarmer.name.toLowerCase().replace(/\s+/g, '.')}@localfarm.in`,
      phone: newFarmer.phone,
      location: newFarmer.location,
      experience: newFarmer.experience,
      specialty: newFarmer.specialty,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      productsCount: 0,
      totalEarnings: 0,
      approvalStatus: newFarmer.approvalStatus,
      accountStatus: newFarmer.accountStatus,
      badge: newFarmer.badge
    };

    setFarmers([created, ...farmers]);
    setShowAddModal(false);
    setNewFarmer({
      name: '',
      email: '',
      phone: '',
      location: 'Pune Rural Hub',
      experience: '5 Years Organic Farming',
      specialty: 'Organic Vegetables & Fruits',
      approvalStatus: 'Approved',
      accountStatus: 'Active',
      badge: 'Certified Producer'
    });
    showToast('Farmer Profile Created', `${created.name} onboarded successfully!`);
  };

  const cardBase   = isDark ? 'adm-glass rounded-3xl p-6 sm:p-7' : 'bg-white rounded-3xl border border-emerald-100/80 shadow-farm-sm p-6 sm:p-7';
  const cardTitle  = isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950';
  const cardSub    = isDark ? 'text-[#7FA882]' : 'text-farmMuted';
  const divider    = isDark ? 'border-[rgba(0,255,133,0.07)]' : 'border-gray-100';

  return (
    <div className="space-y-6 font-display pb-8">
      {/* Header & Search */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBase}`}>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className={`font-extrabold text-2xl tracking-tight ${cardTitle}`}>Agricultural Producer Governance</h2>
            <span className={`text-xs font-black px-3 py-1 rounded-full border font-mono ${isDark ? 'adm-badge-neon' : 'bg-emerald-100 text-emerald-900 border-emerald-200'}`}>
              {totalFarmers} Producers
            </span>
          </div>
          <p className={`text-xs mt-1 ${cardSub}`}>Approve, verify organic credentials, and govern registered local farmers</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} />
            <input
              type="text"
              placeholder="Search farmer name, region, produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-semibold transition-all ${isDark ? 'adm-input' : 'bg-farmBg border border-emerald-200/80 focus:outline-none focus:border-farmGreen-600 focus:bg-white'}`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 ${isDark ? 'text-[#7FA882] hover:text-[#D4EAD9]' : 'text-gray-400 hover:text-gray-600'}`}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95 ${isDark ? 'adm-btn-gold' : 'bg-gradient-to-r from-farmGreen-700 via-emerald-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-emerald-600 text-white hover:shadow-xl'}`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Farmer</span>
          </button>
        </div>
      </div>

      {/* Interactive Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { filter: 'All',      label: 'Total Farmers',      value: totalFarmers,         sub: 'Registered Producer Network',  icon: Tractor,    color: 'neon',   accent: '#00FF85' },
          { filter: 'Approved', label: 'Verified Farms',     value: approvedFarmers,       sub: 'Cleared for Marketplace',     icon: ShieldCheck, color: 'blue',  accent: '#5CD9FF' },
          { filter: 'Pending',  label: 'Pending Audits',     value: pendingFarmers,        sub: 'KYC applications pending',    icon: Clock,       color: 'amber', accent: '#FBB83A' },
          { filter: null,       label: 'Sales Earnings',     value: `₹${totalEarningsSum.toLocaleString()}`, sub: 'Direct Farmer Payouts', icon: TrendingUp, color: 'gold', accent: '#D4A745' },
        ].map((m, i) => {
          const isActive = m.filter && statusFilter === m.filter;
          const colorMap = {
            neon:  { bg: isDark ? 'bg-[rgba(0,255,133,0.08)]'  : 'bg-emerald-100', text: isDark ? 'text-[#00FF85]'  : 'text-emerald-800', border: isDark ? 'border-[rgba(0,255,133,0.3)]'  : 'border-emerald-500' },
            blue:  { bg: isDark ? 'bg-[rgba(0,191,255,0.08)]'  : 'bg-blue-100',    text: isDark ? 'text-[#5CD9FF]'  : 'text-blue-800',    border: isDark ? 'border-[rgba(0,191,255,0.3)]'  : 'border-blue-500'    },
            amber: { bg: isDark ? 'bg-[rgba(251,184,58,0.08)]' : 'bg-amber-100',   text: isDark ? 'text-[#FBB83A]'  : 'text-amber-800',   border: isDark ? 'border-[rgba(251,184,58,0.3)]' : 'border-amber-500'   },
            gold:  { bg: isDark ? 'bg-[rgba(212,167,69,0.08)]' : 'bg-purple-100',  text: isDark ? 'text-[#D4A745]'  : 'text-purple-800',  border: isDark ? 'border-[rgba(212,167,69,0.3)]' : 'border-purple-500'  },
          };
          const c = colorMap[m.color];
          return (
            <div
              key={i}
              onClick={() => m.filter && setStatusFilter(m.filter)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 adm-card-${m.color === 'neon' ? 'neon' : m.color === 'blue' ? 'blue' : m.color === 'amber' ? 'amber' : 'gold'}-top ${
                m.filter ? 'cursor-pointer' : ''
              } ${
                isDark
                  ? `adm-glass adm-glass-hover ${isActive ? `${c.border} adm-neon-glow-sm` : ''}`
                  : `bg-white border-emerald-100/80 shadow-2xs hover:shadow-md ${isActive ? `${c.border} shadow-md ring-2` : 'hover:border-opacity-60'}`
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{m.label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${c.bg} ${c.text}`}>
                  <m.icon className="w-5 h-5" />
                </div>
              </div>
              <div className={`font-extrabold text-3xl mt-2 font-mono tabular-nums ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{m.value}</div>
              <div className={`text-[11px] font-bold mt-1 ${c.text}`}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {[
          { id: 'All',      label: `All (${totalFarmers})` },
          { id: 'Approved', label: `🛡️ Approved (${approvedFarmers})` },
          { id: 'Pending',  label: `⏳ Pending (${pendingFarmers})` },
          { id: 'Inactive', label: '⛔ Inactive' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer min-w-[80px] text-center ${
              statusFilter === tab.id
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
        ))}
      </div>

      {/* Farmers Table */}
      <div className={`rounded-3xl overflow-hidden ${isDark ? 'adm-glass border-[rgba(0,255,133,0.08)]' : 'bg-white border border-emerald-100/80 shadow-farm-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b font-black uppercase tracking-wider ${isDark ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.08)] text-[#7FA882]' : 'bg-farmBg/80 border-emerald-100 text-farmMuted'}`}>
              <tr>
                <th className="p-4 pl-6">Farmer Details</th>
                <th className="p-4">Location & Specialty</th>
                <th className="p-4">Approval Status</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Total Farm Sales</th>
                <th className="p-4 pr-6 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className={`font-semibold divide-y ${isDark ? 'divide-[rgba(0,255,133,0.04)]' : 'divide-gray-100'}`}>
              {filteredFarmers.map((farmer) => (
                <tr key={farmer.id} className={`transition-colors group adm-row ${isDark ? 'hover:bg-[rgba(0,255,133,0.025)]' : 'hover:bg-emerald-50/50'}`}>
                  
                  {/* Farmer Info */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={farmer.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'} 
                        alt={farmer.name} 
                        className={`w-11 h-11 rounded-2xl object-cover shrink-0 ring-2 shadow-sm ${isDark ? 'ring-[rgba(0,255,133,0.25)]' : 'ring-emerald-200'}`}
                        loading="lazy"
                      />
                      <div>
                        <div className={`font-extrabold text-sm flex items-center gap-2 ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                          <span className="hover:underline cursor-pointer" onClick={() => setViewingFarmer(farmer)}>{farmer.name}</span>
                          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border font-bold ${isDark ? 'adm-badge-neon' : 'text-emerald-900 bg-emerald-100/80 border-emerald-200'}`}>
                            {farmer.id}
                          </span>
                        </div>
                        <div className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{farmer.email} · {farmer.phone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="p-4">
                    <div className={`font-extrabold flex items-center gap-1 ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                      <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#00FF85]' : 'text-emerald-600'}`} />
                      <span>{farmer.location}</span>
                    </div>
                    <div className={`text-[11px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{farmer.specialty}</div>
                  </td>

                  {/* Approval Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                      farmer.approvalStatus === 'Approved'
                        ? isDark ? 'adm-badge-neon' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : farmer.approvalStatus === 'Pending'
                        ? isDark ? 'adm-badge-amber animate-pulse' : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : isDark ? 'adm-badge-red' : 'bg-red-100 text-red-900 border border-red-300'
                    }`}>
                      {farmer.approvalStatus}
                    </span>
                  </td>

                  {/* Account Status */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(farmer.id, farmer.accountStatus, farmer.name)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                        farmer.accountStatus === 'Active'
                          ? isDark ? 'adm-badge-neon hover:bg-[rgba(0,255,133,0.2)]' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : isDark ? 'adm-badge-red hover:bg-[rgba(255,71,87,0.2)]'   : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{farmer.accountStatus}</span>
                    </button>
                  </td>

                  {/* Total Sales */}
                  <td className={`p-4 font-extrabold text-sm ${isDark ? 'adm-gold-text' : 'text-emerald-800'}`}>
                    ₹{farmer.totalEarnings?.toLocaleString() || 0}
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-1.5">
                    {farmer.approvalStatus === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(farmer.id, farmer.name)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs active:scale-95 ${isDark ? 'adm-badge-neon hover:bg-[rgba(0,255,133,0.2)]' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(farmer.id, farmer.name)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs active:scale-95 ${isDark ? 'adm-badge-red hover:bg-[rgba(255,71,87,0.2)]' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setViewingFarmer(farmer)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-[#00FF85] bg-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.14)]' : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'}`}
                      title="Inspect Farmer Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingFarmer(farmer)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-[#7FA882] bg-[rgba(0,255,133,0.04)] hover:bg-[rgba(0,255,133,0.08)]' : 'text-farmGreen-800 bg-farmBg hover:bg-emerald-100/80'}`}
                      title="Edit Farmer Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredFarmers.length === 0 && (
                <tr>
                  <td colSpan="6" className={`p-12 text-center text-xs space-y-3 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted bg-farmBg/30'}`}>
                    <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border ${
                      isDark ? 'bg-[rgba(0,255,133,0.05)] border-[rgba(0,255,133,0.15)] text-[#00FF85]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      <Tractor className="w-6 h-6 opacity-80" />
                    </div>
                    <div className={`font-bold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>No Farmer Accounts Matching Criteria</div>
                    <p className="text-[11px] max-w-sm mx-auto">Try adjusting your search criteria or switching status tabs.</p>
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

      {/* Inspect Farmer Modal */}
      {viewingFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className={`rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative ${isDark ? 'adm-glass-2 border-[rgba(0,255,133,0.15)]' : 'bg-white border border-emerald-100/80'}`}>
            
            {/* Hero Header Banner */}
            <div className={`p-6 sm:p-7 relative border-b ${isDark ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.1)]' : 'bg-[#0F2818] bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] border-emerald-700/50'} text-white`}>
              <button 
                onClick={() => setViewingFarmer(null)}
                className="absolute top-5 right-5 p-2 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <img 
                  src={viewingFarmer.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                  alt={viewingFarmer.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-xl text-white tracking-tight">{viewingFarmer.name}</h3>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                      {viewingFarmer.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-200/90 mt-1 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{viewingFarmer.location}</span>
                  </div>
                </div>
              </div>

              {/* Quick Communication & Approval Pills */}
              <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <a 
                    href={`tel:${viewingFarmer.phone}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Call {viewingFarmer.phone}</span>
                  </a>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  viewingFarmer.approvalStatus === 'Approved' ? 'bg-emerald-400 text-emerald-950' :
                  viewingFarmer.approvalStatus === 'Pending' ? 'bg-amber-400 text-amber-950 animate-pulse' :
                  'bg-red-500 text-white'
                }`}>
                  {viewingFarmer.approvalStatus}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5">
              
              {/* Specialty & Details */}
              <div className="p-4 bg-farmBg rounded-2xl border border-emerald-100/80 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-farmGreen-950">Specialty Produce:</span>
                  <span className="font-bold text-emerald-900">{viewingFarmer.specialty}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-farmGreen-950">Farming Experience:</span>
                  <span className="text-farmMuted font-bold">{viewingFarmer.experience}</span>
                </div>
              </div>

              {/* Stats Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/40 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Catalog Products</div>
                  <div className="font-extrabold text-3xl text-emerald-950">{viewingFarmer.productsCount || 0} Listed</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/40 rounded-2xl border border-purple-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-extrabold text-purple-800 uppercase tracking-wider">Total Farm Payout</div>
                  <div className="font-extrabold text-3xl text-purple-950">₹{viewingFarmer.totalEarnings?.toLocaleString() || 0}</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  onClick={() => setViewingFarmer(null)}
                  className="w-full py-3 bg-gradient-to-r from-farmGreen-800 to-emerald-900 hover:from-farmGreen-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Edit Farmer Modal */}
      {editingFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <form onSubmit={handleSaveEdit} className={`rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl overflow-hidden relative ${isDark ? 'adm-glass-2 border-[rgba(0,255,133,0.15)]' : 'bg-white border border-emerald-100/80'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-farmGreen-950">Edit Farmer Profile</h3>
                  <p className="text-xs text-farmMuted">Update producer details & region</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingFarmer(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              {[{ label: 'Farmer Name', field: 'name', type: 'text', required: true }, { label: 'Location / Hub', field: 'location', type: 'text', required: true }, { label: 'Specialty Produce', field: 'specialty', type: 'text', required: true }, { label: 'Phone Number', field: 'phone', type: 'text', mono: true }].map(f => (
                <div key={f.field}>
                  <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{f.label}</label>
                  <input
                    type={f.type}
                    value={editingFarmer[f.field]}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, [f.field]: e.target.value })}
                    className={`w-full px-4 py-2 rounded-2xl ${f.mono ? 'font-mono' : ''} ${isDark ? 'adm-input' : 'bg-farmBg border border-gray-200 outline-none'}`}
                    required={f.required}
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button type="button" onClick={() => setEditingFarmer(null)} className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${isDark ? 'border-[rgba(0,255,133,0.12)] text-[#7FA882] hover:bg-[rgba(0,255,133,0.06)]' : 'border-gray-200 text-farmMuted hover:bg-gray-50'}`}>Cancel</button>
              <button type="submit" className="adm-btn-gold px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer">
                <Save className="w-4 h-4" /><span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <form onSubmit={handleAddFarmer} className={`rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl overflow-hidden relative ${isDark ? 'adm-glass-2 border-[rgba(0,255,133,0.15)]' : 'bg-white border border-emerald-100/80'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-farmGreen-950">Add New Agricultural Producer</h3>
                  <p className="text-xs text-farmMuted">Onboard a local farmer with specialty & region</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <div className="sm:col-span-2">
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Farmer Full Name *</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Ramesh Patel"
                  value={newFarmer.name}
                  onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+91 98220 11990"
                  value={newFarmer.phone}
                  onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="ramesh@localfarm.in"
                  value={newFarmer.email}
                  onChange={(e) => setNewFarmer({ ...newFarmer, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Location / Hub Region</label>
                <input
                  type="text"
                  placeholder="e.g. Nashik Valley Hub"
                  value={newFarmer.location}
                  onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Experience & Background</label>
                <input
                  type="text"
                  placeholder="e.g. 10 Years Hydroponic Farming"
                  value={newFarmer.experience}
                  onChange={(e) => setNewFarmer({ ...newFarmer, experience: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Farm Specialty Produce</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Tomatoes, Leafy Greens & Exotic Herbs"
                  value={newFarmer.specialty}
                  onChange={(e) => setNewFarmer({ ...newFarmer, specialty: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button type="button" onClick={() => setShowAddModal(false)} className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${isDark ? 'border-[rgba(0,255,133,0.12)] text-[#7FA882] hover:bg-[rgba(0,255,133,0.06)]' : 'border-gray-200 text-farmMuted hover:bg-gray-50'}`}>Cancel</button>
              <button type="submit" className="adm-btn-gold px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /><span>Onboard Farmer</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
