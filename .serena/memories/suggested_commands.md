# よく使うコマンド

## プロジェクトディレクトリ
```bash
cd /Volumes/Samsung/Works/github/portfolio
```

## 開発コマンド

### 開発サーバーの起動
```bash
pnpm dev
# または
npm run dev
```
開発サーバーが http://localhost:3000 で起動します。

### プロダクションビルド
```bash
pnpm build
# または
npm run build
```
本番環境用のビルドを生成します。

### プロダクションサーバーの起動
```bash
pnpm start
# または
npm run start
```
ビルド後のアプリケーションを起動します。

### コードリンティング
```bash
pnpm lint
# または
npm run lint
```
ESLintによるコードチェックを実行します。

## プロジェクト固有のスクリプト

### メール送信テスト
```bash
pnpm test:email
# または
npm run test:email
```
お問い合わせフォームのメール送信機能をテストします。

### DNS確認
```bash
pnpm check:dns
# または
npm run check:dns
```
ドメインのDNS設定を確認します。

### メールプレビュー
```bash
pnpm preview:email
# または
npm run preview:email
```
メールテンプレートをプレビューします。

## パッケージ管理

### パッケージのインストール
```bash
pnpm install
# または
npm install
```

### 新しいパッケージの追加
```bash
pnpm add <package-name>
# または
npm install <package-name>
```

### 開発用パッケージの追加
```bash
pnpm add -D <package-name>
# または
npm install -D <package-name>
```

### パッケージの更新
```bash
pnpm update
# または
npm update
```

## shadcn/ui コンポーネントの追加
```bash
pnpx shadcn@latest add <component-name>
# 例
pnpx shadcn@latest add button
```

## Git操作

### 変更の確認
```bash
git status
```

### 変更のステージング
```bash
git add .
# または特定のファイル
git add <file-path>
```

### コミット
```bash
git commit -m "コミットメッセージ"
```

### プッシュ
```bash
git push origin main
```

### プル
```bash
git pull origin main
```

### ブランチ作成
```bash
git checkout -b <branch-name>
```

## Darwin (macOS) 特有のコマンド

### ファイル検索
```bash
find . -name "*.tsx" -type f
```

### ディレクトリ一覧
```bash
ls -la
```

### プロセス確認
```bash
ps aux | grep node
```

### ポート確認
```bash
lsof -i :3000
```

### ポートを使用しているプロセスの終了
```bash
kill -9 $(lsof -ti:3000)
```

## ファイル操作

### ファイルの閲覧
```bash
cat <file-path>
# または
less <file-path>
```

### ファイル検索（内容）
```bash
grep -r "検索文字列" .
```

### ディレクトリ作成
```bash
mkdir <directory-name>
```

### ファイル削除
```bash
rm <file-path>
# ディレクトリ削除
rm -rf <directory-path>
```

## 環境変数

### .env.local ファイルの作成
```bash
touch .env.local
```

### 環境変数の設定例
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://ihara-frontend.com
```

## デバッグ・トラブルシューティング

### node_modules の再インストール
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Next.jsキャッシュのクリア
```bash
rm -rf .next
pnpm dev
```

### TypeScriptの型チェック
```bash
pnpm tsc --noEmit
# または
npx tsc --noEmit
```

## パフォーマンス確認

### Lighthouseの実行（Chrome DevTools）
1. Chrome DevToolsを開く（F12）
2. Lighthouseタブを選択
3. 「Generate report」をクリック

## デプロイ

### Vercelへのデプロイ（初回）
```bash
pnpx vercel
```

### Vercelへのデプロイ（更新）
```bash
git push origin main
# GitHubに接続していれば自動デプロイされます
```

## その他の便利なコマンド

### プロジェクトのディスク使用量確認
```bash
du -sh .
```

### パッケージサイズの確認
```bash
pnpm list --depth=0
```

### 依存関係の脆弱性チェック
```bash
pnpm audit
```