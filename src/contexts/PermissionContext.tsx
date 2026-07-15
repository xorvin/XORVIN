import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS, ROLE_HIERARCHY } from '@/constants/permissions';
import type { PermissionKey } from '@/types/permissions';
import type { UserRole } from '@/types';

interface PermissionContextType {
  permissions: Set<PermissionKey>;
  hasPermission: (key: PermissionKey) => boolean;
  hasAnyPermission: (keys: PermissionKey[]) => boolean;
  hasAllPermissions: (keys: PermissionKey[]) => boolean;
  isAtLeast: (minRole: UserRole) => boolean;
  role: UserRole | null;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user?.role) return new Set<PermissionKey>();
    return new Set<PermissionKey>(ROLE_PERMISSIONS[user.role] ?? []);
  }, [user?.role]);

  const hasPermission = (key: PermissionKey) => permissions.has(key);

  const hasAnyPermission = (keys: PermissionKey[]) =>
    keys.some(k => permissions.has(k));

  const hasAllPermissions = (keys: PermissionKey[]) =>
    keys.every(k => permissions.has(k));

  const isAtLeast = (minRole: UserRole) => {
    if (!user?.role) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minRole];
  };

  return (
    <PermissionContext.Provider value={{
      permissions,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      isAtLeast,
      role: user?.role ?? null,
    }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error('usePermissionContext must be inside PermissionProvider');
  return ctx;
}
