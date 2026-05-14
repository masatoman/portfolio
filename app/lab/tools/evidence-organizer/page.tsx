import type { Metadata } from "next"
import { EvidenceOrganizerDemo } from "@/components/lab-tools/evidence-organizer-demo"

export const metadata: Metadata = {
  title: "証跡 (エビデンス) 整理くん / Lab Tools",
  description:
    "領収書・通帳・請求書の画像を複数アップすると、 Claude Vision が日付・金額・支払先・用途・カテゴリを抽出して 補助金報告フォーマットの CSV と整理用リネーム案を返します。",
}

export default function Page() {
  return <EvidenceOrganizerDemo />
}
