"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Code, Palette, Smartphone, Globe, Zap, Monitor, Database, Layers, Bot, MessageCircle, ExternalLink, ChefHat, ShoppingCart, BookOpen, Rocket } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import Image from "next/image"
import Link from "next/link"

export default function Portfolio() {

  const skills = [
    { name: "HTML", level: 98 },
    { name: "CSS", level: 95 },
    { name: "Sass", level: 92 },
    { name: "JavaScript", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "React", level: 95 },
    { name: "Next.js", level: 88 },
    { name: "jQuery", level: 85 },
    { name: "Nuxt", level: 80 },
    { name: "Tailwind CSS", level: 90 },
    { name: "MUI", level: 85 },
    { name: "Figma", level: 88 },
    { name: "Webpack", level: 82 },
    { name: "ESLint", level: 85 },
    { name: "Prettier", level: 90 },
    { name: "Vitest", level: 78 },
    { name: "Jest", level: 80 },
    { name: "React Testing Library", level: 82 },
    { name: "Storybook", level: 75 },
    { name: "Playwright", level: 70 },
  ]

  const services = [
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Webサイト制作",
      description: "モダンで美しいWebサイトを制作します。SEO対策も含めた総合的なWeb制作サービス。",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Webアプリ開発",
      description: "React、Vue.js等を使用した高性能なWebアプリケーションの開発。",
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "WordPress構築",
      description: "カスタムテーマ開発からプラグイン作成まで、WordPressの総合的な構築サービス。",
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "CMSサイト作成",
      description: "Headless CMSを活用した柔軟で管理しやすいWebサイトの構築。",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "レスポンシブデザイン対応",
      description: "あらゆるデバイスで最適な表示を実現するレスポンシブWebデザイン。",
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI統合サービス",
      description: "最新のAI技術をWebサイト・アプリに統合し、ユーザー体験を向上させます。",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b z-50 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg sm:text-2xl font-bold text-brand-primary">
              井原 誠斗<span className="hidden sm:inline text-sm font-normal ml-2 text-slate-500">いはら　まさと</span>
            </div>
            <div className="hidden md:flex space-x-6 lg:space-x-8">
              <a href="#about" className="text-slate-600 hover:text-brand-primary transition-colors font-medium">
                About
              </a>
              <a href="#services" className="text-slate-600 hover:text-brand-primary transition-colors font-medium">
                Services
              </a>
              <a href="#skills" className="text-slate-600 hover:text-brand-primary transition-colors font-medium">
                Skills
              </a>
              <a href="#portfolio" className="text-slate-600 hover:text-brand-primary transition-colors font-medium">
                Portfolio
              </a>
              <a href="#contact" className="text-slate-600 hover:text-brand-primary transition-colors font-medium">
                Contact
              </a>
            </div>
            {/* モバイルメニュー */}
            <div className="md:hidden flex space-x-4 text-sm">
              <a href="#about" className="text-slate-600 hover:text-brand-primary transition-colors">
                About
              </a>
              <a href="#contact" className="text-slate-600 hover:text-brand-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 bg-gradient-to-br from-brand-primary to-brand-primary/90 text-white">
        <div className="container mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              井原 誠斗
              <span className="block text-base sm:text-lg font-normal text-blue-200 mt-2">いはら　まさと</span>
            </h1>
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-brand-accent flex-shrink-0" />
              <p className="text-lg sm:text-xl md:text-2xl font-semibold">
                Webサイト・アプリ開発 × AI
              </p>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              最新のAI技術を活用した<br className="sm:hidden" />Webソリューションを提供します
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto px-4 sm:px-0">
              <Button asChild className="bg-brand-accent hover:bg-brand-accent/90 text-white border-0 h-12 sm:h-10 text-base sm:text-sm w-full sm:w-auto">
                <Link href="#contact">
                  <Mail className="mr-2 h-4 w-4" />
                  お問い合わせ
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white hover:text-brand-primary bg-transparent h-12 sm:h-10 text-base sm:text-sm w-full sm:w-auto"
              >
                <Link href="#services">
                  <Zap className="mr-2 h-4 w-4" />
                  サービス一覧
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-brand-primary mb-8 sm:mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-brand-primary mb-3 sm:mb-4">
                AI × Web開発のスペシャリスト
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                5年以上のフロントエンド開発経験を持ち、React・Next.jsを中心としたモダンなWeb開発と最新のAI技術の統合を専門としています。
                HTML/CSS/JavaScriptの基礎から、TypeScript、各種フレームワーク、テスト・開発ツールまで幅広い技術スタックを活用し、
                高品質で保守性の高いWebアプリケーションを開発します。
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-brand-accent flex-shrink-0" />
                  <span className="text-sm sm:text-base text-slate-700">AI技術の実装・統合</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="h-4 w-4 sm:h-5 sm:w-5 text-brand-accent flex-shrink-0" />
                  <span className="text-sm sm:text-base text-slate-700">React・Next.js専門開発</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-brand-accent flex-shrink-0" />
                  <span className="text-sm sm:text-base text-slate-700">Figma・UI/UXデザイン</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-brand-accent flex-shrink-0" />
                  <span className="text-sm sm:text-base text-slate-700">テスト駆動開発・品質保証</span>
                </div>
              </div>

              {/* 実績サマリー */}
              <div className="mt-8 bg-slate-50 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg font-semibold mb-4 text-brand-primary">実績サマリー</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">開発経験</span>
                    <span className="text-sm font-semibold text-brand-primary">5年以上</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">対応企業規模</span>
                    <span className="text-sm font-semibold text-brand-primary">スタートアップ〜大手</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">技術スタック</span>
                    <span className="text-sm font-semibold text-brand-primary">15+ 技術</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Webアプリ開発</span>
                    <span className="text-sm font-semibold text-brand-primary">多数実装</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/images/about-photo.jpeg"
                alt="AI×Web開発のワークスペース"
                width={500}
                height={400}
                className="rounded-lg shadow-lg w-full h-auto"
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-brand-primary mb-8 sm:mb-12">Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-brand-accent">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-brand-accent">{service.icon}</div>
                    <CardTitle className="text-xl text-brand-primary">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-brand-primary mb-8 sm:mb-12">Skills</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 言語・マークアップ */}
            <Card className="border-l-4 border-l-brand-accent">
              <CardHeader>
                <CardTitle className="text-lg text-brand-primary flex items-center">
                  <Code className="h-5 w-5 mr-2 text-brand-accent" />
                  言語・マークアップ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">HTML</span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    CSS
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">Sass</span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    JavaScript
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    TypeScript
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* フレームワーク */}
            <Card className="border-l-4 border-l-brand-accent">
              <CardHeader>
                <CardTitle className="text-lg text-brand-primary flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-brand-accent" />
                  フレームワーク
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">React</span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    Next.js
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    jQuery
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    Nuxt
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* UI・デザイン */}
            <Card className="border-l-4 border-l-brand-accent">
              <CardHeader>
                <CardTitle className="text-lg text-brand-primary flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-brand-accent" />
                  UI・デザイン
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    Tailwind CSS
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    MUI
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">Figma</span>
                </div>
              </CardContent>
            </Card>

            {/* 開発補助ツール */}
            <Card className="border-l-4 border-l-brand-accent">
              <CardHeader>
                <CardTitle className="text-lg text-brand-primary flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-brand-accent" />
                  開発補助ツール
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    Webpack
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    ESLint
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    Prettier
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    Vitest
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">Jest</span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    React Testing Library
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    Storybook
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm ml-2">
                    Playwright
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-brand-primary mb-8 sm:mb-12">Portfolio</h2>
          <p className="text-center text-sm sm:text-base text-slate-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
            個人開発で実際にリリース・運用しているプロダクトです。
          </p>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* recipe-ai */}
            <Card className="border-l-4 border-l-brand-accent hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-brand-accent"><ChefHat className="h-8 w-8" /></div>
                    <CardTitle className="text-xl text-brand-primary">recipe-ai</CardTitle>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded">運用中</span>
                </div>
                <CardDescription className="text-slate-600">
                  YouTube の料理動画から AI が自動でレシピを抽出する Web アプリ。Shorts / 通常動画両対応、PWA・Wake Lock クッキングモード搭載。
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Next.js", "TypeScript", "Supabase", "Anthropic API", "Stripe"].map((t) => (
                    <span key={t} className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{t}</span>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-auto w-full">
                  <Link href="https://recipe-ai-opal.vercel.app/ja" target="_blank" rel="noopener noreferrer">
                    サイトを見る <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* kore-katte-kite */}
            <Card className="border-l-4 border-l-brand-accent hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-brand-accent"><ShoppingCart className="h-8 w-8" /></div>
                    <CardTitle className="text-xl text-brand-primary">これ買ってきて</CardTitle>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded">検証中</span>
                </div>
                <CardDescription className="text-slate-600">
                  共働き家族向けの「買い物依頼」アプリ。リアルタイム同期で依頼側・実行側のすれ違いを解消する。Phase 0 ユーザー検証中。
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Next.js", "TypeScript", "Supabase", "Tailwind CSS"].map((t) => (
                    <span key={t} className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{t}</span>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-auto w-full">
                  <Link href="https://kore-katte-kite.vercel.app" target="_blank" rel="noopener noreferrer">
                    サイトを見る <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* masatoman.net */}
            <Card className="border-l-4 border-l-brand-accent hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-brand-accent"><BookOpen className="h-8 w-8" /></div>
                    <CardTitle className="text-xl text-brand-primary">masatoman.net</CardTitle>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded">運用中</span>
                </div>
                <CardDescription className="text-slate-600">
                  個人開発の検証〜収益化を実体験で公開する技術ブログ。MDX ベースで 70 本以上の記事を運用、SEO・OGP 動的生成・有料記事まで自前実装。
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Next.js 16", "MDX", "TypeScript", "Tailwind CSS"].map((t) => (
                    <span key={t} className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{t}</span>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-auto w-full">
                  <Link href="https://masatoman.net" target="_blank" rel="noopener noreferrer">
                    サイトを見る <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* LaunchKit */}
            <Card className="border-l-4 border-l-brand-accent hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-brand-accent"><Rocket className="h-8 w-8" /></div>
                    <CardTitle className="text-xl text-brand-primary">LaunchKit</CardTitle>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded">運用中</span>
                </div>
                <CardDescription className="text-slate-600">
                  Next.js + Supabase + Stripe を組み合わせた SaaS スターターキット。認証・課金・ダッシュボードを最短で立ち上げる土台として実プロダクトに展開。
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Next.js", "TypeScript", "Supabase", "Stripe", "Tailwind CSS"].map((t) => (
                    <span key={t} className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{t}</span>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-auto w-full">
                  <Link href="https://launchkit.jp" target="_blank" rel="noopener noreferrer">
                    サイトを見る <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-brand-primary text-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Contact</h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 sm:mb-12 max-w-2xl mx-auto text-center px-2">
            プロジェクトのご相談、技術的なお問い合わせ、お見積もりなど、<br className="sm:hidden" />
            どのようなことでもお気軽にご連絡ください。
          </p>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* メールフォーム（法人向け） */}
            <ContactForm />

            {/* LINE Official Account（個人・即時相談向け） */}
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
                className="w-full bg-green-500 hover:bg-green-600 text-white border-0 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-slate-400 text-center">
        <p>&copy; 2026 井原誠斗 (Masato Ihara). All rights reserved.</p>
      </footer>
    </div>
  )
}


