import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"

export async function GET() {
  const auth = await requireAuth()
  if (auth.error) return auth.error
  return NextResponse.json({ error: "No implementado" }, { status: 501 })
}

export async function PUT() {
  const auth = await requireAuth()
  if (auth.error) return auth.error
  return NextResponse.json({ error: "No implementado" }, { status: 501 })
}

export async function DELETE() {
  const auth = await requireAuth()
  if (auth.error) return auth.error
  return NextResponse.json({ error: "No implementado" }, { status: 501 })
}
