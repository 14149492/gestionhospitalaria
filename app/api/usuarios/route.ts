import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"
import { createClient } from "@/lib/supabase/server"

const ROLES_VALIDOS = ["admin", "operador", "consulta"]

/**
 * GET /api/usuarios — Lista usuarios (solo admin)
 */
export async function GET() {
  const auth = await requireAuth(["admin"])
  if (auth.error) return auth.error

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("usuarios_perfil")
    .select("id, nombre, email, rol, created_at")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ usuarios: data })
}

/**
 * PUT /api/usuarios — Cambiar rol de usuario (solo admin)
 */
export async function PUT(request: Request) {
  const auth = await requireAuth(["admin"])
  if (auth.error) return auth.error

  try {
    const body = await request.json()

    // Validar rol
    if (!body.rol || !ROLES_VALIDOS.includes(body.rol)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }
    if (!body.id) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("usuarios_perfil")
      .update({ rol: body.rol })
      .eq("id", body.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ usuario: data })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST() {
  const auth = await requireAuth()
  if (auth.error) return auth.error
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}

export async function DELETE() {
  const auth = await requireAuth()
  if (auth.error) return auth.error
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
