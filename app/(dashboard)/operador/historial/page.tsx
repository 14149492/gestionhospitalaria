import HistorialTable from "@/components/dashboard/operador/historial-table";
import { History, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistorialOperadorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mis Registros de Aplicación</h1>
            <p className="text-muted-foreground text-sm">Listado de todas las dosis que has administrado.</p>
          </div>
        </div>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" /> Mi Reporte
        </Button>
      </div>

      <HistorialTable />
    </div>
  );
}
