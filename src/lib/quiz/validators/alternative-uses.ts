import { z } from "zod";

export const AlternativeUsesSchema = z.object({
  object: z.enum(["trombone", "brique", "elastique"]),
  responses: z.array(z.string().min(1)),
  durationMs: z.number().int().min(0).max(60000),
});

export type AlternativeUsesInput = z.infer<typeof AlternativeUsesSchema>;
