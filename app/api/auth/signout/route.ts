import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

// GET /api/auth/signout — el navegador navega directo aquí
export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Cierra sesión en el servidor (invalida la cookie)
  await supabase.auth.signOut()

  // Redirige al login usando el origin de la misma request
  const loginUrl = new URL("/login", request.nextUrl.origin)
  const response = NextResponse.redirect(loginUrl)

  // Borra manualmente las cookies de sesión de Supabase por si acaso
  const allCookies = cookieStore.getAll()
  allCookies.forEach((cookie) => {
    if (cookie.name.startsWith("sb-")) {
      response.cookies.delete(cookie.name)
    }
  })

  return response
}
