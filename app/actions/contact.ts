"use server"

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

      // 管理者へのメール送信
      await resend.emails.send({
        from: "contact@ihara-frontend.com",
        to: "info@ihara-frontend.com",
        subject: `お問い合わせ: ${name}様より`,
        html: `
          <h2>新しいお問い合わせ</h2>
          <p><strong>お名前:</strong> ${name}</p>
          <p><strong>メールアドレス:</strong> ${email}</p>
          <p><strong>お問い合わせ内容:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      })

      // 自動返信メール
      await resend.emails.send({
        from: "noreply@ihara-frontend.com",
        to: email,
        subject: "お問い合わせありがとうございます",
        html: `
          <h2>${name}様</h2>
          <p>お問い合わせいただき、ありがとうございます。</p>
          <p>24時間以内にご返信いたします。</p>
          <br>
          <p>井原誠斗</p>
        `,
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
    console.error("メール送信エラー:", error)
    return {
      success: false,
      message: "送信中にエラーが発生しました。しばらく経ってから再度お試しください。",
    }
  }
}
