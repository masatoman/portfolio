// 既存 issue を踏まえて、 友人 (1 人ヒアリング相手) にぶつけられる
// 質問 15-20 問を AI 生成するプロンプト。
//
// gap-analysis-prompt は「次に web で集めるべき切り口」 を作るのに対し、
// これは「目の前の友人に直接ぶつけて 一次情報で確度を上げる質問」 を作る。
// 出口は LINE / 対面 / Zoom で 1 回 30-60 分の聞き取りに使える状態。

import type { Issue } from "./types"

const SYSTEM_INTRO = `あなたは中小企業の業務改善 SaaS を作る個人開発者のリサーチパートナーです。 既存収集 issue (web から拾った悲鳴のクラスタ) を踏まえて、 ヒアリング相手 1 人にぶつけられる質問リストを作る役割を担います。

※ このタスクは Web 検索ではなく **質問設計** です。 Deep Research モードや Pro Search は OFF で OK。`

const GOOD_QUESTION_PRINCIPLES = `【良い質問の原則 — 守ること】
1. **クローズドではなくオープン**: 「ありますか?」 ではなく「最近一番ストレスだったのは何でしたか?」
2. **数字で答えられる質問を混ぜる**: 週 N 回 / 月 N 時間 / 月いくら / N 人中 N 人 等
3. **過去の具体的エピソードを聞く**: 「直近 1 週間で 〇〇 した時の話を教えてください」
4. **解決策を聞かない**: 「どうしたら良いと思う?」 は禁止。 ユーザーは解を持っていない (本書 The Mom Test)
5. **既存 issue の仮説検証型を混ぜる**: 「〇〇 という悲鳴を web で見たんですが、 ◯◯ さんの現場でも当てはまる?」
6. **金額の感覚値を聞く**: 「もし この問題を解く道具があったら 月いくらまでなら払いそう?」 (高めから聞く)
7. **本当に困っている層の特定**: 「同業者 10 人いたとして、 同じ悲鳴を持ってそうな人は何人くらい?」
8. **回避策の聞き出し**: 「今その問題は どうやって 凌いでる?」 (=既存代替案 = 競合)

【避けるべき質問】
- 「DX 必要だと思いますか?」 等 抽象論
- 「もし SaaS があったら使いますか?」 等 仮定法 (= ほぼ嘘の答えになる)
- 「なぜ?」 を 3 回以上 (詰問になる)`

const OUTPUT_FORMAT = `【出力フォーマット】

# ヒアリング質問リスト ({focus 対象})

## 0. 質問の前提 (3-5 行)
- ヒアリングの目的 1 行
- 相手に最初に伝えるべきこと (録音可否 / 公開可否 / 所要時間 30-60 分 程度)
- 今回特に裏取りしたい既存 issue 3 件 (タイトル + value)

## 1. アイスブレイク (3-5 問)
- 最近の現場 / 仕事の状況 / 規模感 を聞く軽い質問

## 2. 既存 issue 仮説検証ブロック (5-7 問)
各質問に「対応する既存 issue # と title」 を明記し、 値の検証を狙う:
- Q. 「〇〇 (仮説)」 という悲鳴を web で見ました、 ◯◯ さんの場合は?
- Q. 既存 issue では emotion=N と推定されてますが、 体感どのくらい? (10 段階)
- Q. 既存 issue では cluster_size=N と頻度推定されてますが、 体感の頻度は?

## 3. 抜けてる切り口の探索ブロック (3-5 問)
今 DB に無いが、 友人が漏らしそうな話を引き出す質問:
- Q. 同業の知人で「うちは違うかも」 と思う会社はある?
- Q. 1 年前と今で、 一番変わったのは?
- Q. 妻 / 親 / 上司 から最近言われたことで残ってる言葉は?

## 4. 金額・購買意思ブロック (3-5 問)
SaaS / BPaaS / AI エージェント の値付け感を取りに行く:
- Q. もし 〇〇 を解決する道具があれば、 月 N 万まで払いますか? (高め N=10 から下げる)
- Q. 同業者 10 人中 何人 払いそう? (友人の所見)
- Q. 今その問題を凌ぐために 月いくら 払ってる? (時間コスト含む)
- Q. 払うとしたら誰の判断? (社長 / 妻 / 自分)

## 5. クロージング (2-3 問)
- Q. 同じ立場の人を 1 人 紹介してもらえますか?
- Q. 今日話してもらった中で、 もう一度 別の機会に詳しく聞きたいトピックは?
- Q. 今回のヒアリングで「これは聞かれなかったが言いたかった」 ことはありますか?

# 質問の合計件数: 16-25 問 (30-60 分でこなせる量)`

