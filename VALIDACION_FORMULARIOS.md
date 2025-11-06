# 📋 Guía de Validación de Formularios con React Hook Form

## ✅ Implementado en Este Proyecto

### **Dependencias Instaladas**
```bash
npm install react-hook-form zod @hookform/resolvers
```

### **Archivos Creados**

#### 1. **Esquemas de Validación** (`src/lib/validations/schemas.ts`)
Esquemas Zod completos para:
- ✅ `loginSchema` - Validación de inicio de sesión
- ✅ `registroSchema` - Validación de registro (con confirmación de contraseña)
- ✅ `estudianteSchema` - Validación de estudiantes
- ✅ `expendioSchema` - Validación de expendios
- ✅ `informeSchema` - Validación de informes de asignaciones

#### 2. **Formulario de Login Actualizado** (`src/app/login/page.tsx`)
- ✅ Implementación completa con react-hook-form
- ✅ Validación en tiempo real
- ✅ Mensajes de error específicos por campo
- ✅ Clases CSS condicionales para campos con error

---

## 🎯 Patrón de Implementación

### **Estructura Básica**

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tuSchema, type TuFormData } from '@/lib/validations/schemas';

export default function TuFormulario() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TuFormData>({
    resolver: zodResolver(tuSchema),
  });

  const onSubmit = async (data: TuFormData) => {
    // Tu lógica aquí
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campos del formulario */}
    </form>
  );
}
```

### **Patrón de Campo de Entrada**

```tsx
<div>
  <label className="label">Nombre del Campo</label>
  <input
    type="text"
    {...register('nombreCampo')}
    className={`input ${errors.nombreCampo ? 'border-red-500' : ''}`}
    placeholder="Placeholder..."
  />
  {errors.nombreCampo && (
    <p className="text-red-500 text-sm mt-1">
      {errors.nombreCampo.message}
    </p>
  )}
</div>
```

---

## 📝 Formularios Pendientes de Actualizar

### **1. Registro** (`src/app/registro/page.tsx`)

**Cambios necesarios:**
```typescript
// Importar
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registroSchema, type RegistroFormData } from '@/lib/validations/schemas';

// Configurar form
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<RegistroFormData>({
  resolver: zodResolver(registroSchema),
});

// Actualizar onSubmit
const onSubmit = async (data: RegistroFormData) => {
  // data ya contiene todos los campos validados
  const response = await fetch('/api/auth/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  // ...resto del código
};
```

**Campos a actualizar:**
- `codigo`, `nombre`, `apellido`, `carnet`, `password`, `confirmPassword`

---

### **2. Estudiantes** (`src/app/estudiantes/page.tsx`)

**Cambios necesarios:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { estudianteSchema, type EstudianteFormData } from '@/lib/validations/schemas';

const {
  register,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
} = useForm<EstudianteFormData>({
  resolver: zodResolver(estudianteSchema),
  defaultValues: {
    codigo: '',
    nombre: '',
    apellido: '',
    carnet: '',
    rol: 'USUARIO',
    activo: true,
  },
});
```

**Campos a actualizar:**
- `codigo`, `nombre`, `apellido`, `carnet`, `rol` (select), `activo` (checkbox)

**Nota:** Para editar, usar `reset(estudianteData)` o `setValue('campo', valor)`

---

### **3. Expendios** (`src/app/expendios/page.tsx`)

**Cambios necesarios:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expendioSchema, type ExpendioFormData } from '@/lib/validations/schemas';

const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<ExpendioFormData>({
  resolver: zodResolver(expendioSchema),
  defaultValues: {
    archivo: '',
    nombrePropietario: '',
    ubicacion: '',
    tipo: 'KIOSKO',
    activo: true,
  },
});
```

**Campos a actualizar:**
- `archivo`, `nombrePropietario`, `ubicacion`, `tipo` (select), `activo` (checkbox)

---

### **4. Asignaciones - Carga de Informe** (`src/app/asignaciones/page.tsx`)

**Cambios necesarios:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { informeSchema, type InformeFormData } from '@/lib/validations/schemas';

// Para el modal de informe
const {
  register: registerInforme,
  handleSubmit: handleSubmitInforme,
  reset: resetInforme,
  formState: { errors: errorsInforme },
} = useForm<InformeFormData>({
  resolver: zodResolver(informeSchema),
});
```

