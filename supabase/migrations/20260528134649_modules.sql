-- ════════════════════════════════════════════════════════════════════
-- pouso. — Migration módulos (Fase 1)
-- Finanças (accounts, categories, fixed_costs, transactions,
-- reimbursements, weekly_budgets), Tarefas, Hábitos, Captures.
-- ════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────

create type public.account_kind as enum (
  'checking',
  'savings',
  'credit_card',
  'cash',
  'investment',
  'other'
);

create type public.category_kind as enum ('expense', 'income');

create type public.reimbursement_status as enum (
  'pending',
  'requested',
  'paid',
  'denied'
);

create type public.task_priority as enum ('p1', 'p2', 'p3', 'p4');
create type public.task_status as enum ('pending', 'completed', 'archived');

create type public.habit_frequency as enum (
  'daily',
  'weekdays',
  'weekends',
  'weekly',
  'custom'
);

create type public.capture_origin as enum (
  'web',
  'telegram',
  'whatsapp',
  'voice'
);

create type public.capture_status as enum (
  'pending',
  'processing',
  'processed',
  'discarded',
  'error'
);

create type public.capture_classification as enum (
  'expense',
  'income',
  'task',
  'habit_done',
  'note',
  'unknown'
);

-- ─────────────────────────────────────────────────────────────────
-- accounts (contas financeiras)
-- ─────────────────────────────────────────────────────────────────

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind public.account_kind not null,
  institution text,
  last_4 text,
  color text not null default '#9B958D',
  position int not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create index accounts_user_idx on public.accounts (user_id, is_archived, position);

create trigger accounts_set_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- categories (categorias de gasto/receita)
-- ─────────────────────────────────────────────────────────────────

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind public.category_kind not null,
  icon text,
  color text not null default '#9B958D',
  position int not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, kind, name)
);

create index categories_user_idx on public.categories (user_id, kind, is_archived, position);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- fixed_costs (assinaturas e recorrentes)
-- ─────────────────────────────────────────────────────────────────

create table public.fixed_costs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount_cents bigint not null check (amount_cents > 0),
  kind public.category_kind not null default 'expense',
  category_id uuid references public.categories(id) on delete set null,
  account_id uuid references public.accounts(id) on delete set null,
  context_id uuid references public.contexts(id) on delete set null,
  day_of_month int check (day_of_month between 1 and 31),
  start_date date not null default current_date,
  end_date date,
  is_paused boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index fixed_costs_user_idx on public.fixed_costs (user_id, is_paused, day_of_month);

create trigger fixed_costs_set_updated_at
  before update on public.fixed_costs
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- transactions (gastos e receitas)
-- ─────────────────────────────────────────────────────────────────

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  context_id uuid references public.contexts(id) on delete set null,
  fixed_cost_id uuid references public.fixed_costs(id) on delete set null,
  kind public.category_kind not null,
  amount_cents bigint not null check (amount_cents > 0),
  occurred_on date not null,
  description text,
  notes text,
  installment_current int check (installment_current > 0),
  installment_total int check (installment_total > 0),
  is_reimbursable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_user_occurred on public.transactions (user_id, occurred_on desc);
create index transactions_user_category on public.transactions (user_id, category_id, occurred_on desc);
create index transactions_user_kind on public.transactions (user_id, kind, occurred_on desc);

create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- reimbursements
-- ─────────────────────────────────────────────────────────────────

create table public.reimbursements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  status public.reimbursement_status not null default 'pending',
  description text,
  requested_at date,
  paid_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reimbursements_user_status on public.reimbursements (user_id, status);

create trigger reimbursements_set_updated_at
  before update on public.reimbursements
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- weekly_budgets (orçamento semanal global)
-- ─────────────────────────────────────────────────────────────────

create table public.weekly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  active_from date not null default current_date,
  active_to date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index weekly_budgets_user_active on public.weekly_budgets (user_id, active_from desc);

create trigger weekly_budgets_set_updated_at
  before update on public.weekly_budgets
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- tasks
-- ─────────────────────────────────────────────────────────────────

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context_id uuid references public.contexts(id) on delete set null,
  parent_task_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  description text,
  priority public.task_priority not null default 'p3',
  status public.task_status not null default 'pending',
  due_at timestamptz,
  completed_at timestamptz,
  recurrence_rule text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_user_status on public.tasks (user_id, status, due_at);
create index tasks_user_context on public.tasks (user_id, context_id, status);
create index tasks_user_due on public.tasks (user_id, due_at);

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- habit_definitions
-- ─────────────────────────────────────────────────────────────────

create table public.habit_definitions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  context_id uuid references public.contexts(id) on delete set null,
  frequency public.habit_frequency not null default 'daily',
  target_per_week int check (target_per_week between 1 and 14),
  preferred_time text,
  color text not null default '#7A8F75',
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index habit_definitions_user_idx on public.habit_definitions (user_id, is_archived);

create trigger habit_definitions_set_updated_at
  before update on public.habit_definitions
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- habit_logs (1 linha por dia feito)
-- ─────────────────────────────────────────────────────────────────

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habit_definitions(id) on delete cascade,
  done_on date not null,
  done_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now(),
  unique (habit_id, done_on)
);

create index habit_logs_user_date on public.habit_logs (user_id, done_on desc);

-- ─────────────────────────────────────────────────────────────────
-- captures (inbox bruto multi-canal)
-- ─────────────────────────────────────────────────────────────────

create table public.captures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  raw_text text,
  audio_url text,
  origin public.capture_origin not null,
  source_message_id text,
  status public.capture_status not null default 'pending',
  classified_type public.capture_classification,
  classified_at timestamptz,
  result_entity_id uuid,
  result_entity_kind text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index captures_user_status on public.captures (user_id, status, created_at desc);

create trigger captures_set_updated_at
  before update on public.captures
  for each row execute function public.set_updated_at();

-- ═════════════════════════════════════════════════════════════════
-- Row-Level Security — own data only
-- ═════════════════════════════════════════════════════════════════

alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.fixed_costs enable row level security;
alter table public.transactions enable row level security;
alter table public.reimbursements enable row level security;
alter table public.weekly_budgets enable row level security;
alter table public.tasks enable row level security;
alter table public.habit_definitions enable row level security;
alter table public.habit_logs enable row level security;
alter table public.captures enable row level security;

create policy "accounts_own_all" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "categories_own_all" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "fixed_costs_own_all" on public.fixed_costs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transactions_own_all" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reimbursements_own_all" on public.reimbursements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "weekly_budgets_own_all" on public.weekly_budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tasks_own_all" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "habit_definitions_own_all" on public.habit_definitions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "habit_logs_own_all" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "captures_own_all" on public.captures
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
