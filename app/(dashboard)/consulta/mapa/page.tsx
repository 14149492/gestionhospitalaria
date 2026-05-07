import { Map as MapIcon, Info, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MapaCoberturaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <MapIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mapa de Cobertura Nacional</h1>
          <p className="text-muted-foreground text-sm">Distribución geográfica de la inmunización por departamentos.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
           <CardTitle className="text-lg">Visualización Geográfica</CardTitle>
           <CardDescription>Los colores intensos indican una mayor tasa de vacunación.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[500px] bg-accent/5 flex items-center justify-center relative">
           {/* Representación simbólica de un mapa */}
           <div className="text-center space-y-4">
              <MapPin className="w-12 h-12 text-accent mx-auto animate-bounce" />
              <p className="text-muted-foreground font-medium italic">El mapa interactivo se está cargando con datos satelitales...</p>
           </div>
           
           <div className="absolute bottom-6 left-6 p-4 bg-background/80 backdrop-blur border rounded-lg shadow-lg space-y-2 max-w-[200px]">
              <p className="text-xs font-bold uppercase">Leyenda</p>
              <div className="flex items-center gap-2">
                 <div className="size-3 bg-accent rounded-sm"></div>
                 <span className="text-[10px]">Alta Cobertura ({">"}80%)</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="size-3 bg-accent/50 rounded-sm"></div>
                 <span className="text-[10px]">Media Cobertura (50-80%)</span>
              </div>
           </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm">Departamento Líder</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-2xl font-bold text-accent">Santa Cruz</p>
               <p className="text-xs text-muted-foreground">89.4% de cobertura</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm">Puntos de Vacunación Activos</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-2xl font-bold text-accent">1,248</p>
               <p className="text-xs text-muted-foreground">En todo el territorio nacional</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
