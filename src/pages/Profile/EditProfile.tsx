import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/atoms/Button';
import { supabase } from '@/lib/supabase';
import { Save, ArrowLeft } from 'lucide-react';

export default function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    college: '',
    country: '',
    github: '',
    linkedin: '',
    portfolio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.email?.split('@')[0] || '', // fallback
        bio: user.bio || '',
        college: user.college || '',
        country: user.country || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        portfolio: (user as any).portfolio || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          college: formData.college,
          country: formData.country,
          github: formData.github,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio
        })
        .eq('id', user.id);

      if (error) throw error;
      toast('Profile updated successfully!', 'success');
      navigate('/profile');
    } catch (error: any) {
      toast(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Helmet><title>Edit Profile — Xorvin</title></Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-3xl">
          <Button variant="secondary" onClick={() => navigate('/profile')} leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-8">
            Back to Profile
          </Button>

          <div className="glass-card p-8 rounded-3xl">
            <h1 className="heading-sm text-white mb-6">Edit Profile</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-dark w-full" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Username</label>
                  <input type="text" value={formData.username} disabled className="input-dark w-full opacity-50 cursor-not-allowed" />
                  <p className="text-[10px] text-white/40 ml-1 mt-1">Username cannot be changed.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Bio</label>
                <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="input-dark w-full min-h-[100px] resize-y" placeholder="Tell us about yourself..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">College/University</label>
                  <input type="text" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Country</label>
                  <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="input-dark w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">GitHub URL</label>
                  <input type="url" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="input-dark w-full" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">LinkedIn URL</label>
                  <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="input-dark w-full" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Portfolio URL</label>
                <input type="url" value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} className="input-dark w-full" placeholder="https://yourwebsite.com" />
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Button type="submit" disabled={loading} leftIcon={<Save className="w-4 h-4" />}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
