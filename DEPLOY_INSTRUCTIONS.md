# 🚀 Deploy a Vercel - Instrucciones

## Opción A: Dashboard de Vercel (Recomendado)

1. Ve a: **https://vercel.com/dashboard**
2. Importa el repo: `https://github.com/servixam-max/diet-tracker`
3. Configura las variables de entorno:

### Variables de Entorno (Production)

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vvtgpztnytpxoacoflas.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTI0NTEsImV4cCI6MjA4OTg2ODQ1MX0.eSsCLTiByilg-SHDB5GvGPJam9Gij9eMSelUr_WOuzk` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI5MjQ1MSwiZXhwIjoyMDg5ODY4NDUxfQ.fSncV16A130oJzpP3FViH4qX6loLuukOVK3VfAISAHM` |
| `OLLAMA_BASE_URL` | `https://ollama.cloud` |

4. Click en **Deploy**

---

## Opción B: Vercel CLI (Alternativa)

```bash
cd /Users/servimac/openclaw/diet-tracker

# Login
vercel login

# Deploy con variables
vercel --prod \
  --env NEXT_PUBLIC_SUPABASE_URL=https://vvtgpztnytpxoacoflas.supabase.co \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTI0NTEsImV4cCI6MjA4OTg2ODQ1MX0.eSsCLTiByilg-SHDB5GvGPJam9Gij9eMSelUr_WOuzk \
  --env SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI5MjQ1MSwiZXhwIjoyMDg5ODY4NDUxfQ.fSncV16A130oJzpP3FViH4qX6loLuukOVK3VfAISAHM \
  --env OLLAMA_BASE_URL=https://ollama.cloud
```

---

## ✅ Post-Deploy

1. **Ejecutar schema SQL en Supabase:**
   - Ve a: https://supabase.com/dashboard/project/vvtgpztnytpxoacoflas/sql
   - Copia el contenido de `supabase/schema.sql`
   - Ejecuta el SQL

2. **Verificar deploy:**
   - Abre la URL de Vercel
   - Registra un usuario
   - Completa el onboarding
   - Prueba añadir comidas

---

## 📊 URLs

- **GitHub:** https://github.com/servixam-max/diet-tracker
- **Supabase:** https://vvtgpztnytpxoacoflas.supabase.co
- **Vercel Dashboard:** https://vercel.com/servixam-2674s-projects

---

**Fecha:** 2026-03-26  
**Estado:** Ready for deploy
