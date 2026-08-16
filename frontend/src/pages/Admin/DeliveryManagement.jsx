import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Truck, 
  Power, 
  Plus, 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Edit3, 
  Save, 
  CheckCircle, 
  XCircle,
  Clock,
  Award,
  Navigation,
  FileText,
  Eye,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Smartphone
} from 'lucide-react';

export const DeliveryManagement = ({ deliveryPartners, setDeliveryPartners }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingPartner, setEditingPartner] = useState(null);
  const [viewingPartner, setViewingPartner] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Partner Form State
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: 'EV Scooter (Ather 450X)',
    vehicleNumber: '',
    licenseNumber: '',
    hubLocation: 'Pune West Metro Hub',
    approvalStatus: 'Approved',
    accountStatus: 'Active',
    isOnline: true
  });

  const filteredPartners = deliveryPartners.filter(partner => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.hubLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.phone.includes(searchQuery) ||
      partner.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Approved') return matchesSearch && partner.approvalStatus === 'Approved';
    if (statusFilter === 'Pending') return matchesSearch && partner.approvalStatus === 'Pending';
    if (statusFilter === 'Online') return matchesSearch && partner.isOnline;
    if (statusFilter === 'Inactive') return matchesSearch && partner.accountStatus === 'Inactive';
    return matchesSearch;
  });

  const totalDrivers = deliveryPartners.length;
  const onlineDrivers = deliveryPartners.filter(p => p.isOnline).length;
  const pendingApprovals = deliveryPartners.filter(p => p.approvalStatus === 'Pending').length;
  const approvedCount = deliveryPartners.filter(p => p.approvalStatus === 'Approved').length;

  const handleToggleAccountStatus = (id, currentStatus, name) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, accountStatus: newStatus } : p));
    showToast('Delivery Partner Status Updated', `${name} account is now ${newStatus}.`);
  };

  const handleToggleOnline = (id, currentOnline, name) => {
    setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, isOnline: !currentOnline } : p));
    showToast('Online Status Updated', `${name} is now ${!currentOnline ? 'On Duty 🟢' : 'Off Duty 🔴'}.`);
  };

  const handleApprove = (id, name) => {
    setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, approvalStatus: 'Approved' } : p));
    showToast('Driver Verified & Approved', `${name} is now cleared for order dispatches.`);
  };

  const handleReject = (id, name) => {
    setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, approvalStatus: 'Rejected' } : p));
    showToast('Driver Application Rejected', `${name} application has been set to rejected.`, 'error');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingPartner) return;
    setDeliveryPartners(deliveryPartners.map(p => p.id === editingPartner.id ? editingPartner : p));
    setEditingPartner(null);
    showToast('Driver Details Updated', 'Delivery partner profile updated successfully.');
  };

  const handleAddPartner = (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone) {
      showToast('Validation Error', 'Please fill in all required driver details.', 'error');
      return;
    }

    const created = {
      id: `DP-${100 + deliveryPartners.length + 1}`,
      name: newPartner.name,
      email: newPartner.email || `${newPartner.name.toLowerCase().replace(/\s+/g, '.')}@localfarm.in`,
      phone: newPartner.phone,
      vehicleType: newPartner.vehicleType,
      vehicleNumber: newPartner.vehicleNumber || 'MH 12 TEMP',
      licenseNumber: newPartner.licenseNumber || 'DL-MH12-2026-TEMP',
      hubLocation: newPartner.hubLocation,
      totalDeliveries: 0,
      rating: 5.0,
      approvalStatus: newPartner.approvalStatus,
      accountStatus: newPartner.accountStatus,
      isOnline: newPartner.isOnline,
      joinedDate: 'Just Now',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`
    };

    setDeliveryPartners([created, ...deliveryPartners]);
    setShowAddModal(false);
    setNewPartner({
      name: '',
      email: '',
      phone: '',
      vehicleType: 'EV Scooter (Ather 450X)',
      vehicleNumber: '',
      licenseNumber: '',
      hubLocation: 'Pune West Metro Hub',
      approvalStatus: 'Approved',
      accountStatus: 'Active',
      isOnline: true
    });
    showToast('Delivery Partner Onboarded', `New rider ${created.name} (${created.id}) registered successfully!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-display">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-extrabold text-2xl text-farmGreen-950 tracking-tight">Delivery Boy & Fleet Management</h2>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 shadow-2xs font-mono">
              {totalDrivers} Active Riders
            </span>
          </div>
          <p className="text-xs text-farmMuted mt-1">Manage delivery personnel, fleet dispatch, onboarding & status verification</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700" />
            <input
              type="text"
              placeholder="Search rider name, phone, hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-farmBg border border-emerald-200/80 rounded-2xl text-xs font-semibold focus:outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-farmGreen-700 via-emerald-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-emerald-600 text-white rounded-2xl text-xs font-extrabold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
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
              ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Total Fleet</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-farmGreen-950 mt-2">{totalDrivers}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Click to view all riders →</div>
        </div>

        {/* Card 2: Online Now */}
        <div 
          onClick={() => setStatusFilter('Online')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Online'
              ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Online Now</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-2xs">
              <Navigation className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-blue-950 mt-2">{onlineDrivers}</div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">Active on delivery duty 🟢</div>
        </div>

        {/* Card 3: Pending Audits */}
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
          <div className="font-extrabold text-3xl text-amber-950 mt-2">{pendingApprovals}</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">Riders awaiting verification ⏳</div>
        </div>

        {/* Card 4: Verified Fleet */}
        <div 
          onClick={() => setStatusFilter('Approved')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Approved'
              ? 'bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border-purple-500 shadow-md ring-2 ring-purple-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Verified Fleet</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-purple-950 mt-2">{approvedCount}</div>
          <div className="text-[11px] text-purple-700 font-bold mt-1">4.9 ⭐ Avg Fleet Rating</div>
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

        <div className="text-xs font-bold text-farmMuted">
          Showing <span className="text-farmGreen-900 font-extrabold">{filteredPartners.length}</span> of {totalDrivers} riders
        </div>
      </div>

      {/* Delivery Partners Table */}
      <div className="bg-white rounded-3xl border border-emerald-100/80 overflow-hidden shadow-farm-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-farmBg/80 border-b border-emerald-100 text-farmMuted font-black uppercase tracking-wider">
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
            <tbody className="divide-y divide-gray-100 font-semibold">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-emerald-50/50 transition-colors group">
                  
                  {/* Rider Info */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                          alt={partner.name} 
                          className="w-11 h-11 rounded-2xl object-cover shrink-0 ring-2 ring-emerald-200 shadow-sm" 
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          partner.isOnline ? 'bg-emerald-500 ring-2 ring-emerald-400/50 animate-pulse' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-farmGreen-950 flex items-center gap-1.5">
                          <span className="hover:underline cursor-pointer" onClick={() => setViewingPartner(partner)}>
                            {partner.name}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                            {partner.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-farmMuted font-medium mt-0.5">{partner.email} · {partner.phone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Vehicle & Hub */}
                  <td className="p-4">
                    <div className="font-bold text-farmGreen-950">{partner.vehicleType}</div>
                    <div className="text-[11px] text-farmMuted font-mono font-bold">{partner.vehicleNumber}</div>
                    <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{partner.hubLocation}</span>
                    </div>
                  </td>

                  {/* Deliveries & Rating */}
                  <td className="p-4">
                    <div className="font-extrabold text-farmGreen-950 text-sm">{partner.totalDeliveries || 0} Trips</div>
                    <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-amber-200/60">
                      ⭐ {partner.rating || 5.0} Rating
                    </div>
                  </td>

                  {/* Verification */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                      partner.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      partner.approvalStatus === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' :
                      'bg-red-100 text-red-900 border border-red-300'
                    }`}>
                      {partner.approvalStatus === 'Approved' && <CheckCircle className="w-3 h-3 text-emerald-700" />}
                      {partner.approvalStatus === 'Pending' && <Clock className="w-3 h-3 text-amber-700" />}
                      <span>{partner.approvalStatus}</span>
                    </span>
                  </td>

                  {/* Online Duty Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleOnline(partner.id, partner.isOnline, partner.name)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                        partner.isOnline 
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs hover:bg-emerald-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${partner.isOnline ? 'bg-emerald-600 animate-ping' : 'bg-gray-400'}`} />
                      <span>{partner.isOnline ? 'On Duty' : 'Off Duty'}</span>
                    </button>
                  </td>

                  {/* Account Status */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleAccountStatus(partner.id, partner.accountStatus, partner.name)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                        partner.accountStatus === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
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
                      className="p-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer"
                      title="Inspect Full Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setEditingPartner(partner)}
                      className="p-2 text-farmGreen-800 bg-farmBg hover:bg-emerald-100/80 rounded-xl transition-all cursor-pointer"
                      title="Edit Rider Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}

              {filteredPartners.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-xs text-farmMuted bg-farmBg/30 space-y-2">
                    <Truck className="w-8 h-8 text-gray-400 mx-auto" />
                    <div className="font-bold text-farmGreen-950 text-sm">No Delivery Boys Match Your Criteria</div>
                    <p className="text-[11px]">Try clearing search query or switching status filter tabs.</p>
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
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
            
            {/* Hero Header Banner */}
            <div className="bg-[#0F2818] bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] text-white p-6 sm:p-7 relative border-b border-emerald-700/50">
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
              <div className="p-4 bg-farmBg rounded-2xl border border-emerald-100/80 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-bold text-farmGreen-950">Vehicle:</span>
                    <span className="font-bold text-emerald-900">{viewingPartner.vehicleType}</span>
                  </div>
                  <span className="font-mono text-[11px] font-extrabold text-farmGreen-950 bg-white px-2.5 py-0.5 rounded-lg border border-gray-200 shadow-2xs">
                    {viewingPartner.vehicleNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-farmGreen-950">Driving License:</span>
                  <span className="font-mono text-farmMuted font-bold">{viewingPartner.licenseNumber}</span>
                </div>
              </div>

              {/* Stats Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/40 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Completed Trips</div>
                  <div className="font-extrabold text-3xl text-emerald-950">{viewingPartner.totalDeliveries || 0}</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/40 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">Rating Score</div>
                  <div className="font-extrabold text-3xl text-amber-950">⭐ {viewingPartner.rating || 5.0}</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  onClick={() => setViewingPartner(null)}
                  className="w-full py-3 bg-gradient-to-r from-farmGreen-800 to-emerald-900 hover:from-farmGreen-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
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
          <form onSubmit={handleAddPartner} className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-farmGreen-950">Add New Delivery Partner</h3>
                  <p className="text-xs text-farmMuted">Register a new rider for local farm logistics & dispatch</p>
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

            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Suresh Verma"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="+91 98000 12345"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="rider@localfarm.in"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Vehicle Type</label>
                <select
                  value={newPartner.vehicleType}
                  onChange={(e) => setNewPartner({ ...newPartner, vehicleType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none font-bold"
                >
                  <option value="EV Scooter (Ather 450X)">EV Scooter (Ather 450X)</option>
                  <option value="Motorcycle (Hero Splendor)">Motorcycle (Hero / Honda)</option>
                  <option value="Eco Bicycle">Eco Bicycle</option>
                  <option value="Light Cargo Van">Light Cargo Van</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Vehicle Reg Number</label>
                <input
                  type="text"
                  placeholder="e.g. MH 12 AB 1234"
                  value={newPartner.vehicleNumber}
                  onChange={(e) => setNewPartner({ ...newPartner, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Driving License No.</label>
                <input
                  type="text"
                  placeholder="e.g. DL-MH12-2024-991"
                  value={newPartner.licenseNumber}
                  onChange={(e) => setNewPartner({ ...newPartner, licenseNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Hub Location / Zone</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Pune West Metro Hub, Baner"
                    value={newPartner.hubLocation}
                    onChange={(e) => setNewPartner({ ...newPartner, hubLocation: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
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
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 text-white text-xs font-bold font-display flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Rider</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Delivery Partner Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-farmGreen-950">Edit Delivery Partner</h3>
                  <p className="text-xs text-farmMuted">Update rider details & operational hub</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingPartner(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={editingPartner.name}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={editingPartner.phone}
                  onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Vehicle Type</label>
                <input
                  type="text"
                  value={editingPartner.vehicleType}
                  onChange={(e) => setEditingPartner({ ...editingPartner, vehicleType: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Vehicle Registration Number</label>
                <input
                  type="text"
                  value={editingPartner.vehicleNumber}
                  onChange={(e) => setEditingPartner({ ...editingPartner, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Hub Location</label>
                <input
                  type="text"
                  value={editingPartner.hubLocation}
                  onChange={(e) => setEditingPartner({ ...editingPartner, hubLocation: e.target.value })}
                  className="w-full px-4 py-2 bg-farmBg border border-gray-200 rounded-2xl outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingPartner(null)}
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
    </div>
  );
};
