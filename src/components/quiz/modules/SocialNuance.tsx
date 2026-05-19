import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Card, Highlight, ModuleHeader, Pill } from '../ui';
import type { ModuleProps } from './placeholders';
import { useAssessment } from '../../../lib/quiz/store';
import {
  MAX_INTERPRETATION_CHARS,
  MAX_INTERPRETATIONS,
  MIN_INTERPRETATION_CHARS,
  MIN_INTERPRETATIONS,
  SCENES,
  type SocialSceneId,
} from '../../../lib/quiz/validators/social-nuance';

const DEFAULT_SCENE: SocialSceneId = 'late-colleague';

function pickScene(existingId: string | undefined): SocialSceneId {
  if (existingId && existingId in SCENES) return existingId as SocialSceneId;
  const keys = Object.keys(SCENES) as SocialSceneId[];
  return keys[Math.floor(Math.random() * keys.length)] ?? DEFAULT_SCENE;
}

export function SocialNuance({ moduleNumber, onReady }: ModuleProps) {
  const existing = useAssessment((s) => s.state.answers.socialNuance);
  const setSocialNuance = useAssessment((s) => s.setSocialNuance);

  const [sceneId] = useState<SocialSceneId>(() => pickScene(existing?.sceneId));
  const [items, setItems] = useState<string[]>(
    () => existing?.interpretations?.slice() ?? [],
  );
  const [input, setInput] = useState('');

  const scene = SCENES[sceneId];

  const validItems = useMemo(
    () =>
      items.filter((s) => {
        const len = s.trim().length;
        return len >= MIN_INTERPRETATION_CHARS && len <= MAX_INTERPRETATION_CHARS;
      }),
    [items],
  );
  const ready = validItems.length >= MIN_INTERPRETATIONS;

  useEffect(() => {
    onReady(ready);
    if (ready) {
      setSocialNuance({ sceneId, interpretations: validItems });
    }
  }, [ready, validItems, sceneId, onReady, setSocialNuance]);

  function addItem() {
    const v = input.trim();
    if (v.length < MIN_INTERPRETATION_CHARS) return;
    if (items.length >= MAX_INTERPRETATIONS) return;
    setItems((prev) => [...prev, v.slice(0, MAX_INTERPRETATION_CHARS)]);
    setInput('');
  }

  function removeAt(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const inputValid =
    input.trim().length >= MIN_INTERPRETATION_CHARS &&
    items.length < MAX_INTERPRETATIONS;

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label="SCÈNE"
        color="pink"
        title={
          <>
            Qu'est-ce qu'il <Highlight color="yellow">se passe</Highlight> selon toi ?
          </>
        }
      />
      <p className="text-[15px] leading-relaxed text-muted">
        Une scène ambiguë. Propose au moins {MIN_INTERPRETATIONS} interprétations
        <strong> différentes</strong>. Pas de bonne réponse — on regarde la variété.
      </p>

      <Card variant="pink" padding="lg" className="flex flex-col gap-2">
        <span className="label opacity-80">La scène</span>
        <h3 className="text-[18px] sm:text-[20px] font-bold leading-tight">
          {scene.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-white/90">{scene.description}</p>
      </Card>

      <Card variant="white" padding="md" className="flex flex-col gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addItem();
          }}
          className="flex items-start gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INTERPRETATION_CHARS))}
            placeholder="ex. Il vient d'apprendre une mauvaise nouvelle et n'arrive pas à en parler."
            className="flex-1 min-h-[72px] rounded-2xl bg-purple-lt/60 px-4 py-3 text-[14px] leading-relaxed text-ink placeholder:text-muted resize-y focus:outline-none focus:ring-2 focus:ring-pink"
            maxLength={MAX_INTERPRETATION_CHARS}
            aria-label="Nouvelle interprétation"
          />
          <button
            type="submit"
            disabled={!inputValid}
            aria-label="Ajouter"
            className="h-12 w-12 shrink-0 rounded-full bg-pink text-white disabled:opacity-30 inline-flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </form>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted">
            Min. {MIN_INTERPRETATION_CHARS} caractères par interprétation.
          </span>
          <span className="text-[11px] tabular-nums text-muted">
            {input.length} / {MAX_INTERPRETATION_CHARS}
          </span>
        </div>
      </Card>

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((text, idx) => (
            <motion.li
              key={`${idx}-${text.slice(0, 8)}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 bg-white rounded-2xl border border-ink/10 pl-3 pr-2 py-2"
            >
              <span className="w-7 h-7 shrink-0 mt-0.5 rounded-full bg-pink text-white inline-flex items-center justify-center text-[12px] font-black">
                {idx + 1}
              </span>
              <span className="flex-1 text-[14px] leading-relaxed">{text}</span>
              <button
                type="button"
                onClick={() => removeAt(idx)}
                aria-label="Supprimer"
                className="w-8 h-8 shrink-0 rounded-full text-ink/60 hover:bg-ink/5 inline-flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </motion.li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center justify-between">
        <Pill variant="ghost" size="sm">
          {items.length} / {MAX_INTERPRETATIONS}
        </Pill>
        {ready ? (
          <Pill variant="green" size="sm">
            ✓ {validItems.length} interprétations enregistrées
          </Pill>
        ) : (
          <span className="text-[11px] text-muted">
            Encore {Math.max(0, MIN_INTERPRETATIONS - validItems.length)} à ajouter.
          </span>
        )}
      </div>
    </div>
  );
}
