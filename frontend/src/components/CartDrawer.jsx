import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, X, Plus, Minus, Trash2,
  CheckCircle2, ArrowRight, Leaf, Truck,
  Sparkles, Tag, ShieldCheck
} from 'lucide-react';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems, isCartOpen, setIsCartOpen,
    updateQuantity, removeFromCart,
    subtotal, deliveryFee, total
  } = useCart();
  const { isAuthenticated, openAuthModal, showToast } = useAuth();

  const [removingId, setRemovingId] = useState(null);

  if (!isCartOpen) return null;

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 300);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      openAuthModal('signin', 'Customer');
      if (showToast) showToast('Authentication Required', 'Please sign in as Customer to checkout.', 'error');
      return;
    }
    setIsCartOpen(false);
    navigate('/customer/cart');
  };

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const freeDelivery = subtotal > 300;
  const remaining = Math.max(0, 300 - subtotal);

  return (
    <>
      <style>{`
        @keyframes drawerIn {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rowFadeOut {
          to { opacity: 0; transform: scale(0.94) translateX(20px); }
        }
        @keyframes shimmerSlide {
          0%   { background-position: -300% 0; }
          100% { background-position: 300% 0; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-farmGreen-900/60 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Drawer panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div
            className="w-screen max-w-md flex flex-col"
            style={{
              background: '#f4f7f4',
              animation: 'drawerIn 0.38s cubic-bezier(.22,1,.36,1) both',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              background: 'linear-gradient(135deg, #071a0b 0%, #0d2214 55%, #122a18 100%)',
              padding: '20px 22px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#4caf50,#1b5e20)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(76,175,80,0.35)' }}>
                    <ShoppingBag style={{ width: 18, height: 18, color: '#fff' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 16, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-.02em' }}>
                      Your Harvest Basket
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(168,240,96,0.8)', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} · Farm-direct produce
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  <X style={{ width: 15, height: 15 }} />
                </button>
              </div>

              {/* Free delivery progress */}
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Truck style={{ width: 11, height: 11, color: freeDelivery ? '#a8f060' : '#9ca3af' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: freeDelivery ? '#a8f060' : 'rgba(255,255,255,0.55)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {freeDelivery ? '🎉 You unlocked FREE delivery!' : `Add ₹${remaining} more for free delivery`}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    ₹{subtotal}/₹300
                  </span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((subtotal / 300) * 100, 100)}%`,
                    borderRadius: 99,
                    background: freeDelivery
                      ? 'linear-gradient(90deg,#4caf50,#a8f060)'
                      : 'linear-gradient(90deg,#4caf50,#8bc34a)',
                    backgroundSize: '300% 100%',
                    animation: 'shimmerSlide 2s linear infinite',
                    transition: 'width 0.6s cubic-bezier(.22,1,.36,1)',
                  }} />
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <ShoppingBag style={{ width: 28, height: 28, color: '#4caf50' }} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#0d2214', marginBottom: 6 }}>Your basket is empty</div>
                  <p style={{ fontSize: 12, color: '#7a8f7e', marginBottom: 20 }}>Add fresh farm-direct produce to get started.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    style={{ padding: '10px 28px', background: 'linear-gradient(135deg,#2e7d32,#1b5e20)', color: '#fff', borderRadius: 999, fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 14px rgba(46,125,50,0.28)' }}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', background: '#fff', borderRadius: 18,
                      border: '1.5px solid #f0f4f0',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      animation: removingId === product.id ? 'rowFadeOut 0.3s ease both' : 'fadeScaleIn 0.35s cubic-bezier(.22,1,.36,1) both',
                      transition: 'all .25s ease',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    {/* Product image */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={product.image} alt={product.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 12, display: 'block' }}
                      />
                      {product.organic && (
                        <span style={{ position: 'absolute', bottom: -4, left: -4, background: 'linear-gradient(135deg,#a8f060,#6fcf37)', borderRadius: 99, padding: '2px 6px', fontSize: 8, fontWeight: 900, color: '#071a0b' }}>
                          Organic
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 12, color: '#0d2214', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#7a8f7e', marginTop: 2 }}>
                        ₹{product.price}/{product.unit} · {product.farmerName || 'Local Farmer'}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 13, color: '#1b5e20', marginTop: 4 }}>
                        ₹{product.price * quantity}
                      </div>
                    </div>

                    {/* Qty stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 1, background: '#f5f7f5', borderRadius: 12, padding: 3, border: '1.5px solid #e0ece0', flexShrink: 0 }}>
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        style={{ width: 28, height: 28, borderRadius: 9, background: '#fff', border: '1px solid #d4edda', color: '#2e7d32', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#2e7d32'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2e7d32'; }}
                      >
                        <Minus style={{ width: 11, height: 11 }} />
                      </button>
                      <span style={{ width: 26, textAlign: 'center', fontSize: 13, fontWeight: 900, color: '#0d2214' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#2e7d32,#1b5e20)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', boxShadow: '0 2px 8px rgba(46,125,50,0.25)' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(46,125,50,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(46,125,50,0.25)'}
                      >
                        <Plus style={{ width: 11, height: 11 }} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(product.id)}
                      style={{ width: 30, height: 30, borderRadius: 9, background: '#fff0f0', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff0f0'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* ── Footer ── */}
            {cartItems.length > 0 && (
              <div style={{ background: '#fff', borderTop: '1px solid #e8f0e8', padding: '16px 20px 20px', flexShrink: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

                {/* Cost breakdown */}
                <div style={{ background: '#f8faf8', borderRadius: 14, padding: '12px 16px', border: '1px solid #e8f0e8', marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#7a8f7e', fontWeight: 600 }}>Subtotal ({totalItems} items)</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0d2214' }}>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#7a8f7e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Truck style={{ width: 11, height: 11, color: freeDelivery ? '#4caf50' : '#9ca3af' }} /> Delivery Fee
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: freeDelivery ? '#2e7d32' : '#0d2214' }}>
                      {freeDelivery ? 'FREE 🎉' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div style={{ height: 1, background: '#e0ece0', marginBottom: 10 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#0d2214' }}>Total Amount</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#1b5e20', letterSpacing: '-.02em' }}>₹{total}</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  {[
                    { icon: ShieldCheck, text: 'Secure Payment' },
                    { icon: Leaf, text: 'Farm-Direct' },
                    { icon: Truck, text: 'Same-Day Delivery' },
                  ].map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: '#f0faf0', border: '1px solid #c8e6c9', borderRadius: 10, padding: '7px 6px' }}>
                        <Icon style={{ width: 10, height: 10, color: '#4caf50', flexShrink: 0 }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#2e7d32' }}>{b.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Checkout button */}
                <button
                  onClick={handleProceedToCheckout}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 16,
                    background: 'linear-gradient(135deg,#a8f060,#6fcf37)',
                    color: '#071a0b', fontSize: 14, fontWeight: 900,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    boxShadow: '0 8px 28px rgba(168,240,96,0.4)',
                    transition: 'all .25s cubic-bezier(.22,1,.36,1)',
                    letterSpacing: '-.01em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 36px rgba(168,240,96,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(168,240,96,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Sparkles style={{ width: 15, height: 15 }} />
                  <span>Proceed to Checkout</span>
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
