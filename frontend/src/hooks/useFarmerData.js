/**
 * useFarmerData — React hook for Farmer Dashboard data
 *
 * Loads products and orders from the farmer-specific backend endpoints
 * (/api/farmer/products and /api/farmer/orders) rather than the public marketplace.
 * Provides CRUD methods that stay in sync with the backend.
 */
import { useState, useEffect, useCallback } from 'react';
import { farmerService } from '../services/farmerService';
import { useAuth } from '../context/AuthContext';

export function useFarmerData() {
  const { showToast } = useAuth();

  const [products, setProductsState] = useState([]);
  const [orders, setOrdersState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // ── Load on mount ──────────────────────────────────────────────────────────
  const loadFarmerData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [fetchedProducts, fetchedOrders] = await Promise.all([
        farmerService.fetchMyProducts(),
        farmerService.fetchMyOrders(),
      ]);
      setProductsState(fetchedProducts);
      setOrdersState(fetchedOrders);
    } catch (err) {
      console.error('Failed to load farmer data:', err);
      setLoadError('Failed to load farm data. Check your connection.');
      if (showToast) showToast('Data Load Failed', err.message || 'Could not connect to server.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFarmerData();
  }, [loadFarmerData]);

  // ── Products CRUD ──────────────────────────────────────────────────────────
  const addProduct = useCallback(async (productData) => {
    try {
      await farmerService.createProduct(productData);
      // Re-fetch to get the server-assigned ID and status
      const updated = await farmerService.fetchMyProducts();
      setProductsState(updated);
      if (showToast) showToast('Crop Listed! 🌾', `${productData.name} has been published.`);
    } catch (err) {
      if (showToast) showToast('Failed to Add Product', err.message, 'error');
      throw err;
    }
  }, [showToast]);

  const updateProduct = useCallback(async (id, changes) => {
    // Optimistic UI update
    setProductsState(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
    try {
      await farmerService.updateProduct(id, changes);
      if (showToast) showToast('Product Updated', 'Listing saved successfully.');
    } catch (err) {
      // Rollback on failure
      await loadFarmerData();
      if (showToast) showToast('Update Failed', err.message, 'error');
      throw err;
    }
  }, [showToast, loadFarmerData]);

  const deleteProduct = useCallback(async (id, prodName) => {
    // Optimistic UI update
    setProductsState(prev => prev.filter(p => p.id !== id));
    try {
      await farmerService.deleteProduct(id);
      if (showToast) showToast('Listing Removed', `${prodName || 'Product'} deleted from catalog.`);
    } catch (err) {
      // Rollback on failure
      await loadFarmerData();
      if (showToast) showToast('Delete Failed', err.message, 'error');
      throw err;
    }
  }, [showToast, loadFarmerData]);

  // ── Orders ─────────────────────────────────────────────────────────────────
  const updateOrderStatus = useCallback(async (orderId, newStatus, note = '') => {
    // Optimistic UI update
    setOrdersState(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await farmerService.updateOrderStatus(orderId, newStatus, note);
      if (showToast) showToast('Order Status Updated 📦', `Order ${orderId} set to ${newStatus}.`);
    } catch (err) {
      // Rollback
      await loadFarmerData();
      if (showToast) showToast('Status Update Failed', err.message, 'error');
      throw err;
    }
  }, [showToast, loadFarmerData]);

  // ── Local-only helpers (for bulk ops / flash sales that don't have a backend route yet) ──
  const setProducts = useCallback((updater) => {
    setProductsState(updater);
  }, []);

  const setOrders = useCallback((updater) => {
    setOrdersState(updater);
  }, []);

  return {
    products,
    orders,
    isLoading,
    loadError,
    refreshData: loadFarmerData,
    // CRUD
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    // Local fallbacks (for bulk ops in FarmerProducts that aren't yet API-backed)
    setProducts,
    setOrders,
  };
}

export default useFarmerData;
