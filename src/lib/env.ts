/**
 * Xorvin — Runtime Environment Validation
 * Validates all required env vars at startup using Zod.
 */
import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is required'),
  VITE_APP_URL: z.string().url().optional().default('http://localhost:5173'),
  VITE_APP_NAME: z.string().optional().default('Xorvin'),
});

function validateEnv() {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    const missing = result.error.issues.map(i => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
    console.error(`\n❌ Environment validation failed:\n${missing}\n\nSee .env.example for reference.\n`);
    // In production builds throw, in dev just warn
    if (import.meta.env.PROD) {
      throw new Error('Missing required environment variables.');
    }
  }
  return result.success ? result.data : ({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? '',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
    VITE_APP_URL: import.meta.env.VITE_APP_URL ?? 'http://localhost:5173',
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME ?? 'Xorvin',
  });
}

export const env = validateEnv();
