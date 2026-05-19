import { z } from "zod";

export const BudgetSchema = z
  .object({
    ideation: z.number().int().min(0).max(100),
    planning: z.number().int().min(0).max(100),
    execution: z.number().int().min(0).max(100),
    polish: z.number().int().min(0).max(100),
    presentation: z.number().int().min(0).max(100),
  })
  .refine(
    (v) =>
      v.ideation + v.planning + v.execution + v.polish + v.presentation === 100,
    { message: "Les 5 phases doivent totaliser 100 jetons." },
  );

export type BudgetInput = z.infer<typeof BudgetSchema>;
