import { supabase } from '@/lib/supabase';

interface AuditLogEntry {
  actorId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

export const auditService = {
  async log({ actorId, action, targetType, targetId, metadata }: AuditLogEntry) {
    try {
      await supabase.from('audit_logs').insert({
        actor_id:    actorId,
        action,
        target_type: targetType ?? null,
        target_id:   targetId ?? null,
        metadata:    metadata ?? null,
      });
    } catch (err) {
      console.warn('[AuditService] Failed to write log:', err);
    }
  },
};
