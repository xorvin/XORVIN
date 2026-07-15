import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy } from 'lucide-react';
import { EventCard } from '@/components/molecules/EventCard';
import { Button } from '@/components/atoms/Button';
import { CardSkeleton } from '@/components/atoms/Skeleton';
import { Link } from 'react-router-dom';
import { useEventsByCategories } from '@/hooks/useEvents';

const COMPETITION_CATEGORIES = ['competition', 'ai-challenge', 'ctf', 'hackathon'] as const;

export default function CompetitionsPage() {
  const { data: competitions = [], isLoading, error } = useEventsByCategories([...COMPETITION_CATEGORIES]);

  return (
    <>
      <Helmet>
        <title>Competitions & Challenges — Xorvin</title>
      </Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 pointer-events-none" />
        <div className="container-xorvin relative z-10 text-center">
          <span className="badge-accent mb-4 inline-block">🏆 Prove Your Skills</span>
          <h1 className="heading-lg text-white mb-4">Global <span className="gradient-text">Competitions</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto font-inter text-lg mb-8">
            Compete against the best, solve real-world problems, and win prizes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/leaderboard"><Button variant="secondary">View Leaderboard</Button></Link>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-xorvin-dark min-h-[50vh]">
        <div className="container-xorvin">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-16 text-white/50">Unable to load competitions.</div>
          ) : competitions.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl">
              <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No competitions available right now. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitions.map(event => (
                <EventCard key={event.id} event={event} featured={event.status === 'upcoming'} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
