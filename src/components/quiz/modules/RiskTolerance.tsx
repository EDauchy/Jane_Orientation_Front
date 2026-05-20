import { useEffect, useState } from "react";
import { Card, Highlight, ModuleHeader } from "../ui";
import type { ModuleProps } from "./placeholders";
import { useAssessment } from "../../../lib/quiz/store";
import type { RiskToleranceAnswer } from "../../../lib/quiz/types";
import { RiskToleranceSchema } from "../../../lib/quiz/validators/risk";

type Five = 1 | 2 | 3 | 4 | 5;

type Axis = {
  key: keyof RiskToleranceAnswer;
  title: string;
  leftLabel: string;
  rightLabel: string;
};

const AXES: Axis[] = [
  {
    key: "incomeStability",
    title: "Stabilité du revenu",
    leftLabel: "variable, ça me va",
    rightLabel: "fixe garanti, indispensable",
  },
  {
    key: "workSolitude",
    title: "Travail en solo",
    leftLabel: "insupportable",
    rightLabel: "idéal",
  },
  {
    key: "hierarchy",
    title: "Hiérarchie",
    leftLabel: "me pèse",
    rightLabel: "me rassure",
  },
  {
    key: "buildVsJoin",
    title: "Construire ou rejoindre",
    leftLabel: "rejoindre un projet existant",
    rightLabel: "créer le mien",
  },
];

const DEFAULTS: RiskToleranceAnswer = {
  incomeStability: 3,
  workSolitude: 3,
  hierarchy: 3,
  buildVsJoin: 3,
};

export function RiskTolerance({ moduleNumber, onReady }: ModuleProps) {
  const existing = useAssessment((s) => s.state.answers.riskTolerance);
  const setRiskTolerance = useAssessment((s) => s.setRiskTolerance);

  const [values, setValues] = useState<RiskToleranceAnswer>(
    existing ?? DEFAULTS,
  );

  useEffect(() => {
    const parsed = RiskToleranceSchema.safeParse(values);
    onReady(parsed.success);
    if (parsed.success) setRiskTolerance(values);
  }, [values, onReady, setRiskTolerance]);

  function update(key: keyof RiskToleranceAnswer, n: Five) {
    setValues((v) => ({ ...v, [key]: n }));
  }

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label="CONTEXTE"
        color="green"
        title={
          <>
            Ton <Highlight color="yellow">cadre</Highlight> idéal
          </>
        }
      />
      <p className="text-[15px] leading-relaxed text-muted">
        Quatre curseurs, 1 à 5. Place-toi où tu te sens honnêtement, pas où tu
        penses que « c'est mieux ».
      </p>

      <ul className="flex flex-col gap-3">
        {AXES.map((axis) => {
          const value = values[axis.key] as Five;
          return (
            <li key={axis.key}>
              <Card
                variant="white"
                padding="md"
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-bold leading-tight">
                    {axis.title}
                  </span>
                  <span className="text-[20px] font-black tabular-nums text-purple-dk">
                    {value}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={value}
                  onChange={(e) =>
                    update(axis.key, Number(e.target.value) as Five)
                  }
                  className="range-purple"
                  aria-label={`${axis.title} : ${value} sur 5`}
                />
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span className="max-w-[45%] leading-tight">
                    {axis.leftLabel}
                  </span>
                  <span className="max-w-[45%] text-right leading-tight">
                    {axis.rightLabel}
                  </span>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
