import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '@/constants/permissions';
import type { UserRole } from '@/types';

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  end?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarNavItem[];
}

interface DynamicSidebarProps {
  sections: SidebarSection[];
  accentColor?: string;     // Tailwind text color class e.g. 'text-purple-400'
  accentBg?: string;        // Tailwind bg class  e.g. 'bg-purple-500/20'
  accentBorder?: string;    // Tailwind border   e.g. 'border-purple-500/20'
  panelLabel: string;       // e.g. 'Super Admin', 'Event Manager'
}

export function DynamicSidebar({
  sections,
  accentColor = 'text-xorvin-accent',
  accentBg    = 'bg-xorvin-primary/20',
  accentBorder = 'border-xorvin-primary/20',
  panelLabel,
}: DynamicSidebarProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleLabel = user?.role ? ROLE_LABELS[user.role as UserRole] : '';
  const roleBadgeClass = user?.role ? ROLE_COLORS[user.role as UserRole] : '';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Panel Label */}
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <img src="/logo.png" alt="Xorvin" className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" />
        </Link>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-white/80 truncate">XORVIN</span>
          <span className={`text-[10px] uppercase tracking-widest font-semibold ${accentColor}`}>
            {panelLabel}
          </span>
        </div>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label={`${panelLabel} navigation`}>
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map(item => (
                <li key={item.href + item.label}>
                  <NavLink
                    to={item.href}
                    end={item.end ?? false}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                        isActive
                          ? `${accentBg} ${accentColor} border ${accentBorder}`
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${accentBg} ${accentColor} border ${accentBorder}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=0b1626&color=30D5FF&bold=true`}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded-full border ${roleBadgeClass}`}>
              {roleLabel}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> Site
          </Link>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 flex-shrink-0 glass border-r border-white/5 flex-col h-screen sticky top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile: Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl border border-white/10"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 glass border-r border-white/10 z-50 lg:hidden flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
