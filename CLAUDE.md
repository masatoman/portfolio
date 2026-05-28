@../個人開発マネタイズプラットフォーム/STRATEGY.md

# portfolio (ihara-frontend.com) — 軸 B 工務店プロジェクト 主軸 repo

> **戦略の単一ソース**: 親 monorepo の `STRATEGY.md` を冒頭で自動 import。
> portfolio (本 repo) は **2026-05-11 軸 B 単独主軸化** の対象。

## このリポジトリの位置づけ

- **稼働**: 🟢 主戦場 (STRATEGY.md Appendix A)
- **ドメイン**: ihara-frontend.com (Vercel)
- **主顧客**: **2026-05-22 北原氏面談で確定** ([[kitahara-meeting-result-2026-05-22]]) = **30-40 代 アトツギ (2 代目 / 3 代目) + 展示会層 + やる気層 + 儲かってる層**。 旧仮説 (IT 弱者 60 代社長) は北原氏フィードバックで「避けるべき」 と判明 (= 「現状でいい層」 で動機ゼロ)。 5/23-25 で portfolio memory `customer-target.md` を v8.0 化予定
- **役割**: 軸 B 工務店プロジェクト (B2B キャッシュフロー、 **5/24 プラン B/C 切替済** = 6 経路並列ヒアリング → 主軸確定 11 月末 → MVP 投入 12-2 月 → スケール 3-6 月 → MRR 判定 2027-06-30)

## ⚠️ 2026-05-24 プラン A/B/C 切替 (友人キーパーソン長期不在判明)

旧プラン A (友人主軸 + 紹介芋蔓 1 件目起点) は **前提崩壊**。 詳細 [[friend-keyperson-dependency-risk-2026-05-23]]:

- **プラン C 主軸** (確定発動): 友人完全不在前提、 6 経路並列 (北原氏 / たましん / 建材屋 / 設計事務所 / 多摩商工会議所 / アトツギ甲子園)、 期間 5/23-9/30 (4 ヶ月)、 主軸確定 11 月末
- **プラン B 予備**: 5/24 友人 LINE 1 本 → 5/31 反応判定 → 反応なしでプラン C 自動切替、 反応あり後付け N=1 化 (7-8 月)
- **STRATEGY.md タイムライン**: MRR ¥30-60 万 判定 2027-04-30 → **2027-06-30 に 2 ヶ月後ろ倒し** (STRATEGY.md 本体は触らず、 本 memory + プラン C docs で記録)
- **docs**: `docs/v8.0/v8.0-plan-c-friend-absent-2026-05-23.html` (6p 主軸) + `docs/v8.0/v8.0-plan-b-friend-weak-2026-05-23.html` (4p 予備) + `docs/v8.0/v8.0-hearing-design-2026-05-23.html` (8p 内部設計、 P1 / P8 でプラン A/B/C 切替明示)

## このリポジトリで作業する時

