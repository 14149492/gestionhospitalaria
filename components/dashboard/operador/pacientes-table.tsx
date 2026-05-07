"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Paciente {
  documento_identidad: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  genero: string;
  fecha_nacimiento: string;
  municipio_residencia: string;
}

export default function PacientesTable() {
  const supabase = createClient();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const cargarPacientes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pacientes");
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Error al cargar pacientes");
      
      setPacientes(result.pacientes || []);
    } catch (error: any) {
      toast.error("Error al cargar pacientes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPacientes();

    // Escuchar evento de nuevo paciente registrado para actualizar la tabla
    const handleRefresh = () => cargarPacientes();
    window.addEventListener('paciente-registrado', handleRefresh);
    return () => window.removeEventListener('paciente-registrado', handleRefresh);
  }, []);

  const pacientesFiltrados = pacientes.filter(p => {
    const nombreCompleto = `${p.nombres} ${p.primer_apellido} ${p.segundo_apellido || ""}`.toLowerCase();
    const documento = p.documento_identidad.toLowerCase();
    const query = busqueda.toLowerCase();
    return nombreCompleto.includes(query) || documento.includes(query);
  });

  return (
    <Card className="glass-card border-none shadow-xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-primary">Pacientes Registrados</CardTitle>
            <CardDescription>Lista de personas dadas de alta en el sistema PAI.</CardDescription>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre o CI..." 
                className="pl-9 bg-muted/30 border-none h-10" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={cargarPacientes} className="h-10 w-10">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Documento (CI)</TableHead>
                <TableHead className="font-bold">Nombre Completo</TableHead>
                <TableHead className="font-bold text-center">Género</TableHead>
                <TableHead className="font-bold">Fecha Nacimiento</TableHead>
                <TableHead className="font-bold">Municipio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground font-medium">Cargando pacientes...</TableCell></TableRow>
              ) : pacientesFiltrados.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground font-medium">No se encontraron pacientes registrados.</TableCell></TableRow>
              ) : (
                pacientesFiltrados.map((p) => (
                  <TableRow key={p.documento_identidad} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-mono font-bold text-primary">{p.documento_identidad}</TableCell>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <User className="size-4" />
                        </div>
                        <span>{p.nombres} {p.primer_apellido} {p.segundo_apellido}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={p.genero === "M" ? "default" : "secondary"} className="rounded-full px-3">
                        {p.genero === "M" ? "M" : "F"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5" />
                        {new Date(p.fecha_nacimiento).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{p.municipio_residencia || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
