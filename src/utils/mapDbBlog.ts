import type { BlogPost } from '@/types';
import aiImage from '@/assets/brand/ai.jpg';
import cloudImage from '@/assets/brand/cloud.jpg';
import csImage from '@/assets/brand/cs.jpg';
import gitImage from '@/assets/brand/git.jpg';
import defaultPoster from '@/assets/brand/xorvin-poster.jpg';

export function getFallbackImage(title: string, category: string): string {
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) return aiImage;
  if (text.includes('cloud') || text.includes('aws') || text.includes('azure')) return cloudImage;
  if (text.includes('security') || text.includes('cyber') || text.includes('hack') || text.includes('cs')) return csImage;
  if (text.includes('git') || text.includes('code') || text.includes('dev') || text.includes('web')) return gitImage;
  return defaultPoster;
}

export function mapDbBlog(row: Record<string, unknown>): BlogPost {
  const author = (row.author ?? {}) as Record<string, unknown>;
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    coverImage: (row.cover_image as string) || getFallbackImage((row.title as string) || '', (row.category as string) || ''),
    author: {
      name: (author.name as string) ?? 'Xorvin Editorial',
      avatar: (author.avatar_url as string) || '/logo.png',
      bio: (author.bio as string) ?? '',
      role: (author.role as string) ?? 'member',
    },
    category: row.category as string,
    tags: [],
    publishedAt: (row.published_at as string) ?? (row.created_at as string),
    updatedAt: row.updated_at as string | undefined,
    readTime: (row.read_time as number) ?? 5,
    views: (row.views as number) ?? 0,
    featured: false,
    isPublished: row.is_published as boolean,
    createdAt: row.created_at as string,
  };
}

export function mapDbBlogs(rows: Record<string, unknown>[]): BlogPost[] {
  return rows.map(mapDbBlog);
}
