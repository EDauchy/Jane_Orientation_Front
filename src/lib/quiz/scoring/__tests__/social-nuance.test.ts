import { describe, expect, it } from "vitest";
import { analyzeSocialNuance } from "../social-nuance";

describe("analyzeSocialNuance", () => {
  it("counts interpretations and unique first words", () => {
    const s = analyzeSocialNuance({
      sceneId: "late-colleague",
      interpretations: [
        "Il a eu un souci perso ce matin.",
        "Il pense que la réunion n'est pas importante.",
        "Son chef l'a retenu sans le prévenir.",
      ],
    });
    expect(s.count).toBe(3);
    expect(s.uniqueFirstWords).toBe(2);
  });

  it("rates diversity high when all first words are different", () => {
    const s = analyzeSocialNuance({
      sceneId: "silent-meeting",
      interpretations: [
        "Personne n'a compris l'idée tout de suite.",
        "Les autres étaient dans leurs pensées.",
        "Mon idée a dérangé un tabou.",
        "Tout le monde attendait le manager.",
      ],
    });
    expect(s.diversityBucket).toBe("high");
    expect(s.diversityScore).toBeGreaterThan(0.8);
  });

  it("rates diversity low when fewer than 3 items", () => {
    const s = analyzeSocialNuance({
      sceneId: "silent-meeting",
      interpretations: ["Une seule interprétation ici"],
    });
    expect(s.diversityBucket).toBe("low");
  });

  it("detects affectBalance mostly-negative from vocabulary", () => {
    const s = analyzeSocialNuance({
      sceneId: "late-colleague",
      interpretations: [
        "Il est fâché et stressé par son matin.",
        "Elle se sent rejetée par l'équipe.",
        "Peur d'être jugé sur son retard.",
      ],
    });
    expect(s.affectBalance).toBe("mostly-negative");
    expect(s.negativeCount).toBeGreaterThan(0);
  });

  it("detects mostly-positive affect", () => {
    const s = analyzeSocialNuance({
      sceneId: "praise-then-task",
      interpretations: [
        "Il est content et fier de ton travail.",
        "Le manager est confiant en tes capacités.",
        "Un geste motivé et ouvert envers toi.",
      ],
    });
    expect(s.affectBalance).toBe("mostly-positive");
  });

  it("returns balanced when positive and negative terms roughly equal", () => {
    const s = analyzeSocialNuance({
      sceneId: "praise-then-task",
      interpretations: [
        "Il est content et calme.",
        "Peur quand même d'une charge cachée.",
        "Je suis fier mais stressé.",
      ],
    });
    expect(s.affectBalance).toBe("balanced");
  });

  it("computes average character length", () => {
    const s = analyzeSocialNuance({
      sceneId: "silent-meeting",
      interpretations: ["abc", "abcdef", "abcdefghi"],
    });
    expect(s.avgCharLength).toBe(6);
  });

  it("handles empty interpretations array", () => {
    const s = analyzeSocialNuance({
      sceneId: "silent-meeting",
      interpretations: [],
    });
    expect(s.count).toBe(0);
    expect(s.diversityScore).toBe(0);
    expect(s.affectBalance).toBe("balanced");
  });
});
