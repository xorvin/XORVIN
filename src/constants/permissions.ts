// ============================================================
// XORVIN — Role Permission Constants & Route Mapping
// ============================================================
import type { UserRole } from '@/types';
import type { PermissionKey } from '@/types/permissions';

// ─── Role → Permission Mapping ────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: [
    'platform:super_manage',
    'users:read', 'users:create', 'users:update', 'users:delete',
    'users:ban', 'users:ban_temp', 'users:role_change',
    'events:read', 'events:create', 'events:update', 'events:delete',
    'events:approve', 'events:manage_registrations', 'events:export',
    'blogs:read', 'blogs:create', 'blogs:update', 'blogs:delete', 'blogs:publish',
    'gallery:approve', 'faqs:manage', 'newsletters:manage', 'banners:manage',
    'reports:read', 'reports:manage', 'comments:delete',
    'certificates:generate', 'certificates:read',
    'interviews:schedule', 'interviews:conduct', 'interviews:feedback',
    'submissions:score', 'rankings:publish',
    'ambassador:view_dashboard', 'ambassador:generate_referral',
    'mentor:host_sessions', 'mentor:publish_resources',
    'audit_logs:read', 'settings:manage_website', 'settings:manage_seo', 'analytics:read',
  ],

  admin: [
    'users:read', 'users:update', 'users:ban', 'users:ban_temp', 'users:role_change',
    'events:read', 'events:create', 'events:update', 'events:delete',
    'events:approve', 'events:manage_registrations', 'events:export',
    'blogs:read', 'blogs:create', 'blogs:update', 'blogs:delete', 'blogs:publish',
    'gallery:approve', 'faqs:manage', 'newsletters:manage', 'banners:manage',
    'reports:read', 'reports:manage', 'comments:delete',
    'certificates:generate', 'certificates:read',
    'interviews:schedule', 'interviews:conduct', 'interviews:feedback',
    'submissions:score', 'rankings:publish',
    'ambassador:view_dashboard',
    'mentor:host_sessions',
    'audit_logs:read', 'analytics:read',
  ],

  moderator: [
    'users:read', 'users:ban_temp',
    'reports:read', 'reports:manage', 'comments:delete',
    'gallery:approve', 'faqs:manage',
    'blogs:read',
    'events:read',
  ],

  event_manager: [
    'events:read', 'events:create', 'events:update', 'events:delete',
    'events:manage_registrations', 'events:export',
    'certificates:generate', 'certificates:read',
  ],

  content_manager: [
    'blogs:read', 'blogs:create', 'blogs:update', 'blogs:delete', 'blogs:publish',
    'faqs:manage', 'newsletters:manage', 'banners:manage',
    'gallery:approve',
  ],

  interviewer: [
    'interviews:schedule', 'interviews:conduct', 'interviews:feedback',
    'certificates:generate', 'certificates:read',
  ],

  judge: [
    'submissions:score', 'rankings:publish',
    'events:read',
  ],

  ambassador: [
    'ambassador:view_dashboard', 'ambassador:generate_referral',
  ],

  mentor: [
    'mentor:host_sessions', 'mentor:publish_resources',
  ],

  member: [
    'events:read', 'blogs:read', 'certificates:read',
  ],

  guest: [
    'events:read', 'blogs:read',
  ],
};

// ─── Role → Dashboard Route Mapping ──────────────────────────────────────────
export const ROLE_DASHBOARD: Record<UserRole, string> = {
  super_admin:     '/super-admin',
  admin:           '/admin/dashboard',
  moderator:       '/moderator',
  event_manager:   '/events/manage',
  content_manager: '/content',
  interviewer:     '/interviewer',
  judge:           '/judge',
  ambassador:      '/ambassador',
  mentor:          '/mentor',
  member:          '/profile',
  guest:           '/',
};

// ─── Role Display Labels ──────────────────────────────────────────────────────
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:     'Super Admin',
  admin:           'Administrator',
  moderator:       'Moderator',
  event_manager:   'Event Manager',
  content_manager: 'Content Manager',
  interviewer:     'Interviewer',
  judge:           'Judge',
  ambassador:      'Campus Ambassador',
  mentor:          'Mentor',
  member:          'Member',
  guest:           'Guest',
};

// ─── Role Badge Colors (Tailwind classes) ────────────────────────────────────
export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin:     'bg-purple-500/20 text-purple-300 border-purple-500/30',
  admin:           'bg-red-500/20 text-red-300 border-red-500/30',
  moderator:       'bg-orange-500/20 text-orange-300 border-orange-500/30',
  event_manager:   'bg-blue-500/20 text-blue-300 border-blue-500/30',
  content_manager: 'bg-green-500/20 text-green-300 border-green-500/30',
  interviewer:     'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  judge:           'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  ambassador:      'bg-pink-500/20 text-pink-300 border-pink-500/30',
  mentor:          'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  member:          'bg-white/10 text-white/60 border-white/10',
  guest:           'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

// ─── Role Hierarchy (for isAtLeast checks) ───────────────────────────────────
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin:     100,
  admin:           80,
  moderator:       60,
  event_manager:   50,
  content_manager: 50,
  interviewer:     40,
  judge:           40,
  ambassador:      30,
  mentor:          30,
  member:          10,
  guest:           0,
};
