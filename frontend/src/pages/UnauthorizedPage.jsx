import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, LogIn, Home, ShoppingBag, ArrowRight, UserCheck, Key } from 'lucide-react';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 font-display animate-fadeIn">
      <div className="max-w-3xl w-full bg-gradient-to-b from-[#1a070b] via-[#280d12] to-[#1a070b] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-rose-500/20 relative overflow-hidden text-center space-y-8">
        
        {/* Background Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Security Shield Icon Emblem */}
        <div className="relative z-10 inline-flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-400/40 flex items-center justify-center shadow-xl animate-pulse">
            <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-rose-300" />
          </div>
          
          <span className="mt-4 px-4 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-widest border border-rose-400/30 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>403 Access Restricted • Security Gate</span>
          </span>
        </div>

        {/* Main Title & Context Info */}
        <div className="space-y-3 max-w-xl mx-auto relative z-10">
          <h1 className="font-black text-2xl sm:text-4xl text-white tracking-tight leading-snug">
            Restricted Portal Access 🔒
          </h1>
          <p className="text-sm sm:text-base text-rose-100/80 font-bold leading-relaxed">
            You do not have permission to view this section. This area is reserved for authorized agricultural producers, riders, or platform administrators.
          </p>
        </div>

        {/* Current Identity Audit Pill */}
        <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-md mx-auto relative z-10 flex items-center justify-between text-xs font-extrabold">
          <div className="flex items-center gap-2 text-left">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-gray-400 text-[10px] uppercase tracking-wider">Current Account Identity</div>
              <div className="text-white font-black">{isAuthenticated ? user?.name : 'Guest User (Unauthenticated)'}</div>
            </div>
          </div>
          
          <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-full font-mono text-[10px]">
            {isAuthenticated ? user?.role : 'Guest 🔴'}
          </span>
        </div>

        {/* Action Navigation Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 relative z-10">
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('signin')}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all cursor-pointer shadow-lg flex items-center gap-2 border border-rose-400/30 hover:scale-105 active:scale-95"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>Sign In to Account 🔑</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow-lg flex items-center gap-2 border border-emerald-400/30 hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4 text-amber-300" />
              <span>Go to My Dashboard 🚀</span>
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-rose-200 text-xs font-black transition-all cursor-pointer border border-white/15 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-rose-300" />
            <span>Return to Direct Marketplace 🥬</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default UnauthorizedPage;
