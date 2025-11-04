# ✅ Checklist de Verificación - UniAsigna

## 📋 Pre-Despliegue

- [ ] Código subido a GitHub
- [ ] Repositorio público o privado creado
- [ ] Cuenta de Vercel creada/activa
- [ ] Git configurado correctamente

## 🚀 Durante el Despliegue

### Vercel
- [ ] Proyecto importado desde GitHub
- [ ] Build exitoso (sin errores)
- [ ] Deploy completado
- [ ] URL de producción generada

### Base de Datos
- [ ] Base de datos PostgreSQL creada
- [ ] Neon integrado con Vercel
- [ ] Variables de entorno configuradas automáticamente
- [ ] SQL de inicialización ejecutado
- [ ] Tablas creadas correctamente:
  - [ ] estudiantes
  - [ ] expendios
  - [ ] asignaciones
  - [ ] ciclos_mensuales
- [ ] Datos iniciales cargados (31 expendios)

## ✨ Post-Despliegue

### Verificación de Funcionalidad

#### 1. Dashboard
- [ ] La página principal carga correctamente
- [ ] Se muestran las 4 tarjetas de estadísticas
- [ ] Los números son correctos (0 al inicio)
- [ ] La barra de progreso funciona
- [ ] Los enlaces rápidos funcionan

#### 2. Estudiantes
- [ ] Página de estudiantes carga
- [ ] Botón "Nuevo Estudiante" funciona
- [ ] Se puede crear un estudiante de prueba:
  - [ ] Nombre: Juan
  - [ ] Apellido: Pérez
  - [ ] Carnet: 202212345
  - [ ] Email: juan@test.com
- [ ] El estudiante aparece en la lista
- [ ] Se puede editar el estudiante
- [ ] Se puede buscar por nombre/carnet
- [ ] Badge de estado "Activo" visible

#### 3. Expendios
- [ ] Página de expendios carga
- [ ] Se muestran los 31 expendios precargados
- [ ] Botón "Nuevo Expendio" funciona
- [ ] Se puede crear un expendio de prueba
- [ ] Se puede editar un expendio
- [ ] Se puede buscar por ubicación/propietario
- [ ] Todos los expendios muestran tipo "KIOSKO"

#### 4. Asignaciones
- [ ] Página de asignaciones carga
- [ ] Se muestra el mes y año actual
- [ ] Las 3 tarjetas de estadísticas funcionan
- [ ] Botón "Nueva Asignación" funciona
- [ ] Modal de asignación se abre
- [ ] Dropdown de estudiantes muestra estudiantes activos
- [ ] Dropdown de expendios muestra solo disponibles
- [ ] Se puede crear una asignación de prueba
- [ ] La asignación aparece en la lista
- [ ] Badge "Pendiente" visible
- [ ] Botón "Cargar Informe" funciona
- [ ] Modal de informe se abre
- [ ] Se puede completar un informe:
  - [ ] Calificación seleccionable
  - [ ] Observaciones requeridas
  - [ ] Se guarda correctamente
- [ ] Badge cambia a "Completado"
- [ ] Se muestran los detalles del informe

#### 5. Historial
- [ ] Página de historial carga
- [ ] Se muestran las asignaciones creadas
- [ ] Filtros funcionan:
  - [ ] Por año
  - [ ] Por mes
  - [ ] Por estado (completado/pendiente)
- [ ] Búsqueda funciona
- [ ] Asignaciones agrupadas por mes/año
- [ ] Botón "Limpiar filtros" funciona

#### 6. Navegación
- [ ] Todos los enlaces del menú funcionan
- [ ] Logo redirige al dashboard
- [ ] Página activa se resalta correctamente
- [ ] Responsive en móvil

### Verificación de Reglas de Negocio

