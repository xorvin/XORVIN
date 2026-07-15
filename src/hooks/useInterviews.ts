import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useInterviews(options?: { candidateId?: string }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['interviews', user?.id, options],
    enabled: !!user?.id,
    queryFn: async () => {
      let query = supabase
        .from('interviews')
        .select(`
          *,
          candidate:profiles!candidate_id(id, name, username, avatar_url, college, github, linkedin),
          interviewer:profiles!interviewer_id(id, name, avatar_url),
          interview_feedback(*),
          interview_notes(*)
        `)
        .order('scheduled_at', { ascending: true });

      if (user!.role === 'interviewer') {
        query = query.eq('interviewer_id', user!.id);
      }
      if (options?.candidateId) {
        query = query.eq('candidate_id', options.candidateId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useScheduleInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      candidate_id: string;
      interviewer_id: string;
      event_id?: string;
      scheduled_at: string;
      duration_minutes?: number;
      meeting_link?: string;
    }) => {
      const { data, error } = await supabase.from('interviews').insert([payload]).select().single();
      if (error) throw error;

      // Log XP for interviewer
      await supabase.from('xp_transactions').insert({
        user_id: payload.interviewer_id,
        amount: 10,
        reason: 'Interview scheduled',
        source_type: 'interview',
        source_id: data.id,
      });

      // Log activity
      await supabase.from('activity_log').insert({
        user_id: payload.candidate_id,
        action: 'interview_scheduled',
        target_type: 'interview',
        target_id: data.id,
      });

      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from('interviews').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedback: {
      interview_id: string;
      technical_score: number;
      communication_score: number;
      problem_solving_score: number;
      overall_score: number;
      recommendation: string;
      comments: string;
    }) => {
      const { error } = await supabase
        .from('interview_feedback')
        .upsert([feedback], { onConflict: 'interview_id' });
      if (error) throw error;

      // Update interview status to completed
      await supabase
        .from('interviews')
        .update({ status: 'completed' })
        .eq('id', feedback.interview_id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
}

export function useSaveInterviewNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ interview_id, content }: { interview_id: string; content: string }) => {
      const { error } = await supabase
        .from('interview_notes')
        .upsert([{ interview_id, content, updated_at: new Date().toISOString() }], {
          onConflict: 'interview_id',
        });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
}

export function useCandidates() {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url, college, country, github, linkedin, skills, experience, created_at')
        .eq('role', 'member')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
