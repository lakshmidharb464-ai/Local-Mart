import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export const FarmerManagement = ({ farmers, setFarmers }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [viewingFarmer, setViewingFarmer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const filteredFarmers = farmers.filter(f => {
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

  const totalFarmers = farmers.length;
  const approvedFarmers = farmers.filter(f => f.approvalStatus === 'Approved').length;
  const pendingFarmers = farmers.filter(f => f.approvalStatus === 'Pending').length;
  const totalEarningsSum = farmers.reduce((sum, f) => sum + (f.totalEarnings || 0), 0);

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

  return (
    <div className="space-y-6 animate-fadeIn font-display">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-extrabold text-2xl text-farmGreen-950 tracking-tight">Agricultural Producer Governance</h2>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 shadow-2xs font-mono">
              {totalFarmers} Producers
            </span>
          </div>
          <p className="text-xs text-farmMuted mt-1">Approve, verify organic credentials, and govern registered local farmers</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700" />
            <input
              type="text"
              placeholder="Search farmer name, region, produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-farmBg border border-emerald-200/80 rounded-2xl text-xs font-semibold focus:outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-farmGreen-700 via-emerald-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-emerald-600 text-white rounded-2xl text-xs font-extrabold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Farmer</span>
          </button>
        </div>
      </div>

      {/* Interactive Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter('All')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'All'
              ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Total Farmers</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
              <Tractor className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-farmGreen-950 mt-2">{totalFarmers}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Registered Producer Network →</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Approved')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Approved'
              ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Verified Farms</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-blue-950 mt-2">{approvedFarmers}</div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">Cleared for Marketplace Sales</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Pending'
              ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-amber-500 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Pending Audits</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-amber-950 mt-2">{pendingFarmers}</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">KYC applications awaiting review ⏳</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Total Sales Earnings</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-purple-950 mt-2">₹{totalEarningsSum.toLocaleString()}</div>
          <div className="text-[11px] text-purple-700 font-bold mt-1">Direct Farmer Payout Revenue</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pt-1">
        {[
          { id: 'All', label: `All (${totalFarmers})` },
          { id: 'Approved', label: `🛡️ Approved (${approvedFarmers})` },
          { id: 'Pending', label: `⏳ Pending (${pendingFarmers})` },
          { id: 'Inactive', label: `⛔ Inactive` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer min-w-[80px] text-center ${
              statusFilter === tab.id
                ? 'bg-[#0F2818] text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40 scale-[1.02]'
                : 'bg-white text-[#0A2214] font-black border-2 border-emerald-200/90 hover:bg-emerald-100/70 hover:text-emerald-950 shadow-2xs'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-3xl border border-emerald-100/80 overflow-hidden shadow-farm-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-farmBg/80 border-b border-emerald-100 text-farmMuted font-black uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Farmer Details</th>
                <th className="p-4">Location & Specialty</th>
                <th className="p-4">Approval Status</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Total Farm Sales</th>
                <th className="p-4 pr-6 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold">
              {filteredFarmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-emerald-50/50 transition-colors group">
                  
                  {/* Farmer Info */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={farmer.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'} 
                        alt={farmer.name} 
                        className="w-11 h-11 rounded-2xl object-cover shrink-0 ring-2 ring-emerald-200 shadow-sm" 
                      />
                      <div>
                        <div className="font-extrabold text-sm text-farmGreen-950 flex items-center gap-2">
                          <span className="hover:underline cursor-pointer" onClick={() => setViewingFarmer(farmer)}>{farmer.name}</span>
                          <span className="font-mono text-[10px] text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                            {farmer.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-farmMuted font-medium mt-0.5">{farmer.email} · {farmer.phone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="p-4">
                    <div className="font-extrabold text-farmGreen-950 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{farmer.location}</span>
                    </div>
                    <div className="text-[11px] text-farmMuted font-bold mt-0.5">{farmer.specialty}</div>
                  </td>

                  {/* Approval Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                      farmer.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      farmer.approvalStatus === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' :
                      'bg-red-100 text-red-900 border border-red-300'
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
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{farmer.accountStatus}</span>
                    </button>
                  </td>

                  {/* Total Sales */}
                  <td className="p-4 font-extrabold text-emerald-800 text-sm">
                    ₹{farmer.totalEarnings?.toLocaleString() || 0}
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-1.5">
                    {farmer.approvalStatus === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(farmer.id, farmer.name)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-extrabold hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(farmer.id, farmer.name)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-[11px] font-extrabold hover:bg-red-600 transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setViewingFarmer(farmer)}
                      className="p-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer"
                      title="Inspect Farmer Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setEditingFarmer(farmer)}
                      className="p-2 text-farmGreen-800 bg-farmBg hover:bg-emerald-100/80 rounded-xl transition-all cursor-pointer"
                      title="Edit Farmer Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}

              {filteredFarmers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-xs text-farmMuted bg-farmBg/30 space-y-2">
                    <Tractor className="w-8 h-8 text-gray-400 mx-auto" />
                    <div className="font-bold text-farmGreen-950 text-sm">No Farmer Accounts Matching Criteria</div>
                    <p className="text-[11px]">Try adjusting your search criteria or switching status tabs.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Farmer Modal */}
      {viewingFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
            
            {/* Hero Header Banner */}
            <div className="bg-[#0F2818] bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] text-white p-6 sm:p-7 relative border-b border-emerald-700/50">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
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
              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Farmer Name</label>
                <input
                  type="text"
                  value={editingFarmer.name}
                  onChange={(e) => setEditingFarmer({ ...editingFarmer, name: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Location / Hub</label>
                <input
                  type="text"
                  value={editingFarmer.location}
                  onChange={(e) => setEditingFarmer({ ...editingFarmer, location: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Specialty Produce</label>
                <input
                  type="text"
                  value={editingFarmer.specialty}
                  onChange={(e) => setEditingFarmer({ ...editingFarmer, specialty: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={editingFarmer.phone}
                  onChange={(e) => setEditingFarmer({ ...editingFarmer, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingFarmer(null)}
                className="px-5 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-farmMuted hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 text-white text-xs font-bold font-display flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleAddFarmer} className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
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
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-farmMuted hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 text-white text-xs font-bold font-display flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Farmer</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
