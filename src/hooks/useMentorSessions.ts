import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useMentorSessions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['mentor-sessions', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentor_sessions')
        .select('*, mentee:profiles!mentee_id(id, name, username, avatar_url, college), mentor:profiles!mentor_id(id, name)')
        .or(`mentor_id.eq.${user!.id},mentee_id.eq.${user!.id}`)
        .order('scheduled_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBookSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (session: {
      mentor_id: string;
      mentee_id: string;
      topic: string;
      scheduled_at: string;
      duration_minutes?: number;
    }) => {
      const { data, error } = await supabase.from('mentor_sessions').insert([session]).select().single();
      if (error) throw error;

      // Log activity for mentee
      await supabase.from('activity_log').insert({
        user_id: session.mentee_id,
        action: 'session_booked',
        target_type: 'mentor_session',
        target_id: data.id,
        metadata: { mentor_id: session.mentor_id, topic: session.topic },
      });

      // Notify mentor
      await supabase.from('notifications').insert({
        user_id: session.mentor_id,
        type: 'session_booked',
        title: 'New Session Booked',
        body: `A mentee has booked a session on "${session.topic}"`,
        link: '/mentor',
      });

      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mentor-sessions'] }),
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from('mentor_sessions').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mentor-sessions'] }),
  });
}

export function useMentorResources() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['mentor-resources', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentor_resources')
        .select('*')
        .or(`mentor_id.eq.${user!.id},is_public.eq.true`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAddResource() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: {
      title: string;
      description?: string;
      url: string;
      resource_type?: string;
      is_public?: boolean;
    }) => {
      const { error } = await supabase
        .from('mentor_resources')
        .insert([{ ...resource, mentor_id: user!.id }]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mentor-resources'] }),
  });
}

export function useLearningPlans() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['learning-plans', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_plans')
        .select('*, mentee:profiles!mentee_id(name, avatar_url)')
        .or(`mentor_id.eq.${user!.id},mentee_id.eq.${user!.id}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAssignments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['assignments', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*, mentee:profiles!mentee_id(name, avatar_url)')
        .or(`mentor_id.eq.${user!.id},mentee_id.eq.${user!.id}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
