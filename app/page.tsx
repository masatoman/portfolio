"use client"
import { Button } from "@/components/ui/button"
import {
  Mail,
  MessageCircle,
  ExternalLink,
  ChefHat,
  ShoppingCart,
  BookOpen,
  Rocket,
  Sparkles,
  Zap,
  CreditCard,
  LayoutDashboard,
  FileText,
  Settings,
  CheckCircle2,
  Github,
  Bot,
  Lightbulb,
  Network,
  TrendingDown,
  Eye,
} from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import Image from "next/image"
import Link from "next/link"

const problems = [
  {
    title: "AI機能を入れたい",
    desc: "要約・分類・抽出・文章生成などを、既存サービスや新規アプリに組み込みたい。",
  },
  {
    title: "MVPを早く作りたい",
    desc: "認証、DB、決済、管理画面まで含めて、まず使える形にしたい。",
  },
  {
    title: "既存サイトを改善したい",
    desc: "UI、表示速度、導線、SEO、フォーム改善など、成果につながる部分を整えたい。",
  },
]

const services = [
  {
    icon: <Rocket className="h-5 w-5" />,
    no: "01",
    title: "SaaS / WebアプリMVP開発",
    desc: "Next.js × Supabase を中心に、認証・DB・画面実装・デプロイまでまとめて構築します。",
    tags: ["Next.js", "Supabase", "Vercel"],
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    no: "02",
    title: "AI機能の組み込み",
    desc: "Anthropic API などを使い、要約・分類・抽出・生成といった AI 機能を実装します。",
    tags: ["Anthropic", "OpenAI", "Cloudflare Workers"],
  },
  {
    icon: <Bot className="h-5 w-5" />,
    no: "03",
    title: "AI業務自動化・エージェント設計",
    desc: "Claude Code・複数エージェント・scheduled task を組み合わせ、執筆・SNS・運用業務を自動化するパイプラインを設計します。",
    tags: ["Claude Code", "Multi-Agent", "Automation"],
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    no: "04",
    title: "Stripe決済・課金導線",
    desc: "サブスク、買い切り、有料記事など、スモールビジネス向けの課金導線を整えます。",
    tags: ["Stripe", "Webhook", "Auth"],
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    no: "05",
    title: "個人開発スタート支援 / 検証伴走",
    desc: "Mom Test・Lean Validation を踏まえ、アイデア検証から MVP・媒体立ち上げ・撤退判断までを伴走します。",
    tags: ["Mom Test", "MVP", "Validation"],
  },
  {
    icon: <Settings className="h-5 w-5" />,
    no: "06",
    title: "保守・改善・グロース",
    desc: "公開後の UI 改善・速度改善・計測・機能追加を継続支援。SEO 流入や CV 改善まで含めて見ます。",
    tags: ["UI/UX", "Analytics", "SEO"],
  },
]

const strengths = [
  {
    icon: <Network className="h-6 w-6" />,
    title: "AIワークフロー設計",
    desc: "「Claude Code を使う」を超えて、複数エージェント・scheduled task・特化 skill を目的別に組み合わせ、執筆・SNS・運用業務を恒常的に自動化するパイプラインを構築できます。",
    tags: ["Multi-Agent", "Skill 設計", "Scheduled"],
  },
  {
    icon: <TrendingDown className="h-6 w-6" />,
    title: "月¥5,000の不死戦略",
    desc: "複数 SaaS・複数ブログ・複数自動化を月¥5,000以下で運用する「壊れない構成」の実体験。技術選定・アーキテクチャ・運用設計の合わせ技で、スモールビジネスの最小コスト立ち上げに直結します。",
    tags: ["Cost-Optimized", "Lean", "Reliable"],
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Build in Public検証ノウハウ",
    desc: "失敗・数字・判断理由を構造化して公開する運用力。Mom Test や 4 LLM 連携レビュー等のフレームワークを実装に組み込み、「何が刺さるか・何が無駄か」を実体験ベースで判断できます。",
    tags: ["Build in Public", "Mom Test", "Iteration"],
  },
]

