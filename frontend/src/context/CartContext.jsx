import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const { showToast, isAuthenticated, openAuthModal } = useAuth();

  const addToCart = (product, quantity = 1) => {
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
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal > 300 ? 0 : 30) : 0;
  const total = subtotal + deliveryFee;

  const checkout = () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      openAuthModal('signin', 'Customer');
      showToast('Authentication Required', 'Please sign in as Customer to checkout.', 'error');
      return;
    }
    if (cartItems.length === 0) return;

    setIsCheckoutSuccess(true);
    clearCart();
    setTimeout(() => {
      setIsCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 4000);
  };

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
      isCheckoutSuccess
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
