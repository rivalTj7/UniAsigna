# 📁 Estructura del Proyecto UniAsigna

## 🗂️ Organización de Archivos

```
uniasigna/
├── 📄 README.md                    # Documentación principal
├── 📄 DESPLIEGUE.md               # Guía de despliegue
├── 📄 package.json                # Dependencias del proyecto
├── 📄 tsconfig.json               # Configuración de TypeScript
├── 📄 next.config.js              # Configuración de Next.js
├── 📄 tailwind.config.js          # Configuración de Tailwind CSS
├── 📄 drizzle.config.ts           # Configuración de Drizzle ORM
├── 📄 .gitignore                  # Archivos ignorados por Git
├── 📄 .env.example                # Ejemplo de variables de entorno
│
├── 📂 src/                        # Código fuente
│   ├── 📂 app/                    # Rutas y páginas (App Router)
│   │   ├── 📄 layout.tsx          # Layout principal
│   │   ├── 📄 page.tsx            # Dashboard (/)
│   │   ├── 📄 globals.css         # Estilos globales
│   │   │
│   │   ├── 📂 api/                # API Routes (Backend)
│   │   │   ├── 📂 estudiantes/
│   │   │   │   ├── 📄 route.ts   # GET/POST estudiantes
│   │   │   │   └── 📂 [id]/
│   │   │   │       └── 📄 route.ts # GET/PUT/DELETE por ID
│   │   │   │
│   │   │   ├── 📂 expendios/
│   │   │   │   ├── 📄 route.ts
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   └── 📂 disponibles/
│   │   │   │       └── 📄 route.ts # Expendios no asignados
│   │   │   │
│   │   │   ├── 📂 asignaciones/
│   │   │   │   ├── 📄 route.ts
│   │   │   │   └── 📂 [id]/
│   │   │   │       └── 📄 route.ts
│   │   │   │
│   │   │   └── 📂 dashboard/
│   │   │       └── 📂 stats/
│   │   │           └── 📄 route.ts # Estadísticas
│   │   │
│   │   ├── 📂 estudiantes/
│   │   │   └── 📄 page.tsx        # Página de estudiantes
│   │   │
│   │   ├── 📂 expendios/
│   │   │   └── 📄 page.tsx        # Página de expendios
│   │   │
│   │   ├── 📂 asignaciones/
│   │   │   └── 📄 page.tsx        # Página de asignaciones
│   │   │
│   │   └── 📂 historial/
│   │       └── 📄 page.tsx        # Página de historial
│   │
│   ├── 📂 components/             # Componentes reutilizables
│   │   └── 📄 Navigation.tsx      # Barra de navegación
│   │
│   ├── 📂 lib/                    # Utilidades y configuración
│   │   ├── 📂 db/
│   │   │   ├── 📄 index.ts        # Conexión a DB
│   │   │   └── 📄 schema.ts       # Esquema de tablas
│   │   │
│   │   └── 📂 utils/
│   │       └── 📄 dates.ts        # Utilidades de fechas
│   │
│   └── 📂 types/                  # Tipos TypeScript (opcional)
│
└── 📂 scripts/                    # Scripts de utilidad
    ├── 📄 init-db.ts              # Inicializar base de datos
    └── 📄 seed.ts                 # Poblar con datos iniciales
```

## 🔑 Archivos Clave

### Frontend

- **`src/app/page.tsx`**: Dashboard principal con estadísticas
- **`src/app/estudiantes/page.tsx`**: CRUD de estudiantes
- **`src/app/expendios/page.tsx`**: CRUD de expendios
- **`src/app/asignaciones/page.tsx`**: Crear asignaciones y cargar informes
- **`src/app/historial/page.tsx`**: Ver historial de meses anteriores

### Backend (API Routes)

- **`src/app/api/estudiantes/route.ts`**: Obtener todos y crear estudiantes
- **`src/app/api/estudiantes/[id]/route.ts`**: Operaciones por ID
- **`src/app/api/expendios/route.ts`**: Obtener todos y crear expendios
- **`src/app/api/expendios/disponibles/route.ts`**: **IMPORTANTE** - Obtiene solo los expendios NO asignados en el mes actual
- **`src/app/api/asignaciones/route.ts`**: Crear y listar asignaciones
- **`src/app/api/asignaciones/[id]/route.ts`**: Actualizar informes

### Base de Datos

- **`src/lib/db/schema.ts`**: Define las 4 tablas principales:
  - `estudiantes`
  - `expendios`
  - `asignaciones` (con constraint único: expendio + mes + año)
  - `ciclos_mensuales`

### Utilidades

- **`src/lib/utils/dates.ts`**: Funciones para manejar fechas y ciclos mensuales

## 🔄 Flujo de Datos

### 1. Crear Asignación

```
Usuario selecciona estudiante + expendio
    ↓
POST /api/asignaciones
    ↓
Verifica que expendio NO esté asignado ese mes
    ↓
Crea asignación en DB
    ↓
Expendio desaparece de lista de disponibles
```

