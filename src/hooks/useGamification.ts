import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// XP Level thresholds
export const XP_LEVELS = [
  { level: 1, min: 0,    max: 100,   title: 'Rookie',    color: '#6b7280' },
  { level: 2, min: 100,  max: 300,   title: 'Explorer',  color: '#3b82f6' },
  { level: 3, min: 300,  max: 600,   title: 'Builder',   color: '#8b5cf6' },
  { level: 4, min: 600,  max: 1000,  title: 'Hacker',    color: '#f59e0b' },
  { level: 5, min: 1000, max: 2000,  title: 'Champion',  color: '#ef4444' },
  { level: 6, min: 2000, max: 5000,  title: 'Legend',    color: '#ec4899' },
  { level: 7, min: 5000, max: 99999, title: 'Xorvin Pro',color: '#30D5FF' },
];

export const BADGE_DEFINITIONS: Record<string, { name: string; icon: string; description: string; color: string }> = {
  first_event:     { name: 'First Event',      icon: '🎯', description: 'Registered for first event',  color: '#3b82f6' },
  hackathon_winner:{ name: 'Hackathon Winner',  icon: '🏆', description: 'Won a hackathon',             color: '#f59e0b' },
  top_10:          { name: 'Top 10',            icon: '⭐', description: 'Reached global top 10',       color: '#ec4899' },
  centurion:       { name: 'Centurion',         icon: '💯', description: 'Earned 100+ XP',              color: '#8b5cf6' },
  ambassador:      { name: 'Ambassador',         icon: '🌟', description: 'Campus Ambassador',           color: '#10b981' },
  mentor_star:     { name: 'Mentor Star',        icon: '🎓', description: 'Completed 10 mentor sessions',color: '#6366f1' },
  bug_hunter:      { name: 'Bug Hunter',         icon: '🐛', description: 'Participated in a CTF',       color: '#ef4444' },
  socialite:       { name: 'Socialite',          icon: '🤝', description: 'Referred 5+ members',         color: '#f97316' },
  early_adopter:   { name: 'Early Adopter',      icon: '🚀', description: 'Joined in the first month',   color: '#06b6d4' },
};

export function getLevelInfo(xp: number) {
  return XP_LEVELS.find(l => xp >= l.min && xp < l.max) ?? XP_LEVELS[0];
}

export function getLevelProgress(xp: number) {
  const level = getLevelInfo(xp);
  const progress = ((xp - level.min) / (level.max - level.min)) * 100;
  return Math.min(100, Math.round(progress));
}

export function useGamification() {
  const { user } = useAuth();

  const { data: xpData } = useQuery({
    queryKey: ['xp-total', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('xp_transactions')
        .select('amount')
        .eq('user_id', user!.id);
      if (error) return 0;
      return (data ?? []).reduce((sum, t) => sum + t.amount, 0);
    },
  });

  const { data: badges } = useQuery({
    queryKey: ['badges', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user!.id)
        .order('earned_at', { ascending: false });
      if (error) return [];
      return (data ?? []).map(b => ({
        ...b,
        ...(BADGE_DEFINITIONS[b.badge_key] ?? { name: b.badge_key, icon: '🏅', description: '', color: '#6b7280' }),
      }));
    },
  });

  const { data: activityLog } = useQuery({
    queryKey: ['activity-log', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) return [];
      return data ?? [];
    },
  });

  const totalXP = xpData ?? 0;
  const levelInfo = getLevelInfo(totalXP);
  const progress = getLevelProgress(totalXP);

  return { totalXP, levelInfo, progress, badges: badges ?? [], activityLog: activityLog ?? [] };
}

export function useLeaderboardPosition() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['leaderboard-position', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, points')
        .order('points', { ascending: false });
      if (error) return null;
      const position = (data ?? []).findIndex(p => p.id === user!.id) + 1;
      return position > 0 ? position : null;
    },
  });
}
