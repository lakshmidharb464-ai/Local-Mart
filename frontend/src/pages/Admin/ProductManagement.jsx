import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Layers, 
  X, 
  ShoppingBag, 
  Tag, 
  Package, 
  Save, 
  PackageCheck, 
  FolderPlus,
  Sprout,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit3,
  Eye,
  MapPin,
  Image as ImageIcon,
  Upload,
  IndianRupee,
  ShieldCheck,
  Filter
} from 'lucide-react';

export const ProductManagement = ({ products = [], setProducts, categories = [], setCategories }) => {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');

  // Sample Produce Image Presets for 1-tap image selection
  const produceImagePresets = [
    { name: 'Organic Kale / Leafy', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80' },
    { name: 'Vine Fresh Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' },
    { name: 'Alphonso Mangoes', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80' },
    { name: 'Farm Fresh Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80' },
    { name: 'Organic Carrots', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80' }
  ];

  const [newProduct, setNewProduct] = useState({
    name: '',
    farmerName: 'Rajesh Kumar (Chittoor AP)',
    category: 'vegetables',
    price: 60,
    unit: '1 kg',
    stock: 100,
    image: produceImagePresets[0].url,
    status: 'Approved',
    district: 'Chittoor AP'
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCatFilter === 'all' || p.category === selectedCatFilter;
    const matchesRegion = filterRegion === 'all' ? true :
      filterRegion === 'chittoor' ? (p.district?.includes('Chittoor') || p.farmerName?.includes('Chittoor') || p.id?.startsWith('prod_ctr')) : true;
    return matchesSearch && matchesCat && matchesRegion;
  });

  const totalProducts = products.length;
  const approvedProducts = products.filter(p => p.status === 'Approved').length;
  const pendingProducts = products.filter(p => p.status === 'Pending').length;
  const totalCategories = categories.filter(c => c.id !== 'all').length;

  const handleApproveProduct = (id, name) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    if (showToast) showToast('Listing Approved ✓', `${name} is live on marketplace.`);
  };

  const handleRejectProduct = (id, name) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    if (showToast) showToast('Listing Rejected ✕', `${name} set to rejected.`, 'error');
  };

  const handleDeleteProduct = (id, name) => {
    setProducts(products.filter(p => p.id !== id));
    if (showToast) showToast('Produce Deleted 🗑️', `${name} removed from catalog.`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    if (showToast) showToast('Listing Updated 📝', 'Product details saved successfully.');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name) {
      if (showToast) showToast('Validation Error', 'Please enter produce name.', 'error');
      return;
    }

    const created = {
      id: `prod_${Date.now()}`,
      name: newProduct.name,
      farmerName: newProduct.farmerName || 'Rajesh Kumar',
      category: newProduct.category || 'vegetables',
      price: Number(newProduct.price) || 60,
      unit: newProduct.unit || '1 kg',
      stock: Number(newProduct.stock) || 100,
      image: newProduct.image || produceImagePresets[0].url,
      status: newProduct.status || 'Approved',
      district: newProduct.district || 'Chittoor AP',
      rating: 5.0
    };

    setProducts([created, ...products]);
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      farmerName: 'Rajesh Kumar (Chittoor AP)',
      category: 'vegetables',
      price: 60,
      unit: '1 kg',
      stock: 100,
      image: produceImagePresets[0].url,
      status: 'Approved',
      district: 'Chittoor AP'
    });
    if (showToast) showToast('Produce Onboarded 🎉', `${created.name} listed successfully!`);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    const catObj = { id: newCatName.toLowerCase().replace(/\s+/g, '-'), name: newCatName, icon: 'ShoppingBag' };
    setCategories([...categories, catObj]);
    setNewCatName('');
    if (showToast) showToast('Category Created 📁', `Category "${newCatName}" added.`);
  };

  const handleImageFileUpload = (e, targetSetter) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      targetSetter(fakeUrl);
      if (showToast) showToast('Photo Attached 📷', 'Crop image uploaded cleanly.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-display pb-12">
      
      {/* Header Controls */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-black text-2xl text-farmGreen-950 tracking-tight">Produce Catalog Governance</h2>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 shadow-2xs font-mono">
              {totalProducts} Items Total
            </span>
          </div>
          <p className="text-xs text-farmMuted font-bold mt-1">
            Approve fresh produce listings, onboard new crops, update pricing & inventory stock
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-farmGreen-950 text-white rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Onboard New Produce</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-farmMuted tracking-wider">Total Catalog</div>
            <div className="font-mono font-black text-xl text-farmGreen-950">{totalProducts}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-farmMuted tracking-wider">Approved Live</div>
            <div className="font-mono font-black text-xl text-emerald-700">{approvedProducts}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-farmMuted tracking-wider">Pending Review</div>
            <div className="font-mono font-black text-xl text-amber-600">{pendingProducts}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
            <Layers className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-farmMuted tracking-wider">Active Categories</div>
            <div className="font-mono font-black text-xl text-blue-700">{totalCategories}</div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
          <input
            type="text"
            placeholder="Search produce name, farmer, category..."
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

        {/* Category Pills & Region Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCatFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCatFilter === 'all' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-gray-50 text-gray-700 hover:bg-emerald-50'
            }`}
          >
            All Produce
          </button>
          {categories.filter(c => c.id !== 'all').map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedCatFilter === cat.id ? 'bg-emerald-800 text-white shadow-xs' : 'bg-gray-50 text-gray-700 hover:bg-emerald-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => setFilterRegion(filterRegion === 'chittoor' ? 'all' : 'chittoor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 border whitespace-nowrap ${
              filterRegion === 'chittoor'
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                : 'bg-gray-50 border-gray-200 text-amber-900 hover:bg-amber-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-800" />
            <span>📍 Chittoor AP</span>
          </button>
        </div>

      </div>

      {/* Produce Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((p) => {
          const isChittoor = p.district?.includes('Chittoor') || p.farmerName?.includes('Chittoor') || p.id?.startsWith('prod_ctr');

          return (
            <div 
              key={p.id}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              {/* Photo Header */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img 
                  src={p.image} 
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs ${
                    p.status === 'Approved' ? 'bg-emerald-500 text-white' :
                    p.status === 'Pending' ? 'bg-amber-400 text-slate-950' :
                    'bg-rose-500 text-white'
                  }`}>
                    ● {p.status}
                  </span>
                  {isChittoor && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-xs">
                      📍 Chittoor AP
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">{p.category}</span>
                    <span className="text-xs font-mono font-black text-farmMuted">Stock: {p.stock || 50}</span>
                  </div>
                  <h3 className="font-black text-base text-farmGreen-950">{p.name}</h3>
                  <div className="text-xs text-farmMuted font-bold">Farmer: {p.farmerName}</div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-farmMuted font-black block uppercase">Market Price</span>
                    <span className="font-mono font-black text-lg text-emerald-800">
                      ₹{p.price} <span className="text-xs text-farmMuted font-sans">/ {p.unit || '1 kg'}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {p.status === 'Pending' && (
                      <button
                        onClick={() => handleApproveProduct(p.id, p.name)}
                        className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors cursor-pointer"
                        title="Approve Listing"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboard Produce Item Modal - Fully Responsive Scrollable Modal with Quick Adjusters */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleAddProduct} className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl border border-emerald-100 animate-scaleUp max-h-[90vh] overflow-y-auto scrollbar-thin">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black shrink-0">
                  <PackageCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-farmGreen-950">Onboard Produce Item</h3>
                  <p className="text-xs text-farmMuted font-bold">List a new farm fresh product on the marketplace</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold">
              
              {/* Produce Name */}
              <div>
                <label className="font-black text-farmGreen-950 mb-1 block">Produce Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Hydroponic Kale"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl outline-none font-bold text-farmGreen-950"
                  required
                />
              </div>

              {/* Photo Thumbnail Header & Clean Preset Image Selector */}
              <div className="space-y-2">
                <label className="font-black text-farmGreen-950 block">Produce Photo (Select Preset or Upload)</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-emerald-300 shadow-2xs">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {produceImagePresets.map((pr, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewProduct({ ...newProduct, image: pr.url })}
                        className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          newProduct.image === pr.url ? 'border-emerald-600 ring-2 ring-emerald-300 scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'
                        }`}
                        title={pr.name}
                      >
                        <img src={pr.url} alt={pr.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    
                    <label className="w-12 h-12 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-dashed border-emerald-300 flex items-center justify-center shrink-0 cursor-pointer">
                      <Upload className="w-5 h-5 text-emerald-700" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageFileUpload(e, (url) => setNewProduct({ ...newProduct, image: url }))}
                      />
                    </label>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Photo Attached • Ready for Marketplace Listing</span>
                </div>
              </div>

              {/* 2-Column Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-farmGreen-950 mb-1 block">Producer Farmer</label>
                  <input
                    type="text"
                    placeholder="Rajesh Kumar (Chittoor AP)"
                    value={newProduct.farmerName}
                    onChange={(e) => setNewProduct({ ...newProduct, farmerName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-black text-farmGreen-950 mb-1 block">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl outline-none font-bold"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-black text-farmGreen-950">Price (₹)</label>
                    <div className="flex items-center gap-1">
                      {[-10, 10, 20].map(amt => (
                        <button
                          type="button"
                          key={amt}
                          onClick={() => setNewProduct({ ...newProduct, price: Math.max(1, newProduct.price + amt) })}
                          className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[10px] font-black rounded border border-emerald-200 cursor-pointer"
                        >
                          {amt > 0 ? `+₹${amt}` : `-₹${Math.abs(amt)}`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder="60"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl outline-none font-mono font-black"
                    required
                  />
                </div>

                <div>
                  <label className="font-black text-farmGreen-950 mb-1 block">Unit / Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg or 500g"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-black text-farmGreen-950">Inventory Stock Count</label>
                    <div className="flex items-center gap-1">
                      {[50, 100, 250].map(st => (
                        <button
                          type="button"
                          key={st}
                          onClick={() => setNewProduct({ ...newProduct, stock: st })}
                          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-black rounded border border-gray-200 cursor-pointer"
                        >
                          {st} kg
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder="100"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl outline-none font-mono font-black"
                  />
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="pt-2 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-5 py-2.5 rounded-2xl border border-gray-200 text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Onboard Produce</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-emerald-100 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-2xl">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-farmGreen-950">Farm Categories</h3>
                  <p className="text-xs text-farmMuted font-bold">Add new produce categories</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs font-bold">
              <div>
                <label className="font-black text-farmGreen-950 mb-1 block">New Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Dairy & Eggs"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-black shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-emerald-100 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-farmGreen-950">Edit Produce Listing</h3>
                  <p className="text-xs text-farmMuted font-bold">Update price, unit, and inventory stock</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
              <div className="sm:col-span-2">
                <label className="font-black text-farmGreen-950 mb-1 block">Produce Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-black text-farmGreen-950 mb-1 block">Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-black text-farmGreen-950 mb-1 block">Unit / Quantity</label>
                <input
                  type="text"
                  value={editingProduct.unit || '1 kg'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-5 py-2.5 rounded-2xl border border-gray-200 text-xs font-extrabold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Save Listing</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ProductManagement;
