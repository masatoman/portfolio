"use client"

import { useMemo, useState } from "react"
import { Camera, ImageIcon, X } from "lucide-react"
import {
  countByStage,
  filterSitePhotos,
  sampleSitePhotos,
  sitePhotoSites,
  sitePhotoStages,
  type PhotoFilter,
  type SitePhoto,
  type SitePhotoSite,
  type SitePhotoStage,
} from "@/lib/local-business/site-photo-organizer"

const sites: ("すべて" | SitePhotoSite)[] = ["すべて", ...sitePhotoSites]
const stages: ("すべて" | SitePhotoStage)[] = ["すべて", ...sitePhotoStages]

export function SitePhotoOrganizerDemo() {
  const [filter, setFilter] = useState<PhotoFilter>({ site: "すべて", stage: "すべて" })
  const [openPhoto, setOpenPhoto] = useState<SitePhoto | null>(null)

  const filtered = useMemo(() => filterSitePhotos(sampleSitePhotos, filter), [filter])
  const counts = useMemo(() => countByStage(sampleSitePhotos), [])

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fdeef5] text-[#be185d]">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#071b49]">写真は 撮るだけで 自動でしまわれる</h2>
            <p className="text-sm font-bold text-[#5f6f89]">
              現場・工程・撮影日 で 仕分け済み。 タブで切り替えるだけ。
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {(Object.entries(counts) as [SitePhotoStage, number][]).map(([stage, count]) => (
            <div
              key={stage}
              className="rounded-2xl border border-[#fdd6e6] bg-[linear-gradient(180deg,#fdf2f8,#ffffff)] p-4"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#be185d]">
                {stage}
              </p>
              <p className="mt-1 text-2xl font-black text-[#071b49]">{count}枚</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">
              現場
            </p>
            <div className="flex flex-wrap gap-2">
              {sites.map((s) => (
                <FilterChip
                  key={s}
                  active={filter.site === s}
                  onClick={() => setFilter((f) => ({ ...f, site: s }))}
                >
                  {s}
                </FilterChip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">
              工程
            </p>
            <div className="flex flex-wrap gap-2">
              {stages.map((s) => (
                <FilterChip
                  key={s}
                  active={filter.stage === s}
                  onClick={() => setFilter((f) => ({ ...f, stage: s }))}
                >
                  {s}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-[#5f6f89]">
            <span className="font-black text-[#071b49]">{filtered.length}枚</span> 表示中 (全{sampleSitePhotos.length}枚)
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((photo) => (
            <button
              type="button"
              key={photo.id}
              onClick={() => setOpenPhoto(photo)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#d8e3f2] text-left transition hover:border-[#be185d] hover:shadow-[0_10px_30px_rgba(190,24,93,0.15)]"
              style={{
                backgroundImage: `linear-gradient(135deg, ${photo.swatch}30, ${photo.swatch}10 60%, #ffffff)`,
              }}
            >
              <div
                className="absolute inset-0 grid place-items-center text-white/70"
                style={{ background: `radial-gradient(circle at 50% 35%, ${photo.swatch}80, ${photo.swatch}40 50%, transparent 75%)` }}
              >
                <ImageIcon className="h-8 w-8" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white"
                    style={{ background: photo.swatch }}
                  >
                    {photo.stage}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">
                    {photo.takenAt.slice(5, 10)}
                  </span>
                </div>
                <p className="mt-1 text-xs font-black text-white">{photo.site}</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-[#d8e3f2] p-10 text-center">
              <p className="text-sm font-bold text-[#5f6f89]">
                条件にあう写真がありません。フィルタを 変えてみてください。
              </p>
            </div>
          )}
        </div>
      </section>

      {openPhoto && <PhotoModal photo={openPhoto} onClose={() => setOpenPhoto(null)} />}
    </div>
  )
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-black transition ${
        active
          ? "bg-[#be185d] text-white shadow-[0_8px_20px_rgba(190,24,93,0.25)]"
          : "border border-[#d8e3f2] bg-white text-[#33496d] hover:border-[#be185d]"
      }`}
    >
      {children}
    </button>
  )
}

function PhotoModal({ photo, onClose }: { photo: SitePhoto; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative aspect-[4/3] w-full"
          style={{
            backgroundImage: `linear-gradient(135deg, ${photo.swatch}40, ${photo.swatch}10 60%, #ffffff)`,
          }}
        >
          <div
            className="absolute inset-0 grid place-items-center text-white/80"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${photo.swatch}80, ${photo.swatch}30 50%, transparent 80%)`,
            }}
          >
            <ImageIcon className="h-20 w-20" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#071b49] hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-black text-white"
              style={{ background: photo.swatch }}
            >
              {photo.stage}
            </span>
            <span className="text-sm font-black text-[#071b49]">{photo.site}</span>
            <span className="text-sm font-bold text-[#5f6f89]">
              {photo.takenAt.replace("T", " ")}
            </span>
          </div>
          <p className="mt-4 text-sm font-bold leading-7 text-[#33496d]">{photo.memo}</p>
        </div>
      </div>
    </div>
  )
}
