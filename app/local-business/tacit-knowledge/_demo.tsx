"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Hammer,
  HardHat,
  HelpCircle,
  History,
  MessageCircle,
  Mic,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Tag,
  Truck,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// =============================================================
// Types & demo data — 親方の語りデータ (ハードコード)
// =============================================================

type CategoryKey =
  | "estimate"
  | "network"
  | "supply"
  | "trouble"
  | "construction"

type Category = {
  key: CategoryKey
  label: string
  short: string
  Icon: typeof Hammer
  accent: string
  description: string
}

const categories: Category[] = [
  {
    key: "estimate",
    label: "見積もり",
    short: "見積",
    Icon: HardHat,
    accent: "#b45309",
    description: "値付け / 値引きライン / 利益率の感覚",
  },
  {
    key: "network",
    label: "職人ネットワーク",
    short: "職人",
    Icon: Hammer,
    accent: "#1d4ed8",
    description: "誰に頼むか / クセ / 連絡の取り方",
  },
  {
    key: "supply",
    label: "仕入れ",
    short: "仕入",
    Icon: Truck,
    accent: "#15803d",
    description: "建材屋 / 値交渉 / 在庫タイミング",
  },
  {
    key: "trouble",
    label: "トラブル対応",
    short: "トラブル",
    Icon: ShieldAlert,
    accent: "#b91c1c",
    description: "クレーム / 工期遅延 / 施主対応",
  },
  {
    key: "construction",
    label: "工法選定",
    short: "工法",
    Icon: Wrench,
    accent: "#6b21a8",
    description: "下地 / 納まり / 旧家リフォーム時の判断",
  },
]

type Episode = {
  id: string
  category: CategoryKey
  title: string
  recordedOn: string // YYYY-MM-DD
  recordedVia: "LINE 通話" | "現場立会い" | "事務所雑談"
  summary: string
  oyakataVoice: string // 親方の語り
  tags: string[]
  relatedQuestions: string[]
}

