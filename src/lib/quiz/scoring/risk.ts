import type { RiskToleranceAnswer } from '../types';

export type RiskAxis<Low extends string, Mid extends string, High extends string> =
  | Low
  | Mid
  | High;

export type RiskSignals = {
  incomeStability: RiskAxis<'variable', 'mixed', 'stable'>;
  workSolitude: RiskAxis<'avoids_solo', 'mixed_solo', 'craves_solo'>;
  hierarchy: RiskAxis<'averse', 'neutral', 'comforting'>;
  buildVsJoin: RiskAxis<'joiner', 'mixed', 'builder'>;
  risktakingEntrepreneurial: boolean;
  structureSeeker: boolean;
  ambivalent: boolean;
};

function bucket(v: 1 | 2 | 3 | 4 | 5): 'low' | 'mid' | 'high' {
  if (v <= 2) return 'low';
  if (v === 3) return 'mid';
  return 'high';
}

export function analyzeRisk(a: RiskToleranceAnswer): RiskSignals {
  const income = bucket(a.incomeStability);
  const solo = bucket(a.workSolitude);
  const hier = bucket(a.hierarchy);
  const build = bucket(a.buildVsJoin);

  const incomeStability: RiskSignals['incomeStability'] =
    income === 'low' ? 'variable' : income === 'mid' ? 'mixed' : 'stable';
  const workSolitude: RiskSignals['workSolitude'] =
    solo === 'low' ? 'avoids_solo' : solo === 'mid' ? 'mixed_solo' : 'craves_solo';
  const hierarchy: RiskSignals['hierarchy'] =
    hier === 'low' ? 'averse' : hier === 'mid' ? 'neutral' : 'comforting';
  const buildVsJoin: RiskSignals['buildVsJoin'] =
    build === 'low' ? 'joiner' : build === 'mid' ? 'mixed' : 'builder';

  const risktakingEntrepreneurial =
    incomeStability === 'variable' && buildVsJoin === 'builder';
  const structureSeeker =
    incomeStability === 'stable' && hierarchy === 'comforting' && buildVsJoin === 'joiner';
  const middleCount = [income, solo, hier, build].filter((b) => b === 'mid').length;
  const ambivalent = middleCount >= 3;

  return {
    incomeStability,
    workSolitude,
    hierarchy,
    buildVsJoin,
    risktakingEntrepreneurial,
    structureSeeker,
    ambivalent,
  };
}
