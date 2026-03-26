# 🥗 Diet Tracker - Análisis Completo

**Fecha:** 26 de marzo de 2026  
**Autor:** OpenClaw Analysis Team

---

## 1. RESUMEN EJECUTIVO

Diet Tracker es una **PWA de nutrición** construida con Next.js 16 + React 19 + TypeScript, diseñada para tracking de comidas, generación de planes semanales, y análisis con IA. Actualmente tiene **6 de 22 sprints completados** (core funcional listo), ~80 componentes, 16 rutas API, y arquitectura híbrida Supabase + IndexedDB. El código base es sólido pero requiere limpieza de deuda técnica y completar features de UX móvil para estar lista para producción pública.

---

## 2. BASE DE DATOS: SUPABASE vs LOCAL

### Opción A: Supabase (Actual) ✅

**Ventajas:**
- ✅ Auth gestionado (email/password, magic links, OAuth)
- ✅ Sync automático entre dispositivos
- ✅ RLS (Row Level Security) para privacidad
- ✅ Real-time subscriptions (útil para sync)
- ✅ Backup automático y escalabilidad
- ✅ Free tier: 500MB DB, 50K usuarios/mes (suficiente para MVP)

**Desventajas:**
- ❌ Dependencia externa (si cae Supabase, cae tu app)
- ❌ Latencia en operaciones (50-200ms vs <10ms local)
- ❌ Coste después del free tier (~$25/mes)
- ❌ Requiere conexión para funcionalidad completa

**Estado actual:** Bien implementado con `@supabase/ssr` para SSR + cookies HttpOnly.

---

### Opción B: IndexedDB/SQLite Local

**Ventajas:**
- ✅ Offline total (funciona sin internet)
- ✅ Velocidad máxima (<10ms para todo)
- ✅ Privacidad total (datos nunca salen del dispositivo)
- ✅ Coste cero
- ✅ PWA instalable como app nativa

**Desventajas:**
- ❌ No hay sync entre dispositivos
- ❌ Auth hay que implementarlo (JWT local, biometrics)
- ❌ Backup manual del usuario
- ❌ Pérdida de datos si borran cache/clean

**Estado actual:** `offline-db.ts` ya existe con schema para foodLogs, weeklyPlans, syncQueue.

---

### Opción C: Híbrido (RECOMENDADO) 🏆

**Arquitectura:** IndexedDB primero + sync opcional a Supabase

```
┌─────────────┐     ┌─────────────┐
│  IndexedDB  │────▶│   Supabase  │
│ (Primary)   │     │  (Backup)   │
└─────────────┘     └─────────────┘
       │
       ▼
  Offline-first
  Sync cuando hay red
```

**Implementación:**
1. Todas las writes van a IndexedDB primero
2. Si hay conexión + usuario logueado → sync a Supabase
3. Si offline → queue en `syncQueue` y sync al reconectar
4. Auth: JWT local + opción de vincular cuenta Supabase

**Ventajas:**
- ✅ Funciona 100% offline
- ✅ Sync opcional para multi-dispositivo
- ✅ Privacidad: usuario elige qué sincronizar
- ✅ Resiliente: si Supabase cae, la app sigue funcionando

**Recomendación:** **Migrar a híbrido en Sprint 12** (ya planeado). El código base (`offline-db.ts`, `useOfflineSync.ts`) ya está preparado.

---

## 3. DEPLOYMENT OPCIONES

### A. Vercel (Recomendado en docs)

**Pros:**
- ✅ Deploy con `git push` (CI/CD incluido)
- ✅ Edge functions para API routes
- ✅ Free tier generoso (100GB bandwidth/mes)
- ✅ Preview deployments por PR
- ✅ Analytics y logs integrados

**Contras:**
- ❌ Vendor lock-in (pero easy to export)
- ❌ Serverless cold starts (~100-300ms)

**Configuración actual:** `vercel.json` ya existe. Ready to deploy.

**Coste:** $0 hasta ~10K usuarios/día.

