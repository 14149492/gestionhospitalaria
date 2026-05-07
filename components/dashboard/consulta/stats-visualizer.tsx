"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Syringe, Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StatsVisualizer() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalDosis: 0,
    totalPacientes: 0,
    vacunasDiferentes: 0,
    coberturaMeta: 78.5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { count: doses } = await supabase.from("registro_vacunacion").select("*", { count: 'exact', head: true });
        const { count: pacientes } = await supabase.from("paciente").select("*", { count: 'exact', head: true });
        const { count: vacunas } = await supabase.from("vacuna").select("*", { count: 'exact', head: true });

        setStats({
          totalDosis: doses || 0,
          totalPacientes: pacientes || 0,
          vacunasDiferentes: vacunas || 0,
          coberturaMeta: 78.5
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1"><Syringe className="w-3 h-3" /> Dosis Aplicadas</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {loading ? "..." : stats.totalDosis.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-accent/5 border-accent/20 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1"><Users className="w-3 h-3" /> Personas Protegidas</CardDescription>
            <CardTitle className="text-3xl font-bold text-accent">
               {loading ? "..." : stats.totalPacientes.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-muted border-muted-foreground/20 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1"><Globe className="w-3 h-3" /> Cobertura Nacional</CardDescription>
            <CardTitle className="text-3xl font-bold">
               {stats.coberturaMeta}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-primary/10 border-primary/30 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1"><Activity className="w-3 h-3" /> Tipos de Vacuna</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary/80">
               {loading ? "..." : stats.vacunasDiferentes}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5">
               <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Progreso de Inmunización
               </CardTitle>
               <CardDescription>Crecimiento acumulado de aplicaciones.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-end h-32 gap-2">
                     <div className="flex-1 bg-primary/20 h-[30%] rounded-t animate-in slide-in-from-bottom duration-500"></div>
                     <div className="flex-1 bg-primary/30 h-[45%] rounded-t animate-in slide-in-from-bottom duration-700"></div>
                     <div className="flex-1 bg-primary/40 h-[40%] rounded-t animate-in slide-in-from-bottom duration-1000"></div>
                     <div className="flex-1 bg-primary/50 h-[60%] rounded-t animate-in slide-in-from-bottom duration-1000"></div>
                     <div className="flex-1 bg-primary/70 h-[85%] rounded-t animate-in slide-in-from-bottom duration-1000"></div>
                     <div className="flex-1 bg-primary h-[100%] rounded-t animate-in slide-in-from-bottom duration-1000"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono uppercase">
                     <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="shadow-lg border-accent/10">
            <CardHeader className="bg-accent/5">
               <CardTitle className="text-lg">Distribución Geográfica</CardTitle>
               <CardDescription>Principales regiones con mayor actividad.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                     <span>Santa Cruz</span>
                     <span className="font-bold">34.2%</span>
                  </div>
                  <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden">
                     <div className="h-full bg-accent w-[34%]"></div>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                     <span>La Paz</span>
                     <span className="font-bold">28.7%</span>
                  </div>
                  <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden">
                     <div className="h-full bg-accent w-[28%]"></div>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                     <span>Cochabamba</span>
                     <span className="font-bold">19.1%</span>
                  </div>
                  <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden">
                     <div className="h-full bg-accent w-[19%]"></div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
