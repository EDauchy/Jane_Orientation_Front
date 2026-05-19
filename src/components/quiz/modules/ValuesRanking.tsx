import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button, Card, Highlight, ModuleHeader, Pill } from '../ui';
import type { ModuleProps } from './placeholders';
import { useAssessment } from '../../../lib/quiz/store';
import {
  VALUE_IDS,
  type ValueId,
  ValuesRankingSchema,
} from '../../../lib/quiz/validators/values';

const VALUE_DEFS: Record<ValueId, { label: string; hint: string }> = {
  autonomy: {
    label: 'Autonomie',
    hint: 'Décider moi-même de ce que je fais, comment',
  },
  financial_security: {
    label: 'Sécurité financière',
    hint: 'Revenu stable, pas d\'aléas',
  },
  social_impact: {
    label: 'Impact social',
    hint: 'Aider, changer quelque chose pour d\'autres',
  },
  recognition: {
    label: 'Reconnaissance',
    hint: 'Être vu, apprécié pour son travail',
  },
  learning: {
    label: 'Apprentissage',
    hint: 'Apprendre, progresser, rester stimulé',
  },
  work_life_balance: {
    label: 'Équilibre perso',
    hint: 'Temps, énergie pour autre chose',
  },
  location_freedom: {
    label: 'Liberté géographique',
    hint: 'Choisir où vivre, pouvoir bouger',
  },
  creativity: {
    label: 'Créativité',
    hint: 'Créer, inventer, exprimer quelque chose',
  },
  status: { label: 'Statut', hint: 'Rang, autorité, prestige' },
  belonging: {
    label: 'Appartenance',
    hint: 'Faire partie d\'une équipe, d\'un collectif',
  },
};

function PickedSlots({
  picked,
  tone,
  onRemove,
}: {
  picked: ValueId[];
  tone: 'top' | 'bottom';
  onRemove: (v: ValueId) => void;
}) {
  const bgTop = tone === 'top' ? 'bg-purple text-white' : 'bg-muted/20 text-ink';
  return (
    <ul className="grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => {
        const v = picked[i];
        if (!v) {
          return (
            <li
              key={i}
              className="h-[86px] rounded-2xl border-2 border-dashed border-ink/15 flex items-center justify-center text-[12px] font-bold text-muted"
            >
              {i + 1}
            </li>
          );
        }
        const def = VALUE_DEFS[v];
        return (
          <li key={i}>
            <motion.button
              type="button"
              layout
              onClick={() => onRemove(v)}
              className={`relative w-full h-[86px] rounded-2xl ${bgTop} px-2 py-2 flex flex-col items-start justify-between text-left`}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/25 text-[10px] font-black">
                {i + 1}
              </span>
              <span className="text-[12px] sm:text-[13px] font-bold leading-tight">
                {def.label}
              </span>
              <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
                <X size={10} strokeWidth={3} />
              </span>
            </motion.button>
          </li>
        );
      })}
    </ul>
  );
}

function ValueGrid({
  options,
  onPick,
  disabledBecauseFull,
}: {
  options: ValueId[];
  onPick: (v: ValueId) => void;
  disabledBecauseFull: boolean;
}) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((v) => {
        const def = VALUE_DEFS[v];
        return (
          <li key={v}>
            <motion.button
              type="button"
              layout
              disabled={disabledBecauseFull}
              onClick={() => onPick(v)}
              whileTap={disabledBecauseFull ? undefined : { scale: 0.98 }}
              className="w-full text-left p-3 rounded-2xl bg-white border border-ink/10 hover:border-purple hover:bg-purple-lt transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="text-[14px] font-bold leading-tight">{def.label}</div>
              <div className="text-[12px] text-muted leading-tight mt-0.5">
                {def.hint}
              </div>
            </motion.button>
          </li>
        );
      })}
    </ul>
  );
}

