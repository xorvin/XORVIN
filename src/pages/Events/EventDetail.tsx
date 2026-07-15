import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, Users, Trophy, Clock, ArrowRight, Share2, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { StatusBadge, Badge } from '@/components/atoms/Badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Event } from '@/types';
import { Button } from '@/components/atoms/Button';
import { CountdownTimer } from '@/components/atoms/CountdownTimer';
import { formatDate } from '@/utils/formatDate';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function EventDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event-detail', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      // Map database schema to frontend type
      return {
        ...data,
        coverImage: data.cover_image,
        startDate: data.start_date,
        endDate: data.end_date,
        registrationDeadline: data.registration_deadline,
        isVirtual: data.is_virtual,
        maxParticipants: data.max_participants,
        registeredCount: data.registered_count,
        prizePool: data.prize_pool,
        tags: [], // Fallback if tags not present in schema
        speakers: [], 
        timeline: [],
        rules: [],
      } as Event;
    },
    enabled: !!slug
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center pt-20"><p className="text-white/50">Loading event...</p></div>;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const isUpcoming = event.status === 'upcoming';
  const isOngoing = event.status === 'ongoing';

  const handleRegister = () => {
    if (!isAuthenticated) {
      toast('Please sign in to register for this event', 'info');
      navigate('/auth/login', { state: { from: `/events/${slug}` } });
      return;
    }
    toast(`Successfully registered for ${event.title}!`, 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast('Link copied to clipboard', 'info');
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${event.title} — Xorvin`}</title>
        <meta name="description" content={event.description} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-xorvin-dark">
        <div className="absolute inset-0">
          <img src={event.coverImage} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-xorvin-dark via-xorvin-dark/80 to-transparent" />
        </div>
        
        <div className="container-xorvin relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-6">
              <StatusBadge status={event.status} />
              <Badge variant="accent" className="capitalize">{event.category.replace('-', ' ')}</Badge>
            </div>
            
            <h1 className="heading-lg text-white mb-4">{event.title}</h1>
            {event.subtitle && <p className="text-xl text-xorvin-accent mb-6 font-space-grotesk">{event.subtitle}</p>}
            
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-3xl">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-6 mb-10 p-6 glass-strong rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-xorvin-primary/10 flex items-center justify-center text-xorvin-accent">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Date</p>
                  <p className="font-semibold text-white">{formatDate(event.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-xorvin-primary/10 flex items-center justify-center text-xorvin-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Location</p>
                  <p className="font-semibold text-white">{event.isVirtual ? 'Virtual Online' : event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-xorvin-primary/10 flex items-center justify-center text-xorvin-accent">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Registered</p>
                  <p className="font-semibold text-white">{event.registeredCount.toLocaleString()}</p>
                </div>
              </div>

              {event.prizePool && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Prize Pool</p>
                    <p className="font-semibold text-yellow-400">{event.prizePool}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {(isUpcoming || isOngoing) && (
                <Button size="lg" onClick={handleRegister}>
                  {isOngoing ? 'Join Now' : 'Register for Event'}
                </Button>
              )}
              <Button variant="secondary" size="lg" onClick={handleShare} leftIcon={<Share2 className="w-5 h-5" />}>
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              <section>
                <h2 className="heading-sm mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-xorvin-primary" /> About This Event
                </h2>
                <div className="glass-card p-8 rounded-2xl prose prose-invert max-w-none">
                  <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                  
                  {event.rules && event.rules.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h3 className="text-xl font-bold mb-4">Rules & Guidelines</h3>
                      <ul className="space-y-3">
                        {event.rules.map((rule, idx) => (
                          <li key={idx} className="flex gap-3 text-white/70">
                            <CheckCircle2 className="w-5 h-5 text-xorvin-primary shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* Timeline */}
              {event.timeline && event.timeline.length > 0 && (
                <section>
                  <h2 className="heading-sm mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-xorvin-primary" /> Event Timeline
                  </h2>
                  <div className="glass-card p-8 rounded-2xl">
                    <div className="relative border-l-2 border-white/10 pl-6 ml-3 space-y-8">
                      {event.timeline.map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[35px] w-4 h-4 rounded-full bg-xorvin-dark border-2 border-xorvin-primary" />
                          <div className="mb-1 text-xorvin-accent font-mono text-sm">
                            {formatDate(item.date)} {item.time && `• ${item.time}`}
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-white/60 text-sm">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              {/* Sidebar Info */}
              {isUpcoming && (
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-white mb-4">Registration Closes In</h3>
                  <CountdownTimer targetDate={event.registrationDeadline} />
                </div>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-white mb-6">Speakers & Mentors</h3>
                  <div className="space-y-4">
                    {event.speakers.map(speaker => (
                      <div key={speaker.id} className="flex gap-4 items-center">
                        <img src={speaker.avatar} alt={speaker.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-white text-sm">{speaker.name}</p>
                          <p className="text-xs text-white/50">{speaker.title} at {speaker.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
