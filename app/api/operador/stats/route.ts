import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: "No auth" }, { status: 401 });

    const [
      { count: dosisAplicadas },
      { count: pacientesHoy }
    ] = await Promise.all([
      supabase.from("registro_vacunacion").select("*", { count: 'exact', head: true }).eq("registrado_por", user.id),
      supabase.from("registro_vacunacion")
        .select("*", { count: 'exact', head: true })
        .eq("registrado_por", user.id)
        .gte("fecha_vacunacion", new Date().toISOString().split('T')[0])
    ]);

    return NextResponse.json({
      stats: {
        dosisAplicadas: dosisAplicadas || 0,
        pacientesHoy: pacientesHoy || 0,
        stockDisponible: 450, // Mock stock as it's not in schema
        metaDiaria: 25
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
