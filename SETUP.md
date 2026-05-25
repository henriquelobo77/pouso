# pouso. — preparação do terreno

Checklist pra você preencher antes de chamar o Claude pra começar a Fase 0.
Quando todos os blocos abaixo estiverem ✅, o Claude consegue executar Fases 0 → 4 sem te pedir nada.

---

## A. Decisões a fixar

Algumas escolhas amarram o restante. Marque a opção e segue.

### A1. Domínio
- [ ] **`pouso.henriquecentral.com`** (recomendado) — zero custo, aponta CNAME pra Vercel
- [ ] `pouso.app` — ~R$200/ano, identidade própria (verificar se está disponível em registro.br ou Namecheap)
- [x] outro: vamos usar um domínio grátis da vercel antes, depois pensamos nisso.

### A2. Método de autenticação
- [x] **Magic link por email** (recomendado) — grátis no Supabase, sem SMS, sem custo, ótima UX
- [ ] OTP por SMS — exige Twilio integrado, custa por SMS, melhor pra mobile
- [ ] Google OAuth — login com Google, grátis, simples
- [ ] PIN local sem auth — single-user, mais simples ainda, mas vulnerável se o domínio for público

### A3. Captura rápida
- [x] **Telegram bot** (recomendado pra começar) — grátis, criação em 2 min via @BotFather, ótimo no mobile
- [ ] WhatsApp Cloud API — mais natural pra você (já usa nos clientes Nexen), mas exige número dedicado e setup Meta
- [ ] Ambos — começa Telegram, adiciona WhatsApp depois

### A4. Region do Supabase
- [x] **South America (sa-east-1, São Paulo)** — recomendado, menor latência
- [ ] US East — caso queira mais barato/estável

### A5. Tier de hospedagem
- [x] **Vercel Hobby + Supabase Free** (recomendado pra começar) — grátis até bater limites
- [ ] Vercel Pro ($20/mês) — se precisar de cron jobs > 2 e domínios extras
- Decidir conforme uso real

---

## B. Contas a criar / configurar (online)

### B1. GitHub
- [x] Criar repositório **privado** chamado `pouso` no seu GitHub pessoal
- [x] **NÃO** inicializar com README/gitignore (o repo local já tem)
- [x] Anotar a URL do repo: `https://github.com/henriquelobo77/pouso.git` 

### B2. Supabase
- [x] Projeto criado em https://supabase.com/dashboard (name: `pouso`, region: sa-east-1, plan: Free)
- [x] Database password salva no Bitwarden (item "Supabase pouso DB")
- [x] Credenciais no `.env.local` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PROJECT_REF)
- [x] Magic link ativado em Authentication → Providers → Email

### B3. Vercel
- [x] Criar conta em https://vercel.com (login com GitHub é o mais simples) 
- [x] Conectar a integração com seu GitHub (autorizar acesso ao repo `pouso`)
- [x] **Não** importar o projeto ainda — o Claude vai fazer isso na Fase 0 com `vercel link`

### B4. Anthropic (Claude API)
- [x] Key `pouso-prod` criada e no `.env.local` (ANTHROPIC_API_KEY)
- [x] Saldo carregado

### B5. OpenAI (Whisper — voz)
- [x] Key `pouso-whisper` criada e no `.env.local` (OPENAI_API_KEY)

### B6. Telegram bot
- [x] Bot criado via @BotFather (username: `pouso_henrique_bot`)
- [x] Token no `.env.local` (TELEGRAM_BOT_TOKEN)
- [x] Mensagem inicial enviada pro bot
- [ ] chat_id — o Claude descobre na Fase 1 com long-polling, você não faz nada

### B7. WhatsApp Cloud (se escolheu WhatsApp em A3)
- [ ] Abrir Meta Business → WhatsApp Cloud API
- [ ] Criar app, conectar número dedicado, anotar:
  - Phone Number ID
  - Business Account ID
  - Access Token (permanente, não temp)
- (Mesmo processo dos clientes Nexen — pode reaproveitar know-how)

### B8. (Opcional) Resend para notificações por email
- [ ] Só se quiser que a plataforma te envie email quando algo importante (custo fixo vencendo, etc)
- [x] Adiar pra Fase 4 — não bloqueia nada

---

## C. Ferramentas locais (CLIs)

Instale uma vez na sua máquina. Verifique cada uma com o comando de teste.

### C1. Node + pnpm
- [x] Já instalados (você usou pra criar o projeto)

