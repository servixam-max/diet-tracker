-- 🔧 FIX: Políticas RLS faltantes para registro

-- 1. Permitir INSERT en profiles cuando el usuario se registra
CREATE POLICY "Profiles: insert on signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Asegurar que recipes sea público para lectura
DROP POLICY IF EXISTS "Recipes: public" ON public.recipes;
CREATE POLICY "Recipes: public" 
ON public.recipes 
FOR SELECT 
USING (true);

-- 3. Permitir INSERT en food_logs para usuarios autenticados
DROP POLICY IF EXISTS "Food logs: insert" ON public.food_logs;
CREATE POLICY "Food logs: insert" 
ON public.food_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Permitir INSERT en weekly_plans
DROP POLICY IF EXISTS "Plans: insert" ON public.weekly_plans;
CREATE POLICY "Plans: insert" 
ON public.weekly_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Permitir INSERT en shopping_lists
DROP POLICY IF EXISTS "Shopping: insert" ON public.shopping_lists;
CREATE POLICY "Shopping: insert" 
ON public.shopping_lists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 6. Permitir INSERT en shopping_items
DROP POLICY IF EXISTS "Shopping items: insert" ON public.shopping_items;
CREATE POLICY "Shopping items: insert" 
ON public.shopping_items 
FOR INSERT 
WITH CHECK (
  list_id IN (
    SELECT id FROM public.shopping_lists 
    WHERE user_id = auth.uid()
  )
);

-- ✅ Verificar políticas
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
