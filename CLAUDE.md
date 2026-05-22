@../個人開発マネタイズプラットフォーム/STRATEGY.md

# portfolio (ihara-frontend.com) — 軸 B 工務店プロジェクト 主軸 repo

> **戦略の単一ソース**: 親 monorepo の `STRATEGY.md` を冒頭で自動 import。
> portfolio (本 repo) は **2026-05-11 軸 B 単独主軸化** の対象。

## このリポジトリの位置づけ

- **稼働**: 🟢 主戦場 (STRATEGY.md Appendix A)
- **ドメイン**: ihara-frontend.com (Vercel)
- **主顧客**: **2026-05-22 北原氏面談で確定** ([[kitahara-meeting-result-2026-05-22]]) = **30-40 代 アトツギ (2 代目 / 3 代目) + 展示会層 + やる気層 + 儲かってる層**。 旧仮説 (IT 弱者 60 代社長) は北原氏フィードバックで「避けるべき」 と判明 (= 「現状でいい層」 で動機ゼロ)。 5/23-25 で portfolio memory `customer-target.md` を v8.0 化予定
- **役割**: 軸 B 工務店プロジェクト (B2B キャッシュフロー、 5月中-6月前半 友人ヒアリング → SaaS 化 → 6 末 商談 → 7 末 月次売上ライン)

## このリポジトリで作業する時

1. **詳細戦略は STRATEGY.md (自動 import 済) を参照**
2. **portfolio 固有の決定・状態は memory に集約**: `~/.claude/projects/-Users-master-home-work-portfolio/memory/MEMORY.md` (23+ 件のインデックス)
3. **主要 memory** (どこから読み始めるか迷ったら):
   - `twin-axis-status.md` — 軸 B 単独主軸化 (2026-05-11)
   - `demo-gallery-status.md` — demo-gallery 投票ページ (2026-05-14 公開)
   - `business-form-roadmap.md` — 節税撤回 + 信用度ルート保留 (5/22 北原氏判断)
   - `friend-hearing-may-2026.md` — 友人 (現場監督) ヒアリング (25 問 6 グループ)
   - `tokyo-startup-station-may-2026.md` — 5/22 北原氏面談
   - `customer-target.md` — 主顧客像 (IT 弱者)
   - `feedback_no_x_announcement_target_outside.md` — X 告知 wontfix / LINE 拡散一次経路
   - `issue-finder-tool.md` — issue-finder v6 マルチプロファイル化
   - `saas-pricing.md` — 4 価格パターン

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

- `docs/business-summary-2026-05-22.html` — 事業計画サマリ **v5.1** (FAX/郵送/電話 主軸 + 競合 5 社 公式裏取り + 3 プラン制 ¥5K-50K)
- `docs/consultation-questions-2026-05-22.html` — 質問リスト **v5 内部版** (想定外 8 パターン + 8/22 中間報告アポ)
- `docs/consultation-questions-2026-05-22-public.html` — 質問リスト **v5.1 public 版** (北原氏共有用)
- `docs/kitahara-meeting-2026-05-22.html` — プレゼン資料 **v5.1** (7 slides、 当日 Zoom 画面共有)
- `docs/friend-hearing-checklist.html` — 友人ヒアリング 25 問チェックリスト (グループ F で demo-gallery 評価 + LINE 拡散依頼)

## 関連リポジトリ

- `~/home_work/個人開発マネタイズプラットフォーム/` (軸 A モノレポ、 STRATEGY.md の本拠地)
- `~/.claude/projects/-Users-master-home-work-portfolio/` (本 repo の memory + transcript)
