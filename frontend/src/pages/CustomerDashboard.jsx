import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomerNavbar } from './Customer/CustomerNavbar';
import { FloatingCartBar } from '../components/FloatingCartBar';
import { PRODUCTS } from '../data/mockData';

const CustomerHome = lazy(() => import('./Customer/CustomerHome').then(m => ({ default: m.CustomerHome || m.default })));
const CustomerProducts = lazy(() => import('./Customer/CustomerProducts').then(m => ({ default: m.CustomerProducts || m.default })));
const CustomerWishlist = lazy(() => import('./Customer/CustomerWishlist').then(m => ({ default: m.CustomerWishlist || m.default })));
const CustomerCartCheckout = lazy(() => import('./Customer/CustomerCartCheckout').then(m => ({ default: m.CustomerCartCheckout || m.default })));
const CustomerOrders = lazy(() => import('./Customer/CustomerOrders').then(m => ({ default: m.CustomerOrders || m.default })));
const CustomerProfileSettings = lazy(() => import('./Customer/CustomerProfileSettings').then(m => ({ default: m.CustomerProfileSettings || m.default })));
const ProduceDetailModal = lazy(() => import('./Customer/ProduceDetailModal').then(m => ({ default: m.ProduceDetailModal || m.default })));

const ViewLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-emerald-700 text-xs font-medium animate-pulse">Loading view...</p>
    </div>
  </div>
);

