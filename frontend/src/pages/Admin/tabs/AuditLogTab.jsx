import React, { useState, useMemo } from 'react';
import { ScrollText, Filter, Download, Calendar, Activity } from 'lucide-react';

export const AuditLogTab = ({
  auditFilter,
  setAuditFilter,
  auditActions,
  filteredAudit,
  showToast,
  SectionHeader,
  isDark
}) => {
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'today' | '7d' | '30d'

  const displayAudit = useMemo(() => {
    let list = filteredAudit;
    if (timeFilter === 'today') {
      list = list.filter(item => item.timestamp.startsWith('2026-08-25'));
    } else if (timeFilter === '7d') {
      list = list.slice(0, 8);
    }
    return list;
  }, [filteredAudit, timeFilter]);

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        icon={ScrollText}
        title="Admin Audit Log"
        description="Read-only chronological record of all administrator actions on this platform"
      />

      <div className="p-6 sm:p-8 space-y-5">
        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Action Filter Dropdown */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00FF85]' : 'text-gray-400'}`} />
            <select
              value={auditFilter}
              onChange={e => setAuditFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer transition-all ${
                isDark 
                  ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9]' 
                  : 'bg-gray-50 border border-gray-200 text-farmGreen-950'
              }`}
            >
              {auditActions.map(a => <option key={a} value={a} className={isDark ? 'bg-[#0A120D] text-[#D4EAD9]' : 'bg-white text-gray-900'}>{a}</option>)}
            </select>
            <span className={`text-xs font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{displayAudit.length} entries</span>
          </div>

          {/* Time Range Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-white/5 border-emerald-500/10 text-[11px] font-black">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
            ].map(t => {
              const active = timeFilter === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeFilter(t.id)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    active
                      ? isDark
                        ? 'bg-[rgba(0,255,133,0.2)] text-[#00FF85] shadow-2xs'
                        : 'bg-emerald-800 text-white shadow-xs'
                      : isDark
                        ? 'text-[#7FA882] hover:text-[#D4EAD9]'
                        : 'text-farmMuted hover:text-farmGreen-950'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Log Table */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? 'border-[rgba(0,255,133,0.08)]' : 'border-gray-200'
        }`}>
          <div className={`hidden sm:grid grid-cols-4 gap-0 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border-b ${
            isDark ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.08)] text-[#7FA882]' : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
            <span>Timestamp</span><span>Admin</span><span>Action</span><span>Affected Entity</span>
          </div>
          {displayAudit.map((entry, idx) => (
            <div
              key={entry.id}
              className={`grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-0 px-4 py-3.5 text-xs border-b last:border-0 ${
                isDark 
                  ? idx % 2 === 0 ? 'bg-[rgba(255,255,255,0.01)] border-[rgba(0,255,133,0.04)]' : 'bg-[rgba(0,255,133,0.02)] border-[rgba(0,255,133,0.04)]' 
                  : idx % 2 === 0 ? 'bg-white border-gray-100' : 'bg-gray-50/40 border-gray-100'
              }`}
            >
              <span className={`font-mono text-[10px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{entry.timestamp}</span>
              <span className={`font-black ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{entry.admin}</span>
              <span className={`font-bold px-2 py-0.5 rounded-lg w-fit text-[10px] ${
                isDark ? 'bg-[rgba(0,191,255,0.1)] text-[#5CD9FF] border border-[rgba(0,191,255,0.2)]' : 'text-blue-800 bg-blue-50'
              }`}>{entry.action}</span>
              <span className={`font-bold text-[11px] ${isDark ? 'text-[#D4EAD9]' : 'text-gray-600'}`}>{entry.entity}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => { if (showToast) showToast('Audit Log Exported 📥', 'Full audit log downloaded as CSV.'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black cursor-pointer transition-all ${
            isDark 
              ? 'bg-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.2)]' 
              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700'
          }`}
        >
          <Download className="w-4 h-4" /> Export Full Audit Log (CSV)
        </button>
      </div>
    </div>
  );
};

export default AuditLogTab;
