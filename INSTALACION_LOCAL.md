# 🖥️ Instalación Local de UniAsigna

## Ejecutar en tu computadora (Desarrollo Local)

### 📋 Requisitos Previos

Antes de comenzar, necesitas tener instalado:

1. **Node.js 18+** 
   - Descarga: https://nodejs.org/
   - Verifica: `node --version`

2. **PostgreSQL** (una de estas opciones):
   - **Opción A (Más fácil)**: Neon (en la nube, gratis)
   - **Opción B**: PostgreSQL local instalado
   - **Opción C**: Docker con PostgreSQL

---

## 🚀 Instalación Paso a Paso

### 1️⃣ Descomprimir y Abrir el Proyecto

```bash
# Descomprime el archivo
unzip uniasigna.zip
# o
tar -xzf uniasigna.tar.gz

# Entra al directorio
cd uniasigna
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

Esto instalará todas las librerías necesarias (~2-3 minutos).

### 3️⃣ Configurar Base de Datos

Tienes **3 opciones** para la base de datos:

---

#### ⭐ OPCIÓN A: Neon (Recomendada - Más Fácil)

1. **Crea cuenta en Neon** (gratis, sin tarjeta):
   - Ve a: https://neon.tech/
   - Sign up con GitHub o email
   - Crea un nuevo proyecto

2. **Obtén el connection string**:
   - En el dashboard de Neon, copia tu connection string
   - Se ve así: `postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/neondb`

3. **Configura el .env**:
```bash
# Crea el archivo .env.local
cp .env.example .env.local
```

4. **Edita `.env.local`** y pega tu connection string:
```env
POSTGRES_URL="postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

5. **Inicializa las tablas**:

Abre la consola SQL de Neon y ejecuta este SQL:

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

---

#### OPCIÓN B: PostgreSQL Local

1. **Instala PostgreSQL**:
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **Crea la base de datos**:
```bash
# Inicia PostgreSQL
# Windows: Ya inicia automáticamente
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Crea la base de datos
createdb uniasigna

# O con psql:
psql -U postgres
CREATE DATABASE uniasigna;
\q
```

3. **Configura el .env.local**:
```env
POSTGRES_URL="postgresql://postgres:tu_password@localhost:5432/uniasigna"
```

4. **Ejecuta el SQL** del paso anterior en tu PostgreSQL local.

---

#### OPCIÓN C: Docker (PostgreSQL)

```bash
# Ejecutar PostgreSQL en Docker
docker run --name uniasigna-db \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=uniasigna \
  -p 5432:5432 \
  -d postgres:15

# Configura .env.local
POSTGRES_URL="postgresql://postgres:mypassword@localhost:5432/uniasigna"
```

Luego ejecuta el SQL de inicialización.

---

### 4️⃣ Ejecutar el Proyecto

```bash
npm run dev
```

Verás algo como:

```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### 5️⃣ ¡Abre tu Navegador!

Ve a: **http://localhost:3000**

¡Tu aplicación estará corriendo! 🎉

---

## 🧪 Verificación

### Prueba que todo funciona:

1. **Dashboard**: Debe cargar sin errores
2. **Estudiantes**: Click en "Nuevo Estudiante" y crea uno de prueba
3. **Expendios**: Deberías ver los 31 expendios cargados
4. **Asignaciones**: Crea una asignación de prueba
5. **Historial**: Debe mostrar la asignación creada

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

```bash
# Verifica que el connection string esté correcto
# Verifica que PostgreSQL esté corriendo

# Test de conexión:
psql "postgresql://usuario:password@host:5432/database"
```

### Error: "Module not found"

```bash
# Borra node_modules y reinstala
rm -rf node_modules
npm install
```

### Error: "Port 3000 already in use"

```bash
# Usa otro puerto
npm run dev -- -p 3001

# O mata el proceso en el puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Error: Tablas no existen

```bash
# Asegúrate de haber ejecutado el SQL de inicialización
# Conéctate a tu DB y verifica:
psql uniasigna
\dt
# Deberías ver: estudiantes, expendios, asignaciones, ciclos_mensuales
```

---

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción (local)
npm run build            # Construye para producción
npm run start            # Ejecuta build de producción

# Linter
npm run lint             # Revisa errores de código

# Database (si usas Drizzle Studio)
npm run db:studio        # Abre interfaz visual de la DB
```

---

## 🔄 Flujo de Trabajo Local

```
┌─────────────────┐
│ 1. npm install  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Config .env  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Init DB      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. npm run dev  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. localhost:   │
│    3000         │
└─────────────────┘
```

---

## 💡 Consejos

1. **Usa Neon** (Opción A) si no quieres instalar PostgreSQL localmente
2. **Hot reload**: Los cambios se reflejan automáticamente sin reiniciar
3. **Console logs**: Abre la consola del navegador (F12) para ver errores
4. **Network tab**: Revisa las llamadas a la API si algo falla
5. **VSCode**: Recomendado para mejor experiencia de desarrollo

---

## 🚀 Siguiente Paso: Desplegar a Producción

Una vez que todo funcione localmente, sigue **DESPLIEGUE.md** para ponerlo online en Vercel (gratis).

---

## ✅ Checklist de Instalación Local

- [ ] Node.js 18+ instalado
- [ ] Proyecto descomprimido
- [ ] `npm install` ejecutado
- [ ] Base de datos configurada (Neon/local/Docker)
- [ ] Archivo `.env.local` creado
- [ ] Connection string configurado
- [ ] Tablas de DB creadas
- [ ] Expendios insertados
- [ ] `npm run dev` ejecutado
- [ ] http://localhost:3000 abierto
- [ ] Dashboard carga correctamente
- [ ] Puede crear estudiante de prueba
- [ ] Ve los 31 expendios
- [ ] Puede crear asignación de prueba

Si marcaste todo ✅ → **¡Felicidades, todo funciona!** 🎉

---

**¿Necesitas ayuda?** Revisa la sección de solución de problemas o consulta README.md
