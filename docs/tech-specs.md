# 技術仕様書

## プロジェクト基本情報

**プロジェクト名**: 井原誠斗 ポートフォリオサイト  
**技術スタック**: Next.js 15 + React 19 + TypeScript  
**作成日**: 2024年12月  
**バージョン**: 1.0  

## アーキテクチャ概要

### システム構成図

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   クライアント   │───▶│   Next.js App   │───▶│  Resend API     │
│ (ブラウザ)        │    │   (Vercel)      │    │  (メール送信)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │
         │                        ▼
         │              ┌─────────────────┐
         │              │                 │
         └─────────────▶│  静的アセット    │
                        │  (画像・CSS)     │
                        │                 │
                        └─────────────────┘
```

### 技術構成要素

#### フロントエンド
- **Next.js 15**: App Routerベースのフルスタックフレームワーク
- **React 19**: ユーザーインターフェース構築
- **TypeScript**: 型安全なJavaScript
- **Tailwind CSS**: ユーティリティファーストCSS
- **shadcn/ui**: 再利用可能UIコンポーネント

#### バックエンド
- **Next.js Server Actions**: サーバーサイド処理
- **Resend**: メール送信サービス

#### 開発・ビルドツール
- **pnpm**: パッケージマネージャー
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマッター
- **PostCSS**: CSS処理

## ディレクトリ構成

```
portfolio/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   │   └── contact.ts           # お問い合わせフォーム処理
│   ├── globals.css              # グローバルスタイル
│   ├── layout.tsx               # ルートレイアウト
│   └── page.tsx                 # ホームページ
├── components/                   # Reactコンポーネント
│   ├── theme-provider.tsx       # テーマプロバイダー
│   └── ui/                      # shadcn/uiコンポーネント
├── docs/                        # プロジェクト文書
│   ├── overview.md              # プロジェクト概要
│   ├── requirements.md          # 要件定義
│   ├── tech-specs.md           # 技術仕様（本文書）
│   ├── project-structure.md     # プロジェクト構造
│   └── ...                     # その他文書
├── hooks/                       # カスタムHooks
├── lib/                         # ユーティリティライブラリ
├── public/                      # 静的ファイル
├── styles/                      # スタイルファイル
└── 設定ファイル群
```

## 技術詳細仕様

### 1. Next.js App Router 実装

#### 1.1 ルーティング構成
```typescript
app/
├── layout.tsx          # ルートレイアウト
├── page.tsx           # / (ホームページ)
├── globals.css        # グローバルスタイル
└── actions/
    └── contact.ts     # Server Action
```

#### 1.2 レイアウト設定
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Server Actions 実装

#### 2.1 お問い合わせフォーム処理
```typescript
// app/actions/contact.ts
"use server"

export async function submitContactForm(formData: FormData) {
  // バリデーション
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Resend API を使用したメール送信
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // 管理者・自動返信メール送信
  }
  
  return { success: true, message: "送信完了" }
}
```

#### 2.2 フォーム状態管理
```typescript
// app/page.tsx内のフォーム実装
const [state, formAction, isPending] = useActionState(submitContactForm, null)

// フォーム送信処理
<form action={formAction} className="space-y-4">
  <Input name="name" placeholder="お名前" required />
  <Input name="email" type="email" placeholder="メールアドレス" required />
  <Textarea name="message" placeholder="お問い合わせ内容" required />
  <Button type="submit" disabled={isPending}>
    {isPending ? "送信中..." : "送信する"}
  </Button>
</form>
```

### 3. コンポーネント設計

#### 3.1 UIコンポーネント構成
```typescript
components/
└── ui/
    ├── button.tsx           # ボタンコンポーネント
    ├── card.tsx            # カードレイアウト
    ├── input.tsx           # 入力フィールド
    ├── textarea.tsx        # テキストエリア
    └── ...                 # その他shadcn/uiコンポーネント
```

#### 3.2 再利用可能コンポーネント
```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 4. スタイリング実装

#### 4.1 Tailwind CSS 設定
```typescript
// tailwind.config.ts
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#2563eb',
        'brand-accent': '#f59e0b',
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### 4.2 CSS Variables定義
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --brand-primary: 221.2 83.2% 53.3%;
  --brand-accent: 38.4 92.0% 50.0%;
}
```

