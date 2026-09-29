/**
 * Product API Service
 * All calls go to the real backend — no mock data.
 */
import { apiClient } from './apiClient';

export const productService = {
  /**
   * Fetch all produce items with optional filters
   * GET /api/products
   */
  async fetchProducts(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.category && filters.category !== 'all' && filters.category !== 'All') {
      queryParams.append('category', filters.category);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.organic) {
      queryParams.append('organic', 'true');
    }
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.sort)     queryParams.append('sort', filters.sort);
    if (filters.order)    queryParams.append('order', filters.order);
    if (filters.limit)    queryParams.append('limit', filters.limit);
    if (filters.page)     queryParams.append('page', filters.page);

    const queryStr = queryParams.toString();
    const res = await apiClient(`/products${queryStr ? `?${queryStr}` : ''}`);
    return res?.products || (Array.isArray(res) ? res : []);
  },

  /**
   * Fetch single product details by ID
   * GET /api/products/:id
   */
  async fetchProductById(id) {
    const res = await apiClient(`/products/${id}`);
    return res?.product || res || null;
  },

  /**
   * Create a new crop listing (Farmer action)
   * POST /api/farmer/products
   */
  async createProduct(productData) {
    return apiClient('/farmer/products', {
      method: 'POST',
      body: productData,
    });
  },

  /**
   * Update existing product or stock quantity
   * PATCH /api/farmer/products/:id
   */
  async updateProduct(id, changes) {
    return apiClient(`/farmer/products/${id}`, {
      method: 'PATCH',
      body: changes,
    });
  },

  /**
   * Delete a product listing
   * DELETE /api/farmer/products/:id
   */
  async deleteProduct(id) {
    return apiClient(`/farmer/products/${id}`, {
      method: 'DELETE',
    });
  },
};
