"use client"
 
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShieldCheck, LogOut, ChevronUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 
import { navigationConfig, type NavGroup } from "@/lib/navigation"
 
interface AppSidebarProps {
  rol: string
  nombreUsuario: string
}
 
export default function AppSidebar({ rol, nombreUsuario }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
 
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }
 
  // Mapeo de nombres de rol para mostrar
  const rolLabel = {
    admin: "Administrador PAI",
    operador: "Operador de Salud",
    docente: "Operador de Salud",
    consulta: "Consulta Pública",
    estudiante: "Consulta Pública"
  }[rol] || rol
 
  // Obtener los grupos de navegación según el rol
  const navGroups: NavGroup[] = navigationConfig[rol] || []
 
  return (
    <Sidebar collapsible="icon" className="border-r border-primary/5 bg-background/50 backdrop-blur-xl">
      {/* ─── Header del sidebar: Logo + nombre ─── */}
      <SidebarHeader className="border-b border-primary/5 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-primary/5 transition-colors">
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <ShieldCheck className="size-6" />
              </div>
              <div className="grid flex-1 text-left leading-tight ml-2">
                <span className="truncate font-bold text-lg tracking-tight text-primary">Sistema PAI</span>
                <span className="truncate text-xs font-medium text-muted-foreground uppercase tracking-widest">{rolLabel}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
 
      {/* ─── Contenido: grupos de navegación ─── */}
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className="hover:bg-primary/5 hover:text-primary transition-all duration-300 group py-6 px-4"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="size-5 transition-transform group-hover:scale-110 group-hover:rotate-3" />
                        <span className="font-medium tracking-wide">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
 
      {/* ─── Footer: nombre del usuario ─── */}
      <SidebarFooter className="border-t border-primary/5 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-sm font-bold">
                      {nombreUsuario.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none ml-2 text-left">
                    <span className="text-sm font-semibold truncate max-w-[120px]">{nombreUsuario}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{rolLabel}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-primary/5 bg-background/80 backdrop-blur-xl"
                align="start"
              >
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive focus:text-white focus:bg-destructive cursor-pointer py-3 rounded-lg transition-colors"
                >
                  <LogOut className="size-4" />
                  <span className="font-medium">Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
 
      <SidebarRail />
    </Sidebar>
  )
}
