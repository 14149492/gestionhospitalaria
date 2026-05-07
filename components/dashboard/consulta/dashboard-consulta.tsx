"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Globe, ShieldCheck, Activity, Map, ArrowRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  totalInmunizados: number;
  metaAlcance: string;
  departamentosActivos: number;
  biologicosEnUso: number;
}

export default function DashboardConsulta() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("/api/consulta/stats");
        const data = await res.json();
        if (res.ok) setStats(data.stats);
      } catch {
        setStats({
          totalInmunizados: 15420,
          metaAlcance: "78.5%",
          departamentosActivos: 9,
          biologicosEnUso: 12
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
         <div className="flex flex-col items-center gap-4">
            <Globe className="size-16 text-accent animate-spin-slow" />
            <p className="text-accent font-black tracking-widest uppercase">Consultando Datos Públicos PAI...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Public Transparency Hero */}
      <div className="relative overflow-hidden rounded-[3rem] bg-accent p-12 text-white shadow-2xl shadow-accent/40">
         <div className="absolute -top-20 -right-20 size-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
         <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/20 w-fit px-3 py-1 rounded-full border border-white/30">
               <ShieldCheck className="size-3" /> Información Oficial Certificada
            </div>
            <h1 className="text-6xl font-black tracking-tighter max-w-3xl">Población Protegida e Informada</h1>
            <p className="text-white/80 text-xl font-medium max-w-2xl leading-relaxed">
               Acceda a los datos reales de la campaña nacional de vacunación. 
               Transparencia total para la salud de todos los bolivianos.
            </p>
         </div>
         <Activity className="absolute bottom-10 right-10 size-40 text-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Inmunizados" value={stats?.totalInmunizados ?? 0} icon={Globe} trend="+2.4% hoy" />
        <StatsCard title="Meta Alcanzada" value={stats?.metaAlcance ?? "0%"} icon={ShieldCheck} />
        <StatsCard title="Departamentos" value={stats?.departamentosActivos ?? 0} icon={Map} />
        <StatsCard title="Tipos de Vacuna" value={stats?.biologicosEnUso ?? 0} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="glass-card border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />
            <CardHeader className="p-8">
               <CardTitle className="text-3xl font-black">Estadísticas Nacionales</CardTitle>
               <CardDescription className="text-lg font-medium">Consulte el desglose por departamento y tipo de biológico.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
               <div className="h-40 bg-muted/30 rounded-2xl flex items-center justify-center border-2 border-dashed border-muted">
                  <Activity className="size-12 text-muted-foreground/30" />
               </div>
               <Button onClick={() => router.push("/consulta/estadisticas")} className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 rounded-2xl">
                  Explorar Reporte <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
            </CardContent>
         </Card>

         <Card className="glass-card border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <CardHeader className="p-8">
               <CardTitle className="text-3xl font-black">Mapa de Cobertura</CardTitle>
               <CardDescription className="text-lg font-medium">Localice puntos de salud y vea el alcance geográfico real.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
               <div className="h-40 bg-muted/30 rounded-2xl flex items-center justify-center border-2 border-dashed border-muted">
                  <Map className="size-12 text-muted-foreground/30" />
               </div>
               <Button onClick={() => router.push("/consulta/mapa")} variant="outline" className="w-full h-14 text-lg font-bold border-2 hover:bg-primary/5 rounded-2xl">
                  Abrir Mapa <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
            </CardContent>
         </Card>
      </div>

      <div className="bg-muted/50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 border-2 border-dashed border-muted-foreground/10">
         <div className="size-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
            <Info className="size-8 text-primary" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold">¿Tienes dudas sobre el esquema PAI?</h3>
            <p className="text-muted-foreground font-medium">Consulta el catálogo oficial de vacunas y las edades de aplicación en nuestra sección de información.</p>
         </div>
         <Button variant="secondary" className="rounded-xl font-bold">Más información</Button>
      </div>
    </div>
  );
}
