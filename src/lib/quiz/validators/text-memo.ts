import { z } from "zod";

export const MEMO_MIN_CHARS = 80;
export const MEMO_MAX_CHARS = 500;
export const MEMO_MAX_DURATION_MS = 120_000;

export const TextMemoSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("text"),
    content: z.string().trim().min(MEMO_MIN_CHARS).max(MEMO_MAX_CHARS),
    wordCount: z.number().int().min(0).optional(),
  }),
  z.object({
    mode: z.literal("audio"),
    content: z.string().min(1),
    wordCount: z.number().int().min(0).optional(),
  }),
]);

export type TextMemoInput = z.infer<typeof TextMemoSchema>;
