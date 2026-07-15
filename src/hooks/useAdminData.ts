import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { blogsService } from '@/services/blogs.service';
import { mapDbEvents } from '@/utils/mapDbEvent';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [members, events, blogs, competitions] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }).in('category', ['competition', 'hackathon', 'ai-challenge', 'ctf']),
      ]);

      if (members.error) throw members.error;
      if (events.error) throw events.error;
      if (blogs.error) throw blogs.error;
      if (competitions.error) throw competitions.error;

      return {
        members: members.count ?? 0,
        events: events.count ?? 0,
        blogs: blogs.count ?? 0,
        competitions: competitions.count ?? 0,
      };
    },
  });
}

export function useAdminRecentEvents(limit = 5) {
  return useQuery({
    queryKey: ['admin-recent-events', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return mapDbEvents(data ?? []);
    },
  });
}

export function useAdminRecentBlogs(limit = 4) {
  return useQuery({
    queryKey: ['admin-recent-blogs', limit],
    queryFn: () => blogsService.getAllBlogs(limit),
  });
}

export function useAdminEvents() {
  return useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return mapDbEvents(data ?? []);
    },
  });
}
