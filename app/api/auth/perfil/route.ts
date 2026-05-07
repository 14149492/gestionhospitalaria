import { NextResponse } from "next/server" 
import { createClient } from "@/lib/supabase/server" 

export async function GET() { 
  try { 
    const supabase = await createClient() 
    const { 
      data: { user }, 
    } = await supabase.auth.getUser() 
 
    if (!user) { 
      return NextResponse.json({ error: "No autorizado" }, { status: 401 }) 
    } 

    // Obtener perfil con el nombre del establecimiento
    const { data: perfil, error } = await supabase 
      .from("usuarios_perfil") 
      .select(`
        *,
        establecimiento:establecimiento_id (
          nombre_establecimiento
        )
      `) 
      .eq("id", user.id) 
      .single() 

    if (error) { 
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 }) 
    } 

    return NextResponse.json({ 
      perfil: {
        ...perfil,
        email: user.email,
        nombre_establecimiento: perfil.establecimiento?.nombre_establecimiento || "No asignado"
      } 
    }) 
  } catch (err) { 
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 }) 
  } 
} 

export async function PUT(request: Request) { 
  try { 
    const supabase = await createClient() 
    const { 
      data: { user }, 
    } = await supabase.auth.getUser() 

    if (!user) { 
      return NextResponse.json({ error: "No autorizado" }, { status: 401 }) 
    } 

    const body = await request.json() 
    const { nombre_completo } = body 

    if (!nombre_completo || nombre_completo.trim().length < 2) { 
      return NextResponse.json( 
        { error: "El nombre debe tener al menos 2 caracteres" }, 
        { status: 400 } 
      ) 
    } 

    const { data, error } = await supabase 
      .from("usuarios_perfil") 
      .update({ 
        nombre_completo: nombre_completo.trim()
      }) 
      .eq("id", user.id) 
      .select() 
      .single() 

    if (error) { 
      return NextResponse.json( 
        { error: "Error al actualizar: " + error.message }, 
        { status: 500 } 
      ) 
    } 

    return NextResponse.json({ perfil: data }) 
  } catch (err) { 
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 }) 
  } 
} 