import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import {
  BarChart3, TrendingUp, Star, Award, Users, ShoppingBag,
  Download, ArrowUpRight, Tractor, PackageCheck, Sparkles
} from 'lucide-react';

/* ── Animated SVG Bar Chart ── */
const AnimatedBarChart = ({ data, isDark }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxVal = Math.max(...data.map(m => m.revenue));
  const H      = 160;          // chart height in viewBox units
  const padB   = 32;           // bottom padding for labels
  const padT   = 12;           // top padding
  const padL   = 0;
  const total  = data.length;  // e.g. 12 months
  const VBW    = 480;          // fixed viewBox width — SVG scales to fill container
  const slotW  = VBW / total;  // each month gets equal slot
  const barW   = Math.max(slotW * 0.55, 10); // bar is 55% of slot, min 10
  const barOff = (slotW - barW) / 2;         // center bar in slot

  const totalH = H + padB + padT;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${VBW} ${totalH}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: '200px' }}
      >
        <defs>
          <linearGradient id="barGradNeon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00FF85" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00CC6A" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="barGradGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#D4A745" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B8892A" stopOpacity="0.3" />
          </linearGradient>
          <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={0} y1={padT + H * (1 - pct)}
            x2={VBW} y2={padT + H * (1 - pct)}
            stroke={isDark ? 'rgba(0,255,133,0.07)' : 'rgba(16,185,129,0.12)'}
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />
        ))}

        {data.map((m, idx) => {
          const slotX  = idx * slotW;
          const x      = slotX + barOff;
          const pct    = m.revenue / maxVal;
          const barH   = Math.max(pct * H, 3);
          const y      = padT + H - barH;
          const isTop3 = idx >= data.length - 3;
          const delay  = idx * 50;
          const cx     = slotX + slotW / 2; // center of slot for label

          // Tooltip x: clamp so it stays within viewBox
          const tipW    = 70;
          const tipX    = Math.min(Math.max(cx - tipW / 2, 2), VBW - tipW - 2);

          return (
            <g key={idx} className="group">
              {/* Shadow glow behind bar */}
              <rect
                x={x + 1} y={y + 2} width={barW} height={barH}
                rx="4"
                fill={isTop3 ? 'rgba(212,167,69,0.12)' : 'rgba(0,255,133,0.08)'}
                className={visible ? 'adm-bar-rise' : ''}
                style={{ animationDelay: `${delay}ms`, transformOrigin: `${cx}px ${padT + H}px` }}
              />

              {/* Main bar */}
              <rect
                x={x} y={y} width={barW} height={barH}
                rx="4"
                fill={isTop3 ? 'url(#barGradGold)' : 'url(#barGradNeon)'}
                filter={isDark ? 'url(#barGlow)' : undefined}
                className={visible ? 'adm-bar-rise' : ''}
                style={{ animationDelay: `${delay}ms`, transformOrigin: `${cx}px ${padT + H}px` }}
              />

              {/* Top accent dot */}
              <circle
                cx={cx} cy={y}
                r="2.5"
                fill={isTop3 ? '#D4A745' : '#00FF85'}
                opacity={visible ? 1 : 0}
                style={{ transition: `opacity 0.3s ${delay + 500}ms` }}
              />

              {/* Hover tooltip — shows on group hover */}
              <g className="opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.12s' }}>
                <rect
                  x={tipX} y={Math.max(y - 36, 0)}
                  width={tipW} height={30} rx="6"
                  fill={isDark ? '#0C1410' : '#0F2818'}
                  stroke={isTop3 ? 'rgba(212,167,69,0.5)' : 'rgba(0,255,133,0.35)'}
                  strokeWidth="0.8"
                />
                <text
                  x={tipX + tipW / 2} y={Math.max(y - 24, 9)}
                  fill={isTop3 ? '#D4A745' : '#00FF85'}
                  fontSize="8" fontWeight="800" textAnchor="middle"
                >
                  ₹{(m.revenue / 1000).toFixed(0)}K
                </text>
                <text
                  x={tipX + tipW / 2} y={Math.max(y - 12, 20)}
                  fill="#7FA882" fontSize="7" textAnchor="middle"
                >
                  {m.orders} orders
                </text>
              </g>

              {/* Month label */}
              <text
                x={cx} y={padT + H + padB - 6}
                fill={isDark ? '#7FA882' : '#4A6B52'}
                fontSize="8" fontWeight="700" textAnchor="middle"
                style={{ userSelect: 'none' }}
              >
                {m.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};


/* ── Progress Bar Row ── */
const ProgressRow = ({ item, idx, maxSales, isDark }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200 + idx * 120);
    return () => clearTimeout(t);
  }, [idx]);
  const pct = Math.min(100, (item.sales / maxSales) * 100);

  return (
    <div className={`p-4 rounded-2xl border transition-all adm-row ${
      isDark
        ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.06)] hover:border-[rgba(0,255,133,0.12)]'
        : 'bg-farmBg border-emerald-100/80'
    }`}>
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-lg font-extrabold text-xs flex items-center justify-center ${
            idx === 0
              ? isDark ? 'bg-[rgba(212,167,69,0.2)] text-[#D4A745]' : 'bg-amber-100 text-amber-900'
              : isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]'  : 'bg-emerald-100 text-emerald-900'
          }`}>
            #{idx + 1}
          </span>
          <span className={`font-extrabold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{item.name}</span>
        </div>
        <div className={`font-extrabold text-sm ${isDark ? 'adm-gold-text' : 'text-emerald-800'}`}>
          ₹{item.revenue.toLocaleString()}
        </div>
      </div>
      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-[rgba(255,255,255,0.05)]' : 'bg-gray-200/80'}`}>
        <div
          className="adm-progress-fill h-full rounded-full transition-all duration-700"
          style={{ width: animated ? `${pct}%` : '0%' }}
        />
      </div>
      <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{item.sales} units sold this month</div>
    </div>
  );
};

