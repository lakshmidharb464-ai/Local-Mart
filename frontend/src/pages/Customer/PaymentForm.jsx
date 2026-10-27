/**
 * PaymentForm.jsx — Icon-first, minimal-text payment selector
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CreditCard, Smartphone, Banknote, Wallet,
  Zap, HeartHandshake, AlertCircle,
  ChevronLeft, ArrowRight, Loader2, Check,
  QrCode, ShieldCheck,
} from 'lucide-react';

/* ── Payment method config ── */
const METHODS = [
  {
    id: 'upi',
    icon: Smartphone,
    label: 'UPI',
    sub: 'Instant · Free',
    badge: null,
    badgeFree: true,
    color: 'emerald',
  },
  {
    id: 'cod',
    icon: Banknote,
    label: 'Cash',
    sub: '+₹50 fee',
    badge: '+₹50',
    badgeFree: false,
    color: 'blue',
  },
  {
    id: 'card',
    icon: CreditCard,
    label: 'Card',
    sub: 'Visa / MC',
    badge: null,
    badgeFree: false,
    color: 'violet',
  },
  {
    id: 'wallet',
    icon: Wallet,
    label: 'Wallet',
    sub: 'PhonePe',
    badge: null,
    badgeFree: false,
    color: 'orange',
  },
];

const UPI_APPS = [
  { id: 'gpay',    label: 'GPay',    color: '#4285F4' },
  { id: 'phonepe', label: 'PhonePe', color: '#5F259F' },
  { id: 'paytm',   label: 'Paytm',   color: '#00BAF2' },
  { id: 'bhim',    label: 'BHIM',    color: '#00509F' },
];

const TIP_AMOUNTS = [0, 10, 20, 50];

const FieldError = ({ message }) =>
  message ? (
    <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </span>
  ) : null;

