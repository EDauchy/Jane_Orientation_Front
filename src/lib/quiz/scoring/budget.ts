import type { BudgetAnswer } from "../types";

export const BUDGET_PHASES = [
  "ideation",
  "planning",
  "execution",
  "polish",
  "presentation",
] as const;
export type BudgetPhase = (typeof BUDGET_PHASES)[number];

export type BudgetSignals = {
  dominant: BudgetPhase;
  neglected: BudgetPhase[];
  balanced: boolean;
  starterBias: boolean;
  finisherBias: boolean;
  presenterAverse: boolean;
  executionHeavy: boolean;
  ideationHeavy: boolean;
};

export function analyzeBudget(a: BudgetAnswer): BudgetSignals {
  const entries = BUDGET_PHASES.map((p) => [p, a[p]] as const);
  const sorted = [...entries].sort((x, y) => y[1] - x[1]);
  const dominant = sorted[0][0];
  const max = sorted[0][1];
  const min = sorted[sorted.length - 1][1];
  const neglected = entries.filter(([, v]) => v < 10).map(([p]) => p);

  return {
    dominant,
    neglected,
    balanced: max - min <= 10,
    starterBias: a.ideation + a.planning >= 55,
    finisherBias: a.polish + a.presentation >= 40,
    presenterAverse: a.presentation < 10,
    executionHeavy: a.execution >= 35,
    ideationHeavy: a.ideation >= 30,
  };
}
