"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { RefreshCw, Syringe, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Vacuna {
  vacuna_id: string;
  vacuna_nombre: string;
  enfermedad_previene: string;
  numero_dosis: number;
  via_administracion: string;
}

export default function CatalogoVacunas() {
  const supabase = createClient();
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
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
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground animate-pulse">Cargando catálogo biológico...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {vacunas.length} vacuna(s) habilitada(s) para el PAI
        </p>
        <Button variant="outline" size="sm" onClick={cargarDatos}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refrescar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vacunas.map((v) => (
          <Card key={v.vacuna_id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2 bg-primary/20" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-primary">{v.vacuna_nombre}</CardTitle>
                <Badge variant="secondary">{v.vacuna_id}</Badge>
              </div>
              <CardDescription className="flex items-center gap-1 font-medium text-accent-foreground">
                <Shield className="w-3 h-3" /> Previene: {v.enfermedad_previene}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 text-xs">
                <Badge variant="outline" className="bg-primary/5">
                  <Syringe className="mr-1 w-3 h-3" /> {v.via_administracion}
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                   {v.numero_dosis} Dosis
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
                <Info className="mr-1 w-3 h-3" /> Ver esquema completo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}
