import { useAssessment } from "./store";

export function seedDemoData() {
  const s = useAssessment.getState();

  s.startDemo();
  s.setAudience("student-exploring");
  s.setQualification({ horizon: "one-year", constraints: ["finances"] });

  s.setBudget({
    ideation: 30,
    planning: 15,
    execution: 35,
    polish: 10,
    presentation: 10,
  });

  s.setAlternativeUses({
    object: "trombone",
    responses: [
      "Attacher des câbles",
      "Gratter une serrure",
      "Marquer une page",
      "Faire un crochet",
      "Sculpture miniature",
    ],
    durationMs: 60000,
  });

  s.setTradeoff([
    { pairId: "salary-vs-passion", choice: "B", regretForOther: 3 },
    { pairId: "remote-vs-team", choice: "A", regretForOther: 2 },
    { pairId: "expert-vs-generalist", choice: "A", regretForOther: 2 },
    { pairId: "employee-vs-freelance", choice: "B", regretForOther: 4 },
    { pairId: "impact-vs-recognition", choice: "A", regretForOther: 1 },
  ]);

  s.setValuesRanking({
    top3: ["autonomy", "creativity", "learning"],
    bottom3: ["status", "recognition", "financial_security"],
  });

  s.setRiasec({
    responses: {
      r1: "like",
      r2: "neutral",
      r3: "dislike",
      i1: "like",
      i2: "like",
      i3: "neutral",
      a1: "like",
      a2: "like",
      a3: "like",
      s1: "neutral",
      s2: "like",
      s3: "neutral",
      e1: "neutral",
      e2: "neutral",
      e3: "dislike",
      c1: "dislike",
      c2: "dislike",
      c3: "neutral",
    },
  });

  s.setRiskTolerance({
    incomeStability: 3,
    workSolitude: 2,
    hierarchy: 2,
    buildVsJoin: 4,
  });

  const opens = [
    {
      questionId: "open-energy",
      text: "Je suis dans mon élément quand je conçois quelque chose de zéro et que je vois les idées prendre forme concrètement.",
    },
    {
      questionId: "open-friction",
      text: "Ce qui m'épuise le plus, ce sont les tâches répétitives sans but visible et les réunions sans décision ni suite.",
    },
    {
      questionId: "open-projection",
      text: "Dans cinq ans, j'aimerais travailler sur des produits numériques qui ont un impact direct sur la façon dont les gens apprennent.",
    },
    {
      questionId: "open-blank-page",
      text: "Si j'avais une page blanche, je créerais une plateforme pour aider les indépendants à structurer leur activité sans perdre leur liberté.",
    },
    {
      questionId: "open-outside-view",
      text: "Mon entourage me dit souvent que je suis très curieux et capable de simplifier des choses complexes pour les rendre accessibles.",
    },
  ] as const;
  opens.forEach((a) => s.upsertOpenQuestion(a));

  s.upsertMultipleChoice({
    questionId: "qcm-decision",
    kind: "single",
    value: "test",
  });
  s.upsertMultipleChoice({
    questionId: "qcm-rhythm",
    kind: "ranking",
    value: ["sprint", "flexible", "waves", "steady"],
  });
  s.upsertMultipleChoice({
    questionId: "qcm-group-role",
    kind: "single",
    value: "ideator",
  });
  s.upsertMultipleChoice({
    questionId: "qcm-stress",
    kind: "single",
    value: "triage",
  });
  s.upsertMultipleChoice({
    questionId: "qcm-satisfaction",
    kind: "single",
    value: "create",
  });

  s.setSocialNuance({
    sceneId: "late-colleague",
    interpretations: [
      "Il a peut-être eu un problème personnel ce matin",
      "Il est gêné et ne sait pas comment s'excuser devant tout le monde",
      "Il cherche à passer inaperçu pour ne pas perturber la réunion",
      "Son retard est probablement lié à un autre dossier urgent",
    ],
  });

  s.setTextMemo({
    mode: "text",
    content:
      "Ce qui me revient souvent, c'est cette envie de construire des choses qui durent. Pas juste livrer, mais vraiment comprendre pourquoi quelque chose marche ou pas. Je crois que c'est ce fil directeur que je cherche dans un parcours professionnel.",
    wordCount: 44,
  });
}
