import { BarChart3, PieChart, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalisisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Análisis de Datos Nacional</h1>
          <p className="text-muted-foreground text-sm">Visualización de tendencias y cobertura de inmunización.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Cobertura por Departamento
            </CardTitle>
            <CardDescription>Porcentaje de población vacunada por región.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-end gap-2 pt-4">
             {/* Simulación de gráfico de barras */}
             <div className="flex-1 bg-primary/20 h-[80%] rounded-t-sm relative group cursor-help">
                <div className="absolute -top-6 left-0 right-0 text-[10px] text-center opacity-0 group-hover:opacity-100 transition-opacity">SC - 85%</div>
             </div>
             <div className="flex-1 bg-primary/40 h-[65%] rounded-t-sm"></div>
             <div className="flex-1 bg-primary/60 h-[90%] rounded-t-sm"></div>
             <div className="flex-1 bg-primary/80 h-[45%] rounded-t-sm"></div>
             <div className="flex-1 bg-primary h-[75%] rounded-t-sm"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Distribución por Vacuna
            </CardTitle>
            <CardDescription>Uso relativo de cada tipo de biológico.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[250px]">
             <div className="relative size-40 rounded-full border-[15px] border-primary border-r-primary/20 border-b-primary/40 flex items-center justify-center">
                <Activity className="w-8 h-8 text-primary/40" />
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendencia Mensual</CardTitle>
          <CardDescription>Dosis aplicadas en los últimos 6 meses.</CardDescription>
        </CardHeader>
        <CardContent className="h-[150px] bg-muted/30 rounded-lg flex items-center justify-center">
           <p className="text-sm text-muted-foreground italic">Cargando visualización de series temporales...</p>
        </CardContent>
      </Card>
    </div>
  );
}
