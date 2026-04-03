# 🚀 Guía Rápida de Prueba Local - Diet Tracker

## 📍 URL de Acceso
**Tu aplicación está corriendo en:** http://localhost:3003

---

## 🧪 Flujo de Prueba Recomendado

### 1. **Primera Visita** 
Abre http://localhost:3003 en tu navegador

### 2. **Registro de Usuario**
- Ve a http://localhost:3003/register
- Usa estos datos de prueba:
  ```
  Email: test@ejemplo.com
  Nombre: Usuario Test
  Contraseña: Test123!
  Edad: 25
  Peso: 70 kg
  Altura: 175 cm
  Actividad: Moderada
  Objetivo: Mantener peso
  ```

### 3. **Explorar el Dashboard**
- Después del registro, irás al dashboard
- Verifica estos elementos:
  - ✅ Calorías del día (anillo animado)
  - ✅ Macronutrientes (proteínas, carbohidratos, grasas)
  - ✅ Gráfico de historial
  - ✅ Botón "Agregar comida"

### 4. **Agregar una Comida**
- Click en "Agregar comida" o "Registrar comida"
- Prueba estas opciones:
  - **Búsqueda**: "manzana", "pollo", "arroz"
  - **Código de barras**: Usa el escánero (si tienes cámara)
  - **Recetas**: Explora las recetas predefinidas

### 5. **Explorar Recetas**
- Ve a http://localhost:3003/recipes
- Prueba:
  - Búsqueda: "desayuno", "pollo", "ensalada"
  - Filtros por tipo de comida
  - Click en una receta para ver detalles

### 6. **Coach de IA**
- Ve a http://localhost:3003/coach
- Completa el formulario:
  - Objetivo: "Perder peso"
  - Velocidad: "Normal"
  - Preferencias: "Sin mariscos"
- Click en "Generar plan semanal"

### 7. **Lista de Compras**
- Desde un plan generado, click en "Generar lista de compras"
- Verifica que los ingredientes estén organizados

### 8. **Perfil y Ajustes**
- Ve a http://localhost:3003/settings
- Actualiza tu información
- Cambia preferencias de privacidad

---

## 🔍 Qué Verificar en Cada Sección

### **Autenticación** 🔐
- [ ] Registro con validación de email
- [ ] Login/logout funcional
- [ ] Redirección automática
- [ ] Manejo de errores (contraseña corta, email inválido)

### **Dashboard** 📊
- [ ] Anillo de calorías animado
- [ ] Gráficos de macronutrientes
- [ ] Navegación entre días
- [ ] Estadísticas actualizadas al agregar comidas

### **Recetas** 🥗
- [ ] Búsqueda funcional
- [ ] Filtros por categoría
- [ ] Detalles nutricionales
- [ ] Botón "Agregar a diario"

### **Coach IA** 🤖
- [ ] Generación de planes (puede tardar 5-10s)
- [ ] Recomendaciones coherentes
- [ ] Chat interactivo
- [ ] Personalización según perfil

### **PWA** 📱
- [ ] Funciona sin conexión (después de cargar)
- [ ] Se puede instalar como app
- [ ] Responsive en móvil/tablet

---

## 🚨 Casos de Error a Probar

### **Sin Internet**
1. Desconecta el wifi
2. Recarga la página
3. Verifica que funcione con datos cacheados

### **Datos Inválidos**
1. Intenta registrar un email mal formado
2. Pon una contraseña muy corta
3. Agrega cantidades negativas en comidas

### **Límites del Sistema**
1. Agrega muchas comidas en un día
2. Busca recetas con términos muy genéricos
3. Navega rápidamente entre días

---

## 🛠️ Herramientas de Desarrollo

### **Chrome DevTools** (F12)
- **Network**: Ver requests a Supabase
- **Console**: Ver errores o warnings
- **Application**: Ver PWA y caché
- **Lighthouse**: Auditar PWA

### **Información Útil**
- Los errores de "Missing Supabase environment variables" en tests son normales
- El servidor está configurado correctamente
- Las rutas dinámicas funcionan como se espera

---

## 📋 Checklist Final de Prueba

Después de explorar, verifica:

- [ ] **Funcionalidad**: Todas las características principales funcionan
- [ ] **Rendimiento**: Todo carga rápido (< 3s)
- [ ] **Responsive**: Se ve bien en móvil y desktop
- [ ] **Sin errores**: No hay errores críticos en consola
- [ ] **PWA**: Se puede instalar y funciona offline

---

## 🎯 Próximos Pasos

1. **¿Todo funciona bien?** ¡Excelente! Tu app está lista
2. **¿Encontraste errores?** Documentalos y puedo ayudarte a resolverlos
3. **¿Quieres más funciones?** Puedo ayudarte a implementarlas

¡Disfruta probando tu aplicación! 🚀