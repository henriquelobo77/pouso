import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Mark } from "@/components/brand/mark";
import { Wordmark } from "@/components/brand/wordmark";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ctaHref = user ? "/app" : "/login";
  const ctaLabel = user ? "Entrar no app" : "Entrar";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-bg relative">
      <div className="flex flex-col items-center gap-12 max-w-2xl animate-pouso-fade-up">
        <Mark size={88} />

        <div className="flex flex-col items-center gap-6 text-center">
          <Wordmark
            as="h1"
            className="text-8xl md:text-9xl leading-none tracking-[-0.03em]"
          />
          <p className="font-display text-2xl md:text-3xl text-fg-muted leading-snug max-w-md">
            Lugar onde a vida aterrissa.
          </p>
        </div>

        <Link
          href={ctaHref}
          className={buttonVariants({ variant: "primary", size: "lg" })}
        >
          {ctaLabel}
          <ArrowRight size={18} strokeWidth={1.5} />
        </Link>
      </div>

      <footer className="absolute bottom-8 flex flex-col items-center gap-1">
        <span className="caption text-fg-muted">Fase 0 · fundação</span>
        <Link
          href="/style-guide"
          className="text-xs text-muted hover:text-fg-muted transition-colors"
        >
          style guide
        </Link>
      </footer>
    </main>
  );
}
