import React, { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const CustomerManagement = ({ customers, setCustomers, isDark = true }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCustomer(null);
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Kothrud, Pune 411038',
    status: 'Active'
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
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
  }, [customers, searchQuery, statusFilter]);

  const { totalCustomers, activeCustomers, totalSpendSum, totalOrdersSum } = useMemo(() => {
    return {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.status === 'Active').length,
      totalSpendSum: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
      totalOrdersSum: customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0),
    };
  }, [customers]);

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
              Customer Account Management
            </h2>
            <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-2xs font-mono ${
              isDark 
                ? 'bg-[rgba(0,191,255,0.1)] text-[#5CD9FF] border-[rgba(0,191,255,0.25)]' 
                : 'bg-blue-100 text-blue-900 border-blue-200'
            }`}>
              {totalCustomers} Accounts
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
            Audit customer profiles, lifetime purchase value, delivery addresses & security status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} />
            <input
              type="text"
              placeholder="Search name, email, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none transition-all ${
                isDark 
                  ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.12)] text-[#D4EAD9] placeholder-[#7FA882]/50 focus:border-[#00FF85]' 
                  : 'bg-farmBg border border-emerald-200/80 rounded-2xl text-[#0A2214] placeholder-gray-400 focus:border-farmGreen-600 focus:bg-white'
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 ${isDark ? 'text-[#7FA882] hover:text-[#D4EAD9]' : 'text-gray-400 hover:text-gray-600'}`}>
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
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accounts */}
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
              Total Accounts
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
            {totalCustomers}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`}>
            Registered Buyers →
          </div>
        </div>

        {/* Active Buyers */}
        <div 
          onClick={() => setStatusFilter('Active')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'Active'
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
              Active Buyers
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(0,191,255,0.1)] text-[#5CD9FF]' : 'bg-blue-100 text-blue-800'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#D4EAD9]' : 'text-blue-950'}`}>
            {activeCustomers}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#5CD9FF]' : 'text-blue-700'}`}>
            Verified Accounts
          </div>
        </div>

        {/* Total Orders */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${
          isDark 
            ? 'adm-glass border-[rgba(0,255,133,0.08)]' 
            : 'bg-white border-emerald-100/80 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Total Orders
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(212,167,69,0.1)] text-[#D4A745]' : 'bg-purple-100 text-purple-800'
            }`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#D4EAD9]' : 'text-purple-950'}`}>
            {totalOrdersSum}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#D4A745]' : 'text-purple-700'}`}>
            Lifetime Orders Placed
          </div>
        </div>

        {/* Lifetime Spend */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${
          isDark 
            ? 'adm-glass border-[rgba(0,255,133,0.08)]' 
            : 'bg-white border-emerald-100/80 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
              Lifetime Spend
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
              isDark ? 'bg-[rgba(251,184,58,0.1)] text-[#FBB83A]' : 'bg-amber-100 text-amber-800'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className={`font-extrabold text-3xl mt-2 font-mono tabular-nums ${isDark ? 'adm-gold-text' : 'text-amber-950'}`}>
            ₹{totalSpendSum.toLocaleString()}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#FBB83A]' : 'text-amber-700'}`}>
            Direct Farm Purchase GMV
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pt-1">
        {[
          { id: 'All', label: `All (${totalCustomers})` },
          { id: 'Active', label: `🟢 Active (${activeCustomers})` },
          { id: 'Inactive', label: `⛔ Inactive (${totalCustomers - activeCustomers})` }
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

      {/* Customers Table */}
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
                <th className="p-4 pl-6">Customer Info</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-semibold ${
              isDark ? 'divide-[rgba(0,255,133,0.04)]' : 'divide-gray-100'
            }`}>
              {filteredCustomers.map((cust) => (
                <tr 
                  key={cust.id} 
                  className={`transition-colors group ${
                    isDark ? 'adm-row hover:bg-[rgba(0,255,133,0.025)]' : 'hover:bg-emerald-50/50'
                  }`}
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl font-extrabold text-sm flex items-center justify-center shadow-2xs shrink-0 ${
                        isDark 
                          ? 'bg-gradient-to-br from-[#00FF85]/20 to-[#00FF85]/10 text-[#00FF85] border border-[rgba(0,255,133,0.3)]' 
                          : 'bg-gradient-to-br from-farmGreen-700 to-emerald-800 text-white'
                      }`}>
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-extrabold text-sm flex items-center gap-2 ${
                          isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'
                        }`}>
                          <span className="hover:underline cursor-pointer" onClick={() => setSelectedCustomer(cust)}>{cust.name}</span>
                          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                            isDark 
                              ? 'bg-[rgba(0,255,133,0.08)] text-[#00FF85] border-[rgba(0,255,133,0.2)]' 
                              : 'bg-emerald-100/80 text-emerald-800 border-emerald-200'
                          }`}>
                            {cust.id}
                          </span>
                        </div>
                        <div className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
                          {cust.email} · {cust.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`p-4 font-medium max-w-xs truncate ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
                    {cust.address}
                  </td>
                  <td className={`p-4 font-extrabold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                    {cust.ordersCount} Orders
                  </td>
                  <td className={`p-4 font-extrabold text-sm ${isDark ? 'adm-gold-text' : 'text-emerald-800'}`}>
                    ₹{cust.totalSpent.toLocaleString()}
                  </td>

                  {/* Status Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(cust.id, cust.status, cust.name)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                        cust.status === 'Active'
                          ? isDark 
                            ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border border-[rgba(0,255,133,0.25)] hover:bg-[rgba(0,255,133,0.2)]' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : isDark 
                            ? 'bg-[rgba(255,77,77,0.1)] text-[#FF6B6B] border border-[rgba(255,77,77,0.25)] hover:bg-[rgba(255,77,77,0.2)]' 
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
                      className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        isDark 
                          ? 'bg-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.16)] text-[#00FF85] border border-[rgba(0,255,133,0.2)]' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" className={`p-12 text-center text-xs space-y-3 ${
                    isDark ? 'bg-[rgba(255,255,255,0.01)] text-[#7FA882]' : 'bg-farmBg/30 text-farmMuted'
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border ${
                      isDark ? 'bg-[rgba(0,255,133,0.05)] border-[rgba(0,255,133,0.15)] text-[#00FF85]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      <Users className="w-6 h-6 opacity-80" />
                    </div>
                    <div className={`font-bold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                      No Customer Accounts Found
                    </div>
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
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
              <div className={`p-4 rounded-2xl border text-xs font-semibold space-y-1 ${
                isDark 
                  ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' 
                  : 'bg-farmBg border-emerald-100/80'
              }`}>
                <div className={`flex items-center gap-2 font-extrabold uppercase text-[10px] tracking-wider ${
                  isDark ? 'text-[#00FF85]' : 'text-farmGreen-950'
                }`}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Primary Delivery Address</span>
                </div>
                <div className={`font-bold pl-5 leading-relaxed ${isDark ? 'text-[#D4EAD9]' : 'text-farmMuted'}`}>
                  {selectedCustomer.address}
                </div>
              </div>

              {/* Stats Metrics Cards */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isDark 
                    ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.15)]' 
                    : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200'
                }`}>
                  <div className={`flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-[#00FF85]' : 'text-emerald-800'
                  }`}>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Total Orders</span>
                  </div>
                  <div className={`font-extrabold text-3xl ${isDark ? 'text-[#D4EAD9]' : 'text-emerald-950'}`}>
                    {selectedCustomer.ordersCount}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isDark 
                    ? 'bg-[rgba(212,167,69,0.04)] border-[rgba(212,167,69,0.15)]' 
                    : 'bg-gradient-to-br from-farmGreen-50 to-emerald-50/80 border-farmGreen-200'
                }`}>
                  <div className={`flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-[#D4A745]' : 'text-farmGreen-800'
                  }`}>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Total Spend</span>
                  </div>
                  <div className={`font-extrabold text-3xl ${isDark ? 'adm-gold-text' : 'text-farmGreen-950'}`}>
                    ₹{selectedCustomer.totalSpent.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setSelectedCustomer(null)}
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

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleAddCustomer} className={`rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border overflow-hidden relative animate-scaleUp ${
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
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-extrabold text-lg ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                    Add New Customer Account
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
                    Register a new customer for local farm deliveries
                  </p>
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

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Aarav Gupta"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="aarav@gmail.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                  Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 00112"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none font-mono transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                      : 'bg-farmBg border border-gray-200 focus:border-farmGreen-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`font-extrabold mb-1 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                  Delivery Address
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Flat 302, Lotus Towers, Baner, Pune"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl outline-none resize-none transition-all ${
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
                <span>Create Customer</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
