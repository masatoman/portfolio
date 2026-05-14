"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type DemoPageShellProps = {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}

export function DemoPageShell({ eyebrow, title, description, children }: DemoPageShellProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/#examples"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Link>
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">
            Prototype
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            {eyebrow}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            {description}
          </p>
        </div>

        {children}

        <section className="mt-20 rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            この方向で相談したい場合
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            営業導線や業務導線をまとめて整える前提で、今の運用に合わせた形に落とし込みます。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-10 rounded-md bg-gray-900 px-4 text-sm font-medium text-white shadow-none hover:bg-gray-800"
            >
              <Link href="/#contact">
                無料で相談する
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-md border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 shadow-none hover:bg-gray-50"
            >
              <Link href="/">トップへ戻る</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
