import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { REPORTS_DATA } from '../../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Star,
  Award,
  Users,
  ShoppingBag,
  Download,
  Calendar,
  DollarSign,
  PackageCheck,
  Tractor,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const ReportsAnalytics = () => {
  const { showToast } = useAuth();
  const [timePeriod, setTimePeriod] = useState('2026 YTD');

  const maxRevenue = Math.max(...REPORTS_DATA.monthlySales.map(m => m.revenue));
  const totalYearlyRevenue = REPORTS_DATA.monthlySales.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalYearlyOrders = REPORTS_DATA.monthlySales.reduce((acc, curr) => acc + curr.orders, 0);

  const handleExportCSV = () => {
    showToast('Analytics Exported', 'CSV report downloaded successfully!');
  };

  return (
    <div className="space-y-6 animate-fadeIn font-display pb-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-extrabold text-2xl text-farmGreen-950 tracking-tight">Reports & Ecosystem Analytics</h2>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 shadow-2xs font-mono">
              Live BI Feed
            </span>
          </div>
          <p className="text-xs text-farmMuted mt-1">Financial performance, top produce demand, and farmer producer leaderboard metrics</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter Pills */}
          <div className="flex items-center gap-1.5 bg-farmBg p-1.5 rounded-2xl border border-emerald-200/80">
            {['2026 YTD', 'Q3 2026', 'This Month'].map(period => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer ${timePeriod === period
                    ? 'bg-[#0F2818] text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40 scale-[1.02]'
                    : 'bg-white text-[#0A2214] border border-emerald-200/80 hover:bg-emerald-100/70 hover:text-emerald-950 shadow-2xs'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-5 py-3 bg-gradient-to-r from-farmGreen-700 via-emerald-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-emerald-600 text-white rounded-2xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Total Sales GMV</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-farmGreen-950 mt-2">₹{totalYearlyRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% MoM Growth</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Fulfilled Orders</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-2xs">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-blue-950 mt-2">{totalYearlyOrders.toLocaleString()}</div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">98.2% On-Time Delivery Rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Active Producers</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-2xs">
              <Tractor className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-amber-950 mt-2">48 Farms</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">100% Certified Organic</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider">Avg Order Basket</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-extrabold text-3xl text-purple-950 mt-2">₹820</div>
          <div className="text-[11px] text-purple-700 font-bold mt-1">Direct Farm Produce Value</div>
        </div>
      </div>

      {/* Monthly Sales & Revenue Graph */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-farmGreen-950">Monthly Revenue Growth (2026)</h3>
              <p className="text-xs text-farmMuted">Interactive sales breakdown by month</p>
            </div>
          </div>

          <span className="px-3.5 py-1 bg-emerald-100 text-emerald-950 font-extrabold rounded-full text-xs border border-emerald-200 shadow-2xs w-fit">
            +18.4% MoM Revenue Increase
          </span>
        </div>

        {/* Bar Graph */}
        <div className="h-64 flex items-end gap-3 pt-8 pb-4 border-b border-emerald-100/80">
          {REPORTS_DATA.monthlySales.map((m, idx) => {
            const heightPercent = Math.round((m.revenue / maxRevenue) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-[#0F2818] text-white text-[11px] py-1.5 px-3 rounded-xl font-bold pointer-events-none whitespace-nowrap shadow-xl border border-emerald-500 z-10">
                  ₹{m.revenue.toLocaleString()} ({m.orders} orders)
                </div>

                <div
                  className="w-full bg-gradient-to-t from-[#08170D] via-[#0F2818] to-emerald-500 group-hover:from-emerald-700 group-hover:to-emerald-400 rounded-t-xl transition-all duration-300 shadow-md group-hover:scale-[1.03]"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] font-extrabold text-farmGreen-950 group-hover:text-emerald-700 transition-colors">
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Top Selling Products & Farmer Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top-Selling Products */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-farmGreen-950">Top-Selling Farm Products</h3>
                <p className="text-xs text-farmMuted">Highest grossing produce items</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {REPORTS_DATA.topProducts.map((p, idx) => (
              <div key={idx} className="p-4 bg-farmBg rounded-2xl border border-emerald-100/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-extrabold text-farmGreen-950 text-sm">{p.name}</span>
                  </div>
                  <div className="font-extrabold text-sm text-emerald-800">
                    ₹{p.revenue.toLocaleString()}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-farmGreen-700 to-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (p.sales / 650) * 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-farmMuted font-bold">{p.sales} units sold this month</div>
              </div>
            ))}
          </div>
        </div>

        {/* Farmer Performance Leaderboard */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-farmGreen-950">Farmer Performance Leaderboard</h3>
                <p className="text-xs text-farmMuted">Top rated agricultural producers</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {REPORTS_DATA.farmerPerformers.map((f, idx) => (
              <div key={idx} className="p-4 bg-farmBg rounded-2xl border border-emerald-100/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-farmGreen-700 to-emerald-800 text-white font-extrabold flex items-center justify-center text-xs shadow-2xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-farmGreen-950">{f.name}</div>
                    <div className="text-[11px] text-farmMuted font-bold mt-0.5">{f.area} · {f.totalOrders} orders fulfilled</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{f.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
