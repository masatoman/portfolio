# Lighthouse 監査 (本番 deploy 後、 2026-05-14 / 2026-05-15)

> 完了条件: 主要 12 ページのモバイル Lighthouse スコア で perf > 85 + a11y > 95。
>
> 計測方法: 当初は ローカル loopback (port 3000 dev + port 3001 production 同居) で計測したが、 perf 30-35 で頭打ち。 ローカル calibration 問題と判断し、 **Vercel 本番 deploy + ローカル lighthouse から本番 URL を直接計測** に切り替え (PSI Free quota は 429 で代替手段)。
>
> 対象: 11 ページ (`/lab/tools/issue-finder` は本番 middleware で 404、 計測対象外)。

---

## 最終結果 (3 回目計測、 2 回 a11y 修正 deploy 後)

| # | URL | perf | a11y | bp | seo | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| 1 | `/` | **68 ❌** | 100 ✅ | 96 | 100 | 6.0 s | 0 ms | 0 |
| 2 | `/portfolio` | **63 ❌** | 100 ✅ | 96 | 100 | 6.8 s | 0 ms | 0.047 |
| 3 | `/demo-gallery` | 92 ✅ | 96 ✅ | 96 | 100 | 3.3 s | 0 ms | 0 |
| 4 | `/local-business/call-memo-board` | 97 ✅ | **95 ⚠️** | 96 | 100 | 2.6 s | 0 ms | 0 |
| 5 | `/local-business/estimate-organizer` | 97 ✅ | 96 ✅ | 96 | 100 | 2.6 s | 0 ms | 0 |
| 6 | `/local-business/site-photo-organizer` | 97 ✅ | 96 ✅ | 96 | 100 | 2.6 s | 0 ms | 0 |
| 7 | `/local-business/voice-daily-report` | 98 ✅ | 96 ✅ | 96 | 100 | 2.3 s | 0 ms | 0 |
| 8 | `/local-business/receipt-expense-camera` | 97 ✅ | 96 ✅ | 96 | 100 | 2.6 s | 0 ms | 0 |
| 9 | `/local-business/drawing-quick-viewer` | 90 ✅ | 96 ✅ | 96 | 100 | 3.5 s | 0 ms | 0 |
| 10 | `/local-business/client-progress-page` | 97 ✅ | 100 ✅ | 96 | 100 | 2.6 s | 0 ms | 0 |
| 11 | `/local-business/website-refresh` | 97 ✅ | 100 ✅ | 96 | 100 | 2.6 s | 0 ms | 0 |

### 達成率

- **perf > 85: 9/11 (82%)** — 残 2 ページ (`/`, `/portfolio`)
- **a11y > 95: 10/11 (91%)** — 残 1 ページ (`/local-business/call-memo-board` = 95、 1 違反)
- best-practices > 95: 11/11 ✅
- seo = 100: 11/11 ✅

---

## 改善履歴

### ベースライン (ローカル loopback、 calibration ズレ大)

| 指標 | demo-gallery | / |
|---|---|---|
| perf | 32 | 31 |
| a11y | 96 | 96 |

**結論**: ローカル loopback では mainthread 16s / TBT 8.5s が出るが、 これは Lighthouse mobile preset の 4x CPU throttling × ローカル calibration の構造的限界 (dev SUSPEND しても 32→35 で大差なし)。 → 本番 deploy + lighthouse 計測に切り替え。

### 1 回目本番計測 (a11y 修正前)

| 指標 | / | /portfolio | demo-gallery | 8 デモ平均 |
|---|---|---|---|---|
| perf | 65 | 61 | 98 | 94 |
| a11y | 96 | 92 | 96 | 95 |

→ a11y 違反は color-contrast (共通) + portfolio target-size + voice-daily-report button-name。

### 2 回目計測 (a11y 修正 1 回目 deploy 後)

| 指標 | / | /portfolio | demo-gallery | 8 デモ平均 |
|---|---|---|---|---|
| perf | 64 | 61 | 90 | 95 |
| a11y | **100** | **100** | 96 | 95.5 |

→ / + /portfolio の a11y 100 達成、 perf は変動 (±2)。 3 デモ (call-memo / client-progress / website-refresh) が a11y 95 borderline で残。

### 3 回目計測 (a11y 修正 2 回目 deploy 後) = 最終

| 指標 | / | /portfolio | demo-gallery | 8 デモ平均 |
|---|---|---|---|---|
| perf | 68 | 63 | 92 | 95.5 |
| a11y | 100 | 100 | 96 | 95.5 (95 1 件残) |

---

## 修正一覧

### a11y 修正 1 回目 (commit `1c…` 相当、 全 6 ページの a11y 違反 6 件解消)

