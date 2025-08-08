'use client'

import { useEffect } from 'react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // ブラウザ拡張機能による動的クラス追加を許可
    // VS Code拡張機能の影響を緩和
    const body = document.body
    const observer = new MutationObserver(() => {
      // 不要なクラスが追加された場合の処理を行う場合はここに記述
    })
    
    observer.observe(body, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}
