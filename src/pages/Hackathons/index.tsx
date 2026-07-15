import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Code2 } from 'lucide-react';
import { EventCard } from '@/components/molecules/EventCard';
import { CardSkeleton } from '@/components/atoms/Skeleton';
import { useEventsByCategories } from '@/hooks/useEvents';

export default function HackathonsPage() {
  const { data: hackathons = [], isLoading, error } = useEventsByCategories(['hackathon']);

  return (
    <>
      <Helmet>
        <title>Hackathons — Xorvin</title>
      </Helmet>
      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="container-xorvin text-center">
          <span className="badge-primary mb-4 inline-block">💻 Build & Win</span>
          <h1 className="heading-lg text-white mb-4"><span className="gradient-text">Hackathons</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg mb-12">Join 48-hour coding marathons, build innovative solutions, and win huge prizes.</p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-white/50 py-16">Unable to load hackathons.</div>
          ) : hackathons.length === 0 ? (
            <div className="text-white/50 py-16 glass-card rounded-2xl">
              <Code2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p>No hackathons scheduled yet. Stay tuned!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map(event => <EventCard key={event.id} event={event} featured={event.status === 'upcoming'} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
