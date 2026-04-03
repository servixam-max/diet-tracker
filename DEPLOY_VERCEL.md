# 🚀 Diet Tracker - Vercel Deployment Guide

## ✅ Pre-Deploy Checklist

- [x] Build local válido (`npm run build`)
- [x] Variables de entorno configuradas en `.env.local`
- [x] `vercel.json` creado
- [x] `.vercelignore` creado
- [x] Fixes de seguridad aplicados (`/api/setup` protegido)
- [x] Variables `NEXT_PUBLIC_*` configuradas

---

## 📋 Variables de Entorno para Vercel

**Configurar en Vercel Dashboard → Project Settings → Environment Variables:**

### Producción (Production):
```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://vvtgpztnytpxoacoflas.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTI0NTEsImV4cCI6MjA4OTg2ODQ1MX0.eSsCLTiByilg-SHDB5GvGPJam9Gij9eMSelUr_WOuzk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI5MjQ1MSwiZXhwIjoyMDg5ODY4NDUxfQ.fSncV16A130oJzpP3FViH4qX6loLuukOVK3VfAISAHM

# Ollama Cloud (REQUIRED para IA)
NEXT_PUBLIC_OLLAMA_BASE_URL=https://ollama.cloud
NEXT_PUBLIC_OLLAMA_TEXT_MODEL=llama3.2
NEXT_PUBLIC_OLLAMA_VISION_MODEL=llava:latest
OLLAMA_BASE_URL=https://ollama.cloud
OLLAMA_TEXT_MODEL=llama3.2
OLLAMA_VISION_MODEL=llava:latest

# Opcional (no configurado)
RESEND_API_KEY=
```

---

## 🚀 Método 1: Deploy con Vercel CLI (Recomendado)

### Paso 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Paso 2: Login en Vercel
```bash
vercel login
```

### Paso 3: Deploy (Primera vez)
```bash
cd /Users/servimac/openclaw/diet-tracker
vercel
```

**Responder preguntas:**
- `Set up and deploy?` → **Y**
- `Which scope?` → Seleccionar tu cuenta
- `Link to existing project?` → **N**
- `What's your project's name?` → **diet-tracker** (o el que quieras)
- `In which directory is your code located?` → **./**
- `Want to override the settings?` → **N**

### Paso 4: Configurar Variables de Entorno
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Pegar: https://vvtgpztnytpxoacoflas.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Pegar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Pegar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add NEXT_PUBLIC_OLLAMA_BASE_URL production
# Pegar: https://ollama.cloud

vercel env add NEXT_PUBLIC_OLLAMA_TEXT_MODEL production
# Pegar: llama3.2

vercel env add NEXT_PUBLIC_OLLAMA_VISION_MODEL production
# Pegar: llava:latest
```

### Paso 5: Deploy Final
```bash
vercel --prod
```

---

## 🌐 Método 2: Deploy desde Vercel Dashboard

### Paso 1: Ir a Vercel Dashboard
https://vercel.com/new

### Paso 2: Importar Proyecto
- **Import Git Repository** → Si el código está en GitHub/GitLab
- **OR** → **Deploy** desde la CLI con `vercel --prod`

### Paso 3: Configurar Build Settings
- **Framework Preset:** Next.js (auto-detect)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install --legacy-peer-deps`

### Paso 4: Agregar Variables de Entorno
En **Settings → Environment Variables**, agregar todas las de la sección anterior.

### Paso 5: Deploy
Click en **Deploy** y esperar ~2-3 minutos.

---

## 🧪 Post-Deploy Testing Checklist

### 1. Verificar Homepage
```bash
curl https://diet-tracker-xxx.vercel.app/
# Esperado: 200 OK, HTML con <title>Diet Tracker</title>
```

### 2. Verificar Login Page
```bash
curl https://diet-tracker-xxx.vercel.app/login
# Esperado: 200 OK, formulario visible
```

### 3. Test Login API
```bash
curl -X POST https://diet-tracker-xxx.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.nuevo@demo.com","password":"TestPass123!"}'
# Esperado: 200 OK con token
```

### 4. Verificar Recetas (público)
```bash
curl https://diet-tracker-xxx.vercel.app/api/recipes
# Esperado: 200 OK con array de recetas
```

### 5. Test Health Endpoint
```bash
curl https://diet-tracker-xxx.vercel.app/api/health
# Esperado: {"status":"ok","version":"1.0.0"}
```

### 6. Verificar Setup Protegido
```bash
curl -X POST https://diet-tracker-xxx.vercel.app/api/setup
# Esperado: 401 {"error":"No autorizado - debes iniciar sesión"}
```

### 7. Test en Navegador
1. Abrir `https://diet-tracker-xxx.vercel.app/`
2. Verificar que carga sin errores de consola
3. Intentar login con `test.nuevo@demo.com` / `TestPass123!`
4. Verificar que el dashboard carga
5. Probar generación de plan con IA
6. Verificar que las recetas cargan

---

## 🔧 Comandos Útiles

### Ver logs en tiempo real
```bash
vercel logs <deployment-url>
```

### Listar deployments
```bash
vercel ls
```

### Deploy a preview (no production)
```bash
vercel
```

### Deploy a production
```bash
vercel --prod
```

### Pull environment variables from Vercel
```bash
vercel env pull
```

---

## ⚠️ Troubleshooting

### Error: "Module not found" en producción
**Causa:** Dependencia en `devDependencies`  
**Fix:** Mover a `dependencies` en `package.json`

### Error: "Environment variable not set"
**Causa:** Falta variable en Vercel  
**Fix:** `vercel env add <NAME> production`

### Error: CORS con Ollama
**Causa:** Ollama Cloud no permite el dominio de Vercel  
**Fix:** Configurar CORS en Ollama Cloud o usar API route proxy

### Error: "Build failed"
**Causa:** Error de TypeScript  
**Fix:** `npm run build` localmente y corregir errores

---

## 📊 URLs Después del Deploy

- **Production:** `https://diet-tracker-xxx.vercel.app`
- **Preview:** `https://diet-tracker-git-<branch>-username.vercel.app`

---

## 🎯 Dominio Personalizado (Opcional)

1. Ir a **Project Settings → Domains**
2. Agregar dominio: `diet.tudominio.com`
3. Configurar DNS:
   - **Type:** CNAME
   - **Name:** diet (o @)
   - **Value:** cname.vercel-dns.com
4. Esperar propagación (~5 min)

---

## ✅ Confirmación de Éxito

El deploy fue exitoso si:

- ✅ Homepage carga sin errores
- ✅ Login funciona
- ✅ API endpoints responden
- ✅ No hay errores en consola del navegador
- ✅ IA genera planes correctamente
- ✅ Recetas cargan
- ✅ Service worker registra sin errores

---

**¡Listo! Tu Diet Tracker está en producción en Vercel 🎉**
