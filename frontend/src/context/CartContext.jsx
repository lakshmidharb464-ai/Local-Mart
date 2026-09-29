import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('localfarm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('localfarm_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const { showToast } = useAuth();

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
    showToast('Added to Basket!', `${product.name} added to your cart.`);
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // Free delivery for orders ₹300 and above; otherwise ₹30 flat fee. Must match backend orderController.js logic.
  const deliveryFee = subtotal > 0 ? (subtotal >= 300 ? 0 : 30) : 0;
  const total = subtotal + deliveryFee;

  /**
   * Initiates checkout.
   * Guest users are allowed — no auth gate.
   * Navigates to the dedicated /checkout page for the multi-step flow.
   */
  const checkout = useCallback(() => {
    if (cartItems.length === 0) {
      showToast('Empty Cart', 'Add some items before checking out.', 'error');
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  }, [cartItems.length, navigate, showToast]);

  /**
   * Called by CheckoutPage after a successful order placement.
   * Clears cart and shows success state.
   */
  const completeOrder = useCallback((orderId, orderDetails) => {
    clearCart();
    setIsCheckoutSuccess(true);
    setTimeout(() => setIsCheckoutSuccess(false), 4000);
    navigate(`/order-confirmation/${orderId}`, { state: { order: orderDetails } });
  }, [clearCart, navigate]);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      deliveryFee,
      total,
      checkout,
      completeOrder,
      isCheckoutSuccess,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
