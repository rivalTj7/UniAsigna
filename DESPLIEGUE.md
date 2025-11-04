# 🚀 Guía Rápida de Despliegue - UniAsigna

## Pasos para Desplegar en Vercel (5-10 minutos)

### 1. Preparar el Código en GitHub

```bash
# Navega a la carpeta del proyecto
cd uniasigna

# Inicializa git (si no está inicializado)
git init

# Agrega todos los archivos
git add .

# Haz el primer commit
git commit -m "Initial commit - UniAsigna"

# Crea el repositorio en GitHub y conecta
git remote add origin https://github.com/TU-USUARIO/uniasigna.git
git branch -M main
git push -u origin main
```

### 2. Desplegar en Vercel

#### Opción A: Desde la Web (Más Fácil)

1. Ve a [vercel.com](https://vercel.com) y haz login con GitHub
2. Click en "Add New..." → "Project"
3. Busca tu repositorio "uniasigna" e importalo
4. Vercel detectará automáticamente que es Next.js
5. **NO necesitas configurar nada**, solo click en "Deploy"
6. ¡Espera 1-2 minutos y tu app estará en línea!

#### Opción B: Desde Terminal

```bash
# Instala Vercel CLI
npm i -g vercel

# Login
vercel login

# Despliega
vercel

# Sigue las instrucciones en pantalla
```

### 3. Configurar Base de Datos PostgreSQL

Una vez desplegado tu proyecto:

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto "uniasigna"
3. Click en la pestaña "Storage"
4. Click en "Create Database"
5. Selecciona "Postgres" → "Continue"
6. Selecciona "Neon" (es gratis)
7. Dale un nombre (por ejemplo: "uniasigna-db")
8. Click en "Create"

**¡Listo!** Vercel conectará automáticamente tu base de datos con tu aplicación.

### 4. Inicializar Tablas y Datos

Ahora necesitas crear las tablas en tu base de datos:

#### Opción 1: Usar la Consola de Neon

1. En Vercel Storage, click en tu base de datos
2. Click en "Open in Neon"
3. Ve a la pestaña "SQL Editor"
4. Copia y pega el siguiente SQL:

```sql
-- Crear tabla de estudiantes
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

-- Crear tabla de expendios
CREATE TABLE IF NOT EXISTS expendios (
  id SERIAL PRIMARY KEY,
  archivo VARCHAR(50),
  nombre_propietario VARCHAR(200) NOT NULL,
  ubicacion VARCHAR(200) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'KIOSKO' NOT NULL,
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
```

5. Click en "Run" para ejecutar
6. ¡Tablas creadas!

#### Opción 2: Poblar con Expendios Iniciales

Para cargar los 31 expendios del Excel, ejecuta este SQL también:

```sql
-- Insertar expendios iniciales
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
```

### 5. ¡Listo! 🎉

Tu aplicación está en línea en: `https://tu-proyecto.vercel.app`

Ahora puedes:
- ✅ Agregar estudiantes
- ✅ Gestionar expendios
- ✅ Crear asignaciones
- ✅ Cargar informes
- ✅ Ver historial

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel desplegará automáticamente los cambios en segundos.

## 🆘 Solución de Problemas

### Error: "Cannot find module..."
```bash
npm install
```

### Error de base de datos
- Verifica que la base de datos esté conectada en Vercel Storage
- Revisa que las tablas estén creadas

### La app no carga
- Revisa los logs en Vercel Dashboard → Tu Proyecto → Deployments → Click en el último → View Function Logs

## 📧 Contacto

Si tienes problemas, abre un Issue en GitHub o contacta al administrador.

---

**¡Disfruta UniAsigna! 🚀**
