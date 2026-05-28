"use client"

/**
 * Interactive demo for /local-business/content-auto.
 *
 * Flow:
 *   1. Pick one of 5 fixed sample photos
 *   2. Enter a one-line memo (e.g. "○○邸の屋根葺替完成")
 *   3. Click "AI 生成" → 1.2s 遅延 → 3種類の記事を生成して表示
 *      - 施工事例記事
 *      - Instagram投稿
 *      - お客様の声インタビュー風
 *   4. 過去生成済 12件 一覧 + 「もう一度生成」 ボタン
 *
 * No real AI API call. Templates are filled with the user's memo on the client.
 */

import Image from "next/image"
import { useMemo, useState } from "react"
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Loader2,
  ImageIcon,
  Instagram,
  FileText,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  contentAutoPastItems,
  contentAutoPhotos,
  contentAutoTags,
  type ContentAutoPastItem,
  type ContentAutoPhoto,
} from "@/lib/local-business/content-auto"

type GenerationState = "idle" | "generating" | "done"

type GeneratedTriple = {
  blogArticle: string
  instagramPost: string
  customerVoice: string
}

function buildTriple(photo: ContentAutoPhoto, memo: string): GeneratedTriple {
  const subject = memo.trim() || photo.defaultMemo

  const blogArticle =
    `${subject}しました。 今回の工事では、 ご家族のご要望を丁寧にお伺いし、 既存の住まいに馴染む仕上がりを心がけました。\n\n` +
    `現場の状況に応じて段取りを調整しながら、 安全と品質の両立を意識して進めています。 工期は予定通り、 仕上げまで含めて滞りなく完了しました。\n\n` +
    `引渡し時にはご家族からも 「想像以上の出来栄え」 とのお言葉をいただきました。 これからも長く安心して暮らしていただけるよう、 アフターメンテナンスも継続してまいります。`

  const instagramPost =
    `${subject} ✨\n\n` +
    `ご家族のご要望をしっかり伺って、 丁寧に進めた現場。 仕上がりにご満足いただけました。\n\n` +
    `ご相談はプロフィールのリンクから📩\n\n` +
    `${contentAutoTags.join(" ")}`

  const customerVoice =
    `「${subject.replace(/完成|完了|完了。|完成。/g, "")}の工事を依頼しました。 最初の打合せから引渡しまで、 こちらの細かい要望にも親身に対応していただきました。 ` +
    `現場の方も挨拶がしっかりしていて、 近所への気遣いも安心できました。 仕上がりは想像以上で、 家族みんな大満足です。 ` +
    `また何かあれば、 ぜひお願いしたいと思っています。」\n\n` +
    `— お客様 (50代 ご夫婦)`

  return { blogArticle, instagramPost, customerVoice }
}

const statusStyle: Record<ContentAutoPastItem["status"], string> = {
  公開済: "bg-[#e8fbf2] text-[#0e9d6a] border-[#bfeacd]",
  下書き: "bg-[#fef7e0] text-[#8a6d1c] border-[#f2deab]",
  承認待ち: "bg-[#e8f0fb] text-[#1f4ea1] border-[#cad9f0]",
}

const typeIcon: Record<ContentAutoPastItem["type"], React.ComponentType<{ className?: string }>> = {
  施工事例記事: FileText,
  Instagram投稿: Instagram,
  お客様の声: MessageCircle,
}

