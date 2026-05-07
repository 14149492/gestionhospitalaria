"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function RegistrarPacienteForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paciente_id: "",
    documento_identidad: "",
    nombres: "",
    primer_apellido: "",
    segundo_apellido: "",
    genero: "M",
    fecha_nacimiento: "",
    municipio_residencia: "",
    es_pueblo_indigena: false,
    comunidad_indigena: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paciente_id: formData.documento_identidad || `PAC-${Date.now()}`
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Error al registrar");

      toast.success("Paciente registrado con éxito");
      setFormData({
        paciente_id: "",
        documento_identidad: "",
        nombres: "",
        primer_apellido: "",
        segundo_apellido: "",
        genero: "M",
        fecha_nacimiento: "",
        municipio_residencia: "",
        es_pueblo_indigena: false,
        comunidad_indigena: "",
      });
      
      // Intentar refrescar la tabla si existe un evento global o simplemente avisar
      window.dispatchEvent(new CustomEvent('paciente-registrado'));
    } catch (error: any) {
      toast.error(error.message || "Error al registrar paciente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-md border-primary/10">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl text-primary">Nuevo Registro PAI</CardTitle>
        <CardDescription>Ingrese los datos personales del paciente para el sistema nacional.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documento_identidad">Documento de Identidad (CI)</Label>
              <Input id="documento_identidad" name="documento_identidad" value={formData.documento_identidad} onChange={handleChange} required placeholder="Ej: 1234567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres</Label>
              <Input id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} required placeholder="Ej: Juan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primer_apellido">Primer Apellido</Label>
              <Input id="primer_apellido" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} required placeholder="Ej: Pérez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundo_apellido">Segundo Apellido</Label>
              <Input id="segundo_apellido" name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} placeholder="Ej: Mamani" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <select 
                id="genero" 
                name="genero" 
                value={formData.genero} 
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="municipio_residencia">Municipio de Residencia</Label>
            <Input id="municipio_residencia" name="municipio_residencia" value={formData.municipio_residencia} onChange={handleChange} placeholder="Ej: La Paz" />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="es_pueblo_indigena" 
              name="es_pueblo_indigena" 
              checked={formData.es_pueblo_indigena} 
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <Label htmlFor="es_pueblo_indigena">¿Pertenece a un pueblo indígena?</Label>
          </div>

          {formData.es_pueblo_indigena && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <Label htmlFor="comunidad_indigena">Comunidad Indígena</Label>
              <Input id="comunidad_indigena" name="comunidad_indigena" value={formData.comunidad_indigena} onChange={handleChange} placeholder="Ej: Aymara" />
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full text-lg" disabled={loading}>
              {loading ? "Registrando..." : "Completar Registro de Paciente"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
