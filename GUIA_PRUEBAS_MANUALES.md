# 🧪 Guía de Pruebas Manuales - Diet Tracker

## 🚀 Inicio Rápido

### 1. Preparar el Entorno
```bash
# Verificar que el servidor esté corriendo
npm run dev

# El servidor debería estar en: http://localhost:3001
```

### 2. Herramientas Necesarias
- **Navegador Chrome/Edge** (recomendado)
- **Chrome DevTools** abierto (F12)
- **Network tab** activado para monitorear requests

---

## 📋 Lista de Pruebas por Funcionalidad

### 🔐 1. Autenticación

#### ✅ Registro de Usuario
1. Ve a `http://localhost:3001/register`
2. **Prueba datos válidos:**
   - Email: `test@ejemplo.com`
   - Nombre: `Usuario Test`
   - Contraseña: `Test123!`
   - Edad: `25`
   - Peso: `70`
   - Altura: `175`
3. **Verifica:**
   - ✅ Redirección a dashboard
   - ✅ Mensaje de bienvenida
   - ✅ Datos guardados correctamente

#### ✅ Login
1. Ve a `http://localhost:3001/login`
2. **Prueba casos:**
   - ✅ Credenciales correctas
   - ❌ Email inválido (`correo-mal-formato`)
   - ❌ Contraseña corta (`123`)
3. **Verifica:**
   - ✅ Validación en tiempo real
   - ✅ Mensajes de error claros
   - ✅ Redirección post-login

#### ✅ Logout
1. Haz login exitoso
2. Click en "Cerrar sesión"
3. **Verifica:**
   - ✅ Redirección a login
   - ✅ Limpieza de sesión
   - ✅ No se puede acceder a rutas protegidas

---

### 📊 2. Dashboard Principal

#### ✅ Visualización de Datos
1. En dashboard (`http://localhost:3001/dashboard`)
2. **Verifica elementos:**
   - ✅ Calorías de hoy (anillo animado)
   - ✅ Macronutrientes (proteínas, carbs, grasas)
   - ✅ Estadísticas animadas
   - ✅ Gráfico de historial

#### ✅ Navegación Temporal
1. **Cambia entre días:**
   - Click en fecha anterior
   - Click en fecha siguiente
   - Selector de fecha
2. **Verifica:**
   - ✅ Datos actualizados
   - ✅ Animaciones suaves
   - ✅ Estados de carga

---

### 🍽️ 3. Gestión de Comidas

#### ✅ Agregar Comida
1. Click en "+ Agregar comida" o "Registrar comida"
2. **Prueba métodos:**
   - ✅ Búsqueda por nombre
   - ✅ Escaneo de código de barras
   - ✅ Selección de recetas
3. **Verifica:**
   - ✅ Cálculo automático de calorías
   - ✅ Actualización de macronutrientes
   - ✅ Guardado en base de datos

#### ✅ Editar/Eliminar Comida
1. **Editar:**
   - Click en comida registrada
   - Modificar cantidad
   - ✅ Verifica cálculos actualizados
2. **Eliminar:**
   - Swipe o click en eliminar
   - ✅ Verifica confirmación
   - ✅ Actualización de totales

---

### 🥗 4. Recetas

#### ✅ Búsqueda de Recetas
1. Ve a `http://localhost:3001/recipes`
2. **Prueba búsquedas:**
   - ✅ "pollo" (debe encontrar recetas con pollo)
   - ✅ "desayuno" (filtrar por tipo)
   - ✅ "vegetariano" (filtrar por etiquetas)
3. **Verifica:**
   - ✅ Resultados relevantes
   - ✅ Tiempo de respuesta < 2s
   - ✅ Imágenes cargando

#### ✅ Detalle de Receta
1. Click en receta
2. **Verifica:**
   - ✅ Ingredientes completos
   - ✅ Valores nutricionales
   - ✅ Pasos de preparación
   - ✅ Tiempo de preparación
   - ✅ Botón "Agregar a diario"

