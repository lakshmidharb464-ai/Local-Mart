/**
 * PaymentForm.jsx
 * Reusable payment method selector powered by react-hook-form.
 * Identical design to checkout Step-2 payment section.
 *
 * Props:
 *   onSubmit({ payment, upiId, upiApp, cardNumber, cardExpiry, cardCvv, farmerTip })
 *   defaultValues   - pre-filled values
 *   onBack()        - called when user clicks Back
 *   userName        - shown on card preview
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PAYMENT_OPTIONS } from './checkoutConstants';
import {
  CreditCard, Smartphone, Banknote, Wallet,
  Info, Zap, HeartHandshake, Coins, AlertCircle,
  ChevronLeft, ArrowRight, Loader2, Sparkles,
} from 'lucide-react';

const SECTION_CARD_CLS = 'bg-white rounded-[24px] border border-emerald-100/80 shadow-farm-md p-5 sm:p-6 font-display';

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
  submitLabel = 'Continue to Discount',
  isLoading = false,
  userName = 'CARDHOLDER',
}) => {
  const [payment, setPayment] = useState(defaultValues.payment || 'upi');
  const [upiApp, setUpiApp]   = useState(defaultValues.upiApp || 'gpay');
  const [farmerTip, setFarmerTip] = useState(defaultValues.farmerTip || 0);
  const [upiMode, setUpiMode] = useState('vpa'); // 'vpa' | 'qr'

  // Fire live updates to parent sidebar whenever payment method or tip changes
  useEffect(() => {
    if (onValuesChange) onValuesChange({ payment, farmerTip });
  }, [payment, farmerTip]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      upiId:      defaultValues.upiId      || 'anita@okicici',
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
    <SectionCard>
      <SectionTitle icon={CreditCard} title="2. Select Payment Method" sub="All transactions are 100% secure and encrypted" />

      {/* Payment option tiles */}
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
                        Cash Rs.50 Fee
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-farmMuted font-bold">{p.sub}</div>
                </div>
              </div>
              {p.badge && (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                  p.id === 'cod' ? 'bg-blue-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {p.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">
        {/* COD warning */}
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
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-full shadow-xs">+ Rs.50 Charge</span>
            </div>
            <div className="p-3 bg-white/90 rounded-xl border border-blue-200/80 text-xs font-bold text-gray-700 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span>Flat <strong>Rs.50 cash handling charge</strong> added to cover doorstep collection and verification.</span>
                <div className="text-[11px] text-emerald-800 font-extrabold mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Tip: Choose UPI/GPay for 100% Free Payment!</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setPayment('upi')}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Switch to UPI (Save Rs.50 Cash Charge)</span>
            </button>
          </div>
        )}

        {/* UPI sub-form */}
        {payment === 'upi' && (
          <div className="p-4 sm:p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-4">
            {/* Mode Tabs: VPA vs QR */}
            <div className="flex gap-2 p-1 bg-white/80 rounded-xl border border-emerald-200/60 max-w-xs">
              <button
                type="button"
                onClick={() => setUpiMode('vpa')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  upiMode === 'vpa'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-farmMuted hover:text-farmGreen-950'
                }`}
              >
                VPA Handle
              </button>
              <button
                type="button"
                onClick={() => setUpiMode('qr')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  upiMode === 'qr'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-farmMuted hover:text-farmGreen-950'
                }`}
              >
                <span>Instant QR</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black">FAST</span>
              </button>
            </div>

            {upiMode === 'vpa' ? (
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-emerald-950 block">Select Instant UPI App</span>
                <div className="grid grid-cols-4 gap-2">
                  {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                    <button key={app} type="button" onClick={() => setUpiApp(app)}
                      className={`p-2 rounded-xl text-center text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        upiApp === app ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}>{app}</button>
                  ))}
                </div>
                <div>
                  <label className="text-[11px] font-bold text-emerald-900 mb-1 block">UPI VPA Handle</label>
                  <input type="text" placeholder="username@upi"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl outline-none font-bold text-xs text-farmGreen-950 ${
                      errors.upiId ? 'border-red-400' : 'border-emerald-200'
                    }`}
                    {...register('upiId', {
                      required: payment === 'upi' && upiMode === 'vpa' ? 'Enter your UPI ID.' : false,
                      pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, message: 'Invalid UPI format (e.g. name@bank).' },
                    })}
                  />
                  <FieldError message={errors.upiId?.message} />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 text-center space-y-3">
                <div className="inline-block p-3 bg-white rounded-2xl border-2 border-dashed border-emerald-400 shadow-inner">
                  {/* Dynamic SVG QR Code Simulation */}
                  <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    <rect x="5" y="5" width="30" height="30" rx="4" fill="#0B3D2E" />
                    <rect x="10" y="10" width="20" height="20" fill="white" />
                    <rect x="15" y="15" width="10" height="10" fill="#0B3D2E" />
                    <rect x="65" y="5" width="30" height="30" rx="4" fill="#0B3D2E" />
                    <rect x="70" y="10" width="20" height="20" fill="white" />
                    <rect x="75" y="15" width="10" height="10" fill="#0B3D2E" />
                    <rect x="5" y="65" width="30" height="30" rx="4" fill="#0B3D2E" />
                    <rect x="10" y="70" width="20" height="20" fill="white" />
                    <rect x="15" y="75" width="10" height="10" fill="#0B3D2E" />
                    <circle cx="50" cy="50" r="10" fill="#2EA672" />
                    <rect x="42" y="15" width="6" height="16" fill="#0B3D2E" />
                    <rect x="42" y="68" width="16" height="6" fill="#0B3D2E" />
                    <rect x="68" y="42" width="16" height="6" fill="#0B3D2E" />
                    <rect x="75" y="75" width="10" height="10" fill="#0B3D2E" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xs font-black text-farmGreen-950">Scan & Pay with Any UPI App</h5>
                  <p className="text-[11px] text-farmMuted font-bold mt-0.5">Supports GPay, PhonePe, Paytm, BHIM & CRED</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl text-[10px] font-black text-emerald-800 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Auto-detects transaction upon scanner authorization</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card sub-form */}
        {payment === 'card' && (
          <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border border-emerald-500/20 rounded-2xl space-y-4 flex flex-col items-center shadow-lg">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider block self-start">Interactive Card Payment</span>
            <div className="relative group perspective-1000 w-[240px] h-[154px] cursor-pointer">
              <div className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-2xl shadow-2xl">
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#171717] border border-white/10 p-4 text-white flex flex-col justify-between [backface-visibility:hidden]">
                  <div className="flex justify-between items-start">
                    <svg className="w-8 h-8 shrink-0" viewBox="0 0 50 50">
                      <rect width="40" height="30" x="5" y="10" rx="4" fill="#d4af37" opacity="0.9" />
                      <path d="M5 20h40M5 30h40M25 10v30" stroke="#8a7322" strokeWidth="1.5" />
                    </svg>
                    <span className="text-[10px] font-mono tracking-widest text-gray-400 font-bold">MASTERCARD</span>
                  </div>
                  <div className="my-auto text-left">
                    <p className="font-mono font-bold text-xs tracking-widest text-emerald-300">{cardNumber || '9759 2484 5269 6576'}</p>
                  </div>
                  <div className="flex justify-between items-end text-left text-[9px] font-mono">
                    <div>
                      <span className="block text-[7px] text-gray-400 font-sans uppercase">Card Holder</span>
                      <span className="font-bold tracking-wider text-gray-200 uppercase">{userName}</span>
                    </div>
                    <div>
                      <span className="block text-[7px] text-gray-400 font-sans uppercase">Valid Thru</span>
                      <span className="font-bold text-gray-200">{cardExpiry || '12 / 28'}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#171717] border border-white/10 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between py-4 shadow-2xl">
                  <div className="w-full h-7 bg-gradient-to-r from-gray-900 via-black to-gray-900 mt-1" />
                  <div className="px-4 flex items-center justify-end gap-2">
                    <div className="w-3/4 h-6 bg-white/90 rounded flex items-center justify-end px-2 text-[#171717] font-mono text-xs font-bold italic">
                      {cardCvv || '***'}
                    </div>
                  </div>
                  <p className="text-[8px] text-gray-500 font-mono px-4 text-center">Hover to flip card · 100% Encrypted</p>
                </div>
              </div>
            </div>
            <div className="w-full space-y-2.5 pt-2">
              <input type="text" maxLength={19} placeholder="4532 8920 1234 5678"
                className={`w-full px-3.5 py-2.5 bg-slate-900/90 border rounded-xl outline-none font-mono text-xs font-bold text-emerald-200 placeholder:text-gray-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-emerald-500/30 focus:border-emerald-400'
                }`}
                {...register('cardNumber', {
                  required: payment === 'card' ? 'Card number required.' : false,
                  minLength: { value: 15, message: 'Enter a valid card number.' },
                })}
              />
              <FieldError message={errors.cardNumber?.message} />
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <input type="text" maxLength={5} placeholder="MM / YY"
                    className={`w-full px-3.5 py-2.5 bg-slate-900/90 border rounded-xl outline-none font-mono text-xs font-bold text-emerald-200 placeholder:text-gray-500 ${
                      errors.cardExpiry ? 'border-red-500' : 'border-emerald-500/30 focus:border-emerald-400'
                    }`}
                    {...register('cardExpiry', {
                      required: payment === 'card' ? 'Expiry required.' : false,
                      pattern: { value: /^\d{2}\s?\/\s?\d{2}$/, message: 'Format: MM / YY' },
                    })}
                  />
                  <FieldError message={errors.cardExpiry?.message} />
                </div>
                <div>
                  <input type="password" maxLength={3} placeholder="CVV"
                    className={`w-full px-3.5 py-2.5 bg-slate-900/90 border rounded-xl outline-none font-mono text-xs font-bold text-emerald-200 placeholder:text-gray-500 ${
                      errors.cardCvv ? 'border-red-500' : 'border-emerald-500/30 focus:border-emerald-400'
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
          </div>
        )}

        {/* Farmer tip */}
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-emerald-950 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
              <span>Support Farmers directly with a tip:</span>
            </span>
            <span className="text-emerald-800 font-mono">Rs.{farmerTip}</span>
          </div>
          <div className="flex items-center gap-2">
            {[0, 10, 20, 50].map((amt) => (
              <button key={amt} type="button" onClick={() => setFarmerTip(amt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  farmerTip === amt ? 'bg-emerald-800 text-white shadow-xs' : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                }`}>
                {amt === 0 ? 'No tip' : `+ Rs.${amt}`}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3 pt-2">
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
            {busy ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving payment...</span></>
            ) : (
              <><span>{submitLabel}</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </form>
    </SectionCard>
  );
};

export default PaymentForm;
