"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, History, Syringe } from "lucide-react";

interface Registro {
  registro_id: string;
  fecha_vacunacion: string;
  paciente_id: string;
  numero_dosis: number;
  lote_vacuna: string;
  paciente: {
    nombres: string;
    primer_apellido: string;
  };
  vacuna: {
    vacuna_nombre: string;
  };
}

export default function HistorialTable() {
  const supabase = createClient();
  const [datos, setDatos] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/vacunacion");
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Error al cargar historial");
      
      setDatos(result.registros || []);
    } catch (error: any) {
      toast.error("Error al cargar historial: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Has registrado <b>{datos.length}</b> dosis en total.
        </p>
        <Button variant="outline" size="sm" onClick={cargarDatos}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refrescar
        </Button>
      </div>

      <div className="rounded-xl border bg-card/50 backdrop-blur shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow>
              <TableHead>Fecha / Hora</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Vacuna</TableHead>
              <TableHead>Dosis</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12">Cargando tu historial...</TableCell></TableRow>
            ) : datos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                   <div className="flex flex-col items-center gap-2">
                      <History className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Aún no has registrado ninguna aplicación.</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              datos.map((d) => (
                <TableRow key={d.registro_id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-xs">
                    {new Date(d.fecha_vacunacion).toLocaleString("es-BO")}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {d.paciente?.nombres} {d.paciente?.primer_apellido}
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <Syringe className="h-3 w-3 text-accent" />
                        {d.vacuna?.vacuna_nombre}
                     </div>
                  </TableCell>
                  <TableCell>
                     <Badge variant="secondary" className="font-mono">#{d.numero_dosis}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{d.lote_vacuna}</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-green-500/10 text-green-600 border-green-200">Completado</Badge>
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
