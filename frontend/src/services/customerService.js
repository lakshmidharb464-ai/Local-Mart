/**
 * Customer API Service — 100% Real Database Operations
 * Connects to live MySQL database via LocalFarm REST API.
 */
import { apiClient } from './apiClient';

export const customerService = {
  /**
   * Fetch customer loyalty tier & metrics
   * GET /api/customers/tier
   */
  async getLoyaltyTier() {
    return await apiClient('/customers/tier');
  },

  /**
   * Fetch saved customer addresses
   * GET /api/customers/addresses
   */
  async getAddresses() {
    const res = await apiClient('/customers/addresses');
    return res?.addresses || [];
  },

  /**
   * Add a new customer address
   * POST /api/customers/addresses
   */
  async addAddress(addressData) {
    return await apiClient('/customers/addresses', {
      method: 'POST',
      body: addressData,
    });
  },

  /**
   * Update an existing address
   * PUT /api/customers/addresses/:id
   */
  async updateAddress(addressId, addressData) {
    return await apiClient(`/customers/addresses/${addressId}`, {
      method: 'PUT',
      body: addressData,
    });
  },

  /**
   * Delete a saved address
   * DELETE /api/customers/addresses/:id
   */
  async deleteAddress(addressId) {
    return await apiClient(`/customers/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Set an address as default
   * PATCH /api/customers/addresses/:id/default
   */
  async setDefaultAddress(addressId) {
    return await apiClient(`/customers/addresses/${addressId}/default`, {
      method: 'PATCH',
    });
  },

  /**
   * Fetch active promo coupons directly from database
   * GET /api/coupons/active
   */
  async getActiveCoupons() {
    try {
      const res = await apiClient('/coupons/active');
      return res?.coupons || [];
    } catch (err) {
      console.warn('[customerService] Failed to load active coupons:', err);
      return [];
    }
  },

  /**
   * Validate a coupon code against minimum spend
   * POST /api/coupons/validate
   */
  async validateCoupon(code, subtotal = 0) {
    return await apiClient('/coupons/validate', {
      method: 'POST',
      body: { code, subtotal },
    });
  },

  /**
   * Update customer profile info
   * PUT /api/auth/profile
   */
  async updateProfile(profileData) {
    return await apiClient('/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
  },

  /**
   * Fetch customer subscriptions
   * GET /api/subscriptions
   */
  async getSubscriptions() {
    const res = await apiClient('/subscriptions');
    return res?.subscriptions || [];
  },
};

export default customerService;
