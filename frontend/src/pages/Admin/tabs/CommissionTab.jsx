import React from 'react';
import { Percent, Calendar, Save, TrendingUp } from 'lucide-react';

export const CommissionTab = ({
  commission,
  setCommission,
  payoutSchedule,
  setPayoutSchedule,
  minPayout,
  setMinPayout,
  gstIncluded,
  setGstIncluded,
  handleSaveCommission,
  Toggle,
  SectionHeader,
  isDark
}) => {
  return (
    <form onSubmit={handleSaveCommission} className="animate-fadeIn">
      <SectionHeader
        icon={Percent}
        title="Commission & Payout Rules"
        description="Set platform commission percentages, payout frequency, and GST configuration"
      />

      <div className="p-6 sm:p-8 space-y-6 text-xs font-extrabold">
        {/* Commission Slider */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[rgba(0,255,133,0.03)] border-[rgba(0,255,133,0.12)]' : 'bg-emerald-50 border-emerald-100'
        }`}>
          <div className="flex items-center justify-between">
            <label className={`font-black flex items-center gap-2 ${isDark ? 'text-[#D4EAD9]' : 'text-emerald-950'}`}>
              <Percent className={`w-4 h-4 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} /> Platform Commission Rate
            </label>
            <span className={`px-4 py-1.5 rounded-full font-black text-sm ${
              isDark ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.3)]' : 'bg-emerald-700 text-white'
            }`}>{commission}%</span>
          </div>
          <input
            type="range" min="2" max="20" step="0.5"
            value={commission}
            onChange={e => setCommission(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className={`flex justify-between text-[10px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-emerald-800'}`}>
            <span>2% (Minimal)</span><span>10% (Standard)</span><span>20% (Premium)</span>
          </div>
          <p className={`text-[10px] font-bold ${isDark ? 'text-[#00FF85]' : 'text-emerald-800'}`}>
            📊 Current: {commission}% commission on all farmer sales. Farmer receives {100 - commission}% of sale price.
          </p>
        </div>

        {/* Payout Schedule */}
        <div className="space-y-2">
          <label className={`font-black block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Farmer Payout Schedule</label>
          <div className="grid grid-cols-3 gap-3">
            {['Weekly', 'Bi-weekly', 'Monthly'].map(s => {
              const isActive = payoutSchedule === s;
              return (
                <button
                  key={s} type="button"
                  onClick={() => setPayoutSchedule(s)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.4)] shadow-[0_0_12px_rgba(0,255,133,0.2)] scale-[1.02]'
                        : 'bg-emerald-700 text-white border-emerald-800 shadow-md'
                      : isDark
                        ? 'bg-[rgba(255,255,255,0.02)] text-[#7FA882] border-[rgba(0,255,133,0.08)] hover:text-[#D4EAD9]'
                        : 'bg-gray-50 text-farmGreen-950 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <Calendar className={`w-5 h-5 mx-auto mb-1.5 ${isActive ? (isDark ? 'text-[#00FF85]' : 'text-amber-300') : (isDark ? 'text-[#7FA882]' : 'text-emerald-600')}`} />
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Min Payout & GST Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`font-black mb-1.5 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Minimum Payout Threshold (₹)</label>
            <input
              type="number" min="100" max="5000"
              value={minPayout}
              onChange={e => setMinPayout(Number(e.target.value))}
              className={`w-full px-4 py-2.5 rounded-2xl text-xs font-black outline-none font-mono transition-all ${
                isDark 
                  ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                  : 'bg-gray-50 border border-gray-200 text-farmGreen-950 focus:border-emerald-600'
              }`}
            />
            <p className={`text-[10px] font-bold mt-1 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>Payouts below ₹{minPayout} will roll over to next cycle.</p>
          </div>
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div>
              <div className={`font-black ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Include GST in Payouts</div>
              <div className={`text-[10px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>GST (18%) applied before farmer net settlement</div>
            </div>
            <Toggle value={gstIncluded} onChange={() => setGstIncluded(!gstIncluded)} isDark={isDark} />
          </div>
        </div>

        {/* Live GMV Revenue Projector Simulation */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.12)]' : 'bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className={`font-black text-xs uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-[#00FF85]' : 'text-emerald-950'}`}>
              <TrendingUp className="w-4 h-4" /> Live Revenue & Settlement Projector
            </h4>
            <span className={`text-[10px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-emerald-700'}`}>Simulated Platform GMV</span>
          </div>

          {/* GMV Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Starter', gmv: 100000, display: '₹1 Lakh' },
              { label: 'Growth', gmv: 500000, display: '₹5 Lakh' },
              { label: 'Scale', gmv: 2500000, display: '₹25 Lakh' },
              { label: 'Enterprise', gmv: 10000000, display: '₹1 Crore' },
            ].map(tier => {
              const platformRev = Math.round((tier.gmv * commission) / 100);
              const farmerNet = tier.gmv - platformRev;
              return (
                <div key={tier.label} className={`p-3.5 rounded-xl border text-center transition-all ${
                  isDark 
                    ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.15)]' 
                    : 'bg-white border-emerald-200/80 shadow-2xs'
                }`}>
                  <div className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{tier.label} ({tier.display})</div>
                  <div className={`font-black text-sm mt-1 ${isDark ? 'text-[#00FF85]' : 'text-emerald-800'}`}>
                    ₹{platformRev.toLocaleString('en-IN')}
                  </div>
                  <div className={`text-[9px] font-bold mt-0.5 ${isDark ? 'text-[#D4EAD9]' : 'text-gray-500'}`}>
                    Farmers: ₹{farmerNet.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>
          <p className={`text-[10px] font-medium ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
            * Net payouts calculated after deducting platform commission ({commission}%) {gstIncluded ? 'plus applicable GST reconciliation' : ''}.
          </p>
        </div>

        <div className="pt-2 text-right">
          <button 
            type="submit" 
            className={`px-8 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto ${
              isDark 
                ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md'
            }`}
          >
            <Save className="w-4 h-4" /> Save Commission Rules
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommissionTab;
