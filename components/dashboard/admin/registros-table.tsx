"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Eye } from "lucide-react";

interface Registro {
  registro_id: string;
  fecha_vacunacion: string;
  paciente_id: string;
  vacuna_id: string;
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

export default function RegistrosTable() {
  const supabase = createClient();
  const [datos, setDatos] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("registro_vacunacion")
        .select(`
          registro_id,
          fecha_vacunacion,
          paciente_id,
          vacuna_id,
          numero_dosis,
          lote_vacuna,
          paciente:paciente_id(nombres, primer_apellido),
          vacuna:vacuna_id(vacuna_nombre)
        `)
        .order("fecha_vacunacion", { ascending: false });

      if (error) throw error;
      setDatos(data as any || []);
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const filtrados = datos.filter(d => 
    d.paciente?.nombres.toLowerCase().includes(busqueda.toLowerCase()) || 
    d.paciente?.primer_apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.vacuna?.vacuna_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.lote_vacuna.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por paciente, vacuna o lote..." 
            className="pl-9" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={cargarDatos}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Vacuna</TableHead>
              <TableHead>Dosis</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Cargando registros...</TableCell></TableRow>
            ) : filtrados.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No se encontraron aplicaciones.</TableCell></TableRow>
            ) : (
              filtrados.map((d) => (
                <TableRow key={d.registro_id}>
                  <TableCell className="text-sm">
                    {new Date(d.fecha_vacunacion).toLocaleDateString("es-BO")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {d.paciente?.nombres} {d.paciente?.primer_apellido}
                  </TableCell>
                  <TableCell>{d.vacuna?.vacuna_nombre}</TableCell>
                  <TableCell><Badge variant="outline"># {d.numero_dosis}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{d.lote_vacuna}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> Detalles
                    </Button>
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
