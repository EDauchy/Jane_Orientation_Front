import { describe, expect, it } from 'vitest';
import { analyzeOpenQuestion, analyzeOpenQuestions } from '../open-question';

describe('analyzeOpenQuestion', () => {
  it('counts words, chars, and sentences', () => {
    const s = analyzeOpenQuestion({
      questionId: 'open-energy',
      text: 'Je travaille bien le matin. J\'aime les sprints courts. Vraiment.',
    });
    expect(s.wordCount).toBe(10);
    expect(s.sentenceCount).toBe(3);
    expect(s.charCount).toBeGreaterThan(30);
  });

  it('counts first-person markers', () => {
    const s = analyzeOpenQuestion({
      questionId: 'open-energy',
      text: 'Je préfère quand je travaille seul. Mon espace, ma routine.',
    });
    expect(s.firstPersonCount).toBeGreaterThanOrEqual(4);
  });

  it('detects concrete tone from examples and time markers', () => {
    const s = analyzeOpenQuestion({
      questionId: 'open-energy',
      text: 'Hier au bureau, par exemple, je codais toute la matinée. Chaque jour c\'est pareil.',
    });
    expect(s.tone).toBe('concrete');
    expect(s.concreteMarkers).toBeGreaterThan(0);
  });

  it('detects abstract tone from hedging language', () => {
    const s = analyzeOpenQuestion({
      questionId: 'open-projection',
      text: 'Je pense que souvent en général je crois qu\'il me semble que peut-être.',
    });
    expect(s.tone).toBe('abstract');
  });

  it('returns mixed when signals roughly balance', () => {
    const s = analyzeOpenQuestion({
      questionId: 'open-energy',
      text: 'Je pense que hier au bureau c\'était bien.',
    });
    expect(s.tone).toBe('mixed');
  });

  it('handles empty text safely', () => {
    const s = analyzeOpenQuestion({ questionId: 'open-energy', text: '' });
    expect(s.wordCount).toBe(0);
    expect(s.sentenceCount).toBe(0);
    expect(s.tone).toBe('mixed');
  });
});

describe('analyzeOpenQuestions', () => {
  it('aggregates across multiple answers', () => {
    const s = analyzeOpenQuestions([
      { questionId: 'open-energy', text: 'Je travaille tous les matins. Hier par exemple.' },
      { questionId: 'open-friction', text: 'Je déteste quand je dois attendre au bureau.' },
    ]);
    expect(s.totalWords).toBeGreaterThan(0);
    expect(s.averageWords).toBeGreaterThan(0);
    expect(s.byQuestion['open-energy']).toBeDefined();
    expect(s.byQuestion['open-friction']).toBeDefined();
  });

  it('returns 0 averages on empty input', () => {
    const s = analyzeOpenQuestions([]);
    expect(s.totalWords).toBe(0);
    expect(s.averageWords).toBe(0);
    expect(s.overallTone).toBe('mixed');
  });
});