const episodes: Episode[] = [
  // ---- 見積もり (7 件) ----
  {
    id: "ep-001",
    category: "estimate",
    title: "築 50 年 木造の リフォーム 見積もりで 利益を 残す コツ",
    recordedOn: "2025-09-12",
    recordedVia: "LINE 通話",
    summary:
      "古い家のリフォームは「開けてみないと分からん」 部分を最初から 1 割乗せておく。 後から追加請求を出すと施主との関係が崩れる。",
    oyakataVoice:
      "あのな、 築 50 年の木造をやる時はな、 図面どおりに見積もったらアカン。 床を開けたら土台がボロボロ、 壁を剥がしたら筋交いが入ってない、 そういうのが普通にあるんよ。 だから最初から 1 割、 多めに乗せて出す。 施主には「開けてみてから分かるけど、 大体これくらいや」 と言うておく。 後から追加で 50 万くださいって言うと、 みんな機嫌悪なる。 最初に「もしかしたら ここまで行くかも」 と言うとけば、 後で「半分で済みました」 で逆に喜ばれるんよ。 これが 40 年やってきた俺の答えや。",
    tags: ["築古", "リフォーム", "予備費", "施主対応"],
    relatedQuestions: [
      "リフォームの見積もりで気をつけることは?",
      "追加請求が出た時はどうしたらいい?",
    ],
  },
  {
    id: "ep-002",
    category: "estimate",
    title: "値引き要求された時に 利益を 削らずに 譲る方法",
    recordedOn: "2025-10-03",
    recordedVia: "LINE 通話",
    summary:
      "金額を下げるのではなく、 工事範囲やグレードで調整する。 「これを抜くなら 20 万下げられる」 が基本姿勢。",
    oyakataVoice:
      "値引きしてって言われた時にな、 「分かりました 20 万引きます」 って言うたらアカンで。 それは利益を捨てとるだけや。 そうじゃなくて、 「ここの建具をワンランク下げたら 15 万下がります」 とか、 「外構の一部を施主支給にしてもらえたら 25 万下がります」 とか、 必ず「何か抜く / 何かグレード下げる」 とセットにする。 金額だけ動かすと、 次の現場でも値引き前提で話されるようになる。 工事範囲で動かすと「ちゃんと考えてくれてる」 と思われる。 これは絶対や。",
    tags: ["値引き", "交渉", "施主対応"],
    relatedQuestions: ["値引きを頼まれたらどうする?", "利益を守る交渉のコツは?"],
  },
  {
    id: "ep-003",
    category: "estimate",
    title: "新築の 概算は 坪単価 × 1.15 から 入る",
    recordedOn: "2025-11-08",
    recordedVia: "事務所雑談",
    summary:
      "概算は地域相場の坪単価に 1.15 倍掛けて出す。 そこから施主の反応を見て削っていく。 最初を低く出すと利益が消える。",
    oyakataVoice:
      "新築の概算 出して言われたらな、 まず地域相場の坪単価を頭に置く。 多摩なら 65-75 万の間や。 そこに 1.15 掛けて出す。 「ちょっと高いな」 と思われるくらいでちょうどええ。 そこから打ち合わせで「ここを下げます」 と削っていくと、 施主は「自分の要望が反映されてる」 と感じるんよ。 最初を低く出すと、 後で必ず想定外の要望が出てきて利益が消える。 これも 30 年で覚えた商売や。",
    tags: ["新築", "概算", "坪単価"],
    relatedQuestions: ["新築の概算ってどう出してる?"],
  },
  {
    id: "ep-004",
    category: "estimate",
    title: "外構工事は 切り分けて 別契約に する",
    recordedOn: "2025-12-15",
    recordedVia: "LINE 通話",
    summary:
      "外構は天候と職人都合で読めない。 本体工事と切り離して別契約にしないと、 工期遅延の責任が本体にも被る。",
    oyakataVoice:
      "外構な、 これは絶対 本体工事と分けて契約する。 同じ契約にしとくと、 雨で外構が遅れた時に「家全体の引渡しが遅れた」 ことになって、 違約金の話まで行く。 別契約なら「本体は終わってます、 外構は来月です」 で済む。 施主には「外構は天候によるので別でやらせてください」 と最初に言うとくんよ。 これで何度も助かった。",
    tags: ["外構", "契約", "工期"],
    relatedQuestions: ["外構工事の見積もりは どう切る?"],
  },
  {
    id: "ep-005",
    category: "estimate",
    title: "材料費 高騰時の 見積もり 有効期限は 1 ヶ月",
    recordedOn: "2026-01-20",
    recordedVia: "LINE 通話",
    summary:
      "ウッドショック以降は見積もり有効期限を 1 ヶ月に短縮した。 半年前の値段で受けると利益が吹き飛ぶ。",
    oyakataVoice:
      "ウッドショックの時にな、 半年前に出した見積もりで受けた現場が 3 件あって、 全部赤字や。 木材だけで 1 棟 200 万くらい違う。 それ以降は見積書に「有効期限 1 ヶ月」 と書くようにした。 施主には「材料費が動いてるので すみません」 と説明する。 ちゃんとした人は理解してくれる。 理解せん人はそもそも 一緒に仕事せん方がええ。",
    tags: ["材料費", "ウッドショック", "有効期限"],
    relatedQuestions: ["材料費が上がってる時の見積もりは?"],
  },
  {
    id: "ep-006",
    category: "estimate",
    title: "解体費は 必ず 別行に 出して 内訳を 見せる",
    recordedOn: "2026-02-10",
    recordedVia: "LINE 通話",
    summary:
      "解体費を本体に混ぜると安く見えるが、 後でアスベスト等の追加が出た時にもめる。 別行で出して内訳まで見せる。",
    oyakataVoice:
      "解体な、 これは絶対 別行に出す。 本体に混ぜると施主は「全部込み」 やと思う。 でも解体は開けてみるまで分からん。 アスベストが出たり、 地中埋設物が出たり、 追加が普通にある。 別行で出しとけば、 追加が出た時に「これは解体の追加です」 と説明できる。 内訳まで見せて「重機回送費 / 産廃処分費 / 人工」 を分けとく。 これで揉めたこと一度もない。",
    tags: ["解体", "アスベスト", "内訳"],
    relatedQuestions: ["解体費の見積もりは どうする?"],
  },
  {
    id: "ep-007",
    category: "estimate",
    title: "見積もりは 必ず 紙で 印鑑押して 渡す",
    recordedOn: "2026-03-05",
    recordedVia: "事務所雑談",
    summary:
      "メール PDF だけだと「言った言わない」 になる。 紙で印鑑を押して 1 部渡し、 控えにも印鑑を押して保管する。",
    oyakataVoice:
      "見積もりはな、 必ず紙で印鑑押して渡す。 これは古いやり方やと思うやろ? でもな、 後で揉めた時に強いんよ。 メールの PDF だけやと「あれは概算でしょ」 と言われる。 紙に印鑑押してあると、 もう動かせん。 控えにも印鑑押して 3 年保管。 これは商売の保険や。",
    tags: ["契約", "印鑑", "書類保管"],
    relatedQuestions: ["契約書類はどう保管してる?"],
  },

  // ---- 職人ネットワーク (7 件) ----
  {
    id: "ep-101",
    category: "network",
    title: "大工の 田中さん には 月曜に 電話しない",
    recordedOn: "2025-09-20",
    recordedVia: "LINE 通話",
    summary:
      "田中棟梁は日曜に晩酌するので月曜午前は機嫌が悪い。 連絡は火-木の昼休みが鉄則。",
    oyakataVoice:
      "田中さんはな、 腕は俺の知る限り 立川で 3 本の指に入る大工や。 でもな、 月曜の朝に電話するとアカン。 日曜にしっかり酒飲むから、 月曜は機嫌が悪い。 火曜 〜 木曜 の 12 時 〜 12 時 30 分 の 昼休み、 これがベスト。 金曜は週末の段取りで忙しい。 こういうのを 知らんと「あの大工は気難しい」 で終わってまう。 人にはそれぞれ機嫌のええ時間帯がある、 そこを覚えるのが付き合いやで。",
    tags: ["大工", "田中棟梁", "連絡タイミング"],
    relatedQuestions: [
      "田中棟梁ってどんな人?",
      "職人さんに連絡するタイミングは?",
    ],
  },
  {
    id: "ep-102",
    category: "network",
    title: "電気の 山下電工は 図面 1 枚で 動いてくれる",
    recordedOn: "2025-10-12",
    recordedVia: "LINE 通話",
    summary:
      "山下電工は 30 年の付き合いで「いつもの」 で通じる。 急な変更も口頭で対応してくれるが、 後で必ず簡単な図面で送ること。",
    oyakataVoice:
      "山下電工はな、 親父の代から 30 年の付き合いや。 急に「コンセント 2 個追加して」 と電話で言うても「ええよ」 で動いてくれる。 でもな、 これに甘えたらアカン。 後で必ず 簡単な図面でも FAX か LINE で送る。 これは礼儀やし、 山下さんの息子さんに引き継がれた時のためや。 口頭だけやと、 息子さんの代で同じことができん。 記録を残すのは未来の付き合いのため。",
    tags: ["電気", "山下電工", "代替わり"],
    relatedQuestions: ["電気屋さんは誰に頼んでる?"],
  },
  {
    id: "ep-103",
    category: "network",
    title: "左官の 佐藤さんは 雨の日に 仕事しない",
    recordedOn: "2025-11-25",
    recordedVia: "LINE 通話",
    summary:
      "佐藤さんは古い職人で雨天作業を一切しない。 工程表を組む時に佐藤さん絡みは天気予報を 1 週間先まで見る。",
    oyakataVoice:
      "佐藤さんはな、 75 歳の左官や。 腕は最高、 でも雨の日は絶対 来ない。 「湿気で乾きが悪い」 と言う。 これは正論や、 仕上げが命の職人やから。 工程組む時はな、 佐藤さん絡みの工程は天気予報 1 週間先まで見て組む。 雨が読めたら 2 日前から「来週ずらすか」 と相談する。 これを当日電話で言うと信頼を失う。 古い職人ほど 段取りを尊重する。",
    tags: ["左官", "佐藤さん", "天候", "工程"],
    relatedQuestions: ["左官の段取りで気をつけること?"],
  },
  {
    id: "ep-104",
    category: "network",
    title: "鳶の 木村組は ヘルメットの 色で 仕事を 受けない 判断",
    recordedOn: "2025-12-08",
    recordedVia: "現場立会い",
    summary:
      "木村組は安全意識が業界トップクラス。 元請けの安全管理が甘いと判断したら仕事を断る。 ウチの現場は必ず受けてくれるのは 安全管理を徹底してるから。",
    oyakataVoice:
      "鳶の木村組はな、 多摩で一番厳しい。 ヘルメットあご紐 緩い職人を見ただけで、 親方が「次の現場 行かん」 言う。 厳しいけど、 ウチの現場は 30 年一度も事故ない。 これは木村組と一緒に 安全管理を作り上げた成果や。 後継ぐお前も、 木村組には頭下げてでも 来てもらえ。 鳶が信頼してる元請けは、 他の職人からも信頼される。",
    tags: ["鳶", "木村組", "安全管理"],
    relatedQuestions: ["鳶屋さんとの付き合い方は?"],
  },
  {
    id: "ep-105",
    category: "network",
    title: "若い職人は LINE で 連絡 / 古い職人は 電話で 連絡",
    recordedOn: "2026-01-15",
    recordedVia: "事務所雑談",
    summary:
      "40 代以下は LINE、 50 代以上は電話で連絡する。 LINE 送って「読まれてない」 で焦るより、 最初から電話の方が早い。",
    oyakataVoice:
      "連絡手段はな、 相手の年齢で変える。 40 代以下は LINE、 たいてい既読も早い。 50 代以上、 特に 60 代の職人は LINE 入れてない人もおる。 入れてても「読み方分からん」 言う人もおる。 これに「LINE 送りましたよね?」 と詰めても意味ない。 50 代以上は最初から電話。 「面倒くさい」 とか言うたらアカン、 これがウチの仕事のやり方や。",
    tags: ["連絡手段", "世代", "LINE"],
    relatedQuestions: ["職人さんへの連絡は LINE? 電話?"],
  },
  {
    id: "ep-106",
    category: "network",
    title: "盆暮れの 挨拶は 現金で 1 万円札 1 枚",
    recordedOn: "2026-02-22",
    recordedVia: "LINE 通話",
    summary:
      "主要職人 (大工 / 電気 / 設備) には 盆と暮れに現金 1 万円 + 菓子折りを持って行く。 これを欠かすと長期的な信頼が落ちる。",
    oyakataVoice:
      "盆と暮れはな、 主要職人 5-6 人のところに 現金 1 万円札 1 枚 + 菓子折り 持って行く。 振込でもメッセージでもアカン、 直接顔を見せる。 これを 30 年続けてきたから、 急な無理も聞いてくれる。 「現金 1 万円は時代遅れちゃう?」 と思うやろ? でもな、 これは 金額の問題ちゃう。 「忘れてないで」 を 形にする儀式や。 後継ぐお前も これは欠かすな。",
    tags: ["盆暮れ", "付き合い", "現金"],
    relatedQuestions: ["盆暮れの職人さんへの挨拶は どうしてる?"],
  },
  {
    id: "ep-107",
    category: "network",
    title: "代替わりした 職人は 親父の名前で 紹介する",
    recordedOn: "2026-03-18",
    recordedVia: "LINE 通話",
    summary:
      "息子に代替わりした職人と初めて仕事する時は「親父さんに 30 年お世話になって」 から入る。 信頼の引き継ぎ作法。",
    oyakataVoice:
      "代替わりした職人な、 これが一番大事や。 田中さんでも山下さんでも、 いずれ息子の代になる。 その時、 初顔合わせで「親父さんに 30 年お世話になりました、 これからもよろしく」 から入る。 息子の代で「お前 誰?」 にならんように、 必ず親父との関係性から話す。 これで信頼が引き継がれる。 商売は人と人の継続や。",
    tags: ["代替わり", "信頼引き継ぎ"],
    relatedQuestions: ["職人さんの代替わりの時はどう接する?"],
  },

  // ---- 仕入れ (6 件) ----
  {
    id: "ep-201",
    category: "supply",
    title: "建材屋 ABC は 月末の 火曜午後が 一番 値引きが 効く",
    recordedOn: "2025-09-28",
    recordedVia: "LINE 通話",
    summary:
      "建材屋 ABC 立川支店の営業ノルマが月末締めなので、 月末の火曜午後に発注すると 5-8% 上乗せで値引きしてくれる。",
    oyakataVoice:
      "建材屋の ABC な、 立川支店の佐々木営業課長は 月末締めなんよ。 だから月末の最終週、 特に火曜の午後 2 時頃に電話すると、 ノルマ達成のために 普段より 5-8% は引いてくれる。 これは佐々木さんと 15 年付き合ってる俺だから 教えてもらえた話や。 急ぎでない発注は 月末火曜まで貯めとく、 これだけで 年間 30 万くらい得しとる。",
    tags: ["建材屋", "ABC", "値引き", "タイミング"],
    relatedQuestions: ["建材屋 ABC で値引き効くタイミングは?"],
  },
  {
    id: "ep-202",
    category: "supply",
    title: "システムキッチンは ショールーム 経由で 取ると 5-10% 安い",
    recordedOn: "2025-10-20",
    recordedVia: "事務所雑談",
    summary:
      "施主にショールームへ行ってもらい、 そこで「井原工務店経由で見積もり」 と言ってもらう。 直接発注より施主満足度も値引きも両方上がる。",
    oyakataVoice:
      "キッチンとか浴室はな、 施主に立川のショールーム行ってもらう。 そこで「井原工務店から来ました」 と言うてもらうんよ。 ショールームのスタッフが値引き出すし、 施主は実物見て選べるから満足度も上がる。 こっちから「これにしましょう」 と決めると、 後で「思ってたのと違う」 になる。 ショールーム経由は施主満足度 と 値引き が 両方上がる、 一石二鳥や。",
    tags: ["システムキッチン", "ショールーム", "施主満足"],
    relatedQuestions: ["キッチンってどう発注してる?"],
  },
  {
    id: "ep-203",
    category: "supply",
    title: "木材は 山田材木店、 ただし 月曜朝に 在庫 確認 必須",
    recordedOn: "2025-11-12",
    recordedVia: "LINE 通話",
    summary:
      "山田材木店は値段は安いが在庫の波が大きい。 月曜朝 8 時に電話して今週の在庫を確認してから発注する習慣。",
    oyakataVoice:
      "木材はな、 山田材木店が安い。 ただ在庫の波が大きい。 月曜朝の 8 時、 ここがポイント。 山田さんが事務所におる時間や。 「今週の入荷どうですか?」 と一言聞く。 「米松が少ない」 とか「集成材は来週」 とか教えてくれる。 これ聞いてから発注すると、 後で「来週末まで入らん」 にならん。 月曜朝 8 時、 これは儀式や、 覚えとけ。",
    tags: ["木材", "山田材木店", "在庫確認"],
    relatedQuestions: ["木材の発注で気をつけることは?"],
  },
  {
    id: "ep-204",
    category: "supply",
    title: "金物 / ビス は ホームセンターより 専門問屋",
    recordedOn: "2025-12-22",
    recordedVia: "事務所雑談",
    summary:
      "ホームセンターは 1-2 個なら便利だが箱買いは専門問屋 (国分寺の関口商店) の方が 3 割安い。 ただし現金払いのみ。",
    oyakataVoice:
      "金物とビスはな、 ホームセンターで買うてる現場見たら 殴りたくなる。 国分寺の関口商店、 ここは現金払いやけど 3 割安い。 ビス 1 箱 で 1,500 円違う、 これが 30 箱なら 45,000 円や。 ホームセンターは緊急用、 普段は関口商店。 関口の親父はちょっと無愛想やけど、 何回か顔出したら 名前覚えてくれる。",
    tags: ["金物", "ビス", "関口商店"],
    relatedQuestions: ["ビスや金物はどこで買ってる?"],
  },
  {
    id: "ep-205",
    category: "supply",
    title: "サッシ / ガラスは 必ず 現場サイズを 採寸後に 発注",
    recordedOn: "2026-01-30",
    recordedVia: "現場立会い",
    summary:
      "図面で発注すると 5 mm 差で入らないことがある。 必ず大工が下地を組んだ後に現場で採寸してから発注する。",
    oyakataVoice:
      "サッシとガラスはな、 図面で発注したら絶対アカン。 古い家は壁が歪んでる、 新築でも下地組んでみたら 5 mm 違うことがある。 大工が下地組んだ後、 現場で寸法測ってから発注。 これで「サッシ来たけど入らん」 が一度もない。 「時間がかかる」 と思うやろ? でも入らんサッシが届いて 1 週間遅れるより 100 倍マシや。",
    tags: ["サッシ", "ガラス", "採寸"],
    relatedQuestions: ["サッシの発注タイミングは?"],
  },
  {
    id: "ep-206",
    category: "supply",
    title: "クロスは 必ず 1 割 多めに 取る",
    recordedOn: "2026-03-01",
    recordedVia: "LINE 通話",
    summary:
      "クロスは廃番が早いので 1 割多めに発注し、 余りは施主に渡して将来の補修用に保管してもらう。 これだけで 5 年後のクレームがなくなる。",
    oyakataVoice:
      "クロスはな、 必ず 1 割多めに取る。 そして余ったロールを施主に渡して「将来 子供が破った時の補修用です」 と説明する。 これだけで 3 年後 5 年後 のクレーム電話が来ない。 「あの時のクロスもう廃番です」 が一番揉める。 1 割多めの材料費 はクレーム対策の保険、 安いもんや。",
    tags: ["クロス", "廃番", "施主対応"],
    relatedQuestions: ["クロスの発注量はどう決めてる?"],
  },

  // ---- トラブル対応 (6 件) ----
  {
    id: "ep-301",
    category: "trouble",
    title: "雨漏り クレームは まず 翌日 必ず 現地に 行く",
    recordedOn: "2025-09-15",
    recordedVia: "LINE 通話",
    summary:
      "雨漏り連絡は原因究明より先に「翌日現地」 が鉄則。 行くだけで施主の怒りが半分になる。 直すのはそれから。",
    oyakataVoice:
      "雨漏りの電話な、 これは絶対 翌日 行く。 「どう直すか」 を電話で考えるな。 まず行く。 行って屋根見て、 天井見て、 「すぐ直します」 と言う。 これだけで施主の怒りが半分なる。 原因究明は その後でええ。 行かんと電話で「来週です」 「業者と相談中で」 と言うてる間に 施主は近所に「井原工務店 ダメや」 と言いふらす。 行くだけ、 まず行く。",
    tags: ["雨漏り", "クレーム", "初動"],
    relatedQuestions: ["雨漏りのクレームが来たらどうする?"],
  },
  {
    id: "ep-302",
    category: "trouble",
    title: "工期遅延が 確定した時は 2 週間前に 必ず 報告",
    recordedOn: "2025-10-08",
    recordedVia: "LINE 通話",
    summary:
      "工期遅延の連絡は早ければ早いほど施主の怒りが小さい。 「あと 1 週間で」 と粘らずに 2 週間前に正直に言う。",
    oyakataVoice:
      "工期遅延な、 これが分かったらすぐ言う。 「あと 1 週間で何とかなるかも」 と粘って遅延させるのが一番アカン。 2 週間前に「すみません、 ○月○日まで延びます」 と正直に言う。 施主は引越し業者の予約とか色々動かさなアカンから、 早ければ早いほどお互い助かる。 ギリギリで言うと「もっと早く言うてくれたら」 と必ずなる。 これは 100% や、 例外なし。",
    tags: ["工期遅延", "報告", "施主対応"],
    relatedQuestions: ["工期が遅れそうな時はいつ報告する?"],
  },
  {
    id: "ep-303",
    category: "trouble",
    title: "近隣クレームは 施主より 先に 謝りに 行く",
    recordedOn: "2025-11-30",
    recordedVia: "LINE 通話",
    summary:
      "騒音や駐車クレームは近隣から直接連絡が来た時点で、 施主に伝える前にこちらが先に菓子折り持って謝りに行く。",
    oyakataVoice:
      "近隣からクレーム来たらな、 まず施主に伝える前に こっちが行く。 菓子折り持って「ご迷惑かけてすみません」。 これを施主に「クレーム来ました、 どうしましょう」 と相談するとアカン。 施主は近隣との関係が続くから、 こっちで処理しとくのが施主への恩返しや。 後で施主に「近隣の方に挨拶してきました」 とだけ報告する。 これだけで施主は「ええ工務店に頼んだ」 と思う。",
    tags: ["近隣", "クレーム", "謝罪"],
    relatedQuestions: ["近隣からクレーム来たらどうする?"],
  },
  {
    id: "ep-304",
    category: "trouble",
    title: "施工ミスは 隠さず 即報告 / 直す費用は こっち持ち",
    recordedOn: "2025-12-28",
    recordedVia: "LINE 通話",
    summary:
      "職人が間違えた時は隠さず施主に報告し、 直す費用は工務店持ちで対応する。 隠すと信頼が完全に終わる。",
    oyakataVoice:
      "施工ミスはな、 絶対 隠さん。 大工が寸法間違えた、 クロスの色違う、 そういうのは即 施主に「すみません、 ここ間違えました、 直します、 費用は こちらで」 と言う。 直す費用 10 万 20 万 はキツいけど、 隠してバレた時の損失は 100 倍や。 「あの工務店 ミス隠した」 は 10 年 噂が残る。 即報告 / こっち持ち、 これは鉄則。",
    tags: ["施工ミス", "報告", "費用負担"],
    relatedQuestions: ["施工ミスが発覚した時の対応は?"],
  },
  {
    id: "ep-305",
    category: "trouble",
    title: "支払い遅延 は 2 ヶ月で 弁護士 入れる 構え",
    recordedOn: "2026-02-05",
    recordedVia: "事務所雑談",
    summary:
      "支払い遅延が 2 ヶ月超えたら「次は弁護士入れます」 と書面で通知する。 1 ヶ月までは雑談調で催促、 2 ヶ月で本気の構え。",
    oyakataVoice:
      "支払い遅延な、 1 ヶ月までは「最近どうですか?」 と雑談調で電話。 2 ヶ月超えたらアウト。 書面で「○月○日までに入金なき場合は 弁護士を通じての手続きとなります」 と送る。 ハッキリ書く、 遠慮するな。 ここで遠慮すると 6 ヶ月後にゼロ円や。 顧問弁護士 (立川の田川先生) には 年 5 万 払うとるから、 本気で使う構えを見せる。",
    tags: ["支払い遅延", "弁護士", "債権回収"],
    relatedQuestions: ["支払いが遅れた時はどうする?"],
  },
  {
    id: "ep-306",
    category: "trouble",
    title: "施主夫婦の 意見が 割れたら 必ず 両方の 前で 確認",
    recordedOn: "2026-03-22",
    recordedVia: "LINE 通話",
    summary:
      "施主夫婦の意見が違う時は どちらかと電話で決めるな。 必ず両方が揃った場で「これでいいですか?」 と書面でサインもらう。",
    oyakataVoice:
      "施主が夫婦の場合な、 旦那と奥さんで意見違うことがある。 これは絶対 どっちか 1 人と決めたらアカン。 「奥さんがこう言うてました」 と旦那に言うても「俺は聞いてない」 になる。 必ず 2 人揃った場で確認して、 紙にサインもらう。 面倒くさいけど、 これやらんと完成後に「私の希望と違う」 になる。 夫婦は思てる以上に コミュニケーション取ってない、 これ覚えとけ。",
    tags: ["施主夫婦", "意思決定", "書面確認"],
    relatedQuestions: ["施主夫婦で意見が違う時はどうする?"],
  },

  // ---- 工法選定 (6 件) ----
  {
    id: "ep-401",
    category: "construction",
    title: "築 30 年超の リフォームは 必ず 土台 を 開ける",
    recordedOn: "2025-09-08",
    recordedVia: "現場立会い",
    summary:
      "30 年以上の家は床下の土台がシロアリや腐食で傷んでいる確率が高い。 リフォーム時に絶対開けて確認する。",
    oyakataVoice:
      "築 30 年超のリフォームはな、 絶対 床を 1 箇所 開けて 土台 を 見る。 これ 多分 7-8 割の確率で どこか やられとる。 シロアリ、 雨漏りからの腐食、 沈下。 開けずに上だけ綺麗にしたら 5 年後に床が抜ける。 「お金かかるから開けたくない」 言う施主には「開けないと 5 年後にもっとかかります」 と説明する。 これは譲ったらアカン部分や。",
    tags: ["築古", "土台", "シロアリ"],
    relatedQuestions: ["築 30 年の家のリフォームで気をつけること?"],
  },
  {
    id: "ep-402",
    category: "construction",
    title: "和室を 洋室化 する時は 天井裏 の 梁 を 確認",
    recordedOn: "2025-10-25",
    recordedVia: "LINE 通話",
    summary:
      "和室の天井は二重天井で梁が隠れている。 洋室化で天井を上げると梁が出てきて意匠を崩す。 必ず天井裏を覗いてから設計。",
    oyakataVoice:
      "和室を洋室にする時はな、 天井裏の梁 を 必ず 確認する。 和室は二重天井で梁が隠れてる。 「天井高くしましょう」 と気軽に言うて 開けたら 太い梁が ドーン と出てきて施主は「思てた感じと違う」 となる。 設計段階で 1 箇所 天井点検口から 写真撮って施主に見せる。 「こういう梁があります、 これを見せる / 隠す で 印象変わります」 と説明。 これで設計確定。",
    tags: ["和室", "洋室化", "天井裏", "梁"],
    relatedQuestions: ["和室を洋室にする時の注意点は?"],
  },
  {
    id: "ep-403",
    category: "construction",
    title: "外壁は サイディング より 塗装 の 方が 長期 安い",
    recordedOn: "2025-11-18",
    recordedVia: "LINE 通話",
    summary:
      "サイディングは初期コスト安いがコーキング打ち替え周期が 10 年。 30 年スパンで見ると塗装の方が総額安い。",
    oyakataVoice:
      "外壁な、 これは長期で考えな アカン。 サイディングは初期 30 万 安いけど、 10 年 ごとに コーキング 打ち替え 20 万 ずつ。 30 年で 計 60 万。 塗装 (モルタル + 吹付) は初期高いが、 塗り替えだけで済む、 同じ 30 年で 計 40 万。 30 年 で 20 万 差。 施主には「初期で 30 万 浮くのと、 30 年で 20 万 損するの どっちですか?」 と聞く。 大体は塗装選ぶ。",
    tags: ["外壁", "サイディング", "塗装", "LCC"],
    relatedQuestions: ["外壁はサイディングと塗装どっち?"],
  },
  {
    id: "ep-404",
    category: "construction",
    title: "断熱は ウレタン吹付 が 多摩地域では ベスト",
    recordedOn: "2025-12-05",
    recordedVia: "事務所雑談",
    summary:
      "多摩地域は冬の底冷えが強い。 グラスウールより現場発泡ウレタンの方が気密が取れて結露も防げる。 価格差は 1 棟 30 万程度。",
    oyakataVoice:
      "断熱はな、 多摩地域なら ウレタン吹付 一択 や。 グラスウールは安いけど、 隙間ができる、 経年で垂れる、 結露する。 現場発泡ウレタンは気密がしっかり取れて、 30 年経っても性能落ちん。 価格差 1 棟 30 万 くらい。 「断熱で 30 万 ケチる」 のは一番アカン投資、 光熱費で 5 年 で 回収する。 これは施主に必ず説明する。",
    tags: ["断熱", "ウレタン", "気密"],
    relatedQuestions: ["断熱材は何を使ってる?"],
  },
  {
    id: "ep-405",
    category: "construction",
    title: "古民家リフォームは 構造補強 を 最優先",
    recordedOn: "2026-01-12",
    recordedVia: "現場立会い",
    summary:
      "古民家は意匠より先に耐震補強と土台補強。 ここをケチると 10 年後に「あの工務店のせい」 になる。",
    oyakataVoice:
      "古民家リフォームな、 施主は「梁を見せたい」「土間 を活かしたい」 と意匠の話ばかりする。 でもな、 こっちは構造補強を最優先にせなアカン。 耐震金物、 土台補強、 ここ ケチると 10 年後 もし地震で壊れた時に 「あの工務店のリフォーム後やのに」 と必ず言われる。 意匠は構造の上に乗せる。 「先に耐震を 100 万、 残りで意匠」 と説明する。 これは絶対譲るな。",
    tags: ["古民家", "耐震", "構造補強"],
    relatedQuestions: ["古民家のリフォームで最優先することは?"],
  },
  {
    id: "ep-406",
    category: "construction",
    title: "屋根は ガルバリウム より 瓦 が 多摩では まだ 主流",
    recordedOn: "2026-02-28",
    recordedVia: "LINE 通話",
    summary:
      "都心はガルバが増えたが多摩はまだ瓦文化。 50 代以上の施主はガルバを「安っぽい」 と感じる。 ガルバ提案は施主層を見てから。",
    oyakataVoice:
      "屋根材な、 都心はガルバリウムが増えとるけど、 多摩はまだ瓦の文化や。 50 代 60 代の施主にガルバ提案すると「安っぽい」 と言われる。 40 代以下なら「メンテ楽でええ」 と受け入れられる。 施主の世代見てから提案変える。 「最近の流行りはガルバ」 と一律で言うとアカン、 地域と世代で見る。 これも商売や。",
    tags: ["屋根", "ガルバリウム", "瓦", "世代"],
    relatedQuestions: ["屋根材は何がおすすめ?"],
  },
]

