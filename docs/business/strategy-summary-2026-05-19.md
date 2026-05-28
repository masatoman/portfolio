---
generated: 2026-05-19 JST
purpose: claude.ai web のプロジェクトメモリ / 会話に貼り付け用 (5/19 セッション差分のみ)
companion: claude-ai-snapshot.md (全体 snapshot、 別ファイル)
session: 7662cd98-0bb0-4f91-a507-533b791b1cf6
---

# 2026-05-19 戦略更新サマリ

5/18-19 セッションで確定した戦略 5 件 + 撤回 1 件 + 次のアクション。 claude.ai 既存メモリに「追記」 する形で取り込む想定。 詳細は portfolio memory 参照。

---

## 1. 軸 A masatoman.net = 案件獲得ポートフォリオ化 (新主軸)

**5/19 夕 確定 (B 案)**。 軸 A の存在意義を「個人開発者向け SEO ストック」 から「masatoman 本人のスキル証明場 + 案件獲得入口」 に転換。

### ターゲット (新)
- 採用担当 / 技術面接官 / 外注エージェント
- 案件発注者 (中小企業の DX 責任者 / スタートアップ CTO 等)
- AI 開発できるフロントエンジニアを探している層
- 「Claude / Cursor / Next.js / Supabase / Stripe」 の名前を知っている **中-上級 IT 業界人**

### 構成 (B 案 ハイブリッド)

```
masatoman.net/
├── /         ← ポートフォリオ TOP (Hero + 実績 3-5 件 + 連絡先)
├── /works    ← 作品ページ (Claude Code ツール / SaaS / 業務効率化)
├── /about    ← 経歴 (フロント X 年 + AI 開発 X ヶ月 + 実績)
├── /contact  ← 案件問い合わせフォーム
└── /blog/    ← 既存 80 記事 + 新規記事 (技術力証明系)
```

### 既存資産の役割変更
- 既存 80 記事 → そのまま `/blog/` に整理 (削除しない)。 採用担当の眼に「Cursor 料金記事 = 最新 AI 当事者意識」「Claude Code MCP = 先端ツール実装経験」 等として作用
- routine 群 (night-writer / weekly-auto-article / tuesday-watchdog / zero-to-one-diary) → prompt 修正で **採用担当向け技術記事生成** にシフト
- Stripe 月額サブスク → 一旦停止検討 (案件発注者は購読しない)
- 有料記事 ¥1,000 × 2 本 → 残す (スキル証明)

### KPI 変更 (7/30 判定)
- 新: 案件問い合わせ数 / 採用案件成約数
- 副次: CVR / 売上 / Lab Free 登録 (旧 KPI)

詳細 memory: `axis-a-portfolio-pivot-2026-05-19.md`

---

## 2. 軸 B 工務店 SaaS マーケ戦略大改造

**5/18 別 claude.ai セッション原案 → 5/19 修正版** (matrix-routing 系の 6 不整合修正済)。 新ドメインで SaaS LP + コンテンツマーケのフル構成。

### 新ドメインで運用 (masatoman.net には混ぜない)
- ブランド命名先決 (5/23-25 週末)
- Astro + Markdown 静的サイト (パフォーマンス + SEO 優先)
- IT 導入補助金 **通常枠 1/2** 対象 (1/8 訴求は廃止、 §5 参照)

### 集客チャネル
- note + YouTube + X + SEO ブログ
- ターゲット = アトツギ (30-40 代 IT 強) + 中間業者 (建材屋 / 設計事務所 / 信金経営支援部)
- 工務店オーナー (60 代 IT 弱) は直接リーチ不可、 紹介経路で接触

詳細 memory: `komuten-saas-strategy-overhaul-2026-05-19.md`

---

## 3. 工務店メディア戦略 = 別ドメイン (B 案)

**5/18 別 claude.ai セッション原案 → 5/19 修正済**。

### 採用された方針 (B 案)
- masatoman.net には混ぜない (採用担当向けと工務店向けで読者がずれる、 SEO/UX 罠)
- 工務店メディアは別ドメインで立ち上げ
- masatoman.net は軸 A 案件獲得ポートフォリオ化で並走

### 最初の 3 本記事
- 補助金記事は **「IT 補助金 通常枠 1/2 ガイド + 1/8 廃止解説」** (旧「補助金 1/8 術」 は廃止)
- 痛みクラスタ解説 (issue-finder 235 件 + レビュー 794 件 / 7 クラスタ)
- 工務店 3 層意思決定モデル (社長 / 妻 / アトツギ)

### 軸 B SaaS マーケとの関係
- 軸 B SaaS マーケと **統合運用 or 別運用は 5/22 後判断** (関連メディアを統合した方がドメインオーソリティ稼ぎやすい vs 役割明確化で別運用)

詳細 memory: `komuten-media-strategy-2026-05-18.md`

---

## 4. Cowork → routine 一括移行は 7/30 軸 A 判定後に保留

**5/19 確定**。 Cowork 6 件を routine 5 件 + Cowork 1 件に再編する移行プラン (`docs/cowork-to-routine-migration-plan-2026-05-18.html`) は **設計完了 + 実装保留**。

### 保留の根拠
- 軸 A 実数字: PV 47 → 506 (+977%、 SEO 正常軌道) / CVR 0% / 累計売上 ¥0 / β DM 5/5 名無反応
- 7/30 で「縮退」 判定なら移行作業は完全に無駄 (Cowork 停止のみで OK)
- 7/30 で「再強化」 判定なら 2-3 時間で routine 化可能
- 5/22 北原氏面談で軸 B 方向確定が先、 軸 A 触る前に軸 B 集中