1. **詳細戦略は STRATEGY.md (自動 import 済) を参照**。 ただし **5/23-24 のプラン B/C 切替 + MRR タイムライン 2 ヶ月後ろ倒し** は STRATEGY.md 未反映 (意図的、 memory で記録)
2. **portfolio 固有の決定・状態は memory に集約**: `~/.claude/projects/-Users-master-home-work-portfolio/memory/MEMORY.md` (40+ 件のインデックス)
3. **主要 memory** (どこから読み始めるか迷ったら):
   - **[[friend-keyperson-dependency-risk-2026-05-23]]** — 🔥 5/24 最新: プラン A/B/C 切替 + 6 経路並列 + MRR 2 ヶ月後ろ倒し
   - **[[next-session-handoff-2026-05-22]]** — 5/24 追記済、 5/24-31 アクション + プラン C 並走起動
   - `twin-axis-status.md` — 軸 B 単独主軸化 (2026-05-11)
   - `demo-gallery-status.md` — demo-gallery 投票ページ (2026-05-14 公開)
   - `business-form-roadmap.md` — 節税撤回 + 信用度ルート保留 (5/22 北原氏判断)
   - `friend-hearing-may-2026.md` — 友人 (現場監督) ヒアリング — ⚠️ プラン C 移行で「業界知識として温存、 N=1 カウントせず」 扱いに変更
   - `friend-hearing-result-2026-05-14.md` — 5/14 N=1 結果 (業界知識 5 件は引き続き活用)
   - `tokyo-startup-station-may-2026.md` — 5/22 北原氏面談 (プラン C で経路 #1 最高優先度)
   - `customer-target.md` — 主顧客像 (5/22 北原氏面談で「30-40 代 アトツギ + 展示会層」 確定、 v8.0 化引き継ぎ)
   - `feedback_no_x_announcement_target_outside.md` — X 告知 wontfix / LINE 拡散一次経路
   - `issue-finder-tool.md` — issue-finder v6 マルチプロファイル化
   - `saas-pricing.md` — 4 価格パターン (5/23 v8.0 で候補ごとレンジに展開)

## 主要構造

| 経路 | 役割 |
|---|---|
| `/` (warm editorial) | 工務店向けトップ |
| `/portfolio` (Y2K) | 開発者・SNS 流入向け |
| `/local-business/<slug>` | 8 B2B 実用デモ (estimate / call-memo / site-photo / voice-daily / receipt / drawing / client-progress / website-refresh) |
| `/local-business` | `/` に 308 redirect |
| `/lab/tools/issue-finder` | issue-finder ツール v6 (本番 middleware で 404、 SKILL/INTERNAL_KEY 経由のみ) |
| `/demo-gallery` | 投票ページ (2026-05-14 公開、 8 デモ需要計測) |
| `/demo-gallery/results` | 集計ページ (本番 middleware で 404、 ローカル + service_role で閲覧) |

## 行動原則 (この repo 限定)

- 軸 B 関連が最優先。 軸 A (masatoman.net) 話題は STRATEGY.md §3 を参照
- 主顧客は記事を読まない層 = SEO ではなく商談ペライチ + 直接訪問 + 中間業者経由が刺さる戦術
- **X 告知は wontfix、 集客は友人経由 LINE 拡散優先** (`feedback_no_x_announcement_target_outside.md`)
- AI を前面に出さない、 ポジは「ひとりで全部作れる職人」 (`ai-positioning.md`)
- 補助金訴求は控えめ、 GビズID プライム + IT 導入支援事業者登録完了後にガッツリ訴求へ昇格 (`subsidies-positioning.md`)

## ⚠️ 事業計画 / 戦略 docs 作成前 自己検証 8 ルール (2026-05-15 追加)

事業計画系 docs (business-plan / fast-track / scenario / action-plan / 訪問スクリプト 等) を **書く前に必ず** 以下 8 ルールを適用。 詳細は memory `feedback-claude-self-verification-rules.md`。

1. **固有名詞** (組織名 / 部署名 / 制度名) → WebFetch / WebSearch で公式確認 (例: 「たましん経営支援部」 ❌ → 「価値創造事業部」 ✅)
2. **日付 (曜日)** → Bash `date -j -f "%Y-%m-%d" "YYYY-MM-DD" "+%A"` で確認
3. **業界慣習** (信金接触 / 商習慣) → WebSearch で実例 1-2 件確認
4. **楽観プラン** (「いきなり電話 → 翌日訪問」) → 「実態的に可能か?」 自問 + ユーザー確認
5. **既存 memory / docs** も重要計画時は再確認 (引き継ぎ前提で書かない)
6. **準備物 / 持参物** → 「アポ確定後 1-2 日前」 を必ず明示
7. **ユーザー個人情報** (時間 / 物理 / 心境制約) → 推測せず明示確認
8. **数字** (CVR / 接触数 / MRR) → 「仮説」 ラベル + 一次情報源を併記

**適用判定キーワード**: 組織名 / 制度名 / 補助金名 / 日付 + 曜日 / 「○件接触」「○件商談」 / 「電話 → アポ」 / 「準備物」 / ユーザー時間配分

**失敗の許容**: ユーザー個人情報・一次情報の見落としは許される。 固有名詞・日付・業界慣習・順序思考の見落としは許されない (= Bash / WebSearch で防げる)。

masatoman さん側からの「裏取りチェック」 質問: 「これって裏取りした?」「公式情報源は?」「○○って実在する?」「曜日確認した?」「アポ確定後に準備するもの?」

## 5/22 北原氏面談用 docs

- `docs/business/business-summary-2026-05-22.html` — 事業計画サマリ **v5.1** (FAX/郵送/電話 主軸 + 競合 5 社 公式裏取り + 3 プラン制 ¥5K-50K)
- `docs/meeting/consultation-questions-2026-05-22.html` — 質問リスト **v5 内部版** (想定外 8 パターン + 8/22 中間報告アポ)
- `docs/meeting/consultation-questions-2026-05-22-public.html` — 質問リスト **v5.1 public 版** (北原氏共有用)
- `docs/meeting/kitahara-meeting-2026-05-22.html` — プレゼン資料 **v5.1** (7 slides、 当日 Zoom 画面共有)
- `docs/meeting/friend-hearing-checklist.html` — 友人ヒアリング 25 問チェックリスト (グループ F で demo-gallery 評価 + LINE 拡散依頼) — ⚠️ プラン C 移行で使用機会後ろ倒し

## 5/23 v8.0 ヒアリング設計 docs + 5/24 プラン B/C docs

- `docs/v8.0/v8.0-hearing-design-2026-05-23.html` — **v8.0 ヒアリング 内部設計 (8p、 内部秘)** = 打診先 + 15→6 写像 + Phase + AND 3 必須シグナル + 候補ごと価格レンジ + 撤退軸 3 軸 + プラン A/B/C 切替明示
- `docs/v8.0/v8.0-hearing-resource-2026-05-23.html` — **v8.0 ヒアリング資料 (A4 8p、 相手に渡す)** = プラン A/B/C 共通利用
- `docs/v8.0/v8.0-product-candidates-evaluation-2026-05-23.html` — **v8.0 商品候補 33p 評価マトリクス (内部秘)** = 15 候補 × 16 観点 + 推奨順位 + v8.0 化アクション
- `docs/v8.0/v8.0-plan-c-friend-absent-2026-05-23.html` — 🔥 **プラン C 主軸 (6p)** = 友人完全不在前提、 6 経路並列、 期間 5/23-9/30、 主軸確定 11 月末
- `docs/v8.0/v8.0-plan-b-friend-weak-2026-05-23.html` — **プラン B 予備 (4p)** = 5/24 LINE 1 本 + 5/31 反応判定 + プラン C 自動切替
- `docs/operations/japan-build-tokyo-2026-todo-2026-05-23.html` — JAPAN BUILD TOKYO 12/2-4 出展 TODO (助成金応募 第 5 回 8/1-14 or 第 6 回 9/1-14)
- `docs/index.html` — 📂 docs/ 全 42 件 一覧ハブ (日付 / カテゴリ 7 種 / キーワード フィルタ付き、 rebuild script `node scripts/rebuild-docs-index.mjs`)

## 5/24 アクション (最優先)

- **5/24 (土) 朝-昼**: 友人 LINE 1 本送付 (文面は `docs/v8.0/v8.0-plan-b-friend-weak-2026-05-23.html` P2)
- **5/24-26**: 北原氏メール下書き + 送付 (中間報告アポ 8/22 → 6/22-7/22 前倒し依頼)
- **5/24-30**: 並走で裏取り 3 件 (業界統計 / 6 候補事例 / demo-gallery アトツギ向け文体調整)
- **5/27-29**: たましん既取引渉外担当者にメール (Step 1)
- **5/31 23:59**: プラン A/B/C 分岐判定 → 反応なしでプラン C 確定発動

## 関連リポジトリ

- `~/home_work/個人開発マネタイズプラットフォーム/` (軸 A モノレポ、 STRATEGY.md の本拠地)
- `~/.claude/projects/-Users-master-home-work-portfolio/` (本 repo の memory + transcript)
