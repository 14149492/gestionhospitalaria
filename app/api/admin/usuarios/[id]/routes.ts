 import { createClient } from "@/lib/supabase/server"; 

  import { createClient as createServiceClient } from "@supabase/supabase-js"; 

  import { NextRequest, NextResponse } from "next/server"; 

   

  export async function PUT( 

    request: NextRequest, 

    { params }: { params: Promise<{ id: string }> } 

  ) { 

    try { 

      const { id } = await params; 

   

      // 1. Verificar autenticación 

      const supabase = await createClient(); 

      const { 

        data: { user }, 

        error: authError, 

      } = await supabase.auth.getUser(); 

   

      if (authError || !user) { 

        return NextResponse.json({ error: "No autenticado" }, { status: 401 }); 

      } 

   

      // 2. Verificar rol admin 

      const { data: perfil } = await supabase 

        .from("usuarios_perfil") 

        .select("rol") 

        .eq("id", user.id) 

        .single(); 

   

      if (perfil?.rol !== "admin") { 

        return NextResponse.json({ error: "No autorizado" }, { status: 403 }); 

      } 

   

      // 3. Evitar que el admin se modifique a sí mismo 

      if (id === user.id) { 

        return NextResponse.json( 

          { error: "No puedes modificar tu propia cuenta" }, 

          { status: 400 } 

        ); 

      } 

   

      // 4. Leer los datos del body 

      const body = await request.json(); 

      const { rol, activo } = body; 

   

      // 5. Validar los campos 

      const rolesValidos = ["estudiante", "docente", "admin"]; 

      if (rol !== undefined && !rolesValidos.includes(rol)) { 

        return NextResponse.json({ error: "Rol inválido" }, { status: 400 }); 

      } 

   

      if (activo !== undefined && typeof activo !== "boolean") { 

        return NextResponse.json( 

          { error: "El campo activo debe ser true o false" }, 

          { status: 400 } 

        ); 

      } 

   

      // 6. Construir objeto de actualización 

      const actualizacion: Record<string, unknown> = {}; 

      if (rol !== undefined) actualizacion.rol = rol; 

      if (activo !== undefined) actualizacion.activo = activo; 

   

      if (Object.keys(actualizacion).length === 0) { 

        return NextResponse.json( 

          { error: "No se proporcionaron campos para actualizar" }, 

          { status: 400 } 

        ); 

      } 

   

      // 7. Actualizar con Service Role 

      const supabaseAdmin = createServiceClient( 

        process.env.NEXT_PUBLIC_SUPABASE_URL!, 

        process.env.SUPABASE_SERVICE_ROLE_KEY! 

      ); 

   

      const { data, error } = await supabaseAdmin 

        .from("usuarios_perfil") 

        .update(actualizacion) 

        .eq("id", id) 

        .select("id, nombre, apellido, rol, activo") 

        .single(); 

   

      if (error) { 

        console.error("Error al actualizar usuario:", error); 

        return NextResponse.json( 

          { error: "Error al actualizar el usuario" }, 

          { status: 500 } 

        ); 

      } 

   

      return NextResponse.json({ usuario: data }); 

    } catch (err) { 

      console.error("Error inesperado:", err); 

      return NextResponse.json( 

        { error: "Error interno del servidor" }, 

        { status: 500 } 

      ); 

    } 

  } 