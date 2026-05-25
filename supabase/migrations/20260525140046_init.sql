-- ════════════════════════════════════════════════════════════════════
-- pouso. — Migration inicial (Fase 0)
-- Schema fundacional: profiles + contexts + triggers + RLS
-- ════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────
-- profiles
-- 1 linha por usuário autenticado. Auto-criado por trigger no signup.
-- ─────────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  telegram_chat_id bigint,
  timezone text not null default 'America/Sao_Paulo',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil estendido do usuário. 1:1 com auth.users.';
comment on column public.profiles.telegram_chat_id is 'chat_id do Telegram autorizado a usar o bot (capturado na primeira mensagem).';
comment on column public.profiles.onboarding_completed is 'Se o usuário já passou pelo onboarding inicial (categorias, contextos, custos fixos).';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- contexts
-- Tags de contexto (nexen, hashtag, pessoal, etc). Atravessam módulos.
-- ─────────────────────────────────────────────────────────────────

create table public.contexts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  label text not null,
  color text not null default '#9B958D',
  icon text,
  position int not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

comment on table public.contexts is 'Tags de contexto cross-módulo (nexen, hashtag, pessoal, etc).';
comment on column public.contexts.slug is 'Identificador sem #, em kebab-case. Ex: "nexen", "bem-dita-torta".';
comment on column public.contexts.color is 'Hex da cor de exibição. Padrão: areia.';

create index contexts_user_position_idx on public.contexts (user_id, position);
create index contexts_user_archived_idx on public.contexts (user_id, is_archived);

create trigger contexts_set_updated_at
  before update on public.contexts
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- Trigger: autocriar profile quando user signa
-- ─────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────
-- Row-Level Security
-- Single-user por enquanto, mas habilitado por boa prática.
-- ─────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.contexts enable row level security;

create policy "profiles_own_select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_own_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "contexts_own_all"
  on public.contexts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
