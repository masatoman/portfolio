# トップ (`/`) リデザイン 3 案 + Why

> Brief 叩き台 (`docs/design-brief-2026-05-10-top.html`) を踏まえた 3 案。
> どれを 1 つ採用 / どれを部分採用 (例: 案 2 のヒーロー + 案 1 の価格) でも OK。
> 全案とも warm editorial 維持、 brown `#7a5c38` 系、 Noto Serif JP 見出し。

---

## 案の比較表 (一目で分かる)

| 軸 | 案 1: 数字主導 | 案 2: 写真主役 | 案 3: 困りごと共感 |
|---|---|---|---|
| **Hero の主役** | 価格バッジ + 1 行訴求 | 現場写真 (大) | 大きな問いかけ |
| **第一印象** | 「予算範囲だ」 | 「自分の現場っぽい」 | 「自分のことだ」 |
| **CTA 第 1 位** | 「LINE で相談」 | 「制作例を見る」 | 「私の困りごとを話す」 |
| **Examples 見せ方** | 数字付き 8 枚グリッド | 3 主役 (大) + 5 補欠 | 困りごと → デモのリンク |
| **Pricing** | Hero 直下に大きく | 1 段組 圧縮 (中段) | フッター直前に控えめ |
| **訴求型** | 即決型 | 関係構築型 | 共感型 |
| **向いてる主顧客** | 「もう何回か Web 屋見比べた」 慎重派 | 「同業の事例で比較したい」 経営者層 | 「自分の困りごと言語化できてない」 現場監督 |
| **5/15 友人 ヒアリング想定相性** | △ 価格話に行きすぎる | ◎ 写真で会話が広がる | ◎ 困りごとを引き出せる |

---

## 案 1: 数字主導 (Pricing-first)

**コンセプト**: 「予算」 と 「効果数字」 を Hero と Examples の両方に出して、 工務店オーナーの即決判断を加速する。

**いつ刺さる**: 既に Web 屋を 2〜3 社見比べてる中堅工務店オーナー。 「結局いくら?」 「本当に時間減る?」 が判断軸の人。

### Hero (Tailwind JSX イメージ)