// =============================================================
// Q&A — 後継者がよく聞きそうな質問パターン
// (部分一致で episode に紐付ける、 ハードコード)
// =============================================================

type CannedQA = {
  patterns: string[] // 部分一致するキーワード
  episodeIds: string[] // 最大 3 件
  fallbackAnswer?: string
}

const cannedQAs: CannedQA[] = [
  {
    patterns: ["田中", "棟梁", "大工"],
    episodeIds: ["ep-101", "ep-107"],
  },
  {
    patterns: ["値引き", "値引", "交渉"],
    episodeIds: ["ep-002", "ep-201"],
  },
  {
    patterns: ["見積", "概算"],
    episodeIds: ["ep-001", "ep-003", "ep-005"],
  },
  {
    patterns: ["雨漏り", "クレーム"],
    episodeIds: ["ep-301", "ep-303"],
  },
  {
    patterns: ["工期", "遅延", "遅れ"],
    episodeIds: ["ep-302", "ep-304"],
  },
  {
    patterns: ["建材", "仕入", "建材屋", "abc"],
    episodeIds: ["ep-201", "ep-204"],
  },
  {
    patterns: ["木材", "山田", "材木"],
    episodeIds: ["ep-203", "ep-204"],
  },
  {
    patterns: ["山下", "電気", "電工"],
    episodeIds: ["ep-102", "ep-105"],
  },
  {
    patterns: ["左官", "佐藤"],
    episodeIds: ["ep-103"],
  },
  {
    patterns: ["鳶", "木村", "安全"],
    episodeIds: ["ep-104"],
  },
  {
    patterns: ["盆", "暮れ", "挨拶"],
    episodeIds: ["ep-106"],
  },
  {
    patterns: ["古民家", "築", "リフォーム"],
    episodeIds: ["ep-001", "ep-401", "ep-405"],
  },
  {
    patterns: ["断熱", "ウレタン"],
    episodeIds: ["ep-404"],
  },
  {
    patterns: ["外壁", "サイディング", "塗装"],
    episodeIds: ["ep-403"],
  },
  {
    patterns: ["屋根", "瓦", "ガルバ"],
    episodeIds: ["ep-406"],
  },
  {
    patterns: ["施主", "夫婦"],
    episodeIds: ["ep-306", "ep-002"],
  },
  {
    patterns: ["支払", "回収", "弁護士"],
    episodeIds: ["ep-305"],
  },
  {
    patterns: ["契約", "印鑑", "書類"],
    episodeIds: ["ep-007", "ep-004"],
  },
]

