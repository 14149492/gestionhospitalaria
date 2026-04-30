import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
 
export default async  function Home() {

  const supabase = await createClient()
 
  const {
    data: { user },
  } = await supabase.auth.getUser()
 
  if (!user) {
    redirect("/login")
  }
 
  // Si hay usuario, obtener su rol y redirigir
  const { data: perfil } = await supabase
    .from("usuarios_perfil")
    .select("rol")
    .eq("id", user.id)
    .single()
 
  if (perfil) {
    redirect(`/${perfil.rol}`)
  }
 
  redirect("/login")





  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Gestión Académica</CardTitle>
          <CardDescription>
            Sistema de gestión universitaria — UPDS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Stack: Next.js 16 · Supabase · shadcn/ui
          </p>
          <div className="flex gap-2">
            <Button>Iniciar Sesión</Button>
            <Button variant="outline">Registrarse</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Entrega 1B completada ✓
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

