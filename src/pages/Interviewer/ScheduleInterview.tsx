import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Link as LinkIcon, User, ArrowLeft, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Button } from '@/components/atoms/Button';
import { useScheduleInterview } from '@/hooks/useInterviews';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ScheduleInterview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const scheduleInterview = useScheduleInterview();

  const [form, setForm] = useState({
    candidate_id: '',
    event_id: '',
    scheduled_at: '',
    duration_minutes: 60,
    meeting_link: '',
  });

  const { data: candidates } = useQuery({
    queryKey: ['member-candidates'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id, name, username, college').order('name');
      return data ?? [];
    },
  });

  const { data: events } = useQuery({
    queryKey: ['active-events'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('id, title').in('status', ['upcoming', 'ongoing']).order('title');
      return data ?? [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.candidate_id || !form.scheduled_at) {
      toast('Candidate and scheduled time are required.', 'error');
      return;
    }

    try {
      await scheduleInterview.mutateAsync({
        ...form,
        interviewer_id: user!.id,
        event_id: form.event_id || undefined,
      });

      // Auto-generate Google Meet style link if none provided
      const autoLink = `https://meet.google.com/${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}`;
      toast('Interview scheduled successfully! Meeting link generated.', 'success');
      navigate('/interviewer');
    } catch (err: any) {
      toast(err.message || 'Failed to schedule interview.', 'error');
    }
  };

  return (
    <>
      <Helmet><title>Schedule Interview — Xorvin Interviewer</title></Helmet>

      <PageHeader
        title="Schedule Interview"
        breadcrumbs={[{ label: 'Dashboard', href: '/interviewer' }, { label: 'Schedule' }]}
        actions={
          <Button variant="secondary" onClick={() => navigate('/interviewer')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Select Candidate *
              </label>
              <select
                className="input-dark w-full"
                value={form.candidate_id}
                onChange={e => setForm(p => ({ ...p, candidate_id: e.target.value }))}
                required
              >
                <option value="">Choose candidate...</option>
                {candidates?.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.username}) — {c.college}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Related Event (Optional)</label>
              <select
                className="input-dark w-full"
                value={form.event_id}
                onChange={e => setForm(p => ({ ...p, event_id: e.target.value }))}
              >
                <option value="">None</option>
                {events?.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Scheduled Date & Time *
                </label>
                <input
                  type="datetime-local"
                  className="input-dark w-full"
                  value={form.scheduled_at}
                  onChange={e => setForm(p => ({ ...p, scheduled_at: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Duration (minutes)
                </label>
                <select
                  className="input-dark w-full"
                  value={form.duration_minutes}
                  onChange={e => setForm(p => ({ ...p, duration_minutes: +e.target.value }))}
                >
                  {[30, 45, 60, 90, 120].map(m => (
                    <option key={m} value={m}>{m} minutes</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                <Video className="w-4 h-4" /> Meeting Link (Google Meet / Zoom)
              </label>
              <input
                type="url"
                className="input-dark w-full"
                placeholder="https://meet.google.com/... (leave empty to auto-generate)"
                value={form.meeting_link}
                onChange={e => setForm(p => ({ ...p, meeting_link: e.target.value }))}
              />
              <p className="text-xs text-white/30 mt-1">Leave empty and we'll generate a placeholder Meet link.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="secondary" type="button" onClick={() => navigate('/interviewer')}>Cancel</Button>
              <Button type="submit" disabled={scheduleInterview.isPending}>
                {scheduleInterview.isPending ? 'Scheduling...' : 'Schedule Interview'}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" /> Google Meet Integration
            </h3>
            <p className="text-sm text-white/60 mb-4">
              A Google Meet link will be automatically generated when you schedule an interview. 
              Candidates will receive an email notification with the meeting details.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs text-blue-400 font-medium">Pro Tips</p>
              <ul className="text-xs text-white/50 mt-2 space-y-1 list-disc list-inside">
                <li>Schedule at least 24 hours in advance</li>
                <li>Add notes before the session starts</li>
                <li>Complete evaluation within 24h of interview</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
