import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Download, Users, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/atoms/Button';
import { useToast } from '@/contexts/ToastContext';

export default function RegistrationManager() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: event } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('title, slug').eq('id', id).single();
      return data;
    },
    enabled: !!id,
  });

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['event-registrations', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          id, 
          status, 
          registered_at, 
          profiles (id, name, username, email)
        `)
        .eq('event_id', id)
        .order('registered_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  const handleExportCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast('No data to export', 'error');
      return;
    }
    
    // Create CSV content
    const headers = ['Name', 'Username', 'Status', 'Registered At'];
    const rows = registrations.map(r => {
      const profile = (Array.isArray(r.profiles) ? r.profiles[0] : r.profiles) as any;
      return [
        profile?.name || '',
        profile?.username || '',
        r.status,
        new Date(r.registered_at).toLocaleString()
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${event?.slug || 'event'}_registrations.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      key: 'user',
      header: 'Participant',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
            {row.profiles?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-medium text-white text-sm">{row.profiles?.name || 'Unknown User'}</p>
            <p className="text-xs text-white/40">@{row.profiles?.username}</p>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: any) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
          row.status === 'registered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
          row.status === 'waitlisted' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
          'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'registered_at',
      header: 'Registration Date',
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-white/60">
          {new Date(row.registered_at).toLocaleString()}
        </span>
      )
    }
  ];

  return (
    <>
      <Helmet><title>Manage Registrations — Event Manager</title></Helmet>

      <PageHeader 
        title="Participant List"
        subtitle={event ? `Viewing registrations for ${event.title}` : 'Loading...'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/events/manage' },
          { label: event?.title || 'Event' }
        ]}
        actions={
          <>
            <Link to="/events/manage">
              <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
            </Link>
            <Button variant="secondary" leftIcon={<Mail className="w-4 h-4" />}>Email All</Button>
            <Button onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />} variant="primary">
              Export CSV
            </Button>
          </>
        }
      />

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-space-grotesk">{registrations?.length || 0}</p>
            <p className="text-sm text-white/50">Total Registrations</p>
          </div>
        </div>
      </div>

      <DataTable 
        data={registrations || []}
        columns={columns}
        searchable={true}
        emptyMessage={isLoading ? "Loading participants..." : "No users have registered yet."}
      />
    </>
  );
}
