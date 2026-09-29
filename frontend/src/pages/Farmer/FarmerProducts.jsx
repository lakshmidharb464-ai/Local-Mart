import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Upload,
  Camera,
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package, 
  Tag, 
  Image as ImageIcon, 
  X, 
  Save, 
  CheckCircle2, 
  Sprout, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Award,
  Sparkles,
  LayoutGrid,
  ListFilter,
  CreditCard,
  Eye,
  Power
} from 'lucide-react';

export const FarmerProducts = ({ products, setProducts, showAddModal, setShowAddModal }) => {
  const { showToast, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFlashDealModal, setShowFlashDealModal] = useState(false);
  const [cardViewType, setCardViewType] = useState('grid'); // 'grid' | 'table' | 'revenue'

  // New product form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // [{ url: ObjectURL, name: string }], max 5
  const primaryImageUrl = imageFiles[0]?.url || '';
  const imageUrl = primaryImageUrl;
  const [harvestTag, setHarvestTag] = useState('Harvested Today 5:30 AM');

  // Multi-Image Upload Handlers (Object URLs avoid base64 memory bloat)
  const handleImageFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 5) {
      showToast('Too Many Images ⚠️', 'Maximum 5 photos per crop listing.');
      return;
    }
    const newEntries = files.map(f => ({ url: URL.createObjectURL(f), name: f.name }));
    setImageFiles(prev => [...prev, ...newEntries]);
    showToast('Images Uploaded 📸', `${files.length} photo(s) added to crop listing.`);
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url); // Release browser memory
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSetPrimary = (index) => {
    setImageFiles(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      return [moved, ...updated]; // Move selected to front (primary)
    });
  };

  // Sample Presets Autofill
  const samplePresetsList = [
    { name: 'Heirloom Vine Tomatoes', cat: 'Vegetables', unit: 'kg', price: '40', stock: '100', tag: 'Harvested Today 5:30 AM', icon: '🍅', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { name: 'Organic Farm Broccoli', cat: 'Vegetables', unit: 'kg', price: '90', stock: '50', tag: 'Harvested Today 5:30 AM', icon: '🥦', url: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Fresh Orange Carrots', cat: 'Vegetables', unit: 'kg', price: '50', stock: '80', tag: 'Harvested Today 5:30 AM', icon: '🥕', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80' },
    { name: 'Devgad Organic Apples', cat: 'Fruits', unit: 'kg', price: '180', stock: '60', tag: '100% Tree Ripened', icon: '🍎', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
    { name: 'Fresh A2 Gir Cow Milk', cat: 'Dairy', unit: 'liter', price: '75', stock: '40', tag: 'Harvested Today 5:30 AM', icon: '🥛', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' }
  ];

  const applyCropPreset = (preset) => {
    setName(preset.name);
    setCategory(preset.cat);
    setUnit(preset.unit);
    setPrice(preset.price);
    setStock(preset.stock);
    setHarvestTag(preset.tag);
    // Load preset URL as a placeholder image entry
    setImageFiles([{ url: preset.url, name: 'preset.jpg' }]);
    showToast('Preset Applied ✨', `${preset.name} details loaded into form.`);
  };

  // Flash Deal State
  const [flashDiscount, setFlashDiscount] = useState('15');
  const [flashTargetId, setFlashTargetId] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const categoriesList = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Herbs'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || 
                            p.category.toLowerCase() === selectedCategoryFilter.toLowerCase() ||
                            (selectedCategoryFilter === 'Herbs' && p.category.toLowerCase().includes('herb'));
    return matchesSearch && matchesCategory;
  });

  // Bulk Operations Handlers
  const handleBulkPriceAdjust = (percent) => {
    setProducts(products.map(p => ({
      ...p,
      price: Math.max(1, Math.round(p.price * (1 + percent / 100)))
    })));
    showToast('Bulk Pricing Updated ⚡', `All catalog prices shifted by ${percent > 0 ? '+' : ''}${percent}%.`);
  };

  const handleBulkRestock = (amount) => {
    setProducts(products.map(p => ({
      ...p,
      stock: (p.stock || 0) + amount
    })));
    showToast('Bulk Harvest Restock 🌱', `Added +${amount} units across all listed crops.`);
  };

  // Inline Stock Adjuster Handler
  const handleAdjustStock = (id, delta) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    }));
    showToast('Stock Adjusted', `Inventory updated for product.`);
  };

  const handleToggleAvailability = (id) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, isUnavailable: !p.isUnavailable };
      }
      return p;
    }));
    showToast('Status Changed', `Product availability toggled.`);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProd = {
      id: 'p_farmer_' + Date.now(),
      name,
      category,
      price: Number(price),
      unit,
      rating: 5.0,
      reviewsCount: 1,
      farmerName: user?.name || 'Rajesh Kumar',
      farmerLocation: 'Pune Rural Hub',
      image: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      stock: Number(stock) || 50,
      maxStock: Number(stock) || 50,
      organic: true,
      harvestDate: harvestTag || 'Harvested Today 5:30 AM',
      description: 'Fresh organic farm harvest directly from Pune rural fields.'
    };

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    showToast('Crop Listing Published! 🌾', `${name} added to your active marketplace catalog.`);
    resetForm();
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    showToast('Listing Saved', `${editingProduct.name} parameters updated.`);
  };

  const handleLaunchFlashSale = (e) => {
    e.preventDefault();
    if (!flashTargetId) return;

    const discountPct = Number(flashDiscount) / 100;
    setProducts(products.map(p => {
      if (p.id === flashTargetId) {
        const discounted = Math.round(p.price * (1 - discountPct));
        return { ...p, originalPrice: p.price, price: discounted, isFlashSale: true };
      }
      return p;
    }));

    setShowFlashDealModal(false);
    showToast('⚡ Morning Flash Sale Active!', `${flashDiscount}% discount applied for 2 hours to boost crop sales.`);
  };

  const handleDeleteProduct = (id, prodName) => {
    setProducts(products.filter(p => p.id !== id));
    showToast('Listing Removed', `${prodName} deleted from catalog.`);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setImageFiles([]);
    setHarvestTag('Harvested Today 5:30 AM');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-surface p-6 rounded-3xl border border-farmGreen-200/40 shadow-glass">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-farmGreen-100/80 text-farmGreen-800 text-xs font-bold mb-1">
            <Sprout className="w-3.5 h-3.5 text-farmGreen-600" />
            <span>Producer Selling Hub</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-farmGreen-950">
            Crop Listing & Inventory Management
          </h2>
          <p className="text-xs text-farmMuted mt-0.5">
            Publish harvest listings, adjust daily stock, tag harvest timestamps & run flash sales
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Card Type View Switcher */}
          <div className="flex items-center bg-white/40 backdrop-blur-sm p-1 rounded-2xl border border-farmGreen-200/30">
            <button
              onClick={() => setCardViewType('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                cardViewType === 'grid' ? 'bg-farmGreen-700 text-white shadow-sm' : 'text-farmMuted hover:text-farmGreen-950'
              }`}
              title="Visual Photo Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setCardViewType('revenue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                cardViewType === 'revenue' ? 'bg-farmGreen-700 text-white shadow-sm' : 'text-farmMuted hover:text-farmGreen-950'
              }`}
              title="Batch Revenue Cards"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Batch</span>
            </button>
            <button
              onClick={() => setCardViewType('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                cardViewType === 'table' ? 'bg-farmGreen-700 text-white shadow-sm' : 'text-farmMuted hover:text-farmGreen-950'
              }`}
              title="Telemetry Market Table"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowFlashDealModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-farmOrange-600 hover:from-amber-600 hover:to-farmOrange-700 text-white rounded-2xl text-xs font-bold font-display shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Flash Deal</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Crop</span>
          </button>
        </div>
      </div>

      {/* Search Input, Category Filter Pills & Bulk Action Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
            <input
              type="text"
              placeholder="Filter crop name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-farmGreen-200 rounded-2xl text-xs font-medium text-farmGreen-950 focus: focus:border-farmGreen-600 shadow-sm"
            />
          </div>

          {/* Bulk Quick Operations */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold text-farmGreen-950">
            <span className="text-[11px] text-farmMuted uppercase font-extrabold mr-1 shrink-0">Bulk:</span>
            <button
              type="button"
              onClick={() => handleBulkPriceAdjust(5)}
              className="px-2.5 py-1 bg-white hover:bg-farmGreen-50/60 text-farmGreen-800 border border-emerald-200 rounded-xl text-[11px] font-bold shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Increase all crop prices by 5%"
            >
              +5% Price
            </button>
            <button
              type="button"
              onClick={() => handleBulkPriceAdjust(-5)}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 border border-farmGold-200 rounded-xl text-[11px] font-bold shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Discount all crop prices by 5%"
            >
              -5% Discount
            </button>
            <button
              type="button"
              onClick={() => handleBulkRestock(20)}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-[11px] font-bold shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Add +20 stock across all listed crops"
            >
              +20 Harvest Stock
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categoriesList.map(cat => {
            const isSelected = selectedCategoryFilter === cat;
            const count = cat === 'All' 
              ? products.length 
              : products.filter(p => p.category.toLowerCase().includes(cat.toLowerCase())).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm scale-102 ring-2 ring-emerald-400/40'
                    : 'bg-white text-farmGreen-950 border border-farmSage-200/50 hover:border-emerald-300 hover:bg-farmGreen-50/60/50'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-farmSage-100/40 text-farmMuted'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW TYPE 1: VISUAL PHOTO CARDS GRID */}
      {cardViewType === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const isLowStock = prod.stock < 15;
            const maxStock = prod.maxStock || 150;
            const stockPct = Math.min(100, Math.round((prod.stock / maxStock) * 100));
            const totalValuation = prod.stock * prod.price;

            return (
              <div 
                key={prod.id} 
                onClick={() => setEditingProduct(prod)}
                className="glass-surface rounded-3xl border border-farmGreen-200/40 p-4 shadow-glass hover:shadow-farm-lg hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between space-y-3 group cursor-pointer active:scale-[0.99]"
                title="Click to view & edit details in center"
              >
                <div className="space-y-3">
                  
                  {/* Image & Harvest Tags */}
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" loading="lazy" />
                    
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-farmGreen-900/90 backdrop-blur-xs text-farmGold-300 shadow-sm border border-emerald-500/20">
                      {prod.category}
                    </span>

                    {prod.isFlashSale && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-sm flex items-center gap-1 animate-pulse">
                        <Zap className="w-3 h-3 fill-white" />
                        <span>FLASH SALE</span>
                      </span>
                    )}

                    {/* Harvest Timestamp Ribbon */}
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-md text-white text-[10px] p-1.5 rounded-xl font-bold flex items-center justify-between">
                      <span className="text-farmGold-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{prod.harvestDate || 'Harvested 5:30 AM'}</span>
                      </span>
                      <span className="text-[9px] text-white/60 font-normal">Click to Edit ↗</span>
                    </div>
                  </div>

                  {/* Info & Valuation */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-farmGreen-950 group-hover:text-farmGreen-700 transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="font-extrabold text-base text-farmGreen-950">₹{prod.price}</span>
                        <span className="text-xs font-normal text-farmMuted"> /{prod.unit}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-farmMuted block uppercase">Crop Valuation</span>
                        <span className="font-extrabold text-xs text-farmGreen-700">₹{totalValuation.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Stock Level Progress Bar */}
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-farmMuted">Harvest Inventory:</span>
                        <span className={isLowStock ? 'text-rose-600' : 'text-farmGreen-800'}>
                          {prod.stock} {prod.unit}s left
                        </span>
                      </div>
                      <div className="w-full h-2 bg-farmSage-100/40 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isLowStock ? 'bg-farmTerracotta-500' : stockPct > 50 ? 'bg-farmGreen-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${stockPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inline Quick Inventory Control Bar */}
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2.5 bg-white/40 backdrop-blur-sm rounded-2xl border border-farmGreen-200/40 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-farmMuted text-[11px]">Adjust Stock:</span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdjustStock(prod.id, -5);
                        }}
                        className="w-7 h-7 bg-white hover:bg-farmSage-100/40 text-farmGreen-950 rounded-lg font-bold border border-farmSage-200/50 cursor-pointer shadow-2xs flex items-center justify-center active:scale-90 transition-transform"
                        title="Decrease Stock (-5)"
                      >
                        -5
                      </button>
                      <span className="font-mono font-extrabold text-xs text-farmGreen-950 px-1">
                        {prod.stock}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdjustStock(prod.id, +10);
                        }}
                        className="w-7 h-7 bg-emerald-700 hover:bg-farmGreen-800 text-white rounded-lg font-bold cursor-pointer shadow-2xs flex items-center justify-center active:scale-90 transition-transform"
                        title="Increase Stock (+10)"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>

                {/* Icon-Only Action Buttons */}
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="pt-2 border-t border-farmSage-100/40 flex items-center justify-end gap-2"
                >
                  <button
                    onClick={() => setEditingProduct(prod)}
                    title="Edit Crop Details"
                    className="w-9 h-9 bg-farmGreen-50/60 hover:bg-farmGreen-100/80 text-farmGreen-800 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer border border-emerald-200/80 shadow-2xs"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(prod.id, prod.name);
                    }}
                    title="Remove Crop Listing"
                    className="w-9 h-9 bg-farmTerracotta-50 hover:bg-farmTerracotta-100 text-farmTerracotta-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer border border-rose-200/80 shadow-2xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW TYPE 2: BATCH REVENUE CARDS VIEW */}
      {cardViewType === 'revenue' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => {
            const isOff = prod.isUnavailable || prod.stock === 0;
            const valuation = prod.stock * prod.price;

            return (
              <div 
                key={prod.id} 
                onClick={() => setEditingProduct(prod)}
                className={`glass-surface rounded-3xl border p-5 shadow-glass space-y-4 transition-all cursor-pointer hover:shadow-farm-md hover:-translate-y-1 ${
                  isOff ? 'border-gray-300 opacity-80' : 'border-farmGreen-200/40 hover:border-emerald-300'
                }`}
                title="Click to view & edit in center"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-100" loading="lazy" />
                    <div>
                      <div className="font-extrabold text-sm text-farmGreen-950">{prod.name}</div>
                      <div className="text-[11px] text-farmMuted font-mono">Category: {prod.category}</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAvailability(prod.id);
                    }}
                    className={`p-2 rounded-xl text-xs font-bold cursor-pointer border ${
                      isOff ? 'bg-farmSage-100/40 text-farmMuted border-gray-300' : 'bg-farmGreen-50/60 text-farmGreen-800 border-emerald-200'
                    }`}
                    title="Toggle Availability"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-farmSage-200/50/80 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-farmMuted uppercase block">Unit Price</span>
                    <span className="font-display font-extrabold text-sm text-farmGreen-950">₹{prod.price}/{prod.unit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-farmMuted uppercase block">Est. Revenue</span>
                    <span className="font-display font-extrabold text-sm text-farmGreen-700">₹{valuation.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-farmMuted">Inventory Level:</span>
                  <span className="font-mono font-extrabold text-farmGreen-950 bg-white px-3 py-1 rounded-xl border border-farmSage-200/50">
                    {prod.stock} {prod.unit}s
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW TYPE 3: TELEMETRY MARKET TABLE VIEW */}
      {cardViewType === 'table' && (
        <div className="glass-surface rounded-3xl border border-farmGreen-200/40 shadow-glass overflow-hidden p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-farmGreen-200/30 text-xs font-bold text-farmMuted uppercase tracking-wider bg-white/40 backdrop-blur-sm/60">
                  <th className="p-3">Crop Listing</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Harvest Timestamp</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Stock Level</th>
                  <th className="p-3 text-right">Estimated Revenue</th>
                  <th className="p-3 text-center">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-farmText">
                {filteredProducts.map((prod) => (
                  <tr 
                    key={prod.id} 
                    onClick={() => setEditingProduct(prod)}
                    className="hover:bg-farmGreen-50/60/50 transition-all cursor-pointer"
                    title="Click row to open details in center"
                  >
                    <td className="p-3 flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-100" loading="lazy" />
                      <span className="font-extrabold text-farmGreen-950">{prod.name}</span>
                    </td>

                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-farmGreen-900 text-farmGold-300 text-[10px] font-bold">
                        {prod.category}
                      </span>
                    </td>

                    <td className="p-3 text-farmMuted">{prod.harvestDate || 'Today 5:30 AM'}</td>

                    <td className="p-3 font-bold text-farmGreen-950">₹{prod.price}/{prod.unit}</td>

                    <td className="p-3 font-mono font-extrabold text-farmGreen-700">{prod.stock} {prod.unit}s</td>

                    <td className="p-3 text-right font-display font-extrabold text-farmGreen-800">
                      ₹{(prod.stock * prod.price).toLocaleString()}
                    </td>

                    <td className="p-3 text-center">
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="flex items-center justify-center gap-1.5"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdjustStock(prod.id, -5);
                          }}
                          className="px-2 py-1 bg-farmSage-100/40 hover:bg-gray-200 text-farmGreen-950 rounded font-bold text-[11px] cursor-pointer"
                        >
                          -5
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdjustStock(prod.id, 10);
                          }}
                          className="px-2 py-1 bg-emerald-700 hover:bg-farmGreen-800 text-white rounded font-bold text-[11px] cursor-pointer"
                        >
                          +10
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

      {/* Flash Deal Modal */}
      {showFlashDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleLaunchFlashSale} className="bg-white rounded-[28px] p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl border border-farmGold-200/80 overflow-hidden relative animate-scaleUp">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-farmSage-100/40">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-farmOrange-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-farmGold-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider">
                      ⚡ Lightning Boost
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-farmGreen-950 mt-0.5">
                    Launch Morning Flash Sale
                  </h3>
                  <p className="text-xs text-farmMuted">Apply instant limited-time discounts to clear fresh daily yields</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowFlashDealModal(false)} 
                className="w-8 h-8 rounded-full bg-farmSage-100/40 hover:bg-gray-200 text-farmMuted hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 flex items-center justify-between">
                  <span>Select Target Produce</span>
                  <span className="text-[11px] text-farmGreen-700 font-semibold">{products.length} available</span>
                </label>
                <select
                  value={flashTargetId}
                  onChange={(e) => setFlashTargetId(e.target.value)}
                  className="w-full p-3 bg-white/40 backdrop-blur-sm/80 border border-farmGreen-200 rounded-2xl font-bold text-xs text-farmGreen-950 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-500  transition-all cursor-pointer"
                  required
                >
                  <option value="">-- Choose Crop Listing to Promote --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: ₹{p.price}/{p.unit} · {p.stock} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Discount Percentage</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { val: '10', label: '10% OFF', desc: 'Standard promo' },
                    { val: '15', label: '15% OFF', desc: 'Morning pick' },
                    { val: '20', label: '20% OFF', desc: 'Clear bulk yield' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setFlashDiscount(opt.val)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        flashDiscount === opt.val
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/60 shadow-sm'
                          : 'bg-white/40 backdrop-blur-sm/60 border-farmSage-200/50 hover:bg-white'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-farmGreen-950">{opt.label}</div>
                      <div className="text-[10px] text-farmMuted font-medium mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Flash Calculation Preview */}
              {flashTargetId && (
                <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-farmGold-200 flex items-center justify-between text-xs animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-bold text-amber-900 block">Flash Deal Calculation:</span>
                      <span className="text-[11px] text-amber-800">
                        {products.find(p => p.id === flashTargetId)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-amber-800 line-through block">
                      Original: ₹{products.find(p => p.id === flashTargetId)?.price}
                    </span>
                    <span className="font-display font-extrabold text-sm text-farmOrange-600">
                      Flash: ₹{Math.round((products.find(p => p.id === flashTargetId)?.price || 0) * (1 - Number(flashDiscount) / 100))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-farmSage-100/40">
              <button
                type="button"
                onClick={() => setShowFlashDealModal(false)}
                className="px-5 py-2.5 rounded-2xl border border-farmSage-200/50 text-xs font-bold text-farmMuted hover:bg-farmSage-100/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-farmOrange-600 hover:from-amber-600 hover:to-farmOrange-700 text-white text-xs font-bold font-display shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Activate Flash Sale</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <form onSubmit={handleAddProduct} className="bg-white rounded-[28px] p-6 sm:p-7 max-w-xl w-full space-y-5 shadow-2xl border border-farmGreen-200/40 my-8 relative animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-farmSage-100/40">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-farmGreen-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-farmGreen-100/80 text-farmGreen-800 text-[10px] font-extrabold uppercase tracking-wider">
                      DIRECT FARM-TO-CONSUMER
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-farmGreen-950 mt-0.5">
                    Add New Crop Harvest Listing
                  </h3>
                  <p className="text-xs text-farmMuted">Publish freshly picked produce straight into the live consumer marketplace</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="w-8 h-8 rounded-full bg-farmSage-100/40 hover:bg-gray-200 text-farmMuted hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Interactive Marketplace Preview Card */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img 
                    src={imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80'} 
                    alt={name || 'Produce Preview'} 
                    className="w-14 h-14 rounded-2xl object-cover overflow-hidden ring-2 ring-emerald-400/80 shadow-sm shrink-0" 
                    loading="lazy"
                  />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-farmGreen-700 text-white text-[9px] font-black flex items-center justify-center">
                    ✓
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-display font-extrabold text-xs text-farmGreen-950 truncate">
                    {name || 'e.g. Heirloom Vine Tomatoes'}
                  </div>
                  <div className="text-[10px] text-farmMuted flex items-center gap-1.5 mt-0.5">
                    <span className="font-extrabold text-farmGreen-800 bg-white px-2 py-0.5 rounded-md border border-farmGreen-200/30">
                      {category}
                    </span>
                    <span>• {unit ? `per ${unit}` : 'per kg'}</span>
                    <span className="text-farmGreen-700 font-extrabold">({stock || 0} in stock)</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] font-bold text-farmSage-400 uppercase">Farmer Price</div>
                <div className="font-display font-black text-base text-farmGreen-800">
                  ₹{price || '0'}
                </div>
              </div>
            </div>

            {/* Quick Sample Presets Autofill Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-farmGreen-950 text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Quick-Fill Sample Presets:</span>
                </label>
                <span className="text-[10px] text-farmGreen-700 font-bold">Click to Autofill All Fields</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {samplePresetsList.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyCropPreset(preset)}
                    className="px-3 py-1.5 bg-farmGreen-50/60 hover:bg-farmGreen-100/80 text-emerald-900 text-xs font-extrabold rounded-xl border border-emerald-200 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs hover:scale-102 active:scale-95"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Product Name */}
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Crop / Produce Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Heirloom Vine Tomatoes, Fresh Baby Spinach"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-semibold text-farmGreen-950  transition-all"
                  required
                />
              </div>

              {/* Category & Unit Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Produce Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-bold text-farmGreen-950  cursor-pointer"
                  >
                    <option value="Vegetables">🥕 Vegetables</option>
                    <option value="Fruits">🍎 Fruits</option>
                    <option value="Dairy">🥛 Dairy & Farm Milk</option>
                    <option value="Grocery">🌾 Farm Grains & Pulses</option>
                    <option value="Honey">🍯 Honey & Preserves</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Selling Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-bold text-farmGreen-950  cursor-pointer"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="bunch">bunch (Leafy Greens)</option>
                    <option value="liter">liter (Bottled Fresh)</option>
                    <option value="dozen">dozen (Eggs/Fruits)</option>
                    <option value="box">box (Crate)</option>
                    <option value="packet">packet (500g)</option>
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Direct Farmer Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-farmGreen-950 text-sm">₹</span>
                    <input
                      type="number"
                      placeholder="40"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-bold text-farmGreen-950 tabular-nums transition-all"
                      required
                    />
                  </div>
                  {price && Number(price) > 0 && (
                    <div className="mt-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200/60 text-[10px] space-y-0.5">
                      <div className="flex justify-between text-farmMuted font-bold">
                        <span>Platform Fee (8%):</span>
                        <span className="font-mono text-farmMuted tabular-nums">-₹{(Number(price) * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-900 font-extrabold">
                        <span>Net Take-Home (92%):</span>
                        <span className="font-mono text-emerald-800 font-black tabular-nums">₹{(Number(price) * 0.92).toFixed(2)} /{unit}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Initial Harvest Yield Stock</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-bold text-farmGreen-950 tabular-nums transition-all"
                    required
                  />
                </div>
              </div>

              {/* Harvest Timestamp Tag */}
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Harvest Freshness Tag</label>
                <select
                  value={harvestTag}
                  onChange={(e) => setHarvestTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-semibold text-farmGreen-950  cursor-pointer"
                >
                  <option value="Harvested Today 5:30 AM">🌿 Harvested Today 5:30 AM (Fresh Morning Pick)</option>
                  <option value="Yesterday Evening Pick">🌅 Yesterday Evening Pick</option>
                  <option value="Hydroponic Batch #12">💧 Hydroponic Greenhouse Batch</option>
                  <option value="100% Tree Ripened">🌳 100% Tree-Ripened Naturally</option>
                </select>
              </div>

              {/* Compact Interactive Image Upload & Small Thumbnail Preview */}
              <div className="space-y-2">
                <label className="font-bold text-farmGreen-950 text-xs flex items-center justify-between">
                  <span>Crop Image & Photo Upload</span>
                  <span className="text-[10px] text-farmGreen-700 font-bold">Local File or Image Link</span>
                </label>

                {/* If Image Selected / Uploaded: Small Compact Preview Card */}
                {imageUrl ? (
                  <div className="p-2.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Small Thumbnail Preview Box (14x14 = 56px) */}
                      <div className="relative shrink-0">
                        <img
                          src={imageUrl}
                          alt="Crop Thumbnail"
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-500/80 shadow-sm"
                          loading="lazy"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-farmGreen-700 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                          ✓
                        </span>
                      </div>
                      
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-farmGreen-950 flex items-center gap-1">
                          <span>Photo Attached</span>
                          <span className="text-[10px] bg-farmGreen-100/80 text-farmGreen-800 px-1.5 py-0.5 rounded-md font-extrabold">Active</span>
                        </div>
                        <div className="text-[10px] text-farmGreen-700 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-farmGreen-600" />
                          <span>Ready for Marketplace</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Actions: Change Photo / Remove */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="px-3 py-1.5 bg-white hover:bg-farmGreen-100/80 text-farmGreen-800 border border-emerald-200 rounded-xl text-xs font-extrabold cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-2xs">
                        <Camera className="w-3.5 h-3.5 text-farmGreen-600" />
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileSelect}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setImageFiles([])}
                        className="p-1.5 bg-farmTerracotta-50 hover:bg-farmTerracotta-100 text-rose-600 border border-rose-200 rounded-xl transition-all cursor-pointer active:scale-95"
                        title="Remove Image"
                        aria-label="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Compact Upload Dropzone when no image */
                  <div className="p-3 bg-farmGreen-50/60/40 hover:bg-farmGreen-50/60/70 border-2 border-dashed border-emerald-300 rounded-2xl transition-all relative group flex items-center justify-between gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      title="Choose crop photo to upload"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-farmGreen-100/80 text-farmGreen-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-extrabold text-farmGreen-950 block leading-tight">Click to Upload Crop Photo</span>
                        <span className="text-[10px] text-farmMuted font-medium">Supports JPG, PNG, WEBP files</span>
                      </div>
                    </div>
                    
                    <span className="px-3 py-1.5 bg-farmGreen-700 text-white rounded-xl text-xs font-extrabold shrink-0 shadow-2xs">
                      Browse File
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Live Value Calculator */}
              {price && stock && (
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-farmGreen-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-farmGreen-600" />
                    <span>Estimated Crop Yield Valuation:</span>
                  </div>
                  <span className="font-display font-extrabold text-sm text-farmGreen-950">
                    ₹{(Number(price) * Number(stock)).toLocaleString()}
                  </span>
                </div>
              )}

            </div>

            {/* Footer Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-farmSage-100/40">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-2xl border border-farmSage-200/50 text-xs font-bold text-farmMuted hover:bg-farmSage-100/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white text-xs font-bold font-display shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Crop Listing</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-[28px] p-6 sm:p-7 max-w-xl w-full space-y-5 shadow-2xl border border-farmGreen-200/40 my-8 relative animate-scaleUp">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-farmSage-100/40">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-farmGreen-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-farmGreen-100/80 text-farmGreen-800 text-[10px] font-extrabold uppercase tracking-wider">
                      Catalog Editor
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-farmGreen-950 mt-0.5">
                    Edit Produce Listing
                  </h3>
                  <p className="text-xs text-farmMuted">Update live crop pricing, harvest stocks & marketplace parameters</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingProduct(null)} 
                className="w-8 h-8 rounded-full bg-farmSage-100/40 hover:bg-gray-200 text-farmMuted hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Interactive Preview Card Header */}
            <div className="p-3.5 bg-gradient-to-r from-farmBg via-emerald-50/50 to-farmBg rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={editingProduct.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80'} 
                  alt={editingProduct.name} 
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-200 shrink-0" 
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="font-display font-extrabold text-xs text-farmGreen-950 truncate">
                    {editingProduct.name || 'Produce Name'}
                  </div>
                  <div className="text-[10px] text-farmMuted flex items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-farmGreen-700 bg-white px-2 py-0.5 rounded-md border border-farmGreen-200/30">
                      {editingProduct.category || 'Vegetables'}
                    </span>
                    <span>• {editingProduct.unit ? `per ${editingProduct.unit}` : 'per kg'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] font-bold text-farmMuted uppercase">Valuation</div>
                <div className="font-display font-extrabold text-sm text-farmGreen-800">
                  ₹{((editingProduct.price || 0) * (editingProduct.stock || 0)).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Product Name */}
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Product / Crop Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-semibold text-farmGreen-950  transition-all"
                  required
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Category</label>
                  <select
                    value={editingProduct.category || 'Vegetables'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-bold text-farmGreen-950  cursor-pointer"
                  >
                    <option value="Vegetables">🥕 Vegetables</option>
                    <option value="Fruits">🍎 Fruits</option>
                    <option value="Dairy">🥛 Dairy</option>
                    <option value="Grocery">🌾 Farm Grains & Pulses</option>
                    <option value="Honey">🍯 Honey & Preserves</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Selling Unit</label>
                  <select
                    value={editingProduct.unit || 'kg'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-bold text-farmGreen-950  cursor-pointer"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="bunch">bunch</option>
                    <option value="liter">liter</option>
                    <option value="dozen">dozen</option>
                    <option value="box">box</option>
                    <option value="packet">packet</option>
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Price (₹ per unit)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-farmGreen-950 text-sm">₹</span>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-bold text-farmGreen-950 tabular-nums transition-all"
                      required
                    />
                  </div>
                  {editingProduct.price && Number(editingProduct.price) > 0 && (
                    <div className="mt-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200/60 text-[10px] space-y-0.5">
                      <div className="flex justify-between text-farmMuted font-bold">
                        <span>Platform Fee (8%):</span>
                        <span className="font-mono text-farmMuted tabular-nums">-₹{(Number(editingProduct.price) * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-900 font-extrabold">
                        <span>Net Take-Home (92%):</span>
                        <span className="font-mono text-emerald-800 font-black tabular-nums">₹{(Number(editingProduct.price) * 0.92).toFixed(2)} /{editingProduct.unit || 'unit'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Stock Quantity ({editingProduct.unit || 'units'})</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-bold text-farmGreen-950 tabular-nums transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, stock: (editingProduct.stock || 0) + 10 })}
                      className="px-2.5 py-2.5 bg-farmGreen-100/80 hover:bg-emerald-200 text-farmGreen-800 font-extrabold rounded-xl shrink-0 cursor-pointer text-xs"
                      title="Add 10 units"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>

              {/* Harvest Timestamp Tag */}
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 block">Harvest Freshness Tag</label>
                <select
                  value={editingProduct.harvestDate || 'Harvested Today 5:30 AM'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, harvestDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/40 backdrop-blur-sm/60 border border-farmSage-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 input-premium rounded-2xl text-xs font-semibold text-farmGreen-950  cursor-pointer"
                >
                  <option value="Harvested Today 5:30 AM">🌿 Harvested Today 5:30 AM (Fresh Morning Pick)</option>
                  <option value="Yesterday Evening Pick">🌅 Yesterday Evening Pick</option>
                  <option value="Hydroponic Batch #12">💧 Hydroponic Greenhouse Batch</option>
                  <option value="100% Tree Ripened">🌳 100% Tree-Ripened Naturally</option>
                </select>
              </div>

              {/* Compact Interactive Image Upload & Small Thumbnail Preview */}
              <div className="space-y-2">
                <label className="font-bold text-farmGreen-950 text-xs flex items-center justify-between">
                  <span>Crop Image & Photo Upload</span>
                  <span className="text-[10px] text-farmGreen-700 font-bold">Local File or Image Link</span>
                </label>

                {/* If Image Selected / Uploaded: Small Compact Preview Card */}
                {editingProduct.image ? (
                  <div className="p-2.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Small Thumbnail Preview Box (14x14 = 56px) */}
                      <div className="relative shrink-0">
                        <img
                          src={editingProduct.image}
                          alt="Crop Thumbnail"
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-500/80 shadow-sm shrink-0"
                          loading="lazy"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-farmGreen-700 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                          ✓
                        </span>
                      </div>
                      
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-farmGreen-950 flex items-center gap-1">
                          <span>Photo Attached</span>
                          <span className="text-[10px] bg-farmGreen-100/80 text-farmGreen-800 px-1.5 py-0.5 rounded-md font-extrabold">Active</span>
                        </div>
                        <div className="text-[10px] text-farmGreen-700 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-farmGreen-600" />
                          <span>Ready for Marketplace</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Actions: Change Photo / Remove */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="px-3 py-1.5 bg-white hover:bg-farmGreen-100/80 text-farmGreen-800 border border-emerald-200 rounded-xl text-xs font-extrabold cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-2xs">
                        <Camera className="w-3.5 h-3.5 text-farmGreen-600" />
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageFileSelect}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                        className="p-1.5 bg-farmTerracotta-50 hover:bg-farmTerracotta-100 text-rose-600 border border-rose-200 rounded-xl transition-all cursor-pointer active:scale-95"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Compact Upload Dropzone when no image */
                  <div className="p-3 bg-farmGreen-50/60/40 hover:bg-farmGreen-50/60/70 border-2 border-dashed border-emerald-300 rounded-2xl transition-all relative group flex items-center justify-between gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      title="Choose crop photo to upload"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-farmGreen-100/80 text-farmGreen-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-extrabold text-farmGreen-950 block leading-tight">Click to Upload Crop Photo</span>
                        <span className="text-[10px] text-farmMuted font-medium">Supports JPG, PNG, WEBP files</span>
                      </div>
                    </div>
                    
                    <span className="px-3 py-1.5 bg-farmGreen-700 text-white rounded-xl text-xs font-extrabold shrink-0 shadow-2xs">
                      Browse File
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-farmSage-100/40">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-5 py-2.5 rounded-2xl border border-farmSage-200/50 text-xs font-bold text-farmMuted hover:bg-farmSage-100/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white text-xs font-bold font-display shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

