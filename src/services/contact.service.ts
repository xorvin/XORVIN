import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/errors';
import type { ContactForm } from '@/types';

export const contactService = {
  async submitContact(data: ContactForm) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        });
      
      if (error) throw error;
    } catch (e) {
      throw handleError(e);
    }
  }
};
