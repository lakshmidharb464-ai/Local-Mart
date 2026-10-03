/**
 * Order API Service
 * All calls go to the real backend — no mock data.
 */
import { apiClient } from './apiClient';

export const orderService = {
  /**
   * Fetch orders for current role/user
   * Role determines which endpoint to call:
   *   Customer  → GET /api/orders/my-orders
   *   Farmer    → GET /api/farmer/orders
   *   Delivery  → GET /api/delivery/orders
   *   Admin     → GET /api/admin/orders
   */
  async fetchOrders(role = 'Customer', filter = 'all') {
    try {
      let endpoint;
      if (role === 'Farmer') {
        endpoint = `/farmer/orders?filter=${filter}`;
      } else if (role === 'Delivery') {
        endpoint = `/delivery/orders?filter=${filter}`;
      } else if (role === 'Admin') {
        endpoint = `/admin/orders?filter=${filter}`;
      } else {
        endpoint = `/orders/my-orders?filter=${filter}`;
      }
      const res = await apiClient(endpoint);
      return res?.orders || (Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('[orderService] Failed to fetch orders:', err);
      return [];
    }
  },

  /**
   * Place a new order from checkout
   * POST /api/orders
   */
  async placeOrder(orderPayload) {
    if (!orderPayload || !Array.isArray(orderPayload.items) || orderPayload.items.length === 0) {
      throw new Error('Your cart is empty. Please add farm produce before checking out.');
    }
    if (!orderPayload.addressText || !orderPayload.addressText.trim()) {
      throw new Error('Delivery address is required.');
    }

    const res = await apiClient('/orders', {
      method: 'POST',
      body: orderPayload,
    });
    return res?.order || res;
  },

  /**
   * Advance order status
   * PATCH /api/orders/:id/status
   */
  async updateOrderStatus(orderId, newStatus, reason = null) {
    if (!orderId || !newStatus) {
      throw new Error('Order ID and target status are required to update order.');
    }

    const res = await apiClient(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status: newStatus, reason },
    });
    return res?.order || res;
  },

  /**
   * Track a specific order by ID
   * GET /api/orders/:id/track
   */
  async trackOrder(orderId) {
    if (!orderId) return null;
    try {
      const res = await apiClient(`/orders/${orderId}/track`);
      return res?.tracking || res?.order || res || null;
    } catch (err) {
      console.warn(`[orderService] Failed to track order ${orderId}:`, err);
      throw err;
    }
  },

  /**
   * Validate a coupon code at checkout
   * POST /api/coupons/validate
   */
  async validateCoupon(code, subtotal = 0) {
    if (!code || !code.trim()) {
      throw new Error('Please enter a valid coupon promo code.');
    }

    const res = await apiClient('/coupons/validate', {
      method: 'POST',
      body: { code: code.trim(), subtotal },
    });
    return res;
  },
};