---

### B. Docker + VPS

**Pros:**
- ✅ Control total
- ✅ Sin cold starts
- ✅ Coste fijo (~$5/mes en Hetzner/DigitalOcean)

**Contras:**
- ❌ Setup y mantenimiento (security patches, backups)
- ❌ Escalar manualmente

**Dockerfile sugerido:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./.next
COPY public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

---

### C. PWA Standalone

**Pros:**
- ✅ Installable desde navegador
- ✅ Offline total con service worker
- ✅ Sin app stores (no comisiones, no reviews)

**Contras:**
- ❌ Sin notificaciones push en iOS <16.4
- ❌ Menos discoverability

**Estado:** `manifest.json` + `sw.js` ya implementados. **Lista para install.**

---

### D. Tailscale (Actual)

**Estado:** Accesible en `http://100.126.164.101:3000`  
**Uso:** Solo desarrollo/testing. **No para producción.**

---

### 🎯 RECOMENDACIÓN DEPLOYMENT

**Fase 1 (MVP - 2 semanas):**
1. Deploy a **Vercel** (gratis, 1 hora de setup)
2. Conectar dominio personalizado (opcional)
3. Variables de entorno en Vercel dashboard

**Fase 2 (Crecimiento - 3-6 meses):**
1. Si >10K usuarios/día → evaluar VPS + Docker
2. Implementar CDN para assets estáticos
3. Database: mantener Supabase o migrar a PostgreSQL self-hosted

**Comandos para deploy Vercel:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 4. DEUDA TÉCNICA IDENTIFICADA

### 🔴 Crítico (P0)

| Issue | Impacto | Solución |
|-------|---------|----------|
| Archivos `.bak` en repo | Confusión, código muerto | `rm **/*.bak` |
| `recipes.ts.bak`, `recipes.backup.ts` | 450KB+ de datos duplicados | Limpiar, dejar solo `recipes.ts` |
| `AIChatCoach.tsx.bak` | Código duplicado | Eliminar o integrar |
| Auth sin email verification | Cuentas falsas/spam | Activar en Supabase |

### 🟡 Alto (P1)

| Issue | Impacto | Solución |
|-------|---------|----------|
| Sprints 7-22 pendientes | Features clave faltan | Priorizar (ver roadmap abajo) |
| Tests E2E: 5 specs, cobertura desconocida | Bugs en producción no detectados | Run `npm run test:e2e`, medir cobertura |
| Tests unit: 3 files (`api.test.ts`, `validation.test.ts`, `nutrition-calculations.test.ts`) | Lógica crítica sin test | Añadir tests para hooks y utils |
| `useOfflineSync.ts` sin tests | Sync puede fallar silenciosamente | Tests de integración |
| Error handling genérico (`catch { return { error: "..." } }`) | Debug difícil en prod | Logger estructurado + Sentry |

### 🟢 Medio (P2)

| Issue | Impacto | Solución |
|-------|---------|----------|
| 16 rutas API sin rate limiting | Posible abuso | Middleware de rate limit |
| Sin monitoring (Sentry, LogRocket) | Errors invisibles | Integrar Sentry |
| Sin analytics de uso | No sabes qué features se usan | PostHog o Plausible |
| `TODO.md` con 8KB de tareas | Deuda documentada pero no priorizada | Migrar a GitHub Issues |

---

## 5. ROADMAP PRIORIZADO (Sprints 7-22)

### P0: Crítico para MVP (2-3 semanas)

| Sprint | Feature | Effort | Valor | Por qué |
|--------|---------|--------|-------|---------|
| **7** | UX Móvil Avanzado | 3d | Alto | Pull-to-refresh, haptics, swipe = sensación nativa |
| **12** | Offline First | 5d | Crítico | Funciona sin internet = retención |
| **9** | Lista Compra Inteligente | 2d | Alto | Feature diferenciadora vs MyFitnessPal |
| **11** | Notificaciones | 2d | Alto | Recordatorios = menos churn |

