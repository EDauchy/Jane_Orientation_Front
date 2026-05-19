import type { OpenQuestionAnswer } from "../types";
import type { OpenQuestionId } from "../validators/open-question";

export type OpenQuestionSignal = {
  questionId: OpenQuestionId;
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  firstPersonCount: number;
  concreteMarkers: number;
  abstractMarkers: number;
  tone: "concrete" | "abstract" | "mixed";
};

export type OpenQuestionSignals = {
  byQuestion: Partial<Record<OpenQuestionId, OpenQuestionSignal>>;
  totalWords: number;
  averageWords: number;
  overallTone: "concrete" | "abstract" | "mixed";
};

const FIRST_PERSON_RE = /\b(je|j'|j\u2019|moi|mon|ma|mes)\b/gi;

const CONCRETE_MARKERS = [
  "quand",
  "hier",
  "aujourd",
  "chaque jour",
  "la semaine",
  "le matin",
  "chez",
  "au bureau",
  "exemple",
  "par exemple",
  "quand j",
  "dernièrement",
];

const ABSTRACT_MARKERS = [
  "en général",
  "souvent",
  "toujours",
  "jamais",
  "je pense que",
  "je crois",
  "peut-être",
  "il me semble",
  "globalement",
  "dans l'idée",
];

function countMatches(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  let n = 0;
  for (const t of terms) {
    const idx = lower.split(t).length - 1;
    n += idx;
  }
  return n;
}

export function analyzeOpenQuestion(
  answer: OpenQuestionAnswer,
): OpenQuestionSignal {
  const text = answer.text ?? "";
  const trimmed = text.trim();
  const words = trimmed.length === 0 ? [] : trimmed.split(/\s+/);
  const sentences = trimmed
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const firstPersonCount = (trimmed.match(FIRST_PERSON_RE) ?? []).length;
  const concreteMarkers = countMatches(trimmed, CONCRETE_MARKERS);
  const abstractMarkers = countMatches(trimmed, ABSTRACT_MARKERS);

  let tone: OpenQuestionSignal["tone"] = "mixed";
  if (concreteMarkers > abstractMarkers + 1) tone = "concrete";
  else if (abstractMarkers > concreteMarkers + 1) tone = "abstract";

  return {
    questionId: answer.questionId as OpenQuestionId,
    wordCount: words.length,
    charCount: trimmed.length,
    sentenceCount: sentences.length,
    firstPersonCount,
    concreteMarkers,
    abstractMarkers,
    tone,
  };
}

export function analyzeOpenQuestions(
  answers: OpenQuestionAnswer[],
): OpenQuestionSignals {
  const byQuestion: OpenQuestionSignals["byQuestion"] = {};
  let totalWords = 0;
  let concrete = 0;
  let abstract = 0;

  for (const a of answers) {
    const sig = analyzeOpenQuestion(a);
    byQuestion[sig.questionId] = sig;
    totalWords += sig.wordCount;
    concrete += sig.concreteMarkers;
    abstract += sig.abstractMarkers;
  }

  let overallTone: OpenQuestionSignals["overallTone"] = "mixed";
  if (concrete > abstract + 2) overallTone = "concrete";
  else if (abstract > concrete + 2) overallTone = "abstract";

  return {
    byQuestion,
    totalWords,
    averageWords:
      answers.length === 0 ? 0 : Math.round(totalWords / answers.length),
    overallTone,
  };
}