### Phase 0 最小整備のみ実施
- ✅ 6/4 「外部媒体流入実験 28 日判定」 Calendar 削除
- ✅ 5/19 13:30 「tuesday-watchdog 初回確認」 Calendar 追加
- ⏸ `nta-app-id-reminder` routine 削除 (masatoman 手動、 claude.ai/code/routines から)
- ⏸ Aff writer `_shared/` 3 ファイル補完 (オプション、 5/22 後)

詳細 memory: `cowork-routine-deferred-2026-05-19.md` / `affiliate-crew-status.md` (ai-crew.site の存在も同 memory で初記録)

---

## 5. 補助金 1/8 訴求 完全廃止

**5/17 確定 + 5/19 派生 4 件整理完了**。 制度面 3 段 + 実需面 4 段 の 2 層完全崩壊。

### 制度面 (1/8 不成立の根拠)
1. デジタル化基盤類型廃止
2. インボイス機能限定
3. 都 DX 助成金との同時申請 NG (公社直電で確認、 質問内容変更)

### 実需面 (主顧客像が想定外)
1. 工務店の個人客 9 割
2. メール使えないオーナー 3 割
3. IT インフラ古い
4. ANDPAD すら使えない

### 新訴求
- IT 導入補助金 **通常枠 1/2**
- ただし実需壁で「そもそも商談に至らない」 可能性大 → 主顧客像 [[customer-target]] 再定義必要

詳細 memory: `subsidy-pitch-deprecated-2026-05-17.md`

---

## ⚠️ 撤回された方針: Kimura → 初心者ピボット

**5/19 昼決定 → 同日夕に撤回**。 軸 A 主顧客を「ChatGPT しか触ったことない、 Claude Code 知らない IT 弱者個人開発者」 に変更する案だったが、 同日夕に「案件獲得ポートフォリオ化」 (採用担当 = 中-上級者) へ再ピボットしたため真逆方向に変更。

memory `axis-a-target-pivot-from-kimura-to-beginner-2026-05-19.md` に ⚠️ 撤回マーカー追加済。 経緯記録として保持、 戦略採用しない。

---

## 次のアクション

### 5/22 北原氏面談 (TOKYO 創業ステーション オンライン、 軸 B 最大イベント) で決めること
- Q1: 工務店オーナーから見て個人事業主が信用度で不利か → 合同会社設立要否 (節税抜き、 6-7 月予定)
- Q2: demo-gallery iPad ライブ評価 (拒否理由分布 / 連絡先取得率 / 役職別傾向)
- Q3: IT 導入支援事業者コンソーシアム参画 + 認定支援機関税理士紹介
- Q4: 工務店紹介 + アトツギ世代窓口化の可能性

### 5/23-25 週末セットアップ
- ⏳ masatoman.net ポートフォリオ TOP / Works / About / Contact 構築
- ⏳ 工務店 SaaS マーケ新ドメイン取得 + Astro セットアップ + ブランド命名
- ⏳ 工務店メディア統合 vs 別運用判断 + 着手
- ⏳ routine 群 prompt 修正 (採用担当向け技術記事生成にシフト)

### 7/30 軸 A 3 ヶ月後判定
- 案件問い合わせ数 / 採用案件成約数 (新 KPI) + 量質トレードオフ実証データ
- 結果次第で Cowork → routine 移行 (TaskList #2-4) を実行 or Cowork 停止のみ

---

## このセッション後の作業

- ⏳ 5/22 後 STRATEGY.md 更新 (軸 A 案件獲得ポートフォリオ化 / 工務店メディア別ドメイン / 軸 B SaaS マーケ / Affiliate Crew 追記)
- ⏳ 5/22 後 portfolio CLAUDE.md memory リスト更新 (新規 6 件)
- ⏳ 5/22 後 masatoman 手動: ブラウザ版 Claude メモリに 5/19 変更を反映 ← **本ファイルの用途**

---

## 関連ファイル

### 重要 memory (5/19 確定分)
- `axis-a-portfolio-pivot-2026-05-19.md` — 新主軸、 案件獲得ポートフォリオ化
- `komuten-saas-strategy-overhaul-2026-05-19.md` — 軸 B SaaS マーケ大改造
- `komuten-media-strategy-2026-05-18.md` — 工務店メディア (5/19 修正反映)
- `cowork-routine-deferred-2026-05-19.md` — Cowork → routine 移行保留
- `affiliate-crew-status.md` — Affiliate Crew (ai-crew.site) 初記録
- `strategy-files-inconsistency-2026-05-19.md` — 5/18 戦略ファイル矛盾 3 件 (5/19 全解決済)
- `axis-a-target-pivot-from-kimura-to-beginner-2026-05-19.md` — ⚠️ 撤回済 (経緯記録)
- `subsidy-pitch-deprecated-2026-05-17.md` — 補助金 1/8 廃止 (5/17)
- `komuten-bpaas-ai-agent-strategy-2026-05-18.md` — BPaaS / AI エージェント戦略

### 関連 docs
- `~/.claude/plans/masatoman-net-saas-sequential-pelican.md` — 5/19 plan (4 フェーズ、 7/30 判定までのロードマップ)
- `~/home_work/portfolio/docs/integrated-cleanup-2026-05-18.html` — 3 経路統合棚卸し (routine + Cowork + Calendar)
- `~/home_work/portfolio/docs/cowork-to-routine-migration-plan-2026-05-18.html` — 移行プラン (7/30 後に実行判断)
- `~/home_work/portfolio/docs/routines-overview-2026-05-18.html` — 9 routine 詳細
- `~/home_work/portfolio/docs/calendar-cleanup-2026-05-18.html` — Calendar 58 件棚卸し
