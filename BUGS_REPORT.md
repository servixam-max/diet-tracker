# 🐛 Reporte de Bugs - Diet Tracker

## Estado: 2026-04-06 13:30

### ✅ Bugs Críticos Corregidos

#### 1. **useEffect con setState síncrono** (Cascading renders)
**Archivos corregidos:**
- ✅ `MotivationQuote.tsx` - Línea 30-33
- ✅ `ProgressPhotos.tsx` - Línea 42-45, 72
- ✅ `AchievementBadge.tsx` - Línea 76

**Solución:** Usar lazy initialization en useState en lugar de useEffect
```typescript
// ❌ Antes
useEffect(() => {
  setState(valor);
}, []);

// ✅ Ahora
const [state, setState] = useState(() => valor);
```

#### 2. **SSR/Hydration mismatch**
**Archivos corregidos:**
- ✅ Componentes que acceden a localStorage ahora verifican `typeof window !== "undefined"`

---

### ⚠️ Bugs Pendientes (No críticos para producción)

#### 1. **Imágenes con <img>**
- 15+ imágenes usan <img> en lugar de Next.js Image
- Impacto: LCP más lento, sin optimización
- **Fix:** Reemplazar por <Image/> de next/image

#### 2. **Variables sin usar**
- 40+ imports no usados
- No afectan funcionamiento, solo bundle size

#### 3. **Dependencias en useEffect**
- `WeeklyPlanView.tsx` - falta `fetchPlan`
- `AuthProvider.tsx` - falta `refreshUser`
- **Riesgo:** Stale closures

---

### 🔴 Bugs de UX/UI Encontrados

#### 1. **Demo Mode**
- ❌ No hay manera clara de salir del modo demo
- ❌ Botón de login poco visible
- ✅ **Fix aplicado:** Botones prominentes en perfil

#### 2. **Navegación Perfil**
- ❌ BottomNavBar tapado por contenido
- ✅ **Fix aplicado:** Padding inferior añadido

#### 3. **Offline Manager**
- ❌ Botón "Sincronizar" sin funcionalidad real
- ⚠️ No hay persistencia de datos offline

---

### 🧪 Tests Recomendados

#### Flujos críticos a testear:
1. ✅ Registro completo → Onboarding → Dashboard
2. ✅ Login → Añadir comida → Ver stats
3. ⚠️ Demo mode → Salir → Login real → Datos persistentes
4. ❌ Offline → Añadir comida → Online → Sync
5. ⚠️ Notificaciones push (requiere permisos)
6. ⚠️ Recetas → Detalle → Modo cocina → Timer

#### Dispositivos:
- [ ] iPhone Safari (iOS 17+)
- [ ] Android Chrome (Android 14)
- [ ] Desktop Chrome (Windows/Mac)
- [ ] iPad (modo tablet)

---

### 📊 Estadísticas de Código

```
Errores TS: 0 (corregidos)
Warnings ESLint: 47 (mayoría: imports sin usar)
Imágenes sin optimizar: 15
Rutas dinámicas con problemas SSR: 2
```

### 🎯 Prioridades Post-Deploy

1. **Alta:** Optimizar imágenes (<Image/>)
2. **Alta:** Fix dependencias useEffect
3. **Media:** Quitar imports sin usar
4. **Baja:** Tests E2E automatizados

---

**Generado automáticamente por análisis de código**
