import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODELS } from "@/lib/anthropic/client";
import type { ExtractedOnboarding, OnboardingDraft } from "./types";

const SYSTEM_PROMPT = `Você é um assistente que estrutura informações pessoais em JSON pra um sistema de organização pessoal em português brasileiro chamado pouso.

O usuário acabou de preencher um onboarding em texto livre sobre sua vida.
Sua tarefa: extrair entidades estruturadas pra popular o banco de dados.

REGRAS:
- Idioma: PT-BR. Nomes em português, exceto produtos/marcas (Netflix, Spotify).
- Valores: sempre em BRL, em REAIS (decimal), nunca em centavos. Ex: 49.90, 1500.00.
- Slugs: kebab-case, sem acentos. Ex: "nexen", "bem-dita-torta", "hashtag".
- Cores: hex válido. Use cores discretas e orgânicas (sage, terracota, areia, musgo, caramelo). Evite cores vibrantes/neon.
  Paleta sugerida (escolha entre):
    #7A8F75 (verde-musgo) — uso geral/primary
    #C09872 (caramelo) — destaque quente
    #9B958D (areia) — neutro
    #6B8E5A (verde-mata) — saúde/sustentável
    #C9853D (âmbar) — alerta/atenção
    #A85A4F (terracota) — atenção/cuidado
    #6B655C (chocolate) — formal/sério
    #8B9A8F (sage acinzentado) — neutro suave
- Para contas (account.kind):
    "checking" = conta corrente
    "savings" = poupança
    "credit_card" = cartão de crédito
    "cash" = dinheiro em espécie
    "investment" = investimentos
    "other" = qualquer outro
- Categorias comuns esperadas (expense): alimentação, transporte, lazer, mercado, saúde, educação, assinaturas, trabalho, casa, presentes, outros.
- Categorias comuns esperadas (income): salário, freela, reembolsos, investimentos, outros.
- Para custos fixos com dia de cobrança, captura "day_of_month" (1-31). Se não souber, omite.
- Frequência de hábito:
    "daily" = todo dia
    "weekdays" = só dias úteis (seg-sex)
    "weekends" = só fins de semana
    "weekly" = 1x por semana
    "custom" = especificar target_per_week
- Se um custo fixo for receita recorrente (ex: salário mensal), use kind="income".

INTERPRETE:
- "todo dia 10" no contexto de assinatura = day_of_month: 10
- "aproximadamente R$ 50" = 50.00
- "5 paus" = 5.00
- "tá no Nubank" = institution: "Nubank"
- "final 4242" = last_4: "4242"
- "Estudo 6:30 às 8" = preferred_time: "06:30-08:00"
- Se um campo do usuário estiver vazio ou em branco, retorne lista vazia [] (nunca null nem string vazia).

Seja generoso: extraia tudo que conseguir interpretar com confiança. Em caso de dúvida, omita.`;

