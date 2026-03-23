# SPEC.md - Diet Tracker PWA

## 1. Concept & Vision

**App de control nutricional mobile-first** diseñada para españoles que quieren perder/pillar peso sin complicaciones. Escaneas comida, te sale el plan semanal, generas la lista de la compra para Mercadona/Lidl/Aldi/Family Cash. Todo desde el móvil, sin scroll infinito, como una app nativa.

**Personalidad:** Práctica, directa, sin filler. Como un amigo que sabe de nutrición y te dice las cosas claras.

---

## 2. Design Language

### Aesthetic Direction
Inspiración: apps de fitness premium (Whoop, MyFitnessPal) pero más limpias, menos "gym bro". Minimalismo funcional con acentos de color para jerarquía visual.

### Color Palette
```
--bg-primary: #0D0D0D (dark) / #FAFAFA (light)
--bg-secondary: #1A1A1A (dark) / #F5F5F5 (light)
--accent: #22C55E (verde saludable)
--accent-warm: #F97316 (naranja energía)
--text-primary: #FFFFFF (dark) / #0D0D0D (light)
--text-secondary: #A1A1AA
--error: #EF4444
--success: #22C55E
```

### Typography
- **Headings:** Inter (700, 600)
- **Body:** Inter (400, 500)
- **Mono (calorías):** JetBrains Mono

### Spatial System
- Base unit: 4px
- Touch targets: mínimo 44x44px
- Padding móvil: 16px horizontal
- Gap entre elementos: 12px

### Motion Philosophy
- Transiciones suaves entre pantallas (200ms ease-out)
- Micro-interacciones en botones (scale 0.98 en press)
- Sin animaciones pesadas - rendimiento primero

### Visual Assets
- Iconos: Lucide React (línea fina, consistente)
- Sin imágenes de stock - solo fotos de comida reales
- Emojis para categorías de comida 🍎🥩🍞

---

## 3. Layout & Structure

### Arquitectura de Pantalla (MOBILE-ONLY)
```
┌─────────────────────────┐
│      Status Bar         │  (native)
├─────────────────────────┤
│                         │
│    CONTENIDO PRINCIPAL  │  (scroll interno si needed)
│    (100% viewport)      │
│                         │
├─────────────────────────┤
│   BOTTOM NAV BAR        │  (56px fixed)
│   [🏠][📋][🛒][👤]      │
└─────────────────────────┘
```

### Navegación (Bottom Bar)
1. **Dashboard** - Plan semanal + día actual
2. **Recetas** - Base de datos searchable
3. **Lista** - Lista de compra semanal
4. **Perfil** - Settings + usuario

---

## 4. Features & Interactions

### ONBOARDING (9 pasos)
1. Nombre + idioma
2. Edad, género
3. Peso, altura
4. Actividad física (sedentario - muy activo)
5. Objetivo (perder - mantener - ganar)
6. Velocidad objetivo (lento - rápido)
7. Preferencias comida (vegetariano, sin gluten, etc)
8. Comensales (1-6+)
9. Resumen + confirmación

**Cálculo calórico:**
- TMB = 10×peso + 6.25×altura - 5×edad + género
- TDEE = TMB × factor actividad
- Ajuste = según objetivo (déficit/superávit 10-25%)

### DASHBOARD
- Pull-to-refresh para actualizar plan
- Tap en card → expandir detalles
- Long-press → menú contextual
- Swipe en card → acciones rápidas

### ESCANEO CÓDIGO BARRAS
- Abre cámara con overlay guides
- Detección automática con @zxing
- Vibración al detectar
- Consulta OpenFoodFacts API
- Fallback: entrada manual

### FOTO A IA (OLLAMA)
- Captura foto o selecciona de galería
- Envía a /api/analyze-food → Ollama Cloud
- Prompt: identifica plato, ingredientes, kcal estimadas, macros
- Devuelve JSON estructurado
- Opción de añadir a food log

### GENERADOR PLAN SEMANAL
- Input: kcal diarias objetivo, n_comidas (3-5), preferencias
- Genera 7 días con distribución automática
- Garantiza variedad de supermercados
- Output: array de meals con recetas asignadas

### LISTA DE LA COMPRA
- Extrae ingredientes del plan semanal activo
- Agrupa por supermercado o categoría
- Checkbox interactivo
- Web Share API para enviar a WhatsApp/Telegram

---

## 5. Component Inventory

### BottomNavBar
- 4 items con icono + label
- Estado activo: icono filled + color accent

### MealCard
- Estados: default, expanded, loading, empty
- Contenido: nombre, kcal, mini macros (barras)

### RecipeCard
- Imagen, nombre, tiempo, kcal
- Tags de supermercado

### MacroBar
- 3 segmentos: protein (azul), carbs (amarillo), fat (rojo)

### CalorieRing
- Ring circular con kcal consumidas / objetivo

---

## 6. Technical Approach

### Stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Backend:** Supabase (Auth + PostgreSQL + Storage)
- **IA:** Ollama Cloud (texto + visión)
- **Barcode:** @zxing/browser + @zxing/library
- **PWA:** next-pwa + manifest.json

### Data Model (Supabase)

```sql
profiles, recipes, weekly_plans, plan_days, plan_meals, food_logs, shopping_lists, shopping_items
```

### Ollama Cloud Integration
```typescript
// POST https://ollama.cloud/api/generate
{
  model: "llava-llama3",
  prompt: "Analiza esta foto de comida...",
  images: [base64Image]
}
```

### OpenFoodFacts Integration
```typescript
// GET https://es.openfoodfacts.org/api/v2/product/{barcode}.json
```

---

## 7. File Structure

```
diet-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── recipes/
│   │   ├── shopping/
│   │   ├── profile/
│   │   └── api/
│   ├── components/
│   ├── hooks/
│   └── lib/
├── public/
│   ├── manifest.json
│   └── sw.js
└── SPEC.md
```

---

## 8. Estado del Proyecto

### ✅ FASE 0 COMPLETA
- Repo GitHub creado: AntonioXam/diet-tracker
- Next.js 15 + TypeScript + Tailwind
- Dependencias instaladas
- Tailscale IP: 100.126.164.101
- GitHub CLI autenticado

### 🚀 FASE 1 + 2 PENDIENTE
- Configurar Supabase
- Crear layout mobile-first
- Implementar onboarding
- Motor de generación de planes
- ~1000 recetas
- Integrar Ollama Cloud
- Escaneo códigos de barras
- Lista de la compra
- PWA setup
