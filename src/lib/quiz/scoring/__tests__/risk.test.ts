import { describe, expect, it } from 'vitest';
import { analyzeRisk } from '../risk';

describe('analyzeRisk', () => {
  it('labels each axis', () => {
    const s = analyzeRisk({
      incomeStability: 2,
      workSolitude: 5,
      hierarchy: 1,
      buildVsJoin: 5,
    });
    expect(s.incomeStability).toBe('variable');
    expect(s.workSolitude).toBe('craves_solo');
    expect(s.hierarchy).toBe('averse');
    expect(s.buildVsJoin).toBe('builder');
  });

  it('detects entrepreneurial profile (low income stability + high build)', () => {
    expect(
      analyzeRisk({ incomeStability: 1, workSolitude: 3, hierarchy: 2, buildVsJoin: 5 })
        .risktakingEntrepreneurial,
    ).toBe(true);
    expect(
      analyzeRisk({ incomeStability: 4, workSolitude: 3, hierarchy: 3, buildVsJoin: 5 })
        .risktakingEntrepreneurial,
    ).toBe(false);
  });

  it('detects structure-seeker profile', () => {
    expect(
      analyzeRisk({ incomeStability: 5, workSolitude: 3, hierarchy: 5, buildVsJoin: 1 })
        .structureSeeker,
    ).toBe(true);
    expect(
      analyzeRisk({ incomeStability: 5, workSolitude: 3, hierarchy: 2, buildVsJoin: 1 })
        .structureSeeker,
    ).toBe(false);
  });

  it('flags ambivalent when 3+ axes sit at 3', () => {
    expect(
      analyzeRisk({ incomeStability: 3, workSolitude: 3, hierarchy: 3, buildVsJoin: 3 })
        .ambivalent,
    ).toBe(true);
    expect(
      analyzeRisk({ incomeStability: 3, workSolitude: 3, hierarchy: 3, buildVsJoin: 5 })
        .ambivalent,
    ).toBe(true);
    expect(
      analyzeRisk({ incomeStability: 1, workSolitude: 5, hierarchy: 3, buildVsJoin: 5 })
        .ambivalent,
    ).toBe(false);
  });

  it('buckets 3 in the middle labels', () => {
    const s = analyzeRisk({
      incomeStability: 3,
      workSolitude: 3,
      hierarchy: 3,
      buildVsJoin: 3,
    });
    expect(s.incomeStability).toBe('mixed');
    expect(s.workSolitude).toBe('mixed_solo');
    expect(s.hierarchy).toBe('neutral');
    expect(s.buildVsJoin).toBe('mixed');
  });
});