```tsx
<section className="px-4 pt-10 pb-14 sm:px-6 sm:pt-14 sm:pb-20">
  <div className="mx-auto max-w-[1240px] grid gap-10 lg:grid-cols-[1fr_minmax(420px,0.95fr)] lg:items-center lg:gap-16">
    <div>
      {/* 価格バッジ (最重要、 H1 より先に視線が行く位置) */}
      <div className="inline-flex items-baseline gap-3 rounded-2xl border-2 border-[#a88456] bg-white px-5 py-3 mb-6 shadow-[0_8px_24px_rgba(122,92,56,0.08)]">
        <span className="text-[12px] font-semibold tracking-[0.16em] text-[#7a5c38]">価格 目安</span>
        <span className={`${headingFont.className} text-[26px] font-bold text-[#1f2a37]`}>
          初期 10 万 <span className="text-[#7a5c38]">+</span> 月 1 万
        </span>
        <span className="text-[11px] text-[#7d766b]">から</span>
      </div>

      <h1 className={`${headingFont.className} text-[40px] sm:text-[58px] leading-[1.4] tracking-[-0.05em] text-[#1f2a37]`}>
        工務店専門の<br />
        Web と 業務改善を、<br />
        <span className="text-[#7a5c38]">一人で全部</span>。
      </h1>

      <p className="mt-6 max-w-[560px] text-[16px] sm:text-[17px] leading-[2] text-[#4f5b66]">
        ANDPAD を入れるほどじゃない 5〜30 人の工務店向け。
        ホームページから 日報・写真整理・領収書まで、
        現場の流れに合わせて まとめて整えます。
      </p>

      {/* CTA: LINE を第一に (摩擦最小) */}
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="https://lin.ee/aHMYDKEu"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-[#06c755] px-7 text-[15px] font-bold text-white hover:bg-[#05b54a] hover:-translate-y-0.5 transition"
        >
          <MessageCircle className="h-5 w-5" />
          LINE で 30 秒 相談
        </a>
        <Link href="#contact" className="inline-flex min-h-[56px] items-center justify-center rounded-full border-2 border-[#c8b89d] bg-white px-7 text-[15px] font-semibold text-[#1f2a37] hover:border-[#7a5c38] transition">
          メールで相談 (24h 以内返信)
        </Link>
      </div>

      {/* 数字 3 点で証拠付け */}
      <dl className="mt-10 grid grid-cols-3 gap-4 max-w-[520px]">
        <div className="border-l-2 border-[#a88456] pl-3">
          <dt className="text-[10px] uppercase tracking-widest text-[#7d766b] mb-1">8</dt>
          <dd className="text-[13px] text-[#4f5b66]">触れる制作例</dd>
        </div>
        <div className="border-l-2 border-[#a88456] pl-3">
          <dt className="text-[10px] uppercase tracking-widest text-[#7d766b] mb-1">月¥5,000以下</dt>
          <dd className="text-[13px] text-[#4f5b66]">ランニング</dd>
        </div>
        <div className="border-l-2 border-[#a88456] pl-3">
          <dt className="text-[10px] uppercase tracking-widest text-[#7d766b] mb-1">5+ 年</dt>
          <dd className="text-[13px] text-[#4f5b66]">Web 開発</dd>
        </div>
      </dl>
    </div>

    {/* Hero 画像 (現場監督 + タブレット) */}
    <div className="relative">
      <Image
        src="/images/local-business/hero-genba-tablet.jpg"  /* 外部生成プレースホルダ */
        alt="現場でタブレットを片手に図面と見比べる工務店監督"
        width={1200} height={1200}
        className="rounded-[28px] border border-[#d8d0c1]"
        priority
      />
    </div>
  </div>
</section>
```

### 残りセクション要点

| セクション | 内容 |
|---|---|
| 2. **Examples** | 8 デモを 3 列グリッド、 各カードに **削減時間バッジ** (「日報 1 時間→ 3 分」) を左上に重ねる。 hiraomakoto 風大きさ |
| 3. **Pricing** | Hero に価格出してるのでここは「**何が初期 10 万に含まれるか**」 (ヒアリング 30 分 + 移行 + 操作レクチャー 1h + 初月 LINE サポート) を 1 段組で詳しく |
| 4. **Process** | 既存の 3 ステップ維持 |
| 5. **GoodFit** | 「こういう人向け」 3 ケース (ANDPAD 入れるほどじゃない / 個人親方 / Web 屋 比較中) |
| 6. **Contact + LINE 大型 CTA** | LINE は摩擦最小、 メールは「24h 以内返信」 を強調 |

### Why この案

- 工務店オーナーは「結局いくら? 効果ある?」 を先に知りたい (memory: customer-target)
- 価格を Hero に出す → 「あ、 自分の予算」 で離脱 / 継続を即決
- ANDPAD と直接比較しやすい (ANDPAD は数字を出さない高見売り)
- ヒアリング Q1/Q2 (saas-pricing.md) と一致 → 5/15 ヒアリングでそのまま検証可

### リスク

- 「安さ訴求」 に振れすぎて、 高単価案件 (受託 50 万級) の入り口が狭まる可能性
- 「初期 10 万」 を見て「もっと安いところある」 で去る層がいる
- masatoman の世界観 (warm editorial) より商業色が強くなる

---

## 案 2: 写真主役 (Works-first, hiraomakoto 流)

**コンセプト**: 「作品が主役」 を徹底。 ヒーローは 1 枚の大きな現場写真 + 1 行コピーだけ。 Examples の 8 デモは「3 主役 + 5 補欠」 構成で、 主役の 3 件は画像をフル幅で見せる。

**いつ刺さる**: 同業の事例を見て「あ、 こういうの欲しかった」 と気づくタイプの経営者層。 5/15 友人ヒアリングで「写真見たら話が広がる」 シナリオ向け。

### Hero (Tailwind JSX イメージ)

```tsx
<section className="relative">
  {/* フル幅の現場写真。 文字オーバレイ */}
  <div className="relative h-[88vh] min-h-[640px] overflow-hidden">
    <Image
      src="/images/local-business/hero-genba-full.jpg"
      alt="日本の工務店の作業場"
      fill
      priority
      className="object-cover"
    />
    {/* 暖色オーバレイ */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1f2a37]/15 to-[#1f2a37]/55" />
    <div className="absolute inset-0 flex items-end">
      <div className="mx-auto max-w-[1240px] w-full px-4 pb-16 sm:px-6 sm:pb-20">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#f3efe7] mb-5">
          MASATO WORKS — 工務店専門の Web と 業務改善
        </p>
        <h1 className={`${headingFont.className} text-white text-[44px] sm:text-[68px] leading-[1.3] tracking-[-0.05em] max-w-[860px]`}>
          現場の流れを、<br/>
          <span className="text-[#e8d4b6]">そっと</span>整える。
        </h1>
        <div className="mt-8">
          <Link href="#examples" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-[#1f2a37] hover:bg-[#e8d4b6] transition">
            8 つの 触れる制作例を見る <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Examples (主役 3 + 補欠 5)

```tsx
<section id="examples" className="bg-[#f8f5ee] py-20 sm:py-28">
  <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
    <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">EXAMPLES</p>
    <h2 className={`${headingFont.className} mt-3 text-[34px] sm:text-[48px] leading-[1.4] tracking-[-0.04em] text-[#1f2a37] mb-12`}>
      触れる 8 つの制作例
    </h2>

    {/* 主役 3 件 (1 件をフル幅、 2 件を 2 列) */}
    <div className="space-y-8 mb-16">
      <BigExampleCard demo={examples[0]} /> {/* voice-daily-report 全幅 */}
      <div className="grid gap-8 md:grid-cols-2">
        <BigExampleCard demo={examples[1]} /> {/* site-photo-organizer */}
        <BigExampleCard demo={examples[2]} /> {/* client-progress-page */}
      </div>
    </div>

    {/* 補欠 5 件 (横スクロール or 4 列圧縮) */}
    <div className="border-t border-[#d8d0c1] pt-10">
      <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63] mb-5">他にもこんな例</p>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {examples.slice(3).map(item => <SmallExampleCard demo={item} />)}
      </div>
    </div>
  </div>
</section>
```

### 残りセクション要点

| セクション | 内容 |
|---|---|
| 1. **Hero** | フル幅写真 + 1 行コピー (上記) |
| 2. **Examples** | 3 主役 + 5 補欠 (上記) |
| 3. **About** | 1 段組 + masatoman ポートレート + 簡単経歴 (5+ 年 Web、 一人で全部) |
| 4. **Pricing** | 1 段組 圧縮、 「初期 10 万 + 月 1 万 から」 を 1 行 + 「内容により応相談」 だけ |
| 5. **Contact + LINE 大型 CTA** | 案 1 同様 |

### Why この案

- masatoman が好きな hirao / bokoko 流 (design-references.md) を最も忠実に踏襲
- 写真が主役 → 工務店オーナーは「うちの現場と同じだ」 を視覚で即理解
- 5/15 友人ヒアリングで「この写真見て」 から会話を広げやすい
- 「作品 (= デモ) が主役、 装飾は黒子」 の masatoman の好みと整合 (works-strategy.md)

### リスク

- フル幅 Hero 写真の品質が命 → Gemini nanobanana2 で良い画像が出るかが勝負
- 価格訴求が弱く、 「結局いくら?」 がスクロールしないと分からない
- ANDPAD のような大企業向け SaaS と差別化しにくい (見た目が「整いすぎ」 寄りになる)

---

## 案 3: 困りごと共感 (Problems-first, 対話型)

**コンセプト**: Hero は大きな問いかけ「現場、 こんなことありません?」。 Problems を 4 件主役にして、 各問題からピンポイントで該当デモへ飛ぶ。 「自分のことだ」 を Hero と Problems で 2 重に作る。

**いつ刺さる**: 「困りごとがあるけど何屋に頼めばいいか分からない」 現場監督 / 一人親方。 5/15 友人ヒアリングで「あれ、 これ自分の話だ」 と引き出すのに最適。

### Hero (Tailwind JSX イメージ)

```tsx
<section className="px-4 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16 bg-[linear-gradient(180deg,#fffdf9,#f3efe7)]">
  <div className="mx-auto max-w-[920px] text-center">
    <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63] mb-6">
      MASATO WORKS — 工務店向け
    </p>
    <h1 className={`${headingFont.className} text-[36px] sm:text-[56px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>
      現場、<br/>
      <span className="text-[#7a5c38]">こんなこと</span>ありませんか?
    </h1>
    <p className="mt-8 max-w-[640px] mx-auto text-[16px] leading-[2] text-[#4f5b66]">
      日報、 写真探し、 図面確認、 領収書、 古い HP。
      工務店の「ちょっと面倒」 を、 一人で全部作って整えます。
      初期 10 万 + 月 1 万 から、 LINE で気軽に相談できます。
    </p>
    <div className="mt-10 flex flex-wrap justify-center gap-3">
      <a href="https://lin.ee/aHMYDKEu" target="_blank" rel="noopener noreferrer"
         className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-[#06c755] px-7 text-[15px] font-bold text-white hover:bg-[#05b54a] hover:-translate-y-0.5 transition">
        <MessageCircle className="h-5 w-5" /> LINE で写真送って相談
      </a>
      <Link href="#problems" className="inline-flex min-h-[56px] items-center justify-center rounded-full border-2 border-[#c8b89d] bg-white px-7 text-[15px] font-semibold text-[#1f2a37] hover:border-[#7a5c38] transition">
        ↓ 自分の困りごと 探す
      </Link>
    </div>
  </div>
</section>
```

### Problems → Examples の直接接続

```tsx
<section id="problems" className="px-4 py-16 sm:px-6 sm:py-20 bg-[#f8f5ee] border-y border-[#ded6c8]">
  <div className="mx-auto max-w-[1240px]">
    <h2 className={`${headingFont.className} text-[28px] sm:text-[40px] leading-[1.5] text-[#1f2a37] text-center mb-12`}>
      よくある 4 つの困りごと
    </h2>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {problemsWithDemoLink.map(p => (
        <article key={p.title} className="group relative rounded-[24px] border border-[#e1d9cc] bg-white p-7 hover:-translate-y-1 hover:border-[#7a5c38] transition">
          <div className="text-[#7a5c38] mb-4">{p.icon}</div>
          <h3 className="text-[18px] font-semibold mb-3">{p.title}</h3>
          <p className="text-[14px] leading-7 text-[#5f6871] mb-5">{p.text}</p>
          <Link href={p.demoHref} className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#7a5c38] group-hover:gap-2 transition-all">
            この困りごと用のデモ <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </article>
      ))}
    </div>
  </div>
</section>
```

### 残りセクション要点

| セクション | 内容 |
|---|---|
| 1. **Hero** | 大きな問いかけ + 1 段落要約 + 中央 CTA 2 個 (上記) |
| 2. **Problems → Examples** | 4 困りごとカード、 各カードから該当デモに直接リンク (上記) |
| 3. **Examples (続き)** | 上で触れなかった 4 デモを「他にもこんな仕組み」 で軽く |
| 4. **About** | 「一人で全部やる masatoman」 の自己紹介 (写真 + 経歴) |
| 5. **Pricing** | 1 段組 圧縮 (案 2 と同じ) |
| 6. **Contact + LINE 大型 CTA** | 「まず LINE で写真送って」 を主訴求 |

### Why この案

- 工務店オーナーは「自分の困りごと言語化」 が苦手 (customer-target.md) → こちらが言語化してあげる
- 各困りごとから直接デモへ → スクロール疲れ前に体験まで連れていける
- 5/15 友人ヒアリングで台本 (friend-hearing-may-2026.md) と完全一致 (「日報、 どこで書いてる?」 → デモ #1) → ヒアリング前に LP で予習させる用途にも使える
- 「LINE で写真送って相談」 は工務店オーナーの自然な行動 (LINE は使ってる)

### リスク

- 「困りごと」 を当てるのが間違ってると逆効果 (例: 「日報なんて困ってない」 と言われる)
- Problems 4 件が固定 = 4 軸以外で困ってる人を取りこぼす
- やや「お悩み解決系」 の臭い (masatoman が「派手」 を嫌うのと近い不快感の可能性)

---

## 私のおすすめ順

1. **案 3 (困りごと共感) [最推奨]** — 5/15 ヒアリング台本と完全一致、 工務店ペルソナに最も寄り添う。 リスクは「困りごと」 4 件の精度だが、 ヒアリングで実検証できる
2. **案 1 (数字主導)** — 「結局いくら?」 が一番強い質問なら有効。 ANDPAD と直接比較できる位置取り
3. **案 2 (写真主役)** — 美しいが、 友人ヒアリング前提だと「美しさより会話のきっかけ」 が欲しい。 写真品質に左右される

ハイブリッド推奨: **案 3 の Hero + Problems** + **案 1 の価格バッジ** + **案 2 の Examples 3 主役 + 5 補欠**。 これが「数字 + 写真 + 共感」 全部入り。

---

## 次のアクション

1. masatoman が **どれか 1 案を選ぶ** or **ハイブリッド** を選ぶ (パーツ単位で組み合わせ可)
2. 私が 採用案を `app/page.tsx` に実装
3. Image src は placeholder のまま、 masatoman が外部生成 (Gemini nanobanana2 / ChatGPT image2) で差し替え
4. dev サーバー (3030) で確認 → 友人ヒアリング (日時未定) で使う
