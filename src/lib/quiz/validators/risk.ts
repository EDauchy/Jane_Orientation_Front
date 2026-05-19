import { z } from 'zod';

const OneToFive = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

export const RiskToleranceSchema = z.object({
  incomeStability: OneToFive,
  workSolitude: OneToFive,
  hierarchy: OneToFive,
  buildVsJoin: OneToFive,
});

export type RiskToleranceInput = z.infer<typeof RiskToleranceSchema>;
