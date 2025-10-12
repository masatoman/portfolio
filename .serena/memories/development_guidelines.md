# 開発ガイドライン

## 開発原則

### SOLID原則の適用
1. **Single Responsibility Principle（単一責任の原則）**
   - 各コンポーネント・関数は1つの責任のみを持つ
   - 例: `contact.ts` はお問い合わせフォームの処理のみを担当

2. **Open/Closed Principle（開放閉鎖の原則）**
   - 拡張には開いており、修正には閉じている
   - 例: UIコンポーネントはpropsで拡張可能

3. **Liskov Substitution Principle（リスコフの置換原則）**
   - 派生型は基本型と置き換え可能
   - TypeScriptの型システムで保証

4. **Interface Segregation Principle（インターフェース分離の原則）**
   - クライアントに不要なインターフェースを強制しない
   - 小さく焦点を絞ったprops定義

5. **Dependency Inversion Principle（依存性逆転の原則）**
   - 抽象に依存し、具象に依存しない
   - 例: ユーティリティ関数を通じた間接的な依存

### その他の原則

#### DRY（Don't Repeat Yourself）
- 同じコードを繰り返さない
- 再利用可能なコンポーネント・関数を作成
- 例: `lib/utils.ts` の `cn()` 関数

#### KISS（Keep It Simple, Stupid）
- シンプルに保つ
- 過度に複雑な実装を避ける
- 中学生にもわかるコードを心がける

#### YAGNI（You Aren't Gonna Need It）
- 必要になるまで機能を追加しない
- 将来の拡張性よりも現在の要件に集中

## コンポーネント設計ガイドライン

### コンポーネントの分割
1. **適切なサイズ**: 100行以内を目安
2. **単一責任**: 1つの機能のみを持つ
3. **再利用性**: 他の場所でも使える設計

### Propsの設計
```typescript
// 良い例: 明確で型安全
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: "default" | "outline"
  disabled?: boolean
}

// 避けるべき: any型の使用
interface BadProps {
  data: any  // ❌
  onClick: Function  // ❌
}
```

### 状態管理
- **ローカル状態**: `useState` を使用
- **フォーム状態**: `useActionState` を使用（Server Actions）
- **グローバル状態**: 現在は不要（必要になったらContext APIを検討）

## フォーム処理のベストプラクティス

### Server Actionsの使用
```typescript
"use server"

export async function submitForm(formData: FormData) {
  // 1. バリデーション
  const name = formData.get("name") as string
  if (!name) {
    return { success: false, message: "名前を入力してください" }
  }
  
  // 2. 処理
  try {
    // サーバーサイド処理
  } catch (error) {
    // 3. エラーハンドリング
    return { success: false, message: "エラーが発生しました" }
  }
  
  // 4. 成功レスポンス
  return { success: true, message: "送信完了" }
}
```

### クライアントサイドでの使用
```typescript
"use client"

const [state, formAction, isPending] = useActionState(submitForm, null)

return (
  <form action={formAction}>
    <Input name="name" required />
    <Button type="submit" disabled={isPending}>
      {isPending ? "送信中..." : "送信する"}
    </Button>
    {state?.message && <p>{state.message}</p>}
  </form>
)
```

## エラーハンドリング

### try-catch の使用
```typescript
try {
  // 処理
} catch (error) {
  console.error("エラー:", error)
  return { success: false, message: "エラーが発生しました" }
}
```

### エラーメッセージ
- **ユーザー向け**: 分かりやすい日本語
- **開発者向け**: console.errorでログ出力（本番環境では削除される）

## パフォーマンス最適化

### 画像の最適化
```typescript
import Image from "next/image"

<Image
  src="/images/profile.jpeg"
  alt="プロフィール写真"
  width={400}
  height={400}
  priority  // 重要な画像の場合
/>
```

### 動的インポート
```typescript
// 必要な場合のみ
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>読み込み中...</p>
})
```

### メモ化
- `useMemo`: 高コストな計算結果をキャッシュ
- `useCallback`: 関数の再生成を防ぐ
- 注意: 過度な最適化は避ける（YAGNIの原則）

## スタイリングガイドライン

