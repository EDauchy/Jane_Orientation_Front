import type { TradeoffAnswer } from "../types";
import type { TradeoffPairId } from "../validators/tradeoff";

export type TradeoffSignals = {
  byPair: Record<
    TradeoffPairId,
    { choice: "A" | "B"; regret: number } | undefined
  >;
  passionOverMoney: boolean;
  remotePreferred: boolean;
  expertPath: boolean;
  freelanceLeaning: boolean;
  impactOverRecognition: boolean;
  highRegretAverage: number;
  decisiveCount: number;
  ambivalentCount: number;
};

function findPair(
  answers: TradeoffAnswer[],
  pairId: TradeoffPairId,
): TradeoffAnswer | undefined {
  return answers.find((a) => a.pairId === pairId);
}

export function analyzeTradeoff(answers: TradeoffAnswer[]): TradeoffSignals {
  const byPair: TradeoffSignals["byPair"] = {
    "salary-vs-passion": undefined,
    "remote-vs-team": undefined,
    "expert-vs-generalist": undefined,
    "employee-vs-freelance": undefined,
    "impact-vs-recognition": undefined,
  };

  for (const a of answers) {
    byPair[a.pairId as TradeoffPairId] = {
      choice: a.choice,
      regret: a.regretForOther,
    };
  }

  const passionOverMoney =
    findPair(answers, "salary-vs-passion")?.choice === "B";
  const remotePreferred = findPair(answers, "remote-vs-team")?.choice === "A";
  const expertPath = findPair(answers, "expert-vs-generalist")?.choice === "A";
  const freelanceLeaning =
    findPair(answers, "employee-vs-freelance")?.choice === "B";
  const impactOverRecognition =
    findPair(answers, "impact-vs-recognition")?.choice === "A";

  const regrets = answers.map((a) => a.regretForOther);
  const highRegretAverage =
    regrets.length === 0
      ? 0
      : Math.round(
          (regrets.reduce((s, r) => s + r, 0) / regrets.length) * 100,
        ) / 100;

  const decisiveCount = regrets.filter((r) => r <= 2).length;
  const ambivalentCount = regrets.filter((r) => r >= 4).length;

  return {
    byPair,
    passionOverMoney,
    remotePreferred,
    expertPath,
    freelanceLeaning,
    impactOverRecognition,
    highRegretAverage,
    decisiveCount,
    ambivalentCount,
  };
}
