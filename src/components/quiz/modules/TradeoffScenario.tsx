import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Card, Highlight, ModuleHeader, Pill } from "../ui";
import type { ModuleProps } from "./placeholders";
import { useAssessment } from "../../../lib/quiz/store";
import type { TradeoffAnswer } from "../../../lib/quiz/types";
import {
  TRADEOFF_PAIR_IDS,
  type TradeoffPairId,
} from "../../../lib/quiz/validators/tradeoff";

type Pair = {
  id: TradeoffPairId;
  kicker: string;
  question: string;
  A: { title: string; subtitle: string };
  B: { title: string; subtitle: string };
};

const PAIRS: Pair[] = [
  {
    id: "salary-vs-passion",
    kicker: "Dilemme 1",
    question: "Deux offres sur la table, tu signes laquelle ?",
    A: {
      title: "60k€ en grand groupe",
      subtitle: "Horaires fixes, sujet qui ne te passionne pas trop.",
    },
    B: {
      title: "38k€ en startup",
      subtitle: "Horaires libres, sujet qui te passionne vraiment.",
    },
  },
  {
    id: "remote-vs-team",
    kicker: "Dilemme 2",
    question: "Le cadre de travail, c'est…",
    A: {
      title: "Télétravail 100 %",
      subtitle: "Équipe distribuée, autonomie maximale.",
    },
    B: {
      title: "Bureau 5 jours / 5",
      subtitle: "Équipe soudée, interactions quotidiennes.",
    },
  },
  {
    id: "expert-vs-generalist",
    kicker: "Dilemme 3",
    question: "Dans 5 ans, tu préfères être…",
    A: {
      title: "Expert pointu dans une niche",
      subtitle: "Une référence sur un sujet précis.",
    },
    B: {
      title: "Généraliste polyvalent",
      subtitle: "À l'aise sur beaucoup de sujets différents.",
    },
  },
  {
    id: "employee-vs-freelance",
    kicker: "Dilemme 4",
    question: "Ton rapport à l'argent du mois prochain…",
    A: {
      title: "Salarié, revenu stable",
      subtitle: "Le même montant tous les mois, pas de surprise.",
    },
    B: {
      title: "Freelance, revenu ±40 %",
      subtitle: "Potentiellement plus haut, parfois plus bas.",
    },
  },
  {
    id: "impact-vs-recognition",
    kicker: "Dilemme 5",
    question: "Tu choisirais un poste où…",
    A: {
      title: "Impact visible, zéro reconnaissance",
      subtitle: "Ce que tu fais change des choses, mais personne ne le sait.",
    },
    B: {
      title: "Reconnaissance forte, zéro impact",
      subtitle: "Tu es célébré(e), mais ton travail ne change rien.",
    },
  },
];

const REGRET_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Aucun regret",
  2: "Léger",
  3: "Hésitant",
  4: "Lourd",
  5: "Je l'aurais presque pris",
};

type Draft = {
  choice: "A" | "B" | null;
  regret: 1 | 2 | 3 | 4 | 5 | null;
};

function draftFromAnswers(
  answers: TradeoffAnswer[],
): Record<TradeoffPairId, Draft> {
  const out = {} as Record<TradeoffPairId, Draft>;
  for (const id of TRADEOFF_PAIR_IDS) {
    out[id] = { choice: null, regret: null };
  }
  for (const a of answers) {
    if (TRADEOFF_PAIR_IDS.includes(a.pairId as TradeoffPairId)) {
      out[a.pairId as TradeoffPairId] = {
        choice: a.choice,
        regret: a.regretForOther,
      };
    }
  }
  return out;
}

function firstUnfilledIdx(drafts: Record<TradeoffPairId, Draft>): number {
  for (let i = 0; i < PAIRS.length; i++) {
    const d = drafts[PAIRS[i].id];
    if (!d.choice || !d.regret) return i;
  }
  return PAIRS.length - 1;
}

