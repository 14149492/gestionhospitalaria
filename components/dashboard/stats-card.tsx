import { type LucideIcon } from "lucide-react" 
import { Card, CardContent } from "@/components/ui/card" 

interface StatsCardProps { 
  title: string 
  value: string | number 
  description?: string 
  icon: LucideIcon 
  trend?: string
} 

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend
}: StatsCardProps) { 
  return ( 
    <Card className="glass-card group overflow-hidden relative border-none">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
         <Icon className="h-16 w-16 text-primary" />
      </div>
      <CardContent className="p-6"> 
        <div className="flex items-center gap-4 mb-4">
           <div className="p-2.5 rounded-xl premium-gradient text-white shadow-lg shadow-primary/20">
              <Icon className="h-5 w-5" />
           </div>
           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80"> 
             {title} 
           </p> 
        </div>
        
        <div className="flex items-baseline gap-2">
           <div className="text-4xl font-black tracking-tight text-foreground">{value}</div> 
           {trend && <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">{trend}</span>}
        </div>

        {description && ( 
          <p className="text-xs text-muted-foreground mt-2 font-medium"> 
            {description} 
          </p> 
        )} 
      </CardContent> 
    </Card> 
  ) 
}