const fallbackTexts = [
  "うーん、 その質問はまだ AI が取材できてないなあ。 来週の LINE 通話で 親父 (親方) に 直接聞いてみる、 待っとけよ。",
  "それな、 取材した記憶ないわ。 親方にメモして来週聞こう。 今ある中で 近そうなのは こっちや。",
  "悪い、 その話まだ 取材帳に 入ってない。 雰囲気が近いエピソードは こちらや、 参考までに。",
]

// =============================================================
// Utility — 親方口調マッチング
// =============================================================

function findMatches(query: string): {
  matched: Episode[]
  isFallback: boolean
} {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return { matched: [], isFallback: false }

  const matchedIds = new Set<string>()
  for (const qa of cannedQAs) {
    for (const pattern of qa.patterns) {
      if (normalized.includes(pattern.toLowerCase())) {
        qa.episodeIds.forEach((id) => matchedIds.add(id))
        break
      }
    }
  }

  // タグ / タイトル に 部分一致するエピソードも追加
  for (const ep of episodes) {
    if (
      ep.title.toLowerCase().includes(normalized) ||
      ep.tags.some((t) => t.toLowerCase().includes(normalized))
    ) {
      matchedIds.add(ep.id)
    }
  }

  if (matchedIds.size === 0) {
    // フォールバック: ランダムに 2 件
    const shuffled = [...episodes].sort(() => Math.random() - 0.5).slice(0, 2)
    return { matched: shuffled, isFallback: true }
  }

  const matched = Array.from(matchedIds)
    .map((id) => episodes.find((e) => e.id === id)!)
    .filter(Boolean)
    .slice(0, 3)
  return { matched, isFallback: false }
}

