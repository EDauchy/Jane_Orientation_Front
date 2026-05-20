import type { AlternativeUsesAnswer } from "../types";

export type AlternativeUsesSignals = {
  fluency: number;
  fluencyBucket: "low" | "medium" | "high";
  avgLength: number;
  uniqueStarts: number;
  divergenceScore: number;
  divergenceBucket: "low" | "medium" | "high";
};

function firstWord(s: string): string {
  return s.trim().toLowerCase().split(/\s+/)[0] ?? "";
}

export function analyzeAlternativeUses(
  a: AlternativeUsesAnswer,
): AlternativeUsesSignals {
  const fluency = a.responses.length;

  const totalChars = a.responses.reduce((acc, r) => acc + r.trim().length, 0);
  const avgLength = fluency === 0 ? 0 : Math.round(totalChars / fluency);

  const starts = new Set<string>();
  for (const r of a.responses) {
    const w = firstWord(r);
    if (w) starts.add(w);
  }
  const uniqueStarts = starts.size;

  const divergenceScore =
    fluency === 0 ? 0 : Math.round((uniqueStarts / fluency) * 100) / 100;

  const fluencyBucket: AlternativeUsesSignals["fluencyBucket"] =
    fluency < 4 ? "low" : fluency <= 7 ? "medium" : "high";

  const divergenceBucket: AlternativeUsesSignals["divergenceBucket"] =
    fluency < 3
      ? "low"
      : divergenceScore < 0.5
        ? "low"
        : divergenceScore <= 0.8
          ? "medium"
          : "high";

  return {
    fluency,
    fluencyBucket,
    avgLength,
    uniqueStarts,
    divergenceScore,
    divergenceBucket,
  };
}
