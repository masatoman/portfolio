"use client"

import { useEffect, useRef, useState } from "react"
import { Check, RotateCcw, Undo2, X } from "lucide-react"
import { applyMaskToImage, type MaskRect } from "@/lib/lab-tools/evidence-organizer"

type Props = {
  file: File
  initialRects?: MaskRect[]
  onApply: (newFile: File, rects: MaskRect[]) => void
  onCancel: () => void
}

export function EvidenceMaskDialog({ file, initialRects, onApply, onCancel }: Props) {
  const [rects, setRects] = useState<MaskRect[]>(initialRects ?? [])
  const [drawing, setDrawing] = useState<MaskRect | null>(null)
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [busy, setBusy] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // ESC で閉じる
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onCancel])

  function handleImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    setImgSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
  }

  // 表示座標 → 元画像座標 への変換
  function toImgCoord(clientX: number, clientY: number): { x: number; y: number } | null {
    const wrap = wrapperRef.current
    if (!wrap || !imgSize) return null
    const rect = wrap.getBoundingClientRect()
    const sx = (clientX - rect.left) * (imgSize.w / rect.width)
    const sy = (clientY - rect.top) * (imgSize.h / rect.height)
    return {
      x: Math.max(0, Math.min(imgSize.w, sx)),
      y: Math.max(0, Math.min(imgSize.h, sy)),
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    if (busy) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = toImgCoord(e.clientX, e.clientY)
    if (!p) return
    setDrawing({ x: p.x, y: p.y, w: 0, h: 0 })
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drawing) return
    const p = toImgCoord(e.clientX, e.clientY)
    if (!p) return
    setDrawing({
      x: Math.min(drawing.x, p.x),
      y: Math.min(drawing.y, p.y),
      w: Math.abs(p.x - drawing.x),
      h: Math.abs(p.y - drawing.y),
    })
  }

  function onPointerUp() {
    if (drawing && drawing.w > 4 && drawing.h > 4) {
      setRects((prev) => [...prev, drawing])
    }
    setDrawing(null)
  }

  function undo() {
    setRects((prev) => prev.slice(0, -1))
  }

  function clear() {
    setRects([])
  }

  async function applyAndClose() {
    setBusy(true)
    try {
      const newFile = await applyMaskToImage(file, rects)
      onApply(newFile, rects)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-5xl max-h-full overflow-auto bg-[#06010f] border border-[#00f0ff]/40 shadow-[0_0_60px_rgba(0,240,255,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#00f0ff]">
              // mask edit
            </p>
            <p className="text-xs text-white/60 font-mono truncate" title={file.name}>
              {file.name}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="h-8 w-8 grid place-items-center text-white/60 hover:text-white hover:bg-white/10 transition"
            aria-label="close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-white/65 leading-relaxed">
            ドラッグで矩形を引くと その範囲を黒塗りします。 通帳の口座番号・残高・カードの磁気帯番号などを 隠してから 抽出に出してください。 元のファイルは置き換わります (Anthropic に送るのは マスク済み画像のみ)。
          </p>

          <div
            ref={wrapperRef}
            className="relative inline-block max-w-full select-none touch-none"
            style={{ cursor: busy ? "wait" : "crosshair" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {previewUrl && (
              <img
                src={previewUrl}
                alt="masking preview"
                onLoad={handleImgLoad}
                draggable={false}
                className="block max-w-full h-auto select-none pointer-events-none"
              />
            )}
            {imgSize && (
              <svg
                viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                {rects.map((r, i) => (
                  <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="#000" />
                ))}
                {drawing && (
                  <rect
                    x={drawing.x}
                    y={drawing.y}
                    width={drawing.w}
                    height={drawing.h}
                    fill="#000"
                    fillOpacity={0.7}
                    stroke="#00f0ff"
                    strokeWidth={Math.max(1, imgSize.w / 600)}
                  />
                )}
              </svg>
            )}
          </div>

          <div className="text-[11px] text-white/50 font-mono">
            masks: {rects.length}
            {drawing && " (drawing...)"}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={rects.length === 0 || busy}
              className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <Undo2 className="h-3.5 w-3.5" />
              undo
            </button>
            <button
              onClick={clear}
              disabled={rects.length === 0 || busy}
              className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition"
            >
              cancel
            </button>
            <button
              onClick={applyAndClose}
              disabled={busy}
              className="inline-flex items-center gap-1.5 border border-[#00f0ff]/60 bg-[#00f0ff]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#00f0ff] hover:bg-[#00f0ff]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Check className="h-3.5 w-3.5" />
              {busy ? "applying..." : "apply mask"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
