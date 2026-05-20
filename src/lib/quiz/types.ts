export type BudgetAnswer = {
  ideation: number;
  planning: number;
  execution: number;
  polish: number;
  presentation: number;
};

export type AlternativeUsesObject = "trombone" | "brique" | "elastique";

export type AlternativeUsesAnswer = {
  object: AlternativeUsesObject;
  responses: string[];
  durationMs: number;
};

export type TradeoffAnswer = {
  pairId: string;
  choice: "A" | "B";
  regretForOther: 1 | 2 | 3 | 4 | 5;
};

export type OpenQuestionAnswer = {
  questionId: string;
  text: string;
};

export type MultipleChoiceAnswer = {
  questionId: string;
  kind: "single" | "ranking";
  value: string | string[];
};

export type ValuesRankingAnswer = {
  top3: string[];
  bottom3: string[];
};

export type RiasecResponse = "like" | "neutral" | "dislike";
export type RiasecAnswer = {
  responses: Record<string, RiasecResponse>;
};

export type RiskToleranceAnswer = {
  incomeStability: 1 | 2 | 3 | 4 | 5;
  workSolitude: 1 | 2 | 3 | 4 | 5;
  hierarchy: 1 | 2 | 3 | 4 | 5;
  buildVsJoin: 1 | 2 | 3 | 4 | 5;
};

export type SocialNuanceAnswer = {
  sceneId: string;
  interpretations: string[];
};

export type TextMemoAnswer = {
  mode: "text" | "audio";
  content: string;
  wordCount?: number;
};

export type Audience =
  | "student-exploring"
  | "student-switching"
  | "professional-questioning"
  | "adult-reconverting";

export type QualificationHorizon =
  | "immediate"
  | "one-year"
  | "longer"
  | "unknown";

export type QualificationConstraint =
  | "finances"
  | "family"
  | "geography"
  | "health"
  | "time"
  | "none";

export type Qualification = {
  horizon: QualificationHorizon;
  constraints: QualificationConstraint[];
};

export type ProfileContext = {
  audience: Audience;
  qualification: Qualification;
};

export type AssessmentAnswers = {
  budget?: BudgetAnswer;
  alternativeUses?: AlternativeUsesAnswer;
  tradeoff?: TradeoffAnswer[];
  openQuestions?: OpenQuestionAnswer[];
  multipleChoice?: MultipleChoiceAnswer[];
  valuesRanking?: ValuesRankingAnswer;
  riasec?: RiasecAnswer;
  riskTolerance?: RiskToleranceAnswer;
  socialNuance?: SocialNuanceAnswer;
  textMemo?: TextMemoAnswer;
};

export const SCHEMA_VERSION = "2.0";

export type AssessmentState = {
  schemaVersion: typeof SCHEMA_VERSION;
  sessionId: string;
  startedAt: string;
  completedAt: string | null;
  currentModuleIdx: number;
  audience: Audience | null;
  qualification: Qualification | null;
  answers: AssessmentAnswers;
};
