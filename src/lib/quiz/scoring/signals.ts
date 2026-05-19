import type { AssessmentState } from '../types';
import { analyzeBudget, type BudgetSignals } from './budget';
import { analyzeAlternativeUses, type AlternativeUsesSignals } from './alternative-uses';
import { analyzeTradeoff, type TradeoffSignals } from './tradeoff';
import { analyzeValues, type ValuesSignals } from './values';
import { analyzeRiasec, type RiasecSignals, type RiasecLetter } from './riasec';
import { analyzeRisk, type RiskSignals } from './risk';
import {
  analyzeMultipleChoice,
  type MultipleChoiceSignals,
} from './multiple-choice';
import { analyzeOpenQuestions, type OpenQuestionSignals } from './open-question';
import { analyzeSocialNuance, type SocialNuanceSignals } from './social-nuance';
import { analyzeTextMemo, type TextMemoSignals } from './text-memo';

export type AllSignals = {
  budget: BudgetSignals | null;
  alternativeUses: AlternativeUsesSignals | null;
  tradeoff: TradeoffSignals | null;
  values: ValuesSignals | null;
  riasec: RiasecSignals | null;
  risk: RiskSignals | null;
  multipleChoice: MultipleChoiceSignals | null;
  openQuestions: OpenQuestionSignals | null;
  socialNuance: SocialNuanceSignals | null;
  textMemo: TextMemoSignals;
  workContext: WorkContextSignals | null;
};

export type WorkContextSignals = {
  axisPosition: number;
  mode: 'employed' | 'freelance' | 'founder' | 'hybrid';
  summary: 'entrepreneurial' | 'structure' | 'ambivalent' | 'mixed';
};

export function computeAllSignals(state: AssessmentState): AllSignals {
  const answers = state.answers;

  const budget = answers.budget ? analyzeBudget(answers.budget) : null;
  const alternativeUses = answers.alternativeUses
    ? analyzeAlternativeUses(answers.alternativeUses)
    : null;
  const tradeoff = answers.tradeoff ? analyzeTradeoff(answers.tradeoff) : null;
  const values = answers.valuesRanking ? analyzeValues(answers.valuesRanking) : null;
  const riasec = answers.riasec ? analyzeRiasec(answers.riasec) : null;
  const risk = answers.riskTolerance ? analyzeRisk(answers.riskTolerance) : null;
  const multipleChoice = answers.multipleChoice
    ? analyzeMultipleChoice(answers.multipleChoice)
    : null;
  const openQuestions = answers.openQuestions
    ? analyzeOpenQuestions(answers.openQuestions)
    : null;
  const socialNuance = answers.socialNuance
    ? analyzeSocialNuance(answers.socialNuance)
    : null;
  const textMemo = analyzeTextMemo(answers.textMemo);

  return {
    budget,
    alternativeUses,
    tradeoff,
    values,
    riasec,
    risk,
    multipleChoice,
    openQuestions,
    socialNuance,
    textMemo,
    workContext: computeWorkContext(risk, tradeoff),
  };
}

export function computeWorkContext(
  risk: RiskSignals | null,
  tradeoff: TradeoffSignals | null,
): WorkContextSignals | null {
  if (!risk && !tradeoff) return null;

  let score = 50;
  if (risk) {
    if (risk.buildVsJoin === 'builder') score += 20;
    else if (risk.buildVsJoin === 'joiner') score -= 20;
    if (risk.incomeStability === 'variable') score += 15;
    else if (risk.incomeStability === 'stable') score -= 15;
  }
  if (tradeoff) {
    if (tradeoff.freelanceLeaning) score += 15;
    else if (tradeoff.byPair['employee-vs-freelance']?.choice === 'A') score -= 15;
  }
  score = Math.max(0, Math.min(100, score));

  let mode: WorkContextSignals['mode'];
  if (score < 30) mode = 'employed';
  else if (score < 55) mode = 'hybrid';
  else if (score < 75) mode = 'freelance';
  else mode = 'founder';

  let summary: WorkContextSignals['summary'];
  if (risk?.risktakingEntrepreneurial) summary = 'entrepreneurial';
  else if (risk?.structureSeeker) summary = 'structure';
  else if (risk?.ambivalent) summary = 'ambivalent';
  else summary = 'mixed';

  return { axisPosition: score, mode, summary };
}

export type { RiasecLetter };
