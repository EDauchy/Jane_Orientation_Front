import type { AssessmentState, Audience, Qualification } from "../types";

export type SubmissionAnswer =
  | {
      questionId: string;
      type: "interactive-sliders";
      allocations: Record<string, number>;
      totalAllocated: number;
    }
  | { questionId: string; type: "open-text"; response: string }
  | { questionId: string; type: "single-choice"; selectedOption: string }
  | {
      questionId: string;
      type: "values-ranking";
      top3: string[];
      bottom3: string[];
    }
  | {
      questionId: string;
      type: "tradeoff";
      pairId: string;
      choice: "A" | "B";
      regretForOther: number;
    }
  | { questionId: string; type: "ranking"; order: string[] }
  | {
      questionId: string;
      type: "riasec";
      responses: Record<string, "like" | "neutral" | "dislike">;
    }
  | {
      questionId: string;
      type: "social-nuance";
      sceneId: string;
      interpretations: string[];
    }
  | {
      questionId: string;
      type: "alternative-uses";
      object: string;
      responses: string[];
    };

export type SubmissionPayload = {
  sessionId: string;
  startedAt: string;
  completedAt: string;
  audience: Audience | null;
  qualification: Qualification | null;
  answers: SubmissionAnswer[];
};

export function buildSubmissionPayload(
  state: AssessmentState,
): SubmissionPayload {
  const answers: SubmissionAnswer[] = [];
  const a = state.answers;

  if (a.budget) {
    const allocations: Record<string, number> = {
      ideation: a.budget.ideation,
      planning: a.budget.planning,
      execution: a.budget.execution,
      polish: a.budget.polish,
      presentation: a.budget.presentation,
    };
    const totalAllocated = Object.values(allocations).reduce(
      (sum, v) => sum + v,
      0,
    );
    answers.push({
      questionId: "budget-phases",
      type: "interactive-sliders",
      allocations,
      totalAllocated,
    });
  }

  if (a.riasec) {
    answers.push({
      questionId: "riasec",
      type: "riasec",
      responses: a.riasec.responses,
    });
  }

  if (a.valuesRanking) {
    answers.push({
      questionId: "values",
      type: "values-ranking",
      top3: a.valuesRanking.top3,
      bottom3: a.valuesRanking.bottom3,
    });
  }

  if (a.tradeoff) {
    for (const t of a.tradeoff) {
      answers.push({
        questionId: t.pairId,
        type: "tradeoff",
        pairId: t.pairId,
        choice: t.choice,
        regretForOther: t.regretForOther,
      });
    }
  }

  if (a.multipleChoice) {
    for (const mc of a.multipleChoice) {
      if (mc.kind === "single" && typeof mc.value === "string") {
        answers.push({
          questionId: mc.questionId,
          type: "single-choice",
          selectedOption: mc.value,
        });
      } else if (mc.kind === "ranking" && Array.isArray(mc.value)) {
        answers.push({
          questionId: mc.questionId,
          type: "ranking",
          order: mc.value,
        });
      }
    }
  }

  if (a.openQuestions) {
    for (const oq of a.openQuestions) {
      answers.push({
        questionId: oq.questionId,
        type: "open-text",
        response: oq.text,
      });
    }
  }

  if (a.socialNuance) {
    answers.push({
      questionId: "social-nuance",
      type: "social-nuance",
      sceneId: a.socialNuance.sceneId,
      interpretations: a.socialNuance.interpretations,
    });
  }

  if (a.alternativeUses) {
    answers.push({
      questionId: "alternative-uses",
      type: "alternative-uses",
      object: a.alternativeUses.object,
      responses: a.alternativeUses.responses,
    });
  }

  if (a.textMemo && a.textMemo.mode === "text") {
    answers.push({
      questionId: "text-memo",
      type: "open-text",
      response: a.textMemo.content,
    });
  }

  return {
    sessionId: state.sessionId,
    startedAt: state.startedAt,
    completedAt: state.completedAt ?? new Date().toISOString(),
    audience: state.audience,
    qualification: state.qualification,
    answers,
  };
}
