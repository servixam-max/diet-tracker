# Diet Tracker - Sprint Backlog

> **NOTA**: Lee `AGENTS.md` antes de trabajar en cualquier sprint. Contiene las convenciones y reglas del proyecto.

---

## Sprint 1-6 ✅ COMPLETADOS
- Onboarding, Auth, Dashboard, UI/UX, PWA, Hooks

---

## Sprint 7 🔄 UX Móvil Avanzado
### Objetivo: Optimizaciones mobile natives

#### Tareas
- [ ] Pull-to-refresh real con native feel (no solo UI, detectar dirección del gesto)
- [ ] Haptic feedback en botones y acciones principales
- [ ] Swipe actions en MealCard (izquierda: delete, derecha: edit)
- [ ] Swipe actions en ShoppingList item
- [ ] Gesture navigation: swipe desde bordes para atrás
- [ ] Long-press context menus optimizados
- [ ] Loading skeletons mejorados para estados de carga
- [ ] Optimizar anima FPS (60fps target)

#### Archivos a modificar
- `src/components/dashboard/MealCard.tsx`
- `src/components/dashboard/MealList.tsx`
- `src/components/shopping/ShoppingList.tsx`
- `src/app/globals.css`

#### Criteria de aceptación
- Todas las animaciones a 60fps
- Haptic feedback funciona en iOS/Android
- Swipe actions funcionan en todas las Directiones

---

## Sprint 8 🔄 Perfil Expandido
### Objetivo: Perfil completo con estadísticas e historial

#### Tareas
- [ ] Página `/profile` con layout completo
- [ ] WeightChart: historial de peso con gráfica
- [ ] BodyMeasurements: circunferencias (brazo, cintura, cadera)
- [ ] ProgressPhotos: galería de fotos de progreso
- [ ] AchievementBadge: sistema de logros expandido
- [ ] StreakCounter: contador de rachas con estadísticas
- [ ] Stats personales: días activo, kcal consumidas, etc.
- [ ] Editar perfil inline (nombre, avatar)
- [ ] Historial de cambios de peso/medidas

#### Archivos a crear
- `src/components/profile/WeightChart.tsx` (ya existe)
- `src/components/profile/BodyMeasurements.tsx` (ya existe)
- `src/components/profile/ProgressPhotos.tsx` (ya existe)
- `src/components/profile/AchievementBadge.tsx` (ya existe)
- `src/components/profile/StreakCounter.tsx` (ya existe)

#### Archivos a modificar
- `src/app/profile/page.tsx`

#### Criteria de aceptación
- Todas las gráficas funcionan con datos reales
- Fotos de progreso se pueden subir/ver
- Logros se desbloquean correctamente

---

## Sprint 9 🔄 Lista Compra Inteligente
### Objetivo: Lista de compra automática y smart

#### Tareas
- [ ] Generación automática desde plan semanal activo
- [ ] Agrupación por supermercado (Mercadona, Lidl, Aldi, Family Cash)
- [ ] Agrupación por categoría (frutas, verduras, carnes, etc.)
- [ ] Suma de cantidades duplicadas
- [ ] Items personalizados que no vienen del plan
- [ ] Compartir lista via Web Share API (WhatsApp, Telegram)
- [ ] Exportar a texto formateado
- [ ] Check/uncheck items con persistencia
- [ ] Eliminar items con swipe
- [ ] Reordenar items drag & drop

#### API endpoints
- [ ] `POST /api/shopping-list/generate` (genera desde plan)
- [ ] `GET /api/shopping-list` (obtiene lista activa)
- [ ] `PUT /api/shopping-list/items/[id]` (actualiza item)
- [ ] `DELETE /api/shopping-list/items/[id]` (elimina item)
- [ ] `POST /api/shopping-list/items` (añade item manual)

#### Archivos a crear
- `src/components/shopping/ShoppingListItem.tsx`
- `src/components/shopping/SupermarketGroup.tsx`
- `src/components/shopping/ShareListButton.tsx`

#### Archivos a modificar
- `src/app/shopping/page.tsx`
- `src/app/api/shopping-list/route.ts`

#### Criteria de aceptación
- Lista se genera correctamente desde plan
- Items se agrupan por supermercado
- Share abre selector nativo del SO

---

## Sprint 10 🔄 Recetas Detalle
### Objetivo: Vista completa de recetas con funcionalidades

#### Tareas
- [ ] Página `/recipes/[id]` con vista detallada
- [ ] Ingredientes con cantidades y kcal
- [ ] Instrucciones paso a paso
- [ ] Valor nutricional completo (macros, vitaminas si disponible)
- [ ] Tiempo de preparación y cocinado
- [ ] Número de porciones editable
- [ ] Favoritos con persistencia en Supabase
- [ ] Compartir receta (Web Share API)
- [ ] Añadir a plan semanal
- [ ] Similar recipes (mismo supermercado o tags)
- [ ] Búsqueda con filtros avanzados

