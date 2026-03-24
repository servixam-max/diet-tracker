# Diet Tracker - TODO

> **NOTA**: Este archivo muestra TODAS las tareas pendientes. Para ver el sprint actual, consulta `SPRINT.md`.

---

## 🔄 Sprint 7: UX Móvil Avanzado

### Pull-to-Refresh
- [ ] Detectar dirección del gesto (vertical)
- [ ] Feedback visual inmediato
- [ ] Spinner con native feel
- [ ] Refresh data al soltar

### Haptic Feedback
- [ ] Feedback en botones principales
- [ ] Feedback en swipe actions
- [ ] Feedback en éxito/error de acciones

### Swipe Actions
- [ ] MealCard: swipe izquierda (delete), derecha (edit)
- [ ] ShoppingListItem: swipe izquierda (delete), derecha (check)
- [ ] FoodLogItem: swipe para delete
- [ ] Animación suave con framer-motion

### Performance
- [ ] Todas las animaciones 60fps
- [ ] Lazy load imágenes
- [ ] Virtual list para listas largas
- [ ] Reduce re-renders

---

## 🔄 Sprint 8: Perfil Expandido

### Weight Tracking
- [ ] WeightChart con datos reales
- [ ] Añadir nuevo peso
- [ ] Editar peso anterior
- [ ] Eliminar entrada
- [ ] Goal line en gráfica

### Body Measurements
- [ ] BodyMeasurements UI
- [ ] Guardar medidas (brazo, cintura, cadera, pecho)
- [ ] Histórico de medidas
- [ ] Gráfica de progreso

### Progress Photos
- [ ] Subir foto
- [ ] Galería de fotos
- [ ] Ver foto en grande
- [ ] Eliminar foto

### Achievements
- [ ] Sistema de logros completo
- [ ] 12+ logros con XP
- [ ] Toast al desbloquear
- [ ] Mostrar en perfil

### Streak Counter
- [ ] Contador de racha actual
- [ ] Mejor racha histórica
- [ ] Calendario visual
- [ ] Alertas de racha en peligro

---

## 🔄 Sprint 9: Lista Compra Inteligente

### Generación Automática
- [ ] Detectar plan semanal activo
- [ ] Extraer todos los ingredientes
- [ ] Agrupar por supermercado
- [ ] Sumar cantidades duplicadas

### UI Lista
- [ ] Check/uncheck items
- [ ] Drag & drop reorder
- [ ] Swipe to delete
- [ ] Item count badge
- [ ] Empty state

### Compartir
- [ ] Web Share API
- [ ] WhatsApp format
- [ ] Telegram format
- [ ] Copy to clipboard fallback

### Items Personalizados
- [ ] Añadir item manual
- [ ] Editar item existente
- [ ] Sin asociar a receta

---

## 🔄 Sprint 10: Recetas Detalle

### Vista Detalle
- [ ] Página `/recipes/[id]`
- [ ] Imagen principal
- [ ] Nombre y descripción
- [ ] Tiempo de prep/cocinado
- [ ] Porciones editables
- [ ] Ingredientes con cantidades
- [ ] Instrucciones paso a paso
- [ ] Info nutricional completa

### Funcionalidades
- [ ] Favoritos (toggle)
- [ ] Compartir receta
- [ ] Añadir a plan semanal
- [ ] Recetas similares
- [ ] Filtros: supermercado, tiempo, kcal

### Búsqueda
- [ ] Search bar
- [ ] Filtros avanzados
- [ ] Resultados instantáneos
- [ ] Empty state

---

## 🔄 Sprint 11: Notificaciones

### Configuración
- [ ] Toggle principal notificaciones
- [ ] Recordatorio desayuno (hora)
- [ ] Recordatorio almuerzo (hora)
- [ ] Recordatorio cena (hora)
- [ ] Recordatorio snacks (hora)
- [ ] Recordatorio peso matutino
- [ ] Alerta racha en peligro

### Push
- [ ] Request permission
- [ ] Store subscription
- [ ] Send test notification
- [ ] Handle notification tap

### UI
- [ ] Preview de notificación
- [ ] Test sound/vibration
- [ ] Quiet hours option

---

## 🔄 Sprint 12: Offline First

### IndexedDB
- [ ] Schema completo
- [ ] profiles store
- [ ] recipes store
- [ ] plans store
- [ ] food_logs store
- [ ] shopping_lists store

### Sync
- [ ] Queue de acciones
- [ ] Sync al reconectar
- [ ] Conflict resolution (server wins)
- [ ] Retry logic con exponential backoff

### Offline UI
- [ ] OfflineIndicator component
- [ ] Banner cuando offline
- [ ] Badge en items pending sync

### Data
- [ ] Cache recipes for offline
- [ ] Cache current plan
- [ ] Full food_log offline
- [ ] Partial sync (critical data first)

---

## 🔄 Sprint 13: Analytics

### Weekly Report
- [ ] Resumen semanal completo
- [ ] Gráficas de kcal
- [ ] Gráficas de macros
- [ ] Comparación con semana anterior
- [ ] Export to PDF

### Monthly Trends
- [ ] Tendencias mensuales
- [ ] Progress hacia objetivo
- [ ] Predicción de peso
- [ ] Análisis de adherencia

### Nutrition Analysis
- [ ] Distribución de macros
- [ ] Micronutrientes
- [ ] Calidad de la dieta
- [ ] Suggestions de mejora

---

## 🔄 Sprint 14: Settings

