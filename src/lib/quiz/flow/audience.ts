import type { Audience } from "../types";
import { MODULES } from "../modules-config";

const COMMON_FLOW: ReadonlyArray<string> = MODULES.map((m) => m.slug);

export const FLOWS: Readonly<Record<Audience, ReadonlyArray<string>>> = {
  "student-exploring": COMMON_FLOW,
  "student-switching": COMMON_FLOW,
  "professional-questioning": COMMON_FLOW,
  "adult-reconverting": COMMON_FLOW,
};
