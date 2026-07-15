/**
 * Exponential back-off retry utility for robust network requests
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      
      // Don't retry on client errors (4xx) except 429 Rate Limit
      if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
        throw error;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 100;
      console.warn(`[Retry] Operation failed. Retrying attempt ${attempt}/${maxRetries} in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Unreachable code');
}
