import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/errors';
import type { LeaderboardEntry } from '@/types';

export const leaderboardService = {
  async getTopUsers(limit = 100): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url, college, country, points, wins, events_participated')
        .order('points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      // Map to LeaderboardEntry type
      return data.map((p: any, index: number) => ({
        rank: index + 1,
        userId: p.id,
        userName: p.name,
        avatar: p.avatar_url,
        college: p.college || 'Unknown',
        country: p.country || 'Global',
        score: p.points,
        eventsParticipated: p.events_participated,
        wins: p.wins,
        badges: 0, // Would be a join in a real scenario or separate call
        trend: 'stable'
      })) as LeaderboardEntry[];
    } catch (e) {
      throw handleError(e);
    }
  }
};
