import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"
import { createClient as createServiceClient } from "@supabase/supabase-js"

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  try {
    const supabaseAdmin = getServiceClient()
    const { data: pacientes, error } = await supabaseAdmin
      .from("paciente")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      const { data: pacientes2, error: error2 } = await supabaseAdmin.from("paciente").select("*")
      if (error2) return NextResponse.json({ error: "Error al obtener pacientes" }, { status: 500 })
      return NextResponse.json({ pacientes: pacientes2 })
    }

    return NextResponse.json({ pacientes })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(["admin", "operador"])
  if (auth.error) return auth.error

  try {
    const body = await request.json()

    // Validación básica de género
    const generosValidos = ["M", "F"]
    if (body.genero && !generosValidos.includes(body.genero)) {
      return NextResponse.json({ error: "Género inválido (debe ser M o F)" }, { status: 400 })
    }

    const supabaseAdmin = getServiceClient()
    const { data, error } = await supabaseAdmin.from("paciente").insert([body]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ paciente: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Métodos no permitidos sobre la colección completa
export async function PUT() {
  return NextResponse.json({ error: "Método no permitido — use /api/pacientes/[id]" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Método no permitido — use /api/pacientes/[id]" }, { status: 405 })
}
