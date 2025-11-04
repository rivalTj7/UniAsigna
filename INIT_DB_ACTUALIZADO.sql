-- ============================================
-- SQL DE INICIALIZACIÓN - UniAsigna
-- Con Roles y Campos Actualizados
-- ============================================

-- Crear tabla de estudiantes (CON ROLES)
CREATE TABLE IF NOT EXISTS estudiantes (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  carnet VARCHAR(20) NOT NULL UNIQUE,
  rol VARCHAR(20) DEFAULT 'USUARIO' NOT NULL, -- ADMIN o USUARIO
  activo BOOLEAN DEFAULT true NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Crear tabla de expendios
CREATE TABLE IF NOT EXISTS expendios (
  id SERIAL PRIMARY KEY,
  archivo VARCHAR(50),
  nombre_propietario VARCHAR(200) NOT NULL,
  ubicacion VARCHAR(200) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'KIOSKO' NOT NULL, -- KIOSKO, CARRETA, MESA, FOTOCOPIADORA, LIBRERIA
  activo BOOLEAN DEFAULT true NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Crear tabla de asignaciones
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

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_asignaciones_mes_anio ON asignaciones(mes, anio);
CREATE INDEX IF NOT EXISTS idx_asignaciones_estudiante ON asignaciones(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_expendio ON asignaciones(expendio_id);
CREATE INDEX IF NOT EXISTS idx_estudiantes_rol ON estudiantes(rol);

-- Crear tabla de ciclos mensuales
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

-- ============================================
-- INSERTAR EXPENDIOS INICIALES (31 de tu Excel)
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
-- CREAR USUARIO ADMINISTRADOR DE PRUEBA
-- ============================================

INSERT INTO estudiantes (codigo, nombre, apellido, carnet, rol) VALUES
('ADMIN001', 'Admin', 'Sistema', 'ADMIN', 'ADMIN');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar estudiantes
SELECT * FROM estudiantes;

-- Verificar expendios (debe mostrar 31)
SELECT COUNT(*) as total_expendios FROM expendios;

-- Verificar tipos de expendios
SELECT DISTINCT tipo FROM expendios;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
