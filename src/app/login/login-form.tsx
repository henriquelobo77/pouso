"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string };

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/app";

  const isLoading = state.kind === "loading";
  const passwordTooShort = password.length > 0 && password.length < 8;
  const canSubmit =
    email.trim().length > 0 && password.length >= 8 && !isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setState({ kind: "loading" });

    try {
      const supabase = createClient();
      const trimmedEmail = email.trim();

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (error) {
          setState({
            kind: "error",
            message: friendlyError(error.message, "signin"),
          });
          return;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              display_name: trimmedEmail.split("@")[0],
            },
          },
        });
        if (error) {
          setState({
            kind: "error",
            message: friendlyError(error.message, "signup"),
          });
          return;
        }
        // Quando "Confirm email" está desativado no Supabase, signUp já loga.
        // Quando está ativado, identities vem vazio se o email já existir.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setState({
            kind: "error",
            message: "Esse email já tem conta. Entra em vez de criar.",
          });
          return;
        }
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[pouso] auth threw:", err);
      setState({ kind: "error", message: `Falha inesperada: ${msg}` });
    }
  }

  function toggleMode() {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    setState({ kind: "idle" });
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
            disabled={isLoading}
            required
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock
            size={16}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder={mode === "signup" ? "mínimo 8 caracteres" : "sua senha"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={8}
            className="pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center text-muted hover:text-fg rounded-md transition-colors"
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={16} strokeWidth={1.5} />
            ) : (
              <Eye size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>
        {mode === "signup" && passwordTooShort && (
          <p className="text-xs text-fg-muted leading-relaxed">
            Mínimo de 8 caracteres.
          </p>
        )}
      </div>

      {state.kind === "error" && (
        <p
          role="alert"
          className="text-sm text-danger leading-relaxed bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] border border-[color-mix(in_oklab,var(--danger)_25%,var(--border))] rounded-md px-3 py-2"
        >
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        className={cn("mt-2")}
      >
        {isLoading ? "Carregando…" : mode === "signin" ? "Entrar" : "Criar conta"}
        {!isLoading && <ArrowRight size={18} strokeWidth={1.5} />}
      </Button>

      <button
        type="button"
        onClick={toggleMode}
        disabled={isLoading}
        className="text-sm text-fg-muted hover:text-fg transition-colors text-center mt-2 disabled:opacity-50"
      >
        {mode === "signin"
          ? "Primeira vez? Criar conta."
          : "Já tem conta? Entrar."}
      </button>
    </form>
  );
}

function friendlyError(message: string, mode: Mode): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "Email ou senha incorretos.";
  }
  if (m.includes("email not confirmed")) {
    return "Esse email ainda não foi confirmado. Cheque sua caixa.";
  }
  if (m.includes("user already registered")) {
    return "Esse email já tem conta. Entra em vez de criar.";
  }
  if (m.includes("password should be at least")) {
    return "A senha precisa ter pelo menos 8 caracteres.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Muitas tentativas. Aguarda 1 minuto e tenta de novo.";
  }
  return mode === "signin"
    ? `Não consegui entrar: ${message}`
    : `Não consegui criar a conta: ${message}`;
}
