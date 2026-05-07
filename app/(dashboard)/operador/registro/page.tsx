import RegistrarVacunacionForm from "@/components/dashboard/operador/registrar-vacunacion-form";
import { ShieldCheck } from "lucide-react";

export default function NuevaVacunacionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent-foreground">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aplicación de Dosis</h1>
          <p className="text-muted-foreground text-sm">Registro de inmunización para el historial del paciente.</p>
        </div>
      </div>
      
      <RegistrarVacunacionForm />
    </div>
  );
}
