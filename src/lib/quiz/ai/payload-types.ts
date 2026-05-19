import type { RiasecLetter } from '../scoring/riasec';

export const PAYLOAD_SCHEMA_VERSION = 1;

export type AiPayloadMeta = {
  sessionId: string;
  locale: 'fr';
  startedAt: string;
  completedAt: string | null;
  schemaVersion: number;
};

export type AiCognitiveSignals = {
  decisionStyle: 'analytical' | 'intuitive' | 'social' | 'pragmatic' | 'empirical' | 'unknown';
  fluencyBucket: 'low' | 'medium' | 'high' | 'unknown';
  divergenceBucket: 'low' | 'medium' | 'high' | 'unknown';
  budgetDominantPhase: string;
  budgetBalanced: boolean;
  budgetStarterBias: boolean;
  budgetFinisherBias: boolean;
  overallTextTone: 'concrete' | 'abstract' | 'mixed' | 'unknown';
};

export type AiInterestsSignals = {
  riasecScores: Record<RiasecLetter, number>;
  topThree: RiasecLetter[];
  dominantCode: string;
  sortedByScore: Array<{ letter: RiasecLetter; score: number }>;
};

export type AiValuesSignals = {
  top3: string[];
  bottom3: string[];
  hasAutonomyTop: boolean;
  hasSecurityTop: boolean;
  hasImpactTop: boolean;
  hasCreativityTop: boolean;
  hasLearningTop: boolean;
  securityInBottom: boolean;
  statusInBottom: boolean;
  recognitionInBottom: boolean;
};

export type AiWorkContextSignals = {
  axisPosition: number;
  mode: 'employed' | 'freelance' | 'founder' | 'hybrid' | 'unknown';
  summary: 'entrepreneurial' | 'structure' | 'ambivalent' | 'mixed' | 'unknown';
  incomeStability: 'variable' | 'mixed' | 'stable' | 'unknown';
  workSolitude: 'avoids_solo' | 'mixed_solo' | 'craves_solo' | 'unknown';
  hierarchy: 'averse' | 'neutral' | 'comforting' | 'unknown';
  buildVsJoin: 'joiner' | 'mixed' | 'builder' | 'unknown';
  risktakingEntrepreneurial: boolean;
  structureSeeker: boolean;
  ambivalent: boolean;
};

export type AiTradeoffSummary = {
  pairId: string;
  choice: 'A' | 'B';
  regretForOther: number;
};

export type AiBehavioralSignals = {
  tradeoffs: AiTradeoffSummary[];
  tradeoffHighRegretAverage: number;
  tradeoffDecisiveCount: number;
  tradeoffAmbivalentCount: number;
  passionOverMoney: boolean;
  remotePreferred: boolean;
  expertPath: boolean;
  freelanceLeaning: boolean;
  impactOverRecognition: boolean;
  groupRole: string;
  stressResponse: string;
  satisfactionSource: string;
  rhythmTopChoice: string;
  socialInterpretationsCount: number;
  socialDiversityBucket: 'low' | 'medium' | 'high' | 'unknown';
  socialAffectBalance: 'mostly-negative' | 'mostly-positive' | 'balanced' | 'unknown';
  memoPresent: boolean;
  memoMode: 'text' | 'audio' | 'none';
  memoHasReversalMarkers: boolean;
  memoHasOwnershipMarkers: boolean;
};

export type AiTensionFlag = {
  between: [string, string];
  description: string;
};

export type AiSignals = {
  cognitive: AiCognitiveSignals;
  interests: AiInterestsSignals;
  values: AiValuesSignals;
  workContext: AiWorkContextSignals;
  behavioral: AiBehavioralSignals;
  tensions: AiTensionFlag[];
};

export type AiOpenQuestionResponse = {
  questionId: string;
  text: string;
  wordCount: number;
  tone: 'concrete' | 'abstract' | 'mixed';
};

export type AiSocialNuanceResponse = {
  sceneId: string;
  interpretations: string[];
};

export type AiTextMemoResponse = {
  mode: 'text';
  content: string;
  wordCount: number;
};

export type AiTextualResponses = {
  openQuestions: AiOpenQuestionResponse[];
  socialNuance: AiSocialNuanceResponse | null;
  textMemo: AiTextMemoResponse | null;
  alternativeUses: string[];
};

export type AiPayload = {
  meta: AiPayloadMeta;
  signals: AiSignals;
  textualResponses: AiTextualResponses;
};
