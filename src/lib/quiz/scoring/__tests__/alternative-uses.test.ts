import { describe, expect, it } from 'vitest';
import { analyzeAlternativeUses } from '../alternative-uses';
import type { AlternativeUsesAnswer } from '../../types';

function mk(
  responses: string[],
  object: AlternativeUsesAnswer['object'] = 'trombone',
  durationMs = 60000,
): AlternativeUsesAnswer {
  return { object, responses, durationMs };
}

describe('analyzeAlternativeUses', () => {
  it('returns zero fluency on empty', () => {
    const s = analyzeAlternativeUses(mk([]));
    expect(s.fluency).toBe(0);
    expect(s.fluencyBucket).toBe('low');
    expect(s.uniqueStarts).toBe(0);
    expect(s.divergenceScore).toBe(0);
    expect(s.divergenceBucket).toBe('low');
  });

  it('buckets fluency correctly', () => {
    expect(analyzeAlternativeUses(mk(['a', 'b', 'c'])).fluencyBucket).toBe('low');
    expect(analyzeAlternativeUses(mk(['a', 'b', 'c', 'd'])).fluencyBucket).toBe('medium');
    expect(
      analyzeAlternativeUses(mk(['a', 'b', 'c', 'd', 'e', 'f', 'g'])).fluencyBucket,
    ).toBe('medium');
    expect(
      analyzeAlternativeUses(mk(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])).fluencyBucket,
    ).toBe('high');
  });

  it('counts unique first words', () => {
    const s = analyzeAlternativeUses(
      mk(['Attacher deux feuilles', 'Ouvrir une serrure', 'Décorer un sapin']),
    );
    expect(s.uniqueStarts).toBe(3);
    expect(s.divergenceScore).toBe(1);
    expect(s.divergenceBucket).toBe('high');
  });

  it('detects low divergence when same first word repeats', () => {
    const s = analyzeAlternativeUses(
      mk([
        'Attacher des papiers',
        'Attacher des cheveux',
        'Attacher une note',
        'Attacher un câble',
        'Jouer un morceau',
      ]),
    );
    expect(s.uniqueStarts).toBe(2);
    expect(s.divergenceScore).toBe(0.4);
    expect(s.divergenceBucket).toBe('low');
  });

  it('computes avg length to nearest integer', () => {
    const s = analyzeAlternativeUses(mk(['aa', 'bbbb', 'cccccc']));
    expect(s.avgLength).toBe(4);
  });

  it('flags low divergence when fluency is too small even with unique starts', () => {
    const s = analyzeAlternativeUses(mk(['Un usage', 'Un autre']));
    expect(s.divergenceBucket).toBe('low');
  });
});
