import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Pause, Play, Square, Trash2, Type } from "lucide-react";
import { Card, Highlight, ModuleHeader, Pill } from "../ui";
import type { ModuleProps } from "./placeholders";
import { useAssessment } from "../../../lib/quiz/store";
import type { TextMemoAnswer } from "../../../lib/quiz/types";
import {
  MEMO_MAX_CHARS,
  MEMO_MAX_DURATION_MS,
  MEMO_MIN_CHARS,
} from "../../../lib/quiz/validators/text-memo";

type Mode = "text" | "audio";

function hasMediaRecorder(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.mediaDevices?.getUserMedia != null
  );
}

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TextMemo({ moduleNumber, onReady }: ModuleProps) {
  const existing = useAssessment((s) => s.state.answers.textMemo);
  const setTextMemo = useAssessment((s) => s.setTextMemo);

  const [mode, setMode] = useState<Mode>(existing?.mode ?? "text");
  const voiceSupported = hasMediaRecorder();

  return (
    <div className="flex flex-col gap-5">
      <ModuleHeader
        num={moduleNumber}
        label="MÉMO OPTIONNEL"
        color="green"
        title={
          <>
            Une fois où tu as{" "}
            <Highlight color="yellow">changé d'avis</Highlight>
          </>
        }
      />
      <p className="text-[15px] leading-relaxed text-muted">
        Raconte brièvement un moment où tu as revu ta position sur un sujet
        important. Texte ou voix, 2 minutes max. Tu peux passer ce module.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`h-11 rounded-full inline-flex items-center justify-center gap-2 text-[13px] font-bold transition-all ${
            mode === "text"
              ? "bg-ink text-white"
              : "bg-white border border-ink/10 text-ink hover:bg-ink/5"
          }`}
        >
          <Type size={15} />
          Mode texte
        </button>
        <button
          type="button"
          onClick={() => voiceSupported && setMode("audio")}
          disabled={!voiceSupported}
          className={`h-11 rounded-full inline-flex items-center justify-center gap-2 text-[13px] font-bold transition-all disabled:opacity-40 disabled:pointer-events-none ${
            mode === "audio"
              ? "bg-ink text-white"
              : "bg-white border border-ink/10 text-ink hover:bg-ink/5"
          }`}
        >
          <Mic size={15} />
          Mode voix
          {!voiceSupported ? (
            <span className="text-[10px] font-normal opacity-70">
              (indisponible)
            </span>
          ) : null}
        </button>
      </div>

      {mode === "text" ? (
        <TextEditor
          initial={existing?.mode === "text" ? existing.content : ""}
          onReady={onReady}
          setMemo={setTextMemo}
        />
      ) : (
        <VoiceRecorder
          initial={existing?.mode === "audio" ? existing : undefined}
          onReady={onReady}
          setMemo={setTextMemo}
        />
      )}
    </div>
  );
}

type TextEditorProps = {
  initial: string;
  onReady: (r: boolean) => void;
  setMemo: (a: TextMemoAnswer) => void;
};

function TextEditor({ initial, onReady, setMemo }: TextEditorProps) {
  const [text, setText] = useState(initial);
  const trimmed = text.trim();
  const chars = trimmed.length;
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const valid = chars >= MEMO_MIN_CHARS && chars <= MEMO_MAX_CHARS;

  useEffect(() => {
    onReady(valid);
    if (valid) {
      setMemo({ mode: "text", content: trimmed, wordCount: words });
    }
  }, [valid, trimmed, words, onReady, setMemo]);

  const progress = Math.min(100, Math.round((chars / MEMO_MIN_CHARS) * 100));

  return (
    <Card variant="white" padding="md" className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MEMO_MAX_CHARS))}
        placeholder="ex. L'an dernier, j'étais persuadé que… puis j'ai compris que…"
        className="min-h-[180px] w-full rounded-2xl bg-purple-lt/60 px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-muted resize-y focus:outline-none focus:ring-2 focus:ring-green"
        maxLength={MEMO_MAX_CHARS}
        aria-label="Ton mémo"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted">
          Min {MEMO_MIN_CHARS} / max {MEMO_MAX_CHARS} caractères.
        </span>
        <span className="text-[11px] font-bold tabular-nums text-muted">
          {chars} / {MEMO_MAX_CHARS}
        </span>
      </div>

      {!valid ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
            <div
              className="h-full bg-green transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <Pill variant="green" size="sm">
          ✓ {words} mots — mémo enregistré
        </Pill>
      )}
    </Card>
  );
}

type VoicePhase = "idle" | "recording" | "recorded";

