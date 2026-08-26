import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../lib/database.types';
import { SEED_USERS } from '../lib/seedData';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  signInWithSupabase: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithSupabase: (email: string, password: string, name: string, role: UserRole, contact?: string) => Promise<{ error?: string; message?: string }>;
  signInWithOtp: (email: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (initialMode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  authModalMode: 'signin' | 'signup';
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sahyog_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id) return parsed;
      } catch {
        // fallback
      }
    }
    return null; // Logged out by default
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sahyog_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sahyog_user');
    }
  }, [currentUser]);

  // Listen to active Supabase Auth state changes
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserProfile(session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const syncUserProfile = async (authUser: any) => {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        // Admin email security verification
        if (profile.role === 'federation_admin' || profile.role === 'super_admin') {
          if (authUser.email !== 'admin@gmail.com') {
            profile.role = 'customer';
          }
        }
        setCurrentUser(profile);
      } else {
        const userMeta = authUser.user_metadata;
        let role = (userMeta?.role as UserRole) || 'customer';
        if ((role === 'federation_admin' || role === 'super_admin') && authUser.email !== 'admin@gmail.com') {
          role = 'customer';
        }
        const newProfile: UserProfile = {
          id: authUser.id,
          role,
          name: userMeta?.name || authUser.email?.split('@')[0] || 'Member',
          email: authUser.email || '',
          contact: userMeta?.contact || '+91 98765 43210',
          language_preference: 'en',
          status: 'active',
          created_at: authUser.created_at || new Date().toISOString(),
        };
        setCurrentUser(newProfile);
      }
    } catch {
      // fallback
    }
  };

  const openAuthModal = (initialMode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithSupabase = async (email: string, password: string): Promise<{ error?: string }> => {
    setLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setLoadingAuth(false);
        return { error: error.message };
      }

      if (data?.user) {
        await syncUserProfile(data.user);
        closeAuthModal();
        setLoadingAuth(false);
        return {};
      }
      setLoadingAuth(false);
      return { error: 'Authentication failed. Please check your credentials.' };
    } catch (err: unknown) {
      setLoadingAuth(false);
      const message = err instanceof Error ? err.message : 'Login failed';
      return { error: message };
    }
  };

  const signUpWithSupabase = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    contact: string = '+91 98765 43210'
  ): Promise<{ error?: string; message?: string }> => {
    setLoadingAuth(true);
    try {
      // Prevent unauthorized admin role signups
      const sanitizedRole: UserRole =
        (role === 'federation_admin' || role === 'super_admin') && email.trim() !== 'admin@gmail.com'
          ? 'customer'
          : role;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: sanitizedRole,
            contact: contact.trim(),
          },
        },
      });

      if (error) {
        setLoadingAuth(false);
        return { error: error.message };
      }

      if (data?.user) {
        await syncUserProfile(data.user);
        closeAuthModal();
        setLoadingAuth(false);
        return { message: 'Welcome to SAHYOG! Registration complete.' };
      }
      setLoadingAuth(false);
      return { error: 'Sign up failed. Please try again.' };
    } catch (err: unknown) {
      setLoadingAuth(false);
      const message = err instanceof Error ? err.message : 'Registration failed';
      return { error: message };
    }
  };

  const signInWithOtp = async (email: string): Promise<{ error?: string; message?: string }> => {
    setLoadingAuth(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      setLoadingAuth(false);
      if (error) {
        return { error: error.message };
      }
      return { message: `Magic login link dispatched to ${email}. Check your inbox!` };
    } catch (err: unknown) {
      setLoadingAuth(false);
      const message = err instanceof Error ? err.message : 'Failed to send OTP link';
      return { error: message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem('sahyog_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        isAuthenticated: Boolean(currentUser),
        signInWithSupabase,
        signUpWithSupabase,
        signInWithOtp,
        signOut,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        loadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