export function ValuesRanking({ moduleNumber, onReady }: ModuleProps) {
  const existing = useAssessment((s) => s.state.answers.valuesRanking);
  const setValuesRanking = useAssessment((s) => s.setValuesRanking);

  const [step, setStep] = useState<1 | 2>(1);
  const [top3, setTop3] = useState<ValueId[]>((existing?.top3 as ValueId[]) ?? []);
  const [bottom3, setBottom3] = useState<ValueId[]>(
    (existing?.bottom3 as ValueId[]) ?? [],
  );

  const takenTop = useMemo(() => new Set(top3), [top3]);
  const takenBottom = useMemo(() => new Set(bottom3), [bottom3]);

  const availableForTop = useMemo(
    () => VALUE_IDS.filter((v) => !takenTop.has(v)),
    [takenTop],
  );
  const availableForBottom = useMemo(
    () => VALUE_IDS.filter((v) => !takenTop.has(v) && !takenBottom.has(v)),
    [takenTop, takenBottom],
  );

  const topComplete = top3.length === 3;
  const bottomComplete = bottom3.length === 3;

  const valid = useMemo(() => {
    const parsed = ValuesRankingSchema.safeParse({ top3, bottom3 });
    return parsed.success;
  }, [top3, bottom3]);

  useEffect(() => {
    onReady(valid && step === 2);
    if (valid) setValuesRanking({ top3, bottom3 });
  }, [valid, step, top3, bottom3, onReady, setValuesRanking]);

  function pickTop(v: ValueId) {
    if (topComplete) return;
    setTop3((arr) => [...arr, v]);
  }
  function removeTop(v: ValueId) {
    setTop3((arr) => arr.filter((x) => x !== v));
  }

  function pickBottom(v: ValueId) {
    if (bottomComplete) return;
    setBottom3((arr) => [...arr, v]);
  }
  function removeBottom(v: ValueId) {
    setBottom3((arr) => arr.filter((x) => x !== v));
  }

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label="VALEURS"
        color="purple"
        title={
          <>
            Tes <Highlight color="pink">3 intouchables</Highlight>, puis 3 laissables
          </>
        }
      />

      <div className="flex items-center gap-2">
        <Pill variant={step === 1 ? 'purple' : 'ghost'} size="sm">
          1. Intouchables
        </Pill>
        <span className="text-muted">→</span>
        <Pill variant={step === 2 ? 'purple' : 'ghost'} size="sm">
          2. Laissables
        </Pill>
      </div>

      {step === 1 ? (
        <section className="flex flex-col gap-4">
          <p className="text-[15px] leading-relaxed text-muted">
            Choisis les <strong>3 valeurs que tu refuses de sacrifier</strong>, dans
            l'ordre d'importance. Clique sur une valeur pour l'ajouter, re-clique
            pour l'enlever.
          </p>

          <Card variant="soft" padding="md" className="flex flex-col gap-3">
            <span className="label">Tes 3 intouchables</span>
            <PickedSlots picked={top3} tone="top" onRemove={removeTop} />
          </Card>

          <div className="flex flex-col gap-2">
            <span className="label">
              {topComplete ? 'Terminé — étape suivante' : 'Disponibles'}
            </span>
            <ValueGrid
              options={availableForTop}
              onPick={pickTop}
              disabledBecauseFull={topComplete}
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!topComplete}
            onClick={() => setStep(2)}
            trailingIcon={<ArrowRight size={18} />}
          >
            {topComplete ? 'Étape 2 — les laissables' : `${top3.length}/3 choisies`}
          </Button>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <p className="text-[15px] leading-relaxed text-muted">
            Parmi les 7 restantes, choisis les <strong>3 que tu peux laisser de côté</strong>{' '}
            sans problème, dans l'ordre (la plus sacrifiable en premier).
          </p>

          <Card variant="soft" padding="md" className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label">Tes 3 laissables</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[12px] font-bold text-purple hover:underline"
              >
                ← revoir les intouchables
              </button>
            </div>
            <PickedSlots picked={bottom3} tone="bottom" onRemove={removeBottom} />
          </Card>

          <div className="flex flex-col gap-2">
            <span className="label">
              {bottomComplete ? 'Terminé — tu peux continuer' : 'Disponibles'}
            </span>
            <ValueGrid
              options={availableForBottom}
              onPick={pickBottom}
              disabledBecauseFull={bottomComplete}
            />
          </div>
        </section>
      )}
    </div>
  );
}
