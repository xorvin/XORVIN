import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useSubmissions(eventId?: string) {
  return useQuery({
    queryKey: ['submissions', eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*, submitter:profiles!submitted_by(name, avatar_url), evaluations(*)')
        .eq('event_id', eventId!)
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllSubmissions() {
  return useQuery({
    queryKey: ['submissions-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*, event:events(id, title, status), submitter:profiles!submitted_by(name, avatar_url), evaluations(*)')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSubmitEvaluation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (evaluation: {
      submission_id: string;
      innovation: number;
      technical: number;
      presentation: number;
      impact: number;
      overall: number;
      comments: string;
    }) => {
      const { error } = await supabase
        .from('evaluations')
        .upsert([{ ...evaluation, judge_id: user!.id }], {
          onConflict: 'submission_id,judge_id',
        });
      if (error) throw error;

      // Award XP to judge
      await supabase.from('xp_transactions').insert({
        user_id: user!.id,
        amount: 15,
        reason: 'Submission evaluated',
        source_type: 'evaluation',
        source_id: evaluation.submission_id,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  });
}

export function useApproveEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (evaluationId: string) => {
      const { error } = await supabase
        .from('evaluations')
        .update({ is_approved: true })
        .eq('id', evaluationId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions'] }),
  });
}

export function useRankings(eventId: string) {
  return useQuery({
    queryKey: ['rankings', eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*, evaluations(*)')
        .eq('event_id', eventId)
        .order('submitted_at', { ascending: true });

      if (error) throw error;

      // Calculate average scores and rank
      const ranked = (data ?? [])
        .map((sub: any) => {
          const evals = sub.evaluations ?? [];
          const avgScore = evals.length
            ? evals.reduce((acc: number, e: any) => acc + (e.overall ?? 0), 0) / evals.length
            : 0;
          return { ...sub, avgScore: Math.round(avgScore * 10) / 10 };
        })
        .sort((a: any, b: any) => b.avgScore - a.avgScore)
        .map((sub: any, idx: number) => ({ ...sub, rank: idx + 1 }));

      return ranked;
    },
  });
}