export const CustomerDashboard = ({ setActiveView }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => ['home', 'products', 'wishlist', 'cart', 'orders', 'profile', 'settings'], []);

  const activeTab = useMemo(() => {
    const rawPath = location.pathname.replace(/^\/customer\/?/, '');
    const cleanTab = rawPath.split('/')[0];
    if (validTabs.includes(cleanTab)) return cleanTab;
    return 'home';
  }, [location.pathname, validTabs]);

  const setActiveTab = (tab) => {
    if (tab === 'home') {
      navigate('/customer');
    } else {
      navigate(`/customer/${tab}`);
    }
  };


  // Master Customer States
  const [products, setProducts] = useState(PRODUCTS);
  const [wishlist, setWishlist] = useState([PRODUCTS[0], PRODUCTS[2]]);
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);

  const [customerOrders, setCustomerOrders] = useState([
    {
      id: 'ORD-4127',
      date: 'Today, 10:44 AM',
      items: 'Pure A2 Gir Cow Milk (1 liter)',
      farmer: 'Rajesh Kumar (Pune Rural)',
      status: 'Pending',
      eta: '25-35 mins',
      total: 94,
      paymentMethod: 'Cash on Delivery',
      address: 'Flat 402, Green Acres, Baner Road, Pune',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      category: 'Dairy',
      itemsList: [
        { name: 'Pure A2 Gir Cow Milk', qty: '1 Liter', price: 94, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80' }
      ],
      timeline: [
        { title: 'Order Placed', time: '10:44 AM', done: true, desc: 'Sent to farmer Rajesh Kumar' },
        { title: 'Farmer Approval', time: 'Pending', done: false, desc: 'Farm harvesting & packaging' },
        { title: 'Courier Pickup', time: 'Pending', done: false, desc: 'Nearest EV rider assignment' },
        { title: 'Delivered', time: 'Est. 11:15 AM', done: false, desc: 'Doorstep drop in Baner, Pune' }
      ]
    },
    {
      id: 'ORD-8821',
      date: 'Today, 10:15 AM',
      items: 'Vine Tomatoes (2kg), Hydroponic Spinach (1 bunch)',
      farmer: 'Rajesh Kumar (Pune Rural)',
      status: 'Out for Delivery',
      eta: '18 mins',
      total: 110,
      paymentMethod: 'UPI (Paid)',
      address: 'Flat 402, Green Acres, Baner Road, Pune',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      category: 'Vegetables',
      rider: { name: 'Vikram Singh', phone: '+91 98230 11223', vehicle: 'Ather 450X EV Scooter · MH 12 FE 4920' },
      itemsList: [
        { name: 'Vine Tomatoes', qty: '2 kg', price: 80, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Hydroponic Spinach', qty: '1 bunch', price: 30, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=200&q=80' }
      ],
      timeline: [
        { title: 'Order Placed', time: '10:15 AM', done: true, desc: 'Order verified & confirmed' },
        { title: 'Harvest Packed', time: '10:22 AM', done: true, desc: 'Packed fresh at Pune Rural Hub' },
        { title: 'Out for Delivery', time: '10:35 AM', done: true, desc: 'Vikram Singh en route with thermal bag' },
        { title: 'Delivered', time: 'Est. 10:53 AM', done: false, desc: '18 mins away from Baner Road' }
      ]
    },
    {
      id: 'ORD-7649',
      date: 'Yesterday, 4:30 PM',
      items: 'A2 Gir Cow Milk (2L), Devgad Alphonso Mangoes (1 dozen)',
      farmer: 'Mahesh Deshmukh (Satara Dairy)',
      status: 'Delivered',
      eta: 'Completed',
      total: 810,
      paymentMethod: 'Credit Card',
      address: 'Flat 402, Green Acres, Baner Road, Pune',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
      category: 'Fruits & Dairy',
      itemsList: [
        { name: 'A2 Gir Cow Milk', qty: '2 Liters', price: 160, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80' },
        { name: 'Devgad Alphonso Mangoes', qty: '1 Dozen', price: 650, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80' }
      ],
      timeline: [
        { title: 'Order Placed', time: '4:30 PM', done: true, desc: 'Order confirmed' },
        { title: 'Harvest Packed', time: '4:42 PM', done: true, desc: 'Insulated box sealed' },
        { title: 'Out for Delivery', time: '4:55 PM', done: true, desc: 'Courier on transit' },
        { title: 'Delivered', time: '5:12 PM', done: true, desc: 'Handed over at front desk' }
      ]
    }
  ]);

  const toggleWishlist = (product) => {
    if (wishlist.some(w => w.id === product.id)) {
      setWishlist(wishlist.filter(w => w.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const addNewCustomerOrder = (newOrder) => {
    setCustomerOrders([newOrder, ...customerOrders]);
  };

  const handleOpenQuickBuy = (product) => {
    setQuickBuyProduct(product);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'products':
        return (
          <CustomerProducts
            products={products}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onOpenQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'wishlist':
        return (
          <CustomerWishlist
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            setActiveTab={setActiveTab}
          />
        );
      case 'cart':
        return (
          <CustomerCartCheckout
            setActiveTab={setActiveTab}
            addNewCustomerOrder={addNewCustomerOrder}
          />
        );
      case 'orders':
        return (
          <CustomerOrders
            orders={customerOrders}
            setOrders={setCustomerOrders}
          />
        );
      case 'profile':
        return <CustomerProfileSettings key="profile" initialSubTab="profile" />;
      case 'settings':
        return <CustomerProfileSettings key="settings" initialSubTab="security" />;
      case 'home':
      default:
        return (
          <CustomerHome
            products={products}
            setActiveTab={setActiveTab}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onOpenQuickBuy={handleOpenQuickBuy}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-farmBg flex flex-col relative">
      
      {/* Top Navbar Header */}
      <CustomerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlistCount={wishlist.length}
      />

      {/* Main Customer Content Body */}
      <main className="flex-1 p-4 sm:p-8 w-full max-w-7xl mx-auto pb-28">
        <Suspense fallback={<ViewLoader />}>
          {renderActiveView()}
        </Suspense>
      </main>

      {/* Quick-Buy & Produce Details Modal */}
      {quickBuyProduct && (
        <Suspense fallback={null}>
          <ProduceDetailModal
            product={quickBuyProduct}
            onClose={() => setQuickBuyProduct(null)}
            toggleWishlist={toggleWishlist}
            isWishlisted={wishlist.some(w => w.id === quickBuyProduct.id)}
            setActiveTab={setActiveTab}
          />
        </Suspense>
      )}

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
};

export default CustomerDashboard;
