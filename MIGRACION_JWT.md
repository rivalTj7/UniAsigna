# 🔐 Migración a Autenticación JWT con Cookies

## ✅ Cambios Implementados

### 1. **Instalación de Dependencias**
```bash
npm install jsonwebtoken @types/jsonwebtoken cookies-next@^4.2.1
```

### 2. **Nueva Estructura de Autenticación**

#### Servidor (`src/lib/auth/jwt.ts`)
- `generateToken()` - Genera JWT tokens
- `verifyToken()` - Verifica y decodifica tokens
- `setAuthCookie()` - Establece cookie httpOnly
- `getAuthToken()` - Obtiene token de la cookie
- `clearAuthCookie()` - Elimina cookie de autenticación
- `getCurrentUser()` - Obtiene usuario actual desde token

#### Cliente (`src/lib/auth/client.ts`)
- `getCurrentUser()` - Obtiene usuario vía API /auth/me
- `logout()` - Cierra sesión y limpia cookies

### 3. **Nuevos Endpoints API**

#### `/api/auth/me` (GET)
Obtiene el usuario actual desde la cookie httpOnly
```typescript
Response: { user: JWTPayload } | { error: string }
```

#### `/api/auth/logout` (POST)
Cierra sesión y elimina la cookie
```typescript
Response: { success: true, message: string }
```

#### `/api/auth/login` (POST) - ACTUALIZADO
Ahora genera JWT y establece cookie httpOnly automáticamente

### 4. **Hook useAuth Actualizado**
- ✅ Ya NO usa localStorage (seguridad mejorada)
- ✅ Obtiene usuario desde cookies vía API
- ✅ Incluye estado de loading
- ✅ Redirección automática si no hay sesión
- ✅ Control de permisos por rol

### 5. **Componentes Actualizados**
- ✅ `Navigation.tsx` - Usa nuevo sistema de auth con modal de confirmación
- ✅ `login/page.tsx` - Ya NO guarda en localStorage
- ✅ Hook `useAuth` - Completamente rediseñado

---

## 🔒 Beneficios de Seguridad

### Antes (localStorage)
❌ Vulnerable a ataques XSS  
❌ Accesible desde JavaScript  
❌ No expira automáticamente  
❌ Se envía en todas las peticiones manualmente  

### Ahora (httpOnly Cookies)
✅ **Inmune a XSS** - JavaScript no puede acceder  
✅ **Envío automático** - El navegador las envía en cada request  
✅ **Expiración automática** - 7 días por defecto  
✅ **Secure flag** - Solo HTTPS en producción  
✅ **SameSite protection** - Protege contra CSRF  

---

## 🚀 Configuración en Producción

### 1. Generar JWT_SECRET seguro
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. En Vercel (Variables de Entorno)
```
JWT_SECRET=<tu-secret-generado-aquí>
NODE_ENV=production
```

### 3. Configuración de Cookies
Las cookies se configuran automáticamente:
- **httpOnly**: true (no accesible desde JS)
- **secure**: true en producción (solo HTTPS)
- **sameSite**: 'lax' (protección CSRF)
- **maxAge**: 7 días
- **path**: '/' (disponible en toda la app)

---

## 📋 Checklist de Migración

- [x] Instalar dependencias JWT
- [x] Crear utilidades JWT (servidor)
- [x] Crear utilidades cliente
- [x] Crear endpoint /api/auth/me
- [x] Crear endpoint /api/auth/logout
- [x] Actualizar endpoint /api/auth/login
- [x] Actualizar hook useAuth
- [x] Actualizar Navigation.tsx
- [x] Actualizar login/page.tsx
- [x] Documentar variables de entorno
- [ ] **PENDIENTE**: Agregar JWT_SECRET a .env.local
- [ ] **PENDIENTE**: Proteger APIs con middleware (Fase 5)

---

## ⚠️ Importante

1. **Agregar JWT_SECRET a .env.local**
   ```bash
   JWT_SECRET=<generar-con-comando-anterior>
   ```

2. **En Vercel**: Agregar JWT_SECRET en Settings → Environment Variables

3. **Usuarios existentes**: Necesitarán volver a iniciar sesión

4. **localStorage**: Ya NO se usa - las sesiones antiguas quedarán inválidas

---

## 🔜 Siguiente Paso: Fase 5

**Middleware de Protección API**
- Proteger todas las rutas API
- Verificar JWT en cada request
- Rechazar peticiones sin autenticación
- Inyectar usuario en contexto del request

---

## 📝 Notas Técnicas

### Token JWT Contiene:
```typescript
{
  id: number,
  codigo: string,
  nombre: string,
  apellido: string,
  carnet: string,
  rol: 'ADMIN' | 'USUARIO',
  iat: number,      // Issued at
  exp: number       // Expiration (7 días)
}
```

### Flujo de Autenticación:
1. Usuario envía credenciales → `/api/auth/login`
2. Servidor valida, genera JWT
3. JWT se guarda en cookie httpOnly
4. Navegador envía cookie automáticamente en cada request
5. APIs verifican JWT y procesan request
6. Frontend obtiene datos vía `/api/auth/me`
