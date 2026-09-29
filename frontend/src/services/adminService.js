/**
 * Admin API Service
 * Handles all API calls to /api/admin/* endpoints.
 * All methods call the real backend — no mock data.
 */
import { apiClient } from './apiClient';

export const adminService = {
  /** GET /api/admin/metrics */
  async getMetrics() {
    const res = await apiClient('/admin/metrics');
    return res?.metrics || {};
  },

  /** GET /api/admin/farmers */
  async getFarmers() {
    const res = await apiClient('/admin/farmers');
    return res?.farmers || [];
  },

  /** PATCH /api/admin/farmers/:id/verify */
  async verifyFarmer(id, status) {
    const res = await apiClient(`/admin/farmers/${id}/verify`, {
      method: 'PATCH',
      body: { status },
    });
    return res;
  },

  /** GET /api/admin/products */
  async getProducts() {
    const res = await apiClient('/admin/products');
    return res?.products || [];
  },

  /** PATCH /api/admin/products/:id/moderate */
  async moderateProduct(id, status, remark = '') {
    const res = await apiClient(`/admin/products/${id}/moderate`, {
      method: 'PATCH',
      body: { status, remark },
    });
    return res;
  },

  /** GET /api/admin/orders */
  async getOrders() {
    const res = await apiClient('/admin/orders');
    return res?.orders || [];
  },

  /** PATCH /api/admin/orders/:id/dispatch */
  async overrideDispatch(id, riderId) {
    const res = await apiClient(`/admin/orders/${id}/dispatch`, {
      method: 'PATCH',
      body: { riderId },
    });
    return res;
  },

  /** GET /api/admin/customers */
  async getCustomers() {
    const res = await apiClient('/admin/customers');
    return res?.customers || [];
  },

  /** PATCH /api/admin/customers/:id/status */
  async setCustomerStatus(id, status) {
    const res = await apiClient(`/admin/customers/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    return res;
  },

  /** GET /api/admin/delivery-partners */
  async getDeliveryFleet() {
    const res = await apiClient('/admin/delivery-partners');
    return res?.riders || res?.deliveryPartners || [];
  },

  /** GET /api/admin/reports */
  async getReports() {
    const res = await apiClient('/admin/reports');
    return res?.reports || res || {};
  },

  /** GET /api/admin/settings */
  async getSettings() {
    const res = await apiClient('/admin/settings');
    return res?.settings || {};
  },

  /** PUT /api/admin/settings */
  async updateSettings(settings) {
    const res = await apiClient('/admin/settings', {
      method: 'PUT',
      body: settings,
    });
    return res;
  },

  /** GET /api/admin/kyc-queue */
  async getKycQueue() {
    const res = await apiClient('/admin/kyc-queue');
    return res?.queue || [];
  },

  /** PATCH /api/admin/kyc-queue/:id/decision */
  async decideKyc(id, decision, remark = '') {
    const res = await apiClient(`/admin/kyc-queue/${id}/decision`, {
      method: 'PATCH',
      body: { decision, remark },
    });
    return res;
  },

  /** GET /api/admin/audit-logs */
  async getAuditLogs() {
    const res = await apiClient('/admin/audit-logs');
    return res?.logs || [];
  },

  /** GET /api/categories */
  async getCategories() {
    const res = await apiClient('/categories');
    return res?.categories || [];
  },
};

export default adminService;
