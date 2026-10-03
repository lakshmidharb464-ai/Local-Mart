import { apiClient } from './apiClient';

function getAuthCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)localfarm_token=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setAuthCookie(token) {
  if (typeof document !== 'undefined') {
    document.cookie = `localfarm_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  }
}

function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'localfarm_token=; path=/; max-age=0; SameSite=Lax';
  }
}

let inMemoryUser = null;

export const authService = {
  /**
   * Log in user
   */
  async login(email, password, role = 'Customer') {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: { email, password, role },
    });
    if (response.token) {
      setAuthCookie(response.token);
    }
    inMemoryUser = response.user || null;
    return response.user;
  },

  /**
   * Register new user
   */
  async register(name, email, password, role = 'Customer', adminSecret = '') {
    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: { name, email, password, role, ...(adminSecret ? { adminSecret } : {}) },
    });
    if (response.token) {
      setAuthCookie(response.token);
    }
    inMemoryUser = response.user || null;
    return response.user;
  },

  /**
   * Log out user
   */
  async logout() {
    await apiClient('/auth/logout', { method: 'POST' }).catch(() => {});
    clearAuthCookie();
    inMemoryUser = null;
  },

  /**
   * Retrieve current authenticated user from in-memory cache
   */
  getCurrentUser() {
    return inMemoryUser;
  },

  getToken() {
    return getAuthCookie();
  },

  /**
   * Validate token and fetch latest profile from /api/auth/me
   */
  async getMe() {
    const token = this.getToken();
    if (!token) {
      inMemoryUser = null;
      return null;
    }

    try {
      const res = await apiClient('/auth/me');
      if (res?.user) {
        inMemoryUser = res.user;
        return res.user;
      }
      inMemoryUser = null;
      return null;
    } catch {
      // Token is invalid/expired/not in DB - clear cookie
      clearAuthCookie();
      inMemoryUser = null;
      return null;
    }
  }
};

