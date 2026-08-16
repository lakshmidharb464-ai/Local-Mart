import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingCart, ShoppingBag, Sprout, Plus, Minus, Trash2,
  MapPin, CheckCircle2, ShieldCheck, ArrowRight, Truck,
  CreditCard, Tag, Gift, Zap, Home, Building2, Navigation,
  Smartphone, Banknote, Wallet, ChevronRight, ChevronLeft,
  Leaf, Star, Package, PartyPopper, Clock, Check, X,
  HeartHandshake, Sparkles, Copy, CheckCircle, Info, Coins
} from 'lucide-react';

/* ─── Stepper header ─────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Address',  icon: MapPin },
  { id: 2, label: 'Payment',  icon: CreditCard },
  { id: 3, label: 'Discount', icon: Tag },
  { id: 4, label: 'Confirm',  icon: CheckCircle2 },
];

const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-7 font-display">
    {STEPS.map((s, i) => {
      const Icon = s.icon;
      const done = current > s.id;
      const active = current === s.id;
      return (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                done
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-md scale-95'
                  : active
                    ? 'bg-gradient-to-br from-farmGreen-800 to-farmGreen-950 text-emerald-300 ring-4 ring-emerald-500/30 shadow-lg scale-105'
                    : 'bg-emerald-50/80 border-2 border-emerald-100 text-gray-400'
              }`}
            >
              {done ? (
                <Check className="w-5 h-5 stroke-[3] text-emerald-950" />
              ) : (
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-300' : 'text-gray-400'}`} />
              )}
              {active && (
                <span className="absolute -inset-1 rounded-full border-2 border-emerald-500/30 animate-ping" />
              )}
            </div>
            <span
              className={`text-[10px] font-black tracking-wider uppercase transition-colors ${
                active ? 'text-farmGreen-950' : done ? 'text-emerald-700' : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>

          {/* Connector Bar */}
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-1 rounded-full -mt-5 max-w-[70px] transition-all duration-500 ${
                done
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  : 'bg-emerald-100/70'
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ─── Address presets ────────────────────────────── */
const ADDRESS_PRESETS = [
  { id: 'home',  icon: Home,      label: 'Home',  addr: 'Flat 402, Green Acres, Baner Road, Pune, Maharashtra' },
  { id: 'work',  icon: Building2, label: 'Work',  addr: 'Office 7B, TechPark Phase 2, Hinjewadi, Pune' },
  { id: 'other', icon: Navigation,label: 'Other', addr: '' },
];

/* ─── Payment options ────────────────────────────── */
const PAYMENT_OPTIONS = [
  { id: 'upi',   icon: Smartphone, label: 'UPI / GPay',          sub: 'Instant · Free · Zero Extra Fee', badge: 'Recommended (Free)', color: '#16a34a' },
  { id: 'cod',   icon: Banknote,   label: 'Cash on Delivery',     sub: 'Pay cash when harvest arrives (₹50 COD handling fee)', badge: '₹50 Cash Fee', color: '#2563eb' },
  { id: 'card',  icon: CreditCard, label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, RuPay',   badge: null,          color: '#7c3aed' },
  { id: 'wallet',icon: Wallet,     label: 'PhonePe / Paytm Wallet',sub: 'Wallet balance applied',    badge: null,          color: '#ea580c' },
];

/* ─── Coupon codes ───────────────────────────────── */
const COUPONS = [
  { code: 'FARM10',  pct: 10, label: '10% OFF', desc: 'Welcome discount for organic buyers' },
  { code: 'ORGANIC', pct: 15, label: '15% OFF', desc: 'Special discount on all harvest produce' },
  { code: 'FRESH20', pct: 20, label: '20% OFF', desc: 'Weekend farm direct harvest offer' },
];

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[24px] border border-emerald-100/80 shadow-farm-md p-5 sm:p-6 font-display ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, title, sub }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-farmGreen-700 text-white flex items-center justify-center shadow-md shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h3 className="font-extrabold text-base text-farmGreen-950 tracking-tight">{title}</h3>
      {sub && <p className="text-xs text-farmMuted font-medium">{sub}</p>}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN CustomerCartCheckout Component
═══════════════════════════════════════════════════ */
export const CustomerCartCheckout = ({ setActiveTab, addNewCustomerOrder }) => {
  const { cartItems, clearCart, updateQuantity, removeFromCart } = useCart();
  const { showToast, user } = useAuth();

  const [step, setStep]             = useState(1);
  const [addrPreset, setAddrPreset] = useState('home');
  const [address, setAddress]       = useState(ADDRESS_PRESETS[0].addr);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Payment states
  const [payment, setPayment]       = useState('upi');
  const [upiApp, setUpiApp]         = useState('gpay');
  const [upiId, setUpiId]           = useState('anita@okicici');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv]       = useState('');
  const [farmerTip, setFarmerTip]   = useState(0);

  // Coupon states
  const [couponInput, setCouponInput]     = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError]     = useState('');

  // Placement state
  const [isPlacing, setIsPlacing]           = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const normalizedCartItems = cartItems.map(item => {
    const prod = item.product || item;
    return {
      id: prod.id,
      name: prod.name,
      price: prod.price || 0,
      image: prod.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
      quantity: item.quantity || 1,
      unit: prod.unit || 'kg',
      farmer: prod.farmer || 'Local Farm Direct'
    };
  });

  const subtotal = normalizedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 300 ? 0 : 30;
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.pct) / 100) : 0;
  const codFee = payment === 'cod' ? 50 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount + farmerTip + codFee);

  const paymentLabel = payment === 'cod' ? 'Cash on Delivery (₹50 Fee)' : PAYMENT_OPTIONS.find(p => p.id === payment)?.label || 'Online';

  const handleApplyCoupon = (cToApply) => {
    const target = cToApply || couponInput.trim().toUpperCase();
    const found = COUPONS.find(c => c.code === target);
    if (found) {
      setAppliedCoupon(found);
      setCouponError('');
      if (showToast) showToast('Coupon Applied! 🎉', `${found.code} saved you ${found.pct}% off.`);
    } else {
      setCouponError('Invalid coupon. Try FARM10, ORGANIC, or FRESH20.');
    }
  };

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    setTimeout(() => {
      const order = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: normalizedCartItems.map(i => `${i.name} (${i.quantity}${i.unit})`).join(', '),
        customerName: user?.name || 'Anita Sharma',
        customerEmail: user?.email || 'anita.sharma@gmail.com',
        farmer: 'Rajesh Kumar (Pune Rural Hub)',
        status: 'Pending',
        eta: '25-35 mins',
        total: grandTotal,
        address: `${address}${deliveryNotes ? ` (Note: ${deliveryNotes})` : ''}`,
        paymentMethod: paymentLabel,
        discount,
        coupon: appliedCoupon?.code || null,
        farmerTip,
        codFee,
        itemsList: normalizedCartItems,
        image: normalizedCartItems[0]?.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
        timeline: [
          { title: 'Order Placed', time: 'Just Now', done: true, desc: 'Sent directly to local farm partner' },
          { title: 'Farmer Approval', time: 'Pending', done: false, desc: 'Harvesting & insulated packaging' },
          { title: 'Courier Dispatch', time: 'Pending', done: false, desc: 'EV Scooter rider assigned' },
          { title: 'Delivered', time: 'Est. 25-35 mins', done: false, desc: payment === 'cod' ? 'Pay ₹' + grandTotal + ' cash on doorstep' : 'Doorstep drop-off' }
        ]
      };
      if (addNewCustomerOrder) addNewCustomerOrder(order);
      clearCart();
      setIsPlacing(false);
      setOrderConfirmed(order);
      setStep(4);
      if (showToast) showToast('Order Placed Successfully! 🎉', `Order ${order.id} sent to farm partner.`);
    }, 1200);
  };

  const goNext = () => setStep(prev => Math.min(prev + 1, 4));
  const goBack = () => setStep(prev => Math.max(prev - 1, 1));

  /* ── Empty Basket State ── */
  if (normalizedCartItems.length === 0 && !orderConfirmed) {
    return (
      <div className="text-center py-16 px-4 font-display max-w-md mx-auto animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-200">
          <ShoppingCart className="w-9 h-9" />
        </div>
        <h3 className="font-black text-2xl text-farmGreen-950 mb-2">Your Basket is Empty</h3>
        <p className="text-xs text-farmMuted font-bold mb-6 leading-relaxed">
          Explore fresh organic crops directly from local farmers in your area.
        </p>
        <button
          onClick={() => setActiveTab && setActiveTab('products')}
          className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Browse Fresh Produce 🥦
        </button>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     STEP 4 — ORDER CONFIRMED VIEW (MATCHING USER IMAGE)
  ══════════════════════════════════════════════════ */
  if (step === 4 && orderConfirmed) {
    return (
      <div className="max-w-md mx-auto font-display animate-fadeIn text-center space-y-6 py-8 px-4">
        
        {/* Big Lime Green Circle with Checkmark matching User Image */}
        <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#84cc16] text-slate-950 flex items-center justify-center shadow-[0_12px_36px_rgba(132,204,22,0.45)] ring-8 ring-lime-400/20 animate-bounce">
            <Check className="w-12 h-12 stroke-[3.5] text-slate-950" />
          </div>
        </div>

        {/* Title matching User Image */}
        <div className="space-y-2">
          <h1 className="font-black text-3xl sm:text-4xl text-[#0d2516] tracking-tight">
            Order Placed!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-bold leading-relaxed max-w-sm mx-auto">
            Your local farm partners have been notified. Expect a fresh harvest delivered to your door!
          </p>
        </div>

        {/* 100% Organic • Farm-Direct Capsule Badge matching User Image */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-300/80 bg-emerald-50/70 text-emerald-800 font-black text-xs tracking-wide shadow-2xs">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>100% Organic · Farm-Direct</span>
          </div>
        </div>

        {/* Detailed Order Receipt Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-black text-gray-500">Booking Reference</span>
            <span className="font-black text-emerald-800 text-xs px-3 py-1 bg-emerald-100 rounded-full font-mono">
              {orderConfirmed.id}
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-bold text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Payable:</span>
              <span className="font-black text-emerald-900 text-base">₹{orderConfirmed.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Payment Mode:</span>
              <span className="font-black text-slate-900 flex items-center gap-1.5 bg-blue-50 text-blue-900 px-2.5 py-1 rounded-xl border border-blue-200">
                <Banknote className="w-3.5 h-3.5 text-blue-600" />
                <span>{orderConfirmed.paymentMethod}</span>
              </span>
            </div>
            {orderConfirmed.codFee > 0 && (
              <div className="flex justify-between text-blue-800 text-[11px] bg-blue-50/60 p-2 rounded-xl border border-blue-100">
                <span>Includes Cash Handling Fee:</span>
                <span className="font-black">+ ₹50 COD</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Arrival:</span>
              <span className="font-black text-emerald-700">Today in 25–35 mins</span>
            </div>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
              <span className="font-black text-gray-700">Delivery Address:</span> {orderConfirmed.address}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setActiveTab && setActiveTab('orders')}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Truck className="w-4 h-4 text-amber-300" />
            <span>Track Live Delivery Status</span>
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('products')}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>Continue Shopping Fresh Harvest</span>
          </button>
        </div>

      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     STEPS 1-3 — CHECKOUT WIZARD
  ══════════════════════════════════════════════════ */
  return (
    <div className="max-w-5xl mx-auto font-display space-y-6 pb-16 animate-fadeIn">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider mb-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            <span>Direct Farm Booking</span>
          </span>
          <h1 className="font-black text-2xl sm:text-3xl text-farmGreen-950 tracking-tight">
            Checkout & Order Confirmation
          </h1>
          <p className="text-xs text-farmMuted font-bold mt-0.5">Complete delivery location & payment to confirm harvest booking</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
            {normalizedCartItems.length} {normalizedCartItems.length === 1 ? 'item' : 'items'} in basket
          </span>
        </div>
      </div>

      {/* Stepper Bar */}
      <StepBar current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: STEPPER FORMS */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1: Address Selection */}
          {step === 1 && (
            <SectionCard>
              <SectionTitle icon={MapPin} title="1. Select Delivery Location" sub="Choose or enter your delivery address in Pune" />
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {ADDRESS_PRESETS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = addrPreset === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setAddrPreset(p.id);
                        if (p.addr) setAddress(p.addr);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                          : 'bg-gray-50/80 border-gray-200 hover:border-emerald-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto ${isSelected ? 'text-emerald-700' : 'text-gray-400'}`} />
                      <div className="font-black text-xs text-farmGreen-950">{p.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 text-xs font-black">
                <div>
                  <label className="text-farmGreen-950 mb-1.5 block">Full Delivery Address *</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete building name, street, locality & landmark..."
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-bold text-farmGreen-950 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-farmGreen-950 mb-1.5 block">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave at security gate / Call on arrival..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-bold text-farmGreen-950 outline-none"
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <SectionCard>
              <SectionTitle icon={CreditCard} title="2. Select Payment Method" sub="All transactions are 100% secure & encrypted" />

              <div className="space-y-3 mb-5">
                {PAYMENT_OPTIONS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = payment === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setPayment(p.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                          : 'bg-gray-50/80 border-gray-200 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-2xs border border-gray-100">
                          <Icon className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <div className="font-black text-xs sm:text-sm text-farmGreen-950 flex items-center gap-2">
                            <span>{p.label}</span>
                            {p.id === 'cod' && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-200">
                                Cash ₹50 Fee
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-farmMuted font-bold">{p.sub}</div>
                        </div>
                      </div>

                      {p.badge && (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          p.id === 'cod'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cash on Delivery Highlight Section */}
              {payment === 'cod' && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 border-2 border-blue-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-blue-950">Cash on Delivery (COD) Active</h4>
                        <p className="text-[11px] font-bold text-blue-800">Pay cash directly to courier rider upon doorstep arrival</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-full shadow-xs">
                      + ₹50 Charge
                    </span>
                  </div>

                  <div className="p-3 bg-white/90 rounded-xl border border-blue-200/80 text-xs font-bold text-gray-700 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span>Flat <strong>₹50 cash handling charge</strong> added to cover doorstep collection & verification.</span>
                      <div className="text-[11px] text-emerald-800 font-extrabold mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Tip: Choose UPI/GPay for 100% Free Payment with Zero Handling Fee!</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPayment('upi')}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Switch to UPI (Save ₹50 Cash Charge)</span>
                  </button>
                </div>
              )}

              {/* UPI Sub Form */}
              {payment === 'upi' && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3">
                  <span className="text-xs font-extrabold text-emerald-950 block">Select Instant UPI App</span>
                  <div className="grid grid-cols-4 gap-2">
                    {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`p-2 rounded-xl text-center text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                          upiApp === app
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-emerald-900 mb-1 block">UPI VPA Handle</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="username@upi"
                      className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl outline-none font-bold text-xs text-farmGreen-950"
                    />
                  </div>
                </div>
              )}

              {/* Card Sub Form */}
              {payment === 'card' && (
                <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl space-y-3">
                  <span className="text-xs font-extrabold text-purple-950 block">Card Payment Details</span>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4532 ···· ···· 8920"
                    className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl outline-none font-bold text-xs text-purple-950"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl outline-none font-bold text-xs text-purple-950"
                    />
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      placeholder="CVV"
                      className="px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl outline-none font-bold text-xs text-purple-950"
                    />
                  </div>
                </div>
              )}

              {/* Farmer Tip Support */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-emerald-950 flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-emerald-700" />
                    <span>Support Farmers directly with a tip:</span>
                  </span>
                  <span className="text-emerald-800 font-mono">₹{farmerTip}</span>
                </div>
                <div className="flex items-center gap-2">
                  {[0, 10, 20, 50].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFarmerTip(amt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        farmerTip === amt
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {amt === 0 ? 'No tip' : `+ ₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>
          )}

          {/* STEP 3: Discount & Confirmation Review */}
          {step === 3 && (
            <SectionCard>
              <SectionTitle icon={Tag} title="3. Apply Coupon & Review" sub="Enter promo code and review your harvest order" />

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon (e.g. FARM10)"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-2xl text-xs font-black uppercase text-farmGreen-950 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black shadow-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {couponError && <p className="text-xs text-rose-600 font-black">{couponError}</p>}

                {appliedCoupon && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs font-black text-amber-900">
                    <span>Coupon {appliedCoupon.code} active ({appliedCoupon.pct}% OFF)</span>
                    <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-rose-600 font-bold hover:underline">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="px-5 py-3.5 bg-white border border-gray-200 text-farmGreen-950 hover:bg-gray-50 rounded-2xl font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!address.trim()}
                className="flex-1 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-black rounded-2xl text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {isPlacing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Harvest Order...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Confirm & Place Order · ₹{grandTotal}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
        <div className="space-y-4">
          <SectionCard className="sticky top-6">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
              <Package className="w-4 h-4 text-emerald-700" />
              <h4 className="font-black text-sm text-farmGreen-950">Order Harvest Summary</h4>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {normalizedCartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-800 text-white text-[9px] font-black flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-black text-xs text-farmGreen-950 truncate">{item.name}</h5>
                    <p className="text-[10px] text-farmMuted font-bold">₹{item.price}/{item.unit}</p>
                  </div>
                  <span className="font-black text-xs text-farmGreen-950 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs font-bold">
              <div className="flex justify-between text-farmMuted">
                <span>Subtotal</span>
                <span className="font-black text-farmGreen-950">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-farmMuted">
                <span>Delivery</span>
                <span className={`font-black ${deliveryFee === 0 ? 'text-emerald-700' : 'text-farmGreen-950'}`}>
                  {deliveryFee === 0 ? 'FREE 💐' : `₹${deliveryFee}`}
                </span>
              </div>

              {codFee > 0 && (
                <div className="flex justify-between text-blue-800 font-black bg-blue-50/70 p-1.5 rounded-xl border border-blue-200">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cash handling fee (COD)</span>
                  </span>
                  <span>+ ₹{codFee}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-amber-800 font-black">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              {farmerTip > 0 && (
                <div className="flex justify-between text-emerald-800 font-black">
                  <span>Farmer Tip</span>
                  <span>+ ₹{farmerTip}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-black text-sm text-farmGreen-950">Grand Total</span>
                <span className="font-black text-xl text-emerald-800 tracking-tight">₹{grandTotal}</span>
              </div>
            </div>
          </SectionCard>
        </div>

      </div>
    </div>
  );
};

export default CustomerCartCheckout;
