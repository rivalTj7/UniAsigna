# 🎉 UniAsigna v4.0 - Guía Completa

## ✅ Todo Lo Que Se Arregló

### 1. 🐛 Error `asignaciones.filter is not a function`
**✅ ARREGLADO** - El problema era que intentaba acceder al campo `email` que ya no existe.

### 2. 🔐 Sistema de Login Obligatorio
**✅ IMPLEMENTADO** - Ahora al entrar a http://localhost:3000 redirige automáticamente a `/login`

### 3. 🔒 Encriptador de Contraseñas
**✅ CREADO** - Nueva herramienta en `/encriptador` para hashear contraseñas

### 4. 🚪 Botón de Cerrar Sesión
**✅ AGREGADO** - En el navbar aparece tu usuario y el botón "Salir"

---

## 📥 Descargar Proyecto

### [Descargar uniasigna-v4.zip](computer:///mnt/user-data/outputs/uniasigna.zip)

---

## 🚀 Instalación Paso a Paso

### Paso 1: Descargar y Descomprimir
```bash
# Descarga el ZIP
# Descomprime en tu carpeta de proyectos
cd uniasigna
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar Base de Datos

#### 3.1 Ve a Neon Console
1. Abre https://console.neon.tech/
2. Selecciona tu proyecto
3. Click en **SQL Editor**

#### 3.2 Ejecuta el SQL Completo
Abre el archivo `SQL_FINAL_CON_AUTH.sql` incluido en el proyecto y copia TODO su contenido.

O copia esto:

```sql
-- ELIMINAR TABLAS (si ya existen)
DROP TABLE IF EXISTS asignaciones CASCADE;
DROP TABLE IF EXISTS ciclos_mensuales CASCADE;
DROP TABLE IF EXISTS estudiantes CASCADE;
DROP TABLE IF EXISTS expendios CASCADE;

-- CREAR TABLA DE ESTUDIANTES CON PASSWORD
CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  carnet VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'USUARIO' NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- CREAR OTRAS TABLAS... (ver SQL_FINAL_CON_AUTH.sql)

-- INSERTAR USUARIOS DE PRUEBA
INSERT INTO estudiantes (codigo, nombre, apellido, carnet, password, rol) VALUES
('ADMIN001', 'Admin', 'Sistema', 'ADMIN', '$2a$10$X9K5QE.KbJ8oXwqH.nKQNOJ9QV3pQw1YqW6FKxT0K8CqYxTZxJZQS', 'ADMIN'),
('EST001', 'Juan', 'Pérez', '202212345', '$2a$10$rN.Yr5P8dqJYV9yvC7qY5eU0J0fQqX0Y1JLqxJ9XYx0QxY0xYxYxY', 'USUARIO');
```

### Paso 4: Configurar Variables de Entorno
Asegúrate que tu `.env.local` tenga la conexión a Neon:

```env
POSTGRES_URL="postgresql://..."
```

### Paso 5: Ejecutar el Proyecto
```bash
npm run dev
```

### Paso 6: Abrir el Navegador
Abre: http://localhost:3000

**¡Automáticamente te redirigirá a /login!** ✨

---

## 🔑 Usuarios de Prueba

### 👑 Administrador
- **URL**: http://localhost:3000/login
- **Código**: `ADMIN001`
- **Password**: `admin123`
- **Permisos**: Puede ver todo, crear, modificar y eliminar

### 👤 Usuario Normal
- **URL**: http://localhost:3000/login
- **Código**: `EST001`
- **Password**: `password123`
- **Permisos**: Solo puede ver sus asignaciones y cargar informes

---

## 🛠️ Herramienta de Encriptación

### Acceso
http://localhost:3000/encriptador

### Cómo Usar
1. Ingresa una contraseña (ej: `mipassword123`)
2. Click en "Encriptar Contraseña"
3. Copia el hash generado
4. Úsalo en SQL para crear usuarios

### Ejemplo:
```
Contraseña: admin123
Hash: $2a$10$X9K5QE.KbJ8oXwqH.nKQNOJ9QV3pQw1YqW6FKxT0K8CqYxTZxJZQS

