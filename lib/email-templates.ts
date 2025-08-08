// シンプルなテキストメールテンプレート

export interface ContactFormData {
  name: string
  email: string
  message: string
  timestamp?: string
}

// 管理者向けメール（新しいお問い合わせ）
export const getAdminNotificationTemplate = (data: ContactFormData): string => {
  const timestamp = data.timestamp || new Date().toLocaleString('ja-JP')
  
  return `新しいお問い合わせが届きました

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 お問い合わせ詳細
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 お名前: ${data.name}
📧 メールアドレス: ${data.email}
📅 受信日時: ${timestamp}

💬 お問い合わせ内容:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 対応アクション
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 24時間以内の返信を心がけましょう
• 必要に応じて詳細をヒアリングしましょう
• プロジェクトの場合は見積もりを準備しましょう

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

井原誠斗 ポートフォリオサイト
https://ihara-frontend.com`
}

// 自動返信メール（お客様向け）
export const getAutoReplyTemplate = (data: ContactFormData): string => {
  const timestamp = data.timestamp || new Date().toLocaleString('ja-JP')
  
  return `${data.name}様

この度は、井原誠斗のポートフォリオサイトより
お問い合わせいただき、誠にありがとうございます。

以下の内容でお問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 送信内容の確認
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

お名前: ${data.name}
メールアドレス: ${data.email}
送信日時: ${timestamp}

お問い合わせ内容:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 今後の流れ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 24時間以内にご返信いたします
• 内容を詳しく検討し、最適なご提案をいたします
• 必要に応じて、お電話での打ち合わせもご提案いたします

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 サービス概要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI技術×Web開発の専門家として、React・Next.js・TypeScript
を使用したモダンなWebサイト・アプリケーション開発を提供して
おります。お客様のビジネス価値向上に貢献いたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

※ このメールは自動送信されています。
ご質問がございましたら、このメールにそのままご返信ください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

井原誠斗（いはら まさと）
AI×Web開発 フリーランスエンジニア

📧 info@ihara-frontend.com
🌐 https://ihara-frontend.com`
}
