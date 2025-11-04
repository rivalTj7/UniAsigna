import { sql } from '@vercel/postgres';

async function initDB() {
  console.log('🔧 Inicializando base de datos...');
  
  try {
    // Crear tabla de estudiantes
    await sql`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        carnet VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefono VARCHAR(20),
        activo BOOLEAN DEFAULT true NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    console.log('✅ Tabla estudiantes creada');
    
    // Crear tabla de expendios
    await sql`
      CREATE TABLE IF NOT EXISTS expendios (
        id SERIAL PRIMARY KEY,
        archivo VARCHAR(50),
        nombre_propietario VARCHAR(200) NOT NULL,
        ubicacion VARCHAR(200) NOT NULL,
        tipo VARCHAR(50) DEFAULT 'KIOSKO' NOT NULL,
        activo BOOLEAN DEFAULT true NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    console.log('✅ Tabla expendios creada');
    
    // Crear tabla de asignaciones
    await sql`
      CREATE TABLE IF NOT EXISTS asignaciones (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
        expendio_id INTEGER NOT NULL REFERENCES expendios(id) ON DELETE CASCADE,
        mes INTEGER NOT NULL,
        anio INTEGER NOT NULL,
        fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        informe_completado BOOLEAN DEFAULT false NOT NULL,
        fecha_informe TIMESTAMP,
        observaciones TEXT,
        calificacion VARCHAR(20),
        foto_url VARCHAR(500),
        CONSTRAINT unique_expendio_mes_anio UNIQUE (expendio_id, mes, anio)
      );
    `;
    console.log('✅ Tabla asignaciones creada');
    
    // Crear índices
    await sql`CREATE INDEX IF NOT EXISTS idx_asignaciones_mes_anio ON asignaciones(mes, anio);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_asignaciones_estudiante ON asignaciones(estudiante_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_asignaciones_expendio ON asignaciones(expendio_id);`;
    console.log('✅ Índices creados');
    
    // Crear tabla de ciclos mensuales
    await sql`
      CREATE TABLE IF NOT EXISTS ciclos_mensuales (
        id SERIAL PRIMARY KEY,
        mes INTEGER NOT NULL,
        anio INTEGER NOT NULL,
        fecha_inicio TIMESTAMP NOT NULL,
        fecha_fin TIMESTAMP,
        activo BOOLEAN DEFAULT true NOT NULL,
        total_asignaciones INTEGER DEFAULT 0 NOT NULL,
        CONSTRAINT unique_mes_anio UNIQUE (mes, anio)
      );
    `;
    console.log('✅ Tabla ciclos_mensuales creada');
    
    console.log('🎉 Base de datos inicializada correctamente!');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  }
}

initDB()
  .then(() => {
    console.log('✨ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
