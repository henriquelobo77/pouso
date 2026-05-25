"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/app";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState({ kind: "sending" });

    const supabase = createClient();
    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      setState({ kind: "error", message: error.message });
      return;
    }

    setState({ kind: "sent", email: email.trim() });
  }

  if (state.kind === "sent") {
    return (
      <div className="w-full flex flex-col items-center gap-5 py-6 px-8 rounded-lg border border-border bg-surface text-center">
        <CheckCircle2
          size={36}
          strokeWidth={1.5}
          className="text-primary"
        />
        <div className="flex flex-col gap-1.5">
          <p className="font-display text-xl">Link enviado.</p>
          <p className="text-fg-muted text-sm leading-relaxed">
            Cheque{" "}
            <span className="text-fg font-medium">{state.email}</span>
            {" "}— pode demorar até 1 minuto.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setState({ kind: "idle" })}
          className="caption text-fg-muted hover:text-fg transition-colors"
        >
          usar outro email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail
            size={16}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state.kind === "sending"}
            required
            className="pl-9"
          />
        </div>
      </div>

      {state.kind === "error" && (
        <p className="text-sm text-danger leading-relaxed">{state.message}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={state.kind === "sending" || !email.trim()}
        className="mt-2"
      >
        {state.kind === "sending" ? "Enviando…" : "Receber link"}
        {state.kind !== "sending" && <ArrowRight size={18} strokeWidth={1.5} />}
      </Button>
    </form>
  );
}
