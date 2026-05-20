import type { RiasecAnswer, RiasecResponse } from "../types";

export type RiasecLetter = "R" | "I" | "A" | "S" | "E" | "C";
export const RIASEC_LETTERS: readonly RiasecLetter[] = [
  "R",
  "I",
  "A",
  "S",
  "E",
  "C",
];

const ITEM_TO_LETTER: Record<string, RiasecLetter> = {
  r1: "R",
  r2: "R",
  r3: "R",
  i1: "I",
  i2: "I",
  i3: "I",
  a1: "A",
  a2: "A",
  a3: "A",
  s1: "S",
  s2: "S",
  s3: "S",
  e1: "E",
  e2: "E",
  e3: "E",
  c1: "C",
  c2: "C",
  c3: "C",
};

const RESPONSE_WEIGHT: Record<RiasecResponse, number> = {
  like: 1,
  neutral: 0,
  dislike: -1,
};

export type RiasecSignals = {
  scores: Record<RiasecLetter, number>;
  topThree: RiasecLetter[];
  dominant: RiasecLetter;
  code: string;
};

export function analyzeRiasec(a: RiasecAnswer): RiasecSignals {
  const scores: Record<RiasecLetter, number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };

  for (const [itemId, response] of Object.entries(a.responses)) {
    const letter = ITEM_TO_LETTER[itemId];
    if (!letter) continue;
    scores[letter] += RESPONSE_WEIGHT[response];
  }

  const sorted = RIASEC_LETTERS.slice().sort((x, y) => {
    const delta = scores[y] - scores[x];
    if (delta !== 0) return delta;
    return RIASEC_LETTERS.indexOf(x) - RIASEC_LETTERS.indexOf(y);
  });

  const topThree = sorted.slice(0, 3);
  const dominant = sorted[0];
  const code = topThree.join("");

  return { scores, topThree, dominant, code };
}
