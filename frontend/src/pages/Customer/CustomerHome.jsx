import React, { useState, useCallback, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Search, Heart, Star, ShoppingCart, Eye,
  Leaf, Sprout, MapPin, ChevronRight, Check,
  X, Truck, ShieldCheck, Package, ArrowRight,
  Zap, Plus, Minus, TrendingUp, Clock, Award,
  Flame, BadgePercent
} from 'lucide-react';
import { FARMERS } from '../../data/mockData';

/* ═══════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════ */
const Toast = ({ name, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
    zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12,
    background: 'linear-gradient(135deg,#0d2214,#1b3a1f)',
    border: '1px solid rgba(168,240,96,0.3)',
    padding: '12px 18px', borderRadius: 18, minWidth: 240,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,240,96,0.1)',
    animation: 'toastUp .35s cubic-bezier(.22,1,.36,1) both',
    fontFamily: 'Plus Jakarta Sans,sans-serif',
  }}>
    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#a8f060,#6fcf37)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(168,240,96,0.3)' }}>
      <Check style={{ width: 15, height: 15, color: '#071a0b' }} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{name}</div>
      <div style={{ fontSize: 10, color: 'rgba(168,240,96,0.6)', marginTop: 2, fontWeight: 600 }}>Added to basket ✓</div>
    </div>
    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 6, borderRadius: 8 }}>
      <X style={{ width: 12, height: 12 }} />
    </button>
    <style>{`
      @keyframes toastUp{from{opacity:0;transform:translate(-50%,20px) scale(0.95)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
    `}</style>
  </div>
);