### 2. Obtener Expendios Disponibles

```
GET /api/expendios/disponibles
    ↓
Consulta mes y año actual
    ↓
Obtiene expendios YA asignados ese mes
    ↓
Devuelve expendios activos NO asignados
```

### 3. Cargar Informe

```
Usuario completa formulario de informe
    ↓
PUT /api/asignaciones/[id]
    ↓
Actualiza: informeCompletado = true
    ↓
Guarda observaciones, calificación, fecha
```

### 4. Reinicio Mensual (Automático)

```
Último día del mes 23:59
    ↓
Cierra ciclo actual
    ↓
TODOS los expendios vuelven disponibles
    ↓
Asignaciones anteriores → historial
    ↓
Nuevo ciclo comienza día 1
```

## 🎨 Sistema de Estilos

### Tailwind CSS

Usamos clases de utilidad predefinidas en `globals.css`:

```css
.btn             → Botón base
.btn-primary     → Botón primario (azul)
.btn-secondary   → Botón secundario (gris)
.btn-danger      → Botón peligro (rojo)
.btn-success     → Botón éxito (verde)

.card            → Tarjeta con sombra y padding

.input           → Input estilizado
.label           → Label de formulario

.badge           → Badge base
.badge-success   → Badge verde
.badge-warning   → Badge amarillo
.badge-danger    → Badge rojo
.badge-info      → Badge azul
```

### Colores Primarios

Definidos en `tailwind.config.js`:

```
primary-50  → #f0f9ff (muy claro)
primary-600 → #0284c7 (principal)
primary-700 → #0369a1 (hover)
```

## 📊 Base de Datos PostgreSQL

### Tablas

#### estudiantes
- `id` (SERIAL PRIMARY KEY)
- `nombre` (VARCHAR 100)
- `apellido` (VARCHAR 100)
- `carnet` (VARCHAR 20 UNIQUE)
- `email` (VARCHAR 100 UNIQUE)
- `telefono` (VARCHAR 20)
- `activo` (BOOLEAN)
- `fecha_creacion` (TIMESTAMP)

#### expendios
- `id` (SERIAL PRIMARY KEY)
- `archivo` (VARCHAR 50)
- `nombre_propietario` (VARCHAR 200)
- `ubicacion` (VARCHAR 200)
- `tipo` (VARCHAR 50)
- `activo` (BOOLEAN)
- `fecha_creacion` (TIMESTAMP)

#### asignaciones
- `id` (SERIAL PRIMARY KEY)
- `estudiante_id` (FK → estudiantes)
- `expendio_id` (FK → expendios)
- `mes` (INTEGER 1-12)
- `anio` (INTEGER)
- `fecha_asignacion` (TIMESTAMP)
- `informe_completado` (BOOLEAN)
- `fecha_informe` (TIMESTAMP)
- `observaciones` (TEXT)
- `calificacion` (VARCHAR 20)
- `foto_url` (VARCHAR 500)
- **CONSTRAINT**: UNIQUE (expendio_id, mes, anio)

#### ciclos_mensuales
- `id` (SERIAL PRIMARY KEY)
- `mes` (INTEGER)
- `anio` (INTEGER)
- `fecha_inicio` (TIMESTAMP)
- `fecha_fin` (TIMESTAMP)
- `activo` (BOOLEAN)
- `total_asignaciones` (INTEGER)
- **CONSTRAINT**: UNIQUE (mes, anio)

## 🔐 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ Constraints de DB para integridad
- ✅ Validación en frontend y backend
- ✅ SQL injection protection (Drizzle ORM)
- ✅ CORS configurado
- ✅ HTTPS por defecto (Vercel)

## 🚀 Performance

- ✅ Server-side rendering (Next.js)
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Edge functions (Vercel)
- ✅ PostgreSQL con índices optimizados
- ✅ Caching automático

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Breakpoints: sm, md, lg, xl
- ✅ Touch-friendly buttons
- ✅ Scrollable tables en móvil

## 🧪 Testing (Futuro)

Para implementar tests:

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

## 🔧 Comandos Útiles

```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run start        # Ejecutar build
npm run lint         # Linter
npm run db:push      # Push schema a DB
npm run db:studio    # Abrir Drizzle Studio
```

## 📈 Métricas y Analytics (Opcional)

Para agregar analytics:

1. Vercel Analytics (gratis)
2. Google Analytics
3. PostHog
4. Mixpanel

## 🎯 Próximas Mejoras

- [ ] Autenticación (NextAuth.js)
- [ ] Roles de usuario (admin, estudiante)
- [ ] Notificaciones por email
- [ ] Exportar reportes PDF
- [ ] Subir fotos de auditorías
- [ ] PWA (Progressive Web App)
- [ ] Dark mode
- [ ] Multiidioma

---

**Documentación creada para UniAsigna v1.0**
