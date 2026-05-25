import type { Metadata } from "next";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Coffee,
  Feather,
  Leaf,
  ListTodo,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mark } from "@/components/brand/mark";
import { Wordmark } from "@/components/brand/wordmark";
import { HorizontalLogo } from "@/components/brand/horizontal-logo";

export const metadata: Metadata = {
  title: "style guide",
  description: "Sistema visual da plataforma pouso.",
};

const palette = [
  { token: "--bg", hex: "#F4F1EA", name: "Linho", use: "Fundo da aplicação" },
  { token: "--surface", hex: "#FBF9F4", name: "Linho claro", use: "Cards, áreas elevadas" },
  { token: "--surface-2", hex: "#EDEAE1", name: "Linho fundo", use: "Inputs, hovers" },
  { token: "--fg", hex: "#2C2926", name: "Chocolate escuro", use: "Texto principal" },
  { token: "--fg-muted", hex: "#6B655C", name: "Cinza terra", use: "Texto secundário" },
  { token: "--muted", hex: "#9B958D", name: "Cinza areia", use: "Placeholders" },
  { token: "--border", hex: "#E6E1D6", name: "Linho médio", use: "Bordas suaves" },
  { token: "--primary", hex: "#7A8F75", name: "Verde-musgo", use: "CTAs, foco, o ponto" },
  { token: "--accent", hex: "#C09872", name: "Caramelo", use: "Destaques quentes" },
  { token: "--success", hex: "#6B8E5A", name: "Verde mata", use: "Confirmações" },
  { token: "--warning", hex: "#C9853D", name: "Âmbar", use: "Alertas leves" },
  { token: "--danger", hex: "#A85A4F", name: "Terracota", use: "Erros, exclusões" },
];

const typeScale = [
  { name: "Hero", className: "font-display font-medium text-7xl tracking-tight leading-[1.05]", sample: "pouso.", note: "Fraunces 500 · 72px" },
  { name: "Título", className: "font-display font-medium text-5xl tracking-tight leading-[1.1]", sample: "Lugar onde a vida aterrissa", note: "Fraunces 500 · 48px" },
  { name: "Subtítulo", className: "font-display font-medium text-3xl leading-tight", sample: "Esta semana você gastou R$ 487", note: "Fraunces 500 · 30px" },
  { name: "Heading", className: "font-display font-medium text-2xl leading-snug", sample: "Tarefas de hoje", note: "Fraunces 500 · 24px" },
  { name: "Eyebrow", className: "font-sans text-lg font-semibold", sample: "Finanças · Maio 2026", note: "Inter 600 · 18px" },
  { name: "Corpo", className: "font-sans text-base leading-relaxed", sample: "O sistema que organiza tudo, mas com a sensação de papel, não de software. Caderno de viagem, casa de campo, chá da tarde.", note: "Inter 400 · 16px" },
  { name: "Corpo prosa", className: "prose-pouso", sample: "Hoje gravei a aula 2 do curso de n8n. A energia foi melhor que a última, mas ainda quero refinar a abertura.", note: "Fraunces 400 · 17px — pra diário e notas longas" },
  { name: "Small", className: "font-sans text-sm text-fg-muted", sample: "atualizado há 2 minutos", note: "Inter 400 · 14px" },
  { name: "Caption", className: "caption", sample: "Custos fixos · maio", note: "Inter 500 · 12px · uppercase 0.08em" },
];

