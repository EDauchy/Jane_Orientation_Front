import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button, Highlight } from "../../components/quiz/ui";
import {
  AUDIENCE_OPTIONS,
  CONSTRAINT_OPTIONS,
  HORIZON_OPTIONS,
  MAX_CONSTRAINTS,
} from "../../content/qualify.fr";
import { firstSlug } from "../../lib/quiz/flow/sequence";
import { useAssessment } from "../../lib/quiz/store";
import type {
  Audience,
  QualificationConstraint,
  QualificationHorizon,
} from "../../lib/quiz/types";

export default function Qualify() {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role ?? (user as any)?.role;
  const [proError, setProError] = useState(false);

  const navigate = useNavigate();
  const setAudience = useAssessment((s) => s.setAudience);
  const setQualification = useAssessment((s) => s.setQualification);
  const startSession = useAssessment((s) => s.startSession);
  const existingAudience = useAssessment((s) => s.state.audience);
  const existingQualification = useAssessment((s) => s.state.qualification);
  const existingAnswers = useAssessment((s) => s.state.answers);

  const [audience, setAudienceLocal] = useState<Audience | null>(
    existingAudience,
  );
  const [horizon, setHorizon] = useState<QualificationHorizon | null>(
    existingQualification?.horizon ?? null,
  );
  const [constraints, setConstraints] = useState<QualificationConstraint[]>(
    existingQualification?.constraints ?? [],
  );

  const canSubmit = useMemo(
    () => audience !== null && horizon !== null,
    [audience, horizon],
  );

  function toggleConstraint(id: QualificationConstraint) {
    setConstraints((prev) => {
      if (id === "none") {
        return prev.includes("none") ? [] : ["none"];
      }
      const withoutNone = prev.filter((c) => c !== "none");
      if (withoutNone.includes(id)) return withoutNone.filter((c) => c !== id);
      if (withoutNone.length >= MAX_CONSTRAINTS) return withoutNone;
      return [...withoutNone, id];
    });
  }

  function submit() {
    if (!audience || !horizon) return;
    if (userRole === "user_pro") {
      setProError(true);
      return;
    }
    if (Object.keys(existingAnswers).length === 0) {
      startSession();
    }
    setAudience(audience);
    setQualification({ horizon, constraints });
    navigate(`/quiz/assessment/${firstSlug(audience)}`);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-ink/5">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            to="/quiz"
            aria-label="Retour à l'accueil"
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full hover:bg-ink/5 transition-colors text-[13px] font-bold text-ink"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Retour
          </Link>
          <span className="label" aria-hidden="true">
            Préambule
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 pt-8 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-display text-[32px] sm:text-[44px] leading-[1.05] text-ink">
              Avant de <Highlight color="yellow">commencer</Highlight>
            </h1>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-muted max-w-[560px]">
              Trois questions rapides pour adapter le test à ta situation.
            </p>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="label mb-2">1 — Où en es-tu ?</legend>
            <div className="flex flex-col gap-2">
              {AUDIENCE_OPTIONS.map((opt) => {
                const selected = audience === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAudienceLocal(opt.id)}
                    aria-pressed={selected}
                    className={`text-left rounded-2xl border px-4 py-3 transition-colors ${
                      selected
                        ? "border-purple bg-purple-lt/60"
                        : "border-ink/10 bg-white hover:border-ink/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-1 w-4 h-4 rounded-full shrink-0 border-2 ${
                          selected ? "border-purple bg-purple" : "border-ink/30"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-bold text-[15px] text-ink">
                          {opt.label}
                        </div>
                        <div className="text-[13px] text-muted leading-relaxed">
                          {opt.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="label mb-2">
              2 — À quel horizon veux-tu décider ?
            </legend>
            <div className="flex flex-wrap gap-2">
              {HORIZON_OPTIONS.map((opt) => {
                const selected = horizon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setHorizon(opt.id)}
                    aria-pressed={selected}
                    className={`rounded-full px-4 h-11 text-[14px] font-bold border transition-colors ${
                      selected
                        ? "bg-ink text-white border-ink"
                        : "bg-white text-ink border-ink/15 hover:border-ink/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="label mb-2">
              3 — Quelles contraintes pèsent sur ta décision ?
            </legend>
            <p className="text-[13px] text-muted -mt-1">
              Jusqu'à {MAX_CONSTRAINTS} réponses. Optionnel.
            </p>
            <div className="flex flex-wrap gap-2">
              {CONSTRAINT_OPTIONS.map((opt) => {
                const selected = constraints.includes(opt.id);
                const atCap =
                  !selected &&
                  opt.id !== "none" &&
                  constraints.filter((c) => c !== "none").length >=
                    MAX_CONSTRAINTS;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleConstraint(opt.id)}
                    aria-pressed={selected}
                    disabled={atCap}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 h-10 text-[13px] font-bold border transition-colors ${
                      selected
                        ? "bg-purple text-white border-purple"
                        : "bg-white text-ink border-ink/15 hover:border-ink/40 disabled:opacity-40 disabled:cursor-not-allowed"
                    }`}
                  >
                    {selected ? <Check size={14} aria-hidden="true" /> : null}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canSubmit}
              onClick={submit}
              trailingIcon={<ArrowRight size={18} />}
            >
              Commencer le test
            </Button>
            {proError && (
              <p className="text-[13px] text-red-600 font-medium">
                Ce quiz est réservé aux utilisateurs en recherche d'orientation.
                Votre compte professionnel n'y a pas accès.
              </p>
            )}
            <p className="text-[12px] leading-relaxed text-muted max-w-[520px]">
              Ceci n'est pas un diagnostic. Les réponses alimentent un
              compte-rendu personnel — aucun jugement, aucune note.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
