import type { ValuesRankingAnswer } from "../types";

export type ValuesSignals = {
  top3: string[];
  bottom3: string[];
  flags: {
    hasAutonomyTop: boolean;
    hasSecurityTop: boolean;
    hasImpactTop: boolean;
    hasLearningTop: boolean;
    hasCreativityTop: boolean;
    hasBalanceTop: boolean;
    hasStatusTop: boolean;
    hasRecognitionTop: boolean;
    hasBelongingTop: boolean;
    hasLocationFreedomTop: boolean;
    securityInBottom: boolean;
    statusInBottom: boolean;
    recognitionInBottom: boolean;
  };
};

export function analyzeValues(a: ValuesRankingAnswer): ValuesSignals {
  const top = new Set(a.top3);
  const bottom = new Set(a.bottom3);

  return {
    top3: [...a.top3],
    bottom3: [...a.bottom3],
    flags: {
      hasAutonomyTop: top.has("autonomy"),
      hasSecurityTop: top.has("financial_security"),
      hasImpactTop: top.has("social_impact"),
      hasLearningTop: top.has("learning"),
      hasCreativityTop: top.has("creativity"),
      hasBalanceTop: top.has("work_life_balance"),
      hasStatusTop: top.has("status"),
      hasRecognitionTop: top.has("recognition"),
      hasBelongingTop: top.has("belonging"),
      hasLocationFreedomTop: top.has("location_freedom"),
      securityInBottom: bottom.has("financial_security"),
      statusInBottom: bottom.has("status"),
      recognitionInBottom: bottom.has("recognition"),
    },
  };
}
