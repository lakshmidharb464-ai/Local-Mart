import { apiClient, USE_MOCK } from './apiClient';

const TOKEN_KEY = 'localfarm_token';
const USER_KEY = 'localfarm_user';

export const authService = {
  /**
   * Log in user
   */
  async login(email, password, role = 'Customer') {
    if (!USE_MOCK) {
      const response = await apiClient('/auth/login', {
        method: 'POST',
        body: { email, password, role },
      });
      if (response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
      }
      if (response.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      return response.user;
    }

    // Simulated async mock login
    await new Promise((r) => setTimeout(r, 200));
    const mockUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0] || 'User',
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
    localStorage.setItem(TOKEN_KEY, 'mock_jwt_token_' + Date.now());
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  /**
   * Register new user
   */
  async register(name, email, password, role = 'Customer') {
    if (!USE_MOCK) {
      const response = await apiClient('/auth/register', {
        method: 'POST',
        body: { name, email, password, role },
      });
      if (response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
      }
      if (response.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      return response.user;
    }

    await new Promise((r) => setTimeout(r, 200));
    const mockUser = {
      id: 'usr_' + Date.now(),
      name: name || 'New User',
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    localStorage.setItem(TOKEN_KEY, 'mock_jwt_token_' + Date.now());
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  /**
   * Log out user
   */
  async logout() {
    if (!USE_MOCK) {
      await apiClient('/auth/logout', { method: 'POST' }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Retrieve current authenticated user from storage
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Validate token and fetch latest profile from /api/auth/me
   */
  async getMe() {
    const token = this.getToken();
    if (!token) return null;
    if (USE_MOCK) return this.getCurrentUser();

    try {
      const res = await apiClient('/auth/me');
      if (res?.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return res.user;
      }
      return null;
    } catch {
      // Token is invalid/expired - clear stale auth
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
};
