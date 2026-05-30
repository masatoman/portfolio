-- issue-finder: 「イシューからはじめよ」 (安宅和人) フレームに沿った 3 軸スコア追加
-- 既存 emotion_score / issue_score / solvability_score は量的指標として残す。
-- 本書「よいイシューの 3 条件」 (第1章 図1):
--   A) 本質的な選択肢である   = essential_choice  (0-50)
--   B) 深い仮説がある         = hypothesis_depth  (0-50)
--   C) 答えを出せる            = answerable        (0-100)
-- バリュー = issue_driven_value = (essential + hypothesis) × answerable / 100
-- tier は scoring.ts の classifyIssueDrivenTier() 出力

alter table public.if_issues
  add column if not exists essential_choice smallint
    check (essential_choice between 0 and 50),
  add column if not exists hypothesis_depth smallint
    check (hypothesis_depth between 0 and 50),
  add column if not exists answerable smallint
    check (answerable between 0 and 100),
  add column if not exists issue_driven_value smallint
    check (issue_driven_value between 0 and 100),
  add column if not exists issue_driven_tier text
    check (issue_driven_tier in ('value-zone', 'promising', 'needs-rework', 'dog-path'));

comment on column public.if_issues.essential_choice is
  '本書 A) 本質的選択肢度 (0-50): 解くと事業の方向性が変わるか';
comment on column public.if_issues.hypothesis_depth is
  '本書 B) 深い仮説度 (0-50): 常識を覆す洞察・新しい構造があるか';
comment on column public.if_issues.answerable is
  '本書 C) 答えを出せる度 (0-100): 今の masatoman の手で 6 ヶ月以内に解けるか';
comment on column public.if_issues.issue_driven_value is
  'バリュー = (essential + hypothesis) × answerable / 100';
comment on column public.if_issues.issue_driven_tier is
  'value-zone / promising / needs-rework / dog-path';

create index if not exists idx_if_issues_issue_driven_value
  on public.if_issues (issue_driven_value desc nulls last);
create index if not exists idx_if_issues_issue_driven_tier
  on public.if_issues (issue_driven_tier);
