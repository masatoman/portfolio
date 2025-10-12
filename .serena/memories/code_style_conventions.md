# コードスタイル・規約

## TypeScript設定
- **strict モード**: 有効
- **target**: ES6
- **module**: esnext
- **moduleResolution**: bundler
- **パスエイリアス**: `@/*` で プロジェクトルートを参照

## ファイル命名規則

### コンポーネント
- **PascalCase**: `ComponentName.tsx`
- 例: `Button.tsx`, `Portfolio.tsx`, `ClientLayout.tsx`

### カスタムフック
- **camelCase with use prefix**: `useHookName.tsx` または `use-hook-name.tsx`
- 例: `use-mobile.tsx`, `use-toast.ts`

### ユーティリティ
- **camelCase**: `utils.ts`

### 設定ファイル
- **kebab-case**: `next.config.mjs`, `tailwind.config.ts`

### Server Actions
- **camelCase**: `contact.ts`

## ディレクトリ構造
```
app/                    # Next.js App Router
├── actions/            # Server Actions（サーバーサイド処理）
├── globals.css         # グローバルスタイル
├── layout.tsx          # ルートレイアウト
└── page.tsx            # ページコンポーネント

components/             # Reactコンポーネント
├── ui/                 # shadcn/uiコンポーネント（PascalCase）
└── *.tsx              # その他のコンポーネント

hooks/                  # カスタムフック
lib/                    # ユーティリティライブラリ
public/                 # 静的ファイル（画像など）
docs/                   # プロジェクト文書
```

## コンポーネント設計パターン

### Server Component vs Client Component
- デフォルトはServer Component
- クライアントサイドの状態管理やイベントハンドラが必要な場合は `"use client"` を使用
- Server Actionsは `"use server"` を使用

### コンポーネント構造
```typescript
// Client Component の例
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ComponentName() {
  const [state, setState] = useState()
  
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Server Action の例
```typescript
"use server"

export async function actionName(formData: FormData) {
  // サーバーサイド処理
  return { success: true }
}
```

## スタイリング規約

### Tailwind CSSクラス名の結合
```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-class", conditional && "conditional-class")} />
```

### CSS Variables
- `hsl(var(--variable-name))` 形式で使用
- テーマカラーは `--background`, `--foreground`, `--primary` などを使用

### カスタムカラー
- **primary**: `#141f49` (ブランドプライマリー)
- **accent**: `#d04a2e` (ブランドアクセント)

## コーディング規約

### インポート順序
1. React関連
2. Next.js関連
3. サードパーティライブラリ
4. ローカルコンポーネント (`@/components/...`)
5. ユーティリティ (`@/lib/...`)
6. 型定義
7. スタイル

例:
```typescript
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### 型定義
- **明示的な型定義**: 可能な限り型を明示
- **interface vs type**: プロップス定義はinterfaceを推奨
- **型エクスポート**: `export interface` または `export type`

### 関数定義
- **コンポーネント**: `export default function ComponentName() {}`
- **ユーティリティ**: `export function utilityName() {}`
- **Server Actions**: `export async function actionName() {}`

## アクセシビリティ
- **alt属性**: すべての画像に適切なalt属性を設定
- **セマンティックHTML**: 適切なHTML要素を使用
- **キーボードナビゲーション**: Radix UIコンポーネントで自動対応

## パフォーマンス最適化
- **Next.js Image**: `next/image` を使用して画像を最適化
- **動的インポート**: 必要に応じて `import()` を使用
- **コード分割**: 自動的に実行される（App Router）

## エラーハンドリング
- **フォーム送信**: `useActionState` を使用してエラー状態を管理
- **try-catch**: 非同期処理では適切なエラーハンドリング

## 環境変数
- **命名**: `NEXT_PUBLIC_` プレフィックスでクライアントサイドに公開
- **サーバーのみ**: プレフィックスなしはサーバーサイドのみ
- **型安全性**: 環境変数の型を定義して使用

## コメント
- **JSDoc**: 複雑な関数には簡潔な説明を追加
- **TODO**: `// TODO:` でタスクをマーク
- **中学生にもわかる**: 複雑なロジックには易しい言葉で説明コメントを追加