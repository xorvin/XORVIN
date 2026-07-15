import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionContext } from '@/contexts/PermissionContext';
import type { UserRole } from '@/types';
import type { PermissionKey } from '@/types/permissions';

interface ProtectedRouteProps {
  /** If set, user must have at least one of these roles */
  roles?: UserRole[];
  /** If set, user must have this specific permission */
  permission?: PermissionKey;
  /** If set, user must have all of these permissions */
  permissions?: PermissionKey[];
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
    <div className="w-8 h-8 border-2 border-xorvin-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

export function ProtectedRoute({ roles, permission, permissions }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasPermission, hasAllPermissions } = usePermissionContext();
  const location = useLocation();

  if (isLoading) return <Spinner />;

  // Not authenticated → send to login, preserving destination
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Role check
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  // Single permission check
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  // Multi-permission check (must have ALL)
  if (permissions && !hasAllPermissions(permissions)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