/* ═══════════════════════════════════════════════════
   PRODUCT CARD — premium redesign
═══════════════════════════════════════════════════ */
const ProductCard = ({ prod, isWishlisted, onWishlist, onQuickView, onAddToCart, cartQty, onQtyChange }) => {
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(prod);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: hov ? '1.5px solid #a5d6a7' : '1.5px solid #f0f4f0',
        boxShadow: hov
          ? '0 16px 48px rgba(15,40,24,0.14), 0 4px 16px rgba(46,125,50,0.08)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all .3s cubic-bezier(.22,1,.36,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        position: 'relative',
      }}
    >
      {/* Image */}
      <div
        style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#f0f4f0', cursor: 'pointer', flexShrink: 0 }}
        onClick={() => onQuickView(prod)}
      >
        <img
          src={prod.image} alt={prod.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.1)' : 'scale(1)', transition: 'transform .5s cubic-bezier(.22,1,.36,1)' }}
        />
        {/* Dark gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.35) 0%, transparent 50%)', opacity: hov ? 1 : 0, transition: 'opacity .3s' }} />

        {/* Quick View pill */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', paddingBottom: 12, opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(12px)', transition: 'all .28s ease' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.96)', color: '#0d2214', fontSize: 10, fontWeight: 800, padding: '5px 14px', borderRadius: 999, boxShadow: '0 4px 16px rgba(0,0,0,.2)', backdropFilter: 'blur(8px)' }}>
            <Eye style={{ width: 11, height: 11 }} /> Quick View
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(prod); }}
          style={{
            position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isWishlisted ? '#ef4444' : 'rgba(255,255,255,.92)',
            color: isWishlisted ? '#fff' : '#bbb',
            boxShadow: isWishlisted ? '0 4px 12px rgba(239,68,68,0.4)' : '0 2px 8px rgba(0,0,0,.12)',
            transform: isWishlisted ? 'scale(1.15)' : hov ? 'scale(1.05)' : 'scale(1)',
            transition: 'all .22s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <Heart style={{ width: 13, height: 13, fill: isWishlisted ? '#fff' : 'none' }} />
        </button>

        {/* Tags */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {prod.organic && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'linear-gradient(135deg,#a8f060,#6fcf37)', color: '#071a0b', fontSize: 9, fontWeight: 900, padding: '3px 9px', borderRadius: 999, boxShadow: '0 2px 8px rgba(168,240,96,0.35)' }}>
              <Leaf style={{ width: 8, height: 8 }} /> Organic
            </span>
          )}
        </div>

        {/* Harvest badge */}
        <div style={{ position: 'absolute', bottom: hov ? 36 : 10, left: 10, background: 'rgba(10,30,14,.82)', backdropFilter: 'blur(8px)', padding: '3px 9px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4, transition: 'bottom .28s ease' }}>
          <Clock style={{ width: 8, height: 8, color: '#a8f060' }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{prod.harvestDate}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => onQuickView(prod)}>
          <h3 style={{ fontWeight: 800, fontSize: 13, color: '#0d2214', lineHeight: 1.3, margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {prod.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Sprout style={{ width: 10, height: 10, color: '#4caf50', flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#7a8f7e', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{prod.farmerName}</span>
            <span style={{ fontSize: 10, color: '#c8d6c9' }}>·</span>
            <MapPin style={{ width: 9, height: 9, color: '#9ca3af', flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#9ca3af', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{prod.farmerLocation}</span>
          </div>
        </div>

        {/* Price + Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 900, fontSize: 17, color: '#0d2214' }}>₹{prod.price}</span>
            <span style={{ fontWeight: 400, fontSize: 10, color: '#9ca3af', marginLeft: 2 }}>/{prod.unit}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fffbeb', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: 999 }}>
            <Star style={{ width: 10, height: 10, fill: '#f59e0b', color: '#f59e0b' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#92400e' }}>{prod.rating}</span>
            <span style={{ fontSize: 9, color: '#b45309' }}>({prod.reviewsCount})</span>
          </div>
        </div>

        {/* Cart Controls */}
        {cartQty > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#f0faf0,#e8f5e9)', borderRadius: 12, padding: '4px 6px', border: '1.5px solid #c8e6c9' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onQtyChange(prod, -1); }}
              style={{ width: 28, height: 28, borderRadius: 8, background: '#fff', border: '1px solid #c8e6c9', color: '#2e7d32', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, transition: 'all .15s', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = '#2e7d32' && (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2e7d32'; }}
            >
              <Minus style={{ width: 12, height: 12 }} />
            </button>
            <span style={{ fontWeight: 800, fontSize: 13, color: '#1b5e20', flex: 1, textAlign: 'center' }}>{cartQty} in cart</span>
            <button
              onClick={(e) => { e.stopPropagation(); onQtyChange(prod, 1); }}
              style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2e7d32,#1b5e20)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, transition: 'all .15s', flexShrink: 0, boxShadow: '0 2px 8px rgba(46,125,50,0.3)' }}
            >
              <Plus style={{ width: 12, height: 12 }} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            style={{
              width: '100%', height: 36, borderRadius: 12, border: 'none',
              fontWeight: 800, fontSize: 11, fontFamily: 'Plus Jakarta Sans,sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer',
              background: added
                ? 'linear-gradient(135deg,#84cc16,#65a30d)'
                : hov
                  ? 'linear-gradient(135deg,#1b5e20,#0d2214)'
                  : 'linear-gradient(135deg,#2e7d32,#1b5e20)',
              color: '#fff',
              boxShadow: hov && !added ? '0 6px 20px rgba(46,125,50,.35)' : 'none',
              transform: hov && !added ? 'scale(1.01)' : 'scale(1)',
              transition: 'all .22s cubic-bezier(.22,1,.36,1)',
            }}
          >
            {added
              ? <><Check style={{ width: 13, height: 13 }} /> Added!</>
              : <><ShoppingCart style={{ width: 12, height: 12 }} /> Add to Basket</>
            }
          </button>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   CATEGORY CARD — premium redesign
═══════════════════════════════════════════════════ */
const CatCard = ({ cat, count, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none', padding: 0,
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        gap: 0, fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'left',
      }}
    >
      <div style={{
        width: '100%', aspectRatio: '3/2', borderRadius: 18, overflow: 'hidden',
        position: 'relative',
        border: hov ? '2.5px solid #66bb6a' : '2px solid rgba(0,0,0,0.06)',
        boxShadow: hov
          ? '0 16px 40px rgba(46,125,50,.22), 0 4px 16px rgba(0,0,0,.10)'
          : '0 2px 8px rgba(0,0,0,.07)',
        transform: hov ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all .3s cubic-bezier(.22,1,.36,1)',
      }}>
        <img
          src={cat.image} alt={cat.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.1)' : 'scale(1)', transition: 'transform .5s cubic-bezier(.22,1,.36,1)' }}
        />
        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, transparent 30%, rgba(0,0,0,.6) 100%)', opacity: hov ? 1 : 0.65, transition: 'opacity .3s' }} />

        {/* Label */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: '#fff', lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,.3)' }}>{cat.name}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontWeight: 600, opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(4px)', transition: 'all .25s ease' }}>
            {count} items →
          </div>
        </div>

        {/* Hover badge */}
        {hov && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'linear-gradient(135deg,#a8f060,#6fcf37)', color: '#071a0b', fontSize: 9, fontWeight: 900, padding: '3px 9px', borderRadius: 999, boxShadow: '0 2px 8px rgba(168,240,96,0.4)' }}>
            Shop →
          </div>
        )}
      </div>
    </button>
  );
};

/* ═══════════════════════════════════════════════════
   FARMER CARD — premium redesign
═══════════════════════════════════════════════════ */
const FarmerCard = ({ farmer }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 18px', background: '#fff', borderRadius: 18,
        border: hov ? '1.5px solid #a5d6a7' : '1.5px solid #f0f4f0',
        boxShadow: hov ? '0 12px 36px rgba(15,40,24,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all .3s cubic-bezier(.22,1,.36,1)', cursor: 'default',
        fontFamily: 'Plus Jakarta Sans, sans-serif', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Hover shimmer bg */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(232,245,233,0.5),transparent)', opacity: hov ? 1 : 0, transition: 'opacity .3s' }} />

      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0, zIndex: 1 }}>
        <img
          src={farmer.image} alt={farmer.name}
          style={{
            width: 52, height: 52, borderRadius: 14, objectFit: 'cover',
            border: hov ? '2.5px solid #66bb6a' : '2px solid #e8f5e9',
            transition: 'border-color .25s, transform .25s',
            transform: hov ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <span style={{ position: 'absolute', bottom: -2, right: -2, width: 13, height: 13, borderRadius: '50%', background: '#84cc16', border: '2.5px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#0d2214', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{farmer.name}</div>
        <div style={{ fontSize: 10, color: '#7a8f7e', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{farmer.specialty}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 7 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#9ca3af' }}>
            <MapPin style={{ width: 9, height: 9, color: '#4caf50' }} />{farmer.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 800, color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', padding: '1px 7px', borderRadius: 999 }}>
            <Star style={{ width: 9, height: 9, fill: '#f59e0b', color: '#f59e0b' }} />{farmer.rating}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 9, fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '1px 7px', borderRadius: 999 }}>
            <ShieldCheck style={{ width: 8, height: 8 }} /> Verified
          </span>
        </div>
      </div>

      <ChevronRight style={{ width: 15, height: 15, color: hov ? '#2e7d32' : '#d1d5db', transform: hov ? 'translateX(3px)' : 'translateX(0)', transition: 'all .22s', flexShrink: 0, zIndex: 1 }} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PERK STRIP ITEM — animated
═══════════════════════════════════════════════════ */
const PerkItem = ({ icon: Icon, text, bg, fg, gradient }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, background: '#fff',
        borderRadius: 16, border: hov ? '1.5px solid #c8e6c9' : '1.5px solid #f0f4f0',
        padding: '13px 16px',
        boxShadow: hov ? '0 8px 24px rgba(46,125,50,0.12)' : '0 2px 6px rgba(0,0,0,0.05)',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all .25s cubic-bezier(.22,1,.36,1)', cursor: 'default',
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 12, background: gradient || bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: hov ? `0 4px 14px ${bg}80` : 'none', transition: 'box-shadow .25s' }}>
        <Icon style={{ width: 18, height: 18 }} />
      </div>
      <span style={{ fontWeight: 800, fontSize: 12, color: '#0d2214' }}>{text}</span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN CustomerHome
═══════════════════════════════════════════════════ */
export const CustomerHome = ({ products, setActiveTab, toggleWishlist, wishlist, onOpenQuickBuy }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [toast, setToast] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleAdd = useCallback((prod) => {
    addToCart(prod);
    setToast(prod.name);
    setTimeout(() => setToast(null), 2800);
  }, [addToCart]);

  const getCartItem = (productId) => cartItems.find(item => item.product.id === productId);
  const getCartQty = (productId) => getCartItem(productId)?.quantity || 0;
  const handleQtyChange = (product, delta) => {
    const item = getCartItem(product.id);
    if (!item && delta > 0) { addToCart(product); return; }
    if (!item) return;
    updateQuantity(product.id, item.quantity + delta);
  };

  const approved = products.filter(p => p.status === 'Approved');
  const cats = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grocery'];
  const filtered = approved.filter(p => {
    const matchCat = activeCat === 'All' || p.category === activeCat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.farmerName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const farmers = FARMERS.filter(f => f.approvalStatus === 'Approved');

  const catConfig = [
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80' },
    { name: 'Fruits',     image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=500&q=80' },
    { name: 'Dairy',      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80' },
    { name: 'Grocery',    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80' },
  ];

  const getCatCount = (name) => approved.filter(p => p.category === name).length;

  const perks = [
    { icon: Truck, text: 'Same-Day Delivery', bg: '#d1fae5', fg: '#065f46', gradient: 'linear-gradient(135deg,#34d399,#059669)' },
    { icon: ShieldCheck, text: 'Verified Farmers', bg: '#dbeafe', fg: '#1e40af', gradient: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
    { icon: Leaf, text: 'Zero Middleman', bg: '#dcfce7', fg: '#166534', gradient: 'linear-gradient(135deg,#4ade80,#16a34a)' },
    { icon: Award, text: 'Freshness Guarantee', bg: '#fef3c7', fg: '#92400e', gradient: 'linear-gradient(135deg,#fbbf24,#d97706)' },
  ];

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#f0f2f0', paddingBottom: 80 }}>
      {toast && <Toast name={toast} onClose={() => setToast(null)} />}

      {/* ══════════════════════════════════════════
          § 1  HERO — cinematic split panel
      ══════════════════════════════════════════ */}
      <div style={{
        borderRadius: 24, overflow: 'hidden', marginBottom: 14,
        background: 'linear-gradient(125deg,#071a0b 0%,#0d2214 40%,#0f2a18 70%,#122a18 100%)',
        position: 'relative', minHeight: 320,
        display: 'flex',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
      }}>
        {/* Ambient blobs */}
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(100,200,60,.07),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '35%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,152,0,.05),transparent 70%)', pointerEvents: 'none' }} />

        {/* LEFT: Text */}
        <div style={{
          flex: '0 0 54%', padding: '44px 44px 40px', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', position: 'relative', zIndex: 2,
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all .7s cubic-bezier(.22,1,.36,1)',
        }}>
          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 10px', borderRadius: 999, border: '1px solid rgba(168,240,96,0.25)', background: 'rgba(168,240,96,0.08)', marginBottom: 18, width: 'fit-content', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a8f060', display: 'inline-block', animation: 'pulseDot 2s infinite', boxShadow: '0 0 0 0 rgba(168,240,96,0.5)' }} />
            <span style={{ color: '#a8f060', fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Fresh · Organic · Local</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 14px', fontSize: 'clamp(1.8rem,3vw,2.6rem)', letterSpacing: '-.035em' }}>
            Farm-Fresh<br />
            Groceries,{' '}
            <span style={{ color: '#a8f060', textShadow: '0 0 30px rgba(168,240,96,0.2)' }}>Direct<br />to Your Home</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, lineHeight: 1.75, margin: '0 0 22px', maxWidth: 360, fontWeight: 500 }}>
            Shop from <strong style={{ color: 'rgba(255,255,255,.85)', fontWeight: 800 }}>142 verified local farmers</strong> — zero middleman, zero compromise on freshness.
          </p>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 400, marginBottom: 20 }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#9ca3af', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search tomatoes, A2 milk, mangoes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && search) document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{ width: '100%', padding: '13px 110px 13px 46px', background: 'rgba(255,255,255,0.97)', borderRadius: 16, border: 'none', outline: 'none', fontSize: 12, fontWeight: 600, color: '#0d2214', boxSizing: 'border-box', boxShadow: '0 12px 40px rgba(0,0,0,.28)', fontFamily: 'Plus Jakarta Sans,sans-serif' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 90, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                <X style={{ width: 13, height: 13 }} />
              </button>
            )}
            <button
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', padding: '7px 16px', background: 'linear-gradient(135deg,#FF9800,#F57C00)', color: '#fff', border: 'none', borderRadius: 11, fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: '0 4px 14px rgba(255,152,0,.35)', transition: 'transform .15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
            >
              Search
            </button>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
            <button
              onClick={() => setActiveTab('products')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 26px', borderRadius: 14, background: 'linear-gradient(135deg,#a8f060,#6fcf37)', color: '#071a0b', fontSize: 12, fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(168,240,96,.32)', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04) translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(168,240,96,.42)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(168,240,96,.32)'; }}
            >
              <Zap style={{ width: 14, height: 14 }} /> Shop Now <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
            <button
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 20px', borderRadius: 14, background: 'rgba(255,255,255,.09)', color: '#fff', fontSize: 12, fontWeight: 700, border: '1px solid rgba(255,255,255,.18)', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', backdropFilter: 'blur(6px)', transition: 'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.09)'}
            >
              Browse Products
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { val: '142+', label: 'Local Farms', icon: Sprout },
              { val: '100%', label: 'Organic', icon: Leaf },
              { val: '2hr', label: 'Avg. Delivery', icon: Truck },
              { val: '4.9★', label: '12k+ Reviews', icon: Star },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(168,240,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168,240,96,0.2)' }}>
                    <Icon style={{ width: 12, height: 12, color: '#a8f060' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 14, color: '#a8f060', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', lineHeight: 1, marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Image */}
        <div style={{
          flex: '0 0 46%', position: 'relative', overflow: 'hidden',
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateX(0)' : 'translateX(20px)',
          transition: 'all .9s cubic-bezier(.22,1,.36,1)',
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(to right, #0d2214 0%, rgba(13,34,20,0.5) 25%, transparent 55%)' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(7,26,11,.4) 0%, transparent 30%, transparent 65%, rgba(7,26,11,.55) 100%)' }} />

          <img
            src="/hero_basket_banner.jpg"
            alt="Fresh farm produce basket"
            draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', userSelect: 'none', display: 'block' }}
          />

          {/* Floating chips */}
          <div style={{ position: 'absolute', top: 20, right: 18, zIndex: 3, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(10,30,14,.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(168,240,96,.2)', padding: '8px 14px', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,.4)', animation: 'floatChip 5s ease-in-out infinite' }}>
            <Leaf style={{ width: 13, height: 13, color: '#a8f060' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>100% Organic</span>
          </div>

          <div style={{ position: 'absolute', bottom: 22, left: 20, zIndex: 3, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(10,30,14,.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.12)', padding: '8px 14px', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,.4)', animation: 'floatChipAlt 6s ease-in-out infinite' }}>
            <Truck style={{ width: 13, height: 13, color: '#a8f060' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Free Same-Day Delivery</span>
          </div>

          <div style={{ position: 'absolute', top: '42%', right: 18, zIndex: 3, display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(12px)', padding: '7px 13px', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,.25)', animation: 'floatChip 7s ease-in-out infinite 1s' }}>
            <Star style={{ width: 12, height: 12, fill: '#f59e0b', color: '#f59e0b' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#0d2214', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>4.9 · 12k+ Reviews</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          § 2  PERKS STRIP
      ══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        {perks.map((p, i) => <PerkItem key={i} {...p} />)}
      </div>

      {/* ══════════════════════════════════════════
          § 3  CATEGORIES
      ══════════════════════════════════════════ */}
      <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #f0f4f0', padding: '20px 22px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 17, color: '#0d2214', margin: 0 }}>Browse by Category</h2>
            <p style={{ fontSize: 11, color: '#7a8f7e', margin: '3px 0 0', fontWeight: 500 }}>Fresh produce sorted by type</p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 800, color: '#2e7d32', background: '#f0faf0', border: '1px solid #c8e6c9', padding: '6px 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2e7d32'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f0faf0'; e.currentTarget.style.color = '#2e7d32'; }}
          >
            See all <ArrowRight style={{ width: 11, height: 11 }} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {catConfig.map(cat => (
            <CatCard
              key={cat.name}
              cat={cat}
              count={getCatCount(cat.name)}
              onClick={() => { setActiveCat(cat.name); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          § 4  PRODUCTS GRID
      ══════════════════════════════════════════ */}
      <div id="products-section" style={{ marginBottom: 14 }}>
        {/* Head */}
        <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #f0f4f0', padding: '16px 22px', marginBottom: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 17, color: '#0d2214', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Flame style={{ width: 18, height: 18, color: '#f97316' }} /> Our Fresh Products
              </h2>
              <p style={{ fontSize: 11, color: '#7a8f7e', margin: '3px 0 0', fontWeight: 500 }}>All verified, farm-direct produce · {filtered.length} items</p>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 800, color: '#2e7d32', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}
            >
              See All <ArrowRight style={{ width: 13, height: 13 }} />
            </button>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {cats.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  flexShrink: 0, padding: '7px 16px', borderRadius: 999,
                  fontSize: 11, fontWeight: 800, cursor: 'pointer', border: 'none',
                  fontFamily: 'Plus Jakarta Sans,sans-serif',
                  background: activeCat === cat ? 'linear-gradient(135deg,#2e7d32,#1b5e20)' : '#f5f7f5',
                  color: activeCat === cat ? '#fff' : '#2e7d32',
                  boxShadow: activeCat === cat ? '0 4px 16px rgba(46,125,50,.28)' : '0 1px 3px rgba(0,0,0,.06)',
                  outline: activeCat !== cat ? '1.5px solid #d4edda' : 'none',
                  transition: 'all .22s cubic-bezier(.22,1,.36,1)',
                  transform: activeCat === cat ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                {cat}
                {cat !== 'All' && <span style={{ marginLeft: 5, opacity: 0.7 }}>({getCatCount(cat)})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(185px,1fr))', gap: 12 }}>
          {filtered.map(prod => (
            <ProductCard
              key={prod.id}
              prod={prod}
              isWishlisted={wishlist.some(w => w.id === prod.id)}
              onWishlist={toggleWishlist}
              onQuickView={p => onOpenQuickBuy && onOpenQuickBuy(p)}
              onAddToCart={handleAdd}
              cartQty={getCartQty(prod.id)}
              onQtyChange={handleQtyChange}
            />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: '#7a8f7e' }}>
              <Package style={{ width: 40, height: 40, margin: '0 auto 12px', color: '#c8d6c9' }} />
              <div style={{ fontSize: 14, fontWeight: 700 }}>No products found</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Try a different category or clear your search.</div>
              <button onClick={() => { setActiveCat('All'); setSearch(''); }} style={{ marginTop: 14, padding: '8px 20px', borderRadius: 999, background: '#f0faf0', border: '1.5px solid #c8e6c9', color: '#2e7d32', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          § 5  LOCAL FARMERS
      ══════════════════════════════════════════ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 17, color: '#0d2214', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp style={{ width: 17, height: 17, color: '#2e7d32' }} /> Meet Your Local Farmers
            </h2>
            <p style={{ fontSize: 11, color: '#7a8f7e', margin: '3px 0 0', fontWeight: 500 }}>Verified growers behind every product</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
          {farmers.map(f => <FarmerCard key={f.id} farmer={f} />)}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(168,240,96,0.5); }
          50% { opacity: .7; box-shadow: 0 0 0 6px rgba(168,240,96,0); }
        }
        @keyframes floatChip {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatChipAlt {
          0%, 100% { transform: translateY(-4px); }
          50% { transform: translateY(4px); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
