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

  /** POST /api/admin/farmers */
  async createFarmer(farmerData) {
    const res = await apiClient('/admin/farmers', {
      method: 'POST',
      body: farmerData,
    });
    return res;
  },

  /** PUT /api/admin/farmers/:id */
  async updateFarmer(id, farmerData) {
    const res = await apiClient(`/admin/farmers/${id}`, {
      method: 'PUT',
      body: farmerData,
    });
    return res;
  },

  /** PATCH /api/admin/farmers/:id/verify */
  async verifyFarmer(id, status, payload = {}) {
    const body = typeof status === 'object' ? status : { status, ...payload };
    const res = await apiClient(`/admin/farmers/${id}/verify`, {
      method: 'PATCH',
      body,
    });
    return res;
  },

  /** PATCH /api/admin/farmers/:id/verify (Set Active/Inactive) */
  async setFarmerStatus(id, accountStatus) {
    const res = await apiClient(`/admin/farmers/${id}/verify`, {
      method: 'PATCH',
      body: { accountStatus, isActive: accountStatus === 'Active' },
    });
    return res;
  },

  /** DELETE /api/admin/farmers/:id */
  async deleteFarmer(id) {
    const res = await apiClient(`/admin/farmers/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  /** GET /api/admin/products */
  async getProducts() {
    const res = await apiClient('/admin/products');
    return res?.products || [];
  },

  /** POST /api/admin/products */
  async createProduct(productData) {
    const res = await apiClient('/admin/products', {
      method: 'POST',
      body: productData,
    });
    return res;
  },

  /** PUT /api/admin/products/:id */
  async updateProduct(id, productData) {
    const res = await apiClient(`/admin/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
    return res;
  },

  /** PATCH /api/admin/products/:id/moderate */
  async moderateProduct(id, status, remark = '') {
    const res = await apiClient(`/admin/products/${id}/moderate`, {
      method: 'PATCH',
      body: { status, remark },
    });
    return res;
  },

  /** DELETE /api/admin/products/:id */
  async deleteProduct(id) {
    const res = await apiClient(`/admin/products/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  /** GET /api/admin/orders */
  async getOrders() {
    const res = await apiClient('/admin/orders');
    return res?.orders || [];
  },

  /** PATCH /api/admin/orders/:id/status */
  async updateOrderStatus(id, status) {
    const res = await apiClient(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    return res;
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

  /** POST /api/admin/customers */
  async createCustomer(customerData) {
    const res = await apiClient('/admin/customers', {
      method: 'POST',
      body: customerData,
    });
    return res;
  },

  /** PUT /api/admin/customers/:id */
  async updateCustomer(id, customerData) {
    const res = await apiClient(`/admin/customers/${id}`, {
      method: 'PUT',
      body: customerData,
    });
    return res;
  },

  /** PATCH /api/admin/customers/:id/status */
  async setCustomerStatus(id, status) {
    const res = await apiClient(`/admin/customers/${id}/status`, {
      method: 'PATCH',
      body: { status, isActive: status === 'Active' || status === true },
    });
    return res;
  },

  /** DELETE /api/admin/customers/:id */
  async deleteCustomer(id) {
    const res = await apiClient(`/admin/customers/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  /** GET /api/admin/delivery-partners */
  async getDeliveryFleet() {
    const res = await apiClient('/admin/delivery-partners');
    return res?.riders || res?.deliveryPartners || [];
  },

  /** POST /api/admin/delivery-partners */
  async createDeliveryPartner(partnerData) {
    const res = await apiClient('/admin/delivery-partners', {
      method: 'POST',
      body: partnerData,
    });
    return res;
  },

  /** PUT /api/admin/delivery-partners/:id */
  async updateDeliveryPartner(id, partnerData) {
    const res = await apiClient(`/admin/delivery-partners/${id}`, {
      method: 'PUT',
      body: partnerData,
    });
    return res;
  },

  /** PATCH /api/admin/delivery-partners/:id/status */
  async setDeliveryPartnerStatus(id, status) {
    const res = await apiClient(`/admin/delivery-partners/${id}/status`, {
      method: 'PATCH',
      body: { status, approvalStatus: status, isActive: status === 'Approved' || status === 'Active' },
    });
    return res;
  },

  /** DELETE /api/admin/delivery-partners/:id */
  async deleteDeliveryPartner(id) {
    const res = await apiClient(`/admin/delivery-partners/${id}`, {
      method: 'DELETE',
    });
    return res;
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
