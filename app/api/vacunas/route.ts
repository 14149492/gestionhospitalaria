import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/vacunas — Lista vacunas (solo usuarios autenticados)
 */
export async function GET() {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const supabase = await createClient()
  const { data, error } = await supabase.from("vacuna").select("*").order("nombre_vacuna")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ vacunas: data })
}

/**
 * POST /api/vacunas — Crear vacuna (solo admin)
 */
export async function POST(request: Request) {
  const auth = await requireAuth(["admin"])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const supabase = await createClient()
    const { data, error } = await supabase.from("vacuna").insert([body]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ vacuna: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT() {
  const auth = await requireAuth()
  if (auth.error) return auth.error
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}

export async function DELETE() {
  const auth = await requireAuth()
  if (auth.error) return auth.error
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