#### Expendios Disponibles
- [ ] Crear asignación con expendio X
- [ ] Verificar que expendio X ya NO aparece en disponibles
- [ ] Intentar asignar mismo expendio → debe dar error
- [ ] Crear estudiante nuevo
- [ ] Verificar que expendio X sigue sin aparecer
- [ ] ✅ Expendio desaparece correctamente

#### Informes
- [ ] Crear asignación sin informe
- [ ] Estado = "Pendiente"
- [ ] Cargar informe
- [ ] Estado cambia a "Completado"
- [ ] Fecha de informe se guarda
- [ ] Observaciones se muestran
- [ ] Calificación visible

#### Historial
- [ ] Crear asignación en mes actual
- [ ] Aparece en historial
- [ ] Filtrar por mes actual
- [ ] Aparece correctamente
- [ ] Datos completos visibles

### Verificación de Base de Datos

En Neon Console:

```sql
-- Verificar estudiantes
SELECT * FROM estudiantes;

-- Verificar expendios
SELECT COUNT(*) FROM expendios; -- Debe ser >= 31

-- Verificar asignaciones
SELECT * FROM asignaciones;

-- Verificar que constraint funciona
SELECT 
  expendio_id, 
  mes, 
  anio, 
  COUNT(*) 
FROM asignaciones 
GROUP BY expendio_id, mes, anio 
HAVING COUNT(*) > 1; 
-- Debe devolver 0 filas
```

### Performance
- [ ] Dashboard carga en < 2 segundos
- [ ] Listas cargan en < 1 segundo
- [ ] Búsqueda responde instantáneamente
- [ ] Sin errores en consola del navegador
- [ ] Sin errores en logs de Vercel

### Responsive Design
- [ ] Desktop (>1024px): Todo funciona
- [ ] Tablet (768px): Layout correcto
- [ ] Móvil (375px): Navegable y usable
- [ ] Tablas scrolleables en móvil
- [ ] Modales centrados en todas las pantallas

### Seguridad
- [ ] No hay credenciales expuestas
- [ ] URLs funcionan correctamente
- [ ] No hay errores 404
- [ ] HTTPS activo (por defecto en Vercel)

## 🔧 Troubleshooting

### Si algo no funciona:

**Error: Cannot connect to database**
```
1. Ve a Vercel → Storage
2. Verifica que la DB esté conectada
3. Revisa variables de entorno
4. Redespliega si es necesario
```

**Error: No se muestran datos**
```
1. Ve a Neon Console
2. Ejecuta: SELECT * FROM [tabla]
3. Si está vacía, ejecuta el seed SQL
```

**Error: Build failed**
```
1. Revisa logs en Vercel
2. Verifica que node_modules no esté en Git
3. Limpia caché: Settings → Clear Build Cache
4. Redespliega
```

**Error: 500 en API**
```
1. Ve a Vercel → Deployments
2. Click en último deploy
3. View Function Logs
4. Identifica el error
```

## 📊 Métricas de Éxito

Después de verificar todo:

- ✅ 0 errores en consola
- ✅ 0 errores en logs de Vercel
- ✅ 100% de funcionalidades operativas
- ✅ Todas las páginas cargan correctamente
- ✅ Base de datos responde rápido
- ✅ Interfaz responsive

## 🎉 Checklist Completo

Si marcaste TODO como ✅:

**¡FELICIDADES! UniAsigna está funcionando perfectamente** 🚀

Tu sistema está listo para uso en producción.

## 📝 Notas Adicionales

- Guarda la URL de tu app: `https://__________.vercel.app`
- Comparte con tu equipo
- Documenta cualquier customización
- Configura backups periódicos (automático en Vercel)

## 🔄 Próximos Pasos

1. [ ] Agregar más estudiantes reales
2. [ ] Verificar expendios están actualizados
3. [ ] Hacer primera asignación real
4. [ ] Capacitar usuarios
5. [ ] Monitorear uso durante primer mes

---

**Checklist creado para UniAsigna v1.0**
*Fecha: [Completar con fecha de verificación]*
