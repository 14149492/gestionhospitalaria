import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"
import { createClient as createServiceClient } from "@supabase/supabase-js"

/**
 * GET /api/establecimientos
 * Público para el formulario de registro (antes de auth).
 * Solo devuelve id y nombre — sin datos sensibles.
 */
export async function GET() {
  try {
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
      .from("establecimiento")
      .select("establecimiento_id, nombre_establecimiento")
      .order("nombre_establecimiento", { ascending: true })

    if (error) {
      return NextResponse.json({ error: "Error al obtener establecimientos" }, { status: 500 })
    }

    return NextResponse.json({ establecimientos: data })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Bloquear métodos no implementados
export async function POST() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
export async function PUT() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
export async function DELETE() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
