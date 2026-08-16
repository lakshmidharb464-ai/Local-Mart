import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  User, 
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
  Sparkles
} from 'lucide-react';

export const CustomerManagement = ({ customers, setCustomers }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Kothrud, Pune 411038',
    status: 'Active'
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Active') return matchesSearch && c.status === 'Active';
    if (statusFilter === 'Inactive') return matchesSearch && c.status === 'Inactive';
    return matchesSearch;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const totalSpendSum = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrdersSum = customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0);

  const handleToggleStatus = (id, currentStatus, name) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setCustomers(customers.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast('Customer Status Updated', `${name} is now ${newStatus}.`);
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      showToast('Validation Error', 'Please complete name, email, and phone number.', 'error');
      return;
    }

    const created = {
      id: `c${customers.length + 1}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      ordersCount: 0,
      totalSpent: 0,
      status: newCustomer.status,
      joinedDate: 'Today'
    };

    setCustomers([created, ...customers]);
    setShowAddModal(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: 'Kothrud, Pune 411038',
      status: 'Active'
    });
    showToast('Customer Account Created', `${created.name} registered successfully!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-display">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-extrabold text-2xl text-farmGreen-950 tracking-tight">Customer Account Management</h2>
            <span className="bg-blue-100 text-blue-900 text-xs font-black px-3 py-1 rounded-full border border-blue-200 shadow-2xs font-mono">
              {totalCustomers} Accounts
            </span>
          </div>
          <p className="text-xs text-farmMuted mt-1">Audit customer profiles, lifetime purchase value, delivery addresses & security status</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700" />
            <input
              type="text"
              placeholder="Search name, email, address..."
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
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
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
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Total Accounts</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-farmGreen-950 mt-2">{totalCustomers}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Registered Marketplace Buyers →</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Active')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Active'
              ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-400/30'
              : 'bg-white border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Active Buyers</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-blue-950 mt-2">{activeCustomers}</div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">100% Verified Customer Status</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-purple-950 mt-2">{totalOrdersSum}</div>
          <div className="text-[11px] text-purple-700 font-bold mt-1">Lifetime Orders Placed</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Lifetime Spend</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-amber-950 mt-2">₹{totalSpendSum.toLocaleString()}</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">Direct Farm Purchase GMV</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pt-1">
        {[
          { id: 'All', label: `All (${totalCustomers})` },
          { id: 'Active', label: `🟢 Active (${activeCustomers})` },
          { id: 'Inactive', label: `⛔ Inactive (${totalCustomers - activeCustomers})` }
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

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-emerald-100/80 overflow-hidden shadow-farm-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-farmBg/80 border-b border-emerald-100 text-farmMuted font-black uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Customer Info</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-emerald-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-farmGreen-700 to-emerald-800 text-white font-extrabold text-sm flex items-center justify-center shadow-2xs shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-farmGreen-950 flex items-center gap-2">
                          <span className="hover:underline cursor-pointer" onClick={() => setSelectedCustomer(cust)}>{cust.name}</span>
                          <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                            {cust.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-farmMuted font-medium mt-0.5">{cust.email} · {cust.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-farmMuted font-medium max-w-xs truncate">{cust.address}</td>
                  <td className="p-4 font-extrabold text-farmGreen-950 text-sm">{cust.ordersCount} Orders</td>
                  <td className="p-4 font-extrabold text-emerald-800 text-sm">₹{cust.totalSpent.toLocaleString()}</td>

                  {/* Status Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(cust.id, cust.status, cust.name)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                        cust.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{cust.status}</span>
                    </button>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-[11px] font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-xs text-farmMuted bg-farmBg/30 space-y-2">
                    <Users className="w-8 h-8 text-gray-400 mx-auto" />
                    <div className="font-bold text-farmGreen-950 text-sm">No Customer Accounts Found</div>
                    <p className="text-[11px]">Try adjusting your search criteria or switching status tabs.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
            
            {/* Hero Header Banner */}
            <div className="bg-[#0F2818] bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] text-white p-6 sm:p-7 relative border-b border-emerald-700/50">
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="absolute top-5 right-5 p-2 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-farmGreen-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/10 shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-xl text-white tracking-tight">{selectedCustomer.name}</h3>
                    <button
                      onClick={() => handleToggleStatus(selectedCustomer.id, selectedCustomer.status, selectedCustomer.name)}
                      className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        selectedCustomer.status === 'Active' 
                          ? 'bg-emerald-400 text-emerald-950 shadow-sm' 
                          : 'bg-red-500 text-white shadow-sm'
                      }`}
                    >
                      {selectedCustomer.status}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-200/90 mt-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Member since {selectedCustomer.joinedDate || '12 Jan 2024'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Communication Pills */}
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10">
                <a 
                  href={`tel:${selectedCustomer.phone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Call {selectedCustomer.phone}</span>
                </a>
                <a 
                  href={`mailto:${selectedCustomer.email}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="truncate">{selectedCustomer.email}</span>
                </a>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5">
              
              {/* Delivery Address Card */}
              <div className="p-4 bg-farmBg rounded-2xl border border-emerald-100/80 text-xs font-semibold space-y-1">
                <div className="flex items-center gap-2 text-farmGreen-950 font-extrabold uppercase text-[10px] tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Primary Delivery Address</span>
                </div>
                <div className="text-farmMuted font-bold pl-5 leading-relaxed">{selectedCustomer.address}</div>
              </div>

              {/* Stats Metrics Cards */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Total Orders</span>
                  </div>
                  <div className="font-extrabold text-3xl text-emerald-950">
                    {selectedCustomer.ordersCount}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-farmGreen-50 to-emerald-50/80 rounded-2xl border border-farmGreen-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold text-farmGreen-800 uppercase tracking-wider">
                    <CreditCard className="w-3.5 h-3.5 text-farmGreen-600" />
                    <span>Total Spend</span>
                  </div>
                  <div className="font-extrabold text-3xl text-farmGreen-950">
                    ₹{selectedCustomer.totalSpent.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full py-3 bg-gradient-to-r from-farmGreen-800 to-emerald-900 hover:from-farmGreen-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
                >
                  Close Profile
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleAddCustomer} className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border border-emerald-100/80 overflow-hidden relative animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-farmGreen-950">Add New Customer Account</h3>
                  <p className="text-xs text-farmMuted">Register a new customer for local farm deliveries</p>
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

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Gupta"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  placeholder="aarav@gmail.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+91 98765 00112"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-farmGreen-950 mb-1 block">Delivery Address</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Flat 302, Lotus Towers, Baner, Pune"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-farmBg border border-gray-200 focus:border-farmGreen-600 rounded-2xl outline-none resize-none"
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
                <span>Create Customer</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
