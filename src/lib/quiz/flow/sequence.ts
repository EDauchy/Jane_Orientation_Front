import type { Audience } from '../types';
import { FLOWS } from './audience';

export function getFlow(audience: Audience): ReadonlyArray<string> {
  return FLOWS[audience];
}

export function totalInFlow(audience: Audience): number {
  return FLOWS[audience].length;
}

export function indexInFlow(audience: Audience, slug: string): number {
  return FLOWS[audience].indexOf(slug);
}

export function slugAt(audience: Audience, idx: number): string | undefined {
  return FLOWS[audience][idx];
}

export function firstSlug(audience: Audience): string {
  return FLOWS[audience][0];
}

export function nextSlug(audience: Audience, slug: string): string | null {
  const flow = FLOWS[audience];
  const i = flow.indexOf(slug);
  if (i < 0 || i >= flow.length - 1) return null;
  return flow[i + 1];
}

export function prevSlug(audience: Audience, slug: string): string | null {
  const flow = FLOWS[audience];
  const i = flow.indexOf(slug);
  if (i <= 0) return null;
  return flow[i - 1];
}
