import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Boxes, 
  AlertTriangle, 
  Plus, 
  Minus, 
  CheckCircle2, 
  XCircle, 
  Search, 
  RefreshCw, 
  Power,
  Package,
  MapPin,
  Sparkles,
  ArrowUpDown,
  Download,
  IndianRupee,
  TrendingUp,
  X,
  Check,
  Zap,
  Tag,
  Sprout,
  Sun,
  Leaf,
  LayoutGrid,
  Table as TableIcon,
  PieChart,
  Edit2
} from 'lucide-react';

export const FarmerInventory = ({ products = [], setProducts }) => {
  const { showToast } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'low' | 'unavailable' | 'chittoor'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table' | 'analytics'

  // Quick Restock Modal State
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockAmount, setRestockAmount] = useState(25);

  // Price Edit Modal State
  const [editPriceProduct, setEditPriceProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  // Filtering & Sorting
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.farmerLocation && p.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesSearch || !matchesCategory) return false;

      if (filterMode === 'low') return p.stock < 15;
      if (filterMode === 'unavailable') return p.isUnavailable || p.stock === 0;
      if (filterMode === 'chittoor') {
        return (
          p.farmerLocation?.includes('Chittoor') || 
          p.farmerLocation?.includes('Andhra Pradesh') || 
          p.farmerLocation?.includes('Palamaner') ||
          p.farmerLocation?.includes('Madanapalle') ||
          p.name?.includes('Chittoor') ||
          p.name?.includes('Palamaner') ||
          p.name?.includes('Madanapalle')
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      if (sortBy === 'stock-desc') return b.stock - a.stock;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  // Calculate Metrics
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock < 15).length;
  const unavailableCount = products.filter(p => p.isUnavailable || p.stock === 0).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const chittoorCount = products.filter(p => 
    p.farmerLocation?.includes('Chittoor') || 
    p.farmerLocation?.includes('Palamaner') || 
    p.farmerLocation?.includes('Madanapalle') || 
    p.name?.includes('Chittoor')
  ).length;

  const handleUpdateStock = (id, delta, name) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const handleToggleAvailability = (id, currentStatus, name) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const isUnavailable = !p.isUnavailable;
        return { ...p, isUnavailable };
      }
      return p;
    }));
    if (showToast) showToast('Status Updated', `${name} sales status updated.`);
  };

  const handleBatchRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockProduct) return;
    const addQty = parseInt(restockAmount) || 0;
    setProducts(products.map(p => {
      if (p.id === restockProduct.id) {
        return { ...p, stock: p.stock + addQty, isUnavailable: false };
      }
      return p;
    }));
    if (showToast) {
      showToast('Fresh Harvest Added! 🌾', `Added +${addQty} ${restockProduct.unit}s of ${restockProduct.name}.`);
    }
    setRestockProduct(null);
  };

  const handleSavePriceUpdate = (e) => {
    e.preventDefault();
    if (!editPriceProduct) return;
    const updatedPrice = parseFloat(newPrice) || editPriceProduct.price;
    setProducts(products.map(p => {
      if (p.id === editPriceProduct.id) {
        return { ...p, price: updatedPrice };
      }
      return p;
    }));
    if (showToast) {
      showToast('Price Updated 🏷️', `Price set to ₹${updatedPrice}/${editPriceProduct.unit}.`);
    }
    setEditPriceProduct(null);
  };

  const handleExportCSV = () => {
    if (showToast) showToast('Report Downloaded 📊', 'Inventory summary report saved to downloads.');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-display">

      {/* Top Glassmorphism Banner Header */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2214] to-[#122a18] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-lg">
              <Boxes className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {t('inventoryTitle') || 'Crop Inventory & Stock Control'}
                </h1>
                {chittoorCount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs">
                    📍 Chittoor AP Harvest
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80 font-medium mt-1">
                {t('inventorySubtitle') || 'Monitor live yield stocks, 1-tap harvest updates & price management.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md shrink-0 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Inventory Report</span>
          </button>
        </div>

        {/* Quick Helper Tip Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-300 font-bold">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Tap <strong>"+10"</strong> or <strong>"+50"</strong> on any crop card after bringing fresh harvest from your fields!</span>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Stock */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1 hover:border-emerald-200 transition-all">
          <div className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Harvest Stock</span>
          </div>
          <div className="font-black text-2xl text-farmGreen-950">
            {totalStockUnits.toLocaleString()} units
          </div>
          <div className="text-[11px] text-emerald-700 font-extrabold">Across {products.length} Crops</div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm space-y-1 hover:border-rose-200 transition-all">
          <div className="text-rose-600 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Low Stock Alert</span>
          </div>
          <div className="font-black text-2xl text-rose-700">
            {lowStockCount} Crops
          </div>
          <div className="text-[11px] text-rose-600 font-extrabold">Needs fresh harvest (&lt;15)</div>
        </div>

        {/* Estimated Value */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1 hover:border-emerald-200 transition-all">
          <div className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Est. Market Valuation</span>
          </div>
          <div className="font-black text-2xl text-emerald-800">
            ₹{totalInventoryValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-extrabold">Active listing value</div>
        </div>

        {/* Unavailable */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1 hover:border-gray-200 transition-all">
          <div className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-gray-500" />
            <span>Sold Out / Paused</span>
          </div>
          <div className="font-black text-2xl text-gray-700">
            {unavailableCount} Crops
          </div>
          <div className="text-[11px] text-gray-500 font-extrabold">Market sales paused</div>
        </div>

      </div>

      {/* Interactive Controls Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        
        {/* Tier 1: Filter Navigation Tabs (Left) & View Mode Switcher (Right) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { key: 'all', label: 'All Crops', count: products.length, icon: Sprout, color: 'text-emerald-400' },
              { key: 'low', label: 'Low Stock', count: lowStockCount, isWarning: lowStockCount > 0, icon: AlertTriangle, color: 'text-amber-400' },
              { key: 'chittoor', label: 'Chittoor AP', count: chittoorCount, icon: MapPin, color: 'text-amber-300' },
              { key: 'unavailable', label: 'Paused / Sold Out', count: unavailableCount, icon: Power, color: 'text-gray-400' }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isSelected = filterMode === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilterMode(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? tab.isWarning
                        ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400/40'
                        : 'bg-gradient-to-r from-farmGreen-800 to-farmGreen-950 text-white shadow-sm ring-1 ring-emerald-500/30'
                      : 'text-farmMuted hover:text-farmGreen-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : tab.isWarning ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher Pills */}
          <div className="flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl shrink-0 border border-gray-200/60 self-start sm:self-auto">
            {[
              { id: 'grid', label: 'Cards', icon: LayoutGrid },
              { id: 'table', label: 'Table', icon: TableIcon },
              { id: 'analytics', label: 'Analytics', icon: PieChart }
            ].map(vm => {
              const IconComp = vm.icon;
              const isVmSelected = viewMode === vm.id;
              return (
                <button
                  key={vm.id}
                  onClick={() => setViewMode(vm.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isVmSelected
                      ? 'bg-white text-emerald-950 shadow-xs border border-emerald-200/60'
                      : 'text-gray-500 hover:text-emerald-900 hover:bg-white/50'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isVmSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className="text-[11px] font-extrabold">{vm.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Tier 2: Search Input (Left) & Sort Select (Right) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
            <input
              type="text"
              placeholder="Search crop by name, Mangoes, Tomatoes, Chittoor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-farmGreen-500 rounded-xl text-xs font-bold text-farmGreen-950 placeholder-gray-400 outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-bold text-farmMuted whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50/80 border border-gray-200 text-xs font-extrabold text-farmGreen-950 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="default">Default Sort</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="stock-desc">Stock: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

      </div>

      {/* VIEW 1: CARDS GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
              <Sprout className="w-12 h-12 text-emerald-600 mx-auto opacity-50" />
              <h3 className="font-extrabold text-base text-farmGreen-950">No matching crop items found</h3>
              <p className="text-xs text-farmMuted max-w-sm mx-auto">
                Try searching with a different keyword or resetting your filter tabs.
              </p>
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const isLow = prod.stock < 15;
              const isOff = prod.isUnavailable || prod.stock === 0;
              const isChittoorItem = prod.farmerLocation?.includes('Chittoor') || prod.farmerLocation?.includes('Palamaner') || prod.farmerLocation?.includes('Madanapalle') || prod.name?.includes('Chittoor');

              // Stock percentage bar
              const stockPercent = Math.min(100, Math.round((prod.stock / 100) * 100));

              return (
                <div 
                  key={prod.id} 
                  className={`bg-white rounded-3xl border p-4 shadow-xs hover:shadow-md flex flex-col justify-between space-y-3 transition-all relative overflow-hidden ${
                    isOff ? 'border-gray-300 opacity-80' : isLow ? 'border-rose-300 ring-2 ring-rose-100' : 'border-gray-100'
                  }`}
                >
                  {/* Chittoor AP Origin Banner Bar */}
                  {isChittoorItem && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-500 to-blue-600" />
                  )}

                  <div className="space-y-3">
                    
                    {/* Crop Header */}
                    <div className="flex items-start gap-3">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-14 h-14 rounded-2xl object-cover overflow-hidden ring-2 ring-emerald-400/80 shadow-xs shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {prod.category}
                          </span>
                          {isChittoorItem && (
                            <span className="text-[9px] font-extrabold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                              📍 Chittoor AP
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-xs text-farmGreen-950 truncate mt-1">{prod.name}</h3>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-black text-sm text-emerald-800">
                            ₹{prod.price} <span className="text-[10px] text-farmMuted font-bold">/{prod.unit}</span>
                          </span>
                          <button
                            onClick={() => {
                              setEditPriceProduct(prod);
                              setNewPrice(prod.price);
                            }}
                            className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-lg border border-emerald-200 cursor-pointer flex items-center gap-1"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Price
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stock Level Gauge */}
                    <div className={`p-3 rounded-2xl border space-y-2 ${
                      isOff ? 'bg-gray-50 border-gray-200' : isLow ? 'bg-rose-50/70 border-rose-200' : 'bg-emerald-50/60 border-emerald-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-farmMuted">Stock Level:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isOff ? 'bg-gray-200 text-gray-700' : isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isOff ? 'Sold Out' : isLow ? '⚠️ Low Stock' : '🟢 Fresh & In Stock'}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="font-black text-lg text-farmGreen-950">
                          {prod.stock} <span className="text-xs text-farmMuted font-mono font-bold">{prod.unit}s</span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-800 font-mono">
                          Val: ₹{(prod.stock * prod.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Visual Meter Bar */}
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOff ? 'bg-gray-400' : isLow ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(6, stockPercent)}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Farmer Easy 1-Tap Action Controls */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    
                    {/* Quick Adjust Buttons */}
                    <div className="flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleUpdateStock(prod.id, -5, prod.name)}
                        className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
                        title="Subtract 5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleUpdateStock(prod.id, -1, prod.name)}
                        className="w-8 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl flex items-center justify-center font-black text-xs cursor-pointer transition-all active:scale-95"
                        title="Subtract 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(prod.id, 1, prod.name)}
                        className="w-8 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl flex items-center justify-center font-black text-xs cursor-pointer transition-all active:scale-95"
                        title="Add 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(prod.id, 10, prod.name)}
                        className="flex-1 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
                        title="Add 10"
                      >
                        +10
                      </button>
                    </div>

                    {/* Restock Harvest & Market Toggle Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setRestockProduct(prod);
                          setRestockAmount(25);
                        }}
                        className="py-2 px-2 bg-gradient-to-r from-emerald-700 to-farmGreen-900 hover:from-emerald-800 hover:to-farmGreen-950 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-300" />
                        <span>+ Fresh Harvest</span>
                      </button>

                      <button
                        onClick={() => handleToggleAvailability(prod.id, prod.isUnavailable, prod.name)}
                        className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer active:scale-95 ${
                          isOff
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{isOff ? 'Resume Sales' : 'Pause Sales'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: HIGH DENSITY TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-farmMuted tracking-wider">
                <tr>
                  <th className="p-4">Crop Produce</th>
                  <th className="p-4">Category & Location</th>
                  <th className="p-4">Price per Unit</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Total Value</th>
                  <th className="p-4 text-right">Quick Stock Adjusters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 shrink-0" />
                        <div>
                          <div className="font-extrabold text-xs text-farmGreen-950">{prod.name}</div>
                          <div className="text-[10px] text-farmMuted">{prod.harvestDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {prod.category}
                        </span>
                        <div className="text-[10px] text-gray-500 font-medium">{prod.farmerLocation || 'Pune Hub'}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-farmGreen-950">₹{prod.price}/{prod.unit}</span>
                        <button
                          onClick={() => { setEditPriceProduct(prod); setNewPrice(prod.price); }}
                          className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-black ${
                        prod.stock < 15 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {prod.stock} {prod.unit}s
                      </span>
                    </td>
                    <td className="p-4 font-black text-sm text-emerald-800 font-mono">
                      ₹{(prod.stock * prod.price).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleUpdateStock(prod.id, -5, prod.name)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 font-bold rounded-lg cursor-pointer">-5</button>
                        <button onClick={() => handleUpdateStock(prod.id, 10, prod.name)} className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-lg cursor-pointer">+10</button>
                        <button
                          onClick={() => { setRestockProduct(prod); setRestockAmount(25); }}
                          className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-amber-300" /> Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: VALUATION ANALYTICS */}
      {viewMode === 'analytics' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-lg text-farmGreen-950 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              <span>Inventory Yield Valuation Breakdown</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {filteredProducts.slice(0, 3).map(prod => (
                <div key={prod.id} className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-emerald-200 shrink-0" />
                    <div>
                      <div className="font-extrabold text-xs text-farmGreen-950">{prod.name}</div>
                      <div className="text-[10px] text-emerald-800 font-bold">{prod.stock} {prod.unit}s in Stock</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-emerald-200/60">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Estimated Value</span>
                    <span className="font-black text-base text-emerald-800">₹{(prod.stock * prod.price).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fresh Harvest Restock Modal */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-emerald-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src={restockProduct.image} alt={restockProduct.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-200 shrink-0" />
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">
                    Add Fresh Harvest (కొత్త పంట నిల్వ)
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">{restockProduct.name}</p>
                </div>
              </div>
              <button onClick={() => setRestockProduct(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBatchRestockSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-farmGreen-950 block">
                  Select Harvest Quantity Brought from Field ({restockProduct.unit}s)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setRestockAmount(qty)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        restockAmount === qty
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                          : 'bg-gray-50 text-farmGreen-950 border-gray-200 hover:bg-emerald-50'
                      }`}
                    >
                      +{qty} {restockProduct.unit}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-farmMuted font-bold block mb-1">Or Enter Custom Quantity:</span>
                  <input
                    type="number"
                    min="1"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-emerald-300 rounded-xl text-base font-mono font-black text-farmGreen-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between font-bold">
                <span>Updated Total Stock:</span>
                <span className="text-base text-emerald-800 font-black">{restockProduct.stock + (parseInt(restockAmount) || 0)} {restockProduct.unit}s</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Confirm Fresh Harvest Add</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editPriceProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-emerald-100 animate-scaleUp">
            
            {/* Modal Header with Crop Photo Thumbnail */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={editPriceProduct.image}
                    alt={editPriceProduct.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/80 shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                    ✓
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <h3 className="font-black text-sm sm:text-base text-farmGreen-950 truncate">
                      Change Crop Price (ధర మార్చండి)
                    </h3>
                  </div>
                  <p className="text-xs text-farmGreen-900 font-extrabold truncate">{editPriceProduct.name}</p>
                  <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-2 mt-0.5">
                    <span>Active Stock: <strong>{editPriceProduct.stock} {editPriceProduct.unit}s</strong></span>
                    <span>•</span>
                    <span>Current: <strong>₹{editPriceProduct.price}/{editPriceProduct.unit}</strong></span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditPriceProduct(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePriceUpdate} className="space-y-4">
              
              {/* Price Input & Quick Adjusters */}
              <div className="space-y-2">
                <label className="text-xs font-black text-farmGreen-950 flex items-center justify-between">
                  <span>New Selling Price per {editPriceProduct.unit} (₹)</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Updated live on consumer store</span>
                </label>
                
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-emerald-800 text-lg">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50/90 border-2 border-emerald-300 focus:bg-white focus:border-emerald-500 rounded-2xl text-xl font-mono font-black text-farmGreen-950 outline-none transition-all"
                  />
                </div>

                {/* 1-Tap Quick Price Presets */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] text-farmMuted font-bold shrink-0">Quick Presets:</span>
                  {[-10, -5, 5, 10, 20].map((adj) => {
                    const targetVal = Math.max(1, (parseFloat(editPriceProduct.price) || 0) + adj);
                    return (
                      <button
                        key={adj}
                        type="button"
                        onClick={() => setNewPrice(targetVal.toString())}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-[11px] font-extrabold cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                      >
                        {adj > 0 ? `+₹${adj}` : `-₹${Math.abs(adj)}`}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setNewPrice(editPriceProduct.price.toString())}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Live Yield Revenue Impact Calculator */}
              {(() => {
                const updatedPriceVal = parseFloat(newPrice) || editPriceProduct.price;
                const oldValuation = editPriceProduct.stock * editPriceProduct.price;
                const newValuation = editPriceProduct.stock * updatedPriceVal;
                const diffValuation = newValuation - oldValuation;

                return (
                  <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-farmGreen-950">
                      <span>Total Yield Market Valuation:</span>
                      <span className="font-mono font-black text-emerald-800 text-sm">
                        ₹{newValuation.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-farmMuted font-medium">Revenue Impact vs Current:</span>
                      <span className={`font-mono font-extrabold flex items-center gap-1 ${
                        diffValuation >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {diffValuation >= 0 ? `+₹${diffValuation.toLocaleString()}` : `-₹${Math.abs(diffValuation).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditPriceProduct(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Save New Price</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerInventory;
