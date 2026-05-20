import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { Button, Card, Highlight, Pill } from "../../components/quiz/ui";
import { useAssessment } from "../../lib/quiz/store";
import { buildSubmissionPayload } from "../../lib/quiz/ai/build-submission";
import RomeInferenceResults, {
  type RomeInference,
} from "../../components/quiz/RomeInferenceResults";
import { supabase } from "../../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type ApiResponse = {
  analysis: {
    orientation: string;
    keyTraits: string[];
    deducedSkills: string[];
  };
  romeRecommendations: unknown;
};

type Phase =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; data: ApiResponse };

const PILL_VARIANTS = ["purple", "pink", "orange", "yellow", "green"] as const;

export default function Export() {
  const state = useAssessment((s) => s.state);
  const resetSession = useAssessment((s) => s.resetSession);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const hasAnswers = useMemo(
    () => Object.keys(state.answers ?? {}).length > 0,
    [state.answers],
  );
  const canSubmit = hasAnswers;

  async function runAnalysis() {
    setPhase({ kind: "loading" });
    try {
      const payload = buildSubmissionPayload(state);
      const res = await fetch(`${API_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Le serveur a renvoyé ${res.status}${text ? ` — ${text.slice(0, 200)}` : ""}.`,
        );
      }

      const data = (await res.json()) as ApiResponse;

      // Save ROME job names to profile test_results (best-effort, non-blocking)
      const romeData = data.romeRecommendations as RomeInference[];
      const jobNames =
        romeData?.flatMap((g) =>
          g.metiersRome.slice(0, 3).map((m) => m.libelleAppellation),
        ) ?? [];
      if (jobNames.length > 0) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.access_token) {
            await fetch("/api/profile/update", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ testResults: jobNames }),
            });
          }
        } catch {
          // Non-blocking: ignore save errors
        }
      }

      setPhase({ kind: "success", data });
      resetSession();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur inconnue lors de l'appel.";
      setPhase({ kind: "error", message });
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg">
      <header className="w-full border-b border-ink/5">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-3 flex items-center">
          <Link
            to="/quiz"
            aria-label="Retour à l'accueil"
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full hover:bg-ink/5 transition-colors text-[13px] font-bold text-ink"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Accueil
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 py-12 flex flex-col gap-8">
        {!canSubmit ? (
          <EmptyState />
        ) : (
          <>
            <h1 className="text-display text-[32px] sm:text-[44px] leading-[1.05] text-ink">
              Ton <Highlight color="yellow">orientation</Highlight>
            </h1>

            <AnimatePresence mode="wait">
              {phase.kind === "idle" && (
                <IdleState key="idle" onRun={runAnalysis} />
              )}
              {phase.kind === "loading" && <LoadingState key="loading" />}
              {phase.kind === "error" && (
                <ErrorState
                  key="error"
                  message={phase.message}
                  onRetry={runAnalysis}
                />
              )}
              {phase.kind === "success" && (
                <SuccessState key="success" data={phase.data} />
              )}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <Card variant="soft" padding="lg" className="flex flex-col gap-4">
      <h1 className="text-display text-[28px] sm:text-[36px] leading-tight text-ink">
        Termine d'abord le <Highlight color="yellow">questionnaire</Highlight>
      </h1>
      <p className="text-[15px] leading-relaxed text-muted">
        Aucune réponse n'a encore été enregistrée. Reprends à l'accueil pour
        démarrer le test.
      </p>
      <Link
        to="/quiz"
        className="inline-flex self-start items-center gap-2 h-12 px-6 rounded-full bg-purple text-white font-bold text-[14px] hover:bg-purple-dk transition-colors"
      >
        Aller à l'accueil
      </Link>
    </Card>
  );
}

function IdleState({ onRun }: { onRun: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      className="flex flex-col gap-4"
    >
      <p className="text-[15px] leading-relaxed text-muted max-w-[560px]">
        Tes réponses sont prêtes. Lance l'analyse pour obtenir une lecture de
        ton profil et des pistes de métiers concrètes.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={onRun}
        leadingIcon={<Sparkles size={18} />}
      >
        Lancer l'analyse
      </Button>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Card
        variant="soft"
        padding="lg"
        className="flex flex-col items-center gap-4 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full bg-purple text-white inline-flex items-center justify-center"
        >
          <Loader2 size={28} className="animate-spin" />
        </motion.div>
        <div className="flex flex-col gap-1">
          <h2 className="text-[20px] font-bold text-ink">
            L'IA analyse tes réponses
          </h2>
          <p className="text-[14px] text-muted leading-relaxed max-w-[420px]">
            Compte 10 à 20 secondes. On croise tes signaux et on cherche des
            métiers cohérents.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Card
        variant="white"
        padding="lg"
        className="flex flex-col gap-4 border-red/30 bg-red-lt"
      >
        <div className="flex flex-col gap-1">
          <Pill variant="red" size="sm">
            Erreur
          </Pill>
          <h2 className="text-[18px] font-bold text-ink mt-2">
            L'analyse a échoué
          </h2>
          <p className="text-[13px] text-muted leading-relaxed">{message}</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={onRetry}
          leadingIcon={<RefreshCw size={16} />}
        >
          Réessayer
        </Button>
      </Card>
    </motion.div>
  );
}

function SuccessState({ data }: { data: ApiResponse }) {
  const { analysis, romeRecommendations } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32 }}
      className="flex flex-col gap-6"
    >
      <Card variant="purple" padding="lg" className="flex flex-col gap-2">
        <span className="label opacity-80 text-white/80">Profil dominant</span>
        <h2 className="text-display text-[28px] sm:text-[36px] leading-tight">
          {analysis.orientation}
        </h2>
      </Card>

      <Card variant="white" padding="lg" className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Pill variant="yellow" size="sm">
            Traits
          </Pill>
          <h3 className="text-[18px] font-bold">Traits dominants</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.keyTraits.map((trait, i) => (
            <Pill
              key={`${i}-${trait}`}
              variant={PILL_VARIANTS[i % PILL_VARIANTS.length]}
              size="sm"
            >
              {trait}
            </Pill>
          ))}
        </div>
      </Card>

      <Card variant="white" padding="lg" className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Pill variant="orange" size="sm">
            Savoir-faire
          </Pill>
          <h3 className="text-[18px] font-bold">Pistes de savoir-faire</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {analysis.deducedSkills.map((skill, i) => (
            <li
              key={`${i}-${skill}`}
              className="flex items-start gap-2 text-[14px] text-ink leading-relaxed"
            >
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
              <span>{skill}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card variant="white" padding="lg" className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Pill variant="pink" size="sm">
            ROME
          </Pill>
          <h3 className="text-[18px] font-bold">Métiers ROME suggérés</h3>
        </div>
        <RomeInferenceResults data={romeRecommendations as RomeInference[]} />
      </Card>
    </motion.div>
  );
}
