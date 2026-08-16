import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer' | 'Farmer' | 'Delivery' | 'Admin'
  const [isPrdOpen, setIsPrdOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const login = (email, password, role = 'Customer') => {
    const mockUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0] || 'User',
      email: email,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    setUser(mockUser);
    setIsAuthModalOpen(false);
    showToast('Welcome back!', `Logged in successfully as ${role}`);
  };

  const signup = (name, email, password, role = 'Customer') => {
    const mockUser = {
      id: 'usr_' + Date.now(),
      name: name || 'New User',
      email: email,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    setUser(mockUser);
    setIsAuthModalOpen(false);
    showToast('Account Created!', `Welcome to Local Farm Direct as a ${role}`);
  };

  const logout = () => {
    setUser(null);
    showToast('Logged Out', 'You have been logged out safely.');
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
      closeAuthModal
    }}>
      {children}
      {/* Global Toast Notification Component */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 transition-all transform animate-bounce">
          <div className={`px-5 py-4 rounded-xl shadow-farm-xl border flex items-center gap-3 bg-white ${
            toast.type === 'error' ? 'border-red-500 text-red-700' : 'border-farmGreen-500 text-farmGreen-900'
          }`}>
            <div className={`w-3 h-3 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-farmGreen-500'}`} />
            <div>
              <h4 className="font-display font-bold text-sm">{toast.title}</h4>
              <p className="text-xs text-farmMuted">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
