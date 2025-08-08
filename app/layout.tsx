import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: '井原誠斗 | AI×Web開発 フリーランスエンジニア',
  description: 'AI技術とWeb開発の専門家。React・Next.js・TypeScriptを使用したモダンなWebサイト・アプリ開発を提供。5年以上の経験でビジネス価値の高いソリューションを実現します。',
  keywords: 'Web制作,ホームページ制作,React開発,Next.js,TypeScript,AI統合,フリーランス,東京',
  authors: [{ name: '井原誠斗', url: 'https://ihara-frontend.com' }],
  creator: '井原誠斗',
  publisher: '井原誠斗',
  robots: 'index, follow',
  openGraph: {
    title: '井原誠斗 | AI×Web開発 フリーランスエンジニア',
    description: 'AI技術とWeb開発の専門家。React・Next.js・TypeScriptを使用したモダンなWebサイト・アプリ開発を提供。',
    url: 'https://ihara-frontend.com',
    siteName: '井原誠斗 ポートフォリオ',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '井原誠斗 | AI×Web開発 フリーランスエンジニア',
    description: 'AI技術とWeb開発の専門家。React・Next.js・TypeScriptを使用したモダンなWebサイト・アプリ開発を提供。',
  },
  other: {
    'theme-color': '#2563eb',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//ihara-frontend.com" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body 
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
