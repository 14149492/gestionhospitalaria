import EstablecimientosTable from "@/components/dashboard/admin/establecimientos-table";
import { MapPin } from "lucide-react";

export default function EstablecimientosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Establecimientos de Salud</h1>
          <p className="text-muted-foreground text-sm">Gestión de centros y puntos de vacunación nacional.</p>
        </div>
      </div>

      <EstablecimientosTable />
    </div>
  );
}
