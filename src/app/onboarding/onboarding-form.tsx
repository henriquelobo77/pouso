"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Sparkles,
} from "lucide-react";
import { commitAction, extractAction } from "./actions";
import type {
  ExtractedOnboarding,
  OnboardingDraft,
} from "@/lib/onboarding/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

type Section = {
  key: keyof OnboardingDraft;
  title: string;
  prompt: string;
  placeholder: string;
};

const SECTIONS: Section[] = [
  {
    key: "contexts",
    title: "Suas vidas paralelas",
    prompt:
      "Quais projetos, empresas ou áreas você divide a sua semana? Tudo que vira tag de contexto depois.",
    placeholder:
      "Trabalho na Nexen (empresa minha de automações), na Hashtag (curso de Supabase, n8n) e na Dedicarmed (ajudando meu pai). Pessoal: estudos de IA, exercício, namorada.",
  },
  {
    key: "accounts",
    title: "Onde mora seu dinheiro",
    prompt:
      "Suas contas, cartões, dinheiro físico, investimentos. Tudo que entra e sai daqui.",
    placeholder:
      "Conta corrente do Nubank, cartão de crédito Nubank final 4242, conta Inter pra freelas, uns R$ 200 em dinheiro, investimento na Rico.",
  },
  {
    key: "income",
    title: "De onde vem",
    prompt:
      "Suas receitas — salário, freelas, pró-labore. Quanto e quando entra.",
    placeholder:
      "Hashtag me paga ~R$ 9.000 todo dia 5. Dedicarmed paga R$ 3.000 todo dia 10. Nexen ainda não tem lucro. Reembolsos batem ~R$ 640 por mês irregular.",
  },
  {
    key: "fixed_costs",
    title: "O que paga todo mês sem pensar",
    prompt:
      "Assinaturas, aluguel, telefonia — qualquer coisa que sai recorrente. Inclui valor e dia se lembrar.",
    placeholder:
      "Notion R$ 50 dia 12, Claude Pro R$ 110 dia 5, Spotify R$ 22, Netflix R$ 55, ChatGPT Plus R$ 110, Hetzner R$ 80, Make R$ 35.",
  },
  {
    key: "categories",
    title: "Como você gasta o resto",
    prompt:
      "As categorias onde seu dinheiro variável vai. Pensa nas últimas semanas.",
    placeholder:
      "Restaurante (muito), mercado, Uber, lazer com a namorada (cinema, bar), livros, presentes, saúde (terapia toda quinta R$ 200).",
  },
  {
    key: "habits",
    title: "Hábitos que quer manter de pé",
    prompt:
      "Coisas que você faz (ou quer fazer) com frequência e gostaria de trackear.",
    placeholder:
      "Estudo de IA das 6:30 às 8:00 dias úteis, terapia toda quinta às 13h, exercício 3x por semana, leitura todo dia, meditar 10min de manhã.",
  },
  {
    key: "weekly_budget",
    title: "Quanto pode gastar por semana (opcional)",
    prompt:
      "Seu limite semanal de gasto variável. Se não tem, pula.",
    placeholder: "R$ 537 por semana pra alimentação, lazer e Uber.",
  },
];

type Stage =
  | { kind: "draft" }
  | { kind: "extracting" }
  | { kind: "preview"; extracted: ExtractedOnboarding }
  | { kind: "committing" }
  | { kind: "error"; message: string };

