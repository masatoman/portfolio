// 簡易版メールテンプレートプレビュー
// 使用方法: node scripts/preview-email-simple.js

const fs = require('fs')
const path = require('path')

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

// 共通スタイル
const commonStyles = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .info-row {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e2e8f0;
    }
    .info-label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 5px;
    }
    .info-value {
      color: #6b7280;
      word-wrap: break-word;
    }
    .message-content {
      background-color: #f1f5f9;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #2563eb;
      margin: 20px 0;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .brand {
      color: #2563eb;
      font-weight: 600;
    }
    .timestamp {
      font-size: 12px;
      color: #9ca3af;
    }
  </style>
`

// 管理者向けメールテンプレート
const getAdminTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>新しいお問い合わせ - ${data.name}様</title>
      ${commonStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 新しいお問い合わせ</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">
            ポートフォリオサイトからお問い合わせが届きました
          </p>
        </div>
        
        <div class="content">
          <div class="info-row">
            <div class="info-label">👤 お名前</div>
            <div class="info-value">${data.name}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">📧 メールアドレス</div>
            <div class="info-value">
              <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">
                ${data.email}
              </a>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-label">📅 受信日時</div>
            <div class="info-value timestamp">${data.timestamp}</div>
          </div>
          
          <div style="margin-top: 25px;">
            <div class="info-label">💬 お問い合わせ内容</div>
            <div class="message-content">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #ecfdf5; border-radius: 6px; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 16px;">💡 対応アクション</h3>
            <ul style="margin: 0; padding-left: 20px; color: #047857;">
              <li>24時間以内の返信を心がけましょう</li>
              <li>必要に応じて詳細をヒアリングしましょう</li>
              <li>プロジェクトの場合は見積もりを準備しましょう</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">
            <span class="brand">井原誠斗 ポートフォリオサイト</span><br>
            <a href="https://ihara-frontend.com" style="color: #2563eb; text-decoration: none;">
              https://ihara-frontend.com
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// 自動返信メールテンプレート
const getAutoReplyTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>お問い合わせありがとうございます</title>
      ${commonStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ お問い合わせを受け付けました</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">
            ${data.name}様、ありがとうございます
          </p>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">
            この度は、<span class="brand">井原誠斗</span>のポートフォリオサイトより<br>
            お問い合わせいただき、誠にありがとうございます。
          </p>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">📧 送信内容の確認</h3>
            
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">お名前:</strong> ${data.name}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">メールアドレス:</strong> ${data.email}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">送信日時:</strong> <span class="timestamp">${data.timestamp}</span>
            </div>
            <div>
              <strong style="color: #374151;">お問い合わせ内容:</strong><br>
              <div style="margin-top: 8px; padding: 10px; background-color: #f8fafc; border-radius: 4px; font-size: 14px; line-height: 1.6;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #0369a1; font-size: 16px;">🕐 今後の流れ</h3>
            <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
              <li><strong>24時間以内</strong>にご返信いたします</li>
              <li>内容を詳しく検討し、最適なご提案をいたします</li>
              <li>必要に応じて、お電話での打ち合わせもご提案いたします</li>
            </ul>
          </div>
          
          <div style="background-color: #fefce8; padding: 20px; border-radius: 6px; border-left: 4px solid #facc15;">
            <h3 style="margin: 0 0 15px 0; color: #a16207; font-size: 16px;">🚀 サービス概要</h3>
            <p style="margin: 0; color: #92400e; line-height: 1.6;">
              <strong>AI技術×Web開発</strong>の専門家として、React・Next.js・TypeScriptを使用した
              モダンなWebサイト・アプリケーション開発を提供しております。
              お客様のビジネス価値向上に貢献いたします。
            </p>
          </div>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            ※ このメールは自動送信されています。<br>
            ご質問がございましたら、このメールにそのままご返信ください。
          </p>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 15px;">
            <strong class="brand">井原誠斗（いはら まさと）</strong><br>
            AI×Web開発 フリーランスエンジニア
          </div>
          <div style="font-size: 13px;">
            <div>📧 info@ihara-frontend.com</div>
            <div>🌐 <a href="https://ihara-frontend.com" style="color: #2563eb; text-decoration: none;">https://ihara-frontend.com</a></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
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
    const adminHtml = getAdminTemplate(sampleData)
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
  }
}

generatePreviews()

