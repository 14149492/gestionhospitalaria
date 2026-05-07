"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldPlus, User, Mail, Lock, Building2, CheckCircle2 } from "lucide-react"

export function RegistroForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre_completo: "",
    rol: "consulta",
    establecimiento_id: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [establecimientos, setEstablecimientos] = useState<{establecimiento_id: string, nombre_establecimiento: string}[]>([])

  useEffect(() => {
    async function cargarEstablecimientos() {
      try {
        const res = await fetch("/api/establecimientos")
        const data = await res.json()
        if (data.establecimientos) {
          setEstablecimientos(data.establecimientos)
          // Pre-seleccionar el primero si existe
          if (data.establecimientos.length > 0 && !formData.establecimiento_id) {
            setFormData(prev => ({ ...prev, establecimiento_id: data.establecimientos[0].establecimiento_id }))
          }
        }
      } catch (err) {
        console.error("Error cargando establecimientos", err)
      }
    }
    cargarEstablecimientos()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || "Error al registrar")
        return
      }
      setSuccess(true)
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-[500px] glass-card border-none shadow-2xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
               <CheckCircle2 className="size-12 animate-in zoom-in duration-500" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black">¡Registro Exitoso!</CardTitle>
            <CardDescription className="text-lg font-medium">
              Hemos enviado un enlace de verificación a su correo. 
              Por favor, confirme su cuenta para comenzar.
            </CardDescription>
          </div>
          <Link href="/login" className="block">
            <Button className="w-full h-12 premium-gradient border-none font-bold">Volver al Inicio</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-[-10%] right-[-10%] size-[40%] rounded-full bg-accent/10 blur-[120px]" />
      
      <Card className="w-full max-w-[500px] glass-card border-none shadow-2xl relative z-10 overflow-hidden">
        <div className="h-2 premium-gradient" />
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-black tracking-tighter">Únete al Sistema PAI</CardTitle>
          <CardDescription className="font-medium">Formulario de registro para personal de salud.</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegistro}>
          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-4 text-xs font-bold text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nombre Completo</Label>
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                   <Input name="nombre_completo" placeholder="Dr. Juan Perez" className="pl-10 h-11 bg-muted/30 border-none rounded-xl" value={formData.nombre_completo} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Correo Institucional</Label>
                <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                   <Input name="email" type="email" placeholder="juan@salud.gob.bo" className="pl-10 h-11 bg-muted/30 border-none rounded-xl" value={formData.email} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contraseña</Label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                     <Input name="password" type="password" className="pl-10 h-11 bg-muted/30 border-none rounded-xl" value={formData.password} onChange={handleChange} required minLength={6} disabled={loading} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rol</Label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    disabled={loading}
                    className="flex h-11 w-full rounded-xl bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none font-medium"
                  >
                    <option value="consulta">Consulta</option>
                    <option value="operador">Operador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Establecimiento</Label>
                <div className="relative">
                   <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                   <select 
                     name="establecimiento_id" 
                     className="flex h-11 w-full rounded-xl bg-muted/30 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none font-medium appearance-none"
                     value={formData.establecimiento_id} 
                     onChange={handleChange} 
                     disabled={loading}
                     required
                   >
                     <option value="" disabled>Seleccione su centro de salud</option>
                     {establecimientos.map((e) => (
                       <option key={e.establecimiento_id} value={e.establecimiento_id}>
                         {e.nombre_establecimiento}
                       </option>
                     ))}
                   </select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8 pt-4">
            <Button type="submit" className="w-full h-12 text-md font-black premium-gradient border-none shadow-lg shadow-primary/20 rounded-xl" disabled={loading}>
              {loading ? "PROCESANDO..." : "SOLICITAR ACCESO"}
            </Button>
            <p className="text-xs font-bold text-muted-foreground text-center">
              ¿Ya tiene credenciales?{" "}
              <Link href="/login" className="text-primary hover:underline">Inicie Sesión</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
