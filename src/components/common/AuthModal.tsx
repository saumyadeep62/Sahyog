import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  Crown,
  AlertTriangle,
  Users,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/database.types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    signInWithSupabase,
    signUpWithSupabase,
    loadingAuth,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>(authModalMode || 'signin');
  const [loginPersona, setLoginPersona] = useState<'customer' | 'artisan'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
      if (authModalMode === 'admin') {
        setEmail('admin@gmail.com');
        setPassword('admin123');
      } else if (authModalMode === 'signin') {
        setEmail('customer@gmail.com');
        setPassword('password123');
      }
    }
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleModeSwitch = (newMode: 'signin' | 'signup' | 'admin') => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    if (newMode === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('admin123');
    } else if (newMode === 'signin') {
      if (loginPersona === 'customer') {
        setEmail('customer@gmail.com');
        setPassword('password123');
      } else {
        setEmail('artisan@gmail.com');
        setPassword('artisan123');
      }
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handlePersonaSwitch = (persona: 'customer' | 'artisan') => {
    setLoginPersona(persona);
    setErrorMsg('');
    setSuccessMsg('');
    if (persona === 'customer') {
      setEmail('customer@gmail.com');
      setPassword('password123');
      setSuccessMsg('Customer credentials selected: customer@gmail.com');
    } else {
      setEmail('artisan@gmail.com');
      setPassword('artisan123');
      setSuccessMsg('Artisan credentials selected: artisan@gmail.com');
    }
  };

  const handleFillAdminCredentials = () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setSuccessMsg('Admin credentials auto-filled!');
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
        setSuccessMsg('Administrator authenticated successfully!');
        setTimeout(() => {
          closeAuthModal();
        }, 500);
      }
      return;
    }

    if (mode === 'signin') {
      const res = await signInWithSupabase(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        closeAuthModal();
      }
    } else {
      const res = await signUpWithSupabase(email, password, name, role, contact);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.message || 'Registration successful!');
        setTimeout(() => {
          closeAuthModal();
        }, 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between text-white ${
          mode === 'admin'
            ? 'bg-gradient-to-r from-teal-950 via-[#0C3B2E] to-teal-900'
            : 'bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#1D5C4B]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-md ${
              mode === 'admin'
                ? 'bg-gradient-to-tr from-amber-400 to-amber-300 text-teal-950'
                : 'bg-gradient-to-tr from-[#D4A373] to-[#E0A96D] text-[#0C3B2E]'
            }`}>
              {mode === 'admin' ? '🏛️' : 'स'}
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base font-['Outfit']">
                {mode === 'signin'
                  ? 'Log In to SAHYOG'
                  : mode === 'admin'
                  ? 'Cooperative Admin Portal'
                  : 'Join Cooperative Network'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-200">
                {mode === 'admin' ? 'Federation Governance Console' : 'Supabase Auth Protected'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-stone-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleModeSwitch('signin')}
            className={`flex-1 py-3 transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'text-[#0C3B2E] border-b-2 border-[#0C3B2E] bg-white shadow-xs font-extrabold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('signup')}
            className={`flex-1 py-3 transition-colors flex items-center justify-center gap-1.5 ${
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
            className={`flex-1 py-3 transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'admin'
                ? 'text-teal-900 border-b-2 border-teal-700 bg-teal-50 shadow-xs font-extrabold'
                : 'text-stone-500 hover:text-teal-800 hover:bg-teal-50/40'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Admin</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Customer vs Artisan Log In Persona Selection */}
          {mode === 'signin' && (
            <div className="space-y-1.5">
              <label className="block font-bold text-stone-700 text-xs">Choose Account Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handlePersonaSwitch('customer')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    loginPersona === 'customer'
                      ? 'border-[#0C3B2E] bg-emerald-50 text-[#0C3B2E] ring-2 ring-[#0C3B2E]/20 shadow-xs font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 font-medium'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div>
                    <p className="text-xs">Customer</p>
                    <p className="text-[10px] text-stone-500 font-normal">Household</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePersonaSwitch('artisan')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    loginPersona === 'artisan'
                      ? 'border-[#0C3B2E] bg-amber-50 text-amber-950 ring-2 ring-[#0C3B2E]/20 shadow-xs font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 font-medium'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <div>
                    <p className="text-xs">Artisan</p>
                    <p className="text-[10px] text-stone-500 font-normal">Trade Master</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {mode === 'admin' && (
            <div className="p-3 rounded-xl bg-teal-900 text-white text-xs flex items-center justify-between gap-2 animate-in fade-in border border-teal-600/40">
              <div>
                <p className="font-bold text-white text-xs">Federation Admin Console</p>
                <p className="text-[10px] text-teal-200">Default: admin@gmail.com</p>
              </div>
              <button
                type="button"
                onClick={handleFillAdminCredentials}
                className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-[10px] transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Fill</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
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
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Mobile Contact</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="+91 98201 45678"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Customer Account Indicator */}
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <div>
                      <p className="font-bold text-xs text-[#0C3B2E]">Customer Account</p>
                      <p className="text-[10px] text-stone-500">Book certified trade services</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md">
                    Customer
                  </span>
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-stone-700">
                  {mode === 'admin'
                    ? 'Administrator Email'
                    : mode === 'signin' && loginPersona === 'artisan'
                    ? 'Artisan Email'
                    : 'Customer Email'}
                </label>
                {mode === 'signin' && (
                  <span className="text-[10px] text-stone-500 font-medium">
                    {loginPersona === 'customer' ? 'Demo: customer@gmail.com' : 'Demo: artisan@gmail.com'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder={
                    mode === 'admin'
                      ? 'admin@gmail.com'
                      : loginPersona === 'artisan'
                      ? 'artisan@gmail.com'
                      : 'customer@gmail.com'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                    mode === 'admin'
                      ? 'border-teal-400 bg-teal-50/40 focus:ring-teal-700 font-semibold'
                      : 'border-stone-300 focus:ring-[#0C3B2E]'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-stone-700">Password</label>
                {mode === 'admin' ? (
                  <span className="text-[10px] text-teal-700 font-semibold">Demo: admin123</span>
                ) : mode === 'signin' ? (
                  <span className="text-[10px] text-stone-500 font-medium">
                    {loginPersona === 'customer' ? 'Demo: password123' : 'Demo: artisan123'}
                  </span>
                ) : null}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                    mode === 'admin'
                      ? 'border-teal-400 bg-teal-50/40 focus:ring-teal-700'
                      : 'border-stone-300 focus:ring-[#0C3B2E]'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className={`w-full py-3 rounded-xl text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95 ${
                mode === 'admin'
                  ? 'bg-gradient-to-r from-teal-800 to-[#0C3B2E] hover:from-teal-900 hover:to-[#144537]'
                  : 'bg-[#0C3B2E] hover:bg-[#164E3F]'
              }`}
            >
              {loadingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Supabase...</span>
                </>
              ) : mode === 'admin' ? (
                <>
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Authenticate Admin Command</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : mode === 'signin' ? (
                <>
                  {loginPersona === 'artisan' ? (
                    <Briefcase className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <Users className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                  <span>Log In as {loginPersona === 'artisan' ? 'Artisan' : 'Customer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Create Customer Account</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
