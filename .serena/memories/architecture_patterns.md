# アーキテクチャとデザインパターン

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

### レイヤー構成
```
┌────────────────────────────────────┐
│      Presentation Layer            │  app/page.tsx
│      (UIコンポーネント)              │  components/
├────────────────────────────────────┤
│      Business Logic Layer          │  app/actions/
│      (Server Actions)              │
├────────────────────────────────────┤
│      Utility Layer                 │  lib/
│      (ヘルパー関数)                  │  hooks/
├────────────────────────────────────┤
│      External Services             │  Resend API
│      (外部API)                      │
└────────────────────────────────────┘
```

## Next.js App Router パターン

### ファイルベースルーティング
```
app/
├── layout.tsx          # ルートレイアウト（全ページ共通）
├── page.tsx           # / ルート（ホームページ）
├── globals.css        # グローバルスタイル
└── actions/           # Server Actions
    └── contact.ts     # お問い合わせフォーム処理
```

### Server ComponentとClient Componentの分離
```
app/
├── layout.tsx         # Server Component（メタデータ、SEO）
└── page.tsx          # Client Component（状態管理、イベント処理）

components/
├── ClientLayout.tsx   # Client Component（テーマプロバイダー）
└── ui/                # Server/Client Component混在
```

### Server Actions パターン
```typescript
// Server Action（サーバーサイド処理）
"use server"

export async function submitContactForm(formData: FormData) {
  // 1. バリデーション
  // 2. ビジネスロジック
  // 3. 外部API呼び出し
  // 4. レスポンス返却
  return { success: true, message: "送信完了" }
}

// Client Component（クライアントサイド処理）
"use client"

const [state, formAction, isPending] = useActionState(submitContactForm, null)
```

## コンポーネント設計パターン

### Atomic Designの影響を受けた構成
```
components/
└── ui/                         # Atoms（最小単位のコンポーネント）
    ├── button.tsx              # ボタン
    ├── input.tsx               # 入力フィールド
    ├── card.tsx                # カード
    └── ...

app/page.tsx                    # Organism（複雑なコンポーネント）
└── Contact Form Section        # Molecule（中間単位）
    ├── Input                   # Atom
    ├── Textarea                # Atom
    └── Button                  # Atom
```

### Composition Pattern（合成パターン）
```typescript
// Card コンポーネントの合成
<Card>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
    <CardDescription>説明</CardDescription>
  </CardHeader>
  <CardContent>
    {/* コンテンツ */}
  </CardContent>
</Card>
```

### Variant Pattern（バリアントパターン）
```typescript
// class-variance-authority (cva) を使用
const buttonVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        default: "default-styles",
        outline: "outline-styles",
      },
      size: {
        default: "default-size",
        lg: "large-size",
      },
    },
  }
)

// 使用例
<Button variant="outline" size="lg">ボタン</Button>
```

## 状態管理パターン

### ローカル状態管理（useState）
```typescript
"use client"

const [isOpen, setIsOpen] = useState(false)
```

### フォーム状態管理（useActionState）
```typescript
"use client"

const [state, formAction, isPending] = useActionState(submitForm, null)

// state: Server Actionからの戻り値
// formAction: フォームに渡すアクション
// isPending: 送信中かどうか
```

### サーバー状態管理（Server Components）
```typescript
// Server Component（デフォルト）
export default async function Page() {
  const data = await fetchData()  // サーバーサイドでデータ取得
  return <div>{data}</div>
}
```

## スタイリングパターン

### Tailwind Utility Classes
```typescript
<div className="flex items-center justify-center w-full h-screen p-4 bg-primary text-white">
```

### CSS Variablesパターン
```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

/* Tailwind CSSでの使用 */
<div className="bg-background text-foreground" />
```

### cn()関数パターン
```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class",
  condition && "conditional-class",
  anotherCondition ? "true-class" : "false-class"
)} />
```

## エラーハンドリングパターン

### Server Actionでのエラーハンドリング
```typescript
"use server"

export async function submitForm(formData: FormData) {
  try {
    // 処理
    return { success: true, message: "成功" }
  } catch (error) {
    console.error("エラー:", error)
    return { success: false, message: "エラーが発生しました" }
  }
}
```

### クライアントサイドでのエラー表示
```typescript
{state?.success === false && (
  <Alert variant="destructive">
    <AlertDescription>{state.message}</AlertDescription>
  </Alert>
)}
```

## フォーム処理パターン

