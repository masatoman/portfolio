import type { Issue } from "./types"

// 「現場監督」テーマで実際に WebSearch を 8 クエリ並列実行し、
// 約 105 件のサンプルから 8 クラスタを生成した実テスト結果。
// 2026-05-10 / Day 1 / cycle 1 / target: 工務店・建設業 → 現場監督

export const SAMPLE_RAW_TEXT = `Yahoo!知恵袋・建設業まとめサイトより抜粋

【1】工務店の現場監督やってます。日中は現場周り、写真撮影、職人さんの調整で潰れて、夜 21 時から事務所戻って写真台帳と日報を作る毎日。家に帰ると 23 時超え。土曜も写真整理で半日溶ける。妻からは「いつ家にいるの」と毎週言われる。Excel でファイル名つけ直して台帳に貼っての作業、全部スマホで撮ってる写真をまとめるのにマジで時間かかる。

【2】建設会社の総務です。職人さんから「見積出して」って電話が現場から入るんだけど、こっちは紙の単価表見ながら手書きで作って FAX 送ってる。間違いも多いし、客から「もう他に頼んだ」って言われることもある。でも社長が IT 嫌いで PC 入れさせてくれない。みんな疲弊してる。

【3】内装業 個人事業主。請求書と領収書の整理、確定申告期に毎年泣いてる。レシートが車のダッシュボードに溜まってて、奥さんに頼んで Excel 入力してもらってるけど 1 ヶ月分で 1 日仕事。会計ソフトも入れたいけど何選べばいいか分からん。補助金あるって聞いたけど書類作る時間がそもそもない。

【4】塗装屋の現場監督。1日に何件も現場回るんだけど、移動中の車内で電話かかってきて指示出すのが多い。耳で聞いた話を覚えてられない。書きたくても運転中だから書けない。事務所戻ったら忘れてて、職人さんから「あの件どうなりました」って言われて青ざめる毎日。

【5】小規模工務店の現場監督。施主からのクレーム対応の記録が紙ベースで、誰がいつ何を言ったか後でわからなくなる。裁判沙汰になったケースもあって、もう紙はやめたい。でも社長が「今までこれでやってきた」と聞かない。`

const TODAY_ISO = new Date("2026-05-10T09:00:00+09:00").toISOString()

