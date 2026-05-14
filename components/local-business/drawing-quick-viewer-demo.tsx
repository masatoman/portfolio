"use client"

import { useMemo, useState } from "react"
import { Search, Star, FileText, Maximize2 } from "lucide-react"
import {
  sampleFloorPlan,
  sampleHotspots,
  searchHotspots,
  type DrawingHotspot,
} from "@/lib/local-business/drawing-quick-viewer"

export function DrawingQuickViewerDemo() {
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState<string>(sampleHotspots[0].id)
  const initialFavorites = sampleHotspots.slice(1, 3).map((h) => h.id)
  const initialRecent = sampleHotspots.slice(0, 3).map((h) => h.id)
  const [favorites, setFavorites] = useState<string[]>(initialFavorites)
  const [recent, setRecent] = useState<string[]>(initialRecent)

  const filteredResults = useMemo(() => searchHotspots(sampleHotspots, query), [query])
  const active = useMemo(
    () => sampleHotspots.find((h) => h.id === activeId) ?? sampleHotspots[0],
    [activeId],
  )

  function selectHotspot(id: string) {
    setActiveId(id)
    setRecent((current) => [id, ...current.filter((rid) => rid !== id)].slice(0, 4))
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((fid) => fid !== id) : [id, ...current],
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="space-y-5">
        <div className="rounded-[24px] border border-[#e9d5ff] bg-white p-6 shadow-[0_14px_40px_rgba(168,85,247,0.1)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f3e8ff] text-[#7e22ce]">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#071b49]">部屋名で 一発 呼び出し</h2>
              <p className="text-sm font-bold text-[#5f6f89]">
                「リビング」「玄関」と 入力するだけ。
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5f6f89]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例: リビング, 玄関, トイレ"
              className="h-14 w-full rounded-2xl border-2 border-[#e9d5ff] bg-white pl-12 pr-4 text-base font-bold text-[#071b49] placeholder:text-[#94a3b8] focus:border-[#a855f7] focus:outline-none"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filteredResults.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => selectHotspot(h.id)}
                className={`min-h-[60px] rounded-2xl border-2 px-4 py-3 text-left text-base font-black transition ${
                  activeId === h.id
                    ? "text-white"
                    : "border-[#e9d5ff] bg-white text-[#33496d] hover:border-[#a855f7]"
                }`}
                style={
                  activeId === h.id
                    ? { backgroundColor: h.swatch, borderColor: h.swatch }
                    : undefined
                }
              >
                {h.roomName}
              </button>
            ))}
            {filteredResults.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-[#e9d5ff] bg-[#fafaf9] p-6 text-center">
                <p className="text-sm font-bold text-[#5f6f89]">
                  該当する部屋が ありません
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ListPanel
            title="お気に入り"
            icon={<Star className="h-4 w-4" />}
            iconBg="#fef3c7"
            iconColor="#b45309"
            ids={favorites}
            activeId={activeId}
            onSelect={selectHotspot}
            emptyMessage="星マークで 登録できます"
          />
          <ListPanel
            title="最近 開いた"
            icon={<FileText className="h-4 w-4" />}
            iconBg="#dbeafe"
            iconColor="#2f6fb6"
            ids={recent}
            activeId={activeId}
            onSelect={selectHotspot}
            emptyMessage="まだ ありません"
          />
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e9d5ff] bg-white p-6 shadow-[0_14px_40px_rgba(168,85,247,0.1)]">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7e22ce]">
              {sampleFloorPlan.drawingTitle}
            </p>
            <h3 className="mt-1 text-lg font-black text-[#071b49]">
              {active.roomName} の 詳細
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#5f6f89]">
            <span>{sampleFloorPlan.drawingNumber}</span>
            <span>·</span>
            <span>縮尺 {sampleFloorPlan.scale}</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border-2 border-[#e9d5ff] bg-white">
          <FloorPlanImage activeHotspot={active} hotspots={sampleHotspots} onSelect={selectHotspot} />
          <button
            type="button"
            onClick={() => toggleFavorite(active.id)}
            aria-label={favorites.includes(active.id) ? "お気に入りから外す" : "お気に入りに追加"}
            className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_6px_18px_rgba(7,27,73,0.15)] transition hover:scale-105"
          >
            <Star
              className="h-6 w-6"
              fill={favorites.includes(active.id) ? "#facc15" : "transparent"}
              stroke={favorites.includes(active.id) ? "#facc15" : "#5f6f89"}
            />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-[11px] font-black text-[#166534]">
            OCR で {sampleFloorPlan.detectedRoomCount} 部屋を 自動検出
          </span>
          <p className="text-[10px] font-bold text-[#94a3b8]">
            画像を 入れ替えるだけで 部屋ラベルを 自動でピックアップ。
          </p>
        </div>
        <p className="mt-1 text-[10px] font-bold text-[#94a3b8]">
          ※ サンプル図面は{" "}
          <a
            href={sampleFloorPlan.imageAttribution.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted hover:text-[#7e22ce]"
          >
            {sampleFloorPlan.imageAttribution.author}
          </a>{" "}
          を出典明記の上 デモ目的で表示。 寸法・仕様の数値はデモ用の補足で、 元図面の意図とは異なる可能性があります。
        </p>

        <div className="mt-5 space-y-2">
          {active.notes.map((n) => (
            <div
              key={n.label}
              className="flex items-baseline justify-between gap-3 rounded-xl border border-[#e9d5ff] bg-[linear-gradient(135deg,#faf5ff,#ffffff)] px-4 py-3"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#7e22ce]">
                {n.label}
              </span>
              <span className="font-mono text-sm font-black text-[#071b49] sm:text-base">
                {n.value}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7e22ce] px-5 py-3 text-sm font-black text-white shadow-[0_8px_20px_rgba(126,34,206,0.25)] transition hover:bg-[#6b21a8]"
        >
          <Maximize2 className="h-4 w-4" />
          全画面で 図面を見る
        </button>
      </section>
    </div>
  )
}

function ListPanel({
  title,
  icon,
  iconBg,
  iconColor,
  ids,
  activeId,
  onSelect,
  emptyMessage,
}: {
  title: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  ids: string[]
  activeId: string
  onSelect: (id: string) => void
  emptyMessage: string
}) {
  const items = ids
    .map((id) => sampleHotspots.find((h) => h.id === id))
    .filter((h): h is DrawingHotspot => Boolean(h))

  return (
    <div className="rounded-2xl border border-[#e9d5ff] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="grid h-7 w-7 place-items-center rounded-full"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </span>
        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">
          {title}
        </span>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => onSelect(h.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-black transition ${
                  activeId === h.id
                    ? "bg-[#a855f7] text-white"
                    : "bg-[#faf5ff] text-[#33496d] hover:bg-[#f3e8ff]"
                }`}
              >
                <span>{h.roomName}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs font-bold text-[#5f6f89]">{emptyMessage}</p>
      )}
    </div>
  )
}

function FloorPlanImage({
  activeHotspot,
  hotspots,
  onSelect,
}: {
  activeHotspot: DrawingHotspot
  hotspots: DrawingHotspot[]
  onSelect: (id: string) => void
}) {
  const aspect = `${sampleFloorPlan.imageWidth}/${sampleFloorPlan.imageHeight}`
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: aspect }}
    >
      <img
        src={sampleFloorPlan.imagePath}
        alt={sampleFloorPlan.drawingTitle}
        className="absolute inset-0 h-full w-full object-contain"
      />
      {hotspots.map((h) => {
        const isActive = h.id === activeHotspot.id
        return (
          <button
            key={h.id}
            type="button"
            onClick={() => onSelect(h.id)}
            aria-label={`${h.roomName}の詳細を表示`}
            className="absolute cursor-pointer transition-all"
            style={{
              left: `${h.rect.x}%`,
              top: `${h.rect.y}%`,
              width: `${h.rect.width}%`,
              height: `${h.rect.height}%`,
              background: isActive ? `${h.swatch}55` : "transparent",
              border: isActive
                ? `3px solid ${h.swatch}`
                : `2px dashed ${h.swatch}80`,
              boxShadow: isActive
                ? `0 0 24px ${h.swatch}66, inset 0 0 24px ${h.swatch}33`
                : "none",
            }}
          >
            <span
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-black shadow-md sm:text-sm"
              style={{
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: isActive ? h.swatch : "#ffffffd0",
                color: isActive ? "white" : h.swatch,
                border: isActive ? "none" : `2px solid ${h.swatch}`,
              }}
            >
              {h.roomName}
            </span>
          </button>
        )
      })}
    </div>
  )
}
