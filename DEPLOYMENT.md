# 🚀 Guía de Despliegue a Producción - UniAsigna

## ✅ Checklist Pre-Despliegue

### 1. Variables de Entorno CRÍTICAS

**IMPORTANTE:** Antes de desplegar, configura estas variables de entorno en tu plataforma (Vercel/otro):

#### Variables de Base de Datos (Vercel Postgres)
```bash
POSTGRES_URL="tu-url-de-postgres"
POSTGRES_PRISMA_URL="tu-prisma-url"
POSTGRES_URL_NO_SSL="tu-url-no-ssl"
POSTGRES_URL_NON_POOLING="tu-url-non-pooling"
POSTGRES_USER="tu-usuario"
POSTGRES_HOST="tu-host"
POSTGRES_PASSWORD="tu-password"
POSTGRES_DATABASE="tu-database"
```

#### JWT Secret (CRÍTICO - GENERAR NUEVO)
```bash
# Generar un JWT_SECRET seguro:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Luego configurar:
JWT_SECRET="tu-jwt-secret-super-seguro-de-128-caracteres"
```

⚠️ **NUNCA uses el JWT_SECRET del .env.example en producción**

---

## 📋 Pasos para Desplegar en Vercel

### Paso 1: Preparar el Proyecto
```bash
# Asegurarse de que todo funciona localmente
npm run build
npm run start

# Verificar que no hay errores de TypeScript
npm run lint
```

### Paso 2: Configurar Vercel

1. **Conectar Repositorio:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Selecciona el proyecto

2. **Configurar Base de Datos:**
   - En Vercel Dashboard → Storage → Create Database
   - Selecciona "Postgres"
   - Las variables de entorno se configuran automáticamente

3. **Configurar Variables de Entorno:**
   - Ve a Settings → Environment Variables
   - Añade `JWT_SECRET` con un valor generado (ver arriba)
   - Verifica que todas las variables de Postgres estén presentes

4. **Ejecutar Migraciones:**
   ```bash
   # Una vez desplegado, ejecuta las migraciones:
   npm run db:push
   ```

### Paso 3: Crear Usuario Admin Inicial

Después del primer despliegue, necesitas crear un usuario administrador:

```bash
# Conectar a tu base de datos y ejecutar:
INSERT INTO estudiantes (codigo, nombre, apellido, carnet, password, rol, activo)
VALUES (
  'ADMIN001',
  'Admin',
  'Sistema',
  'admin',
  -- Password hasheado de 'admin123' (CÁMBIALO después del primer login)
  '$2a$10$ejemplo_hash_bcrypt',
  'ADMIN',
  true
);
```

O usa el endpoint protegido una vez logueado como admin.

---

## 🔒 Seguridad Post-Despliegue

### Verificaciones de Seguridad

✅ **1. Endpoints Protegidos**
Todos los endpoints críticos están protegidos con JWT:
- `/api/estudiantes` - Solo ADMIN
- `/api/expendios` - Solo ADMIN
- `/api/asignaciones` - ADMIN + USUARIO (filtrado por rol)
- `/api/dashboard/stats` - ADMIN + USUARIO (datos filtrados)

✅ **2. JWT en httpOnly Cookies**
- Los tokens no son accesibles desde JavaScript
- Protección contra XSS

✅ **3. Validación de Roles**
- Backend valida roles en cada request
- Frontend oculta UI según rol

✅ **4. Contraseñas Hasheadas**
- Bcrypt con 10 rounds
- Nunca se almacenan passwords en texto plano

---

## 🔧 Configuración Adicional Recomendada

### Rate Limiting (Opcional pero Recomendado)

Para proteger contra ataques de fuerza bruta, considera añadir rate limiting:

```bash
npm install @upstash/ratelimit @upstash/redis
```

### CORS Headers

En `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || '*' },
        ],
      },
    ]
  },
}
```

### Monitoreo

Configura monitoreo de errores con:
- Vercel Analytics (incluido)
- Sentry (opcional para error tracking)

---

## 📊 Verificación Post-Despliegue

### Checklist de Verificación

- [ ] El sitio carga correctamente
- [ ] Login funciona
- [ ] Dashboard muestra datos según rol
- [ ] ADMIN puede crear/editar/eliminar
- [ ] USUARIO solo ve sus datos
- [ ] Logout funciona correctamente
- [ ] Cookies se establecen correctamente
- [ ] No hay errores en la consola del servidor
- [ ] Base de datos responde correctamente

### Testing de Seguridad

Prueba estos escenarios:

1. **Sin autenticación:**
   ```bash
   curl https://tu-dominio.vercel.app/api/estudiantes
   # Debe retornar 401 Unauthorized
   ```

2. **Como USUARIO intentando acceder a ruta ADMIN:**
   - Intenta acceder a `/estudiantes` como USUARIO
   - Debe redirigir a `/`

3. **Manipulación de Cookies:**
   - Intenta modificar el token JWT
   - Debe invalidar la sesión

---

## 🐛 Troubleshooting

### Error: "No autenticado"
- Verifica que `JWT_SECRET` esté configurado en Vercel
- Verifica que las cookies no estén bloqueadas

### Error: "Database connection failed"
- Verifica que todas las variables POSTGRES_* estén configuradas
- Ejecuta `npm run db:push` para aplicar migraciones

### Error: 500 en producción pero funciona local
- Revisa logs en Vercel Dashboard → Logs
- Verifica que todas las variables de entorno estén presentes

---

## 📞 Soporte

Para problemas o preguntas:
- Revisa los logs en Vercel Dashboard
- Verifica la configuración de variables de entorno
- Consulta la documentación de Next.js 14

---

## 🎉 ¡Todo Listo!

Una vez completados todos estos pasos, tu aplicación estará:
- ✅ Desplegada en producción
- ✅ Segura con JWT y roles
- ✅ Con base de datos configurada
- ✅ Lista para usuarios reales

**¡Felicitaciones por tu despliegue! 🚀**
