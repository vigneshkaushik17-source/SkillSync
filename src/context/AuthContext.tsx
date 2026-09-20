import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

export type AuthStatus = 'loading' | 'logged_out' | 'logging_in' | 'logged_in' | 'logging_out';

export type UserRole = 'candidate' | 'policymaker' | 'institution' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  isAdmin: boolean;
  rawUser?: SupabaseUser;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  currentRole: UserRole;
  setRole: (role: UserRole) => boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SUPER_ADMIN_EMAIL = 'vigneshkaushik17@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [guestRole, setGuestRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('sia_user_role') as UserRole;
    return saved && saved !== 'admin' ? saved : 'policymaker';
  });

  const extractUserInfo = useCallback((sbUser: SupabaseUser | null | undefined): AuthUser | null => {
    if (!sbUser) return null;
    const meta = sbUser.user_metadata || {};
    const email = sbUser.email || '';
    const fullName = meta.full_name || meta.name || (email ? email.split('@')[0] : 'Authenticated User');
    const avatarUrl = meta.avatar_url || meta.picture || '';

    // Admin access is strictly granted ONLY to vigneshkaushik17@gmail.com
    const emailNormalized = email.toLowerCase().trim();
    const isExplicitAdmin = emailNormalized === SUPER_ADMIN_EMAIL.toLowerCase();

    let role: UserRole = 'policymaker';
    if (isExplicitAdmin) {
      const preferredAdminRole = localStorage.getItem('sia_admin_view_role') as UserRole;
      role = preferredAdminRole || 'admin';
    } else {
      const saved = localStorage.getItem('sia_user_role') as UserRole;
      if (saved && saved !== 'admin') {
        role = saved;
      } else if (meta.role && meta.role !== 'admin') {
        role = meta.role as UserRole;
      } else {
        role = 'policymaker';
      }
    }

    const isAdmin = isExplicitAdmin;

    return {
      id: sbUser.id,
      email,
      full_name: fullName,
      avatar_url: avatarUrl,
      role,
      isAdmin,
      rawUser: sbUser,
    };
  }, []);

  // Initialize and listen for Supabase auth state changes
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        setAuthStatus('loading');
        
        // 1. Retrieve existing session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error fetching Supabase session:', error.message);
        }

        if (isMounted) {
          if (initialSession && initialSession.user) {
            setSession(initialSession);
            setUser(extractUserInfo(initialSession.user));
            setAuthStatus('logged_in');
          } else {
            setSession(null);
            setUser(null);
            setAuthStatus('logged_out');
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth initialization:', err);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setAuthStatus('logged_out');
        }
      }
    }

    initAuth();

    // 2. Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession);
        setUser(extractUserInfo(newSession.user));
        setAuthStatus('logged_in');
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setAuthStatus('logged_out');
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        setSession(newSession);
        setUser(extractUserInfo(newSession.user));
        setAuthStatus('logged_in');
      } else if (event === 'USER_UPDATED' && newSession) {
        setSession(newSession);
        setUser(extractUserInfo(newSession.user));
        setAuthStatus('logged_in');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [extractUserInfo]);

  // Set user role securely
  const setRole = (newRole: UserRole): boolean => {
    // Prevent non-admin users from escalating to admin
    if (newRole === 'admin') {
      const isEligibleAdmin = user?.email?.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase();
      if (!isEligibleAdmin) {
        console.warn(`Unauthorized attempt to elevate role to admin. Restricted to ${SUPER_ADMIN_EMAIL}.`);
        return false;
      }
    }

    if (user) {
      if (user.isAdmin) {
        localStorage.setItem('sia_admin_view_role', newRole);
      } else {
        localStorage.setItem('sia_user_role', newRole);
      }
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    } else {
      if (newRole !== 'admin') {
        setGuestRole(newRole);
        localStorage.setItem('sia_user_role', newRole);
      }
    }
    return true;
  };

  // Handle Google OAuth sign-in
  const signInWithGoogle = async () => {
    setAuthStatus('logging_in');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        setAuthStatus('logged_out');
        throw error;
      }
    } catch (error) {
      setAuthStatus('logged_out');
      throw error;
    }
  };

  // Handle sign-out
  const signOut = async () => {
    setAuthStatus('logging_out');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign-out warning:', err);
    } finally {
      setUser(null);
      setSession(null);
      setAuthStatus('logged_out');
      try {
        localStorage.removeItem('sb-srfjhwivwzxsdlqiqrqp-auth-token');
      } catch (e) {
        // ignore
      }
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(extractUserInfo(currentSession.user));
        setAuthStatus('logged_in');
      } else {
        setSession(null);
        setUser(null);
        setAuthStatus('logged_out');
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
    }
  };

  const isAuthenticated = authStatus === 'logged_in' && user !== null;
  const isLoading = authStatus === 'loading' || authStatus === 'logging_in' || authStatus === 'logging_out';
  const isAdmin = Boolean(user?.isAdmin || user?.role === 'admin');
  const currentRole = user?.role || guestRole;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        authStatus,
        isAuthenticated,
        isLoading,
        isAdmin,
        currentRole,
        setRole,
        signInWithGoogle,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
