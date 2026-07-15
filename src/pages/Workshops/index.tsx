import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen } from 'lucide-react';
import { EventCard } from '@/components/molecules/EventCard';
import { CardSkeleton } from '@/components/atoms/Skeleton';
import { useEventsByCategories } from '@/hooks/useEvents';

export default function WorkshopsPage() {
  const { data: workshops = [], isLoading, error } = useEventsByCategories(['workshop', 'conference']);

  return (
    <>
      <Helmet>
        <title>Workshops & Conferences — Xorvin</title>
      </Helmet>
      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="container-xorvin text-center">
          <span className="badge-primary mb-4 inline-block">📚 Learn & Grow</span>
          <h1 className="heading-lg text-white mb-4">Workshops & <span className="gradient-text">Conferences</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg mb-12">Level up your skills with hands-on workshops and talks from industry leaders.</p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-white/50 py-16">Unable to load workshops.</div>
          ) : workshops.length === 0 ? (
            <div className="text-white/50 py-16 glass-card rounded-2xl">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p>No workshops or conferences scheduled yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
