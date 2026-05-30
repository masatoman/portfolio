-- issue-finder: ChatGPT 等の gap 分析結果から推薦された未登録 role を
-- queries.json を編集せずに if_jobs にキュー登録できるようにする ad-hoc モード追加。
--
-- 既存の profile_id / role は queries.json 内の固定 perspective を指すが、
-- is_adhoc=true の場合は queries.json lookup を skip し、 SKILL は custom_* を
-- 直接使って web_search する。
--
-- ChatGPT が「komuten / アトツギ向け FAX 営業」 のような新規切り口を推薦しても、
-- queries.json を編集せずにキュー登録できる。

alter table public.if_jobs
  add column if not exists is_adhoc boolean not null default false,
  add column if not exists custom_role text,
  add column if not exists custom_keywords text[] not null default '{}',
  add column if not exists custom_watched_tools text[] not null default '{}',
  add column if not exists custom_example_phrases text[] not null default '{}';

comment on column public.if_jobs.is_adhoc is
  'true なら queries.json lookup を skip し、 custom_* を SKILL に渡す';
comment on column public.if_jobs.custom_role is
  'ad-hoc 時の自由記入 role';
comment on column public.if_jobs.custom_keywords is
  'ad-hoc 時の入り口キーワード (ChatGPT 推薦をそのまま貼る想定)';
comment on column public.if_jobs.custom_watched_tools is
  'ad-hoc 時の監視ツール (オプション)';
comment on column public.if_jobs.custom_example_phrases is
  'ad-hoc 時の検出したい口語フレーズ (オプション)';
