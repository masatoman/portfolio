@../個人開発マネタイズプラットフォーム/STRATEGY.md

# portfolio (ihara-frontend.com) — 軸 B 工務店プロジェクト 主軸 repo

> **戦略の単一ソース**: 親 monorepo の `STRATEGY.md` を冒頭で自動 import。
> portfolio (本 repo) は **2026-05-11 軸 B 単独主軸化** の対象。

## このリポジトリの位置づけ

- **稼働**: 🟢 主戦場 (STRATEGY.md Appendix A)
- **ドメイン**: ihara-frontend.com (Vercel)
- **主顧客**: IT に弱い小規模事業オーナー / 工務店現場監督 (40-60 代、 LINE はできるが Web 入力は苦手)
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

## 5/22 北原氏面談用 docs

- `docs/business-summary-2026-05-22.html` — 事業計画サマリ v2 (02-c に demo-gallery セクション、 §8 法人化 2 ルート分離)
- `docs/consultation-questions-2026-05-22.html` — 質問リスト v2 (Q0-c で demo-gallery 評価 + 紹介依頼前フリ)
- `docs/friend-hearing-checklist.html` — 友人ヒアリング 25 問チェックリスト (グループ F で demo-gallery 評価 + LINE 拡散依頼)

## 関連リポジトリ

- `~/home_work/個人開発マネタイズプラットフォーム/` (軸 A モノレポ、 STRATEGY.md の本拠地)
- `~/.claude/projects/-Users-master-home-work-portfolio/` (本 repo の memory + transcript)
