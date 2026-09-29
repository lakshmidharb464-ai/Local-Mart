/**
 * Delivery API Service
 * Handles all API calls to /api/delivery/* endpoints.
 * All methods call the real backend — no mock data.
 */
import { apiClient } from './apiClient';

export const deliveryService = {
  /** GET /api/delivery/overview */
  async getOverview() {
    const res = await apiClient('/delivery/overview');
    return res || {};
  },

  /** PATCH /api/delivery/duty — toggle online/offline */
  async toggleDuty(isOnline) {
    const res = await apiClient('/delivery/duty', {
      method: 'PATCH',
      body: { isOnline },
    });
    return res;
  },

  /** GET /api/delivery/orders */
  async getOrders() {
    const res = await apiClient('/delivery/orders');
    return res?.orders || [];
  },

  /** POST /api/delivery/orders/:id/accept */
  async acceptOrder(orderId) {
    const res = await apiClient(`/delivery/orders/${orderId}/accept`, {
      method: 'POST',
    });
    return res;
  },

  /** PATCH /api/delivery/orders/:id/status */
  async updateOrderStatus(orderId, status, note = '') {
    const res = await apiClient(`/delivery/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status, note },
    });
    return res;
  },

  /** POST /api/delivery/location */
  async sendLocation(lat, lng) {
    const res = await apiClient('/delivery/location', {
      method: 'POST',
      body: { lat, lng },
    });
    return res;
  },

  /** GET /api/delivery/hubs */
  async getHubs() {
    const res = await apiClient('/delivery/hubs');
    return res?.hubs || [];
  },

  /** GET /api/delivery/shifts */
  async getShifts() {
    const res = await apiClient('/delivery/shifts');
    return res?.shifts || [];
  },

  /** POST /api/delivery/shifts */
  async bookShift(shiftData) {
    const res = await apiClient('/delivery/shifts', {
      method: 'POST',
      body: shiftData,
    });
    return res;
  },

  /** GET /api/delivery/earnings */
  async getEarnings() {
    const res = await apiClient('/delivery/earnings');
    return res?.earnings || res || {};
  },

  /** GET /api/delivery/profile */
  async getProfile() {
    const res = await apiClient('/delivery/profile');
    return res?.profile || res || null;
  },

  /** PUT /api/delivery/profile */
  async updateProfile(profileData) {
    const res = await apiClient('/delivery/profile', {
      method: 'PUT',
      body: profileData,
    });
    return res;
  },
};

export default deliveryService;
