import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Users, Award, Plus, Clock, MoreVertical, Edit2, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MetricCard } from '@/components/molecules/MetricCard';
import { DataTable } from '@/components/molecules/DataTable';
import * as Tabs from '@radix-ui/react-tabs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function EventManagerDashboard() {
  const { user } = useAuth();

  const { data: events, isLoading } = useQuery({
    queryKey: ['em-events', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const upcoming = events?.filter(e => e.status === 'upcoming').length ?? 0;
  const ongoing  = events?.filter(e => e.status === 'ongoing').length ?? 0;
  const total    = events?.length ?? 0;

  const statusColor: Record<string, string> = {
    upcoming:  'text-blue-400 bg-blue-500/15 border-blue-500/25',
    ongoing:   'text-green-400 bg-green-500/15 border-green-500/25',
    completed: 'text-white/40 bg-white/5 border-white/10',
    cancelled: 'text-red-400 bg-red-500/15 border-red-500/25',
  };

  const eventColumns = [
    {
      key: 'title',
      header: 'Event Name',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {row.banner_url ? (
              <img src={row.banner_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <Calendar className="w-4 h-4 text-white/40" />
            )}
          </div>
          <div>
            <p className="font-medium text-white text-sm hover:text-xorvin-accent transition-colors">
              <Link to={`/events/${row.slug}`}>{row.title}</Link>
            </p>
            <p className="text-xs text-white/40 mt-0.5">{row.event_type || 'Event'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'start_date',
      header: 'Date',
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-white/60">
          {new Date(row.start_date).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: any) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${statusColor[row.status] || statusColor.completed}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'registered_count',
      header: 'Registrations',
      sortable: true,
      render: (row: any) => (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-xorvin-accent">
          <Users className="w-4 h-4 text-white/40" /> {row.registered_count || 0}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (row: any) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" className="w-48 bg-xorvin-dark border border-white/10 rounded-xl p-1 shadow-xl z-50">
              <DropdownMenu.Item className="text-sm text-white/80 px-3 py-2 rounded-lg hover:bg-white/10 outline-none cursor-pointer flex items-center gap-2">
                <Link to={`/events/manage/${row.id}/edit`} className="flex items-center gap-2 w-full">
                  <Edit2 className="w-4 h-4" /> Edit Event
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-sm text-white/80 px-3 py-2 rounded-lg hover:bg-white/10 outline-none cursor-pointer flex items-center gap-2">
                <Users className="w-4 h-4" /> Manage Participants
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
              <DropdownMenu.Item className="text-sm text-white/80 px-3 py-2 rounded-lg hover:bg-white/10 outline-none cursor-pointer flex items-center gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )
    }
  ];

  return (
    <>
      <Helmet><title>Event Manager Dashboard — Xorvin</title></Helmet>

      <PageHeader 
        title="Event Manager Dashboard"
        subtitle="Manage hackathons, workshops, conferences, and track live registrations."
        actions={
          <Link to="/events/manage/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Create Event</Button>
          </Link>
        }
      />

      <Tabs.Root defaultValue="events" className="w-full">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-px">
          {['events', 'calendar', 'certificates', 'venues'].map(tab => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 transition-colors capitalize whitespace-nowrap outline-none"
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="events" className="space-y-6 outline-none">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard label="Total Events" title="Total Events" value={total} icon={<Calendar className="w-5 h-5" />} color="#3b82f6" loading={isLoading} />
            <MetricCard label="Upcoming" title="Upcoming" value={upcoming} icon={<Clock className="w-5 h-5" />} color="#10b981" loading={isLoading} />
            <MetricCard label="Live Now" title="Live Now" value={ongoing} icon={<Users className="w-5 h-5" />} color="#06b6d4" loading={isLoading} />
          </div>

          {/* Events Data Table */}
          <div className="mt-8">
            <h2 className="text-xl font-bold font-space-grotesk text-white mb-4">My Events</h2>
            <DataTable 
              data={events || []}
              columns={eventColumns}
              searchable={true}
              searchField="title"
              emptyMessage={isLoading ? "Loading events..." : "No events found. Click 'Create Event' to get started."}
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="calendar" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Calendar className="w-10 h-10 text-white/20 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Calendar View</h3>
            <p className="text-white/50 max-w-md">A full-month calendar showing all upcoming schedules will be displayed here.</p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="certificates" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Award className="w-10 h-10 text-white/20 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Certificate Generation</h3>
            <p className="text-white/50 max-w-md">Bulk generate and distribute verified certificates to event participants.</p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="venues" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Venue & Meeting Links</h3>
            <p className="text-white/50 max-w-md">Manage offline venues and online Zoom/Meet integrations.</p>
          </div>
        </Tabs.Content>

      </Tabs.Root>
    </>
  );
}
