import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, PenTool, FileText, HelpCircle, Mail, Image, Megaphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicSidebar } from '@/components/organisms/DynamicSidebar';

const SECTIONS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard',     href: '/content',             icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    ],
  },
  {
    title: 'Blog',
    items: [
      { label: 'Write Article', href: '/content/blogs/new',   icon: <PenTool  className="w-4 h-4" /> },
      { label: 'All Articles',  href: '/content/blogs',       icon: <FileText className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Site Content',
    items: [
      { label: 'FAQs',          href: '/content/faqs',        icon: <HelpCircle  className="w-4 h-4" /> },
      { label: 'Banners',       href: '/content/banners',     icon: <Image       className="w-4 h-4" /> },
      { label: 'Newsletters',   href: '/content/newsletters', icon: <Mail        className="w-4 h-4" /> },
      { label: 'Announcements', href: '/content/announcements',icon: <Megaphone  className="w-4 h-4" /> },
    ],
  },
];

export function ContentManagerLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated || !['content_manager', 'admin', 'super_admin'].includes(user?.role ?? '')) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="min-h-screen flex bg-xorvin-dark">
      <DynamicSidebar
        sections={SECTIONS}
        panelLabel="Content Manager"
        accentColor="text-green-400"
        accentBg="bg-green-500/15"
        accentBorder="border-green-500/25"
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-14 lg:mt-0" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
