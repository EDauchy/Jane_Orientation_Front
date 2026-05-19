import type { TextMemoAnswer } from '../types';

export type TextMemoSignals = {
  mode: 'text' | 'audio';
  present: boolean;
  wordCount: number;
  charCount: number;
  hasReversalMarkers: boolean;
  hasOwnershipMarkers: boolean;
  hasTimeAnchors: boolean;
};

const REVERSAL_TERMS = [
  'changé d\'avis', 'changer d\'avis', 'revu ma position', 'finalement',
  'au début je pensais', 'puis j\'ai compris', 'm\'a fait réaliser',
  'j\'ai fini par', 'avant je', 'maintenant je',
];

const OWNERSHIP_TERMS = [
  'j\'ai eu tort', 'j\'ai reconnu', 'je m\'étais trompé', 'je me suis trompée',
  'j\'ai appris', 'ma responsabilité', 'c\'est de ma faute', 'je l\'assume',
];

const TIME_ANCHORS = [
  'hier', 'la semaine', 'le mois', 'l\'an', 'avant', 'après', 'ensuite',
  'à l\'époque', 'il y a', 'pendant',
];

function has(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

export function analyzeTextMemo(answer: TextMemoAnswer | undefined): TextMemoSignals {
  if (!answer) {
    return {
      mode: 'text',
      present: false,
      wordCount: 0,
      charCount: 0,
      hasReversalMarkers: false,
      hasOwnershipMarkers: false,
      hasTimeAnchors: false,
    };
  }

  const content = (answer.content ?? '').trim();
  const words = content.length === 0 ? [] : content.split(/\s+/);
  const wordCount = answer.wordCount ?? words.length;

  return {
    mode: answer.mode,
    present: content.length > 0 || answer.mode === 'audio',
    wordCount,
    charCount: content.length,
    hasReversalMarkers: has(content, REVERSAL_TERMS),
    hasOwnershipMarkers: has(content, OWNERSHIP_TERMS),
    hasTimeAnchors: has(content, TIME_ANCHORS),
  };
}
