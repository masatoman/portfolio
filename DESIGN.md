# DESIGN.md

## 1. Visual Theme & Atmosphere

このサイトは、`営業LP` ではなく `地域の工務店に提案するときの静かな営業資料` の空気を目指す。
テンションは高くしすぎない。派手なSaaS感、IT企業っぽいグラデーション、押しの強いオレンジCTAは避ける。

基調は `Mastercard` の warm editorial な余白設計と、`Apple` の photo-first な見せ方を組み合わせる。

デザインの方向性:
- 温かい石・紙のような背景色
- 余白を広く使う
- 写真やビジュアルを大きく扱う
- 見出しは落ち着いたセリフ体
- 本文は可読性の高いサンセリフ
- 角丸は大きめだが、子どもっぽくしない
- CTAは目立たせるが、数を絞る
- 施工会社・地域企業に似合う「誠実さ」「静かな上質さ」を優先する

避けるもの:
- ネオン調
- 紫中心のSaaS配色
- 情報が詰まりすぎた比較表
- 過剰なアイコン列
- 強すぎるシャドウ
- AIっぽい平均的LPレイアウト

## 2. Color Palette & Roles

### Primary Surfaces
- `canvas`: `#F3EFE7`
- `canvas-raised`: `#F8F5EE`
- `surface`: `#FFFFFF`
- `surface-warm`: `#FCFAF6`
- `surface-dark`: `#1F2A37`

### Ink / Text
- `ink`: `#1F2A37`
- `ink-soft`: `#4F5B66`
- `ink-muted`: `#5F6871`
- `ink-subtle`: `#7D766B`
- `on-dark`: `#FFFFFF`

### Accent
- `accent-bronze`: `#7A5C38`
- `accent-bronze-deep`: `#694D2D`
- `accent-sand`: `#C8B89D`
- `accent-gold-soft`: `#D9C29A`
- `accent-dot`: `#A88456`

### Borders
- `line`: `#DED6C8`
- `line-strong`: `#D8D0C1`
- `line-soft`: `#E1D9CC`

## 3. Typography Rules

### Heading
- Family: `Noto Serif JP`, serif
- Usage: hero, section heading, pricing emphasis
- Weight: 500 to 700
- Tracking: slightly negative
- Line-height: 1.45 to 1.6 for Japanese readability

### Body
- Family: `Geist Sans`, `Inter`, `system-ui`, sans-serif
- Usage: body, labels, nav, buttons
- Weight: 400 to 600
- Line-height: generous, around 1.8 to 2.0 for body paragraphs in Japanese

### Hierarchy
- Hero: 40px mobile / 62px desktop
- Section heading: 30px mobile / 42px desktop
- Card heading: 18px to 22px
- Body: 15px to 18px
- Eyebrow: 12px uppercase, high tracking

## 4. Layout Principles

- ページ全体は `1240px` を最大幅にする
- ヒーローは `2カラム`、モバイルでは縦積み
- 1セクションあたり十分な上下余白を取る
- セクションの背景は `canvas` と `canvas-raised` を交互に使う
- 文章は1ブロックを長くしすぎない
- 情報は `説明` より `意味のある余白と視線誘導` で理解させる

## 5. Components

### Header
- 半透明ではなく、薄い紙色の固定ヘッダー
- ロゴは白丸や白地の中に置く
- ナビは最小限

### Buttons
- Primary:
  - background: `accent-bronze`
  - text: white
  - radius: full pill
  - weight: 600
- Secondary:
  - background: white
  - border: `accent-sand`
  - text: `ink`
  - radius: full pill

### Cards
- 背景は白または warm surface
- 角丸は 20px から 32px
- シャドウは浅く大きく
- 境界線を薄く入れて紙の層っぽく見せる

### Imagery
- ビジュアルはなるべく大きく見せる
- 画像の周りに過剰なフレームを付けすぎない
- 写真または図版が主役になるように、テキスト量を抑える

### Contact Block
- 大きめの余白
- 左にコピー、右にフォーム
- フォームも営業ツールではなく、静かな相談窓口に見せる

## 6. Depth & Elevation

- シャドウは `rgba(31,42,55,0.06)` から `0.14` 程度
- 強い浮遊感よりも、紙が一枚重なっている印象を優先
- 黒背景セクションでは境界線を薄く見せて引き締める

## 7. Do's and Don'ts

### Do
- 余白を大きく使う
- 見出しを静かに大きくする
- セクションの目的を明確にする
- 施工会社に似合う信頼感を優先する
- 事例は `成果` と `相談イメージ` で見せる

### Don't
- カラフルなSaaSカードを量産しない
- 1画面に情報を詰め込みすぎない
- CTAを何度も叫ばない
- アイコンを主役にしない
- 先に `ITツール感` を出しすぎない

## 8. Responsive Behavior

- モバイルではヒーロー画像を大きく先に見せてもよい
- 見出しの行数を崩さず、字間を詰めすぎない
- カードは1列または2列にし、テキスト密度を抑える
- CTAは指で押しやすい高さを確保する

## 9. Practical Prompt Guide

このデザインでUIを作るときは以下を守る:
- warm editorial
- photography-first
- serif headings
- stone / paper color palette
- calm premium construction-company tone
- minimal CTA
- no startup gradient aesthetic
