import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, User, Globe, ExternalLink, MapPin, GraduationCap, Calendar, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';

export default function CandidateDatabase() {
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['all-candidates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url, college, country, github, linkedin, skills, experience, created_at, points, events_participated')
        .order('name');
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: candidateInterviews } = useQuery({
    queryKey: ['candidate-interviews', selectedCandidate?.id],
    enabled: !!selectedCandidate?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('interviews')
        .select('*, interview_feedback(*)')
        .eq('candidate_id', selectedCandidate!.id)
        .order('scheduled_at', { ascending: false });
      return data ?? [];
    },
  });

  const filtered = candidates?.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.username?.toLowerCase().includes(search.toLowerCase()) ||
    c.college?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <>
      <Helmet><title>Candidate Database — Xorvin Interviewer</title></Helmet>

      <PageHeader
        title="Candidate Database"
        subtitle={`${candidates?.length ?? 0} candidates available for interviews`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Candidate List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, username, college..."
              className="input-dark pl-9 w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-white/40">Loading candidates...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-white/40">No candidates found.</div>
            ) : (
              filtered.map(candidate => (
                <button
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                    selectedCandidate?.id === candidate.id ? 'bg-xorvin-primary/10 border-xorvin-primary/20' : ''
                  }`}
                >
                  <img
                    src={candidate.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=0b1626&color=30D5FF`}
                    alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">{candidate.name}</p>
                    <p className="text-xs text-white/40 truncate">{candidate.college || 'No college'}</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${
                    candidate.experience === 'advanced' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    candidate.experience === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    {candidate.experience || 'beginner'}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Candidate Profile */}
        <div className="lg:col-span-3">
          {selectedCandidate ? (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={selectedCandidate.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCandidate.name)}&background=0b1626&color=30D5FF`}
                    alt="" className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{selectedCandidate.name}</h2>
                    <p className="text-white/50">@{selectedCandidate.username}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/60">
                      {selectedCandidate.college && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {selectedCandidate.college}</span>}
                      {selectedCandidate.country && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedCandidate.country}</span>}
                    </div>
                  </div>
                  <Link to={`/interviewer/schedule?candidate=${selectedCandidate.id}`}>
                    <Button size="sm">Schedule Interview</Button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Points', value: selectedCandidate.points ?? 0 },
                    { label: 'Events', value: selectedCandidate.events_participated ?? 0 },
                    { label: 'Experience', value: selectedCandidate.experience ?? 'Beginner' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-xorvin-accent capitalize">{stat.value}</p>
                      <p className="text-xs text-white/40">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {selectedCandidate.skills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-white/50 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills.map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-xorvin-primary/10 border border-xorvin-primary/20 rounded text-xs text-xorvin-primary">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {selectedCandidate.github && (
                    <a href={selectedCandidate.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> GitHub
                    </a>
                  )}
                  {selectedCandidate.linkedin && (
                    <a href={selectedCandidate.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
                      <Globe className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* Interview History */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" /> Interview History
                </h3>
                {!candidateInterviews || candidateInterviews.length === 0 ? (
                  <p className="text-sm text-white/40 text-center py-4">No previous interviews.</p>
                ) : (
                  <div className="space-y-3">
                    {candidateInterviews.map((iv: any) => (
                      <div key={iv.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div>
                          <p className="text-sm text-white">{new Date(iv.scheduled_at).toLocaleDateString()}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${
                            iv.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/40 border-white/10'
                          }`}>{iv.status}</span>
                        </div>
                        {iv.interview_feedback && (
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span className="font-bold">{iv.interview_feedback.overall_score}/10</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded border ${
                              iv.interview_feedback.recommendation === 'hire' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              iv.interview_feedback.recommendation === 'reject' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>{iv.interview_feedback.recommendation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white/5 border border-white/10 rounded-2xl">
              <User className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-white/40">Select a candidate to view their profile</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
