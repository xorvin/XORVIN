import React, { useState, useMemo } from 'react';
import { SEO } from '@/components/atoms/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar } from 'lucide-react';
import { EventCard } from '@/components/molecules/EventCard';
import { Button } from '@/components/atoms/Button';
import { staggerContainer } from '@/animations/variants';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { EventCategory, EventStatus, Event } from '@/types';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      if (error) throw error;
      
      // Map DB snake_case fields to camelCase for the Event type
      return data.map(ev => ({
        ...ev,
        coverImage: ev.cover_image,
        startDate: ev.start_date,
        endDate: ev.end_date,
        registrationDeadline: ev.registration_deadline,
        isVirtual: ev.is_virtual,
        maxParticipants: ev.max_participants,
        registeredCount: ev.registered_count,
        prizePool: ev.prize_pool,
        tags: [], // Tags aren't in the base events table
      })) as Event[];
    }
  });

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'competition', label: 'Competitions' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'conference', label: 'Conferences' },
    { value: 'ai-challenge', label: 'AI Challenges' },
    { value: 'ctf', label: 'CTFs' },
  ];

  const statuses = [
    { value: 'all', label: 'Any Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Live Now' },
    { value: 'completed', label: 'Past Events' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, categoryFilter, statusFilter, events]);

  return (
    <>
      <SEO 
        title="Events & Competitions" 
        description="Discover and register for upcoming hackathons, coding challenges, AI competitions, CTFs, and workshops."
      />

      <section className="pt-32 pb-10 bg-xorvin-dark relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-50 pointer-events-none" />
        <div className="container-xorvin relative z-10 text-center">
          <h1 className="heading-lg text-white mb-4">Discover <span className="gradient-text">Events</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto font-inter text-lg">
            Join the brightest minds. Compete in hackathons, learn in workshops, and elevate your skills.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-xorvin-dark min-h-[60vh]">
        <div className="container-xorvin">
          {/* Filters */}
          <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col gap-3 z-20 relative">
            {/* Row 1: Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search events, tags, or domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark pl-10 w-full text-sm"
                aria-label="Search events"
              />
            </div>

            {/* Row 2: Category pills + Status pills */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Category pills */}
              <div className="flex flex-1 overflow-x-auto hide-scrollbar gap-2 pb-1 sm:pb-0">
                {categories.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setCategoryFilter(c.value as EventCategory | 'all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      categoryFilter === c.value 
                        ? 'bg-xorvin-primary/20 border border-xorvin-primary/50 text-xorvin-accent' 
                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Separator */}
              <div className="hidden sm:block w-px h-5 bg-white/10 flex-shrink-0" />

              {/* Status pills */}
              <div className="flex gap-1 flex-shrink-0">
                {statuses.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setStatusFilter(s.value as EventStatus | 'all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex-shrink-0 ${
                      statusFilter === s.value 
                        ? 'bg-white/10 border border-white/20 text-white' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-white/60 text-sm font-inter">
              Showing <span className="text-white font-semibold">{filteredEvents.length}</span> events
            </p>
          </div>

          {/* Event Grid */}
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="py-20 text-center text-white/50">Loading events...</div>
            ) : filteredEvents.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredEvents.map(event => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass-card rounded-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">No events found</h3>
                <p className="text-white/50 mb-6 font-inter max-w-md mx-auto">
                  We couldn't find any events matching your current filters. Try adjusting your search query or selecting a different category.
                </p>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
