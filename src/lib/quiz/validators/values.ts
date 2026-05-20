import { z } from "zod";

export const VALUE_IDS = [
  "autonomy",
  "financial_security",
  "social_impact",
  "recognition",
  "learning",
  "work_life_balance",
  "location_freedom",
  "creativity",
  "status",
  "belonging",
] as const;

export type ValueId = (typeof VALUE_IDS)[number];

const ValueIdSchema = z.enum(VALUE_IDS);

export const ValuesRankingSchema = z
  .object({
    top3: z.array(ValueIdSchema).length(3),
    bottom3: z.array(ValueIdSchema).length(3),
  })
  .refine((v) => new Set([...v.top3, ...v.bottom3]).size === 6, {
    message:
      "Les 3 intouchables et les 3 laissables ne doivent pas se chevaucher.",
  });

export type ValuesRankingInput = z.infer<typeof ValuesRankingSchema>;
