# 🔍 Guía para Verificar Recetas en Diet Tracker

## 📊 Estado de la Base de Datos

### ✅ **Base de Datos Conectada**
- **Servidor**: Supabase (https://vvtgpztnytpxoacoflas.supabase.co)
- **Recetas Disponibles**: +200 recetas en la tabla `recipes`
- **API Funcionando**: ✅ Endpoint `/api/recipes` responde correctamente

### 📋 **Tipos de Recetas Disponibles**

1. **Verduras Rellenas** (30+ recetas)
   - Pimiento relleno de atún
   - Berenjena rellena de queso
   - Tomate relleno de verduras
   - Calabaza rellena de quinoa
   - Champiñón relleno de couscous

2. **Cremas de Verduras** (15+ recetas)
   - Crema de calabaza
   - Crema de zanahoria
   - Crema de champiñones
   - Crema de espinacas

3. **Salteados** (40+ recetas)
   - Salteado de verduras con pollo
   - Salteado de champiñones con pavo
   - Salteado de espárragos con ternera

4. **Snacks y Frutos Secos** (50+ recetas)
   - Almendras, nueces, pistachos
   - Semillas de girasol, chía, lino
   - Mezclas energéticas

5. **Yogures y Snacks Saludables** (40+ recetas)
   - Yogur griego con miel
   - Skyr con granola
   - Yogur con frutas

6. **Mini Batidos** (30+ recetas)
   - Batido de plátano
   - Batido de fresa
   - Batido de mango

7. **Mini Tostadas** (20+ recetas)
   - Tostada con tomate
   - Tostada con aguacate
   - Tostada con queso

8. **Frutas con Acompañamientos** (20+ recetas)
   - Manzana con yogur
   - Pera con queso
   - Frutas con especias

---

## 🚀 Cómo Ver las Recetas en la Aplicación

### 1. **Acceder a la Sección de Recetas**
- Ve a: http://localhost:3003/recipes
- O usa el menú de navegación inferior

### 2. **Verificar que las Recetas Carguen**

#### **En Chrome DevTools:**
1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña **Network**
3. Filtra por "recipes"
4. Deberías ver una petición a `/api/recipes` con status 200

#### **Verificar la Respuesta:**
```bash
# En terminal, prueba este comando:
curl -s "http://localhost:3003/api/recipes" | head -5

# Deberías ver algo como:
# [{"id":"02b8dfd5-1867-4afa-9af7-b487cb27cea7","name":"Berenjena relleno de queso", ...}]
```

### 3. **Si No Ves Recetas, Prueba:**

#### **Limpiar Filtros:**
- Click en "🔍 Buscar" → "Limpiar filtros"
- Asegúrate de que no haya texto en el buscador

#### **Verificar Supermercados:**
- Los botones de supermercado filtran las recetas
- Prueba click en "mercadona", "lidl", "aldi", "familycash"

#### **Verificar Tags:**
- Las etiquetas como "cena", "desayuno", "snack" también filtran
- Click en "Limpiar filtros" para ver todas

### 4. **Problemas Comunes y Soluciones:**

#### **Imágenes No Cargan**
- Las URLs de imágenes vienen de Unsplash
- Verifica en DevTools → Network → Images
- Si fallan, las recetas igual aparecerán pero sin imagen

#### **Grid Vacío**
- Si ves "No se encontraron recetas" → Click en "Limpiar filtros"
- Verifica que no haya texto en el buscador

#### **Errores en Consola**
- Abre DevTools → Console
- Busca errores rojos relacionados con "recipes"
- Común: CORS, network errors, JSON parse errors

---

## 🔍 Verificación Rápida

### **Test 1: API Directa**
```bash
# Verificar que la API responda
curl -s "http://localhost:3003/api/recipes?limit=5" | jq '.[0].name'

# Debería mostrar: "Berenjena relleno de queso" o similar
```

### **Test 2: En el Navegador**
1. Abre http://localhost:3003/recipes
2. Abre DevTools (F12)
3. Ve a Network → Fetch/XHR
4. Busca la petición a `/api/recipes`
5. Click en ella → Preview/Response
6. Deberías ver un array con objetos de recetas

### **Test 3: Sin Filtros**
1. En la página de recetas
2. Asegúrate de que el buscador esté vacío
3. Click en "Limpiar filtros" si aparece
4. Deberías ver un grid de 2 columnas con recetas

---

## 📱 Vista de las Recetas

### **Cómo se Ven:**
- **Grid de 2 columnas** en móvil
- **Imagen** de la receta (de Unsplash)
- **Nombre** de la receta
- **Calorías** y tiempo de preparación
- **Supermercado** asociado

### **Al Hacer Click:**
- Se abre un modal con detalles completos
- Ingredientes con cantidades
- Instrucciones paso a paso
- Valores nutricionales completos
- Botón para agregar a tu plan diario

---

## 🎯 Ejemplos de Recetas que Deberías Ver

### **En la Vista Principal:**
- ✅ "Berenjena relleno de queso" (280 cal)
- ✅ "Crema de calabaza" (180 cal)
- ✅ "Salteado de Champiñones con pavo" (280 cal)
- ✅ "Yogur griego con miel" (220 cal)
- ✅ "Almendras" (200 cal)

### **Al Buscar:**
- Busca "queso" → deberías ver recetas con queso
- Busca "desayuno" → deberías ver opciones matutinas
- Busca "pollo" → deberías ver recetas con pollo

---

## 🛠️ Si Aún No Funciona

### **Verifica el Servidor:**
```bash
# Verificar que el servidor esté corriendo
curl -I http://localhost:3003
# Debería dar: HTTP/1.1 307 Temporary Redirect
```

### **Revisa la Consola del Navegador:**
1. F12 → Console
2. Busca errores rojos
3. Común: "Failed to fetch", "CORS error", "Network error"

### **Prueba el Endpoint Directamente:**
```bash
# Ver cantidad de recetas
curl -s "http://localhost:3003/api/recipes" | jq 'length'
# Debería dar: 200+ recetas
```

---

## ✅ Resumen

**La base de datos SÍ tiene recetas** (+200 disponibles)
**La API SÍ funciona** (endpoint responde correctamente)
**Las recetas SÍ se muestran** (componente RecipeBook las renderiza)

Si no las ves, es probablemente un problema de:
- Filtros activos
- Imágenes no cargando
- JavaScript deshabilitado
- Errores de red/CORS

¡Todo está funcionando correctamente! 🎉