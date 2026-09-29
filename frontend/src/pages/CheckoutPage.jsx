import React from 'react';
import { Link } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';
import { useAuth } from '../context/AuthContext';
import { ProgressSteps } from '../components/ui/ProgressSteps';
import { Alert } from '../components/ui/Alert';
import { CartSummary } from '../components/cart/CartSummary';
import { Radio } from '../components/ui/Radio';
import { formatCurrency } from '../utils/currency';
import { Truck, Store, ArrowRight, ArrowLeft, Loader2, ShoppingBag, MapPin, Phone, Mail, User, CreditCard, Smartphone, Banknote, Check } from 'lucide-react';

/* ─── Order Summary Panel ─────────────────────────────────── */
function OrderSummaryPanel({ cartItems, subtotal, deliveryFee, total, fulfillmentType, currencySymbol }) {
  return (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" aria-label="Order summary">
      <h2 className="text-sm font-bold text-farmText uppercase tracking-wider mb-4">Order Summary</h2>
      <ul className="flex flex-col gap-3 mb-4">
        {cartItems.map(item => (
          <li key={item.product.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-farmGreen-50 shrink-0">
              <img src={item.product.image} alt={item.product.name} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-farmText truncate">{item.product.name}</p>
              <p className="text-xs text-farmMuted">×{item.quantity} {item.product.unit}</p>
            </div>
            <p className="text-sm font-bold text-farmText shrink-0">
              {formatCurrency(item.product.price * item.quantity, currencySymbol)}
            </p>
          </li>
        ))}
      </ul>
      <hr className="border-gray-100 mb-4" />
      <CartSummary
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        fulfillmentType={fulfillmentType}
        currencySymbol={currencySymbol}
      />
    </aside>
  );
}

/* ─── Step 1: Delivery / Pickup ───────────────────────────── */
function DeliveryStep({ formData, updateFormData, onNext }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-farmText font-display">How would you like to receive your order?</h2>
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Fulfillment method</legend>
        {[
          { value: 'delivery', label: 'Delivery', desc: 'Delivered to your address', icon: Truck },
          { value: 'pickup',   label: 'Farm Pickup', desc: 'Collect directly from the farm', icon: Store },
        ].map(opt => {
          const Icon = opt.icon;
          const isSelected = formData.fulfillmentType === opt.value;
          return (
            <label
              key={opt.value}
              className={`
                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150
                focus-within:ring-2 focus-within:ring-farmGreen-500 focus-within:ring-offset-1
                ${isSelected ? 'border-farmGreen-500 bg-farmGreen-50' : 'border-gray-200 bg-white hover:border-gray-300'}
              `}
            >
              <input
                type="radio"
                name="fulfillmentType"
                value={opt.value}
                checked={isSelected}
                onChange={() => updateFormData({ fulfillmentType: opt.value })}
                className="sr-only"
              />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-farmGreen-600' : 'bg-gray-100'}`}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-farmMuted'}`} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${isSelected ? 'text-farmGreen-800' : 'text-farmText'}`}>{opt.label}</p>
                <p className="text-xs text-farmMuted">{opt.desc}</p>
              </div>
              {isSelected && <Check className="w-5 h-5 text-farmGreen-600 shrink-0" aria-hidden="true" />}
            </label>
          );
        })}
      </fieldset>
      <button
        type="button"
        onClick={onNext}
        className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-farmGreen-600 hover:bg-farmGreen-700 active:scale-95 text-white font-bold rounded-xl transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
      >
        Continue <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ─── Step 2: Address ─────────────────────────────────────── */
