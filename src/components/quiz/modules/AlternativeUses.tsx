import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Timer } from "lucide-react";
import { Card, Highlight, ModuleHeader, Pill } from "../ui";
import type { ModuleProps } from "./placeholders";
import { useAssessment } from "../../../lib/quiz/store";
import type {
  AlternativeUsesAnswer,
  AlternativeUsesObject,
} from "../../../lib/quiz/types";

const OBJECTS: Record<AlternativeUsesObject, { label: string; emoji: string }> =
  {
    trombone: { label: "un trombone", emoji: "📎" },
    brique: { label: "une brique", emoji: "🧱" },
    elastique: { label: "un élastique", emoji: "➰" },
  };

const DURATION_MS = 60_000;

function pickRandomObject(): AlternativeUsesObject {
  const keys = Object.keys(OBJECTS) as AlternativeUsesObject[];
  return keys[Math.floor(Math.random() * keys.length)];
}

type Phase = "idle" | "running" | "done";

export function AlternativeUses({ moduleNumber, onReady }: ModuleProps) {
  const existing = useAssessment((s) => s.state.answers.alternativeUses);
  const setAlternativeUses = useAssessment((s) => s.setAlternativeUses);

  const initialPhase: Phase =
    existing && existing.durationMs >= DURATION_MS ? "done" : "idle";

  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [object] = useState<AlternativeUsesObject>(
    () => existing?.object ?? pickRandomObject(),
  );
  const [responses, setResponses] = useState<string[]>(
    existing?.durationMs && existing.durationMs >= DURATION_MS
      ? existing.responses
      : [],
  );
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(DURATION_MS);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const tickRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const def = OBJECTS[object];
  const seconds = Math.ceil(remaining / 1000);

  useEffect(() => {
    onReady(phase === "done");
  }, [phase, onReady]);

  // Persist current answer state to store when done
  useEffect(() => {
    if (phase !== "done") return;
    const answer: AlternativeUsesAnswer = {
      object,
      responses,
      durationMs: DURATION_MS,
    };
    setAlternativeUses(answer);
  }, [phase, object, responses, setAlternativeUses]);

  function startChrono() {
    if (phase !== "idle") return;
    setPhase("running");
    startedAtRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 50);

    const tick = () => {
      if (startedAtRef.current == null) {
        startedAtRef.current = Date.now();
      }
      const elapsed = Date.now() - startedAtRef.current;
      const left = Math.max(0, DURATION_MS - elapsed);
      setRemaining(left);
      if (left <= 0) {
        stopChrono();
        return;
      }
      tickRef.current = window.setTimeout(tick, 100);
    };
    tickRef.current = window.setTimeout(tick, 100);
  }

  function stopChrono() {
    if (tickRef.current != null) {
      window.clearTimeout(tickRef.current);
      tickRef.current = null;
    }
    setRemaining(0);
    setPhase("done");
  }

  useEffect(() => {
    return () => {
      if (tickRef.current != null) window.clearTimeout(tickRef.current);
    };
  }, []);

  function submitCurrent() {
    const v = input.trim();
    if (!v) return;
    setResponses((prev) => [...prev, v]);
    setInput("");
  }

  const encouragement = useMemo(() => {
    const n = responses.length;
    if (n === 0) return "Première idée, même si elle te paraît nulle.";
    if (n < 3) return "Joli départ — enchaîne sans filtrer.";
    if (n < 6) return `${n} idées — tu entres dans la zone.`;
    if (n < 10) return `${n} idées — continue, même les absurdes comptent.`;
    return `${n} idées — tu es en mode libre, garde le flux.`;
  }, [responses.length]);

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label="CHRONO"
        color="orange"
        title={
          <>
            60 secondes, <Highlight color="yellow">tous les usages</Highlight>
          </>
        }
      />
      <p className="text-[15px] leading-relaxed text-muted">
        Liste le maximum d'usages <strong>inhabituels</strong> pour{" "}
        <strong>{def.label}</strong>. Oui, même les idées absurdes. On n'évalue
        pas la qualité, on regarde le flux.
      </p>

      <Card
        variant={
          phase === "running" ? "orange" : phase === "done" ? "soft" : "purple"
        }
        padding="md"
        className="flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-[36px] leading-none">{def.emoji}</span>
          <div className="flex flex-col">
            <span className="label opacity-80">Ton objet</span>
            <span className="text-[18px] font-bold capitalize leading-tight">
              {def.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Timer size={18} className="opacity-80" />
          <span className="text-[28px] font-black tabular-nums leading-none">
            {seconds.toString().padStart(2, "0")}s
          </span>
        </div>
      </Card>

      {phase === "idle" ? (
        <motion.button
          type="button"
          onClick={startChrono}
          whileTap={{ scale: 0.97 }}
          className="h-14 rounded-full bg-orange text-white font-bold inline-flex items-center justify-center gap-2"
        >
          <Play size={18} />
          Démarrer le chrono
        </motion.button>
      ) : null}

      {phase !== "idle" ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Pill variant={phase === "done" ? "green" : "yellow"} size="sm">
              {responses.length} idée{responses.length > 1 ? "s" : ""}
            </Pill>
            <span className="text-[12px] text-muted">{encouragement}</span>
          </div>

          <Card variant="white" padding="md" className="flex flex-col gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitCurrent();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={phase !== "running"}
                placeholder={
                  phase === "running"
                    ? "ex. attacher deux feuilles…"
                    : "chrono terminé"
                }
                className="flex-1 h-12 px-4 rounded-full bg-purple-lt text-ink placeholder:text-muted text-[15px] font-medium focus:outline-none disabled:opacity-60"
                aria-label="Nouvel usage"
                maxLength={80}
              />
              <button
                type="submit"
                disabled={phase !== "running" || !input.trim()}
                className="h-12 w-12 shrink-0 rounded-full bg-purple text-white disabled:opacity-30 inline-flex items-center justify-center"
                aria-label="Ajouter l'usage"
              >
                <Plus size={20} />
              </button>
            </form>
            <p className="text-[11px] text-muted pl-1">
              Entrée pour valider. Pas besoin de phrases complètes.
            </p>
          </Card>

          {responses.length > 0 ? (
            <ul className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
              {responses.map((r, i) => (
                <motion.li
                  key={`${i}-${r}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-white rounded-2xl border border-ink/10 px-3 py-2"
                >
                  <span className="w-6 h-6 rounded-full bg-purple-lt text-purple-dk inline-flex items-center justify-center text-[11px] font-black">
                    {i + 1}
                  </span>
                  <span className="text-[14px]">{r}</span>
                </motion.li>
              ))}
            </ul>
          ) : null}

          {phase === "done" ? (
            <Card variant="soft" padding="md">
              <Pill variant="green" size="sm">
                ✓ Chrono terminé
              </Pill>
              <p className="mt-2 text-[13px] text-ink/80 leading-relaxed">
                Tu peux continuer. On ne retient ni la qualité ni l'orthographe
                — juste la variété et le flux.
              </p>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