**Total P0:** ~12 días

---

### P1: Alto Valor (3-4 semanas)

| Sprint | Feature | Effort | Valor | Por qué |
|--------|---------|--------|-------|---------|
| **8** | Perfil Expandido | 3d | Medio | Engagement (peso, fotos, logros) |
| **10** | Recetas Detalle | 2d | Alto | Core feature (ver ingredientes, pasos) |
| **13** | Analytics | 4d | Alto | Ver progreso = motivación |
| **14** | Settings | 2d | Medio | Exportar datos, borrar cuenta (GDPR) |

**Total P1:** ~11 días

---

### P2: Nice to Have (4-6 semanas)

| Sprint | Feature | Effort | Valor | Por qué |
|--------|---------|--------|-------|---------|
| **15** | AI Coach | 5d | Medio | Diferenciador, pero no esencial |
| **16** | Social/Compartir | 3d | Bajo | Viral growth, pero post-MVP |
| **17** | Integraciones (Apple Health, Google Fit) | 4d | Medio | Nice to have |
| **18-22** | Polish, Testing, Deploy | 10d | Alto | Calidad, pero se puede iterar |

**Total P2:** ~22 días

---

### 📅 Timeline Sugerido

```
Semana 1-2:  Sprints 7, 9 (UX Móvil + Lista Compra)
Semana 3:    Sprint 12 (Offline First) → MVP listo
Semana 4:    Sprint 11 (Notificaciones)
Semana 5-6:  Sprints 8, 10, 13 (Perfil, Recetas, Analytics)
Semana 7-8:  Sprint 14 (Settings) + Deploy Vercel
Semana 9+:   Sprints 15-22 (AI Coach, polish, tests)
```

**MVP en 4 semanas** si hay 1-2 devs full-time.

---

## 6. CONCLUSIONES

### ¿Está lista para producción?

**Respuesta corta:** **Sí, pero con reservas.**

**Funcional para:**
- ✅ Tracking de comidas (manual, barcode, foto con IA)
- ✅ Login/registro
- ✅ Planes semanales
- ✅ Dashboard con macros/calorías
- ✅ PWA installable

**Falta para producción pulida:**
- ❌ Offline real (Sprint 12)
- ❌ UX móvil nativa (Sprint 7: pull-to-refresh, haptics)
- ❌ Notificaciones (Sprint 11)
- ❌ Limpieza de deuda técnica (.bak files, tests)

---

### 🎯 Mínimo para Lanzar (2 semanas)

1. **Limpiar repo:** `find . -name "*.bak" -delete`
2. **Sprint 7:** UX móvil (pull-to-refresh, haptics, swipe)
3. **Sprint 11:** Notificaciones push/locales
4. **Deploy Vercel:** 1 hora
5. **Tests E2E:** Run y fix failing tests
6. **Analytics:** PostHog o Plausible (1 hora)

---

### 💡 Recomendaciones Estratégicas

1. **No reescribir nada.** El código base es sólido.
2. **Migrar a híbrido (IndexedDB + Supabase)** en Sprint 12 para offline total.
3. **Deploy early, deploy often.** Vercel es gratis, lanza ya y itera.
4. **Prioriza UX móvil.** La mayoría del tráfico será mobile.
5. **Mide todo.** Analytics desde día 1 para saber qué features importan.

---

## 7. PRÓXIMOS PASOS INMEDIATOS

```bash
# 1. Limpiar archivos .bak
cd diet-tracker
find . -name "*.bak" -delete
find . -name "*.backup.ts" -delete

# 2. Run tests
npm test
npm run test:e2e

# 3. Build de producción
npm run build

# 4. Deploy a Vercel
npm install -g vercel
vercel login
vercel --prod

# 5. Crear GitHub Issues para sprints P0
# (usar roadmap de arriba)
```

---

**Firmado:** OpenClaw Analysis Team 🤖  
**Próxima revisión:** Después de Sprint 7 completion