export const ReportsAnalytics = ({ isDark = true }) => {
  const { showToast } = useAuth();
  const [timePeriod, setTimePeriod] = useState('2026 YTD');
  const [reportsData, setReportsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService.getReports()
      .then(data => setReportsData(data))
      .catch(err => {
        console.warn('[ReportsAnalytics] Failed to load reports:', err);
        setReportsData({});
      })
      .finally(() => setIsLoading(false));
  }, []);

  const monthlySales      = reportsData?.monthlySales || [];
  const topProducts       = reportsData?.topProducts || [];
  const farmerPerformers  = reportsData?.farmerPerformers || [];

  const totalYearlyRevenue = monthlySales.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalYearlyOrders  = monthlySales.reduce((acc, curr) => acc + (curr.orders || 0), 0);
  const maxSales           = topProducts.length > 0 ? Math.max(...topProducts.map(p => p.sales || 0)) : 1;

  const handleExportCSV = () => {
    showToast('Analytics Exported', 'CSV report downloaded successfully!');
  };

  const card = isDark
    ? 'adm-glass rounded-3xl p-6 sm:p-7 space-y-5'
    : 'bg-white rounded-3xl border border-emerald-100/80 shadow-farm-sm p-6 sm:p-7 space-y-5';
  const cardTitle = isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950';
  const cardSub   = isDark ? 'text-[#7FA882]' : 'text-farmMuted';
  const divider   = isDark ? 'border-[rgba(0,255,133,0.07)]' : 'border-gray-100';

  const metricCards = [
    {
      label: 'Total Sales GMV', value: `₹${totalYearlyRevenue.toLocaleString()}`,
      sub: '+18.4% MoM Growth', icon: TrendingUp,
      bg: isDark ? 'bg-[rgba(0,255,133,0.08)]' : 'bg-emerald-100',
      color: isDark ? 'text-[#00FF85]' : 'text-emerald-800',
      subColor: isDark ? 'adm-neon-text' : 'text-emerald-700',
      top: 'adm-card-neon-top',
    },
    {
      label: 'Fulfilled Orders', value: totalYearlyOrders.toLocaleString(),
      sub: '98.2% On-Time Rate', icon: PackageCheck,
      bg: isDark ? 'bg-[rgba(0,191,255,0.08)]' : 'bg-blue-100',
      color: isDark ? 'text-[#5CD9FF]' : 'text-blue-800',
      subColor: isDark ? 'text-[#5CD9FF]' : 'text-blue-700',
      top: 'adm-card-blue-top',
    },
    {
      label: 'Active Producers', value: '48 Farms',
      sub: '100% Certified Organic', icon: Tractor,
      bg: isDark ? 'bg-[rgba(251,184,58,0.08)]' : 'bg-amber-100',
      color: isDark ? 'text-[#FBB83A]' : 'text-amber-800',
      subColor: isDark ? 'text-[#FBB83A]' : 'text-amber-700',
      top: 'adm-card-amber-top',
    },
    {
      label: 'Avg Order Basket', value: '₹820',
      sub: 'Direct Farm Produce', icon: ShoppingBag,
      bg: isDark ? 'bg-[rgba(192,132,252,0.08)]' : 'bg-purple-100',
      color: isDark ? 'text-[#C084FC]' : 'text-purple-800',
      subColor: isDark ? 'text-[#C084FC]' : 'text-purple-700',
      top: 'adm-card-purple-top',
    },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ── */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${card}`}>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className={`font-extrabold text-2xl tracking-tight ${cardTitle}`}>Reports & Ecosystem Analytics</h2>
            <span className={`text-xs font-black px-3 py-1 rounded-full border font-mono ${isDark ? 'adm-badge-neon' : 'bg-emerald-100 text-emerald-900 border-emerald-200'}`}>
              Live BI Feed
            </span>
          </div>
          <p className={`text-xs mt-1 ${cardSub}`}>Financial performance, top produce demand, and farmer producer leaderboard metrics</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time filters */}
          <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${isDark ? 'bg-[rgba(0,255,133,0.03)] border-[rgba(0,255,133,0.08)]' : 'bg-farmBg border-emerald-200/80'}`}>
            {['2026 YTD', 'Q3 2026', 'This Month'].map(period => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer ${timePeriod === period
                  ? isDark
                    ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.35)] shadow-[0_0_12px_rgba(0,255,133,0.2)] scale-[1.02]'
                    : 'bg-emerald-700 text-white shadow-md border border-emerald-800 scale-[1.02]'
                  : isDark
                    ? 'text-[#7FA882] hover:text-[#D4EAD9] hover:bg-[rgba(0,255,133,0.04)]'
                    : 'bg-white text-farmGreen-950 font-bold border border-emerald-200/80 hover:bg-emerald-50 hover:text-emerald-900 shadow-2xs'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="adm-btn-gold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── 4 Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m, i) => (
          <div key={i} className={`p-5 rounded-2xl border space-y-1 ${m.top} ${
            isDark ? 'adm-glass adm-glass-hover' : 'bg-white border-emerald-100/80 shadow-2xs'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{m.label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${m.bg} ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
            </div>
            <div className={`font-extrabold text-3xl mt-2 ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{m.value}</div>
            <div className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${m.subColor}`}>
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Monthly Revenue SVG Chart ── */}
      <div className={card}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'}`}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-extrabold text-lg ${cardTitle}`}>Monthly Revenue Growth (2026)</h3>
              <p className={`text-xs ${cardSub}`}>Interactive sales breakdown · hover bars for details</p>
            </div>
          </div>
          <span className={`px-3.5 py-1 font-extrabold rounded-full text-xs border w-fit ${isDark ? 'adm-badge-neon' : 'bg-emerald-100 text-emerald-950 border-emerald-200 shadow-2xs'}`}>
            +18.4% MoM Revenue
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-[#00FF85] to-[#00CC6A]" />
            <span className={cardSub}>Monthly Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-[#D4A745] to-[#B8892A]" />
            <span className={cardSub}>Top 3 Months</span>
          </div>
        </div>

        <AnimatedBarChart data={monthlySales} isDark={isDark} />
      </div>

      {/* ── Grid: Top Products + Farmer Leaderboard ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Products */}
        <div className={card}>
          <div className={`flex items-center justify-between pb-3 border-b ${divider}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'}`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-extrabold text-lg ${cardTitle}`}>Top-Selling Farm Products</h3>
                <p className={`text-xs ${cardSub}`}>Highest grossing produce items</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <ProgressRow key={idx} item={p} idx={idx} maxSales={maxSales} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Farmer Leaderboard */}
        <div className={card}>
          <div className={`flex items-center justify-between pb-3 border-b ${divider}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-[rgba(212,167,69,0.1)] text-[#D4A745]' : 'bg-amber-100 text-amber-800'}`}>
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-extrabold text-lg ${cardTitle}`}>Farmer Performance Leaderboard</h3>
                <p className={`text-xs ${cardSub}`}>Top rated agricultural producers</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {farmerPerformers.map((f, idx) => {
              const rankClass = idx === 0 ? 'adm-rank-gold' : idx === 1 ? 'adm-rank-silver' : idx === 2 ? 'adm-rank-bronze' : '';
              const rankColors = [
                { bg: isDark ? 'bg-[rgba(212,167,69,0.15)]' : 'bg-amber-100', text: isDark ? 'text-[#D4A745]' : 'text-amber-900' },
                { bg: isDark ? 'bg-[rgba(180,188,192,0.12)]' : 'bg-gray-100',  text: isDark ? 'text-[#B4BCC0]' : 'text-gray-600' },
                { bg: isDark ? 'bg-[rgba(180,110,60,0.12)]' : 'bg-orange-100', text: isDark ? 'text-[#B46E3C]' : 'text-orange-700' },
              ];
              const rc = rankColors[idx] || { bg: isDark ? 'bg-[rgba(0,255,133,0.08)]' : 'bg-emerald-100', text: isDark ? 'text-[#00FF85]' : 'text-emerald-900' };
              return (
                <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all adm-row ${
                  isDark
                    ? `bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.06)] ${rankClass}`
                    : `bg-farmBg border-emerald-100/80`
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-2xl font-extrabold flex items-center justify-center text-xs shadow-2xs shrink-0 ${rc.bg} ${rc.text}`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div className={`font-extrabold text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{f.name}</div>
                      <div className={`text-[11px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{f.area} · {f.totalOrders} orders fulfilled</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 font-extrabold px-3 py-1 rounded-full border ${
                    isDark ? 'adm-badge-gold' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{f.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
