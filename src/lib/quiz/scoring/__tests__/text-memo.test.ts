import { describe, expect, it } from "vitest";
import { analyzeTextMemo } from "../text-memo";

describe("analyzeTextMemo", () => {
  it("returns absent when no answer", () => {
    const s = analyzeTextMemo(undefined);
    expect(s.present).toBe(false);
    expect(s.wordCount).toBe(0);
  });

  it("counts words from text content", () => {
    const s = analyzeTextMemo({
      mode: "text",
      content: "Un texte court de quelques mots ici.",
    });
    expect(s.wordCount).toBe(7);
    expect(s.present).toBe(true);
  });

  it("detects reversal markers", () => {
    const s = analyzeTextMemo({
      mode: "text",
      content:
        "Au début je pensais que c'était une bonne idée, puis j'ai compris que non.",
    });
    expect(s.hasReversalMarkers).toBe(true);
  });

  it("detects ownership markers", () => {
    const s = analyzeTextMemo({
      mode: "text",
      content: "J'ai eu tort sur ce point, je l'assume maintenant.",
    });
    expect(s.hasOwnershipMarkers).toBe(true);
  });

  it("detects time anchors", () => {
    const s = analyzeTextMemo({
      mode: "text",
      content: "Hier soir, pendant la réunion, tout est devenu clair.",
    });
    expect(s.hasTimeAnchors).toBe(true);
  });

  it("uses provided wordCount if given", () => {
    const s = analyzeTextMemo({
      mode: "audio",
      content: "[audio blob]",
      wordCount: 42,
    });
    expect(s.wordCount).toBe(42);
    expect(s.mode).toBe("audio");
    expect(s.present).toBe(true);
  });

  it("returns false for all markers on empty content", () => {
    const s = analyzeTextMemo({ mode: "text", content: "" });
    expect(s.hasReversalMarkers).toBe(false);
    expect(s.hasOwnershipMarkers).toBe(false);
    expect(s.hasTimeAnchors).toBe(false);
  });
});
