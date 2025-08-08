// メール送信テスト用スクリプト
// 使用方法: node scripts/test-email.js

const testEmail = async () => {
  // 環境変数の確認
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY が設定されていません')
    console.log('📝 .env.local ファイルに以下を追加してください:')
    console.log('RESEND_API_KEY=re_your_api_key_here')
    return
  }

  try {
    console.log('📧 Resend メール送信テストを開始...')
    
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // テストメール送信
    const result = await resend.emails.send({
      from: 'contact@ihara-frontend.com',
      to: 'info@ihara-frontend.com',
      subject: 'テスト: メール送信機能確認',
      html: `
        <h2>🧪 メール送信テスト</h2>
        <p>この メールが正常に届いている場合、以下の設定が正しく動作しています：</p>
        <ul>
          <li>✅ Resend API キー</li>
          <li>✅ DNS 設定（MX、SPF、DKIM）</li>
          <li>✅ メール送信機能</li>
        </ul>
        <p><strong>送信時間:</strong> ${new Date().toLocaleString('ja-JP')}</p>
        <hr>
        <p><small>このメールは自動テストにより送信されました。</small></p>
      `,
    })

    console.log('✅ メール送信成功!')
    console.log('📋 結果:', result)
    console.log('')
    console.log('🔍 次のステップ:')
    console.log('1. info@ihara-frontend.com にメールが届いているか確認')
    console.log('2. スパムフォルダもチェック')
    console.log('3. メールヘッダーでSPF/DKIM認証結果を確認')

  } catch (error) {
    console.error('❌ メール送信エラー:', error.message)
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 API キーが無効です。Resendダッシュボードで確認してください。')
    } else if (error.message.includes('Domain not verified')) {
      console.log('💡 ドメインが未認証です。DNS設定を確認してください。')
    } else {
      console.log('💡 エラーの詳細:', error)
    }
  }
}

// 環境変数読み込み
require('dotenv').config({ path: '.env.local' })

// テスト実行
testEmail()
