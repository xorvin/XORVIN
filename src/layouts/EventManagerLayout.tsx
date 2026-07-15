import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, Calendar, Users, Award, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicSidebar } from '@/components/organisms/DynamicSidebar';

const SECTIONS = [
  {
    title: 'Events',
    items: [
      { label: 'My Dashboard',    href: '/events/manage',                 icon: <LayoutDashboard className="w-4 h-4" />, end: true },
      { label: 'Create Event',    href: '/events/manage/new',             icon: <CalendarPlus    className="w-4 h-4" /> },
      { label: 'All My Events',   href: '/events/manage/list',            icon: <Calendar        className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Participants',
    items: [
      { label: 'Registrations',   href: '/events/manage/registrations',   icon: <Users          className="w-4 h-4" /> },
      { label: 'Winners',         href: '/events/manage/winners',         icon: <ClipboardList   className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Records',
    items: [
      { label: 'Certificates',    href: '/events/manage/certificates',    icon: <Award          className="w-4 h-4" /> },
    ],
  },
];

export function EventManagerLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated || !['event_manager', 'admin', 'super_admin'].includes(user?.role ?? '')) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="min-h-screen flex bg-xorvin-dark">
      <DynamicSidebar
        sections={SECTIONS}
        panelLabel="Event Manager"
        accentColor="text-blue-400"
        accentBg="bg-blue-500/15"
        accentBorder="border-blue-500/25"
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-14 lg:mt-0" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
