import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/errors';
import type { Event } from '@/types';
import { mapDbEvent, mapDbEvents } from '@/utils/mapDbEvent';

export const eventsService = {
  async getEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return mapDbEvents(data ?? []);
    } catch (e) {
      throw handleError(e);
    }
  },

  async getEventBySlug(slug: string): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return mapDbEvent(data);
    } catch (e) {
      throw handleError(e);
    }
  },

  async registerForEvent(eventId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({ event_id: eventId, user_id: userId });

      if (error) throw error;
    } catch (e) {
      throw handleError(e);
    }
  },
};
