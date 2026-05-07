import StatsVisualizer from "@/components/dashboard/consulta/stats-visualizer";
import { BarChart3 } from "lucide-react";

export default function EstadisticasPublicasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estadísticas Nacionales PAI</h1>
          <p className="text-muted-foreground text-sm">Información oficial sobre el progreso de inmunización en el país.</p>
        </div>
      </div>

      <StatsVisualizer />
    </div>
  );
}
