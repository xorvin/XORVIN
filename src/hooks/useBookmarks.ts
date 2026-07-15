import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useBookmarks(targetType?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['bookmarks', user?.id, targetType],
    enabled: !!user?.id,
    queryFn: async () => {
      let query = supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (targetType) {
        query = query.eq('target_type', targetType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useIsBookmarked(targetType: string, targetId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['bookmark-check', user?.id, targetType, targetId],
    enabled: !!user?.id && !!targetId,
    queryFn: async () => {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user!.id)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .maybeSingle();
      return !!data;
    },
  });
}

export function useToggleBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ targetType, targetId, isBookmarked }: {
      targetType: string;
      targetId: string;
      isBookmarked: boolean;
    }) => {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user!.id)
          .eq('target_type', targetType)
          .eq('target_id', targetId);
      } else {
        await supabase.from('bookmarks').insert({
          user_id: user!.id,
          target_type: targetType,
          target_id: targetId,
        });
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['bookmark-check', user?.id, variables.targetType, variables.targetId] });
    },
  });
}
