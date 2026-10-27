import React, { useState, useEffect, useMemo } from 'react';
import { customerService } from '../../services/customerService';
import { productService } from '../../services/productService';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  Calendar, 
  CalendarX,
  CalendarCheck,
  Plus, 
  Minus,
  Trash2, 
  Clock, 
  Check, 
  Bell, 
  Save, 
  Power,
  Sparkles, 
  Percent, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Info,
  Zap,
  User,
  Package,
  Flame,
  Plane,
  CalendarRange,
  X,
  Search,
  CheckCircle2,
  Milk,
  Egg,
  Apple,
  Carrot,
  Leaf,
  Wheat,
  Sprout,
  Layers,
  Filter,
  Check as CheckIcon
} from 'lucide-react';

/**
 * Returns dynamic category & crop icon mapping with tailored theme styling
 */
const getProductIconInfo = (item) => {
  if (!item) return { Icon: Sprout, label: 'Produce', color: 'emerald', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  const str = `${item.category || ''} ${item.categoryId || ''} ${item.name || ''}`.toLowerCase();
  
  if (str.includes('milk') || str.includes('dairy') || str.includes('ghee') || str.includes('paneer') || str.includes('butter')) {
    return { Icon: Milk, label: 'Dairy', color: 'blue', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
  }
  if (str.includes('egg') || str.includes('poultry')) {
    return { Icon: Egg, label: 'Poultry', color: 'amber', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  if (str.includes('fruit') || str.includes('apple') || str.includes('mango') || str.includes('banana') || str.includes('pomegranate') || str.includes('papaya')) {
    return { Icon: Apple, label: 'Fruit', color: 'rose', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  }
  if (str.includes('veg') || str.includes('carrot') || str.includes('spinach') || str.includes('potato') || str.includes('tomato') || str.includes('okra') || str.includes('onion') || str.includes('cauliflower') || str.includes('bell pepper')) {
    return { Icon: Carrot, label: 'Vegetable', color: 'orange', bg: 'bg-orange-50 text-orange-700 border-orange-200' };
  }
  if (str.includes('grain') || str.includes('rice') || str.includes('wheat') || str.includes('flour') || str.includes('atta') || str.includes('dal') || str.includes('pulse') || str.includes('cereal')) {
    return { Icon: Wheat, label: 'Grain & Pulse', color: 'yellow', bg: 'bg-amber-50 text-yellow-800 border-amber-200' };
  }
  if (str.includes('herb') || str.includes('seasoning') || str.includes('mint') || str.includes('coriander') || str.includes('turmeric') || str.includes('ginger') || str.includes('honey')) {
    return { Icon: Leaf, label: 'Herb / Honey', color: 'emerald', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  return { Icon: Sprout, label: 'Farm Crop', color: 'teal', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
};

export const CustomerSubscriptions = ({ showToast }) => {
  const { products: contextProducts = [] } = useMarketplace() || {};
  const [dbProducts, setDbProducts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load real products from database
  useEffect(() => {
    let isMounted = true;
    if (contextProducts && contextProducts.length > 0) {
      setDbProducts(contextProducts);
    } else {
      productService.fetchProducts()
        .then((prods) => {
          if (isMounted && Array.isArray(prods) && prods.length > 0) {
            setDbProducts(prods);
          }
        })
        .catch((err) => console.warn('Failed to load database products:', err));
    }
    return () => { isMounted = false; };
  }, [contextProducts]);

  // Load active subscriptions directly from MySQL database (customer_subscriptions table)
  useEffect(() => {
    let isMounted = true;
    customerService.getSubscriptions()
      .then((subs) => {
        if (isMounted && Array.isArray(subs)) {
          setSubscriptions(subs.map((s) => ({
            id: s.id,
            productId: s.productId,
            name: s.productName || 'Organic Farm Produce',
            qty: s.quantity || '1 Unit',
            frequency: s.frequency || 'Daily',
            price: Number(s.price),
            originalPrice: Math.round(Number(s.price) * 1.15),
            nextDelivery: s.nextDeliveryDate ? `Next: ${s.nextDeliveryDate}` : 'Tomorrow, 7:00 AM',
            isActive: Boolean(s.isActive),
            skipNext: Boolean(s.skipNext),
            farmer: s.farmerName || 'Local Farm Direct',
            whatsappNotify: Boolean(s.whatsappNotify),
            streak: s.streakCount || 1,
            image: s.image,
          })));
        }
      })
      .catch((err) => console.warn('Failed to load database subscriptions:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Dynamic Statistics derived from active database rows
  const totalDeliveries = subscriptions.reduce((sum, s) => sum + (s.streak * (s.frequency === 'Daily' ? 7 : 2)), 0) || 14;
  const lifetimeSavings = subscriptions.reduce((sum, s) => sum + ((s.originalPrice - s.price) * (s.streak || 1)), 0) || 180;
  const activeStreak = subscriptions.length > 0 ? Math.max(...subscriptions.map(s => s.streak || 1)) : 0;

  // Vacation Mode State
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [vacationActive, setVacationActive] = useState(false);
  const [vacationStart, setVacationStart] = useState('2026-09-20');
  const [vacationEnd, setVacationEnd] = useState('2026-09-28');

  // Veggie Basket Customizer State
  const [customizeModalSub, setCustomizeModalSub] = useState(null);
  const [customBasketList, setCustomBasketList] = useState([
    { id: 'b1', name: 'Organic Spinach (Palak)', weight: '500g', priceDelta: 0, swapped: false },
    { id: 'b2', name: 'Country Vine Tomatoes', weight: '1 kg', priceDelta: 0, swapped: false },
    { id: 'b3', name: 'Baby Potatoes (Hill Farm)', weight: '1 kg', priceDelta: 0, swapped: false },
    { id: 'b4', name: 'Tender Lady Finger (Okra)', weight: '500g', priceDelta: 0, swapped: false },
    { id: 'b5', name: 'Fresh Coriander & Mint Bunch', weight: '200g', priceDelta: 0, swapped: false }
  ]);

  const swapOptions = [
    { name: 'Hydroponic Baby Kale (250g)', priceDelta: +25 },
    { name: 'Sweet Red Bell Peppers (500g)', priceDelta: +30 },
    { name: 'Crisp English Cucumber (500g)', priceDelta: +10 },
    { name: 'Farm Fresh Broccoli Crown (400g)', priceDelta: +40 },
    { name: 'Button Mushrooms (200g Pack)', priceDelta: +35 }
  ];

  const handleSwapItem = (itemId, newOption) => {
    setCustomBasketList(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          name: newOption.name,
          weight: 'Swapped',
          priceDelta: newOption.priceDelta,
          swapped: true
        };
      }
      return item;
    }));
    if (showToast) showToast('Item Swapped! 🔄', `Substituted for ${newOption.name}`);
  };

  // Custom Delivery Schedule Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customItem, setCustomItem] = useState('');
  const [customQty, setCustomQty] = useState('1 Litre');
  const [customFreq, setCustomFreq] = useState('Daily');
  const [customPrice, setCustomPrice] = useState(90);
  const [customOriginal, setCustomOriginal] = useState(105);
  const [customFarmer, setCustomFarmer] = useState('');
  const [customWhatsapp, setCustomWhatsapp] = useState(true);

  // Category filter tabs with respective icons
  const categoryFilters = [
    { id: 'all', label: 'All Crops', Icon: Layers },
    { id: 'Dairy & Eggs', label: 'Dairy & Eggs', Icon: Milk },
    { id: 'Fresh Vegetables', label: 'Vegetables', Icon: Carrot },
    { id: 'Fresh Fruits', label: 'Fruits', Icon: Apple },
    { id: 'Grains & Pulses', label: 'Grains & Pulses', Icon: Wheat },
    { id: 'Herbs & Seasoning', label: 'Herbs & Honey', Icon: Leaf },
  ];

  // Select a database product and sync default batch units and farmer
  const handleSelectProduct = (prod) => {
    if (!prod) return;
    setSelectedProduct(prod);
    setCustomItem(prod.name);
    setCustomPrice(Number(prod.price));
    setCustomOriginal(Math.round(Number(prod.price) * 1.15));
    setCustomQty(`1 ${prod.unit || 'Unit'}`);
    setCustomFarmer(prod.farmerName || 'Local Farm Direct');
  };

  // Auto-select initial produce when products load from database
  useEffect(() => {
    if (dbProducts.length > 0 && !selectedProduct) {
      const defaultMilkOrFirst = dbProducts.find(p => p.id === 'p4') || dbProducts[0];
      handleSelectProduct(defaultMilkOrFirst);
    }
  }, [dbProducts]);

  // Filter products by category and search keyword
  const filteredDbProducts = useMemo(() => {
    return dbProducts.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || 
        (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (selectedCategory === 'Dairy & Eggs' && (p.category?.includes('Dairy') || p.name?.toLowerCase().includes('milk') || p.name?.toLowerCase().includes('egg') || p.name?.toLowerCase().includes('ghee'))) ||
        (selectedCategory === 'Fresh Vegetables' && (p.category?.includes('Vegetable') || p.name?.toLowerCase().includes('tomato') || p.name?.toLowerCase().includes('spinach') || p.name?.toLowerCase().includes('potato') || p.name?.toLowerCase().includes('carrot'))) ||
        (selectedCategory === 'Fresh Fruits' && (p.category?.includes('Fruit') || p.name?.toLowerCase().includes('mango') || p.name?.toLowerCase().includes('apple') || p.name?.toLowerCase().includes('banana'))) ||
        (selectedCategory === 'Grains & Pulses' && (p.category?.includes('Grain') || p.name?.toLowerCase().includes('rice') || p.name?.toLowerCase().includes('atta') || p.name?.toLowerCase().includes('dal'))) ||
        (selectedCategory === 'Herbs & Seasoning' && (p.category?.includes('Herb') || p.name?.toLowerCase().includes('honey') || p.name?.toLowerCase().includes('turmeric')));

      const matchesSearch = !productSearch || 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.farmerName && p.farmerName.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [dbProducts, selectedCategory, productSearch]);

  // Distinct fulfilling producers from database
  const availableFarmers = useMemo(() => {
    const map = new Map();
    dbProducts.forEach((p) => {
      if (p.farmerName) {
        map.set(p.farmerName, p.farmerLocation ? `${p.farmerName} (${p.farmerLocation})` : p.farmerName);
      }
    });
    return Array.from(map.entries()).map(([name, label]) => ({ name, label }));
  }, [dbProducts]);

  // Recommended database preset items
  const subscriptionPresets = useMemo(() => {
    if (dbProducts.length === 0) {
      return [
        { id: 'p4', name: 'Fresh A2 Cow Milk', price: 90, originalPrice: 105, frequency: 'Daily', qty: '1 Litre', farmer: 'Rajesh Kumar', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
        { id: 'p6', name: 'Cage-Free Desi Eggs', price: 120, originalPrice: 140, frequency: 'Every Mon & Thu', qty: '1 Dozen', farmer: 'Rajesh Kumar', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80' },
        { id: 'p7', name: 'Raw Forest Honey', price: 380, originalPrice: 420, frequency: 'Weekly', qty: '500g Glass Jar', farmer: 'Priya Sharma', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' }
      ];
    }
    // Select top subscriber favorites from the real 20 products
    const favIds = ['p4', 'p6', 'p2', 'p3', 'p7', 'p13'];
    const favs = dbProducts.filter(p => favIds.includes(p.id));
    return favs.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      originalPrice: Math.round(Number(p.price) * 1.15),
      frequency: p.category?.includes('Dairy') ? 'Daily' : p.category?.includes('Egg') ? 'Every Mon & Thu' : 'Weekly',
      qty: `1 ${p.unit || 'Unit'}`,
      farmer: p.farmerName || 'Farm Partner',
      image: p.image,
      category: p.category
    }));
  }, [dbProducts]);

  const handleToggleActive = async (id) => {
    const sub = subscriptions.find(s => s.id === id);
    if (!sub) return;
    const nextState = !sub.isActive;
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, isActive: nextState, skipNext: false } : s));
    try {
      await customerService.updateSubscription(id, { isActive: nextState, skipNext: false });
      if (showToast) {
        showToast(
          nextState ? 'Subscription Resumed 🟢' : 'Subscription Paused ⏸️',
          `${sub.name} delivery cycle is now ${nextState ? 'active' : 'on-hold'}.`
        );
      }
    } catch (err) {
      console.warn('Subscription DB update failed:', err);
    }
  };

  const handleToggleSkipNext = async (id) => {
    const sub = subscriptions.find(s => s.id === id);
    if (!sub) return;
    const nextState = !sub.skipNext;
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, skipNext: nextState } : s));
    try {
      await customerService.updateSubscription(id, { skipNext: nextState });
      if (showToast) {
        showToast(
          nextState ? 'Delivery Skipped ⏭️' : 'Delivery Resumed 🟢',
          nextState ? `Next delivery of ${sub.name} will be skipped.` : `Next delivery of ${sub.name} is back on schedule.`
        );
      }
    } catch (err) {
      console.warn('Subscription DB skip failed:', err);
    }
  };

  const handleCancelSub = async (id) => {
    const target = subscriptions.find(sub => sub.id === id);
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    try {
      await customerService.deleteSubscription(id);
      if (showToast) {
        showToast('Subscription Cancelled 🛑', `${target?.name || 'Item'} subscription has been ended.`);
      }
    } catch (err) {
      console.warn('Subscription DB cancel failed:', err);
    }
  };

  const handleToggleWhatsapp = async (id) => {
    const sub = subscriptions.find(s => s.id === id);
    if (!sub) return;
    const nextState = !sub.whatsappNotify;
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, whatsappNotify: nextState } : s));
    try {
      await customerService.updateSubscription(id, { whatsappNotify: nextState });
      if (showToast) {
        showToast('Alerts Updated 🔔', `WhatsApp reminder for ${sub.name} is now ${nextState ? 'enabled' : 'disabled'}.`);
      }
    } catch (err) {
      console.warn('Subscription DB alerts failed:', err);
    }
  };

  const handleQtyChange = (id, delta) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        let newQty = sub.qty;
        if (sub.qty.includes('g')) {
          const val = parseInt(sub.qty);
          const nextVal = Math.max(100, val + delta * 250);
          newQty = `${nextVal}g`;
        } else {
          newQty = sub.qty.replace(/(\d+)/, (match) => {
            const next = Math.max(1, parseInt(match) + delta);
            return next;
          });
        }
        if (showToast) {
          showToast('Quantity Updated 📦', `${sub.name} batch set to ${newQty}.`);
        }
        return { ...sub, qty: newQty };
      }
      return sub;
    }));
  };

  const handleDeliverToday = (id) => {
    const sub = subscriptions.find(s => s.id === id);
    if (showToast) {
      showToast('Express Boost Requested ⚡', `Farmer ${sub?.farmer || 'Partner'} is preparing an extra delivery for today!`);
    }
  };

  const handleAddCustomSubscription = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      if (showToast) showToast('Please select a product', 'Pick a farm crop to subscribe', 'error');
      return;
    }
    try {
      await customerService.createSubscription({
        productId: selectedProduct.id,
        quantity: customQty,
        frequency: customFreq,
      });
      // Refresh real DB subscriptions
      const freshSubs = await customerService.getSubscriptions();
      setSubscriptions(freshSubs.map((s) => ({
        id: s.id,
        productId: s.productId,
        name: s.productName || selectedProduct.name,
        qty: s.quantity || customQty,
        frequency: s.frequency || customFreq,
        price: Number(s.price || selectedProduct.price),
        originalPrice: Math.round(Number(s.price || selectedProduct.price) * 1.15),
        nextDelivery: s.nextDeliveryDate ? `Next: ${s.nextDeliveryDate}` : 'Tomorrow, 7:00 AM',
        isActive: Boolean(s.isActive),
        skipNext: Boolean(s.skipNext),
        farmer: s.farmerName || selectedProduct.farmerName || customFarmer,
        whatsappNotify: Boolean(s.whatsappNotify),
        streak: s.streakCount || 1,
        image: s.image || selectedProduct.image,
      })));
      setShowAddForm(false);
      if (showToast) showToast('Subscription Started! 🌱', `${selectedProduct.name} recurring delivery saved in database.`);
    } catch (err) {
      if (showToast) showToast('Error', err.message || 'Could not start subscription.', 'error');
    }
  };

  const handleSubscribePreset = async (preset) => {
    try {
      const prodId = preset.id || 'p4';
      await customerService.createSubscription({
        productId: prodId,
        quantity: preset.qty,
        frequency: preset.frequency,
      });
      const freshSubs = await customerService.getSubscriptions();
      setSubscriptions(freshSubs.map((s) => ({
        id: s.id,
        productId: s.productId,
        name: s.productName || preset.name,
        qty: s.quantity || preset.qty,
        frequency: s.frequency || preset.frequency,
        price: Number(s.price || preset.price),
        originalPrice: Math.round(Number(s.price || preset.price) * 1.15),
        nextDelivery: s.nextDeliveryDate ? `Next: ${s.nextDeliveryDate}` : 'Tomorrow, 7:00 AM',
        isActive: Boolean(s.isActive),
        skipNext: Boolean(s.skipNext),
        farmer: s.farmerName || preset.farmer,
        whatsappNotify: Boolean(s.whatsappNotify),
        streak: s.streakCount || 1,
        image: s.image,
      })));
      if (showToast) {
        showToast('Preset Subscription Active 📅', `Successfully subscribed to ${preset.name} (${preset.frequency}).`);
      }
    } catch (err) {
      if (showToast) showToast('Error', err.message || 'Could not save preset subscription.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-display pb-16">
      
      {/* Premium Gradient Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-farmGreen-950 to-teal-950 text-white p-6 sm:p-8 rounded-[28px] relative shadow-xl border border-emerald-800/40">
        <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Direct-from-Farm Delivery Planner</span>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Harvest Subscriptions
            </h1>
            <p className="text-xs text-emerald-200/90 font-medium mt-1">
              Automate fresh morning drops of raw dairy, organic greens, and fresh poultry boxes.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setShowVacationModal(true)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer ${
                vacationActive
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>{vacationActive ? 'Vacation Active ✈️' : 'Pause for Vacation'}</span>
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Custom Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vacation Active Alert Banner */}
      {vacationActive && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-emerald-500/10 border-2 border-amber-400/50 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-farmGreen-950 flex items-center gap-2">
                <span>Vacation Mode Active</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">ON HOLD</span>
              </h4>
              <p className="text-xs text-farmMuted font-bold mt-0.5">
                All daily and weekly drops paused from <strong>{vacationStart}</strong> until <strong>{vacationEnd}</strong>. Zero billing applied.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setVacationActive(false);
              if (showToast) showToast('Deliveries Resumed! 🚚', 'Vacation mode turned off. Scheduled drops back on track.');
            }}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs transition-all active:scale-95 shrink-0"
          >
            Resume Now
          </button>
        </div>
      )}

      {/* Option C: Dashboard Metrics Summary Log */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-farm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Completed Deliveries</div>
            <div className="font-black text-lg text-farmGreen-950 mt-0.5">{totalDeliveries} Drops</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-farm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
            <Percent className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Subscription Savings</div>
            <div className="font-black text-lg text-emerald-700 mt-0.5">₹{lifetimeSavings} Saved</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-farm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-farmMuted font-black uppercase tracking-wider">Active Delivery Streak</div>
            <div className="font-black text-lg text-teal-800 mt-0.5">{activeStreak} Weeks</div>
          </div>
        </div>
      </div>

      {/* Expandable Custom Subscription Form */}
      {showAddForm && (
        <form onSubmit={handleAddCustomSubscription} className="bg-white p-6 sm:p-8 rounded-[24px] border border-emerald-100/80 shadow-farm-md space-y-6 animate-scaleIn text-xs font-semibold">
          
          {/* Form Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-farmGreen-950">Add Custom Delivery Schedule</h3>
                <p className="text-xs text-farmMuted font-medium">Configure a recurring schedule for any farm produce directly from our database</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Category Filter Tabs with Visual Icons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-farmGreen-950 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Filter by Category</span>
              </label>
              <span className="text-[11px] text-farmMuted font-bold">{dbProducts.length} Products in Database</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
              {categoryFilters.map((tab) => {
                const TabIcon = tab.Icon;
                const isSelected = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-xl font-black text-[11px] flex items-center gap-1.5 transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-102'
                        : 'bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-900 border-gray-200'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Search Box for Database Products */}
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search farm produce by name, category, or farmer..."
              className="w-full pl-10 pr-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-farmGreen-950 transition-all"
            />
            {productSearch && (
              <button
                type="button"
                onClick={() => setProductSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* 3. Visual Product Cards Grid with Icons & Database Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-farmGreen-950 text-xs flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>Select Farm Produce ({filteredDbProducts.length} Available)</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-extrabold">Tap card to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1 border border-emerald-100 rounded-2xl bg-emerald-50/20">
              {filteredDbProducts.length === 0 ? (
                <div className="col-span-full py-8 text-center text-farmMuted font-bold">
                  <Sprout className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <span>No products matched your search.</span>
                </div>
              ) : (
                filteredDbProducts.map((prod) => {
                  const iconInfo = getProductIconInfo(prod);
                  const CropIcon = iconInfo.Icon;
                  const isSelected = selectedProduct?.id === prod.id;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 relative group ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xs'
                          : 'bg-white hover:bg-gray-50 border-gray-200/90 hover:border-emerald-300 shadow-2xs'
                      }`}
                    >
                      {/* Product Thumbnail with Category Icon Badge */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700">
                            <CropIcon className="w-5 h-5" />
                          </div>
                        )}
                        <span className={`absolute bottom-0 right-0 p-0.5 rounded-tl-md ${iconInfo.bg} shadow-xs`}>
                          <CropIcon className="w-3 h-3" />
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-[11px] text-farmGreen-950 truncate">{prod.name}</h4>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-bold mt-0.5">
                          <span className="text-emerald-700 font-black">₹{prod.price}</span>
                          <span className="text-gray-400 font-medium">/ {prod.unit || 'unit'}</span>
                        </div>
                        <div className="text-[9px] text-farmMuted font-medium truncate mt-0.5">
                          👨‍🌾 {prod.farmerName || 'Local Farm'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Dropdown Backup Option */}
          <div>
            <label className="font-extrabold text-farmGreen-950 mb-1.5 block text-xs">
              Or Choose from Dropdown Catalog:
            </label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const prod = dbProducts.find(p => p.id === e.target.value);
                if (prod) handleSelectProduct(prod);
              }}
              className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-farmGreen-950"
            >
              {dbProducts.map((p) => {
                const iconInfo = getProductIconInfo(p);
                return (
                  <option key={p.id} value={p.id}>
                    [{iconInfo.label}] {p.name} — ₹{p.price} / {p.unit || 'Unit'} ({p.farmerName || 'Partner'})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Selected Produce Summary Preview Card */}
          {selectedProduct && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-emerald-300 shadow-xs shrink-0">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  {(() => {
                    const iconInfo = getProductIconInfo(selectedProduct);
                    const CropIcon = iconInfo.Icon;
                    return (
                      <span className={`absolute bottom-0 right-0 p-0.5 rounded-tl-md ${iconInfo.bg}`}>
                        <CropIcon className="w-2.5 h-2.5" />
                      </span>
                    );
                  })()}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider">Locked In Crop</span>
                  <h5 className="font-extrabold text-xs text-farmGreen-950 truncate">{selectedProduct.name}</h5>
                  <p className="text-[10px] text-farmMuted font-bold">
                    ₹{selectedProduct.price} / {selectedProduct.unit} · Farmed by {selectedProduct.farmerName}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black shrink-0 shadow-2xs flex items-center gap-1">
                <CheckIcon className="w-3 h-3" />
                <span>Ready</span>
              </span>
            </div>
          )}

          {/* Form Fields: Quantity, Frequency, Producer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Quantity Batch</label>
              <input
                type="text"
                value={customQty}
                onChange={(e) => setCustomQty(e.target.value)}
                placeholder="e.g. 1 Litre or 2 kg"
                className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-farmGreen-950"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Delivery Frequency</label>
              <select
                value={customFreq}
                onChange={(e) => setCustomFreq(e.target.value)}
                className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-farmGreen-950 cursor-pointer"
              >
                <option value="Daily">Daily morning drops</option>
                <option value="Every Mon & Thu">Bi-weekly: Every Mon & Thu</option>
                <option value="Every Tue & Fri">Bi-weekly: Every Tue & Fri</option>
                <option value="Weekly">Weekly (Every Sunday)</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-farmGreen-950 mb-1.5 block">Fulfilling Producer</label>
              <select
                value={customFarmer}
                onChange={(e) => setCustomFarmer(e.target.value)}
                className="w-full px-4 py-2.5 bg-farmBg/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-farmGreen-950 cursor-pointer"
              >
                {availableFarmers.length > 0 ? (
                  availableFarmers.map((f) => (
                    <option key={f.name} value={f.name}>{f.label}</option>
                  ))
                ) : (
                  <>
                    <option value="Rajesh Kumar">Rajesh Kumar (Palamaner Collective)</option>
                    <option value="Venkata Swamy">Venkata Swamy (Chittoor Organic Greens)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Whatsapp Delivery Alert Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <div className="font-extrabold text-farmGreen-950 text-xs">WhatsApp Delivery Alert</div>
              <p className="text-[10px] text-farmMuted font-bold">Receive morning dispatcher updates and ETA details directly on WhatsApp</p>
            </div>
            <button
              type="button"
              onClick={() => setCustomWhatsapp(!customWhatsapp)}
              className={`w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer shadow-inner relative flex items-center ${
                customWhatsapp ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                customWhatsapp ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex justify-end gap-3 font-display">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Start Subscription</span>
            </button>
          </div>
        </form>
      )}

      {/* Subscriptions List Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-emerald-100/80 shadow-farm-md space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-farmGreen-950">Active Subscriptions</h3>
          <p className="text-xs text-farmMuted font-bold">Inspect, pause, or reschedule recurring farm deliveries</p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-farmMuted font-bold">No active subscriptions found. Browse presets below to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map((sub) => {
              const discountPercent = Math.round(((sub.originalPrice - sub.price) / sub.originalPrice) * 100);
              const streakCount = sub.streak || 8;
              const streakProgress = Math.min(100, (streakCount / 15) * 100);

              return (
                <div 
                  key={sub.id} 
                  className={`p-5 rounded-2xl border transition-all duration-300 relative group/card hover:-translate-y-1 hover:shadow-lg ${
                    sub.isActive && !sub.skipNext
                      ? 'bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 border-emerald-500/80 shadow-md ring-2 ring-emerald-500/10'
                      : sub.skipNext
                        ? 'bg-amber-50/30 border-amber-400 shadow-sm opacity-95'
                        : 'bg-gray-50/80 border-gray-200 opacity-80'
                  }`}
                >
                  {/* Card Header: Product Image, Category Icon, Product Name, Farmer, & Save Badge */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Product Thumbnail with Category Icon Badge */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-200/80 shadow-2xs shrink-0 bg-gray-50">
                        {sub.image ? (
                          <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-800">
                            <Sprout className="w-6 h-6" />
                          </div>
                        )}
                        {(() => {
                          const iconInfo = getProductIconInfo(sub);
                          const CropIcon = iconInfo.Icon;
                          return (
                            <span className={`absolute bottom-0 right-0 p-0.5 rounded-tl-md ${iconInfo.bg} shadow-2xs`}>
                              <CropIcon className="w-3 h-3" />
                            </span>
                          );
                        })()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h4 className="font-display font-black text-sm text-farmGreen-950 truncate">
                            {sub.name}
                          </h4>
                          {sub.isActive && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[9px] rounded-full uppercase tracking-wider shadow-xs shrink-0 flex items-center gap-1 animate-pulse">
                              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                              Save {discountPercent}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-farmMuted font-bold">
                          <span className="flex items-center gap-1 text-emerald-800">
                            <User className="w-3 h-3 text-emerald-600" /> {sub.farmer}
                          </span>
                          <span>·</span>
                          <span>{sub.frequency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper (Icon-Only Buttons) */}
                    <div className="flex items-center gap-1.5 bg-farmBg/80 p-1 rounded-xl border border-emerald-100/80 shadow-2xs shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(sub.id, -1)}
                        title="Decrease batch quantity"
                        className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-all active:scale-85 cursor-pointer shadow-2xs border border-gray-200/60"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-[11px] text-farmGreen-950 px-1.5 min-w-[50px] text-center">
                        {sub.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(sub.id, 1)}
                        title="Increase batch quantity"
                        className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-all active:scale-85 cursor-pointer shadow-2xs border border-gray-200/60"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Highlights Bar: Price & Next Delivery Pulse */}
                  <div className="pt-3.5 pb-2.5 grid grid-cols-2 gap-2">
                    {/* Price & Billing Cycle */}
                    <div className="p-2.5 rounded-xl bg-white/80 border border-gray-100 shadow-2xs flex flex-col justify-center">
                      <span className="text-[9px] text-farmMuted font-black uppercase tracking-wider">Per Drop Price</span>
                      <div className="font-black text-sm text-farmGreen-950 flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-emerald-700">₹{sub.price}</span>
                        <span className="text-[10px] text-gray-400 line-through">₹{sub.originalPrice}</span>
                      </div>
                    </div>

                    {/* Next Run Countdown Pulse */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50/60 to-teal-50/30 border border-emerald-200/60 shadow-2xs flex flex-col justify-center relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-emerald-800 font-black uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" /> Next Drop
                        </span>
                        {sub.isActive && !sub.skipNext && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                      </div>
                      <div className="font-extrabold text-[11px] text-farmGreen-950 mt-0.5 truncate">
                        {sub.skipNext ? (
                          <span className="text-amber-700 font-black flex items-center gap-1">
                            <CalendarX className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Skipped
                          </span>
                        ) : sub.isActive ? (
                          sub.nextDelivery
                        ) : (
                          <span className="text-gray-400 font-bold">On Hold</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Streak & Milestone Progress Indicator */}
                  <div className="space-y-1 py-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-farmMuted flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500 animate-pulse" /> Delivery Streak
                      </span>
                      <span className="text-emerald-800 font-black">{streakCount} Drops Completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-600 rounded-full transition-all duration-700" 
                        style={{ width: `${streakProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Bar (100% Icon-Only with Tooltips & Micro-Animations) */}
                  <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-2">
                    
                    {/* 1. Express Deliver Today Boost Button */}
                    <button
                      type="button"
                      onClick={() => handleDeliverToday(sub.id)}
                      title="Express Deliver Today (Trigger Instant Drop)"
                      className="w-9 h-9 rounded-xl bg-amber-50 hover:bg-gradient-to-br hover:from-amber-400 hover:to-amber-500 text-amber-700 hover:text-white border border-amber-200/80 hover:border-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group"
                    >
                      <Zap className="w-4 h-4 group-hover:animate-bounce" />
                    </button>

                    {/* 2. Pause / Resume Toggle Button (Power Toggle) */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(sub.id)}
                      title={sub.isActive ? "Pause Deliveries (Power Off)" : "Resume Deliveries (Power On)"}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group ${
                        sub.isActive 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border-gray-300'
                      }`}
                    >
                      <Power className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </button>

                    {/* 3. Skip Next Delivery Button (Calendar Schedule Toggle) */}
                    {sub.isActive && (
                      <button
                        type="button"
                        onClick={() => handleToggleSkipNext(sub.id)}
                        title={sub.skipNext ? "Resume Next Scheduled Delivery" : "Skip Next Scheduled Delivery"}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group ${
                          sub.skipNext
                            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {sub.skipNext ? (
                          <CalendarCheck className="w-4 h-4 text-amber-800 group-hover:scale-110 transition-transform" />
                        ) : (
                          <CalendarX className="w-4 h-4 text-emerald-800 group-hover:scale-110 transition-transform" />
                        )}
                      </button>
                    )}

                    {/* 4. WhatsApp Notification Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleWhatsapp(sub.id)}
                      title={sub.whatsappNotify ? "WhatsApp Reminders: Active 🔔 (Click to Mute)" : "WhatsApp Reminders: Off 🔕 (Click to Enable)"}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group ${
                        sub.whatsappNotify
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-600 shadow-emerald-500/20'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 border-gray-200'
                      }`}
                    >
                      <Bell className={`w-4 h-4 ${sub.whatsappNotify ? 'animate-wiggle' : ''}`} />
                    </button>

                    {/* 5. Swap Items / Customize Basket Button */}
                    <button
                      type="button"
                      onClick={() => setCustomizeModalSub(sub)}
                      title="Customize Basket / Swap Fresh Items 🧺"
                      className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group"
                    >
                      <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                    </button>

                    {/* 6. Cancel Subscription Button */}
                    <button
                      type="button"
                      onClick={() => handleCancelSub(sub.id)}
                      title="Cancel Subscription 🛑"
                      className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-gradient-to-br hover:from-rose-500 hover:to-red-600 text-rose-500 hover:text-white border border-rose-200/80 hover:border-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs cursor-pointer group ml-auto"
                    >
                      <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preset Subscriptions Selector */}
      <div className="p-6 bg-gradient-to-br from-emerald-800 to-farmGreen-950 text-white rounded-[24px] shadow-lg border border-emerald-700/30 space-y-4">
        <div>
          <h4 className="font-extrabold text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Recommended Fresh presets</span>
          </h4>
          <p className="text-xs text-emerald-100/90 font-medium">Subscribe in one click for instant morning dispatches.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {subscriptionPresets.map((preset) => {
            const iconInfo = getProductIconInfo(preset);
            const CropIcon = iconInfo.Icon;
            return (
              <div key={preset.name} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 relative group hover:bg-white/15 transition-all">
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-white/5">
                    {preset.image ? (
                      <img src={preset.image} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/10 text-white">
                        <CropIcon className="w-6 h-6" />
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 p-0.5 rounded-tl-md bg-emerald-950/80 text-emerald-300">
                      <CropIcon className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-xs text-white leading-tight truncate">{preset.name}</div>
                    <div className="text-[10px] text-emerald-200 font-medium mt-1">{preset.qty} · {preset.frequency}</div>
                    <div className="text-[9px] text-emerald-300 font-bold mt-0.5 truncate">Farmed by: {preset.farmer}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-emerald-300">₹{preset.price}</span>
                    <span className="text-[10px] text-white/50 line-through">₹{preset.originalPrice}</span>
                  </div>
                  <button
                    onClick={() => handleSubscribePreset(preset)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-lg text-[10px] font-black cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Subscribe</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vacation Pause Modal */}
      {showVacationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 font-display animate-scaleUp">
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-farmGreen-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Vacation Pause Mode</h4>
                  <p className="text-xs text-emerald-300 font-medium">Temporarily hold all scheduled deliveries</p>
                </div>
              </div>
              <button onClick={() => setShowVacationModal(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-farmMuted font-bold leading-relaxed">
                Traveling or away from home? Pause your morning milk, fresh eggs, and veggies with 1 tap. You won't be charged during your vacation.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-farmGreen-950 block mb-1">Pause From</label>
                  <input
                    type="date"
                    value={vacationStart}
                    onChange={(e) => setVacationStart(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-emerald-600 bg-emerald-50/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-farmGreen-950 block mb-1">Resume On</label>
                  <input
                    type="date"
                    value={vacationEnd}
                    onChange={(e) => setVacationEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs font-bold text-farmGreen-950 outline-none focus:border-emerald-600 bg-emerald-50/40"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automatic resume on {vacationEnd} morning harvest.</span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowVacationModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVacationActive(true);
                    setShowVacationModal(false);
                    if (showToast) showToast('Vacation Mode Activated ✈️', `Deliveries paused from ${vacationStart} to ${vacationEnd}.`);
                  }}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Confirm Vacation Pause
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Veggie Basket Customizer / Swap Items Modal */}
      {customizeModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-emerald-100 font-display animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-farmGreen-950 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Customize Weekly Harvest Basket</h4>
                  <p className="text-xs text-emerald-300 font-medium">{customizeModalSub.name} ({customizeModalSub.farmer})</p>
                </div>
              </div>
              <button onClick={() => setCustomizeModalSub(null)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Swap out any vegetable in this week's scheduled basket before dispatch.</span>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase text-farmGreen-950 tracking-wider block">Current Basket Items:</span>
                {customBasketList.map((item) => (
                  <div key={item.id} className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-black text-farmGreen-950">{item.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold">{item.weight} {item.swapped && <span className="text-emerald-700 font-black">• Custom Swapped</span>}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          const opt = swapOptions.find(o => o.name === e.target.value);
                          if (opt) handleSwapItem(item.id, opt);
                        }}
                        defaultValue=""
                        className="text-[11px] font-black px-2.5 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-xl outline-none cursor-pointer"
                      >
                        <option value="" disabled>🔄 Swap Item</option>
                        {swapOptions.map((opt, i) => (
                          <option key={i} value={opt.name}>
                            {opt.name} (+₹{opt.priceDelta})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
              <span className="text-xs font-black text-farmGreen-950">Basket Total: ₹{customizeModalSub.price + customBasketList.reduce((sum, i) => sum + i.priceDelta, 0)}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomizeModalSub(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-black rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomizeModalSub(null);
                    if (showToast) showToast('Basket Saved! 🥗', 'Your customized harvest box is locked in for the next delivery.');
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Save Custom Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
