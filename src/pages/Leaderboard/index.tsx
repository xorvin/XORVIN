import React from 'react';
import { SEO } from '@/components/atoms/SEO';
import { Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/atoms/LazyImage';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import type { LeaderboardEntry } from '@/types';

const LeaderboardRow = React.memo(({ user, index: i }: { user: LeaderboardEntry; index: number }) => (
  <motion.tr 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.05 }}
    className="hover:bg-white/5 transition-colors group"
  >
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2 font-bold font-space-grotesk text-lg">
        {i === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
        {i === 1 && <Medal className="w-5 h-5 text-gray-300" />}
        {i === 2 && <Medal className="w-5 h-5 text-amber-700" />}
        <span className={i < 3 ? 'text-white' : 'text-white/40'}>#{i + 1}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        {user.avatar && (
          <LazyImage src={user.avatar} alt={user.userName} className="w-10 h-10 rounded-full border border-white/10" />
        )}
        <div>
          <p className="font-semibold text-white">{user.userName}</p>
          <p className="text-xs text-white/40">{user.college}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap font-bold text-xorvin-accent font-space-grotesk">
      {user.score.toLocaleString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-white/70">
      {user.eventsParticipated}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-white/70">
      {user.wins}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex gap-1">
        {[...Array(Math.min(user.badges, 5))].map((_, j) => (
          <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {user.badges > 5 && <span className="text-xs text-white/40 ml-1">+{user.badges - 5}</span>}
      </div>
    </td>
  </motion.tr>
));

export default function LeaderboardPage() {
  const { data: leaderboard = [], isLoading, error } = useLeaderboard();

  return (
    <>
      <SEO 
        title="Global Leaderboard" 
        description="See how you stack up against the best in the Xorvin community."
      />
      
      <section className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-5xl">
          <div className="text-center mb-12">
            <span className="badge-primary mb-4 inline-block">🏆 Global Rankings</span>
            <h1 className="heading-lg text-white mb-4">Top <span className="gradient-text">Innovators</span></h1>
            <p className="text-white/60 text-lg">See how you stack up against the best in the Xorvin community.</p>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 px-6 text-white/50">
                Unable to load leaderboard. Please try again later.
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Events</th>
                      <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Wins</th>
                      <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Badges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaderboard.map((user, i) => (
                      <LeaderboardRow key={user.userId} user={user} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 px-6">
                <div className="w-20 h-20 rounded-full bg-xorvin-primary/10 flex items-center justify-center mx-auto mb-6 text-xorvin-accent">
                  <Trophy className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-space-grotesk text-white mb-3">Leaderboard Coming Soon</h3>
                <p className="text-white/60 font-inter max-w-lg mx-auto text-lg">
                  Rankings will be published and continuously updated after our first official competitions conclude. Stay tuned!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
