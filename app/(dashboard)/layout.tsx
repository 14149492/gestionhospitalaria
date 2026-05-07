import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
 
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import AppSidebar from "@/components/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
 
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
      <AppSidebar rol={perfil.rol as any} nombreUsuario={perfil.nombre_completo} />
      <SidebarInset className="bg-transparent">
        <header className="flex h-16 shrink-0 items-center gap-2 px-6 bg-background/50 backdrop-blur-md sticky top-0 z-30 border-b border-primary/5">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-primary/10" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="font-bold text-xs uppercase tracking-widest text-primary/60">Sistema PAI</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-black text-xs uppercase tracking-widest">{perfil.rol}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  )
}
