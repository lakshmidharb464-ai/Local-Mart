import React, { useEffect, useRef, useState } from 'react';
import {
  Tractor, Users, Package, ShoppingCart, TrendingUp, AlertCircle,
  ArrowUpRight, Truck, Activity, CheckCircle2, Clock, ShieldAlert,
  Sparkles, ChevronRight, Zap
} from 'lucide-react';

/* ── Animated counter hook ── */
function useCountUp(target, duration = 1200, isDark) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  useEffect(() => {
    setValue(0);
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, isDark]);
  return value;
}

/* ── Mini Sparkline SVG ── */
const Sparkline = ({ data, color = '#00FF85', isDark }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80; const h = 24;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={pts.split(' ').at(-1).split(',')[0]} cy={pts.split(' ').at(-1).split(',')[1]} r="2.5" fill={color} />
    </svg>
  );
};

const SPARKLINE_DATA = {
  farmers:   [12, 18, 14, 22, 19, 25, 28],
  customers: [40, 55, 48, 62, 70, 65, 80],
  drivers:   [3, 5, 4, 6, 5, 7, 8],
  products:  [80, 95, 88, 102, 98, 115, 110],
  orders:    [20, 35, 28, 42, 38, 50, 55],
  revenue:   [120, 180, 160, 220, 200, 260, 280],
};

