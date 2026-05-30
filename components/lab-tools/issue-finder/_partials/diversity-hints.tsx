"use client"

// 多様性オプションの使い方ガイド (折りたたみ).
// deep-search-helper.tsx から切り出し。

import { LAB_NEON } from "@/lib/lab-tools/registry"

export function DiversityHints() {
  return (
    <details className="border border-white/10 bg-black/20 p-3">
      <summary
        className="cursor-pointer font-mono text-[10px] uppercase tracking-widest hover:text-white"
        style={{ color: LAB_NEON.magenta }}
      >
        // 💡 多様性オプションの使い方 (4 AI に同じプロンプト投げると結果が中央値収束する問題への処方箋)
      </summary>
      <div className="mt-2 space-y-2 text-[11px] text-white/65 leading-relaxed">
        <p>
          <strong style={{ color: LAB_NEON.cyan }}>AI 別差分</strong> = 4 AI それぞれの学習データの偏りを逆手に取る。 ChatGPT は退職代行ブログ豊富、 Claude は長文 note 豊富、 Perplexity は最新ニュース、 Gemini は YouTube。
        </p>
        <p>
          <strong style={{ color: LAB_NEON.cyan }}>Devil's Advocate</strong> = 業界の通説 (DX = 良い等) を 3 つ書かせて、 全部覆す投稿だけを集めさせる。 本書「常識を覆す洞察」 を再現的に取りに行く仕掛け。
        </p>
        <p>
          <strong style={{ color: LAB_NEON.cyan }}>周辺当事者</strong> = 役職本人ではなく妻 / 経理 / OB に視点を移す。 本人は会社にバレるリスクで自重するが、 家族は自由に書く。
        </p>
        <p>
          <strong style={{ color: LAB_NEON.cyan }}>対立軸</strong> = 経営者 vs 現場、 親方 vs アトツギ 等 2 視点をペアで取り、 認識歪みを炙り出す。
        </p>
        <p>
          <strong style={{ color: LAB_NEON.cyan }}>時系列変化</strong> = 2019-21 (コロナ前後) と 2025-26 (今) の悲鳴を比べる。 DX 期待 → DX 監視ツール化 のような構造変化が見える。
        </p>
        <p>
          <strong style={{ color: LAB_NEON.cyan }}>媒体強制</strong> = YouTube / TikTok / Podcast / G2 / OpenWork / 5ch / 退職代行ブログ / Google マップ口コミ から **最低 1 件ずつ**。 SEO 記事偏りを物理的に防ぐ。
        </p>
        <p>
          <strong style={{ color: LAB_NEON.cyan }}>ランダム seed</strong> = 「今回の切り口」 を 1 句で固定 (金銭面のみ / メンタル面のみ 等)。 同じ AI を同じ perspective で 5 回叩いても、 seed を変えれば 5 つの異なる窓が開く。
        </p>
        <p style={{ color: LAB_NEON.amber }}>
          <strong>使い方の推奨</strong>: AI 別差分 + 1-2 オプション を組み合わせ → 4 AI それぞれにコピーして実行 → 結果を perspective ごとに 4 セット集めて貼る。 これで「常識を覆す洞察」 を確率的に拾える。
        </p>
      </div>
    </details>
  )
}
