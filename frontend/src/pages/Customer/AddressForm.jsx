/**
 * AddressForm.jsx
 * ─────────────────────────────────────────────────────────
 * Reusable address-capture form powered by react-hook-form.
 * Visually identical to the checkout Step-1 address section.
 *
 * Props:
 *   onSubmit(data)   - called with { addrPreset, address, deliveryNotes }
 *   defaultValues    - optional pre-filled values
 *   submitLabel      - button label (default: "Continue to Payment")
 *   isLoading        - shows spinner on submit button
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  MapPin, Home, Building2, Navigation,
  LocateFixed, AlertCircle, ArrowRight, Loader2,
} from 'lucide-react';

/* --- Address preset tiles -------------------------------- */
const ADDRESS_PRESETS = [
  { id: 'home',  icon: Home,       label: 'Home',  addr: 'Flat 402, Green Acres, Baner Road, Pune, Maharashtra' },
  { id: 'work',  icon: Building2,  label: 'Work',  addr: 'Office 7B, TechPark Phase 2, Hinjewadi, Pune' },
  { id: 'other', icon: Navigation, label: 'Other', addr: '' },
];

/* --- Shared card wrapper - identical to SectionCard ----- */
const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[24px] border border-emerald-100/80 shadow-farm-md p-5 sm:p-6 font-display ${className}`}>
    {children}
  </div>
);

/* --- Shared section title - identical to SectionTitle --- */
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

/* --- Inline field error ---------------------------------- */
const FieldError = ({ message }) =>
  message ? (
    <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </span>
  ) : null;

/* ==========================================================
   AddressForm Component
========================================================== */
export const AddressForm = ({
  onSubmit,
  defaultValues = {},
  submitLabel = 'Continue to Payment',
  isLoading = false,
}) => {
  const [addrPreset, setAddrPreset] = useState(defaultValues.addrPreset || 'home');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      address: defaultValues.address ?? ADDRESS_PRESETS[0].addr,
      deliveryNotes: defaultValues.deliveryNotes ?? '',
    },
  });

  const handlePresetClick = (preset) => {
    setAddrPreset(preset.id);
    if (preset.addr) setValue('address', preset.addr, { shouldValidate: true });
  };

  const handleFormSubmit = (data) => {
    if (onSubmit) onSubmit({ ...data, addrPreset });
  };

  const busy = isLoading || isSubmitting;

  return (
    <SectionCard>
      <SectionTitle icon={MapPin} title="1. Select Delivery Location" sub="Choose or enter your delivery address in Pune" />

      {/* Preset Tiles */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {ADDRESS_PRESETS.map((p) => {
          const Icon = p.icon;
          const isSelected = addrPreset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetClick(p)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-center space-y-1 w-full ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                  : 'bg-gray-50/80 border-gray-200 hover:border-emerald-200'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto ${isSelected ? 'text-emerald-700' : 'text-gray-400'}`} />
              <div className="font-black text-xs text-farmGreen-950">{p.label}</div>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4 text-xs font-black">

        {/* Full Delivery Address */}
        <div>
          <label htmlFor="af-address" className="text-farmGreen-950 mb-1.5 block">
            Full Delivery Address *
          </label>
          <textarea
            id="af-address"
            rows={3}
            placeholder="Enter complete building name, street, locality & landmark..."
            className={`w-full p-3.5 bg-gray-50 border rounded-2xl text-xs font-bold text-farmGreen-950 outline-none transition-all resize-none ${
              errors.address
                ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                : 'border-gray-200 focus:border-emerald-600 focus:bg-white'
            }`}
            {...register('address', {
              required: 'Please enter your full delivery address.',
              minLength: { value: 10, message: 'Address must be at least 10 characters.' },
              validate: (v) =>
                v.trim().split(' ').filter(Boolean).length >= 3 ||
                'Please enter a complete address (building, street, city).',
            })}
          />
          <FieldError message={errors.address?.message} />
        </div>

        {/* Delivery Instructions */}
        <div>
          <label htmlFor="af-notes" className="text-farmGreen-950 mb-1.5 block">
            Delivery Instructions <span className="text-farmMuted font-bold">(Optional)</span>
          </label>
          <input
            id="af-notes"
            type="text"
            placeholder="e.g. Leave at security gate / Call on arrival..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-xs font-bold text-farmGreen-950 outline-none transition-all"
            {...register('deliveryNotes', {
              maxLength: { value: 120, message: 'Keep instructions under 120 characters.' },
            })}
          />
          <FieldError message={errors.deliveryNotes?.message} />
        </div>

        {/* GPS shortcut */}
        <button
          type="button"
          onClick={() => {
            setAddrPreset('other');
            setValue('address', 'Detecting your location...', { shouldValidate: false });
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                () => setValue('address', 'Current GPS Location, Pune, Maharashtra', { shouldValidate: true }),
                () => setValue('address', '', { shouldValidate: false }),
              );
            }
          }}
          className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer group"
        >
          <LocateFixed className="w-3.5 h-3.5 group-hover:animate-spin" />
          Use my current location
        </button>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={busy}
          className={`w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
            busy
              ? 'bg-emerald-700/70 cursor-not-allowed'
              : 'bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98]'
          }`}
        >
          {busy ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving address...</span></>
          ) : (
            <><span>{submitLabel}</span><ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </SectionCard>
  );
};

export default AddressForm;
