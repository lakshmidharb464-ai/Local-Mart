import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert, Lock, LogIn, Home, ArrowRight, UserCheck,
} from 'lucide-react';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-[88vh] flex items-center justify-center p-4 sm:p-8 font-display"
      style={{ background: 'linear-gradient(160deg, #110508 0%, #1c080e 50%, #120307 100%)' }}
    >
      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div 
          className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.10) 0%, transparent 70%)' }} 
        />
        <div 
          className="absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,167,69,0.09) 0%, transparent 70%)' }} 
        />
      </div>

      {/* ── Main card ── */}
      <div
        className={`relative max-w-2xl w-full rounded-3xl p-6 sm:p-12 text-center overflow-hidden
          border shadow-2xl
          transition-all duration-700 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{
          background: 'linear-gradient(145deg, rgba(80,10,20,0.88) 0%, rgba(20,5,9,0.97) 100%)',
          borderColor: 'rgba(244,63,94,0.22)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        }}
        role="main"
        aria-labelledby="ua-title"
      >
        {/* Gradient top border accent */}
        <div 
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.5), rgba(212,167,69,0.3), transparent)' }}
          aria-hidden="true" 
        />

        {/* ── Shield icon emblem ── */}
        <div className={`relative z-10 flex flex-col items-center gap-4 mb-6
          transition-all duration-700 delay-100 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          <div
            className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl shadow-lg"
            style={{
              background: 'rgba(244,63,94,0.12)',
              border: '1px solid rgba(244,63,94,0.3)',
              boxShadow: '0 0 32px rgba(244,63,94,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <ShieldAlert
              className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400"
              aria-hidden="true"
            />
          </div>

          {/* 403 pill */}
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-rose-200 shadow-xs"
            style={{
              background: 'rgba(244,63,94,0.15)',
              border: '1px solid rgba(244,63,94,0.32)',
            }}
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
            403 · Access Restricted
          </span>
        </div>

        {/* ── Heading & description ── */}
        <div className={`relative z-10 space-y-3 max-w-lg mx-auto mb-8
          transition-all duration-700 delay-150 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1
            id="ua-title"
            className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug"
          >
            Restricted Portal Access 🔒
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-rose-200/80 font-medium">
            You don't have permission to view this section. This area is reserved for
            authorized agricultural producers, riders, or platform administrators.
          </p>
        </div>

        {/* ── Identity audit card ── */}
        <div className={`relative z-10 max-w-md mx-auto mb-8
          transition-all duration-700 delay-200 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2.5 text-left">
              {isAuthenticated
                ? <UserCheck className="w-4 h-4 shrink-0 text-emerald-400" aria-hidden="true" />
                : <Lock className="w-4 h-4 shrink-0 text-rose-400" aria-hidden="true" />}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                  Current Session
                </div>
                <div className="text-sm font-bold text-white">
                  {isAuthenticated ? (user?.name || 'Authenticated User') : 'Guest (Unauthenticated)'}
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              >
                {user?.role || 'User'}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300"
              >
                Guest
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </span>
            )}
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className={`relative z-10 flex flex-wrap items-center justify-center gap-3
          transition-all duration-700 delay-300 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {!isAuthenticated ? (
            <button
              id="ua-signin-btn"
              onClick={() => openAuthModal('signin')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg bg-gradient-to-r from-rose-700 to-rose-900 border border-rose-500/40"
            >
              <LogIn className="w-4 h-4 text-amber-300" aria-hidden="true" />
              Sign In to Account
            </button>
          ) : (
            <button
              id="ua-dashboard-btn"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg bg-gradient-to-r from-emerald-600 to-farmGreen-700 border border-emerald-400/35"
            >
              <Home className="w-4 h-4 text-amber-300" aria-hidden="true" />
              Go to My Dashboard
            </button>
          )}

          <button
            id="ua-go-home-btn"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-rose-200 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10"
          >
            Return to Marketplace
            <ArrowRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          </button>
        </div>

        {/* Gradient bottom border accent */}
        <div 
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,167,69,0.2), transparent)' }}
          aria-hidden="true" 
        />
      </div>
    </div>
  );
};

export default UnauthorizedPage;


