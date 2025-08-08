// DNS設定確認スクリプト
// 使用方法: node scripts/check-dns.js

const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

const DOMAIN = 'ihara-frontend.com'

const checkDNS = async () => {
  console.log(`🔍 ${DOMAIN} のDNS設定を確認中...\n`)

  const checks = [
    {
      name: 'MXレコード (メール受信)',
      command: `dig MX ${DOMAIN} +short`,
      expected: 'Cloudflareのメールルーティング',
    },
    {
      name: 'SPFレコード (送信者認証)',
      command: `dig TXT ${DOMAIN} +short | grep spf`,
      expected: 'v=spf1 include:_spf.mx.cloudflare.net',
    },
    {
      name: 'DKIMレコード (署名認証)',
      command: `dig TXT resend._domainkey.${DOMAIN} +short`,
      expected: 'p=MIGfMA0GCSqGSIb... (公開鍵)',
    },
    {
      name: 'DMARCレコード (ポリシー)',
      command: `dig TXT _dmarc.${DOMAIN} +short`,
      expected: 'v=DMARC1; p=quarantine',
    },
  ]

  for (const check of checks) {
    try {
      console.log(`📋 ${check.name}`)
      const { stdout, stderr } = await execPromise(check.command)
      
      if (stderr) {
        console.log(`⚠️  警告: ${stderr.trim()}`)
      }
      
      const result = stdout.trim()
      if (result) {
        console.log(`✅ 設定済み: ${result}`)
        
        // 特定のチェック
        if (check.name.includes('DKIM') && result.includes('v=spf1')) {
          console.log(`❌ エラー: DKIMレコードに誤ったSPF値が設定されています`)
          console.log(`💡 修正が必要: ResendのDKIM公開鍵に変更してください`)
        }
      } else {
        console.log(`❌ 未設定`)
        console.log(`💡 期待値: ${check.expected}`)
      }
      
    } catch (error) {
      console.log(`❌ エラー: ${error.message}`)
    }
    
    console.log('')
  }

  // 追加のチェック
  console.log('🔗 追加確認項目:')
  console.log('1. Resendダッシュボードでドメイン認証状況を確認')
  console.log('2. Cloudflare Email Routingでメール転送設定を確認')
  console.log('3. API キーが正しく設定されているか確認')
  console.log('')
  
  console.log('🧪 テスト方法:')
  console.log('npm run test:email  # メール送信テストを実行')
}

checkDNS().catch(console.error)
