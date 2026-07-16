import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link2, BarChart2, Gift, Copy, CheckCheck, Download, FileText, Trophy, Star, Users, TrendingUp, Share2, Image, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/atoms/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { MetricCard } from '@/components/molecules/MetricCard';
import * as Tabs from '@radix-ui/react-tabs';
import { useToast } from '@/contexts/ToastContext';
import { useGamification, BADGE_DEFINITIONS } from '@/hooks/useGamification';
import { motion } from 'framer-motion';

const POST_TEMPLATES = [
  {
    id: 1,
    platform: 'LinkedIn',
    content: `🚀 Excited to be a Campus Ambassador for @Xorvin!\n\nJoin me on this amazing journey of innovation, hackathons, and learning.\n\n🔗 Use my referral link to get early access: [REFERRAL_LINK]\n\n#Xorvin #TechCommunity #Innovation #Hackathon`,
  },
  {
    id: 2,
    platform: 'Twitter/X',
    content: `Representing [COLLEGE] as @Xorvin Campus Ambassador! 🎯\n\nJoin the fastest-growing tech community.\n\n🔗 [REFERRAL_LINK]\n\n#Xorvin #Tech #Hackathon`,
  },
  {
    id: 3,
    platform: 'WhatsApp',
    content: `Hey! I'm the official Xorvin Campus Ambassador for [COLLEGE].\n\nXorvin is a platform for tech enthusiasts with hackathons, workshops, and mentorship programs.\n\nJoin using my referral link: [REFERRAL_LINK]`,
  },
];

