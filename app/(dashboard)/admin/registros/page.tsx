import RegistrosTable from "@/components/dashboard/admin/registros-table";
import { ClipboardList, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegistrosGlobalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Registros Globales PAI</h1>
            <p className="text-muted-foreground text-sm">Historial completo de vacunación a nivel nacional.</p>
          </div>
        </div>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" /> Exportar Reporte
        </Button>
      </div>

      <RegistrosTable />
    </div>
  );
}
