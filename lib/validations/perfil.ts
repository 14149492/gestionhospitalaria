import { z } from "zod" 

export const perfilSchema = z.object({ 
  nombre_completo: z 
    .string() 
    .min(2, "El nombre debe tener al menos 2 caracteres") 
    .max(100, "El nombre no puede exceder 100 caracteres"), 

  

  telefono: z 
    .string() 
    .max(20, "El teléfono no puede exceder 20 caracteres") 
    .optional() 
    .or(z.literal("")),  // Permitir string vacío 

  carrera: z 
    .string() 
    .max(100, "La carrera no puede exceder 100 caracteres") 
    .optional() 
    .or(z.literal("")), 
}) 


// Tipo TypeScript generado automáticamente desde el esquema 
export type PerfilFormData = z.infer<typeof perfilSchema> 