function AddressStep({ formData, updateFormData, onNext, onBack }) {
  const fields = [
    { id: 'name',        label: 'Full name',    type: 'text',  icon: User,   placeholder: 'Your name', required: true },
    { id: 'email',       label: 'Email address', type: 'email', icon: Mail,  placeholder: 'you@example.com', required: true,
      hint: 'Your order confirmation will be sent here.' },
    { id: 'phone',       label: 'Phone number', type: 'tel',   icon: Phone,  placeholder: '+91 98000 00000', required: true,
      hint: '10-digit mobile number for delivery updates.' },
    { id: 'addressLine', label: 'Address',      type: 'text',  icon: MapPin, placeholder: 'Street address, flat number', required: formData.fulfillmentType === 'delivery' },
    { id: 'city',        label: 'City',         type: 'text',  icon: MapPin, placeholder: 'City', required: formData.fulfillmentType === 'delivery' },
    { id: 'pincode',     label: 'Pincode',      type: 'text',  icon: MapPin, placeholder: '411001 (6 digits)', required: formData.fulfillmentType === 'delivery' },
  ];

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email?.trim() || '');
  const digitsOnlyPhone = (formData.phone || '').replace(/\D/g, '');
  const isPhoneValid = digitsOnlyPhone.length >= 10 && digitsOnlyPhone.length <= 15;
  const isPincodeValid = formData.fulfillmentType === 'pickup' || /^\d{6}$/.test(formData.pincode?.trim() || '');
  const isNameValid = (formData.name?.trim().length || 0) >= 2;
  const isAddressValid = formData.fulfillmentType === 'pickup' || (Boolean(formData.addressLine?.trim()) && Boolean(formData.city?.trim()) && isPincodeValid);

  const isValid = isNameValid && isEmailValid && isPhoneValid && isAddressValid;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-farmText font-display">
        {formData.fulfillmentType === 'pickup' ? 'Your contact details' : 'Delivery address'}
      </h2>

      {formData.fulfillmentType === 'pickup' && (
        <Alert variant="info" title="Farm pickup">
          Please bring a valid ID when collecting your order. The farm address will be confirmed in your order email.
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields
          .filter(f => formData.fulfillmentType === 'pickup' ? !['addressLine','city','pincode'].includes(f.id) : true)
          .map(field => {
            const Icon = field.icon;
            return (
              <div key={field.id} className={`flex flex-col gap-1.5 ${field.id === 'addressLine' ? 'sm:col-span-2' : ''}`}>
                <label htmlFor={`checkout-${field.id}`} className="text-sm font-semibold text-farmText">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
                </label>
                {field.hint && <p className="text-xs text-farmMuted -mt-1">{field.hint}</p>}
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-farmMuted pointer-events-none" aria-hidden="true" />
                  <input
                    id={`checkout-${field.id}`}
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={e => updateFormData({ [field.id]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl text-farmText placeholder:text-farmMuted focus:outline-none focus:ring-2 focus:ring-farmGreen-500 focus:border-farmGreen-500 transition-colors"
                  />
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white text-farmText font-semibold rounded-xl hover:border-gray-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-farmGreen-600 hover:bg-farmGreen-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white font-bold rounded-xl transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
        >
          Continue <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Payment ─────────────────────────────────────── */
function PaymentStep({ formData, updateFormData, onNext, onBack }) {
  const methods = [
    { value: 'upi',  label: 'UPI', desc: 'Pay via Google Pay, PhonePe, Paytm', icon: Smartphone },
    { value: 'card', label: 'Card', desc: 'Debit or credit card', icon: CreditCard },
    { value: 'cod',  label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Banknote },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-farmText font-display">Payment method</h2>
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Select payment method</legend>
        {methods.map(m => {
          const Icon = m.icon;
          const isSelected = formData.paymentMethod === m.value;
          return (
            <label
              key={m.value}
              className={`
                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150
                focus-within:ring-2 focus-within:ring-farmGreen-500 focus-within:ring-offset-1
                ${isSelected ? 'border-farmGreen-500 bg-farmGreen-50' : 'border-gray-200 bg-white hover:border-gray-300'}
              `}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.value}
                checked={isSelected}
                onChange={() => updateFormData({ paymentMethod: m.value })}
                className="sr-only"
              />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-farmGreen-600' : 'bg-gray-100'}`}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-farmMuted'}`} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${isSelected ? 'text-farmGreen-800' : 'text-farmText'}`}>{m.label}</p>
                <p className="text-xs text-farmMuted">{m.desc}</p>
              </div>
              {isSelected && <Check className="w-5 h-5 text-farmGreen-600 shrink-0" aria-hidden="true" />}
            </label>
          );
        })}
      </fieldset>

      <Alert variant="info">
        Payment processing is handled securely. Your card details are never stored on our servers.
      </Alert>

      <div className="flex gap-3 mt-2">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white text-farmText font-semibold rounded-xl hover:border-gray-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
        </button>
        <button type="button" onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-farmGreen-600 hover:bg-farmGreen-700 active:scale-95 text-white font-bold rounded-xl transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500">
          Review Order <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4: Review & Confirm ────────────────────────────── */
function ReviewStep({ formData, cartItems, subtotal, deliveryFee, total, onBack, onSubmit, isSubmitting, orderError, currencySymbol }) {
  const paymentLabels = { upi: 'UPI', card: 'Card', cod: 'Cash on Delivery' };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-farmText font-display">Review your order</h2>

      {/* Fulfillment summary */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-farmMuted uppercase tracking-wider mb-1">
              {formData.fulfillmentType === 'pickup' ? 'Pickup details' : 'Delivery details'}
            </p>
            <p className="text-sm font-semibold text-farmText">{formData.name}</p>
            <p className="text-sm text-farmMuted">{formData.email}</p>
            <p className="text-sm text-farmMuted">{formData.phone}</p>
            {formData.fulfillmentType === 'delivery' && (
              <p className="text-sm text-farmMuted mt-1">
                {formData.addressLine}, {formData.city} — {formData.pincode}
              </p>
            )}
          </div>
          <button type="button" onClick={onBack}
            className="text-xs font-semibold text-farmGreen-700 hover:text-farmGreen-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 rounded">
            Edit
          </button>
        </div>
        <hr className="border-gray-200" />
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-farmMuted uppercase tracking-wider">Payment</p>
          <p className="text-sm font-semibold text-farmText">{paymentLabels[formData.paymentMethod] || formData.paymentMethod}</p>
        </div>
      </div>

      {/* Items list */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-farmMuted uppercase tracking-wider mb-3">Items</p>
        <ul className="flex flex-col gap-2">
          {cartItems.map(item => (
            <li key={item.product.id} className="flex items-center justify-between text-sm gap-3">
              <span className="text-farmText font-medium truncate">{item.product.name} × {item.quantity}</span>
              <span className="text-farmText font-bold shrink-0">
                {formatCurrency(item.product.price * item.quantity, currencySymbol)}
              </span>
            </li>
          ))}
        </ul>
        <hr className="border-gray-100 my-3" />
        <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} fulfillmentType={formData.fulfillmentType} currencySymbol={currencySymbol} />
      </div>

      {orderError && <Alert variant="error" title="Order failed">{orderError}</Alert>}

      <div className="flex gap-3 mt-2">
        <button type="button" onClick={onBack} disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white text-farmText font-semibold rounded-xl hover:border-gray-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 disabled:opacity-50">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
        </button>
        <button type="button" onClick={onSubmit} disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-farmGreen-600 hover:bg-farmGreen-700 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-white font-bold rounded-xl transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500">
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Placing order…</>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── CheckoutPage ────────────────────────────────────────── */
export default function CheckoutPage() {
  const {
    steps, currentStep, currentStepId,
    formData, updateFormData,
    nextStep, prevStep,
    isSubmitting, orderError, submitOrder,
    cartItems, subtotal, deliveryFee, total,
  } = useCheckout();

  const { currencySymbol } = useAuth();

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-farmBg flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShoppingBag className="w-16 h-16 text-farmMuted mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-bold text-farmText mb-2">Your cart is empty</h1>
          <p className="text-farmMuted mb-6">Add some fresh produce before checking out.</p>
          <Link to="/products"
            className="inline-flex items-center gap-2 px-5 py-3 bg-farmGreen-600 text-white font-bold rounded-xl hover:bg-farmGreen-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const stepProps = { formData, updateFormData, onNext: nextStep, onBack: prevStep };

  return (
    <div className="min-h-screen bg-farmBg">
      {/* Minimal checkout header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" aria-label="LocalFarm — return to homepage">
              <span className="text-xl font-extrabold text-farmGreen-700 font-display">LocalFarm</span>
            </Link>
            <div className="flex-1 max-w-lg">
              <ProgressSteps steps={steps} currentStep={currentStep} />
            </div>
            <Link to="/cart" className="text-xs font-semibold text-farmMuted hover:text-farmGreen-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 rounded shrink-0">
              ← Back to cart
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Collapsible Order Summary */}
        <div className="lg:hidden mb-6">
          <details className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-4.5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-farmGreen-600" aria-hidden="true" />
                <span className="text-sm font-bold text-farmText">
                  Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </span>
                <span className="text-xs text-farmGreen-700 font-semibold group-open:hidden">
                  (tap to view)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-farmGreen-800 font-display">
                  {formatCurrency(total, currencySymbol)}
                </span>
                <span className="text-xs text-farmMuted group-open:rotate-180 transition-transform">▼</span>
              </div>
            </summary>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <OrderSummaryPanel
                cartItems={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                fulfillmentType={formData.fulfillmentType}
                currencySymbol={currencySymbol}
              />
            </div>
          </details>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: step form */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
            {currentStepId === 'delivery' && <DeliveryStep {...stepProps} />}
            {currentStepId === 'address' && <AddressStep {...stepProps} />}
            {currentStepId === 'payment' && <PaymentStep {...stepProps} />}
            {currentStepId === 'review' && (
              <ReviewStep
                {...stepProps}
                cartItems={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                onSubmit={submitOrder}
                isSubmitting={isSubmitting}
                orderError={orderError}
                currencySymbol={currencySymbol}
              />
            )}
          </div>

          {/* Right: sticky order summary (hidden on small screens) */}
          <div className="lg:w-80 shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <OrderSummaryPanel
                cartItems={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                fulfillmentType={formData.fulfillmentType}
                currencySymbol={currencySymbol}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
