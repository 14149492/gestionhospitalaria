"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function RegistrarVacunacionForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [establecimientos, setEstablecimientos] = useState<any[]>([]);
  const [lotesSugeridos, setLotesSugeridos] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    paciente_id: "",
    vacuna_id: "",
    establecimiento_id: "",
    fecha_vacunacion: new Date().toISOString().split('T')[0],
    numero_dosis: 1,
    lote_vacuna: "",
    temperatura_conservacion: 4.0,
    origen_datos: "Santa Cruz",
    observaciones: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar pacientes y vacunas
        const { data: p } = await supabase.from("paciente").select("paciente_id, nombres, primer_apellido");
        const { data: v } = await supabase.from("vacuna").select("vacuna_id, vacuna_nombre");
        if (p) setPacientes(p);
        if (v) setVacunas(v);

        // Cargar establecimientos desde nuestra API segura
        const resEst = await fetch("/api/establecimientos");
        const dataEst = await resEst.json();
        if (dataEst.establecimientos) setEstablecimientos(dataEst.establecimientos);

        // Cargar lotes sugeridos
        const resLotes = await fetch("/api/lotes");
        const dataLotes = await resLotes.json();
        if (dataLotes.lotes) setLotesSugeridos(dataLotes.lotes);

        // Cargar perfil del operador para pre-seleccionar su establecimiento
        const resPerfil = await fetch("/api/auth/perfil");
        const dataPerfil = await resPerfil.json();
        if (dataPerfil.perfil?.establecimiento_id) {
          setFormData(prev => ({ ...prev, establecimiento_id: dataPerfil.perfil.establecimiento_id }));
        }
      } catch (err) {
        console.error("Error cargando datos para el formulario:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "numero_dosis" || name === "temperatura_conservacion" ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/vacunacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          registro_id: `REG-${Date.now()}`,
          fecha_vacunacion: new Date(formData.fecha_vacunacion).toISOString()
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Error al registrar");

      toast.success("Vacunación registrada correctamente");
      setFormData({
        ...formData,
        paciente_id: "",
        lote_vacuna: "",
        observaciones: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Error al registrar vacunación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-md border-accent/10">
      <CardHeader className="bg-accent/5">
        <CardTitle className="text-xl text-primary">Nueva Aplicación de Dosis</CardTitle>
        <CardDescription>Registre los detalles técnicos de la dosis administrada.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paciente_id">Paciente</Label>
              <select 
                id="paciente_id" 
                name="paciente_id" 
                value={formData.paciente_id} 
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar paciente...</option>
                {pacientes.map(p => (
                  <option key={p.paciente_id} value={p.paciente_id}>
                    {p.nombres} {p.primer_apellido} ({p.paciente_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vacuna_id">Vacuna</Label>
              <select 
                id="vacuna_id" 
                name="vacuna_id" 
                value={formData.vacuna_id} 
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar vacuna...</option>
                {vacunas.map(v => (
                  <option key={v.vacuna_id} value={v.vacuna_id}>{v.vacuna_nombre}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_vacunacion">Fecha de Aplicación</Label>
              <Input id="fecha_vacunacion" name="fecha_vacunacion" type="date" value={formData.fecha_vacunacion} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_dosis">Número de Dosis</Label>
              <Input id="numero_dosis" name="numero_dosis" type="number" min="1" value={formData.numero_dosis} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lote_vacuna">Lote de la Vacuna</Label>
              <Input 
                id="lote_vacuna" 
                name="lote_vacuna" 
                list="lotes-list"
                value={formData.lote_vacuna} 
                onChange={handleChange} 
                required 
                placeholder="Seleccione o escriba el lote..." 
              />
              <datalist id="lotes-list">
                {lotesSugeridos.map(lote => (
                  <option key={lote} value={lote} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperatura_conservacion">Temperatura (°C)</Label>
              <Input id="temperatura_conservacion" name="temperatura_conservacion" type="number" step="0.1" value={formData.temperatura_conservacion} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="establecimiento_id">Establecimiento</Label>
              <select 
                id="establecimiento_id" 
                name="establecimiento_id" 
                value={formData.establecimiento_id} 
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar establecimiento...</option>
                {establecimientos.map(e => (
                  <option key={e.establecimiento_id} value={e.establecimiento_id}>
                    {e.nombre_establecimiento}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="origen_datos">Origen de Datos</Label>
              <select id="origen_datos" name="origen_datos" value={formData.origen_datos} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="La Paz">La Paz</option>
                <option value="Rural Móvil">Rural Móvil</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <textarea 
              id="observaciones" 
              name="observaciones" 
              value={formData.observaciones} 
              onChange={handleChange}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Detalles adicionales sobre la aplicación..."
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Aplicación de Vacuna"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
