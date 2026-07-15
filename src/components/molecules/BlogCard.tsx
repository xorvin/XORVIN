import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';
import { formatDateShort } from '@/utils/formatDate';
import { getFallbackImage } from '@/utils/mapDbBlog';
import { staggerItem } from '@/animations/variants';
import type { BlogPost } from '@/types';

interface BlogCardProps { post: BlogPost; featured?: boolean }

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -4 }}
      className={`glass-card rounded-2xl overflow-hidden group cursor-pointer ${featured ? 'md:flex gap-6' : ''}`}
    >
      <Link to={`/blog/${post.slug}`} className={featured ? 'md:w-2/5 flex-shrink-0' : 'block'}>
        <div className={`overflow-hidden ${featured ? 'h-full min-h-[220px]' : 'h-52'}`}>
          <img
            src={post.coverImage} 
            alt={post.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = getFallbackImage(post.title, post.category);
              if (target.src !== fallback) target.src = fallback;
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="accent">{post.category}</Badge>
            {post.featured && <Badge variant="primary">Featured</Badge>}
          </div>
          <Link to={`/blog/${post.slug}`}>
            <h3 className="text-lg font-bold font-space-grotesk text-white group-hover:text-xorvin-accent transition-colors mb-2 line-clamp-2">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm text-white/60 line-clamp-2 mb-4">{post.excerpt}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
            <div>
              <p className="text-xs font-medium text-white">{post.author.name}</p>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDateShort(post.publishedAt)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}m</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Link to={`/blog/${post.slug}`}>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-xorvin-accent transition-colors" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
