/**
 * Base API Client for LocalFarm Direct
 * 
 * Configured for future backend integration.
 * Toggle VITE_USE_MOCK=false in your .env to immediately switch to real backend APIs!
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // Defaults to mock during frontend dev

/**
 * Standardized HTTP Request Wrapper
 * @param {string} endpoint - e.g. '/products'
 * @param {object} options - fetch options (method, headers, body)
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  // When real backend is enabled:
  if (!USE_MOCK) {
    const token = localStorage.getItem('localfarm_token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `API Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Handle 204 No Content
      if (response.status === 204) return null;

      return await response.json();
    } catch (err) {
      console.error(`[API Request Error] ${options.method || 'GET'} ${endpoint}:`, err);
      throw err;
    }
  }

  // Realistic simulated network delay (200ms) for mock development
  await new Promise((resolve) => setTimeout(resolve, 200));
  return null;
}

export { API_BASE_URL, USE_MOCK };
