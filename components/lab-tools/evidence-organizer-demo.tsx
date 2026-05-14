"use client"

import { useMemo, useState } from "react"
import {
  AlertCircle,
  ClipboardCopy,
  Download,
  Eraser,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react"
import { AuthGate } from "@/components/lab-tools/auth-gate"
import { LabToolPageShell } from "@/components/lab-tools/lab-tool-page-shell"
import { EvidenceMaskDialog } from "@/components/lab-tools/evidence-mask-dialog"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import {
  type EvidenceResponse,
  type ExtractedReceipt,
  type MaskRect,
  resizeImageInBrowser,
} from "@/lib/lab-tools/evidence-organizer"

const MAX_FILES = 10

const yen = (n: number | null) =>
  n === null ? "—" : `¥${n.toLocaleString("ja-JP")}`

type FileItem = {
  id: string
  file: File           // 最終的に送信される (マスク済みなら masked)
  originalFile: File   // 編集元 (マスクをやり直すために保持)
  previewUrl: string
  maskRects: MaskRect[]
}

export function EvidenceOrganizerDemo() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [response, setResponse] = useState<EvidenceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function addFiles(input: FileList | null) {
    if (!input) return
    const incoming = Array.from(input).filter((f) => f.type.startsWith("image/"))
    setFiles((prev) => {
      const merged = [...prev]
      for (const f of incoming) {
        if (merged.length >= MAX_FILES) break
        merged.push({
          id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          originalFile: f,
          previewUrl: URL.createObjectURL(f),
          maskRects: [],
        })
      }
      return merged
    })
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id)
      const removed = prev.find((f) => f.id === id)
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return next
    })
  }

  function clearFiles() {
    for (const f of files) URL.revokeObjectURL(f.previewUrl)
    setFiles([])
    setResponse(null)
    setError(null)
  }

  function applyMaskTo(id: string, newFile: File, rects: MaskRect[]) {
    setFiles((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it
        URL.revokeObjectURL(it.previewUrl)
        return {
          ...it,
          file: newFile,
          previewUrl: URL.createObjectURL(newFile),
          maskRects: rects,
        }
      }),
    )
    setEditingId(null)
  }

  const editingItem = files.find((f) => f.id === editingId) ?? null

  async function onSubmit() {
    if (files.length === 0) return
    setLoading(true)
    setError(null)
    setResponse(null)
    try {
      const fd = new FormData()
      for (const item of files) {
        const { blob } = await resizeImageInBrowser(item.file)
        fd.append("files", new File([blob], item.file.name, { type: blob.type }))
      }
      const res = await fetch("/api/lab-tools/evidence-organizer", {
        method: "POST",
        body: fd,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || body?.error || `HTTP ${res.status}`)
      }
      const data: EvidenceResponse = await res.json()
      setResponse(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error")
    } finally {
      setLoading(false)
    }
  }

  function copyCsv() {
    if (!response?.csv) return
    navigator.clipboard.writeText(response.csv).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function downloadCsv() {
    if (!response?.csv) return
    const blob = new Blob([response.csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "evidence.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <LabToolPageShell
      eyebrow="// lab_tool / evidence_organizer"
      title="証跡 整理くん"
      accent="cyan"
      description="領収書・通帳・請求書の画像を最大 10 枚アップすると、 Claude Vision が日付・金額・支払先・用途・カテゴリを抽出して 補助金報告フォーマットの CSV (Excel で開ける UTF-8 BOM 付き) と 整理用ファイル名案を返します。 画像はクライアントで長辺 1280px に縮小してから送信。"
      disclaimer="抽出結果は『下書き』です。 金額・日付の誤読は必ず人間の目でクロスチェックしてください。 確定申告・補助金実績報告の正本に使う前に 必ず原本との突き合わせをすること。 画像は API 経由で Anthropic に送信されます (短期保持、 学習対象外)。"
    >
      <div className="space-y-10">
        <AuthGate />
        <DropZone
          files={files}
          onAdd={addFiles}
          onRemove={removeFile}
          onClear={clearFiles}
          onEdit={(id) => setEditingId(id)}
        />
        {files.length > 0 && (
          <SubmitButton onSubmit={onSubmit} loading={loading} count={files.length} />
        )}
        {error && <ErrorBlock message={error} />}
        {response && (
          <ResultBlock
            response={response}
            onCopyCsv={copyCsv}
            onDownloadCsv={downloadCsv}
            copied={copied}
          />
        )}
      </div>

      {editingItem && (
        <EvidenceMaskDialog
          file={editingItem.originalFile}
          initialRects={editingItem.maskRects}
          onApply={(newFile, rects) => applyMaskTo(editingItem.id, newFile, rects)}
          onCancel={() => setEditingId(null)}
        />
      )}
    </LabToolPageShell>
  )
}

// ─────────────────────────────────────────
// Drop zone
// ─────────────────────────────────────────

function DropZone({
  files,
  onAdd,
  onRemove,
  onClear,
  onEdit,
}: {
  files: FileItem[]
  onAdd: (list: FileList | null) => void
  onRemove: (id: string) => void
  onClear: () => void
  onEdit: (id: string) => void
}) {
  return (
    <div className="border border-white/10 bg-black/40 p-6 sm:p-8 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
          // 領収書・通帳・請求書 を アップロード (最大 {MAX_FILES} 枚)
        </h2>
        {files.length > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            clear
          </button>
        )}
      </div>

      <label
        className="block border-2 border-dashed border-white/15 hover:border-[#00f0ff]/60 bg-black/30 p-8 text-center cursor-pointer transition"
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onAdd(e.target.files)}
        />
        <Upload className="h-8 w-8 mx-auto text-white/40 mb-3" />
        <p className="text-sm font-bold text-white/80 mb-1">クリックして画像を選択</p>
        <p className="text-[11px] text-white/40 font-mono">
          jpeg / png / heic etc. — 複数選択可
        </p>
      </label>

      {files.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
          {files.map((f) => (
            <FileThumb
              key={f.id}
              item={f}
              onRemove={() => onRemove(f.id)}
              onEdit={() => onEdit(f.id)}
            />
          ))}
        </div>
      )}

      <p className="text-[10px] text-white/40 leading-relaxed">
        通帳・カードなど 機密情報を含む画像は、 サムネイルの <span className="text-[#00f0ff]">mask</span> ボタンから 矩形ドラッグで黒塗りしてから 抽出に出してください。
      </p>
    </div>
  )
}

