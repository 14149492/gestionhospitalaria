"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, RefreshCw, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Vacuna {
  vacuna_id: string;
  vacuna_nombre: string;
  enfermedad_previene: string;
  grupo_pai: string;
  numero_dosis: number;
  via_administracion: string;
}

export default function VacunasTable() {
  const supabase = createClient();
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [vacunaEditando, setVacunaEditando] = useState<Vacuna | null>(null);
  
  const [formData, setFormData] = useState({
    vacuna_id: "",
    vacuna_nombre: "",
    enfermedad_previene: "",
    grupo_pai: "Esquema Regular",
    numero_dosis: 1,
    via_administracion: "Intramuscular"
  });

  const cargarVacunas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("vacuna").select("*").order("vacuna_id");
      if (error) throw error;
      setVacunas(data || []);
    } catch (error: any) {
      toast.error("Error al cargar vacunas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVacunas();
  }, []);

  const abrirCrear = () => {
    setVacunaEditando(null);
    setFormData({
      vacuna_id: "",
      vacuna_nombre: "",
      enfermedad_previene: "",
      grupo_pai: "Esquema Regular",
      numero_dosis: 1,
      via_administracion: "Intramuscular"
    });
    setDialogOpen(true);
  };

  const abrirEditar = (v: Vacuna) => {
    setVacunaEditando(v);
    setFormData({ ...v });
    setDialogOpen(true);
  };

  const guardarVacuna = async () => {
    setGuardando(true);
    try {
      const { error } = await supabase
        .from("vacuna")
        .upsert([formData]);

      if (error) throw error;

      toast.success(vacunaEditando ? "Vacuna actualizada" : "Vacuna creada");
      setDialogOpen(false);
      cargarVacunas();
    } catch (error: any) {
      toast.error("Error al guardar: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarVacuna = async (id: string) => {
    try {
      const { error } = await supabase.from("vacuna").delete().eq("vacuna_id", id);
      if (error) throw error;
      toast.success("Vacuna eliminada");
      cargarVacunas();
    } catch (error: any) {
      toast.error("Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={cargarVacunas}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refrescar
        </Button>
        <div className="ml-auto">
          <Button onClick={abrirCrear} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Nueva Vacuna
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{vacunaEditando ? "Editar Vacuna" : "Añadir Nueva Vacuna"}</DialogTitle>
            <DialogDescription>Complete los detalles técnicos del biológico.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vacuna_id">ID / Código</Label>
              <Input id="vacuna_id" value={formData.vacuna_id} onChange={e => setFormData({...formData, vacuna_id: e.target.value})} disabled={!!vacunaEditando} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vacuna_nombre">Nombre de la Vacuna</Label>
              <Input id="vacuna_nombre" value={formData.vacuna_nombre} onChange={e => setFormData({...formData, vacuna_nombre: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="enfermedad_previene">Enfermedad que Previene</Label>
              <Input id="enfermedad_previene" value={formData.enfermedad_previene} onChange={e => setFormData({...formData, enfermedad_previene: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numero_dosis">Número de Dosis</Label>
                <Input id="numero_dosis" type="number" value={formData.numero_dosis} onChange={e => setFormData({...formData, numero_dosis: parseInt(e.target.value)})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="via_administracion">Vía de Adm.</Label>
                <Input id="via_administracion" value={formData.via_administracion} onChange={e => setFormData({...formData, via_administracion: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={guardarVacuna} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Vacuna"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Código</TableHead>
              <TableHead>Vacuna</TableHead>
              <TableHead>Previene</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Dosis</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Cargando catálogo...</TableCell></TableRow>
            ) : vacunas.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No hay vacunas registradas</TableCell></TableRow>
            ) : (
              vacunas.map((v) => (
                <TableRow key={v.vacuna_id}>
                  <TableCell className="font-mono text-xs font-bold">{v.vacuna_id}</TableCell>
                  <TableCell className="font-medium text-primary">{v.vacuna_nombre}</TableCell>
                  <TableCell>{v.enfermedad_previene}</TableCell>
                  <TableCell><Badge variant="outline">{v.grupo_pai}</Badge></TableCell>
                  <TableCell><Badge variant="secondary">{v.numero_dosis}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => abrirEditar(v)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => eliminarVacuna(v.vacuna_id)}><Trash2 className="h-4 w-4" /></Button>
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
