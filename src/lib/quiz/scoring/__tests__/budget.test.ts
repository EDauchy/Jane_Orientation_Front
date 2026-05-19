import { describe, expect, it } from 'vitest';
import { analyzeBudget } from '../budget';
import type { BudgetAnswer } from '../../types';

const b = (
  ideation: number,
  planning: number,
  execution: number,
  polish: number,
  presentation: number,
): BudgetAnswer => ({ ideation, planning, execution, polish, presentation });

describe('analyzeBudget', () => {
  it('identifies the dominant phase', () => {
    expect(analyzeBudget(b(40, 15, 20, 15, 10)).dominant).toBe('ideation');
    expect(analyzeBudget(b(10, 10, 60, 10, 10)).dominant).toBe('execution');
    expect(analyzeBudget(b(15, 15, 15, 15, 40)).dominant).toBe('presentation');
  });

  it('flags balanced distribution when spread <= 10', () => {
    expect(analyzeBudget(b(20, 20, 20, 20, 20)).balanced).toBe(true);
    expect(analyzeBudget(b(25, 20, 20, 20, 15)).balanced).toBe(true);
    expect(analyzeBudget(b(40, 15, 15, 15, 15)).balanced).toBe(false);
  });

  it('detects starter bias', () => {
    expect(analyzeBudget(b(30, 30, 20, 10, 10)).starterBias).toBe(true);
    expect(analyzeBudget(b(10, 10, 60, 10, 10)).starterBias).toBe(false);
  });

  it('detects finisher bias when polish + presentation >= 40', () => {
    expect(analyzeBudget(b(10, 10, 40, 20, 20)).finisherBias).toBe(true);
    expect(analyzeBudget(b(30, 20, 30, 10, 10)).finisherBias).toBe(false);
  });

  it('flags presenter-averse when presentation < 10', () => {
    expect(analyzeBudget(b(25, 25, 25, 20, 5)).presenterAverse).toBe(true);
    expect(analyzeBudget(b(20, 20, 20, 20, 20)).presenterAverse).toBe(false);
  });

  it('lists every phase below 10 as neglected', () => {
    expect(analyzeBudget(b(0, 0, 100, 0, 0)).neglected).toEqual([
      'ideation',
      'planning',
      'polish',
      'presentation',
    ]);
  });

  it('flags execution heavy at 35+', () => {
    expect(analyzeBudget(b(10, 15, 35, 20, 20)).executionHeavy).toBe(true);
    expect(analyzeBudget(b(10, 20, 30, 20, 20)).executionHeavy).toBe(false);
  });

  it('flags ideation heavy at 30+', () => {
    expect(analyzeBudget(b(30, 20, 20, 20, 10)).ideationHeavy).toBe(true);
    expect(analyzeBudget(b(29, 20, 21, 20, 10)).ideationHeavy).toBe(false);
  });
});
