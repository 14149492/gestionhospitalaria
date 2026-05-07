"use client"

import { useState } from "react" 
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Activity, ArrowRight, Lock, Mail } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError("Credenciales inválidas o acceso denegado.")
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: perfil } = await supabase
        .from("usuarios_perfil")
        .select("rol")
        .eq("id", user.id)
        .single()

      if (perfil) {
        if (perfil.rol === "admin") router.push("/admin")
        else if (perfil.rol === "operador") router.push("/operador")
        else router.push("/consulta")
      } else {
        router.push("/")
      }
      router.refresh()
    } catch {
      setError("Error de conexión. Intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] size-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[40%] rounded-full bg-accent/10 blur-[120px]" />

      <Card className="w-full max-w-[450px] glass-card border-none shadow-2xl relative z-10 p-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
             <div className="size-16 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-xl animate-float">
                <ShieldCheck className="size-10" />
             </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tighter text-primary">SISTEMA PAI</CardTitle>
            <CardDescription className="text-sm font-medium tracking-wide">
              Gestión Nacional de Inmunización — Bolivia
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-4 text-xs font-bold text-destructive border border-destructive/20 flex items-center gap-2">
                <Activity className="size-4" /> {error}
              </div>
            )}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Credencial de Acceso</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@salud.gob.bo"
                  className="h-12 pl-12 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" title="Contraseña" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Clave de Seguridad</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-12 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 pt-4">
            <Button type="submit" className="w-full h-14 text-lg font-black premium-gradient border-none shadow-xl shadow-primary/20 rounded-xl group" disabled={loading}>
              {loading ? "AUTENTICANDO..." : (
                <>
                  INGRESAR AL SISTEMA <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <div className="text-center space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                ¿Nuevo personal de salud?{" "}
                <Link href="/registro" className="text-primary font-bold hover:underline">
                  Solicitar Registro
                </Link>
              </p>
              <div className="pt-4 flex items-center justify-center gap-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                <span>Versión 2.0 PAI</span>
                <span>•</span>
                <span>Encriptación AES-256</span>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
