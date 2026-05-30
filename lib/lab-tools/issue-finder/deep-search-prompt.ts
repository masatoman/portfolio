import type { ExpandedQuery } from "./queries"

// Deep Research / Deep Search 用プロンプトを組み立てる。
// masatoman が ChatGPT / Claude / Perplexity / Gemini の Deep Research に貼って実行 →
// 結果を issue-finder の「1次情報を貼る (手動)」テキストエリアに貼り戻す運用想定。

const SYSTEM_INTRO = `あなたは日本のネット (知恵袋・X/Twitter・note・はてなブログ・mixi・Google レビュー・業界フォーラム) から、 当事者の生々しい一人称の悲鳴・不満・課題発言を大量に集める調査エキスパートです。`

const COVERAGE = `【探索範囲】
- 優先ソース: Yahoo!知恵袋 / X (旧 Twitter) / note / はてなブログ / mixi コミュニティ / Google マップ レビュー / 業界系コミュニティ / 5ch / OpenWork / Glassdoor / 退職代行系ブログ
- 除外: 一般論記事 / SEO アフィ記事 / 公式ヘルプ / メーカー宣伝記事
- 期間: 直近 24 ヶ月を優先, ただし普遍的な悲鳴は古い投稿でも採用可
- 必ず引用元 URL を残すこと (推測 URL 禁止)

【絞り込みすぎ防止 — 必ず守ること】
渡されたキーワード / フレーズ例 / 注目語は **代表的な入り口に過ぎない**。 これだけを叩くと「業界の通説」「ありきたりの不満」 だけが集まり、 本書 (安宅和人『イシューからはじめよ』) のいう「常識を覆す洞察」 が抜け落ちる。

- 渡されたキーワードに **言い換え・類義語・隣接概念** を自分で大量に追加して探索する
- 渡された keywordsToTrack 以外の **異常な口語表現・固有名詞・隠語** にも積極的に網を張る (例: 「クソ」「マジで」「もう無理」「事故ったら休める」「夢に出る」「黒板入力誤爆」 等)
- 「DX = 良い」「ツール導入 = 効率化」 等の **通説と真逆の発言** (DX が監視強化になっている / ツール導入で代行入力の皺寄せが来る / 補助金もらわなければよかった 等) を必ず探す
- 業界の **隠れた構造問題** (◯◯ の皺寄せ / 偽装 ◯◯ / 暗黙の ◯◯) を当事者がぽろっと漏らした投稿を狙う
- **アトツギ (2 代目 3 代目) / 妻 / 経理担当 / 下請け / 顧客 等の周辺当事者** の声も拾う (役職本人だけだと盲点が残る)
- 既存ツール (ANDPAD / freee / kintone 等) の「機能不足」 だけでなく、 **「使われ方の歪み」** (本社の監視ツールになっている、 入力強要されて職人が辞める 等) を狙う
- 取れた引用同士の **逆説・対立・パラドックス** が見えたら必ず両方残す (片方だけだと洞察が消える)`

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

export type AiVariant = "neutral" | "chatgpt" | "claude" | "perplexity" | "gemini"

export type SatelliteVoice =
  | null
  | "wife" // 妻 / 彼女 / アトツギの母親 — 家族側の本音
  | "accountant" // 経理担当 (社長妻が多い) — 数字面の悲鳴
  | "subcontractor" // 下請 / 一人親方 — 上流からの皺寄せ
  | "client" // 顧客 / 施主 — クレーム視点
  | "ob" // 退職者 / OB — 過去形で漏らす本音
  | "succession" // アトツギ (2 代目 3 代目) — 父親世代との温度差

export type ContrastAxis =
  | null
  | "mgmt-vs-field" // 経営者 vs 現場
  | "master-vs-atotsugi" // 親方 vs アトツギ
  | "rich-vs-poor" // 儲かってる工務店 vs 苦しい工務店
  | "tool-adopter-vs-rejecter" // ANDPAD 入れた vs 入れてない
  | "small-vs-mid" // 個人事業主 vs 中堅 (年商で分ける)

export type ForcedMedium =
  | "youtube" // YouTube コメント欄 / 概要欄 / 字幕
  | "tiktok" // TikTok コメント欄
  | "podcast" // Podcast 文字起こし
  | "g2-capterra" // G2 / Capterra (海外 SaaS レビューで日本工務店ユーザーが少数派意見出してる)
  | "openwork" // OpenWork 口コミ
  | "5ch" // 5ch スレ
  | "退職代行" // 退職代行系ブログ
  | "google-map-review" // Google マップ レビュー

