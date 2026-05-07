import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"

export async function GET() {
  const auth = await requireAuth(["admin"])
  if (auth.error) return auth.error
  return NextResponse.json({ message: "Panel administrativo base" })
}

export async function POST() {
  const auth = await requireAuth(["admin"])
  if (auth.error) return auth.error
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
