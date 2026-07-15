import { supabase } from '@/lib/supabase';

interface SendNotificationOptions {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}

export const notificationsService = {
  async send({ userId, type, title, body, link }: SendNotificationOptions) {
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        type,
        title,
        body:    body ?? null,
        link:    link ?? null,
      });
    } catch (err) {
      console.warn('[NotificationsService] Failed to send notification:', err);
    }
  },

  async sendToRole(role: string, type: string, title: string, body?: string, link?: string) {
    try {
      const { data: users } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', role);
      if (!users?.length) return;
      await supabase.from('notifications').insert(
        users.map(u => ({ user_id: u.id, type, title, body: body ?? null, link: link ?? null }))
      );
    } catch (err) {
      console.warn('[NotificationsService] Failed to send role notification:', err);
    }
  },
};