#### API endpoints
- [ ] `GET /api/recipes/[id]` (detalle de receta)
- [ ] `POST /api/recipes/[id]/favorite` (marcar favorito)
- [ ] `DELETE /api/recipes/[id]/favorite` (quitar favorito)
- [ ] `GET /api/recipes/similar/[id]` (recetas similares)

#### Archivos a crear
- `src/app/recipes/[id]/page.tsx`
- `src/components/recipes/RecipeIngredients.tsx`
- `src/components/recipes/RecipeInstructions.tsx`
- `src/components/recipes/RecipeNutrition.tsx`
- `src/components/recipes/SimilarRecipes.tsx`

#### Archivos a modificar
- `src/components/recipes/RecipeDetail.tsx`
- `src/components/recipes/RecipeCard.tsx`

#### Criteria de aceptación
- Todas las recetas tienen datos completos
- Favoritos se guardan por usuario
- Share funciona en mobile

---

## Sprint 11 🔄 Notificaciones
### Objetivo: Sistema de recordatorios y push notifications

#### Tareas
- [ ] NotificationSettings UI en `/settings`
- [ ] Permiso de notificaciones (request on/off)
- [ ] Recordatorios de comida (desayuno, almuerzo, cena, snacks)
- [ ] Hora configurable de cada recordatorio
- [ ] Recordatorio de objetivo calórico diario
- [ ] Recordatorio de pesarme (cada mañana)
- [ ] Notificación de racha en peligro
- [ ] Push notifications via Supabase Edge Functions
- [ ] Badge en icono de app
- [ ] Notificaciones locales cuando app cerrada (Service Worker)

#### API endpoints
- [ ] `POST /api/notifications/subscribe` (guardar subscription)
- [ ] `DELETE /api/notifications/unsubscribe`
- [ ] `PUT /api/notifications/preferences`

#### Archivos a crear
- `src/components/settings/NotificationSettings.tsx`
- `src/hooks/useNotifications.ts`
- `src/lib/notifications.ts`

#### Archivos a modificar
- `src/app/settings/page.tsx`
- `src/app/layout.tsx`

#### Criteria de aceptación
- Notificaciones se envían a la hora correcta
- Usuario puede configurar cada recordatorio
- Funciona cuando app está cerrada

---

## Sprint 12 🔄 Offline First Completo
### Objetivo: App funcional sin conexión

#### Tareas
- [ ] IndexedDB schema completo (recipes, plans, food_logs, profile)
- [ ] Sync bidireccional cuando hay conexión
- [ ] Conflict resolution (server wins para profile, merge para food_logs)
- [ ] OfflineIndicator visual mejorado
- [ ] Queue de acciones para sync posterior
- [ ] Almacenar recetas en IndexedDB para offline
- [ ] Almacenar plan semanal offline
- [ ] Food log funciona offline
- [ ] Indicador de datos pendientes de sync

#### Archivos a crear
- `src/lib/offline-db.ts` (ya existe, ampliar)
- `src/hooks/useOfflineSync.ts` (ya existe, mejorar)
- `src/components/ui/OfflineIndicator.tsx`

#### Archivos a modificar
- `src/app/api/*` (todas las rutas para soportar offline queue)
- `src/lib/supabase/client.ts`

#### Criteria de aceptación
- App funciona 100% offline
- Datos se syncronizan cuando hay conexión
- No hay pérdida de datos en conflicto

---

## Sprint 13 🔄 Analytics Avanzado
### Objetivo: Estadísticas y gráficos de progreso

#### Tareas
- [ ] WeeklyReport: resumen semanal con gráficas
- [ ] MonthlyTrends: tendencias mensuales
- [ ] MacroDistribution: gráfica de distribución de macros
- [ ] CalorieHistory: historial de kcal diarias
- [ ] WeightProgress: gráfica de peso con objetivo
- [ ] ActivityCorrelation: correlacionar actividad con peso
- [ ] SleepQualityAnalysis: analizar calidad de sueño
- [ ] MealTimingAnalysis: cuándo come el usuario
- [ ] Exportar reporte a PDF
- [ ] Comparar con semanas anteriores

#### API endpoints
- [ ] `GET /api/analytics/weekly`
- [ ] `GET /api/analytics/monthly`
- [ ] `GET /api/analytics/trends`

#### Archivos a crear
- `src/components/analytics/WeeklyReport.tsx`
- `src/components/analytics/MonthlyTrends.tsx`
- `src/components/analytics/MacroDistribution.tsx`
- `src/components/analytics/CalorieHistory.tsx`
- `src/components/analytics/WeightProgress.tsx`
- `src/components/analytics/MealTimingAnalysis.tsx`

