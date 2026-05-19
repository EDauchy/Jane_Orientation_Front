import { describe, expect, it } from 'vitest';
import { analyzeRiasec } from '../riasec';
import type { RiasecAnswer, RiasecResponse } from '../../types';

function fill(
  responses: Partial<Record<string, RiasecResponse>>,
): RiasecAnswer {
  const ids = [
    'r1', 'r2', 'r3',
    'i1', 'i2', 'i3',
    'a1', 'a2', 'a3',
    's1', 's2', 's3',
    'e1', 'e2', 'e3',
    'c1', 'c2', 'c3',
  ];
  const full: Record<string, RiasecResponse> = {};
  for (const id of ids) full[id] = responses[id] ?? 'neutral';
  return { responses: full };
}

describe('analyzeRiasec', () => {
  it('scores letters from -3 to +3', () => {
    const s = analyzeRiasec(
      fill({ a1: 'like', a2: 'like', a3: 'like', r1: 'dislike', r2: 'dislike', r3: 'dislike' }),
    );
    expect(s.scores.A).toBe(3);
    expect(s.scores.R).toBe(-3);
    expect(s.scores.I).toBe(0);
  });

  it('picks a dominant letter', () => {
    const s = analyzeRiasec(fill({ s1: 'like', s2: 'like', s3: 'like' }));
    expect(s.dominant).toBe('S');
  });

  it('produces a 3-letter Holland code', () => {
    const s = analyzeRiasec(
      fill({
        a1: 'like', a2: 'like', a3: 'like',
        i1: 'like', i2: 'like',
        s1: 'like',
      }),
    );
    expect(s.code).toHaveLength(3);
    expect(s.code.startsWith('A')).toBe(true);
    expect(s.topThree[0]).toBe('A');
  });

  it('breaks ties by RIASEC canonical order', () => {
    const s = analyzeRiasec(fill({}));
    // All zero → canonical order: R, I, A
    expect(s.topThree).toEqual(['R', 'I', 'A']);
    expect(s.code).toBe('RIA');
  });

  it('handles mixed responses', () => {
    const s = analyzeRiasec(
      fill({
        r1: 'like', r2: 'neutral', r3: 'dislike',
        c1: 'like', c2: 'like', c3: 'neutral',
      }),
    );
    expect(s.scores.R).toBe(0);
    expect(s.scores.C).toBe(2);
  });

  it('neutral responses contribute 0', () => {
    const s = analyzeRiasec(fill({}));
    for (const l of ['R', 'I', 'A', 'S', 'E', 'C'] as const) {
      expect(s.scores[l]).toBe(0);
    }
  });
});
