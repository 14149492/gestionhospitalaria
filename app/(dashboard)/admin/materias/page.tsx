import MateriasTable from "@/components/dashboard/admin/materias-table";

export default function MateriasAdmin() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Materias</h1>
        <p className="text-muted-foreground">
          Aquí podrás crear, editar y administrar las materias del sistema.
        </p>
      </div>
      <MateriasTable />
    </div>
  );
}
