import { createClient } from "@/lib/supabase/server"; 

  import { createClient as createServiceClient } from "@supabase/supabase-js"; 

  import { NextResponse } from "next/server"; 

   

  export async function GET() { 

    try { 

      // 1. Verificar autenticación del usuario actual 

      const supabase = await createClient(); 

      const { 

        data: { user }, 

        error: authError, 

      } = await supabase.auth.getUser(); 

   

      if (authError || !user) { 

        return NextResponse.json({ error: "No autenticado" }, { status: 401 }); 

      } 

   

      // 2. Verificar que el usuario es admin 

      const { data: perfil } = await supabase 

        .from("usuarios_perfil") 

        .select("rol") 

        .eq("id", user.id) 

        .single(); 

   

      if (perfil?.rol !== "admin") { 

        return NextResponse.json({ error: "No autorizado" }, { status: 403 }); 

      } 

   

      // 3. Usar Service Role para listar TODOS los usuarios 

      const supabaseAdmin = createServiceClient( 

        process.env.NEXT_PUBLIC_SUPABASE_URL!, 

        process.env.SUPABASE_SERVICE_ROLE_KEY! 

      ); 

   

      const { data: usuarios, error } = await supabaseAdmin

        .from("usuarios_perfil")

        .select("id, nombre_completo, rol, activo, created_at, updated_at")

        .order("created_at", { ascending: false }); 

   

      if (error) { 

        console.error("Error al listar usuarios:", error); 

        return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 }); 

      } 

   

      // 4. Obtener emails de auth.users 

      const { data: authData } = await supabaseAdmin.auth.admin.listUsers(); 

   

      // 5. Combinar perfil + email 

      const usuariosConEmail = usuarios?.map((u) => { 

        const authUser = authData?.users?.find((au) => au.id === u.id); 

        return { 

          ...u, 

          email: authUser?.email || "Sin email", 

        }; 

      }); 

   

      return NextResponse.json({ usuarios: usuariosConEmail }); 

    } catch (err) { 

      console.error("Error inesperado:", err); 

      return NextResponse.json( 

        { error: "Error interno del servidor" }, 

        { status: 500 } 

      ); 

    } 

  } 