type VoiceRecorderProps = {
  initial?: TextMemoAnswer;
  onReady: (r: boolean) => void;
  setMemo: (a: TextMemoAnswer) => void;
};

function VoiceRecorder({ initial, onReady, setMemo }: VoiceRecorderProps) {
  const [phase, setPhase] = useState<VoicePhase>(
    initial?.content ? "recorded" : "idle",
  );
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [storedDataUrl, setStoredDataUrl] = useState<string | null>(
    initial?.content ?? null,
  );

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    const ready = phase === "recorded" && storedDataUrl != null;
    onReady(ready);
    if (ready && storedDataUrl) {
      setMemo({ mode: "audio", content: storedDataUrl });
    }
  }, [phase, storedDataUrl, onReady, setMemo]);

  useEffect(() => {
    return () => {
      if (tickRef.current != null) window.clearInterval(tickRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: rec.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setStoredDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setPhase("recorded");
      };
      rec.start();
      mediaRef.current = rec;
      startRef.current = null;
      setElapsed(0);
      setPhase("recording");

      tickRef.current = window.setInterval(() => {
        if (startRef.current == null) {
          startRef.current = Date.now();
        }
        const el = Date.now() - startRef.current;
        setElapsed(el);
        if (el >= MEMO_MAX_DURATION_MS) {
          stopRecording();
        }
      }, 200);
    } catch (e) {
      setError(
        "Accès au micro refusé ou indisponible. Tu peux passer en mode texte.",
      );
      setPhase("idle");
    }
  }

  function stopRecording() {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    const rec = mediaRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    mediaRef.current = null;
  }

  function resetRecording() {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setStoredDataUrl(null);
    setElapsed(0);
    startRef.current = null;
    setPhase("idle");
  }

  return (
    <Card variant="white" padding="md" className="flex flex-col gap-4">
      {error ? (
        <div className="rounded-2xl bg-red/10 text-ink px-3 py-2 text-[13px] leading-snug">
          {error}
        </div>
      ) : null}

      {phase === "idle" ? (
        <motion.button
          type="button"
          onClick={startRecording}
          whileTap={{ scale: 0.97 }}
          className="h-14 rounded-full bg-green text-white font-bold inline-flex items-center justify-center gap-2"
        >
          <Mic size={18} />
          Démarrer l'enregistrement
        </motion.button>
      ) : null}

      {phase === "recording" ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span
                className="w-3 h-3 rounded-full bg-red"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-[13px] font-bold">Enregistrement…</span>
            </div>
            <span className="text-[18px] font-black tabular-nums">
              {formatTime(elapsed)} / {formatTime(MEMO_MAX_DURATION_MS)}
            </span>
          </div>

          <div className="h-2 rounded-full bg-ink/10 overflow-hidden">
            <motion.div
              className="h-full bg-green"
              initial={{ width: 0 }}
              animate={{ width: `${(elapsed / MEMO_MAX_DURATION_MS) * 100}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <motion.button
            type="button"
            onClick={stopRecording}
            whileTap={{ scale: 0.97 }}
            className="h-12 rounded-full bg-ink text-white font-bold inline-flex items-center justify-center gap-2"
          >
            <Square size={16} />
            Arrêter
          </motion.button>
        </div>
      ) : null}

      {phase === "recorded" ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Pill variant="green" size="sm">
              ✓ enregistrement prêt
            </Pill>
            <span className="text-[12px] text-muted tabular-nums">
              {formatTime(elapsed || 0)}
            </span>
          </div>

          {(blobUrl ?? storedDataUrl) ? (
            <audio
              controls
              src={blobUrl ?? storedDataUrl ?? undefined}
              className="w-full"
            />
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={resetRecording}
              className="h-11 rounded-full bg-white border border-ink/10 text-ink font-bold inline-flex items-center justify-center gap-2 hover:bg-ink/5"
            >
              <Trash2 size={15} />
              Refaire
            </button>
            <div className="h-11 rounded-full bg-green/15 text-ink font-bold inline-flex items-center justify-center gap-2">
              <Play size={15} />
              Écouté
            </div>
          </div>
          <p className="text-[11px] text-muted leading-snug">
            Audio stocké localement dans ton navigateur (localStorage). Rien
            n'est envoyé en ligne.
          </p>
        </div>
      ) : null}

      {phase === "idle" && !error ? (
        <div className="flex items-center gap-2 text-[11px] text-muted">
          <Pause size={12} />2 minutes max. Le chrono s'arrête tout seul.
        </div>
      ) : null}
    </Card>
  );
}
