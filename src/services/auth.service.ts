import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/errors';
import type { User } from '@/types';

export const authService = {
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (e) {
      throw handleError(e);
    }
  },

  async getUserProfile(userId: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;

      if (!data) {
        // Profile not yet created by DB trigger — wait 1.5s and retry once
        await new Promise(resolve => setTimeout(resolve, 1500));
        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (retryError) throw retryError;

        if (!retryData) {
          // Still missing — return a minimal placeholder so the UI doesn't crash.
          // The DB trigger will create it on next auth event.
          const session = await supabase.auth.getSession();
          const authUser = session.data.session?.user;
          return {
            id: userId,
            name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || 'New User',
            username: `user_${userId.substring(0, 8)}`,
            email: authUser?.email || '',
            avatar: authUser?.user_metadata?.avatar_url || '',
            role: 'guest',
            bio: undefined,
            college: undefined,
            country: undefined,
            github: undefined,
            linkedin: undefined,
            twitter: undefined,
            portfolio: undefined,
            points: 0,
            wins: 0,
            eventsParticipated: 0,
            joinedAt: new Date().toISOString(),
            status: 'active',
            isVerified: false,
            badges: [],
          } as unknown as User;
        }

        return retryData as unknown as User;
      }

      return data as User;
    } catch (e) {
      throw handleError(e);
    }
  },

  async signInWithOAuth(provider: 'google' | 'github') {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (e) {
      throw handleError(e);
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      throw handleError(e);
    }
  }
};
