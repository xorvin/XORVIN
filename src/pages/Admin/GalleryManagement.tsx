import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Button } from '@/components/atoms/Button';
import { Image as ImageIcon, Upload, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function GalleryManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  const { data: gallery = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data } = await supabase.from('gallery_items').select('*, profiles(name)').order('created_at', { ascending: false });
      return data || [];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('gallery_items').insert([{
        title: file.name,
        image_url: publicUrl,
        uploaded_by: user?.id,
        status: user?.role === 'super_admin' || user?.role === 'admin' ? 'approved' : 'pending'
      }]);
      
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast('Image uploaded successfully!', 'success');
      setIsUploading(false);
    },
    onError: (err: any) => {
      toast(err.message, 'error');
      setIsUploading(false);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from('gallery_items').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast('Status updated', 'success');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast('Image deleted', 'success');
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast('File must be less than 5MB', 'error');
      return;
    }
    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const filteredGallery = filter === 'all' ? gallery : gallery.filter(item => item.status === filter);

  return (
    <>
      <Helmet><title>Gallery Management — Xorvin Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader 
          title="Media Gallery" 
          subtitle="Manage images for the public gallery and marketing."
        />
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} isLoading={isUploading} leftIcon={<Upload className="w-4 h-4" />}>
            Upload Image
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap ${
              filter === f ? 'bg-xorvin-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f} {f !== 'all' && `(${gallery.filter(i => i.status === f).length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-white/50">Loading gallery...</div>
      ) : filteredGallery.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center bg-white/5 rounded-2xl border border-white/10">
          <ImageIcon className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-white/60">No images found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item: any) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
              <div className="relative aspect-[4/3] bg-black/50">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={item.image_url} target="_blank" rel="noreferrer" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </a>
                  <button onClick={() => { if(confirm('Delete image?')) deleteMutation.mutate(item.id); }} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold backdrop-blur-md ${
                    item.status === 'approved' ? 'bg-green-500/80 text-white' :
                    item.status === 'pending' ? 'bg-yellow-500/80 text-white' :
                    'bg-red-500/80 text-white'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-white truncate" title={item.title}>{item.title}</p>
                <p className="text-xs text-white/40 mt-1 flex justify-between">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span>{item.profiles?.name || 'Unknown'}</span>
                </p>
                
                {item.status === 'pending' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                    <button onClick={() => updateStatusMutation.mutate({ id: item.id, status: 'approved' })} className="flex-1 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => updateStatusMutation.mutate({ id: item.id, status: 'rejected' })} className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