const works = [
  {
    icon: <ChefHat className="h-6 w-6" />,
    title: "recipe-ai",
    status: "運用中",
    desc: "YouTube料理動画から AI が材料・手順・コツを自動抽出する Web アプリ。",
    tags: ["Next.js", "Supabase", "Anthropic API", "Stripe"],
    points: [
      "企画・UI 設計・フロントエンド・DB・AI 連携まで一気通貫で担当",
      "Cloudflare Worker で AI 処理を非同期化、ジョブ進捗を Realtime 通知",
      "PWA ・ Wake Lock クッキングモード・ Shorts 対応まで実装",
    ],
    href: "https://recipe-ai-opal.vercel.app/ja",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "これ買ってきて",
    status: "検証中",
    desc: "共働き家族向けの買い物依頼アプリ。リアルタイム同期で依頼側・実行側のすれ違いを解消する。",
    tags: ["Next.js", "Supabase Realtime", "PWA"],
    points: [
      "依頼者と実行者の役割をリアルタイムで切り替える UI を設計",
      "スマホ前提の片手操作 UX、 PWA で常駐させる体験を実装",
      "Phase 0 として実家族で運用し、課題抽出と改善サイクルを回している",
    ],
    href: "https://kore-katte-kite.vercel.app",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "masatoman.net",
    status: "運用中",
    desc: "個人開発の検証〜収益化を実体験で公開する技術ブログ。",
    tags: ["Next.js 16", "MDX", "Stripe"],
    points: [
      "MDX ベースで 70 本以上の記事を運用・管理",
      "動的 OGP 生成、有料記事、Lab シリーズ、CTA 自動挿入を自前実装",
      "SEO ・ GSC ・ GA4 連携で記事ごとの効果計測",
    ],
    href: "https://masatoman.net",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "LaunchKit",
    status: "運用中",
    desc: "個人開発者向けに、認証・決済・メール基盤をまとめた SaaS スターター。",
    tags: ["Next.js", "Supabase", "Stripe", "Resend"],
    points: [
      "Supabase Auth ・ Stripe ・ Resend を統合した起動 1 日構成",
      "購入後すぐ開発を始められるドキュメント・運用導線を整備",
      "実プロダクト( recipe-ai 等)の土台として使用",
    ],
    href: "https://launchkit.jp",
  },
]

const pricing = [
  {
    badge: "Small",
    title: "LP / 小規模サイト",
    price: "10万円",
    suffix: "〜",
    desc: "サービス紹介・問い合わせ導線・基本的な SEO 設計を含む小規模サイト制作。",
  },
  {
    badge: "Popular",
    title: "WebアプリMVP",
    price: "30万円",
    suffix: "〜",
    desc: "認証・ DB ・主要画面・デプロイまで含めた最小構成の Web アプリ開発。",
    featured: true,
  },
  {
    badge: "AI",
    title: "AI機能追加",
    price: "10万円",
    suffix: "〜",
    desc: "既存アプリへの要約・生成・分類・抽出など AI 機能の実装。",
  },
  {
    badge: "Monthly",
    title: "保守・改善",
    price: "5万円",
    suffix: "〜 / 月",
    desc: "公開後の改善、軽微な修正、 UI 改善、機能追加を継続支援。",
  },
]

const flow = [
  { title: "お問い合わせ", desc: "フォームまたは LINE から、相談内容を簡単にお送りください。" },
  { title: "初回ヒアリング", desc: "目的・現状・予算・納期・必要な機能を確認します。" },
  { title: "概算見積もり", desc: "対応範囲・費用感・進め方を分かりやすく整理します。" },
  { title: "要件整理", desc: "必要に応じて画面構成・機能一覧・優先順位を決めます。" },
  { title: "開発・共有", desc: "GitHub ・ Vercel ・ Figma などで進捗をリアルタイムに共有します。" },
  { title: "納品・改善", desc: "公開後の修正・改善・保守運用も継続して対応可能です。" },
]

const faq = [
  {
    q: "仕様が固まっていなくても相談できますか？",
    a: "可能です。目的や現状を伺い、必要な機能や優先順位の整理から対応できます。",
  },
  {
    q: "小規模な修正だけでも依頼できますか？",
    a: "はい。既存サイトの UI 改善、フォーム修正、速度改善などの単発依頼も対応可能です。",
  },
  {
    q: "AI機能だけ追加できますか？",
    a: "可能です。要約・文章生成・分類・抽出など、既存アプリへの AI 機能追加に対応できます。",
  },
  {
    q: "保守運用も依頼できますか？",
    a: "月額での改善・保守も対応可能です。公開後の小さな改善を継続できます。",
  },
]

