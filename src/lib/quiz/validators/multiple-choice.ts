import { z } from 'zod';

export const QCM_QUESTION_IDS = [
  'qcm-decision',
  'qcm-rhythm',
  'qcm-group-role',
  'qcm-stress',
  'qcm-satisfaction',
] as const;

export type QcmQuestionId = (typeof QCM_QUESTION_IDS)[number];

export const MultipleChoiceItemSchema = z.discriminatedUnion('kind', [
  z.object({
    questionId: z.enum(QCM_QUESTION_IDS),
    kind: z.literal('single'),
    value: z.string().min(1),
  }),
  z.object({
    questionId: z.enum(QCM_QUESTION_IDS),
    kind: z.literal('ranking'),
    value: z.array(z.string().min(1)).min(2),
  }),
]);

export type MultipleChoiceInput = z.infer<typeof MultipleChoiceItemSchema>;

export const QCM_OPTIONS: Record<
  QcmQuestionId,
  | { kind: 'single'; options: { value: string; label: string }[] }
  | { kind: 'ranking'; options: { value: string; label: string }[] }
> = {
  'qcm-decision': {
    kind: 'single',
    options: [
      { value: 'data', label: 'Les données chiffrées' },
      { value: 'intuition', label: 'Mon intuition, au ressenti' },
      { value: 'advice', label: 'L\'avis de personnes en qui j\'ai confiance' },
      { value: 'precedent', label: 'Ce que j\'ai déjà vu fonctionner ailleurs' },
      { value: 'test', label: 'Je teste en petit avant de trancher' },
    ],
  },
  'qcm-rhythm': {
    kind: 'ranking',
    options: [
      { value: 'sprint', label: 'Sprints intenses avec pauses' },
      { value: 'steady', label: 'Un rythme régulier, tous les jours' },
      { value: 'waves', label: 'Par vagues — très occupé puis très calme' },
      { value: 'flexible', label: 'Totalement flexible, je gère selon l\'envie' },
    ],
  },
  'qcm-group-role': {
    kind: 'single',
    options: [
      { value: 'leader', label: 'Celui qui cadre et donne le cap' },
      { value: 'facilitator', label: 'Celui qui fait parler tout le monde' },
      { value: 'ideator', label: 'Celui qui lance des idées' },
      { value: 'executor', label: 'Celui qui prend et exécute' },
      { value: 'analyst', label: 'Celui qui pose les questions qui fâchent' },
    ],
  },
  'qcm-stress': {
    kind: 'single',
    options: [
      { value: 'triage', label: 'Je priorise et j\'attaque une chose à la fois' },
      { value: 'delegate', label: 'Je cherche qui peut m\'aider' },
      { value: 'freeze', label: 'Je me fige un moment avant de démarrer' },
      { value: 'multitask', label: 'Je m\'éparpille sur tout en même temps' },
      { value: 'withdraw', label: 'Je me coupe et j\'avance en silence' },
    ],
  },
  'qcm-satisfaction': {
    kind: 'single',
    options: [
      { value: 'craft', label: 'Un travail bien fait, peaufiné' },
      { value: 'impact', label: 'Avoir aidé quelqu\'un concrètement' },
      { value: 'learn', label: 'Avoir appris un truc nouveau' },
      { value: 'win', label: 'Avoir gagné, obtenu ce que je visais' },
      { value: 'create', label: 'Avoir fait exister quelque chose qui n\'existait pas' },
    ],
  },
};
