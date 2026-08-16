import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, ShoppingCart, TrendingUp, AlertTriangle, ArrowUpRight, CheckCircle2, Clock, Plus, ChevronRight, Sprout } from 'lucide-react';

export const FarmerDashboardView = ({ products, orders, setActiveTab, setShowAddModal }) => {
  const { t } = useTranslation();

  // Calculations
  const totalProducts = products.length;
  const todayOrders = orders.filter(o => o.date.includes('Today') || o.date.includes('10:15 AM'));
  const todayOrdersCount = todayOrders.length || 3;
  
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockProducts = products.filter(p => p.stock < 15);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-farmGreen-900 via-farmGreen-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-farm-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-xs font-semibold text-emerald-300 mb-1 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Farm-to-Consumer Portal</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {t('welcomeBack')}
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1">{t('heroDesc')}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('products');
            if (setShowAddModal) setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-farmOrange-500 to-farmOrange-600 hover:from-farmOrange-600 hover:to-farmOrange-700 text-white rounded-2xl text-xs font-bold font-display transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('quickAddCrop')}</span>
        </button>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* 1. Total Products Card */}
        <button
          onClick={() => setActiveTab('products')}
          className="text-left w-full bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-3 hover:shadow-farm-md hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider group-hover:text-farmGreen-900 transition-colors">{t('totalCrops')}</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-farmGreen-900">{totalProducts}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active catalog listings →</span>
            </div>
          </div>
        </button>

        {/* 2. Today's Orders Card */}
        <button
          onClick={() => setActiveTab('orders')}
          className="text-left w-full bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-3 hover:shadow-farm-md hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider group-hover:text-blue-900 transition-colors">Today's Orders</span>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-farmGreen-900">{todayOrdersCount} Orders</div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Ready for dispatch →</span>
            </div>
          </div>
        </button>

        {/* 3. Total Sales Card */}
        <button
          onClick={() => setActiveTab('sales')}
          className="text-left w-full bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-3 hover:shadow-farm-md hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider group-hover:text-amber-900 transition-colors">Total Sales</span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-farmGreen-900">₹{totalSales.toLocaleString()}</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>View Revenue Breakdown →</span>
            </div>
          </div>
        </button>

        {/* 4. Low-Stock Alert Card */}
        <button
          onClick={() => setActiveTab('inventory')}
          className="text-left w-full bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-3 hover:shadow-farm-md hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-farmMuted uppercase tracking-wider group-hover:text-rose-900 transition-colors">Low-Stock Alert</span>
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-farmGreen-900">{lowStockProducts.length} Items</div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <span>Manage Stock Levels →</span>
            </div>
          </div>
        </button>

      </div>

      {/* Two Column Layout: Low Stock Widget & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low-Stock Products Card */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-display font-extrabold text-base text-farmGreen-900">Low-Stock Produce</h3>
            </div>
            <button 
              onClick={() => setActiveTab('inventory')} 
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Stock</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(p => (
                <div key={p.id} className="p-3 bg-farmBg rounded-2xl border border-gray-200/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <div className="font-extrabold text-farmGreen-900">{p.name}</div>
                      <div className="text-[11px] text-farmMuted">{p.category} · ₹{p.price}/{p.unit}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-full border border-rose-200">
                      {p.stock} units left
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-farmMuted italic text-center py-6">All produce stock levels are healthy!</div>
            )}
          </div>
        </div>

        {/* Recent Incoming Orders Card */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 shadow-farm-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h3 className="font-display font-extrabold text-base text-farmGreen-900">Recent Customer Orders</h3>
            </div>
            <button 
              onClick={() => setActiveTab('orders')} 
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 3).map(ord => (
              <div key={ord.id} className="p-3 bg-farmBg rounded-2xl border border-gray-200/70 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-farmGreen-900">{ord.id}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {ord.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-farmMuted mt-0.5">{ord.customerName} · {ord.items}</div>
                </div>
                <div className="font-display font-extrabold text-sm text-farmGreen-900">
                  ₹{ord.total}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
