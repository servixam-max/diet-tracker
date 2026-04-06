# 🔍 Testing Exhaustivo - Diet Tracker
**URL:** https://diet-tracker-my90jm5pv-servixam-2674s-projects.vercel.app
**Fecha:** 2026-04-06
**Hora:** 17:02

---

## 📋 Checklist de Testing Manual (Para hacer por usuario)

### ✅ 1. Acceso Inicial
- [ ] La URL carga sin errores (HTTP 200)
- [ ] Tiempo de carga < 3 segundos
- [ ] No hay errores en consola del navegador
- [ ] El favicon carga correctamente
- [ ] Título de página es "Diet Tracker"

### ✅ 2. Landing Page
- [ ] Botón "Probar Demo" es visible y clickeable
- [ ] Botón "Iniciar sesión" lleva a /login
- [ ] Diseño responsive (se ve bien en móvil)

### ✅ 3. Modo Demo - Dashboard
- [ ] Click en "Probar Demo" redirige a /dashboard
- [ ] Se ven los anillos de calorías animados
- [ ] Botón "+" para añadir comida funciona
- [ ] Los números de calorías/proteína/carbs son visibles

### ✅ 4. Navegación Inferior (BottomNavBar)
| De | A | ¿Funciona? | Notas |
|----|---|------------|-------|
| Dashboard | Plan | [ ] | |
| Plan | Recetas | [ ] | |
| Recetas | Lista | [ ] | |
| Lista | Perfil | [ ] | |
| Perfil | Dashboard | [ ] | **CRÍTICO** |

### ✅ 5. Perfil - Modo Demo
- [ ] Se muestra "Modo Demo" badge
- [ ] Botón "Iniciar sesión real" visible
- [ ] Click en "Iniciar sesión real" lleva a /login
- [ ] Botón "Crear cuenta nueva" lleva a /register
- [ ] Se puede volver atrás con navegación inferior
- [ ] No hay errores JavaScript

### ✅ 6. Autenticación - Registro
- [ ] Formulario de registro carga
- [ ] Validación de email (formato correcto)
- [ ] Validación de contraseña (mínimo 6 caracteres)
- [ ] Error si email ya existe
- [ ] Registro exitoso redirige a onboarding

### ✅ 7. Autenticación - Login
- [ ] Login con credenciales válidas funciona
- [ ] Login con credenciales inválidas muestra error
- [ ] Persistencia de sesión (recargar página mantiene sesión)
- [ ] Logout funciona y limpia datos

### ✅ 8. Onboarding (9 pasos)
- [ ] Paso 1: Nombre
- [ ] Paso 2: Edad
- [ ] Paso 3: Peso/Altura
- [ ] Paso 4: Nivel de actividad
- [ ] Paso 5: Objetivo
- [ ] Paso 6: Calorías calculadas
- [ ] Paso 7: Preferencias alimenticias
- [ ] Paso 8: Alergias/restricciones
- [ ] Paso 9: Resumen y finalizar

### ✅ 9. Funcionalidades Core
- [ ] Añadir comida manualmente
- [ ] Buscar alimentos
- [ ] Añadir foto de comida
- [ ] Escanear código de barras
- [ ] Generar plan semanal
- [ ] Marcar comidas como completadas
- [ ] Ver estadísticas semanales

### ✅ 10. Recetas
- [ ] Lista de recetas carga
- [ ] Filtros por supermercado funcionan
- [ ] Búsqueda de recetas funciona
- [ ] Detalle de receta se abre
- [ ] Modo cocina funciona
- [ ] Timer en modo cocina funciona

### ✅ 11. Lista de Compra
- [ ] Genera lista desde plan semanal
- [ ] Marcar items como comprados
- [ ] Eliminar items
- [ ] Persistencia en localStorage

### ✅ 12. Settings/Ajustes
- [ ] Cambiar objetivos de calorías
- [ ] Modificar preferencias
- [ ] Exportar datos
- [ ] Configurar notificaciones

### ✅ 13. Responsive
- [ ] iPhone 14 Pro (393×852)
- [ ] Samsung S23 (360×780)
- [ ] iPad Pro (1024×1366)
- [ ] Desktop (1280×800)

### ✅ 14. Offline
- [ ] App funciona sin conexión
- [ ] Datos se sincronizan al recuperar conexión
- [ ] Indicador de modo offline visible

---

## 🐛 Plantilla de Reporte de Bugs

### Bug #X
**Severidad:** [Critical/High/Medium/Low]
**Título:** [Breve descripción]

**Pasos para reproducir:**
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Resultado esperado:** [Qué debería pasar]
**Resultado actual:** [Qué pasa realmente]

**Evidencia:** [Screenshot/video]
**Errores en consola:** [Si aplica]
**Dispositivo:** [iPhone/Android/Desktop]
**Navegador:** [Safari/Chrome/etc]

---

## 📊 Métricas a Verificar

| Métrica | Objetivo | Resultado |
|---------|----------|-----------|
| Tiempo carga inicial | < 3s | ? |
| Tiempo interacción | < 100ms | ? |
| Build sin errores | Sí | ✅ |
| Lighthouse Performance | > 80 | ? |
| Lighthouse Accessibility | > 90 | ? |

---

**Notas:**
- Marcar cada checkbox con ✅ o ❌
- Añadir notas en columna "Notas" si aplica
- Reportar bugs usando la plantilla
- Priorizar bugs Critical y High
