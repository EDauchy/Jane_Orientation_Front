import type { AssessmentState } from "../types";
import { computeAllSignals } from "../scoring";
import { RIASEC_LETTERS, type RiasecLetter } from "../scoring/riasec";
import type { OpenQuestionId } from "../validators/open-question";
import {
  PAYLOAD_SCHEMA_VERSION,
  type AiBehavioralSignals,
  type AiCognitiveSignals,
  type AiInterestsSignals,
  type AiPayload,
  type AiSignals,
  type AiTextualResponses,
  type AiValuesSignals,
  type AiWorkContextSignals,
} from "./payload-types";

function safeString(v: string | null | undefined, fallback: string): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

export function buildAiPayload(state: AssessmentState): AiPayload {
  const signals = computeAllSignals(state);

  const cognitive: AiCognitiveSignals = {
    decisionStyle: safeString(
      signals.multipleChoice?.decisionStyle ?? null,
      "unknown",
    ) as AiCognitiveSignals["decisionStyle"],
    fluencyBucket: safeString(
      signals.alternativeUses?.fluencyBucket ?? null,
      "unknown",
    ) as AiCognitiveSignals["fluencyBucket"],
    divergenceBucket: safeString(
      signals.alternativeUses?.divergenceBucket ?? null,
      "unknown",
    ) as AiCognitiveSignals["divergenceBucket"],
    budgetDominantPhase: safeString(
      signals.budget?.dominant ?? null,
      "unknown",
    ),
    budgetBalanced: signals.budget?.balanced ?? false,
    budgetStarterBias: signals.budget?.starterBias ?? false,
    budgetFinisherBias: signals.budget?.finisherBias ?? false,
    overallTextTone: safeString(
      signals.openQuestions?.overallTone ?? null,
      "unknown",
    ) as AiCognitiveSignals["overallTextTone"],
  };

  const riasecScores: Record<RiasecLetter, number> = signals.riasec?.scores ?? {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };
  const sortedByScore = RIASEC_LETTERS.map((letter) => ({
    letter,
    score: riasecScores[letter],
  })).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return RIASEC_LETTERS.indexOf(a.letter) - RIASEC_LETTERS.indexOf(b.letter);
  });

  const interests: AiInterestsSignals = {
    riasecScores,
    topThree: signals.riasec?.topThree ?? [],
    dominantCode: signals.riasec?.code ?? "",
    sortedByScore,
  };

  const values: AiValuesSignals = {
    top3: signals.values?.top3 ?? [],
    bottom3: signals.values?.bottom3 ?? [],
    hasAutonomyTop: signals.values?.flags.hasAutonomyTop ?? false,
    hasSecurityTop: signals.values?.flags.hasSecurityTop ?? false,
    hasImpactTop: signals.values?.flags.hasImpactTop ?? false,
    hasCreativityTop: signals.values?.flags.hasCreativityTop ?? false,
    hasLearningTop: signals.values?.flags.hasLearningTop ?? false,
    securityInBottom: signals.values?.flags.securityInBottom ?? false,
    statusInBottom: signals.values?.flags.statusInBottom ?? false,
    recognitionInBottom: signals.values?.flags.recognitionInBottom ?? false,
  };

  const workContext: AiWorkContextSignals = {
    axisPosition: signals.workContext?.axisPosition ?? 50,
    mode: safeString(
      signals.workContext?.mode ?? null,
      "unknown",
    ) as AiWorkContextSignals["mode"],
    summary: safeString(
      signals.workContext?.summary ?? null,
      "unknown",
    ) as AiWorkContextSignals["summary"],
    incomeStability: safeString(
      signals.risk?.incomeStability ?? null,
      "unknown",
    ) as AiWorkContextSignals["incomeStability"],
    workSolitude: safeString(
      signals.risk?.workSolitude ?? null,
      "unknown",
    ) as AiWorkContextSignals["workSolitude"],
    hierarchy: safeString(
      signals.risk?.hierarchy ?? null,
      "unknown",
    ) as AiWorkContextSignals["hierarchy"],
    buildVsJoin: safeString(
      signals.risk?.buildVsJoin ?? null,
      "unknown",
    ) as AiWorkContextSignals["buildVsJoin"],
    risktakingEntrepreneurial: signals.risk?.risktakingEntrepreneurial ?? false,
    structureSeeker: signals.risk?.structureSeeker ?? false,
    ambivalent: signals.risk?.ambivalent ?? false,
  };

  const tradeoffs = signals.tradeoff
    ? Object.entries(signals.tradeoff.byPair)
        .filter(([, v]) => v != null)
        .map(([pairId, v]) => ({
          pairId,
          choice: v!.choice,
          regretForOther: v!.regret,
        }))
    : [];

  const behavioral: AiBehavioralSignals = {
    tradeoffs,
    tradeoffHighRegretAverage: signals.tradeoff?.highRegretAverage ?? 0,
    tradeoffDecisiveCount: signals.tradeoff?.decisiveCount ?? 0,
    tradeoffAmbivalentCount: signals.tradeoff?.ambivalentCount ?? 0,
    passionOverMoney: signals.tradeoff?.passionOverMoney ?? false,
    remotePreferred: signals.tradeoff?.remotePreferred ?? false,
    expertPath: signals.tradeoff?.expertPath ?? false,
    freelanceLeaning: signals.tradeoff?.freelanceLeaning ?? false,
    impactOverRecognition: signals.tradeoff?.impactOverRecognition ?? false,
    groupRole: safeString(signals.multipleChoice?.groupRole ?? null, "unknown"),
    stressResponse: safeString(
      signals.multipleChoice?.stressResponse ?? null,
      "unknown",
    ),
    satisfactionSource: safeString(
      signals.multipleChoice?.satisfactionSource ?? null,
      "unknown",
    ),
    rhythmTopChoice: safeString(
      signals.multipleChoice?.rhythmTopChoice ?? null,
      "unknown",
    ),
    socialInterpretationsCount: signals.socialNuance?.count ?? 0,
    socialDiversityBucket: safeString(
      signals.socialNuance?.diversityBucket ?? null,
      "unknown",
    ) as AiBehavioralSignals["socialDiversityBucket"],
    socialAffectBalance: safeString(
      signals.socialNuance?.affectBalance ?? null,
      "unknown",
    ) as AiBehavioralSignals["socialAffectBalance"],
    memoPresent: signals.textMemo.present,
    memoMode: signals.textMemo.present ? signals.textMemo.mode : "none",
    memoHasReversalMarkers: signals.textMemo.hasReversalMarkers,
    memoHasOwnershipMarkers: signals.textMemo.hasOwnershipMarkers,
  };

  const aiSignals: AiSignals = {
    cognitive,
    interests,
    values,
    workContext,
    behavioral,
    tensions: [],
  };

  const textualResponses: AiTextualResponses = {
    openQuestions: (state.answers.openQuestions ?? []).map((q) => {
      const qSig =
        signals.openQuestions?.byQuestion[q.questionId as OpenQuestionId];
      return {
        questionId: q.questionId,
        text: q.text,
        wordCount:
          qSig?.wordCount ?? q.text.trim().split(/\s+/).filter(Boolean).length,
        tone: qSig?.tone ?? "mixed",
      };
    }),
    socialNuance: state.answers.socialNuance
      ? {
          sceneId: state.answers.socialNuance.sceneId,
          interpretations: state.answers.socialNuance.interpretations.slice(),
        }
      : null,
    textMemo:
      state.answers.textMemo && state.answers.textMemo.mode === "text"
        ? {
            mode: "text",
            content: state.answers.textMemo.content,
            wordCount:
              state.answers.textMemo.wordCount ??
              state.answers.textMemo.content.trim().split(/\s+/).filter(Boolean)
                .length,
          }
        : null,
    alternativeUses: state.answers.alternativeUses?.responses.slice() ?? [],
  };

  return {
    meta: {
      sessionId: state.sessionId,
      locale: "fr",
      startedAt: state.startedAt,
      completedAt: state.completedAt,
      schemaVersion: PAYLOAD_SCHEMA_VERSION,
    },
    signals: aiSignals,
    textualResponses,
  };
}
