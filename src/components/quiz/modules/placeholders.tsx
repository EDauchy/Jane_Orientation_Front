import type { ReactNode } from 'react';
import { Card, Highlight, ModuleHeader, Pill } from '../ui';
import type { ModuleConfig } from '../../../lib/quiz/modules-config';

export type ModuleProps = {
  config: ModuleConfig;
  moduleNumber: number;
  onReady: (ready: boolean) => void;
};

function PlaceholderBody({
  config,
  moduleNumber,
  kicker,
  title,
  subtitle,
  children,
  color,
}: {
  config: ModuleConfig;
  moduleNumber: number;
  kicker: string;
  title: ReactNode;
  subtitle: string;
  children?: ReactNode;
  color?: 'purple' | 'orange' | 'pink' | 'yellow' | 'green';
}) {
  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader num={moduleNumber} label={kicker} title={title} color={color ?? 'purple'} />
      <p className="text-[15px] leading-relaxed text-muted">{subtitle}</p>

      <Card variant="soft" padding="md" className="flex flex-col gap-2">
        <Pill variant="ghost" size="sm">
          Placeholder — contenu phase 3/4
        </Pill>
        <div className="text-[13px] text-ink/70 leading-relaxed">
          <strong>slug:</strong> <code>{config.slug}</code> ·{' '}
          <strong>component:</strong> <code>{config.component}</code> ·{' '}
          <strong>category:</strong> <code>{config.category}</code>
          {config.hidden ? ' · hidden' : ''}
          {config.optional ? ' · optional' : ''}
        </div>
      </Card>

      {children}
    </div>
  );
}

export function BudgetAllocatorPlaceholder({ config, moduleNumber }: ModuleProps) {
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker="MINI-JEU"
      color="purple"
      title={
        <>
          Ton énergie sur un <Highlight color="yellow">projet</Highlight>
        </>
      }
      subtitle="Répartis 100 jetons d'énergie entre 5 phases — idéation, planification, exécution, peaufinage, présentation."
    />
  );
}

export function AlternativeUsesPlaceholder({ config, moduleNumber }: ModuleProps) {
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker="CHRONO"
      color="orange"
      title={
        <>
          60 secondes <Highlight color="yellow">chrono</Highlight>
        </>
      }
      subtitle="Liste le maximum d'usages inhabituels pour un objet. Même les idées absurdes comptent."
    />
  );
}

export function TradeoffScenarioPlaceholder({ config, moduleNumber }: ModuleProps) {
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker="A OU B"
      color="pink"
      title={<>Cinq dilemmes, ton regret mesuré</>}
      subtitle="Choisis entre deux options, puis évalue à quel point l'autre t'aurait manqué."
    />
  );
}

export function ValuesRankingPlaceholder({ config, moduleNumber }: ModuleProps) {
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker="VALEURS"
      color="yellow"
      title={
        <>
          Tes <Highlight color="pink">3 intouchables</Highlight>
        </>
      }
      subtitle="Classe par ordre d'importance. Puis les 3 que tu peux laisser tomber."
    />
  );
}

export function RiasecPlaceholder({ config, moduleNumber }: ModuleProps) {
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker="INTÉRÊTS"
      color="purple"
      title={<>18 activités — j'aime, neutre ou non ?</>}
      subtitle="Réaction instinctive. Pas de longue réflexion."
    />
  );
}

export function RiskTolerancePlaceholder({ config, moduleNumber }: ModuleProps) {
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker="CONTEXTE"
      color="green"
      title={<>Quatre curseurs sur ton cadre idéal</>}
      subtitle="Stabilité, solitude, hiérarchie, construire vs rejoindre."
    />
  );
}

const OPEN_QUESTIONS: Record<
  string,
  { kicker: string; title: ReactNode; subtitle: string }
