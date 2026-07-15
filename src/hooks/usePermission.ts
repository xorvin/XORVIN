import { usePermissionContext } from '@/contexts/PermissionContext';
import type { PermissionKey } from '@/types/permissions';
import type { UserRole } from '@/types';

/** Returns true if the current user has the specified permission */
export function usePermission(key: PermissionKey): boolean {
  const { hasPermission } = usePermissionContext();
  return hasPermission(key);
}

/** Returns true if the current user has ANY of the given permissions */
export function useAnyPermission(keys: PermissionKey[]): boolean {
  const { hasAnyPermission } = usePermissionContext();
  return hasAnyPermission(keys);
}

/** Returns true if the current user has ALL of the given permissions */
export function useAllPermissions(keys: PermissionKey[]): boolean {
  const { hasAllPermissions } = usePermissionContext();
  return hasAllPermissions(keys);
}

/** Returns the current user's role */
export function useRole(): UserRole | null {
  const { role } = usePermissionContext();
  return role;
}

/** Returns true if the current user's role is at least minRole in the hierarchy */
export function useIsAtLeast(minRole: UserRole): boolean {
  const { isAtLeast } = usePermissionContext();
  return isAtLeast(minRole);
}
