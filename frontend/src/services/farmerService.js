/**
 * Farmer API Service
 * Handles all API calls to /api/farmer/* endpoints
 */
import { apiClient } from './apiClient';

export const farmerService = {
  /**
   * Fetch this farmer's own products (not the public marketplace)
   * GET /api/farmer/products
   */
  async fetchMyProducts() {
    const res = await apiClient('/farmer/products');
    return res?.products || [];
  },

  /**
   * Fetch this farmer's orders
   * GET /api/farmer/orders
   */
  async fetchMyOrders() {
    const res = await apiClient('/farmer/orders');
    return res?.orders || [];
  },

  /**
   * Create a new product listing
   * POST /api/farmer/products
   */
  async createProduct(productData) {
    const res = await apiClient('/farmer/products', {
      method: 'POST',
      body: productData,
    });
    return res;
  },

  /**
   * Update a product listing
   * PATCH /api/farmer/products/:id
   */
  async updateProduct(id, changes) {
    const res = await apiClient(`/farmer/products/${id}`, {
      method: 'PATCH',
      body: changes,
    });
    return res;
  },

  /**
   * Delete a product listing
   * DELETE /api/farmer/products/:id
   */
  async deleteProduct(id) {
    const res = await apiClient(`/farmer/products/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  /**
   * Update order status from farmer side (e.g. Packed, Ready)
   * PATCH /api/farmer/orders/:id/status
   */
  async updateOrderStatus(orderId, status, note = '') {
    const res = await apiClient(`/farmer/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status, note },
    });
    return res;
  },

  /**
   * Get farmer overview KPIs
   * GET /api/farmer/overview
   */
  async getOverview() {
    const res = await apiClient('/farmer/overview');
    return res;
  },

  /**
   * Get farmer profile
   * GET /api/farmer/profile
   */
  async getProfile() {
    const res = await apiClient('/farmer/profile');
    return res?.profile || null;
  },

  /**
   * Update farmer profile
   * PUT /api/farmer/profile
   */
  async updateProfile(profileData) {
    const res = await apiClient('/farmer/profile', {
      method: 'PUT',
      body: profileData,
    });
    return res;
  },

  /**
   * Get harvest plans
   * GET /api/farmer/harvest-plans
   */
  async getHarvestPlans() {
    const res = await apiClient('/farmer/harvest-plans');
    return res?.plans || [];
  },

  /**
   * Create harvest plan
   * POST /api/farmer/harvest-plans
   */
  async createHarvestPlan(planData) {
    const res = await apiClient('/farmer/harvest-plans', {
      method: 'POST',
      body: planData,
    });
    return res;
  },

  /**
   * Broadcast harvest alert to subscribers
   * POST /api/farmer/harvest-plans/:id/broadcast
   */
  async broadcastHarvestAlert(id, message) {
    const res = await apiClient(`/farmer/harvest-plans/${id}/broadcast`, {
      method: 'POST',
      body: { message },
    });
    return res;
  },

  /**
   * Get inventory batches
   * GET /api/farmer/inventory/batches
   */
  async getInventoryBatches() {
    const res = await apiClient('/farmer/inventory/batches');
    return res?.batches || [];
  },

  /**
   * Request a payout
   * POST /api/farmer/payouts
   */
  async requestPayout(payoutData) {
    const res = await apiClient('/farmer/payouts', {
      method: 'POST',
      body: payoutData,
    });
    return res;
  },

  /**
   * Upload image/document to Cloudinary
   * POST /api/media/upload
   */
  async uploadImage(file, folder = 'farmer-products') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await apiClient('/media/upload', {
      method: 'POST',
      body: formData,
    });
    return res?.secure_url || res?.url || null;
  },
};

export default farmerService;
