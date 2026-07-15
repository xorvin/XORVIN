import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Image, Tag as TagIcon, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/atoms/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MarkdownEditor } from '@/components/molecules/MarkdownEditor';
import { useToast } from '@/contexts/ToastContext';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id && id !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    cover_image: '',
    content: '',
    is_published: false,
  });

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        category: blog.category || '',
        cover_image: blog.cover_image || '',
        content: blog.content || '',
        is_published: blog.is_published || false,
      });
    }
  }, [blog]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async (dataToSave: typeof formData) => {
      const payload = {
        ...dataToSave,
        updated_at: new Date().toISOString()
      };
      
      if (isEditing) {
        const { error } = await supabase.from('blogs').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blogs').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast('Blog saved successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['cm-blogs'] });
      navigate('/content');
    },
    onError: (error: any) => {
      toast(error.message || 'Failed to save blog', 'error');
    }
  });

  const handleSave = (publish = false) => {
    if (!formData.title || !formData.content) {
      toast('Title and content are required', 'error');
      return;
    }
    saveMutation.mutate({ ...formData, is_published: publish });
  };

  if (isLoading) return <div className="p-8 text-white/50 text-center">Loading editor...</div>;

  return (
    <>
      <Helmet><title>{isEditing ? 'Edit Article' : 'New Article'} — Content Manager</title></Helmet>

      <PageHeader 
        title={isEditing ? 'Edit Article' : 'New Article'}
        breadcrumbs={[{ label: 'Dashboard', href: '/content' }, { label: isEditing ? 'Edit' : 'Create' }]}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/content')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleSave(false)}
              disabled={saveMutation.isPending}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={saveMutation.isPending}
              className="bg-green-500 hover:bg-green-600 text-white border-none"
              leftIcon={<Check className="w-4 h-4" />}
            >
              {isEditing && formData.is_published ? 'Update Published' : 'Publish Now'}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <input 
            type="text"
            placeholder="Article Title..."
            className="w-full bg-transparent text-4xl font-bold text-white placeholder-white/20 border-none focus:ring-0 px-0 mb-2 font-space-grotesk"
            value={formData.title}
            onChange={handleTitleChange}
          />
          
          <MarkdownEditor 
            value={formData.content} 
            onChange={(val) => setFormData(p => ({ ...p, content: val || '' }))}
            height={600}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <h3 className="font-semibold text-white mb-4">Meta Data</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-1">URL Slug</label>
                <input 
                  type="text"
                  className="input-dark w-full text-sm"
                  value={formData.slug}
                  onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1 flex items-center gap-1"><TagIcon className="w-3 h-3"/> Category</label>
                <select 
                  className="input-dark w-full text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                >
                  <option value="">Select category...</option>
                  <option value="technology">Technology</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="community">Community</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1 flex items-center gap-1"><Image className="w-3 h-3"/> Cover Image URL</label>
                <input 
                  type="text"
                  className="input-dark w-full text-sm"
                  placeholder="https://..."
                  value={formData.cover_image}
                  onChange={(e) => setFormData(p => ({ ...p, cover_image: e.target.value }))}
                />
                {formData.cover_image && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                    <img src={formData.cover_image} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
