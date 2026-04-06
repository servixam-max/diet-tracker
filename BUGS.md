# 🐛 Errores Conocidos - Diet Tracker

## Errores Críticos (Fix Inmediato)

### 1. useEffect con setState síncrono ❌
**Archivos afectados:**
- `MotivationQuote.tsx` - Línea 30-33
- `ProgressPhotos.tsx` - Línea 42-45, 72
- `BodyMeasurements.tsx` - Línea 45
- `AchievementBadge.tsx` - Línea 76

**Problema:**
```typescript
useEffect(() => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  setQuoteIndex(randomIndex);  // ❌ setState síncrono
}, []);
```

**Solución:** Usar useMemo o inicializar en render
```typescript
const [quoteIndex, setQuoteIndex] = useState(() => 
  Math.floor(Math.random() * quotes.length)
);
```

### 2. Imágenes con <img> en lugar de Next.js Image ⚠️
**Archivos:**
- `recipes/[id]/page.tsx` - Líneas 269, 738
- Muchos componentes de recetas

**Problema:** No optimiza imágenes, afecta LCP

**Solución:** Reemplazar por `<Image />` de Next.js

### 3. Dependencias faltantes en useEffect ⚠️
**Archivos:**
- `WeeklyPlanView.tsx` - Línea 96: falta `fetchPlan`
- `AuthProvider.tsx` - Línea 115: falta `refreshUser`

### 4. Variables sin usar (acumulación de deuda técnica) ⚠️
**Archivos con imports sin usar:**
- `dashboard/page.tsx` - Flame, Target, Zap
- `profile/page.tsx` - handleLogout
- `recipes/[id]/page.tsx` - setRecipe, setSimilarRecipes
- Y 30+ más...

## Errores de UX/UI

### 1. Demo Mode - No se puede salir ❌
**Estado:** Parcialmente arreglado
**Falta:** Botón más visible, navegación clara

### 2. Perfil - BottomNavBar no visible ❌
**Causa:** Contenido tapa la barra
**Fix:** Añadido padding inferior

### 3. Notificaciones - No funcionan en móvil ❓
**Verificar:** Permisos push en iOS/Android

## Errores de API/Backend

### 1. API routes con problemas de SSR ⚠️
**Archivos:**
- `/api/barcode-lookup/route.ts`
- `/api/recipes/route.ts`

**Error:** Dynamic server usage - usando searchParams en build estático

**Solución:** Añadir `export const dynamic = 'force-dynamic'`

### 2. CORS en API externas ❓
**Verificar:** Ollama API desde Vercel

## Tests Recomendados

### Flujos críticos:
1. ✅ Registro → Onboarding → Dashboard
2. ✅ Login → Añadir comida → Ver dashboard
3. ⚠️ Demo mode → Salir → Login real
4. ⚠️ Modo offline → Sync
5. ❌ Notificaciones push
6. ⚠️ Recetas → Detalle → Modo cocina

### Devices a testear:
- iOS Safari
- Android Chrome
- Desktop Chrome
