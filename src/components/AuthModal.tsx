import React, { useState } from "react";
import { X, Mail, Lock, User, ShieldCheck, Chrome, ArrowRight, Smartphone } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
  isDarkMode: boolean;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'otp';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, isDarkMode }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login') {
        if (!email || !password) {
          setError("Please fill in all fields.");
          return;
        }
        onLoginSuccess({ name: email.split('@')[0], email });
        onClose();
      } else if (mode === 'signup') {
        if (!email || !password || !name) {
          setError("All fields are required.");
          return;
        }
        setMode('otp');
      } else if (mode === 'otp') {
        if (otp.length < 4) {
          setError("Invalid OTP. Enter a 4-digit code.");
          return;
        }
        onLoginSuccess({ name: name || email.split('@')[0], email });
        onClose();
      } else if (mode === 'forgot') {
        alert("Password reset instructions sent to your email!");
        setMode('login');
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ name: "Alex Mercer", email: "alex.mercer@gmail.com" });
      onClose();
    }, 8000); // Mimic security authorization
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className={`relative w-full max-w-md overflow-hidden rounded-[32px] border p-8 transition-all duration-300 ${
        isDarkMode 
          ? "glass-panel text-white border-white/15 shadow-2xl" 
          : "bg-white/95 border-black/10 text-black shadow-2xl"
      }`}>
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-white/10 text-neutral-400" : "hover:bg-black/5 text-neutral-600"
          }`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-sans tracking-tight">
            {mode === 'login' && "Welcome Back"}
            {mode === 'signup' && "Create Account"}
            {mode === 'forgot' && "Reset Password"}
            {mode === 'otp' && "Verification"}
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
            {mode === 'login' && "Experience fashion through the lens of AI."}
            {mode === 'signup' && "Start your personalized fashion journey."}
            {mode === 'forgot' && "Enter your email to receive recovery link."}
            {mode === 'otp' && "We've sent a 4-digit code to your email."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest uppercase opacity-70">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input
                  type="text"
                  placeholder="e.g. Liam Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 focus:border-indigo-500" 
                      : "bg-black/5 border-black/10 focus:border-indigo-600"
                  }`}
                  required
                />
              </div>
            </div>
          )}

          {mode !== 'otp' && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest uppercase opacity-70">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 focus:border-indigo-500" 
                      : "bg-black/5 border-black/10 focus:border-indigo-600"
                  }`}
                  required
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono tracking-widest uppercase opacity-70">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 focus:border-indigo-500" 
                      : "bg-black/5 border-black/10 focus:border-indigo-600"
                  }`}
                  required
                />
              </div>
            </div>
          )}

          {mode === 'otp' && (
            <div className="space-y-1 text-center">
              <label className="text-[10px] font-mono tracking-widest uppercase opacity-70 block mb-2">Enter Verification Code</label>
              <div className="relative flex justify-center">
                <Smartphone className="absolute left-1/4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />
                <input
                  type="text"
                  maxLength={4}
                  placeholder="0 0 0 0"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={`w-32 tracking-[1em] text-center pl-4 py-3 rounded-xl border text-lg font-bold font-mono transition-all focus:outline-none ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 focus:border-indigo-500" 
                      : "bg-black/5 border-black/10 focus:border-indigo-600"
                  }`}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' && "Sign In"}
                {mode === 'signup' && "Continue"}
                {mode === 'forgot' && "Send Reset Link"}
                {mode === 'otp' && "Verify & Register"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        {mode !== 'otp' && (
          <div className="relative my-6 text-center">
            <span className={`absolute inset-x-0 top-1/2 border-t -z-10 ${isDarkMode ? "border-white/10" : "border-black/10"}`} />
            <span className={`px-4 text-[10px] font-mono tracking-widest uppercase ${
              isDarkMode ? "bg-[#0d0d10] text-zinc-500" : "bg-white text-neutral-400"
            }`}>
              OR
            </span>
          </div>
        )}

        {/* Google Auth Button */}
        {mode !== 'otp' && (
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
              isDarkMode 
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" 
                : "bg-black/5 border-black/10 hover:bg-black/10 text-black"
            }`}
          >
            <Chrome className="h-4 w-4 text-rose-500" />
            Sign in with Google
          </button>
        )}

        {/* Footer Toggle */}
        <div className="text-center mt-6 text-xs">
          {mode === 'login' ? (
            <p className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}>
              New to VOGA AI?{" "}
              <button onClick={() => setMode('signup')} className="text-indigo-400 font-semibold hover:underline">
                Create Account
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}>
              Already have an account?{" "}
              <button onClick={() => setMode('login')} className="text-indigo-400 font-semibold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <button onClick={() => setMode('login')} className="text-indigo-400 font-semibold hover:underline">
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
