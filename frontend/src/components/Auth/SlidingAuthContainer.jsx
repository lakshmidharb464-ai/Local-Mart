import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  Shield, 
  Tractor, 
  Truck, 
  UserCheck,
  KeyRound,
  Sparkles,
  Send,
  ShieldCheck,
  Clock,
  RotateCcw
} from 'lucide-react';

export const SlidingAuthContainer = ({ initialTab = 'signin', onClose }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(initialTab === 'signup');
  const { login, signup, selectedRole, setSelectedRole, showToast } = useAuth();

  // Form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2-Step Password Recovery States
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Pass, 3 = Success
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    setIsActive(initialTab === 'signup');
  }, [initialTab]);

  // Resend OTP Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (isForgotPass && forgotStep === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isForgotPass, forgotStep, resendTimer]);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const navigateToRoleDashboard = (role) => {
    const roleRoutes = {
      Customer: '/customer',
      Farmer: '/farmer',
      Delivery: '/delivery',
      Admin: '/admin'
    };
    navigate(roleRoutes[role] || '/dashboard');
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const email = signInEmail.trim();
    if (!email) {
      if (showToast) showToast('Missing Email', 'Please enter your email address.', 'error');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      if (showToast) showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    if (!signInPassword || signInPassword.length < 6) {
      if (showToast) showToast('Invalid Password', 'Password must be at least 6 characters.', 'error');
      return;
    }
    try {
      await login(email, signInPassword, selectedRole);
      if (onClose) onClose();
      navigateToRoleDashboard(selectedRole);
    } catch (err) {
      // error handled in context
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const name = signUpName.trim();
    const email = signUpEmail.trim();
    if (!name || name.length < 2) {
      if (showToast) showToast('Invalid Name', 'Please enter your full name (at least 2 characters).', 'error');
      return;
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      if (showToast) showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      if (showToast) showToast('Weak Password', 'Password must be at least 6 characters long.', 'error');
      return;
    }
    try {
      await signup(name, email, signUpPassword, selectedRole);
      if (onClose) onClose();
      navigateToRoleDashboard(selectedRole);
    } catch (err) {
      // error handled in context
    }
  };

  // Step 1: Send OTP to Email
  const handleSendRecoveryOtp = (e) => {
    e.preventDefault();
    const email = recoveryEmail.trim();
    if (!email || !EMAIL_REGEX.test(email)) {
      if (showToast) showToast('Invalid Email', 'Please enter a valid email address for recovery.', 'error');
      return;
    }
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setForgotStep(2);
      setResendTimer(45);
      setOtpDigits(['4', '9', '2', '0', '8', '1']); // Demo auto-fill
      if (showToast) {
        showToast('OTP Code Sent 📩', `6-digit reset code sent to ${recoveryEmail}. Demo OTP: 492081`);
      }
    }, 600);
  };

  // OTP Digit Change Handler
  const handleOtpChange = (index, value) => {
    const digit = value.slice(-1);
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);

    // Auto-advance
    if (digit && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleVerifyOtpAndReset = (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      if (showToast) showToast('OTP Incomplete', 'Please enter all 6 digits of the OTP.', 'error');
      return;
    }
    if (!newResetPassword || newResetPassword !== confirmResetPassword) {
      if (showToast) showToast('Password Error', 'Passwords do not match.', 'error');
      return;
    }

    setForgotStep(3);
    if (showToast) {
      showToast('Password Reset Complete! 🎉', 'Your password has been updated. Please sign in.');
    }
  };

  const resetForgotFlow = () => {
    setIsForgotPass(false);
    setForgotStep(1);
    setRecoveryEmail('');
    setOtpDigits(['', '', '', '', '', '']);
    setNewResetPassword('');
    setConfirmResetPassword('');
  };

  const roles = [
    { key: 'Customer', label: 'Customer', icon: UserCheck, desc: 'Buy fresh farm produce' },
    { key: 'Farmer', label: 'Farmer', icon: Tractor, desc: 'Sell crop harvest' },
    { key: 'Delivery', label: 'Delivery', icon: Truck, desc: 'Deliver local orders' },
    { key: 'Admin', label: 'Admin', icon: Shield, desc: 'Platform management' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      {/* Role Selection Bar */}
      <div 
        className="mb-5 w-full max-w-md bg-white p-1.5 rounded-full border border-emerald-900/15 shadow-md flex items-center justify-between"
        role="tablist"
        aria-label="Select Platform Role"
      >
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.key;
          return (
            <button
              key={r.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedRole(r.key)}
              className={`flex-1 py-2 px-2.5 rounded-full text-xs font-bold font-display flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-gradient-to-r from-emerald-700 to-farmGreen-800 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-farmGreen-950 hover:bg-emerald-50/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Tab Toggle (Visible only on mobile screens < 640px) */}
      <div className="sm:hidden w-full max-w-md flex rounded-xl bg-emerald-900/10 p-1 mb-4">
        <button
          type="button"
          onClick={() => { setIsActive(false); resetForgotFlow(); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            !isActive ? 'bg-white text-farmGreen-950 shadow-xs' : 'text-gray-600'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsActive(true); resetForgotFlow(); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            isActive ? 'bg-white text-farmGreen-950 shadow-xs' : 'text-gray-600'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Main Sliding Box Container */}
      <div className={`auth-sliding-box ${isActive ? 'active' : ''}`}>
        
        {/* Sign In Form Panel OR Password Recovery Flow */}
        <div className="auth-form-panel auth-sign-in">
          
          {/* A. Normal Sign In Form */}
          {!isForgotPass && (
            <form onSubmit={handleSignInSubmit} className="flex flex-col justify-center items-center h-full px-6 sm:px-12 bg-white animate-fadeIn">
              <h2 id="auth-modal-title" className="font-display font-black text-2xl sm:text-3xl text-farmGreen-950 mb-1 text-center">
                Sign In as {selectedRole}
              </h2>
              <p className="text-xs text-gray-500 mb-6 text-center">Enter your account credentials to access your portal</p>

              <div className="w-full space-y-3.5">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAF8] border border-emerald-900/15 rounded-xl text-xs text-farmGreen-950 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 bg-[#F8FAF8] border border-emerald-900/15 rounded-xl text-xs text-farmGreen-950 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-farmGreen-900 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forget Password Trigger */}
              <button 
                type="button"
                onClick={() => {
                  setIsForgotPass(true);
                  setForgotStep(1);
                  setRecoveryEmail(signInEmail);
                }} 
                className="text-xs text-emerald-700 font-bold hover:underline my-3.5 cursor-pointer flex items-center gap-1.5 self-end"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>Forgot password?</span>
              </button>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-700 to-farmGreen-800 hover:from-emerald-600 hover:to-farmGreen-700 text-white rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
              >
                Sign In to {selectedRole}
              </button>
            </form>
          )}

          {/* B. Step 1: Account Recovery */}
          {isForgotPass && forgotStep === 1 && (
            <form onSubmit={handleSendRecoveryOtp} className="flex flex-col justify-center items-center h-full px-6 sm:px-12 bg-white animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200 shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>

              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-farmGreen-950 mb-1 text-center">
                Account Recovery
              </h2>
              <p className="text-xs text-gray-500 text-center mb-5 max-w-xs leading-relaxed">
                Enter your registered email address to receive a 6-digit verification code.
              </p>

              <div className="w-full space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAF8] border-2 border-emerald-300 rounded-xl text-xs font-semibold text-farmGreen-950 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3.5 mt-5 bg-gradient-to-r from-emerald-700 to-farmGreen-800 hover:from-emerald-600 hover:to-farmGreen-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSendingOtp ? (
                  <span>Sending OTP Code...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForgotFlow}
                className="mt-4 text-xs text-gray-500 hover:text-farmGreen-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}

          {/* C. Step 2: OTP Verification & Reset */}
          {isForgotPass && forgotStep === 2 && (
            <form onSubmit={handleVerifyOtpAndReset} className="flex flex-col justify-center items-center h-full px-6 sm:px-12 bg-white animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 border border-amber-200 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h2 className="font-display font-extrabold text-lg sm:text-xl text-farmGreen-950 mb-1 text-center">
                Verify OTP & Set Password
              </h2>
              <p className="text-[11px] text-gray-500 text-center mb-3">
                OTP sent to <span className="font-bold text-farmGreen-900">{recoveryEmail}</span>
              </p>

              {/* Demo OTP Banner */}
              <div className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center mb-3">
                <span className="text-[11px] font-bold text-emerald-800">
                  Demo Code: <span className="font-mono text-emerald-950 text-xs font-black tracking-wider">492081</span>
                </span>
              </div>

              {/* 6-Digit OTP Boxes */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-9 h-10 text-center font-mono font-black text-base bg-[#F8FAF8] border-2 border-emerald-400 focus:border-emerald-700 focus:bg-white rounded-xl text-farmGreen-950 outline-none shadow-xs"
                  />
                ))}
              </div>

              {/* Password Inputs */}
              <div className="w-full space-y-2">
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter New Password"
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-8 py-2 bg-[#F8FAF8] border border-emerald-900/15 rounded-xl text-xs font-semibold text-farmGreen-950 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmResetPassword}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-8 py-2 bg-[#F8FAF8] border border-emerald-900/15 rounded-xl text-xs font-semibold text-farmGreen-950 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Resend Timer */}
              <div className="flex items-center justify-between w-full text-[11px] text-gray-500 mt-2 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Resend: {resendTimer > 0 ? `${resendTimer}s` : 'Ready'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setResendTimer(45);
                    setOtpDigits(['4', '9', '2', '0', '8', '1']);
                    if (showToast) showToast('OTP Resent', 'New OTP 492081 sent to your email.');
                  }}
                  disabled={resendTimer > 0}
                  className="font-bold text-emerald-700 hover:underline disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-farmGreen-800 hover:from-emerald-600 hover:to-farmGreen-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Verify & Reset Password</span>
              </button>

              <button
                type="button"
                onClick={() => setForgotStep(1)}
                className="mt-3 text-[11px] text-gray-500 hover:text-farmGreen-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change Email</span>
              </button>
            </form>
          )}

          {/* D. Step 3: Success Confirmation */}
          {isForgotPass && forgotStep === 3 && (
            <div className="flex flex-col justify-center items-center h-full px-6 sm:px-12 bg-white text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h2 className="font-display font-extrabold text-2xl text-farmGreen-950 mb-2">
                Password Updated! ✨
              </h2>
              <p className="text-xs text-gray-600 mb-6 max-w-xs leading-relaxed">
                Your credentials for <span className="font-bold text-farmGreen-950">{recoveryEmail}</span> have been reset. You can now log in.
              </p>

              <button
                type="button"
                onClick={resetForgotFlow}
                className="w-full py-3 bg-gradient-to-r from-emerald-700 to-farmGreen-800 hover:from-emerald-600 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          )}

        </div>

        {/* Sign Up Form Panel */}
        <div className="auth-form-panel auth-sign-up">
          <form onSubmit={handleSignUpSubmit} className="flex flex-col justify-center items-center h-full px-6 sm:px-12 bg-white">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-farmGreen-950 mb-1 text-center">
              Create {selectedRole} Account
            </h2>
            <p className="text-xs text-gray-500 mb-5 text-center">Join our direct farm network in seconds</p>

            <div className="w-full space-y-3">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-emerald-900/15 rounded-xl text-xs text-farmGreen-950 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-emerald-900/15 rounded-xl text-xs text-farmGreen-950 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Secure Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F8FAF8] border border-emerald-900/15 rounded-xl text-xs text-farmGreen-950 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-farmGreen-900 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-5 bg-gradient-to-r from-emerald-700 to-farmGreen-800 hover:from-emerald-600 hover:to-farmGreen-700 text-white rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
            >
              Complete Registration
            </button>
          </form>
        </div>

        {/* Sliding Overlay Container */}
        <div className="auth-toggle-container">
          <div className="auth-toggle">
            
            {/* Overlay Panel Left (Shown when active/Sign Up) */}
            <div className="auth-toggle-panel auth-toggle-left">
              <h2 className="font-display font-extrabold text-3xl text-white mb-2">Welcome Back!</h2>
              <p className="text-xs text-emerald-100/80 leading-relaxed mb-6">
                To stay connected with local farmers and track your fresh harvests, please sign in.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsActive(false);
                  resetForgotFlow();
                }}
                className="px-8 py-2.5 rounded-xl border border-white text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-farmGreen-900 transition-all cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            </div>

            {/* Overlay Panel Right (Shown when inactive/Sign In) */}
            <div className="auth-toggle-panel auth-toggle-right">
              <h2 className="font-display font-extrabold text-3xl text-white mb-2">Hello, Neighbor! 🌾</h2>
              <p className="text-xs text-emerald-100/80 leading-relaxed mb-6">
                Register with your details to begin buying directly from local farms or listing your harvest today.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsActive(true);
                  resetForgotFlow();
                }}
                className="px-8 py-2.5 rounded-xl border border-white text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-farmGreen-900 transition-all cursor-pointer shadow-sm"
              >
                Create Account
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default SlidingAuthContainer;

