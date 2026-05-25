import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Mark } from "@/components/brand/mark";
import { Wordmark } from "@/components/brand/wordmark";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-bg">
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

        <p className="text-fg-muted text-center max-w-md leading-relaxed">
          Plataforma pessoal em construção.
          Por enquanto, só o sistema visual está pronto.
        </p>

        <Link
          href="/style-guide"
          className={buttonVariants({ variant: "primary", size: "lg" })}
        >
          Ver o style guide
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </Link>
      </div>

      <footer className="absolute bottom-8 caption text-fg-muted">
        Fase −1 · identidade visual
      </footer>
    </main>
  );
}
