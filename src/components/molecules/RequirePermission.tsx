import React, { type ReactNode } from 'react';
import { usePermissionContext } from '@/contexts/PermissionContext';
import type { PermissionKey } from '@/types/permissions';
import type { UserRole } from '@/types';

interface RequirePermissionProps {
  /** Show children only if user has this permission */
  permission?: PermissionKey;
  /** Show children only if user has ANY of these permissions */
  anyOf?: PermissionKey[];
  /** Show children only if user has ALL of these permissions */
  allOf?: PermissionKey[];
  /** Show children only if user has one of these roles */
  roles?: UserRole[];
  /** Rendered instead of null when permission is missing (e.g. a disabled button) */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Inline permission gate — renders children only when the user meets the
 * permission/role requirements. Never throws or redirects.
 *
 * @example
 * <RequirePermission permission="events:create">
 *   <Button>Create Event</Button>
 * </RequirePermission>
 */
export function RequirePermission({
  permission,
  anyOf,
  allOf,
  roles,
  fallback = null,
  children,
}: RequirePermissionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, role } = usePermissionContext();

  if (permission && !hasPermission(permission)) return <>{fallback}</>;
  if (anyOf && !hasAnyPermission(anyOf)) return <>{fallback}</>;
  if (allOf && !hasAllPermissions(allOf)) return <>{fallback}</>;
  if (roles && role && !roles.includes(role)) return <>{fallback}</>;

  return <>{children}</>;
}
