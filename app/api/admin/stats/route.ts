import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Consultas en paralelo para mayor velocidad
    const [
      { count: totalUsuarios },
      { count: totalOperadores },
      { count: totalAdmins },
      { count: totalEstablecimientos },
      { count: totalVacunas },
      { count: totalRegistros },
      { count: totalPacientes }
    ] = await Promise.all([
      supabase.from("usuarios_perfil").select("*", { count: 'exact', head: true }),
      supabase.from("usuarios_perfil").select("*", { count: 'exact', head: true }).eq("rol", "operador"),
      supabase.from("usuarios_perfil").select("*", { count: 'exact', head: true }).eq("rol", "admin"),
      supabase.from("establecimiento").select("*", { count: 'exact', head: true }),
      supabase.from("vacuna").select("*", { count: 'exact', head: true }),
      supabase.from("registro_vacunacion").select("*", { count: 'exact', head: true }),
      supabase.from("paciente").select("*", { count: 'exact', head: true })
    ]);

    return NextResponse.json({
      stats: {
        totalUsuarios: totalUsuarios || 0,
        totalOperadores: totalOperadores || 0,
        totalAdmins: totalAdmins || 0,
        totalEstablecimientos: totalEstablecimientos || 0,
        totalVacunas: totalVacunas || 0,
        totalRegistros: totalRegistros || 0,
        totalPacientes: totalPacientes || 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
