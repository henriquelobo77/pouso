import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function ComingSoonPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-8 max-w-md text-center">
        <Sparkles size={36} strokeWidth={1.5} className="text-primary" />
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl md:text-4xl font-medium leading-tight">
            Esse módulo ainda não pousou.
          </h1>
          <p className="text-fg-muted leading-relaxed">
            Está no roadmap. Por enquanto, volta pro dashboard que mostro o que
            já existe.
          </p>
        </div>
        <Link
          href="/app"
          className={buttonVariants({ variant: "secondary", size: "md" })}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Voltar pro hoje
        </Link>
      </div>
    </div>
  );
}
