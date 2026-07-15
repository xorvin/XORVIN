import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'ghost';
  className?: string;
}

const variantClasses = {
  primary: 'badge-primary',
  accent:  'badge-accent',
  success: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 border border-green-500/30 text-green-400',
  warning: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-400',
  danger:  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-400',
  ghost:   'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/70',
};

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
}

// Status badge for events
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    upcoming:  { label: 'Upcoming',  variant: 'primary' },
    ongoing:   { label: 'Live Now',  variant: 'success' },
    completed: { label: 'Completed', variant: 'ghost'   },
    cancelled: { label: 'Cancelled', variant: 'danger'  },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'ghost' };
  return <Badge variant={variant}>{label}</Badge>;
}
