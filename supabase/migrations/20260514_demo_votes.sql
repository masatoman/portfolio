-- demo-gallery 投票テーブル
-- 工務店現場監督・オーナー等から「実装してほしいデモ」 の投票を受け付ける
-- 上限 3 つ、 名前 + 役職必須、 コメント任意

create table if not exists public.demo_votes (
  id uuid primary key default gen_random_uuid(),

  voter_name text not null,
  voter_role text not null,
  selected_demos text[] not null check (array_length(selected_demos, 1) between 1 and 3),
  comment text,

  ip_address text,
  user_agent text,

  created_at timestamptz not null default now()
);

create index if not exists demo_votes_created_at_idx on public.demo_votes (created_at desc);
create index if not exists demo_votes_selected_demos_idx on public.demo_votes using gin (selected_demos);

-- RLS: anon は INSERT のみ可、 SELECT は service_role のみ (集計ページは server-side で読む)
alter table public.demo_votes enable row level security;

drop policy if exists "demo_votes anon insert" on public.demo_votes;
create policy "demo_votes anon insert" on public.demo_votes
  for insert with check (true);

-- SELECT policy は意図的に作らない (service_role でのみ読み取り可能、 = 集計ページは server-side で SUPABASE_SERVICE_ROLE_KEY 使用)
