import { z } from 'zod';

export const SOCIAL_SCENE_IDS = ['late-colleague', 'silent-meeting', 'praise-then-task'] as const;

export type SocialSceneId = (typeof SOCIAL_SCENE_IDS)[number];

export const MIN_INTERPRETATIONS = 3;
export const MAX_INTERPRETATIONS = 8;
export const MIN_INTERPRETATION_CHARS = 15;
export const MAX_INTERPRETATION_CHARS = 200;

export const SocialNuanceSchema = z.object({
  sceneId: z.enum(SOCIAL_SCENE_IDS),
  interpretations: z
    .array(
      z
        .string()
        .trim()
        .min(MIN_INTERPRETATION_CHARS)
        .max(MAX_INTERPRETATION_CHARS),
    )
    .min(MIN_INTERPRETATIONS)
    .max(MAX_INTERPRETATIONS),
});

export type SocialNuanceInput = z.infer<typeof SocialNuanceSchema>;

export type SocialScene = {
  id: SocialSceneId;
  title: string;
  description: string;
};

export const SCENES: Record<SocialSceneId, SocialScene> = {
  'late-colleague': {
    id: 'late-colleague',
    title: 'Un collègue arrive en retard — sans un mot',
    description:
      'Tu es en réunion d\'équipe. Un collègue habituellement ponctuel entre avec 20 minutes de retard, s\'assied sans s\'excuser, ne dit rien, regarde son écran.',
  },
  'silent-meeting': {
    id: 'silent-meeting',
    title: 'Ton idée — un silence gênant',
    description:
      'Tu proposes une idée en réunion. Personne ne réagit, personne ne te regarde, la discussion reprend sur un autre sujet sans transition.',
  },
  'praise-then-task': {
    id: 'praise-then-task',
    title: 'Un compliment suivi d\'une demande',
    description:
      'Ton manager t\'écrit : "Franchement, tu gères super bien ton dossier. Est-ce que tu peux prendre aussi celui de Léo pendant son absence ?"',
  },
};
