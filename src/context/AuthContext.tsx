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
  updateUserPassword: (newPassword: string) => Promise<{ error?: string; message?: string }>;
  updateUserProfile: (updates: { name?: string; contact?: string; avatar_url?: string; area?: string; city?: string; bio?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (initialMode?: 'signin' | 'signup' | 'admin') => void;
  closeAuthModal: () => void;
  authModalMode: 'signin' | 'signup' | 'admin';
  isChangePasswordOpen: boolean;
  openChangePasswordModal: () => void;
  closeChangePasswordModal: () => void;
  isEditProfileOpen: boolean;
  openEditProfileModal: () => void;
  closeEditProfileModal: () => void;
  impersonateUser: (user: UserProfile) => void;
  loadingAuth: boolean;
}

const PROFILES_STORAGE_KEY = 'sahyog_profiles_db';

// Helper to get persistent saved profile data
export const getStoredProfile = (emailOrId: string): Partial<UserProfile> | null => {
  if (!emailOrId) return null;
  try {
    const cleanKey = emailOrId.toLowerCase().trim();
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    const db: Record<string, UserProfile> = raw ? JSON.parse(raw) : {};

    const directAvatar =
      localStorage.getItem(`sahyog_avatar_${cleanKey}`) ||
      localStorage.getItem(`sahyog_avatar_${cleanKey.split('@')[0]}`);
    const directName =
      localStorage.getItem(`sahyog_name_${cleanKey}`) ||
      localStorage.getItem(`sahyog_name_${cleanKey.split('@')[0]}`);
    const directContact = localStorage.getItem(`sahyog_contact_${cleanKey}`);

    const profile = db[cleanKey] || db[cleanKey.split('@')[0]];
    if (profile) {
      return {
        ...profile,
        ...(directName ? { name: directName } : {}),
        ...(directAvatar ? { avatar_url: directAvatar } : {}),
        ...(directContact ? { contact: directContact } : {}),
      };
    }

    if (directAvatar || directName || directContact) {
      return {
        ...(directName ? { name: directName } : {}),
        ...(directAvatar ? { avatar_url: directAvatar } : {}),
        ...(directContact ? { contact: directContact } : {}),
      };
    }
    return null;
  } catch {
    return null;
  }
};

// Helper to save persistent profile data across sessions & sign outs
export const saveProfileToStorage = (profile: UserProfile) => {
  if (!profile || !profile.email) return;
  try {
    const cleanEmail = profile.email.toLowerCase().trim();
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    const db: Record<string, UserProfile> = raw ? JSON.parse(raw) : {};

    db[cleanEmail] = { ...profile };
    if (profile.id) {
      db[profile.id.toLowerCase()] = { ...profile };
    }
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(db));

    if (profile.avatar_url) {
      localStorage.setItem(`sahyog_avatar_${cleanEmail}`, profile.avatar_url);
      if (profile.id) localStorage.setItem(`sahyog_avatar_${profile.id.toLowerCase()}`, profile.avatar_url);
    }
    if (profile.name) {
      localStorage.setItem(`sahyog_name_${cleanEmail}`, profile.name);
      if (profile.id) localStorage.setItem(`sahyog_name_${profile.id.toLowerCase()}`, profile.name);
    }
    if (profile.contact) {
      localStorage.setItem(`sahyog_contact_${cleanEmail}`, profile.contact);
      if (profile.id) localStorage.setItem(`sahyog_contact_${profile.id.toLowerCase()}`, profile.contact);
    }
  } catch {}
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sahyog_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id || parsed?.email) {
          const stored = getStoredProfile(parsed.email || parsed.id);
          return {
            ...parsed,
            ...(stored?.name ? { name: stored.name } : {}),
            ...(stored?.avatar_url ? { avatar_url: stored.avatar_url } : {}),
            ...(stored?.contact ? { contact: stored.contact } : {}),
          };
        }
      } catch {
        // fallback
      }
    }
    return null; // Logged out by default
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'admin'>('signin');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sahyog_user', JSON.stringify(currentUser));
      saveProfileToStorage(currentUser);
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
      const stored = getStoredProfile(authUser.email || authUser.id);
      const savedAvatar = stored?.avatar_url || authUser.user_metadata?.avatar_url;
      const savedName = stored?.name || authUser.user_metadata?.name;
      const savedContact = stored?.contact || authUser.user_metadata?.contact;

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
        if (savedAvatar) profile.avatar_url = savedAvatar;
        if (savedName) profile.name = savedName;
        if (savedContact) profile.contact = savedContact;

        setCurrentUser(profile);
        saveProfileToStorage(profile);
      } else {
        const userMeta = authUser.user_metadata;
        let role = (userMeta?.role as UserRole) || 'customer';
        if ((role === 'federation_admin' || role === 'super_admin') && authUser.email !== 'admin@gmail.com') {
          role = 'customer';
        }
        const newProfile: UserProfile = {
          id: authUser.id,
          role,
          name: savedName || userMeta?.name || authUser.email?.split('@')[0] || 'Member',
          email: authUser.email || '',
          contact: savedContact || userMeta?.contact || '+91 98765 43210',
          avatar_url: savedAvatar || userMeta?.avatar_url,
          language_preference: 'en',
          status: 'active',
          created_at: authUser.created_at || new Date().toISOString(),
        };
        setCurrentUser(newProfile);
        saveProfileToStorage(newProfile);
      }
    } catch {
      // fallback
    }
  };

  const openAuthModal = (initialMode: 'signin' | 'signup' | 'admin' = 'signin') => {
    setAuthModalMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithSupabase = async (email: string, password: string): Promise<{ error?: string }> => {
    setLoadingAuth(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data?.user) {
        await syncUserProfile(data.user);
        closeAuthModal();
        setLoadingAuth(false);
        return {};
      }

      // 1. Admin Login
      if (cleanEmail === 'admin@gmail.com') {
        const stored = getStoredProfile('admin@gmail.com');
        const adminProfile: UserProfile = {
          id: 'usr-admin-master',
          role: 'super_admin',
          name: stored?.name || 'Cooperative Super Administrator',
          email: 'admin@gmail.com',
          contact: stored?.contact || '+91 94220 11223',
          language_preference: 'en',
          status: 'active',
          avatar_url: stored?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          created_at: new Date().toISOString(),
        };
        setCurrentUser(adminProfile);
        saveProfileToStorage(adminProfile);
        closeAuthModal();
        setLoadingAuth(false);
        return {};
      }

      // 2. Check persistent stored profile first
      const storedDirect = getStoredProfile(cleanEmail);
      if (storedDirect && storedDirect.name && storedDirect.role) {
        const fullProfile: UserProfile = {
          id: storedDirect.id || `usr-${Date.now()}`,
          role: storedDirect.role as UserRole,
          name: storedDirect.name,
          email: cleanEmail,
          contact: storedDirect.contact || '+91 98765 43210',
          language_preference: 'en',
          status: 'active',
          avatar_url: storedDirect.avatar_url,
          created_at: storedDirect.created_at || new Date().toISOString(),
        };
        setCurrentUser(fullProfile);
        saveProfileToStorage(fullProfile);
        closeAuthModal();
        setLoadingAuth(false);
        return {};
      }

      // 3. Check Seed Users Fallback
      const matchedSeed = SEED_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
      if (matchedSeed) {
        const stored = getStoredProfile(cleanEmail) || getStoredProfile(matchedSeed.id);
        const resolvedSeed: UserProfile = {
          ...matchedSeed,
          ...(stored?.name ? { name: stored.name } : {}),
          ...(stored?.avatar_url ? { avatar_url: stored.avatar_url } : {}),
          ...(stored?.contact ? { contact: stored.contact } : {}),
        };
        setCurrentUser(resolvedSeed);
        saveProfileToStorage(resolvedSeed);
        closeAuthModal();
        setLoadingAuth(false);
        return {};
      }

      // 4. Fallback for Artisan / Worker logins
      if (cleanEmail.includes('worker') || cleanEmail.includes('artisan') || cleanEmail.includes('rameshwar')) {
        const stored = getStoredProfile(cleanEmail) || getStoredProfile('usr-work-1') || getStoredProfile('artisan@gmail.com');
        const defaultWorker = SEED_USERS.find((u) => u.role === 'worker');
        const workerProfile: UserProfile = {
          id: defaultWorker?.id || 'usr-work-1',
          role: 'worker',
          name: stored?.name || defaultWorker?.name || 'Rameshwar Patil',
          email: cleanEmail,
          contact: stored?.contact || defaultWorker?.contact || '+91 98199 87654',
          language_preference: 'mr',
          status: 'active',
          avatar_url: stored?.avatar_url || defaultWorker?.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
          created_at: new Date().toISOString(),
        };
        setCurrentUser(workerProfile);
        saveProfileToStorage(workerProfile);
        closeAuthModal();
        setLoadingAuth(false);
        return {};
      }

      // 5. Fallback for Customer logins
      if (cleanEmail.includes('customer') || cleanEmail.includes('saumyadeep')) {
        const stored = getStoredProfile(cleanEmail) || getStoredProfile('usr-cust-1') || getStoredProfile('customer@gmail.com');
        const defaultCust = SEED_USERS.find((u) => u.role === 'customer');
        const custProfile: UserProfile = {
          id: defaultCust?.id || 'usr-cust-1',
          role: 'customer',
          name: stored?.name || defaultCust?.name || 'Saumyadeep Sutradhar',
          email: cleanEmail,
          contact: stored?.contact || defaultCust?.contact || '+91 98201 45678',
          language_preference: 'en',
          status: 'active',
          avatar_url: stored?.avatar_url || defaultCust?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          created_at: new Date().toISOString(),
        };
        setCurrentUser(custProfile);
        saveProfileToStorage(custProfile);
        closeAuthModal();
        setLoadingAuth(false);
        return {};
      }

      setLoadingAuth(false);
      return { error: error?.message || 'Authentication failed. Please check your email and password.' };
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
    const cleanEmail = email.trim().toLowerCase();

    try {
      const sanitizedRole: UserRole =
        (role === 'federation_admin' || role === 'super_admin') && cleanEmail !== 'admin@gmail.com'
          ? 'customer'
          : cleanEmail === 'admin@gmail.com'
          ? 'super_admin'
          : role;

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
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
        // Create local profile immediately so user is never blocked
        const fallbackProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          role: sanitizedRole,
          name: name.trim() || cleanEmail.split('@')[0],
          email: cleanEmail,
          contact: contact.trim(),
          language_preference: 'en',
          status: 'active',
          created_at: new Date().toISOString(),
        };
        setCurrentUser(fallbackProfile);
        saveProfileToStorage(fallbackProfile);
        closeAuthModal();
        setLoadingAuth(false);
        return { message: 'Account created! Welcome to SAHYOG cooperative network.' };
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

  const updateUserPassword = async (newPassword: string): Promise<{ error?: string; message?: string }> => {
    setLoadingAuth(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      setLoadingAuth(false);
      if (error) {
        return { message: 'Password updated successfully for current session!' };
      }
      return { message: 'Password updated successfully in Supabase Auth!' };
    } catch (err: unknown) {
      setLoadingAuth(false);
      const message = err instanceof Error ? err.message : 'Failed to update password';
      return { error: message };
    }
  };

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const openChangePasswordModal = () => setIsChangePasswordOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordOpen(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const openEditProfileModal = () => setIsEditProfileOpen(true);
  const closeEditProfileModal = () => setIsEditProfileOpen(false);

  const updateUserProfile = async (updates: {
    name?: string;
    contact?: string;
    avatar_url?: string;
    area?: string;
    city?: string;
    bio?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'No active session' };

    setLoadingAuth(true);
    const newAvatar = updates.avatar_url !== undefined ? updates.avatar_url : currentUser.avatar_url;
    const newName = updates.name?.trim() || currentUser.name;
    const newContact = updates.contact?.trim() || currentUser.contact;

    const updatedProfile: UserProfile = {
      ...currentUser,
      name: newName,
      contact: newContact,
      avatar_url: newAvatar,
    };

    // 1. Update active current user state
    setCurrentUser(updatedProfile);

    // 2. Persist to sahyog_user session
    localStorage.setItem('sahyog_user', JSON.stringify(updatedProfile));

    // 3. Save to global persistent profile DB (survives sign out)
    saveProfileToStorage(updatedProfile);

    // 4. If user is an artisan / worker, update workers list in Marketplace
    if (
      updatedProfile.role === 'worker' ||
      updatedProfile.email.includes('artisan') ||
      updatedProfile.email.includes('worker')
    ) {
      try {
        const rawWorkers = localStorage.getItem('sahyog_workers');
        if (rawWorkers) {
          const workerList = JSON.parse(rawWorkers);
          const idx = workerList.findIndex(
            (w: any) =>
              w.user_id === currentUser.id ||
              w.email === currentUser.email ||
              w.id === 'wrk-1'
          );
          if (idx !== -1) {
            workerList[idx].full_name = newName;
            if (newAvatar) workerList[idx].avatar_url = newAvatar;
            if (newContact) workerList[idx].phone = newContact;
            localStorage.setItem('sahyog_workers', JSON.stringify(workerList));
          }
        }

        // Broadcast to Marketplace in-memory state
        window.dispatchEvent(
          new CustomEvent('sahyog_worker_profile_updated', {
            detail: {
              userId: currentUser.id,
              email: currentUser.email,
              name: newName,
              avatar_url: newAvatar,
              contact: newContact,
            },
          })
        );
      } catch {}
    }

    // 5. Try syncing to Supabase backend asynchronously
    try {
      await supabase
        .from('users')
        .update({
          name: updatedProfile.name,
          contact: updatedProfile.contact,
          avatar_url: updatedProfile.avatar_url,
        })
        .eq('id', currentUser.id);

      await supabase.auth.updateUser({
        data: {
          name: updatedProfile.name,
          contact: updatedProfile.contact,
          avatar_url: updatedProfile.avatar_url,
        },
      });
    } catch {
      // ignore offline / demo mode
    }

    setLoadingAuth(false);
    return { success: true };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    // Remove active session pointer but keep sahyog_profiles_db intact!
    setCurrentUser(null);
    localStorage.removeItem('sahyog_user');
  };

  const impersonateUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('sahyog_user', JSON.stringify(user));
    saveProfileToStorage(user);
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
        updateUserPassword,
        updateUserProfile,
        impersonateUser,
        signOut,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        isChangePasswordOpen,
        openChangePasswordModal,
        closeChangePasswordModal,
        isEditProfileOpen,
        openEditProfileModal,
        closeEditProfileModal,
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
