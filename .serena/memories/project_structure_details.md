# プロジェクト構造の詳細

## ディレクトリ構造
```
portfolio/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   │   └── contact.ts           # お問い合わせフォーム処理
│   ├── globals.css              # グローバルスタイル
│   ├── layout.tsx               # ルートレイアウト（メタデータ、フォント設定）
│   └── page.tsx                 # ホームページ（メインコンポーネント）
│
├── components/                   # Reactコンポーネント
│   ├── ClientLayout.tsx         # クライアントサイドレイアウト
│   ├── theme-provider.tsx       # テーマプロバイダー
│   └── ui/                      # shadcn/uiコンポーネント（40+個）
│       ├── button.tsx           # ボタンコンポーネント
│       ├── card.tsx             # カードレイアウト
│       ├── input.tsx            # 入力フィールド
│       ├── textarea.tsx         # テキストエリア
│       └── ...                  # その他のUIコンポーネント
│
├── hooks/                       # カスタムフック
│   ├── use-mobile.tsx           # モバイル検出フック
│   └── use-toast.ts             # トーストフック
│
├── lib/                         # ユーティリティライブラリ
│   ├── email-templates.ts       # メールテンプレート
│   └── utils.ts                 # cn()関数など
│
├── public/                      # 静的ファイル
│   ├── images/                  # 画像ファイル
│   │   ├── about-photo.jpeg     # アバウトセクション写真
│   │   └── profile.jpeg         # プロフィール写真
│   ├── placeholder-*.{png,svg,jpg} # プレースホルダー画像
│   └── sw.js                    # Service Worker
│
├── scripts/                     # ユーティリティスクリプト
│   ├── check-dns.js             # DNS確認スクリプト
│   ├── preview-email-simple.js  # メールプレビュー（シンプル版）
│   ├── preview-email.js         # メールプレビュー
│   └── test-email.js            # メール送信テスト
│
├── styles/                      # スタイルファイル
│   └── globals.css              # グローバルスタイル
│
├── docs/                        # プロジェクト文書
│   ├── overview.md              # プロジェクト概要
│   ├── requirements.md          # 要件定義
│   ├── tech-specs.md            # 技術仕様
│   ├── project-structure.md     # プロジェクト構造
│   ├── user-structure.md        # ユーザー構造
│   └── timeline.md              # タイムライン
│
└── 設定ファイル群
    ├── components.json          # shadcn/ui設定
    ├── next.config.mjs          # Next.js設定
    ├── package.json             # 依存関係とスクリプト
    ├── pnpm-lock.yaml           # pnpmロックファイル
    ├── postcss.config.mjs       # PostCSS設定
    ├── tailwind.config.ts       # Tailwind CSS設定
    └── tsconfig.json            # TypeScript設定
```

## 主要ファイルの役割

### app/layout.tsx
- ルートレイアウトコンポーネント
- メタデータの設定（SEO、OGP、Twitter Card）
- フォントの設定（Geist Sans、Geist Mono）
- ClientLayoutコンポーネントのラップ

### app/page.tsx
- ホームページのメインコンポーネント
- 以下のセクションを含む：
  - ヒーローセクション
  - Aboutセクション
  - Servicesセクション
  - Skillsセクション
  - Portfolioセクション（準備中）
  - Contactセクション

### app/actions/contact.ts
- お問い合わせフォームのServer Action
- Resend APIを使用したメール送信
- バリデーション処理

### components/ClientLayout.tsx
- クライアントサイドのレイアウトコンポーネント
- ThemeProviderのラップ
- Toasterコンポーネントの配置

### lib/utils.ts
- `cn()` 関数: clsxとtailwind-mergeを組み合わせたクラス名結合ユーティリティ

### lib/email-templates.ts
- 管理者向けメールテンプレート
- 自動返信メールテンプレート

## 設定ファイルの詳細

### next.config.mjs
- ESLint: ビルド時に無視
- TypeScript: ビルド時にエラーを無視
- 画像最適化: WebP/AVIF形式、適切なキャッシュTTL
- 実験的機能: CSS最適化、パッケージインポート最適化
- コンパイラ: 本番環境でのconsole.log削除
- セキュリティ: poweredByHeaderを無効化
- React Strict Mode: 有効

### tailwind.config.ts
- ダークモード: クラスベース
- カスタムカラー: ブランドプライマリー (#141f49)、ブランドアクセント (#d04a2e)
- CSS Variables: hsl形式での色管理
- アニメーション: accordion-down、accordion-up
- プラグイン: tailwindcss-animate

### tsconfig.json
- strict モード有効
- target: ES6
- module: esnext
- moduleResolution: bundler
- パスエイリアス: `@/*` でプロジェクトルートを参照

## 重要な設計パターン

### Server Components vs Client Components
- デフォルトはServer Component
- `"use client"` ディレクティブでClient Componentを明示
- Client Component: `app/page.tsx`, `components/ClientLayout.tsx`
- Server Component: `app/layout.tsx`

### Server Actions
- `"use server"` ディレクティブで定義
- フォーム送信などのサーバーサイド処理に使用
- 例: `app/actions/contact.ts`

### UIコンポーネントの構成
- shadcn/uiコンポーネント: `components/ui/`
- Radix UIをベースにしたアクセシブルなコンポーネント
- class-variance-authority (cva) を使用したバリアント管理

### カスタムフック
- `use-mobile.tsx`: モバイルデバイスの検出
- `use-toast.ts`: トースト通知の管理

## 静的ファイルの管理
- 画像ファイル: `public/images/` に配置
- プレースホルダー: `public/placeholder-*` ファイル
- Service Worker: `public/sw.js`

## スクリプトファイル
- `check-dns.js`: ドメインのDNS設定確認
- `test-email.js`: Resend APIを使用したメール送信テスト
- `preview-email.js`: メールテンプレートのプレビュー

## ドキュメントファイル
- `docs/` ディレクトリに全てのプロジェクト文書を集約
- Markdown形式で管理
- プロジェクトの理解と保守性の向上に貢献