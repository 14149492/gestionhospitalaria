import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; 
import { BookOpen } from "lucide-react"; 
import CatalogoVacunas from "@/components/dashboard/operador/catalogo-vacunas"; 

export default function VacunasDisponiblesPage() { 
  return ( 
    <div className="flex flex-1 flex-col gap-4 p-4"> 
      <div className="flex items-center gap-3"> 
        <BookOpen className="h-8 w-8 text-primary" /> 
        <div> 
          <h1 className="text-2xl font-bold tracking-tight"> 
            Catálogo de Vacunas
          </h1> 
          <p className="text-muted-foreground"> 
            Consulta de biológicos disponibles para inmunización.
          </p> 
        </div> 
      </div> 

      <Card> 
        <CardHeader> 
          <CardTitle>Biológicos Habilitados</CardTitle> 
          <CardDescription> 
            Lista de vacunas que puedes registrar en el sistema PAI.
          </CardDescription> 
        </CardHeader> 
        <CardContent> 
          <CatalogoVacunas /> 
        </CardContent> 
      </Card> 
    </div> 
  ); 
}