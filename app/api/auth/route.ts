import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}

export async function POST() {
  return NextResponse.json({ error: "Credenciales requeridas" }, { status: 401 })
}

export async function PUT() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
