"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { extractOnboarding } from "@/lib/onboarding/extract";
import type {
  ExtractedOnboarding,
  OnboardingDraft,
} from "@/lib/onboarding/types";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Server action: recebe os 7 textareas do onboarding,
 * chama Claude com tool use, retorna o JSON estruturado pro preview.
 */
export async function extractAction(
  draft: OnboardingDraft
): Promise<Result<ExtractedOnboarding>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "Não autenticado." };
    }

    const allEmpty = Object.values(draft).every((v) => !v?.trim());
    if (allEmpty) {
      return {
        ok: false,
        error: "Preencha pelo menos uma seção. Pular tudo não ajuda.",
      };
    }

    const extracted = await extractOnboarding(draft);
    return { ok: true, data: extracted };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[pouso] extract failed:", err);
    return { ok: false, error: `Falha ao processar: ${msg}` };
  }
}

/**
 * Server action: pega o JSON validado pelo user e insere TUDO no DB,
 * marca onboarding_completed = true, redireciona pro dashboard.
 */
export async function commitAction(
  extracted: ExtractedOnboarding
): Promise<Result<{ counts: Record<string, number> }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Não autenticado." };
  }

  const counts: Record<string, number> = {
    contexts: 0,
    accounts: 0,
    categories: 0,
    fixed_costs: 0,
    habits: 0,
    weekly_budget: 0,
  };

  try {
    // 1. Contexts
    if (extracted.contexts.length > 0) {
      const rows = extracted.contexts.map((c, i) => ({
        user_id: user.id,
        slug: c.slug,
        label: c.label,
        color: c.color,
        icon: c.icon ?? null,
        position: i,
      }));
      const { error } = await supabase
        .from("contexts")
        .upsert(rows, { onConflict: "user_id,slug" });
      if (error) throw new Error(`contexts: ${error.message}`);
      counts.contexts = rows.length;
    }

    // 2. Accounts
    if (extracted.accounts.length > 0) {
      const rows = extracted.accounts.map((a, i) => ({
        user_id: user.id,
        name: a.name,
        kind: a.kind,
        institution: a.institution ?? null,
        last_4: a.last_4 ?? null,
        color: a.color,
        position: i,
      }));
      const { error } = await supabase
        .from("accounts")
        .upsert(rows, { onConflict: "user_id,name" });
      if (error) throw new Error(`accounts: ${error.message}`);
      counts.accounts = rows.length;
    }

    // 3. Categories
    if (extracted.categories.length > 0) {
      const rows = extracted.categories.map((c, i) => ({
        user_id: user.id,
        name: c.name,
        kind: c.kind,
        icon: c.icon ?? null,
        color: c.color,
        position: i,
      }));
      const { error } = await supabase
        .from("categories")
        .upsert(rows, { onConflict: "user_id,kind,name" });
      if (error) throw new Error(`categories: ${error.message}`);
      counts.categories = rows.length;
    }

    // 4. Lookups pra resolver references por nome → id
    const [accountsRes, categoriesRes, contextsRes] = await Promise.all([
      supabase
        .from("accounts")
        .select("id, name")
        .eq("user_id", user.id),
      supabase.from("categories").select("id, name, kind").eq("user_id", user.id),
      supabase.from("contexts").select("id, slug").eq("user_id", user.id),
    ]);

    const accountByName = new Map(
      (accountsRes.data ?? []).map((a) => [a.name.toLowerCase(), a.id])
    );
    const categoryByName = new Map(
      (categoriesRes.data ?? []).map((c) => [
        `${c.kind}:${c.name.toLowerCase()}`,
        c.id,
      ])
    );
    const contextBySlug = new Map(
      (contextsRes.data ?? []).map((c) => [c.slug, c.id])
    );

    // 5. Fixed costs
    if (extracted.fixed_costs.length > 0) {
      const rows = extracted.fixed_costs.map((f) => ({
        user_id: user.id,
        name: f.name,
        amount_cents: Math.round(f.amount_brl * 100),
        kind: f.kind,
        day_of_month: f.day_of_month ?? null,
        category_id:
          f.category_name &&
          categoryByName.get(`${f.kind}:${f.category_name.toLowerCase()}`)
            ? categoryByName.get(`${f.kind}:${f.category_name.toLowerCase()}`)
            : null,
        account_id: f.account_name
          ? accountByName.get(f.account_name.toLowerCase()) ?? null
          : null,
        context_id: f.context_slug
          ? contextBySlug.get(f.context_slug) ?? null
          : null,
        notes: f.notes ?? null,
      }));
      const { error } = await supabase.from("fixed_costs").insert(rows);
      if (error) throw new Error(`fixed_costs: ${error.message}`);
      counts.fixed_costs = rows.length;
    }

    // 6. Habits
    if (extracted.habits.length > 0) {
      const rows = extracted.habits.map((h) => ({
        user_id: user.id,
        name: h.name,
        description: h.description ?? null,
        frequency: h.frequency,
        target_per_week:
          h.target_per_week ??
          (h.frequency === "daily"
            ? 7
            : h.frequency === "weekdays"
            ? 5
            : h.frequency === "weekends"
            ? 2
            : h.frequency === "weekly"
            ? 1
            : null),
        preferred_time: h.preferred_time ?? null,
        context_id: h.context_slug
          ? contextBySlug.get(h.context_slug) ?? null
          : null,
      }));
      const { error } = await supabase.from("habit_definitions").insert(rows);
      if (error) throw new Error(`habits: ${error.message}`);
      counts.habits = rows.length;
    }

    // 7. Weekly budget
    if (extracted.weekly_budget) {
      const { error } = await supabase.from("weekly_budgets").insert({
        user_id: user.id,
        amount_cents: Math.round(extracted.weekly_budget.amount_brl * 100),
        notes: extracted.weekly_budget.notes ?? null,
      });
      if (error) throw new Error(`weekly_budget: ${error.message}`);
      counts.weekly_budget = 1;
    }

    // 8. Marca profile como onboarded + atualiza display_name
    const profileUpdate: {
      onboarding_completed: boolean;
      display_name?: string;
    } = { onboarding_completed: true };
    if (extracted.display_name) {
      profileUpdate.display_name = extracted.display_name;
    }
    const { error: profileErr } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", user.id);
    if (profileErr) throw new Error(`profile: ${profileErr.message}`);

    return { ok: true, data: { counts } };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[pouso] commit failed:", err);
    return { ok: false, error: msg };
  }
}

/**
 * Pula o onboarding (single user pode adicionar tudo manualmente depois).
 */
export async function skipAction(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);
  }
  redirect("/app");
}
