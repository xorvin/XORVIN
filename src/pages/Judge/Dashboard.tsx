import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Star, CheckCircle, Clock, ExternalLink, BarChart2, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MetricCard } from '@/components/molecules/MetricCard';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/atoms/Button';
import { useAllSubmissions } from '@/hooks/useSubmissions';

export default function JudgeDashboard() {
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['judge-competitions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('id, title, status, registered_count, start_date, end_date, slug')
        .in('category', ['hackathon', 'competition', 'ctf', 'ai-challenge'])
        .order('start_date', { ascending: false });
      return data ?? [];
    },
  });

  const { data: submissions, isLoading: subsLoading } = useAllSubmissions();

  const active = events?.filter(e => e.status === 'ongoing') ?? [];
  const upcoming = events?.filter(e => e.status === 'upcoming') ?? [];
  const pendingEval = submissions?.filter((s: any) => !s.evaluations || s.evaluations.length === 0) ?? [];

  const competitionColumns = [
    {
      key: 'title',
      header: 'Competition',
      render: (row: any) => (
        <div>
          <p className="font-medium text-white text-sm">{row.title}</p>
          <p className="text-xs text-white/40">{row.registered_count} participants</p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: any) => (
        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${
          row.status === 'ongoing' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
          row.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
          'bg-white/5 text-white/40 border-white/10'
        }`}>{row.status}</span>
      )
    },
    {
      key: 'dates',
      header: 'Timeline',
      render: (row: any) => (
        <div>
          <p className="text-xs text-white/60">{new Date(row.start_date).toLocaleDateString()}</p>
          <p className="text-xs text-white/30">to {new Date(row.end_date).toLocaleDateString()}</p>
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (row: any) => (
        <div className="flex gap-2 justify-end">
          <Link to={`/judge/submissions/${row.id}`}>
            <Button size="sm">View Submissions</Button>
          </Link>
          <Link to={`/judge/rankings/${row.id}`}>
            <button className="px-3 py-1.5 text-xs rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-colors">Rankings</button>
          </Link>
        </div>
      )
    }
  ];

  const submissionColumns = [
    {
      key: 'project',
      header: 'Project',
      render: (row: any) => (
        <div>
          <p className="font-medium text-white text-sm">{row.project_title}</p>
          <p className="text-xs text-white/40">{row.team_name}</p>
        </div>
      )
    },
    {
      key: 'event',
      header: 'Competition',
      render: (row: any) => (
        <span className="text-xs text-white/60">{row.event?.title || '—'}</span>
      )
    },
    {
      key: 'technologies',
      header: 'Tech Stack',
      render: (row: any) => (
        <div className="flex flex-wrap gap-1">
          {(row.technologies ?? []).slice(0, 3).map((t: string) => (
            <span key={t} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-white/60">{t}</span>
          ))}
        </div>
      )
    },
    {
      key: 'score',
      header: 'Avg Score',
      render: (row: any) => {
        const evals = row.evaluations ?? [];
        const avg = evals.length ? (evals.reduce((s: number, e: any) => s + (e.overall ?? 0), 0) / evals.length).toFixed(1) : '—';
        return <span className="font-bold text-yellow-400">{avg}{evals.length > 0 ? '/10' : ''}</span>;
      }
    },
    {
      key: 'actions',
      header: '',
      render: (row: any) => (
        <div className="flex gap-2 justify-end">
          <Link to={`/judge/evaluate/${row.id}`}>
            <Button size="sm">{row.evaluations?.length > 0 ? 'Update Score' : 'Score Now'}</Button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet><title>Judge Dashboard — Xorvin</title></Helmet>

      <PageHeader
        title="Judge Dashboard"
        subtitle="Score submissions, publish rankings, and approve competition results."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Active Competitions" label="Active" value={active.length} icon={<Trophy className="w-5 h-5" />} color="#f59e0b" loading={eventsLoading} />
        <MetricCard title="Upcoming" label="Upcoming" value={upcoming.length} icon={<Clock className="w-5 h-5" />} color="#3b82f6" loading={eventsLoading} />
        <MetricCard title="Total Submissions" label="Submissions" value={submissions?.length ?? 0} icon={<BarChart2 className="w-5 h-5" />} color="#8b5cf6" loading={subsLoading} />
        <MetricCard title="Pending Eval" label="Pending Eval" value={pendingEval.length} icon={<Star className="w-5 h-5" />} color="#ef4444" loading={subsLoading} />
      </div>

      <Tabs.Root defaultValue="competitions">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-6 pb-px overflow-x-auto">
          {['competitions', 'submissions', 'history'].map(tab => (
            <Tabs.Trigger key={tab} value={tab}
              className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-yellow-400 data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 transition-colors capitalize whitespace-nowrap outline-none">
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="competitions" className="outline-none">
          <DataTable data={events ?? []} columns={competitionColumns} searchable searchField="title"
            emptyMessage={eventsLoading ? "Loading competitions..." : "No competitions assigned."} />
        </Tabs.Content>

        <Tabs.Content value="submissions" className="outline-none">
          <DataTable data={submissions ?? []} columns={submissionColumns} searchable searchField="project_title"
            emptyMessage={subsLoading ? "Loading submissions..." : "No submissions found."} />
        </Tabs.Content>

        <Tabs.Content value="history" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20">
            <Award className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Evaluation History</h3>
            <p className="text-white/40 text-sm">Your past evaluation history will appear here.</p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
