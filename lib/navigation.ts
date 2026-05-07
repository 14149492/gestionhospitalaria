import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
  UserCircle, 
  Clock,
  UserCheck,
  BarChart3,
  MapPin,
  ShieldCheck            
} from "lucide-react"
 
export type NavItem = {
  title: string
  url: string
  icon: typeof LayoutDashboard
}
 
export type NavGroup = {
  label: string
  items: NavItem[]
}
 
// Navegación para cada rol del Sistema de Vacunación PAI
export const navigationConfig: Record<string, NavGroup[]> = {
  consulta: [
    {
      label: "Visualización",
      items: [
        { title: "Resumen", url: "/consulta", icon: LayoutDashboard },
        { title: "Estadísticas PAI", url: "/consulta/estadisticas", icon: BarChart3 },
        { title: "Mapa Cobertura", url: "/consulta/mapa", icon: MapPin },
      ],
    },
    {
      label: "Cuenta",
      items: [
        { title: "Mi Perfil", url: "/consulta/perfil", icon: UserCircle },
      ],
    },
  ],
  operador: [
    {
      label: "Vacunación",
      items: [
        { title: "Panel Operativo", url: "/operador", icon: LayoutDashboard },
        { title: "Registrar Paciente", url: "/operador/pacientes", icon: Users },
        { title: "Nueva Vacunación", url: "/operador/registro", icon: ShieldCheck },
        { title: "Historial de Aplicación", url: "/operador/historial", icon: ClipboardList },
      ],
    },
    {
      label: "Logística",
      items: [
        { title: "Vacunas Disponibles", url: "/operador/vacunas", icon: BookOpen },
        { title: "Brigada Móvil", url: "/operador/brigada", icon: MapPin },
      ],
    },
    {
      label: "Cuenta",
      items: [
        { title: "Mi Perfil", url: "/operador/perfil", icon: UserCircle },
      ],
    },
  ],
  admin: [
    {
      label: "Gestión PAI",
      items: [
        { title: "Panel Control", url: "/admin", icon: LayoutDashboard },
        { title: "Personal / Operadores", url: "/admin/usuarios", icon: Users },
        { title: "Catálogo de Vacunas", url: "/admin/vacunas", icon: BookOpen },
        { title: "Establecimientos", url: "/admin/establecimientos", icon: MapPin },
      ],
    },
    {
      label: "Reportes",
      items: [
        { title: "Registros Globales", url: "/admin/registros", icon: ClipboardList },
        { title: "Análisis de Datos", url: "/admin/analisis", icon: BarChart3 },
      ],
    },
    {
      label: "Cuenta",
      items: [
        { title: "Mi Perfil", url: "/admin/perfil", icon: UserCircle },
        { title: "Configuración", url: "/admin/config", icon: Settings },
      ],
    },
  ],
}
