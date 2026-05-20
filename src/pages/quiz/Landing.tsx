import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  Clock3,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Highlight, Pill } from "../../components/quiz/ui";
import { useAuth } from "../../context/AuthContext";
import { useAssessment } from "../../lib/quiz/store";
import { slugAt, totalInFlow } from "../../lib/quiz/flow/sequence";
import LoginModal from "../../components/LoginModal";
import { seedDemoData } from "../../lib/quiz/demoSeed";

export default function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const assessmentState = useAssessment((s) => s.state);
  const resetSession = useAssessment((s) => s.resetSession);

  const hasSession =
    assessmentState.audience !== null && assessmentState.completedAt === null;
  const currentSlug =
    hasSession && assessmentState.audience
      ? slugAt(assessmentState.audience, assessmentState.currentModuleIdx)
      : undefined;
  const total =
    hasSession && assessmentState.audience
      ? totalInFlow(assessmentState.audience)
      : 0;
  const moduleLabel = hasSession
    ? `Module ${assessmentState.currentModuleIdx + 1}/${total}`
    : "";

  function handlePrimary() {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    if (hasSession && currentSlug) {
      navigate(`/quiz/assessment/${currentSlug}`);
    } else {
      navigate("/quiz/qualify");
    }
  }

  function handleRestart() {
    resetSession();
    navigate("/quiz/qualify");
  }

  function handleDemo() {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    seedDemoData();
    navigate("/quiz/qualify");
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg">
      <section className="w-full flex-1 flex items-center">
        <div className="max-w-[960px] w-full mx-auto px-6 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-7"
          >
            <h1 className="text-display text-[40px] leading-[1.02] sm:text-[60px] lg:text-[80px] text-ink max-w-[960px]">
              On t'aide à <Highlight color="yellow">y voir clair</Highlight>
            </h1>

            <div className="flex flex-col gap-4 max-w-[620px] text-[16px] sm:text-[18px] leading-relaxed text-muted">
              <p>
                Que tu cherches ta filière, que tu penses changer de voie, ou
                que tu sois en pleine reconversion — ce parcours s'adapte à ta
                situation.
              </p>
              <p>
                15 à 20 minutes, ton rythme, sans jugement. À la fin, tu repars
                avec des pistes de domaines concrètes à creuser.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Pill variant="ghost" size="sm">
                <Clock3 size={12} aria-hidden="true" />
                15–20 min
              </Pill>
              <Pill variant="ghost" size="sm">
                <Lock size={12} aria-hidden="true" />
                100% local
              </Pill>
              <Pill variant="ghost" size="sm">
                <Sparkles size={12} aria-hidden="true" />
                aucun compte
              </Pill>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {!loading && !user && (
                <p className="text-[13px] text-purple font-medium">
                  Connecte-toi pour accéder au quiz.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 h-14 px-7 rounded-full border border-ink/10 text-ink text-[16px] font-medium hover:bg-ink/5 transition-colors"
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                  Retour à l'accueil
                </Link>

                <button
                  onClick={handlePrimary}
                  disabled={loading}
                  className="inline-flex items-center gap-2 h-14 px-7 rounded-full bg-purple text-white text-[16px] font-bold hover:bg-purple-dk transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasSession ? "Reprendre le quiz" : "Commencer"}
                  {hasSession && (
                    <span className="text-[12px] font-normal opacity-80">
                      — {moduleLabel}
                    </span>
                  )}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>

              {hasSession && user && (
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink transition-colors w-fit"
                >
                  <RotateCcw size={12} aria-hidden="true" />
                  Recommencer depuis le début
                </button>
              )}

              <p className="text-[13px] text-muted">
                Tu peux interrompre et reprendre quand tu veux.
              </p>

              {user && (
                <button
                  onClick={handleDemo}
                  className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-purple transition-colors w-fit mt-2 border border-dashed border-ink/15 rounded-full px-3 py-1.5 hover:border-purple/40"
                >
                  <Clapperboard size={12} aria-hidden="true" />
                  Mode présentation — remplir automatiquement
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="w-full border-t border-ink/5">
        <div className="max-w-[1120px] mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-[12px] text-muted">
          <span>Preview — projet de fac, usage pédagogique.</span>
          <span>© {new Date().getFullYear()} boussole</span>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        redirectTo="/quiz"
      />
    </div>
  );
}
