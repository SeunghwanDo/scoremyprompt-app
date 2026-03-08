import { isFeatureEnabled, getEnabledFeatureList, resetFeatureCache, FEATURES } from '@/app/lib/features';

describe('Feature Flags', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    resetFeatureCache();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    resetFeatureCache();
  });

  it('returns default-enabled features when no env var', () => {
    delete process.env.NEXT_PUBLIC_FEATURES;
    expect(isFeatureEnabled(FEATURES.REWRITE_SUGGESTION)).toBe(true);
    expect(isFeatureEnabled(FEATURES.NEWSLETTER)).toBe(true);
    expect(isFeatureEnabled(FEATURES.ADS)).toBe(true);
  });

  it('respects NEXT_PUBLIC_FEATURES env variable', () => {
    process.env.NEXT_PUBLIC_FEATURES = 'BULK_ANALYZE,CHALLENGER_MODE';
    expect(isFeatureEnabled(FEATURES.BULK_ANALYZE)).toBe(true);
    expect(isFeatureEnabled(FEATURES.CHALLENGER_MODE)).toBe(true);
    expect(isFeatureEnabled(FEATURES.ADS)).toBe(false);
  });

  it('handles case-insensitive feature names', () => {
    process.env.NEXT_PUBLIC_FEATURES = 'bulk_analyze';
    expect(isFeatureEnabled(FEATURES.BULK_ANALYZE)).toBe(true);
  });

  it('handles whitespace in feature list', () => {
    process.env.NEXT_PUBLIC_FEATURES = ' BULK_ANALYZE , CHALLENGER_MODE ';
    expect(isFeatureEnabled(FEATURES.BULK_ANALYZE)).toBe(true);
    expect(isFeatureEnabled(FEATURES.CHALLENGER_MODE)).toBe(true);
  });

  it('returns false for unknown feature', () => {
    delete process.env.NEXT_PUBLIC_FEATURES;
    expect(isFeatureEnabled('UNKNOWN_FLAG' as never)).toBe(false);
  });

  it('getEnabledFeatureList returns all enabled flags', () => {
    process.env.NEXT_PUBLIC_FEATURES = 'ADS,NEWSLETTER';
    const list = getEnabledFeatureList();
    expect(list).toContain('ADS');
    expect(list).toContain('NEWSLETTER');
    expect(list).toHaveLength(2);
  });

  it('caches features after first call', () => {
    process.env.NEXT_PUBLIC_FEATURES = 'ADS';
    expect(isFeatureEnabled(FEATURES.ADS)).toBe(true);

    // Changing env should NOT affect cached result
    process.env.NEXT_PUBLIC_FEATURES = '';
    expect(isFeatureEnabled(FEATURES.ADS)).toBe(true);

    // But reset should clear cache
    resetFeatureCache();
    expect(isFeatureEnabled(FEATURES.ADS)).toBe(false);
  });
});