export function ContentAutoDemo() {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>(contentAutoPhotos[0].id)
  const [memo, setMemo] = useState<string>(contentAutoPhotos[0].defaultMemo)
  const [state, setState] = useState<GenerationState>("idle")
  const [generated, setGenerated] = useState<GeneratedTriple | null>(null)

  const selectedPhoto = useMemo(
    () => contentAutoPhotos.find((p) => p.id === selectedPhotoId) ?? contentAutoPhotos[0],
    [selectedPhotoId],
  )

  function handleSelectPhoto(id: string) {
    setSelectedPhotoId(id)
    const next = contentAutoPhotos.find((p) => p.id === id)
    if (next) setMemo(next.defaultMemo)
    setState("idle")
    setGenerated(null)
  }

  function handleGenerate() {
    setState("generating")
    setGenerated(null)
    window.setTimeout(() => {
      setGenerated(buildTriple(selectedPhoto, memo))
      setState("done")
    }, 1200)
  }

  function handleRegenerate() {
    handleGenerate()
  }

  return (
    <div className="space-y-10">
      {/* Step 1 + 2: Input form */}
      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)] sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f3ecff] text-[#7c3aed]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#071b49]">写真と 1行メモ を 投げるだけ</h2>
            <p className="text-sm font-bold text-[#5f6f89]">
              現場で撮った写真と短いメモから、 3種類の記事が 自動でできます。
            </p>
          </div>
        </div>

        {/* Photo picker */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-[#5f6f89]">
            <ImageIcon className="h-4 w-4" />
            STEP 1. 写真を 選ぶ
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {contentAutoPhotos.map((photo) => {
              const isActive = photo.id === selectedPhotoId
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => handleSelectPhoto(photo.id)}
                  aria-pressed={isActive}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition ${
                    isActive
                      ? "border-[#7c3aed] shadow-[0_8px_24px_rgba(124,58,237,0.25)]"
                      : "border-transparent hover:border-[#cfd8e6]"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.label}
                    width={400}
                    height={300}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-2">
                    <p className="text-left text-xs font-bold text-white">{photo.label}</p>
                  </div>
                  {isActive && (
                    <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-[#7c3aed] text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Memo input */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-[#5f6f89]">
            <FileText className="h-4 w-4" />
            STEP 2. 1行メモ を 入力
          </div>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例: ○○邸の屋根葺替完成"
            className="w-full rounded-2xl border border-[#cfd8e6] bg-white px-4 py-3 text-base font-medium text-[#1f2a37] outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#e9ddff]"
          />
          <p className="mt-2 text-xs font-medium text-[#5f6f89]">
            ※ 工事内容と お客様名 (匿名で OK) を 短く入れるだけで OK。
          </p>
        </div>

        {/* Generate button */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={state === "generating"}
            className="h-12 rounded-full bg-[#7c3aed] px-6 text-sm font-bold text-white shadow-[0_10px_28px_rgba(124,58,237,0.3)] transition hover:bg-[#6b29d6] disabled:opacity-60"
          >
            {state === "generating" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI が 記事を 書いています...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI で 3記事 まとめて 生成
              </>
            )}
          </Button>
          {state === "done" && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRegenerate}
              className="h-12 rounded-full border-[#cfd8e6] bg-white px-5 text-sm font-bold text-[#33496d]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              もう一度 生成
            </Button>
          )}
        </div>
      </section>

      {/* Step 3: Generated preview */}
      {(state === "generating" || state === "done") && (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-[#071b49]">AI 生成プレビュー</h3>
            <span className="rounded-full bg-[#f3ecff] px-3 py-1 text-xs font-bold text-[#7c3aed]">
              3種類 同時生成
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* 施工事例記事 */}
            <article className="rounded-[20px] border border-[#d8e3f2] bg-white p-5 shadow-[0_10px_30px_rgba(7,27,73,0.06)]">
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e8f0fb] text-[#1f4ea1]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#5f6f89]">FORMAT</p>
                  <p className="text-sm font-black text-[#071b49]">施工事例記事</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.label}
                  width={600}
                  height={400}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="mt-4 min-h-[220px] rounded-xl bg-[#f7f9fc] p-4 text-sm leading-7 text-[#33496d]">
                {state === "generating" ? (
                  <SkeletonLines lines={6} />
                ) : (
                  <p className="whitespace-pre-line">{generated?.blogArticle}</p>
                )}
              </div>
              <p className="mt-3 text-xs font-medium text-[#5f6f89]">
                想定 文字数: 約 300字 / 公開先: 自社サイト 施工事例
              </p>
            </article>

            {/* Instagram投稿 */}
            <article className="rounded-[20px] border border-[#d8e3f2] bg-white p-5 shadow-[0_10px_30px_rgba(7,27,73,0.06)]">
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#fde8f3] text-[#c2185b]">
                  <Instagram className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#5f6f89]">FORMAT</p>
                  <p className="text-sm font-black text-[#071b49]">Instagram 投稿</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.label}
                  width={600}
                  height={600}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="mt-4 min-h-[220px] rounded-xl bg-[#f7f9fc] p-4 text-sm leading-7 text-[#33496d]">
                {state === "generating" ? (
                  <SkeletonLines lines={5} />
                ) : (
                  <p className="whitespace-pre-line">{generated?.instagramPost}</p>
                )}
              </div>
              <p className="mt-3 text-xs font-medium text-[#5f6f89]">
                想定 文字数: 約 140字 + ハッシュタグ / 公開先: Instagram
              </p>
            </article>

            {/* お客様の声 */}
            <article className="rounded-[20px] border border-[#d8e3f2] bg-white p-5 shadow-[0_10px_30px_rgba(7,27,73,0.06)]">
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e8fbf2] text-[#0e9d6a]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#5f6f89]">FORMAT</p>
                  <p className="text-sm font-black text-[#071b49]">お客様の声 インタビュー風</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.label}
                  width={600}
                  height={400}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="mt-4 min-h-[220px] rounded-xl bg-[#f7f9fc] p-4 text-sm leading-7 text-[#33496d]">
                {state === "generating" ? (
                  <SkeletonLines lines={6} />
                ) : (
                  <p className="whitespace-pre-line">{generated?.customerVoice}</p>
                )}
              </div>
              <p className="mt-3 text-xs font-medium text-[#5f6f89]">
                想定 文字数: 約 200字 / 公開先: 自社サイト お客様の声
              </p>
            </article>
          </div>

          {state === "done" && (
            <div className="rounded-[16px] border border-[#bfeacd] bg-[#f1fbf5] p-4 text-sm font-medium text-[#0e7c52]">
              <CheckCircle2 className="mr-2 inline-block h-4 w-4 align-text-bottom" />
              生成 完了。 後継者 (アトツギ) が 1タップで 公開承認 → 自社サイト + Instagram + 施工事例ページ に 同時投稿されます。
            </div>
          )}
        </section>
      )}

      {/* 過去生成済 一覧 */}
      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)] sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[#071b49]">過去 生成 一覧</h2>
            <p className="text-sm font-bold text-[#5f6f89]">
              過去 30日 で 自動生成された 記事 12件。 承認 / 公開 状態も 一覧で 確認できます。
            </p>
          </div>
          <div className="flex gap-3 text-xs font-bold">
            <span className="rounded-full bg-[#e8fbf2] px-3 py-1 text-[#0e9d6a]">公開済 8</span>
            <span className="rounded-full bg-[#e8f0fb] px-3 py-1 text-[#1f4ea1]">承認待ち 2</span>
            <span className="rounded-full bg-[#fef7e0] px-3 py-1 text-[#8a6d1c]">下書き 2</span>
          </div>
        </div>

        <div className="divide-y divide-[#e8edf3] overflow-hidden rounded-2xl border border-[#e8edf3]">
          {contentAutoPastItems.map((item) => {
            const Icon = typeIcon[item.type]
            return (
              <div
                key={item.id}
                className="grid gap-3 bg-white p-4 transition hover:bg-[#fafbfd] sm:grid-cols-[120px_1fr_auto] sm:items-center"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[#5f6f89]">
                  <span className="font-mono">{item.date}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f3ecff] text-[#7c3aed]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#7c3aed]">{item.type}</span>
                      <span className="text-xs text-[#5f6f89]">元メモ:</span>
                      <span className="text-xs font-semibold text-[#33496d]">{item.memo}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#33496d]">
                      {item.preview}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle[item.status]}`}
                  >
                    {item.status}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-full border-[#cfd8e6] bg-white px-3 text-xs font-bold text-[#33496d]"
                    onClick={() => {
                      // 「もう一度生成」: フォームに元メモを戻して生成しなおすイメージ
                      setMemo(item.memo)
                      setState("idle")
                      setGenerated(null)
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    }}
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    もう一度 生成
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function SkeletonLines({ lines }: { lines: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded bg-[#e1e7f0]"
          style={{ width: `${70 + ((i * 13) % 28)}%` }}
        />
      ))}
    </div>
  )
}
