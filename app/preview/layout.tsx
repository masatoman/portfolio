import {
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
  Space_Grotesk,
  Noto_Sans_JP,
  Shippori_Mincho,
  DotGothic16,
  Zen_Kaku_Gothic_New,
} from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
})
const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbm",
  display: "swap",
  weight: ["400", "500", "700", "800"],
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

// Japanese — preload disabled because Google Fonts ships these as huge subsets.
const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  display: "swap",
  weight: ["400", "500", "700", "900"],
  preload: false,
})
const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori",
  display: "swap",
  weight: ["500", "700", "800"],
  preload: false,
})
const dotGothic = DotGothic16({
  variable: "--font-dot",
  display: "swap",
  weight: "400",
  preload: false,
})
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  display: "swap",
  weight: ["500", "700", "900"],
  preload: false,
})

const fontVars = [
  inter.variable,
  instrumentSerif.variable,
  jetBrains.variable,
  spaceGrotesk.variable,
  notoSansJp.variable,
  shipporiMincho.variable,
  dotGothic.variable,
  zenKaku.variable,
].join(" ")

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className={fontVars}>{children}</div>
}