| ファイル | 変更 |
|---|---|
| `app/page.tsx` | `text-[#8a7a63]` → `#6b5d44` (5 箇所) / `text-[#9c7d54]` → `#7a5e3a` / `text-[#7d766b]` → `#5f5a51` (WCAG AA pass、 warm tone 維持) |
| `app/portfolio/portfolio-content.tsx` | `text-white/40` → `text-white/75` (3+1 箇所) / footer link 2 件に `inline-flex items-center min-h-[44px] px-3 py-2` (target-size pass) |
| `components/local-business/voice-daily-report-demo.tsx` | 録音開始 / 停止 button に `aria-label` (button-name 違反解消) |

### a11y 修正 2 回目 (a11y borderline 3 ページ + accent 色)

| ファイル | 変更 |
|---|---|
| `components/local-business/savings-simulation.tsx` | `text-[#7a8aa8]` → `text-[#5a6680]` |
| `components/local-business/receipt-expense-camera-demo.tsx` | `text-[#7a8aa8]` → `text-[#5a6680]` |
| `components/local-business/website-refresh-demo.tsx` | `text-[#8a7a63]` → `text-[#6b5d44]` (2 箇所) |
| `components/local-business/builder-showcase-page.tsx` | `text-[#8a7a63]` → `text-[#6b5d44]` (多数) / `text-[#d4c2a6]` → `text-[#a08864]` |
| `app/local-business/client-progress-page/page.tsx` | `accent="#06b6d4"` → `"#0e7490"` (cyan-500 → cyan-700、 contrast 2.7→5.8) |

---

## 残課題

### R1: `/` + `/portfolio` の perf < 85 (font 連鎖が LCP の主犯)

**症状**: LCP 6.0s / 6.8s。 network trace で top 5 が全て **font woff2** (200-500 ms × 8 個 並列)。 main-thread は 1.1 s 程度 (Other 406 ms + Style&Layout 405 ms + Rendering 188 ms + Script 141 ms) と健全。

**原因**: `app/layout.tsx` で 6 フォント family ロード (GeistSans + GeistMono + Inter + JetBrains_Mono + Noto_Sans_JP + DotGothic16)。 既に Inter / JetBrains_Mono / Noto_Sans_JP / DotGothic16 は `preload: false` 設定済みだが、 lighthouse 計測中に lazy load されて LCP に効く。

**対策候補 (副作用注意)**:
1. `display: 'optional'` に変更 — 100 ms 以内に font 来なければ system 表示固定 (FOUT 無し、 visual 違和感残る)
2. Noto_Sans_JP に `subsets: ['latin']` 限定 — CJK 全部 download しない (日本語が system 表示)
3. /portfolio (Y2K JetBrains 依存) の font 戦略を route-specific に分離 — 影響範囲大きい
4. Three.js / 重い lib を `dynamic(() => import(...), { ssr: false })` 化 (今回 import 確認では Three.js は portfolio で未使用、 効果限定的)

**推奨**: 別 /goal で「font 戦略リファクタ」 として扱う。 visual impact 大きいので、 design-brief レビュー必要。

### R2: `/local-business/call-memo-board` の a11y = 95 (1 違反)

**症状**: color-contrast 違反 1 件。 Lighthouse snippet は `text-[#7a8aa8]` (古い cache snippet、 本番 HTML には既に無い) と submit button (shadcn/ui Button)。

**真の違反**: submit button の variant or disabled state の contrast。 Button component (`components/ui/button.tsx`) の variant + tailwind.config.ts の primary 色組み合わせ調整が必要。

**推奨**: shadcn/ui Button のテーマ調整は他 11 ページ全部に波及するため、 design review 経由で別タスク化。

---

## 副次的発見

### ローカル loopback Lighthouse は信用できない

dev server (port 3000) + production server (port 3001) を同居させて Lighthouse を実行すると、 全 metric が 1.5-2× 悪化する。 dev SUSPEND しても calibration ズレが大きく、 「perf 32 ↔ 本番 perf 90 台」 の乖離が出る。 今後は **本番 deploy + lighthouse 計測 (or PSI)** を正攻法とする。

### Noto Sans JP の @font-face declaration 125 KiB の正体

Lighthouse の「Reduce unused CSS 125 KiB」 は **Noto Sans JP の CJK unicode-range 分割 @font-face declaration** で false positive。 実害は CSS パース数十 ms 程度。 「unused CSS」 を額面通り受け取らず、 内訳を確認する習慣が必要。

### Lighthouse の cache snippet と本番 HTML の乖離

Lighthouse の violation snippet は計測時 DOM snapshot から取得されるが、 ブラウザ disk cache 経由で過去 deploy の HTML 要素が混ざる場合がある。 修正後の検証は **本番 HTML を curl で直接 grep** する方が確実。

---

## 関連 commit

| commit | 内容 |
|---|---|
| `44f929a` | demo-gallery 公開直後の P1 修正 + warm editorial top + 軸 B 5/22 面談 docs (`docs/p1-audit-2026-05-14.md` 含む) |
| 次の commit | Lighthouse a11y 違反 6 件解消 (color-contrast / target-size / button-name) |
| その次 | a11y borderline 3 ページ + accent 色 解消 |
