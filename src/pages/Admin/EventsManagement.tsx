import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { StatusBadge, Badge } from '@/components/atoms/Badge';
import { Skeleton } from '@/components/atoms/Skeleton';
import { formatDate } from '@/utils/formatDate';
import { useAdminEvents } from '@/hooks/useAdminData';

export default function AdminEventsPage() {
  const [search, setSearch] = useState('');
  const { data: events = [], isLoading, error } = useAdminEvents();

  const filtered = useMemo(() =>
    events.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.includes(search.toLowerCase())
    ),
    [events, search]
  );

  return (
    <>
      <Helmet><title>Manage Events — Xorvin Admin</title></Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-space-grotesk text-white">Events</h1>
            <p className="text-white/50 mt-1">
              {isLoading ? 'Loading...' : `${events.length} events total`}
            </p>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />}>Create Event</Button>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-dark pl-9 w-full text-sm py-2"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td></tr>
                  ))
                ) : error ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-white/40">Failed to load events.</td></tr>
                ) : filtered.map(event => (
                  <tr key={event.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={event.coverImage} alt={event.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <p className="font-medium text-white text-sm truncate max-w-[200px]">{event.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="accent" className="text-xs capitalize">{event.category.replace('-', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60 whitespace-nowrap">
                      {formatDate(event.startDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {event.registeredCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isLoading && !error && filtered.length === 0 && (
              <div className="text-center py-12 text-white/40">No events match your search.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
