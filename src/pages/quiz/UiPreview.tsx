import { Sparkles, ArrowRight, Check } from "lucide-react";
import {
  Highlight,
  Pill,
  Card,
  Button,
  ProgressBar,
  ModuleHeader,
  StepShell,
} from "../../components/quiz/ui";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 pt-10 first:pt-0">
      <div className="flex items-center gap-3">
        <span className="label">{title}</span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>
      {children}
    </section>
  );
}

export default function UiPreview() {
  return (
    <StepShell
      footer={
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="lg">
            Retour
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            trailingIcon={<ArrowRight size={18} />}
          >
            Continuer
          </Button>
        </div>
      }
    >
      <div className="pb-10">
        <Pill variant="yellow" size="sm">
          UI PREVIEW
        </Pill>
        <h1 className="text-display text-[44px] sm:text-[56px] mt-4 text-ink">
          Design <Highlight color="yellow">system</Highlight> playground —{" "}
          <Highlight color="pink">Jane</Highlight> style
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted max-w-[560px]">
          Page de QA non linkée. Tous les composants réutilisables du design
          system sont empilés ici. Route accessible via URL uniquement.
        </p>
      </div>

      <Section title="Highlights">
        <div className="flex flex-wrap gap-3 text-[22px] font-bold leading-[1.4]">
          <Highlight color="yellow">yellow</Highlight>
          <Highlight color="orange">orange</Highlight>
          <Highlight color="pink">pink</Highlight>
        </div>
      </Section>

      <Section title="Pills">
        <div className="flex flex-wrap gap-2">
          <Pill variant="purple">purple</Pill>
          <Pill variant="yellow">yellow</Pill>
          <Pill variant="orange">orange</Pill>
          <Pill variant="pink">pink</Pill>
          <Pill variant="green">green</Pill>
          <Pill variant="red">red</Pill>
          <Pill variant="ghost">ghost</Pill>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill variant="purple" size="sm">
            sm
          </Pill>
          <Pill variant="purple" size="md">
            md
          </Pill>
          <Pill variant="yellow" size="sm">
            <Sparkles size={12} /> icon
          </Pill>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card variant="purple" padding="lg">
            <Pill variant="yellow" size="sm">
              Feature
            </Pill>
            <h3 className="mt-3 text-[22px] font-bold leading-tight">
              Ton énergie sur un <Highlight color="yellow">projet</Highlight>
            </h3>
            <p className="mt-2 text-[14px] opacity-80">
              Répartis 100 jetons d'énergie sur 5 phases. Pas de bonne réponse.
            </p>
          </Card>
          <Card variant="orange" padding="lg">
            <Pill variant="yellow" size="sm">
              Chrono
            </Pill>
            <h3 className="mt-3 text-[22px] font-bold leading-tight">
              60 secondes <Highlight color="yellow">chrono</Highlight>
            </h3>
            <p className="mt-2 text-[14px] opacity-90">
              Liste le max d'usages pour un objet. Même les idées absurdes.
            </p>
          </Card>
          <Card variant="pink" padding="lg">
            <Pill variant="yellow" size="sm">
              A ou B
            </Pill>
            <h3 className="mt-3 text-[22px] font-bold leading-tight">
              Et ton <Highlight color="yellow">regret</Highlight> vaut combien ?
            </h3>
            <p className="mt-2 text-[14px] opacity-90">
              5 dilemmes. Choisis, puis mesure ce que ça te coûte.
            </p>
          </Card>
          <Card variant="yellow" padding="lg">
            <Pill variant="purple" size="sm">
              Valeurs
            </Pill>
            <h3 className="mt-3 text-[22px] font-bold leading-tight">
              Les 3 valeurs que tu refuses de sacrifier
            </h3>
            <p className="mt-2 text-[14px]">
              Classe 3 valeurs intouchables. Et les 3 qu'on peut laisser.
            </p>
          </Card>
          <Card variant="soft" padding="md">
            <p className="text-[14px]">
              Carte <Highlight color="yellow">soft</Highlight> violet pâle pour
              bloc informatif.
            </p>
          </Card>
          <Card variant="white" padding="md">
            <p className="text-[14px]">
              Carte <strong>white</strong> avec ombre douce pour contenus
              neutres.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="lg"
            trailingIcon={<ArrowRight size={18} />}
          >
            Continuer
          </Button>
          <Button variant="secondary" size="lg">
            Secondary
          </Button>
          <Button variant="ghost" size="lg" leadingIcon={<Check size={18} />}>
            Ghost
          </Button>
          <Button variant="danger" size="md">
            Danger md
          </Button>
          <Button variant="primary" size="md" disabled>
            Disabled
          </Button>
        </div>
      </Section>

      <Section title="ProgressBar">
        <div className="flex flex-col gap-3">
          <ProgressBar value={0} total={18} />
          <ProgressBar value={4} total={18} />
          <ProgressBar value={12} total={18} />
          <ProgressBar value={18} total={18} />
        </div>
      </Section>

      <Section title="ModuleHeader">
        <Card variant="white" padding="lg">
          <ModuleHeader
            num={1}
            label="MODULE"
            color="purple"
            title={
              <>
                Ton énergie sur un <Highlight color="yellow">projet</Highlight>
              </>
            }
          />
          <p className="text-[15px] leading-relaxed text-muted">
            Tu as <strong>100 jetons</strong>. Répartis-les entre les 5 phases.
          </p>
        </Card>
      </Section>

      <Section title="Typography scale">
        <div className="flex flex-col gap-4">
          <h1 className="text-display text-[56px]">h1 display / 56</h1>
          <h2 className="text-[32px] font-bold tracking-tight text-purple-dk">
            h2 purpleDk / 32
          </h2>
          <h3 className="text-[18px] font-bold">h3 body-bold / 18</h3>
          <p className="text-[15px] leading-relaxed">
            Body 15 leading-relaxed — corps standard pour les paragraphes du
            flow.
          </p>
          <span className="label">label 12 uppercase wide</span>
        </div>
      </Section>

      <Section title="Palette">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "purple", cls: "bg-purple text-white" },
            { name: "purpleDk", cls: "bg-purple-dk text-white" },
            { name: "purpleLt", cls: "bg-purple-lt text-ink" },
            { name: "orange", cls: "bg-orange text-white" },
            { name: "orangeLt", cls: "bg-orange-lt text-ink" },
            { name: "pink", cls: "bg-pink text-white" },
            { name: "pinkLt", cls: "bg-pink-lt text-ink" },
            { name: "yellow", cls: "bg-yellow text-ink" },
            { name: "yellowDk", cls: "bg-yellow-dk text-ink" },
            { name: "green", cls: "bg-green text-ink" },
            { name: "greenLt", cls: "bg-green-lt text-ink" },
            { name: "red", cls: "bg-red text-white" },
            { name: "redLt", cls: "bg-red-lt text-ink" },
            { name: "ink", cls: "bg-ink text-white" },
            { name: "muted", cls: "bg-muted text-white" },
          ].map((c) => (
            <div
              key={c.name}
              className={`rounded-2xl h-16 flex items-center justify-center text-[12px] font-bold ${c.cls}`}
            >
              {c.name}
            </div>
          ))}
        </div>
      </Section>
    </StepShell>
  );
}
