import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SlidingAuthContainer } from './SlidingAuthContainer';
import { X } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authInitialTab } = useAuth();

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 font-display animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-farmGreen-950/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl my-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute -top-12 right-0 sm:right-2 p-2.5 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md transition-all shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          title="Close Authentication Dialog"
          aria-label="Close Authentication Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <SlidingAuthContainer 
          initialTab={authInitialTab} 
          onClose={closeAuthModal} 
        />
      </div>
    </div>
  );
};

export default AuthModal;

