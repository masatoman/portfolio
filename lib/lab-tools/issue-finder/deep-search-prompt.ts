import type { ExpandedQuery } from "./queries"

// Deep Research / Deep Search 用プロンプトを組み立てる。
// masatoman が ChatGPT / Claude / Perplexity / Gemini の Deep Research に貼って実行 →
// 結果を issue-finder の「1次情報を貼る (手動)」テキストエリアに貼り戻す運用想定。

const SYSTEM_INTRO = `あなたは日本のネット (知恵袋・X/Twitter・note・はてなブログ・mixi・Google レビュー・業界フォーラム) から、 当事者の生々しい一人称の悲鳴・不満・課題発言を大量に集める調査エキスパートです。`

const COVERAGE = `【探索範囲】
- 優先ソース: Yahoo!知恵袋 / X (旧 Twitter) / note / はてなブログ / mixi コミュニティ / Google マップ レビュー / 業界系コミュニティ
- 除外: 一般論記事 / SEO アフィ記事 / 公式ヘルプ / メーカー宣伝記事
- 期間: 直近 24 ヶ月を優先, ただし普遍的な悲鳴は古い投稿でも採用可
- 必ず引用元 URL を残すこと (推測 URL 禁止)`

const OUTPUT_FORMAT = `【出力フォーマット】
当事者の一人称引用を最大 100 件、 以下のフォーマットで番号順にリストしてください。
issue-finder ツール側で自動クラスタリングされるので、 重複・類似引用も歓迎です。

[001] 引用テキスト本文 (1-3 文)
出典: <https://...>
日付: YYYY-MM 程度
タイプ: chiebukuro | x | note | blog | review | mixi | forum | other

[002] ...

【質の指針】
- 生々しさ優先: "もう辞めたい" "妻にいつ家にいるのと言われる" "この道具で腰がもう…" 等の口語が含まれる発言を高評価
- 一般論禁止: "建設業は残業が多いと言われる" のような客観記事の言い換えは避ける
- 当事者本人の発言を優先 (記者まとめは出典として弱い)
- 同じテーマで複数引用が取れる場合は別エントリで列挙 (頻度=シグナルなので束ねない)`

export type BuildPromptOptions = {
  query: ExpandedQuery
  targetCount?: number // 既定 100
  extraToolNotes?: string // 例: "andpad と Photoruction の比較スレッドが見つかれば優先"
}

export function buildDeepSearchPrompt({
  query,
  targetCount = 100,
  extraToolNotes,
}: BuildPromptOptions): string {
  const watchedToolsLine =
    query.watchedTools.length > 0
      ? `- 既存ツールへの不満も拾う対象: ${query.watchedTools
          .map((t) =>
            t.aliases.length > 0
              ? `${t.name} (${t.aliases.join("/")})`
              : t.name,
          )
          .join(" ／ ")}`
      : "- 既存ツール特定の対象なし"

  const phrasesLine =
    query.examplePhrasesToWatch.length > 0
      ? `- 検出したい口語フレーズ例: ${query.examplePhrasesToWatch
          .map((p) => `"${p}"`)
          .join(" / ")}`
      : "- 口語フレーズ例なし (自由探索)"

  const trackLine =
    query.keywordsToTrack.length > 0
      ? `- 注目語 (頻度を後で集計するので含む発言は優先): ${query.keywordsToTrack.join(", ")}`
      : ""

  return [
    SYSTEM_INTRO,
    "",
    "【調査対象】",
    `- 業界 / 業種: ${query.profileName}`,
    `- 視点 / 役職: ${query.role}`,
    `- 検索キーワード (組み合わせて活用): ${query.keywords.join(", ")}`,
    phrasesLine,
    watchedToolsLine,
    trackLine,
    "",
    COVERAGE,
    "",
    OUTPUT_FORMAT,
    "",
    `目標件数: ${targetCount} 件 (達成できなくとも質を優先, 一般論で水増ししない)`,
    extraToolNotes ? `\n【追加メモ】\n${extraToolNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}
