"use server"

import { getAdminNotificationTemplate, getAutoReplyTemplate } from '@/lib/email-templates'

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // バリデーション
  if (!name || !email || !message) {
    return {
      success: false,
      message: "すべての項目を入力してください。",
    }
  }

  if (!email.includes("@")) {
    return {
      success: false,
      message: "有効なメールアドレスを入力してください。",
    }
  }

  try {
    // 実際の環境でのメール送信処理
    if (process.env.RESEND_API_KEY) {
      // Resendを動的にインポート（API キーが存在する場合のみ）
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)

      // タイムスタンプ付きのデータオブジェクト
      const contactData = {
        name,
        email,
        message,
        timestamp: new Date().toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }

      // 管理者へのシンプル通知メール
      const adminResult = await resend.emails.send({
        from: "contact@ihara-frontend.com",
        to: "info@ihara-frontend.com",
        subject: `新しいお問い合わせ: ${name}様より`,
        text: getAdminNotificationTemplate(contactData),
      })

      // 自動返信メール（シンプルテキスト）
      const autoReplyResult = await resend.emails.send({
        from: "noreply@ihara-frontend.com",
        to: email,
        subject: "お問い合わせを受け付けました - 井原誠斗",
        text: getAutoReplyTemplate(contactData),
      })

      // ログ出力（開発・デバッグ用）
      console.log('📧 メール送信結果:', {
        admin: adminResult,
        autoReply: autoReplyResult,
        timestamp: contactData.timestamp
      })
    } else {
      // デモ環境での処理（API キーが設定されていない場合）
      console.log("=== お問い合わせフォーム送信 ===")
      console.log(`お名前: ${name}`)
      console.log(`メールアドレス: ${email}`)
      console.log(`お問い合わせ内容: ${message}`)
      console.log("================================")

      // 実際のメール送信をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return {
      success: true,
      message: "お問い合わせありがとうございます。24時間以内にご返信いたします。",
    }
  } catch (error) {
    console.error("📧 メール送信エラー:", error)
    
    // エラータイプ別の詳細メッセージ
    let errorMessage = "送信中にエラーが発生しました。しばらく経ってから再度お試しください。"
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid API key')) {
        errorMessage = "メール設定に問題があります。しばらく経ってから再度お試しください。"
        console.error("🔑 API キーエラー:", error.message)
      } else if (error.message.includes('Domain not verified')) {
        errorMessage = "メール送信サービスの設定を確認中です。しばらく経ってから再度お試しください。"
        console.error("🌐 ドメイン認証エラー:", error.message)
      } else if (error.message.includes('Rate limit')) {
        errorMessage = "送信回数の上限に達しました。しばらく経ってから再度お試しください。"
        console.error("⏰ レート制限エラー:", error.message)
      } else {
        console.error("🚨 予期しないエラー:", error.message)
      }
    }
    
    return {
      success: false,
      message: errorMessage,
    }
  }
}
