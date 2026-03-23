# Diet Tracker PWA - Checklist Completo

## FASE 1: AUTH COMPLETO ✅
- [x] Schema SQL perfiles (supabase/schema.sql)
- [ ] API /api/auth/register (POST)
- [ ] API /api/auth/login (POST)
- [ ] API /api/auth/logout (POST)
- [ ] API /api/auth/session (GET)
- [ ] API /api/profile (GET, PUT)
- [ ] AuthProvider.tsx (context)
- [ ] Actualizar layout.tsx con AuthProvider
- [ ] /login/page.tsx (formulario)
- [ ] /register/page.tsx (formulario)
- [ ] Middleware protección rutas
- [ ] Redirección login → dashboard

## FASE 2: ONBOARDING FUNCIONAL
- [ ] Onboarding guarda en Supabase profiles
- [ ] Cálculos TMB/TDEE se ejecutan
- [ ] Redirige a /dashboard tras completar
- [ ] 9 pasos completos según spec

## FASE 3: DB + RECIPES
- [ ] Ejecutar schema.sql en Supabase
- [ ] Tablas: profiles, recipes, weekly_plans, plan_days, plan_meals, food_logs, shopping_lists, shopping_items
- [ ] RLS policies
- [ ] Seed ~50 recetas españolas
- [ ] API /api/recipes (GET con filtros)
- [ ] API /api/recipes/[id] (GET)

## FASE 4: DASHBOARD REAL
- [ ] Carga plan desde Supabase
- [ ] Muestra día actual con comidas
- [ ] MealCard componente (default, expanded, loading, empty)
- [ ] MacroBar componente
- [ ] CalorieRing componente
- [ ] Pull-to-refresh
- [ ] Tap expandir detalles
- [ ] Acciones: Del plan, Cambiar, Escanear, Foto IA, Manual

## FASE 5: PLAN SEMANAL GENERATOR
- [ ] /api/plans/generate (POST)
- [ ] /api/plans/current (GET)
- [ ] Lógica: 3/4/5 comidas, kcal target, preferencias
- [ ] Distribución calórica por comida
- [ ] No repetir recetas >2 veces/semana
- [ ] Variedad supermercados

## FASE 6: LISTA DE LA COMPRA
- [ ] /api/shopping-list (GET)
- [ ] /api/shopping-list/generate (POST)
- [ ] /api/shopping-list/[id]/toggle (PUT)
- [ ] Extrae ingredientes del plan
- [ ] Agrupa por supermercado
- [ ] Suma cantidades
- [ ] Componente ShoppingList
- [ ] Web Share API (WhatsApp, Telegram)
- [ ] Exportar a texto

## FASE 7: SCANNER + FOTO IA
- [ ] /api/analyze-food (POST) - Ollama Cloud
- [ ] /api/barcode-lookup (POST) - OpenFoodFacts
- [ ] CameraScanner.tsx (@zxing)
- [ ] FoodPhotoCapture.tsx
- [ ] Vibración al detectar
- [ ] Overlay guías cámara
- [ ] Fallback entrada manual

## FASE 8: PWA
- [ ] manifest.json completo
- [ ] sw.js Service Worker
- [ ] offline caching
- [ ] Installable en iOS/Android
- [ ] Iconos 192x192, 512x512

## COMPONENTES UI (según spec)
- [ ] BottomNavBar (4 items, estado activo)
- [ ] MealCard (estados: default, expanded, loading, empty)
- [ ] RecipeCard (imagen, nombre, tiempo, kcal, tags supermercado)
- [ ] MacroBar (3 segmentos: protein/carbs/fat)
- [ ] CalorieRing (ring circular kcal)

## BOTS (según prompt original)
Bot 1: UI/UX
- [ ] Estructura carpetas
- [ ] Layout base sin scroll
- [ ] Navegación tipo app

Bot 2: DBA & Auth
- [ ] Config Supabase
- [ ] Esquemas completos
- [ ] Flujo registro

Bot 3: Algoritmo Nutricional
- [ ] Onboarding (TMB, NEAT, déficit/superávit)
- [ ] Asignación calorías diarias

Bot 4: Plan Semanal
- [ ] Motor generación
- [ ] 3/4/5 comidas
- [ ] Preferencias

Bot 5: Supermercados/Recetas
- [ ] Lógica ~1000 recetas
- [ ] OpenFoodFacts
- [ ] Lidl, Mercadona, Aldi, Family Cash

Bot 6: Vision & Barcode
- [ ] Cámara móvil
- [ ] QuaggaJS/Zxing
- [ ] Endpoint /api/analyze-food
- [ ] Ollama Cloud

Bot 7: Lista Compra
- [ ] Extrae ingredientes plan
- [ ] Genera lista exportable
- [ ] Web Share API

Bot 8: DevOps & QA
- [ ] Scripts Tailscale
- [ ] Tests responsividad
- [ ] Preparación Vercel

## DEPLOY
- [ ] Scripts deploy-local.sh
- [ ] scripts/supabase-setup.sh
- [ ] .env.local.example
- [ ] .gitignore
- [ ] TESTING.md

## CHECKLIST FUNCIONALIDADES
### Onboarding
- [ ] Paso 1: Nombre + idioma
- [ ] Paso 2: Edad, género
- [ ] Paso 3: Peso, altura
- [ ] Paso 4: Actividad (5 niveles)
- [ ] Paso 5: Objetivo (lose/maintain/gain)
- [ ] Paso 6: Velocidad (slow/medium/fast)
- [ ] Paso 7: Preferencias (vegetariano, sin gluten, etc)
- [ ] Paso 8: Comensales (1-6+)
- [ ] Paso 9: Resumen + kcal calculadas

### Dashboard
- [ ] Vista día actual
- [ ] Cards de comidas
- [ ] Pull-to-refresh
- [ ] Tap expandir
- [ ] Long-press menú
- [ ] Swipe acciones

### Recetas
- [ ] Base datos searchable
- [ ] Filtros: supermercado, tiempo, kcal
- [ ] Detalle con ingredientes

### Lista Compra
- [ ] Generación automática
- [ ] Agrupada por supermercado
- [ ] Exportable (WhatsApp, Telegram)
