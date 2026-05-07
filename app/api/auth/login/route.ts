import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
