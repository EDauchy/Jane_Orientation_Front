import { describe, expect, it } from 'vitest';
import { buildAiPayload } from '../build-payload';
import { PAYLOAD_SCHEMA_VERSION } from '../payload-types';
import type { AssessmentState, RiasecResponse } from '../../types';

function makeState(extra: Partial<AssessmentState> = {}): AssessmentState {
  return {
    sessionId: 'abc-123',
    startedAt: '2026-04-20T10:00:00.000Z',
    completedAt: '2026-04-20T10:30:00.000Z',
    currentModuleIdx: 17,
    answers: {},
    ...extra,
  };
}

function fullRiasec(): Record<string, RiasecResponse> {
  const ids = [
    'r1','r2','r3','i1','i2','i3','a1','a2','a3',
    's1','s2','s3','e1','e2','e3','c1','c2','c3',
  ];
  const out: Record<string, RiasecResponse> = {};
  for (const id of ids) out[id] = id.startsWith('i') ? 'like' : 'neutral';
  return out;
}

describe('buildAiPayload', () => {
  it('produces a payload matching meta schema', () => {
    const state = makeState();
    const payload = buildAiPayload(state);
    expect(payload.meta.sessionId).toBe('abc-123');
    expect(payload.meta.locale).toBe('fr');
    expect(payload.meta.schemaVersion).toBe(PAYLOAD_SCHEMA_VERSION);
    expect(payload.meta.startedAt).toBe('2026-04-20T10:00:00.000Z');
    expect(payload.meta.completedAt).toBe('2026-04-20T10:30:00.000Z');
  });

  it('has all required top-level keys', () => {
    const payload = buildAiPayload(makeState());
    expect(Object.keys(payload).sort()).toEqual(['meta', 'signals', 'textualResponses']);
    expect(Object.keys(payload.signals).sort()).toEqual([
      'behavioral',
      'cognitive',
      'interests',
      'tensions',
      'values',
      'workContext',
    ]);
  });

  it('never contains audio base64 even if audio memo is in state', () => {
    const state = makeState({
      answers: {
        textMemo: {
          mode: 'audio',
          content: 'data:audio/webm;base64,AAAAFGZ0eXBpc29tAAACAGlzb21pc28y',
        },
      },
    });
    const payload = buildAiPayload(state);
    expect(payload.textualResponses.textMemo).toBeNull();
    const blob = JSON.stringify(payload);
    expect(blob.includes('data:audio/')).toBe(false);
    expect(blob.includes(';base64,')).toBe(false);
  });

  it('includes text-mode memo when present', () => {
    const state = makeState({
      answers: {
        textMemo: { mode: 'text', content: 'J\'ai changé d\'avis l\'an dernier.', wordCount: 6 },
      },
    });
    const payload = buildAiPayload(state);
    expect(payload.textualResponses.textMemo).toEqual({
      mode: 'text',
      content: 'J\'ai changé d\'avis l\'an dernier.',
      wordCount: 6,
    });
    expect(payload.signals.behavioral.memoPresent).toBe(true);
    expect(payload.signals.behavioral.memoMode).toBe('text');
  });

  it('every declared string field is a string (never null)', () => {
    const payload = buildAiPayload(makeState());

    const expectedStringFields: Array<[string, unknown]> = [
      ['cognitive.decisionStyle', payload.signals.cognitive.decisionStyle],
      ['cognitive.fluencyBucket', payload.signals.cognitive.fluencyBucket],
      ['cognitive.divergenceBucket', payload.signals.cognitive.divergenceBucket],
      ['cognitive.budgetDominantPhase', payload.signals.cognitive.budgetDominantPhase],
      ['cognitive.overallTextTone', payload.signals.cognitive.overallTextTone],
      ['workContext.mode', payload.signals.workContext.mode],
      ['workContext.summary', payload.signals.workContext.summary],
      ['workContext.incomeStability', payload.signals.workContext.incomeStability],
      ['workContext.workSolitude', payload.signals.workContext.workSolitude],
      ['workContext.hierarchy', payload.signals.workContext.hierarchy],
      ['workContext.buildVsJoin', payload.signals.workContext.buildVsJoin],
      ['behavioral.groupRole', payload.signals.behavioral.groupRole],
      ['behavioral.stressResponse', payload.signals.behavioral.stressResponse],
      ['behavioral.satisfactionSource', payload.signals.behavioral.satisfactionSource],
      ['behavioral.rhythmTopChoice', payload.signals.behavioral.rhythmTopChoice],
      ['behavioral.socialDiversityBucket', payload.signals.behavioral.socialDiversityBucket],
      ['behavioral.socialAffectBalance', payload.signals.behavioral.socialAffectBalance],
      ['interests.dominantCode', payload.signals.interests.dominantCode],
    ];

    for (const [key, val] of expectedStringFields) {
      expect(typeof val, `expected ${key} to be string`).toBe('string');
      expect(val, `expected ${key} to be non-null`).not.toBeNull();
    }
  });

  it('sorts RIASEC scores by descending score with canonical tiebreak', () => {
    const state = makeState({
      answers: {
        riasec: { responses: fullRiasec() },
      },
    });
    const payload = buildAiPayload(state);
    const sorted = payload.signals.interests.sortedByScore;
    expect(sorted).toHaveLength(6);
    expect(sorted[0].letter).toBe('I');
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].score).toBeGreaterThanOrEqual(sorted[i + 1].score);
    }
    expect(payload.signals.interests.dominantCode.length).toBe(3);
  });

  it('exposes tradeoffs as a flat array of {pairId, choice, regretForOther}', () => {
    const state = makeState({
      answers: {
        tradeoff: [
          { pairId: 'salary-vs-passion', choice: 'B', regretForOther: 2 },
          { pairId: 'remote-vs-team', choice: 'A', regretForOther: 4 },
        ],
      },
    });
    const payload = buildAiPayload(state);
    expect(payload.signals.behavioral.tradeoffs).toHaveLength(2);
    expect(payload.signals.behavioral.tradeoffs[0].pairId).toBeDefined();
    expect(['A', 'B']).toContain(payload.signals.behavioral.tradeoffs[0].choice);
    expect(typeof payload.signals.behavioral.tradeoffs[0].regretForOther).toBe('number');
  });

  it('produces alternativeUses as a plain string array (no durationMs or object)', () => {
    const state = makeState({
      answers: {
        alternativeUses: {
          object: 'trombone',
          responses: ['a', 'b', 'c'],
          durationMs: 60000,
        },
      },
    });
    const payload = buildAiPayload(state);
    expect(payload.textualResponses.alternativeUses).toEqual(['a', 'b', 'c']);
  });
});
