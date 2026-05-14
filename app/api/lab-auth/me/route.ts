import { NextResponse } from "next/server"
import { getCurrentSessionEmail } from "@/lib/lab-auth/cookie"

export const runtime = "nodejs"

export async function GET() {
  const email = await getCurrentSessionEmail()
  return NextResponse.json({ email })
}
