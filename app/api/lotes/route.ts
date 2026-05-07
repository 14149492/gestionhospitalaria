import { createClient } from "@/lib/supabase/server"; 
import { createClient as createServiceClient } from "@supabase/supabase-js"; 
import { NextResponse } from "next/server"; 

export async function GET() { 
  try { 
    const supabase = await createClient(); 
    const { data: { user } } = await supabase.auth.getUser(); 
 
    if (!user) { 
      return NextResponse.json({ error: "No autorizado" }, { status: 401 }); 
    } 

    const supabaseAdmin = createServiceClient( 
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    ); 

    // Obtener lotes únicos ya registrados en el sistema
    const { data, error } = await supabaseAdmin
      .from("registro_vacunacion")
      .select("lote_vacuna");

    if (error) { 
      console.error("Error al obtener lotes:", error); 
      return NextResponse.json({ error: "Error al obtener lotes" }, { status: 500 }); 
    } 

    // Filtrar duplicados
    const lotesUnicos = Array.from(new Set(data.map(d => d.lote_vacuna))).sort();

    return NextResponse.json({ lotes: lotesUnicos }); 
  } catch (err) { 
    console.error("Error inesperado:", err); 
    return NextResponse.json( 
      { error: "Error interno del servidor" }, 
      { status: 500 } 
    ); 
  } 
} 
