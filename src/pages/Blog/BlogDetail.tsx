import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Skeleton } from '@/components/atoms/Skeleton';
import { formatDate } from '@/utils/formatDate';
import { getFallbackImage } from '@/utils/mapDbBlog';
import { useBlog } from '@/hooks/useBlogs';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useBlog(slug ?? '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-4xl space-y-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} — Xorvin Blog`}</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <article className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-4xl">
          <Button variant="secondary" onClick={() => navigate('/blog')} leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-8">
            Back to articles
          </Button>
          
          <Badge variant="accent" className="mb-6 capitalize">{post.category.replace('-', ' ')}</Badge>
          <h1 className="heading-lg text-white mb-6">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-white/50 text-sm mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3">
              <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                <p className="text-xs">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Calendar className="w-4 h-4" /> {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {post.readTime} min
            </div>
          </div>
          
          <img 
            src={post.coverImage} 
            alt={post.title} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = getFallbackImage(post.title, post.category);
              if (target.src !== fallback) target.src = fallback;
            }}
            className="w-full h-96 object-cover rounded-2xl mb-12" 
          />
          
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-space-grotesk prose-a:text-xorvin-accent">
            {post.content.split('\n').map((para, i) => (
              <p key={i} className="text-white/80 leading-relaxed mb-6">{para}</p>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
