import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, SkipForward } from "lucide-react";
import { AssessmentLayout } from "../../components/quiz/AssessmentLayout";
import { Button } from "../../components/quiz/ui";
import { MODULES } from "../../lib/quiz/modules-config";
import { MODULE_REGISTRY } from "../../components/quiz/modules/registry";
import {
  indexInFlow,
  nextSlug,
  prevSlug,
  totalInFlow,
} from "../../lib/quiz/flow/sequence";
import { useAssessment } from "../../lib/quiz/store";

export default function ModulePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const audience = useAssessment((s) => s.state.audience);
  const setCurrentIdx = useAssessment((s) => s.setCurrentIdx);
  const markCompleted = useAssessment((s) => s.markCompleted);

  const config = useMemo(() => MODULES.find((m) => m.slug === slug), [slug]);

  const idx = audience ? indexInFlow(audience, slug) : -1;
  const total = audience ? totalInFlow(audience) : 0;

  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (idx >= 0) setCurrentIdx(idx);
  }, [idx, setCurrentIdx]);

  if (!audience) return <Navigate to="/quiz/qualify" replace />;
  if (!config || idx < 0) return <Navigate to="/quiz/qualify" replace />;

  const Component = MODULE_REGISTRY[config.component];
  const isLast = idx === total - 1;

  function goPrev() {
    if (!audience) return;
    const prev = prevSlug(audience, slug);
    if (!prev) {
      navigate("/quiz/qualify");
      return;
    }
    navigate(`/quiz/assessment/${prev}`);
  }

  function goNext() {
    if (!audience) return;
    const next = nextSlug(audience, slug);
    if (!next) {
      markCompleted();
      navigate("/quiz/export");
      return;
    }
    navigate(`/quiz/assessment/${next}`);
  }

  const footer = (
    <div className="flex items-center gap-3">
      {config.optional ? (
        <Button
          variant="ghost"
          size="lg"
          onClick={goNext}
          leadingIcon={<SkipForward size={16} />}
        >
          Passer
        </Button>
      ) : null}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!ready}
        onClick={goNext}
        trailingIcon={<ArrowRight size={18} />}
      >
        {isLast ? "Terminer" : "Continuer"}
      </Button>
    </div>
  );

  return (
    <AssessmentLayout
      idx={idx}
      total={total}
      slugKey={config.slug}
      onBack={goPrev}
      footer={footer}
    >
      <Component config={config} moduleNumber={idx + 1} onReady={setReady} />
    </AssessmentLayout>
  );
}