---

### 🤖 5. Coach de IA

#### ✅ Generar Plan Semanal
1. Ve a `http://localhost:3001/coach`
2. **Completa formulario:**
   - Objetivo: "Perder peso"
   - Velocidad: "Normal"
   - Preferencias: "Sin mariscos"
3. **Verifica:**
   - ✅ Plan generado en < 5s
   - ✅ Distribución equilibrada
   - ✅ Variedad de comidas
   - ✅ Botón para guardar plan

#### ✅ Chat con Coach
1. **Preguntas de prueba:**
   - "¿Qué puedo comer después de entrenar?"
   - "Sugiere un desayuno bajo en carbos"
   - "¿Está bien mi progreso esta semana?"
2. **Verifica:**
   - ✅ Respuestas coherentes
   - ✅ Tiempo de respuesta < 3s
   - ✅ Consejos personalizados

---

### 🛒 6. Lista de Compras

#### ✅ Crear Lista
1. Desde un plan semanal
2. Click en "Generar lista de compras"
3. **Verifica:**
   - ✅ Ingredientes organizados por categoría
   - ✅ Cantidades calculadas
   - ✅ Opción de exportar
   - ✅ Checkboxes funcionales

---

### 📱 7. Características PWA

#### ✅ Instalación
1. **En Chrome:**
   - Menú de tres puntos → "Instalar aplicación Diet Tracker"
   - ✅ Debe aparecer instalación
   - ✅ Icono en escritorio/menú

#### ✅ Funcionamiento Offline
1. **Prueba sin conexión:**
   - Abre DevTools → Network → Offline
   - Navega por la app
   - ✅ Datos cacheados visibles
   - ✅ Sin errores críticos

#### ✅ Notificaciones
1. **Si están configuradas:**
   - Permite notificaciones
   - ✅ Mensaje de bienvenida
   - ✅ Recordatorios de comidas

---

## 🔍 Pruebas de Rendimiento

### 1. **Tiempo de Carga**
- Dashboard: < 2s
- Recetas: < 3s
- Coach IA: < 5s
- Lista compras: < 1s

### 2. **Animaciones**
- ✅ Suaves (60fps)
- ✅ No bloqueantes
- ✅ Se pueden desactivar

### 3. **Responsive**
- ✅ Mobile (320px - 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

---

## 🐛 Casos de Error a Probar

### 1. **Sin Conexión a Internet**
- ✅ Mensaje de "Sin conexión"
- ✅ Datos cacheados disponibles
- ✅ Reintentar conexión

### 2. **Error de API**
- ✅ Mensajes de error amigables
- ✅ Reintentos automáticos
- ✅ Fallback a datos locales

### 3. **Datos Inválidos**
- ✅ Validación en formularios
- ✅ Mensajes de error claros
- ✅ No se bloquea la app

### 4. **Límites del Sistema**
- ✅ Muchas comidas en un día
- ✅ Búsquedas con muchos resultados
- ✅ Historial extenso

---

## 📊 Checklist Final

### Funcionalidades Core
- [ ] Registro/Login funciona
- [ ] Dashboard muestra datos correctos
- [ ] Agregar comidas actualiza totales
- [ ] Búsqueda de recetas funciona
- [ ] Coach IA genera planes válidos
- [ ] Lista de compras es precisa
- [ ] App funciona offline

### Calidad
- [ ] Sin errores en consola
- [ ] Tiempo de respuesta aceptable
- [ ] Animaciones suaves
- [ ] Responsive en todos los tamaños
- [ ] Accesibilidad (tab navigation)

### Seguridad
- [ ] Datos sensibles no expuestos
- [ ] Validación de entrada funciona
- [ ] Sin vulnerabilidades críticas

---

## 🎯 Próximos Pasos

1. **Documentar problemas encontrados**
2. **Tomar screenshots de errores**
3. **Registrar métricas de rendimiento**
4. **Compartir feedback con el equipo**

¡Feliz testing! 🚀