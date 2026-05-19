import { useEffect, useMemo, useState } from 'react';
import { Card, Highlight, ModuleHeader, Pill } from '../ui';
import type { ModuleProps } from './placeholders';
import { useAssessment } from '../../../lib/quiz/store';
import {
  MAX_CHARS,
  MIN_CHARS,
  type OpenQuestionId,
} from '../../../lib/quiz/validators/open-question';

type Meta = {
  kicker: string;
  title: React.ReactNode;
  subtitle: string;
  placeholder: string;
  hint: string;
  color: 'purple' | 'orange' | 'pink' | 'yellow' | 'green';
};

const META: Record<OpenQuestionId, Meta> = {
  'open-energy': {
    kicker: 'QUESTION OUVERTE',
    title: (
      <>
        Ce qui te donne de <Highlight color="yellow">l'énergie</Highlight>
      </>
    ),
    subtitle:
      '2 ou 3 tâches qui te soutiennent même quand elles sont longues ou exigeantes. Qu\'ont-elles en commun ?',
    placeholder:
      'ex. Quand je code seul le matin, quand j\'explique un truc à quelqu\'un, quand je dessine…',
    hint: 'Cite des situations concrètes, pas des qualités.',
    color: 'purple',
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
    placeholder:
      'ex. Les réunions où je ne parle pas, le travail répétitif sans contexte, l\'attente…',
    hint: 'Pas besoin d\'être fier. L\'épuisement est une info.',
    color: 'orange',
  },
  'open-projection': {
    kicker: 'PROJECTION',
    title: (
      <>
        Sans contraintes — <Highlight color="pink">6 mois</Highlight> ?
      </>
    ),
    subtitle:
      'Aucune contrainte d\'argent, diplôme ou regard des autres. Quel rôle aimerais-tu tester ?',
    placeholder:
      'ex. Ouvrir un café et tester la restauration, partir 6 mois suivre un chantier, écrire un livre…',
    hint: 'Décris ce que tu ferais au quotidien, pas le titre du poste.',
    color: 'pink',
  },
  'open-blank-page': {
    kicker: 'QUESTION OUVERTE',
    title: <>Une journée totalement libre</>,
    subtitle:
      'Zéro obligation, zéro engagement. Raconte-la dans l\'ordre, du réveil au coucher.',
    placeholder:
      'ex. Réveil 8h sans alarme, café lent, lecture, après-midi sport ou atelier, le soir cuisine avec quelqu\'un…',
    hint: 'Plus c\'est spécifique, plus c\'est utile.',
    color: 'yellow',
  },
  'open-outside-view': {
    kicker: 'QUESTION OUVERTE',
    title: (
      <>
        Ce qu\'un <Highlight color="pink">proche</Highlight> dirait de toi
      </>
    ),
    subtitle:
      'Si un proche devait expliquer en 3 phrases ce pour quoi tu es naturellement doué(e), que dirait-il ?',
    placeholder:
      'ex. Untel dirait : « Elle capte vite les gens. Elle range le chaos. Elle ne lâche pas. »',
    hint: 'Mets-toi à sa place, pas à la tienne.',
    color: 'purple',
  },
};

export function OpenQuestion({ config, moduleNumber, onReady }: ModuleProps) {
  const questionId = config.slug as OpenQuestionId;
  const meta = META[questionId];

  const existingList = useAssessment((s) => s.state.answers.openQuestions);
  const upsert = useAssessment((s) => s.upsertOpenQuestion);

  const existing = useMemo(
    () => existingList?.find((a) => a.questionId === questionId),
    [existingList, questionId],
  );

  const [text, setText] = useState<string>(existing?.text ?? '');

  const trimmed = text.trim();
  const charCount = trimmed.length;
  const wordCount = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const valid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  useEffect(() => {
    onReady(valid);
    if (valid) {
      upsert({ questionId, text: trimmed });
    }
  }, [valid, trimmed, onReady, upsert, questionId]);

  const progress = Math.min(100, Math.round((charCount / MIN_CHARS) * 100));

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label={meta.kicker}
        color={meta.color}
        title={meta.title}
      />
      <p className="text-[15px] leading-relaxed text-muted">{meta.subtitle}</p>

      <Card variant="white" padding="md" className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder={meta.placeholder}
          className="min-h-[160px] w-full rounded-2xl bg-purple-lt/60 px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-muted resize-y focus:outline-none focus:ring-2 focus:ring-purple"
          maxLength={MAX_CHARS}
          aria-label="Ta réponse"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-muted leading-snug flex-1">{meta.hint}</span>
          <span className="text-[11px] font-bold tabular-nums text-muted shrink-0">
            {charCount} / {MAX_CHARS}
          </span>
        </div>

        {!valid ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
              <div
                className="h-full bg-purple transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] text-muted tabular-nums shrink-0">
              min {MIN_CHARS}
            </span>
          </div>
        ) : null}
      </Card>

      {valid ? (
        <Pill variant="green" size="sm">
          ✓ {wordCount} mots — réponse enregistrée
        </Pill>
      ) : charCount > 0 ? (
        <span className="text-[11px] text-muted">
          Encore {Math.max(0, MIN_CHARS - charCount)} caractère
          {MIN_CHARS - charCount > 1 ? 's' : ''} avant de valider.
        </span>
      ) : (
        <span className="text-[11px] text-muted">
          Au moins {MIN_CHARS} caractères — deux phrases suffisent.
        </span>
      )}
    </div>
  );
}