### Uncontrolled Formパターン（推奨）
```typescript
// Server Actionとの組み合わせで使用
<form action={formAction}>
  <Input name="email" type="email" required />
  <Button type="submit" disabled={isPending}>
    {isPending ? "送信中..." : "送信"}
  </Button>
</form>
```

### FormDataの取得
```typescript
"use server"

export async function submitForm(formData: FormData) {
  const email = formData.get("email") as string
  const name = formData.get("name") as string
}
```

## データフェッチングパターン

### Server Component（サーバーサイドフェッチ）
```typescript
// デフォルトはServer Component
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

### Server Action（フォーム送信時）
```typescript
"use server"

export async function fetchData() {
  const response = await fetch('https://api.example.com/data')
  return await response.json()
}
```

## 最適化パターン

### 画像最適化パターン
```typescript
import Image from "next/image"

<Image
  src="/images/profile.jpeg"
  alt="プロフィール写真"
  width={400}
  height={400}
  priority  // 重要な画像
  loading="lazy"  // 遅延読み込み（priorityと排他）
/>
```

### 動的インポートパターン
```typescript
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <p>読み込み中...</p>,
  ssr: false  // SSRを無効化（必要に応じて）
})
```

### コード分割パターン
```typescript
// 自動的にルート単位でコード分割される（App Router）
// 大きなライブラリは必要な場合のみインポート
const { Resend } = await import("resend")
```

## セキュリティパターン

### 入力値のサニタイゼーション
```typescript
"use server"

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script.*?\/script>/gi, '')  // XSS対策
    .slice(0, 1000)  // 長さ制限
}

export async function submitForm(formData: FormData) {
  const message = sanitizeInput(formData.get("message") as string)
}
```

### 環境変数の安全な管理
```typescript
// サーバー専用（クライアントに露出しない）
const apiKey = process.env.RESEND_API_KEY

// クライアントに公開（NEXT_PUBLIC_プレフィックス必須）
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
```

## メール送信パターン

### Resend統合パターン
```typescript
"use server"

import { Resend } from "resend"

export async function sendEmail(data: EmailData) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  try {
    const result = await resend.emails.send({
      from: "contact@ihara-frontend.com",
      to: "info@ihara-frontend.com",
      subject: "お問い合わせ",
      html: generateEmailTemplate(data),
    })
    
    return { success: true }
  } catch (error) {
    console.error("メール送信エラー:", error)
    return { success: false, message: "メール送信に失敗しました" }
  }
}
```

### メールテンプレートパターン
```typescript
// lib/email-templates.ts
export function generateEmailTemplate(data: EmailData): string {
  return `
    <h2>新しいお問い合わせ</h2>
    <p><strong>お名前:</strong> ${data.name}</p>
    <p><strong>メールアドレス:</strong> ${data.email}</p>
    <p><strong>メッセージ:</strong></p>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
  `
}
```

## レスポンシブデザインパターン

### Tailwindのブレークポイント
```typescript
<div className="
  w-full              // モバイル（デフォルト）
  md:w-1/2            // タブレット（768px以上）
  lg:w-1/3            // デスクトップ（1024px以上）
  xl:w-1/4            // 大画面（1280px以上）
">
```

### モバイル検出パターン
```typescript
import { useIsMobile } from "@/hooks/use-mobile"

export default function Component() {
  const isMobile = useIsMobile()
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  )
}
```

## アクセシビリティパターン

### Radix UIのアクセシブルコンポーネント
```typescript
// Radix UIは自動的にアクセシビリティをサポート
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>開く</Button>
  </DialogTrigger>
  <DialogContent>
    {/* コンテンツ */}
  </DialogContent>
</Dialog>
```

### セマンティックHTMLパターン
```tsx
<header>
  <nav>
    <ul>
      <li><Link href="/">ホーム</Link></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h1>タイトル</h1>
  </section>
</main>

<footer>
  <p>&copy; 2024 井原誠斗</p>
</footer>
```

## デプロイパターン

### Vercelへの自動デプロイ
```bash
# GitHubにプッシュするだけで自動デプロイ
git push origin main
```

### 環境変数の設定（Vercel）
1. Vercelダッシュボードで設定
2. Environment Variablesに追加
3. 再デプロイで反映

## パフォーマンス監視パターン

### Lighthouseスコアの確認
- Chrome DevToolsで定期的に確認
- Core Web Vitalsの目標値を維持
  - LCP < 2.5秒
  - FID < 100ms
  - CLS < 0.1

### Vercel Analyticsの活用
- リアルタイムのパフォーマンス監視
- ユーザー体験データの収集
- ボトルネックの特定