import { describe, expect, it } from "vitest";
import { analyzeMultipleChoice } from "../multiple-choice";
import type { MultipleChoiceAnswer } from "../../types";

function ans(
  questionId: string,
  value: string | string[],
): MultipleChoiceAnswer {
  if (Array.isArray(value)) {
    return { questionId, kind: "ranking", value };
  }
  return { questionId, kind: "single", value };
}

describe("analyzeMultipleChoice", () => {
  it("maps decision styles", () => {
    expect(
      analyzeMultipleChoice([ans("qcm-decision", "data")]).decisionStyle,
    ).toBe("analytical");
    expect(
      analyzeMultipleChoice([ans("qcm-decision", "intuition")]).decisionStyle,
    ).toBe("intuitive");
    expect(
      analyzeMultipleChoice([ans("qcm-decision", "advice")]).decisionStyle,
    ).toBe("social");
    expect(
      analyzeMultipleChoice([ans("qcm-decision", "test")]).decisionStyle,
    ).toBe("empirical");
  });

  it("picks the top choice from a ranking", () => {
    const s = analyzeMultipleChoice([
      ans("qcm-rhythm", ["sprint", "steady", "waves", "flexible"]),
    ]);
    expect(s.rhythmTopChoice).toBe("sprint");
  });

  it("flags data-driven and leader archetypes correctly", () => {
    const s = analyzeMultipleChoice([
      ans("qcm-decision", "data"),
      ans("qcm-group-role", "leader"),
      ans("qcm-satisfaction", "craft"),
    ]);
    expect(s.flags.dataDriven).toBe(true);
    expect(s.flags.leaderArchetype).toBe(true);
    expect(s.flags.craftOriented).toBe(true);
    expect(s.flags.intuitive).toBe(false);
  });

  it("needsOthers is true if decision=advice OR stress=delegate", () => {
    expect(
      analyzeMultipleChoice([ans("qcm-decision", "advice")]).flags.needsOthers,
    ).toBe(true);
    expect(
      analyzeMultipleChoice([ans("qcm-stress", "delegate")]).flags.needsOthers,
    ).toBe(true);
    expect(
      analyzeMultipleChoice([ans("qcm-decision", "data")]).flags.needsOthers,
    ).toBe(false);
  });

  it("flexibilitySeeker from rhythm top choice", () => {
    expect(
      analyzeMultipleChoice([ans("qcm-rhythm", ["flexible", "sprint"])]).flags
        .flexibilitySeeker,
    ).toBe(true);
    expect(
      analyzeMultipleChoice([ans("qcm-rhythm", ["waves", "steady"])]).flags
        .flexibilitySeeker,
    ).toBe(true);
    expect(
      analyzeMultipleChoice([ans("qcm-rhythm", ["steady", "waves"])]).flags
        .flexibilitySeeker,
    ).toBe(false);
  });

  it("returns null fields when no answer is given for a question", () => {
    const s = analyzeMultipleChoice([]);
    expect(s.decisionStyle).toBeNull();
    expect(s.rhythmTopChoice).toBeNull();
    expect(s.groupRole).toBeNull();
  });

  it("aggregates multiple answers in byQuestion", () => {
    const s = analyzeMultipleChoice([
      ans("qcm-decision", "test"),
      ans("qcm-satisfaction", "impact"),
    ]);
    expect(s.byQuestion["qcm-decision"]).toBe("test");
    expect(s.byQuestion["qcm-satisfaction"]).toBe("impact");
    expect(s.flags.impactOriented).toBe(true);
  });
});
