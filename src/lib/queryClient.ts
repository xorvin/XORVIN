import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403/404 errors
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Don't refetch on every tab switch
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1, // Only retry mutations once on network failure
    },
  },
});
