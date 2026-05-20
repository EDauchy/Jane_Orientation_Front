import { describe, expect, it } from "vitest";
import { analyzeValues } from "../values";

describe("analyzeValues", () => {
  it("preserves ordering of top3 and bottom3", () => {
    const a = {
      top3: ["autonomy", "learning", "creativity"],
      bottom3: ["status", "recognition", "financial_security"],
    };
    const s = analyzeValues(a);
    expect(s.top3).toEqual(["autonomy", "learning", "creativity"]);
    expect(s.bottom3).toEqual(["status", "recognition", "financial_security"]);
  });

  it("flags autonomy/security/impact priority correctly", () => {
    const s = analyzeValues({
      top3: ["autonomy", "financial_security", "social_impact"],
      bottom3: ["status", "belonging", "location_freedom"],
    });
    expect(s.flags.hasAutonomyTop).toBe(true);
    expect(s.flags.hasSecurityTop).toBe(true);
    expect(s.flags.hasImpactTop).toBe(true);
    expect(s.flags.hasLearningTop).toBe(false);
    expect(s.flags.hasCreativityTop).toBe(false);
  });

  it("detects rejected values", () => {
    const s = analyzeValues({
      top3: ["autonomy", "learning", "creativity"],
      bottom3: ["status", "financial_security", "recognition"],
    });
    expect(s.flags.statusInBottom).toBe(true);
    expect(s.flags.securityInBottom).toBe(true);
    expect(s.flags.recognitionInBottom).toBe(true);
  });

  it("leaves rejected flags false when values are not in bottom3", () => {
    const s = analyzeValues({
      top3: ["financial_security", "status", "recognition"],
      bottom3: ["autonomy", "creativity", "social_impact"],
    });
    expect(s.flags.securityInBottom).toBe(false);
    expect(s.flags.statusInBottom).toBe(false);
    expect(s.flags.recognitionInBottom).toBe(false);
  });

  it("handles top3/bottom3 sets without overlap invariant coming from validator", () => {
    const s = analyzeValues({
      top3: ["belonging", "work_life_balance", "location_freedom"],
      bottom3: ["status", "recognition", "social_impact"],
    });
    expect(s.flags.hasBelongingTop).toBe(true);
    expect(s.flags.hasBalanceTop).toBe(true);
    expect(s.flags.hasLocationFreedomTop).toBe(true);
  });
});