function pickFallbackText(): string {
  return fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)]
}

function categoryOf(key: CategoryKey): Category {
  return categories.find((c) => c.key === key)!
}

// =============================================================
// History — 後継者の質問履歴 (component state、 ハードコード初期値)
// =============================================================

type HistoryItem = {
  id: string
  query: string
  matchedIds: string[]
  isFallback: boolean
  askedAt: string // 表示用
}

const seedHistory: HistoryItem[] = [
  {
    id: "h-001",
    query: "田中棟梁ってどんな人?",
    matchedIds: ["ep-101"],
    isFallback: false,
    askedAt: "3 日前",
  },
  {
    id: "h-002",
    query: "雨漏りクレームが来たらどう動く?",
    matchedIds: ["ep-301"],
    isFallback: false,
    askedAt: "5 日前",
  },
  {
    id: "h-003",
    query: "築 30 年のリフォーム見積もり",
    matchedIds: ["ep-001", "ep-401"],
    isFallback: false,
    askedAt: "1 週間前",
  },
]

// =============================================================
// Sub-components
// =============================================================

function Badge({
  children,
  color = "#6b7280",
  bg = "#f3f4f6",
}: {
  children: React.ReactNode
  color?: string
  bg?: string
}) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {children}
    </span>
  )
}

function EpisodeCard({
  episode,
  onClick,
  active,
}: {
  episode: Episode
  onClick?: () => void
  active?: boolean
}) {
  const cat = categoryOf(episode.category)
  const Icon = cat.Icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-lg border bg-white p-4 text-left transition hover:border-gray-400 hover:shadow-sm ${
        active ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-md"
          style={{ backgroundColor: `${cat.accent}1a`, color: cat.accent }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <Badge color={cat.accent} bg={`${cat.accent}1a`}>
          {cat.label}
        </Badge>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-gray-500">
          <Calendar className="h-3 w-3" />
          {episode.recordedOn}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug text-gray-900">
        {episode.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
        {episode.summary}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {episode.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600"
          >
            <Tag className="h-2.5 w-2.5" />
            {t}
          </span>
        ))}
      </div>
    </button>
  )
}

