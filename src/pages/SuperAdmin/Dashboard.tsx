import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import * as Tabs from '@radix-ui/react-tabs';
import { Users, Activity, Shield, Server, Database, FileText, CalendarDays, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MetricCard } from '@/components/molecules/MetricCard';
import { StatChart } from '@/components/molecules/StatChart';
import { DataTable } from '@/components/molecules/DataTable';
import { useQuery } from '@tanstack/react-query';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Real metrics from Supabase
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['super-admin-metrics'],
    queryFn: async () => {
      const [users, events, blogs, logs] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('audit_logs').select('id', { count: 'exact', head: true }),
      ]);
      return {
        users: users.count ?? 0,
        events: events.count ?? 0,
        blogs: blogs.count ?? 0,
        logs: logs.count ?? 0,
      };
    }
  });

  // Real daily registration trend (last 14 days)
  const { data: trafficData = [] } = useQuery({
    queryKey: ['super-admin-registrations-trend'],
    queryFn: async () => {
      // Get user registrations grouped by day for last 14 days
      const since = new Date();
      since.setDate(since.getDate() - 14);
      const { data } = await supabase
        .from('profiles')
        .select('joined_at')
        .gte('joined_at', since.toISOString())
        .order('joined_at', { ascending: true });

      // Group by date
      const counts: Record<string, number> = {};
      for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        counts[key] = 0;
      }
      (data || []).forEach((p: any) => {
        const key = new Date(p.joined_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        if (key in counts) counts[key]++;
      });

      return Object.entries(counts).map(([name, users]) => ({ name, users }));
    }
  });

  // Audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['super-admin-audit-logs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('audit_logs')
        .select('*, profiles(name, username)')
        .order('created_at', { ascending: false })
        .limit(100);
      return data || [];
    }
  });

  return (
    <>
      <Helmet><title>Super Admin Dashboard — Xorvin</title></Helmet>
      
      <PageHeader 
        title="Platform Control Center" 
        subtitle="Manage overall system health, roles, and global configurations."
      />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-px">
          {['overview', 'analytics', 'audit_logs', 'settings'].map(tab => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-xorvin-accent data-[state=active]:border-b-2 data-[state=active]:border-xorvin-accent transition-colors capitalize whitespace-nowrap outline-none"
            >
              {tab.replace('_', ' ')}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="overview" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Users"
              value={metrics?.users || 0}
              icon={<Users className="w-5 h-5" />}
              trend={5}
              loading={metricsLoading}
            />
            <MetricCard
              title="Active Events"
              value={metrics?.events || 0}
              icon={<CalendarDays className="w-5 h-5" />}
              trend={3}
              loading={metricsLoading}
            />
            <MetricCard
              title="Published Blogs"
              value={metrics?.blogs || 0}
              icon={<BookOpen className="w-5 h-5" />}
              loading={metricsLoading}
            />
            <MetricCard
              title="Audit Log Entries"
              value={metrics?.logs || 0}
              icon={<Shield className="w-5 h-5" />}
              loading={metricsLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StatChart
                title="New Registrations (Last 14 Days)"
                data={trafficData}
                dataKey="users"
                xAxisKey="name"
                color="#8b5cf6"
              />
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-white/80 font-medium mb-4 font-space-grotesk flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" /> Platform Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Total Users</span>
                    <span className="text-white font-medium">{metricsLoading ? '...' : metrics?.users.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Total Events</span>
                    <span className="text-white font-medium">{metricsLoading ? '...' : metrics?.events.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Total Blogs</span>
                    <span className="text-white font-medium">{metricsLoading ? '...' : metrics?.blogs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Audit Entries</span>
                    <span className="text-white font-medium">{metricsLoading ? '...' : metrics?.logs.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-white/80 font-medium mb-3 font-space-grotesk flex items-center gap-2">
                  <Server className="w-5 h-5 text-green-400" /> System Status
                </h3>
                <div className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium">All Systems Operational</span>
                </div>
                <p className="text-xs text-white/40 mt-2">Powered by Supabase hosted PostgreSQL</p>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="audit_logs" className="outline-none">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-space-grotesk text-white">System Audit Logs</h2>
            <p className="text-sm text-white/50">Immutable ledger of all administrative actions across the platform.</p>
          </div>
          
          <DataTable 
            data={auditLogs || []} 
            searchField="action"
            emptyMessage={logsLoading ? "Loading logs..." : "No audit logs found"}
            columns={[
              { 
                key: 'created_at', 
                header: 'Timestamp', 
                sortable: true,
                render: (row) => <span className="text-white/40">{new Date(row.created_at).toLocaleString()}</span>
              },
              { 
                key: 'actor', 
                header: 'Actor', 
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-400">
                      {row.profiles?.name?.charAt(0) || '?'}
                    </div>
                    <span>{row.profiles?.name || 'System'}</span>
                  </div>
                )
              },
              { 
                key: 'action', 
                header: 'Action', 
                sortable: true,
                render: (row) => (
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/80">
                    {row.action}
                  </span>
                )
              },
              { 
                key: 'target', 
                header: 'Target', 
                render: (row) => (
                  <span className="text-white/60 text-sm">
                    {row.target_type} {row.target_id ? `(${row.target_id.substring(0,8)}...)` : ''}
                  </span>
                )
              }
            ]}
          />
        </Tabs.Content>

        <Tabs.Content value="analytics" className="outline-none space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-space-grotesk text-white">Platform Analytics</h2>
            <p className="text-sm text-white/50">High-level insights and engagement metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white/80 font-medium mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-xorvin-accent" /> User Growth (Simulated)
              </h3>
              <StatChart 
                title=""
                data={trafficData}
                dataKey="users"
                xAxisKey="name"
                color="#30D5FF"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
              <Activity className="w-12 h-12 text-white/20 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Live Engagement</h3>
              <p className="text-sm text-white/50 max-w-sm mb-6">
                Active sessions and real-time pageviews tracking will be integrated here via a third-party analytics provider or Supabase Realtime presence.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-2xl font-bold text-green-400">1,204</p>
                  <p className="text-xs text-white/40 uppercase">Active Users (24h)</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-2xl font-bold text-purple-400">85</p>
                  <p className="text-xs text-white/40 uppercase">New Registrations</p>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="settings" className="outline-none space-y-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold font-space-grotesk text-white">System Configuration</h2>
            <p className="text-sm text-white/50">Manage global platform features and maintenance modes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature Flags */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" /> Platform Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Maintenance Mode</p>
                    <p className="text-xs text-white/50">Restrict access to super admins only</p>
                  </div>
                  <button className="w-11 h-6 bg-white/10 rounded-full relative transition-colors focus:outline-none">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Public Registration</p>
                    <p className="text-xs text-white/50">Allow new users to create accounts</p>
                  </div>
                  <button className="w-11 h-6 bg-purple-500 rounded-full relative transition-colors focus:outline-none">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Enforce 2FA</p>
                    <p className="text-xs text-white/50">Require two-factor auth for Admins</p>
                  </div>
                  <button className="w-11 h-6 bg-purple-500 rounded-full relative transition-colors focus:outline-none">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
              </div>
            </div>

            {/* Application Settings */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" /> Database & Storage
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Automated Backups</p>
                    <p className="text-xs text-white/50">Daily snapshot of database</p>
                  </div>
                  <button className="w-11 h-6 bg-purple-500 rounded-full relative transition-colors focus:outline-none">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Public Media CDN</p>
                    <p className="text-xs text-white/50">Cache static assets globally</p>
                  </div>
                  <button className="w-11 h-6 bg-white/10 rounded-full relative transition-colors focus:outline-none">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
