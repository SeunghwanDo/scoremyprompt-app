#!/usr/bin/env node

/**
 * Pre-build environment variable checker for ScoreMyPrompt.
 * Outputs status of required environment variables.
 * Warnings don't block the build — errors do.
 */

const envChecks = [
  // Supabase (required for DB features, but app works without via mock)
  { name: 'NEXT_PUBLIC_SUPABASE_URL', level: 'warn', fallback: 'mock mode' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', level: 'warn', fallback: 'mock mode' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', level: 'warn', fallback: 'mock mode' },

  // AI (required for real analysis, falls back to mock)
  { name: 'ANTHROPIC_API_KEY', level: 'warn', fallback: 'mock mode' },

  // Stripe (required for payments, disabled without)
  { name: 'STRIPE_SECRET_KEY', level: 'warn', fallback: 'payments disabled' },
  { name: 'STRIPE_WEBHOOK_SECRET', level: 'warn', fallback: 'webhooks disabled' },

  // App URLs
  { name: 'NEXT_PUBLIC_BASE_URL', level: 'warn', fallback: 'http://localhost:3000' },
];

let hasErrors = false;

console.log('\n--- Environment Variable Check ---\n');

for (const check of envChecks) {
  const value = process.env[check.name];
  if (value) {
    console.log(`  ✅ ${check.name}: Set`);
  } else if (check.level === 'error') {
    console.log(`  ❌ ${check.name}: NOT SET (required)`);
    hasErrors = true;
  } else {
    console.log(`  ⚠️  ${check.name}: Not set (${check.fallback})`);
  }
}

console.log('');

if (hasErrors) {
  console.error('❌ Missing required environment variables. Build aborted.\n');
  process.exit(1);
} else {
  console.log('✅ Environment check passed. Proceeding with build.\n');
}
