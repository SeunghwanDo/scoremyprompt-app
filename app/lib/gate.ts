import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Tier, GateCheckResult } from '../types';
import { TIER_LIMITS } from '../constants';

export { TIER_LIMITS };

export function hashIP(ip: string): string {
  if (!ip) return '';
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function getGuestUsageCount(supabase: SupabaseClient, ipHash: string): Promise<number> {
  if (!supabase || !ipHash) return 0;

  try {
    const today = new Date().toISOString().split('T')[0];

    const { count, error } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('guest_ip_hash', ipHash)
      .gte('created_at', `${today}T00:00:00Z`)
      .lt('created_at', `${today}T23:59:59Z`);

    if (error) {
      console.warn('Error fetching guest usage count:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Error in getGuestUsageCount:', err);
    return 0;
  }
}

export async function checkGate(
  supabase: SupabaseClient | null,
  userId: string | null,
  tier: Tier,
  options: { ipHash?: string } = {}
): Promise<GateCheckResult> {
  if (!supabase) {
    return { allowed: false, remaining: 0, limit: 0, message: 'Service unavailable' };
  }

  const limit = TIER_LIMITS[tier] || TIER_LIMITS.guest;

  if (tier === 'pro') {
    return { allowed: true, remaining: Infinity, limit, message: 'Unlimited analyses available' };
  }

  try {
    let usageCount = 0;

    if (tier === 'guest') {
      const ipHash = options.ipHash;
      if (!ipHash) {
        return { allowed: false, remaining: 0, limit, message: 'Cannot determine guest identity' };
      }
      usageCount = await getGuestUsageCount(supabase, ipHash);
    } else if (tier === 'free' && userId) {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('analyses_today')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.warn('Could not fetch profile for gate check:', error);
        usageCount = 0;
      } else {
        usageCount = profile.analyses_today || 0;
      }
    }

    const remaining = Math.max(0, limit - usageCount);
    const allowed = usageCount < limit;
    const message = allowed
      ? `${remaining} analyses remaining today`
      : `Daily limit of ${limit} analyses reached. Try again tomorrow.`;

    return { allowed, remaining, limit, message };
  } catch (err) {
    console.error('Error in checkGate:', err);
    return { allowed: false, remaining: 0, limit, message: 'Error checking usage limits' };
  }
}
