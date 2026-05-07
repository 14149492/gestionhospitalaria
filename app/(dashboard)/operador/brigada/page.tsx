import { MapPin, Syringe, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BrigadaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent-foreground">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brigada Móvil</h1>
          <p className="text-muted-foreground text-sm">Registro de actividades de vacunación en campo y comunidades.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ubicación de la Brigada</CardTitle>
            <CardDescription>Indique el lugar exacto de la intervención actual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Comunidad / Barrio</Label>
                <Input placeholder="Ej: Villa Esperanza" />
              </div>
              <div className="space-y-2">
                <Label>Coordenadas (GPS)</Label>
                <Input placeholder="-16.500, -68.150" readOnly className="bg-muted" />
              </div>
            </div>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <MapPin className="mr-2 h-4 w-4" /> Marcar Ubicación Actual
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Campo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Users className="w-4 h-4 text-muted-foreground" />
                   <span className="text-sm">Personas abordadas</span>
                </div>
                <span className="font-bold">0</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Syringe className="w-4 h-4 text-muted-foreground" />
                   <span className="text-sm">Dosis aplicadas</span>
                </div>
                <span className="font-bold">0</span>
             </div>
             <Button variant="outline" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Enviar Reporte de Jornada
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
