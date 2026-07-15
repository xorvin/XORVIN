import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, ArrowRight, Clock } from 'lucide-react';
import { Badge, StatusBadge } from '@/components/atoms/Badge';
import { CountdownTimer } from '@/components/atoms/CountdownTimer';
import { Button } from '@/components/atoms/Button';
import { LazyImage } from '@/components/atoms/LazyImage';
import { formatDate } from '@/utils/formatDate';
import { staggerItem } from '@/animations/variants';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

export const EventCard = React.memo(function EventCard({ event, featured = false }: EventCardProps) {
  const categoryColors: Record<string, string> = {
    hackathon:   '#007BFF',
    'ai-challenge': '#30D5FF',
    ctf:         '#FF4757',
    workshop:    '#2ED573',
    conference:  '#FFA502',
    bootcamp:    '#A29BFE',
    startup:     '#F9CA24',
    'open-source': '#55EFC4',
  };

  const color = categoryColors[event.category] ?? '#007BFF';
  const isUpcoming = event.status === 'upcoming';

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className={`glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:border-[${color}]/30 ${featured ? 'col-span-full md:col-span-2' : ''}`}
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}30`)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
    >
      {/* Cover Image */}
      <div className={`relative overflow-hidden ${featured ? 'h-72' : 'h-48'}`}>
        <LazyImage
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-xorvin-dark via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <StatusBadge status={event.status} />
          <Badge variant="ghost" className="capitalize">{event.category.replace('-', ' ')}</Badge>
        </div>
        {event.prizePool && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400">{event.prizePool}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold font-space-grotesk text-white group-hover:text-xorvin-accent transition-colors mb-1">
          {event.title}
        </h3>
        {event.subtitle && <p className="text-sm text-white/50 mb-3">{event.subtitle}</p>}

        <p className="text-sm text-white/70 line-clamp-2 mb-4">{event.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-xorvin-primary" />
            {formatDate(event.startDate, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-xorvin-primary" />
            {event.isVirtual ? 'Virtual' : event.venue}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-xorvin-primary" />
            {event.registeredCount.toLocaleString()} registered
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {event.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">{tag}</span>
          ))}
        </div>

        {/* Countdown or CTA */}
        {isUpcoming && (
          <div className="mb-4">
            <p className="text-xs text-white/40 mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Registration closes
            </p>
            <CountdownTimer targetDate={event.registrationDeadline} compact />
          </div>
        )}

        <div className="flex gap-3">
          <Link to={`/events/${event.slug}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {isUpcoming ? 'Register Now' : 'View Details'}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
});
