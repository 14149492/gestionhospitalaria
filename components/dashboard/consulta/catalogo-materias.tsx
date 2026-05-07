 "use client"; 

   

  import { useEffect, useState } from "react"; 

  import { toast } from "sonner"; 

  import { Button } from "@/components/ui/button"; 

  import { 

    Select, SelectContent, SelectItem, 

    SelectTrigger, SelectValue, 

  } from "@/components/ui/select"; 

  import { RefreshCw, ClipboardPlus, CheckCircle2, XCircle } from "lucide-react"; 

  import MateriaCard from "@/components/dashboard/materia-card"; 

   

  interface Docente { nombre_completo: string; }

   

  interface Materia { 

    id: string; 

    codigo: string; 

    nombre: string; 

    creditos: number; 

    semestre: string; 

    docente: Docente | null; 

  } 

   

  interface Inscripcion { 

    id: string; 

    estado: "inscrito" | "retirado"; 

    materia: { id: string }; 

  } 

   

  export default function CatalogoMaterias() { 

    const [materias, setMaterias] = useState<Materia[]>([]); 

    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]); 

    const [loading, setLoading] = useState(true); 

    const [filtroSemestre, setFiltroSemestre] = useState<string>("todos"); 

    const [inscribiendo, setInscribiendo] = useState<string | null>(null); 

  // Cargar materias e inscripciones en paralelo 

    const cargarDatos = async () => { 

      setLoading(true); 

      try { 

        const [resMaterias, resInsc] = await Promise.all([ 

          fetch("/api/estudiante/materias"), 

          fetch("/api/estudiante/inscripciones"), 

        ]); 

   

        const dataMaterias = await resMaterias.json(); 

        const dataInsc = await resInsc.json(); 

   

        if (resMaterias.ok) setMaterias(dataMaterias.materias); 

        if (resInsc.ok) setInscripciones(dataInsc.inscripciones); 

      } catch { 

        toast.error("Error de conexión"); 

      } finally { 

        setLoading(false); 

      } 

    }; 

   

    useEffect(() => { cargarDatos(); }, []); 

   

    // Verificar estado de inscripción de una materia 

    const getEstadoInscripcion = (materiaId: string) => { 

      const insc = inscripciones.find( 

        (i) => i.materia?.id === materiaId 

      ); 

      if (!insc) return "no-inscrito"; 

      return insc.estado; // "inscrito" o "retirado" 

    }; 

   

    // Inscribirse a una materia 

    const inscribirse = async (materiaId: string) => { 

      setInscribiendo(materiaId); 

      try { 

        const res = await fetch("/api/estudiante/inscripciones", { 

          method: "POST", 

          headers: { "Content-Type": "application/json" }, 

          body: JSON.stringify({ materia_id: materiaId }), 

        }); 

   

        const data = await res.json(); 

   

        if (!res.ok) { 

          toast.error(data.error || "Error al inscribirse"); 

          return; 

        } 

   

        toast.success( 

          `Inscrito en ${data.inscripcion.materia.codigo} - ${data.inscripcion.materia.nombre}` 

        ); 

   

        // Actualizar inscripciones localmente (optimista) 

        setInscripciones((prev) => [...prev, data.inscripcion]); 

      } catch { 

        toast.error("Error de conexión"); 

      } finally { 

        setInscribiendo(null); 

      } 

    }; 

   

    const semestres = [...new Set(materias.map((m) => m.semestre))].sort(); 

    const materiasFiltradas = materias.filter( 

      (m) => filtroSemestre === "todos" || m.semestre === filtroSemestre 

    ); 

     // Función que genera el botón según el estado 

    const renderBotonInscripcion = (materia: Materia) => { 

      const estado = getEstadoInscripcion(materia.id); 

   

      if (estado === "inscrito") { 

        return ( 

          <Button variant="outline" size="sm" className="w-full" disabled> 

            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> 

            Inscrito 

          </Button> 

        ); 

      } 

   

      if (estado === "retirado") { 

        return ( 

          <Button variant="outline" size="sm" className="w-full" disabled> 

            <XCircle className="mr-2 h-4 w-4 text-red-500" /> 

            Retirado 

          </Button> 

        ); 

      } 

   

      return ( 

        <Button 

          size="sm" 

          className="w-full" 

          disabled={inscribiendo === materia.id} 

          onClick={() => inscribirse(materia.id)} 

        > 

          <ClipboardPlus className="mr-2 h-4 w-4" /> 

          {inscribiendo === materia.id ? "Inscribiendo..." : "Inscribirme"} 

        </Button> 

      ); 

    }; 

   

    if (loading) { 

      return ( 

        <div className="flex items-center justify-center py-12"> 

          <p className="text-muted-foreground">Cargando catálogo...</p> 

        </div> 

      ); 

    } 

   

    return ( 

      <div className="space-y-4"> 

        {/* Barra de filtros */} 

        <div className="flex items-center gap-4"> 

          <Select value={filtroSemestre} onValueChange={setFiltroSemestre}> 

            <SelectTrigger className="w-[200px]"> 

              <SelectValue placeholder="Filtrar por semestre" /> 

            </SelectTrigger> 

            <SelectContent> 

              <SelectItem value="todos">Todos los semestres</SelectItem> 

              {semestres.map((s) => ( 

                <SelectItem key={s} value={s}>{s}</SelectItem> 

              ))} 

            </SelectContent> 

          </Select> 

   

          <Button variant="outline" size="sm" onClick={cargarDatos}> 

            <RefreshCw className="mr-2 h-4 w-4" /> Refrescar 

          </Button> 

   

          <span className="text-sm text-muted-foreground ml-auto"> 

            {materiasFiltradas.length} materia(s) |{" "} 

            {inscripciones.filter((i) => i.estado === "inscrito").length} inscrita(s) 

          </span> 

        </div> 

   

        {/* Grid de cards */} 

        {materiasFiltradas.length === 0 ? ( 

          <div className="flex items-center justify-center py-12"> 

            <p className="text-muted-foreground">No se encontraron materias</p> 

          </div> 

        ) : ( 

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 

            {materiasFiltradas.map((m) => ( 

              <MateriaCard 

                key={m.id} 

                materia={m} 

                mostrarDocente={true} 

                accion={renderBotonInscripcion(m)} 

              /> 

            ))} 

          </div> 

        )} 

      </div> 

    ); 

  } 

  