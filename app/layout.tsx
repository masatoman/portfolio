import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Inter, JetBrains_Mono, Noto_Sans_JP, DotGothic16 } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})
const jetBrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbm',
  display: 'swap',
  weight: ['400', '500', '700', '800'],
  preload: false,
})
const notoSansJp = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  display: 'swap',
  weight: ['400', '500', '700', '900'],
  preload: false,
})
const dotGothic = DotGothic16({
  variable: '--font-dot',
  display: 'swap',
  weight: '400',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ihara-frontend.com'),
  title: '井原誠斗 | 残業の原因を、ITで撃退します。',
  description: 'ホームページ・業務アプリ・既存サイトの改善まで、企画から納品まで 一人で組み上げます。中小企業・個人事業主向けに、現場の手間を減らすしくみづくりをご提供します。',
  keywords: 'Web制作,ホームページ制作,業務アプリ,業務改善,残業削減,フリーランス,中小企業,個人事業主',
  authors: [{ name: '井原誠斗', url: 'https://ihara-frontend.com' }],
  creator: '井原誠斗',
  publisher: '井原誠斗',
  robots: 'index, follow',
  openGraph: {
    title: '井原誠斗 | 残業の原因を、ITで撃退します。',
    description: 'ホームページ・業務アプリ・既存サイトの改善まで、企画から納品まで 一人で組み上げます。',
    url: 'https://ihara-frontend.com',
    siteName: '井原誠斗 ポートフォリオ',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '井原誠斗 | 残業の原因を、ITで撃退します。',
    description: 'ホームページ・業務アプリ・既存サイトの改善まで、企画から納品まで 一人で組み上げます。',
  },
  other: {
    'theme-color': '#06010f',
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
        className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${jetBrains.variable} ${notoSansJp.variable} ${dotGothic.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}
