# issue-finder 運用ガイド (v6 / SKILL + フォーム)

> 自分用の市場リサーチツール。 ネット上の悲鳴を業種 × 役職 perspective で
> 巡回 → クラスタリング → Supabase に保存 → portfolio サイトで可視化。
> **API 課金ゼロ** (Claude Code MAX 内蔵 web_search のみ使用)。

## 外出先から見る (Tailscale 経由)

Mac が起動している前提で、 iPhone / 外出先 PC から固定 URL でアクセス可能。 本番 Vercel は middleware でブロック中なので、 ローカル開発サーバを Tailscale VPN 経由で覗く方式。

### 初回セットアップ (1 回だけ)

**Mac 側**:
```bash
# 1. Tailscale をインストール
brew install --cask tailscale

# 2. 起動 + Google/Apple/GitHub アカウントでログイン
open /Applications/Tailscale.app

# 3. MagicDNS 名を控える (例: iharaseito-mbp.tailnet-xxxxx.ts.net)
#    タスクトレイの Tailscale アイコン → "Copy device name"
```

**iPhone 側**:
- App Store から「Tailscale」アプリをインストール
- Mac と同じアカウントでログイン
- Settings → VPN で常時 ON にしておく (外出先でも自動接続)

### 通常運用 (毎日)

```bash
cd ~/home_work/portfolio
pnpm dev:tailscale  # 通常の dev ではなく :tailscale 付き (0.0.0.0 バインド)
```

iPhone の Safari で:
```
http://<Mac の MagicDNS 名>:3000/lab/tools/issue-finder
例: http://iharaseito-mbp.tailnet-xxxxx.ts.net:3000/lab/tools/issue-finder
```

### 注意点

- **Mac はスリープ NG**: スリープすると iPhone 側でアクセス不可。 カフェで長時間使う場合は電源確保推奨
- **Tailscale ネットワーク = masatoman さんのデバイスのみ**: 他人には見えない (公開していないので legal リスク変化なし)
- **friend ヒアリング時に友人 iPhone で見せたい場合**: Tailscale は他人デバイスに入れにくいので、 その場では Mac の画面共有 or ngrok 一時 URL が現実的
- **middleware.ts の挙動**: VERCEL_ENV=production の時だけ 404、 ローカル dev は通過するので Tailscale 経由でも問題なし
- **`-H 0.0.0.0` の意味**: 自宅 LAN にも公開される (= 家族の他端末からも見える)。 気になる場合は通常 `pnpm dev` を使い分け

### トラブルシューティング

- iPhone でアクセスできない → Tailscale アプリで「Connected」確認、 Mac 側で `pnpm dev:tailscale` で起動しているか確認 (`pnpm dev` だと localhost 専用で外から見えない)
- MagicDNS 名がわからない → Mac の Tailscale メニュー → device name を再確認、 もしくは `https://login.tailscale.com/admin/machines` で確認
- 「This site can't be reached」 → Mac がスリープしている、 もしくは Mac の OS ファイアウォールが Node プロセスをブロックしている (システム設定 → ネットワーク → ファイアウォール)

## 経路は 1 本 (2 モード)

```
[ ブラウザ /lab/tools/issue-finder ]
   ↓ // 01 / queue でフォーム送信
   ├── web_search モード: テキスト貼付なし
   └── Deep Research モード: 「Deep Research 結果を貼る」欄に外部 LLM 出力を貼付
   ↓
[ Supabase: if_jobs (pending, raw_input_text あり/なし) ]
   ↓
[ Claude Code → /issue-finder process (SKILL) ]
   ↓ raw_input_text の有無で分岐
   │   ├── 無し → web_search 8-12 並列 → 100-200 件サンプリング
   │   └── 有り → 貼付 text を直接サンプルとして扱う (web_search skip)
   ↓ クラスタリング (8-12 クラスタ)
   ↓ POST /api/lab-tools/issue-finder/process-job
[ portfolio API ]
   ↓ 重複検出 (titleSimilarity >= 0.7)
   ↓ issueScore 計算 (scoring.ts)
   ↓ Supabase: if_issues に INSERT、 if_jobs を completed
[ ブラウザリロード ] → // 02 / results に反映
```

旧 v3-v5 で議論した「Claude Code routine (毎日 9:00 / Notion 保存)」「Notion Markdown コピー」は v6 で廃止. v6+ で **手動テキスト貼り付けはジョブ経由に統合** (raw_input_text フィールド).

## Deep Research モードの使い方

外部 LLM (ChatGPT / Claude / Perplexity / Gemini の Deep Research 系) で大量サンプルを取りたいとき:

1. ブラウザで `// 03 / settings` の details「外部 Deep Research プロンプト」を開く
2. perspective を選んで「Deep Search プロンプトをコピー」を押す (perspective の keywords / examplePhrases / watchedTools がプロンプトに埋め込まれる)
3. ChatGPT 等の Deep Research 系機能をオンにして貼付して実行 (5-15 分かかる)
4. 返ってきた `[001] 引用本文 / 出典: URL / 日付: YYYY-MM / タイプ: ...` 形式のリストをコピー
5. ブラウザの `// 01 / queue` で同じ perspective を選び、 「Deep Research 結果を貼る」 details を開いて貼付
6. 「収集をキューに追加」 → ジョブが Deep Research モードとして登録される (jobs リストに `DR` バッジ)
7. Claude Code で `/issue-finder process` → SKILL が web_search を skip して貼付 text を直接クラスタリング
8. ブラウザリロードで `// 02 / results` に反映

