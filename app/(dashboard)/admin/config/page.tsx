import { Settings, Shield, Bell, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración del Sistema</h1>
          <p className="text-muted-foreground text-sm">Ajustes globales de la plataforma PAI.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Seguridad y Roles
            </CardTitle>
            <CardDescription>Gestione las políticas de acceso y permisos de los operadores.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Autenticación Multifactor (MFA)</p>
                <p className="text-xs text-muted-foreground">Exigir verificación adicional para administradores.</p>
              </div>
              <Button variant="outline" size="sm">Habilitar</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Sincronización PAI
            </CardTitle>
            <CardDescription>Configuración de los endpoints de la base de datos nacional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Servidor de Datos Central</Label>
              <div className="flex gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm">https://api.pai.gob.bo/v1/sync</code>
                <Button variant="secondary" size="sm">Probar Conexión</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
