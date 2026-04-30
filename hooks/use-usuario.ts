"use client" 


import { useEffect, useState } from "react" 
import { createClient } from "@/lib/supabase/client" 

type Usuario = { 
  id: string 
  email: string 
  nombre_completo: string 
  rol: string 
  carrera: string | null 
  telefono: string | null 
  avatar_url: string | null 
} 
export function useUsuario() { 
  const [usuario, setUsuario] = useState<Usuario | null>(null) 
  const [loading, setLoading] = useState(true) 

  

  useEffect(() => { 
    async function fetchUsuario() { 
      try { 
        const supabase = createClient() 
        // 1. Obtener el usuario autenticado 
        const { 
          data: { user }, 
        } = await supabase.auth.getUser() 

        if (!user) { 
          setLoading(false) 
          return 
        } 

        // 2. Obtener el perfil de la BD 
        const { data: perfil } = await supabase 
          .from("usuarios_perfil") 
          .select("*") 
          .eq("id", user.id) 
          .single() 

        if (perfil) { 
          setUsuario({ 
            id: user.id, 
            email: user.email || "", 
            nombre_completo: perfil.nombre_completo, 
            rol: perfil.rol, 
            carrera: perfil.carrera, 
            telefono: perfil.telefono, 
            avatar_url: perfil.avatar_url, 
          }) 
        } 
      } catch (error) { 
        console.error("Error al obtener usuario:", error) 
      } finally { 
        setLoading(false) 
      } 
    } 
    fetchUsuario() 
  }, []) 
  return { usuario, loading } 
} 