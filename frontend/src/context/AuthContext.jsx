import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ToastContainer } from '../components/ui/Toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer' | 'Farmer' | 'Delivery' | 'Admin'
  const [isPrdOpen, setIsPrdOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [currency, setCurrencyState] = useState(() => localStorage.getItem('localfarm_currency') || '₹ (INR)');
  const currencySymbol = currency.startsWith('$') ? '$' : '₹';

  // Validate session on app initialization
  useEffect(() => {
    if (authService.getToken()) {
      authService.getMe().then((freshUser) => {
        if (freshUser) {
          setUser(freshUser);
        } else {
          setUser(null);
        }
      });
    }
  }, []);

  const setCurrency = (newCurrency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('localfarm_currency', newCurrency);
  };

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const login = async (email, password, role = 'Customer') => {
    try {
      const loggedUser = await authService.login(email, password, role);
      setUser(loggedUser);
      setIsAuthModalOpen(false);
      showToast('Welcome back!', `Logged in successfully as ${role}`);
      return loggedUser;
    } catch (e) {
      showToast('Login Failed', e.message || 'Unable to sign in. Please try again.', 'error');
      throw e;
    }
  };

  const signup = async (name, email, password, role = 'Customer') => {
    try {
      const newUser = await authService.register(name, email, password, role);
      setUser(newUser);
      setIsAuthModalOpen(false);
      showToast('Account Created!', `Welcome to Local Farm Direct as a ${role}`);
      return newUser;
    } catch (e) {
      showToast('Signup Failed', e.message || 'Unable to create account.', 'error');
      throw e;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    showToast('Logged Out', 'You have been logged out safely.');
    navigate('/');
  };

  const openAuthModal = (tab = 'signin', role = 'Customer') => {
    setAuthInitialTab(tab);
    setSelectedRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAuthModalOpen,
      authInitialTab,
      selectedRole,
      setSelectedRole,
      isPrdOpen,
      setIsPrdOpen,
      toast,
      showToast,
      login,
      signup,
      logout,
      openAuthModal,
      closeAuthModal,
      currency,
      currencySymbol,
      setCurrency
    }}>
      {children}
      {/* Global Toast Notification */}
      <ToastContainer toast={toast} onDismiss={() => setToast(null)} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
