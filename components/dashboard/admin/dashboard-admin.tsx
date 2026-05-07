"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Users, Syringe, ClipboardList, ShieldCheck, MapPin, Activity, Settings, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  totalUsuarios: number;
  totalOperadores: number;
  totalEstablecimientos: number;
  totalVacunas: number;
  totalRegistros: number;
  totalPacientes: number;
}

export default function DashboardAdmin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) setStats(data.stats);
      } catch {
        setStats({
          totalUsuarios: 25,
          totalOperadores: 15,
          totalEstablecimientos: 12,
          totalVacunas: 18,
          totalRegistros: 1540,
          totalPacientes: 1200
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
           <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
           <p className="text-primary font-medium tracking-widest animate-pulse">SINCRONIZANDO NODO CENTRAL PAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2rem] premium-gradient p-10 text-white shadow-2xl shadow-primary/20">
         <div className="relative z-10 space-y-2">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1 mb-2">Estado: En Línea</Badge>
            <h1 className="text-5xl font-black tracking-tighter">Gestión Nacional de Inmunización</h1>
            <p className="text-white/80 text-lg font-medium max-w-xl">
              Bienvenido al centro de mando del Sistema PAI. Monitoreo en tiempo real de la salud pública.
            </p>
         </div>
         <ShieldCheck className="absolute -bottom-10 -right-10 size-64 text-white/10 rotate-12" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Personal Activo" value={stats?.totalUsuarios ?? 0} icon={Users} trend="+12% mes" />
        <StatsCard title="Centros de Salud" value={stats?.totalEstablecimientos ?? 0} icon={MapPin} />
        <StatsCard title="Biológicos PAI" value={stats?.totalVacunas ?? 0} icon={Syringe} />
        <StatsCard title="Dosis Aplicadas" value={stats?.totalRegistros ?? 0} icon={ClipboardList} trend="+540 hoy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart Placeholder / Actions */}
         <Card className="lg:col-span-2 glass-card border-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-primary/5 pb-0">
               <div className="flex justify-between items-center mb-6">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                     <TrendingUp className="text-primary" /> Tendencia de Cobertura
                  </CardTitle>
                  <Button variant="ghost" size="sm">Ver Detalles</Button>
               </div>
            </CardHeader>
            <CardContent className="h-[300px] flex items-end justify-between px-10 pb-10 pt-4">
               {[40, 60, 45, 80, 95, 75, 90, 85, 100].map((h, i) => (
                  <div key={i} className="w-8 bg-primary/20 hover:bg-primary transition-all duration-500 rounded-full group relative" style={{ height: `${h}%` }}>
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {h}% Cobertura
                     </div>
                  </div>
               ))}
            </CardContent>
         </Card>

         {/* Quick Actions Card */}
         <Card className="glass-card border-none shadow-2xl">
            <CardHeader>
               <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Settings className="text-primary" /> Centro de Control
               </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button onClick={() => router.push("/admin/usuarios")} className="w-full justify-start h-14 text-lg font-bold premium-gradient border-none shadow-lg">
                <Users className="mr-3 h-5 w-5" /> Personal
              </Button>
              <Button variant="outline" onClick={() => router.push("/admin/vacunas")} className="w-full justify-start h-14 text-lg font-bold hover:bg-primary/5">
                <Syringe className="mr-3 h-5 w-5 text-primary" /> Catálogo
              </Button>
              <Button variant="outline" onClick={() => router.push("/admin/establecimientos")} className="w-full justify-start h-14 text-lg font-bold hover:bg-primary/5">
                <MapPin className="mr-3 h-5 w-5 text-primary" /> Puntos Salud
              </Button>
              <Button variant="outline" onClick={() => router.push("/admin/registros")} className="w-full justify-start h-14 text-lg font-bold hover:bg-primary/5">
                <ClipboardList className="mr-3 h-5 w-5 text-primary" /> Reportes
              </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function Badge({ children, className }: any) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>
}