### C2. GitHub CLI (`gh`)
- [x] Instalar: `winget install GitHub.cli` (ou baixar de https://cli.github.com)
- [x] Autenticar: `gh auth login` → escolhe HTTPS, browser auth
- [x] Testar: `gh repo list --limit 3`

### C3. Vercel CLI
- [ ] Instalar global: `pnpmsupa add -g vercel`
- [ ] Autenticar: `vercel login` (link no terminal)
- [ ] Testar: `vercel whoami`

### C4. Supabase CLI
- [x] Instalar via Scoop (recomendado no Windows): `scoop install supabase`
  - Se não tem Scoop: `irm get.scoop.sh | iex` no PowerShell, depois `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git`
- [ ] Ou baixar binário de https://github.com/supabase/cli/releases
- [x] Autenticar: `supabase login` (browser auth)
- [x] Testar: `supabase --version`

### C5. (Opcional) Bitwarden CLI
- [ ] Se quiser que o Claude leia credenciais do Bitwarden em vez de digitar
- [ ] Adiar — não bloqueia, é otimização de UX

---

## D. Credenciais — arquivo `.env.local`

Crie o arquivo `C:\HenriqueCentral\01_Pessoal\Projetos\pouso\.env.local` com o template abaixo. **Esse arquivo NÃO vai pro Git** (já está no .gitignore default do Next).

```env
# ─── Supabase ───
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# ─── Claude API ───
ANTHROPIC_API_KEY=sk-ant-...

# ─── OpenAI (Whisper voz) ───
OPENAI_API_KEY=sk-proj-...

# ─── Telegram bot (se A3 = Telegram) ───
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_ALLOWED_CHAT_ID=  # deixa vazio — o Claude descobre na 1ª mensagem que você mandar

# ─── WhatsApp Cloud (se A3 = WhatsApp) ───
# WHATSAPP_PHONE_NUMBER_ID=
# WHATSAPP_ACCESS_TOKEN=
# WHATSAPP_VERIFY_TOKEN=  # qualquer string aleatória, vai no webhook setup

# ─── Outros ───
NEXT_PUBLIC_APP_URL=http://localhost:3007   # em prod, vira https://pouso.henriquecentral.com
NODE_ENV=development
```

Você só preenche os campos das opções que escolheu em A. O Claude detecta o que está preenchido e usa.

---

## E. Dados de seed — vira ONBOARDING dentro da plataforma

**Decisão arquitetural:** em vez de pré-popular o DB com seed manual, a plataforma tem uma fase de **onboarding conversacional** no primeiro login. Perguntas guiadas que o usuário responde sobre sua vida (rotina, contextos, contas, custos fixos, hábitos) e o sistema gera o cadastro inicial automaticamente.

Isso destrava também a possibilidade futura de oferecer a plataforma pra outras pessoas — cada usuário passa pelo seu próprio onboarding.

**Implementação:** módulo `onboarding/` na Fase 1, com fluxo passo-a-passo. O Claude IA ajuda a categorizar respostas em texto livre ("Eu pago Netflix R$ 55 dia 10 e Spotify R$ 22 dia 5" → cria 2 custos fixos). 

---

## F. Configuração do Claude Code — autonomia

Pra eu rodar comandos sem você ter que aprovar cada um, adicionar as seguintes permissões no settings do Claude Code.

### Opção fácil (recomendada)
- [x] Rode `/fewer-permission-prompts` no Claude — ele analisa os transcripts e propõe a allowlist automaticamente
- [x] Confirme as adições

### Opção manual
Adicione ao `C:\HenriqueCentral\.claude\settings.json` (ou rode `/update-config`):

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm:*)",
      "Bash(npx:*)",
      "Bash(supabase:*)",
      "Bash(gh:*)",
      "Bash(vercel:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)",
      "Bash(git pull:*)",
      "Bash(git branch:*)",
      "Bash(git checkout:*)"
    ]
  }
}
```

Comandos destrutivos (`git reset --hard`, `rm -rf`, `supabase db reset`) **continuam** pedindo confirmação — isso é intencional.

---

## G. Quando você terminar

Quando todos os ✅ acima estiverem marcados e o `.env.local` + `SEED.md` estiverem preenchidos, me chame com:

> **"vamos pra fase 0 do pouso"**

Eu sigo automaticamente: criar repo GitHub, push inicial, schema base Supabase, migrations, auth, shell, layout, deploy Vercel, domínio. Sem te pedir nada — só notifico quando cada checkpoint passar.

---

## H. Resumo visual do que cada coisa destrava

| Bloco | Sem isso, eu... |
|---|---|
| A1 domínio | ...subo no `*.vercel.app` mas não configuro o domínio custom |
| A2 auth | ...não termino a página de login (preciso saber qual provider configurar) |
| A3 captura | ...não construo a integração de captura rápida na Fase 1 |
| B1 GitHub repo | ...não consigo fazer `git push` inicial (vai ficar local) |
| B2 Supabase | ...**não consigo fazer NADA da Fase 0 em diante** — é o item mais crítico |
| B3 Vercel | ...não consigo deployar (mas dá pra fazer só local até isso) |
| B4 Anthropic key | ...construo a UI da IA mas a IA não responde |
| B5 OpenAI key | ...captura de voz não funciona (mas é Fase 3) |
| B6/B7 bot | ...captura externa não funciona (mas é Fase 1) |
| C2-C4 CLIs | ...preciso te pedir pra rodar comandos no terminal manualmente |
| D `.env.local` | ...o app builda mas crasha no runtime quando tenta usar serviços |
| E `SEED.md` | ...gero seed genérico (você reorganiza depois) — não bloqueia, mas pior UX |
| F permissões | ...você aprova cada `pnpm install` no caminho — chato mas funciona |
