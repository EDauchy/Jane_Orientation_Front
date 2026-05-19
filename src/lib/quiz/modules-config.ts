export type ModuleCategory =
  | 'behavioral'
  | 'values'
  | 'interests'
  | 'context'
  | 'open'
  | 'qcm'
  | 'optional';

export type ModuleComponentName =
  | 'BudgetAllocator'
  | 'AlternativeUses'
  | 'TradeoffScenario'
  | 'ValuesRanking'
  | 'Riasec'
  | 'RiskTolerance'
  | 'OpenQuestion'
  | 'MultipleChoice'
  | 'SocialNuance'
  | 'TextMemo';

export type ModuleConfig = {
  slug: string;
  component: ModuleComponentName;
  time: number;
  category: ModuleCategory;
  hidden?: boolean;
  optional?: boolean;
};

export const MODULES: ReadonlyArray<ModuleConfig> = [
  { slug: 'budget', component: 'BudgetAllocator', time: 120, category: 'behavioral' },
  { slug: 'alternative-uses', component: 'AlternativeUses', time: 75, category: 'behavioral' },
  { slug: 'tradeoff', component: 'TradeoffScenario', time: 180, category: 'behavioral' },
  { slug: 'values-ranking', component: 'ValuesRanking', time: 120, category: 'values' },
  { slug: 'riasec', component: 'Riasec', time: 180, category: 'interests' },
  { slug: 'risk-tolerance', component: 'RiskTolerance', time: 60, category: 'context' },
  { slug: 'open-energy', component: 'OpenQuestion', time: 60, category: 'open' },
  { slug: 'open-friction', component: 'OpenQuestion', time: 60, category: 'open' },
  { slug: 'open-projection', component: 'OpenQuestion', time: 60, category: 'open' },
  { slug: 'open-blank-page', component: 'OpenQuestion', time: 60, category: 'open', hidden: true },
  { slug: 'open-outside-view', component: 'OpenQuestion', time: 45, category: 'open', hidden: true },
  { slug: 'qcm-decision', component: 'MultipleChoice', time: 20, category: 'qcm' },
  { slug: 'qcm-rhythm', component: 'MultipleChoice', time: 30, category: 'qcm' },
  { slug: 'qcm-group-role', component: 'MultipleChoice', time: 20, category: 'qcm', hidden: true },
  { slug: 'qcm-stress', component: 'MultipleChoice', time: 20, category: 'qcm', hidden: true },
  { slug: 'qcm-satisfaction', component: 'MultipleChoice', time: 20, category: 'qcm', hidden: true },
  { slug: 'social-nuance', component: 'SocialNuance', time: 90, category: 'behavioral' },
  { slug: 'memo', component: 'TextMemo', time: 120, category: 'optional', optional: true },
] as const;

export const TOTAL_MODULES = MODULES.length;

export function moduleIndex(slug: string): number {
  return MODULES.findIndex((m) => m.slug === slug);
}

export function moduleAt(idx: number): ModuleConfig | undefined {
  return MODULES[idx];
}