**強み**: Deep Research の対話的追加質問・pay-walled / login-walled ソースが活用できる. 1 ジョブで 100-300 件級の引用が一発で投入可能.

## セットアップ

### 1. Supabase (KOBO プロジェクトに相乗り)

新規プロジェクトは作らず、 既存の **KOBO** プロジェクト (`amtwwscvhwkfdrqimgqm`) に相乗り。
無料枠 2 プロジェクト制限があるため。

1. Supabase ダッシュボードで KOBO プロジェクトを開く
2. SQL Editor で `supabase/migrations/20260510_issue_finder.sql` を実行
   (`public.if_jobs` と `public.if_issues` が作成される、 既存テーブルとは命名衝突なし)
3. Settings → API から URL (`https://amtwwscvhwkfdrqimgqm.supabase.co`) / anon key / service_role key を控える

### 2. portfolio .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://amtwwscvhwkfdrqimgqm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # KOBO の anon key
SUPABASE_SERVICE_ROLE_KEY=eyJ...               # KOBO の service_role key, API Route 内でのみ使用
ISSUE_FINDER_INTERNAL_KEY=$(openssl rand -hex 32)
```

### 3. masatoman の Mac の env (~/.zshrc など)

SKILL から portfolio API を叩くために、 同じ INTERNAL_KEY と Supabase URL/anon を export:

```bash
export NEXT_PUBLIC_SUPABASE_URL=https://amtwwscvhwkfdrqimgqm.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
export ISSUE_FINDER_INTERNAL_KEY=...   # portfolio と同じ値
export ISSUE_FINDER_API_BASE=http://localhost:3010   # 本番なら https://ihara-frontend.com
```

`SUPABASE_SERVICE_ROLE_KEY` は SKILL 側には**入れない** (portfolio API が持つので不要、 漏洩リスク低減)

### 4. dev server を起動

```bash
cd ~/home_work/portfolio
pnpm dev   # http://localhost:3010
```

## 日々の運用

1. ブラウザで `http://localhost:3010/lab/tools/issue-finder` を開く
2. `// 01 / queue` セクションで perspective を選んで「収集をキューに追加」
3. Claude Code を VS Code 内ターミナルで起動 → `/issue-finder process`
4. ブラウザをリロード → `// 02 / results` に新規クラスタが追加されている

頻度は自由 (毎日 / 週末まとめて / 気になった時だけ)。

## アーキテクチャ補足

### スコア計算は scoring.ts に集約

- `lib/lab-tools/issue-finder/scoring.ts` の `computeIssueScore()` が単一ソース
- SKILL は `clusterSize / samplingTotal / emotionScore / industryImpact` を渡すだけ
- 数式: `clamp(base * 1.5 + impactBonus + emotionAdjust, 0, 100)` (詳細はソース参照)

### 重複検出も scoring.ts

- `titleSimilarity()` で trigram Jaccard を計算
- 過去 30 日同 perspective 内で `>= 0.7` なら skip
- skipped_details が collection_jobs.summary に記録される

### 本番ブロック

`middleware.ts` で `VERCEL_ENV=production` の場合 `/lab/tools/issue-finder` および
配下 API は 404. ただし `/api/lab-tools/issue-finder/process-job` だけは `x-internal-key` ヘッダ一致で通す (SKILL から本番を叩きたくなった時の例外)。

著作権・利用規約のグレー領域に踏み込まないよう、 集めた引用は本番では public 公開しない方針。

## トラブルシューティング

| 症状 | 確認事項 |
|---|---|
| フォーム送信で 503 | `.env.local` の SUPABASE_* / SERVICE_ROLE_KEY |
| SKILL から API で 401 | `ISSUE_FINDER_INTERNAL_KEY` が portfolio と Mac env で一致しているか |
| jobs が processing のまま 30 分 | SKILL が中断した可能性. Supabase で手動で status を pending に戻すか failed に |
| 重複が大量に貯まる | `DUPLICATE_TITLE_THRESHOLD` (scoring.ts) を 0.7 から 0.6 に下げる |
| 結果が偏る | queries.json の keywordsToTrack / examplePhrasesToWatch / watchedTools を増やす |

## メンテナンス指針

- queries.json を編集して perspective 追加 / キーワード調整
- watchedTools を充実させると ツール愚痴 → 代替 SaaS のネタが見える
- 失敗ジョブを定期的に確認 (`/issue-finder jobs`)
- 古い issues は `run_date` でフィルタ可能

## 関連ファイル

- `data/issue-finder/queries.json` - perspective 定義
- `lib/lab-tools/issue-finder/scoring.ts` - スコア + 類似度
- `lib/lab-tools/issue-finder/db.ts` - Supabase 取得
- `app/api/lab-tools/issue-finder/jobs/route.ts` - キュー登録 / 一覧
- `app/api/lab-tools/issue-finder/process-job/route.ts` - SKILL からの POST 受け
- `supabase/migrations/20260510_issue_finder.sql` - DDL
- `~/.claude/skills/issue-finder/SKILL.md` - SKILL 本体
- `middleware.ts` - 本番ブロック
- `components/lab-tools/issue-finder/issue-finder-shell.tsx` - UI 本体
