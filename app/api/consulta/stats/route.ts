import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const [
      { count: totalInmunizados },
      { count: totalVacunas }
    ] = await Promise.all([
      supabase.from("registro_vacunacion").select("paciente_id", { count: 'exact', head: true }),
      supabase.from("vacuna").select("*", { count: 'exact', head: true })
    ]);

    // Lógica de meta ficticia para la visualización pública
    const meta = 85.5; 

    return NextResponse.json({
      stats: {
        totalInmunizados: totalInmunizados || 0,
        metaAlcance: `${meta}%`,
        departamentosActivos: 9,
        biologicosEnUso: totalVacunas || 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
