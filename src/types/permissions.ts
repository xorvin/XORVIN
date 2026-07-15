// ============================================================
// XORVIN — Permission Key Type Definitions
// ============================================================

export type PermissionKey =
  // Platform
  | 'platform:super_manage'
  // Users
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'users:ban'
  | 'users:ban_temp'
  | 'users:role_change'
  // Events
  | 'events:read'
  | 'events:create'
  | 'events:update'
  | 'events:delete'
  | 'events:approve'
  | 'events:manage_registrations'
  | 'events:export'
  // Content
  | 'blogs:read'
  | 'blogs:create'
  | 'blogs:update'
  | 'blogs:delete'
  | 'blogs:publish'
  | 'gallery:approve'
  | 'faqs:manage'
  | 'newsletters:manage'
  | 'banners:manage'
  // Moderation
  | 'reports:read'
  | 'reports:manage'
  | 'comments:delete'
  // Certificates
  | 'certificates:generate'
  | 'certificates:read'
  // Interviews
  | 'interviews:schedule'
  | 'interviews:conduct'
  | 'interviews:feedback'
  // Judging
  | 'submissions:score'
  | 'rankings:publish'
  // Ambassador
  | 'ambassador:view_dashboard'
  | 'ambassador:generate_referral'
  // Mentor
  | 'mentor:host_sessions'
  | 'mentor:publish_resources'
  // System
  | 'audit_logs:read'
  | 'settings:manage_website'
  | 'settings:manage_seo'
  | 'analytics:read';

export interface Permission {
  id: string;
  key: PermissionKey;
  description: string;
  module: string;
}

export interface RolePermission {
  role: string;
  permissionId: string;
}