> = {
  'open-energy': {
    kicker: 'QUESTION OUVERTE',
    title: (
      <>
        Ce qui te donne de <Highlight color="yellow">l'énergie</Highlight>
      </>
    ),
    subtitle:
      '2 ou 3 tâches qui te soutiennent même quand elles sont longues ou exigeantes. Qu\'ont-elles en commun ?',
  },
  'open-friction': {
    kicker: 'QUESTION OUVERTE',
    title: (
      <>
        Ce qui te <Highlight color="orange">vide</Highlight>
      </>
    ),
    subtitle:
      'Quelles tâches ou environnements t\'épuisent vite, même s\'ils sont objectivement simples ?',
  },
  'open-projection': {
    kicker: 'PROJECTION',
    title: <>Sans contraintes — 6 mois ?</>,
    subtitle:
      'Aucune contrainte d\'argent, diplôme ou regard des autres. Quel rôle aimerais-tu tester ?',
  },
  'open-blank-page': {
    kicker: 'QUESTION OUVERTE',
    title: <>Une journée totalement libre</>,
    subtitle: 'Zéro obligation. Raconte-la dans l\'ordre, du réveil au coucher.',
  },
  'open-outside-view': {
    kicker: 'QUESTION OUVERTE',
    title: <>Ce qu\'un proche dirait de toi</>,
    subtitle:
      'Si un proche devait expliquer en 3 phrases ce pour quoi tu es naturellement doué(e), que dirait-il ?',
  },
};

export function OpenQuestionPlaceholder({ config, moduleNumber }: ModuleProps) {
  const data = OPEN_QUESTIONS[config.slug] ?? {
    kicker: 'QUESTION OUVERTE',
    title: 'Question ouverte',
    subtitle: 'Placeholder open question',
  };
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker={data.kicker}
      color="purple"
      title={data.title}
      subtitle={data.subtitle}
    />
  );
}

const QCM_QUESTIONS: Record<
  string,
  { kicker: string; title: ReactNode; subtitle: string }
> = {
  'qcm-decision': {
    kicker: 'QCM',
    title: <>Quand tu décides, tu t'appuies sur…</>,
    subtitle: 'Une réponse. La plus honnête.',
  },
  'qcm-rhythm': {
    kicker: 'RANKING',
    title: <>Classe ces rythmes</>,
    subtitle: 'Du plus désirable au moins désirable.',
  },
  'qcm-group-role': {
    kicker: 'QCM',
    title: <>Ton rôle en groupe</>,
    subtitle: 'Celui que tu prends spontanément, sans qu\'on te le demande.',
  },
  'qcm-stress': {
    kicker: 'QCM',
    title: <>Plusieurs imprévus en même temps</>,
    subtitle: 'Ta première réaction honnête, pas la « bonne » réponse.',
  },
  'qcm-satisfaction': {
    kicker: 'QCM',
    title: <>La satisfaction la plus profonde</>,
    subtitle: 'Celle qui te reste dans le corps une fois le projet fini.',
  },
};

export function MultipleChoicePlaceholder({ config, moduleNumber }: ModuleProps) {
  const data = QCM_QUESTIONS[config.slug] ?? {
    kicker: 'QCM',
    title: 'QCM',
    subtitle: 'Placeholder QCM',
  };
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker={data.kicker}
      color="orange"
      title={data.title}
      subtitle={data.subtitle}
    />
  );
}

export function SocialNuancePlaceholder({ config, moduleNumber }: ModuleProps) {
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker="SCÈNE"
      color="pink"
      title={<>Qu'est-ce qu'il se passe selon toi ?</>}
      subtitle="Une scène ambiguë. Propose au moins 3 interprétations différentes."
    />
  );
}

export function TextMemoPlaceholder({ config, moduleNumber }: ModuleProps) {
  return (
    <PlaceholderBody
      config={config}
      moduleNumber={moduleNumber}
      kicker="MÉMO OPTIONNEL"
      color="green"
      title={
        <>
          Une fois où tu as <Highlight color="yellow">changé d'avis</Highlight>
        </>
      }
      subtitle="Texte 500 signes ou voix 2 minutes. Tu peux passer si tu préfères."
    />
  );
}
