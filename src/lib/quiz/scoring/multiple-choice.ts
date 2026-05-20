import type { MultipleChoiceAnswer } from "../types";
import type { QcmQuestionId } from "../validators/multiple-choice";

export type MultipleChoiceSignals = {
  byQuestion: Partial<Record<QcmQuestionId, string | string[]>>;
  decisionStyle:
    | "analytical"
    | "intuitive"
    | "social"
    | "pragmatic"
    | "empirical"
    | null;
  rhythmTopChoice: string | null;
  groupRole: string | null;
  stressResponse: string | null;
  satisfactionSource: string | null;
  flags: {
    dataDriven: boolean;
    intuitive: boolean;
    needsOthers: boolean;
    leaderArchetype: boolean;
    craftOriented: boolean;
    impactOriented: boolean;
    flexibilitySeeker: boolean;
  };
};

const DECISION_MAP: Record<string, MultipleChoiceSignals["decisionStyle"]> = {
  data: "analytical",
  intuition: "intuitive",
  advice: "social",
  precedent: "pragmatic",
  test: "empirical",
};

export function analyzeMultipleChoice(
  answers: MultipleChoiceAnswer[],
): MultipleChoiceSignals {
  const byQuestion: MultipleChoiceSignals["byQuestion"] = {};
  for (const a of answers) {
    byQuestion[a.questionId as QcmQuestionId] = a.value;
  }

  const decisionRaw = byQuestion["qcm-decision"];
  const decisionStyle =
    typeof decisionRaw === "string"
      ? (DECISION_MAP[decisionRaw] ?? null)
      : null;

  const rhythmRaw = byQuestion["qcm-rhythm"];
  const rhythmTopChoice =
    Array.isArray(rhythmRaw) && rhythmRaw.length > 0 ? rhythmRaw[0] : null;

  const groupRaw = byQuestion["qcm-group-role"];
  const groupRole = typeof groupRaw === "string" ? groupRaw : null;

  const stressRaw = byQuestion["qcm-stress"];
  const stressResponse = typeof stressRaw === "string" ? stressRaw : null;

  const satisfactionRaw = byQuestion["qcm-satisfaction"];
  const satisfactionSource =
    typeof satisfactionRaw === "string" ? satisfactionRaw : null;

  return {
    byQuestion,
    decisionStyle,
    rhythmTopChoice,
    groupRole,
    stressResponse,
    satisfactionSource,
    flags: {
      dataDriven: decisionStyle === "analytical",
      intuitive: decisionStyle === "intuitive",
      needsOthers: decisionStyle === "social" || stressResponse === "delegate",
      leaderArchetype: groupRole === "leader",
      craftOriented: satisfactionSource === "craft",
      impactOriented: satisfactionSource === "impact",
      flexibilitySeeker:
        rhythmTopChoice === "flexible" || rhythmTopChoice === "waves",
    },
  };
}
