import { PerfilForm } from "@/components/dashboard/perfil-form"

export default function PerfilOperador() { 
  return ( 
    <div className="space-y-8 animate-in fade-in duration-700"> 
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-primary">Mi Perfil</h1> 
        <p className="text-muted-foreground font-medium"> 
          Gestiona tu información personal y verifica tus credenciales de operador. 
        </p> 
      </div>
      
      <PerfilForm />
    </div> 
  ) 
} 