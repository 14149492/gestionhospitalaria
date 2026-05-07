import { createClient } from "@supabase/supabase-js"; 
import { NextResponse } from "next/server"; 

export async function GET() { 
  try { 
    // Usamos el Service Role para que los usuarios no registrados 
    // puedan ver la lista de establecimientos al registrarse.
    const supabaseAdmin = createClient( 
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    ); 

    const { data, error } = await supabaseAdmin 
      .from("establecimiento") 
      .select("establecimiento_id, nombre_establecimiento") 
      .order("nombre_establecimiento", { ascending: true }); 

    if (error) { 
      console.error("Error al obtener establecimientos:", error); 
      return NextResponse.json({ error: "Error al obtener establecimientos" }, { status: 500 }); 
    } 

    return NextResponse.json({ establecimientos: data }); 
  } catch (err) { 
    console.error("Error inesperado:", err); 
    return NextResponse.json( 
      { error: "Error interno del servidor" }, 
      { status: 500 } 
    ); 
  } 
} 
