import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Mark } from "@/components/brand/mark";
import { Wordmark } from "@/components/brand/wordmark";

export const metadata: Metadata = {
  title: "entrar",
  description: "Entre na sua pouso.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-bg">
      <div className="w-full max-w-sm flex flex-col items-center gap-12 animate-pouso-fade-up">
        <div className="flex flex-col items-center gap-5">
          <Mark size={56} />
          <Wordmark className="text-5xl" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-display text-3xl font-medium leading-tight">
            Bem-vindo de volta.
          </h1>
          <p className="text-fg-muted text-[15px] leading-relaxed">
            Entra com email e senha.
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="caption text-fg-muted text-center max-w-xs leading-relaxed">
          plataforma pessoal · acesso restrito
        </p>
      </div>
    </main>
  );
}
