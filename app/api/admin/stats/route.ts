import { createClient } from "@/lib/supabase/server";
  import { createClient as createServiceClient } from "@supabase/supabase-js";
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
  
      if (perfil?.rol !== "admin") {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
  
      const supabaseAdmin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
  
      // Conteos en paralelo
      const [usuarios, materias, inscripciones, inscritas] = await Promise.all([
        supabaseAdmin
          .from("usuarios_perfil")
          .select("id, rol, activo", { count: "exact" }),
        supabaseAdmin
          .from("materias")
          .select("id", { count: "exact", head: true }),
        supabaseAdmin
          .from("inscripciones")
          .select("id", { count: "exact", head: true }),
        supabaseAdmin
          .from("inscripciones")
          .select("id", { count: "exact", head: true })
          .eq("estado", "inscrito"),
      ]);
  
      // Desglose de usuarios por rol
      const perfiles = usuarios.data || [];
      const totalEstudiantes = perfiles.filter((u) => u.rol === "estudiante").length;
      const totalDocentes = perfiles.filter((u) => u.rol === "docente").length;
      const totalAdmins = perfiles.filter((u) => u.rol === "admin").length;
      const totalActivos = perfiles.filter((u) => u.activo).length;
      const totalInactivos = perfiles.filter((u) => !u.activo).length;
  
      return NextResponse.json({
        stats: {
          totalUsuarios: usuarios.count || 0,
          totalEstudiantes,
          totalDocentes,
          totalAdmins,
          totalActivos,
          totalInactivos,
          totalMaterias: materias.count || 0,
          totalInscripciones: inscripciones.count || 0,
          inscripcionesActivas: inscritas.count || 0,
        },
      });
    } catch (err) {
      console.error("Error inesperado:", err);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
  }
