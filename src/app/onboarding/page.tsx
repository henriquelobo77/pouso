import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./onboarding-form";
import { skipAction } from "./actions";
import { Mark } from "@/components/brand/mark";

export const metadata: Metadata = {
  title: "onboarding",
  description: "Conta sua vida pra eu organizar.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="px-6 md:px-12 py-8 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <Mark size={28} />
          <span className="caption">onboarding · pouso.</span>
        </div>
        <form action={skipAction}>
          <button
            type="submit"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Pular por agora
          </button>
        </form>
      </header>

      <main className="flex-1 px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <OnboardingForm />
        </div>
      </main>
    </div>
  );
}
