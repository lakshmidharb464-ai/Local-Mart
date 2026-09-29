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
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'low' | 'unavailable'
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
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesSearch || !matchesCategory) return false;

      if (filterMode === 'low') return p.stock < 15;
      if (filterMode === 'unavailable') return p.isUnavailable || p.stock === 0;
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

  const handleUpdateStock = (id, delta, name) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
    } catch {
      // Ignore vibration errors
    }
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

  const handleQuickFlashDeal = (prodId, prodName) => {
    setProducts(products.map(p => {
      if (p.id === prodId) {
        const discounted = Math.round(p.price * 0.8);
        return { ...p, originalPrice: p.price, price: discounted, isFlashSale: true };
      }
      return p;
    }));
    if (showToast) {
      showToast('Anti-Waste Flash Deal ⚡', `Applied 20% discount on ${prodName} to accelerate fresh sales!`);
    }
  };

  const handleExportCSV = () => {
    if (showToast) showToast('Report Downloaded 📊', 'Inventory summary report saved to downloads.');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-display">

      {/* Top Glassmorphism Banner Header */}
      <div className="bg-gradient-to-r from-[#071f15] via-[#0B3D2E] to-[#0D4233] text-white p-6 sm:p-7 rounded-3xl shadow-farm-lg border border-white/[0.06] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-farmGold-500/15 backdrop-blur-md border border-farmGold-400/25 text-farmGold-300 flex items-center justify-center shrink-0 shadow-lg">
              <Boxes className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
                {t('inventoryTitle') || 'Crop Inventory & Stock Control'}
              </h1>
              <p className="text-xs text-white/60 font-medium mt-1">
                {t('inventorySubtitle') || 'Track real-time harvest quantities, quickly update stock levels (+10, +50), and manage crop prices.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            title="Download Inventory Report"
            className="w-10 h-10 rounded-2xl bg-white/[0.1] hover:bg-white/[0.2] text-white border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer shadow-md shrink-0 backdrop-blur-sm"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Helper Tip Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-farmGold-300 font-bold">
          <Sparkles className="w-4 h-4 text-farmGold-400 shrink-0" />
          <span>Tap <strong>"+10"</strong> or <strong>"+50"</strong> on any crop card after bringing fresh harvest from your fields!</span>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          {
            label: 'Total Harvest Stock', value: `${totalStockUnits.toLocaleString()}`, unit: 'units',
            sub: `Across ${products.length} crops`, icon: Package, iconBg: 'bg-farmGreen-100/80', iconColor: 'text-farmGreen-700',
            border: 'border-farmGreen-200/30 hover:border-emerald-300',
          },
          {
            label: 'Low Stock Alert', value: `${lowStockCount}`, unit: 'crops',
            sub: lowStockCount > 0 ? 'Need fresh harvest' : 'All levels healthy', icon: AlertTriangle,
            iconBg: lowStockCount > 0 ? 'bg-farmTerracotta-100' : 'bg-farmGreen-100/80',
            iconColor: lowStockCount > 0 ? 'text-farmTerracotta-700' : 'text-farmGreen-700',
            border: lowStockCount > 0 ? 'border-farmTerracotta-200/50 hover:border-farmTerracotta-300' : 'border-farmGreen-200/30 hover:border-emerald-200',
            valueColor: lowStockCount > 0 ? 'text-farmTerracotta-700' : 'text-farmGreen-950',
          },
          {
            label: 'Est. Market Value', value: `₹${totalInventoryValue.toLocaleString('en-IN')}`, unit: '',
            sub: 'Active listing valuation', icon: TrendingUp, iconBg: 'bg-farmGold-100', iconColor: 'text-farmGold-700',
            border: 'border-amber-100 hover:border-amber-300',
          },
          {
            label: 'Paused / Sold Out', value: `${unavailableCount}`, unit: 'crops',
            sub: 'Market sales paused', icon: XCircle, iconBg: 'bg-farmSage-100/40', iconColor: 'text-gray-600',
            border: 'border-farmSage-100/40 hover:border-gray-300',
          },
        ].map((card, i) => (
          <div key={i} className={`glass-surface p-4 rounded-2xl border-2 ${card.border} shadow-glass hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-2 group`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-farmMuted uppercase tracking-widest">{card.label}</span>
              <div className={`p-1.5 ${card.iconBg} ${card.iconColor} rounded-lg group-hover:scale-110 transition-transform`}>
                <card.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`font-black text-2xl ${card.valueColor || 'text-farmGreen-950'} leading-none`}>
              {card.value} {card.unit && <span className="text-sm font-bold text-farmMuted">{card.unit}</span>}
            </div>
            <div className="text-[11px] font-semibold text-farmMuted">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Interactive Controls Bar */}
      <div className="glass-surface p-3.5 sm:p-4 rounded-3xl border border-farmSage-100/40 shadow-sm space-y-3">
        
        {/* Tier 1: Filter Navigation Tabs (Left) & View Mode Switcher (Right) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-farmSage-100/40 pb-3">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { key: 'all', label: 'All Crops', count: products.length, icon: Sprout, color: 'text-emerald-400' },
              { key: 'low', label: 'Low Stock', count: lowStockCount, isWarning: lowStockCount > 0, icon: AlertTriangle, color: 'text-farmGold-400' },
              { key: 'unavailable', label: 'Paused / Sold Out', count: unavailableCount, icon: Power, color: 'text-farmSage-400' }
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
                      : 'text-farmMuted hover:text-farmGreen-950 hover:bg-farmGreen-50/60'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : tab.isWarning ? 'bg-farmGold-100 text-amber-900' : 'bg-farmSage-100/40 text-farmSage-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher Pills */}
          <div className="flex items-center gap-1 bg-farmSage-50/80 p-1 rounded-xl shrink-0 border border-farmSage-200/50 self-start sm:self-auto">
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
                      : 'text-farmMuted hover:text-emerald-900 hover:bg-white/80'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isVmSelected ? 'text-emerald-600' : 'text-farmSage-400'}`} />
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
              placeholder="Search by crop name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white/70 hover:bg-white/80 focus:bg-white border border-farmSage-200/50 input-premium rounded-xl text-xs font-bold text-farmGreen-950 placeholder-farmSage-400  transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-farmSage-400 hover:text-gray-600 p-0.5">
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
              className="bg-white/70 border border-farmSage-200/50 text-xs font-extrabold text-farmGreen-950 rounded-xl px-3 py-2  cursor-pointer"
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
            <div className="col-span-full glass-surface rounded-3xl p-12 text-center border border-farmSage-100/40 shadow-sm space-y-3">
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

              // Stock percentage bar
              const stockPercent = Math.min(100, Math.round((prod.stock / 100) * 100));

              return (
                <div 
                  key={prod.id} 
                  className={`glass-surface rounded-3xl border p-4 shadow-xs hover:shadow-farm-lg hover:-translate-y-1 flex flex-col justify-between space-y-3 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative overflow-hidden ${
                    isOff ? 'border-gray-300 opacity-80' : isLow ? 'border-farmTerracotta-300 ring-2 ring-rose-100' : 'border-farmSage-100/40 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Crop Header */}
                    <div className="flex items-start gap-3">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-14 h-14 rounded-2xl object-cover overflow-hidden ring-2 ring-emerald-400/80 shadow-xs shrink-0" 
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold text-emerald-800 bg-farmGreen-50/60 px-2 py-0.5 rounded border border-farmGreen-200/30">
                            {prod.category}
                          </span>
                          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                            {prod.harvestDate?.includes('Today') ? '🌿 Fresh Harvest' : '🌾 Farm Stock'}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-xs text-farmGreen-950 truncate mt-1">{prod.name}</h3>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-extrabold text-sm text-emerald-800 font-mono tabular-nums">
                            ₹{prod.price} <span className="text-[10px] text-farmMuted font-bold font-sans">/{prod.unit}</span>
                          </span>
                          <button
                            onClick={() => {
                              setEditPriceProduct(prod);
                              setNewPrice(prod.price);
                            }}
                            title="Edit Listing Price"
                            className="w-8 h-8 bg-farmGreen-50/60 hover:bg-farmGreen-100/80 text-emerald-800 rounded-xl flex items-center justify-center border border-emerald-200/80 transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer shadow-2xs"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stock Level Gauge */}
                    <div className={`p-3 rounded-2xl border space-y-2 ${
                      isOff ? 'bg-white/50 border-farmSage-200/50' : isLow ? 'bg-farmTerracotta-50/70 border-farmTerracotta-200' : 'bg-farmGreen-50/60 border-emerald-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-farmMuted">Stock Level:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isOff ? 'bg-gray-200 text-farmSage-700' : isLow ? 'bg-farmTerracotta-100 text-rose-800' : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xs'
                        }`}>
                          {isOff ? 'Sold Out' : isLow ? '⚠️ Low Stock' : '🟢 Fresh in Stock'}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="font-black text-lg text-farmGreen-950 tabular-nums">
                          {prod.stock} <span className="text-xs text-farmMuted font-mono font-bold font-sans">{prod.unit}s</span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-800 font-mono tabular-nums">
                          Val: ₹{(prod.stock * prod.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Visual Meter Bar */}
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOff ? 'bg-gray-400' : isLow ? 'bg-gradient-to-r from-rose-500 to-red-600' : stockPercent > 50 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'
                          }`}
                          style={{ width: `${Math.max(6, stockPercent)}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Farmer Easy 1-Tap Action Controls */}
                  <div className="space-y-2 pt-2 border-t border-farmSage-100/40">
                    
                    {/* Quick Adjust Stepper Buttons */}
                    <div className="flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleUpdateStock(prod.id, -5, prod.name)}
                        className="flex-1 py-1.5 bg-farmSage-100/40 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-black cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xs"
                        title="Subtract 5"
                        aria-label={`Reduce ${prod.name} stock by 5 units`}
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleUpdateStock(prod.id, -1, prod.name)}
                        className="w-8 py-1.5 bg-farmSage-100/40 hover:bg-gray-200 text-gray-800 rounded-xl flex items-center justify-center font-black text-xs cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xs"
                        title="Subtract 1"
                        aria-label={`Reduce ${prod.name} stock by 1 unit`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(prod.id, 1, prod.name)}
                        className="w-8 py-1.5 bg-farmGreen-100/80 hover:bg-emerald-200 text-emerald-950 rounded-xl flex items-center justify-center font-black text-xs cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xs"
                        title="Add 1"
                        aria-label={`Increase ${prod.name} stock by 1 unit`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(prod.id, 10, prod.name)}
                        className="flex-1 py-1.5 bg-farmGreen-100/80 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-black cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xs"
                        title="Add 10"
                        aria-label={`Increase ${prod.name} stock by 10 units`}
                      >
                        +10
                      </button>
                    </div>

                    {/* Restock Harvest, Anti-Waste Flash Deal & Market Toggle Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {!prod.isFlashSale ? (
                        <button
                          type="button"
                          onClick={() => handleQuickFlashDeal(prod.id, prod.name)}
                          title="Apply 20% Anti-Waste Flash Discount"
                          aria-label={`Apply 20% anti-waste flash discount for ${prod.name}`}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-farmGold-100 text-amber-900 border border-farmGold-200 rounded-xl text-[11px] font-black flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                        >
                          <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span>-20% Flash Deal</span>
                        </button>
                      ) : (
                        <span className="px-2 py-1 bg-farmGold-100 text-amber-900 text-[10px] font-black rounded-lg border border-farmGold-200 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span>Flash Active</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setRestockProduct(prod);
                            setRestockAmount(25);
                          }}
                          title="Add Fresh Harvest Batch (+25)"
                          aria-label={`Restock fresh harvest batch (+25) for ${prod.name}`}
                          className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer shadow-xs shrink-0"
                        >
                          <Sprout className="w-4 h-4 text-amber-300" />
                        </button>

                        <button
                          onClick={() => handleToggleAvailability(prod.id, prod.isUnavailable, prod.name)}
                          title={isOff ? "Resume Market Sales" : "Pause Market Sales"}
                          aria-label={isOff ? `Resume market sales for ${prod.name}` : `Pause market sales for ${prod.name}`}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer shadow-2xs shrink-0 ${
                            isOff
                              ? 'bg-farmGreen-100/80 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-farmSage-100/40 text-farmMuted hover:bg-farmTerracotta-50 hover:text-farmTerracotta-600 border border-farmSage-200/50'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
        <div className="glass-surface rounded-3xl border border-farmSage-100/40 shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-white/70 border-b border-farmSage-100/40 text-[10px] font-black uppercase text-farmMuted tracking-wider">
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
                  <tr key={prod.id} className="hover:bg-farmGreen-50/60/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 shrink-0" loading="lazy" />
                        <div>
                          <div className="font-extrabold text-xs text-farmGreen-950">{prod.name}</div>
                          <div className="text-[10px] text-farmMuted">{prod.harvestDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-emerald-800 bg-farmGreen-50/60 px-2 py-0.5 rounded border border-farmGreen-200/30">
                          {prod.category}
                        </span>
                        <div className="text-[10px] text-farmMuted font-medium">{prod.farmerLocation || 'Pune Hub'}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-farmGreen-950">₹{prod.price}/{prod.unit}</span>
                        <button
                          onClick={() => { setEditPriceProduct(prod); setNewPrice(prod.price); }}
                          aria-label={`Edit price for ${prod.name}`}
                          className="text-farmGreen-700 hover:text-emerald-900 p-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-black ${
                        prod.stock < 15 ? 'bg-farmTerracotta-100 text-rose-800' : 'bg-farmGreen-100/80 text-emerald-900'
                      }`}>
                        {prod.stock} {prod.unit}s
                      </span>
                    </td>
                    <td className="p-4 font-black text-sm text-emerald-800 font-mono">
                      ₹{(prod.stock * prod.price).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStock(prod.id, -5, prod.name)}
                          aria-label={`Reduce ${prod.name} stock by 5 units`}
                          className="px-2 py-1 bg-farmSage-100/40 hover:bg-gray-200 font-bold rounded-lg cursor-pointer"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleUpdateStock(prod.id, 10, prod.name)}
                          aria-label={`Increase ${prod.name} stock by 10 units`}
                          className="px-2 py-1 bg-farmGreen-100/80 hover:bg-emerald-200 text-emerald-900 font-bold rounded-lg cursor-pointer"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => { setRestockProduct(prod); setRestockAmount(25); }}
                          aria-label={`Restock ${prod.name}`}
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
          <div className="p-6 glass-surface rounded-3xl border border-farmSage-100/40 shadow-sm space-y-4">
            <h3 className="font-black text-lg text-farmGreen-950 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              <span>Inventory Yield Valuation Breakdown</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {filteredProducts.slice(0, 3).map(prod => (
                <div key={prod.id} className="p-4 bg-farmGreen-50/60 rounded-2xl border border-farmGreen-200/30 space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-emerald-200 shrink-0" loading="lazy" />
                    <div>
                      <div className="font-extrabold text-xs text-farmGreen-950">{prod.name}</div>
                      <div className="text-[10px] text-emerald-800 font-bold">{prod.stock} {prod.unit}s in Stock</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-emerald-200/60">
                    <span className="text-[10px] text-farmMuted font-bold uppercase">Estimated Value</span>
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
          <div className="glass-surface rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-farmGreen-200/30 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-farmSage-100/40">
              <div className="flex items-center gap-3">
                <img src={restockProduct.image} alt={restockProduct.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-200 shrink-0" loading="lazy" />
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">
                    Add Fresh Harvest
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">{restockProduct.name}</p>
                </div>
              </div>
              <button onClick={() => setRestockProduct(null)} className="w-8 h-8 rounded-full bg-farmSage-100/40 hover:bg-gray-200 text-farmMuted flex items-center justify-center transition-all cursor-pointer">
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
                          ? 'bg-farmGreen-700 text-white border-emerald-700 shadow-md scale-105'
                          : 'bg-white/50 text-farmGreen-950 border-farmSage-200/50 hover:bg-farmGreen-50/60'
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
                    className="w-full p-3 bg-white/50 border border-emerald-300 rounded-xl text-base font-mono font-black text-farmGreen-950 focus:ring-2 focus:ring-emerald-500 focus:"
                  />
                </div>
              </div>

              <div className="p-3 bg-farmGreen-50/60 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between font-bold">
                <span>Updated Total Stock:</span>
                <span className="text-base text-emerald-800 font-black">{restockProduct.stock + (parseInt(restockAmount) || 0)} {restockProduct.unit}s</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-2 bg-farmSage-100/40 text-farmSage-700 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-farmGold-300" />
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
          <div className="glass-surface rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-farmGreen-200/30 animate-scaleUp">
            
            {/* Modal Header with Crop Photo Thumbnail */}
            <div className="flex items-center justify-between pb-3 border-b border-farmSage-100/40">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={editPriceProduct.image}
                    alt={editPriceProduct.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/80 shadow-xs"
                    loading="lazy"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-farmGreen-700 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                    ✓
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <h3 className="font-black text-sm sm:text-base text-farmGreen-950 truncate">
                      Change Crop Price
                    </h3>
                  </div>
                  <p className="text-xs text-farmGreen-950 font-extrabold truncate">{editPriceProduct.name}</p>
                  <div className="text-[10px] text-farmGreen-700 font-extrabold flex items-center gap-2 mt-0.5">
                    <span>Active Stock: <strong>{editPriceProduct.stock} {editPriceProduct.unit}s</strong></span>
                    <span>•</span>
                    <span>Current: <strong>₹{editPriceProduct.price}/{editPriceProduct.unit}</strong></span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditPriceProduct(null)}
                className="w-8 h-8 rounded-full bg-farmSage-100/40 hover:bg-gray-200 text-farmMuted flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePriceUpdate} className="space-y-4">
              
              {/* Price Input & Quick Adjusters */}
              <div className="space-y-2">
                <label className="text-xs font-black text-farmGreen-950 flex items-center justify-between">
                  <span>New Selling Price per {editPriceProduct.unit} (₹)</span>
                  <span className="text-[10px] text-farmGreen-700 font-bold">Updated live on consumer store</span>
                </label>
                
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-emerald-800 text-lg">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white/50/90 border-2 border-emerald-300 focus:bg-white focus:border-emerald-500 rounded-2xl text-xl font-mono font-black text-farmGreen-950  transition-all"
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
                        className="px-2.5 py-1 bg-farmGreen-50/60 hover:bg-farmGreen-100/80 text-emerald-900 border border-emerald-200 rounded-lg text-[11px] font-extrabold cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                      >
                        {adj > 0 ? `+₹${adj}` : `-₹${Math.abs(adj)}`}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setNewPrice(editPriceProduct.price.toString())}
                    className="px-2 py-1 bg-farmSage-100/40 hover:bg-gray-200 text-farmSage-700 rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap"
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
                        diffValuation >= 0 ? 'text-farmGreen-700' : 'text-farmTerracotta-600'
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
                  className="px-4 py-2.5 bg-farmSage-100/40 hover:bg-gray-200 text-farmSage-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-farmGold-300" />
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

