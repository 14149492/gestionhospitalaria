import { PerfilForm } from "@/components/dashboard/perfil-form"

export default function PerfilAdmin() { 
  return ( 
    <div className="space-y-8 animate-in fade-in duration-700"> 
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-primary">Mi Perfil</h1> 
        <p className="text-muted-foreground font-medium"> 
          Gestiona tu información personal como administrador del sistema PAI. 
        </p> 
      </div>
      
      <PerfilForm />
    </div> 
  ) 
} 
