// メールテンプレートプレビュー生成スクリプト
// 使用方法: node scripts/preview-email.js

const fs = require('fs')
const path = require('path')

// TypeScriptファイルを動的にrequireするための設定
require('ts-node/register')

const { getAdminNotificationTemplate, getAutoReplyTemplate } = require('../lib/email-templates.ts')

// サンプルデータ
const sampleData = {
  name: '田中太郎',
  email: 'tanaka@example.com',
  message: `いつもお世話になっております。

Webサイトのリニューアルについてご相談があります。

現在運営している会社のコーポレートサイトですが、
デザインが古くなってきており、モダンで使いやすい
サイトに刷新したいと考えております。

特に以下の点を重視したいです：
• スマートフォン対応の強化
• 読み込み速度の向上
• SEO対策の充実
• お問い合わせフォームの改善

予算は200万円程度を想定しており、
3ヶ月以内の完成を希望しています。

お忙しい中恐縮ですが、
一度お打ち合わせの機会をいただけますでしょうか。

よろしくお願いいたします。`,
  timestamp: new Date().toLocaleString('ja-JP')
}

// プレビュー生成
const generatePreviews = () => {
  const outputDir = path.join(__dirname, '../.email-previews')
  
  // 出力ディレクトリを作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  try {
    // 管理者向けメールのプレビュー
    const adminHtml = getAdminNotificationTemplate(sampleData)
    fs.writeFileSync(
      path.join(outputDir, 'admin-notification.html'), 
      adminHtml,
      'utf8'
    )
    
    // 自動返信メールのプレビュー
    const autoReplyHtml = getAutoReplyTemplate(sampleData)
    fs.writeFileSync(
      path.join(outputDir, 'auto-reply.html'), 
      autoReplyHtml,
      'utf8'
    )
    
    // インデックスファイル生成
    const indexHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>メールテンプレート プレビュー</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8fafc;
    }
    .preview-container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .preview-title {
      color: #2563eb;
      font-size: 24px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .preview-link {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin-right: 15px;
      margin-bottom: 15px;
    }
    .preview-link:hover {
      background: #1d4ed8;
    }
    .sample-data {
      background: #f1f5f9;
      padding: 20px;
      border-radius: 6px;
      margin-top: 20px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <h1 class="preview-title">📧 メールテンプレート プレビュー</h1>
    <p>改善されたメールテンプレートのプレビューです。実際の送信時のレイアウトを確認できます。</p>
    
    <div style="margin: 30px 0;">
      <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">管理者向け通知メール</h2>
      <a href="./admin-notification.html" class="preview-link" target="_blank">
        🔔 プレビューを開く
      </a>
      <p style="color: #6b7280; font-size: 14px;">
        新しいお問い合わせが届いた際に管理者に送信されるメールです。
      </p>
    </div>
    
    <div style="margin: 30px 0;">
      <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">自動返信メール</h2>
      <a href="./auto-reply.html" class="preview-link" target="_blank">
        ✅ プレビューを開く
      </a>
      <p style="color: #6b7280; font-size: 14px;">
        お問い合わせ者に自動で送信される返信メールです。
      </p>
    </div>
    
    <div class="sample-data">
      <h3 style="margin: 0 0 10px 0; color: #374151;">サンプルデータ</h3>
      <div><strong>名前:</strong> ${sampleData.name}</div>
      <div><strong>メール:</strong> ${sampleData.email}</div>
      <div><strong>送信時刻:</strong> ${sampleData.timestamp}</div>
    </div>
  </div>
</body>
</html>
    `
    
    fs.writeFileSync(
      path.join(outputDir, 'index.html'), 
      indexHtml,
      'utf8'
    )
    
    console.log('✅ メールプレビューを生成しました！')
    console.log('')
    console.log('📍 プレビューファイル:')
    console.log(`• インデックス: file://${path.join(outputDir, 'index.html')}`)
    console.log(`• 管理者メール: file://${path.join(outputDir, 'admin-notification.html')}`)
    console.log(`• 自動返信メール: file://${path.join(outputDir, 'auto-reply.html')}`)
    console.log('')
    console.log('💡 ブラウザでindex.htmlを開いてプレビューを確認してください！')
    
  } catch (error) {
    console.error('❌ プレビュー生成エラー:', error.message)
    
    if (error.message.includes('Cannot find module')) {
      console.log('💡 ts-nodeをインストールしてください: npm install --save-dev ts-node')
    }
  }
}

generatePreviews()
