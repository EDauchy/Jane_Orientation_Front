import { useEffect, useMemo, useState } from "react";
import { Card, Highlight, ModuleHeader, Pill } from "../ui";
import type { ModuleProps } from "./placeholders";
import { useAssessment } from "../../../lib/quiz/store";
import { BudgetSchema } from "../../../lib/quiz/validators/budget";
import type { BudgetAnswer } from "../../../lib/quiz/types";
import {
  BUDGET_PHASES,
  type BudgetPhase,
} from "../../../lib/quiz/scoring/budget";

const PHASE_LABELS: Record<BudgetPhase, string> = {
  ideation: "Idéation",
  planning: "Planification",
  execution: "Exécution",
  polish: "Peaufinage",
  presentation: "Présentation",
};

const PHASE_HINTS: Record<BudgetPhase, string> = {
  ideation: "Chercher, explorer, comprendre le problème",
  planning: "Structurer, estimer, cadrer avant de lancer",
  execution: "Produire le cœur du livrable, faire le sale boulot",
  polish: "Corriger, raffiner, rendre agréable",
  presentation: "Mettre en scène, présenter, vendre",
};

const EMPTY: BudgetAnswer = {
  ideation: 0,
  planning: 0,
  execution: 0,
  polish: 0,
  presentation: 0,
};

export function BudgetAllocator({ moduleNumber, onReady }: ModuleProps) {
  const budget = useAssessment((s) => s.state.answers.budget);
  const setBudget = useAssessment((s) => s.setBudget);

  const [values, setValues] = useState<BudgetAnswer>(budget ?? EMPTY);

  const total = useMemo(
    () => BUDGET_PHASES.reduce((acc, k) => acc + values[k], 0),
    [values],
  );
  const isValid = total === 100;

  useEffect(() => {
    onReady(isValid);
    if (isValid) setBudget(values);
  }, [isValid, values, onReady, setBudget]);

  function updatePhase(phase: BudgetPhase, next: number) {
    setValues((v) => ({ ...v, [phase]: next }));
  }

  const delta = 100 - total;

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label="MINI-JEU"
        color="purple"
        title={
          <>
            Ton énergie sur un <Highlight color="yellow">projet</Highlight>
          </>
        }
      />
      <p className="text-[15px] leading-relaxed text-muted">
        Tu as <strong>100 jetons d'énergie</strong>. Répartis-les entre les 5
        phases d'un projet comme tu le ferais naturellement. Pas de bonne
        réponse.
      </p>

      <Card
        variant={isValid ? "soft" : "white"}
        padding="md"
        className="flex items-center justify-between gap-3"
      >
        <div className="flex flex-col">
          <span className="label">Total</span>
          <span
            className={`text-[32px] font-black leading-none ${isValid ? "text-green" : total > 100 ? "text-red" : "text-ink"}`}
          >
            {total}
            <span className="text-[18px] font-bold text-muted"> / 100</span>
          </span>
        </div>
        <div className="text-right text-[13px] leading-tight">
          {isValid ? (
            <Pill variant="green" size="sm">
              ✓ tu peux continuer
            </Pill>
          ) : delta > 0 ? (
            <Pill variant="yellow" size="sm">
              +{delta} à répartir
            </Pill>
          ) : (
            <Pill variant="red" size="sm">
              {delta} en trop
            </Pill>
          )}
        </div>
      </Card>

      <ul className="flex flex-col gap-3">
        {BUDGET_PHASES.map((phase) => (
          <li key={phase}>
            <Card variant="white" padding="md" className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold leading-tight">
                    {PHASE_LABELS[phase]}
                  </span>
                  <span className="text-[12px] text-muted leading-tight mt-0.5">
                    {PHASE_HINTS[phase]}
                  </span>
                </div>
                <span
                  className="text-[24px] font-black tabular-nums text-purple-dk"
                  aria-live="polite"
                >
                  {values[phase]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={values[phase]}
                onChange={(e) => updatePhase(phase, Number(e.target.value))}
                className="range-purple"
                aria-label={`${PHASE_LABELS[phase]} : ${values[phase]} jetons`}
              />
            </Card>
          </li>
        ))}
      </ul>

      <Card variant="soft" padding="md">
        <p className="text-[12px] leading-relaxed text-ink/70">
          Astuce : il n'y a pas de bonne répartition. Si tu mets tout dans «
          exécution » ou zéro dans « présentation », ce sont juste des signaux
          sur ta façon de bosser.
        </p>
      </Card>
    </div>
  );
}

// Re-export Zod schema for discoverability
export { BudgetSchema };