export function TradeoffScenario({ moduleNumber, onReady }: ModuleProps) {
  const existing = useAssessment((s) => s.state.answers.tradeoff);
  const setTradeoff = useAssessment((s) => s.setTradeoff);

  const [drafts, setDrafts] = useState<Record<TradeoffPairId, Draft>>(() =>
    draftFromAnswers(existing ?? []),
  );
  const [cursor, setCursor] = useState(() => {
    const d = draftFromAnswers(existing ?? []);
    const allFilled = PAIRS.every((p) => d[p.id].choice && d[p.id].regret);
    return allFilled ? 0 : firstUnfilledIdx(d);
  });

  const allDone = useMemo(
    () => PAIRS.every((p) => drafts[p.id].choice && drafts[p.id].regret),
    [drafts],
  );

  useEffect(() => {
    onReady(allDone && cursor === PAIRS.length - 1);
    if (allDone) {
      const answers: TradeoffAnswer[] = PAIRS.map((p) => ({
        pairId: p.id,
        choice: drafts[p.id].choice as "A" | "B",
        regretForOther: drafts[p.id].regret as 1 | 2 | 3 | 4 | 5,
      }));
      setTradeoff(answers);
    }
  }, [allDone, cursor, drafts, onReady, setTradeoff]);

  const pair = PAIRS[cursor];
  const draft = drafts[pair.id];

  function chooseSide(side: "A" | "B") {
    setDrafts((prev) => ({
      ...prev,
      [pair.id]: { choice: side, regret: prev[pair.id].regret },
    }));
  }

  function setRegret(v: 1 | 2 | 3 | 4 | 5) {
    setDrafts((prev) => ({
      ...prev,
      [pair.id]: { choice: prev[pair.id].choice, regret: v },
    }));
  }

  function goNext() {
    if (cursor < PAIRS.length - 1) {
      setCursor((c) => c + 1);
    }
  }

  function goPrev() {
    if (cursor > 0) setCursor((c) => c - 1);
  }

  const filledCount = PAIRS.filter(
    (p) => drafts[p.id].choice && drafts[p.id].regret,
  ).length;

  const canAdvance = draft.choice != null && draft.regret != null;

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label="A OU B"
        color="pink"
        title={
          <>
            Cinq dilemmes, <Highlight color="yellow">ton regret</Highlight>{" "}
            mesuré
          </>
        }
      />
      <p className="text-[15px] leading-relaxed text-muted">
        Choisis une option — même à contrecœur. Puis dis à quel point l'autre
        t'aurait manqué.
      </p>

      <div className="flex items-center justify-between">
        <Pill variant="ghost" size="sm">
          {pair.kicker} · {cursor + 1} / {PAIRS.length}
        </Pill>
        <span className="text-[12px] font-bold text-muted tabular-nums">
          {filledCount} / {PAIRS.length} validés
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={pair.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col gap-3"
        >
          <Card variant="soft" padding="lg" className="flex flex-col gap-1">
            <span className="label">La situation</span>
            <h3 className="text-[20px] sm:text-[24px] font-bold leading-tight">
              {pair.question}
            </h3>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(["A", "B"] as const).map((side) => {
              const selected = draft.choice === side;
              const data = side === "A" ? pair.A : pair.B;
              return (
                <motion.button
                  key={side}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => chooseSide(side)}
                  className={`text-left rounded-3xl p-4 transition-all border-2 ${
                    selected
                      ? "bg-pink text-white border-pink shadow-md"
                      : "bg-white border-ink/10 hover:border-pink/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[11px] font-black tracking-wider ${
                        selected ? "text-white/80" : "text-pink"
                      }`}
                    >
                      OPTION {side}
                    </span>
                    {selected ? <Check size={18} /> : null}
                  </div>
                  <div className="text-[16px] font-bold leading-tight">
                    {data.title}
                  </div>
                  <div
                    className={`text-[13px] mt-1 leading-relaxed ${
                      selected ? "text-white/90" : "text-muted"
                    }`}
                  >
                    {data.subtitle}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {draft.choice ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                variant="white"
                padding="md"
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="label">Le regret pour l'autre</span>
                  <p className="text-[14px] leading-snug">
                    À quel point{" "}
                    <strong>
                      {draft.choice === "A" ? pair.B.title : pair.A.title}
                    </strong>{" "}
                    t'aurait manqué ?
                  </p>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {([1, 2, 3, 4, 5] as const).map((v) => {
                    const selected = draft.regret === v;
                    return (
                      <motion.button
                        key={v}
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setRegret(v)}
                        className={`h-12 rounded-2xl text-[15px] font-black transition-all ${
                          selected
                            ? "bg-ink text-white ring-2 ring-offset-2 ring-pink"
                            : "bg-purple-lt text-ink hover:bg-pink/20"
                        }`}
                      >
                        {v}
                      </motion.button>
                    );
                  })}
                </div>
                {draft.regret ? (
                  <span className="text-[12px] text-muted">
                    {REGRET_LABELS[draft.regret]}
                  </span>
                ) : (
                  <span className="text-[12px] text-muted/70">
                    1 = aucun regret, 5 = j'ai failli prendre l'autre.
                  </span>
                )}
              </Card>
            </motion.div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={cursor === 0}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full text-[13px] font-bold text-ink hover:bg-ink/5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowLeft size={14} />
          Dilemme précédent
        </button>

        {cursor < PAIRS.length - 1 ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={goNext}
            disabled={!canAdvance}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-[13px] font-bold bg-ink text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            Dilemme suivant
          </motion.button>
        ) : allDone ? (
          <Pill variant="green" size="sm">
            ✓ 5 / 5 dilemmes validés
          </Pill>
        ) : (
          <span className="text-[11px] text-muted">
            Choisis une option et ton regret pour valider.
          </span>
        )}
      </div>
    </div>
  );
}
