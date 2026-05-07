"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, RefreshCw, Pencil, Trash2, Search, MapPin } from "lucide-react";

interface Establecimiento {
  establecimiento_id: string;
  nombre_establecimiento: string;
  municipio_id: string;
  tipo_establecimiento: string;
  nivel_atencion: string;
}

export default function EstablecimientosTable() {
  const supabase = createClient();
  const [datos, setDatos] = useState<Establecimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Establecimiento | null>(null);
  
  const [formData, setFormData] = useState({
    establecimiento_id: "",
    nombre_establecimiento: "",
    municipio_id: "",
    tipo_establecimiento: "Centro de Salud",
    nivel_atencion: "Primer Nivel"
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("establecimiento").select("*").order("nombre_establecimiento");
      if (error) throw error;
      setDatos(data || []);
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from("establecimiento").upsert([formData]);
      if (error) throw error;
      toast.success(editando ? "Establecimiento actualizado" : "Establecimiento creado");
      setDialogOpen(false);
      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const eliminar = async (id: string) => {
    try {
      const { error } = await supabase.from("establecimiento").delete().eq("establecimiento_id", id);
      if (error) throw error;
      toast.success("Eliminado correctamente");
      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filtrados = datos.filter(d => 
    d.nombre_establecimiento.toLowerCase().includes(busqueda.toLowerCase()) || 
    d.establecimiento_id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar establecimiento..." 
            className="pl-9" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={cargarDatos}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => { setEditando(null); setFormData({ establecimiento_id: "", nombre_establecimiento: "", municipio_id: "", tipo_establecimiento: "Centro de Salud", nivel_atencion: "Primer Nivel" }); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Establecimiento" : "Nuevo Establecimiento"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>ID / Código</Label>
              <Input value={formData.establecimiento_id} onChange={e => setFormData({...formData, establecimiento_id: e.target.value})} disabled={!!editando} placeholder="Ej: EST-01" />
            </div>
            <div className="grid gap-2">
              <Label>Nombre del Establecimiento</Label>
              <Input value={formData.nombre_establecimiento} onChange={e => setFormData({...formData, nombre_establecimiento: e.target.value})} placeholder="Ej: Hospital de Clínicas" />
            </div>
            <div className="grid gap-2">
              <Label>ID Municipio</Label>
              <Input value={formData.municipio_id} onChange={e => setFormData({...formData, municipio_id: e.target.value})} placeholder="Ej: MUN-01" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Cargando datos...</TableCell></TableRow>
            ) : filtrados.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">No se encontraron establecimientos.</TableCell></TableRow>
            ) : (
              filtrados.map((d) => (
                <TableRow key={d.establecimiento_id}>
                  <TableCell className="font-mono text-xs">{d.establecimiento_id}</TableCell>
                  <TableCell className="font-medium">{d.nombre_establecimiento}</TableCell>
                  <TableCell>{d.tipo_establecimiento}</TableCell>
                  <TableCell><Badge variant="secondary">{d.nivel_atencion}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditando(d); setFormData(d); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => eliminar(d.establecimiento_id)}><Trash2 className="h-4 w-4" /></Button>
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
