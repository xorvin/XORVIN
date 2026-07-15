import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, BookOpen, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicSidebar } from '@/components/organisms/DynamicSidebar';

const SECTIONS = [
  {
    title: 'Mentor',
    items: [
      { label: 'Dashboard',       href: '/mentor',                      icon: <LayoutDashboard className="w-4 h-4" />, end: true },
      { label: 'My Sessions',     href: '/mentor/sessions',             icon: <CalendarDays    className="w-4 h-4" /> },
      { label: 'My Mentees',      href: '/mentor/mentees',              icon: <Users           className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Resources',       href: '/mentor/resources',            icon: <BookOpen        className="w-4 h-4" /> },
      { label: 'Community Q&A',   href: '/mentor/qa',                   icon: <MessageCircle   className="w-4 h-4" /> },
    ],
  },
];

export function MentorLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated || !['mentor', 'admin', 'super_admin'].includes(user?.role ?? '')) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="min-h-screen flex bg-xorvin-dark">
      <DynamicSidebar
        sections={SECTIONS}
        panelLabel="Mentor"
        accentColor="text-indigo-400"
        accentBg="bg-indigo-500/15"
        accentBorder="border-indigo-500/25"
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-14 lg:mt-0" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
