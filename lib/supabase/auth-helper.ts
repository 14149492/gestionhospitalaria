import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

type Rol = "admin" | "operador" | "consulta"

interface AuthResult {
  user: { id: string; email?: string }
  perfil: { rol: Rol; nombre?: string } | null
  error?: NextResponse
}

/**
 * Verifica autenticación y opcionalmente el rol del usuario.
 * Uso:
 *   const auth = await requireAuth(["admin"])
 *   if (auth.error) return auth.error
 */
export async function requireAuth(rolesPermitidos?: Rol[]): Promise<AuthResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      user: { id: "" },
      perfil: null,
      error: NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      ),
    }
  }

  // Si no se requiere un rol específico, solo autenticación
  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return { user, perfil: null }
  }

  // Verificar rol
  const { data: perfil } = await supabase
    .from("usuarios_perfil")
    .select("rol, nombre")
    .eq("id", user.id)
    .single()

  if (!perfil || !rolesPermitidos.includes(perfil.rol as Rol)) {
    return {
      user,
      perfil,
      error: NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      ),
    }
  }

  return { user, perfil }
}
