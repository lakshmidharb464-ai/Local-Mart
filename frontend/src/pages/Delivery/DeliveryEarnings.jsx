import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  ShieldCheck,
  CreditCard,
  Target,
  FileText,
  X,
  MapPin,
  Sparkles,
  Copy,
  Check,
  Building2,
  ChevronRight,
  ArrowUpRight,
  Zap
} from 'lucide-react';

export const DeliveryEarnings = ({ earnings = { todayTotal: 0, weeklyTotal: 0, pendingPayout: 0, todayTrips: 0, weeklyTrips: 0, todayBasePay: 0, todayDistanceBonus: 0, todayTips: 0, payoutHistory: [] }, orders = [], showToast }) => {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [dailyGoal, setDailyGoal] = useState(1500);
  const [copiedUtr, setCopiedUtr] = useState(false);

  const completedOrders = orders.filter(o => o.status === 'Delivered');
  const chittoorDeliveries = orders.filter(o => 
    o.status === 'Delivered' && (
      o.district?.includes('Chittoor') || 
      o.customerAddress?.includes('Chittoor') || 
      o.id?.startsWith('DEL-CTR')
    )
  );

  const defaultPayoutHistory = earnings.payoutHistory?.length > 0 ? earnings.payoutHistory : [
    { id: 'PAY-8801', date: '11 Aug 2026', trips: 14, method: 'Direct Bank Transfer', amount: 1450, status: 'Settled', utr: 'UTR-9912048201' },
    { id: 'PAY-8800', date: '10 Aug 2026', trips: 12, method: 'Direct Bank Transfer', amount: 1280, status: 'Settled', utr: 'UTR-8821034920' },
    { id: 'PAY-8799', date: '09 Aug 2026', trips: 15, method: 'Direct Bank Transfer', amount: 1620, status: 'Settled', utr: 'UTR-7730194821' },
    { id: 'PAY-8798', date: '08 Aug 2026', trips: 10, method: 'Direct Bank Transfer', amount: 1100, status: 'Settled', utr: 'UTR-6629481023' }
  ];

  const progressPercent = Math.min(100, Math.round(((earnings.todayTotal || 345) / dailyGoal) * 100));

  const handleDownloadPayoutStatement = () => {
    if (showToast) {
      showToast('Statement Downloaded 📄', 'PDF earnings & bank settlement statement downloaded.');
    }
  };

  const handleCopyUtr = (utrText) => {
    navigator.clipboard.writeText(utrText);
    setCopiedUtr(true);
    if (showToast) showToast('UTR Copied 📋', `Bank reference UTR ${utrText} copied to clipboard.`);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 font-display animate-fadeIn">
      
      {/* Glassmorphism Header */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-lg">
              <Wallet className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Auto-Settled Daily to Bank</span>
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                Earnings & Bank Settlements
              </h1>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                Track daily payouts, weekly incentives, customer tips & Chittoor regional route bonuses.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPayoutStatement}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Statement PDF 📄</span>
          </button>
        </div>
      </div>

      {/* Daily Goal & Earnings Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-farmGreen-900 to-emerald-900 rounded-3xl p-6 text-white shadow-xl border border-emerald-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span className="font-black text-sm text-white">Daily Target Progress</span>
          </div>
          <div className="text-xs font-mono text-emerald-300 font-black">
            ₹{earnings.todayTotal || 345} / ₹{dailyGoal} Goal ({progressPercent}%)
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-white/10 backdrop-blur-md rounded-full overflow-hidden p-0.5 border border-white/15">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-300 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Today's Earnings */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-farmMuted font-black uppercase tracking-wider">
            <span>Today's Earnings</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="font-mono font-black text-3xl text-farmGreen-950">
            ₹{(earnings.todayTotal || 345).toLocaleString()}
          </div>
          <div className="text-xs text-farmMuted font-bold flex items-center justify-between border-t border-gray-100 pt-2">
            <span>Trips Completed: <strong>{earnings.todayTrips || 6}</strong></span>
            <span className="text-emerald-700 font-extrabold">+14% vs yesterday</span>
          </div>
        </div>

        {/* Weekly Total */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-farmMuted font-black uppercase tracking-wider">
            <span>Weekly Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono font-black text-3xl text-farmGreen-950">
            ₹{(earnings.weeklyTotal || 2450).toLocaleString()}
          </div>
          <div className="text-xs text-farmMuted font-bold flex items-center justify-between border-t border-gray-100 pt-2">
            <span>Trips: <strong>{earnings.weeklyTrips || 28}</strong></span>
            <span className="text-emerald-700 font-extrabold">Current Cycle</span>
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-farmMuted font-black uppercase tracking-wider">
            <span>Next Bank Settlement</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono font-black text-3xl text-amber-600">
            ₹{(earnings.pendingPayout || 345).toLocaleString()}
          </div>
          <div className="text-xs text-farmMuted font-bold flex items-center justify-between border-t border-gray-100 pt-2">
            <span>Scheduled: <strong>Tomorrow, 8:00 AM</strong></span>
            <span className="text-amber-800 font-extrabold">Direct UPI/NEFT</span>
          </div>
        </div>

      </div>

      {/* Payout Components Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
        <h3 className="font-black text-base text-farmGreen-950">
          Payout Components Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-1">
            <span className="text-[10px] font-black text-farmMuted uppercase">Base Trip Payout</span>
            <div className="font-mono font-black text-xl text-farmGreen-950">₹{earnings.todayBasePay || 240}</div>
            <p className="text-[10px] text-farmMuted font-bold">Fixed distance rate per order</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-1">
            <span className="text-[10px] font-black text-farmMuted uppercase">Distance Multiplier</span>
            <div className="font-mono font-black text-xl text-emerald-800">₹{earnings.todayDistanceBonus || 65}</div>
            <p className="text-[10px] text-farmMuted font-bold">Peak hour & long distance bonus</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
            <span className="text-[10px] font-black text-amber-950 uppercase">Chittoor AP Bonus</span>
            <div className="font-mono font-black text-xl text-amber-900">₹180</div>
            <p className="text-[10px] text-amber-800 font-bold">NH-140 Express Highway bonus</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-1">
            <span className="text-[10px] font-black text-farmMuted uppercase">Customer Tips</span>
            <div className="font-mono font-black text-xl text-emerald-700">₹{earnings.todayTips || 40}</div>
            <p className="text-[10px] text-farmMuted font-bold">100% passed to partner</p>
          </div>
        </div>
      </div>

      {/* Bank Transfer & Settlement History Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Bank Transfer & Settlement History</span>
          </h3>
          <span className="text-xs text-farmMuted font-mono font-black">Auto-Settled Daily</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black text-farmMuted uppercase tracking-wider bg-gray-50/80">
                <th className="p-3.5">Payout ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Completed Trips</th>
                <th className="p-3.5">Transfer Method</th>
                <th className="p-3.5 text-right">Settled Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-bold text-farmGreen-950">
              {defaultPayoutHistory.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="p-3.5 font-mono font-black text-farmGreen-950">{item.id}</td>
                  <td className="p-3.5 text-farmMuted">{item.date}</td>
                  <td className="p-3.5">{item.trips} Deliveries</td>
                  <td className="p-3.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.method}</span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-black text-sm text-emerald-800">
                    ₹{item.amount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
                      ● {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedPayout(item)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200 font-black text-xs cursor-pointer active:scale-95 transition-all"
                    >
                      View Receipt 📄
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Receipt Modal - Ultra Modern Design matching user screenshot */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-6 border border-emerald-100 animate-scaleUp">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
                  <FileText className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-farmGreen-950">
                    Bank Settlement Invoice
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">Payout Ref: {selectedPayout.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPayout(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Table */}
            <div className="space-y-4 text-xs font-bold">
              <div className="p-4 bg-gray-50/80 rounded-2xl space-y-2 border border-gray-200/80">
                <div className="flex justify-between items-center">
                  <span className="text-farmMuted">Settlement Date:</span>
                  <span className="font-black text-farmGreen-950">{selectedPayout.date || '11 Aug 2026'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-farmMuted">Payment Mode:</span>
                  <span className="font-black text-farmGreen-950">{selectedPayout.method || 'Direct Bank Transfer'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-farmMuted">Bank Ref UTR:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-emerald-800">{selectedPayout.utr || 'UTR-9912048201'}</span>
                    <button 
                      onClick={() => handleCopyUtr(selectedPayout.utr || 'UTR-9912048201')} 
                      className="p-1 hover:bg-emerald-100 rounded text-emerald-800 transition-colors cursor-pointer"
                      title="Copy UTR"
                    >
                      {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Transferred Amount Highlighting Box */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center space-y-1">
                <div className="text-[10px] text-emerald-900 uppercase font-black tracking-wider">Total Transferred Amount</div>
                <div className="font-mono font-black text-3xl text-emerald-900">
                  ₹{selectedPayout.amount ? selectedPayout.amount.toLocaleString() : '1,450'}
                </div>
                <div className="text-[11px] text-emerald-800 font-extrabold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status: Settled (Bank Confirmed)</span>
                </div>
              </div>
            </div>

            {/* Modal Download Button */}
            <button
              onClick={() => {
                setSelectedPayout(null);
                if (showToast) showToast('Receipt Downloaded 📄', 'Bank Settlement PDF Invoice downloaded.');
              }}
              className="w-full py-3 bg-[#0d2516] hover:bg-emerald-900 text-white rounded-2xl text-xs font-black cursor-pointer shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Download PDF Receipt</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DeliveryEarnings;
