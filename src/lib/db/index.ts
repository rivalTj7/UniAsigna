import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schema from './schema';

// Crear instancia de Drizzle con la conexión de Vercel Postgres
export const db = drizzle(vercelSql, { schema });

// Export sql para queries directas si es necesario
export { vercelSql as sql };
