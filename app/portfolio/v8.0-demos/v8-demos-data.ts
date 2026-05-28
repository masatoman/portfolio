export type V8Demo = {
  id: string
  group: "A" | "B"
  starred?: boolean
  title: string
  category: string
  score: string
  baseScore: number
  extraScore: number
  verdict: string
  href: string
  hearingPage: string
  pain: string
  product: string
  pricing: string[]
  strengths: string[]
  risks: string[]
  devStatus: string
  progress: string
  progressPct: number
  todos: string[]
}

export const V8_DEMOS: V8Demo[] = [
  {
    id: "01",
    group: "A",
    starred: true,
    title: "OB 10 年管理 SaaS",
    category: "データ蓄積",
    score: "16",
    baseScore: 27,
    extraScore: 43,
    verdict: "✅ 本命採用",
    href: "/local-business/ob-management",
    hearingPage: "P02-P05",
    pain: "工務店は引渡し後の OB (既存顧客) との関係が紙台帳・記憶頼みで、 10 年点検・追加リフォーム機会を逃している。 アトツギ世代が「これ、 IT 化したい」 と最も強く言う領域。",
    product: "Next.js + Supabase + Stripe の SaaS。 顧客 / 物件 / 工事履歴 / 点検スケジュール / 連絡履歴を 1 画面で管理。 5 年・10 年点検アラート + ハガキ DM 連動 + LINE 通知。",
    pricing: [
      "SaaS: ¥9,800/月 (50 件) — ¥29,800/月 (500 件)",
      "BPaaS: 初期データ移行代行 ¥150,000 + 月次運用代行 ¥30,000-50,000",
      "JAPAN BUILD 出展時の実機実演に最適",
    ],
    strengths: [
      "アトツギ層の課題意識が最も明確",
      "10 年使い続けるロックイン効果",
      "BPaaS 初期データ移行で前金確保しやすい",
      "リフォーム再受注 ROI が説明しやすい",
    ],
    risks: [
      "既存 ANDPAD と機能重複の説明必要",
      "個人情報 (顧客住所) 取扱の信頼担保",
      "競合 (建築 CAD 系 OB 管理) と差別化要",
    ],
    devStatus: "ファイル 3 / 1,306 行 (page + demo + data)、 多摩エリア OB 18 件 demo data",
    progress: "90%",
    progressPct: 90,
    todos: ["BPaaS 初期データ移行フロー の UI 追加検討"],
  },
  {
    id: "02",
    group: "B",
    title: "コンテンツ自動生成 SaaS",
    category: "営業 / 集客",
    score: "16+α",
    baseScore: 25,
    extraScore: 37,
    verdict: "💡 保留枠",
    href: "/local-business/content-auto",
    hearingPage: "P06-P09",
    pain: "工務店のホームページ / Instagram / ブログ更新が止まっている。 現場写真は撮れているが文章化できず、 集客動線が機能していない。 アトツギは「父親世代に投稿を頼みたいが無理」 と諦め気味。",
    product: "Next.js + Supabase + Claude API の SaaS。 現場写真をアップ → AI が施工日報・SNS 投稿・ブログ記事を 3 形式自動生成。 過去記事の文体学習 + 多媒体一括投稿。",
    pricing: [
      "SaaS: ¥7,800/月 (10 記事) — ¥19,800/月 (50 記事)",
      "BPaaS: 完全代行 月 ¥80,000 (記事 8 + SNS 30 投稿)",
      "AI 学習データ初期セットアップ ¥50,000",
    ],
    strengths: [
      "学習コスト 0 (写真を上げるだけ)",
      "BPaaS の利益率高い (人件費薄い)",
      "成果指標 (記事公開数 / 流入数) が見える",
    ],
    risks: [
      "AI 生成バレ → ブランド毀損リスク",
      "「写真も撮らない」 工務店には響かない",
      "Claude API コストが利益を削る可能性",
    ],
    devStatus: "ファイル 3 (page + demo + data)、 写真 5 + 過去記事 12",
    progress: "85%",
    progressPct: 85,
    todos: ["AI バレ防止のための文体カスタマイズ UI"],
  },
  {
    id: "03",
    group: "A",
    title: "展示会リード育成 SaaS",
    category: "営業 / 集客",
    score: "16",
    baseScore: 28,
    extraScore: 40,
    verdict: "✅ 次点採用",
    href: "/local-business/lead-cultivation",
    hearingPage: "P10-P13",
    pain: "展示会で集めた名刺・アンケートが ExcelやGoogle Forms に放置され、 フォローアップが止まる。 12/2-4 JAPAN BUILD TOKYO 出展時の自社実装ショーケースに最適。",
    product: "Next.js + Supabase + LINE/メール連携。 名刺撮影 → OCR → リード DB 化 + 自動温度感スコアリング + 個別 follow-up テンプレ生成 + 行動履歴可視化。",
    pricing: [
      "SaaS: ¥4,800/月 (100 リード) — ¥14,800/月 (1000 リード)",
      "BPaaS: 展示会後 30 日 フォローアップ代行 ¥80,000",
      "JAPAN BUILD で実機実演 → そのまま受注の流れ作る",
    ],
    strengths: [
      "JAPAN BUILD 出展時の実機実演 ROI 最強",
      "展示会層 (5/22 確定ターゲット) に直撃",
      "助成事業 R8 (展示会出展 ¥150 万) と相性 ◎",
    ],
    risks: [
      "展示会出展していない工務店には響かない",
      "名刺 OCR 精度が低いと致命傷",
      "リード品質より量で評価される業界慣習",
    ],
    devStatus: "ファイル 1 (single-file)、 リード 40 件 demo data",
    progress: "85%",
    progressPct: 85,
    todos: ["12 月 JAPAN BUILD で実機実演する場合の名刺撮影 (実機カメラ連携) 検討"],
  },
  {
    id: "04",
    group: "A",
    title: "経営状況可視化レポート",
    category: "経営可視化",
    score: "16",
    baseScore: 23,
    extraScore: 41,
    verdict: "💡 副軸採用",
    href: "/local-business/business-metrics",
    hearingPage: "P14-P16",
    pain: "工務店の経営判断が「勘」 と「税理士の年次決算」 頼り。 月次の粗利率 / 工事進捗 / 売掛回収を可視化したいがツールが高すぎ (kintone カスタマイズ 月 ¥20 万)。 アトツギは数字で父親を説得したい。",
    product: "Next.js + Supabase + 弥生 / freee 連携。 工事原価 / 売上 / 売掛 / 入金予定 を月次自動集計 + SVG グラフ可視化 + 月次レポート PDF 自動生成。",
    pricing: [
      "SaaS: ¥6,800/月 — ¥19,800/月 (工事案件無制限)",
      "BPaaS: 月次レポート作成代行 ¥30,000",
      "会計ソフト連携 API 設計 ¥100,000",
    ],
    strengths: [
      "アトツギの父親説得材料として強力",
      "助成金申請 (経営分析データ) と相性 ◎",
      "数字で見せる → 競合差別化しやすい",
    ],
    risks: [
      "会計ソフト連携の技術障壁高い",
      "経理 = 妻 (60 代) 操作不能なら BPaaS 必須",
      "弥生 / freee 側の API 利用ライセンス審査",
    ],
    devStatus: "ファイル 1 (single-file)、 SVG グラフ 4 種 + 工事 20 件",
    progress: "90%",
    progressPct: 90,
    todos: ["会計ソフト (弥生 / freee) 連携 API 想定 (商品確定後)"],
  },
  {
    id: "07",
    group: "B",
    title: "暗黙知継承 AI",
    category: "業務支援 / AI",
    score: "16",
    baseScore: 24,
    extraScore: 39,
    verdict: "💡 保留枠",
    href: "/local-business/tacit-knowledge",
    hearingPage: "P17-P19",
    pain: "親方の経験 (失敗事例・判断基準・現場の勘) が引退と共に消える。 アトツギは「親父の頭の中をデータ化したい」 と本気で言う。 業界全体の 30-40 代キーパーソンに刺さるテーマ。",
    product: "Next.js + Supabase + Claude API。 親方の口述記録 → AI 構造化 → 「こういう時どう判断する?」 Q&A bot 化。 失敗事例 DB + 写真連携で現場判断補助。",
    pricing: [
      "SaaS: ¥9,800/月 (Q&A 50 件) — ¥29,800/月 (無制限)",
      "AI エージェント カスタム: 月 ¥50,000-150,000 (一社一カスタム)",
      "初期口述記録代行 (10 時間) ¥150,000",
    ],
    strengths: [
      "アトツギ層に「父親リスペクト」 で響く",
      "一社一カスタムで高単価維持",
      "業界紙取材ネタとして強力",
    ],
    risks: [
      "口述記録の初期負担が大きい (親方協力必須)",
      "AI 精度が現場判断に耐えるか未検証",
      "親方が引退間際 = 急ぐが高齢 IT 弱者層",
    ],
    devStatus: "ファイル 2、 親方口調 Q&A 18 + エピソード 32 件 (多摩エリア整合)",
    progress: "85%",
    progressPct: 85,
    todos: ["親方口調の追加バリエーション (西多摩弁 等)"],
  },
  {
    id: "10",
    group: "B",
    title: "カスタム住宅シミュレーター",
    category: "業務支援 / AI",
    score: "14",
    baseScore: 24,
    extraScore: 32,
    verdict: "💡 ユニーク",
    href: "/local-business/home-simulator",
    hearingPage: "P20-P21",
    pain: "工務店の見積もり提示が建材カタログ + 手書きスケッチ + Excel で時間かかる。 個人客 (9 割) との打ち合わせが「サンプル取り寄せ」 で 1 週間ロスする。 即決商談に持ち込めない。",
    product: "Next.js + Three.js / SVG。 2LDK 平面図ベース + 建材 13 種 + 仕入先 3 社 連動 + 即時概算見積もり生成。 タブレットで顧客と一緒に組み立てる UX。",
    pricing: [
      "SaaS: ¥12,800/月 (建材 30 点) — ¥34,800/月 (無制限)",
      "建材データ初期セットアップ ¥200,000",
      "仕入先 API 連携 ¥150,000-300,000",
    ],
    strengths: [
      "商談即決率向上 (体験価値)",
      "ユニーク性高い (競合少ない)",
      "デモが映える (展示会で目を引く)",
    ],
    risks: [
      "建材データ管理の運用コスト",
      "Three.js 学習コスト",
      "規模感が大きく初期投資重い",
    ],
    devStatus: "ファイル 3、 建材 13 + 仕入先 3 社、 SVG 2LDK 平面図",
    progress: "85%",
    progressPct: 85,
    todos: ["建材データ更新フローの BPaaS 化検討"],
  },
]

