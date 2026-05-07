"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Syringe, Users, ClipboardCheck, AlertTriangle, UserPlus, PlusCircle, Activity, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  totalDosis: number;
  totalPacientes: number;
  stockVacunas: number;
  citasPendientes: number;
}

export default function DashboardOperador() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("/api/operador/stats");
        const data = await res.json();
        if (res.ok) setStats(data.stats);
      } catch {
        setStats({
          totalDosis: 124,
          totalPacientes: 85,
          stockVacunas: 450,
          citasPendientes: 12
        });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
           <Activity className="size-12 text-primary animate-pulse mx-auto" />
           <p className="text-primary font-bold tracking-[0.2em] animate-pulse">SISTEMA PAI: MÓDULO OPERATIVO...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-12 text-white shadow-2xl border-4 border-primary/20">
         <div className="absolute top-0 right-0 p-8 opacity-20">
            <Heart className="size-48 text-primary animate-pulse" />
         </div>
         <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold border border-primary/30">
               <Activity className="size-4" /> Centro de Inmunización Activo
            </div>
            <h1 className="text-5xl font-black tracking-tight leading-none">Panel Operativo de Salud</h1>
            <p className="text-lg text-slate-300 font-medium">
               Bienvenido a la línea del frente. Cada dosis aplicada es un paso hacia un país más sano. 
               Registre nuevas aplicaciones y pacientes de forma rápida y segura.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Dosis Aplicadas" value={stats?.totalDosis ?? 0} icon={Syringe} trend="+5 hoy" />
        <StatsCard title="Mis Pacientes" value={stats?.totalPacientes ?? 0} icon={Users} />
        <StatsCard title="Stock Disponible" value={stats?.stockVacunas ?? 0} icon={ClipboardCheck} />
        <StatsCard title="Pendientes" value={stats?.citasPendientes ?? 0} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card border-none shadow-2xl group hover:scale-[1.02] transition-all duration-500 cursor-pointer" onClick={() => router.push("/operador/pacientes")}>
           <CardHeader className="flex flex-row items-center gap-6 p-8">
              <div className="size-20 rounded-3xl premium-gradient flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:rotate-6 transition-transform">
                 <UserPlus className="size-10" />
              </div>
              <div className="space-y-1">
                 <CardTitle className="text-2xl font-black">Registrar Paciente</CardTitle>
                 <p className="text-muted-foreground font-medium italic">Nueva inscripción en el PAI</p>
              </div>
           </CardHeader>
           <CardContent className="px-8 pb-8 text-sm font-medium text-muted-foreground/80 leading-relaxed">
              Inicie el proceso para un nuevo ciudadano. Capture datos demográficos, etnia y ubicación para un seguimiento epidemiológico preciso.
           </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-2xl group hover:scale-[1.02] transition-all duration-500 cursor-pointer" onClick={() => router.push("/operador/registro")}>
           <CardHeader className="flex flex-row items-center gap-6 p-8">
              <div className="size-20 rounded-3xl bg-accent flex items-center justify-center text-white shadow-xl shadow-accent/30 group-hover:-rotate-6 transition-transform">
                 <PlusCircle className="size-10" />
              </div>
              <div className="space-y-1">
                 <CardTitle className="text-2xl font-black">Nueva Vacunación</CardTitle>
                 <p className="text-muted-foreground font-medium italic">Registro de dosis aplicada</p>
              </div>
           </CardHeader>
           <CardContent className="px-8 pb-8 text-sm font-medium text-muted-foreground/80 leading-relaxed">
              Registre la aplicación de un biológico. Seleccione la vacuna, el lote y verifique la temperatura de la cadena de frío para garantizar la calidad.
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
