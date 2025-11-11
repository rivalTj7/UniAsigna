# 📦 Carga Masiva y Borrado Masivo de Expendios

## 🎯 Nuevas Funcionalidades Implementadas

### 1. Carga Masiva desde CSV
Permite importar múltiples expendios de una sola vez usando un archivo CSV.

### 2. Borrado Masivo
Permite seleccionar y eliminar múltiples expendios simultáneamente.

---

## 📋 Cómo Usar la Carga Masiva

### Paso 1: Acceder a la Página de Expendios
1. Inicia sesión como **ADMIN**
2. Ve a la sección "Expendios"

### Paso 2: Preparar el Archivo CSV
Puedes usar dos métodos:

#### Opción A: Descargar la Plantilla
1. Haz clic en el botón **"Carga Masiva"**
2. Haz clic en **"Descargar Plantilla CSV"**
3. Se descargará un archivo con el formato correcto

#### Opción B: Crear tu Propio CSV
Crea un archivo `.csv` con el siguiente formato:

```csv
archivo,nombrePropietario,ubicacion,tipo,activo
1,Juan Pérez,Edificio T1,KIOSKO,true
2,María López,Edificio T3,CAFETERIA,true
3,Carlos Gómez,Parqueo Central,COMEDOR,true
```

### Paso 3: Subir el Archivo
1. Haz clic en **"Carga Masiva"**
2. Haz clic en **"Seleccionar Archivo CSV"**
3. Selecciona tu archivo `.csv`
4. El sistema procesará y creará todos los expendios automáticamente

### ✅ Resultado
- Verás un mensaje de éxito con el número de expendios creados
- La tabla se actualizará automáticamente

---

## 🗑️ Cómo Usar el Borrado Masivo

### Paso 1: Seleccionar Expendios
1. En la tabla de expendios, verás un **checkbox** al inicio de cada fila
2. Marca los checkboxes de los expendios que deseas eliminar
3. También puedes usar el checkbox del encabezado para **seleccionar todos**

### Paso 2: Eliminar
1. Aparecerá un botón rojo **"Eliminar (N)"** donde N es el número de expendios seleccionados
2. Haz clic en el botón
3. Confirma la eliminación en el diálogo

### ✅ Resultado
- Se eliminarán todos los expendios seleccionados
- Verás un mensaje de confirmación
- La selección se limpiará automáticamente

---

## 📝 Formato del CSV

### Campos Obligatorios
- **nombrePropietario**: Nombre del dueño del expendio
- **ubicacion**: Ubicación del expendio

### Campos Opcionales
- **archivo**: Número de archivo (puede estar vacío)
- **tipo**: Tipo de expendio (por defecto: KIOSKO)
- **activo**: Estado del expendio (por defecto: true)

### Tipos de Expendio Válidos
- `KIOSKO`
- `CARRETA`
- `MESA`
- `FOTOCOPIADORA`
- `LIBRERIA`
- `CAFETERIA`
- `COMEDOR`

### Valores de Activo
- `true` o `TRUE` → Expendio activo
- `false` o `FALSE` → Expendio inactivo

---

## 🛡️ API Endpoints

### POST `/api/expendios/bulk`
Carga masiva de expendios.

**Request Body:**
```json
{
  "expendios": [
    {
      "archivo": "1",
      "nombrePropietario": "Juan Pérez",
      "ubicacion": "Edificio T1",
      "tipo": "KIOSKO",
      "activo": true
    }
  ]
}
```

**Response (Success):**
```json
{
  "message": "3 expendios creados exitosamente",
  "total": 3,
  "expendios": [...]
}
```

**Response (Error):**
```json
{
  "error": "Algunos expendios tienen datos inválidos",
  "detalles": [
    "Línea 2: Falta nombre del propietario o ubicación"
  ]
}
```

### DELETE `/api/expendios/bulk`
Borrado masivo de expendios.

**Request Body:**
```json
{
  "ids": [1, 2, 3, 5, 8]
}
```

**Response (Success):**
```json
{
  "message": "5 expendios eliminados exitosamente",
  "total": 5,
  "eliminados": [1, 2, 3, 5, 8]
}
```

---

## 🎨 Interfaz de Usuario

### Botones Nuevos
1. **Carga Masiva** (Verde con icono Upload)
   - Abre modal para subir CSV
   - Permite descargar plantilla

2. **Eliminar (N)** (Rojo con icono Trash)
   - Solo aparece cuando hay expendios seleccionados
   - Muestra el número de expendios seleccionados

### Checkboxes en Tabla
- Checkbox en el encabezado para seleccionar/deseleccionar todos
- Checkbox en cada fila para selección individual

---

## ⚠️ Validaciones

### Carga Masiva
- ✅ Valida que todos los expendios tengan nombre de propietario y ubicación
- ✅ Muestra errores específicos por línea si hay datos inválidos
- ✅ Solo inserta expendios válidos
- ✅ Detecta duplicados y muestra error apropiado

### Borrado Masivo
- ✅ Requiere al menos un expendio seleccionado
- ✅ Valida que todos los IDs sean números válidos
- ✅ Muestra confirmación antes de eliminar
- ✅ Solo elimina expendios existentes

---

## 🔒 Seguridad

- ✅ **Solo ADMIN** puede usar estas funcionalidades
- ✅ Protegido con JWT y middleware `withAdminAuth`
- ✅ Validación de tipos y datos en el backend
- ✅ Manejo de errores robusto

---

## 📊 Ejemplo de Uso Completo

### Escenario: Importar 50 Expendios Nuevos

1. **Preparar datos en Excel**
   ```
   | archivo | nombrePropietario | ubicacion      | tipo    | activo |
   |---------|-------------------|----------------|---------|--------|
   | 1       | Juan Pérez        | Edificio T1    | KIOSKO  | true   |
   | 2       | María López       | Edificio T3    | CAFETERIA| true  |
   | ...     | ...               | ...            | ...     | ...    |
   ```

2. **Guardar como CSV**
   - Archivo → Guardar como → CSV (delimitado por comas)

3. **Importar**
   - Ir a Expendios → Carga Masiva → Seleccionar archivo
   - Esperar confirmación: "50 expendios creados exitosamente"

4. **Verificar**
   - La tabla mostrará los 50 expendios nuevos
   - Usar búsqueda para verificar específicos

### Escenario: Limpiar Expendios Inactivos

1. **Filtrar** expendios inactivos usando la búsqueda
2. **Seleccionar** todos con el checkbox del encabezado
3. **Eliminar** con el botón "Eliminar (N)"
4. **Confirmar** en el diálogo

---

## 🐛 Solución de Problemas

### Error: "Algunos expendios tienen datos inválidos"
- Verifica que todas las filas tengan `nombrePropietario` y `ubicacion`
- Revisa que no haya comas extras en los datos

### Error: "Algunos expendios ya existen"
- Puede haber duplicados en ubicación o nombre
- Verifica la base de datos antes de importar

### No se seleccionan los expendios
- Verifica que el checkbox esté visible
- Recarga la página y vuelve a intentar

### El archivo CSV no se procesa
- Verifica que el archivo sea `.csv` y no `.xlsx`
- Asegúrate de que use comas como delimitador
- Verifica que tenga el header correcto

---

## ✨ Mejoras Futuras Posibles

- [ ] Soporte para Excel (.xlsx) directo
- [ ] Previsualización antes de importar
- [ ] Edición masiva de expendios
- [ ] Exportar expendios a CSV
- [ ] Validación de ubicaciones duplicadas
- [ ] Logs de auditoría para operaciones masivas

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, contacta al equipo de desarrollo.