export type BuildPromptOptions = {
  query: ExpandedQuery
  targetCount?: number // 既定 100
  extraToolNotes?: string // 例: "andpad と Photoruction の比較スレッドが見つかれば優先"

  // ─────────────── 多様性オプション (本書「常識を覆す洞察」 を取りに行く仕掛け) ───────────────
  /** AI ごとの得意領域・癖を活かす差分プロンプト。 4 AI に同じ prompt 投げると結果が中央値収束するのを回避 */
  aiVariant?: AiVariant
  /** Devil's Advocate モード: 業界の通説を 3 つ書き出して全部覆す投稿を探させる */
  devilsAdvocate?: boolean
  /** 周辺当事者視点: 役職本人ではなく妻 / 経理 / OB 等にカメラを向ける */
  satelliteVoice?: SatelliteVoice
  /** 対立軸: 2 つの立場を対比させて差分を炙り出す */
  contrastAxis?: ContrastAxis
  /** 時系列変化: 5 年前と今で何が変わった/変わってないか */
  timeShift?: boolean
  /** 強制媒体: 必ず最低 1 件ずつ拾うべき媒体リスト */
  forcedMedia?: ForcedMedium[]
  /** ランダム seed: 今回の切り口を 1 句で固定 (例: "金銭面のみ" "メンタル面のみ" "家族関係のみ") */
  randomSeed?: string | null
}

const AI_VARIANT_BLOCKS: Record<AiVariant, string> = {
  neutral: "",
  chatgpt: `\n【ChatGPT 向けチューニング】
あなたは ChatGPT。 学習データに OpenAI が多く取り込んだ **退職代行ブログ / 知恵袋 / X (旧 Twitter) の長文ポスト** が豊富にあるはず。 また **コードインタプリタ / ファイル解析** が使えるなら Google マップ レビュー CSV 等を渡されたらそれを優先的に解析する姿勢で。 ロールは「現場監督の退職代行担当者」 — 1 年以内に辞めた依頼者の引き継ぎ書類から本音を抜き出す視点で書いてください。`,
  claude: `\n【Claude 向けチューニング】
あなたは Claude。 学習データには **長文 note / はてなブログ / 個人ブログ の構造化された告白系記事** が豊富。 役職本人ではなく **妻 / 彼女 / アトツギの母親 / 経理担当 (= 社長妻)** が SNS や知恵袋に書いた **間接当事者の声** を主軸に。 本人より家族の方がぽろっと本音を漏らす。 「夫が深夜まで帰らない」「義父の会社に入ったアトツギの妻として」 等の文脈を狙う。`,
  perplexity: `\n【Perplexity 向けチューニング】
あなたは Perplexity。 リアルタイム検索 + 引用必須の特性を活かし、 **直近 12 ヶ月の最新ニュース / 訴訟 / 労災 / 自殺 / 労基通報 / 倒産 / M&A** から当事者発言を 100 件。 単なる業界記事のまとめは禁止。 ニュース記事中の当事者コメント・SNS 引用・記者会見発言を一次情報として残す。`,
  gemini: `\n【Gemini 向けチューニング】
あなたは Gemini。 Google エコシステム強みで **YouTube / TikTok / Podcast / Google マップ レビュー** に強い。 工務店系 YouTube チャンネルのコメント欄・字幕・概要欄、 TikTok の建設業ハッシュタグ投稿、 Google マップ口コミ (★1-★2 中心) から 100 件。 動画系 SNS は他 AI が弱いので **Gemini の専売特許** として徹底的に探す。`,
}