const iconList = [
  { Icon: Wallet, label: "Finanças" },
  { Icon: ListTodo, label: "Tarefas" },
  { Icon: Sparkles, label: "Hábitos" },
  { Icon: BookOpen, label: "Notas" },
  { Icon: Calendar, label: "Agenda" },
  { Icon: Coffee, label: "Rotina" },
  { Icon: Leaf, label: "Orgânico" },
  { Icon: Feather, label: "Diário" },
  { Icon: Search, label: "Buscar" },
  { Icon: Plus, label: "Adicionar" },
  { Icon: Sun, label: "Manhã" },
  { Icon: Moon, label: "Noite" },
];

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="flex flex-col gap-3 mb-12">
      <span className="caption text-primary">{number} — sistema</span>
      <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.05]">
        {title}
      </h2>
      {description && (
        <p className="text-fg-muted text-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* ─────────────────────────────────────────────────────────────
          TOP BAR
          ───────────────────────────────────────────────────────────── */}
      <nav className="border-b border-border bg-bg/85 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <HorizontalLogo markSize={28} textSize="text-2xl" />
          <div className="flex items-center gap-3">
            <span className="caption hidden md:inline">Sistema visual · v0</span>
            <Badge variant="primary">Fase −1</Badge>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-20 md:pb-28 animate-pouso-fade-up">
        <div className="flex flex-col md:flex-row md:items-end gap-12 md:gap-20">
          <div className="flex-1">
            <span className="caption text-primary">Identidade visual</span>
            <Wordmark
              as="h1"
              className="block mt-6 text-[10rem] md:text-[14rem] leading-[0.85] tracking-[-0.04em]"
            />
            <p className="mt-10 text-2xl md:text-3xl font-display text-fg-muted max-w-xl leading-snug">
              Lugar onde a vida aterrissa.
            </p>
            <p className="mt-6 text-fg-muted text-base max-w-lg leading-relaxed">
              O sistema que organiza tudo, mas com a sensação de papel —
              não de software. Caderno de viagem, casa de campo, chá da tarde.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-5 shrink-0">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full border border-border bg-surface flex items-center justify-center">
              <Mark size={120} />
            </div>
            <span className="caption text-center md:text-right">
              Símbolo · o ponto pousa
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Separator />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PRINCÍPIOS
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <SectionHeading
          number="01"
          title="Princípios"
          description="A identidade nasce de um conceito simples: um lugar para a vida descansar. Cada decisão visual passa pelo mesmo filtro."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              Icon: Leaf,
              title: "Orgânico, não mecânico",
              body: "Curvas suaves, tipografia humanista, paleta de terra. Nada que pareça uma central de comando.",
            },
            {
              Icon: Coffee,
              title: "Calmo, não silencioso",
              body: "Espaçamento generoso, animações que aterrissam, sem bounces. A interface respira mas não desaparece.",
            },
            {
              Icon: Feather,
              title: "Atemporal, não nostálgico",
              body: "Referências analógicas — caderno, papel, biblioteca — sem virar pastiche vintage. Continua sendo software contemporâneo.",
            },
          ].map(({ Icon, title, body }) => (
            <Card key={title}>
              <CardHeader>
                <Icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-primary mb-2"
                />
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-fg-muted leading-relaxed text-[15px]">
                  {body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Separator />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PALETA
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <SectionHeading
          number="02"
          title="Paleta"
          description="Tons de linho, terra e musgo. Nada vibrante — cada cor existe para descansar o olhar."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {palette.map((c) => (
            <div
              key={c.token}
              className="border border-border bg-surface rounded-lg overflow-hidden"
            >
              <div
                className="h-24 w-full"
                style={{ background: c.hex }}
                aria-hidden
              />
              <div className="p-4 flex flex-col gap-1">
                <span className="caption">{c.name}</span>
                <span className="font-display text-lg leading-tight">{c.token}</span>
                <span className="tabular text-xs text-fg-muted">{c.hex}</span>
                <span className="text-xs text-fg-muted mt-1">{c.use}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Separator />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TIPOGRAFIA
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <SectionHeading
          number="03"
          title="Tipografia"
          description="Fraunces no display — uma serif transicional com presença sem rigidez. Inter no corpo. Geist Mono nos números."
        />

        <div className="flex flex-col divide-y divide-border border-y border-border">
          {typeScale.map((t) => (
            <div
              key={t.name}
              className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 py-10"
            >
              <div className="flex flex-col gap-1">
                <span className="caption">{t.name}</span>
                <span className="text-xs text-fg-muted tabular">{t.note}</span>
              </div>
              <div className={t.className}>{t.sample}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Separator />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          COMPONENTES
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <SectionHeading
          number="04"
          title="Componentes"
          description="Blocos básicos para tudo que vem pela frente. Cantos generosos, sombras quase invisíveis, transições que aterrissam suave."
        />

        <div className="flex flex-col gap-16">
          {/* Botões */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-2xl font-medium">Botões</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">Salvar gasto</Button>
              <Button variant="secondary">Cancelar</Button>
              <Button variant="outline">Ver mais</Button>
              <Button variant="ghost">Fechar</Button>
              <Button variant="accent">
                <Sparkles strokeWidth={1.5} />
                Insight
              </Button>
              <Button variant="danger">Excluir</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Pequeno</Button>
              <Button size="md">Médio</Button>
              <Button size="lg">
                Grande
                <ArrowUpRight strokeWidth={1.5} />
              </Button>
              <Button size="icon" variant="secondary" aria-label="Buscar">
                <Search strokeWidth={1.5} />
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-2xl font-medium">Badges</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge>#pessoal</Badge>
              <Badge variant="primary">#nexen</Badge>
              <Badge variant="accent">#hashtag</Badge>
              <Badge variant="success">
                <CheckCircle2 size={12} strokeWidth={2} />
                Pago
              </Badge>
              <Badge variant="warning">Vencendo em 3 dias</Badge>
              <Badge variant="danger">Atrasado</Badge>
              <Badge variant="outline">Rascunho</Badge>
            </div>
          </div>

          {/* Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-6">
              <h3 className="font-display text-2xl font-medium">Inputs</h3>
              <div className="flex flex-col gap-4 max-w-sm">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sg-name">Descrição</Label>
                  <Input id="sg-name" placeholder="Almoço com a Mari" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sg-amount">Valor</Label>
                  <Input
                    id="sg-amount"
                    placeholder="R$ 0,00"
                    className="tabular"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sg-disabled">Conta</Label>
                  <Input
                    id="sg-disabled"
                    value="Nubank · final 4242"
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-display text-2xl font-medium">Cards</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Próximo pouso</CardTitle>
                  <CardDescription>
                    Terapia com Leo Habib · quinta às 13h
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-fg-muted">
                  Você marcou esse compromisso há 3 semanas. Tudo confirmado.
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="ghost">
                    Reagendar
                  </Button>
                  <Button size="sm" variant="primary">
                    Confirmar
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Separator />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ÍCONES
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <SectionHeading
          number="05"
          title="Ícones"
          description="Lucide com stroke 1.5 — mais leve que o default. Sempre acompanhados de label quando aparecem isolados."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {iconList.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-3 py-8 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors duration-200"
            >
              <Icon size={28} strokeWidth={1.5} className="text-fg" />
              <span className="caption">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Separator />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          EXEMPLOS COMPOSTOS — UI DO PRODUTO
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <SectionHeading
          number="06"
          title="A vida em pouso."
          description="Como a identidade vive nos primeiros módulos da plataforma. Não são telas finais — são protótipos do tom."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* DASHBOARD DO DIA */}
          <Card className="lg:col-span-7">
            <CardHeader className="pb-4">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <span className="caption">segunda · 25 de maio</span>
                  <CardTitle className="text-3xl mt-2">Bom dia, Henrique.</CardTitle>
                </div>
                <span className="text-fg-muted text-sm tabular">07:42</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <p className="prose-pouso text-fg">
                Hoje você tem <span className="text-primary font-medium">3 tarefas</span> e
                uma reunião com a Catia às 15h. O orçamento da semana ainda tem{" "}
                <span className="tabular text-accent">R$ 184</span> disponíveis.
              </p>

              <Separator />

              <div className="flex flex-col gap-3">
                <span className="caption">Tarefas de hoje</span>
                {[
                  { title: "Estudar IA · 6:30—8:00", tag: "estudos", done: true },
                  { title: "Revisar workflow Hana Cashback", tag: "nexen", done: false },
                  { title: "Editar aula 2 do curso n8n", tag: "hashtag", done: false },
                ].map((t, i) => (
                  <div
                    key={t.title}
                    className="flex items-center gap-3 py-2"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        t.done
                          ? "bg-primary border-primary"
                          : "border-border-strong"
                      }`}
                      aria-hidden
                    >
                      {t.done && (
                        <CheckCircle2 size={14} strokeWidth={2.5} className="text-surface" />
                      )}
                    </span>
                    <span
                      className={`flex-1 text-[15px] ${
                        t.done ? "text-muted line-through" : "text-fg"
                      }`}
                    >
                      {t.title}
                    </span>
                    <Badge
                      variant={t.tag === "nexen" ? "primary" : t.tag === "hashtag" ? "accent" : "default"}
                    >
                      #{t.tag}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CARTÃO FINANÇAS */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <span className="caption">Esta semana</span>
              <div className="flex items-baseline justify-between mt-1">
                <CardTitle className="text-3xl tabular">R$ 353<span className="text-fg-muted">,40</span></CardTitle>
                <Badge variant="warning">66% do limite</Badge>
              </div>
              <CardDescription>de R$ 537 disponíveis pra variável</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "66%" }}
                />
              </div>

              <div className="flex flex-col divide-y divide-border">
                {[
                  { label: "Almoço · Banca do Léo", value: "−R$ 32,00", tag: "alimentação" },
                  { label: "Uber · ida à terapia", value: "−R$ 18,40", tag: "transporte" },
                  { label: "Mari · cinema sexta", value: "−R$ 60,00", tag: "lazer" },
                ].map((tx) => (
                  <div key={tx.label} className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-fg truncate">{tx.label}</p>
                      <span className="caption">{tx.tag}</span>
                    </div>
                    <span className="tabular text-[14px] text-fg-muted">
                      {tx.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="ghost" className="ml-auto">
                Ver todos
                <ArrowUpRight strokeWidth={1.5} />
              </Button>
            </CardFooter>
          </Card>

          {/* ENTRADA DE DIÁRIO */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex items-baseline gap-3">
                <Feather size={20} strokeWidth={1.5} className="text-primary" />
                <span className="caption">diário · ontem</span>
              </div>
              <CardTitle className="text-2xl mt-2">Domingo, 24 de maio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="prose-pouso">
                Hoje gravei a aula 2 do curso de n8n. A energia foi melhor que
                a última, mas ainda quero refinar a abertura — o primeiro
                minuto está atropelado. À tarde, almoço com a família e três
                capítulos do livro do Dyer. Manhã produtiva, tarde devagar — o
                ritmo certo pra um domingo.
              </p>
            </CardContent>
            <CardFooter className="text-sm text-fg-muted">
              <span className="caption">3 tarefas concluídas · 1 pendente</span>
            </CardFooter>
          </Card>

          {/* HÁBITOS */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <span className="caption">Hábitos · maio</span>
              <CardTitle className="text-2xl mt-2">Estudo de IA</CardTitle>
              <CardDescription>6:30 — 8:00 · todo dia útil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 28 }).map((_, i) => {
                  const done = [0, 1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 15, 16, 18, 19, 21, 22, 23].includes(i);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-[4px] ${
                        done ? "bg-primary" : "bg-surface-2 border border-border"
                      }`}
                      aria-label={done ? "feito" : "pendente"}
                    />
                  );
                })}
              </div>
              <div className="flex items-baseline gap-2 mt-5">
                <span className="font-display text-3xl tabular text-fg">14</span>
                <span className="text-fg-muted text-sm">dias seguidos</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Separator />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          REGRAS DE USO DO LOGO
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <SectionHeading
          number="07"
          title="Logotipo"
          description="Sempre minúsculo. O ponto sempre verde-musgo. Espaço mínimo igual à altura do 'p'."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex items-center justify-center min-h-[280px]">
            <Wordmark className="text-7xl" />
          </Card>
          <Card className="flex items-center justify-center min-h-[280px]">
            <Mark size={140} />
          </Card>
          <Card className="md:col-span-2 flex items-center justify-center min-h-[200px]">
            <HorizontalLogo markSize={56} textSize="text-6xl" />
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-[#1C1B18] border-[#3A352C]">
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <HorizontalLogo
                markSize={48}
                textSize="text-5xl"
                className="[&_*]:text-[#E8E3D7]"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Regras</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-[15px] text-fg-muted leading-relaxed">
              <p>
                <span className="text-fg">·</span> Nunca usar sem o ponto final.
              </p>
              <p>
                <span className="text-fg">·</span> Nunca em maiúsculas (POUSO está errado).
              </p>
              <p>
                <span className="text-fg">·</span> Nunca girar, distorcer ou aplicar gradientes.
              </p>
              <p>
                <span className="text-fg">·</span> Sobre fotos: só em áreas calmas, sem competir.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <HorizontalLogo markSize={32} textSize="text-3xl" />
            <p className="mt-3 text-fg-muted text-sm max-w-sm leading-relaxed">
              Sistema visual · v0 · maio de 2026. Construído por Henrique, com Claude.
            </p>
          </div>
          <span className="caption text-fg-muted">
            BRAND.md · /style-guide
          </span>
        </div>
      </footer>
    </div>
  );
}
