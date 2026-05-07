import { createClient } from "@/lib/supabase/server"; 
import { createClient as createServiceClient } from "@supabase/supabase-js"; 
import { NextResponse } from "next/server"; 

export async function GET() { 
  try { 
    // 1. Verificar autenticación
    const supabase = await createClient(); 
    const { 
      data: { user }, 
    } = await supabase.auth.getUser(); 
 
    if (!user) { 
      return NextResponse.json({ error: "No autenticado" }, { status: 401 }); 
    } 

    // 2. Usar Service Role para listar pacientes (bypass RLS)
    const supabaseAdmin = createServiceClient( 
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    ); 

    const { data: pacientes, error } = await supabaseAdmin
      .from("paciente")
      .select("*")
      .order("created_at", { ascending: false }); 

    if (error) { 
      // Si created_at no existe, intentamos sin orden
      const { data: pacientes2, error: error2 } = await supabaseAdmin
        .from("paciente")
        .select("*");
      
      if (error2) {
        console.error("Error al listar pacientes:", error2); 
        return NextResponse.json({ error: "Error al obtener pacientes" }, { status: 500 }); 
      }
      return NextResponse.json({ pacientes: pacientes2 });
    } 

    return NextResponse.json({ pacientes }); 
  } catch (err) { 
    console.error("Error inesperado:", err); 
    return NextResponse.json( 
      { error: "Error interno del servidor" }, 
      { status: 500 } 
    ); 
  } 
} 

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();

    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from("paciente")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Error al crear paciente:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ paciente: data });
  } catch (err) {
    console.error("Error inesperado:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