export const SAMPLE_ISSUES: Issue[] = [
  {
    id: "cluster-overtime-50-100h",
    title: "現場監督の残業 50-100 時間／月が業界全体に蔓延",
    painSummary:
      "建設業の現場監督の平均残業は月 50 時間以上、100 時間超のケースも珍しくない。一般労働者の月 13.3 時間と比較し約 4 倍。工期厳守・天候トラブル・属人的な書類業務が複合的に効いて削れない。",
    episode:
      "平均残業 50 時間超、100 時間以上の現場監督も多数存在する。サービス残業も蔓延しており、政府調査でも記録されない時間外労働が多い。",
    emotionScore: 78,
    issueScore: 72,
    solvabilityScore: 40,
    scoreReason:
      "105 件中最大クラスタ (21%) + 訴訟・離職・家庭崩壊に直結 (業界インパクト最大級) + 高感情。技術ツールでは部分解決しかできず solv は中。",
    subsidyTags: ["it-introduction", "none"],
    industryTags: ["建設", "工務店", "業界全体"],
    sourceUrl: "https://lline-group.co.jp/magazine/seko-kanri-kitui/",
    sourceExcerpt: "建設業の現場監督の平均残業は月 50 時間以上",
    sourceType: "blog",
    createdAt: TODAY_ISO,
    clusterSize: 22,
    samplingTotal: 105,
    relatedQuotes: [
      {
        excerpt:
          "夜 21 時から事務所戻って写真台帳と日報を作る毎日。家に帰ると 23 時超え。",
        sourceUrl:
          "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10290724340",
      },
      {
        excerpt:
          "2024 年の建設業時間外規制が入っても実質的に解消されない構造が残る。",
        sourceUrl:
          "https://service.buildee.jp/workstyle/ws_mag017/",
      },
      {
        excerpt: "現場の進捗と書類業務で常に脳内リソースがフル稼働。",
        sourceUrl: "https://solal-sp.com/jobkatsu/construction/32/",
      },
    ],
  },
  {
    id: "cluster-unpaid-overtime",
    title: "残業代未払い・「管理監督者」誤認による訴訟リスク多発",
    painSummary:
      "会社が「現場監督は管理監督者だから残業代不要」と扱うが、労基法上は実態判定 (時間裁量・採用権限・給与水準) で決まる。実態が伴わないケースが多く、訴訟・労基相談が頻発。",
    episode:
      "現場監督が管理監督者を理由に残業代不払いされているケースは広範囲。実態がそぐわない場合、過去 3 年分の請求が可能で、月 100 時間残業なら数百万円の未払いが発生する。",
    emotionScore: 82,
    issueScore: 66,
    solvabilityScore: 30,
    scoreReason:
      "105 件中 14% で訴訟リスクとして言及。弁護士・税理士コラムが大量にヒット = 経営者側の混乱が大きい証拠。労務管理問題で IT/SaaS では解けない。",
    subsidyTags: ["none"],
    industryTags: ["建設", "工務店", "訴訟リスク"],
    sourceUrl:
      "https://zangyoudai.nishinomiya-kitaguchi-law.com/sitesupervisor/",
    sourceExcerpt:
      "現場監督・施工管理技士の残業代請求 6 ポイント",
    sourceType: "blog",
    createdAt: TODAY_ISO,
    clusterSize: 15,
    samplingTotal: 105,
    relatedQuotes: [
      {
        excerpt:
          "建設業における残業代の考え方 — 管理監督者の判断は職位ではなく実態で決まる。",
        sourceUrl:
          "https://www.saitama-bengoshi.com/mimiyori/20230904-10/",
      },
      {
        excerpt:
          "弥生・マネーフォワードまで残業代解説記事 = 経営者側の混乱が大きい。",
        sourceUrl: "https://www.yayoi-kk.co.jp/kyuyo/oyakudachi/kanrisyoku_zangyo/",
      },
      {
        excerpt:
          "厚労省データでも記録されない時間外労働 (サービス残業) が建設業で蔓延。",
        sourceUrl: "https://www.vbest.jp/roudoumondai/columns/4790/",
      },
    ],
  },
  {
    id: "cluster-photo-album-daily-report",
    title: "写真台帳・日報の事務作業残業 (SaaS で 1/4 削減事例あり)",
    painSummary:
      "日中の現場業務後に事務所で写真台帳・日報を Excel で作成する。テンプレ + AI 画像認識 + クラウド共有の SaaS が既に存在し、導入企業は写真台帳作成残業を 1/4 まで削減した実績がある。技術的には完全に解決済みだが導入が進んでいない。",
    episode:
      "Furukawa Electric では工事写真アプリ導入で、写真台帳作成にかかる残業時間を 1/4 まで削減した。",
    emotionScore: 72,
    issueScore: 64,
    solvabilityScore: 85,
    scoreReason:
      "17% クラスタ + IT 導入補助金 / 持続化補助金の両方に直結 + 既存解決事例明確 (1/4 削減)。masatoman の事業ど真ん中、Pickup 推奨。",
    subsidyTags: ["it-introduction", "jizokuka"],
    industryTags: ["建設", "工務店"],
    sourceUrl: "https://www.kentem.jp/blog/construction-supervisor-overtime/",
    sourceExcerpt:
      "写真台帳作成にかかる残業時間を 1/4 まで削減した事例",
    sourceType: "blog",
    createdAt: TODAY_ISO,
    clusterSize: 18,
    samplingTotal: 105,
    relatedQuotes: [
      {
        excerpt:
          "建設業向け作業日報テンプレート Excel が大量検索されている = まだ Excel 運用が支配的。",
        sourceUrl: "https://andpad.jp/columns/0073",
      },
      {
        excerpt:
          "業務時間外の日報作成は残業代支給対象 — Excel 運用が直接残業を生んでいる。",
        sourceUrl: "https://column.nippoukun.bpsinc.jp/nippou-overtime/",
      },
      {
        excerpt:
          "工事写真アプリ・クラウド共有 SaaS が大量に存在 = 市場が立ち上がっている。",
        sourceUrl: "https://www.aspicjapan.org/asu/article/44455",
      },
      {
        excerpt:
          "AI 画像認識で必要事項を自動入力するアプリも登場。",
        sourceUrl: "https://www.miraikoji.com/column/11657/",
      },
    ],
  },
  {
    id: "cluster-1st-year-quitting",
    title: "1 年目で「やめたい」と検索する若手が大量、業界の人材流出を加速",
    painSummary:
      "業務量・責任重圧・上司怒鳴り・私生活ゼロ の四大原因で 1 年目から離職検討。「現場監督 1 年目 やめたい」が SEO で大量にヒット = 市場規模大。",
    episode:
      "1 年目の現場監督ですが配属 1 ヶ月で辞めたいです。仕事量が多すぎて、責任が重く、上司から怒鳴られ、私生活がない。(知恵袋)",
    emotionScore: 82,
    issueScore: 58,
    solvabilityScore: 45,
    scoreReason:
      "13% クラスタ。人材流出 = 業界存続問題で issue 中〜高、 ただし単一ツールでは解決不能 (組織変革 + 教育環境)。masatoman の補助金支援文脈で『人材定着 DX』ポジは可能。",
    subsidyTags: ["none"],
    industryTags: ["建設", "工務店", "若手"],
    sourceUrl:
      "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11262718831",
    sourceExcerpt:
      "1 年目の現場監督です。配属されて 1 ヶ月が経ちました。",
    sourceType: "chiebukuro",
    createdAt: TODAY_ISO,
    clusterSize: 14,
    samplingTotal: 105,
    relatedQuotes: [
      {
        excerpt:
          "若手・新卒が施工管理を辞める 6 つの原因 — 1 年目を待たずに離職する事例多数。",
        sourceUrl: "https://tonton-job.com/column/4417/",
      },
      {
        excerpt:
          "全体像が見えないのに責任だけ重い、何が正解か分からないまま叱られる。",
        sourceUrl: "https://media.builderscareer.com/column/genbakantoku-1nenme/",
      },
      {
        excerpt:
          "向いていないと感じる若手が多いが、実態は教育環境の問題。",
        sourceUrl: "https://genba-lab.com/2025/02/10/for-quit-construction-management/",
      },
    ],
  },
  {
    id: "cluster-family-impact",
    title: "現場監督の妻・恋人側の悲鳴 (家族関係への影響)",
    painSummary:
      "夫が施工管理を続ける家族側が「いつ家にいるの」「健康が心配」と訴えるケースが多発。恋愛・結婚に支障をきたす投稿も SEO 上位に。探偵事務所の『失踪夫』記事まで紛れる。",
    episode:
      "施工管理 12-13 年の夫が午前 0 時前に帰ってくることはほぼない、複数現場のときは帰ってこないこともある、家でもノート PC 開いて働く。健康が心配。",
    emotionScore: 92,
    issueScore: 49,
    solvabilityScore: 60,
    scoreReason:
      "10% クラスタ + 家族側という新しい角度 + 高感情。離職トリガになりうる重要シグナル。技術より組織変革が必要だが、業務効率化 SaaS の間接効果で解消可能性あり。",
    subsidyTags: ["it-introduction"],
    industryTags: ["建設", "工務店", "家族側"],
    sourceUrl: "https://www.miyoshi-komuten.com/blog/column/169959",
    sourceExcerpt:
      "彼氏が現場監督で彼女が抱くストレスとは？",
    sourceType: "blog",
    createdAt: TODAY_ISO,
    clusterSize: 10,
    samplingTotal: 105,
    relatedQuotes: [
      {
        excerpt:
          "現場監督が恋愛できない 5 つの理由と解決方法。",
        sourceUrl: "https://kensetsu-gyokai.com/genbakantoku-renai/",
      },
      {
        excerpt:
          "施工管理の彼氏と結婚 — 帰宅時間と精神的負担についての配偶者ブログ。",
        sourceUrl: "https://www.overcome1.com/2020/03/20/construction-work/",
      },
      {
        excerpt:
          "失踪 (家出) した夫の探し方 — 探偵事務所までキーワードに紛れる。",
        sourceUrl: "https://sat-sagasu.com/iede-tsuma",
      },
    ],
  },
  {
    id: "cluster-craftsman-conflict",
    title: "職人との段取り喧嘩・命令口調トラブル",
    painSummary:
      "現場監督と職人の段取り認識違いで喧嘩発生。雨で工事止めると職人収入減 → 監督に怒り。若手監督の命令口調が NG とされ、人間関係疲弊で離職要因にもなる。",
    episode:
      "現場監督と職人さんが喧嘩する 5 つのケース — 段取りの悪さ、雨での停止、若手監督の命令口調、優先順位違い等。",
    emotionScore: 70,
    issueScore: 42,
    solvabilityScore: 55,
    scoreReason:
      "11% クラスタ。段取り共有ツールで部分解決可能 (solv 中)。人間関係問題なので IT で完全解決は無理だが、現場可視化 SaaS の効果はある。",
    subsidyTags: ["it-introduction"],
    industryTags: ["建設", "工務店", "職人"],
    sourceUrl: "https://sekokan-navi.jp/magazine/57966",
    sourceExcerpt:
      "現場監督と職人の不毛な争いがなくならない理由",
    sourceType: "blog",
    createdAt: TODAY_ISO,
    clusterSize: 12,
    samplingTotal: 105,
    relatedQuotes: [
      {
        excerpt:
          "ムカつく現場監督あるある 7 選 — 命令口調・段取り悪さが上位。",
        sourceUrl:
          "https://www.jp-wat.com/column/construction-news/job/genbakantoku-mukatsuku/",
      },
      {
        excerpt:
          "現場監督 2 年目女性、職人さんとトラブル — 知恵袋投稿。",
        sourceUrl:
          "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10238324865",
      },
      {
        excerpt:
          "職人に好かれる現場監督がやっている 3 つのこと — note にまとまる現場知恵。",
        sourceUrl: "https://note.com/ripe_thyme6404/n/n40ce69e153c7",
      },
    ],
  },
  {
    id: "cluster-multi-responsibility",
    title: "5 大管理 + 近隣対応の同時並行で脳内疲弊",
    painSummary:
      "工程・品質・安全・原価・環境 の 5 領域 + 近隣対応 + 発注者対応 を同時並行。会議・現場巡回・写真管理・書類作成・発注・調整 が頻繁に切り替わり、脳内リソースがフル稼働で疲弊。",
    episode:
      "5 大管理 (工程・品質・安全・原価・環境) や近隣対応など多領域を同時並行で扱い、関係者も多く、常に脳内リソースがフル稼働となり疲弊しやすい。",
    emotionScore: 65,
    issueScore: 36,
    solvabilityScore: 50,
    scoreReason:
      "8% クラスタ。タスク管理 SaaS / 一元化ダッシュボードで部分対応可能だが、業務本質は『判断と調整』なのでツールでは解けない核心がある。",
    subsidyTags: ["it-introduction"],
    industryTags: ["建設", "工務店"],
    sourceUrl: "https://solal-sp.com/jobkatsu/construction/32/",
    sourceExcerpt:
      "施工管理は本当に『きつい』？現役が語るリアルな実態",
    sourceType: "blog",
    createdAt: TODAY_ISO,
    clusterSize: 8,
    samplingTotal: 105,
    relatedQuotes: [
      {
        excerpt:
          "施工管理がきつい理由 10 選 — 多責任・多領域・複雑関係性。",
        sourceUrl: "https://lline-group.co.jp/magazine/seko-kanri-kitui/",
      },
      {
        excerpt:
          "現役が語るリアル — 5 大管理を同時にやらされる感覚。",
        sourceUrl:
          "https://sekokan-next.worldcorp-jp.com/column/jobs/7305/",
      },
    ],
  },
  {
    id: "cluster-morning-prep",
    title: "朝礼・早朝段取りの常態化 (6 時起き出勤)",
    painSummary:
      "朝礼 8:00-8:20 必須 + 段取りが現場監督の業務の 70% を占めるとされ、6 時台には現場入りが普通。退勤の遅さと合わせて 14-16 時間労働になりやすい。",
    episode:
      "現場監督は段取り 70% — 朝礼前の準備、当日の作業確認、職人への指示出しが朝のうちに集中。建築現場の出勤〜朝礼編が業界メディアで定番化。",
    emotionScore: 50,
    issueScore: 17,
    solvabilityScore: 30,
    scoreReason:
      "6% クラスタ。業界文化として既知・定着 (改善余地小)。技術での解決が難しく、emotion も中程度。低優先で OK。",
    subsidyTags: ["none"],
    industryTags: ["建設", "工務店"],
    sourceUrl: "https://genba-lab.com/2023/03/16/morning-assembly-plan/",
    sourceExcerpt:
      "劇的に伝わる現場の朝礼術 — 段取り 70% の現場監督業務",
    sourceType: "blog",
    createdAt: TODAY_ISO,
    clusterSize: 6,
    samplingTotal: 105,
    relatedQuotes: [
      {
        excerpt:
          "建築現場の 1 日の流れ (出勤〜朝礼編) — 業界メディアの定番記事。",
        sourceUrl:
          "https://www.to-wa.co.jp/2022/12/28/%E5%BB%BA%E7%AF%89%E7%8F%BE%E5%A0%B4%E3%81%AE%EF%BC%91%E6%97%A5%E3%81%AE%E6%B5%81%E3%82%8C%EF%BC%88%E5%87%BA%E5%8B%A4%EF%BD%9E%E6%9C%9D%E7%A4%BC%E7%B7%A8%EF%BC%89/",
      },
      {
        excerpt:
          "朝礼のコツ — 緊張しない × ネタ切れしない 3 つの方法。",
        sourceUrl:
          "https://www.jp-wat.com/column/construction-news/job/genbakantoku-chorei/",
      },
    ],
  },
]
