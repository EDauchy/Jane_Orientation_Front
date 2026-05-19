import { z } from 'zod';

export const OPEN_QUESTION_IDS = [
  'open-energy',
  'open-friction',
  'open-projection',
  'open-blank-page',
  'open-outside-view',
] as const;

export type OpenQuestionId = (typeof OPEN_QUESTION_IDS)[number];

export const MIN_CHARS = 40;
export const MAX_CHARS = 800;

export const OpenQuestionSchema = z.object({
  questionId: z.enum(OPEN_QUESTION_IDS),
  text: z.string().min(MIN_CHARS).max(MAX_CHARS),
});

export type OpenQuestionInput = z.infer<typeof OpenQuestionSchema>;
