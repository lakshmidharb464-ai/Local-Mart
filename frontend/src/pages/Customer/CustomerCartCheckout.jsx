import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { AddressForm } from './AddressForm';
import { PaymentForm } from './PaymentForm';
import { DiscountForm } from './DiscountForm';
import { ADDRESS_PRESETS, PAYMENT_OPTIONS, COUPONS } from './checkoutConstants';
import {
  ShoppingCart, ShoppingBag, Sprout, MapPin, CheckCircle2,
  ShieldCheck, Truck, CreditCard, Tag, Zap, Package,
  Clock, Check, Leaf, Banknote, HeartHandshake, Coins,
} from 'lucide-react';

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

/* --- Stepper Progress Bar -------------------------------- */
const STEPS = [
  { num: 1, label: 'Delivery Address', icon: MapPin },
  { num: 2, label: 'Payment Method', icon: CreditCard },
  { num: 3, label: 'Review & Confirm', icon: ShieldCheck },
];

const StepBar = ({ current }) => (
  <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-100/80 shadow-farm-sm font-display">
    <div className="flex items-center justify-between relative max-w-xl mx-auto">
      {/* Connecting Track */}
      <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-gray-100 z-0">
        <div
          className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
          style={{ width: current === 1 ? '0%' : current === 2 ? '50%' : '100%' }}
        />
      </div>

      {STEPS.map((s) => {
        const Icon = s.icon;
        const isDone = current > s.num;
        const isCurrent = current === s.num;

        return (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5 text-center bg-white px-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all shadow-xs ${
                isDone
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : isCurrent
                  ? 'bg-emerald-800 text-white ring-4 ring-emerald-100 shadow-md scale-105'
                  : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}
            >
              {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
            </div>
            <span
              className={`text-[11px] font-black tracking-tight hidden sm:block ${
                isCurrent
                  ? 'text-farmGreen-950 font-extrabold'
                  : isDone
                  ? 'text-emerald-800'
                  : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
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
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayStep, setRazorpayStep]     = useState('processing'); // 'processing' | 'success'
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

  const finalizeOrder = (razorpayPaymentId = null) => {
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
      razorpayPaymentId: razorpayPaymentId || (payment !== 'cod' ? `pay_${Math.random().toString(36).substr(2, 9)}` : null),
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
    setShowRazorpayModal(false);
    setOrderConfirmed(order);
    setStep(4);
    if (showToast) showToast('Order Placed Successfully! 🎉', `Order ${order.id} sent to farm partner.`);
  };

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    if (payment === 'cod') {
      setTimeout(() => finalizeOrder(), 1000);
    } else {
      // Trigger Razorpay SDK Popup Simulation
      setShowRazorpayModal(true);
      setRazorpayStep('processing');
      setTimeout(() => {
        setRazorpayStep('success');
        setTimeout(() => {
          finalizeOrder(`pay_rzp_${Math.random().toString(36).substr(2, 9)}`);
        }, 800);
      }, 1500);
    }
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

          {/* STEP 1: Address — AddressForm */}
          {step === 1 && (
            <AddressForm
              defaultValues={{ addrPreset, address, deliveryNotes }}
              submitLabel="Continue to Payment →"
              onSubmit={(data) => {
                setAddrPreset(data.addrPreset);
                setAddress(data.address);
                setDeliveryNotes(data.deliveryNotes);
                goNext();
              }}
            />
          )}

          {/* STEP 2: Payment — PaymentForm */}
          {step === 2 && (
            <PaymentForm
              defaultValues={{ payment, upiId, upiApp, farmerTip }}
              submitLabel="Continue to Discount →"
              userName={user?.name || 'CARDHOLDER'}
              onBack={goBack}
              onValuesChange={(vals) => {
                // Live-update sidebar totals as user selects payment / tip
                if (vals.payment !== undefined) setPayment(vals.payment);
                if (vals.farmerTip !== undefined) setFarmerTip(vals.farmerTip);
              }}
              onSubmit={(data) => {
                setPayment(data.payment);
                setUpiId(data.upiId || upiId);
                setUpiApp(data.upiApp || upiApp);
                setFarmerTip(data.farmerTip ?? farmerTip);
                goNext();
              }}
            />
          )}

          {/* STEP 3: Discount + Confirm — DiscountForm */}
          {step === 3 && (
            <DiscountForm
              defaultValues={{ couponCode: appliedCoupon?.code || '', appliedCoupon }}
              availableCoupons={COUPONS}
              submitLabel={`Confirm & Place Order · ₹${grandTotal}`}
              isLoading={isPlacing}
              onBack={goBack}
              onValuesChange={(vals) => {
                // Live-update sidebar discount as user applies / removes coupons
                if (vals.appliedCoupon !== undefined) setAppliedCoupon(vals.appliedCoupon);
              }}
              onSubmit={(data) => {
                setAppliedCoupon(data.appliedCoupon);
                handlePlaceOrder();
              }}
            />
          )}

        </div>



        {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
        <div className="space-y-4">
          <SectionCard className="sticky top-6 border border-emerald-100/80 shadow-[0_10px_35px_rgba(16,185,129,0.08)] bg-white/95 backdrop-blur-md">
            
            {/* Header with Item Count Badge */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-farmGreen-950">Order Summary</h4>
                  <p className="text-[10px] font-bold text-farmMuted">Direct Farm Booking</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-black border border-emerald-200/80">
                {normalizedCartItems.length} {normalizedCartItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-50">
              {normalizedCartItems.map(item => (
                <div key={item.id} className="pt-2.5 first:pt-0 flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-emerald-200/60 shadow-xs"
                      loading="lazy"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-800 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                      x{item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-black text-xs text-farmGreen-950 truncate">{item.name}</h5>
                    <div className="flex items-center gap-1.5 text-[10px] text-farmMuted font-bold mt-0.5">
                      <span>₹{item.price}/{item.unit}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                        <Sprout className="w-3 h-3 text-emerald-600 inline" /> Direct Farm
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-xs text-farmGreen-950 block">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Delivery Savings Highlight Banner */}
            {deliveryFee === 0 && (
              <div className="p-2.5 mb-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-[11px] font-bold text-emerald-900 shadow-2xs">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You unlocked <strong>FREE Farm Delivery</strong> (Saved ₹30)</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs font-bold">
              <div className="flex justify-between text-farmMuted">
                <span>Items Subtotal</span>
                <span className="font-black text-farmGreen-950">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-farmMuted">
                <span>Farm Express Delivery</span>
                <span className={`font-black ${deliveryFee === 0 ? 'text-emerald-700' : 'text-farmGreen-950'}`}>
                  {deliveryFee === 0 ? 'FREE 💐' : `₹${deliveryFee}`}
                </span>
              </div>

              {codFee > 0 && (
                <div className="flex justify-between text-blue-800 font-black bg-blue-50/80 p-2 rounded-xl border border-blue-200">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cash Handling Charge (COD)</span>
                  </span>
                  <span>+ ₹{codFee}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-amber-900 font-black bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Coupon ({appliedCoupon?.code})</span>
                  </span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              {farmerTip > 0 && (
                <div className="flex justify-between text-emerald-900 font-black bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Farmer Support Tip</span>
                  </span>
                  <span>+ ₹{farmerTip}</span>
                </div>
              )}

              {/* Grand Total Box */}
              <div className="pt-3 border-t border-gray-100 space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-sm text-farmGreen-950 block">Grand Total</span>
                    <span className="text-[10px] text-gray-400 font-bold block">Incl. all taxes & farm direct margin</span>
                  </div>
                  <span className="font-black text-2xl text-emerald-800 tracking-tight">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Customer Point-of-View Reassurance & Trust Cards */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3 font-display">
            <div className="flex items-center gap-2.5 text-xs font-bold text-farmGreen-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Fresh Harvest Guarantee</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-farmGreen-950">
              <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Payment to Local Farmers</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-farmGreen-950">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Express Delivery in 25–35 Mins</span>
            </div>
          </div>
        </div>

      </div>

      {/* Razorpay Gateway Simulation Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 font-display animate-scaleUp">
            {/* Header */}
            <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs border border-blue-400/30">
                  ₹
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    Razorpay <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/30 text-blue-300 rounded-md font-mono">SECURE</span>
                  </h4>
                  <p className="text-[11px] text-gray-300 font-medium">LocalFarm AP Direct Gateway</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase font-black">Amount</div>
                <div className="text-lg font-black text-white">₹{grandTotal}</div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-center space-y-4">
              {razorpayStep === 'processing' ? (
                <div className="py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-600 animate-spin mx-auto" />
                  <div>
                    <h5 className="font-black text-base text-farmGreen-950">Authorizing Payment...</h5>
                    <p className="text-xs text-farmMuted font-bold mt-1">Connecting to {paymentLabel} network</p>
                  </div>
                  <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100/80 text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> 256-Bit Bank-Grade Encryption
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-black text-base text-farmGreen-950">Payment Verified!</h5>
                    <p className="text-xs text-emerald-700 font-bold mt-1">Payment ID: pay_rzp_live confirmed</p>
                  </div>
                  <p className="text-xs text-farmMuted font-medium">Redirecting to order confirmation...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCartCheckout;
