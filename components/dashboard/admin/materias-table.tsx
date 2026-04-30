"use client"; 

   

  import { useEffect, useState } from "react"; 

  import { toast } from "sonner"; 

   

  // Componentes shadcn/ui 

  import { 

    Table, TableBody, TableCell, TableHead, 

    TableHeader, TableRow, 

  } from "@/components/ui/table"; 

  import { Badge } from "@/components/ui/badge"; 

  import { Button } from "@/components/ui/button"; 

  import { 

    Select, SelectContent, SelectItem, 

    SelectTrigger, SelectValue, 

  } from "@/components/ui/select"; 

  import { 

    Dialog, DialogContent, DialogDescription, 

    DialogFooter, DialogHeader, DialogTitle, 

    DialogTrigger, 

  } from "@/components/ui/dialog"; 

  import { 

    AlertDialog, AlertDialogAction, AlertDialogCancel, 

    AlertDialogContent, AlertDialogDescription, 

    AlertDialogFooter, AlertDialogHeader, 

    AlertDialogTitle, AlertDialogTrigger, 

  } from "@/components/ui/alert-dialog"; 

  import { Input } from "@/components/ui/input"; 

  import { Label } from "@/components/ui/label"; 

   

  // Iconos 

  import { Plus, RefreshCw, Pencil, Trash2 } from "lucide-react"; 

   

  // Tipos 

  interface Docente {
    id: string;
    nombre_completo: string;
  }

   

  interface Materia { 

    id: string; 

    codigo: string; 

    nombre: string; 

    creditos: number; 

    semestre: string; 

    docente_id: string | null; 

    created_at: string; 

    docente: Docente | null; 

  } 

  // Estado inicial del formulario 

  const formInicial = { 

    codigo: "", 

    nombre: "", 

    creditos: 4, 

    semestre: "", 

    docente_id: "", 

  }; 

   

  export default function MateriasTable() { 

    // Estados de datos 

    const [materias, setMaterias] = useState<Materia[]>([]); 

    const [docentes, setDocentes] = useState<Docente[]>([]); 

    const [loading, setLoading] = useState(true); 

   

    // Filtro 

    const [filtroSemestre, setFiltroSemestre] = useState<string>("todos"); 

   

    // Dialog crear/editar 

    const [dialogOpen, setDialogOpen] = useState(false); 

    const [guardando, setGuardando] = useState(false); 

    const [formData, setFormData] = useState(formInicial); 

   

    // NUEVO: materia en edición (null = modo crear) 

    const [materiaEditando, setMateriaEditando] = useState<Materia | null>(null); 

   

    // Funciones de carga (sin cambios) 

    const cargarMaterias = async () => { 

      setLoading(true); 

      try { 

        const res = await fetch("/api/admin/materias"); 

        const data = await res.json(); 

        if (!res.ok) { 

          toast.error(data.error || "Error al cargar materias"); 

          return; 

        } 

        setMaterias(data.materias); 

      } catch { 

        toast.error("Error de conexión"); 

      } finally { 

        setLoading(false); 

      } 

    }; 

   


    useEffect(() => {
      Promise.all([
        fetch("/api/admin/materias").then((r) => r.json().then((d) => ({ r, d }))),
        fetch("/api/admin/docentes").then((r) => r.json().then((d) => ({ r, d }))),
      ])
        .then(([mat, doc]) => {
          if (mat.r.ok) setMaterias(mat.d.materias);
          else toast.error(mat.d.error || "Error al cargar materias");
          if (doc.r.ok) setDocentes(doc.d.docentes);
        })
        .catch(() => toast.error("Error de conexión"))
        .finally(() => setLoading(false));
    }, []);

   

    const semestres = [...new Set(materias.map((m) => m.semestre))].sort(); 

    const materiasFiltradas = materias.filter( 

      (m) => filtroSemestre === "todos" || m.semestre === filtroSemestre 

    ); 

     // Abrir Dialog en modo CREAR 

    const abrirCrear = () => { 

      setMateriaEditando(null); 

      setFormData(formInicial); 

      setDialogOpen(true); 

    }; 

   

    // Abrir Dialog en modo EDITAR 

    const abrirEditar = (materia: Materia) => { 

      setMateriaEditando(materia); 

      setFormData({ 

        codigo: materia.codigo, 

        nombre: materia.nombre, 

        creditos: materia.creditos, 

        semestre: materia.semestre, 

        docente_id: materia.docente_id || "", 

      }); 

      setDialogOpen(true); 

    }; 

   

    // Guardar materia (POST o PUT según el modo) 

    const guardarMateria = async () => { 

      setGuardando(true); 

      try { 

        const esEdicion = materiaEditando !== null; 

        const url = esEdicion 

          ? `/api/admin/materias/${materiaEditando.id}` 

          : "/api/admin/materias"; 

        const method = esEdicion ? "PUT" : "POST"; 

   

        const res = await fetch(url, { 

          method, 

          headers: { "Content-Type": "application/json" }, 

          body: JSON.stringify({ 

            ...formData, 

            creditos: Number(formData.creditos), 

            docente_id: formData.docente_id || null, 

          }), 

        }); 

   

        const data = await res.json(); 

   

        if (!res.ok) { 

          if (data.errores) { 

            data.errores.forEach( 

              (e: { campo: string; mensaje: string }) => 

                toast.error(`${e.campo}: ${e.mensaje}`) 

            ); 

          } else { 

            toast.error(data.error || "Error al guardar materia"); 

          } 

          return; 

        } 

   

        toast.success( 

          esEdicion 

            ? `Materia "${data.materia.codigo}" actualizada` 

            : `Materia "${data.materia.codigo}" creada` 

        ); 

        setDialogOpen(false); 

        setFormData(formInicial); 

        setMateriaEditando(null); 

        cargarMaterias(); 

      } catch { 

        toast.error("Error de conexión"); 

      } finally { 

        setGuardando(false); 

      } 

    }; 
 // Eliminar materia 

    const eliminarMateria = async (materia: Materia) => { 

      try { 

        const res = await fetch(`/api/admin/materias/${materia.id}`, { 

          method: "DELETE", 

        }); 

   

        const data = await res.json(); 

   

        if (!res.ok) { 

          toast.error(data.error || "Error al eliminar materia"); 

          return; 

        } 

   

        toast.success(`Materia "${materia.codigo}" eliminada`); 

        cargarMaterias(); 

      } catch { 

        toast.error("Error de conexión"); 

      } 

    }; 
 return ( 

      <div className="space-y-4"> 

        {/* ===== BARRA SUPERIOR ===== */} 

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

   

          <Button variant="outline" size="sm" onClick={cargarMaterias}> 

            <RefreshCw className="mr-2 h-4 w-4" /> Refrescar 

          </Button> 

   

          <span className="text-sm text-muted-foreground"> 

            {materiasFiltradas.length} materia(s) 

          </span> 

   

          <div className="ml-auto"> 

            <Button onClick={abrirCrear}> 

              <Plus className="mr-2 h-4 w-4" /> Nueva Materia 

            </Button> 

          </div> 

        </div> 

   

        {/* ===== DIALOG CREAR/EDITAR ===== */} 

        <Dialog open={dialogOpen} onOpenChange={(open) => { 

          setDialogOpen(open); 

          if (!open) { 

            setMateriaEditando(null); 

            setFormData(formInicial); 

          } 

        }}> 

          <DialogContent className="sm:max-w-[500px]"> 

            <DialogHeader> 

              <DialogTitle> 

                {materiaEditando ? "Editar Materia" : "Crear Nueva Materia"} 

              </DialogTitle> 

              <DialogDescription> 

                {materiaEditando 

                  ? `Editando: ${materiaEditando.codigo} - ${materiaEditando.nombre}` 

                  : "Completa los datos de la materia. El código debe ser único."} 

              </DialogDescription> 

            </DialogHeader> 

   

            <div className="grid gap-4 py-4"> 

              {/* Código */} 

              <div className="grid gap-2"> 

                <Label htmlFor="codigo">Código</Label> 

                <Input 

                  id="codigo" 

                  placeholder="MAT-101" 

                  value={formData.codigo} 

                  onChange={(e) => 

                    setFormData({ ...formData, codigo: e.target.value.toUpperCase() }) 

                  } 

                /> 

              </div> 

   

              {/* Nombre */} 

              <div className="grid gap-2"> 

                <Label htmlFor="nombre">Nombre</Label> 

                <Input 

                  id="nombre" 

                  placeholder="Cálculo Diferencial" 

                  value={formData.nombre} 

                  onChange={(e) => 

                    setFormData({ ...formData, nombre: e.target.value }) 

                  } 

                /> 

              </div> 

   

              {/* Créditos y Semestre */} 

              <div className="grid grid-cols-2 gap-4"> 

                <div className="grid gap-2"> 

                  <Label htmlFor="creditos">Créditos</Label> 

                  <Input 

                    id="creditos" type="number" min={1} max={10} 

                    value={formData.creditos} 

                    onChange={(e) => 

                      setFormData({ ...formData, creditos: parseInt(e.target.value) || 1 }) 

                    } 

                  /> 

                </div> 

                <div className="grid gap-2"> 

                  <Label htmlFor="semestre">Semestre</Label> 

                  <Input 

                    id="semestre" placeholder="2026-1" 

                    value={formData.semestre} 

                    onChange={(e) => 

                      setFormData({ ...formData, semestre: e.target.value }) 

                    } 

                  /> 

                </div> 

              </div> 

   

              {/* Docente */} 

              <div className="grid gap-2"> 

                <Label>Docente (opcional)</Label> 

                <Select 

                  value={formData.docente_id || "sin-asignar"} 

                  onValueChange={(v) => 

                    setFormData({ ...formData, docente_id: v === "sin-asignar" ? "" : v }) 

                  } 

                > 

                  <SelectTrigger> 

                    <SelectValue placeholder="Seleccionar docente" /> 

                  </SelectTrigger> 

                  <SelectContent> 

                    <SelectItem value="sin-asignar">Sin asignar</SelectItem> 

                    {docentes.map((d) => ( 

                      <SelectItem key={d.id} value={d.id}>
                        {d.nombre_completo}
                      </SelectItem> 

                    ))} 

                  </SelectContent> 

                </Select> 

              </div> 

            </div> 

   

            <DialogFooter> 

              <Button variant="outline" onClick={() => setDialogOpen(false)}> 

                Cancelar 

              </Button> 

              <Button onClick={guardarMateria} disabled={guardando}> 

                {guardando 

                  ? "Guardando..." 

                  : materiaEditando ? "Guardar Cambios" : "Crear Materia"} 

              </Button> 

            </DialogFooter> 

          </DialogContent> 

        </Dialog> 
    {/* ===== TABLA ===== */} 

        <div className="rounded-md border"> 

          <Table> 

            <TableHeader> 

              <TableRow> 

                <TableHead>Código</TableHead> 

                <TableHead>Nombre</TableHead> 

                <TableHead>Créditos</TableHead> 

                <TableHead>Semestre</TableHead> 

                <TableHead>Docente</TableHead> 

                <TableHead className="text-right">Acciones</TableHead> 

              </TableRow> 

            </TableHeader> 

            <TableBody> 

              {loading ? ( 

                <TableRow> 

                  <TableCell colSpan={6} className="text-center py-8"> 

                    Cargando materias... 

                  </TableCell> 

                </TableRow> 

              ) : materiasFiltradas.length === 0 ? ( 

                <TableRow> 

                  <TableCell colSpan={6} className="text-center py-8"> 

                    No se encontraron materias 

                  </TableCell> 

                </TableRow> 

              ) : ( 

                materiasFiltradas.map((m) => ( 

                  <TableRow key={m.id}> 

                    <TableCell className="font-mono font-medium"> 

                      {m.codigo} 

                    </TableCell> 

                    <TableCell>{m.nombre}</TableCell> 

                    <TableCell> 

                      <Badge variant="secondary">{m.creditos}</Badge> 

                    </TableCell> 

                    <TableCell> 

                      <Badge variant="outline">{m.semestre}</Badge> 

                    </TableCell> 

                    <TableCell> 

                      {m.docente
                        ? m.docente.nombre_completo
                        : <span className="text-muted-foreground italic">Sin asignar</span>
                      } 

                    </TableCell> 

   

                    {/* NUEVA: Columna de acciones */} 

                    <TableCell className="text-right"> 

                      <div className="flex justify-end gap-2"> 

   

                        {/* Botón Editar */} 

                        <Button 

                          variant="ghost" 

                          size="sm" 

                          onClick={() => abrirEditar(m)} 

                        > 

                          <Pencil className="h-4 w-4" /> 

                        </Button> 

   

                        {/* Botón Eliminar con confirmación */} 

                        <AlertDialog> 

                          <AlertDialogTrigger asChild> 

                            <Button 

                              variant="ghost" 

                              size="sm" 

                              className="text-destructive hover:text-destructive" 

                            > 

                              <Trash2 className="h-4 w-4" /> 

                            </Button> 

                          </AlertDialogTrigger> 

                          <AlertDialogContent> 

                            <AlertDialogHeader> 

                              <AlertDialogTitle> 

                                ¿Eliminar materia? 

                              </AlertDialogTitle> 

                              <AlertDialogDescription> 

                                Estás a punto de eliminar la materia{" "} 

                                <strong>{m.codigo} - {m.nombre}</strong>. 

                                Esta acción no se puede deshacer. 

                              </AlertDialogDescription> 

                            </AlertDialogHeader> 

                            <AlertDialogFooter> 

                              <AlertDialogCancel> 

                                Cancelar 

                              </AlertDialogCancel> 

                              <AlertDialogAction 

                                onClick={() => eliminarMateria(m)} 

                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 

                              > 

                                Eliminar 

                              </AlertDialogAction> 

                            </AlertDialogFooter> 

                          </AlertDialogContent> 

                        </AlertDialog> 

   

                      </div> 

                    </TableCell> 

                  </TableRow> 

                )) 

              )} 

            </TableBody> 

          </Table> 

        </div> 

      </div> 

    ); 

  }       

