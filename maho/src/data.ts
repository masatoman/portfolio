export type Trait = {
  title: string;
  description: string;
  /** その特徴まで絞り込んだ時点の推定該当者数 (一般 → 本人へ寄っていく演出用) */
  narrowing: string;
  special?: boolean;
};

export const traits: Trait[] = [
  {
    title: "年上",
    description: "少し年上で、頼れるような、頼れないような男性。",
    narrowing: "推定該当者 約2,800万人",
  },
  {
    title: "同じ職場",
    description: "意外と運命の相手は、遠くではなく身近にいるらしい。",
    narrowing: "推定該当者 約30人",
  },
  {
    title: "ITエンジニア",
    description: "パソコンを触っている時間が異常に長い。",
    narrowing: "推定該当者 約4人",
  },
  {
    title: "ENTP",
    description: "よく喋る。好奇心が強い。ちょっと変。",
    narrowing: "推定該当者 約1.3人",
  },
  {
    title: "話していると時間を忘れる人",
    description:
      "気づいたら何時間も話してしまう相手は、相性がいい可能性が高いらしい。",
    narrowing: "推定該当者 1人",
  },
  {
    title: "マホのためにアプリまで作る男",
    description: "……そんなやついる？",
    narrowing: "該当者 いま画面の向こうに1人",
    special: true,
  },
];

export const analyzingMessages = [
  "マホの恋愛傾向を解析中…",
  "性格データを照合中…",
  "相性の良い男性を検索中…",
  "候補者を絞り込み中…",
  "かなり怪しい人物を発見しました…",
];

export const MATCH_RATE = 98.7;