### Tailwind CSSクラスの順序
1. レイアウト: `flex`, `grid`, `block`
2. ボックスモデル: `w-`, `h-`, `p-`, `m-`
3. タイポグラフィ: `text-`, `font-`
4. 視覚効果: `bg-`, `border-`, `shadow-`
5. インタラクション: `hover:`, `focus:`

例:
```tsx
<div className="flex items-center justify-center w-full h-screen p-4 text-center bg-primary text-white hover:bg-primary/90">
```

### カスタムクラスの結合
```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class",
  isActive && "active-class",
  isPending && "pending-class"
)} />
```

## テストに関する考え方

### 現状
- 現在は手動テストのみ
- 自動テストは未導入

### 将来的な追加検討
- **単体テスト**: Vitest + React Testing Library
- **E2Eテスト**: Playwright
- **ビジュアルリグレッションテスト**: Storybook + Chromatic

### 手動テストの重点項目
1. フォーム送信の動作確認
2. レスポンシブデザインの確認
3. ブラウザ互換性の確認
4. パフォーマンスの確認（Lighthouse）

## セキュリティガイドライン

### 入力値のバリデーション
```typescript
// Server Actionで必ずバリデーション
export async function submitForm(formData: FormData) {
  const email = formData.get("email") as string
  
  // 基本的なバリデーション
  if (!email || !email.includes("@")) {
    return { success: false, message: "有効なメールアドレスを入力してください" }
  }
  
  // サニタイゼーション
  const sanitizedEmail = email.trim().toLowerCase()
}
```

### 環境変数の管理
- **サーバー専用**: `RESEND_API_KEY`（プレフィックスなし）
- **クライアント公開**: `NEXT_PUBLIC_SITE_URL`（NEXT_PUBLIC_プレフィックス）
- `.env.local` ファイルで管理（Gitにコミットしない）

### HTTPS通信
- Vercelで自動的にHTTPSが有効化される
- 本番環境では必ずHTTPS通信

## Git操作のベストプラクティス

### コミットメッセージ
```
[種類] 簡潔な説明

詳細な説明（必要に応じて）
```

種類の例:
- `[追加]`: 新機能の追加
- `[修正]`: バグ修正
- `[更新]`: 既存機能の更新
- `[削除]`: ファイル・機能の削除
- `[リファクタリング]`: コードの整理
- `[ドキュメント]`: ドキュメントの更新

### ブランチ戦略
- **main**: 本番環境のコード
- **feature/xxx**: 新機能開発用
- **fix/xxx**: バグ修正用

### プルリクエスト
- 変更内容の説明
- スクリーンショット（UIの変更がある場合）
- チェックリストの確認

## 問題解決のアプローチ

### システム思考
1. **問題を分解**: 大きな問題を小さな問題に分割
2. **優先順位付け**: 重要度と緊急度で優先順位を決定
3. **段階的実装**: 小さく実装して検証を繰り返す

### 意思決定ツリー
1. **選択肢の洗い出し**: 複数の解決策を考える
2. **メリット・デメリットの評価**: それぞれの長所短所を比較
3. **最適解の選択**: プロジェクトの目的に最も合致する解決策を選ぶ

### 反復的改善
1. **初期実装**: まず動くものを作る
2. **フィードバック収集**: 動作確認・テスト
3. **改善**: エッジケース対応や最適化
4. **繰り返し**: さらなる改善を行う

## コードレビューのポイント

### 自己レビュー
- [ ] 型エラーがない
- [ ] リンティングエラーがない
- [ ] テストが通る（手動確認）
- [ ] パフォーマンスに問題がない
- [ ] セキュリティリスクがない
- [ ] 中学生にも理解できる（複雑な部分にコメント）

### 他者レビューを依頼する場合（将来的）
- 変更内容の説明を明確に
- テスト方法を記載
- スクリーンショットを添付（UI変更の場合）

## 継続的な学習

### 技術のキャッチアップ
- Next.jsの公式ドキュメントを定期的に確認
- React 19の新機能を学習
- TypeScriptの型システムを深く理解

### ベストプラクティスの更新
- 業界標準の変化に対応
- 新しいパターンの採用を検討
- コードの定期的なリファクタリング