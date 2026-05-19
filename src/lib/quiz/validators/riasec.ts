import { z } from 'zod';

export const RIASEC_ITEM_IDS = [
  'r1', 'r2', 'r3',
  'i1', 'i2', 'i3',
  'a1', 'a2', 'a3',
  's1', 's2', 's3',
  'e1', 'e2', 'e3',
  'c1', 'c2', 'c3',
] as const;

export type RiasecItemId = (typeof RIASEC_ITEM_IDS)[number];

const ResponseSchema = z.enum(['like', 'neutral', 'dislike']);

export const RiasecSchema = z
  .object({
    responses: z.record(z.enum(RIASEC_ITEM_IDS), ResponseSchema),
  })
  .refine((v) => Object.keys(v.responses).length === RIASEC_ITEM_IDS.length, {
    message: 'Les 18 items doivent être répondus.',
  });

export type RiasecInput = z.infer<typeof RiasecSchema>;
