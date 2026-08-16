import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SlidingAuthContainer } from './SlidingAuthContainer';
import { X } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authInitialTab } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-farmGreen-900/70 backdrop-blur-md transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl bg-transparent">
        <button
          onClick={closeAuthModal}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all"
          title="Close Modal"
        >
          <X className="w-6 h-6" />
        </button>

        <SlidingAuthContainer 
          initialTab={authInitialTab} 
          onClose={closeAuthModal} 
        />
      </div>
    </div>
  );
};
