# プロジェクト構造

## 概要
このプロジェクトはNext.js 15を使用したポートフォリオサイトです。TypeScript、Tailwind CSS、shadcn/uiコンポーネントライブラリを使用しています。

## ディレクトリ構造

```
portfolio/
├── app/                          # Next.js App Router
│   ├── actions/                  # サーバーアクション
│   │   └── contact.ts           # お問い合わせフォーム処理
│   ├── globals.css              # グローバルスタイル
│   ├── layout.tsx               # ルートレイアウト
│   └── page.tsx                 # ホームページ
├── components/                   # Reactコンポーネント
│   ├── theme-provider.tsx       # テーマプロバイダー
│   └── ui/                      # shadcn/uiコンポーネント
│       ├── accordion.tsx        # アコーディオン
│       ├── alert-dialog.tsx     # アラートダイアログ
│       ├── alert.tsx            # アラート
│       ├── aspect-ratio.tsx     # アスペクト比
│       ├── avatar.tsx           # アバター
│       ├── badge.tsx            # バッジ
│       ├── breadcrumb.tsx       # パンくずリスト
│       ├── button.tsx           # ボタン
│       ├── calendar.tsx         # カレンダー
│       ├── card.tsx             # カード
│       ├── carousel.tsx         # カルーセル
│       ├── chart.tsx            # チャート
│       ├── checkbox.tsx         # チェックボックス
│       ├── collapsible.tsx      # 折りたたみ
│       ├── command.tsx          # コマンド
│       ├── context-menu.tsx     # コンテキストメニュー
│       ├── dialog.tsx           # ダイアログ
│       ├── drawer.tsx           # ドロワー
│       ├── dropdown-menu.tsx    # ドロップダウンメニュー
│       ├── form.tsx             # フォーム
│       ├── hover-card.tsx       # ホバーカード
│       ├── input-otp.tsx        # OTP入力
│       ├── input.tsx            # 入力フィールド
│       ├── label.tsx            # ラベル
│       ├── menubar.tsx          # メニューバー
│       ├── navigation-menu.tsx  # ナビゲーションメニュー
│       ├── pagination.tsx       # ページネーション
│       ├── popover.tsx          # ポップオーバー
│       ├── progress.tsx         # プログレスバー
│       ├── radio-group.tsx      # ラジオボタングループ
│       ├── resizable.tsx        # リサイズ可能
│       ├── scroll-area.tsx      # スクロールエリア
│       ├── select.tsx           # セレクト
│       ├── separator.tsx        # セパレーター
│       ├── sheet.tsx            # シート
│       ├── sidebar.tsx          # サイドバー
│       ├── skeleton.tsx         # スケルトン
│       ├── slider.tsx           # スライダー
│       ├── sonner.tsx           # Sonner（トースト）
│       ├── switch.tsx           # スイッチ
│       ├── table.tsx            # テーブル
│       ├── tabs.tsx             # タブ
│       ├── textarea.tsx         # テキストエリア
│       ├── toast.tsx            # トースト
│       ├── toaster.tsx          # トースター
│       ├── toggle-group.tsx     # トグルグループ
│       ├── toggle.tsx           # トグル
│       ├── tooltip.tsx          # ツールチップ
│       ├── use-mobile.tsx       # モバイルフック
│       └── use-toast.ts         # トーストフック
├── hooks/                       # カスタムフック
│   ├── use-mobile.tsx           # モバイル検出フック
│   └── use-toast.ts             # トーストフック
├── lib/                         # ユーティリティライブラリ
│   └── utils.ts                 # 共通ユーティリティ関数
├── public/                      # 静的ファイル
│   ├── images/                  # 画像ファイル
│   │   ├── about-photo.jpeg     # アバウト写真
│   │   └── profile.jpeg         # プロフィール写真
│   ├── placeholder-logo.png     # プレースホルダーロゴ
│   ├── placeholder-logo.svg     # プレースホルダーロゴ（SVG）
│   ├── placeholder-user.jpg     # プレースホルダーユーザー画像
│   ├── placeholder.jpg          # プレースホルダー画像
│   └── placeholder.svg          # プレースホルダー（SVG）
├── styles/                      # スタイルファイル
│   └── globals.css              # グローバルスタイル
├── components.json              # shadcn/ui設定
├── next.config.mjs              # Next.js設定
├── package.json                 # 依存関係とスクリプト
├── pnpm-lock.yaml              # pnpmロックファイル
├── postcss.config.mjs          # PostCSS設定
├── tailwind.config.ts           # Tailwind CSS設定
└── tsconfig.json               # TypeScript設定
```

## 技術スタック

### フレームワーク
- **Next.js 15**: Reactフレームワーク（App Router使用）
- **React 19**: UIライブラリ
- **TypeScript**: 型安全なJavaScript

### スタイリング
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク
- **shadcn/ui**: 再利用可能なUIコンポーネントライブラリ
- **Radix UI**: アクセシブルなプリミティブコンポーネント

### フォーム・バリデーション
- **React Hook Form**: フォーム状態管理
- **Zod**: スキーマバリデーション
- **@hookform/resolvers**: フォームバリデーション統合

### その他のライブラリ
- **Lucide React**: アイコンライブラリ
- **date-fns**: 日付操作
- **recharts**: チャートライブラリ
- **sonner**: トースト通知
- **resend**: メール送信サービス

## 主要機能

### 1. ポートフォリオ表示
- プロフィール情報の表示
- スキル・経験の紹介
- プロジェクト実績の展示

### 2. お問い合わせ機能
- コンタクトフォーム
- メール送信機能（Resend使用）

### 3. レスポンシブデザイン
- モバイル対応
- ダークモード対応

### 4. アクセシビリティ
- Radix UIによるアクセシブルなコンポーネント
- キーボードナビゲーション対応

## 開発環境

### スクリプト
- `npm run dev`: 開発サーバー起動
- `npm run build`: プロダクションビルド
- `npm run start`: プロダクションサーバー起動
- `npm run lint`: コードリンティング

### パッケージマネージャー
- **pnpm**: 高速なパッケージマネージャー

## ファイル命名規則

### コンポーネント
- PascalCase: `ComponentName.tsx`
- カスタムフック: `useHookName.tsx`

### ユーティリティ
- camelCase: `utils.ts`

### 設定ファイル
- kebab-case: `next.config.mjs`

## 注意事項

1. **App Router**: Next.js 13+のApp Routerを使用
2. **TypeScript**: 全ファイルでTypeScriptを使用
3. **shadcn/ui**: コンポーネントは`components/ui/`に配置
4. **静的ファイル**: 画像は`public/images/`に配置
5. **グローバルスタイル**: `app/globals.css`と`styles/globals.css`の両方に存在（要整理）