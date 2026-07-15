import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DataTable } from '@/components/molecules/DataTable';
import { ShieldAlert, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ReportsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending'); // pending, reviewed, dismissed

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data } = await supabase.from('reports').select('*, profiles!reporter_id(name, email)').order('created_at', { ascending: false });
      return data || [];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from('reports').update({ 
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast('Report status updated', 'success');
    },
    onError: (err: any) => toast(err.message, 'error')
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast('Report deleted', 'success');
    }
  });

  const filteredReports = reports.filter((r: any) => filter === 'all' || r.status === filter);

  return (
    <>
      <Helmet><title>Moderation Reports — Xorvin Admin</title></Helmet>
      
      <div className="mb-8">
        <PageHeader 
          title="Moderation Reports" 
          subtitle="Review user-reported content, events, and other users."
        />
      </div>

      <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
        {['pending', 'reviewed', 'dismissed', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap ${
              filter === f ? 'bg-xorvin-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f} {f !== 'all' && `(${reports.filter((r:any) => r.status === f).length})`}
          </button>
        ))}
      </div>

      <DataTable 
        data={filteredReports}
        searchField="reason"
        emptyMessage={isLoading ? "Loading reports..." : "No reports found."}
        columns={[
          { key: 'reporter', header: 'Reporter', render: (row) => (
            <div>
              <p className="font-medium text-white">{row.profiles?.name || 'Unknown'}</p>
              <p className="text-xs text-white/50">{row.profiles?.email}</p>
            </div>
          )},
          { key: 'target', header: 'Target', render: (row) => (
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/80 uppercase">{row.target_type}</span>
              <p className="text-xs text-white/60 mt-1 font-mono">{row.target_id.substring(0, 8)}...</p>
            </div>
          )},
          { key: 'reason', header: 'Reason', render: (row) => <span className="text-sm text-white/80 line-clamp-2" title={row.reason}>{row.reason}</span> },
          { key: 'status', header: 'Status', sortable: true, render: (row) => (
            <span className={`px-2 py-1 rounded text-xs border uppercase tracking-wider font-semibold ${
              row.status === 'reviewed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
              row.status === 'dismissed' ? 'bg-white/5 border-white/10 text-white/40' :
              'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            }`}>{row.status}</span>
          )},
          { key: 'created_at', header: 'Date', sortable: true, render: (row) => <span className="text-white/60 text-sm">{new Date(row.created_at).toLocaleDateString()}</span> },
          { key: 'actions', header: '', render: (row) => (
            <div className="flex justify-end gap-2">
              {row.status === 'pending' && (
                <>
                  <button onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'reviewed' })} className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors" title="Mark as Reviewed">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'dismissed' })} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 transition-colors" title="Dismiss">
                    <XCircle className="w-4 h-4" />
                  </button>
                </>
              )}
              <button onClick={() => { if(confirm('Delete report permanently?')) deleteReportMutation.mutate(row.id); }} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        ]}
      />
    </>
  );
}