function FileThumb({
  item,
  onRemove,
  onEdit,
}: {
  item: FileItem
  onRemove: () => void
  onEdit: () => void
}) {
  const masked = item.maskRects.length > 0
  return (
    <div className="relative group border border-white/10 bg-black/60 overflow-hidden">
      <div className="aspect-square bg-black/60 flex items-center justify-center">
        <img
          src={item.previewUrl}
          alt={item.file.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="px-2 py-1.5 border-t border-white/10 flex items-center justify-between gap-2">
        <p className="text-[10px] text-white/60 truncate font-mono flex-1 min-w-0" title={item.file.name}>
          {item.file.name}
        </p>
        {masked && (
          <span className="text-[9px] font-mono uppercase text-[#00f0ff] shrink-0">
            ● {item.maskRects.length} mask
          </span>
        )}
      </div>
      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={onEdit}
          className="h-6 w-6 grid place-items-center bg-black/70 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition"
          aria-label="mask edit"
          title="マスク編集"
        >
          <Eraser className="h-3 w-3" />
        </button>
        <button
          onClick={onRemove}
          className="h-6 w-6 grid place-items-center bg-black/70 border border-white/20 text-white/60 hover:bg-red-500/40 hover:text-white transition"
          aria-label="remove"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Submit
// ─────────────────────────────────────────

function SubmitButton({
  onSubmit,
  loading,
  count,
}: {
  onSubmit: () => void
  loading: boolean
  count: number
}) {
  return (
    <button
      onClick={onSubmit}
      disabled={loading || count === 0}
      className="w-full inline-flex items-center justify-center gap-2 border border-[#00f0ff]/60 bg-[#00f0ff]/10 px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#00f0ff] hover:bg-[#00f0ff]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {count} 枚を 抽出中... (1 枚あたり 数秒)
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {count} 枚から 経費情報を 抽出する
        </>
      )}
    </button>
  )
}

// ─────────────────────────────────────────
// Error
// ─────────────────────────────────────────

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="border border-red-500/40 bg-red-500/5 p-5 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-red-300 mb-1">抽出に失敗しました</p>
        <p className="text-xs text-red-200/70 font-mono">{message}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Results
// ─────────────────────────────────────────

function ResultBlock({
  response,
  onCopyCsv,
  onDownloadCsv,
  copied,
}: {
  response: EvidenceResponse
  onCopyCsv: () => void
  onDownloadCsv: () => void
  copied: boolean
}) {
  const total = useMemo(
    () =>
      response.items.reduce((acc, it) => (it.amount ? acc + it.amount : acc), 0),
    [response.items],
  )
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#00f0ff] mb-1">
            // 抽出結果
          </p>
          <h2 className="text-base font-black tracking-tight">
            {response.items.length} 件 / 合計 ¥{total.toLocaleString("ja-JP")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono uppercase tracking-widest mr-2"
            style={{ color: response.mode === "ai" ? LAB_NEON.green : "#888" }}
          >
            {response.mode === "ai" ? "● ai response" : "○ sample mode"}
          </span>
          <button
            onClick={onCopyCsv}
            className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 transition"
          >
            <ClipboardCopy className="h-3.5 w-3.5" />
            {copied ? "copied" : "csv copy"}
          </button>
          <button
            onClick={onDownloadCsv}
            className="inline-flex items-center gap-1.5 border border-[#00f0ff]/40 bg-[#00f0ff]/5 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#00f0ff] hover:bg-[#00f0ff]/15 transition"
          >
            <Download className="h-3.5 w-3.5" />
            .csv
          </button>
        </div>
      </div>

      {response.caveat && (
        <div className="border border-white/15 bg-black/30 p-4 text-[11px] text-white/60 font-mono leading-relaxed">
          {response.caveat}
        </div>
      )}

      <div className="border border-white/10 bg-black/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-white/50 border-b border-white/10">
              <th className="text-left px-4 py-3 font-normal">date</th>
              <th className="text-right px-4 py-3 font-normal">amount</th>
              <th className="text-left px-4 py-3 font-normal">payee</th>
              <th className="text-left px-4 py-3 font-normal">purpose</th>
              <th className="text-left px-4 py-3 font-normal">cat.</th>
              <th className="text-right px-4 py-3 font-normal">conf</th>
              <th className="text-left px-4 py-3 font-normal">file</th>
            </tr>
          </thead>
          <tbody>
            {response.items.map((it, i) => (
              <ItemRow key={i} item={it} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-white/10 bg-black/30 p-5">
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#00f0ff] mb-3">
          // 整理用 リネーム案
        </p>
        <ul className="space-y-1.5 text-xs text-white/75 font-mono">
          {response.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-white/40">{it.originalFilename}</span>
              <span className="text-white/30">→</span>
              <span className="text-[#00f0ff]">{it.suggestedFilename}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ItemRow({ item }: { item: ExtractedReceipt }) {
  const confColor =
    item.confidence >= 0.8 ? LAB_NEON.green : item.confidence >= 0.5 ? LAB_NEON.amber : "#ff3df0"
  return (
    <tr className="border-b border-white/5 hover:bg-white/5">
      <td className="px-4 py-3 font-mono text-xs text-white/80">{item.date}</td>
      <td className="px-4 py-3 font-mono text-right text-white/90">{yen(item.amount)}</td>
      <td className="px-4 py-3 text-white/85">{item.payee}</td>
      <td className="px-4 py-3 text-white/70 text-xs">{item.purpose}</td>
      <td className="px-4 py-3">
        <span className="inline-block border border-white/20 px-2 py-0.5 text-[10px] font-mono text-white/70">
          {item.category}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-xs" style={{ color: confColor }}>
          {(item.confidence * 100).toFixed(0)}%
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-[10px] text-white/40 max-w-[180px] truncate" title={item.originalFilename}>
        <ImageIcon className="h-3 w-3 inline-block mr-1 align-middle" />
        {item.originalFilename}
      </td>
    </tr>
  )
}
