import { permanentRedirect } from "next/navigation"

/**
 * /local-business は新トップ (/) に統合済み。
 * 既存の外部リンク・名刺・SEO 評価を救済するための 308 redirect。
 * 配下の demo ページ (/local-business/[slug]) は据え置き。
 */
export default function LocalBusinessRedirect() {
  permanentRedirect("/")
}
