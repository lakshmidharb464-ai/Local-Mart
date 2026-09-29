/**
 * checkoutConstants.js
 * Shared constants for the 3-step checkout flow.
 * Imported by: CustomerCartCheckout, AddressForm, PaymentForm, DiscountForm
 */

import { Home, Building2, Navigation, Smartphone, Banknote, CreditCard, Wallet } from 'lucide-react';

export const ADDRESS_PRESETS = [
  { id: 'home',  icon: Home,       label: 'Home',  addr: 'Flat 402, Green Acres, Baner Road, Pune, Maharashtra' },
  { id: 'work',  icon: Building2,  label: 'Work',  addr: 'Office 7B, TechPark Phase 2, Hinjewadi, Pune' },
  { id: 'other', icon: Navigation, label: 'Other', addr: '' },
];

export const PAYMENT_OPTIONS = [
  { id: 'upi',    icon: Smartphone, label: 'UPI / GPay',            sub: 'Instant - Free - Zero Extra Fee',                      badge: 'Recommended (Free)', color: '#16a34a' },
  { id: 'cod',    icon: Banknote,   label: 'Cash on Delivery',       sub: 'Pay cash when harvest arrives (Rs.50 COD handling fee)', badge: 'Rs.50 Cash Fee',    color: '#2563eb' },
  { id: 'card',   icon: CreditCard, label: 'Credit / Debit Card',    sub: 'Visa, Mastercard, RuPay',                               badge: null,                color: '#7c3aed' },
  { id: 'wallet', icon: Wallet,     label: 'PhonePe / Paytm Wallet', sub: 'Wallet balance applied',                               badge: null,                color: '#ea580c' },
];

export const COUPONS = [
  { code: 'FARM10',  pct: 10, label: '10% OFF', desc: 'Welcome discount for organic buyers' },
  { code: 'ORGANIC', pct: 15, label: '15% OFF', desc: 'Special discount on all harvest produce' },
  { code: 'FRESH20', pct: 20, label: '20% OFF', desc: 'Weekend farm direct harvest offer' },
];
