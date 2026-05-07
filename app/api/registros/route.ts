import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/registros — Lista registros de vacunación
 */
export async function GET() {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("registro_vacunacion")
    .select("*")
    .order("fecha_vacunacion", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ registros: data })
}

/**
 * POST /api/registros — Crear registro (operador o admin)
 */
export async function POST(request: Request) {
  const auth = await requireAuth(["admin", "operador"])
  if (auth.error) return auth.error

  try {
    const body = await request.json()

    // Validaciones básicas
    const origenesValidos = ["manual", "digital", "importacion", "brigada"]
    if (body.origen_datos && !origenesValidos.includes(body.origen_datos)) {
      return NextResponse.json({ error: "origen_datos inválido" }, { status: 400 })
    }
    if (body.numero_dosis !== undefined && body.numero_dosis < 1) {
      return NextResponse.json({ error: "numero_dosis debe ser mayor a 0" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("registro_vacunacion")
      .insert([body])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ registro: data }, { status: 201 })
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
