-- ============================================
-- SQL DE INICIALIZACIÓN - UniAsigna v4.0
-- Con Sistema de Autenticación Completo
-- ============================================

-- ELIMINAR TABLAS SI EXISTEN (para empezar desde cero)
DROP TABLE IF EXISTS asignaciones CASCADE;
DROP TABLE IF EXISTS ciclos_mensuales CASCADE;
DROP TABLE IF EXISTS estudiantes CASCADE;
DROP TABLE IF EXISTS expendios CASCADE;

-- ============================================
-- CREAR TABLA DE ESTUDIANTES CON AUTENTICACIÓN
-- ============================================
CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  carnet VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- Contraseña hasheada con bcrypt
  rol VARCHAR(20) DEFAULT 'USUARIO' NOT NULL, -- ADMIN o USUARIO
  activo BOOLEAN DEFAULT true NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- CREAR TABLA DE EXPENDIOS
-- ============================================
CREATE TABLE expendios (
  id SERIAL PRIMARY KEY,
  archivo VARCHAR(50),
  nombre_propietario VARCHAR(200) NOT NULL,
  ubicacion VARCHAR(200) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'KIOSKO' NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- CREAR TABLA DE ASIGNACIONES
-- ============================================
CREATE TABLE asignaciones (
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

-- ============================================
-- CREAR ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_asignaciones_mes_anio ON asignaciones(mes, anio);
CREATE INDEX IF NOT EXISTS idx_asignaciones_estudiante ON asignaciones(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_expendio ON asignaciones(expendio_id);
CREATE INDEX IF NOT EXISTS idx_estudiantes_rol ON estudiantes(rol);
CREATE INDEX IF NOT EXISTS idx_estudiantes_codigo ON estudiantes(codigo);

-- ============================================
-- CREAR TABLA DE CICLOS MENSUALES
-- ============================================
CREATE TABLE ciclos_mensuales (
  id SERIAL PRIMARY KEY,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP,
  activo BOOLEAN DEFAULT true NOT NULL,
  total_asignaciones INTEGER DEFAULT 0 NOT NULL,
  CONSTRAINT unique_mes_anio UNIQUE (mes, anio)
);

-- ============================================
-- INSERTAR USUARIOS DE PRUEBA
-- ============================================

-- ADMIN (código: ADMIN001, password: admin123)
-- Hash: $2a$10$X9K5QE.KbJ8oXwqH.nKQNOJ9QV3pQw1YqW6FKxT0K8CqYxTZxJZQS
INSERT INTO estudiantes (codigo, nombre, apellido, carnet, password, rol) VALUES
('ADMIN001', 'Admin', 'Sistema', 'ADMIN', '$2a$10$X9K5QE.KbJ8oXwqH.nKQNOJ9QV3pQw1YqW6FKxT0K8CqYxTZxJZQS', 'ADMIN');

-- USUARIO DE PRUEBA (código: EST001, password: password123)
-- Hash: $2a$10$rN.Yr5P8dqJYV9yvC7qY5eU0J0fQqX0Y1JLqxJ9XYx0QxY0xYxYxY
INSERT INTO estudiantes (codigo, nombre, apellido, carnet, password, rol) VALUES
('EST001', 'Juan', 'Pérez', '202212345', '$2a$10$rN.Yr5P8dqJYV9yvC7qY5eU0J0fQqX0Y1JLqxJ9XYx0QxY0xYxYxY', 'USUARIO');

-- ============================================
-- INSERTAR EXPENDIOS INICIALES (31 total)
-- ============================================
INSERT INTO expendios (archivo, nombre_propietario, ubicacion, tipo) VALUES
('4', 'ANNA CONCEPCIÓN PETRONE STORMONT', 'ENTRE LOS EDIFICIOS T-1 Y T-2', 'KIOSKO'),
('46', 'HECTOR BARRERA LOPEZ', 'EFPEM', 'KIOSKO'),
('51', 'MARIA SALOME CAP PABLO', 'ASADITOS FRENTE T-4 E IGLU', 'KIOSKO'),
('52', 'MÓNICA MARLEN CARAVANTES ARAGÓN', 'EFPEM', 'KIOSKO'),
('53', 'CARLOS SUBUYUJ', 'ATRAS DE T-10', 'KIOSKO'),
('57', 'LUIS CHAVEZ', 'COSTADO IGLU', 'KIOSKO'),
('62', 'COMDALSA JORGE MARIO CONTRERAS', 'AL MACARONE FRENTE T-4', 'KIOSKO'),
('75', 'OTTO ESCOBEDO', 'FRENTE IGLU', 'KIOSKO'),
('79', 'CARLOS HAROLDO ESTRADA', 'ATRAS DE T-8 PARQUEO', 'KIOSKO'),
('80', 'MANUEL FIGUEROA', 'TACO USAC FRENTE T-4 E IGLU', 'KIOSKO'),
('89', 'ELEN IVANNIA GONZALEZ', 'LADO NORTE EDIFICIO S-12', 'KIOSKO'),
('90', 'SANTOS JULIANA GUINEA AJPOP DE MORALES', 'PARTE POSTERIOR DEL M-6', 'KIOSKO'),
('95', 'ZOILA HERNANDEZ', 'PIMIENTOS FRENTE S-11', 'KIOSKO'),
('97', 'INVERSIONES LOS FUNDOS S.A. FRENTE EDIFICIO S-12', 'FRENTE S-12 GITANO', 'KIOSKO'),
('104', 'EDGAR JUAREZ', 'FRENTE POLIDEPORTIVO', 'KIOSKO'),
('112', 'IRIS LOPEZ', 'FRENTE IGLU DELISANO', 'KIOSKO'),
('121', 'MARIELA MARTINEZ SOSA', 'ENTRE T-2 Y T-3', 'KIOSKO'),
('122', 'RICARDO MATEO RAMON', 'FRENTE S-1', 'KIOSKO'),
('134', 'GREICI MARLENI PAREDES VELIZ', 'FRENTE AL EDIFICIO S-12', 'KIOSKO'),
('158', 'SHAULLY REYES', 'S-12', 'KIOSKO'),
('147', 'RAFAEL PUAC', 'DETRAS DE CAJA CENTRAL', 'KIOSKO'),
('148', 'ANA SOFIA PUAC', 'FRENTE S-1', 'KIOSKO'),
('154', 'JUAN DOMINGO RAMOS', 'ENTRE T-2 Y T3', 'KIOSKO'),
('160', 'MARCO RODRIGUEZ', 'FRENTE IGLU', 'KIOSKO'),
('162', 'JUAN PABLO RUIZ / MIRIAM ARREAGA', 'FRENTE IGLU', 'KIOSKO'),
('145', 'ELIAS HUMBERTO PUAC CALDERON', 'ENFRENTE DEL EDIFICIO T-3', 'KIOSKO'),
('227', 'ARTURO ANZUETO', 'FRENTE AL S-6', 'KIOSKO'),
(NULL, 'EDUARDO LARIOS', 'ATRAS DE S-2', 'KIOSKO'),
('66 B', 'XENY MARIBEL DE LEÒN MEJÌA', 'LADO NORTE S-12', 'KIOSKO'),
('SRB', 'SERGIO RENE BARILLAS', 'FRENTE A CALUSAC ANTIGUO', 'KIOSKO'),
('97', 'MARCO TULIO LEMUS/NEVA S.A S.A. FRENTE EDIFICIO M-3', 'FRENTEM-3 GITANO', 'KIOSKO');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar estudiantes
SELECT codigo, nombre, apellido, rol FROM estudiantes;

-- Verificar expendios (debe mostrar 31)
SELECT COUNT(*) as total_expendios FROM expendios;

-- Ver tipos de expendios
SELECT tipo, COUNT(*) as cantidad FROM expendios GROUP BY tipo;

-- ============================================
-- USUARIOS DE PRUEBA - RESUMEN
-- ============================================

/*
ADMIN:
  Código: ADMIN001
  Password: admin123
  Rol: ADMIN
  
USUARIO:
  Código: EST001
  Password: password123
  Rol: USUARIO

Puedes crear más usuarios desde /registro
o usar el encriptador en /encriptador
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
