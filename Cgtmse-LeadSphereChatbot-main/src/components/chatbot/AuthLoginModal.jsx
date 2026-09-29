import React, { useState, useEffect } from 'react';
import { Lock, Mail, Key, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, Loader2, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AuthLoginModal({
  isOpen,
  onClose,
  onSuccess,
  pendingQuery = ''
}) {
  const { login, authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setIsSuccess(false);
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(res.user);
        }
      }, 700);
    } else {
      setErrorMessage(res.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    /* FIXED to viewport with z-[100] - Never scrolls off screen */
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      
      {/* Click outside backdrop on desktop */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Modal / Bottom Sheet Card */}
      <div className="bg-white w-full sm:max-w-[360px] rounded-t-3xl sm:rounded-2xl max-h-[90dvh] flex flex-col shadow-2xl border-t sm:border border-slate-200 overflow-hidden text-xs animate-slide-up sm:animate-scale-up">
        
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-3 sm:py-3.5 flex-shrink-0">
          
          {/* Subtle mobile sheet pull bar */}
          <div className="w-10 h-1 bg-white/40 rounded-full mx-auto mb-2 sm:hidden" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-md flex-shrink-0">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold leading-tight">Authentication Required</h3>
                <p className="text-[10px] text-white/80">CGTMSE AI Security Gate</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-md transition hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body with Safe Area Support */}
        <div className="p-4 sm:p-4.5 space-y-3 overflow-y-auto flex-1 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          
          {/* Query context card if user clicked/typed a query */}
          {pendingQuery && (
            <div className="p-2 sm:p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] text-slate-700">
              <span className="font-semibold text-blue-900 block mb-0.5">
                Pending question:
              </span>
              <p className="italic text-slate-600 line-clamp-2 leading-relaxed">
                "{pendingQuery}"
              </p>
              <span className="text-[10px] text-blue-600 mt-1 block">
                Sign in to receive the AI response automatically.
              </span>
            </div>
          )}

          {/* Success State */}
          {isSuccess ? (
            <div className="py-6 text-center space-y-2 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Authentication Successful!
              </p>
              <p className="text-[11px] text-slate-500">
                Access granted. Generating response now...
              </p>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 animate-fade-in text-[11px] leading-snug">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your authorized email"
                    className="w-full h-11 sm:h-9 pl-9 pr-3 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Key className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full h-11 sm:h-9 pl-9 pr-9 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-11 sm:h-9 mt-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-[0.99] text-xs sm:text-xs"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In & Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Note */}
              <p className="text-[10px] text-center text-slate-400 pt-0.5">
                Only verified LeadSphere / CGTMSE credentials have access.
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
