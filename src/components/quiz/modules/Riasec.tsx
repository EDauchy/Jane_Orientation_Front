import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Minus, X } from 'lucide-react';
import { Card, Highlight, ModuleHeader, Pill } from '../ui';
import type { ModuleProps } from './placeholders';
import { useAssessment } from '../../../lib/quiz/store';
import type { RiasecResponse } from '../../../lib/quiz/types';
import { RIASEC_ITEM_IDS, type RiasecItemId } from '../../../lib/quiz/validators/riasec';

const ITEMS: Record<RiasecItemId, string> = {
  r1: 'Réparer un objet cassé',
  r2: 'Construire un meuble',
  r3: 'Entretenir un jardin',
  i1: 'Analyser des données chiffrées',
  i2: 'Étudier comment fonctionne un phénomène',
  i3: 'Résoudre une énigme complexe',
  a1: 'Écrire une histoire ou un poème',
  a2: 'Composer une mélodie',
  a3: 'Concevoir le visuel d\'un produit',
  s1: 'Conseiller un proche',
  s2: 'Animer un atelier',
  s3: 'Aider un enfant à apprendre',
  e1: 'Convaincre un groupe d\'adopter une idée',
  e2: 'Lancer un nouveau projet',
  e3: 'Négocier un accord',
  c1: 'Organiser un événement en détail',
  c2: 'Tenir une comptabilité',
  c3: 'Classer et structurer une base d\'infos',
};

function shuffled<T>(arr: readonly T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const CHOICES: { value: RiasecResponse; label: string; Icon: typeof Heart; tone: string }[] = [
  { value: 'like', label: "J'aime", Icon: Heart, tone: 'bg-pink text-white' },
  { value: 'neutral', label: 'Neutre', Icon: Minus, tone: 'bg-purple-lt text-ink' },
  { value: 'dislike', label: 'J\'aime pas', Icon: X, tone: 'bg-ink text-white' },
];

export function Riasec({ moduleNumber, onReady }: ModuleProps) {
  const existing = useAssessment((s) => s.state.answers.riasec);
  const setRiasec = useAssessment((s) => s.setRiasec);

  const [order] = useState<RiasecItemId[]>(() => shuffled(RIASEC_ITEM_IDS));
  const [responses, setResponses] = useState<Record<string, RiasecResponse>>(
    existing?.responses ?? {},
  );

  const [cursor, setCursor] = useState(() => {
    const allAnswered = RIASEC_ITEM_IDS.every((id) => id in (existing?.responses ?? {}));
    if (allAnswered) return 0;
    const idx = RIASEC_ITEM_IDS.findIndex((id) => !(id in (existing?.responses ?? {})));
    return idx === -1 ? 0 : idx;
  });

  const allDone = useMemo(
    () => order.every((id) => id in responses),
    [order, responses],
  );

  useEffect(() => {
    onReady(allDone && cursor === order.length - 1);
    if (allDone) setRiasec({ responses });
  }, [allDone, cursor, responses, onReady, setRiasec]);

  const currentId = order[cursor];
  const currentText = ITEMS[currentId];
  const currentResponse = responses[currentId];

  function answer(r: RiasecResponse) {
    setResponses((prev) => ({ ...prev, [currentId]: r }));
    if (cursor < order.length - 1) {
      setTimeout(() => setCursor((c) => Math.min(order.length - 1, c + 1)), 140);
    }
  }

  function goPrev() {
    setCursor((c) => Math.max(0, c - 1));
  }

  const answeredCount = Object.keys(responses).length;

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label="INTÉRÊTS"
        color="purple"
        title={<>18 activités, <Highlight color="yellow">trois réactions</Highlight></>}
      />
      <p className="text-[15px] leading-relaxed text-muted">
        Première réaction. Pas de longue réflexion, pas besoin de justifier.
      </p>

      <div className="flex items-center justify-between">
        <Pill variant="ghost" size="sm">
          Item {cursor + 1} / {order.length}
        </Pill>
        <span className="text-[12px] font-bold text-muted tabular-nums">
          {answeredCount} / {order.length} répondus
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Card variant="soft" padding="lg" className="flex flex-col gap-2 min-h-[160px] justify-center">
            <span className="label">Cette activité, tu en penses quoi ?</span>
            <h3 className="text-[22px] sm:text-[26px] font-bold leading-tight">
              {currentText}
            </h3>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-2">
        {CHOICES.map(({ value, label, Icon, tone }) => {
          const selected = currentResponse === value;
          return (
            <motion.button
              key={value}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => answer(value)}
              className={`h-[88px] rounded-2xl flex flex-col items-center justify-center gap-1 text-[12px] font-bold transition-all ${selected ? tone + ' ring-2 ring-offset-2 ring-purple' : 'bg-white border border-ink/10 hover:bg-purple-lt'}`}
            >
              <Icon size={22} />
              <span>{label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={cursor === 0}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full text-[13px] font-bold text-ink hover:bg-ink/5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowLeft size={14} />
          Revoir l'item précédent
        </button>
        {!allDone ? (
          <span className="text-[11px] text-muted">
            {order.length - answeredCount} item{order.length - answeredCount > 1 ? 's' : ''} restant{order.length - answeredCount > 1 ? 's' : ''}
          </span>
        ) : (
          <Pill variant="green" size="sm">
            ✓ complet
          </Pill>
        )}
      </div>
    </div>
  );
}
