import React from 'react';
import { SEO } from '@/components/atoms/SEO';
import { BlogCard } from '@/components/molecules/BlogCard';
import { CardSkeleton } from '@/components/atoms/Skeleton';
import { useBlogs } from '@/hooks/useBlogs';

export default function BlogPage() {
  const { data: posts = [], isLoading, error } = useBlogs();

  return (
    <>
      <SEO 
        title="Blog & Insights" 
        description="Latest announcements, technical deep dives, and stories from the Xorvin community."
      />
      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="container-xorvin">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4 inline-block">📰 News & Insights</span>
            <h1 className="heading-lg text-white mb-4">The Xorvin <span className="gradient-text">Blog</span></h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Latest announcements, technical deep dives, and stories from our community.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-16 text-white/50">
              Unable to load blog posts. Please try again later.
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-white/50">
              No published articles yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => <BlogCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