export const PaymentForm = ({
  onSubmit,
  onBack,
  onValuesChange,
  defaultValues = {},
  submitLabel = 'Continue →',
  isLoading = false,
  userName = 'CARDHOLDER',
}) => {
  const [payment, setPayment]   = useState(defaultValues.payment || 'upi');
  const [upiApp, setUpiApp]     = useState(defaultValues.upiApp   || 'gpay');
  const [farmerTip, setFarmerTip] = useState(defaultValues.farmerTip || 0);

  useEffect(() => {
    if (onValuesChange) onValuesChange({ payment, farmerTip });
  }, [payment, farmerTip]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    mode: 'onTouched',
    defaultValues: {
      upiId:      defaultValues.upiId      || '',
      cardNumber: defaultValues.cardNumber || '',
      cardExpiry: defaultValues.cardExpiry || '',
      cardCvv:    defaultValues.cardCvv    || '',
    },
  });

  const cardNumber = watch('cardNumber');
  const cardExpiry = watch('cardExpiry');
  const cardCvv    = watch('cardCvv');
  const busy = isLoading || isSubmitting;

  const handleFormSubmit = (data) => {
    if (onSubmit) onSubmit({ ...data, payment, upiApp, farmerTip });
  };

  return (
    <div className="bg-white rounded-[24px] border border-emerald-100/80 shadow-farm-md p-5 sm:p-6 font-display space-y-5">

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 text-white flex items-center justify-center shadow-md shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-farmGreen-950 tracking-tight">Payment Method</h3>
          <p className="text-[10px] text-farmMuted font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Secure &amp; Encrypted
          </p>
        </div>
      </div>

      {/* ── Method Grid: 4 icon tiles ── */}
      <div className="grid grid-cols-4 gap-2">
        {METHODS.map(({ id, icon: Icon, label, sub, badge, badgeFree, color }) => {
          const active = payment === id;
          const ring = {
            emerald: 'ring-emerald-400 border-emerald-500 bg-emerald-50',
            blue:    'ring-blue-400    border-blue-500    bg-blue-50',
            violet:  'ring-violet-400  border-violet-500  bg-violet-50',
            orange:  'ring-orange-400  border-orange-500  bg-orange-50',
          }[color];
          const iconColor = {
            emerald: 'text-emerald-700',
            blue:    'text-blue-700',
            violet:  'text-violet-700',
            orange:  'text-orange-600',
          }[color];
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPayment(id)}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                active
                  ? `${ring} ring-2 shadow-sm`
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              {/* Selected check */}
              {active && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </span>
              )}
              <Icon className={`w-6 h-6 ${active ? iconColor : 'text-gray-400'}`} />
              <span className={`text-[11px] font-black leading-tight ${active ? 'text-farmGreen-950' : 'text-gray-500'}`}>{label}</span>
              <span className={`text-[9px] font-semibold ${badge ? 'text-blue-600' : badgeFree ? 'text-emerald-600' : 'text-gray-400'}`}>{sub}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">

        {/* ── COD warning: compact banner ── */}
        {payment === 'cod' && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
            <Banknote className="w-8 h-8 text-blue-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-blue-900">₹50 cash fee on delivery</p>
              <p className="text-[10px] text-blue-600 font-semibold">Pay rider at doorstep</p>
            </div>
            <button
              type="button"
              onClick={() => setPayment('upi')}
              className="shrink-0 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            >
              <Zap className="w-3 h-3 text-amber-300" /> UPI
            </button>
          </div>
        )}

        {/* ── UPI sub-form ── */}
        {payment === 'upi' && (
          <div className="space-y-3 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
            {/* UPI app icon row */}
            <div className="grid grid-cols-4 gap-2">
              {UPI_APPS.map(app => (
                <button key={app.id} type="button" onClick={() => setUpiApp(app.id)}
                  className={`py-2 rounded-xl text-[10px] font-black border-2 transition-all cursor-pointer ${
                    upiApp === app.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                  }`}>
                  {app.label}
                </button>
              ))}
            </div>
            {/* UPI ID input */}
            <input
              type="text"
              placeholder="username@upi"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl outline-none font-bold text-xs text-farmGreen-950 placeholder:text-gray-400 focus:border-emerald-500 transition-colors ${
                errors.upiId ? 'border-red-400' : 'border-emerald-200'
              }`}
              {...register('upiId', {
                required: false,
                pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, message: 'Invalid UPI ID (e.g. name@bank).' },
              })}
            />
            <FieldError message={errors.upiId?.message} />

            {/* QR hint */}
            <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-semibold">
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              <span>Or scan QR at payment screen</span>
            </div>
          </div>
        )}

        {/* ── Card sub-form ── */}
        {payment === 'card' && (
          <div className="space-y-2.5 p-4 bg-slate-950 border border-emerald-500/20 rounded-2xl">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Card Details</span>
            <input type="text" maxLength={19} placeholder="Card number"
              className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl outline-none font-mono text-xs text-emerald-200 placeholder:text-gray-600 focus:border-emerald-500 transition-colors ${
                errors.cardNumber ? 'border-red-500' : 'border-emerald-500/30'
              }`}
              {...register('cardNumber', {
                required: payment === 'card' ? 'Card number required.' : false,
                minLength: { value: 15, message: 'Enter a valid card number.' },
              })}
            />
            <FieldError message={errors.cardNumber?.message} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input type="text" maxLength={5} placeholder="MM / YY"
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl outline-none font-mono text-xs text-emerald-200 placeholder:text-gray-600 focus:border-emerald-500 transition-colors ${
                    errors.cardExpiry ? 'border-red-500' : 'border-emerald-500/30'
                  }`}
                  {...register('cardExpiry', {
                    required: payment === 'card' ? 'Expiry required.' : false,
                    pattern: { value: /^\d{2}\s?\/\s?\d{2}$/, message: 'MM / YY' },
                  })}
                />
                <FieldError message={errors.cardExpiry?.message} />
              </div>
              <div>
                <input type="password" maxLength={3} placeholder="CVV"
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl outline-none font-mono text-xs text-emerald-200 placeholder:text-gray-600 focus:border-emerald-500 transition-colors ${
                    errors.cardCvv ? 'border-red-500' : 'border-emerald-500/30'
                  }`}
                  {...register('cardCvv', {
                    required: payment === 'card' ? 'CVV required.' : false,
                    minLength: { value: 3, message: '3-digit CVV.' },
                  })}
                />
                <FieldError message={errors.cardCvv?.message} />
              </div>
            </div>
          </div>
        )}

        {/* ── Farmer Tip ── icon-only pill row ── */}
        <div className="flex items-center gap-2 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
          <HeartHandshake className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="text-xs font-black text-emerald-950 flex-1">Farmer tip</span>
          <div className="flex items-center gap-1.5">
            {TIP_AMOUNTS.map(amt => (
              <button key={amt} type="button" onClick={() => setFarmerTip(amt)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                  farmerTip === amt
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:border-emerald-400'
                }`}>
                {amt === 0 ? '—' : `₹${amt}`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center gap-3 pt-1">
          {onBack && (
            <button type="button" onClick={onBack}
              className="px-5 py-3.5 bg-white border border-gray-200 text-farmGreen-950 hover:bg-gray-50 rounded-2xl font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <button type="submit" disabled={busy}
            className={`flex-1 py-3.5 rounded-2xl font-black text-xs text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              busy ? 'bg-emerald-700/70 cursor-not-allowed' : 'bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98]'
            }`}>
            {busy
              ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
              : <><span>{submitLabel}</span><ArrowRight className="w-4 h-4" /></>
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
