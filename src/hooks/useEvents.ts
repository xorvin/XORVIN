import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { eventsService } from '@/services/events.service';
import { useToast } from '@/contexts/ToastContext';
import { withRetry } from '@/lib/retry';
import { mapDbEvents } from '@/utils/mapDbEvent';
import type { EventCategory } from '@/types';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => withRetry(eventsService.getEvents),
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ['events', slug],
    queryFn: () => withRetry(() => eventsService.getEventBySlug(slug)),
    enabled: !!slug,
  });
}

export function useEventsByCategories(categories: EventCategory[]) {
  return useQuery({
    queryKey: ['events-by-category', categories],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('category', categories)
        .order('start_date', { ascending: true });
      if (error) throw error;
      return mapDbEvents(data ?? []);
    },
  });
}

export function useRegisterEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      eventsService.registerForEvent(eventId, userId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
      toast('Successfully registered for event!', 'success');
    },
    onError: (error: any) => {
      toast(error.message || 'Failed to register', 'error');
    },
  });
}
