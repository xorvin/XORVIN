import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Eye, CheckCircle, Clock, Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MetricCard } from '@/components/molecules/MetricCard';
import { DataTable } from '@/components/molecules/DataTable';
import * as Tabs from '@radix-ui/react-tabs';

export default function ContentManagerDashboard() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['cm-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const published = blogs?.filter(b => b.is_published).length ?? 0;
  const drafts    = blogs?.filter(b => !b.is_published).length ?? 0;
  const totalViews = blogs?.reduce((sum, b) => sum + (b.views ?? 0), 0) ?? 0;

  const blogColumns = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {row.cover_image ? (
              <img src={row.cover_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <FileText className="w-4 h-4 text-white/40" />
            )}
          </div>
          <div>
            <p className="font-medium text-white text-sm hover:text-xorvin-accent transition-colors">
              <Link to={`/blog/${row.slug}`}>{row.title}</Link>
            </p>
            <p className="text-xs text-white/40 mt-0.5">By {row.profiles?.name || 'Unknown'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row: any) => (
        <span className="flex items-center gap-1.5 text-xs text-white/60 capitalize">
          <Tag className="w-3 h-3" /> {row.category || 'Uncategorized'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: any) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
          row.is_published 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        }`}>
          {row.is_published ? 'Published' : 'Draft'}
        </span>
      )
    },
    {
      key: 'views',
      header: 'Views',
      sortable: true,
      render: (row: any) => (
        <span className="flex items-center gap-1.5 text-sm text-white/80">
          <Eye className="w-4 h-4 text-white/40" /> {row.views?.toLocaleString() || 0}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/content/blogs/${row.id}/edit`}>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </Link>
          <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet><title>Content Manager — Xorvin</title></Helmet>

      <PageHeader 
        title="Content Management"
        subtitle="Manage blogs, publications, FAQs, and global media assets."
        actions={
          <Link to="/content/blogs/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Write Article</Button>
          </Link>
        }
      />

      <Tabs.Root defaultValue="blogs" className="w-full">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-px">
          {['blogs', 'gallery', 'faqs', 'banners'].map(tab => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400 transition-colors capitalize whitespace-nowrap outline-none"
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="blogs" className="space-y-6 outline-none">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard label="Published Articles" title="Published Articles" value={published} icon={<CheckCircle className="w-5 h-5" />} loading={isLoading} />
            <MetricCard label="Drafts" title="Drafts" value={drafts} icon={<Clock className="w-5 h-5" />} loading={isLoading} />
            <MetricCard label="Total Views" title="Total Views" value={totalViews} icon={<Eye className="w-5 h-5" />} loading={isLoading} />
          </div>

          {/* Blogs Data Table */}
          <div className="mt-8">
            <h2 className="text-xl font-bold font-space-grotesk text-white mb-4">All Articles</h2>
            <DataTable 
              data={blogs || []}
              columns={blogColumns}
              searchable={true}
              searchField="title"
              emptyMessage={isLoading ? "Loading articles..." : "No articles found. Click 'Write Article' to get started."}
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="gallery" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Media Library</h3>
            <p className="text-white/50 max-w-md">Upload and manage global assets, sponsor logos, and gallery images here.</p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="faqs" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-bold text-white mb-2">FAQ Manager</h3>
            <p className="text-white/50 max-w-md">Add, edit, and organize frequently asked questions for the public support page.</p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="banners" className="outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Banner Manager</h3>
            <p className="text-white/50 max-w-md">Update the hero section banners and global announcements displayed across the site.</p>
          </div>
        </Tabs.Content>

      </Tabs.Root>
    </>
  );
}