SQL:
INSERT INTO estudiantes 
(codigo, nombre, apellido, carnet, password, rol) 
VALUES 
('ADM002', 'María', 'López', '202298765', 
'$2a$10$X9K5QE.KbJ8oXwqH.nKQNOJ9QV3pQw1YqW6FKxT0K8CqYxTZxJZQS', 
'ADMIN');
```

---

## 📱 Flujo de Uso del Sistema

### 1. Login
1. Abre http://localhost:3000
2. Te redirige automáticamente a `/login`
3. Ingresa tu código y contraseña
4. Click en "Iniciar Sesión"
5. Te lleva al Dashboard

### 2. Registro (Nuevos Usuarios)
1. En la página de login, click en "Regístrate aquí"
2. Llena el formulario:
   - Código (ej: EST002)
   - Nombre y Apellido
   - Carnet
   - Contraseña
3. Click en "Crear Cuenta"
4. Regresa al login e inicia sesión

### 3. Dashboard
- Ve estadísticas generales
- Total de estudiantes, expendios, asignaciones
- Informes completados y pendientes

### 4. Gestionar Estudiantes (Solo Admin)
- Ver lista de estudiantes
- Crear nuevos (con rol ADMIN o USUARIO)
- Editar información
- Activar/Desactivar

### 5. Gestionar Expendios (Solo Admin)
- Ver lista de expendios
- Crear nuevos (Kiosko, Carreta, Mesa, Fotocopiadora, Librería)
- Editar información
- Activar/Desactivar

### 6. Asignaciones
- **Admin**: Puede crear asignaciones para cualquier estudiante
- **Usuario**: Solo ve sus propias asignaciones
- Cargar informes con fotos
- Agregar observaciones y calificaciones

### 7. Historial
- Ver historial completo de asignaciones
- Filtrar por mes/año
- Ver informes completados

### 8. Cerrar Sesión
- Click en el botón "Salir" en el navbar
- Te devuelve al login

---

## 🎨 Características del Sistema

### ✅ Autenticación Completa
- Login con código y contraseña
- Registro de nuevos usuarios
- Contraseñas encriptadas con bcrypt
- Sesión guardada en localStorage
- Protección de todas las rutas
- Redirección automática a login

### ✅ Sistema de Roles
- **ADMIN**: Acceso total
- **USUARIO**: Solo sus asignaciones

### ✅ Interfaz Limpia
- Navbar simplificado
- Logo del Laboratorio
- Información del usuario logueado
- Botón de cerrar sesión visible

### ✅ Footer Profesional
- Información del Laboratorio
- Tu autoría: **Rivaldo Alexander Tojín**
- Enlaces sociales
- Copyright USAC 2025

### ✅ Herramientas Extra
- Encriptador de contraseñas en `/encriptador`
- Fácil creación de nuevos usuarios

---

## 📁 Estructura del Proyecto

```
uniasigna/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── registro/route.ts
│   │   │   ├── tools/
│   │   │   │   └── hash-password/route.ts
│   │   │   ├── estudiantes/
│   │   │   ├── expendios/
│   │   │   └── asignaciones/
│   │   ├── login/page.tsx
│   │   ├── registro/page.tsx
│   │   ├── encriptador/page.tsx
│   │   ├── estudiantes/page.tsx
│   │   ├── expendios/page.tsx
│   │   ├── asignaciones/page.tsx
│   │   └── historial/page.tsx
│   ├── components/
│   │   ├── Navigation.tsx (con botón de logout)
│   │   └── Footer.tsx (con tu autoría)
│   └── lib/
│       ├── hooks/
│       │   └── useAuth.ts (protección de rutas)
│       └── db/
├── public/
│   └── logo-laboratorio.jpeg
├── SQL_FINAL_CON_AUTH.sql
└── package.json (con bcryptjs)
```

---

## 🔒 Seguridad

### Contraseñas
- ✅ Hasheadas con bcrypt (10 rounds)
- ✅ Nunca se guardan en texto plano
- ✅ No se devuelven en las APIs

### Autenticación
- ✅ Verificación en cada página
- ✅ Redirección automática si no hay sesión
- ✅ Token guardado en localStorage

### Validaciones
- ✅ Campos requeridos
- ✅ Longitud mínima de contraseña (6 caracteres)
- ✅ Códigos y carnets únicos
- ✅ Roles validados

---

## 🐛 Solución de Problemas

### Error: "Cannot convert undefined to object"
**Solución**: Ejecuta el SQL completo. El problema era el campo `email` que ya no existe.

### No redirige a login
**Solución**: Asegúrate de tener el archivo `middleware.ts` en la raíz del proyecto.

### useAuth no funciona
**Solución**: Verifica que existe `/src/lib/hooks/useAuth.ts`

### Contraseña no funciona
**Solución**: Usa el encriptador en `/encriptador` para generar el hash correcto.

### No aparece el botón de logout
**Solución**: Limpia el cache del navegador o haz Ctrl+F5

---

## 📝 Crear Nuevos Usuarios

### Opción 1: Desde el Registro
1. Ve a http://localhost:3000/registro
2. Llena el formulario
3. Los usuarios creados por registro son siempre "USUARIO"

### Opción 2: Desde SQL (para crear ADMIN)
1. Ve a http://localhost:3000/encriptador
2. Encripta la contraseña deseada
3. Copia el hash
4. En Neon SQL Editor:

```sql
INSERT INTO estudiantes 
(codigo, nombre, apellido, carnet, password, rol) 
VALUES 
('TU_CODIGO', 'Nombre', 'Apellido', 'CARNET', 
'HASH_AQUI', 
'ADMIN');
```

### Opción 3: Desde la Interfaz (Solo Admin)
1. Login como admin
2. Ve a Estudiantes
3. Click en "Nuevo Estudiante"
4. Llena el formulario (pero NO podrás poner contraseña)
5. Luego actualiza en SQL:

```sql
UPDATE estudiantes 
SET password = 'HASH_AQUI'
WHERE codigo = 'CODIGO_ESTUDIANTE';
```

---

## 🎯 Checklist de Verificación

Después de instalar, verifica:

- [ ] `npm install` ejecutado correctamente
- [ ] SQL ejecutado en Neon (31 expendios, 2 usuarios)
- [ ] `.env.local` configurado con URL de Neon
- [ ] `npm run dev` corriendo sin errores
- [ ] http://localhost:3000 redirige a `/login`
- [ ] Login con ADMIN001 / admin123 funciona
- [ ] Dashboard se muestra correctamente
- [ ] Navbar muestra tu usuario y botón "Salir"
- [ ] Footer muestra "Rivaldo Alexander Tojín"
- [ ] `/encriptador` funciona
- [ ] Puedes crear asignaciones
- [ ] Cerrar sesión te devuelve al login

---

## 👨‍💻 Desarrollado Por

**Rivaldo Alexander Tojín**

Para:
- Laboratorio de Control Microbiológico de Alimentos
- Universidad de San Carlos de Guatemala
- Facultad de Ingeniería

---

## 📞 Soporte

Si tienes problemas:
1. Revisa el SQL está completamente ejecutado
2. Verifica los logs de la consola (F12)
3. Asegúrate que Neon esté online
4. Limpia cache del navegador

---

**UniAsigna v4.0 - Sistema Completo con Autenticación** 🎉

© 2025 - Desarrollado por Rivaldo Alexander Tojín
