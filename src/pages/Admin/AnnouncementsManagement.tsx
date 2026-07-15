import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/atoms/Button';
import { Plus, Megaphone, Trash2, Edit3, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import * as Dialog from '@radix-ui/react-dialog';

export default function AnnouncementsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', title: '', content: '', type: 'info', is_active: true });

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data } = await supabase.from('announcements').select('*, profiles(name)').order('created_at', { ascending: false });
      return data || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (data.id) {
        const { error } = await supabase.from('announcements').update({
          title: data.title, content: data.content, type: data.type, is_active: data.is_active, updated_at: new Date().toISOString()
        }).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('announcements').insert([{
          title: data.title, content: data.content, type: data.type, is_active: data.is_active, created_by: user?.id
        }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast('Announcement saved successfully!', 'success');
      setIsModalOpen(false);
    },
    onError: (err: any) => toast(err.message, 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast('Announcement deleted', 'success');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleEdit = (announcement: any) => {
    setFormData({ id: announcement.id, title: announcement.title, content: announcement.content, type: announcement.type, is_active: announcement.is_active });
    setIsModalOpen(true);
  };

  return (
    <>
      <Helmet><title>Manage Announcements — Xorvin Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader 
          title="Announcements" 
          subtitle="Manage global platform alerts and notifications."
        />
        <Button onClick={() => { setFormData({ id: '', title: '', content: '', type: 'info', is_active: true }); setIsModalOpen(true); }} leftIcon={<Plus className="w-4 h-4" />}>
          New Announcement
        </Button>
      </div>

      <DataTable 
        data={announcements}
        searchField="title"
        emptyMessage={isLoading ? "Loading announcements..." : "No announcements found."}
        columns={[
          { key: 'title', header: 'Title', sortable: true, render: (row) => <span className="font-medium text-white">{row.title}</span> },
          { key: 'type', header: 'Type', sortable: true, render: (row) => (
            <span className={`px-2 py-1 rounded text-xs border ${
              row.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
              row.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
              row.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
              'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>{row.type}</span>
          )},
          { key: 'status', header: 'Status', render: (row) => (
            row.is_active ? 
              <span className="flex items-center gap-1 text-xs text-green-400"><Eye className="w-3 h-3" /> Active</span> : 
              <span className="flex items-center gap-1 text-xs text-white/40"><EyeOff className="w-3 h-3" /> Inactive</span>
          )},
          { key: 'created_at', header: 'Date', sortable: true, render: (row) => <span className="text-white/60 text-sm">{new Date(row.created_at).toLocaleDateString()}</span> },
          { key: 'actions', header: '', render: (row) => (
            <div className="flex justify-end gap-2">
              <button onClick={() => handleEdit(row)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-colors" title="Edit">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(row.id); }} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        ]}
      />

      {/* Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-xorvin-dark border border-white/10 rounded-2xl p-6 z-50 shadow-2xl focus:outline-none">
            <Dialog.Title className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-xorvin-accent" />
              {formData.id ? 'Edit Announcement' : 'New Announcement'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-dark w-full" placeholder="Announcement title..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Content</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="input-dark w-full resize-none" placeholder="Announcement details..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-dark w-full">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Status</label>
                  <label className="flex items-center gap-3 h-[42px] px-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer">
                    <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="rounded bg-black/50 border-white/20 text-xorvin-primary focus:ring-xorvin-primary/50" />
                    <span className="text-sm text-white/80">Active on site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : 'Save Announcement'}</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
