import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth.service';
import { useToast } from '@/contexts/ToastContext';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const profile = await authService.getUserProfile(userId);
      setUser(profile);
    } catch (e: any) {
      // Profile load failed silently — user stays logged out, no toast spam
      console.error('Failed to fetch profile:', e?.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const loginWithGoogle = async () => {
    try {
      await authService.signInWithOAuth('google');
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  const loginWithGitHub = async () => {
    try {
      await authService.signInWithOAuth('github');
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
      toast('Logged out successfully.', 'success');
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, loginWithGoogle, loginWithGitHub, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
