import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Shield, ScrollText, Settings,
  BarChart3, Globe, Bell, Database,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicSidebar } from '@/components/organisms/DynamicSidebar';

const SECTIONS = [
  {
    title: 'Overview',
    items: [
      { label: 'Platform KPIs',   href: '/super-admin',              icon: <LayoutDashboard className="w-4 h-4" />, end: true },
      { label: 'Analytics',       href: '/super-admin/analytics',    icon: <BarChart3  className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Access Control',
    items: [
      { label: 'All Users',       href: '/super-admin/users',        icon: <Users   className="w-4 h-4" /> },
      { label: 'Roles & Perms',   href: '/super-admin/roles',        icon: <Shield  className="w-4 h-4" /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Audit Logs',      href: '/super-admin/audit-logs',   icon: <ScrollText className="w-4 h-4" /> },
      { label: 'Notifications',   href: '/super-admin/notifications', icon: <Bell   className="w-4 h-4" /> },
      { label: 'Website Settings',href: '/super-admin/settings',     icon: <Settings className="w-4 h-4" /> },
      { label: 'SEO & Meta',      href: '/super-admin/seo',          icon: <Globe  className="w-4 h-4" /> },
      { label: 'Database',        href: '/super-admin/system',       icon: <Database className="w-4 h-4" /> },
    ],
  },
];

export function SuperAdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated || user?.role !== 'super_admin') {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="min-h-screen flex bg-xorvin-dark">
      <DynamicSidebar
        sections={SECTIONS}
        panelLabel="Super Admin"
        accentColor="text-purple-400"
        accentBg="bg-purple-500/15"
        accentBorder="border-purple-500/25"
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-14 lg:mt-0" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
