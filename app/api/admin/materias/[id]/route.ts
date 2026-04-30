import { createClient } from "@/lib/supabase/server"; 

  import { createClient as createServiceClient } from "@supabase/supabase-js"; 

  import { NextRequest, NextResponse } from "next/server"; 

  import { materiaSchema } from "@/lib/validations/materia"; 

   

  // ===== PUT: Editar materia ===== 

  export async function PUT( 

    request: NextRequest, 

    { params }: { params: Promise<{ id: string }> } 

  ) { 

    try { 

      const { id } = await params; 

   

      // 1. Verificar autenticación y rol admin 

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

   

      // 2. Validar body con Zod 

      const body = await request.json(); 

      const resultado = materiaSchema.safeParse(body); 

   

      if (!resultado.success) { 

        const errores = resultado.error.issues.map((issue) => ({ 

          campo: issue.path.join("."), 

          mensaje: issue.message, 

        })); 

        return NextResponse.json( 

          { error: "Datos inválidos", errores }, 

          { status: 400 } 

        ); 

      } 

   

      // 3. Actualizar con Service Role 

      const supabaseAdmin = createServiceClient( 

        process.env.NEXT_PUBLIC_SUPABASE_URL!, 

        process.env.SUPABASE_SERVICE_ROLE_KEY! 

      ); 

   

      const { data, error } = await supabaseAdmin 

        .from("materias") 

        .update({ 

          codigo: resultado.data.codigo, 

          nombre: resultado.data.nombre, 

          creditos: resultado.data.creditos, 

          semestre: resultado.data.semestre, 

          docente_id: resultado.data.docente_id || null, 

        }) 

        .eq("id", id) 

        .select(` 

          id, codigo, nombre, creditos, semestre, docente_id, 

          docente:usuarios_perfil!docente_id(id, nombre_completo)

        `) 

        .single(); 

   

      if (error) { 

        console.error("Error al actualizar materia:", error); 

   

        if (error.code === "23505") { 

          return NextResponse.json( 

            { error: "Ya existe otra materia con ese código" }, 

            { status: 409 } 

          ); 

        } 

   

        return NextResponse.json( 

          { error: "Error al actualizar la materia" }, 

          { status: 500 } 

        ); 

      } 

   

      return NextResponse.json({ materia: data }); 

    } catch (err) { 

      console.error("Error inesperado:", err); 

      return NextResponse.json( 

        { error: "Error interno del servidor" }, 

        { status: 500 } 

      ); 

    } 

  } 

  // ===== DELETE: Eliminar materia ===== 

  export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }

  ) { 

    try { 

      const { id } = await params; 

   

      // 1. Verificar autenticación y rol admin 

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

   

      // 2. Eliminar con Service Role 

      const supabaseAdmin = createServiceClient( 

        process.env.NEXT_PUBLIC_SUPABASE_URL!, 

        process.env.SUPABASE_SERVICE_ROLE_KEY! 

      ); 

   

      const { error } = await supabaseAdmin 

        .from("materias") 

        .delete() 

        .eq("id", id); 

   

      if (error) { 

        console.error("Error al eliminar materia:", error); 

   

        // Error de FK: tiene inscripciones asociadas 

        if (error.code === "23503") { 

          return NextResponse.json( 

            { 

              error: 

                "No se puede eliminar esta materia porque tiene inscripciones asociadas. Primero elimina las inscripciones.", 

            }, 

            { status: 409 } 

          ); 

        } 

   

        return NextResponse.json( 

          { error: "Error al eliminar la materia" }, 

          { status: 500 } 

        ); 

      } 

   

      return NextResponse.json({ mensaje: "Materia eliminada exitosamente" }); 

    } catch (err) { 

      console.error("Error inesperado:", err); 

      return NextResponse.json( 

        { error: "Error interno del servidor" }, 

        { status: 500 } 

      ); 

    } 

  } 