**Campos a actualizar:**
- `observaciones` (textarea), `calificacion` (number), `fotoUrl` (url opcional)

---

## 🎨 Estilos para Campos con Error

### **CSS en `globals.css`** (ya existente)

Los estilos actuales ya soportan la clase `border-red-500`:

```tsx
<input
  {...register('campo')}
  className={`input ${errors.campo ? 'border-red-500' : ''}`}
/>
```

### **Mensaje de Error Consistente**

```tsx
{errors.campo && (
  <p className="text-red-500 text-sm mt-1">
    {errors.campo.message}
  </p>
)}
```

---

## ✨ Beneficios de la Validación

### **Antes (sin validación)**
❌ Validación solo en backend  
❌ Errores genéricos  
❌ Mala UX - usuario debe enviar para ver errores  
❌ Sin feedback visual  

### **Ahora (con validación)**
✅ **Validación en tiempo real**  
✅ **Mensajes específicos por campo**  
✅ **Feedback visual inmediato** (bordes rojos)  
✅ **Validación en frontend + backend**  
✅ **TypeScript type-safe**  
✅ **Menos requests al servidor** (datos válidos antes de enviar)  

---

## 🔧 Casos Especiales

### **Select/Dropdown**
```tsx
<select
  {...register('rol')}
  className={`input ${errors.rol ? 'border-red-500' : ''}`}
>
  <option value="ADMIN">Administrador</option>
  <option value="USUARIO">Usuario</option>
</select>
```

### **Checkbox**
```tsx
<input
  type="checkbox"
  {...register('activo')}
  className="rounded"
/>
```

### **Number Input**
```tsx
<input
  type="number"
  {...register('calificacion', { valueAsNumber: true })}
  className={`input ${errors.calificacion ? 'border-red-500' : ''}`}
  min="0"
  max="100"
/>
```

### **Textarea**
```tsx
<textarea
  {...register('observaciones')}
  className={`textarea ${errors.observaciones ? 'border-red-500' : ''}`}
  rows={4}
/>
```

---

## 📊 Estado de Implementación

| Formulario | Estado | Ubicación |
|------------|--------|-----------|
| Login | ✅ **COMPLETADO** | `src/app/login/page.tsx` |
| Registro | ⏳ Pendiente | `src/app/registro/page.tsx` |
| Estudiantes | ⏳ Pendiente | `src/app/estudiantes/page.tsx` |
| Expendios | ⏳ Pendiente | `src/app/expendios/page.tsx` |
| Asignaciones (Informe) | ⏳ Pendiente | `src/app/asignaciones/page.tsx` |

---

## 🚀 Próximos Pasos

1. **Actualizar formulario de Registro** siguiendo el patrón de Login
2. **Actualizar formulario de Estudiantes** con validación completa
3. **Actualizar formulario de Expendios** con validación
4. **Actualizar carga de Informe** en Asignaciones
5. **Probar todos los formularios** con casos válidos e inválidos
6. **Ajustar estilos** si es necesario para consistencia

---

## 💡 Tips de Implementación

1. **Mantener el patrón:** Usa el mismo formato en todos los formularios
2. **Resetear después de submit:** `reset()` después de crear/actualizar
3. **Cargar datos al editar:** `reset(dataExistente)` al abrir modal de edición
4. **Validación backend:** SIEMPRE validar también en el backend por seguridad
5. **Mensajes claros:** Los mensajes de error deben ser específicos y útiles
6. **Testing:** Probar con datos inválidos para ver todos los errores

---

## 📚 Referencias

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Hook Form Resolvers](https://github.com/react-hook-form/resolvers)
