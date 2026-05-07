import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
 
export async function proxy(request: NextRequest) {
  // 1. Crear una respuesta inicial que pasa el request original
  let supabaseResponse = NextResponse.next({
    request,
  })
 
  // 2. Crear cliente Supabase con manejo de cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Actualizar cookies en el request (para Server Components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Crear nueva respuesta con request actualizado
          supabaseResponse = NextResponse.next({
            request,
          })
          // Actualizar cookies en la respuesta (para el navegador)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
 
  // 3. IMPORTANTE: Verificar el usuario actual
  // No ejecutes código entre createServerClient y auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()
 
  // 4. Definir rutas públicas
  const publicRoutes = ["/login", "/registro", "/auth"]
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
 
  // 5. Si no hay usuario y la ruta NO es pública (y NO es una ruta de API)
  if (!user && !isPublicRoute && request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.startsWith("/api")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }
 
  // 6. Si hay usuario y está en ruta de auth, redirigir a su dashboard
  if (user && isPublicRoute) {
    // Consultar el rol del usuario
    const { data: perfil } = await supabase
      .from("usuarios_perfil")
      .select("rol")
      .eq("id", user.id)
      .single()
 
    const url = request.nextUrl.clone()
 
    if (perfil) {
      switch (perfil.rol) {
        case "consulta":
          url.pathname = "/consulta"
          break
        case "operador":
          url.pathname = "/operador"
          break
        case "admin":
          url.pathname = "/admin"
          break
        default:
          url.pathname = "/"
      }
    } else {
      url.pathname = "/"
    }
 
    return NextResponse.redirect(url)
  }
 
  return supabaseResponse

}
 
// Configuración: en qué rutas se ejecuta proxy.ts
export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas EXCEPTO:
     * - _next/static (archivos estáticos de Next.js)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono del sitio)
     * - Archivos de imagen (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