const EXTRACT_TOOL = {
  name: "salvar_onboarding" as const,
  description:
    "Salva todas as informações estruturadas do onboarding em uma única chamada.",
  input_schema: {
    type: "object" as const,
    properties: {
      display_name: {
        type: "string",
        description:
          "Nome ou apelido do usuário pra saudações (ex: 'Henrique', 'Hen'). Se não declarado, omita.",
      },
      contexts: {
        type: "array",
        description:
          "Contextos de vida — projetos, empresas, áreas. Ex: nexen, hashtag, pessoal. Slug em kebab-case.",
        items: {
          type: "object",
          properties: {
            slug: { type: "string" },
            label: { type: "string" },
            color: { type: "string" },
            icon: { type: "string" },
          },
          required: ["slug", "label", "color"],
        },
      },
      accounts: {
        type: "array",
        description:
          "Contas financeiras (cartões, conta corrente, dinheiro, investimentos).",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            kind: {
              type: "string",
              enum: [
                "checking",
                "savings",
                "credit_card",
                "cash",
                "investment",
                "other",
              ],
            },
            institution: { type: "string" },
            last_4: { type: "string" },
            color: { type: "string" },
          },
          required: ["name", "kind", "color"],
        },
      },
      categories: {
        type: "array",
        description:
          "Categorias de gasto e receita. Inclui todas que o usuário menciona + as 'comuns' caso ele não cite (alimentação, transporte, etc).",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            kind: { type: "string", enum: ["expense", "income"] },
            icon: { type: "string" },
            color: { type: "string" },
          },
          required: ["name", "kind", "color"],
        },
      },
      fixed_costs: {
        type: "array",
        description:
          "Custos fixos (assinaturas, aluguel, etc) E receitas recorrentes (salário). Use kind apropriado.",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            amount_brl: { type: "number" },
            day_of_month: { type: "integer", minimum: 1, maximum: 31 },
            kind: { type: "string", enum: ["expense", "income"] },
            category_name: {
              type: "string",
              description: "Nome de uma categoria já listada acima.",
            },
            account_name: {
              type: "string",
              description: "Nome de uma conta já listada acima.",
            },
            context_slug: { type: "string" },
            notes: { type: "string" },
          },
          required: ["name", "amount_brl", "kind"],
        },
      },
      habits: {
        type: "array",
        description: "Hábitos que o usuário quer trackear.",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            frequency: {
              type: "string",
              enum: ["daily", "weekdays", "weekends", "weekly", "custom"],
            },
            target_per_week: {
              type: "integer",
              minimum: 1,
              maximum: 14,
            },
            preferred_time: { type: "string" },
            context_slug: { type: "string" },
          },
          required: ["name", "frequency"],
        },
      },
      weekly_budget: {
        type: "object",
        description: "Orçamento semanal de gasto variável. Omitir se não declarado.",
        properties: {
          amount_brl: { type: "number" },
          notes: { type: "string" },
        },
        required: ["amount_brl"],
      },
    },
    required: ["contexts", "accounts", "categories", "fixed_costs", "habits"],
  },
};

function buildUserMessage(draft: OnboardingDraft): string {
  const sections = [
    ["CONTEXTOS / PROJETOS / ÁREAS DA VIDA", draft.contexts],
    ["CONTAS FINANCEIRAS", draft.accounts],
    ["RECEITAS / DE ONDE VEM O DINHEIRO", draft.income],
    ["CUSTOS FIXOS / ASSINATURAS / RECORRENTES", draft.fixed_costs],
    ["GASTOS COMUNS / CATEGORIAS", draft.categories],
    ["HÁBITOS QUE QUERO TRACKEAR", draft.habits],
    ["ORÇAMENTO SEMANAL (opcional)", draft.weekly_budget],
  ] as const;

  return sections
    .map(([title, content]) => {
      const txt = (content || "").trim();
      return `## ${title}\n${txt || "(vazio)"}`;
    })
    .join("\n\n");
}

export async function extractOnboarding(
  draft: OnboardingDraft
): Promise<ExtractedOnboarding> {
  const client = anthropic();

  const response = await client.messages.create({
    model: MODELS.default,
    max_tokens: 8192,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [EXTRACT_TOOL],
    tool_choice: { type: "tool", name: EXTRACT_TOOL.name },
    messages: [
      {
        role: "user",
        content: buildUserMessage(draft),
      },
    ],
  });

  // Encontra o tool_use block na resposta
  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("Claude não retornou tool_use. Tenta de novo.");
  }

  const data = toolUse.input as Partial<ExtractedOnboarding>;

  // Normaliza: garante arrays não-undefined
  return {
    display_name: data.display_name,
    contexts: data.contexts ?? [],
    accounts: data.accounts ?? [],
    categories: data.categories ?? [],
    fixed_costs: data.fixed_costs ?? [],
    habits: data.habits ?? [],
    weekly_budget: data.weekly_budget ?? null,
  };
}