export function OnboardingForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [stage, setStage] = useState<Stage>({ kind: "draft" });
  const [draft, setDraft] = useState<OnboardingDraft>({
    contexts: "",
    accounts: "",
    income: "",
    fixed_costs: "",
    categories: "",
    habits: "",
    weekly_budget: "",
  });

  const filledSections = SECTIONS.filter((s) => draft[s.key].trim()).length;

  function updateField(key: keyof OnboardingDraft, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleExtract() {
    setStage({ kind: "extracting" });
    startTransition(async () => {
      const result = await extractAction(draft);
      if (!result.ok) {
        setStage({ kind: "error", message: result.error });
        return;
      }
      setStage({ kind: "preview", extracted: result.data });
    });
  }

  function handleCommit(extracted: ExtractedOnboarding) {
    setStage({ kind: "committing" });
    startTransition(async () => {
      const result = await commitAction(extracted);
      if (!result.ok) {
        setStage({ kind: "error", message: result.error });
        return;
      }
      router.refresh();
      router.push("/app");
    });
  }

  if (stage.kind === "extracting" || stage.kind === "committing") {
    return <LoadingState kind={stage.kind} />;
  }

  if (stage.kind === "preview") {
    return (
      <PreviewState
        extracted={stage.extracted}
        onConfirm={handleCommit}
        onBack={() => setStage({ kind: "draft" })}
        pending={pending}
      />
    );
  }

  return (
    <div className="flex flex-col gap-12 animate-pouso-fade-up">
      <div className="flex flex-col gap-4">
        <span className="caption text-primary">primeira aterrissagem</span>
        <h1 className="font-display text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight">
          Me conta sua vida.
        </h1>
        <p className="text-fg-muted text-lg leading-relaxed max-w-xl">
          Responde em texto livre — vírgula, frase quebrada, abreviação, tanto
          faz. A IA monta tudo no banco depois.{" "}
          <span className="text-fg">Pular qualquer seção é OK</span> — você
          adiciona depois quando precisar.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {SECTIONS.map((s, i) => {
          const filled = !!draft[s.key].trim();
          return (
            <section key={s.key} className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1.5 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs tabular ${
                    filled
                      ? "bg-primary text-[#fbf9f4]"
                      : "bg-surface-2 text-fg-muted border border-border"
                  }`}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 flex flex-col gap-1">
                  <Label
                    htmlFor={`onboard-${s.key}`}
                    className="font-display text-2xl font-medium leading-tight"
                  >
                    {s.title}
                  </Label>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {s.prompt}
                  </p>
                </div>
              </div>

              <textarea
                id={`onboard-${s.key}`}
                rows={4}
                value={draft[s.key]}
                onChange={(e) => updateField(s.key, e.target.value)}
                placeholder={s.placeholder}
                className="ml-9 px-3.5 py-3 rounded-md border border-border bg-surface-2 text-fg text-[15px] leading-relaxed placeholder:text-muted placeholder:italic placeholder:text-sm focus:outline-none focus:border-primary focus:bg-surface focus-visible:ring-2 focus-visible:ring-primary/40 transition-[border-color,background-color] duration-200 resize-y"
              />
            </section>
          );
        })}
      </div>

      {stage.kind === "error" && (
        <p
          role="alert"
          className="text-sm text-danger leading-relaxed bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] border border-[color-mix(in_oklab,var(--danger)_25%,var(--border))] rounded-md px-3 py-2"
        >
          {stage.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sticky bottom-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-surface/90 backdrop-blur-sm shadow-[var(--shadow-lift)]">
          <div className="flex items-center gap-3">
            <Sparkles
              size={20}
              strokeWidth={1.5}
              className="text-primary shrink-0"
            />
            <div className="text-sm">
              <p className="text-fg leading-tight">
                <span className="tabular">{filledSections}</span> de{" "}
                <span className="tabular">{SECTIONS.length}</span> seções
                preenchidas
              </p>
              <p className="text-fg-muted text-xs leading-tight mt-0.5">
                a IA vai te mostrar o que entendeu antes de salvar
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleExtract}
            disabled={pending || filledSections === 0}
          >
            Processar
            <ArrowRight size={18} strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoadingState({ kind }: { kind: "extracting" | "committing" }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="relative h-16 w-16">
          <CircleDashed
            size={64}
            strokeWidth={1.25}
            className="text-primary animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">
            {kind === "extracting"
              ? "Lendo o que você escreveu…"
              : "Organizando seu pouso…"}
          </h2>
          <p className="text-fg-muted text-sm leading-relaxed">
            {kind === "extracting"
              ? "A IA está estruturando sua vida em categorias, contas e hábitos."
              : "Salvando tudo no banco. Já já você vê o dashboard."}
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewState({
  extracted,
  onConfirm,
  onBack,
  pending,
}: {
  extracted: ExtractedOnboarding;
  onConfirm: (e: ExtractedOnboarding) => void;
  onBack: () => void;
  pending: boolean;
}) {
  const groups: Array<{
    title: string;
    count: number;
    items: { label: string; sub?: string; badge?: string }[];
  }> = [
    {
      title: "Contextos",
      count: extracted.contexts.length,
      items: extracted.contexts.map((c) => ({
        label: c.label,
        sub: `#${c.slug}`,
      })),
    },
    {
      title: "Contas",
      count: extracted.accounts.length,
      items: extracted.accounts.map((a) => ({
        label: a.name,
        sub: a.institution
          ? `${humanKind(a.kind)} · ${a.institution}${a.last_4 ? " · " + a.last_4 : ""}`
          : humanKind(a.kind),
      })),
    },
    {
      title: "Categorias",
      count: extracted.categories.length,
      items: extracted.categories.map((c) => ({
        label: c.name,
        badge: c.kind === "income" ? "receita" : "gasto",
      })),
    },
    {
      title: "Custos fixos",
      count: extracted.fixed_costs.length,
      items: extracted.fixed_costs.map((f) => ({
        label: f.name,
        sub: `R$ ${f.amount_brl.toFixed(2)}${
          f.day_of_month ? ` · dia ${f.day_of_month}` : ""
        }`,
        badge: f.kind === "income" ? "receita" : undefined,
      })),
    },
    {
      title: "Hábitos",
      count: extracted.habits.length,
      items: extracted.habits.map((h) => ({
        label: h.name,
        sub: [
          humanFreq(h.frequency),
          h.preferred_time,
          h.target_per_week ? `${h.target_per_week}x/semana` : null,
        ]
          .filter(Boolean)
          .join(" · "),
      })),
    },
    ...(extracted.weekly_budget
      ? [
          {
            title: "Orçamento semanal",
            count: 1,
            items: [
              {
                label: `R$ ${extracted.weekly_budget.amount_brl.toFixed(2)} por semana`,
                sub: extracted.weekly_budget.notes,
              },
            ],
          },
        ]
      : []),
  ];

  const total = groups.reduce((s, g) => s + g.count, 0);

  return (
    <div className="flex flex-col gap-10 animate-pouso-fade-up">
      <div className="flex flex-col gap-3">
        <span className="caption text-primary">o que entendi</span>
        <h1 className="font-display text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight">
          {extracted.display_name
            ? `${extracted.display_name}, é isso?`
            : "É isso?"}
        </h1>
        <p className="text-fg-muted text-lg leading-relaxed max-w-xl">
          {total} {total === 1 ? "item" : "itens"} prontos pra salvar. Se algo
          ficou errado, volta e ajusta o texto — a IA refaz.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {groups.map((g) => (
          <div key={g.title} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-medium">{g.title}</h2>
              <span className="caption text-fg-muted tabular">
                {g.count} {g.count === 1 ? "item" : "itens"}
              </span>
            </div>
            {g.count === 0 ? (
              <p className="text-sm text-fg-muted italic">
                (nada extraído — adicione depois pelo módulo)
              </p>
            ) : (
              <Card>
                <CardContent className="flex flex-col p-0">
                  {g.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] text-fg truncate">
                          {item.label}
                        </p>
                        {item.sub && (
                          <p className="text-xs text-fg-muted truncate mt-0.5">
                            {item.sub}
                          </p>
                        )}
                      </div>
                      {item.badge && (
                        <Badge
                          variant={
                            item.badge === "receita" ? "success" : "default"
                          }
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" onClick={onBack} disabled={pending}>
          <ArrowLeft size={18} strokeWidth={1.5} />
          Voltar e ajustar
        </Button>
        <Button
          size="lg"
          onClick={() => onConfirm(extracted)}
          disabled={pending || total === 0}
        >
          <CheckCircle2 size={18} strokeWidth={1.5} />
          Salvar e ir pro pouso
        </Button>
      </div>
    </div>
  );
}

function humanKind(k: string): string {
  return {
    checking: "Conta corrente",
    savings: "Poupança",
    credit_card: "Cartão de crédito",
    cash: "Dinheiro",
    investment: "Investimento",
    other: "Outro",
  }[k] ?? k;
}

function humanFreq(f: string): string {
  return {
    daily: "todo dia",
    weekdays: "dias úteis",
    weekends: "fins de semana",
    weekly: "semanal",
    custom: "custom",
  }[f] ?? f;
}