#### Archivos a modificar
- `src/app/dashboard/page.tsx` (añadir sección analytics)
- `src/components/dashboard/WeeklyAnalytics.tsx`

#### Criteria de aceptación
- Todas las gráficas muestran datos reales
- Reporte se puede exportar
- Tendencias son precisas

---

## Sprint 14 🔄 Settings y Configuración
### Objetivo: Settings completos y exportación

#### Tareas
- [ ] GoalsSettings: configurar objetivos diarios (kcal, macros, agua)
- [ ] MacroCalculator: calcular macros objetivo
- [ ] UnitsToggle: sistema métrico/imperial
- [ ] DataExport: exportar todos los datos (JSON, CSV)
- [ ] ImportData: importar datos de backup
- [ ] DeleteAccount: eliminar cuenta y datos
- [ ] PrivacySettings: privacidad de datos
- [ ] About: versión, créditos, términos

#### API endpoints
- [ ] `GET /api/export/data`
- [ ] `POST /api/import/data`
- [ ] `DELETE /api/account`

#### Archivos a crear
- `src/components/settings/GoalsSettings.tsx`
- `src/components/settings/MacroCalculator.tsx`
- `src/components/settings/DataExport.tsx`
- `src/components/settings/PrivacySettings.tsx`
- `src/components/settings/About.tsx`

#### Archivos a modificar
- `src/app/settings/page.tsx`

#### Criteria de aceptación
- Export funciona con todos los datos
- Settings persisten correctamente
- Delete account elimina todo

---

## Sprint 15 🔄 AI Coach (Chat)
### Objetivo: Asistente nutricional con IA

#### Tareas
- [ ] AIChatCoach: interfaz de chat
- [ ] Integración con Ollama Cloud
- [ ] Recomendaciones personalizadas
- [ ] Responder preguntas sobre nutrición
- [ ] Adaptar plan según feedback
- [ ] Motivational quotes
- [ ] Historial de conversación
- [ ] Voice input (opcional)

#### API endpoints
- [ ] `POST /api/chat` (envía mensaje a IA)

#### Archivos a crear
- `src/components/coach/AIChatCoach.tsx`
- `src/components/coach/ChatBubble.tsx`
- `src/components/coach/QuickReplies.tsx`

#### Archivos a modificar
- `src/app/coach/page.tsx`

#### Criteria de aceptación
- Chat responde contextualmente
- Mantiene contexto de conversación
- Funciona offline (cachea respuestas)

---

## Sprint 16 🔄 Onboarding Optimizado
### Objetivo: Mejoras al onboarding existente

#### Tareas
- [ ] Onboarding guarda correctamente en Supabase profiles
- [ ] Cálculos TMB/TDEE se ejecutan bien
- [ ] Redirige a /dashboard tras completar
- [ ] 9 pasos completos según spec
- [ ] Validación de inputs
- [ ] Progress indicator
- [ ] Skip option para no obligatorios
- [ ] Back button funciona
- [ ] Preview de kcal calculadas en tiempo real

#### Archivos a modificar
- `src/app/onboarding/page.tsx`
- `src/components/onboarding/*`

#### Criteria de aceptación
- Todos los datos se guardan en profile
- Redirect funciona tras completar
- No hay errores de validación

---

## Sprint 17 🔄 Food Input Completo
### Objetivo: Sistema completo de entrada de alimentos

#### Tareas
- [ ] BarcodeScanner: escaneo con cámara
- [ ] OpenFoodFacts integration
- [ ] FoodPhotoCapture: foto de comida
- [ ] AI Food Analysis con Ollama
- [ ] Manual entry con búsqueda
- [ ] Historial de alimentos recientes
- [ ] Presets: comidas guardadas
- [ ] Favoritos de alimentos

#### API endpoints
- [ ] `POST /api/barcode-lookup`
- [ ] `POST /api/analyze-food`

#### Archivos a crear/modificar
- `src/components/add-food/BarcodeScanner.tsx`
- `src/components/add-food/CameraTab.tsx`
- `src/components/add-food/ManualEntryTab.tsx`
- `src/components/add-food/FoodResultView.tsx`

#### Criteria de aceptación
- Barcode funciona en condiciones de luz variadas
- IA reconoce comida en fotos
- Búsqueda manual es rápida

---

## Sprint 18 🔄 Plan Semanal Generator v2
### Objetivo: Generador de planes mejorado

