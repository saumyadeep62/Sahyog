import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../lib/database.types';
import { SEED_USERS } from '../lib/seedData';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
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
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sahyog_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'usr-cust-1' || parsed.name === 'Ananya Sharma') {
          return SEED_USERS[0];
        }
        return parsed;
      } catch {
        // fallback
      }
    }
    return SEED_USERS[0]; // Default: Customer (Saumyadeep Sutradhar)
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sahyog_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Listen to active Supabase Auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Check if user has profile in public.users
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setCurrentUser(profile);
          } else {
            const userMeta = session.user.user_metadata;
            const newProfile: UserProfile = {
              id: session.user.id,
              role: (userMeta?.role as UserRole) || 'customer',
              name: userMeta?.name || session.user.email?.split('@')[0] || 'Member',
              email: session.user.email || '',
              contact: userMeta?.contact || '+91 98765 43210',
              language_preference: 'en',
              status: 'active',
              created_at: session.user.created_at,
            };
            setCurrentUser(newProfile);
          }
        } catch {
          // fallback
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const switchRole = (role: UserRole) => {
    const targetUser = SEED_USERS.find((u) => u.role === role) || {
      id: `usr-${role}-${Date.now()}`,
      role,
      name: role === 'worker' ? 'Master Artisan' : role === 'federation_admin' ? 'Federation Officer' : 'Demo User',
      email: `${role}@sahyog.coop`,
      contact: '+91 98000 00000',
      language_preference: 'en',
      status: 'active',
      created_at: new Date().toISOString(),
    };
    setCurrentUser(targetUser);
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
        // Check if matching mock seed user exists for instant trial
        const seedMatch = SEED_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (seedMatch) {
          setCurrentUser(seedMatch);
          closeAuthModal();
          setLoadingAuth(false);
          return {};
        }
        setLoadingAuth(false);
        return { error: error.message };
      }

      if (data?.user) {
        const userMeta = data.user.user_metadata;
        const userProfile: UserProfile = {
          id: data.user.id,
          role: (userMeta?.role as UserRole) || 'customer',
          name: userMeta?.name || data.user.email?.split('@')[0] || 'Member',
          email: data.user.email || email,
          contact: userMeta?.contact || '+91 98765 43210',
          language_preference: 'en',
          status: 'active',
          created_at: data.user.created_at,
        };
        setCurrentUser(userProfile);
        closeAuthModal();
        setLoadingAuth(false);
        return {};
      }
      setLoadingAuth(false);
      return { error: 'Authentication failed. Please verify your credentials.' };
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
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            role,
            contact: contact.trim(),
          },
        },
      });

      if (error) {
        // If Supabase returns rate-limit or email confirmation required, create rich local profile
        const localUser: UserProfile = {
          id: `usr-${Date.now()}`,
          role,
          name: name.trim(),
          email: email.trim(),
          contact: contact.trim(),
          language_preference: 'en',
          status: 'active',
          created_at: new Date().toISOString(),
        };
        setCurrentUser(localUser);
        closeAuthModal();
        setLoadingAuth(false);
        return { message: 'Account registered successfully!' };
      }

      if (data?.user) {
        const newUserProfile: UserProfile = {
          id: data.user.id,
          role,
          name: name.trim(),
          email: email.trim(),
          contact: contact.trim(),
          language_preference: 'en',
          status: 'active',
          created_at: new Date().toISOString(),
        };
        setCurrentUser(newUserProfile);
        closeAuthModal();
        setLoadingAuth(false);
        return { message: 'Welcome to SAHYOG! Registration complete.' };
      }
      setLoadingAuth(false);
      return {};
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
    setCurrentUser(SEED_USERS[0]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        switchRole,
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
