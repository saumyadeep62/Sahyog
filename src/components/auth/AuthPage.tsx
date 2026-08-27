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
  Loader2,
  Users,
  Briefcase,
  ArrowLeft,
  Crown,
  KeyRound,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/database.types';
import { AuthPage3DVisual } from './AuthPage3DVisual';
import { TiltCard } from '../3d/TiltCard';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup' | 'admin';
  onNavigateHome: () => void;
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onNavigateHome,
  onLoginSuccess,
}) => {
  const { signInWithSupabase, signUpWithSupabase, loadingAuth } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>(initialMode);
  const [email, setEmail] = useState(initialMode === 'admin' ? 'admin@gmail.com' : '');
  const [password, setPassword] = useState(initialMode === 'admin' ? 'admin123' : '');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleModeSwitch = (newMode: 'signin' | 'signup' | 'admin') => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    if (newMode === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('admin123');
    } else if (email === 'admin@gmail.com') {
      setEmail('');
      setPassword('');
    }
  };

  const handleFillAdminCredentials = () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setSuccessMsg('Admin credentials auto-filled! Click "Access Admin Command Center" to authenticate.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'admin') {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail !== 'admin@gmail.com') {
        setErrorMsg('Invalid administrator email. Authorized cooperative administrator email is admin@gmail.com.');
        return;
      }
      const res = await signInWithSupabase(cleanEmail, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg('Cooperative Administrator authenticated successfully! Redirecting...');
        setTimeout(() => {
          onLoginSuccess();
        }, 600);
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
        }, 1200);
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
                onClick={() => handleModeSwitch('signin')}
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
                onClick={() => handleModeSwitch('signup')}
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
                onClick={() => handleModeSwitch('admin')}
                className={`flex-1 py-3.5 transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'admin'
                    ? 'text-teal-900 border-b-2 border-teal-700 bg-teal-50/70 shadow-xs font-extrabold'
                    : 'text-stone-500 hover:text-teal-800 hover:bg-teal-50/40'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Login</span>
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-4">
              {/* Admin Mode Spotlight Banner */}
              {mode === 'admin' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-900 via-[#0C3B2E] to-teal-950 text-white text-xs border border-teal-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400 text-teal-950 flex items-center justify-center font-black">
                        🏛️
                      </div>
                      <div>
                        <p className="font-extrabold text-white text-xs">Cooperative Admin Command Portal</p>
                        <p className="text-[10px] text-teal-200">Federation Governance & Welfare Audit</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                      SUPER ADMIN
                    </span>
                  </div>

                  <div className="pt-2 border-t border-teal-700/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-teal-200">Default: <strong className="text-white">admin@gmail.com</strong></span>
                    <button
                      type="button"
                      onClick={handleFillAdminCredentials}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-teal-950" />
                      <span>Auto-Fill Admin</span>
                    </button>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Authentication Notice: </span>
                      <span>{errorMsg}</span>
                    </div>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">{successMsg}</span>
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
                  <label className="block font-bold text-stone-700 mb-1">
                    {mode === 'admin' ? 'Administrator Email' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder={mode === 'admin' ? 'admin@gmail.com' : 'your.email@example.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:outline-none ${
                        mode === 'admin'
                          ? 'border-teal-400 bg-teal-50/30 focus:ring-teal-700 font-semibold'
                          : 'border-stone-300 rounded-xl focus:ring-[#0C3B2E] bg-stone-50/50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-stone-700">Password</label>
                    {mode === 'admin' && (
                      <span className="text-[10px] text-teal-700 font-semibold">Demo Password: admin123</span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:outline-none ${
                        mode === 'admin'
                          ? 'border-teal-400 bg-teal-50/30 focus:ring-teal-700'
                          : 'border-stone-300 rounded-xl focus:ring-[#0C3B2E] bg-stone-50/50'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingAuth}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 text-white ${
                    mode === 'admin'
                      ? 'bg-gradient-to-r from-teal-800 via-[#0C3B2E] to-teal-900 hover:from-teal-900 hover:to-[#0C3B2E] border border-teal-600/40'
                      : 'bg-gradient-to-r from-[#0C3B2E] to-[#164E3F] hover:from-[#164E3F] hover:to-[#0C3B2E]'
                  }`}
                >
                  {loadingAuth ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating with Supabase...</span>
                    </>
                  ) : mode === 'admin' ? (
                    <>
                      <Crown className="w-4 h-4 text-amber-300" />
                      <span>Access Admin Command Center</span>
                      <ArrowRight className="w-4 h-4" />
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

              {/* Bottom Quick Switch for Admin / Customer */}
              <div className="pt-3 border-t border-stone-100 text-center">
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('admin')}
                    className="text-xs font-bold text-[#0C3B2E] hover:text-teal-800 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cooperative Administrator? Access Admin Portal →</span>
                  </button>
                )}

                {mode === 'admin' && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signin')}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Back to Customer & Artisan Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};
