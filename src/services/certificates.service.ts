import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/errors';
import type { Certificate } from '@/types';

export const certificatesService = {
  async getUserCertificates(userId: string): Promise<Certificate[]> {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          id, certificate_id, type, rank, issued_at,
          event:event_id ( title, start_date )
        `)
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((c: any) => ({
        id: c.id,
        certificateId: c.certificate_id,
        type: c.type,
        rank: c.rank,
        issuedAt: c.issued_at,
        eventId: c.event.id,
        eventTitle: c.event.title,
        eventDate: c.event.start_date,
      })) as unknown as Certificate[];
    } catch (e) {
      throw handleError(e);
    }
  },

  async verifyCertificate(certificateId: string): Promise<Certificate | null> {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          id, certificate_id, type, rank, issued_at,
          user:user_id ( name, email ),
          event:event_id ( title, start_date )
        `)
        .eq('certificate_id', certificateId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw error;
      }
      
      const userObj = data.user as unknown as { name: string, email: string };
      const eventObj = data.event as unknown as { id: string, title: string, start_date: string };

      return {
        id: data.id,
        certificateId: data.certificate_id,
        type: data.type,
        rank: data.rank,
        issuedAt: data.issued_at,
        recipientName: userObj.name,
        recipientEmail: userObj.email,
        eventId: eventObj.id,
        eventTitle: eventObj.title,
        eventDate: eventObj.start_date,
      } as unknown as Certificate;
    } catch (e) {
      throw handleError(e);
    }
  }
};