const SAFETY_NOTE = `【安全装置】
- 質問数 は 16-25 問 が limit (友人を疲れさせない)
- 既存 issue の単なるコピペは禁止 — 必ず「仮説検証として聞き直す」 形に変換
- 友人 1 人なので統計的代表性は出ない。 「N=1 で何が分かるか」 ではなく「N=1 で何が言い切れるか」 を狙う質問にする`

export type BuildHearingPromptOptions = {
  issues: Issue[]
  /** 必須: 「komuten / 現場監督」 等の絞り対象 */
  focus: { profileId: string; role: string }
  /** ヒアリング相手の属性 (例: 「友人、 中堅工務店 5 年目現場監督、 30 代後半」) */
  intervieweeProfile?: string
  /** ヒアリング所要時間目安 (デフォルト 60 分) */
  durationMin?: number
}

function tierLabel(t: Issue["issueDrivenTier"] | undefined): string {
  if (t === "value-zone") return "🟢"
  if (t === "needs-rework") return "🔶"
  if (t === "promising") return "🟡"
  if (t === "dog-path") return "⚪"
  return "◌"
}

function renderFocusedIssueList(issues: Issue[]): string {
  const sorted = [...issues].sort(
    (a, b) => (b.issueDrivenValue ?? -1) - (a.issueDrivenValue ?? -1),
  )
  return sorted
    .map(
      (i, idx) =>
        `${idx + 1}. ${tierLabel(i.issueDrivenTier)} [value=${i.issueDrivenValue ?? "-"}] ${i.title}\n   E=${i.essentialChoice ?? "-"} / H=${i.hypothesisDepth ?? "-"} / A=${i.answerable ?? "-"} | cluster ${i.clusterSize ?? "-"}/${i.samplingTotal ?? "-"} (${i.clusterSize && i.samplingTotal ? Math.round((i.clusterSize / i.samplingTotal) * 100) : "-"}%) | emotion ${i.emotionScore}`,
    )
    .join("\n")
}

export function buildHearingScriptPrompt({
  issues,
  focus,
  intervieweeProfile,
  durationMin = 60,
}: BuildHearingPromptOptions): string {
  const focusedIssues = issues.filter(
    (i) => i.profileId === focus.profileId && i.role === focus.role,
  )

  const intervieweeLine = intervieweeProfile
    ? `\n【ヒアリング相手の属性】\n${intervieweeProfile}`
    : ""

  return [
    SYSTEM_INTRO,
    intervieweeLine,
    "",
    `【🎯 focus】\n対象: **${focus.profileId} / ${focus.role}** — この perspective に絞った ${focusedIssues.length} 件の既存 issue を踏まえて 質問を組み立ててください。`,
    `【ヒアリング所要時間目安】 ${durationMin} 分`,
    "",
    "【既存 issue 一覧 (focus 対象、 value 順)】",
    renderFocusedIssueList(focusedIssues),
    "",
    GOOD_QUESTION_PRINCIPLES,
    "",
    SAFETY_NOTE,
    "",
    OUTPUT_FORMAT.replace("{focus 対象}", `${focus.profileId} / ${focus.role}`),
  ]
    .filter(Boolean)
    .join("\n")
}
