import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface LogActionOptions {
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

export function useAuditLog() {
  const { user } = useAuth();

  const logAction = useCallback(
    async (action: string, options: LogActionOptions = {}) => {
      if (!user?.id) return;
      try {
        await supabase.from('audit_logs').insert({
          actor_id:    user.id,
          action,
          target_type: options.targetType,
          target_id:   options.targetId,
          metadata:    options.metadata ?? null,
        });
      } catch (err) {
        // Silently fail — audit logging should never block a user action
        console.warn('[AuditLog] Failed to write audit log:', err);
      }
    },
    [user?.id]
  );

  return { logAction };
}
