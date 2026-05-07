import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/admin/stats
 * Solo accesible para usuarios con rol "admin"
 */
export async function GET() {
  const auth = await requireAuth(["admin"])
  if (auth.error) return auth.error

  try {
    const supabase = await createClient()

    const [
      { count: totalUsuarios },
      { count: totalOperadores },
      { count: totalAdmins },
      { count: totalEstablecimientos },
      { count: totalVacunas },
      { count: totalRegistros },
      { count: totalPacientes },
    ] = await Promise.all([
      supabase.from("usuarios_perfil").select("*", { count: "exact", head: true }),
      supabase.from("usuarios_perfil").select("*", { count: "exact", head: true }).eq("rol", "operador"),
      supabase.from("usuarios_perfil").select("*", { count: "exact", head: true }).eq("rol", "admin"),
      supabase.from("establecimiento").select("*", { count: "exact", head: true }),
      supabase.from("vacuna").select("*", { count: "exact", head: true }),
      supabase.from("registro_vacunacion").select("*", { count: "exact", head: true }),
      supabase.from("paciente").select("*", { count: "exact", head: true }),
    ])

    return NextResponse.json({
      stats: {
        totalUsuarios: totalUsuarios || 0,
        totalOperadores: totalOperadores || 0,
        totalAdmins: totalAdmins || 0,
        totalEstablecimientos: totalEstablecimientos || 0,
        totalVacunas: totalVacunas || 0,
        totalRegistros: totalRegistros || 0,
        totalPacientes: totalPacientes || 0,
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
