/**
 * DiscountForm.jsx
 * Reusable coupon / discount step powered by react-hook-form.
 * Identical design to checkout Step-3 discount section.
 *
 * Props:
 *   onSubmit({ couponCode, appliedCoupon })
 *   onBack()
 *   defaultValues   - { couponCode, appliedCoupon }
 *   availableCoupons - array of { code, pct, label, desc }
 *   submitLabel
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { COUPONS as DEFAULT_COUPONS } from './checkoutConstants';
import {
  Tag, X, Check, ChevronLeft, ArrowRight,
  Loader2, AlertCircle, Gift, Sparkles,
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

export const DiscountForm = ({
  onSubmit,
  onBack,
  onValuesChange,
  defaultValues = {},
  availableCoupons = DEFAULT_COUPONS,
  submitLabel = 'Review & Confirm Order',
  isLoading = false,
}) => {
  const [appliedCoupon, setAppliedCoupon] = useState(defaultValues.appliedCoupon || null);
  const [couponError, setCouponError]     = useState('');

  // Fire live updates to parent sidebar when coupon is applied or removed
  useEffect(() => {
    if (onValuesChange) onValuesChange({ appliedCoupon });
  }, [appliedCoupon]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: { couponCode: defaultValues.couponCode || '' },
  });

  const couponCode = watch('couponCode');
  const busy = isLoading || isSubmitting;

  const applyCoupon = (codeToTry) => {
    const target = (codeToTry || couponCode || '').trim().toUpperCase();
    const found  = availableCoupons.find((c) => c.code === target);
    if (found) {
      setAppliedCoupon(found);
      setCouponError('');
    } else {
      setCouponError(`Invalid coupon. Try: ${availableCoupons.map((c) => c.code).join(', ')}.`);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setValue('couponCode', '');
    setCouponError('');
  };

  const handleFormSubmit = () => {
    if (onSubmit) onSubmit({ couponCode: appliedCoupon?.code || '', appliedCoupon });
  };

  return (
    <SectionCard>
      <SectionTitle icon={Tag} title="3. Apply Coupon and Review" sub="Enter promo code and review your harvest order" />

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">
        {/* Input + Apply */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon (e.g. FARM10)"
            className={`flex-1 px-4 py-2.5 bg-gray-50 border rounded-2xl text-xs font-black uppercase text-farmGreen-950 outline-none transition-all ${
              couponError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-600'
            }`}
            {...register('couponCode')}
          />
          <button
            type="button"
            onClick={() => applyCoupon()}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black shadow-xs cursor-pointer transition-all active:scale-95"
          >
            Apply
          </button>
        </div>

        {/* Error */}
        {couponError && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-red-600">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {couponError}
          </span>
        )}

        {/* Applied coupon pill */}
        {appliedCoupon && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs font-black text-amber-900 animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              Coupon <strong>{appliedCoupon.code}</strong> applied — {appliedCoupon.pct}% OFF!
            </span>
            <button type="button" onClick={removeCoupon} className="text-rose-600 hover:text-rose-800 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick-pick coupon cards */}
        {!appliedCoupon && (
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold text-farmMuted uppercase tracking-wider flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-amber-500" /> Available Offers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {availableCoupons.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => applyCoupon(c.code)}
                  className="p-3 bg-emerald-50/80 border border-emerald-200/70 hover:border-emerald-500 rounded-2xl text-left transition-all cursor-pointer group active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black font-mono text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300/70">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-700 flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-amber-500" />{c.label}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-farmMuted leading-tight">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
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
              busy ? 'bg-emerald-700/70 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 active:scale-[0.98]'
            }`}>
            {busy ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing...</span></>
            ) : (
              <><span>{submitLabel}</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </form>
    </SectionCard>
  );
};

export default DiscountForm;
