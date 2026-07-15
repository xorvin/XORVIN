import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Trophy, ExternalLink, Code, Star, CheckCircle, ArrowLeft } from 'lucide-react';
import { useSubmissions, useSubmitEvaluation, useRankings } from '@/hooks/useSubmissions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Button } from '@/components/atoms/Button';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

function EvalModal({ submission, open, onClose }: { submission: any; open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const submitEval = useSubmitEvaluation();
  const existingEval = submission?.evaluations?.find((e: any) => e.judge_id === user?.id);

  const [scores, setScores] = useState({
    innovation: existingEval?.innovation ?? 5,
    technical: existingEval?.technical ?? 5,
    presentation: existingEval?.presentation ?? 5,
    impact: existingEval?.impact ?? 5,
    overall: existingEval?.overall ?? 5,
    comments: existingEval?.comments ?? '',
  });

  const criteria = [
    { key: 'innovation', label: 'Innovation', desc: 'Originality and creative problem-solving' },
    { key: 'technical', label: 'Technical Excellence', desc: 'Code quality, architecture, scalability' },
    { key: 'presentation', label: 'Presentation', desc: 'Demo quality, UI/UX, storytelling' },
    { key: 'impact', label: 'Impact', desc: 'Real-world applicability, potential reach' },
    { key: 'overall', label: 'Overall Impression', desc: 'Holistic assessment' },
  ];

  const handleSubmit = async () => {
    try {
      await submitEval.mutateAsync({ submission_id: submission.id, ...scores });
      toast('Evaluation submitted!', 'success');
      onClose();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-xorvin-dark border border-white/10 rounded-2xl p-6 z-50">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-white">Score: {submission?.project_title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60"><X className="w-4 h-4" /></button>
            </Dialog.Close>
          </div>

          <div className="space-y-5">
            {criteria.map(c => (
              <div key={c.key}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{c.label}</p>
                    <p className="text-xs text-white/40">{c.desc}</p>
                  </div>
                  <span className="text-2xl font-bold text-xorvin-accent">{(scores as any)[c.key]}/10</span>
                </div>
                <input
                  type="range" min={1} max={10} step={1}
                  value={(scores as any)[c.key]}
                  onChange={e => setScores(p => ({ ...p, [c.key]: +e.target.value }))}
                  className="w-full accent-xorvin-primary"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Judge Comments</label>
              <textarea
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white/80 text-sm outline-none resize-none"
                placeholder="Provide constructive feedback..."
                value={scores.comments}
                onChange={e => setScores(p => ({ ...p, comments: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Dialog.Close asChild><Button variant="secondary">Cancel</Button></Dialog.Close>
              <Button onClick={handleSubmit} disabled={submitEval.isPending}>
                {existingEval ? 'Update Score' : 'Submit Score'}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function SubmissionViewer() {
  const { eventId } = useParams();
  const { data: submissions, isLoading } = useSubmissions(eventId);
  const { data: rankings } = useRankings(eventId!);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [evalOpen, setEvalOpen] = useState(false);

  const { data: event } = useQuery({
    queryKey: ['event-detail', eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const { data } = await supabase.from('events').select('title, slug').eq('id', eventId!).single();
      return data;
    },
  });

  return (
    <>
      <Helmet><title>Submission Viewer — Xorvin Judge</title></Helmet>

      <PageHeader
        title={event?.title ?? 'Submissions'}
        subtitle={`${submissions?.length ?? 0} submissions to evaluate`}
        breadcrumbs={[{ label: 'Dashboard', href: '/judge' }, { label: 'Submissions' }]}
        actions={
          <Link to="/judge"><Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button></Link>
        }
      />

      <Tabs.Root defaultValue="submissions">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-6 pb-px">
          <Tabs.Trigger value="submissions" className="px-4 py-3 text-sm font-medium text-white/40 data-[state=active]:text-yellow-400 data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 outline-none">Submissions</Tabs.Trigger>
          <Tabs.Trigger value="rankings" className="px-4 py-3 text-sm font-medium text-white/40 data-[state=active]:text-yellow-400 data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 outline-none">Live Rankings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="submissions" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {isLoading ? (
                <div className="text-white/40 text-center py-8">Loading...</div>
              ) : submissions?.map((sub: any) => {
                const myEval = sub.evaluations?.find((e: any) => e.judge_id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={`w-full text-left p-4 rounded-2xl border transition-colors ${
                      selectedSubmission?.id === sub.id
                        ? 'bg-yellow-500/10 border-yellow-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white text-sm">{sub.project_title}</p>
                        <p className="text-xs text-white/40 mt-0.5">{sub.team_name}</p>
                      </div>
                      {sub.evaluations?.length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20">Pending</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(sub.technologies ?? []).slice(0, 3).map((t: string) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-white/40">{t}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedSubmission.project_title}</h2>
                      <p className="text-white/50 mt-1">by {selectedSubmission.team_name}</p>
                    </div>
                    <Button onClick={() => setEvalOpen(true)} leftIcon={<Star className="w-4 h-4" />}>
                      {selectedSubmission.evaluations?.length > 0 ? 'Update Score' : 'Score Now'}
                    </Button>
                  </div>

                  {selectedSubmission.description && (
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-2">Description</h3>
                      <p className="text-sm text-white/60 leading-relaxed">{selectedSubmission.description}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {selectedSubmission.demo_url && (
                      <a href={selectedSubmission.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                    {selectedSubmission.repo_url && (
                      <a href={selectedSubmission.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 rounded-lg text-sm hover:bg-white/10 transition-colors">
                        <Code className="w-3.5 h-3.5" /> Source Code
                      </a>
                    )}
                    {selectedSubmission.presentation_url && (
                      <a href={selectedSubmission.presentation_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> Presentation
                      </a>
                    )}
                  </div>

                  {selectedSubmission.technologies?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-2">Tech Stack</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSubmission.technologies.map((t: string) => (
                          <span key={t} className="px-2 py-0.5 bg-xorvin-primary/10 border border-xorvin-primary/20 rounded text-xs text-xorvin-primary">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Scores */}
                  {selectedSubmission.evaluations?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-3">Current Scores ({selectedSubmission.evaluations.length} judge{selectedSubmission.evaluations.length > 1 ? 's' : ''})</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { key: 'innovation', label: 'Innovation' },
                          { key: 'technical', label: 'Technical' },
                          { key: 'presentation', label: 'Presentation' },
                          { key: 'impact', label: 'Impact' },
                          { key: 'overall', label: 'Overall' },
                        ].map(criterion => {
                          const avg = selectedSubmission.evaluations.reduce((s: number, e: any) => s + (e[criterion.key] ?? 0), 0) / selectedSubmission.evaluations.length;
                          return (
                            <div key={criterion.key} className="bg-white/5 rounded-xl p-3 text-center">
                              <p className="text-xl font-bold text-yellow-400">{avg.toFixed(1)}</p>
                              <p className="text-[10px] text-white/40 mt-0.5">{criterion.label}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-white/5 border border-white/10 rounded-2xl">
                  <Trophy className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-white/40">Select a submission to review</p>
                </div>
              )}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="rankings" className="outline-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="font-bold text-white">Live Rankings</h2>
            </div>
            {!rankings || rankings.length === 0 ? (
              <div className="p-12 text-center text-white/40">No evaluations submitted yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {rankings.map((entry: any) => (
                  <div key={entry.id} className={`flex items-center gap-4 px-5 py-4 ${entry.rank <= 3 ? 'bg-yellow-500/5' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-white/10 text-white/60'
                    }`}>{entry.rank}</div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{entry.project_title}</p>
                      <p className="text-xs text-white/40">{entry.team_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-400">{entry.avgScore}</p>
                      <p className="text-xs text-white/40">/10 avg</p>
                    </div>
                    {entry.rank <= 3 && <Trophy className={`w-5 h-5 flex-shrink-0 ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-400' : 'text-amber-700'}`} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {selectedSubmission && (
        <EvalModal submission={selectedSubmission} open={evalOpen} onClose={() => setEvalOpen(false)} />
      )}
    </>
  );
}
