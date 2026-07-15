import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Settings, Edit3, MapPin, GraduationCap, Globe, Link2, Award, Star, Bookmark, Clock, Calendar, Trophy, TrendingUp, Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCertificates } from '@/hooks/useCertificates';
import { useGamification, getLevelProgress, getLevelInfo, XP_LEVELS } from '@/hooks/useGamification';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/atoms/Button';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';

const ACTION_LABELS: Record<string, string> = {
  registered_event: 'Registered for an event',
  earned_badge: 'Earned a badge',
  session_booked: 'Booked a mentor session',
  interview_scheduled: 'Interview scheduled',
  completed_session: 'Completed a session',
};

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: certificates, isLoading: certsLoading } = useUserCertificates(user?.id);
  const { totalXP, levelInfo, progress, badges, activityLog } = useGamification();
  const { data: eventBookmarks } = useBookmarks('event');
  const { data: blogBookmarks } = useBookmarks('blog');

  const { data: registrations } = useQuery({
    queryKey: ['my-registrations', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('event_registrations')
        .select('*, event:events(id, title, start_date, status, slug)')
        .eq('user_id', user!.id)
        .order('registered_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: leaderboardRank } = useQuery({
    queryKey: ['my-rank', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id, points').order('points', { ascending: false });
      const pos = (data ?? []).findIndex(p => p.id === user!.id) + 1;
      return pos || null;
    },
  });

  if (authLoading) return <div className="min-h-screen pt-32 text-center text-white/50">Loading profile...</div>;
  if (!user) return null;

  const nextLevel = XP_LEVELS.find(l => l.level === levelInfo.level + 1);

  return (
    <>
      <Helmet><title>{`${user.name} — Xorvin Profile`}</title></Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-5xl">

          {/* Header */}
          <div className="glass-card rounded-3xl overflow-hidden mb-8">
            <div className="h-48 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${levelInfo.color}30, ${levelInfo.color}10)` }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)' }} />
              <div className="absolute top-4 right-4 flex gap-2">
                <Link to="/profile/edit"><Button variant="secondary" size="sm" leftIcon={<Edit3 className="w-4 h-4" />}>Edit</Button></Link>
                <Link to="/profile/settings"><Button variant="secondary" size="sm" leftIcon={<Settings className="w-4 h-4" />}>Settings</Button></Link>
              </div>
            </div>
            <div className="px-6 md:px-8 pb-8 relative">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0b1626&color=30D5FF&size=200`}
                alt={user.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-xorvin-dark -mt-14 bg-xorvin-dark relative z-10"
              />
              <div className="mt-4 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold font-space-grotesk text-white flex items-center flex-wrap gap-2">
                    {user.name}
                    {user.isVerified && <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">✓ Verified</span>}
                    <span className="text-sm font-normal text-white/40 bg-white/10 px-2 py-0.5 rounded-full capitalize">{user.role}</span>
                  </h1>
                  <p className="text-white/50 mt-0.5">@{user.username || user.email?.split('@')[0]}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/60">
                    {user.country && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-white/30" /> {user.country}</span>}
                    {user.college && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-white/30" /> {user.college}</span>}
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-white/30" /> Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {user.github && <a href={user.github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>}
                    {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"><Link2 className="w-4 h-4" /></a>}
                  </div>
                </div>

                {/* XP + Rank */}
                <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                  <div className="glass-card p-4 rounded-2xl text-center min-w-[90px]">
                    <p className="text-2xl font-bold font-space-grotesk text-xorvin-accent">{user.points ?? 0}</p>
                    <p className="text-xs text-white/40">Points</p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl text-center min-w-[90px]">
                    <p className="text-2xl font-bold font-space-grotesk text-white">#{leaderboardRank ?? '—'}</p>
                    <p className="text-xs text-white/40">Global Rank</p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl text-center min-w-[90px]" style={{ borderColor: `${levelInfo.color}40` }}>
                    <p className="text-2xl font-bold font-space-grotesk" style={{ color: levelInfo.color }}>Lv.{levelInfo.level}</p>
                    <p className="text-xs text-white/40">{levelInfo.title}</p>
                  </div>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span>{levelInfo.title} • {totalXP} XP</span>
                  {nextLevel && <span>Next: {nextLevel.title} ({nextLevel.min} XP)</span>}
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: levelInfo.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue="overview">
            <Tabs.List className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-px">
              {['overview', 'events', 'bookmarks', 'achievements', 'activity'].map(tab => (
                <Tabs.Trigger key={tab} value={tab}
                  className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-xorvin-accent data-[state=active]:border-b-2 data-[state=active]:border-xorvin-accent transition-colors capitalize whitespace-nowrap outline-none">
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="overview" className="outline-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-lg font-bold text-white mb-3">About</h2>
                    <p className="text-white/60 leading-relaxed">{user.bio || "This user hasn't added a bio yet."}</p>
                    {user.skills && user.skills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-white/40 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {user.skills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-xorvin-primary/10 border border-xorvin-primary/20 rounded text-xs text-xorvin-primary">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-400" /> Recent Certificates</h2>
                    {certsLoading ? <p className="text-sm text-white/40">Loading...</p> :
                      certificates && certificates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {certificates.slice(0, 4).map(cert => (
                            <div key={cert.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3">
                              <Award className="w-8 h-8 text-yellow-400 shrink-0" />
                              <div>
                                <p className="font-medium text-white text-sm line-clamp-1">{cert.eventTitle}</p>
                                <p className="text-xs text-white/40 capitalize">{cert.type} • {new Date(cert.issuedAt).getFullYear()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-white/40">No certificates yet.</p>
                    }
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /> Badges</h2>
                    {badges.length === 0 ? (
                      <p className="text-sm text-white/40 text-center">No badges yet.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {badges.slice(0, 9).map((badge: any) => (
                          <div key={badge.id} title={badge.name} className="aspect-square rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-2 hover:bg-white/10 transition-colors">
                            <span className="text-2xl">{badge.icon}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-xorvin-accent" /> Stats</h2>
                    <div className="space-y-3">
                      {[
                        { label: 'Events Joined', value: registrations?.length ?? 0 },
                        { label: 'Wins', value: user.wins ?? 0 },
                        { label: 'Badges Earned', value: badges.length },
                        { label: 'Total XP', value: `${totalXP} XP` },
                      ].map(stat => (
                        <div key={stat.label} className="flex items-center justify-between">
                          <span className="text-sm text-white/50">{stat.label}</span>
                          <span className="font-bold text-white">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="events" className="outline-none space-y-4">
              <h2 className="text-lg font-bold text-white">My Registrations</h2>
              {!registrations || registrations.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center glass-card rounded-2xl p-8">
                  <Calendar className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-white/40">You haven't registered for any events yet.</p>
                  <Link to="/events" className="mt-3 text-xorvin-accent hover:underline text-sm">Browse Events →</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.map((reg: any) => (
                    <div key={reg.id} className="flex items-center gap-4 p-4 glass-card rounded-xl border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-xorvin-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-xorvin-primary" />
                      </div>
                      <div className="flex-1">
                        <Link to={`/events/${reg.event?.slug}`} className="font-medium text-white hover:text-xorvin-accent transition-colors">{reg.event?.title}</Link>
                        <p className="text-xs text-white/40">{reg.event?.start_date ? new Date(reg.event.start_date).toLocaleDateString() : '—'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded border ${
                        reg.event?.status === 'completed' ? 'bg-white/5 text-white/40 border-white/10' :
                        reg.event?.status === 'ongoing' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>{reg.event?.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </Tabs.Content>

            <Tabs.Content value="bookmarks" className="outline-none space-y-6">
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Bookmark className="w-4 h-4 text-xorvin-accent" /> Saved Events ({eventBookmarks?.length ?? 0})</h3>
                {!eventBookmarks || eventBookmarks.length === 0 ? (
                  <p className="text-white/40 text-sm">No bookmarked events.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {eventBookmarks.map((bm: any) => (
                      <Link key={bm.id} to={`/events/${bm.target_id}`} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-xorvin-accent" />
                        <span className="text-sm text-white">{bm.target_id}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Bookmark className="w-4 h-4 text-green-400" /> Saved Blogs ({blogBookmarks?.length ?? 0})</h3>
                {!blogBookmarks || blogBookmarks.length === 0 ? (
                  <p className="text-white/40 text-sm">No bookmarked blogs.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {blogBookmarks.map((bm: any) => (
                      <Link key={bm.id} to={`/blog/${bm.target_id}`} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3">
                        <Globe className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white">{bm.target_id}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Tabs.Content>

            <Tabs.Content value="achievements" className="outline-none space-y-6">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> All Badges</h3>
                {badges.length === 0 ? (
                  <div className="text-center py-8 text-white/40">Earn badges by participating in events, winning hackathons, and more!</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge: any) => (
                      <div key={badge.id} className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-xl">
                        <span className="text-4xl mb-2">{badge.icon}</span>
                        <p className="text-sm font-medium text-white text-center">{badge.name}</p>
                        <p className="text-[10px] text-white/40 text-center mt-1">{badge.description}</p>
                        <p className="text-[10px] text-white/20 mt-2">{new Date(badge.earned_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Level Progress */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-xorvin-accent" /> Level Progress</h3>
                <div className="space-y-3">
                  {XP_LEVELS.map(level => {
                    const isCurrentLevel = level.level === levelInfo.level;
                    const isPast = level.level < levelInfo.level;
                    return (
                      <div key={level.level} className={`flex items-center gap-4 p-3 rounded-xl ${isCurrentLevel ? 'bg-white/10 border border-white/20' : 'bg-white/5'}`}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: isPast || isCurrentLevel ? `${level.color}30` : 'rgba(255,255,255,0.05)', color: isPast || isCurrentLevel ? level.color : 'rgba(255,255,255,0.2)' }}>
                          {level.level}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium" style={{ color: isPast || isCurrentLevel ? level.color : 'rgba(255,255,255,0.4)' }}>{level.title}</p>
                            {isPast && <CheckCircle className="w-4 h-4 text-green-400" />}
                            {isCurrentLevel && <span className="text-xs text-white/60">Current</span>}
                          </div>
                          <p className="text-xs text-white/30">{level.min}–{level.max === 99999 ? '∞' : level.max} XP</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="activity" className="outline-none space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-xorvin-accent" /> Activity Timeline</h2>
              {activityLog.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center glass-card rounded-2xl p-8">
                  <Clock className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-white/40">No activity recorded yet.</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
                  <div className="space-y-4">
                    {activityLog.map((activity: any, i: number) => (
                      <div key={activity.id} className="flex items-start gap-4 pl-12 relative">
                        <div className="absolute left-3 w-4 h-4 rounded-full bg-xorvin-primary/40 border-2 border-xorvin-primary flex-shrink-0 mt-0.5" />
                        <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
                          <p className="text-sm font-medium text-white">{ACTION_LABELS[activity.action] || activity.action}</p>
                          <p className="text-xs text-white/40 mt-1">{new Date(activity.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </section>
    </>
  );
}
