import { createClient } from "@/lib/supabase/server"; 
import { createClient as createServiceClient } from "@supabase/supabase-js"; 
import { NextResponse } from "next/server"; 

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();

    // Validar datos mínimos
    if (!body.paciente_id || !body.vacuna_id || !body.establecimiento_id) {
        return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insertar el registro usando service role para bypass RLS
    const { data, error } = await supabaseAdmin
      .from("registro_vacunacion")
      .insert([{
        ...body,
        registrado_por: user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error al registrar vacunación:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ registro: data });
  } catch (err) {
    console.error("Error inesperado:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
  
      if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      }
  
      const supabaseAdmin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
  
      const { data, error } = await supabaseAdmin
        .from("registro_vacunacion")
        .select(`
          *,
          paciente:paciente_id (nombres, primer_apellido),
          vacuna:vacuna_id (vacuna_nombre),
          establecimiento:establecimiento_id (nombre_establecimiento)
        `)
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error("Error al obtener registros:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      return NextResponse.json({ registros: data });
    } catch (err) {
      console.error("Error inesperado:", err);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
