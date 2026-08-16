import React, { useState, useEffect } from 'react';
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

  const navigateToRoleDashboard = (role) => {
    const roleRoutes = {
      Customer: '/customer',
      Farmer: '/farmer',
      Delivery: '/delivery',
      Admin: '/admin'
    };
    navigate(roleRoutes[role] || '/dashboard');
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) return;
    login(signInEmail, signInPassword, selectedRole);
    if (onClose) onClose();
    navigateToRoleDashboard(selectedRole);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) return;
    signup(signUpName, signUpEmail, signUpPassword, selectedRole);
    if (onClose) onClose();
    navigateToRoleDashboard(selectedRole);
  };

  // Step 1: Send OTP to Email
  const handleSendRecoveryOtp = (e) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setForgotStep(2);
      setResendTimer(45);
      setOtpDigits(['4', '9', '2', '0', '8', '1']); // Auto-filled demo OTP
      if (showToast) {
        showToast('OTP Code Sent 📩', `6-digit reset code sent to ${recoveryEmail}. Demo OTP: 492081`);
      }
    }, 800);
  };

  // OTP Digit Change Handler
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Auto-advance to next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
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

    setForgotStep(3); // Show Step 3 Success Card
    if (showToast) {
      showToast('Password Reset Successful! 🎉', 'Your password has been updated. Please sign in.');
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
      <div className="mb-6 w-full max-w-md bg-white p-1.5 rounded-full border border-farmGreen-700/15 shadow-farm-sm flex items-center justify-between">
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setSelectedRole(r.key)}
              className={`flex-1 py-1.5 px-2 rounded-full text-xs font-bold font-display flex items-center justify-center gap-1 transition-all ${
                isSelected 
                  ? 'bg-farmGreen-700 text-white shadow-farm-sm' 
                  : 'text-farmMuted hover:text-farmGreen-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Sliding Box */}
      <div className={`auth-sliding-box ${isActive ? 'active' : ''}`}>
        
        {/* Sign In Form Panel OR Password Recovery Flow */}
        <div className="auth-form-panel auth-sign-in">
          
          {/* A. Normal Sign In Form */}
          {!isForgotPass && (
            <form onSubmit={handleSignInSubmit} className="flex flex-col justify-center items-center h-full px-8 sm:px-12 bg-white animate-fadeIn">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-farmGreen-900 mb-2">
                Sign In as {selectedRole}
              </h1>

              {/* Social Icons */}
              <div className="flex items-center gap-3 my-4">
                {['google-plus-g', 'facebook-f', 'github', 'linkedin-in'].map((iconName, idx) => (
                  <a 
                    key={idx} 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-farmMuted hover:border-farmGreen-500 hover:text-farmGreen-700 hover:bg-farmGreen-50 transition-all"
                  >
                    <i className={`fa-brands fa-${iconName}`}></i>
                  </a>
                ))}
              </div>

              <span className="text-xs text-farmMuted mb-4">or use your email & password</span>

              <div className="w-full space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-farmBg border border-farmGreen-700/15 rounded-xl text-xs text-farmText focus:outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-farmBg border border-farmGreen-700/15 rounded-xl text-xs text-farmText focus:outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-farmMuted hover:text-farmGreen-800 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Interactive "Forget Your Password?" Button */}
              <button 
                type="button"
                onClick={() => {
                  setIsForgotPass(true);
                  setForgotStep(1);
                  setRecoveryEmail(signInEmail);
                }} 
                className="text-xs text-farmGreen-700 font-semibold hover:underline my-3 cursor-pointer flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Forget Your Password?</span>
              </button>

              <button
                type="submit"
                className="w-full py-3 bg-farmGreen-700 hover:bg-farmGreen-800 text-white rounded-xl text-xs font-bold font-display tracking-wider uppercase transition-all shadow-farm-md cursor-pointer"
              >
                Sign In
              </button>
            </form>
          )}

          {/* B. Step 1 Card: Enter Email for Password Recovery */}
          {isForgotPass && forgotStep === 1 && (
            <form onSubmit={handleSendRecoveryOtp} className="flex flex-col justify-center items-center h-full px-8 sm:px-12 bg-white animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-100 shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>

              <h1 className="font-display font-extrabold text-2xl text-farmGreen-900 mb-1 text-center">
                Step 1: Account Recovery
              </h1>
              <p className="text-xs text-farmMuted text-center mb-5 max-w-xs leading-relaxed">
                Enter your registered email address to receive a 6-digit verification OTP code.
              </p>

              <div className="w-full space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmGreen-700" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-farmBg border-2 border-emerald-300 rounded-xl text-xs font-semibold text-farmGreen-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3 mt-5 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-xl text-xs font-bold font-display tracking-wider uppercase transition-all shadow-farm-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSendingOtp ? (
                  <span>Sending OTP Code...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send OTP Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForgotFlow}
                className="mt-4 text-xs text-farmMuted hover:text-farmGreen-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}

          {/* C. Step 2 Card: Enter OTP & Set New Password (Step 1 hidden completely) */}
          {isForgotPass && forgotStep === 2 && (
            <form onSubmit={handleVerifyOtpAndReset} className="flex flex-col justify-center items-center h-full px-8 sm:px-12 bg-white animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 border border-amber-200 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h1 className="font-display font-extrabold text-xl text-farmGreen-900 mb-1 text-center">
                Step 2: Enter OTP & New Password
              </h1>
              <p className="text-[11px] text-farmMuted text-center mb-3">
                OTP sent to <span className="font-bold text-farmGreen-900">{recoveryEmail}</span>
              </p>

              {/* Demo OTP Banner */}
              <div className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center mb-3">
                <span className="text-[11px] font-bold text-emerald-800">
                  Demo OTP Code: <span className="font-mono text-emerald-900 text-xs tracking-wider">492081</span>
                </span>
              </div>

              {/* 6-Digit OTP Boxes */}
              <div className="flex items-center gap-2 mb-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-9 h-10 text-center font-mono font-bold text-base bg-farmBg border-2 border-emerald-400 focus:border-emerald-700 focus:bg-white rounded-xl text-farmGreen-900 outline-none shadow-xs"
                  />
                ))}
              </div>

              {/* Passwords Inputs */}
              <div className="w-full space-y-2">
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter New Password"
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-8 py-2 bg-farmBg border border-farmGreen-700/20 rounded-xl text-xs font-semibold text-farmGreen-900 outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmResetPassword}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-8 py-2 bg-farmBg border border-farmGreen-700/20 rounded-xl text-xs font-semibold text-farmGreen-900 outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-farmMuted hover:text-farmGreen-800 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Resend Timer */}
              <div className="flex items-center justify-between w-full text-[11px] text-farmMuted mt-2 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Resend Code: {resendTimer > 0 ? `${resendTimer}s` : 'Ready'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setResendTimer(45);
                    setOtpDigits(['4', '9', '2', '0', '8', '1']);
                    if (showToast) showToast('OTP Resent', 'New OTP 492081 sent to your email.');
                  }}
                  disabled={resendTimer > 0}
                  className="font-bold text-farmGreen-700 hover:underline disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend OTP</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-farmGreen-700 to-farmGreen-800 hover:from-farmGreen-600 hover:to-farmGreen-700 text-white rounded-xl text-xs font-bold font-display tracking-wider uppercase transition-all shadow-farm-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Verify OTP & Reset Password</span>
              </button>

              <button
                type="button"
                onClick={() => setForgotStep(1)}
                className="mt-3 text-[11px] text-farmMuted hover:text-farmGreen-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change Email Address</span>
              </button>
            </form>
          )}

          {/* D. Step 3 Card: Password Reset Success */}
          {isForgotPass && forgotStep === 3 && (
            <div className="flex flex-col justify-center items-center h-full px-8 sm:px-12 bg-white text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h1 className="font-display font-extrabold text-2xl text-farmGreen-900 mb-2">
                Password Reset Complete! ✨
              </h1>
              <p className="text-xs text-farmMuted mb-6 max-w-xs leading-relaxed">
                Your password for <span className="font-bold text-farmGreen-900">{recoveryEmail}</span> has been updated successfully. You can now sign in with your new password.
              </p>

              <button
                type="button"
                onClick={resetForgotFlow}
                className="w-full py-3 bg-farmGreen-700 hover:bg-farmGreen-800 text-white rounded-xl text-xs font-bold font-display tracking-wider uppercase transition-all shadow-farm-md cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </div>

        {/* Sign Up Form Panel */}
        <div className="auth-form-panel auth-sign-up">
          <form onSubmit={handleSignUpSubmit} className="flex flex-col justify-center items-center h-full px-8 sm:px-12 bg-white">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-farmGreen-900 mb-2">
              Create {selectedRole} Account
            </h1>

            {/* Social Icons */}
            <div className="flex items-center gap-3 my-3">
              {['google-plus-g', 'facebook-f', 'github', 'linkedin-in'].map((iconName, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-farmMuted hover:border-farmGreen-500 hover:text-farmGreen-700 hover:bg-farmGreen-50 transition-all"
                >
                  <i className={`fa-brands fa-${iconName}`}></i>
                </a>
              ))}
            </div>

            <span className="text-xs text-farmMuted mb-3">or use your email for registration</span>

            <div className="w-full space-y-2.5">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-farmBg border border-farmGreen-700/15 rounded-xl text-xs text-farmText focus:outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-farmBg border border-farmGreen-700/15 rounded-xl text-xs text-farmText focus:outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmMuted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 bg-farmBg border border-farmGreen-700/15 rounded-xl text-xs text-farmText focus:outline-none focus:border-farmGreen-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-farmMuted hover:text-farmGreen-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-farmGreen-700 hover:bg-farmGreen-800 text-white rounded-xl text-xs font-bold font-display tracking-wider uppercase transition-all shadow-farm-md cursor-pointer"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sliding Overlay Container */}
        <div className="auth-toggle-container">
          <div className="auth-toggle">
            
            {/* Overlay Panel Left (Shown when active/Sign Up) */}
            <div className="auth-toggle-panel auth-toggle-left">
              <h1 className="font-display font-extrabold text-3xl text-white mb-2">Welcome Back!</h1>
              <p className="text-xs text-white/80 leading-relaxed mb-6">
                To stay connected with local farmers and track your fresh harvests, please sign in with your credentials.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsActive(false);
                  resetForgotFlow();
                }}
                className="px-8 py-2.5 rounded-xl border border-white text-white font-display font-semibold text-xs uppercase tracking-wider hover:bg-white hover:text-farmGreen-800 transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>

            {/* Overlay Panel Right (Shown when inactive/Sign In) */}
            <div className="auth-toggle-panel auth-toggle-right">
              <h1 className="font-display font-extrabold text-3xl text-white mb-2">Hello, Friend!</h1>
              <p className="text-xs text-white/80 leading-relaxed mb-6">
                Register with your personal details to begin buying directly from local farms or listing your harvest!
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsActive(true);
                  resetForgotFlow();
                }}
                className="px-8 py-2.5 rounded-xl border border-white text-white font-display font-semibold text-xs uppercase tracking-wider hover:bg-white hover:text-farmGreen-800 transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