const SATELLITE_BLOCKS: Record<NonNullable<SatelliteVoice>, string> = {
  wife: `\n【周辺当事者: 妻 / 彼女 / アトツギの母親】
役職本人ではなく、 その妻・彼女・親族の発信を主軸に。 「夫が現場監督」「彼氏が施工管理」「義父の工務店」「義母の経理手伝い」 等の文脈で、 ガールズちゃんねる・知恵袋・X・mama 系ブログから 100 件。 本人より周辺の方が本音を漏らす (本人は会社にバレるリスクで自重するが、 家族は自由)。`,
  accountant: `\n【周辺当事者: 経理 (社長妻 多い)】
小規模工務店の経理担当 = 社長妻 が ほぼ全件。 freee/弥生/MF の使いこなしできず、 月末締めで深夜まで作業、 旦那 (社長) が紙派で進まない 等の悲鳴。 主婦掲示板 / インスタ / 知恵袋から。`,
  subcontractor: `\n【周辺当事者: 下請 / 一人親方】
元請からの皺寄せを受ける側。 「上から無理な工期」「ANDPAD 強制された」「請求書フォーマット指定」「代金支払い遅延」 の生々しい愚痴。 一人親方ブログ / 助太刀のレビュー / X で。`,
  client: `\n【周辺当事者: 顧客 / 施主】
工務店の顧客側からのクレーム視点。 マイホーム検討者ブログ / e戸建て掲示板 / Google マップ口コミ ★1-★2 / 弁護士ドットコム相談 等から、 担当者の対応・施工品質・アフター対応の悲鳴。`,
  ob: `\n【周辺当事者: 退職者 / OB】
過去形で漏らす本音 (在職中は書けないが、 辞めた後は書ける)。 OpenWork / 退職代行系ブログ / Twitter 退職エントリ / 元◯◯ アカウント / 「辞めた」 系 note 記事 から。`,
  succession: `\n【周辺当事者: アトツギ (2 代目 3 代目)】
親世代との温度差を抱える 30-40 代の事業承継者。 アトツギ甲子園関連 / 中小企業庁 アトツギ ベンチャー記事 / X / note / アトツギ向けポッドキャスト から、 「父親の会社に入ったが」「IT 入れたいのに 60 代社長が」 等の悲鳴を集める。 軸 B 主顧客直撃。`,
}

const CONTRAST_BLOCKS: Record<NonNullable<ContrastAxis>, string> = {
  "mgmt-vs-field": `\n【対立軸: 経営者 vs 現場】
同じ事象を経営者視点と現場視点の **両方** から引用を取り、 認識の歪みを炙り出す。 例: 「DX 入れた経営者の自慢ツイート」 vs 「DX 強制された現場の愚痴」 を 1 ペアとして 50 ペア x 2 = 100 件。`,
  "master-vs-atotsugi": `\n【対立軸: 親方 vs アトツギ】
60 代社長 (親方世代) と 30-40 代アトツギ (息子娘世代) の業界観の温度差。 「IT なんていらん」 vs 「IT 入れないと潰れる」 の真っ向対立を 50 ペア取る。`,
  "rich-vs-poor": `\n【対立軸: 儲かってる工務店 vs 苦しい工務店】
年商 5 億超の儲かってる工務店オーナーの発信 (ホームページに事例公開、 取材記事) vs 年商 1 億未満の苦しい工務店の悲鳴 (廃業相談、 公庫融資断られた) を対比。 50 ペア。`,
  "tool-adopter-vs-rejecter": `\n【対立軸: ANDPAD 入れた工務店 vs 入れてない工務店】
ANDPAD 等の業界標準 SaaS を入れた工務店の声 (満足 / 後悔) と、 頑なに入れない工務店の理由 (高い / 職人使えない / 紙で十分) を対比。`,
  "small-vs-mid": `\n【対立軸: 個人事業主大工 vs 中堅工務店 (10-30 人)】
年商 / 規模 で悩みの種類がどう変わるか。 個人事業主は「来月の食い扶持」、 中堅は「人材定着」「経営承継」 が中心。 比較で経営フェーズ別の真の痛みを発見。`,
}

const FORCED_MEDIUM_LABEL: Record<ForcedMedium, string> = {
  youtube: "YouTube コメント欄 / 概要欄 / 字幕文字起こし",
  tiktok: "TikTok の建設業 / 工務店 / 大工 系ハッシュタグ投稿のコメント",
  podcast: "Apple Podcasts / Spotify の業界系 Podcast 文字起こし",
  "g2-capterra": "G2 / Capterra (海外 SaaS レビューで日本工務店ユーザー)",
  openwork: "OpenWork (旧 Vorkers) の工務店企業口コミ",
  "5ch": "5ch の建設業界スレ / 工務店スレ",
  退職代行: "退職代行サービスのブログ / 退職代行 X アカウント",
  "google-map-review": "Google マップ口コミ ★1-★2",
}

function buildForcedMediaBlock(media: ForcedMedium[]): string {
  if (media.length === 0) return ""
  const lines = media.map(
    (m, i) => `  ${i + 1}. ${FORCED_MEDIUM_LABEL[m]} — 最低 ${Math.ceil(100 / media.length / 2)} 件`,
  )
  return `\n【媒体多様化 (必須割当)】\n以下の媒体から **必ず最低 1 件ずつ** 引用を取ること。 SEO 記事・公式ヘルプに偏らないための強制制約:\n${lines.join("\n")}`
}

