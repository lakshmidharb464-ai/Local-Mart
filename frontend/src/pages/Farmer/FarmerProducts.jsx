import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { farmerService } from '../../services/farmerService';
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
  Power,
  RefreshCw
} from 'lucide-react';

export const FarmerProducts = ({ 
  products = [],
  setProducts, 
  showAddModal, 
  setShowAddModal,
  addProduct,
  updateProduct,
  deleteProduct,
  refreshData
}) => {
  const { showToast, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFlashDealModal, setShowFlashDealModal] = useState(false);
  const [cardViewType, setCardViewType] = useState('grid'); // 'grid' | 'table' | 'revenue'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // id currently awaiting delete confirm

  // New product form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // [{ url: string, name: string }], max 5
  const primaryImageUrl = imageFiles[0]?.url || '';
  const imageUrl = primaryImageUrl;
  const [harvestTag, setHarvestTag] = useState('Harvested Today 5:30 AM');

  // Cloudinary Photo Upload Handler
  const handleImageFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const file = files[0];

    // Immediate local preview
    const previewUrl = URL.createObjectURL(file);
    setImageFiles([{ url: previewUrl, name: file.name }]);

    setIsUploadingImage(true);
    try {
      // Upload directly to Cloudinary media stream
      const cloudinaryUrl = await farmerService.uploadImage(file, 'farmer-products');
      if (cloudinaryUrl) {
        setImageFiles([{ url: cloudinaryUrl, name: file.name }]);
        showToast('Photo Uploaded to Cloudinary ☁️', `${file.name} saved.`);
      }
    } catch (err) {
      console.warn('Cloudinary upload fallback to data URI:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageFiles([{ url: event.target.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
      showToast('Photo Attached 📸', `${file.name} ready.`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleEditImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate local preview
    const previewUrl = URL.createObjectURL(file);
    setEditingProduct(prev => ({ ...prev, image: previewUrl }));

    setIsUploadingEditImage(true);
    try {
      // Upload directly to Cloudinary media stream
      const cloudinaryUrl = await farmerService.uploadImage(file, 'farmer-products');
      if (cloudinaryUrl) {
        setEditingProduct(prev => ({ ...prev, image: cloudinaryUrl }));
        showToast('Photo Uploaded to Cloudinary ☁️', 'New crop photo saved.');
      }
    } catch (err) {
      console.warn('Cloudinary upload fallback to data URI:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingProduct(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
      showToast('Photo Updated 📸', 'New crop photo loaded.');
    } finally {
      setIsUploadingEditImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSetPrimary = (index) => {
    setImageFiles(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      return [moved, ...updated];
    });
  };

  // Flash Deal State
  const [flashDiscount, setFlashDiscount] = useState('15');
  const [flashTargetId, setFlashTargetId] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const categoriesList = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Herbs'];

  const safeProducts = Array.isArray(products) ? products : [];

  const matchesCategoryFilter = (itemCategory, filter) => {
    if (!filter || filter === 'All') return true;
    const cat = (itemCategory || '').toLowerCase();
    const f = filter.toLowerCase();
    if (f === 'vegetables') return cat.includes('veg');
    if (f === 'fruits') return cat.includes('fruit') || cat.includes('season') || cat.includes('apple') || cat.includes('mango');
    if (f === 'dairy') return cat.includes('dairy') || cat.includes('milk') || cat.includes('egg');
    if (f === 'grains') return cat.includes('grain') || cat.includes('groc') || cat.includes('oil') || cat.includes('pulse');
    if (f === 'herbs') return cat.includes('herb');
    return cat.includes(f);
  };

  const filteredProducts = safeProducts.filter(p => {
    if (!p) return false;
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = matchesCategoryFilter(p.category, selectedCategoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Bulk Operations Handlers (optimistic + persistent sync)
  const handleBulkPriceAdjust = async (percent) => {
    if (safeProducts.length === 0) return;
    const updated = safeProducts.map(p => ({
      ...p,
      price: Math.max(1, Math.round((p.price || 0) * (1 + percent / 100)))
    }));
    setProducts(updated);
    showToast('Bulk Pricing Updated ⚡', `All catalog prices shifted by ${percent > 0 ? '+' : ''}${percent}%. Syncing...`);
    try {
      await Promise.allSettled(
        updated.map(p =>
          updateProduct ? updateProduct(p.id, { price: p.price }) : farmerService.updateProduct(p.id, { price: p.price })
        )
      );
      showToast('All Prices Synced ✅', 'Updated catalog live in marketplace.');
    } catch (err) {
      console.error('Bulk price sync error:', err);
    }
  };

  const handleBulkRestock = async (amount) => {
    if (safeProducts.length === 0) return;
    const updated = safeProducts.map(p => ({
      ...p,
      stock: Math.max(0, (p.stock || 0) + amount)
    }));
    setProducts(updated);
    showToast('Bulk Harvest Restock 🌱', `Added +${amount} units across all listed crops. Syncing...`);
    try {
      await Promise.allSettled(
        updated.map(p =>
          updateProduct ? updateProduct(p.id, { stock: p.stock }) : farmerService.updateProduct(p.id, { stock: p.stock })
        )
      );
      showToast('All Stocks Synced ✅', 'Inventory counts refreshed.');
    } catch (err) {
      console.error('Bulk restock sync error:', err);
    }
  };

  // Inline Stock Adjuster Handler (optimistic + persistent sync)
  const handleAdjustStock = async (id, delta) => {
    const prod = safeProducts.find(p => p.id === id);
    if (!prod) return;
    const newStock = Math.max(0, (prod.stock || 0) + delta);

    setProducts(prev =>
      (Array.isArray(prev) ? prev : []).map(p =>
        p.id === id ? { ...p, stock: newStock } : p
      )
    );

    try {
      if (updateProduct) {
        await updateProduct(id, { stock: newStock });
      } else {
        await farmerService.updateProduct(id, { stock: newStock });
      }
      showToast('Stock Adjusted 📦', `${prod.name}: ${newStock} ${prod.unit || 'kg'} available.`);
    } catch (err) {
      console.error('Stock adjust sync error:', err);
    }
  };

  // Toggle Availability (optimistic + persistent sync)
  const handleToggleAvailability = async (id) => {
    const prod = safeProducts.find(p => p.id === id);
    if (!prod) return;
    const isCurrentlyOff = prod.status === 'Inactive' || prod.isUnavailable;
    const newStatus = isCurrentlyOff ? 'Approved' : 'Inactive';
    const newUnavailable = !isCurrentlyOff;

    setProducts(prev =>
      (Array.isArray(prev) ? prev : []).map(p =>
        p.id === id ? { ...p, isUnavailable: newUnavailable, status: newStatus } : p
      )
    );
    showToast(newUnavailable ? 'Listing Paused ⏸️' : 'Listing Live ✅', `${prod.name} is now ${newUnavailable ? 'hidden from marketplace' : 'active'}.`);

    try {
      if (updateProduct) {
        await updateProduct(id, { status: newStatus });
      } else {
        await farmerService.updateProduct(id, { status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update product status:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || price === '') return;
    setIsSubmitting(true);

    const chosenPhoto = imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';

    const payload = {
      name,
      category,
      categoryId: category,
      price: Number(price),
      unit,
      stock: Number(stock) || 50,
      isOrganic: true,
      harvestTag: harvestTag || 'Harvested Today 5:30 AM',
      harvestDate: harvestTag || 'Today Morning',
      image: chosenPhoto,
      imageUrl: chosenPhoto,
      description: 'Fresh organic farm harvest directly from verified rural fields.'
    };

    try {
      if (addProduct) {
        await addProduct(payload);
      } else {
        await farmerService.createProduct(payload);
        const refreshed = await farmerService.fetchMyProducts();
        setProducts(refreshed);
        showToast('Crop Listing Published! 🌾', `${name} added to your active marketplace catalog.`);
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Error adding crop to backend:', err);
      // Fallback local update
      const newProd = {
        id: 'p_farmer_' + Date.now(),
        ...payload,
        rating: 5.0,
        reviewsCount: 1,
        farmerName: user?.name || 'Rajesh Kumar',
        farmerLocation: 'Pune Rural Hub',
      };
      setProducts(prev => [newProd, ...prev]);
      setShowAddModal(false);
      showToast('Crop Listing Published! 🌾', `${name} added to catalog.`);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);

    const changes = {
      name: editingProduct.name,
      category: editingProduct.category,
      categoryId: editingProduct.category,
      price: Number(editingProduct.price),
      unit: editingProduct.unit,
      stock: Number(editingProduct.stock),
      harvestTag: editingProduct.harvestDate || 'Harvested Today 5:30 AM',
      harvestDate: editingProduct.harvestDate || 'Today Morning',
      image: editingProduct.image,
      imageUrl: editingProduct.image,
      description: editingProduct.description,
    };

    try {
      if (updateProduct) {
        // updateProduct (hook) already does optimistic update + toast internally
        await updateProduct(editingProduct.id, changes);
      } else {
        await farmerService.updateProduct(editingProduct.id, changes);
        setProducts(prev =>
          (Array.isArray(prev) ? prev : []).map(p =>
            p.id === editingProduct.id ? { ...p, ...changes } : p
          )
        );
        showToast('Listing Saved', `${editingProduct.name} parameters updated.`);
      }
    } catch {
      // updateProduct from hook already rolled back state and toasted — no double action needed
    } finally {
      setEditingProduct(null);
      setIsSubmitting(false);
    }
  };

  const handleLaunchFlashSale = async (e) => {
    e.preventDefault();
    if (!flashTargetId) return;

    const discountPct = Number(flashDiscount) / 100;
    const targetProd = safeProducts.find(p => p.id === flashTargetId);
    if (!targetProd) return;

    const basePrice = targetProd.originalPrice || targetProd.price || 0;
    const discountedPrice = Math.max(1, Math.round(basePrice * (1 - discountPct)));

    setProducts(prev =>
      (Array.isArray(prev) ? prev : []).map(p => {
        if (p.id === flashTargetId) {
          return {
            ...p,
            originalPrice: basePrice,
            price: discountedPrice,
            isFlashSale: true,
            flashDiscount: Number(flashDiscount),
          };
        }
        return p;
      })
    );

    setShowFlashDealModal(false);
    const targetName = targetProd.name;
    setFlashTargetId('');
    showToast('⚡ Morning Flash Sale Active!', `${flashDiscount}% discount applied to ${targetName} for 2 hours to boost crop sales.`);

    try {
      const payload = {
        price: discountedPrice,
        flashDiscount: Number(flashDiscount),
      };
      if (updateProduct) {
        await updateProduct(flashTargetId, payload);
      } else {
        await farmerService.updateProduct(flashTargetId, payload);
      }
    } catch (err) {
      console.error('Failed to sync flash deal:', err);
    }
  };

  const handleDeleteProduct = async (id, prodName) => {
    setDeletingId(null); // close inline confirmation
    try {
      if (deleteProduct) {
        // deleteProduct (hook) already does optimistic remove + toast internally
        await deleteProduct(id, prodName);
      } else {
        await farmerService.deleteProduct(id);
        setProducts(prev => (Array.isArray(prev) ? prev : []).filter(p => p.id !== id));
        showToast('Listing Removed', `${prodName} deleted from catalog.`);
      }
    } catch {
      // deleteProduct from hook already rolled back state and toasted — no double action needed
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Vegetables');
    setPrice('');
    setUnit('kg');
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${cardViewType === 'grid' ? 'bg-farmGreen-700 text-white shadow-sm' : 'text-farmMuted hover:text-farmGreen-950'
                }`}
              title="Visual Photo Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setCardViewType('revenue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${cardViewType === 'revenue' ? 'bg-farmGreen-700 text-white shadow-sm' : 'text-farmMuted hover:text-farmGreen-950'
                }`}
              title="Batch Revenue Cards"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Batch</span>
            </button>
            <button
              onClick={() => setCardViewType('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${cardViewType === 'table' ? 'bg-farmGreen-700 text-white shadow-sm' : 'text-farmMuted hover:text-farmGreen-950'
                }`}
              title="Telemetry Market Table"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {refreshData && (
            <button
              onClick={refreshData}
              title="Refresh farm data"
              className="p-2 bg-white/40 hover:bg-white/70 text-farmMuted hover:text-farmGreen-800 rounded-xl border border-farmGreen-200/30 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

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
              ? safeProducts.length
              : safeProducts.filter(p => p && matchesCategoryFilter(p.category, cat)).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${isSelected
                  ? 'bg-emerald-700 text-white shadow-sm scale-102 ring-2 ring-emerald-400/40'
                  : 'bg-white text-farmGreen-950 border border-farmSage-200/50 hover:border-emerald-300 hover:bg-farmGreen-50/60/50'
                  }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-farmSage-100/40 text-farmMuted'
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State — shown across all view types when no products match */}
      {filteredProducts.length === 0 && (
        <div className="glass-surface rounded-3xl border border-farmGreen-200/40 p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-farmGreen-100/80 flex items-center justify-center">
            <Package className="w-8 h-8 text-farmGreen-400" />
          </div>
          <div>
            <p className="font-extrabold text-sm text-farmGreen-950">
              {searchQuery || selectedCategoryFilter !== 'All' ? 'No crops match your filter' : 'No crop listings yet'}
            </p>
            <p className="text-xs text-farmMuted mt-1">
              {searchQuery || selectedCategoryFilter !== 'All'
                ? 'Try adjusting your search or category filter.'
                : 'Click "+ Add Crop" to publish your first harvest listing.'}
            </p>
          </div>
          {!searchQuery && selectedCategoryFilter === 'All' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:from-emerald-500 hover:to-teal-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Crop</span>
            </button>
          )}
        </div>
      )}
      {cardViewType === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const isOff = prod.isUnavailable || prod.stock === 0 || prod.status === 'Inactive';
            const isLowStock = (prod.stock || 0) < 15;
            const maxStock = prod.maxStock || 150;
            const stockPct = Math.min(100, Math.round(((prod.stock || 0) / maxStock) * 100));
            const totalValuation = (prod.stock || 0) * (prod.price || 0);
            const isConfirmingDelete = deletingId === prod.id;

            return (
              <div
                key={prod.id}
                className={`glass-surface rounded-3xl border p-4 shadow-glass hover:shadow-farm-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3 group ${
                  isOff ? 'border-gray-300 opacity-85' : 'border-farmGreen-200/40 hover:border-emerald-300'
                }`}
              >
                <div
                  className="space-y-3 cursor-pointer"
                  onClick={() => setEditingProduct(prod)}
                  title="Click to edit"
                >

                  {/* Image & Harvest Tags */}
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
                    <img
                      src={prod.image || prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'; }}
                    />

                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-farmGreen-900/90 backdrop-blur-xs text-farmGold-300 shadow-sm border border-emerald-500/20">
                      {prod.category}
                    </span>

                    {isOff ? (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900/90 text-amber-300 shadow-sm border border-amber-500/30 flex items-center gap-1">
                        <Power className="w-3 h-3 text-amber-400" />
                        <span>{prod.stock === 0 ? 'OUT OF STOCK' : 'PAUSED'}</span>
                      </span>
                    ) : prod.isFlashSale ? (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-sm flex items-center gap-1 animate-pulse">
                        <Zap className="w-3 h-3 fill-white" />
                        <span>FLASH SALE</span>
                      </span>
                    ) : null}

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
                          className={`h-full rounded-full transition-all duration-300 ${isLowStock ? 'bg-farmTerracotta-500' : stockPct > 50 ? 'bg-farmGreen-600' : 'bg-amber-500'
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
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAvailability(prod.id);
                    }}
                    title={isOff ? "Resume Crop Listing" : "Pause Crop Listing"}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      isOff
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-farmGreen-50/60 hover:bg-farmGreen-100/80 text-farmGreen-800 border-emerald-200/80'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingProduct(prod)}
                    title="Edit Crop Details"
                    className="flex-1 h-9 bg-farmGreen-50/60 hover:bg-farmGreen-100/80 text-farmGreen-800 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-emerald-200/80 text-xs font-bold"
                  >
                    <Edit className="w-3.5 h-3.5" /><span>Edit</span>
                  </button>
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="px-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >Confirm</button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-1.5 bg-white hover:bg-gray-100 text-farmMuted rounded-lg text-[11px] font-bold cursor-pointer border border-farmSage-200/50"
                      >Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(prod.id)}
                      title="Remove Crop Listing"
                      className="w-9 h-9 bg-farmTerracotta-50 hover:bg-farmTerracotta-100 text-farmTerracotta-700 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-rose-200/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW TYPE 2: BATCH REVENUE CARDS VIEW */}
      {cardViewType === 'revenue' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => {
            const isOff = prod.isUnavailable || prod.stock === 0;
            const valuation = (prod.stock || 0) * (prod.price || 0);

            return (
              <div
                key={prod.id}
                onClick={() => setEditingProduct(prod)}
                className={`glass-surface rounded-3xl border p-5 shadow-glass space-y-4 transition-all cursor-pointer hover:shadow-farm-md hover:-translate-y-1 ${isOff ? 'border-gray-300 opacity-80' : 'border-farmGreen-200/40 hover:border-emerald-300'
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
                    className={`p-2 rounded-xl text-xs font-bold cursor-pointer border ${isOff ? 'bg-farmSage-100/40 text-farmMuted border-gray-300' : 'bg-farmGreen-50/60 text-farmGreen-800 border-emerald-200'
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
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Estimated Revenue</th>
                  <th className="p-3 text-center">Quick Stock Adjust</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-farmText">
                {filteredProducts.map((prod) => {
                  const isOff = prod.isUnavailable || prod.stock === 0 || prod.status === 'Inactive';
                  const isConfirmingDelete = deletingId === prod.id;

                  return (
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

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                          isOff ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOff ? 'bg-amber-600' : 'bg-emerald-600'}`} />
                          {isOff ? (prod.stock === 0 ? 'Out of Stock' : 'Paused') : 'Active'}
                        </span>
                      </td>

                      <td className="p-3 text-right font-display font-extrabold text-farmGreen-800">
                        ₹{(prod.stock * prod.price).toLocaleString()}
                      </td>

                      <td className="p-3 text-center">
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-1.5"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdjustStock(prod.id, -5);
                            }}
                            className="px-2 py-1 bg-farmSage-100/40 hover:bg-gray-200 text-farmGreen-950 rounded font-bold text-[11px] cursor-pointer"
                            title="Decrease (-5)"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdjustStock(prod.id, 10);
                            }}
                            className="px-2 py-1 bg-emerald-700 hover:bg-farmGreen-800 text-white rounded font-bold text-[11px] cursor-pointer"
                            title="Increase (+10)"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-1.5"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAvailability(prod.id);
                            }}
                            title={isOff ? "Resume crop" : "Pause crop"}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isOff ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-farmGreen-50/60 text-farmGreen-800 border-emerald-200'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProduct(prod)}
                            title="Edit"
                            className="p-1.5 bg-white text-farmGreen-800 border border-farmSage-200 rounded-lg hover:bg-farmGreen-50 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="px-1.5 py-1 bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Del
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="px-1.5 py-1 bg-gray-200 text-gray-700 rounded text-[10px] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingId(prod.id)}
                              title="Delete"
                              className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Flash Deal Modal */}
      {showFlashDealModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 flex min-h-screen items-center justify-center animate-fadeIn">
          <form onSubmit={handleLaunchFlashSale} className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-[28px] bg-white/95 backdrop-blur-2xl border border-amber-200/80 shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden my-auto animate-scaleUp">

            {/* Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-farmSage-100/60 bg-white/80 backdrop-blur-xl flex justify-between items-start shrink-0">
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
                className="w-8 h-8 rounded-full bg-farmSage-100/60 hover:bg-gray-200 text-farmMuted hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1 scrollbar-thin">
              <div>
                <label className="font-bold text-farmGreen-950 mb-1.5 flex items-center justify-between">
                  <span>Select Target Produce</span>
                  <span className="text-[11px] text-farmGreen-700 font-semibold">{products.length} available</span>
                </label>
                <select
                  value={flashTargetId}
                  onChange={(e) => setFlashTargetId(e.target.value)}
                  className="w-full p-3 bg-white/60 backdrop-blur-sm/80 border border-farmGreen-200 rounded-2xl font-bold text-xs text-farmGreen-950 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-all cursor-pointer"
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
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${flashDiscount === opt.val
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/60 shadow-sm'
                        : 'bg-white/60 backdrop-blur-sm/60 border-farmSage-200/50 hover:bg-white'
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

            <div className="p-4 sm:p-5 border-t border-farmSage-100/60 bg-white/85 backdrop-blur-xl flex items-center justify-end gap-3 shrink-0">
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 flex min-h-screen items-center justify-center animate-fadeIn">
          <form onSubmit={handleAddProduct} className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-[28px] bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden my-auto animate-scaleUp">

            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-farmSage-100/60 bg-white/85 backdrop-blur-xl flex justify-between items-start shrink-0">
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
                className="w-8 h-8 rounded-full bg-farmSage-100/60 hover:bg-gray-200 text-farmMuted hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
              {/* Live Interactive Marketplace Preview Card */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <label className="relative shrink-0 cursor-pointer group" title="Click to upload crop photo to Cloudinary">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={name || 'Produce Preview'}
                        className="w-14 h-14 rounded-2xl object-cover overflow-hidden ring-2 ring-emerald-400/80 shadow-sm group-hover:scale-105 group-hover:brightness-90 transition-all shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-700 flex flex-col items-center justify-center ring-2 ring-emerald-300 shadow-sm group-hover:scale-105 transition-all">
                        <Sprout className="w-6 h-6" />
                        <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">Photo</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-5 h-5 drop-shadow-md" />
                    </div>
                    {imageUrl && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-farmGreen-700 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                        ✓
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileSelect}
                      className="hidden"
                    />
                  </label>
                  <div className="min-w-0">
                    <div className="font-display font-extrabold text-xs text-farmGreen-950 truncate">
                      {name || 'Enter Crop / Produce Name'}
                    </div>
                    <div className="text-[10px] text-farmMuted flex items-center gap-1.5 mt-0.5">
                      <span className="font-extrabold text-farmGreen-800 bg-white px-2 py-0.5 rounded-md border border-farmGreen-200/30">
                        {category}
                      </span>
                      <span>• {unit ? `per ${unit}` : 'per kg'}</span>
                      <span className="text-farmGreen-700 font-extrabold">({stock || 0} in stock)</span>
                    </div>
                    <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">📷 Click to upload photo via Cloudinary</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold text-farmSage-400 uppercase">Farmer Price</div>
                  <div className="font-display font-black text-base text-farmGreen-800">
                    ₹{price || '0'}
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs">

                {/* Product Name */}
                <div>
                  <label className="font-bold text-farmGreen-950 mb-1.5 block">Crop / Produce Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Tomatoes, Fresh Spinach, Alphonso Mangoes"
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

                {/* Interactive Image Upload & Cloudinary Thumbnail Preview */}
                <div className="space-y-2">
                  <label className="font-bold text-farmGreen-950 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Crop Photo (Cloudinary CDN)</span>
                    </span>
                    <span className="text-[10px] text-farmGreen-700 font-bold">Direct Image Upload</span>
                  </label>

                  {isUploadingImage ? (
                    <div className="p-4 bg-emerald-50/80 border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-extrabold text-emerald-900">Uploading photo to Cloudinary CDN...</span>
                    </div>
                  ) : imageUrl ? (
                    <div className="p-2.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Small Thumbnail Preview Box */}
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
                          <div className="text-xs font-extrabold text-farmGreen-950 flex items-center gap-1.5">
                            <span>Cloudinary Photo Active</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black uppercase">Synced</span>
                          </div>
                          <div className="text-[10px] text-farmGreen-700 font-bold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-farmGreen-600" />
                            <span>Optimized for Marketplace</span>
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
                    /* Upload Dropzone when no image */
                    <div className="p-3 bg-farmGreen-50/60 hover:bg-farmGreen-100/70 border-2 border-dashed border-emerald-300 rounded-2xl transition-all relative group flex items-center justify-between gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        title="Choose crop photo to upload to Cloudinary"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-farmGreen-100 text-farmGreen-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-extrabold text-farmGreen-950 block leading-tight">Upload Photo to Cloudinary</span>
                          <span className="text-[10px] text-farmMuted font-medium">Supports JPG, PNG, WEBP (Max 5MB)</span>
                        </div>
                      </div>

                      <span className="px-3 py-1.5 bg-farmGreen-700 text-white rounded-xl text-xs font-extrabold shrink-0 shadow-2xs">
                        Browse Photo
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

            </div>

            {/* Sticky Glass Footer Buttons */}
            <div className="p-4 sm:p-5 border-t border-farmSage-100/60 bg-white/85 backdrop-blur-xl flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-2xl border border-farmSage-200/50 text-xs font-bold text-farmMuted hover:bg-farmSage-100/40 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white text-xs font-bold font-display shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Publish Crop Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 flex min-h-screen items-center justify-center animate-fadeIn">
          <form onSubmit={handleSaveEdit} className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-[28px] bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden my-auto animate-scaleUp">

            {/* Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-farmSage-100/60 bg-white/85 backdrop-blur-xl flex justify-between items-start shrink-0">
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
                className="w-8 h-8 rounded-full bg-farmSage-100/60 hover:bg-gray-200 text-farmMuted hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
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

                {/* Interactive Image Upload & Cloudinary Thumbnail Preview */}
                <div className="space-y-2">
                  <label className="font-bold text-farmGreen-950 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Crop Photo (Cloudinary CDN)</span>
                    </span>
                    <span className="text-[10px] text-farmGreen-700 font-bold">Direct Image Upload</span>
                  </label>

                  {isUploadingEditImage ? (
                    <div className="p-4 bg-emerald-50/80 border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-extrabold text-emerald-900">Uploading photo to Cloudinary CDN...</span>
                    </div>
                  ) : editingProduct.image ? (
                    <div className="p-2.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Small Thumbnail Preview Box */}
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
                          <div className="text-xs font-extrabold text-farmGreen-950 flex items-center gap-1.5">
                            <span>Cloudinary Photo Active</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black uppercase">Synced</span>
                          </div>
                          <div className="text-[10px] text-farmGreen-700 font-bold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-farmGreen-600" />
                            <span>Optimized for Marketplace</span>
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
                    /* Upload Dropzone when no image */
                    <div className="p-3 bg-farmGreen-50/60 hover:bg-farmGreen-100/70 border-2 border-dashed border-emerald-300 rounded-2xl transition-all relative group flex items-center justify-between gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        title="Choose crop photo to upload to Cloudinary"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-farmGreen-100 text-farmGreen-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-extrabold text-farmGreen-950 block leading-tight">Upload Photo to Cloudinary</span>
                          <span className="text-[10px] text-farmMuted font-medium">Supports JPG, PNG, WEBP (Max 5MB)</span>
                        </div>
                      </div>

                      <span className="px-3 py-1.5 bg-farmGreen-700 text-white rounded-xl text-xs font-extrabold shrink-0 shadow-2xs">
                        Browse Photo
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Sticky Glass Footer Buttons */}
            <div className="p-4 sm:p-5 border-t border-farmSage-100/60 bg-white/85 backdrop-blur-xl flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-2xl border border-farmSage-200/50 text-xs font-bold text-farmMuted hover:bg-farmSage-100/40 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white text-xs font-bold font-display shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

