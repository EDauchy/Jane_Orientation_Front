import { describe, expect, it } from 'vitest';
import { analyzeTradeoff } from '../tradeoff';
import type { TradeoffAnswer } from '../../types';

function full(overrides: Partial<Record<string, Partial<TradeoffAnswer>>> = {}): TradeoffAnswer[] {
  const base: TradeoffAnswer[] = [
    { pairId: 'salary-vs-passion', choice: 'A', regretForOther: 3 },
    { pairId: 'remote-vs-team', choice: 'A', regretForOther: 3 },
    { pairId: 'expert-vs-generalist', choice: 'A', regretForOther: 3 },
    { pairId: 'employee-vs-freelance', choice: 'A', regretForOther: 3 },
    { pairId: 'impact-vs-recognition', choice: 'A', regretForOther: 3 },
  ];
  return base.map((item) => ({ ...item, ...(overrides[item.pairId] ?? {}) }));
}

describe('analyzeTradeoff', () => {
  it('detects passionOverMoney when salary pair choice is B', () => {
    const s = analyzeTradeoff(full({ 'salary-vs-passion': { choice: 'B' } }));
    expect(s.passionOverMoney).toBe(true);
  });

  it('detects remotePreferred when remote-vs-team choice is A', () => {
    const s = analyzeTradeoff(full({ 'remote-vs-team': { choice: 'A' } }));
    expect(s.remotePreferred).toBe(true);
  });

  it('detects expertPath and impactOverRecognition', () => {
    const s = analyzeTradeoff(
      full({
        'expert-vs-generalist': { choice: 'A' },
        'impact-vs-recognition': { choice: 'A' },
      }),
    );
    expect(s.expertPath).toBe(true);
    expect(s.impactOverRecognition).toBe(true);
  });

  it('detects freelanceLeaning when employee-vs-freelance is B', () => {
    const s = analyzeTradeoff(full({ 'employee-vs-freelance': { choice: 'B' } }));
    expect(s.freelanceLeaning).toBe(true);
  });

  it('computes regret average rounded to 2 decimals', () => {
    const s = analyzeTradeoff(
      full({
        'salary-vs-passion': { regretForOther: 1 },
        'remote-vs-team': { regretForOther: 2 },
        'expert-vs-generalist': { regretForOther: 3 },
        'employee-vs-freelance': { regretForOther: 4 },
        'impact-vs-recognition': { regretForOther: 5 },
      }),
    );
    expect(s.highRegretAverage).toBe(3);
    expect(s.decisiveCount).toBe(2);
    expect(s.ambivalentCount).toBe(2);
  });

  it('exposes byPair mapping with choice and regret', () => {
    const s = analyzeTradeoff(
      full({ 'salary-vs-passion': { choice: 'B', regretForOther: 5 } }),
    );
    expect(s.byPair['salary-vs-passion']).toEqual({ choice: 'B', regret: 5 });
    expect(s.byPair['remote-vs-team']).toEqual({ choice: 'A', regret: 3 });
  });

  it('handles empty answers safely', () => {
    const s = analyzeTradeoff([]);
    expect(s.highRegretAverage).toBe(0);
    expect(s.decisiveCount).toBe(0);
    expect(s.ambivalentCount).toBe(0);
    expect(s.passionOverMoney).toBe(false);
  });
});
