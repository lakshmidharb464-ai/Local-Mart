import React from 'react';
import { Users, Search, ChevronRight } from 'lucide-react';

export const UsersTab = ({
  mockUsers,
  userRoleFilter,
  setUserRoleFilter,
  userSearch,
  setUserSearch,
  filteredUsers,
  userStatuses,
  setSelectedUser,
  setUserModalRoleType,
  StatusBadge,
  SectionHeader,
  isDark
}) => {
  return (
    <div className="animate-fadeIn">
      <SectionHeader
        icon={Users}
        title="User Management"
        description="View, approve, and manage all platform users across every role"
      />

      <div className="p-6 sm:p-8 space-y-5">
        {/* Role Switcher */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'farmers', label: '🌾 Farmers', count: mockUsers?.farmers?.length || 0 },
            { id: 'customers', label: '🛒 Customers', count: mockUsers?.customers?.length || 0 },
            { id: 'delivery', label: '🚴 Delivery', count: mockUsers?.delivery?.length || 0 },
          ].map(r => {
            const isActive = userRoleFilter === r.id;
            return (
              <button
                key={r.id}
                onClick={() => { setUserRoleFilter(r.id); setUserSearch(''); }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? isDark
                      ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.4)] shadow-[0_0_12px_rgba(0,255,133,0.2)]'
                      : 'bg-emerald-700 text-white shadow-sm border border-emerald-800'
                    : isDark
                      ? 'text-[#7FA882] border border-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.06)] hover:text-[#D4EAD9]'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-emerald-50'
                }`}
              >
                <span>{r.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isActive 
                    ? isDark ? 'bg-[rgba(0,255,133,0.2)] text-[#00FF85]' : 'bg-white/20 text-white'
                    : isDark ? 'bg-[rgba(0,255,133,0.08)] text-[#7FA882]' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {r.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#00FF85]' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-bold outline-none transition-all ${
              isDark 
                ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.12)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                : 'bg-gray-50 border border-gray-200 text-farmGreen-950 focus:border-emerald-600 focus:bg-white'
            }`}
          />
        </div>

        {/* User List */}
        <div className="space-y-2">
          {filteredUsers.length === 0 && (
            <div className={`py-12 text-center text-xs font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>No users found.</div>
          )}
          {filteredUsers.map(u => {
            const status = userStatuses[u.id] || u.status;
            return (
              <div
                key={u.id}
                onClick={() => { setSelectedUser(u); setUserModalRoleType(userRoleFilter === 'farmers' ? 'Farmer' : userRoleFilter === 'customers' ? 'Customer' : 'Delivery Partner'); }}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)] hover:border-[rgba(0,255,133,0.2)] hover:bg-[rgba(0,255,133,0.03)]' 
                    : 'bg-gray-50/80 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-emerald-400/30" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-black text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{u.name}</span>
                    <StatusBadge status={status} isDark={isDark} />
                    {u.kyc && <StatusBadge status={u.kyc} isDark={isDark} />}
                    {u.tier && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                        isDark ? 'bg-[rgba(212,167,69,0.1)] text-[#D4A745] border-[rgba(212,167,69,0.25)]' : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {u.tier}
                      </span>
                    )}
                  </div>
                  <div className={`text-[11px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{u.id} · {u.email}</div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <div className={`text-[10px] font-black ${isDark ? 'text-[#D4EAD9]' : 'text-gray-500'}`}>{u.farm || u.vehicle || `${u.orders ?? u.deliveries} orders`}</div>
                  <div className={`text-[10px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-gray-400'}`}>Since {u.joined}</div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#7FA882]' : 'text-gray-300'}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
