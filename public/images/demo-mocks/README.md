# demo-mocks / ChatGPT 生成 UI モック画像置き場

## 用途

8 つの工務店向けデモ機能の UI デザインモックアップ画像を保存。 `app/demo-gallery/page.tsx` で表示され、 友人ヒアリング・北原氏面談で「どれが欲しい?」 を聞くために使う。

## ファイル名規則

デモのスラッグ.png

```
estimate-organizer.png
call-memo-board.png
site-photo-organizer.png
voice-daily-report.png
receipt-expense-camera.png
drawing-quick-viewer.png
client-progress-page.png
website-refresh.png
```

## 推奨サイズ

- デスクトップ画面想定: 1440×900 / 1280×800
- スマホ画面想定: 390×844 / 750×1334 (Retina)
- フォーマット: PNG (透過なし、 RGB)
- ファイルサイズ: 1 枚あたり 500KB 以下 (= 圧縮済)

## 生成方法

`~/.claude/projects/_inbox/chatgpt-design-prompts-2026-05-14.md` のプロンプトを ChatGPT (GPT-4o or DALL-E 3) に投げて生成。

## URL

Next.js public/ 配下なので、 デプロイ後は以下で参照可能:

```
https://ihara-frontend.com/images/demo-mocks/estimate-organizer.png
http://localhost:3000/images/demo-mocks/estimate-organizer.png  (ローカル開発)
```

## 表示ページ

- 公開ギャラリー: `/demo-gallery`
- 友人ヒアリング・北原氏面談で使う想定