### Goals
- [ ] Daily calorie goal
- [ ] Protein goal (g/kg)
- [ ] Carbs goal (%)
- [ ] Fat goal (%)
- [ ] Water goal (L)
- [ ] Sleep goal (hours)

### Preferences
- [ ] Theme (dark/light/auto)
- [ ] Units (metric/imperial)
- [ ] Language (es/en)
- [ ] Notification preferences

### Data
- [ ] Export all data (JSON)
- [ ] Export all data (CSV)
- [ ] Import from backup
- [ ] Delete account
- [ ] Delete all data

---

## 🔄 Sprint 15: AI Coach

### Chat Interface
- [ ] AIChatCoach component
- [ ] Message bubbles
- [ ] Quick replies
- [ ] Typing indicator
- [ ] Scroll to bottom

### AI Integration
- [ ] Ollama Cloud integration
- [ ] Context: user profile, plan, goals
- [ ] Conversational memory
- [ ] Personalized suggestions

### Features
- [ ] Recipe recommendations
- [ ] Meal substitutions
- [ ] Motivation and tips
- [ ] Progress celebrations
- [ ] Voice input (optional)

---

## 🔄 Sprint 16: Onboarding

### Data Flow
- [ ] Save all data to Supabase profiles
- [ ] TMB/TDEE calculations correct
- [ ] Redirect to /dashboard on complete
- [ ] Save completion flag

### UI/UX
- [ ] Progress bar accurate
- [ ] Back button works
- [ ] Skip for optional steps
- [ ] Real-time kcal preview
- [ ] Input validation

---

## 🔄 Sprint 17: Food Input

### Barcode Scanner
- [ ] Camera with overlay guides
- [ ] @zxing integration
- [ ] Vibration on detect
- [ ] OpenFoodFacts lookup
- [ ] Manual fallback

### Photo Analysis
- [ ] Camera capture
- [ ] Gallery select
- [ ] Ollama vision API
- [ ] Result display
- [ ] Add to log

### Manual Entry
- [ ] Search existing foods
- [ ] Recent foods
- [ ] Presets (saved meals)
- [ ] Quick add with macros

---

## 🔄 Sprint 18: Plan Generator v2

### Algorithm
- [ ] Variety by supermarket
- [ ] Max 2x same recipe/week
- [ ] Respect dietary restrictions
- [ ] Calorie distribution per meal
- [ ] Protein distribution

### UI
- [ ] Regenerate single day
- [ ] Swap meals between days
- [ ] Save as template
- [ ] Load from template
- [ ] Copy from previous week

---

## 🔄 Sprint 19: PWA Optimization

### Manifest
- [ ] All required fields
- [ ] Icons: 192, 512, maskable
- [ ] Splash screen (iOS)
- [ ] theme-color correct
- [ ] Standalone display

### Service Worker
- [ ] Cache strategies
- [ ] Offline fallback page
- [ ] Background sync
- [ ] Push notification handling

### Install
- [ ] Install prompt
- [ ] iOS install instructions
- [ ] Android install instructions

---

## 🔄 Sprint 20: Testing

### Unit Tests
- [ ] Nutrition calculations
- [ ] Utility functions
- [ ] Hook behavior

### Component Tests
- [ ] Form components
- [ ] Button components
- [ ] Card components

### API Tests
- [ ] Auth endpoints
- [ ] Profile endpoints
- [ ] Food log endpoints

### E2E Tests (Playwright)
- [ ] Register → Login → Logout
- [ ] Onboarding flow
- [ ] Food logging flow
- [ ] Plan generation
- [ ] Shopping list

### Coverage
- [ ] Target: 80%+
- [ ] Critical paths: 100%

---

## 🔄 Sprint 21: Performance

### Metrics
- [ ] FCP < 1.5s
- [ ] TTI < 3s
- [ ] Lighthouse > 90

### Optimizations
- [ ] Code splitting per route
- [ ] Lazy load heavy components
- [ ] next/image for all images
- [ ] Font subsetting
- [ ] Bundle < 200KB

---

## 🔄 Sprint 22: Deploy

### CI/CD
- [ ] GitHub Actions
- [ ] Auto deploy on push
- [ ] Preview on PR
- [ ] Environment checks

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring

### Backup
- [ ] Supabase auto backup
- [ ] Export scripts
- [ ] Recovery plan

---

## Dependencias entre Sprints

```
Sprint 7 (UX Móvil)
    ↓
Sprint 9 (Lista Compra) ← Sprint 10 (Recetas)
    ↓                      ↓
Sprint 18 (Plan Generator v2)
    ↓
Sprint 12 (Offline) → Sprint 19 (PWA)

Sprint 8 (Perfil)
    ↓
Sprint 13 (Analytics)

Sprint 11 (Notificaciones)
    ↓
Sprint 15 (AI Coach)

Sprint 20 (Testing)
    ↓
Sprint 21 (Performance)
    ↓
Sprint 22 (Deploy)
```

---

## Prioridades

### Alta (Core)
1. Sprint 7 - UX Móvil
2. Sprint 8 - Perfil
3. Sprint 9 - Lista Compra
4. Sprint 10 - Recetas

### Media (Experience)
5. Sprint 11 - Notificaciones
6. Sprint 12 - Offline
7. Sprint 13 - Analytics
8. Sprint 14 - Settings

### Baja (Enhancement)
9. Sprint 15 - AI Coach
10. Sprint 16 - Onboarding
11. Sprint 17 - Food Input
12. Sprint 18 - Plan Generator
13. Sprint 19 - PWA
14. Sprint 20 - Testing
15. Sprint 21 - Performance
16. Sprint 22 - Deploy
