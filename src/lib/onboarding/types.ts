/**
 * Tipos compartilhados entre client/server pro fluxo de onboarding.
 */

export type OnboardingDraft = {
  contexts: string;
  accounts: string;
  income: string;
  fixed_costs: string;
  categories: string;
  habits: string;
  weekly_budget: string;
};

export type ExtractedContext = {
  slug: string;
  label: string;
  color: string;
  icon?: string;
};

export type ExtractedAccount = {
  name: string;
  kind: "checking" | "savings" | "credit_card" | "cash" | "investment" | "other";
  institution?: string;
  last_4?: string;
  color: string;
};

export type ExtractedCategory = {
  name: string;
  kind: "expense" | "income";
  icon?: string;
  color: string;
};

export type ExtractedFixedCost = {
  name: string;
  amount_brl: number;
  day_of_month?: number;
  kind: "expense" | "income";
  category_name?: string;
  account_name?: string;
  context_slug?: string;
  notes?: string;
};

export type ExtractedHabit = {
  name: string;
  description?: string;
  frequency: "daily" | "weekdays" | "weekends" | "weekly" | "custom";
  target_per_week?: number;
  preferred_time?: string;
  context_slug?: string;
};

export type ExtractedWeeklyBudget = {
  amount_brl: number;
  notes?: string;
};

export type ExtractedOnboarding = {
  display_name?: string;
  contexts: ExtractedContext[];
  accounts: ExtractedAccount[];
  categories: ExtractedCategory[];
  fixed_costs: ExtractedFixedCost[];
  habits: ExtractedHabit[];
  weekly_budget: ExtractedWeeklyBudget | null;
};
