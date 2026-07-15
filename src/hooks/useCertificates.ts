import { useQuery } from '@tanstack/react-query';
import { certificatesService } from '@/services/certificates.service';
import { withRetry } from '@/lib/retry';

export function useUserCertificates(userId: string | undefined) {
  return useQuery({
    queryKey: ['certificates', userId],
    queryFn: () => withRetry(() => certificatesService.getUserCertificates(userId!)),
    enabled: !!userId,
  });
}

export function useVerifyCertificate(certificateId: string) {
  return useQuery({
    queryKey: ['verify-certificate', certificateId],
    queryFn: () => withRetry(() => certificatesService.verifyCertificate(certificateId)),
    enabled: !!certificateId,
    retry: false, // Don't retry if it's 404/not found
  });
}
