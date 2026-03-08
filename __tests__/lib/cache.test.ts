import { cacheHeaders, TTL } from '@/app/lib/cache';

describe('Cache Headers', () => {
  describe('public()', () => {
    it('generates correct public cache headers', () => {
      const headers = cacheHeaders.public(300);
      expect(headers['Cache-Control']).toBe('public, s-maxage=300, stale-while-revalidate=600');
      expect(headers.Vary).toBe('Accept-Encoding');
    });

    it('accepts custom stale-while-revalidate', () => {
      const headers = cacheHeaders.public(300, 900);
      expect(headers['Cache-Control']).toBe('public, s-maxage=300, stale-while-revalidate=900');
    });
  });

  describe('private()', () => {
    it('generates correct private cache headers', () => {
      const headers = cacheHeaders.private(60);
      expect(headers['Cache-Control']).toBe('private, max-age=60');
      expect(headers.Vary).toContain('Authorization');
    });
  });

  describe('none()', () => {
    it('generates no-cache headers', () => {
      const headers = cacheHeaders.none();
      expect(headers['Cache-Control']).toContain('no-cache');
      expect(headers['Cache-Control']).toContain('no-store');
      expect(headers.Pragma).toBe('no-cache');
    });
  });

  describe('immutable()', () => {
    it('generates immutable headers with default TTL', () => {
      const headers = cacheHeaders.immutable();
      expect(headers['Cache-Control']).toContain('immutable');
      expect(headers['Cache-Control']).toContain('max-age=31536000');
    });

    it('accepts custom max-age', () => {
      const headers = cacheHeaders.immutable(86400);
      expect(headers['Cache-Control']).toBe('public, max-age=86400, immutable');
    });
  });

  describe('TTL constants', () => {
    it('has correct TTL values', () => {
      expect(TTL.LEADERBOARD).toBe(300);
      expect(TTL.BADGE).toBe(3600);
      expect(TTL.EMBED).toBe(3600);
      expect(TTL.OG_IMAGE).toBe(86400);
      expect(TTL.STATIC).toBe(31536000);
    });
  });
});
