// 「// 00 / how-to」 セクションの本文。 5 ステップフロー + スコアの読み方 + 動かない時のチェック。

import type React from "react"
import { LAB_NEON } from "@/lib/lab-tools/registry"

export function HowToBoard() {
  return (
    <div className="space-y-4">
      <div
        className="border bg-black/30 p-3 font-mono text-[11px] leading-relaxed"
        style={{ borderColor: `${LAB_NEON.magenta}40` }}
      >
        <p
          className="mb-2 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: LAB_NEON.magenta }}
        >
          // 推奨フロー (gap-driven + 一発貼り付け) — 「犬の道」 を避ける王道
        </p>
        <p className="text-white/65">
          安宅和人『イシューからはじめよ』 のフレームに沿って、 <strong style={{ color: LAB_NEON.green }}>バリュー帯 (issue × 解の質)</strong> に乗る切り口を効率よく取りに行くための新フロー。 既存収集の盲点を AI に補完させて、 重複しない切り口を一発で 8 件キューに入れる。
        </p>
      </div>

      <ol className="space-y-3 font-variant-y2k-body text-sm leading-relaxed">
        <Step n={1} color={LAB_NEON.green} title="// 02 / results で「📋 copy gap prompt」 ボタンを押す">
          現状の DB に入った issue 全件 (現在 130+ 件) を踏まえて、
          <strong style={{ color: LAB_NEON.magenta }}>「抜けている切り口」 を AI に推薦させるプロンプト</strong>{" "}
          がクリップボードにコピーされる。 5/22 北原氏面談で確定した主顧客像 (30-40 代アトツギ + 展示会層) も自動注入される。
        </Step>

        <Step n={2} color={LAB_NEON.cyan} title="ChatGPT / Claude / Perplexity に貼る (通常モード OK)">
          通常チャットで OK。 Deep Research モードは <strong>不要</strong> (構造分析タスクなので)。 30 秒-1 分で 8 推薦が返ってくる。
          <ul className="mt-2 ml-4 list-disc space-y-1 text-xs text-white/65">
            <li>
              <strong style={{ color: LAB_NEON.cyan }}>AI 多様性を活かしたい時</strong>: 同じ prompt を ChatGPT / Claude / Perplexity の 3 つに投げて推薦を見比べる。 3 AI が共通して指摘した「抜け」 = 真の盲点
            </li>
          </ul>
        </Step>

        <Step n={3} color={LAB_NEON.magenta} title="// 01 / queue の「📥 一発貼り付け」 エリアに ChatGPT 返答を貼る">
          ChatGPT 返答を全文コピーして textarea にペースト →{" "}
          <strong>🔍 「パースしてプレビュー」</strong> ボタン → 8 推薦が自動でテーブル表示される。
          <ul className="mt-2 ml-4 list-disc space-y-1 text-xs text-white/65">
            <li>profile / role / 件数 / E-H-A スコア が各行に並ぶ</li>
            <li>いらない切り口はチェック外す、 role や件数は手で編集可</li>
            <li>
              <strong>📤 「選択した N 件をキュー登録」</strong> で一括 if_jobs INSERT。 ad-hoc モード自動付与 (queries.json 未登録 role でも OK)
            </li>
          </ul>
        </Step>

        <Step n={4} color={LAB_NEON.amber} title="ターミナルで /issue-finder process --all">
          Claude Code (VS Code 統合) で{" "}
          <code className="border border-white/15 bg-black/60 px-1 py-0.5 text-[12px] font-mono">
            /issue-finder process --all
          </code>{" "}
          と打つ → SKILL が pending を順次処理 (最大 5 件/回)。
          <ul className="mt-2 ml-4 list-disc space-y-1 text-xs text-white/65">
            <li>ad-hoc job は queries.json を無視して、 貼り付けた入り口キーワードで web_search する</li>
            <li>
              各クラスタを <strong>本書 3 軸 (E / H / A)</strong> で採点 → tier (value-zone / promising / needs-rework / dog-path) 自動付与
            </li>
          </ul>
        </Step>

        <Step n={5} color={LAB_NEON.green} title="ブラウザリロードで // 02 / results を確認、 バリュー帯に化けたか判定">
          デフォルトは <strong>🐕 犬の道</strong> と <strong>◌ 未採点</strong> を非表示。
          上位に並ぶのが <strong style={{ color: LAB_NEON.green }}>🟢 value-zone</strong> + <strong style={{ color: LAB_NEON.cyan }}>🔶 needs-rework</strong>。
          ここに新しい切り口がいたら、 ChatGPT の gap 推薦が刺さった証拠。
        </Step>
      </ol>

      <details className="border bg-black/20 p-3" style={{ borderColor: "#444" }}>
        <summary
          className="cursor-pointer font-mono text-[10px] uppercase tracking-widest hover:text-white"
          style={{ color: LAB_NEON.cyan }}
        >
          // 旧フロー / 代替手段 (perspective select、 Deep Research、 ad-hoc 手入力 等)
        </summary>
        <div className="mt-2 space-y-2 text-xs text-white/60 leading-relaxed">
          <p>
            <strong style={{ color: LAB_NEON.cyan }}>perspective select モード</strong>: queries.json 登録済の固定 perspective から選んでキュー登録。 ad-hoc じゃないオーソドックスな運用。 デフォルトキーワードに引きずられる弱点あり
          </p>
          <p>
            <strong style={{ color: LAB_NEON.magenta }}>Deep Research モード</strong>: // 03 / settings の「外部 Deep Research プロンプト」 を使って ChatGPT/Claude Deep Research に投げる → 結果 markdown を「Deep Research 結果を貼る」 欄に貼る。 SKILL は web_search を skip して直接クラスタリング
          </p>
          <p>
            <strong style={{ color: LAB_NEON.magenta }}>ad-hoc 手入力モード</strong>: // 01 / queue の「→ ad-hoc へ切替」 で profile/role/keywords を手書きで 1 件ずつ登録。 ChatGPT に頼らず自分で切り口を作る時に使う
          </p>
          <p className="font-mono text-[10px] text-white/50">
            <code>/issue-finder process</code> (1 件のみ) /{" "}
            <code>/issue-finder collect komuten:現場監督</code> (キュー介さず即時) /{" "}
            <code>/issue-finder list</code> (最新 20 件)
          </p>
        </div>
      </details>

      <ScoreReadingBoard />
      <TroubleshootingBoard />
    </div>
  )
}

