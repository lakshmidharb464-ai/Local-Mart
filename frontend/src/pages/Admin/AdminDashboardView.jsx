import React from 'react';
import { 
  Tractor, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  Truck, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const AdminDashboardView = ({ farmers = [], customers = [], products = [], orders = [], deliveryPartners = [], setActiveTab }) => {
  const totalFarmers = farmers.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalDrivers = deliveryPartners.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const pendingFarmersCount = farmers.filter(f => f.approvalStatus === 'Pending').length;
  const pendingProductsCount = products.filter(p => p.status === 'Pending').length;
  const pendingDriversCount = deliveryPartners.filter(p => p.approvalStatus === 'Pending').length;
  const activeDriversCount = deliveryPartners.filter(p => p.isOnline).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden bg-[#0F2818] bg-gradient-to-r from-[#08170D] via-[#0F2818] to-[#1B5E20] text-white p-6 sm:p-8 rounded-3xl shadow-farm-xl border border-emerald-700/50">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-md text-xs font-extrabold text-emerald-300 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Marketplace Ecosystem Sync</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-sm">
              Platform Overview Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-xl leading-relaxed">
              Real-time monitoring, direct farm supply chain analytics, producer governance, and delivery fleet dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('reports')}
              className="px-5 py-3 bg-white text-emerald-950 hover:bg-emerald-100 rounded-2xl text-xs font-black font-display shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 border border-white/80"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Full Analytics Hub</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Grid Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        
        {/* Farmers Card */}
        <div 
          onClick={() => setActiveTab('farmers')}
          className="group relative bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider">Farmers</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
              <Tractor className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-farmGreen-950 tracking-tight">{totalFarmers}</div>
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            {pendingFarmersCount > 0 ? (
              <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-200/60">
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>{pendingFarmersCount} Pending Approval</span>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>All Approved</span>
              </div>
            )}
          </div>
        </div>

        {/* Customers Card */}
        <div 
          onClick={() => setActiveTab('customers')}
          className="group relative bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider">Customers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-farmGreen-950 tracking-tight">{totalCustomers}</div>
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            <div className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Active Buyers</span>
            </div>
          </div>
        </div>

        {/* Delivery Fleet Card */}
        <div 
          onClick={() => setActiveTab('delivery')}
          className="group relative bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider">Fleet Boys</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all shadow-2xs">
              <Truck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-farmGreen-950 tracking-tight">{totalDrivers}</div>
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            {pendingDriversCount > 0 ? (
              <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-200/60">
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>{pendingDriversCount} Verification Pending</span>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-blue-700 inline-flex items-center gap-1">
                <Activity className="w-3 h-3 text-blue-600" />
                <span>{activeDriversCount} On Duty Now</span>
              </div>
            )}
          </div>
        </div>

        {/* Products Card */}
        <div 
          onClick={() => setActiveTab('products')}
          className="group relative bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider">Products</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
              <Package className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-farmGreen-950 tracking-tight">{totalProducts}</div>
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            {pendingProductsCount > 0 ? (
              <div className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-purple-200/60">
                <Clock className="w-3 h-3 text-purple-600" />
                <span>{pendingProductsCount} Awaiting Audit</span>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Catalog Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Orders Card */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="group relative bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider">Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
              <ShoppingCart className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-farmGreen-950 tracking-tight">{totalOrders}</div>
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            <div className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span>Live Order Flow</span>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div 
          onClick={() => setActiveTab('reports')}
          className="group relative bg-gradient-to-br from-emerald-900 via-farmGreen-900 to-emerald-950 p-5 rounded-2xl text-white shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-emerald-700/50 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-200/90 uppercase tracking-wider">GMV Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-emerald-300 group-hover:bg-white group-hover:text-emerald-900 transition-all shadow-2xs">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight truncate">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/10">
            <div className="text-[11px] font-bold text-emerald-300 inline-flex items-center gap-1">
              <span>Direct Farm Revenue</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Split Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Orders (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-display font-extrabold text-lg text-farmGreen-900">Recent Marketplace Orders</h3>
              <p className="text-xs text-farmMuted">Latest transactions between local customers & farm hubs</p>
            </div>
            <button 
              onClick={() => setActiveTab('orders')} 
              className="px-3.5 py-1.5 rounded-full bg-farmBg hover:bg-emerald-50 text-farmGreen-800 text-xs font-bold font-display transition-all flex items-center gap-1 cursor-pointer border border-emerald-200/60"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="p-4 bg-farmBg/60 hover:bg-emerald-50/40 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-farmGreen-900 bg-white px-2 py-0.5 rounded-lg border border-gray-200 shadow-2xs">
                      {ord.id}
                    </span>
                    <span className="font-bold text-sm text-farmGreen-950 truncate">{ord.customerName}</span>
                  </div>
                  <div className="text-xs text-farmMuted truncate mt-1">{ord.items}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-display font-extrabold text-base text-farmGreen-900">₹{ord.total}</div>
                  <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-0.5 ${
                    ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    ord.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pending Governance Audits (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-farmGreen-900">Pending Governance Audits</h3>
              <p className="text-xs text-farmMuted">Applications requiring admin verification</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Farmers Pending */}
            {farmers.filter(f => f.approvalStatus === 'Pending').map((farmer) => (
              <div key={farmer.id} className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <span>👨‍🌾</span>
                    <span className="truncate">Farmer KYC: {farmer.name}</span>
                  </div>
                  <div className="text-[11px] text-amber-800 truncate mt-0.5">{farmer.location} · {farmer.specialty}</div>
                </div>
                <button
                  onClick={() => setActiveTab('farmers')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold font-display shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Review
                </button>
              </div>
            ))}

            {/* Delivery Boys Pending */}
            {deliveryPartners.filter(p => p.approvalStatus === 'Pending').map((driver) => (
              <div key={driver.id} className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-xs text-orange-950 flex items-center gap-1.5">
                    <span>🛵</span>
                    <span className="truncate">Rider Audit: {driver.name}</span>
                  </div>
                  <div className="text-[11px] text-orange-800 truncate mt-0.5">{driver.vehicleType} · {driver.hubLocation}</div>
                </div>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold font-display shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Verify Rider
                </button>
              </div>
            ))}

            {farmers.filter(f => f.approvalStatus === 'Pending').length === 0 && 
             deliveryPartners.filter(p => p.approvalStatus === 'Pending').length === 0 && (
              <div className="p-8 text-center text-xs text-farmMuted bg-farmBg/60 rounded-2xl border border-dashed border-farmGreen-200 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-bold text-farmGreen-900">All Registrations Up To Date</div>
                <p className="text-[11px] text-farmMuted">No pending producer or rider KYC audits.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
