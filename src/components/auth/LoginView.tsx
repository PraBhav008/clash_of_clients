import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight, Server, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

export const LoginView: React.FC = () => {
  const { login, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both administrator email and password.');
      sound.playClick();
      return;
    }

    setIsSubmitting(true);
    sound.playClick();

    const res = await login(email.trim(), password.trim(), rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      sound.playUpgrade();
    } else {
      sound.playClick();
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@citadel.com');
    setPassword('admin');
    setLocalError(null);
    clearAuthError();
    sound.playClick();
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#070A10] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C9A038]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0D121F]/90 backdrop-blur-2xl rounded-3xl border border-[#232F48] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Accent Top Rim */}
        <div className="absolute -top-[1px] left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[#ECC968] to-transparent shadow-[0_0_12px_rgba(236,201,104,0.8)]" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative mb-3 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1C2538] to-[#0E1524] border-2 border-[#C9A038]/60 flex items-center justify-center text-[#ECC968] shadow-[0_0_25px_rgba(201,160,56,0.25)] group-hover:border-[#ECC968] transition-all">
              <Shield className="w-8 h-8 fill-[#C9A038]/20 stroke-[1.8]" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#101726] border border-[#C9A038]/60 rounded-full p-1 text-[#ECC968]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182136] border border-[#263554] text-[11px] font-bold text-[#ECC968] mb-2 tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ECC968]" />
            Citadel Security Gateway
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-100 tracking-wide">
            ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Enter your credentials to synchronize and manage Citadel operations across all devices.
          </p>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-in slide-in-from-top-2 duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{displayError}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@citadel.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 bg-[#141B2D] border border-[#263554] focus:border-[#C9A038] focus:ring-1 focus:ring-[#C9A038] rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-2.5 bg-[#141B2D] border border-[#263554] focus:border-[#C9A038] focus:ring-1 focus:ring-[#C9A038] rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#141B2D] border-[#263554] text-[#C9A038] focus:ring-[#C9A038] focus:ring-offset-0 cursor-pointer"
              />
              <span>Remember on this device</span>
            </label>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Server className="w-3 h-3 text-emerald-400" />
              Edge D1 Cloud
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl font-heading font-black text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#ECC968] to-[#C9A038] hover:from-[#ECC968] hover:to-[#D4AF37] text-slate-950 shadow-[0_0_20px_rgba(201,160,56,0.35)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Edge...</span>
              </div>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Helper */}
        <div className="mt-6 pt-5 border-t border-[#1C253B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Default Admin Account
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] text-[#ECC968] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#ECC968]" />
              Auto-fill Credentials
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-[#121828] border border-[#1E2B44] text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span className="text-slate-400">Email: <span className="text-[#ECC968] font-semibold">admin@citadel.com</span></span>
            <span className="text-slate-400">Pass: <span className="text-slate-200 font-semibold">admin</span></span>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            You can change your admin email and password anytime in Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
