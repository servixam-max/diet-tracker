# Deploy Manual - Diet Tracker

## Problema Detectado

Vercel no está desplegando los cambios automáticamente aunque el push a GitHub funciona correctamente.

**Estado actual:**
- ✅ Código actualizado en `main`
- ✅ API `/api/recipes` corregida para fetch de Supabase  
- ✅ `RecipeBook.tsx` actualizado
- ❌ Vercel no hace rebuild automático
- ❌ App sigue mostrando 14 recetas hardcoded

## Soluciones

### Opción 1: Deploy Manual desde Vercel Dashboard (RECOMENDADA)

1. Ve a: **https://vercel.com/servixam-max-2674s-projects/diet-tracker**
2. Click en **"Redeploy"** (último deploy)
3. Marca **"Use existing Build Cache"** = OFF
4. Click **"Redeploy"**

### Opción 2: Deploy con Vercel CLI

```bash
cd /Users/servimac/openclaw/diet-tracker
vercel --prod --yes
```

### Opción 3: Forzar rebuild desde GitHub

1. Ve al repo: https://github.com/servixam-max/diet-tracker
2. Settings → Actions → General
3. Re-enable workflows si están desactivados
4. Haz un commit vacío para trigger:
```bash
git commit --allow-empty -m "trigger rebuild" && git push
```

## Verificación

Después del deploy, verifica:

```bash
curl "https://diet-tracker-omega-olive.vercel.app/api/recipes?limit=5"
```

Debería devolver **500 recetas** de Supabase, no 14.

---

**Timestamp**: 2026-03-27 02:30 CET
**Estado**: Pendiente deploy manual
