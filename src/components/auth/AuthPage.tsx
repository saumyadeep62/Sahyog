import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
  Send,
  Loader2,
  Users,
  Briefcase,
  Building,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/database.types';
import { AuthPage3DVisual } from './AuthPage3DVisual';
import { TiltCard } from '../3d/TiltCard';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup' | 'magic_link';
  onNavigateHome: () => void;
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onNavigateHome,
  onLoginSuccess,
}) => {
  const { signInWithSupabase, signUpWithSupabase, signInWithOtp, loadingAuth } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'magic_link'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'magic_link') {
      const res = await signInWithOtp(email);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.message || 'Magic login link dispatched to your email!');
      }
      return;
    }

    if (mode === 'signin') {
      const res = await signInWithSupabase(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        onLoginSuccess();
      }
    } else {
      const res = await signUpWithSupabase(email, password, name, role, contact);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.message || 'Account created successfully! Welcome to SAHYOG.');
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0C3B2E] via-[#144537] to-[#0C3B2E] text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Ambient 3D Glowing Orbs */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-[#D4A373]/15 blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none animate-float-reverse" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* LEFT COLUMN: 3D WEBGL GRAPHIC & COOPERATIVE ETHOS */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-stone-200 border border-white/15 backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </button>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D5C4B] border border-[#297762] text-xs font-semibold text-[#D4A373]">
              <Shield className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Multi-State Cooperative Authentication</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] tracking-tight leading-tight">
              Dignity in Labour, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A373] via-[#E0A96D] to-[#FAF8F5]">
                Fairness in Every Booking.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Access your cooperative account to book certified trade masters, view verified statutory rate cards, or
              manage member welfare funds with 0% private extraction.
            </p>
          </div>

          {/* 3D Visual Container */}
          <div className="w-full max-w-sm mx-auto lg:mx-0 h-[320px] sm:h-[380px] bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-2 shadow-2xl relative">
            <AuthPage3DVisual />
            <div className="absolute bottom-3 left-3 right-3 bg-[#08281F]/80 backdrop-blur-md py-1.5 px-3 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300 text-center font-semibold">
              ✦ 100% Encrypted Supabase Auth & Row Level Security
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE 3D TILT AUTH CARD */}
        <div className="lg:col-span-6">
          <TiltCard
            maxTilt={6}
            scale={1.01}
            className="bg-white text-stone-800 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
          >
            {/* Auth Mode Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-3.5 transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signin'
                    ? 'text-[#0C3B2E] border-b-2 border-[#0C3B2E] bg-white shadow-xs font-extrabold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-3.5 transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'text-[#0C3B2E] border-b-2 border-[#0C3B2E] bg-white shadow-xs font-extrabold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('magic_link');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-3.5 transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'magic_link'
                    ? 'text-[#0C3B2E] border-b-2 border-[#0C3B2E] bg-white shadow-xs font-extrabold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Magic OTP</span>
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <span className="font-bold">Error:</span> {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Full Legal Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rameshwar Patil"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Contact Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          placeholder="+91 98201 45678"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
                        />
                      </div>
                    </div>

                    {/* Role Selector Radio Cards */}
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Account Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole('customer')}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                            role === 'customer'
                              ? 'border-[#0C3B2E] bg-emerald-50/80 text-[#0C3B2E] ring-2 ring-[#0C3B2E]/20'
                              : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <Users className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-xs">Customer</p>
                            <p className="text-[10px] text-stone-500">Book services</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRole('worker')}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                            role === 'worker'
                              ? 'border-[#0C3B2E] bg-amber-50/80 text-amber-900 ring-2 ring-[#0C3B2E]/20'
                              : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <Briefcase className="w-4 h-4 text-amber-700 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-xs">Artisan</p>
                            <p className="text-[10px] text-stone-500">Earn fair wages</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                {mode !== 'magic_link' && (
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingAuth}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0C3B2E] to-[#164E3F] hover:from-[#164E3F] hover:to-[#0C3B2E] text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  {loadingAuth ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating with Supabase...</span>
                    </>
                  ) : mode === 'magic_link' ? (
                    <>
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>Send Magic Link to Inbox</span>
                    </>
                  ) : mode === 'signin' ? (
                    <>
                      <span>Sign In with Supabase</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Create Cooperative Account</span>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Admin & Quick Credentials Access Helper */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-teal-700" />
                  <span>Admin: <strong className="text-stone-800 font-mono">admin@gmail.com</strong></span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@gmail.com');
                    setPassword('admin123');
                    setMode('signin');
                  }}
                  className="text-teal-800 hover:text-teal-950 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 transition-colors"
                >
                  Autofill Admin ➔
                </button>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};
