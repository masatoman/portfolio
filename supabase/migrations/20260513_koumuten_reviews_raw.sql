-- 工務店 Google マップ レビュー Raw ストア (Layer 1)
-- 設計ブリーフ v2: docs/design-brief-2026-05-13-koumuten-reviews-integration.html
-- 個別レビューを 1 行 = 1 レコードで蓄積。 不変・追記のみ。
-- KOBO プロジェクト (amtwwscvhwkfdrqimgqm) に相乗り。
-- issue-finder の if_touch_updated_at() 関数を流用 (20260510_issue_finder.sql で定義済).

create table if not exists public.koumuten_reviews_raw (
  id uuid primary key default gen_random_uuid(),

  -- 店舗情報 (取得時点のスナップショット)
  place_id text not null,
  place_name text,
  place_area text,
  place_rating numeric,
  place_user_rating_count int,
  place_address text,
  place_google_maps_uri text,
  place_website_uri text,

  -- レビュー本体
  review_rating smallint check (review_rating between 1 and 5),
  review_text text,
  review_original_text text,
  review_author_name text,
  review_publish_time timestamptz,
  review_relative_time text,

  -- 取得管理
  collected_at timestamptz not null default now(),
  collected_run_id uuid not null,

  -- Layer 2 クラスタリング状態 (NULL = 未処理)
  processed_in_cluster_job_id uuid references public.if_jobs(id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- 重複防止: 同一店舗の同一投稿時刻は同じレビュー
  constraint koumuten_reviews_raw_unique unique (place_id, review_publish_time)
);

-- インデックス
create index if not exists koumuten_reviews_raw_area_idx on public.koumuten_reviews_raw (place_area);
create index if not exists koumuten_reviews_raw_rating_idx on public.koumuten_reviews_raw (review_rating);
create index if not exists koumuten_reviews_raw_publish_time_idx on public.koumuten_reviews_raw (review_publish_time desc);
create index if not exists koumuten_reviews_raw_run_id_idx on public.koumuten_reviews_raw (collected_run_id);
create index if not exists koumuten_reviews_raw_place_id_idx on public.koumuten_reviews_raw (place_id);
create index if not exists koumuten_reviews_raw_unprocessed_idx
  on public.koumuten_reviews_raw (processed_in_cluster_job_id)
  where processed_in_cluster_job_id is null;

-- updated_at 自動更新 (issue-finder と関数共用)
drop trigger if exists trg_koumuten_reviews_raw_updated_at on public.koumuten_reviews_raw;
create trigger trg_koumuten_reviews_raw_updated_at
  before update on public.koumuten_reviews_raw
  for each row execute function public.if_touch_updated_at();

-- RLS: anon SELECT のみ、 INSERT/UPDATE は service_role 必須
alter table public.koumuten_reviews_raw enable row level security;

drop policy if exists "koumuten_reviews_raw anon read" on public.koumuten_reviews_raw;
create policy "koumuten_reviews_raw anon read" on public.koumuten_reviews_raw
  for select using (true);

-- INSERT/UPDATE/DELETE policy は意図的に作らない (service_role でのみ書き込み)
