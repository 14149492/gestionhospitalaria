import { z } from "zod";

export const materiaSchema = z.object({
  codigo: z
    .string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(20, "El código no puede exceder 20 caracteres"),
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  creditos: z
    .number()
    .int("Los créditos deben ser un número entero")
    .min(1, "Mínimo 1 crédito")
    .max(10, "Máximo 10 créditos"),
  semestre: z
    .string()
    .min(1, "El semestre es requerido")
    .max(20, "El semestre no puede exceder 20 caracteres"),
  docente_id: z.string().uuid("ID de docente inválido").optional().nullable(),
});

export type MateriaFormData = z.infer<typeof materiaSchema>;
