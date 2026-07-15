import { useQuery } from '@tanstack/react-query';
import { blogsService } from '@/services/blogs.service';
import { withRetry } from '@/lib/retry';

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => withRetry(blogsService.getBlogs),
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ['blogs', slug],
    queryFn: () => withRetry(() => blogsService.getBlogBySlug(slug)),
    enabled: !!slug,
  });
}
