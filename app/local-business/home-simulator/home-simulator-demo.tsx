"use client"

import { useMemo, useState } from "react"
import {
  Sparkles,
  Tablet,
  Truck,
  Check,
  X,
  ArrowRight,
  Package,
  TrendingUp,
} from "lucide-react"
import {
  floorMaterials,
  kitchenMaterials,
  rooms,
  suppliers,
  totals,
  wallMaterials,
  type FloorMaterial,
  type KitchenMaterial,
  type SupplierId,
  type WallMaterial,
} from "./data"

type Selection = {
  floor: FloorMaterial
  wall: WallMaterial
  kitchen: KitchenMaterial
}

type SupplierSelection = {
  floor: SupplierId
  wall: SupplierId
  kitchen: SupplierId
}

function formatYen(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`
}

const ACCENT = "#0f766e" // teal-700、 落ち着いた warm editorial 系
const ACCENT_BG = "#ccfbf1"
const ACCENT_SOFT = "#f0fdfa"

export function HomeSimulatorDemo() {
  const [selection, setSelection] = useState<Selection>({
    floor: floorMaterials[0],
    wall: wallMaterials[0],
    kitchen: kitchenMaterials[0],
  })
  const [supplierSelection, setSupplierSelection] = useState<SupplierSelection>({
    floor: floorMaterials[0].defaultSupplier,
    wall: wallMaterials[0].defaultSupplier,
    kitchen: kitchenMaterials[0].defaultSupplier,
  })
  const [orderModal, setOrderModal] = useState<{ open: boolean; supplier: SupplierId | null }>({
    open: false,
    supplier: null,
  })

  function selectFloor(m: FloorMaterial) {
    setSelection((s) => ({ ...s, floor: m }))
    setSupplierSelection((s) => ({ ...s, floor: m.defaultSupplier }))
  }
  function selectWall(m: WallMaterial) {
    setSelection((s) => ({ ...s, wall: m }))
    setSupplierSelection((s) => ({ ...s, wall: m.defaultSupplier }))
  }
  function selectKitchen(m: KitchenMaterial) {
    setSelection((s) => ({ ...s, kitchen: m }))
    setSupplierSelection((s) => ({ ...s, kitchen: m.defaultSupplier }))
  }

  const breakdown = useMemo(() => {
    const floorCost = selection.floor.unitPrice * totals.floorArea
    const wallCost = selection.wall.unitPrice * totals.wallArea
    const kitchenCost = selection.kitchen.unitPrice
    const total = floorCost + wallCost + kitchenCost

    return { floorCost, wallCost, kitchenCost, total }
  }, [selection])

  // 標準構成 (各カテゴリ 1 件目) 比の差額
  const baseline = useMemo(() => {
    const f = floorMaterials[0].unitPrice * totals.floorArea
    const w = wallMaterials[0].unitPrice * totals.wallArea
    const k = kitchenMaterials[0].unitPrice
    return f + w + k
  }, [])
  const delta = breakdown.total - baseline

  // 仕入リベート合計 (建材屋連携シミュ)
  const rebateTotal = useMemo(() => {
    const f = breakdown.floorCost * suppliers[supplierSelection.floor].rebate
    const w = breakdown.wallCost * suppliers[supplierSelection.wall].rebate
    const k = breakdown.kitchenCost * suppliers[supplierSelection.kitchen].rebate
    return Math.round(f + w + k)
  }, [breakdown, supplierSelection])

  function openOrderModal(supplier: SupplierId) {
    setOrderModal({ open: true, supplier })
  }

  return (
    <div className="space-y-8">
      {/* 上段: 間取り + 価格パネル */}
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* 平面図 SVG */}
        <section className="rounded-[24px] border border-[#cbd5e1] bg-white p-5 shadow-[0_14px_40px_rgba(7,27,73,0.08)] sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ccfbf1] text-[#0f766e]">
              <Tablet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#071b49]">施主と一緒に 見る 平面図</h2>
              <p className="text-xs font-bold text-[#5f6f89]">
                建材を 変えると、 色 と 金額が その場で 変わります
              </p>
            </div>
          </div>

          <FloorPlanSVG selection={selection} />

          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            {rooms.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2"
              >
                <dt className="text-[10px] font-black uppercase tracking-[0.1em] text-[#5f6f89]">
                  {r.name}
                </dt>
                <dd className="mt-1 text-xs font-bold text-[#071b49]">
                  床 {r.floorArea}㎡ / 壁 {r.wallArea}㎡
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* リアルタイム合計 */}
        <section className="rounded-[24px] border border-[#a7f3d0] bg-white p-5 shadow-[0_14px_40px_rgba(15,118,110,0.12)] sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="grid h-11 w-11 place-items-center rounded-2xl text-white"
              style={{ background: ACCENT }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#071b49]">合計金額 リアルタイム</h2>
              <p className="text-xs font-bold text-[#5f6f89]">標準構成 との 差額も 同時表示</p>
            </div>
          </div>

          <div
            className="rounded-2xl border-2 px-4 py-5"
            style={{ borderColor: ACCENT, background: ACCENT_SOFT }}
          >
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#0f766e]">
              いま 選んでいる 構成 の 合計
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-[#0f766e] sm:text-4xl">
              {formatYen(breakdown.total)}
            </p>
            <p className="mt-2 text-xs font-bold text-[#5f6f89]">
              標準構成 比{" "}
              <span
                className={`text-sm font-black ${
                  delta === 0
                    ? "text-[#5f6f89]"
                    : delta > 0
                      ? "text-[#dc2626]"
                      : "text-[#16a34a]"
                }`}
              >
                {delta === 0
                  ? "± ¥0 (標準構成)"
                  : delta > 0
                    ? `+${formatYen(delta)}`
                    : `−${formatYen(Math.abs(delta))}`}
              </span>
            </p>
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            <BreakdownRow
              label="床材"
              detail={`${selection.floor.name} × ${totals.floorArea}㎡`}
              amount={breakdown.floorCost}
              swatch={selection.floor.color}
            />
            <BreakdownRow
              label="壁紙"
              detail={`${selection.wall.name} × ${totals.wallArea}㎡`}
              amount={breakdown.wallCost}
              swatch={selection.wall.color}
            />
            <BreakdownRow
              label="キッチン"
              detail={selection.kitchen.name}
              amount={breakdown.kitchenCost}
              swatch={selection.kitchen.color}
              border={selection.kitchen.topColor}
            />
          </ul>
        </section>
      </div>

      {/* 中段: 建材選択パネル */}
      <section className="rounded-[24px] border border-[#cbd5e1] bg-white p-5 shadow-[0_14px_40px_rgba(7,27,73,0.06)] sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fef3c7] text-[#b45309]">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#071b49]">建材を 選ぶ</h2>
            <p className="text-xs font-bold text-[#5f6f89]">
              施主の前で タップ → 平面図 と 金額が 即時 反映
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 床材 */}
          <CategoryGroup
            title="床材 (5 種)"
            unitLabel="㎡ 単価"
            items={floorMaterials.map((m) => ({
              id: m.id,
              name: m.name,
              price: m.unitPrice,
              color: m.color,
              accent: m.accent,
              note: m.note,
              supplier: m.defaultSupplier,
              selected: selection.floor.id === m.id,
              onSelect: () => selectFloor(m),
            }))}
          />

          {/* 壁紙 */}
          <CategoryGroup
            title="壁紙 (5 種)"
            unitLabel="㎡ 単価"
            items={wallMaterials.map((m) => ({
              id: m.id,
              name: m.name,
              price: m.unitPrice,
              color: m.color,
              note: m.note,
              supplier: m.defaultSupplier,
              selected: selection.wall.id === m.id,
              onSelect: () => selectWall(m),
            }))}
          />

          {/* キッチン */}
          <CategoryGroup
            title="キッチン (3 種)"
            unitLabel="一式 単価"
            items={kitchenMaterials.map((m) => ({
              id: m.id,
              name: m.name,
              price: m.unitPrice,
              color: m.color,
              accent: m.topColor,
              note: m.note,
              supplier: m.defaultSupplier,
              selected: selection.kitchen.id === m.id,
              onSelect: () => selectKitchen(m),
            }))}
          />
        </div>
      </section>

      {/* 下段: 建材屋連携シミュレーション */}
      <section className="rounded-[24px] border border-[#fcd34d] bg-white p-5 shadow-[0_14px_40px_rgba(180,83,9,0.08)] sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fef3c7] text-[#b45309]">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#071b49]">仕入れ 経路 と リベート シミュレーション</h2>
            <p className="text-xs font-bold text-[#5f6f89]">
              この 構成を 各建材屋 経由で 発注した時の 仕入リベートを 比較
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {Object.values(suppliers).map((sup) => {
            const f = breakdown.floorCost * sup.rebate
            const w = breakdown.wallCost * sup.rebate
            const k = breakdown.kitchenCost * sup.rebate
            const subtotal = Math.round(f + w + k)
            return (
              <button
                key={sup.id}
                type="button"
                onClick={() => openOrderModal(sup.id)}
                className="group rounded-2xl border-2 border-[#e2e8f0] bg-white p-4 text-left transition hover:border-[#fcd34d] hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-white"
                    style={{ background: sup.badgeColor }}
                  >
                    {sup.shortLabel}
                  </span>
                  <span className="text-xs font-bold text-[#5f6f89]">
                    リード {sup.leadDays} 日
                  </span>
                </div>
                <p className="mt-3 text-sm font-black text-[#071b49]">{sup.name}</p>
                <div className="mt-3 rounded-xl bg-[#fffbeb] px-3 py-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#92400e]">
                    仕入リベート 想定
                  </p>
                  <p className="mt-1 text-xl font-black text-[#b45309]">
                    +{formatYen(subtotal)}
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-[#5f6f89]">
                    リベート率 {Math.round(sup.rebate * 100)}%
                  </p>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#b45309] group-hover:underline">
                  この経路で 発注確認
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-xs font-bold text-[#92400e]">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            現在の選択 (カテゴリ別 デフォルト 仕入先) での 合計リベート ={" "}
            <span className="font-black text-[#b45309]">+{formatYen(rebateTotal)}</span>
            。 施主への 見積額は 据え置きでも、 仕入経路の 選択次第で 工務店側の 粗利が変わる
            ことを 1 画面で 把握できます。
          </p>
        </div>
      </section>

      {/* 発注確認モーダル */}
      {orderModal.open && orderModal.supplier && (
        <OrderConfirmModal
          supplierId={orderModal.supplier}
          selection={selection}
          breakdown={breakdown}
          onClose={() => setOrderModal({ open: false, supplier: null })}
        />
      )}
    </div>
  )
}

/* ---------------- subcomponents ---------------- */

function BreakdownRow({
  label,
  detail,
  amount,
  swatch,
  border,
}: {
  label: string
  detail: string
  amount: number
  swatch: string
  border?: string
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2.5">
      <span
        className="h-8 w-8 shrink-0 rounded-lg border"
        style={{
          background: swatch,
          borderColor: border ?? "#cbd5e1",
        }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#5f6f89]">
          {label}
        </p>
        <p className="truncate text-xs font-bold text-[#071b49]">{detail}</p>
      </div>
      <p className="text-sm font-black text-[#0f766e]">{formatYen(amount)}</p>
    </li>
  )
}

type CategoryItem = {
  id: string
  name: string
  price: number
  color: string
  accent?: string
  note: string
  supplier: SupplierId
  selected: boolean
  onSelect: () => void
}

function CategoryGroup({
  title,
  unitLabel,
  items,
}: {
  title: string
  unitLabel: string
  items: CategoryItem[]
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-black tracking-tight text-[#071b49]">{title}</h3>
        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#5f6f89]">
          {unitLabel}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => {
          const sup = suppliers[m.supplier]
          return (
            <button
              key={m.id}
              type="button"
              onClick={m.onSelect}
              aria-pressed={m.selected}
              className={`rounded-2xl border-2 p-3 text-left transition ${
                m.selected
                  ? "border-[#0f766e] bg-[#f0fdfa] shadow-[0_8px_24px_rgba(15,118,110,0.18)]"
                  : "border-[#e2e8f0] bg-white hover:border-[#94a3b8]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border"
                  style={{
                    background: m.color,
                    borderColor: m.accent ?? "#cbd5e1",
                  }}
                  aria-hidden
                >
                  {m.accent && (
                    <span
                      className="h-7 w-7 rounded-md"
                      style={{ background: m.accent, opacity: 0.55 }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#071b49]">{m.name}</p>
                  <p className="mt-0.5 truncate text-[11px] font-bold text-[#5f6f89]">
                    {m.note}
                  </p>
                </div>
                {m.selected && (
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#0f766e] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className="inline-flex h-6 items-center rounded-full px-2 text-[10px] font-black uppercase tracking-[0.1em] text-white"
                  style={{ background: sup.badgeColor }}
                >
                  {sup.shortLabel}
                </span>
                <span className="text-sm font-black text-[#0f766e]">
                  {formatYen(m.price)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FloorPlanSVG({ selection }: { selection: Selection }) {
  const { floor, wall, kitchen } = selection

  return (
    <div className="overflow-hidden rounded-2xl border border-[#cbd5e1] bg-[#f8fafc]">
      <svg
        viewBox="0 0 100 100"
        className="block h-auto w-full"
        role="img"
        aria-label="2 LDK 平面図 (リビング ・ キッチン ・ 寝室)"
      >
        {/* 外壁 */}
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          fill={wall.color}
          stroke="#475569"
          strokeWidth="0.6"
        />

        {/* リビング */}
        <rect
          x={rooms[0].rect.x}
          y={rooms[0].rect.y}
          width={rooms[0].rect.w}
          height={rooms[0].rect.h}
          fill={floor.color}
          stroke="#475569"
          strokeWidth="0.3"
        />
        {/* 床の木目 / タイル風 ライン (アクセント色がある時) */}
        {floor.accent && (
          <g opacity={0.35}>
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`liv-grain-${i}`}
                x1={rooms[0].rect.x + 2}
                y1={rooms[0].rect.y + 6 + i * 7.5}
                x2={rooms[0].rect.x + rooms[0].rect.w - 2}
                y2={rooms[0].rect.y + 6 + i * 7.5}
                stroke={floor.accent}
                strokeWidth="0.4"
                strokeDasharray="0.8 1.4"
              />
            ))}
          </g>
        )}

        {/* キッチン (床は専用、 ここでは キッチン家具色を強めに) */}
        <rect
          x={rooms[1].rect.x}
          y={rooms[1].rect.y}
          width={rooms[1].rect.w}
          height={rooms[1].rect.h}
          fill={floor.color}
          stroke="#475569"
          strokeWidth="0.3"
        />
        {/* キッチンカウンター */}
        <rect
          x={rooms[1].rect.x + 3}
          y={rooms[1].rect.y + rooms[1].rect.h - 9}
          width={rooms[1].rect.w - 6}
          height={5}
          fill={kitchen.color}
          stroke="#3f3f46"
          strokeWidth="0.3"
        />
        {/* 天板 */}
        <rect
          x={rooms[1].rect.x + 3}
          y={rooms[1].rect.y + rooms[1].rect.h - 9}
          width={rooms[1].rect.w - 6}
          height={1.4}
          fill={kitchen.topColor}
        />
        {/* シンク / コンロ */}
        <rect
          x={rooms[1].rect.x + 5}
          y={rooms[1].rect.y + rooms[1].rect.h - 8}
          width={6}
          height={3}
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="0.2"
        />
        <circle
          cx={rooms[1].rect.x + rooms[1].rect.w - 8}
          cy={rooms[1].rect.y + rooms[1].rect.h - 6.5}
          r={1.8}
          fill="#1f2937"
        />

        {/* 寝室 */}
        <rect
          x={rooms[2].rect.x}
          y={rooms[2].rect.y}
          width={rooms[2].rect.w}
          height={rooms[2].rect.h}
          fill={floor.color}
          stroke="#475569"
          strokeWidth="0.3"
        />
        {floor.accent && (
          <g opacity={0.35}>
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`bed-grain-${i}`}
                x1={rooms[2].rect.x + 2}
                y1={rooms[2].rect.y + 6 + i * 9}
                x2={rooms[2].rect.x + rooms[2].rect.w - 2}
                y2={rooms[2].rect.y + 6 + i * 9}
                stroke={floor.accent}
                strokeWidth="0.4"
                strokeDasharray="0.8 1.4"
              />
            ))}
          </g>
        )}
        {/* ベッド (寝室の家具感) */}
        <rect
          x={rooms[2].rect.x + 4}
          y={rooms[2].rect.y + 8}
          width={14}
          height={20}
          fill="#e2e8f0"
          stroke="#475569"
          strokeWidth="0.25"
          rx="0.6"
        />
        <rect
          x={rooms[2].rect.x + 4}
          y={rooms[2].rect.y + 8}
          width={14}
          height={4}
          fill="#cbd5e1"
        />

        {/* 内壁 区切り */}
        <line
          x1="60"
          y1="2"
          x2="60"
          y2="98"
          stroke="#334155"
          strokeWidth="0.5"
        />
        <line
          x1="60"
          y1="34"
          x2="98"
          y2="34"
          stroke="#334155"
          strokeWidth="0.5"
        />
        {/* リビング ↔ キッチン 開口部 (60,15 付近) */}
        <line
          x1="60"
          y1="14"
          x2="60"
          y2="22"
          stroke={floor.color}
          strokeWidth="0.9"
        />

        {/* 部屋ラベル */}
        {rooms.map((r) => (
          <g key={r.id}>
            <rect
              x={r.label.x - 9}
              y={r.label.y - 3}
              width={18}
              height={6}
              rx={1}
              fill="rgba(255,255,255,0.85)"
              stroke="#475569"
              strokeWidth="0.2"
            />
            <text
              x={r.label.x}
              y={r.label.y + 1.4}
              textAnchor="middle"
              fontSize="3.2"
              fontWeight="800"
              fill="#0f172a"
            >
              {r.name}
            </text>
          </g>
        ))}

        {/* スケール表示 */}
        <text x="4" y="99" fontSize="2.2" fill="#64748b" fontWeight="700">
          2LDK ・ 床 26㎡ ・ 壁 92㎡ (デモ用 簡易間取り)
        </text>
      </svg>
    </div>
  )
}

