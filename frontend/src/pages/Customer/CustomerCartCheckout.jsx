
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { AddressForm } from './AddressForm';
import { PaymentForm } from './PaymentForm';
import { DiscountForm } from './DiscountForm';
import { ADDRESS_PRESETS, PAYMENT_OPTIONS } from './checkoutConstants';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import {
  ShoppingCart, ShoppingBag, Sprout, MapPin, CheckCircle2,
  ShieldCheck, Truck, CreditCard, Tag, Zap, Package,
  Clock, Check, Leaf, Banknote, HeartHandshake, Coins,
  Plus, Minus, Trash2, ArrowLeft, ArrowRight, Sparkles,
  Award, Shield, ChevronRight
} from 'lucide-react';

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl border border-emerald-100/90 shadow-farm-md hover:shadow-organic transition-all p-5 sm:p-7 font-display ${className}`}>
    {children}
  </div>
);

/* --- Stepper Progress Bar with Clickable Navigation -------------------------------- */
const STEPS = [
  { num: 1, label: 'Delivery Location', icon: MapPin },
  { num: 2, label: 'Payment Method', icon: CreditCard },
  { num: 3, label: 'Coupons & Confirm', icon: ShieldCheck },
];

const StepBar = ({ current, onStepClick }) => (
  <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-emerald-100/80 shadow-farm-sm font-display">
    <div className="flex items-center justify-between relative max-w-xl mx-auto">
      {/* Connecting Track Background */}
      <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1.5 bg-gray-100 rounded-full z-0 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 transition-all duration-500 rounded-full shadow-xs"
          style={{ width: current === 1 ? '0%' : current === 2 ? '50%' : '100%' }}
        />
      </div>

      {STEPS.map((s) => {
        const Icon = s.icon;
        const isDone = current > s.num;
        const isCurrent = current === s.num;
        const isClickable = s.num < current;

        return (
          <button
            key={s.num}
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && onStepClick && onStepClick(s.num)}
            className={`relative z-10 flex flex-col items-center gap-1.5 text-center bg-white px-3 focus:outline-none transition-transform ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'
              }`}
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 shadow-xs ${isDone
                  ? 'bg-gradient-to-br from-emerald-600 to-farmGreen-800 text-white shadow-emerald-600/30'
                  : isCurrent
                    ? 'bg-gradient-to-br from-emerald-700 to-farmGreen-950 text-white ring-4 ring-emerald-100 shadow-lg scale-110'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
            >
              {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
            </div>
            <span
              className={`text-[11px] font-black tracking-tight hidden sm:block transition-colors ${isCurrent
                  ? 'text-farmGreen-950 font-extrabold'
                  : isDone
                    ? 'text-emerald-800 font-bold'
                    : 'text-gray-400'
                }`}
            >
              {s.label}
            </span>
          </button>
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

  const [step, setStep] = useState(1);
  const [addrPreset, setAddrPreset] = useState('home');
  const [address, setAddress] = useState(ADDRESS_PRESETS[0].addr);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('express'); // 'express' | 'morning' | 'evening'

  // Live coupons from DB
  const [liveCoupons, setLiveCoupons] = useState([]);
  useEffect(() => {
    customerService.getActiveCoupons().then(coupons => setLiveCoupons(coupons));
  }, []);

  // Payment states
  const [payment, setPayment] = useState('upi');
  const [upiApp, setUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('anita@okicici');
  const [farmerTip, setFarmerTip] = useState(0);

  // Coupon states
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Placement states
  const [isPlacing, setIsPlacing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayStep, setRazorpayStep] = useState('processing');
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
      farmer: prod.farmer || prod.farmerName || 'Local Farm Direct'
    };
  });

  const subtotal = normalizedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 300 ? 0 : 30;
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.pct) / 100) : 0;
  const codFee = payment === 'cod' ? 50 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount + farmerTip + codFee);

  // Estimated farm direct savings calculation
  const retailEstimate = Math.round(subtotal * 1.25);
  const totalSavings = (retailEstimate - subtotal) + discount + (deliveryFee === 0 ? 30 : 0);

  const paymentLabel = payment === 'cod' ? 'Cash on Delivery (₹50 Fee)' : PAYMENT_OPTIONS.find(p => p.id === payment)?.label || 'UPI Online';

  const finalizeOrder = async (razorpayPaymentId = null) => {
    setIsPlacing(true);
    try {
      const fullAddressText = `${address}${deliveryNotes ? ` (Note: ${deliveryNotes})` : ''}`.trim() || 'Pune Direct Harvest Address';

      const backendPayload = {
        items: normalizedCartItems.map(i => ({
          productId: i.id,
          id: i.id,
          name: i.name,
          quantity: Number(i.quantity) || 1,
          price: Number(i.price),
          unit: i.unit || 'kg',
        })),
        addressText: fullAddressText,
        customerLat: 18.5204,
        customerLng: 73.8567,
        paymentMethod: payment === 'cod' ? 'COD' : 'UPI',
        couponCode: appliedCoupon?.code || null,
        tipAmount: Number(farmerTip) || 0,
      };

      let placed = null;
      if (addNewCustomerOrder) {
        placed = await addNewCustomerOrder(backendPayload);
      } else {
        placed = await orderService.placeOrder(backendPayload);
      }

      const assignedId = placed?.id || placed?.orderId || ('ORD-' + Math.floor(1000 + Math.random() * 9000));

      const confirmedOrder = {
        id: assignedId,
        orderId: assignedId,
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: normalizedCartItems.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', '),
        customerName: user?.name || 'Customer',
        customerEmail: user?.email || 'customer@localfarm.in',
        farmer: normalizedCartItems[0]?.farmer || 'Local Farm Direct',
        status: 'Pending',
        eta: deliverySlot === 'express' ? '25-35 mins' : deliverySlot === 'morning' ? 'Tomorrow, 7:00 AM' : 'Today, 6:00 PM',
        total: grandTotal,
        subtotal,
        deliveryFee,
        discount,
        farmerTip,
        codFee,
        address: fullAddressText,
        paymentMethod: paymentLabel,
        razorpayPaymentId: razorpayPaymentId || (payment !== 'cod' ? `pay_${Math.random().toString(36).substr(2, 9)}` : null),
        itemsList: normalizedCartItems,
        image: normalizedCartItems[0]?.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
        otpCode: placed?.otpCode || String(Math.floor(1000 + Math.random() * 9000)),
        timeline: [
          { title: 'Order Placed', time: 'Just Now', done: true, desc: 'Sent directly to local farm partner' },
          { title: 'Farmer Approval', time: 'Pending', done: false, desc: 'Harvesting & insulated packaging' },
          { title: 'Courier Dispatch', time: 'Pending', done: false, desc: 'EV Rider assigned' },
          { title: 'Delivered', time: deliverySlot === 'express' ? 'Est. 25-35 mins' : 'Slot Delivery', done: false, desc: payment === 'cod' ? 'Pay ₹' + grandTotal + ' cash upon doorstep arrival' : 'Contactless doorstep drop-off' }
        ]
      };

      clearCart();
      setShowRazorpayModal(false);
      setOrderConfirmed(confirmedOrder);
      setStep(4);
      if (showToast) showToast('Order Placed Successfully! 🎉', `Order ${assignedId} dispatched to farmer & delivery.`);
    } catch (err) {
      console.error('[Checkout] Order placement error:', err);
      if (showToast) showToast('Checkout Failed', err.message || 'Could not place order. Please check stock.', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (payment === 'cod') {
      finalizeOrder();
    } else {
      setShowRazorpayModal(true);
      setRazorpayStep('processing');
      setTimeout(() => {
        setRazorpayStep('success');
        setTimeout(() => {
          finalizeOrder(`pay_rzp_${Math.random().toString(36).substr(2, 9)}`);
        }, 600);
      }, 1200);
    }
  };

  const goNext = () => setStep(prev => Math.min(prev + 1, 4));
  const goBack = () => setStep(prev => Math.max(prev - 1, 1));

  /* ── Empty Basket State ── */
  if (normalizedCartItems.length === 0 && !orderConfirmed) {
    return (
      <div className="text-center py-20 px-4 font-display max-w-lg mx-auto animate-fadeIn">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-5 shadow-farm-sm border border-emerald-200">
          <ShoppingCart className="w-10 h-10 text-emerald-700" />
        </div>
        <h3 className="font-black text-2xl sm:text-3xl text-farmGreen-950 mb-2 tracking-tight">Your Harvest Basket is Empty</h3>
        <p className="text-xs sm:text-sm text-farmMuted font-bold mb-8 leading-relaxed max-w-sm mx-auto">
          Explore fresh seasonal harvest, cold-pressed oils, and dairy directly from verified village growers.
        </p>
        <button
          onClick={() => setActiveTab && setActiveTab('products')}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-700 to-farmGreen-900 hover:from-emerald-800 hover:to-farmGreen-950 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
        >
          <Sprout className="w-4 h-4 text-emerald-300" />
          <span>Explore Fresh Crops</span>
        </button>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     STEP 4 — ORDER CONFIRMED CELEBRATION VIEW
  ══════════════════════════════════════════════════ */
  if (step === 4 && orderConfirmed) {
    return (
      <div className="max-w-xl mx-auto font-display animate-fadeIn text-center space-y-6 py-8 px-4">

        {/* Animated Celebration Icon */}
        <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#84cc16] text-slate-950 flex items-center justify-center shadow-[0_12px_36px_rgba(132,204,22,0.45)] ring-8 ring-lime-400/20 animate-bounce">
            <Check className="w-12 h-12 stroke-[3.5] text-slate-950" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-black text-3xl sm:text-4xl text-[#0d2516] tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-bold leading-relaxed max-w-md mx-auto">
            Your local farm partner has received the harvest request. Freshly harvested produce will be dispatched shortly!
          </p>
        </div>

        {/* Badge */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-300/80 bg-emerald-50/80 text-emerald-800 font-black text-xs tracking-wide shadow-2xs">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>100% Organic · Direct from Verified Farm</span>
          </div>
        </div>

        {/* Detailed Order Receipt Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-farm-sm text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-black text-gray-500">Order Reference</span>
            <span className="font-black text-emerald-900 text-xs px-3.5 py-1 bg-emerald-100 rounded-full font-mono border border-emerald-200">
              {orderConfirmed.id}
            </span>
          </div>

          <div className="space-y-3 text-xs font-bold text-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Amount:</span>
              <span className="font-black text-emerald-900 text-lg">₹{orderConfirmed.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Payment Mode:</span>
              <span className="font-black text-slate-900 flex items-center gap-1.5 bg-blue-50 text-blue-900 px-3 py-1 rounded-xl border border-blue-200">
                <Banknote className="w-3.5 h-3.5 text-blue-600" />
                <span>{orderConfirmed.paymentMethod}</span>
              </span>
            </div>
            {orderConfirmed.codFee > 0 && (
              <div className="flex justify-between text-blue-800 text-[11px] bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                <span>Cash Handling Fee Included:</span>
                <span className="font-black">+ ₹50 COD</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Estimated Delivery:</span>
              <span className="font-black text-emerald-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{orderConfirmed.eta}</span>
              </span>
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
            className="w-full py-3.5 bg-gradient-to-r from-emerald-800 to-farmGreen-950 hover:from-emerald-900 hover:to-black text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Truck className="w-4 h-4 text-amber-300" />
            <span>Track Live Dispatch & Journey</span>
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('products')}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>Browse More Crops</span>
          </button>
        </div>

      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     STEPS 1-3 — CHECKOUT FLOW WIZARD
  ══════════════════════════════════════════════════ */
  return (
    <div className="max-w-6xl mx-auto font-display space-y-6 pb-20 animate-fadeIn">

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#071a0c] via-[#0f2e16] to-[#184624] text-white p-6 sm:p-7 rounded-3xl border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-2 border border-emerald-400/30">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>Farm Direct Dispatch</span>
          </div>
          <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            Checkout & Order Booking
          </h1>
          <p className="text-xs text-emerald-200/80 font-medium mt-1">Verified farm-to-doorstep organic delivery in Pune</p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setActiveTab && setActiveTab('products')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black backdrop-blur-md transition-all cursor-pointer border border-white/15"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Add More Crops</span>
          </button>
        </div>
      </div>

      {/* Stepper Bar */}
      <StepBar current={step} onStepClick={(s) => setStep(s)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN (7 Cols): ACTIVE STEP FORM */}
        <div className="lg:col-span-7 space-y-6">

          {/* Delivery Slot Selection Strip */}
          <div className="p-4 bg-white rounded-3xl border border-emerald-100/90 shadow-farm-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-farmGreen-950 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Preferred Delivery Speed:</span>
              </span>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Guaranteed Slot
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'express', label: '⚡ Express', time: '25-35 mins', tag: 'Fastest' },
                { id: 'morning', label: '🌅 Morning', time: '7:00 - 9:00 AM', tag: 'Fresh Harvest' },
                { id: 'evening', label: '🌆 Evening', time: '5:00 - 7:00 PM', tag: 'Convenient' },
              ].map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setDeliverySlot(slot.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${deliverySlot === slot.id
                      ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-300 shadow-xs'
                      : 'bg-gray-50/80 border-gray-200 hover:border-emerald-200'
                    }`}
                >
                  <div className="text-xs font-black text-farmGreen-950">{slot.label}</div>
                  <div className="text-[10px] text-gray-500 font-bold">{slot.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: Address */}
          {step === 1 && (
            <AddressForm
              defaultValues={{ addrPreset, address, deliveryNotes }}
              submitLabel="Proceed to Payment Method →"
              onSubmit={(data) => {
                setAddrPreset(data.addrPreset);
                setAddress(data.address);
                setDeliveryNotes(data.deliveryNotes);
                goNext();
              }}
            />
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <PaymentForm
              defaultValues={{ payment, upiId, upiApp, farmerTip }}
              submitLabel="Proceed to Coupons & Review →"
              userName={user?.name || 'CARDHOLDER'}
              onBack={goBack}
              onValuesChange={(vals) => {
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

          {/* STEP 3: Discount + Confirm */}
          {step === 3 && (
            <DiscountForm
              defaultValues={{ couponCode: appliedCoupon?.code || '', appliedCoupon }}
              availableCoupons={liveCoupons}
              submitLabel={`Confirm & Place Order · ₹${grandTotal}`}
              isLoading={isPlacing}
              onBack={goBack}
              onValuesChange={(vals) => {
                if (vals.appliedCoupon !== undefined) setAppliedCoupon(vals.appliedCoupon);
              }}
              onSubmit={(data) => {
                setAppliedCoupon(data.appliedCoupon);
                handlePlaceOrder();
              }}
            />
          )}

        </div>

        {/* RIGHT COLUMN (5 Cols): INTERACTIVE ORDER SUMMARY SIDEBAR */}
        <div className="lg:col-span-5 space-y-4">
          <SectionCard className="sticky top-6 border border-emerald-100/90 shadow-farm-lg bg-white">

            {/* Header with Item Count Badge */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-farmGreen-950">Harvest Basket</h4>
                  <p className="text-[10px] font-bold text-farmMuted">Live Farm Booking</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-black border border-emerald-200/80">
                {normalizedCartItems.length} {normalizedCartItems.length === 1 ? 'Crop' : 'Crops'}
              </span>
            </div>

            {/* Compact Line-Item List */}
            <div className="space-y-0 mb-4 max-h-64 overflow-y-auto divide-y divide-gray-100 scrollbar-thin">
              {normalizedCartItems.map(item => (
                <div key={item.id} className="py-3 flex items-center gap-3 group">

                  {/* Product dot */}
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />

                  {/* Name + unit price */}
                  <div className="flex-1 min-w-0">
                    <span className="font-black text-xs text-farmGreen-950 truncate block leading-tight">{item.name}</span>
                    <span className="text-[10px] text-farmMuted font-semibold truncate block mt-0.5">₹{item.price}/{item.unit}</span>
                  </div>

                  {/* Qty stepper — bigger, easier to tap */}
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1 border border-gray-200 gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                        else removeFromCart(item.id);
                      }}
                      className="w-7 h-7 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-500" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="font-black text-sm text-farmGreen-950 font-mono w-6 text-center select-none">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Exact line total */}
                  <span className="font-black text-sm text-farmGreen-950 font-mono shrink-0 w-16 text-right">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Savings & Free Delivery Milestone Bar */}
            <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-200/90 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-black text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Total Direct Savings:</span>
                </span>
                <span className="text-emerald-800 font-mono">₹{totalSavings} saved</span>
              </div>
              {subtotal < 300 ? (
                <div className="text-[10px] text-emerald-800 font-bold">
                  Add <strong>₹{300 - subtotal}</strong> more to unlock <strong>FREE Express Delivery</strong>!
                </div>
              ) : (
                <div className="text-[10px] text-emerald-800 font-extrabold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  <span>FREE Delivery Unlocked (Saved ₹30)</span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs font-bold">
              <div className="flex justify-between text-farmMuted">
                <span>Produce Subtotal</span>
                <span className="font-black text-farmGreen-950 font-mono">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-farmMuted">
                <span>Express Farm Delivery</span>
                <span className={`font-black ${deliveryFee === 0 ? 'text-emerald-700' : 'text-farmGreen-950'} font-mono`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              {codFee > 0 && (
                <div className="flex justify-between text-blue-900 font-black bg-blue-50 p-2 rounded-xl border border-blue-200">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cash Handling (COD)</span>
                  </span>
                  <span className="font-mono">+ ₹{codFee}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-amber-900 font-black bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Coupon ({appliedCoupon?.code})</span>
                  </span>
                  <span className="font-mono">- ₹{discount}</span>
                </div>
              )}

              {farmerTip > 0 && (
                <div className="flex justify-between text-emerald-900 font-black bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Farmer Support Tip</span>
                  </span>
                  <span className="font-mono">+ ₹{farmerTip}</span>
                </div>
              )}

              {/* Grand Total */}
              <div className="pt-3 border-t border-gray-100 space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-sm text-farmGreen-950 block">Payable Amount</span>
                    <span className="text-[10px] text-gray-400 font-bold block">All taxes & packaging included</span>
                  </div>
                  <span className="font-black text-2xl text-emerald-900 tracking-tight font-mono">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Trust Guarantees */}
          <div className="p-4 bg-white/90 backdrop-blur-md rounded-3xl border border-emerald-100 space-y-2.5 font-display text-xs">
            <div className="flex items-center gap-2 text-farmGreen-950 font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Quality & Harvest Freshness Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-farmGreen-950 font-extrabold">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Eco-Friendly EV Delivery</span>
            </div>
          </div>
        </div>

      </div>

      {/* Razorpay Gateway Simulation Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 font-display animate-scaleUp">
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
                <div className="text-lg font-black text-white font-mono">₹{grandTotal}</div>
              </div>
            </div>

            <div className="p-6 text-center space-y-4">
              {razorpayStep === 'processing' ? (
                <div className="py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-600 animate-spin mx-auto" />
                  <div>
                    <h5 className="font-black text-base text-farmGreen-950">Authorizing Secure Payment...</h5>
                    <p className="text-xs text-farmMuted font-bold mt-1">Connecting to {paymentLabel}</p>
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