const profileRows = [
  { label: "屋号 / 氏名", value: "Ihara Frontend / 井原 誠斗" },
  { label: "活動拠点", value: "リモート対応（オンライン中心）" },
  { label: "得意領域", value: "Next.js / React / Supabase / Stripe / Anthropic API / UI 改善" },
  { label: "対応範囲", value: "要件整理・設計・実装・デプロイ・運用改善" },
  { label: "連絡手段", value: "メール / LINE / Slack / Chatwork / Google Meet" },
]

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-50/80 border-b border-slate-200">
        <nav className="container mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2 sm:gap-3 font-bold tracking-tight">
            <span className="grid place-items-center w-9 h-9 rounded-xl text-white text-sm font-black bg-gradient-to-br from-brand-primary to-brand-accent shadow-md">
              I
            </span>
            <span className="text-lg sm:text-xl text-brand-primary">Ihara Frontend</span>
            <span className="hidden sm:inline text-xs font-medium text-slate-500">井原 誠斗</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#services" className="hover:text-brand-primary transition-colors">できること</a>
            <a href="#works" className="hover:text-brand-primary transition-colors">制作実績</a>
            <a href="#about" className="hover:text-brand-primary transition-colors">プロフィール</a>
            <a href="#price" className="hover:text-brand-primary transition-colors">料金</a>
            <Link
              href="#contact"
              className="px-4 py-2 rounded-full text-white bg-brand-primary hover:bg-brand-primary/90 transition-colors shadow-md text-xs"
            >
              相談する
            </Link>
          </div>
          <Link
            href="#contact"
            className="md:hidden px-3 py-1.5 rounded-full text-white bg-brand-primary text-xs font-semibold"
          >
            相談
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6">
          <div
            aria-hidden
            className="absolute -right-40 -top-40 w-[480px] h-[480px] rounded-full opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(20,31,73,0.18), transparent 65%)" }}
          />
          <div
            aria-hidden
            className="absolute -left-32 top-40 w-[360px] h-[360px] rounded-full opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(208,74,46,0.12), transparent 65%)" }}
          />

          <div className="container mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                AI × Webアプリ開発 / フリーランスエンジニア
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-brand-primary">
                AI機能付き<br className="sm:hidden" />Webアプリ・SaaSの<br />
                立ち上げを支援します。
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Next.js / Supabase / Stripe / Anthropic API を使って、アイデア段階から MVP 開発・認証・決済・運用改善まで対応します。
                個人開発者・スモールビジネス・スタートアップの「まず形にしたい」を現実的なコストで支援します。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-12 px-6 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold shadow-lg shadow-brand-primary/20">
                  <Link href="#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    無料で相談する
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-6 rounded-full bg-white border-slate-300 hover:border-brand-primary text-slate-700 hover:text-brand-primary text-sm font-bold">
                  <Link href="#works">
                    制作実績を見る
                  </Link>
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {["Next.js", "Supabase", "Stripe", "Anthropic API", "SaaS MVP", "UI 改善"].map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile card */}
            <aside className="relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <Image
                    src="/images/about-photo.jpeg"
                    alt="井原誠斗 — フロントエンドエンジニア"
                    width={160}
                    height={160}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-brand-primary/10"
                    priority
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" aria-label="受付中" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-brand-primary leading-tight">井原 誠斗</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">フロントエンドエンジニア / 個人事業主</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                React・Next.js を中心に、 AI 連携・認証・決済・ DB 設計まで一気通貫で対応。
              </p>
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  { v: "5+", l: "Years" },
                  { v: "4", l: "Live Products" },
                  { v: "AI×Web", l: "Specialty" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-3 text-center">
                    <div className="text-base sm:text-lg font-black text-brand-primary tracking-tight">{s.v}</div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* Status banner */}
        <section className="px-4 sm:px-6 -mt-4 sm:-mt-6 mb-2 sm:mb-4">
          <div className="container mx-auto">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-bold text-emerald-900">現在、新規案件のご相談を受付中です</span>
              </div>
              <span className="text-xs sm:text-sm text-emerald-800/80 font-medium">
                平均返信時間 24 時間以内 / 初回ヒアリングは無料
              </span>
            </div>
          </div>
        </section>

        {/* Problems */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto">
            <SectionHead label="Problems" title="こんな状況で相談できます" text="仕様が完全に固まっていなくても問題ありません。目的・予算・納期から、最小構成の MVP に落とし込みます。" />
            <div className="grid md:grid-cols-3 gap-4">
              {problems.map((p) => (
                <div key={p.title} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-black text-lg text-brand-primary tracking-tight mb-2">{p.title}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
          <div className="container mx-auto">
            <SectionHead label="Services" title="対応できること" text="フロントエンド実装だけでなく、サービス設計・ API 連携・ DB ・決済・公開後の改善まで対応します。" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {services.map((s) => (
                <article key={s.no} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:border-brand-accent/50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand-primary/10 text-brand-primary">
                      {s.icon}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">{s.no}</span>
                  </div>
                  <h3 className="font-black text-lg text-brand-primary tracking-tight mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Works */}
        <section id="works" className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto">
            <SectionHead label="Works" title="制作・開発実績" text="実際に公開・運用しているプロダクトです。担当範囲・技術・工夫点を含めて掲載しています。" />
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              {works.map((w) => (
                <article key={w.title} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="p-6 sm:p-7 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand-accent/10 text-brand-accent">
                          {w.icon}
                        </div>
                        <h3 className="font-black text-xl text-brand-primary tracking-tight">{w.title}</h3>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${w.status === "運用中" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {w.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{w.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {w.tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                    <ul className="space-y-2 mb-6 flex-grow">
                      {w.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="mt-auto w-full rounded-full border-slate-300 hover:border-brand-primary hover:text-brand-primary">
                      <Link href={w.href} target="_blank" rel="noopener noreferrer">
                        サイトを見る <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
          <div className="container mx-auto bg-white border border-slate-200 rounded-3xl p-7 sm:p-10 shadow-lg shadow-slate-200/40 max-w-4xl">
            <div className="flex items-center gap-4 sm:gap-5 mb-6">
              <Image
                src="/images/about-photo.jpeg"
                alt="井原誠斗 — フロントエンドエンジニア"
                width={160}
                height={160}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-brand-primary/10 shrink-0"
              />
              <div className="min-w-0">
                <SectionLabel>About</SectionLabel>
                <p className="text-sm text-slate-500 mt-1">井原 誠斗 / フロントエンドエンジニア</p>
              </div>
            </div>
            <div>
              <h2 className="font-black text-2xl sm:text-3xl tracking-tight text-brand-primary leading-tight mb-4">
                作って終わりではなく、公開後の改善まで見据えて開発します。
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                フロントエンドを軸に、 Next.js ・ Supabase ・ Stripe ・ Anthropic API を使った Web アプリ開発を行っています。
                個人開発・小規模事業では、最初から大きく作るよりも「最小構成で早く公開し、反応を見ながら改善する」ことが重要だと考えています。
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                仕様整理から実装、デプロイ、改善まで一気通貫で対応できるため、まだアイデア段階のご相談も歓迎です。
                自分自身が複数プロダクトを Build in Public で公開・運用しており、失敗・数字・判断理由を含めた実体験ベースで提案できます。
              </p>
              <div className="mt-7 grid gap-0">
                {profileRows.map((r) => (
                  <div key={r.label} className="grid sm:grid-cols-[140px_1fr] gap-1 sm:gap-4 py-3 border-t border-slate-200 text-sm">
                    <strong className="text-slate-900 font-bold">{r.label}</strong>
                    <span className="text-slate-600">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Strengths */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto">
            <SectionHead
              label="Strengths"
              title="エンジニア × 個人開発者だからこその価値"
              text="フレームワークが書けるエンジニアは多くいます。差がつくのは、自動化設計・コスト最適化・検証ノウハウなどの「運用知見」です。実体験ベースで提供できる差別化ポイントを 3 つに絞りました。"
            />
            <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
              {strengths.map((s) => (
                <article
                  key={s.title}
                  className="rounded-2xl bg-gradient-to-br from-brand-primary/[0.03] to-brand-accent/[0.04] border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid place-items-center w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-accent mb-4">
                    {s.icon}
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-brand-primary tracking-tight mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="price" className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
          <div className="container mx-auto">
            <SectionHead label="Price" title="料金目安" text="内容・納期・仕様により変動します。まずは現状と目的を伺い、必要な範囲に絞ってご提案します。" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {pricing.map((p) => (
                <article
                  key={p.title}
                  className={`rounded-2xl bg-white border p-6 shadow-sm hover:shadow-md transition-shadow ${
                    p.featured ? "border-brand-accent/50 shadow-md ring-1 ring-brand-accent/20" : "border-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-black mb-3 ${
                      p.featured ? "bg-brand-accent/15 text-brand-accent" : "bg-brand-primary/10 text-brand-primary"
                    }`}
                  >
                    {p.badge}
                  </span>
                  <h3 className="font-black text-lg text-brand-primary tracking-tight">{p.title}</h3>
                  <div className="mt-3 mb-3 text-2xl font-black tracking-tight text-slate-900">
                    {p.price}
                    <span className="text-sm text-slate-500 font-bold ml-1">{p.suffix}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-xs text-slate-500 text-center">
              ※ 表示価格はあくまで目安です。仕様確定後に正式なお見積もりをお出しします。
            </p>
          </div>
        </section>

        {/* Flow */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto">
            <SectionHead label="Flow" title="ご相談の流れ" text="いきなり契約ではなく、まずは目的・予算・納期を整理し、必要な範囲を明確にします。" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {flow.map((f, i) => (
                <div key={f.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                  <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand-primary text-white font-black text-sm mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-black text-base text-brand-primary tracking-tight mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
          <div className="container mx-auto">
            <SectionHead label="FAQ" title="よくある質問" />
            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              {faq.map((f) => (
                <div key={f.q} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-black text-base text-brand-primary tracking-tight mb-2">Q. {f.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">A. {f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-14 sm:py-20 px-4 sm:px-6 bg-brand-primary text-white">
          <div className="container mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block text-xs font-black uppercase tracking-widest text-brand-accent mb-3">
                Contact
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                AI機能付き Web アプリや SaaS 開発の<br className="hidden sm:inline" />
                ご相談を受け付けています。
              </h2>
              <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
                まだアイデア段階でも大丈夫です。作りたいもの、困っていること、予算感だけでもお送りください。
              </p>
            </div>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
              <ContactForm />
              <div className="bg-white/5 rounded-lg p-6 sm:p-8 border border-white/20 flex flex-col">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="bg-green-500/20 p-4 rounded-full mb-4">
                    <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">LINE公式アカウント</h3>
                  <p className="text-sm sm:text-base text-blue-100">
                    カジュアル相談・スピード重視向け
                  </p>
                </div>
                <ul className="text-sm text-blue-100 space-y-2 mb-6 flex-grow">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span>初回ヒアリング・概算見積もり</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span>技術的な質問・カジュアル相談</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span>すばやくレスポンスが欲しい方向け</span>
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full bg-green-500 hover:bg-green-600 text-white border-0 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-full"
                >
                  <Link href="https://lin.ee/aHMYDKEu" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    LINEで相談する
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 bg-slate-900 text-slate-400 text-sm">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; 2026 井原誠斗 (Masato Ihara). All rights reserved.</span>
          <span className="flex items-center gap-2 text-xs">
            <Zap className="w-3.5 h-3.5 text-brand-accent" />
            このサイトも Next.js × Tailwind × Claude Code で構築
          </span>
        </div>
      </footer>
    </div>
  )
}

function SectionHead({ label, title, text }: { label: string; title: string; text?: string }) {
  return (
    <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <h2 className="font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-brand-primary leading-tight mt-2">
          {title}
        </h2>
      </div>
      {text && <p className="max-w-md text-sm text-slate-600 leading-relaxed">{text}</p>}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-black uppercase tracking-widest text-brand-accent">
      {children}
    </div>
  )
}
