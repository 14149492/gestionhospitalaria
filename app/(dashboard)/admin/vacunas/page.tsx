import VacunasTable from "@/components/dashboard/admin/vacunas-table";
import { BookOpen } from "lucide-react";

export default function VacunasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo Nacional de Vacunas</h1>
          <p className="text-muted-foreground text-sm">Gestión de biológicos y esquemas de dosis.</p>
        </div>
      </div>
      
      <VacunasTable />
    </div>
  );
}