/* ── Stat Card ── */
const StatCard = ({ label, value, prefix = '', suffix = '', icon: Icon, colorTop, iconBg, iconColor, sub, subIcon: SubIcon, subType, sparkData, sparkColor, onClick, isDark, delay = 0 }) => {
  const animVal = useCountUp(typeof value === 'number' ? value : 0, 1400, isDark);
  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-2xl border cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 ${colorTop} ${
        isDark
          ? 'adm-glass adm-glass-hover shadow-lg'
          : 'bg-white border-emerald-100/80 shadow-xs hover:shadow-xl'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle glow bg on hover */}
      {isDark && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${sparkColor}0A 0%, transparent 70%)` }} />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{label}</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            isDark
              ? `bg-[${iconBg}] group-hover:adm-neon-glow-sm`
              : `bg-opacity-80 group-hover:text-white`
          }`} style={{ backgroundColor: isDark ? `${sparkColor}18` : undefined, color: isDark ? sparkColor : undefined }}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div className={`font-display font-black text-3xl tracking-tight adm-count-anim font-mono tabular-nums ${isDark ? '' : 'text-farmGreen-950'}`}
          style={{ color: isDark ? '#D4EAD9' : undefined }}>
          {prefix}{typeof value === 'number' ? animVal.toLocaleString() : value}{suffix}
        </div>

        {/* Sparkline */}
        {sparkData && (
          <div className="mt-2 mb-1">
            <Sparkline data={sparkData} color={sparkColor} isDark={isDark} />
          </div>
        )}

        <div className={`mt-2 pt-2 border-t ${isDark ? 'border-[rgba(0,255,133,0.06)]' : 'border-gray-100'}`}>
          {sub && (
            <div className={`text-[11px] font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
              subType === 'warn'
                ? isDark ? 'adm-badge-amber' : 'text-amber-700 bg-amber-50 border border-amber-200/60'
                : isDark ? 'adm-badge-neon' : 'text-emerald-700'
            }`}>
              {SubIcon && <SubIcon className="w-3 h-3 shrink-0" />}
              <span>{sub}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardView = ({ farmers = [], customers = [], products = [], orders = [], deliveryPartners = [], setActiveTab, isDark = true }) => {
  const totalFarmers   = farmers.length;
  const totalCustomers = customers.length;
  const totalProducts  = products.length;
  const totalOrders    = orders.length;
  const totalDrivers   = deliveryPartners.length;
  const totalRevenue   = orders.reduce((sum, o) => sum + o.total, 0);

  const pendingFarmersCount  = farmers.filter(f => f.approvalStatus === 'Pending').length;
  const pendingProductsCount = products.filter(p => p.status === 'Pending').length;
  const pendingDriversCount  = deliveryPartners.filter(p => p.approvalStatus === 'Pending').length;
  const activeDriversCount   = deliveryPartners.filter(p => p.isOnline).length;

  const card = isDark ? 'adm-glass rounded-3xl border-[rgba(0,255,133,0.08)]' : 'bg-white rounded-3xl border border-emerald-100/80 shadow-farm-sm';
  const cardTitle = isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-900';
  const cardSub   = isDark ? 'text-[#7FA882]' : 'text-farmMuted';

  return (
    <div className="space-y-8 pb-8">

      {/* ── Hero Banner ── */}
      <div className={`relative overflow-hidden rounded-3xl adm-grain ${
        isDark
          ? 'bg-gradient-to-r from-[#060C08] via-[#0A1A0E] to-[#0D2010] border border-[rgba(0,255,133,0.1)] shadow-[0_8px_48px_rgba(0,0,0,0.6)]'
          : 'bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] border border-emerald-700/50 shadow-farm-xl'
      } text-white p-6 sm:p-8`}>

        {/* Orbs */}
        <div className={`absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full blur-3xl pointer-events-none adm-orb ${isDark ? 'bg-[rgba(0,255,133,0.08)]' : 'bg-emerald-400/10'}`} />
        <div className={`absolute bottom-0 left-1/3 -mb-12 w-56 h-56 rounded-full blur-2xl pointer-events-none adm-orb-2 ${isDark ? 'bg-[rgba(212,167,69,0.07)]' : 'bg-amber-400/10'}`} />
        {isDark && (
          <div className="absolute top-4 left-4 w-1 h-24 bg-gradient-to-b from-[#00FF85] to-transparent opacity-30 rounded-full pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Live badge */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-extrabold border ${
              isDark
                ? 'bg-[rgba(0,255,133,0.1)] border-[rgba(0,255,133,0.25)] text-[#00FF85]'
                : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#00FF85]' : 'bg-emerald-400'} animate-ping`} />
              <span>Live Marketplace Ecosystem Sync</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight drop-shadow-sm">
              Platform Overview Dashboard
            </h2>
            <p className={`text-xs sm:text-sm font-medium max-w-xl leading-relaxed ${isDark ? 'text-[#7FA882]' : 'text-emerald-100/90'}`}>
              Real-time monitoring, direct farm supply chain analytics, producer governance, and delivery fleet dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-5 py-3 rounded-2xl text-xs font-black font-display shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 ${
                isDark
                  ? 'adm-btn-gold'
                  : 'bg-white text-emerald-950 hover:bg-emerald-100 border border-white/80 hover:shadow-2xl'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Full Analytics Hub</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 6 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        <StatCard
          label="Farmers"        value={totalFarmers}    icon={Tractor}
          colorTop="adm-card-neon-top"   sparkColor="#00FF85"
          sparkData={SPARKLINE_DATA.farmers}
          sub={pendingFarmersCount > 0 ? `${pendingFarmersCount} Pending Approval` : 'All Approved'}
          subIcon={pendingFarmersCount > 0 ? AlertCircle : CheckCircle2}
          subType={pendingFarmersCount > 0 ? 'warn' : 'ok'}
          onClick={() => setActiveTab('farmers')} isDark={isDark} delay={0}
        />
        <StatCard
          label="Customers"      value={totalCustomers}  icon={Users}
          colorTop="adm-card-blue-top"   sparkColor="#00BFFF"
          sparkData={SPARKLINE_DATA.customers}
          sub="Active Buyers"    subIcon={CheckCircle2}  subType="ok"
          onClick={() => setActiveTab('customers')} isDark={isDark} delay={60}
        />
        <StatCard
          label="Fleet Riders"   value={totalDrivers}    icon={Truck}
          colorTop="adm-card-amber-top"  sparkColor="#FBB83A"
          sparkData={SPARKLINE_DATA.drivers}
          sub={pendingDriversCount > 0 ? `${pendingDriversCount} Verification Pending` : `${activeDriversCount} On Duty Now`}
          subIcon={pendingDriversCount > 0 ? AlertCircle : Activity}
          subType={pendingDriversCount > 0 ? 'warn' : 'ok'}
          onClick={() => setActiveTab('delivery')} isDark={isDark} delay={120}
        />
        <StatCard
          label="Products"       value={totalProducts}   icon={Package}
          colorTop="adm-card-purple-top" sparkColor="#C084FC"
          sparkData={SPARKLINE_DATA.products}
          sub={pendingProductsCount > 0 ? `${pendingProductsCount} Awaiting Audit` : 'Catalog Verified'}
          subIcon={pendingProductsCount > 0 ? Clock : CheckCircle2}
          subType={pendingProductsCount > 0 ? 'warn' : 'ok'}
          onClick={() => setActiveTab('products')} isDark={isDark} delay={180}
        />
        <StatCard
          label="Orders"         value={totalOrders}     icon={ShoppingCart}
          colorTop="adm-card-neon-top"   sparkColor="#00FF85"
          sparkData={SPARKLINE_DATA.orders}
          sub="Live Order Flow"  subIcon={Activity}      subType="ok"
          onClick={() => setActiveTab('orders')} isDark={isDark} delay={240}
        />

        {/* Revenue Card — Gold accent */}
        <div
          onClick={() => setActiveTab('reports')}
          className={`group relative p-5 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 adm-card-gold-top ${
            isDark
              ? 'adm-glass adm-glass-hover adm-gold-glow'
              : 'bg-gradient-to-br from-emerald-900 via-farmGreen-900 to-emerald-950 text-white shadow-lg shadow-emerald-950/20 border border-emerald-700/50'
          }`}
          style={{ animationDelay: '300ms' }}
        >
          {isDark && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,167,69,0.08) 0%, transparent 70%)' }} />
          )}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#D4A745]' : 'text-emerald-200/90'}`}>GMV Revenue</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-[rgba(212,167,69,0.12)] text-[#D4A745] group-hover:adm-gold-glow-sm' : 'bg-white/15 backdrop-blur-md text-emerald-300 group-hover:bg-white group-hover:text-emerald-900'}`}>
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className={`font-display font-black text-2xl sm:text-3xl tracking-tight truncate ${isDark ? 'adm-gold-text' : 'text-white'}`}>
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="mt-2 mb-1">
              <Sparkline data={SPARKLINE_DATA.revenue} color="#D4A745" isDark={isDark} />
            </div>
            <div className={`mt-2 pt-2 border-t ${isDark ? 'border-[rgba(212,167,69,0.1)]' : 'border-white/10'}`}>
              <div className={`text-[11px] font-bold inline-flex items-center gap-1 ${isDark ? 'adm-badge-gold px-2 py-0.5 rounded-full' : 'text-emerald-300'}`}>
                <Zap className="w-3 h-3" />
                <span>Direct Farm Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Split Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Orders */}
        <div className={`lg:col-span-7 p-6 sm:p-7 space-y-5 ${card}`}>
          <div className={`flex justify-between items-center pb-3 border-b ${isDark ? 'border-[rgba(0,255,133,0.07)]' : 'border-gray-100'}`}>
            <div>
              <h3 className={`font-display font-extrabold text-lg ${cardTitle}`}>Recent Marketplace Orders</h3>
              <p className={`text-xs ${cardSub}`}>Latest transactions between local customers & farm hubs</p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-display transition-all flex items-center gap-1 cursor-pointer border ${
                isDark
                  ? 'adm-btn-neon'
                  : 'bg-farmBg hover:bg-emerald-50 text-farmGreen-800 border-emerald-200/60'
              }`}
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className={`adm-row p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isDark
                  ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.06)] hover:border-[rgba(0,255,133,0.12)]'
                  : 'bg-farmBg/60 hover:bg-emerald-50/40 border-gray-100 hover:border-emerald-200'
              }`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg border shadow-2xs ${
                      isDark ? 'bg-[rgba(0,255,133,0.06)] border-[rgba(0,255,133,0.12)] text-[#00FF85]' : 'bg-white border-gray-200 text-farmGreen-900'
                    }`}>
                      {ord.id}
                    </span>
                    <span className={`font-bold text-sm truncate ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{ord.customerName}</span>
                  </div>
                  <div className={`text-xs truncate mt-1 ${cardSub}`}>{ord.items}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-display font-extrabold text-base ${isDark ? 'adm-gold-text' : 'text-farmGreen-900'}`}>
                    ₹{ord.total}
                  </div>
                  <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-0.5 ${
                    ord.status === 'Delivered'
                      ? isDark ? 'adm-badge-neon' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : ord.status === 'Out for Delivery'
                      ? isDark ? 'adm-badge-blue'  : 'bg-blue-100 text-blue-800 border border-blue-200'
                      : isDark ? 'adm-badge-amber' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Governance Audits */}
        <div className={`lg:col-span-5 p-6 sm:p-7 space-y-5 ${card}`}>
          <div className={`flex items-center gap-2.5 pb-3 border-b ${isDark ? 'border-[rgba(0,255,133,0.07)]' : 'border-gray-100'}`}>
            <div className={`p-2 rounded-xl ${isDark ? 'bg-[rgba(251,184,58,0.12)] text-[#FBB83A]' : 'bg-amber-100 text-amber-800'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-display font-extrabold text-lg ${cardTitle}`}>Pending Governance Audits</h3>
              <p className={`text-xs ${cardSub}`}>Applications requiring admin verification</p>
            </div>
          </div>

          <div className="space-y-3">
            {farmers.filter(f => f.approvalStatus === 'Pending').map((farmer) => (
              <div key={farmer.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark
                  ? 'bg-[rgba(251,184,58,0.04)] border-[rgba(251,184,58,0.15)]'
                  : 'bg-amber-50/70 border-amber-200/80'
              }`}>
                <div className="min-w-0">
                  <div className={`font-bold text-xs flex items-center gap-1.5 ${isDark ? 'text-[#FBB83A]' : 'text-amber-950'}`}>
                    <span>👨‍🌾</span>
                    <span className="truncate">Farmer KYC: {farmer.name}</span>
                  </div>
                  <div className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-amber-800'}`}>
                    {farmer.location} · {farmer.specialty}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('farmers')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display shadow-xs transition-all shrink-0 cursor-pointer ${
                    isDark
                      ? 'adm-badge-amber hover:bg-[rgba(251,184,58,0.2)]'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  Review
                </button>
              </div>
            ))}

            {deliveryPartners.filter(p => p.approvalStatus === 'Pending').map((driver) => (
              <div key={driver.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark
                  ? 'bg-[rgba(0,191,255,0.04)] border-[rgba(0,191,255,0.12)]'
                  : 'bg-orange-50/70 border-orange-200/80'
              }`}>
                <div className="min-w-0">
                  <div className={`font-bold text-xs flex items-center gap-1.5 ${isDark ? 'text-[#5CD9FF]' : 'text-orange-950'}`}>
                    <span>🛵</span>
                    <span className="truncate">Rider Audit: {driver.name}</span>
                  </div>
                  <div className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-orange-800'}`}>
                    {driver.vehicleType} · {driver.hubLocation}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display shadow-xs transition-all shrink-0 cursor-pointer ${
                    isDark
                      ? 'adm-badge-blue hover:bg-[rgba(0,191,255,0.18)]'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  Verify Rider
                </button>
              </div>
            ))}

            {farmers.filter(f => f.approvalStatus === 'Pending').length === 0 &&
             deliveryPartners.filter(p => p.approvalStatus === 'Pending').length === 0 && (
              <div className={`p-8 text-center text-xs rounded-2xl border border-dashed space-y-2 ${
                isDark
                  ? 'bg-[rgba(0,255,133,0.02)] border-[rgba(0,255,133,0.1)] text-[#7FA882]'
                  : 'bg-farmBg/60 border-farmGreen-200 text-farmMuted'
              }`}>
                <CheckCircle2 className="w-6 h-6 text-[#00FF85] mx-auto" />
                <div className={`font-bold ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-900'}`}>All Registrations Up To Date</div>
                <p className={`text-[11px] ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>No pending producer or rider KYC audits.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
