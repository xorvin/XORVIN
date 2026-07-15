import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Star, BarChart2, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicSidebar } from '@/components/organisms/DynamicSidebar';

const SECTIONS = [
  {
    title: 'Judging',
    items: [
      { label: 'Dashboard',        href: '/judge',               icon: <LayoutDashboard className="w-4 h-4" />, end: true },
      { label: 'Score Submissions',href: '/judge/score',          icon: <Star            className="w-4 h-4" /> },
      { label: 'Rankings',         href: '/judge/rankings',       icon: <BarChart2       className="w-4 h-4" /> },
      { label: 'Leaderboard',      href: '/judge/leaderboard',    icon: <Trophy          className="w-4 h-4" /> },
    ],
  },
];

export function JudgeLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
      <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated || !['judge', 'admin', 'super_admin'].includes(user?.role ?? '')) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="min-h-screen flex bg-xorvin-dark">
      <DynamicSidebar
        sections={SECTIONS}
        panelLabel="Judge"
        accentColor="text-yellow-400"
        accentBg="bg-yellow-500/15"
        accentBorder="border-yellow-500/25"
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-14 lg:mt-0" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
