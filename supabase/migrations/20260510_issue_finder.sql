-- issue-finder MVP (v6 / SKILL + queue 方式)
-- ブラウザフォームから if_jobs に登録 → Claude Code SKILL が処理 → if_issues に格納
-- KOBO プロジェクト (amtwwscvhwkfdrqimgqm) に相乗り。
-- 既存テーブルとの衝突回避のため、 名前は全て `if_` (issue-finder) prefix.
--
-- masatoman 個人ツール想定。 認証は導入せず、 anon は SELECT のみ可、 INSERT/UPDATE は service_role 必須。
-- portfolio は本番 (Vercel production) では middleware でツールごとブロック (本番公開しない).

-- ─────────────────────────────────────────
-- if_jobs: ブラウザフォームから登録される収集ジョブ
-- ─────────────────────────────────────────
create table if not exists public.if_jobs (
  id uuid primary key default gen_random_uuid(),

  profile_id text not null,
  role text not null,
  sampling_target int not null default 100 check (sampling_target between 20 and 500),
  extra_notes text,

  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),

  started_at timestamptz,
  finished_at timestamptz,
  issues_created int default 0,
  error_message text,
  summary jsonb,

  -- Deep Research 等の外部 LLM 出力を貼ったジョブはここに本文が入る.
  -- SKILL は NOT NULL の場合 web_search を skip し、 このテキストを直接クラスタリング.
  raw_input_text text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- if_issues: 抽出されたクラスタ
-- ─────────────────────────────────────────
create table if not exists public.if_issues (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  pain_summary text not null,
  episode text,

  emotion_score smallint not null default 50 check (emotion_score between 0 and 100),
  issue_score smallint not null default 50 check (issue_score between 0 and 100),
  solvability_score smallint not null default 50 check (solvability_score between 0 and 100),
  score_reason text,

  subsidy_tags text[] not null default '{}',
  industry_tags text[] not null default '{}',

  source_url text,
  source_excerpt text,
  source_type text,

  -- クラスタリング情報
  cluster_size int,
  sampling_total int,
  related_quotes jsonb not null default '[]',

  -- 起源情報 (どの perspective が生んだか)
  profile_id text,
  role text,
  job_id uuid references public.if_jobs(id) on delete set null,
  run_date date default current_date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists if_issues_run_date_idx on public.if_issues (run_date desc);
create index if not exists if_issues_profile_role_idx on public.if_issues (profile_id, role);
create index if not exists if_issues_subsidy_tags_idx on public.if_issues using gin (subsidy_tags);
create index if not exists if_issues_issue_score_idx on public.if_issues (issue_score desc);

create index if not exists if_jobs_status_idx on public.if_jobs (status, created_at);
create index if not exists if_jobs_created_at_idx on public.if_jobs (created_at desc);

-- ─────────────────────────────────────────
-- updated_at 自動更新トリガ (issue-finder 専用関数で既存 touch_updated_at と衝突回避)
-- ─────────────────────────────────────────
create or replace function public.if_touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_if_issues_updated_at on public.if_issues;
create trigger trg_if_issues_updated_at
  before update on public.if_issues
  for each row execute function public.if_touch_updated_at();

drop trigger if exists trg_if_jobs_updated_at on public.if_jobs;
create trigger trg_if_jobs_updated_at
  before update on public.if_jobs
  for each row execute function public.if_touch_updated_at();

-- ─────────────────────────────────────────
-- RLS: anon は SELECT のみ、 INSERT/UPDATE は service_role が必要
-- ─────────────────────────────────────────
alter table public.if_issues enable row level security;
alter table public.if_jobs enable row level security;

drop policy if exists "if_issues anon read" on public.if_issues;
create policy "if_issues anon read" on public.if_issues
  for select using (true);

drop policy if exists "if_jobs anon read" on public.if_jobs;
create policy "if_jobs anon read" on public.if_jobs
  for select using (true);

-- INSERT/UPDATE/DELETE policy は意図的に作らない (service_role でのみ書き込み)
-- portfolio の API Route が service_role key で書き込む形
