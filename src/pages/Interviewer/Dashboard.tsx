import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarClock, CheckCircle, Clock, User, Plus, Video, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { useInterviews } from '@/hooks/useInterviews';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MetricCard } from '@/components/molecules/MetricCard';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/atoms/Button';

const STATUS_STYLES: Record<string, string> = {
  scheduled:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed:  'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
  no_show:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

export default function InterviewerDashboard() {
  const { data: interviews, isLoading } = useInterviews();
  const today = new Date().toDateString();

  const todayInterviews = interviews?.filter(i => new Date(i.scheduled_at).toDateString() === today) ?? [];
  const upcoming = interviews?.filter(i => i.status === 'scheduled' && new Date(i.scheduled_at) > new Date()) ?? [];
  const completed = interviews?.filter(i => i.status === 'completed') ?? [];
  const pendingFeedback = completed.filter(i => !i.interview_feedback);

  const columns = [
    {
      key: 'candidate',
      header: 'Candidate',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <img
            src={row.candidate?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.candidate?.name ?? 'C')}&background=0b1626&color=30D5FF`}
            alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <p className="font-medium text-white text-sm">{row.candidate?.name ?? 'Unknown'}</p>
            <p className="text-xs text-white/40">{row.candidate?.college}</p>
          </div>
        </div>
      )
    },
    {
      key: 'scheduled_at',
      header: 'Scheduled',
      sortable: true,
      render: (row: any) => (
        <div>
          <p className="text-sm text-white/80">{new Date(row.scheduled_at).toLocaleDateString()}</p>
          <p className="text-xs text-white/40">{new Date(row.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      )
    },
    {
      key: 'duration_minutes',
      header: 'Duration',
      render: (row: any) => (
        <span className="text-sm text-white/60">{row.duration_minutes ?? 60} min</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: any) => (
        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${STATUS_STYLES[row.status] ?? ''}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          {row.meeting_link && (
            <a href={row.meeting_link} target="_blank" rel="noreferrer">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors">
                <Video className="w-3 h-3" /> Join
              </button>
            </a>
          )}
          {row.status === 'scheduled' && (
            <Link to={`/interviewer/notes/${row.id}`}>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium transition-colors">
                Notes
              </button>
            </Link>
          )}
          {row.status === 'completed' && !row.interview_feedback && (
            <Link to={`/interviewer/evaluate/${row.id}`}>
              <button className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium transition-colors">
                Evaluate
              </button>
            </Link>
          )}
          {row.interview_feedback && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <CheckCircle className="w-3 h-3" /> Graded {row.interview_feedback.overall_score}/10
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet><title>Interviewer Dashboard — Xorvin</title></Helmet>

      <PageHeader
        title="Interviewer Dashboard"
        subtitle="Manage your interview schedule, evaluate candidates, and track feedback."
        actions={
          <Link to="/interviewer/schedule">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Schedule Interview</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Today's Interviews" label="Today" value={todayInterviews.length} icon={<CalendarClock className="w-5 h-5" />} color="#06b6d4" loading={isLoading} />
        <MetricCard title="Upcoming" label="Upcoming" value={upcoming.length} icon={<Clock className="w-5 h-5" />} color="#3b82f6" loading={isLoading} />
        <MetricCard title="Completed" label="Completed" value={completed.length} icon={<CheckCircle className="w-5 h-5" />} color="#10b981" loading={isLoading} />
        <MetricCard title="Pending Feedback" label="Need Feedback" value={pendingFeedback.length} icon={<Star className="w-5 h-5" />} color="#f97316" loading={isLoading} />
      </div>

      <Tabs.Root defaultValue="all">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-6 pb-px overflow-x-auto">
          {[
            { value: 'all', label: 'All Interviews' },
            { value: 'today', label: "Today" },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending Feedback' },
          ].map(tab => (
            <Tabs.Trigger key={tab.value} value={tab.value}
              className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 transition-colors whitespace-nowrap outline-none">
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="all" className="outline-none">
          <DataTable data={interviews ?? []} columns={columns} searchable searchField="candidate.name"
            emptyMessage={isLoading ? "Loading interviews..." : "No interviews scheduled."} />
        </Tabs.Content>
        <Tabs.Content value="today" className="outline-none">
          <DataTable data={todayInterviews} columns={columns} emptyMessage="No interviews today." />
        </Tabs.Content>
        <Tabs.Content value="upcoming" className="outline-none">
          <DataTable data={upcoming} columns={columns} emptyMessage="No upcoming interviews." />
        </Tabs.Content>
        <Tabs.Content value="completed" className="outline-none">
          <DataTable data={completed} columns={columns} emptyMessage="No completed interviews." />
        </Tabs.Content>
        <Tabs.Content value="pending" className="outline-none">
          <DataTable data={pendingFeedback} columns={columns} emptyMessage="No pending feedback. Great job!" />
        </Tabs.Content>
      </Tabs.Root>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Candidate Database', href: '/interviewer/candidates', color: 'blue', icon: <User className="w-5 h-5" /> },
          { label: 'Interview Analytics', href: '/interviewer/analytics', color: 'purple', icon: <Star className="w-5 h-5" /> },
          { label: 'Schedule New', href: '/interviewer/schedule', color: 'cyan', icon: <Plus className="w-5 h-5" /> },
        ].map((action, i) => (
          <motion.div key={action.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={action.href} className={`flex items-center gap-4 p-5 rounded-2xl bg-${action.color}-500/10 border border-${action.color}-500/20 hover:bg-${action.color}-500/15 transition-colors`}>
              <div className={`w-10 h-10 rounded-xl bg-${action.color}-500/20 flex items-center justify-center text-${action.color}-400`}>{action.icon}</div>
              <span className="font-medium text-white">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
