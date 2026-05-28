# Claude Design 用 デザインプロンプト テンプレ (2026-05-24)

> **使い方**: 本 template を見て、 各デモ別の `docs/design-prompts/<slug>-2026-05-24.md` を 1 枚ずつ Claude (claude.ai Design 用 or 別 AI) にコピペで投げる。 出力された「見た目案」 を masatoman が選定 → Claude Code が実装に落とす。

---

## 設計思想 (なぜ template を挟むか)

- **見た目は claude.ai (or 別 AI) に集中させ、 Claude Code は実装に集中** — 役割分担で時間効率
- **5/23 v8.0 化 (アトツギ × 儲かってる層) + 5/24 プラン B/C 切替 を反映** — 主顧客モード / アトツギモード の使い分け明示
- **「ざっくり指示」 を構造化** — `design-brief-template.md` (12 項目) を圧縮、 ビジュアル方向性に最適化
- **portfolio から呼べる subagent (aidesigner) は masatoman.net 配下** — portfolio repo からは直接呼べないので、 別セッションで投げる前提

---

## プロンプト共通テンプレ (各デモ用 .md で展開)

```markdown
# {{デモ名}} デザイン提案 依頼 (2026-05-24)

## 0. 出力に期待するもの (Claude Design への指示)

下記 1-10 を踏まえて、 **以下 3 種をすべて出力**してください:

1. **デザインの方向性** (200-300 字、 色 / 書体 / ムード / レイアウト指針)
2. **主要画面のビジュアル提案** (3 案、 各案について Hero / メインコンテンツ / CTA を文章で説明 + 配色コード + 主要コンポーネント名)
3. **Tailwind JSX サンプル 1 案** (Hero + メインインタラクション 1 ブロックのみ、 80-150 行、 実装は別途 Claude Code が引き継ぐ前提)

実装の完成形は求めません。 **見た目の方向性とトーンが伝わるレベル** で十分です。 不明な点は仮定を明示してください (例:「価格表示は SaaS 月額前提で 3 段階で配置と仮定」)。

---

## 1. デモの位置付け ★

- **対象 URL**: `/local-business/{{slug}}` (本番 https://ihara-frontend.com/local-business/{{slug}})
- **デモ ID**: {{A-1 / A-2 / ... / 旧 8 デモ / v8.0 ハブ / demo-gallery}}
- **v8.0 評価マトリクス上の位置**: {{33p 評価の P{X-Y}、 Score X}}
- **実装現状**: {{ファイル名 + 行数、 重実装 / 薄い / 仮実装 / ハブ / 投票}}

## 2. ターゲットペルソナ ★

- **役職 / 立場**: {{後継層 30-40 代 アトツギ / 工務店現場監督 40-60 代 / 親方 60-70 代 / 施主 30-50 代 等}}
- **流入経路**: {{紹介 / 商工会議所 / 北原氏紹介 / 建材屋 / 設計事務所 / 業界紙 等}}
- **見た瞬間の心理**: {{「父親にどう説明するか」「うちにも応用できそうか」「具体的に何が変わるか」 等}}
- **判断したいこと**: {{「導入して父親説得できそうか」「月 X 万出す価値あるか」「他社と何が違うか」 等}}

## 3. 痛み (一次情報ベース) ★

> 5/14 友人 N=1 + 5/22 北原氏面談 + 235 件 issue-finder + 794 件 Google マップ レビュー が根拠

- 痛み 1: {{}}
- 痛み 2: {{}}
- 痛み 3: {{}}

## 4. ゴール / 行動誘導 ★

- **このページで取らせたい 1 アクション**: {{LINE 追加 / 30 分ヒアリング / 連絡先入力 / デモ操作完了 等}}
- **その次のアクション**: {{Zoom 60 分 / 訪問アポ / 価格相談 / 父親との 3 者面談 等}}

## 5. 訴求軸 (3 個、 順序が重要) ★

- 軸 1 (最重要): {{}}
- 軸 2: {{}}
- 軸 3: {{}}

## 6. 価格レンジ (5/23 v8.0 で確定、 候補ごと変動)

> 候補ごと価格レンジ表は `docs/v8.0-hearing-design-2026-05-23.html` P7 参照

- 提供形態: {{SaaS 月額 / BPaaS 一括 / AI エージェント (一社一カスタム) / ハブ / 投票 = 価格なし}}
- 3 段階レンジ: {{月 3/5/10 万 等}}
- 5/14 友人「買い切り嬉しい」 反映: {{B-3 のみ買い切り並列、 他は継続課金前提}}

## 7. トーン & ムード ★

- **言葉のトーン**: {{丁寧 / アトツギ向けプロ用語 OK / 工務店現場監督向け平易 等}}
- **色のムード**: {{暖色 (warm editorial #fcf6e9) / 落ち着いた青系 / モダン無彩色 等}}
- **書体の方向**: {{Noto Serif JP (見出し) + sans-serif (本文) / モノスペース部分使用 等}}
- **写真 / イラスト**: {{実装スクリーンショット主体 / SVG イラスト / 抽象グラフィック / 文字主体}}

## 8. 避けたい印象 / NG ワード ★

- 避けたい印象: {{派手 / ゲーム会社 / 業界用語ガチャガチャ / 「AI」 強調 / 補助金 1/8 訴求 (5/17 廃止済)}}
- NG ワード: {{「DX」「アジャイル」「スプリント」 + 主顧客モード非適用なら「BPaaS / NRR / プレモータム」 も避ける}}

## 9. 参考デザイン (1-3 件)

- 参考 1: {{hiraomakoto.jp = 写真主役 + セクション数極小}}
- 参考 2: {{bokoko33.me = 作品が主役 + 装飾は黒子}}
- 参考 3: {{V8.0 ハブ /local-business/v8.0 の warm editorial スタイル}}

## 10. 制約

- **技術制約**: Next.js 16 App Router + Tailwind CSS + Noto Serif JP (見出し) + lucide-react (icon)
- **既存スタイル参照**: `/local-business/v8.0` の warm editorial (#fcf6e9 / #2b261e ink / #b85c3a accent)
- **インタラクション**: {{動くデモ込み / 静的のみ / モーダル + フォーム 等}}
- **法令 / 規約**: {{補助金訴求の「採択保証なし」 明記、 個人情報フォームは利用規約リンク必須、 BPaaS 価格は税抜表記}}

---

## Claude Design への 1 行依頼 ★

{{1 行で「何をしてほしいか」 を明確に。 例: 「OB 10 年管理 SaaS のヒーロー + AI 予測ダッシュボードを アトツギ世代 30-40 代が 3 秒で「父親に見せて怒られない」 と判断できる warm editorial デザインで」}}
```

