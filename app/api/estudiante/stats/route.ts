import { createClient } from "@/lib/supabase/server";
  import { NextResponse } from "next/server";
  
  export async function GET() {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError || !user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      }
  
      const { data: perfil } = await supabase
        .from("usuarios_perfil")
        .select("rol")
        .eq("id", user.id)
        .single();
  
      if (perfil?.rol !== "estudiante") {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
  
      // Obtener inscripciones con créditos
      const { data: inscripciones } = await supabase
        .from("inscripciones")
        .select("estado, materia:materias!materia_id(creditos)")
        .eq("estudiante_id", user.id);
  
      const inscritas = inscripciones?.filter(
        (i) => i.estado === "inscrito"
      ) || [];
      const retiradas = inscripciones?.filter(
        (i) => i.estado === "retirado"
      ) || [];
  
      const creditosActivos = inscritas.reduce(
        (sum, i) => sum + ((i.materia as any)?.creditos || 0),
        0
      );
  
      // Total de materias disponibles
      const { count: totalMaterias } = await supabase
        .from("materias")
        .select("id", { count: "exact", head: true });
  
      return NextResponse.json({
        stats: {
          materiasInscritas: inscritas.length,
          materiasRetiradas: retiradas.length,
          creditosActivos,
          totalMateriasDisponibles: totalMaterias || 0,
        },
      });
    } catch (err) {
      console.error("Error inesperado:", err);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
  }
