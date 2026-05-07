"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, UserCheck, UserX, RefreshCw, Search } from "lucide-react";

interface Usuario {
  id: string;
  nombre_completo: string;
  email: string;
  rol: "admin" | "operador" | "consulta" | string;
  activo: boolean;
  establecimiento_id: string | null;
  created_at: string;
}

export default function UsuariosTable() {
  const supabase = createClient();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/usuarios");
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Error al cargar usuarios");
      
      setUsuarios(result.usuarios || []);
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const toggleActivo = async (id: string, estadoActual: boolean) => {
    try {
      const response = await fetch(`/api/admin/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !estadoActual }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Error al actualizar");

      toast.success(estadoActual ? "Personal desactivado" : "Personal activado");
      cargarUsuarios();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const cambiarRol = async (id: string, nuevoRol: string) => {
    try {
      const response = await fetch(`/api/admin/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Error al actualizar");

      toast.success("Rol actualizado correctamente");
      cargarUsuarios();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const matchesSearch = u.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) || 
                         u.email.toLowerCase().includes(busqueda.toLowerCase());
    const matchesRol = filtroRol === "todos" || u.rol === filtroRol;
    return matchesSearch && matchesRol;
  });

  const getRolBadge = (rol: string) => {
    switch (rol) {
      case "admin": return <Badge className="bg-red-500">Admin PAI</Badge>;
      case "operador": return <Badge className="bg-blue-500">Operador Salud</Badge>;
      case "consulta": return <Badge variant="outline">Consulta</Badge>;
      default: return <Badge variant="secondary">{rol}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre o correo..." 
            className="pl-9" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={filtroRol} onValueChange={setFiltroRol}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
              <SelectItem value="operador">Operadores</SelectItem>
              <SelectItem value="consulta">Consulta</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={cargarUsuarios}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol Asignado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">Cargando personal...</TableCell></TableRow>
            ) : usuariosFiltrados.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">No se encontró personal registrado.</TableCell></TableRow>
            ) : (
              usuariosFiltrados.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nombre_completo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{getRolBadge(u.rol)}</TableCell>
                  <TableCell>
                    <Badge variant={u.activo ? "default" : "destructive"}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Select onValueChange={(v) => cambiarRol(u.id, v)} value={u.rol}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <Shield className="mr-1 h-3 w-3" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin PAI</SelectItem>
                          <SelectItem value="operador">Operador</SelectItem>
                          <SelectItem value="consulta">Consulta</SelectItem>
                        </SelectContent>
                      </Select>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant={u.activo ? "destructive" : "default"} size="sm" className="h-8">
                            {u.activo ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{u.activo ? "¿Desactivar personal?" : "¿Activar personal?"}</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción cambiará el acceso de <b>{u.nombre_completo}</b> al sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => toggleActivo(u.id, u.activo)}>Confirmar</AlertDialogAction>
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