import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ error: "No autenticado" }, { status: 401 })
}

export async function POST() {
  return NextResponse.json({ error: "No autenticado" }, { status: 401 })
}
