# 🏗️ Diet Tracker - Sprint Fix Plan

## 📋 Issues Reportados por Usuario

### 🔴 CRITICAL (Sprint 1)
1. **Modal "Añadir comida"** - Solo abre trozo de pantalla, no carga recetas
2. **Macros "achatados"** - Layout roto en dashboard debajo de calorías
3. **Navegación rota** - Al entrar en perfil no puede salir

### 🟠 HIGH (Sprint 2)
4. **Plan semanal** - No se rellena, no hace nada
5. **Lista de compra** - No hace scroll, inventa productos (no del plan)
6. **Botón "Ver todas"** - No hace nada en dashboard

### 🟡 MEDIUM (Sprint 3)
7. **Recetas** - Imágenes no concuerdan, no se pueden abrir
8. **Perfil** - Contenido repetido con inicio, sobra contenido
9. **Campana en perfil** - No se sabe qué hace, molesta

### 🟢 LOW (Sprint 4)
10. **Racha** - Datos falsos/de ejemplo, no reales
11. **Detalles UI** - Varios detalles pendientes

---

## 🎯 Sprint 1 - Critical Fixes

### Fix 1.1: MealAddModal - Pantalla completa y carga recetas
**Archivo:** `src/components/dashboard/MealAddModal.tsx`
**Problema:** Modal solo muestra partial screen, recetas no cargan
**Solución:**
- Cambiar `max-h-[90vh]` a `h-full`
- Asegurar que `fetchRecipes` se llama correctamente
- Verificar tag mapping (breakfast→desayuno, etc.)

### Fix 1.2: MacrosSummary - Layout espaciado
**Archivo:** `src/components/dashboard/MacrosSummary.tsx`
**Problema:** Macros se ven "achatados"
**Solución:**
- Aumentar padding vertical
- Mejorar espaciado entre icono, valor y label

### Fix 1.3: BottomNavBar - Eliminar campana confusa
**Archivo:** `src/components/BottomNavBar.tsx`
**Problema:** Campana notificaciones no tiene función clara, molesta
**Solución:**
- Eliminar botón de campana o darle funcionalidad real
- Si se elimina, ajustar layout de nav items

---

## 🎯 Sprint 2 - Core Functionality

### Fix 2.1: Weekly Plan - Generar y mostrar comidas
**Archivos:** `src/app/weekly-plan/page.tsx`, `src/lib/planGenerator.ts`
**Problema:** Plan no se genera o muestra vacío
**Solución:**
- Verificar que `generatePlan()` fetch recipes correctamente
- Checkear que API devuelve plan con 4 comidas/día
- Asegurar que UI renderiza meals del plan

### Fix 2.2: Shopping List - Scroll y productos del plan
**Archivos:** `src/app/shopping/page.tsx`, `src/components/GenerateShoppingList.tsx`
**Problema:** No scroll, productos inventados
**Solución:**
- Verificar `overflow-y-auto` en contenedor
- Asegurar que `GenerateShoppingList` usa meals del plan semanal real
- Extraer ingredientes de recetas del plan

### Fix 2.3: Dashboard "Ver todas" botón
**Archivo:** `src/components/dashboard/MealsSection.tsx` o `page.tsx`
**Problema:** Botón no hace nada
**Solución:**
- Añadir navegación a página de food diary o expandir lista

---

## 🎯 Sprint 3 - UX Improvements

### Fix 3.1: Recetas - Imágenes correctas y modal detalle
**Archivos:** `src/app/recipes/page.tsx`, `src/components/RecipeCard.tsx`, `src/components/RecipeModal.tsx`
**Problema:** Imágenes no matchean comida, no se abren
**Solución:**
- Verificar que `image_url` de Supabase corresponde a cada receta
- Implementar click en RecipeCard para abrir RecipeModal
- Asegurar routing `/recipes/[id]` funciona

### Fix 3.2: Perfil - Contenido único y necesario
**Archivo:** `src/app/profile/page.tsx`
**Problema:** Duplica dashboard, sobra contenido
**Solución:**
- Mantener solo: foto perfil, nivel/logros, settings, logout
- Eliminar: streak, weight chart (mover a progreso separado)
- Limpiar UI a lo esencial

### Fix 3.3: Campana notificaciones - Funcionalidad o eliminar
**Archivo:** `src/components/BottomNavBar.tsx`
**Problema:** No tiene función clara
**Solución:**
- Opción A: Implementar panel de notificaciones real
- Opción B: Eliminar y dejar solo nav de 5 items

---

## 🎯 Sprint 4 - Polish & Real Data

### Fix 4.1: StreakCounter - Datos reales
**Archivo:** `src/components/StreakCounter.tsx`
**Problema:** Muestra datos fake (7 días, récord 21)
**Solución:**
- Fetch de Supabase `user_streaks` table
- Calcular racha real basada en food_logs
- Mostrar 0 si no hay datos

### Fix 4.2: Detalles UI varios
- Pull-to-refresh en listas
- Loading states
- Empty states informativos
- Error handling

---

## 📊 Estado de Fixes

| Sprint | Fix | Estado | Commit |
|--------|-----|--------|--------|
| 1 | 1.1 MealAddModal | ⏳ Pendiente | - |
| 1 | 1.2 MacrosSummary | ⏳ Pendiente | - |
| 1 | 1.3 BottomNavBar | ⏳ Pendiente | - |
| 2 | 2.1 Weekly Plan | ⏳ Pendiente | - |
| 2 | 2.2 Shopping List | ⏳ Pendiente | - |
| 2 | 2.3 Ver todas botón | ⏳ Pendiente | - |
| 3 | 3.1 Recetas images | ⏳ Pendiente | - |
| 3 | 3.2 Perfil cleanup | ⏳ Pendiente | - |
| 3 | 3.3 Campana | ⏳ Pendiente | - |
| 4 | 4.1 Streak real | ⏳ Pendiente | - |
| 4 | 4.2 UI polish | ⏳ Pendiente | - |

---

## 🚀 Enfoque de Trabajo

1. **Un fix por commit** - Changes pequeños y testeables
2. **Deploy después de cada fix** - Verificar en producción
3. **Browser snapshot** - Confirmar visualmente que funciona
4. **Commit messages claros** - `fix: description`

---

**Nota:** Priorizar siempre CRITICAL > HIGH > MEDIUM > LOW