function Step({
  n,
  color,
  title,
  children,
}: {
  n: number
  color: string
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="border-l-2 pl-4 py-1" style={{ borderColor: color }}>
      <div className="mb-1 flex items-center gap-2">
        <span
          className="font-mono text-[11px] font-bold w-6 text-center border"
          style={{ borderColor: `${color}80`, color }}
        >
          {n}
        </span>
        <span className="text-sm font-bold uppercase tracking-tight">{title}</span>
      </div>
      <div className="text-xs text-white/65 leading-relaxed pl-8">{children}</div>
    </li>
  )
}

/** スコアの読み方 (本書 3 軸 + 旧式) */
function ScoreReadingBoard() {
  return (
    <div
      className="border bg-black/30 p-4"
      style={{ borderColor: `${LAB_NEON.green}40` }}
    >
      <p
        className="mb-2 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: LAB_NEON.green }}
      >
        // スコアの読み方 (本書 + 旧式の 2 系統)
      </p>
      <p className="text-xs text-white/65 leading-relaxed mb-3 font-variant-y2k-body">
        本書 (安宅和人『イシューからはじめよ』) フレームの 3 軸を 2026-05-28 から採用。
        優先順位は{" "}
        <strong style={{ color: LAB_NEON.green }}>🟢 value-zone</strong> → 🔶 needs-rework → 🟡 promising → ⚪ 犬の道。
        量的シェア (旧 issueScore) は副次的指標として残置。
      </p>
      <table className="w-full text-[10px] font-mono">
        <tbody>
          <tr className="border-b border-white/10">
            <td className="py-1.5 pr-3 text-white/70 w-32">
              <span style={{ color: LAB_NEON.green }}>本質的選択肢</span> (E)
            </td>
            <td className="py-1.5 text-white/55">
              <strong>0-50</strong>: 解くと軸 B の方向性が変わるか。
              50 = 商品方向性・ターゲット・接触戦術が根本変わる / 30 = 機能 1 つ定まる / 0 = 解いても何も変わらない (社会構造問題等)
            </td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="py-1.5 pr-3 text-white/70">
              <span style={{ color: LAB_NEON.cyan }}>深い仮説</span> (H)
            </td>
            <td className="py-1.5 text-white/55">
              <strong>0-50</strong>: 常識を覆す洞察 / 新しい構造があるか。
              40-50 = 業界の通説と真逆 / 20-30 = 別切り口で再定義 / 5-10 = 既知のあるある / 0 = 自明
            </td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="py-1.5 pr-3 text-white/70">
              <span style={{ color: LAB_NEON.amber }}>答えを出せる</span> (A)
            </td>
            <td className="py-1.5 text-white/55">
              <strong>0-100</strong>: masatoman 1 人で 6 ヶ月以内に解けるか。
              80+ = 即着手 1-2 ヶ月で MVP / 60-80 = ヒアリング含めて構造化 / 30-50 = 業界連携必要 / 0-20 = 制度・法律で不可能
            </td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="py-1.5 pr-3 text-white/70">
              <span style={{ color: LAB_NEON.green }}>バリュー</span> (value)
            </td>
            <td className="py-1.5 text-white/55">
              <strong>(E + H) × A / 100</strong>。
              🟢 value-zone (degree≥60 かつ A≥60) / 🔶 needs-rework (degree≥60 だが A&lt;60) / 🟡 promising (40≤degree&lt;60) / ⚪ 犬の道 (degree&lt;40)
            </td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="py-1.5 pr-3 text-white/70">
              <span style={{ color: "#888" }}>旧 動く度</span> (opportunity)
            </td>
            <td className="py-1.5 text-white/55">
              旧 5 軸統合 (issue 25% + solvability 30% + fit 20% + 競合 15% + 販路 10%)。
              本書フレーム未採点のレガシー issue で使う副次指標
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-[10px] font-mono text-white/50 leading-relaxed">
        <span style={{ color: LAB_NEON.green }}>🟢 value-zone</span>{" "}
        バッジ = 本書 図 2「バリューのマトリクス」 右上象限。 issueDegree 60+ かつ answerable 60+。
        全 136 件中 1 件しか出ない希少 tier (2026-05-29 時点)。 これが見えたら全力で取りに行く
      </p>
      <p className="mt-2 text-[10px] font-mono text-white/50 leading-relaxed">
        量的シェア (clusterSize / samplingTotal) で並べると「犬の道」 (大量の既知あるある) が上に来てしまうのが旧式の弱点。
        本書フレームは <strong>件数より構造的洞察</strong> を優先する設計
      </p>
    </div>
  )
}

function TroubleshootingBoard() {
  return (
    <div
      className="border bg-black/30 p-4 font-mono text-[10px] leading-relaxed text-white/55 space-y-2"
      style={{ borderColor: `${LAB_NEON.amber}30` }}
    >
      <p style={{ color: LAB_NEON.amber }}>// 動かない時のチェック</p>
      <ul className="space-y-1 pl-4 list-disc">
        <li>
          フォーム送信で 503 →{" "}
          <code>.env.local</code> に Supabase URL / ANON_KEY / SERVICE_ROLE_KEY が入っているか
        </li>
        <li>
          SKILL から API で 401 →{" "}
          <code>ISSUE_FINDER_INTERNAL_KEY</code> が portfolio と Mac env で一致しているか
        </li>
        <li>jobs が processing のまま → SKILL が中断した。 Supabase で status を pending に戻す</li>
        <li>このページが本番 Vercel で 404 → 仕様 (middleware で意図的にブロック)。 dev / preview で使う</li>
      </ul>
      <p className="pt-2">
        詳細手順は <code className="text-white/80">docs/issue-finder/operations.md</code> / SKILL 仕様は{" "}
        <code className="text-white/80">~/.claude/skills/issue-finder/SKILL.md</code>
      </p>
    </div>
  )
}
