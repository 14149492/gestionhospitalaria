import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
 
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
 
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Obtener el usuario autenticado
  const supabase = await createClient()
 
  const {
    data: { user },
  } = await supabase.auth.getUser()
 
  // Si no hay usuario, redirigir a login
  if (!user) {
    redirect("/login")
  }
 
  // 2. Obtener el perfil del usuario (rol, nombre)
  const { data: perfil } = await supabase
    .from("usuarios_perfil")
    .select("nombre_completo, rol")
    .eq("id", user.id)
    .single()
 
  if (!perfil) {
    redirect("/login")
  }
 
  return (
    <TooltipProvider>
    <SidebarProvider>
      <AppSidebar
        rol={perfil.rol}
        nombreUsuario={perfil.nombre_completo}
      />
      <SidebarInset>
        {/* ─── Header del contenido ─── */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="text-sm text-muted-foreground">
            {perfil.rol.charAt(0).toUpperCase() + perfil.rol.slice(1)}
          </span>
        </header>
 
        {/* ─── Contenido principal ─── */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  )
}
