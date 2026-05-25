# pouso. — Identidade Visual

## Nome

**pouso.** (sempre minúsculo, ponto final como assinatura)

Pronúncia: "POH-so". Use sempre o ponto final quando for marca, omita quando for palavra comum no texto.

## Conceito

Pouso é o lugar onde a vida aterrissa. Não é um cockpit cheio de painéis nem uma central de comando — é o caderno de viagem, a casa de campo, o chá da tarde. O sistema que organiza tudo, mas com a sensação de papel, não de software.

**Palavras-âncora:** orgânico, calmo, papel, ninho, descanso, atemporal, analógico.

**O que NÃO somos:** futurista, neon, glassmorphism, gradientes vibrantes, dark-mode-por-padrão-pra-parecer-cool, ícones inflados, drop shadows pesadas.

## Tipografia

### Display / Títulos
Serif transicional com presença mas sem rigidez vitoriana.

**Candidatos (decidir testando lado a lado):**
- **Source Serif 4** — open source, peso variável, equilibrada
- **Fraunces** — open source, mais expressiva, ótimas ligatures
- **GT Sectra** — comercial, mais cara, referência editorial premium

**Default inicial:** Fraunces (Google Fonts, peso 400-600, optical sizing automática).

### Corpo
Sans humanista de alta legibilidade.

**Candidatos:**
- **Inter** — neutra, segura, bem conhecida
- **Geist Sans** — da Vercel, contemporânea
- **Söhne** — comercial, mais cara

**Default inicial:** Inter (Google Fonts, peso 400-600).

Para textos longos (diário, notas), considerar usar a própria Fraunces em corpo — alinha melhor com o tom analógico.

### Monoespaçada
Para valores numéricos em finanças, hashes, código.

**Default:** Geist Mono (Google Fonts).

### Hierarquia
- Hero/h1: Fraunces 48-64px, peso 500, line-height 1.05
- h2: Fraunces 32-40px, peso 500
- h3: Fraunces 24px, peso 500
- h4: Inter 18px, peso 600
- Body: Inter 16px, peso 400, line-height 1.65
- Small: Inter 14px, peso 400
- Caption: Inter 12px, peso 500, letter-spacing 0.02em, uppercase

## Paleta

### Light mode (padrão)

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#F4F1EA` | Fundo da aplicação (linho) |
| `--surface` | `#FBF9F4` | Cards, modais, áreas elevadas |
| `--surface-2` | `#EDEAE1` | Áreas afundadas, inputs, hovers |
| `--fg` | `#2C2926` | Texto principal (chocolate escuro) |
| `--fg-muted` | `#6B655C` | Texto secundário |
| `--muted` | `#9B958D` | Texto desabilitado, placeholders (cinza-areia) |
| `--border` | `#E6E1D6` | Bordas suaves (linho médio) |
| `--border-strong` | `#D4CEC0` | Bordas com mais presença |
| `--primary` | `#7A8F75` | CTAs, links, foco (verde-musgo) |
| `--primary-hover` | `#6B8067` | Estado hover do primary |
| `--primary-soft` | `#E4EAE0` | Backgrounds de badges/chips primários |
| `--accent` | `#C09872` | Destaques quentes, números importantes (caramelo) |
| `--accent-soft` | `#F0E4D2` | Background suave do accent |
| `--success` | `#6B8E5A` | Confirmações |
| `--warning` | `#C9853D` | Alertas leves |
| `--danger` | `#A85A4F` | Erros, exclusões (terracota escura — não vermelho neon) |

### Dark mode (Fase 2)

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#1C1B18` | Fundo (noite quente) |
| `--surface` | `#26241F` | Cards |
| `--surface-2` | `#2F2C26` | Inputs |
| `--fg` | `#E8E3D7` | Texto principal (linho claro) |
| `--fg-muted` | `#A8A096` | Texto secundário |
| `--muted` | `#6B655C` | Desabilitado |
| `--border` | `#3A352C` | Bordas |
| `--primary` | `#9DB098` | Verde-musgo iluminado |
| `--accent` | `#D4AC85` | Caramelo iluminado |

## Componentes

### Botões
- Border-radius: 8px
- Padding: 10px 16px (md), 8px 12px (sm), 12px 20px (lg)
- Transição: 200ms ease-out em background e border
- Foco: anel de 2px do `--primary` com offset 2px

### Cards
- Border-radius: 12px
- Border: 1px solid `--border`
- Background: `--surface`
- Padding: 24px (default)
- Sombra: nenhuma por padrão. Apenas em modais/popovers usar sombra suave: `0 4px 24px rgba(44, 41, 38, 0.06)`

### Inputs
- Border-radius: 8px
- Border: 1px solid `--border`
- Background: `--surface-2`
- Foco: border `--primary` + ring sutil

### Animações
- Default: 200-300ms `ease-out`
- Entrada de listas: stagger de 30ms entre itens
- Microinterações: 150ms (hover, ativo)
- Evitar bounces e overshoots — tudo deve aterrissar suave (literal: pouso)

### Ícones
- Lucide com `stroke-width={1.5}` (mais leves que o padrão 2)
- Tamanhos: 16px (inline), 20px (botões/menu), 24px (destaque)

## Logotipo

### Wordmark
`pouso.` em **Fraunces** peso 500, todas minúsculas. O ponto final tem o mesmo tamanho da letra, mas é colorido em `--primary` (verde-musgo) — único toque de cor na marca.

```
pouso.
      └─ verde-musgo
```

### Símbolo
Forma orgânica abstrata. Direções a explorar (escolher na execução):
1. **Folha caindo** — minimalista, uma única curva
2. **Ninho** — duas curvas formando uma concavidade
3. **Pegada de pássaro** — três traços convergentes
4. **Círculo interrompido** — pouso é círculo, decolagem é círculo aberto

**Cor:** sempre `--primary` (verde-musgo) sobre fundo `--bg` (linho). Em dark mode, inverte.

### Favicon / Ícone PWA
Símbolo isolado em verde-musgo sobre fundo linho, com cantos ligeiramente arredondados (maskable safe zone).

Tamanhos obrigatórios:
- 16x16, 32x32 (favicon)
- 180x180 (apple-touch-icon)
- 192x192, 512x512 (PWA)
- 512x512 maskable (PWA com safe area)

## Regras de uso

1. **Espaçamento mínimo do logotipo:** altura do "p" em todos os lados.
2. **Nunca usar o wordmark sem o ponto.**
3. **Nunca usar em maiúsculas** (POUSO está errado).
4. **Nunca girar, distorcer, ou aplicar gradientes** no logo.
5. **Sobre fotos:** só sobre áreas calmas, sem competir. Preferir composições com muito céu/parede neutra.
6. **Acompanhamento de texto:** sempre Fraunces ou Inter — nunca misturar com fontes do sistema.

## Tom de voz

Em copy de UI: direto, em PT-BR, sem firulas. Use o "você". Erros explicam o que aconteceu sem culpar. Empty states convidam, não vendem.

**Exemplos:**
- ❌ "Ops! Algo deu errado." 
- ✅ "Não consegui salvar. Tenta de novo?"

- ❌ "Comece sua jornada criando sua primeira tarefa!"
- ✅ "Sem tarefas por aqui. Quer adicionar uma?"

- ❌ "Sucesso!"
- ✅ "Salvo."