export type V8Doc = {
  label: string
  path: string
  description: string
}

export const V8_DOCS: V8Doc[] = [
  {
    label: "評価マトリクス (4 AI 合議)",
    path: "/docs/v8.0/v8.0-product-candidates-evaluation-2026-05-23.html",
    description: "Claude / ChatGPT / Gemini / Grok 4 AI 合議による 10 商品候補の評価マトリクス。 基礎 6 軸 (/30) + 追加 10 観点 (/50) で 6 デモを採用判定 (本命 / 次点 / 副軸 / 保留 / ユニーク)。 P02-P21 が各デモ詳細。",
  },
  {
    label: "ヒアリング資料 (相手共有用)",
    path: "/docs/v8.0/v8.0-hearing-resource-2026-05-23.html",
    description: "友人 / 紹介者 / アトツギ層に見せる用 ヒアリング資料。 6 デモを公開可能な範囲で 1 ページずつ紹介 + 反応取得用設問。 内部スコア / 採用判定は伏せている。",
  },
  {
    label: "内部設計 (ヒアリング設計)",
    path: "/docs/v8.0/v8.0-hearing-design-2026-05-23.html",
    description: "ヒアリング Phase 3 (30 分セッション) の質問設計 + 反応分類フレーム + フォローアップ方針。 友人 N=1 ヒアリングで「どのデモが刺さるか」 順位付け検証。",
  },
  {
    label: "JAPAN BUILD TODO (12/2-4)",
    path: "/docs/operations/japan-build-tokyo-2026-todo-2026-05-23.html",
    description: "12/2-4 JAPAN BUILD TOKYO 出展候補に向けた TODO リスト。 展示会出展助成 (R8 / 限度額 ¥150 万 / 助成率 2/3) 第 5 回 8/1-8/14 or 第 6 回 9/1-9/14 応募スケジュール込み。",
  },
]
