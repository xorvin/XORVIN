import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { AdminModal } from '@/components/molecules/AdminModal';
import { MarkdownEditor } from '@/components/molecules/MarkdownEditor';
import { useBlogs } from '@/hooks/useBlogs';

export default function AdminBlogsPage() {
  const { data: blogs, isLoading } = useBlogs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');

  return (
    <>
      <Helmet><title>Manage Blogs — Xorvin Admin</title></Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-space-grotesk text-white">Blogs</h1>
            <p className="text-white/50 mt-1">Manage articles and publications.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            New Post
          </Button>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-white/50">Loading...</td></tr>
              ) : blogs?.map(blog => (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white line-clamp-1">{blog.title}</p>
                    <p className="text-xs text-white/40">{blog.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">{blog.category}</td>
                  <td className="px-6 py-4">
                    {blog.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Published</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/50">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Blog Post"
        size="xl"
      >
        <div className="space-y-4">
          <input type="text" placeholder="Post Title" className="input-dark w-full text-lg font-bold" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Category" className="input-dark w-full" />
            <input type="text" placeholder="Cover Image URL" className="input-dark w-full" />
          </div>
          <MarkdownEditor value={content} onChange={v => setContent(v || '')} />
          
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button>Save as Draft</Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white">Publish Now</Button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