function CategoryFilter({
  selected,
  onChange,
  counts,
}: {
  selected: CategoryKey | "all"
  onChange: (key: CategoryKey | "all") => void
  counts: Record<CategoryKey | "all", number>
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
          selected === "all"
            ? "border-gray-900 bg-gray-900 text-white"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
        }`}
      >
        すべて
        <span className="rounded bg-black/10 px-1.5 py-0.5 text-[11px]">
          {counts.all}
        </span>
      </button>
      {categories.map((cat) => {
        const Icon = cat.Icon
        const isActive = selected === cat.key
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onChange(cat.key)}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            <Icon
              className="h-3.5 w-3.5"
              style={{ color: isActive ? "white" : cat.accent }}
            />
            {cat.label}
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] ${
                isActive ? "bg-black/20" : "bg-gray-100 text-gray-600"
              }`}
            >
              {counts[cat.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function OyakataAnswer({
  matched,
  isFallback,
  fallbackText,
  onPick,
}: {
  matched: Episode[]
  isFallback: boolean
  fallbackText: string
  onPick: (episode: Episode) => void
}) {
  if (matched.length === 0) return null
  const primary = matched[0]
  const cat = categoryOf(primary.category)

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <HardHat className="h-4 w-4" />
        </span>
        <div>
          <div className="text-sm font-semibold text-amber-900">
            親方 AI からの返事
          </div>
          <div className="text-[11px] text-amber-700">
            {isFallback
              ? "近そうな取材内容から拾ってきたで"
              : "取材帳から ピッタリの 話 見つけたで"}
          </div>
        </div>
        <Badge color={cat.accent} bg={`${cat.accent}1a`}>
          {cat.label}
        </Badge>
      </div>
      {isFallback && (
        <p className="mb-3 rounded border border-amber-300 bg-amber-100/70 px-3 py-2 text-[13px] leading-6 text-amber-900">
          {fallbackText}
        </p>
      )}
      <h4 className="mb-2 text-base font-semibold text-gray-900">
        {primary.title}
      </h4>
      <p className="whitespace-pre-wrap rounded-md bg-white/70 p-4 text-[15px] leading-[1.9] text-gray-800">
        {primary.oyakataVoice}
      </p>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {primary.recordedOn} 取材 ({primary.recordedVia})
        </span>
      </div>
      {matched.length > 1 && (
        <div className="mt-4 border-t border-amber-200 pt-3">
          <div className="mb-2 text-[12px] font-medium text-amber-900">
            関連エピソード
          </div>
          <ul className="space-y-1">
            {matched.slice(1).map((ep) => (
              <li key={ep.id}>
                <button
                  type="button"
                  onClick={() => onPick(ep)}
                  className="group inline-flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] text-amber-900 hover:bg-amber-100/60"
                >
                  <ArrowRight className="h-3 w-3 opacity-60 transition group-hover:translate-x-0.5" />
                  <span className="flex-1">{ep.title}</span>
                  <Badge
                    color={categoryOf(ep.category).accent}
                    bg={`${categoryOf(ep.category).accent}1a`}
                  >
                    {categoryOf(ep.category).short}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() => onPick(primary)}
          className="h-9 rounded-md bg-amber-700 px-3 text-xs font-medium text-white hover:bg-amber-800"
        >
          このエピソードを 詳しく
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function EpisodeDetail({
  episode,
  onBack,
  onPickRelated,
  history,
}: {
  episode: Episode
  onBack: () => void
  onPickRelated: (ep: Episode) => void
  history: HistoryItem[]
}) {
  const cat = categoryOf(episode.category)
  const Icon = cat.Icon

  const related = useMemo(() => {
    return episodes
      .filter(
        (e) =>
          e.id !== episode.id &&
          (e.category === episode.category ||
            e.tags.some((t) => episode.tags.includes(t))),
      )
      .slice(0, 3)
  }, [episode])

  const referencedHistory = useMemo(() => {
    return history.filter((h) => h.matchedIds.includes(episode.id))
  }, [episode.id, history])

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        エピソード一覧に戻る
      </button>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${cat.accent}1a`, color: cat.accent }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <Badge color={cat.accent} bg={`${cat.accent}1a`}>
            {cat.label}
          </Badge>
          <span className="ml-auto inline-flex items-center gap-1 text-[12px] text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {episode.recordedOn} 取材
          </span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          {episode.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {episode.summary}
        </p>

        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/60 p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-amber-900">
            <Sparkles className="h-3.5 w-3.5" />
            親方の語り ({episode.recordedVia} で取材)
          </div>
          <p className="whitespace-pre-wrap text-[15px] leading-[1.95] text-gray-800">
            {episode.oyakataVoice}
          </p>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-xs font-medium text-gray-700">タグ</div>
          <div className="flex flex-wrap gap-1.5">
            {episode.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-0.5 rounded bg-gray-100 px-2 py-1 text-[12px] text-gray-700"
              >
                <Tag className="h-3 w-3" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {referencedHistory.length > 0 && (
          <div className="mt-5 border-t border-gray-200 pt-4">
            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
              <History className="h-3.5 w-3.5" />
              後継者から この件で 来た 質問 ({referencedHistory.length})
            </div>
            <ul className="space-y-1.5">
              {referencedHistory.map((h) => (
                <li
                  key={h.id}
                  className="rounded bg-gray-50 px-3 py-2 text-[13px] text-gray-700"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-3 w-3 text-gray-400" />
                    「{h.query}」
                  </span>
                  <span className="ml-2 text-[11px] text-gray-500">
                    {h.askedAt}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-5 border-t border-gray-200 pt-4">
            <div className="mb-2 text-xs font-medium text-gray-700">
              関連エピソード
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {related.map((ep) => (
                <EpisodeCard
                  key={ep.id}
                  episode={ep}
                  onClick={() => onPickRelated(ep)}
                />
              ))}
            </div>
          </div>
        )}

        {episode.relatedQuestions.length > 0 && (
          <div className="mt-5 border-t border-gray-200 pt-4">
            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
              <HelpCircle className="h-3.5 w-3.5" />
              この件で 聞ける 質問例
            </div>
            <div className="flex flex-wrap gap-2">
              {episode.relatedQuestions.map((q) => (
                <span
                  key={q}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[12px] text-gray-700"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================
// Main
// =============================================================

const suggestedQuestions = [
  "田中棟梁ってどんな人?",
  "雨漏りのクレームが来たらどう動く?",
  "値引きを頼まれたらどうする?",
  "築 30 年のリフォーム見積もりは?",
  "断熱材は何を使ってる?",
  "建材屋 ABC で値引き効くタイミング?",
]

export function TacitKnowledgeDemo() {
  // Query / Answer state
  const [query, setQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null)
  const [matchResult, setMatchResult] = useState<{
    matched: Episode[]
    isFallback: boolean
    fallbackText: string
  } | null>(null)

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">(
    "all",
  )
  const [searchText, setSearchText] = useState("")

  // Episode detail
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null)

  // History
  const [history, setHistory] = useState<HistoryItem[]>(seedHistory)

  const counts = useMemo(() => {
    const map: Record<CategoryKey | "all", number> = {
      all: episodes.length,
      estimate: 0,
      network: 0,
      supply: 0,
      trouble: 0,
      construction: 0,
    }
    for (const ep of episodes) {
      map[ep.category] += 1
    }
    return map
  }, [])

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      if (selectedCategory !== "all" && ep.category !== selectedCategory)
        return false
      if (searchText.trim()) {
        const q = searchText.trim().toLowerCase()
        const blob =
          ep.title + " " + ep.summary + " " + ep.tags.join(" ")
        if (!blob.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [selectedCategory, searchText])

  const activeEpisode = useMemo(
    () => episodes.find((e) => e.id === activeEpisodeId) ?? null,
    [activeEpisodeId],
  )

  const handleAsk = (queryText: string) => {
    const trimmed = queryText.trim()
    if (!trimmed) return
    const result = findMatches(trimmed)
    const fallbackText = pickFallbackText()
    setSubmittedQuery(trimmed)
    setMatchResult({ ...result, fallbackText })
    setHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        query: trimmed,
        matchedIds: result.matched.map((e) => e.id),
        isFallback: result.isFallback,
        askedAt: "たった今",
      },
      ...prev,
    ])
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    handleAsk(query)
  }

  return (
    <div className="space-y-12">
      {/* ============ Pain & Outcome ============ */}
      <section className="rounded-lg border border-gray-200 bg-gradient-to-br from-amber-50/40 to-white p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <HardHat className="h-3.5 w-3.5" />
              親方 (60-70 代社長) の頭の中
            </div>
            <ul className="space-y-2 text-sm leading-6 text-gray-700">
              <li className="rounded-md bg-white/70 px-3 py-2">
                40-50 年分の現場経験 / 見積もり感覚 が 引退で 消える
              </li>
              <li className="rounded-md bg-white/70 px-3 py-2">
                「あの大工は月曜の朝 機嫌悪い」 系の 細かい人間関係 が 書き残されてない
              </li>
              <li className="rounded-md bg-white/70 px-3 py-2">
                過去のトラブル対応 ノウハウ は 親方の記憶の中だけ
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" />
              AI が 週 1 LINE 通話で 取材 (継続)
            </div>
            <ul className="space-y-2 text-sm leading-6 text-gray-700">
              <li className="rounded-md bg-white/70 px-3 py-2">
                30 分の LINE 通話で 業務エピソード 2-3 件 抽出
              </li>
              <li className="rounded-md bg-white/70 px-3 py-2">
                親方の口調そのままで 文字起こし + タグ整理
              </li>
              <li className="rounded-md bg-white/70 px-3 py-2">
                1 年 で 30-50 エピソード 蓄積 → 後継者が いつでも 検索 / 質問
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ Detail view ============ */}
      {activeEpisode ? (
        <section>
          <EpisodeDetail
            episode={activeEpisode}
            onBack={() => setActiveEpisodeId(null)}
            onPickRelated={(ep) => setActiveEpisodeId(ep.id)}
            history={history}
          />
        </section>
      ) : (
        <>
          {/* ============ Question Interface ============ */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                後継者から 親方 AI に 聞く
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                「あの時 どうしたんやっけ?」 を 自然な言葉で 投げると、 取材帳から
                親方の口調風に 答えが返ってくる。
              </p>
            </div>

            <form onSubmit={submitForm} className="mb-4">
              <div className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-3 focus-within:border-gray-900 sm:flex-row sm:items-center">
                <MessageCircle className="ml-1 hidden h-4 w-4 text-gray-400 sm:block" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="例: 田中棟梁ってどんな人?"
                  className="flex-1 bg-transparent px-2 py-1.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
                <Button
                  type="submit"
                  className="h-9 rounded-md bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  聞く
                </Button>
              </div>
            </form>

            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center text-[11px] text-gray-500">
                よく聞かれる質問:
              </span>
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setQuery(q)
                    handleAsk(q)
                  }}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {submittedQuery && matchResult && (
              <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-[13px] text-gray-700">
                  <span className="mr-2 font-medium text-gray-900">
                    後継者:
                  </span>
                  「{submittedQuery}」
                </div>
                <OyakataAnswer
                  matched={matchResult.matched}
                  isFallback={matchResult.isFallback}
                  fallbackText={matchResult.fallbackText}
                  onPick={(ep) => setActiveEpisodeId(ep.id)}
                />
              </div>
            )}
          </section>

          {/* ============ Episode list ============ */}
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  取材済 エピソード ({episodes.length} 件)
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  AI が 親方と 8 ヶ月 続けた LINE 通話で 蓄積した エピソード集。
                  カテゴリ で 絞り込んで 過去事例 を 探す。
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="エピソード内 検索"
                  className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-2 text-sm text-gray-900 outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div className="mb-4">
              <CategoryFilter
                selected={selectedCategory}
                onChange={setSelectedCategory}
                counts={counts}
              />
            </div>

            {filteredEpisodes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
                条件に合うエピソードはまだ 取材されてないなあ。
                来週の LINE 通話で 親方に 聞いてみる。
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredEpisodes.map((ep) => (
                  <EpisodeCard
                    key={ep.id}
                    episode={ep}
                    onClick={() => setActiveEpisodeId(ep.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ============ Recent questions ============ */}
          <section>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-gray-900">
              <History className="mr-1.5 inline h-4 w-4 align-text-bottom text-gray-500" />
              後継者の 直近の 質問 ({history.length} 件)
            </h2>
            <ul className="space-y-2">
              {history.slice(0, 8).map((h) => (
                <li
                  key={h.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-900">「{h.query}」</span>
                  <span className="text-[11px] text-gray-500">{h.askedAt}</span>
                  {h.isFallback ? (
                    <Badge color="#92400e" bg="#fef3c7">
                      取材帳に なし
                    </Badge>
                  ) : (
                    <Badge color="#166534" bg="#dcfce7">
                      {h.matchedIds.length} 件 マッチ
                    </Badge>
                  )}
                  {h.matchedIds.slice(0, 2).map((id) => {
                    const ep = episodes.find((e) => e.id === id)
                    if (!ep) return null
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveEpisodeId(id)}
                        className="ml-auto inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-1 text-[12px] text-gray-700 hover:bg-gray-100"
                      >
                        {ep.title.slice(0, 18)}…
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )
                  })}
                </li>
              ))}
            </ul>
          </section>

          {/* ============ Footer note: 取材タイミング ============ */}
          <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Mic className="h-3.5 w-3.5" />
                  取材ペース
                </div>
                <p className="text-sm leading-6 text-gray-700">
                  週 1 回 / 30 分 の LINE 通話。 親方が 都合のいい 曜日 / 時間 を 選ぶ。
                  急ぎの 現場が 入った週は 翌週に 振替。
                </p>
              </div>
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Tag className="h-3.5 w-3.5" />
                  整理方針
                </div>
                <p className="text-sm leading-6 text-gray-700">
                  取材後 24 時間以内 に AI が 文字起こし + 5 カテゴリ + タグ 自動付与。
                  親方の口調 (「あのな」「やったんよ」 等) は そのまま 残す。
                </p>
              </div>
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <HelpCircle className="h-3.5 w-3.5" />
                  後継者の 使い方
                </div>
                <p className="text-sm leading-6 text-gray-700">
                  現場で 困った時 / 見積もり 出す前 / 新しい 職人と 仕事する前 に
                  AI に 聞く。 親方を 起こさず とも 答えが 返ってくる。
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
