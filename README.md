# 🎓 UniAsigna

**Sistema de Asignación y Auditoría de Expendios Universitarios**

UniAsigna es una aplicación web completa que permite gestionar la asignación mensual de expendios universitarios a estudiantes para realizar auditorías, con reinicio automático de ciclo al finalizar cada mes.

## ✨ Características Principales

- 📊 **Dashboard**: Vista general con estadísticas en tiempo real
- 👥 **Gestión de Estudiantes**: CRUD completo de estudiantes
- 🏪 **Gestión de Expendios**: CRUD completo de expendios (kioscos)
- 📋 **Asignaciones Mensuales**: 
  - Asignar expendios a estudiantes
  - Un expendio solo puede asignarse a un estudiante por mes
  - Expendios asignados desaparecen de la lista de disponibles
- 📝 **Informes de Auditoría**: Los estudiantes pueden cargar sus informes
- 🔄 **Ciclo Automático**: Se reinicia el último día de cada mes a las 23:59
- 📜 **Historial Completo**: Registro de todas las asignaciones e informes pasados
- 🔍 **Búsqueda y Filtros**: En todas las secciones

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: PostgreSQL (Neon vía Vercel)
- **ORM**: Drizzle ORM
- **Hosting**: Vercel
- **Iconos**: Lucide React

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta en Vercel (gratuita)
- Cuenta en GitHub

## 🚀 Instalación Local

1. **Clonar el repositorio**:
```bash
git clone <tu-repo>
cd uniasigna
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:

Crea un archivo `.env.local` con las credenciales de tu base de datos PostgreSQL:

```env
POSTGRES_URL="tu-connection-string"
```

4. **Inicializar la base de datos**:

Las tablas se crearán automáticamente en el primer despliegue en Vercel. Si quieres poblar con los expendios iniciales:

```bash
npm run db:push
npx tsx scripts/seed.ts
```

5. **Ejecutar en desarrollo**:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Despliegue en Vercel (GRATUITO)

### Opción 1: Desde GitHub (Recomendada)

1. **Sube tu código a GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <tu-repo-url>
git push -u origin main
```

2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js

3. **Configura la Base de Datos**:
   - En el dashboard de Vercel, ve a tu proyecto
   - Click en "Storage" → "Create Database"
   - Selecciona "Postgres" (Neon)
   - Las variables de entorno se configurarán automáticamente

4. **Despliega**:
   - Click en "Deploy"
   - ¡Listo! Tu app estará en línea en segundos

### Opción 2: Desde CLI

```bash
npm i -g vercel
vercel login
vercel
```

## 🗄️ Estructura de la Base de Datos

### Tablas

- **estudiantes**: Información de los estudiantes
- **expendios**: Información de los expendios (kioscos)
- **asignaciones**: Relación entre estudiantes y expendios por mes
- **ciclos_mensuales**: Control de ciclos mensuales

### Restricciones Importantes

- Un expendio solo puede asignarse a **UN** estudiante por mes
- Los expendios asignados no aparecen en la lista de disponibles hasta el próximo ciclo
- El sistema reinicia automáticamente al finalizar cada mes

## 📱 Uso del Sistema

### 1. Registrar Estudiantes
- Ve a "Estudiantes"
- Click en "Nuevo Estudiante"
- Llena el formulario (carnet, nombre, email, etc.)

### 2. Registrar Expendios
- Ve a "Expendios"
- Click en "Nuevo Expendio"
- Llena el formulario (propietario, ubicación, tipo)

### 3. Crear Asignaciones
- Ve a "Asignaciones"
- Click en "Nueva Asignación"
- Selecciona un estudiante y un expendio disponible
- El expendio desaparecerá de la lista hasta el próximo mes

### 4. Cargar Informes
- En "Asignaciones", encuentra la asignación pendiente
- Click en "Cargar Informe"
- Completa calificación y observaciones
- Guarda el informe

### 5. Consultar Historial
- Ve a "Historial"
- Usa los filtros para buscar por mes, año, estudiante o estado
- Revisa todos los informes pasados

## 🔄 Ciclo Mensual Automático

El sistema está diseñado para reiniciarse automáticamente:

- **Último día del mes a las 23:59**: 
  - Se cierra el ciclo actual
  - Todos los expendios vuelven a estar disponibles
  - Las asignaciones anteriores se guardan en el historial
  - Comienza un nuevo ciclo el día 1 del siguiente mes

## 🎨 Personalización

### Colores
Edita `tailwind.config.js` para cambiar el tema de colores.

### Logo
El logo está en el componente `Navigation.tsx`. Puedes reemplazarlo con tu propia imagen.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👨‍💻 Autor

Creado con ❤️ para facilitar la gestión de auditorías universitarias.

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un Issue en GitHub
- Revisa la documentación de [Next.js](https://nextjs.org/docs)
- Consulta la documentación de [Vercel](https://vercel.com/docs)

## 🎯 Roadmap

- [ ] Sistema de notificaciones por email
- [ ] Exportación de reportes en PDF
- [ ] Dashboard con gráficas avanzadas
- [ ] Aplicación móvil
- [ ] Sistema de roles y permisos

---

**¡Gracias por usar UniAsigna! 🚀**
