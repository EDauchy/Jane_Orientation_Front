import type { SocialNuanceAnswer } from '../types';
import type { SocialSceneId } from '../validators/social-nuance';

export type SocialNuanceSignals = {
  sceneId: SocialSceneId | null;
  count: number;
  uniqueFirstWords: number;
  avgCharLength: number;
  diversityScore: number;
  diversityBucket: 'low' | 'medium' | 'high';
  affectBalance: 'mostly-negative' | 'mostly-positive' | 'balanced';
  negativeCount: number;
  positiveCount: number;
};

const NEGATIVE_TERMS = [
  'fâché', 'énervé', 'agacé', 'triste', 'désolé', 'vexé', 'angoissé', 'jaloux',
  'déçu', 'frustré', 'en colère', 'épuisé', 'débordé', 'perdu', 'ignoré',
  'rejeté', 'blessé', 'stress', 'peur', 'honte', 'malaise',
];

const POSITIVE_TERMS = [
  'content', 'heureux', 'ravi', 'calme', 'confiance', 'concentré', 'motivé',
  'fier', 'reconnaissant', 'détendu', 'optimiste', 'ouvert', 'curieux', 'serein',
];

function firstWordOf(s: string): string {
  const m = s.trim().toLowerCase().match(/[a-zàâçéèêëîïôûùüÿñæœ']+/u);
  return m ? m[0] : '';
}

function countMatches(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  let n = 0;
  for (const t of terms) {
    n += lower.split(t).length - 1;
  }
  return n;
}

export function analyzeSocialNuance(answer: SocialNuanceAnswer): SocialNuanceSignals {
  const items = answer.interpretations.map((s) => s.trim()).filter((s) => s.length > 0);
  const count = items.length;

  const firstWords = new Set<string>();
  for (const s of items) {
    const fw = firstWordOf(s);
    if (fw) firstWords.add(fw);
  }

  const totalChars = items.reduce((sum, s) => sum + s.length, 0);
  const avgCharLength = count === 0 ? 0 : Math.round(totalChars / count);

  const diversityScore =
    count === 0 ? 0 : Math.round((firstWords.size / count) * 100) / 100;

  let diversityBucket: SocialNuanceSignals['diversityBucket'] = 'low';
  if (count < 3) diversityBucket = 'low';
  else if (diversityScore > 0.8) diversityBucket = 'high';
  else if (diversityScore >= 0.5) diversityBucket = 'medium';

  const combined = items.join(' ');
  const negativeCount = countMatches(combined, NEGATIVE_TERMS);
  const positiveCount = countMatches(combined, POSITIVE_TERMS);

  let affectBalance: SocialNuanceSignals['affectBalance'] = 'balanced';
  if (negativeCount > positiveCount + 1) affectBalance = 'mostly-negative';
  else if (positiveCount > negativeCount + 1) affectBalance = 'mostly-positive';

  return {
    sceneId: (answer.sceneId as SocialSceneId) ?? null,
    count,
    uniqueFirstWords: firstWords.size,
    avgCharLength,
    diversityScore,
    diversityBucket,
    affectBalance,
    negativeCount,
    positiveCount,
  };
}
