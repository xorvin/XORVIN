import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Flag, MessageSquare, Users, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MetricCard } from '@/components/molecules/MetricCard';
import { DataTable } from '@/components/molecules/DataTable';
import * as Tabs from '@radix-ui/react-tabs';
import { useToast } from '@/contexts/ToastContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function ModeratorDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['mod-stats'],
    queryFn: async () => {
      const [reports, flagged] = await Promise.all([
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
      ]);
      return { pendingReports: reports.count ?? 0, flaggedComments: flagged.count ?? 0 };
    },
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['mod-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*, profiles(name, username)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateReportStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from('reports').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast('Report updated successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['mod-reports'] });
      queryClient.invalidateQueries({ queryKey: ['mod-stats'] });
    }
  });

  const reportColumns = [
    {
      key: 'reporter',
      header: 'Reporter',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">
            {row.profiles?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{row.profiles?.name || 'Anonymous'}</p>
            <p className="text-xs text-white/40">@{row.profiles?.username || 'unknown'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'target',
      header: 'Reported Content',
      render: (row: any) => (
        <div>
          <p className="text-sm text-white/80 capitalize font-medium">{row.target_type}</p>
          <p className="text-xs text-white/40 font-mono mt-0.5" title={row.target_id}>{row.target_id.substring(0,8)}...</p>
        </div>
      )
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row: any) => (
        <p className="text-sm text-white/70 max-w-xs truncate" title={row.reason}>{row.reason}</p>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: any) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
          row.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
          row.status === 'reviewed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
          'bg-white/5 text-white/40 border-white/10'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (row: any) => (
        row.status === 'pending' ? (
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => updateReportStatus.mutate({ id: row.id, status: 'reviewed' })}
              className="p-1.5 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
              title="Mark as Reviewed (Action Taken)"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => updateReportStatus.mutate({ id: row.id, status: 'dismissed' })}
              className="p-1.5 rounded bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
              title="Dismiss Report (No Action)"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ) : null
      )
    }
  ];

  return (
    <>
      <Helmet><title>Moderator Dashboard — Xorvin</title></Helmet>
      
      <PageHeader 
        title="Moderation Center"
        subtitle="Review reports, flagged comments, and monitor community health."
      />

      <Tabs.Root defaultValue="reports" className="w-full">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-px">
          {['reports', 'spam_queue', 'comments'].map(tab => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-orange-400 data-[state=active]:border-b-2 data-[state=active]:border-orange-400 transition-colors capitalize whitespace-nowrap outline-none"
            >
              {tab.replace('_', ' ')}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="reports" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard label="Pending Reports" title="Pending Reports" value={stats?.pendingReports || 0} icon={<Flag className="w-5 h-5" />} color="#f97316" loading={statsLoading} />
            <MetricCard label="Flagged Comments" title="Flagged Comments" value={stats?.flaggedComments || 0} icon={<MessageSquare className="w-5 h-5" />} color="#ef4444" loading={statsLoading} />
            <MetricCard label="Active Bans" title="Active Temp Bans" value={0} icon={<Users className="w-5 h-5" />} color="#eab308" loading={statsLoading} />
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold font-space-grotesk text-white">Community Reports Queue</h2>
            </div>
            <DataTable 
              data={reports || []}
              columns={reportColumns}
              searchable={true}
              searchField="reason"
              emptyMessage={reportsLoading ? "Loading reports..." : "No reports found. Community is healthy!"}
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="spam_queue" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShieldCheck className="w-10 h-10 text-white/20 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Spam Detection Queue</h3>
            <p className="text-white/50 max-w-md">Automated flagged content and potential spam will be queued here for manual review.</p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="comments" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageSquare className="w-10 h-10 text-white/20 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Comment Moderation</h3>
            <p className="text-white/50 max-w-md">Review user discussions, flagged comments, and manage temporary mutes.</p>
          </div>
        </Tabs.Content>

      </Tabs.Root>
    </>
  );
}
