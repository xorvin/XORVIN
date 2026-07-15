import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Image, Users, Calendar as CalendarIcon, MapPin, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/atoms/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MarkdownEditor } from '@/components/molecules/MarkdownEditor';
import { useToast } from '@/contexts/ToastContext';

export default function EventWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id && id !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    event_type: 'hackathon',
    start_date: '',
    end_date: '',
    status: 'upcoming',
    capacity: 0,
    banner_url: '',
    is_online: true,
    location: '',
  });

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-edit', id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        slug: event.slug || '',
        description: event.description || '',
        event_type: event.event_type || 'hackathon',
        start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
        end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
        status: event.status || 'upcoming',
        capacity: event.capacity || 0,
        banner_url: event.banner_url || '',
        is_online: event.is_online !== false,
        location: event.location || '',
      });
    }
  }, [event]);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title, slug: !isEditing ? generateSlug(title) : prev.slug }));
  };

  const saveMutation = useMutation({
    mutationFn: async (dataToSave: typeof formData) => {
      if (isEditing) {
        const { error } = await supabase.from('events').update(dataToSave).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert([dataToSave]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast('Event saved successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['em-events'] });
      navigate('/events/manage');
    },
    onError: (error: any) => toast(error.message || 'Failed to save event', 'error')
  });

  if (isLoading) return <div className="p-8 text-white/50 text-center">Loading wizard...</div>;

  return (
    <>
      <Helmet><title>{isEditing ? 'Edit Event' : 'Create Event'} — Event Manager</title></Helmet>

      <PageHeader 
        title={isEditing ? 'Edit Event' : 'Event Builder Wizard'}
        breadcrumbs={[{ label: 'Dashboard', href: '/events/manage' }, { label: isEditing ? 'Edit' : 'Create' }]}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/events/manage')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button 
              onClick={() => saveMutation.mutate(formData)}
              disabled={saveMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white border-none"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Event
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white mb-4">Core Details</h3>
            <div>
              <label className="block text-sm text-white/60 mb-1">Event Title</label>
              <input type="text" className="input-dark w-full text-lg" value={formData.title} onChange={handleTitleChange} />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Description</label>
              <MarkdownEditor value={formData.description} onChange={(v) => setFormData(p => ({ ...p, description: v || '' }))} height={300} />
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <h3 className="font-bold text-white mb-4">Scheduling & Location</h3>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1 flex items-center gap-1"><CalendarIcon className="w-4 h-4"/> Start Date & Time</label>
              <input type="datetime-local" className="input-dark w-full" value={formData.start_date} onChange={(e) => setFormData(p => ({ ...p, start_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1 flex items-center gap-1"><CalendarIcon className="w-4 h-4"/> End Date & Time</label>
              <input type="datetime-local" className="input-dark w-full" value={formData.end_date} onChange={(e) => setFormData(p => ({ ...p, end_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Event Format</label>
              <select className="input-dark w-full" value={formData.is_online ? 'online' : 'offline'} onChange={(e) => setFormData(p => ({ ...p, is_online: e.target.value === 'online' }))}>
                <option value="online">Online / Virtual</option>
                <option value="offline">In-Person / Offline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4"/> Location / Link</label>
              <input type="text" className="input-dark w-full" placeholder={formData.is_online ? "https://zoom.us/..." : "123 Main St..."} value={formData.location} onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white mb-4">Configuration</h3>
            <div>
              <label className="block text-sm text-white/60 mb-1">URL Slug</label>
              <input type="text" className="input-dark w-full" value={formData.slug} onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Event Type</label>
              <select className="input-dark w-full" value={formData.event_type} onChange={(e) => setFormData(p => ({ ...p, event_type: e.target.value }))}>
                <option value="hackathon">Hackathon</option>
                <option value="workshop">Workshop</option>
                <option value="competition">Competition</option>
                <option value="conference">Conference</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Status</label>
              <select className="input-dark w-full" value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Live / Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1 flex items-center gap-1"><Users className="w-4 h-4"/> Capacity (0 for unlimited)</label>
              <input type="number" className="input-dark w-full" min="0" value={formData.capacity} onChange={(e) => setFormData(p => ({ ...p, capacity: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1 flex items-center gap-1"><Image className="w-4 h-4"/> Banner URL</label>
              <input type="text" className="input-dark w-full" placeholder="https://..." value={formData.banner_url} onChange={(e) => setFormData(p => ({ ...p, banner_url: e.target.value }))} />
              {formData.banner_url && <img src={formData.banner_url} alt="Banner Preview" className="mt-2 w-full h-24 object-cover rounded-lg border border-white/10" />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
