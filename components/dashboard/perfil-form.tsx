"use client" 
 
import { useEffect, useState } from "react" 
import { useForm } from "react-hook-form" 
import { zodResolver } from "@hookform/resolvers/zod" 
import { toast } from "sonner" 
import { perfilSchema, type PerfilFormData } from "@/lib/validations/perfil" 
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input" 
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Building2, Save, Loader2 } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
} from "@/components/ui/card" 
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
} from "@/components/ui/form" 

export function PerfilForm() { 
  const [loading, setLoading] = useState(true) 
  const [saving, setSaving] = useState(false) 
  const [extraData, setExtraData] = useState({
    email: "",
    rol: "",
    nombre_establecimiento: ""
  })
  
  const form = useForm<PerfilFormData>({ 
    resolver: zodResolver(perfilSchema), 
    defaultValues: { 
      nombre_completo: "", 
      telefono: "", 
    }, 
  }) 

  useEffect(() => { 
    async function loadPerfil() { 
      try { 
        const response = await fetch("/api/auth/perfil") 
        const data = await response.json() 

        if (response.ok && data.perfil) { 
          form.reset({ 
            nombre_completo: data.perfil.nombre_completo || "", 
            telefono: data.perfil.telefono || "", 
          }) 
          setExtraData({
            email: data.perfil.email || "",
            rol: data.perfil.rol || "",
            nombre_establecimiento: data.perfil.nombre_establecimiento || ""
          })
        } 
      } catch (error) { 
        toast.error("Error al cargar el perfil") 
      } finally { 
        setLoading(false) 
      } 
    } 
    loadPerfil() 
  }, [form]) 

  async function onSubmit(values: PerfilFormData) { 
    setSaving(true) 
    try { 
      const response = await fetch("/api/auth/perfil", { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(values), 
      }) 
      const data = await response.json() 
      if (!response.ok) { 
        toast.error(data.error || "Error al actualizar") 
        return 
      } 
      toast.success("Perfil actualizado correctamente") 
    } catch { 
      toast.error("Error de conexión") 
    } finally { 
      setSaving(false) 
    } 
  } 

  if (loading) { 
    return ( 
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Cargando tu información...</p>
      </div>
    ) 
  } 

  return ( 
    <div className="grid gap-6 md:grid-cols-12">
      {/* ─── Columna Izquierda: Información de Cuenta ─── */}
      <Card className="md:col-span-4 glass-card border-none shadow-xl overflow-hidden self-start">
        <div className="h-24 premium-gradient flex items-end justify-center pb-4">
          <div className="size-20 rounded-2xl bg-background shadow-lg flex items-center justify-center border-4 border-background -mb-10">
            <User className="size-10 text-primary" />
          </div>
        </div>
        <CardHeader className="pt-12 text-center">
          <CardTitle className="text-xl font-bold">{extraData.email}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2 mt-1">
            <Badge variant="secondary" className="uppercase text-[10px] tracking-widest font-bold">
              {extraData.rol}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="rounded-xl bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="size-4 text-primary" />
              <span className="font-medium truncate">{extraData.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="size-4 text-primary" />
              <span className="font-medium capitalize">{extraData.rol} PAI</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="size-4 text-primary" />
              <span className="font-medium">{extraData.nombre_establecimiento}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Columna Derecha: Formulario de Edición ─── */}
      <Card className="md:col-span-8 glass-card border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight">Información Personal</CardTitle>
          <CardDescription>Actualiza tus datos de contacto en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}> 
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> 
              <div className="grid gap-6 md:grid-cols-2">
                <FormField 
                  control={form.control} 
                  name="nombre_completo" 
                  render={({ field }) => ( 
                    <FormItem className="md:col-span-2"> 
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nombre Completo</FormLabel> 
                      <FormControl> 
                        <Input 
                          placeholder="Ej: Dr. Juan Pérez" 
                          className="h-12 bg-muted/30 border-none rounded-xl font-medium focus-visible:ring-primary"
                          {...field} 
                        /> 
                      </FormControl> 
                      <FormMessage /> 
                    </FormItem> 
                  )} 
                /> 

                <FormField 
                  control={form.control} 
                  name="telefono" 
                  render={({ field }) => ( 
                    <FormItem className="md:col-span-2"> 
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Teléfono de Contacto</FormLabel> 
                      <FormControl> 
                        <Input 
                          placeholder="+591 7xxxxxxx" 
                          className="h-12 bg-muted/30 border-none rounded-xl font-medium focus-visible:ring-primary"
                          {...field} 
                        /> 
                      </FormControl> 
                      <FormMessage /> 
                    </FormItem> 
                  )} 
                /> 
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="h-12 px-8 premium-gradient border-none font-bold shadow-lg shadow-primary/20 rounded-xl"
                > 
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )} 
                </Button> 
              </div>
            </form> 
          </Form> 
        </CardContent>
      </Card>
    </div>
  ) 
} 