### 5. メール機能実装

#### 5.1 Resend 統合
```typescript
// 環境変数設定
RESEND_API_KEY=re_xxxxxxxxxxxxx

// メール送信実装
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: "contact@ihara-frontend.com",
  to: "info@ihara-frontend.com", 
  subject: `お問い合わせ: ${name}様より`,
  html: emailTemplate
})
```

#### 5.2 メールテンプレート
```html
<!-- 管理者向けメール -->
<h2>新しいお問い合わせ</h2>
<p><strong>お名前:</strong> ${name}</p>
<p><strong>メールアドレス:</strong> ${email}</p>
<p><strong>お問い合わせ内容:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>

<!-- 自動返信メール -->
<h2>${name}様</h2>
<p>お問い合わせいただき、ありがとうございます。</p>
<p>24時間以内にご返信いたします。</p>
```

### 6. パフォーマンス最適化

#### 6.1 画像最適化
```typescript
// Next.js Image コンポーネント使用
import Image from "next/image"

<Image
  src="/images/about-photo.jpeg"
  alt="AI×Web開発のワークスペース"
  width={500}
  height={400}
  className="rounded-lg shadow-lg"
/>
```

#### 6.2 コード分割・最適化
```typescript
// 動的インポートによる最適化
const { Resend } = await import("resend")

// バンドルサイズ最適化
import { Button } from "@/components/ui/button"
import { Mail, Code, Palette } from "lucide-react"
```

### 7. TypeScript型定義

#### 7.1 型安全性の確保
```typescript
// フォームデータ型定義
interface ContactFormData {
  name: string
  email: string
  message: string
}

// Server Action戻り値型
interface ContactFormResponse {
  success: boolean
  message: string
}

// スキルデータ型定義
interface Skill {
  name: string
  level: number
}

// サービスデータ型定義
interface Service {
  icon: React.ReactNode
  title: string
  description: string
}
```

#### 7.2 厳格なTypeScript設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 8. ビルド・デプロイ設定

#### 8.1 Next.js設定
```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
```

#### 8.2 パッケージ管理
```json
// package.json主要スクリプト
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 9. 環境変数管理

#### 9.1 必要な環境変数
```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://ihara-frontend.com
```

#### 9.2 型安全な環境変数
```typescript
// lib/env.ts
export const env = {
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
}
```

### 10. セキュリティ実装

#### 10.1 基本セキュリティ
- **HTTPS強制**: Vercelにより自動設定
- **CSRF対策**: Next.js Server Actions内蔵保護
- **XSS対策**: Reactの自動エスケープ
- **入力値検証**: Server Action内でのバリデーション

#### 10.2 フォームセキュリティ
```typescript
// 入力値のサニタイゼーション
function sanitizeInput(input: string): string {
  return input.trim().replace(/<script.*?\/script>/gi, '')
}

// 基本的なバリデーション
if (!name || !email || !message) {
  return { success: false, message: "すべての項目を入力してください。" }
}

if (!email.includes("@")) {
  return { success: false, message: "有効なメールアドレスを入力してください。" }
}
```

## パフォーマンス要件

### 1. Core Web Vitals目標値
- **LCP (Largest Contentful Paint)**: < 2.5秒
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 2. 最適化手法
- **画像最適化**: Next.js Image + WebP/AVIF形式
- **フォント最適化**: 次世代フォント形式の使用
- **コード分割**: 動的インポートによる遅延読み込み
- **キャッシュ最適化**: ブラウザキャッシュの活用

## 監視・メンテナンス

### 1. パフォーマンス監視
- **Lighthouse**: 定期的なパフォーマンス計測
- **Vercel Analytics**: 実際のユーザー体験データ
- **Core Web Vitals**: リアルタイム監視

### 2. エラー監視
- **Next.js組み込み**: 開発・本番エラー表示
- **Vercel Error Tracking**: 本番環境エラー追跡

### 3. 依存関係管理
- **Dependabot**: 自動的な依存関係更新
- **定期監査**: 月1回のセキュリティ監査
- **バージョン管理**: 段階的なアップデート