function OrderConfirmModal({
  supplierId,
  selection,
  breakdown,
  onClose,
}: {
  supplierId: SupplierId
  selection: Selection
  breakdown: { floorCost: number; wallCost: number; kitchenCost: number; total: number }
  onClose: () => void
}) {
  const sup = suppliers[supplierId]
  const rebate = Math.round(breakdown.total * sup.rebate)
  const eta = new Date(Date.now() + sup.leadDays * 24 * 60 * 60 * 1000)
  const etaLabel = `${eta.getMonth() + 1}/${eta.getDate()}`

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[20px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4 text-white"
          style={{ background: sup.badgeColor }}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
              発注 確認 (デモ ・ 実発注は行いません)
            </p>
            <p className="mt-1 text-base font-black">{sup.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#5f6f89]">
              発注内容
            </p>
            <ul className="mt-2 space-y-1.5 text-sm font-bold text-[#071b49]">
              <li className="flex justify-between gap-3">
                <span className="truncate">床材 ・ {selection.floor.name}</span>
                <span className="shrink-0 text-[#0f766e]">{formatYen(breakdown.floorCost)}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="truncate">壁紙 ・ {selection.wall.name}</span>
                <span className="shrink-0 text-[#0f766e]">{formatYen(breakdown.wallCost)}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="truncate">キッチン ・ {selection.kitchen.name}</span>
                <span className="shrink-0 text-[#0f766e]">{formatYen(breakdown.kitchenCost)}</span>
              </li>
            </ul>
            <div className="mt-3 border-t border-[#e2e8f0] pt-2 text-right">
              <p className="text-[11px] font-bold text-[#5f6f89]">仕入合計</p>
              <p className="text-xl font-black text-[#0f766e]">{formatYen(breakdown.total)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#fffbeb] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#92400e]">
                想定リベート
              </p>
              <p className="mt-1 text-lg font-black text-[#b45309]">+{formatYen(rebate)}</p>
              <p className="text-[10px] font-bold text-[#92400e]">
                ({Math.round(sup.rebate * 100)}% 還元想定)
              </p>
            </div>
            <div className="rounded-xl bg-[#f0fdfa] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0f766e]">
                納品 目安
              </p>
              <p className="mt-1 text-lg font-black text-[#0f766e]">{etaLabel}</p>
              <p className="text-[10px] font-bold text-[#0f766e]">
                ({sup.leadDays} 営業日 後)
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#fcd34d] bg-[#fffbeb] px-3 py-2 text-[11px] font-bold text-[#92400e]">
            これは デモ用 モーダルです。 実プロダクトでは ここで 1 タップ 発注 →
            建材屋 営業マンに 自動で 引合 が 飛びます。
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-black text-[#5f6f89] hover:bg-[#f8fafc]"
            >
              閉じる
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-black text-white"
              style={{ background: sup.badgeColor }}
            >
              この内容で 発注 (デモ)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
