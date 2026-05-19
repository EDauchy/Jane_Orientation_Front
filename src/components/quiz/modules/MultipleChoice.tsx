import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Check } from 'lucide-react';
import { Card, Highlight, ModuleHeader, Pill } from '../ui';
import type { ModuleProps } from './placeholders';
import { useAssessment } from '../../../lib/quiz/store';
import type { MultipleChoiceAnswer } from '../../../lib/quiz/types';
import { QCM_OPTIONS, type QcmQuestionId } from '../../../lib/quiz/validators/multiple-choice';

type QuestionMeta = {
  kicker: string;
  title: React.ReactNode;
  subtitle: string;
  color: 'purple' | 'orange' | 'pink' | 'yellow' | 'green';
};

const QUESTION_META: Record<QcmQuestionId, QuestionMeta> = {
  'qcm-decision': {
    kicker: 'QCM',
    title: (
      <>
        Quand tu décides, tu <Highlight color="yellow">t'appuies</Highlight> sur…
      </>
    ),
    subtitle: 'Une seule réponse. La plus honnête, pas la plus flatteuse.',
    color: 'orange',
  },
  'qcm-rhythm': {
    kicker: 'RANKING',
    title: (
      <>
        <Highlight color="pink">Classe</Highlight> ces rythmes de travail
      </>
    ),
    subtitle: 'Du plus désirable (en haut) au moins désirable (en bas).',
    color: 'pink',
  },
  'qcm-group-role': {
    kicker: 'QCM',
    title: <>Ton rôle en groupe</>,
    subtitle: 'Celui que tu prends spontanément, sans qu\'on te le demande.',
    color: 'orange',
  },
  'qcm-stress': {
    kicker: 'QCM',
    title: <>Plusieurs imprévus en même temps</>,
    subtitle: 'Ta première réaction honnête, pas la « bonne » réponse.',
    color: 'orange',
  },
  'qcm-satisfaction': {
    kicker: 'QCM',
    title: (
      <>
        La <Highlight color="yellow">satisfaction</Highlight> la plus profonde
      </>
    ),
    subtitle: 'Celle qui te reste dans le corps une fois le projet fini.',
    color: 'purple',
  },
};

function findAnswer(
  list: MultipleChoiceAnswer[] | undefined,
  id: QcmQuestionId,
): MultipleChoiceAnswer | undefined {
  return list?.find((a) => a.questionId === id);
}

export function MultipleChoice({ config, moduleNumber, onReady }: ModuleProps) {
  const questionId = config.slug as QcmQuestionId;
  const spec = QCM_OPTIONS[questionId];
  const meta = QUESTION_META[questionId];

  const existingList = useAssessment((s) => s.state.answers.multipleChoice);
  const upsert = useAssessment((s) => s.upsertMultipleChoice);

  const existing = useMemo(
    () => findAnswer(existingList, questionId),
    [existingList, questionId],
  );

  if (spec.kind === 'single') {
    return (
      <SingleChoice
        questionId={questionId}
        meta={meta}
        moduleNumber={moduleNumber}
        options={spec.options}
        initial={
          existing && existing.kind === 'single' && typeof existing.value === 'string'
            ? existing.value
            : null
        }
        onReady={onReady}
        upsert={upsert}
      />
    );
  }

  return (
    <Ranking
      questionId={questionId}
      meta={meta}
      moduleNumber={moduleNumber}
      options={spec.options}
      initial={
        existing && existing.kind === 'ranking' && Array.isArray(existing.value)
          ? existing.value
          : null
      }
      onReady={onReady}
      upsert={upsert}
    />
  );
}

type CommonProps = {
  questionId: QcmQuestionId;
  meta: QuestionMeta;
  moduleNumber: number;
  options: { value: string; label: string }[];
  onReady: (r: boolean) => void;
  upsert: (a: MultipleChoiceAnswer) => void;
};

function SingleChoice({
  questionId,
  meta,
  moduleNumber,
  options,
  initial,
  onReady,
  upsert,
}: CommonProps & { initial: string | null }) {
  const [selected, setSelected] = useState<string | null>(initial);

  useEffect(() => {
    const valid = selected != null;
    onReady(valid);
    if (valid) {
      upsert({ questionId, kind: 'single', value: selected });
    }
  }, [selected, onReady, upsert, questionId]);

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label={meta.kicker}
        color={meta.color}
        title={meta.title}
      />
      <p className="text-[15px] leading-relaxed text-muted">{meta.subtitle}</p>

      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const active = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(opt.value)}
              className={`text-left rounded-2xl px-4 py-4 transition-all border-2 flex items-center justify-between gap-3 ${
                active
                  ? 'bg-ink text-white border-ink shadow-md'
                  : 'bg-white border-ink/10 hover:border-ink/30'
              }`}
            >
              <span className="text-[15px] font-medium leading-snug">{opt.label}</span>
              {active ? <Check size={18} className="shrink-0" /> : null}
            </motion.button>
          );
        })}
      </div>

      {selected ? (
        <Pill variant="green" size="sm">
          ✓ réponse enregistrée
        </Pill>
      ) : (
        <span className="text-[11px] text-muted">Sélectionne une option.</span>
      )}
    </div>
  );
}

function Ranking({
  questionId,
  meta,
  moduleNumber,
  options,
  initial,
  onReady,
  upsert,
}: CommonProps & { initial: string[] | null }) {
  const defaultOrder = useMemo(() => options.map((o) => o.value), [options]);

  const [order, setOrder] = useState<string[]>(() => {
    if (initial && initial.length === options.length) return initial;
    return defaultOrder;
  });
  const [touched, setTouched] = useState<boolean>(initial != null);

  const labelByValue = useMemo(() => {
    const out: Record<string, string> = {};
    for (const o of options) out[o.value] = o.label;
    return out;
  }, [options]);

  useEffect(() => {
    const valid = touched && order.length === options.length;
    onReady(valid);
    if (valid) {
      upsert({ questionId, kind: 'ranking', value: order });
    }
  }, [order, touched, onReady, upsert, questionId, options.length]);

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= order.length) return;
    setOrder((prev) => {
      const copy = prev.slice();
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
    setTouched(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label={meta.kicker}
        color={meta.color}
        title={meta.title}
      />
      <p className="text-[15px] leading-relaxed text-muted">{meta.subtitle}</p>

      <Card variant="soft" padding="md" className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="label">Ordre actuel</span>
          <span className="text-[11px] text-muted">Flèches pour réorganiser</span>
        </div>
        <ol className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {order.map((value, idx) => (
              <motion.li
                layout
                key={value}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 bg-white rounded-2xl border border-ink/10 pl-3 pr-2 py-2"
              >
                <span className="w-7 h-7 shrink-0 rounded-full bg-pink text-white inline-flex items-center justify-center text-[12px] font-black">
                  {idx + 1}
                </span>
                <span className="flex-1 text-[14px] font-medium leading-snug">
                  {labelByValue[value]}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Monter"
                    className="w-8 h-8 rounded-full bg-purple-lt text-ink inline-flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === order.length - 1}
                    aria-label="Descendre"
                    className="w-8 h-8 rounded-full bg-purple-lt text-ink inline-flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </Card>

      {touched ? (
        <Pill variant="green" size="sm">
          ✓ classement enregistré
        </Pill>
      ) : (
        <span className="text-[11px] text-muted">
          Réorganise au moins une fois pour valider.
        </span>
      )}
    </div>
  );
}
