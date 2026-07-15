import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Button } from '@/components/atoms/Button';
import { useSubmitFeedback, useSaveInterviewNotes } from '@/hooks/useInterviews';
import { useToast } from '@/contexts/ToastContext';

function RatingSlider({ label, value, onChange, description }: {
  label: string; value: number; onChange: (v: number) => void; description?: string;
}) {
  const colors = value >= 8 ? 'text-green-400' : value >= 5 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-white/90">{label}</label>
          {description && <p className="text-xs text-white/40">{description}</p>}
        </div>
        <span className={`text-xl font-bold font-space-grotesk ${colors}`}>{value}/10</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 h-8 rounded text-xs font-bold transition-colors ${
              n <= value ? 'bg-xorvin-primary text-white' : 'bg-white/5 text-white/30 hover:bg-white/10'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EvaluationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const submitFeedback = useSubmitFeedback();
  const saveNotes = useSaveInterviewNotes();

  const [activeTab, setActiveTab] = useState<'technical' | 'behavioral' | 'coding' | 'notes'>('technical');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [scores, setScores] = useState({
    technical_score: 5,
    communication_score: 5,
    problem_solving_score: 5,
    overall_score: 5,
    recommendation: 'hold' as 'hire' | 'reject' | 'hold',
    comments: '',
  });

  const { data: interview, isLoading } = useQuery({
    queryKey: ['interview-detail', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interviews')
        .select('*, candidate:profiles!candidate_id(id, name, username, avatar_url, college, github, linkedin, skills), interview_notes(*), interview_feedback(*)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      if (data.interview_notes) setNotes(data.interview_notes.content ?? '');
      if (data.interview_feedback) {
        setScores({
          technical_score: data.interview_feedback.technical_score ?? 5,
          communication_score: data.interview_feedback.communication_score ?? 5,
          problem_solving_score: data.interview_feedback.problem_solving_score ?? 5,
          overall_score: data.interview_feedback.overall_score ?? 5,
          recommendation: data.interview_feedback.recommendation ?? 'hold',
          comments: data.interview_feedback.comments ?? '',
        });
        setSubmitted(true);
      }
      return data;
    },
  });

  const handleSaveNotes = async () => {
    try {
      await saveNotes.mutateAsync({ interview_id: id!, content: notes });
      toast('Notes saved.', 'success');
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitFeedback.mutateAsync({ interview_id: id!, ...scores });
      toast('Evaluation submitted successfully!', 'success');
      setSubmitted(true);
    } catch (e: any) { toast(e.message || 'Failed to submit.', 'error'); }
  };

  if (isLoading) return <div className="p-8 text-white/50 text-center">Loading interview...</div>;

  const candidate = interview?.candidate;
  const avgScore = Math.round((scores.technical_score + scores.communication_score + scores.problem_solving_score) / 3);

  return (
    <>
      <Helmet><title>Evaluate Candidate — Xorvin Interviewer</title></Helmet>

      <PageHeader
        title="Candidate Evaluation"
        breadcrumbs={[{ label: 'Dashboard', href: '/interviewer' }, { label: 'Evaluate' }]}
        actions={
          <Link to="/interviewer">
            <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
          </Link>
        }
      />

      {submitted && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400 text-sm">Evaluation submitted. You can still update your scores.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Candidate Profile */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={candidate?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate?.name ?? 'C')}&background=0b1626&color=30D5FF`}
                alt="" className="w-16 h-16 rounded-2xl object-cover"
              />
              <div>
                <h3 className="font-bold text-white">{candidate?.name}</h3>
                <p className="text-sm text-white/40">@{candidate?.username}</p>
                <p className="text-xs text-white/30 mt-0.5">{candidate?.college}</p>
              </div>
            </div>

            {candidate?.skills && candidate.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-white/50 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 bg-xorvin-primary/10 border border-xorvin-primary/20 rounded text-xs text-xorvin-primary">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {candidate?.github && (
                <a href={candidate.github} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">GitHub</a>
              )}
              {candidate?.linkedin && (
                <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">LinkedIn</a>
              )}
            </div>
          </div>

          {/* Score Summary */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="font-medium text-white mb-4">Score Summary</h4>
            <div className="space-y-3">
              {[
                { label: 'Technical', value: scores.technical_score },
                { label: 'Communication', value: scores.communication_score },
                { label: 'Problem Solving', value: scores.problem_solving_score },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/60">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-xorvin-primary rounded-full" style={{ width: `${item.value * 10}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white w-6 text-right">{item.value}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-white">Overall Score</span>
                <span className={`text-lg font-bold ${scores.overall_score >= 7 ? 'text-green-400' : scores.overall_score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {scores.overall_score}/10
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/50 mb-2">Recommendation</p>
              <div className="flex gap-2">
                {(['hire', 'hold', 'reject'] as const).map(rec => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setScores(p => ({ ...p, recommendation: rec }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${
                      scores.recommendation === rec
                        ? rec === 'hire' ? 'bg-green-500 text-white' : rec === 'hold' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex border-b border-white/10">
              {(['technical', 'behavioral', 'coding', 'notes'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab ? 'text-xorvin-primary border-b-2 border-xorvin-primary bg-white/5' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {activeTab === 'technical' && (
                <div className="space-y-6">
                  <RatingSlider label="Technical Knowledge" value={scores.technical_score}
                    onChange={v => setScores(p => ({ ...p, technical_score: v }))}
                    description="Data structures, algorithms, system design" />
                  <RatingSlider label="Overall Score" value={scores.overall_score}
                    onChange={v => setScores(p => ({ ...p, overall_score: v }))}
                    description="Holistic assessment of the candidate" />
                </div>
              )}

              {activeTab === 'behavioral' && (
                <div className="space-y-6">
                  <RatingSlider label="Communication" value={scores.communication_score}
                    onChange={v => setScores(p => ({ ...p, communication_score: v }))}
                    description="Clarity of expression, active listening" />
                  <RatingSlider label="Problem Solving" value={scores.problem_solving_score}
                    onChange={v => setScores(p => ({ ...p, problem_solving_score: v }))}
                    description="Approach to open-ended problems, creativity" />
                </div>
              )}

              {activeTab === 'coding' && (
                <div className="space-y-4">
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-sm text-white/70 min-h-[200px]">
                    <p className="text-white/30 text-xs mb-2"># Paste candidate code snippets or execution results here</p>
                    <textarea
                      className="w-full bg-transparent outline-none text-white/70 font-mono text-sm resize-none min-h-[180px]"
                      placeholder="// Candidate's code solution..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 text-sm outline-none resize-none focus:border-xorvin-primary/50"
                    placeholder="Private interview notes (not shared with candidate)..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={handleSaveNotes} disabled={saveNotes.isPending} leftIcon={<Save className="w-4 h-4" />}>
                    Save Notes
                  </Button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Overall Comments & Feedback</label>
                <textarea
                  className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 text-sm outline-none resize-none focus:border-xorvin-primary/50"
                  placeholder="Detailed evaluation notes, strengths, and areas for improvement..."
                  value={scores.comments}
                  onChange={e => setScores(p => ({ ...p, comments: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="secondary" onClick={handleSaveNotes}>Save Notes</Button>
                <Button type="submit" disabled={submitFeedback.isPending} className="bg-green-500 hover:bg-green-600 text-white border-none">
                  {submitFeedback.isPending ? 'Submitting...' : submitted ? 'Update Evaluation' : 'Submit Evaluation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
