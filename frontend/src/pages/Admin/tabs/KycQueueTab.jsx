import React, { useState } from 'react';
import { ClipboardList, FileText, Check, X, Eye, ShieldCheck, Download, Award, ZoomIn } from 'lucide-react';

export const KycQueueTab = ({
  kycItems,
  handleKycAction,
  StatusBadge,
  SectionHeader,
  isDark
}) => {
  const [inspectDoc, setInspectDoc] = useState(null);

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        icon={ClipboardList}
        title="KYC Document Review Queue"
        description="Approve or reject farmer verification documents submitted for accreditation"
      />

      <div className="p-6 sm:p-8 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pending', count: kycItems.filter(k => k.status === 'Pending').length, color: 'amber' },
            { label: 'Approved', count: kycItems.filter(k => k.status === 'Approved').length, color: 'emerald' },
            { label: 'Rejected', count: kycItems.filter(k => k.status === 'Rejected').length, color: 'rose' },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-2xl border text-center ${
              isDark 
                ? s.color === 'emerald' ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.15)] text-[#00FF85]' :
                  s.color === 'amber' ? 'bg-[rgba(251,184,58,0.04)] border-[rgba(251,184,58,0.15)] text-[#FBB83A]' :
                  'bg-[rgba(255,77,77,0.04)] border-[rgba(255,77,77,0.15)] text-[#FF6B6B]'
                : `bg-${s.color}-50 border-${s.color}-100 text-${s.color}-700`
            }`}>
              <div className="font-black text-2xl">{s.count}</div>
              <div className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : `text-${s.color}-800`}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* KYC Items */}
        <div className="space-y-3">
          {kycItems.map(item => (
            <div key={item.id} className={`p-5 rounded-2xl border space-y-3 transition-all ${
              isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)] hover:border-[rgba(0,255,133,0.2)]' : 'bg-gray-50/80 border-gray-200 hover:border-emerald-200'
            }`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <FileText className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} />
                    <span className={`font-black text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{item.docType}</span>
                    <StatusBadge status={item.status} isDark={isDark} />
                  </div>
                  <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
                    Farmer: <strong className={isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}>{item.farmer}</strong> ({item.farmerId}) · Uploaded: {item.uploadDate}
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectDoc(item)}
                    className={`text-[10px] font-extrabold mt-1 flex items-center gap-1.5 cursor-pointer hover:underline ${
                      isDark ? 'text-[#00FF85]' : 'text-emerald-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>📎 {item.fileName} · Inspect Document Preview →</span>
                  </button>
                </div>
                {item.status === 'Pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleKycAction(item.id, 'approve')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleKycAction(item.id, 'reject')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Inspection & Document Viewer Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn" onClick={() => setInspectDoc(null)}>
          <div
            className={`rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border animate-scaleUp font-display ${
              isDark ? 'bg-[#0A120D] border-[rgba(0,255,133,0.2)] text-[#D4EAD9]' : 'bg-white border-gray-100 text-farmGreen-950'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              isDark ? 'bg-gradient-to-r from-[#040805] to-[#0A160F] border-[rgba(0,255,133,0.15)] text-white' : 'bg-gradient-to-r from-farmGreen-950 to-emerald-900 border-emerald-800 text-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[rgba(0,255,133,0.15)] border-[rgba(0,255,133,0.3)] text-[#00FF85]' : 'bg-emerald-800 border-white/20 text-emerald-300'}`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base">{inspectDoc.docType}</h4>
                  <p className={`text-[11px] font-bold ${isDark ? 'text-[#00FF85]' : 'text-emerald-300'}`}>{inspectDoc.farmer} ({inspectDoc.farmerId})</p>
                </div>
              </div>
              <button onClick={() => setInspectDoc(null)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Document Certificate Viewer Card */}
            <div className="p-6 space-y-4">
              <div className={`p-6 rounded-2xl border-2 border-dashed text-center space-y-3 ${
                isDark ? 'bg-[rgba(0,255,133,0.02)] border-[rgba(0,255,133,0.2)]' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck className="w-10 h-10 text-emerald-700" />
                </div>
                <div>
                  <div className={`font-black text-sm uppercase tracking-wider ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                    Government Verified Certification
                  </div>
                  <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
                    DOC REF: AP-AGRI-2026-{inspectDoc.id.toUpperCase()}
                  </div>
                </div>
                <div className={`p-3 rounded-xl border text-left text-xs space-y-1.5 ${
                  isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.1)]' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#7FA882]' : 'text-gray-500'}>Document Type:</span>
                    <span className="font-black">{inspectDoc.docType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#7FA882]' : 'text-gray-500'}>Farmer Name:</span>
                    <span className="font-black">{inspectDoc.farmer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#7FA882]' : 'text-gray-500'}>Upload Timestamp:</span>
                    <span className="font-mono">{inspectDoc.uploadDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#7FA882]' : 'text-gray-500'}>Verification Status:</span>
                    <StatusBadge status={inspectDoc.status} isDark={isDark} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              {inspectDoc.status === 'Pending' ? (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleKycAction(inspectDoc.id, 'reject');
                      setInspectDoc(null);
                    }}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    Reject Accreditation
                  </button>
                  <button
                    onClick={() => {
                      handleKycAction(inspectDoc.id, 'approve');
                      setInspectDoc(null);
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    Verify & Approve Farmer
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setInspectDoc(null)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border border-[rgba(0,255,133,0.2)]' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Close Inspection
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycQueueTab;
