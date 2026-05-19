import { z } from 'zod';

export const TRADEOFF_PAIR_IDS = [
  'salary-vs-passion',
  'remote-vs-team',
  'expert-vs-generalist',
  'employee-vs-freelance',
  'impact-vs-recognition',
] as const;

export type TradeoffPairId = (typeof TRADEOFF_PAIR_IDS)[number];

const RegretSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const TradeoffItemSchema = z.object({
  pairId: z.enum(TRADEOFF_PAIR_IDS),
  choice: z.enum(['A', 'B']),
  regretForOther: RegretSchema,
});

export const TradeoffSchema = z
  .array(TradeoffItemSchema)
  .refine((arr) => arr.length === TRADEOFF_PAIR_IDS.length, {
    message: 'Les 5 dilemmes doivent être répondus.',
  })
  .refine(
    (arr) => new Set(arr.map((a) => a.pairId)).size === TRADEOFF_PAIR_IDS.length,
    { message: 'Chaque dilemme doit être unique.' },
  );

export type TradeoffInput = z.infer<typeof TradeoffSchema>;
