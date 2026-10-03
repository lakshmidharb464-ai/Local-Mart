import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { realtimeService } from '../services/realtimeService';
import { useAuth } from './AuthContext';

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { showToast, user } = useAuth();

  // Initial load via API Service
  const loadMarketplaceData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [fetchedProducts, fetchedOrders] = await Promise.all([
        productService.fetchProducts(),
        orderService.fetchOrders('All'),
      ]);
      setProducts(fetchedProducts || []);
      setOrders(fetchedOrders || []);
    } catch (err) {
      console.error('Failed to load marketplace data:', err);
      setLoadError('Failed to load marketplace data. Please check your connection and refresh.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarketplaceData();
  }, [loadMarketplaceData]);

  // Real-Time Event Subscriptions (SSE)
  useEffect(() => {
    const unsubStatus = realtimeService.on('ORDER_STATUS_UPDATED', (payload) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === payload.orderId ? { ...o, status: payload.status, failureReason: payload.reason || o.failureReason } : o))
      );
      if (showToast && payload.status) {
        showToast(`Order ${payload.orderId} Update`, `Status changed to ${payload.status}`);
      }
    });

    const unsubCreated = realtimeService.on('ORDER_CREATED', (payload) => {
      // Refresh or prepend
      setOrders((prev) => {
        if (prev.some((o) => o.id === payload.orderId)) return prev;
        const newOrderObj = {
          id: payload.orderId,
          total: Number(payload.totalAmount),
          status: payload.status || 'Pending',
          items: payload.itemsSummary || 'Fresh Farm Items',
          date: 'Just now',
          paymentMethod: payload.paymentMethod || 'UPI',
        };
        return [newOrderObj, ...prev];
      });
      if (user?.role === 'Admin' || user?.role === 'Farmer' || user?.role === 'Delivery') {
        if (showToast) showToast('New Order Received! 📦', `Order ${payload.orderId} was just placed.`);
      }
    });

    return () => {
      unsubStatus();
      unsubCreated();
    };
  }, [showToast, user?.role]);

  // Product CRUD Handlers
  const addProduct = async (productData) => {
    try {
      const newProd = await productService.createProduct(productData);
      setProducts((prev) => [newProd, ...prev]);
      if (showToast) {
        showToast('Crop Listing Published! 🌾', `${newProd.name} is now live for customers.`);
      }
      return newProd;
    } catch (err) {
      if (showToast) showToast('Error', 'Failed to publish crop.', 'error');
      throw err;
    }
  };

  const updateProduct = async (id, changes) => {
    try {
      const updated = await productService.updateProduct(id, changes);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      console.error('Failed to update product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (showToast) showToast('Deleted', 'Produce removed from marketplace.');
    } catch (err) {
      console.error('Failed to delete product:', err);
      throw err;
    }
  };

  // Order Placement & Progression
  const placeOrder = async (orderPayload) => {
    try {
      const placed = await orderService.placeOrder(orderPayload);
      setOrders((prev) => [placed, ...prev]);
      if (showToast) {
        showToast('Order Confirmed! 📦', `Order ${placed.id} placed successfully.`);
      }
      return placed;
    } catch (err) {
      if (showToast) showToast('Checkout Failed', 'Could not process order.', 'error');
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, newStatus, reason = null) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus, reason);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (showToast) {
        showToast(`Status Updated: ${newStatus}`, `Order ${orderId} is now ${newStatus}`);
      }
      return updated;
    } catch (err) {
      console.error('Failed to update order status:', err);
      throw err;
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        setProducts,
        orders,
        setOrders,
        isLoading,
        loadError,
        refreshData: loadMarketplaceData,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