---

## モード切替ルール (output-style 連動)

| ターゲット | モード | 文体ルール |
|---|---|---|
| 旧 8 デモ + demo-gallery 投票 | **主顧客モード** (工務店現場監督 40-60 代) | カタカナ専門語禁止 / 1 文 40 字以内 / 困りごと → 解決した姿 → 金額の目安 |
| 新 6 デモ + v8.0 ハブ | **アトツギモード** | カタカナ / 製品名 OK / 父親と並走 / 業界の流れで語る / 同業他社事例 + ROI 計算 |

各プロンプト .md の冒頭で **モード指定を明示**すること。

---

## 16 件 デモ プロンプト 一覧 (作成計画)

| # | slug | デモ ID | モード | ファイル名 |
|---|---|---|---|---|
| 1 | v8.0 (ハブ) | v8.0 ハブ | アトツギ | `v8.0-hub-2026-05-24.md` |
| 2 | ob-management | A-1 (主軸候補) | アトツギ | `ob-management-2026-05-24.md` (✅ 1 件目、 動作確認用) |
| 3 | lead-cultivation | A-2 | アトツギ | `lead-cultivation-2026-05-24.md` |
| 4 | business-metrics | A-3 | アトツギ | `business-metrics-2026-05-24.md` |
| 5 | tacit-knowledge | B-1 (薄い 21 行) | アトツギ + 父親 | `tacit-knowledge-2026-05-24.md` |
| 6 | content-auto | B-2 (薄い 92 行) | アトツギ | `content-auto-2026-05-24.md` |
| 7 | home-simulator | B-3 | アトツギ + 施主 | `home-simulator-2026-05-24.md` |
| 8 | call-memo-board | 旧 8 | 主顧客 | `call-memo-board-2026-05-24.md` |
| 9 | client-progress-page | 旧 8 | 主顧客 | `client-progress-page-2026-05-24.md` |
| 10 | drawing-quick-viewer | 旧 8 | 主顧客 | `drawing-quick-viewer-2026-05-24.md` |
| 11 | estimate-organizer | 旧 8 | 主顧客 | `estimate-organizer-2026-05-24.md` |
| 12 | receipt-expense-camera | 旧 8 | 主顧客 | `receipt-expense-camera-2026-05-24.md` |
| 13 | site-photo-organizer | 旧 8 | 主顧客 | `site-photo-organizer-2026-05-24.md` |
| 14 | voice-daily-report | 旧 8 | 主顧客 | `voice-daily-report-2026-05-24.md` |
| 15 | website-refresh | 旧 8 | 主顧客 | `website-refresh-2026-05-24.md` |
| 16 | demo-gallery | 投票ページ刷新 | アトツギ向けに再フレーミング | `demo-gallery-2026-05-24.md` |

---

## 各 .md プロンプトに含める追加情報 (テンプレ展開時の差分)

- **3 (痛み)**: friend-hearing-result-2026-05-14 / 235 件 issue-finder / 794 件レビュー から該当する痛みを 3 件引用
- **5 (訴求軸)**: v8.0 評価マトリクス 33p の該当ページから引用
- **6 (価格)**: v8.0-hearing-design P7 候補ごと価格レンジ表から引用
- **10 (技術制約)**: 重実装 デモは「既存 ob-management-demo.tsx / home-simulator-demo.tsx の interactive component を維持したまま見た目を磨く」 と明示

---

## 関連 docs

- `docs/design-brief-template.md` (元テンプレ 12 項目、 本テンプレの上位互換)
- `docs/v8.0-hearing-design-2026-05-23.html` (8p ヒアリング内部設計、 候補ごと価格レンジ P7 / シグナル基準 P5 含む)
- `docs/v8.0-product-candidates-evaluation-2026-05-23.html` (33p 評価マトリクス、 痛み / 訴求軸 / 価格仮 を候補ごと記載)
- `docs/v8.0-plan-c-friend-absent-2026-05-23.html` (プラン C 主軸 / 6 経路並列 / 期間延長)
- `~/.claude/projects/-Users-master-home-work-portfolio/memory/friend-hearing-result-2026-05-14.md` (一次情報 N=1 業界知識 5 件)

## 関連 memory

- [[design-brief-process]] — 12 項目テンプレの上位思想
- [[design-references]] — masatoman 好み (hiraomakoto.jp / bokoko33.me)
- [[friend-hearing-result-2026-05-14]] — 痛み一次情報
- [[customer-target]] — 主顧客像 (アトツギ × 儲かってる層 確定済)
- [[ai-positioning]] — AI を前面に出さない
- [[subsidies-positioning]] — 補助金は控えめ
- [[friend-keyperson-dependency-risk-2026-05-23]] — プラン B/C 切替で「動くデモ前提」 強化
