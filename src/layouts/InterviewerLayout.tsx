import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, Users, ClipboardCheck, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicSidebar } from '@/components/organisms/DynamicSidebar';

const SECTIONS = [
  {
    title: 'Interviews',
    items: [
      { label: 'Dashboard',      href: '/interviewer',                   icon: <LayoutDashboard className="w-4 h-4" />, end: true },
      { label: 'My Schedule',    href: '/interviewer/schedule',          icon: <CalendarClock   className="w-4 h-4" /> },
      { label: 'My Candidates',  href: '/interviewer/candidates',        icon: <Users           className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Actions',
    items: [
      { label: 'Submit Feedback',href: '/interviewer/feedback',          icon: <ClipboardCheck  className="w-4 h-4" /> },
      { label: 'Certificates',   href: '/interviewer/certificates',      icon: <Award           className="w-4 h-4" /> },
    ],
  },
];

export function InterviewerLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated || !['interviewer', 'admin', 'super_admin'].includes(user?.role ?? '')) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="min-h-screen flex bg-xorvin-dark">
      <DynamicSidebar
        sections={SECTIONS}
        panelLabel="Interviewer"
        accentColor="text-cyan-400"
        accentBg="bg-cyan-500/15"
        accentBorder="border-cyan-500/25"
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-14 lg:mt-0" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
