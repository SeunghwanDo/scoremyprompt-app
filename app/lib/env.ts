type EnvStatus = {
  supabase: boolean;
  supabaseAdmin: boolean;
  anthropic: boolean;
  stripe: boolean;
  baseUrl: string;
};

let cachedStatus: EnvStatus | null = null;

export function getEnvStatus(): EnvStatus {
  if (cachedStatus) return cachedStatus;

  cachedStatus = {
    supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseAdmin: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    stripe: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  };

  return cachedStatus;
}

export function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}
