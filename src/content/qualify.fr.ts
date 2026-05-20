import type {
  Audience,
  QualificationConstraint,
  QualificationHorizon,
} from "../lib/quiz/types";

export type AudienceOption = {
  id: Audience;
  label: string;
  description: string;
};

export const AUDIENCE_OPTIONS: ReadonlyArray<AudienceOption> = [
  {
    id: "student-exploring",
    label: "Étudiant·e qui explore",
    description: "Je cherche ma voie, je ne me suis pas encore engagé·e.",
  },
  {
    id: "student-switching",
    label: "Étudiant·e qui doute",
    description: "Je suis dans un cursus, je me demande si je dois changer.",
  },
  {
    id: "professional-questioning",
    label: "Pro en questionnement",
    description: "Je travaille, mais je me questionne sur la suite.",
  },
  {
    id: "adult-reconverting",
    label: "Adulte en reconversion",
    description: "J'envisage de changer de métier.",
  },
];

export type HorizonOption = {
  id: QualificationHorizon;
  label: string;
};

export const HORIZON_OPTIONS: ReadonlyArray<HorizonOption> = [
  { id: "immediate", label: "Dans les prochains mois" },
  { id: "one-year", label: "Cette année" },
  { id: "longer", label: "Plus long terme" },
  { id: "unknown", label: "Je ne sais pas encore" },
];

export type ConstraintOption = {
  id: QualificationConstraint;
  label: string;
};

export const CONSTRAINT_OPTIONS: ReadonlyArray<ConstraintOption> = [
  { id: "finances", label: "Finances" },
  { id: "family", label: "Famille / proches" },
  { id: "geography", label: "Géographie" },
  { id: "health", label: "Santé / énergie" },
  { id: "time", label: "Temps disponible" },
  { id: "none", label: "Aucune contrainte majeure" },
];

export const MAX_CONSTRAINTS = 3;