function buildTimeShiftBlock(): string {
  return `\n【時系列変化】
同じ業種・役職について、 以下 2 つの時期からそれぞれ 50 件ずつ取って **何が変わって何が変わってないか** を明示してください:
- 古い時期 (2019-2021 年): コロナ前後の悲鳴
- 直近 (2025-2026 年): 今の悲鳴

変化軸の例: DX 期待 → DX 監視ツール化 / 補助金歓迎 → 補助金疲れ / 人手不足 → 高齢化決定打。 構造変化が見えるペアは必ず引用に残す。`
}

function buildDevilsAdvocateBlock(): string {
  return `\n【Devil's Advocate モード】
まず最初に **この業界の通説を 3 つ** リストアップしてください (例: 「DX は良い」「補助金はありがたい」「ANDPAD は業界標準」)。
そのあと、 リストアップした 3 通説 **すべてを覆す当事者発言** を 100 件探してください。 通説を支持する発言は除外。 通説の真逆 / 副作用 / 隠れたコスト だけを集める。`
}

function buildRandomSeedBlock(seed: string): string {
  return `\n【今回の切り口 (固定)】
"${seed}"
この切り口に該当する発言だけを 100 件集めてください。 他の切り口の発言は除外。 同じ AI を毎回違う seed で叩くと違う窓が開く設計です。`
}

const DEFAULT_RANDOM_SEED_POOL = [
  "金銭面のみ",
  "メンタル面のみ",
  "家族関係のみ",
  "DX 逆効果のみ",
  "採用 / 離職のみ",
  "顧客クレームのみ",
  "代行入力 / 押し付けの皺寄せのみ",
  "監視 / 統制ストレスのみ",
  "補助金疲れのみ",
  "業界の暗黙ルール違反による悲鳴のみ",
]

/** UI の「ランダム seed 自動生成」 ボタン用。 同じ AI でも結果がぶれるように。 */
export function pickRandomSeed(): string {
  const idx = Math.floor(Math.random() * DEFAULT_RANDOM_SEED_POOL.length)
  return DEFAULT_RANDOM_SEED_POOL[idx]
}

export function buildDeepSearchPrompt({
  query,
  targetCount = 100,
  extraToolNotes,
  aiVariant = "neutral",
  devilsAdvocate = false,
  satelliteVoice = null,
  contrastAxis = null,
  timeShift = false,
  forcedMedia = [],
  randomSeed = null,
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

  // 多様性ブロックを組み立て
  const aiBlock = AI_VARIANT_BLOCKS[aiVariant]
  const satelliteBlock = satelliteVoice ? SATELLITE_BLOCKS[satelliteVoice] : ""
  const contrastBlock = contrastAxis ? CONTRAST_BLOCKS[contrastAxis] : ""
  const timeShiftBlock = timeShift ? buildTimeShiftBlock() : ""
  const forcedMediaBlock = buildForcedMediaBlock(forcedMedia)
  const devilsAdvocateBlock = devilsAdvocate ? buildDevilsAdvocateBlock() : ""
  const randomSeedBlock = randomSeed ? buildRandomSeedBlock(randomSeed) : ""

  return [
    SYSTEM_INTRO,
    aiBlock,
    "",
    "【調査対象】",
    `- 業界 / 業種: ${query.profileName}`,
    `- 視点 / 役職: ${query.role}`,
    `- 入り口キーワード (これだけに絞らず、 類義語・隣接概念・周辺当事者の口語も自分で広げて使うこと): ${query.keywords.join(", ")}`,
    phrasesLine,
    watchedToolsLine,
    trackLine,
    "",
    COVERAGE,
    satelliteBlock,
    contrastBlock,
    devilsAdvocateBlock,
    timeShiftBlock,
    forcedMediaBlock,
    randomSeedBlock,
    "",
    OUTPUT_FORMAT,
    "",
    `目標件数: ${targetCount} 件 (達成できなくとも質を優先, 一般論で水増ししない)`,
    `※ キーワードは入り口です。 業界の「常識を覆す洞察」 「逆効果問題」 「周辺当事者の声」 を能動的に探してください。`,
    extraToolNotes ? `\n【追加メモ】\n${extraToolNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}
