import { z } from 'zod';

/**
 * Esquema de validación para Login
 */
export const loginSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es requerido')
    .min(3, 'El código debe tener al menos 3 caracteres'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Esquema de validación para Registro
 */
export const registroSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es requerido')
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(50, 'El código no puede exceder 50 caracteres'),
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  apellido: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres'),
  carnet: z
    .string()
    .min(1, 'El carnet es requerido')
    .regex(/^\d{9,10}$/, 'El carnet debe tener 9-10 dígitos'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type RegistroFormData = z.infer<typeof registroSchema>;

/**
 * Esquema de validación para Estudiantes
 */
export const estudianteSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es requerido')
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(50, 'El código no puede exceder 50 caracteres'),
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  apellido: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres'),
  carnet: z
    .string()
    .min(1, 'El carnet es requerido')
    .regex(/^\d{9,10}$/, 'El carnet debe tener 9-10 dígitos'),
  rol: z.enum(['ADMIN', 'USUARIO']),
  activo: z.boolean().default(true),
});

export type EstudianteFormData = z.infer<typeof estudianteSchema>;

/**
 * Esquema de validación para Expendios
 */
export const expendioSchema = z.object({
  archivo: z
    .string()
    .max(50, 'El archivo no puede exceder 50 caracteres')
    .optional(),
  nombrePropietario: z
    .string()
    .min(1, 'El nombre del propietario es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  ubicacion: z
    .string()
    .min(1, 'La ubicación es requerida')
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .max(200, 'La ubicación no puede exceder 200 caracteres'),
  tipo: z.enum(['KIOSKO', 'CAFETERIA', 'COMEDOR']),
  activo: z.boolean().default(true),
});

export type ExpendioFormData = z.infer<typeof expendioSchema>;

/**
 * Esquema de validación para Informe de Asignación
 */
export const informeSchema = z.object({
  observaciones: z
    .string()
    .min(1, 'Las observaciones son requeridas')
    .min(10, 'Las observaciones deben tener al menos 10 caracteres')
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres'),
  calificacion: z
    .number()
    .min(0, 'La calificación mínima es 0')
    .max(100, 'La calificación máxima es 100'),
  fotoUrl: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal('')),
});

export type InformeFormData = z.infer<typeof informeSchema>;
