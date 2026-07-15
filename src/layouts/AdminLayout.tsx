import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, FileText, Users, Award,
  Trophy, Megaphone, Image, BarChart3, MessageSquare, Flag,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicSidebar } from '@/components/organisms/DynamicSidebar';
import type { SidebarSection } from '@/components/organisms/DynamicSidebar';

const ADMIN_SECTIONS: SidebarSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard',     href: '/admin/dashboard',     icon: <LayoutDashboard className="w-4 h-4" />, end: true },
      { label: 'Analytics',     href: '/admin/analytics',     icon: <BarChart3   className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Events',        href: '/admin/events',        icon: <Calendar  className="w-4 h-4" /> },
      { label: 'Blogs',         href: '/admin/blogs',         icon: <FileText  className="w-4 h-4" /> },
      { label: 'Gallery',       href: '/admin/gallery',       icon: <Image     className="w-4 h-4" /> },
      { label: 'Announcements', href: '/admin/announcements', icon: <Megaphone className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Users',
    items: [
      { label: 'All Users',     href: '/admin/users',         icon: <Users  className="w-4 h-4" /> },
      { label: 'Reports',       href: '/admin/reports',       icon: <Flag   className="w-4 h-4" /> },
      { label: 'Messages',      href: '/admin/contact',       icon: <MessageSquare className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Records',
    items: [
      { label: 'Certificates',  href: '/admin/certificates',  icon: <Award  className="w-4 h-4" /> },
      { label: 'Leaderboard',   href: '/admin/leaderboard',   icon: <Trophy className="w-4 h-4" /> },
    ],
  },
];

const MODERATOR_SECTIONS: SidebarSection[] = [
  {
    title: 'Moderation',
    items: [
      { label: 'Dashboard',     href: '/moderator',           icon: <LayoutDashboard className="w-4 h-4" />, end: true },
      { label: 'Reports',       href: '/moderator/reports',   icon: <Flag            className="w-4 h-4" /> },
      { label: 'Comments',      href: '/moderator/comments',  icon: <MessageSquare   className="w-4 h-4" /> },
      { label: 'Banned Users',  href: '/moderator/bans',      icon: <Users           className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Gallery Review',href: '/moderator/gallery',   icon: <Image    className="w-4 h-4" /> },
      { label: 'FAQs',          href: '/moderator/faqs',      icon: <FileText className="w-4 h-4" /> },
    ],
  },
];

export function AdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
      <div className="w-8 h-8 border-2 border-xorvin-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated || !['admin', 'moderator'].includes(user?.role ?? '')) {
    return <Navigate to="/403" replace />;
  }

  const isMod = user?.role === 'moderator';
  const sections = isMod ? MODERATOR_SECTIONS : ADMIN_SECTIONS;
  const panelLabel = isMod ? 'Moderator' : 'Admin Panel';

  return (
    <div className="min-h-screen flex bg-xorvin-dark">
      <DynamicSidebar
        sections={sections}
        panelLabel={panelLabel}
        accentColor={isMod ? 'text-orange-400' : 'text-xorvin-accent'}
        accentBg={isMod ? 'bg-orange-500/15' : 'bg-xorvin-primary/20'}
        accentBorder={isMod ? 'border-orange-500/25' : 'border-xorvin-primary/20'}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-14 lg:mt-0" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
