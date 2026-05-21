import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AssessmentAnswers,
  AssessmentState,
  Audience,
  BudgetAnswer,
  AlternativeUsesAnswer,
  TradeoffAnswer,
  OpenQuestionAnswer,
  MultipleChoiceAnswer,
  Qualification,
  ValuesRankingAnswer,
  RiasecAnswer,
  RiskToleranceAnswer,
  SocialNuanceAnswer,
  TextMemoAnswer,
} from "./types";
import { SCHEMA_VERSION } from "./types";
import { totalInFlow } from "./flow/sequence";

let _demoBackup: AssessmentState | null = null;

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function freshState(): AssessmentState {
  return {
    schemaVersion: SCHEMA_VERSION,
    sessionId: randomId(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    currentModuleIdx: 0,
    audience: null,
    qualification: null,
    answers: {},
  };
}

type StoreApi = {
  state: AssessmentState;
  isDemo: boolean;

  startSession: () => void;
  resetSession: () => void;
  markCompleted: () => void;
  startDemo: () => void;
  endDemo: () => void;

  setAudience: (a: Audience) => void;
  setQualification: (q: Qualification) => void;

  setCurrentIdx: (idx: number) => void;

  setBudget: (a: BudgetAnswer) => void;
  setAlternativeUses: (a: AlternativeUsesAnswer) => void;
  setTradeoff: (a: TradeoffAnswer[]) => void;

  upsertOpenQuestion: (a: OpenQuestionAnswer) => void;
  upsertMultipleChoice: (a: MultipleChoiceAnswer) => void;

  setValuesRanking: (a: ValuesRankingAnswer) => void;
  setRiasec: (a: RiasecAnswer) => void;
  setRiskTolerance: (a: RiskToleranceAnswer) => void;
  setSocialNuance: (a: SocialNuanceAnswer) => void;
  setTextMemo: (a: TextMemoAnswer) => void;
};

function upsertById<T extends { questionId: string }>(
  list: T[] | undefined,
  item: T,
): T[] {
  if (!list) return [item];
  const idx = list.findIndex((x) => x.questionId === item.questionId);
  if (idx === -1) return [...list, item];
  const copy = list.slice();
  copy[idx] = item;
  return copy;
}

function patchAnswers(
  s: AssessmentState,
  patch: Partial<AssessmentAnswers>,
): AssessmentState {
  return { ...s, answers: { ...s.answers, ...patch } };
}

const STORE_VERSION = 2;

export const useAssessment = create<StoreApi>()(
  persist(
    (set, get) => ({
      state: freshState(),
      isDemo: false,

      startSession: () => set({ state: freshState() }),
      resetSession: () => set({ state: freshState() }),
      markCompleted: () =>
        set((s) => ({
          state: { ...s.state, completedAt: new Date().toISOString() },
        })),
      startDemo: () => {
        _demoBackup = get().state;
        set({ state: freshState(), isDemo: true });
      },
      endDemo: () => {
        const backup = _demoBackup;
        _demoBackup = null;
        set({ state: backup ?? freshState(), isDemo: false });
      },

      setAudience: (a) =>
        set((s) => ({
          state: { ...s.state, audience: a, currentModuleIdx: 0 },
        })),
      setQualification: (q) =>
        set((s) => ({ state: { ...s.state, qualification: q } })),

      setCurrentIdx: (idx) =>
        set((s) => {
          const total = s.state.audience ? totalInFlow(s.state.audience) : 0;
          const clamped =
            total === 0 ? 0 : Math.max(0, Math.min(total - 1, idx));
          return { state: { ...s.state, currentModuleIdx: clamped } };
        }),

      setBudget: (a) =>
        set((s) => ({ state: patchAnswers(s.state, { budget: a }) })),
      setAlternativeUses: (a) =>
        set((s) => ({ state: patchAnswers(s.state, { alternativeUses: a }) })),
      setTradeoff: (a) =>
        set((s) => ({ state: patchAnswers(s.state, { tradeoff: a }) })),

      upsertOpenQuestion: (a) =>
        set((s) => ({
          state: patchAnswers(s.state, {
            openQuestions: upsertById(s.state.answers.openQuestions, a),
          }),
        })),
      upsertMultipleChoice: (a) =>
        set((s) => ({
          state: patchAnswers(s.state, {
            multipleChoice: upsertById(s.state.answers.multipleChoice, a),
          }),
        })),

      setValuesRanking: (a) =>
        set((s) => ({ state: patchAnswers(s.state, { valuesRanking: a }) })),
      setRiasec: (a) =>
        set((s) => ({ state: patchAnswers(s.state, { riasec: a }) })),
      setRiskTolerance: (a) =>
        set((s) => ({ state: patchAnswers(s.state, { riskTolerance: a }) })),
      setSocialNuance: (a) =>
        set((s) => ({ state: patchAnswers(s.state, { socialNuance: a }) })),
      setTextMemo: (a) =>
        set((s) => ({ state: patchAnswers(s.state, { textMemo: a }) })),
    }),
    {
      name: "orientation-assessment-v2",
      storage: createJSONStorage(() => localStorage),
      version: STORE_VERSION,
      partialize: (s) => ({ state: s.state }),
      migrate: (persisted, version) => {
        const incoming = persisted as {
          state?: { schemaVersion?: string };
        } | null;
        if (
          version !== STORE_VERSION ||
          incoming?.state?.schemaVersion !== SCHEMA_VERSION
        ) {
          console.info(
            "[orientation] schema mismatch — resetting local state (was v%s, now v%s)",
            incoming?.state?.schemaVersion ?? "unknown",
            SCHEMA_VERSION,
          );
          return { state: freshState() };
        }
        return persisted;
      },
    },
  ),
);
