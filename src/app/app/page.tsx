import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Feather,
  Inbox,
  ListTodo,
  Sparkles,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

function saudacao(date: Date) {
  const h = date.getHours();
  if (h < 5) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function dataLonga(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_completed")
    .eq("id", user!.id)
    .single();

  const displayName =
    profile?.display_name ?? user?.email?.split("@")[0] ?? "você";
  const now = new Date();

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
      {/* ─── Hero ─── */}
      <header className="flex flex-col gap-3 mb-12 animate-pouso-fade-up">
        <span className="caption">{dataLonga(now)}</span>
        <h1 className="font-display text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight">
          {saudacao(now)}, {displayName}.
        </h1>
        <p className="text-fg-muted text-lg leading-relaxed max-w-xl">
          Sua pouso. está em construção — só a fundação está pronta.
          Cada módulo abaixo aterrissa no seu tempo.
        </p>
      </header>

      {/* ─── Status de onboarding ─── */}
      {!profile?.onboarding_completed && (
        <Card className="mb-8 border-primary/30 bg-primary-soft/40">
          <CardContent className="flex items-start gap-5 py-6">
            <Sparkles
              size={22}
              strokeWidth={1.5}
              className="text-primary mt-0.5 shrink-0"
            />
            <div className="flex-1">
              <p className="font-display text-xl leading-snug">
                Falta ajustar o seu pouso.
              </p>
              <p className="text-fg-muted text-[15px] leading-relaxed mt-1.5 max-w-xl">
                Me conta sua rotina, contas, custos fixos e hábitos em texto
                livre. A IA estrutura tudo pra você — uns 8 minutos.
              </p>
              <Link
                href="/onboarding"
                className={buttonVariants({ variant: "primary", size: "md" }) + " mt-5 w-fit"}
              >
                Começar agora
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Módulos próximos ─── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-medium">Próximas pousadas</h2>
          <span className="caption">roadmap fase 1</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              Icon: Wallet,
              title: "Finanças",
              body: "Gastos, receitas, custos fixos, reembolsos, orçamento semanal.",
            },
            {
              Icon: ListTodo,
              title: "Tarefas",
              body: "Inbox, hoje, próximas. Contextos por projeto, recorrência.",
            },
            {
              Icon: Sparkles,
              title: "Hábitos",
              body: "Tracker diário com streak. Começa pelo estudo de IA 6:30—8:00.",
            },
            {
              Icon: Inbox,
              title: "Captura via Telegram",
              body: "Mensagem livre no bot → a IA classifica em gasto, tarefa ou nota.",
            },
            {
              Icon: Feather,
              title: "Diário",
              body: "Foco do dia + reflexão. Auto-populado com o que você fez.",
            },
            {
              Icon: BookOpen,
              title: "Notas",
              body: "Markdown, links wiki, busca. Substitui o vault Obsidian.",
            },
          ].map(({ Icon, title, body }) => (
            <Card key={title} className="bg-surface/50">
              <CardHeader className="pb-3">
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  className="text-primary mb-1"
                />
                <CardTitle className="text-lg flex items-center gap-2">
                  {title}
                  <Badge variant="outline" className="text-[10px] py-0 font-normal">
                    em breve
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-fg-muted leading-relaxed">
                  {body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
