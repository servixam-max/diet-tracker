# Diet Tracker - Setup de Base de Datos

## Paso 1: Ejecutar Schema en Supabase

1. Ve a: https://supabase.com/dashboard/project/kaomgwojvnncidyezdzj/sql

2. Selecciona todo el SQL del archivo `supabase/schema.sql` de este proyecto

3. Pégalo en el SQL Editor de Supabase

4. Click en **"Run"** o presiona `Cmd+Enter`

5. Deberías ver "Success" en verde

## Paso 2: Verificar

Después de ejecutar, puedes verificar que las tablas se crearon yendo a:
https://supabase.com/dashboard/project/kaomgwojvnncidyezdzj/table-editor

Deberías ver estas tablas:
- profiles
- recipes
- weekly_plans
- plan_days
- plan_meals
- food_logs
- shopping_lists
- shopping_items

## Paso 3: Probar la app

1. Ejecuta `npm run dev` en la carpeta del proyecto
2. Abre http://localhost:3000
3. Regístrate con un email y contraseña
4. Completa el onboarding

## Notas

- El schema incluye RLS (Row Level Security), lo que significa que cada usuario solo ve sus propios datos
- Recipes es pública (para que todos puedan ver recetas)
- El resto de tablas requieren autenticación
