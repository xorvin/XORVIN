import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/errors';
import type { GalleryItem } from '@/types';

export const galleryService = {
  async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as GalleryItem[];
    } catch (e) {
      throw handleError(e);
    }
  }
};
