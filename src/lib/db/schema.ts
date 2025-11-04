import { pgTable, serial, varchar, text, boolean, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabla de Estudiantes
export const estudiantes = pgTable('estudiantes', {
  id: serial('id').primaryKey(),
  codigo: varchar('codigo', { length: 20 }).notNull().unique(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  apellido: varchar('apellido', { length: 100 }).notNull(),
  carnet: varchar('carnet', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // Contraseña hasheada
  rol: varchar('rol', { length: 20 }).default('USUARIO').notNull(), // ADMIN o USUARIO
  activo: boolean('activo').default(true).notNull(),
  fechaCreacion: timestamp('fecha_creacion').defaultNow().notNull(),
});

// Tabla de Expendios
export const expendios = pgTable('expendios', {
  id: serial('id').primaryKey(),
  archivo: varchar('archivo', { length: 50 }),
  nombrePropietario: varchar('nombre_propietario', { length: 200 }).notNull(),
  ubicacion: varchar('ubicacion', { length: 200 }).notNull(),
  tipo: varchar('tipo', { length: 50 }).default('KIOSKO').notNull(),
  activo: boolean('activo').default(true).notNull(),
  fechaCreacion: timestamp('fecha_creacion').defaultNow().notNull(),
});

// Tabla de Asignaciones
export const asignaciones = pgTable('asignaciones', {
  id: serial('id').primaryKey(),
  estudianteId: integer('estudiante_id').notNull().references(() => estudiantes.id, { onDelete: 'cascade' }),
  expendioId: integer('expendio_id').notNull().references(() => expendios.id, { onDelete: 'cascade' }),
  mes: integer('mes').notNull(), // 1-12
  anio: integer('anio').notNull(), // 2024, 2025, etc.
  fechaAsignacion: timestamp('fecha_asignacion').defaultNow().notNull(),
  
  // Estado del informe
  informeCompletado: boolean('informe_completado').default(false).notNull(),
  fechaInforme: timestamp('fecha_informe'),
  
  // Datos del informe
  observaciones: text('observaciones'),
  calificacion: varchar('calificacion', { length: 20 }), // Excelente, Bueno, Regular, Malo
  fotoUrl: varchar('foto_url', { length: 500 }),
}, (table) => {
  return {
    // Índice único para evitar asignaciones duplicadas del mismo expendio en el mismo mes
    uniqueExpendioMesAnio: uniqueIndex('unique_expendio_mes_anio').on(table.expendioId, table.mes, table.anio),
  };
});

// Tabla de Ciclos Mensuales
export const ciclosMensuales = pgTable('ciclos_mensuales', {
  id: serial('id').primaryKey(),
  mes: integer('mes').notNull(),
  anio: integer('anio').notNull(),
  fechaInicio: timestamp('fecha_inicio').notNull(),
  fechaFin: timestamp('fecha_fin'),
  activo: boolean('activo').default(true).notNull(),
  totalAsignaciones: integer('total_asignaciones').default(0).notNull(),
}, (table) => {
  return {
    uniqueMesAnio: uniqueIndex('unique_mes_anio').on(table.mes, table.anio),
  };
});

// Relaciones
export const estudiantesRelations = relations(estudiantes, ({ many }) => ({
  asignaciones: many(asignaciones),
}));

export const expendiosRelations = relations(expendios, ({ many }) => ({
  asignaciones: many(asignaciones),
}));

export const asignacionesRelations = relations(asignaciones, ({ one }) => ({
  estudiante: one(estudiantes, {
    fields: [asignaciones.estudianteId],
    references: [estudiantes.id],
  }),
  expendio: one(expendios, {
    fields: [asignaciones.expendioId],
    references: [expendios.id],
  }),
}));

// Tipos TypeScript
export type Estudiante = typeof estudiantes.$inferSelect;
export type NuevoEstudiante = typeof estudiantes.$inferInsert;

export type Expendio = typeof expendios.$inferSelect;
export type NuevoExpendio = typeof expendios.$inferInsert;

export type Asignacion = typeof asignaciones.$inferSelect;
export type NuevaAsignacion = typeof asignaciones.$inferInsert;

export type CicloMensual = typeof ciclosMensuales.$inferSelect;
export type NuevoCicloMensual = typeof ciclosMensuales.$inferInsert;
