-- demo_votes 拡張 (継続接触 + 「全部いらない」 選択式)
-- 他 AI フィードバック (ChatGPT / Gemini / Claude) の共通指摘 4 点中 2 点に対応:
--   1. 継続接触の導線が無い → contact_interest + contact_value 追加
--   2. 「全部いらない」 が自由入力では機能しない → reject_reasons 追加 + 制約緩和

alter table public.demo_votes
  add column if not exists contact_interest text[] not null default '{}',
  add column if not exists contact_value text,
  add column if not exists reject_reasons text[] not null default '{}';

-- selected_demos の旧 CHECK (1-3 件必須) を緩和:
-- 投票 1 件以上 OR 拒否理由 1 件以上 のどちらかがあれば送信 OK
alter table public.demo_votes
  drop constraint if exists demo_votes_selected_demos_check;

alter table public.demo_votes
  add constraint demo_votes_selection_or_reject check (
    array_length(selected_demos, 1) between 1 and 3
    or array_length(reject_reasons, 1) >= 1
  );
