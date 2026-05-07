import RegistrarPacienteForm from "@/components/dashboard/operador/registrar-paciente-form";
import PacientesTable from "@/components/dashboard/operador/pacientes-table";
import { Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function RegistrarPacientesPage() {
  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary">Gestión de Pacientes</h1>
          <p className="text-muted-foreground font-medium">Registro y consulta nacional de personas para el PAI.</p>
        </div>
      </div>

      <div className="grid gap-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <span className="size-2 rounded-full bg-primary" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Nuevo Registro</h2>
          </div>
          <RegistrarPacienteForm />
        </section>

        <Separator className="bg-primary/5" />

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <span className="size-2 rounded-full bg-primary" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Listado de Pacientes</h2>
          </div>
          <PacientesTable />
        </section>
      </div>
    </div>
  );
}
