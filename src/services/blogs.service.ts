import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/errors';
import type { BlogPost } from '@/types';
import { mapDbBlog, mapDbBlogs } from '@/utils/mapDbBlog';

export const blogsService = {
  async getBlogs(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*, author:author_id(name, avatar_url, role)')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return mapDbBlogs(data ?? []);
    } catch (e) {
      throw handleError(e);
    }
  },

  async getBlogBySlug(slug: string): Promise<BlogPost> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*, author:author_id(name, avatar_url, role, bio)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      return mapDbBlog(data);
    } catch (e) {
      throw handleError(e);
    }
  },

  async getAllBlogs(limit = 10): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*, author:author_id(name, avatar_url, role)')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return mapDbBlogs(data ?? []);
    } catch (e) {
      throw handleError(e);
    }
  },
};
