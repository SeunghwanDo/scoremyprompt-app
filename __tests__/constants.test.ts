/**
 * Unit Tests: Centralized Constants
 */
import { GRADE_CONFIG, DIMENSION_META, JOB_ROLES, TIER_LIMITS, DIMENSION_FEEDBACK } from '@/app/constants';

describe('Constants', () => {
  describe('GRADE_CONFIG', () => {
    it('has all 5 grades', () => {
      expect(Object.keys(GRADE_CONFIG)).toEqual(['S', 'A', 'B', 'C', 'D']);
    });

    it('each grade has required fields', () => {
      for (const grade of Object.values(GRADE_CONFIG)) {
        expect(grade).toHaveProperty('min');
        expect(grade).toHaveProperty('color');
        expect(grade).toHaveProperty('label');
        expect(grade).toHaveProperty('emoji');
        expect(grade).toHaveProperty('message');
      }
    });

    it('grades are in descending min-score order', () => {
      expect(GRADE_CONFIG.S.min).toBeGreaterThan(GRADE_CONFIG.A.min);
      expect(GRADE_CONFIG.A.min).toBeGreaterThan(GRADE_CONFIG.B.min);
      expect(GRADE_CONFIG.B.min).toBeGreaterThan(GRADE_CONFIG.C.min);
      expect(GRADE_CONFIG.C.min).toBeGreaterThanOrEqual(GRADE_CONFIG.D.min);
    });
  });

  describe('DIMENSION_META', () => {
    it('has all 6 PROMPT dimensions', () => {
      const keys = Object.keys(DIMENSION_META);
      expect(keys).toContain('precision');
      expect(keys).toContain('role');
      expect(keys).toContain('outputFormat');
      expect(keys).toContain('missionContext');
      expect(keys).toContain('promptStructure');
      expect(keys).toContain('tailoring');
    });

    it('max scores sum to 100', () => {
      const total = Object.values(DIMENSION_META).reduce((sum, d) => sum + d.maxScore, 0);
      expect(total).toBe(100);
    });
  });

  describe('JOB_ROLES', () => {
    it('has 7 roles', () => {
      expect(JOB_ROLES).toHaveLength(7);
    });

    it('includes Other as the last role', () => {
      expect(JOB_ROLES[JOB_ROLES.length - 1]).toBe('Other');
    });
  });

  describe('TIER_LIMITS', () => {
    it('guest has lowest limits', () => {
      expect(TIER_LIMITS.guest).toBeLessThan(TIER_LIMITS.free);
    });

    it('pro has highest limits', () => {
      expect(TIER_LIMITS.pro).toBeGreaterThan(TIER_LIMITS.free);
    });
  });

  describe('DIMENSION_FEEDBACK', () => {
    it('has feedback for all 6 dimensions', () => {
      const keys = Object.keys(DIMENSION_FEEDBACK);
      expect(keys).toContain('precision');
      expect(keys).toContain('role');
      expect(keys).toContain('outputFormat');
      expect(keys).toContain('missionContext');
      expect(keys).toContain('promptStructure');
      expect(keys).toContain('tailoring');
    });

    it('each dimension has low and high feedback', () => {
      for (const fb of Object.values(DIMENSION_FEEDBACK)) {
        expect(fb).toHaveProperty('low');
        expect(fb).toHaveProperty('high');
        expect(typeof fb.low).toBe('string');
        expect(typeof fb.high).toBe('string');
      }
    });
  });
});
