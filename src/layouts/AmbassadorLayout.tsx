import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Link2, BarChart2, Gift, FileText, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicSidebar } from '@/components/organisms/DynamicSidebar';

const SECTIONS = [
  {
    title: 'Ambassador',
    items: [
      { label: 'Dashboard',       href: '/ambassador',                  icon: <LayoutDashboard className="w-4 h-4" />, end: true },
      { label: 'Referral Link',   href: '/ambassador/referral',         icon: <Link2           className="w-4 h-4" /> },
      { label: 'Tracking',        href: '/ambassador/tracking',         icon: <BarChart2       className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Promo Kit',       href: '/ambassador/promo-kit',        icon: <Download        className="w-4 h-4" /> },
      { label: 'Submit Report',   href: '/ambassador/report',           icon: <FileText        className="w-4 h-4" /> },
      { label: 'Rewards',         href: '/ambassador/rewards',          icon: <Gift            className="w-4 h-4" /> },
    ],
  },
];

export function AmbassadorLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated || !['ambassador', 'admin', 'super_admin'].includes(user?.role ?? '')) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="min-h-screen flex bg-xorvin-dark">
      <DynamicSidebar
        sections={SECTIONS}
        panelLabel="Campus Ambassador"
        accentColor="text-pink-400"
        accentBg="bg-pink-500/15"
        accentBorder="border-pink-500/25"
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-14 lg:mt-0" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
