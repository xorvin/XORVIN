import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Users, BookOpen, Plus, CheckCircle, Clock, Star, FileText, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { useMentorSessions, useMentorResources, useLearningPlans, useAssignments, useUpdateSession, useAddResource } from '@/hooks/useMentorSessions';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MetricCard } from '@/components/molecules/MetricCard';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/atoms/Button';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

function AddResourceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addResource = useAddResource();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: '', description: '', url: '', resource_type: 'link', is_public: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addResource.mutateAsync(form);
      toast('Resource added!', 'success');
      onClose();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-xorvin-dark border border-white/10 rounded-2xl p-6 z-10">
        <h3 className="font-bold text-white mb-4">Add Resource</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input-dark w-full" placeholder="Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <input className="input-dark w-full" placeholder="URL *" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} required />
          <textarea className="input-dark w-full" placeholder="Description (optional)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <select className="input-dark w-full" value={form.resource_type} onChange={e => setForm(p => ({ ...p, resource_type: e.target.value }))}>
              <option value="link">Link</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="github">GitHub</option>
            </select>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_public" checked={form.is_public} onChange={e => setForm(p => ({ ...p, is_public: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="is_public" className="text-sm text-white/70">Public</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={addResource.isPending}>Add Resource</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MentorDashboard() {
  const { user } = useAuth();
  const { data: sessions, isLoading } = useMentorSessions();
  const { data: resources } = useMentorResources();
  const { data: plans } = useLearningPlans();
  const { data: assignments } = useAssignments();
  const updateSession = useUpdateSession();
  const { toast } = useToast();
  const [addResourceOpen, setAddResourceOpen] = useState(false);
  const [completeConfirm, setCompleteConfirm] = useState<{ open: boolean; sessionId: string | null }>({ open: false, sessionId: null });

  const myUpcoming = sessions?.filter(s => s.mentor_id === user?.id && s.status === 'scheduled') ?? [];
  const myCompleted = sessions?.filter(s => s.mentor_id === user?.id && s.status === 'completed') ?? [];

  const sessionColumns = [
    {
      key: 'mentee',
      header: 'Mentee',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <img src={row.mentee?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.mentee?.name ?? 'M')}&background=0b1626&color=6366f1`}
            alt="" className="w-9 h-9 rounded-full object-cover" />
          <div>
            <p className="font-medium text-white text-sm">{row.mentee?.name}</p>
            <p className="text-xs text-white/40">{row.mentee?.college}</p>
          </div>
        </div>
      )
    },
    {
      key: 'topic',
      header: 'Topic',
      render: (row: any) => <p className="text-sm text-white/80">{row.topic}</p>
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
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${
          row.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
          row.status === 'scheduled' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
          'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>{row.status}</span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (row: any) => (
        <div className="flex justify-end gap-2">
          {row.meeting_link && (
            <a href={row.meeting_link} target="_blank" rel="noreferrer">
              <button className="px-3 py-1.5 text-xs rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors">Join</button>
            </a>
          )}
          {row.status === 'scheduled' && (
            <button onClick={() => setCompleteConfirm({ open: true, sessionId: row.id })}
              className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors">
              Mark Done
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet><title>Mentor Dashboard — Xorvin</title></Helmet>

      <PageHeader
        title="Mentor Dashboard"
        subtitle="Manage your mentees, schedule sessions, and publish learning resources."
        actions={
          <Link to="/mentor/sessions/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Book Session</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Upcoming Sessions" label="Upcoming" value={myUpcoming.length} icon={<CalendarDays className="w-5 h-5" />} color="#6366f1" loading={isLoading} />
        <MetricCard title="Completed" label="Completed" value={myCompleted.length} icon={<CheckCircle className="w-5 h-5" />} color="#10b981" loading={isLoading} />
        <MetricCard title="Resources" label="Resources" value={resources?.length ?? 0} icon={<BookOpen className="w-5 h-5" />} color="#3b82f6" loading={false} />
        <MetricCard title="Learning Plans" label="Plans" value={plans?.length ?? 0} icon={<FileText className="w-5 h-5" />} color="#f59e0b" loading={false} />
      </div>

      <Tabs.Root defaultValue="sessions">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-6 pb-px overflow-x-auto">
          {['sessions', 'resources', 'plans', 'assignments'].map(tab => (
            <Tabs.Trigger key={tab} value={tab}
              className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-400 transition-colors capitalize whitespace-nowrap outline-none">
              {tab.replace('_', ' ')}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="sessions" className="outline-none">
          <DataTable data={sessions ?? []} columns={sessionColumns} searchable searchField="topic"
            emptyMessage={isLoading ? "Loading sessions..." : "No sessions yet."} />
        </Tabs.Content>

        <Tabs.Content value="resources" className="outline-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white">Learning Resources</h3>
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddResourceOpen(true)}>Add Resource</Button>
          </div>
          {!resources || resources.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <BookMarked className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-white/40">No resources added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((r: any) => (
                <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    r.resource_type === 'video' ? 'bg-red-500/10 text-red-400' :
                    r.resource_type === 'pdf' ? 'bg-red-600/10 text-red-400' :
                    r.resource_type === 'github' ? 'bg-white/10 text-white' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{r.title}</p>
                    {r.description && <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{r.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline">Open →</a>
                      {r.is_public && <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">Public</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Tabs.Content>

        <Tabs.Content value="plans" className="outline-none">
          {!plans || plans.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <FileText className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-white/40">No learning plans created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan: any) => (
                <div key={plan.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-white">{plan.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">Mentee: {plan.mentee?.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${
                      plan.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      plan.status === 'active' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      'bg-white/5 text-white/40 border-white/10'
                    }`}>{plan.status}</span>
                  </div>
                  {plan.goals?.length > 0 && (
                    <ul className="space-y-1">
                      {plan.goals.map((goal: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" /> {goal}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </Tabs.Content>

        <Tabs.Content value="assignments" className="outline-none">
          {!assignments || assignments.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Star className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-white/40">No assignments given yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((a: any) => (
                <div key={a.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{a.title}</p>
                    <p className="text-xs text-white/40">{a.mentee?.name} • Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No deadline'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${
                    a.status === 'reviewed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    a.status === 'submitted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </Tabs.Content>
      </Tabs.Root>

      <AddResourceModal open={addResourceOpen} onClose={() => setAddResourceOpen(false)} />

      <ConfirmDialog
        open={completeConfirm.open}
        onOpenChange={open => !open && setCompleteConfirm({ open: false, sessionId: null })}
        title="Mark Session Complete"
        description="Confirm you have completed this mentoring session. This will update the session status and award XP to both you and your mentee."
        confirmText="Mark Complete"
        onConfirm={async () => {
          if (completeConfirm.sessionId) {
            await updateSession.mutateAsync({ id: completeConfirm.sessionId, status: 'completed' });
            toast('Session marked as complete!', 'success');
            setCompleteConfirm({ open: false, sessionId: null });
          }
        }}
      />
    </>
  );
}