export default function AmbassadorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);
  const { badges, totalXP } = useGamification();

  const { data: ambassador, isLoading } = useQuery({
    queryKey: ['ambassador-profile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('ambassadors')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: referrals } = useQuery({
    queryKey: ['referrals', ambassador?.id],
    enabled: !!ambassador?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('referrals')
        .select('*, referred:profiles!referred_user_id(name, username)')
        .eq('ambassador_id', ambassador!.id)
        .order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: events } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('id, title, start_date, slug, registered_count').in('status', ['upcoming', 'ongoing']).limit(5);
      return data ?? [];
    },
  });

  const referralLink = ambassador ? `https://xorvin.onrender.com/join?ref=${ambassador.referral_code}` : '—';
  const convertedReferrals = referrals?.filter(r => r.converted) ?? [];

  const copyLink = async () => {
    if (!ambassador) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyTemplate = async (template: typeof POST_TEMPLATES[0]) => {
    const content = template.content
      .replace('[REFERRAL_LINK]', referralLink)
      .replace('[COLLEGE]', ambassador?.college ?? 'my college');
    await navigator.clipboard.writeText(content);
    setCopiedTemplate(template.id);
    setTimeout(() => setCopiedTemplate(null), 2000);
    toast('Template copied!', 'success');
  };

  return (
    <>
      <Helmet><title>Campus Ambassador Dashboard — Xorvin</title></Helmet>

      <PageHeader
        title="Campus Ambassador"
        subtitle={ambassador ? `Representing ${ambassador.college} • ${ambassador.city ?? ''}` : 'Your ambassador profile is loading...'}
      />

      {/* Referral Link Card */}
      <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="font-bold text-white">Your Referral Link</h2>
            <p className="text-xs text-white/40">Share to track conversions and earn rewards</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white/80 min-w-0 truncate">
            {referralLink}
          </div>
          <Button onClick={copyLink} variant="secondary" leftIcon={copied ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="text-xs text-white/30 mt-2">Code: <span className="font-mono text-pink-400">{ambassador?.referral_code ?? '—'}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Referrals" label="Referrals" value={ambassador?.referral_count ?? 0} icon={<Users className="w-5 h-5" />} color="#ec4899" loading={isLoading} />
        <MetricCard title="Converted" label="Converted" value={convertedReferrals.length} icon={<CheckCheck className="w-5 h-5" />} color="#10b981" loading={isLoading} />
        <MetricCard title="Total XP" label="XP Earned" value={totalXP} icon={<Star className="w-5 h-5" />} color="#f59e0b" loading={false} />
        <MetricCard title="Badges" label="Badges" value={badges.length} icon={<Award className="w-5 h-5" />} color="#8b5cf6" loading={false} />
      </div>

      <Tabs.Root defaultValue="stats">
        <Tabs.List className="flex gap-2 border-b border-white/10 mb-6 pb-px overflow-x-auto">
          {['stats', 'promotions', 'templates', 'reports', 'achievements'].map(tab => (
            <Tabs.Trigger key={tab} value={tab}
              className="px-4 py-3 text-sm font-medium text-white/40 hover:text-white/80 data-[state=active]:text-pink-400 data-[state=active]:border-b-2 data-[state=active]:border-pink-400 transition-colors capitalize whitespace-nowrap outline-none">
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="stats" className="outline-none space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-pink-400" /> Referral Statistics</h3>
            {!referrals || referrals.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <Users className="w-10 h-10 text-white/20 mb-3" />
                <p className="text-white/40 text-sm">No referrals yet. Share your link to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {referrals.map((r: any, i: number) => (
                  <div key={r.id} className="flex items-center gap-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-sm font-bold text-pink-400">{i + 1}</div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{r.referred?.name || 'Pending sign-up'}</p>
                      <p className="text-xs text-white/40">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${r.converted ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                      {r.converted ? 'Converted' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="promotions" className="outline-none space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2"><Share2 className="w-5 h-5 text-pink-400" /> Promote Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events?.map((ev: any) => (
              <div key={ev.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="font-medium text-white text-sm">{ev.title}</p>
                <p className="text-xs text-white/40 mt-1">{new Date(ev.start_date).toLocaleDateString()} • {ev.registered_count} registered</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => navigator.clipboard.writeText(`Join ${ev.title} on Xorvin! ${referralLink}/events/${ev.slug}`).then(() => toast('Link copied!', 'success'))}
                    className="text-xs px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/20 transition-colors">
                    Copy Promo Link
                  </button>
                </div>
              </div>
            ))}
          </div>

          {ambassador?.promo_kit_url && (
            <a href={ambassador.promo_kit_url} target="_blank" rel="noreferrer">
              <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>Download Promo Kit</Button>
            </a>
          )}
        </Tabs.Content>

        <Tabs.Content value="templates" className="outline-none space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-pink-400" /> Post Templates</h3>
          {POST_TEMPLATES.map(template => (
            <div key={template.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/60 bg-white/5 px-2 py-1 rounded">{template.platform}</span>
                <button
                  onClick={() => copyTemplate(template)}
                  className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 transition-colors"
                >
                  {copiedTemplate === template.id ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedTemplate === template.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-sm text-white/70 whitespace-pre-wrap font-sans">
                {template.content.replace('[REFERRAL_LINK]', referralLink).replace('[COLLEGE]', ambassador?.college ?? '[COLLEGE]')}
              </pre>
            </div>
          ))}
        </Tabs.Content>

        <Tabs.Content value="reports" className="outline-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Monthly Campus Report</h3>
            <p className="text-sm text-white/60 mb-6">Submit your monthly activity report to track your campus engagement metrics.</p>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast('Report submitted!', 'success'); }}>
              <div>
                <label className="block text-sm text-white/60 mb-1">Events Organized This Month</label>
                <input type="number" min="0" className="input-dark w-full" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Students Engaged</label>
                <input type="number" min="0" className="input-dark w-full" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Activities & Highlights</label>
                <textarea className="input-dark w-full h-24 resize-none" placeholder="Describe your campus activities this month..." />
              </div>
              <Button type="submit">Submit Monthly Report</Button>
            </form>
          </div>
        </Tabs.Content>

        <Tabs.Content value="achievements" className="outline-none space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Badges Earned</h3>
            {badges.length === 0 ? (
              <div className="text-center py-8 text-white/40">Complete activities to earn badges!</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge: any) => (
                  <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-4xl mb-2">{badge.icon}</span>
                    <p className="text-xs font-medium text-white text-center">{badge.name}</p>
                    <p className="text-[10px] text-white/40 text-center mt-1">{badge.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
