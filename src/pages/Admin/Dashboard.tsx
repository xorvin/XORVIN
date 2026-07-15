import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Calendar, FileText, Trophy, ArrowUpRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useAdminStats, useAdminRecentEvents, useAdminRecentBlogs } from '@/hooks/useAdminData';

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentEvents = [], isLoading: eventsLoading } = useAdminRecentEvents(5);
  const { data: recentPosts = [], isLoading: blogsLoading } = useAdminRecentBlogs(4);

  const statCards = [
    { label: 'Total Members',  value: stats?.members ?? 0,      icon: <Users className="w-6 h-6" />,    color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
    { label: 'Active Events',  value: stats?.events ?? 0,       icon: <Calendar className="w-6 h-6" />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Blog Posts',     value: stats?.blogs ?? 0,        icon: <FileText className="w-6 h-6" />, color: 'text-green-400',  bg: 'bg-green-500/10'  },
    { label: 'Competitions',   value: stats?.competitions ?? 0, icon: <Trophy className="w-6 h-6" />,   color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — Xorvin</title></Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-space-grotesk text-white">Dashboard</h1>
          <p className="text-white/50 mt-1">Welcome back. Here's what's happening with Xorvin today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <div key={card.label} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              {statsLoading ? (
                <Skeleton className="h-9 w-20 mb-1" />
              ) : (
                <p className="text-3xl font-bold font-space-grotesk text-white mb-1">
                  {card.value.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-white/50">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-bold font-space-grotesk text-white">Recent Events</h2>
              <Link to="/admin/events" className="text-xorvin-accent text-sm hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {eventsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-6 py-4"><Skeleton className="h-12 w-full" /></div>
                ))
              ) : recentEvents.length === 0 ? (
                <div className="px-6 py-8 text-center text-white/40 text-sm">No events yet.</div>
              ) : (
                recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                    <img src={event.coverImage} alt={event.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{event.title}</p>
                      <p className="text-xs text-white/40 capitalize">{event.category} • {new Date(event.startDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                      event.status === 'ongoing'  ? 'bg-green-500/20 text-green-400' :
                                                    'bg-white/10 text-white/40'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold font-space-grotesk text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'New Event',     to: '/admin/events',     color: 'text-blue-400'   },
                  { label: 'New Blog',      to: '/admin/blogs',      color: 'text-green-400'  },
                  { label: 'Add User',      to: '/admin/users',      color: 'text-purple-400' },
                  { label: 'Leaderboard',   to: '/admin/leaderboard',color: 'text-yellow-400' },
                ].map((a) => (
                  <Link key={a.label} to={a.to} className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center text-sm font-medium ${a.color}`}>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h2 className="font-bold font-space-grotesk text-white text-sm">Recent Posts</h2>
                <Link to="/admin/blogs" className="text-xorvin-accent text-xs hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-white/5">
                {blogsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="px-5 py-3"><Skeleton className="h-8 w-full" /></div>
                  ))
                ) : recentPosts.length === 0 ? (
                  <div className="px-5 py-6 text-center text-white/40 text-sm">No blog posts yet.</div>
                ) : (
                  recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{post.title}</p>
                        <p className="text-xs text-white/40">{post.readTime} min read</p>
                      </div>
                      <Eye className="w-4 h-4 text-white/20" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