#### Tareas
- [ ] Algoritmo: variedad de supermercados
- [ ] Algoritmo: no repetir recetas >2 veces/semana
- [ ] Algoritmo: ajustar a preferencias dietéticas
- [ ] Algoritmo: distribución calórica por comida
- [ ] Regenerar día específico
- [ ] Intercambiar días
- [ ] Guardar planes históricos
- [ ] Copiar plan de otra semana

#### API endpoints
- [ ] `POST /api/plans/generate`
- [ ] `GET /api/plans/current`
- [ ] `PUT /api/plans/[id]/days/[day]`
- [ ] `POST /api/plans/[id]/copy`

#### Archivos a crear/modificar
- `src/components/meal-planner/WeeklyMealPlanner.tsx`
- `src/components/meal-planner/MealPlanner.tsx`
- `src/app/weekly-plan/page.tsx`

#### Criteria de aceptación
- Plan genera en <5 segundos
- Variedad correcta de recetas
- Distribución calórica balanceada

---

## Sprint 19 🔄 PWA Optimization
### Objetivo: PWA perfecta en iOS y Android

#### Tareas
- [ ] Manifest completo con todos los campos
- [ ] Iconos: 192x192, 512x512, maskable
- [ ] Splash screen para iOS
- [ ] theme-color en todos los metadatos
- [ ] Standalone display mode
- [ ] Shortcuts para quick actions
- [ ] Share target para imágenes de comida
- [ ] Background sync para food logs
- [ ] Push notifications via Web Push

#### Archivos a modificar
- `public/manifest.json`
- `public/sw.js`
- `src/app/layout.tsx`

#### Criteria de aceptación
- Installable en iOS Safari y Android Chrome
- Funciona offline completamente
- Push notifications funcionan

---

## Sprint 20 🔄 Testing Completo
### Objetivo: Suite de tests completa

#### Tareas
- [ ] Tests unitarios para utilities
- [ ] Tests de componentes con React Testing Library
- [ ] Tests de API routes
- [ ] Tests E2E con Playwright (auth flow completo)
- [ ] Tests E2E para onboarding
- [ ] Tests de responsive mobile
- [ ] Tests de offline behavior
- [ ] Coverage >80%

#### Archivos a crear
- `src/tests/*.test.ts`
- `src/tests/*.test.tsx`
- `tests/e2e/*.spec.ts`

#### Criteria de aceptación
- Todos los tests pasan
- Coverage报告显示>80%
- CI/CD corre tests en cada push

---

## Sprint 21 🔄 Performance Optimization
### Objetivo: App ultrarrápida

#### Tareas
- [ ] Lighthouse score >90 en Performance
- [ ] Code splitting por ruta
- [ ] Lazy loading de componentes heavy
- [ ] Image optimization con next/image
- [ ] Font optimization (subset, preload)
- [ ] Bundle size <200KB initial
- [ ] Prefetch de rutas próximas
- [ ] Service Worker caching strategies
- [ ] Virtual list para listas largas

#### Criteria de aceptación
- Lighthouse Performance >90
- First Contentful Paint <1.5s
- Time to Interactive <3s

---

## Sprint 22 🔄 Deploy y DevOps
### Objetivo: Pipeline de deploy completo

#### Tareas
- [ ] Script de deploy automatizado
- [ ] Environment variables en Vercel
- [ ] Database migrations setup
- [ ] CI/CD con GitHub Actions
- [ ] Preview deployments para PRs
- [ ] Monitoring con error tracking (Sentry)
- [ ] Analytics de uso (opcional, privacy-first)
- [ ] Backup automático de Supabase

#### Archivos a crear
- `.github/workflows/deploy.yml`
- `scripts/deploy.sh`

#### Criteria de aceptación
- Deploy a producción en <5 minutos
- Zero downtime deploys
- Rollback en <1 minuto

---

## Notas Importantes

### Dependencias entre Sprints
```
Sprint 7 (UX Móvil) → Sprint 12 (Offline) → Sprint 19 (PWA)
Sprint 8 (Perfil) → Sprint 13 (Analytics)
Sprint 9 (Lista Compra) → Sprint 10 (Recetas) → Sprint 18 (Plan Generator)
Sprint 11 (Notificaciones) → Sprint 15 (AI Coach)
Sprint 20 (Testing) → Sprint 21 (Performance)
```

### Prioridades
1. **Alta**: Sprint 7, 8, 9, 10 - Funcionalidad core
2. **Media**: Sprint 11, 12, 13, 14 - Experiencia completa
3. **Baja**: Sprint 15, 16, 17, 18, 19, 20, 21, 22 - Enhancements

### Definition of Done
- [ ] Código implementado
- [ ] Tests pasan
- [ ] No console.log/debug остались
- [ ] TypeScript sin errores
- [ ] Lint pasa
- [ ] Manual testing en mobile
- [ ] Documentación actualizada
