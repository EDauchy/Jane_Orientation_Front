import type { ComponentType } from "react";
import type { ModuleComponentName } from "../../../lib/quiz/modules-config";
import type { ModuleProps } from "./placeholders";
import { BudgetAllocator } from "./BudgetAllocator";
import { AlternativeUses } from "./AlternativeUses";
import { TradeoffScenario } from "./TradeoffScenario";
import { ValuesRanking } from "./ValuesRanking";
import { Riasec } from "./Riasec";
import { RiskTolerance } from "./RiskTolerance";
import { MultipleChoice } from "./MultipleChoice";
import { OpenQuestion } from "./OpenQuestion";
import { SocialNuance } from "./SocialNuance";
import { TextMemo } from "./TextMemo";

export const MODULE_REGISTRY: Record<
  ModuleComponentName,
  ComponentType<ModuleProps>
> = {
  BudgetAllocator,
  AlternativeUses,
  TradeoffScenario,
  ValuesRanking,
  Riasec,
  RiskTolerance,
  OpenQuestion,
  MultipleChoice,
  SocialNuance,
  TextMemo,
};
