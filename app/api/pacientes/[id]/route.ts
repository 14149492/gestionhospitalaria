import { NextResponse, type NextRequest } from "next/server"
import { requireAuth } from "@/lib/supabase/auth-helper"
import { createClient as createServiceClient } from "@supabase/supabase-js"

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { id } = await params
  const { data, error } = await getServiceClient()
    .from("paciente")
    .select("*")
    .eq("paciente_id", id)
    .single()

  if (error || !data)
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 })

  return NextResponse.json({ paciente: data })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requireAuth(["admin", "operador"])
  if (auth.error) return auth.error

  const { id } = await params
  const body = await req.json()

  const { data, error } = await getServiceClient()
    .from("paciente")
    .update(body)
    .eq("paciente_id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ paciente: data })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAuth(["admin"])
  if (auth.error) return auth.error

  const { id } = await params
  const { error } = await getServiceClient()
    .from("paciente")
    .delete()
    .eq("paciente_id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: "Paciente eliminado" })
}
