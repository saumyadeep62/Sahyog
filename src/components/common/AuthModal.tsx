import React, { useState } from 'react';
import {
  X,
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
    signInWithOtp,
    loadingAuth,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'magic_link'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'magic_link') {
      const res = await signInWithOtp(email);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.message || 'Magic link sent to your email!');
      }
      return;
    }

    if (mode === 'signin') {
      const res = await signInWithSupabase(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      }
    } else {
      const res = await signUpWithSupabase(email, password, name, role, contact);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(res.message || 'Registration successful!');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#1D5C4B] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4A373] to-[#E0A96D] flex items-center justify-center text-[#0C3B2E] font-extrabold text-xl shadow-md">
              स
            </div>
            <div>
              <h3 className="font-extrabold text-base font-['Outfit']">
                {mode === 'signin'
                  ? 'Sign In to SAHYOG'
                  : mode === 'magic_link'
                  ? 'Passwordless Magic Login'
                  : 'Join Cooperative Network'}
              </h3>
              <p className="text-[11px] text-emerald-200">Supabase Auth Connected</p>
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
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 transition-colors ${
              mode === 'signin'
                ? 'text-[#0C3B2E] border-b-2 border-[#0C3B2E] bg-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => {
              setMode('magic_link');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 transition-colors ${
              mode === 'magic_link'
                ? 'text-[#0C3B2E] border-b-2 border-[#0C3B2E] bg-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Magic Link OTP
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 transition-colors ${
              mode === 'signup'
                ? 'text-[#0C3B2E] border-b-2 border-[#0C3B2E] bg-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
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

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Register As</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                        role === 'customer'
                          ? 'border-[#0C3B2E] bg-[#0C3B2E] text-white shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Household Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('worker')}
                      className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                        role === 'worker'
                          ? 'border-[#0C3B2E] bg-[#0C3B2E] text-white shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Cooperative Worker
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
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
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
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-3 rounded-xl bg-[#0C3B2E] hover:bg-[#164E3F] text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              {loadingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Supabase...</span>
                </>
              ) : mode === 'magic_link' ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Magic Link to Email</span>
                </>
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Create Cooperative Account</span>
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
