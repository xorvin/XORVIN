import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '@/services/leaderboard.service';
import { withRetry } from '@/lib/retry';

export function useLeaderboard(limit = 100) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: () => withRetry(() => leaderboardService.getTopUsers(limit)),
  });
}
