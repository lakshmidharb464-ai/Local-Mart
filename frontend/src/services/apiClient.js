const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Standardized HTTP Request Wrapper
 * @param {string} endpoint - e.g. '/products'
 * @param {object} options - fetch options (method, headers, body)
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const token = getCookie('localfarm_token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    credentials: 'include',
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !isFormData) {
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

export { API_BASE_URL };

