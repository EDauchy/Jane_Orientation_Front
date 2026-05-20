import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ProgressBar } from "./ui";

type Props = {
  idx: number;
  total: number;
  slugKey: string;
  backHref?: string;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function AssessmentLayout({
  idx,
  total,
  slugKey,
  backHref,
  onBack,
  children,
  footer,
}: Props) {
  const progressValue = idx + 1;
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slugKey]);

  const backNode = onBack ? (
    <button
      type="button"
      onClick={onBack}
      aria-label="Revenir au module précédent"
      className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full hover:bg-ink/5 transition-colors text-[13px] font-bold text-ink"
    >
      <ArrowLeft size={14} aria-hidden="true" />
      Retour
    </button>
  ) : backHref ? (
    <Link
      to={backHref}
      aria-label="Revenir à l'écran précédent"
      className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full hover:bg-ink/5 transition-colors text-[13px] font-bold text-ink"
    >
      <ArrowLeft size={14} aria-hidden="true" />
      Retour
    </Link>
  ) : (
    <span className="h-10" />
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg">
      <a
        href="#module-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-[13px] focus:font-bold"
      >
        Aller au contenu
      </a>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-ink/5">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-3 pb-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {backNode}
            <span className="label" aria-live="polite" aria-atomic="true">
              <span className="sr-only">Étape </span>
              {String(progressValue).padStart(2, "0")}
              <span aria-hidden="true"> / </span>
              <span className="sr-only"> sur </span>
              {String(total).padStart(2, "0")}
            </span>
          </div>
          <ProgressBar value={progressValue} total={total} />
        </div>
      </header>

      <h1 className="sr-only">
        Module {progressValue} sur {total}
      </h1>

      <AnimatePresence mode="wait">
        <motion.main
          ref={mainRef}
          id="module-content"
          tabIndex={-1}
          key={slugKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex-1 w-full max-w-[720px] mx-auto px-6 pt-8 pb-40 focus:outline-none"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {footer ? (
        <footer className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-white/0 pt-6 pb-6">
          <div className="w-full max-w-[720px] mx-auto px-4 sm:px-6">
            {footer}
          </div>
        </footer>
      ) : null}
    </div>
  );
}
