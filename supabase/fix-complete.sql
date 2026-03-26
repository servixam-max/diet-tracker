-- 🚀 SUPABASE FIX COMPLETO - Diet Tracker
-- Ejecutar en: https://supabase.com/dashboard/project/vvtgpztnytpxoacoflas/sql

-- ============================================
-- PARTE 1: FIX RLS PARA REGISTRO
-- ============================================

-- Fix registro de usuarios (URGENTE)
CREATE POLICY IF NOT EXISTS "Profiles: insert on signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Fix para food_logs
DROP POLICY IF EXISTS "Food logs: insert" ON public.food_logs;
CREATE POLICY "Food logs: insert" 
ON public.food_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix para weekly_plans
DROP POLICY IF EXISTS "Plans: insert" ON public.weekly_plans;
CREATE POLICY "Plans: insert" 
ON public.weekly_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix para shopping_lists
DROP POLICY IF EXISTS "Shopping: insert" ON public.shopping_lists;
CREATE POLICY "Shopping: insert" 
ON public.shopping_lists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix para shopping_items
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

-- ============================================
-- PARTE 2: IMPORTAR 25 RECETAS
-- ============================================

INSERT INTO public.recipes (name, description, prep_time_minutes, calories, protein_g, carbs_g, fat_g, servings, supermarket, ingredients, instructions, tags) VALUES
('Avena nocturna con plátano', 'Desayuno energético preparado la noche anterior', 5, 350, 12, 58, 8, 1, 'mercadona', '[{"item":"Avena","amount":"50g"},{"item":"Plátano","amount":"1 ud"},{"item":"Miel","amount":"1 cd"}]', '["Mezcla avena con yogur","Añade plátano","Refrigera noche"]', '["desayuno","saludable","rápido"]'),
('Tostada de aguacate y huevo', 'Desayuno proteico y saciante', 10, 420, 18, 32, 24, 1, 'mercadona', '[{"item":"Pan integral","amount":"2 rebanadas"},{"item":"Aguacate","amount":"1/2 ud"},{"item":"Huevos","amount":"2 ud"}]', '["Tuesta el pan","Machaca aguacate","Pocha huevos","Monta tostada"]', '["desayuno","proteico","keto"]'),
('Bowl de yogur con frutos rojos', 'Desayuno ligero y antioxidante', 5, 280, 15, 35, 6, 1, 'lidl', '[{"item":"Yogur griego","amount":"200g"},{"item":"Frutos rojos","amount":"100g"},{"item":"Granola","amount":"30g"}]', '["Pon yogur en bowl","Añade frutos rojos","Espolvorea granola"]', '["desayuno","ligero","antioxidante"]'),
('Tortitas de avena y plátano', 'Desayuno dulce saludable', 15, 380, 14, 52, 12, 2, 'mercadona', '[{"item":"Avena","amount":"80g"},{"item":"Plátano","amount":"2 ud"},{"item":"Huevos","amount":"2 ud"}]', '["Tritura avena","Mezcla con plátano y huevos","Cuaja en sartén"]', '["desayuno","dulce","saludable"]'),
('Huevos revueltos con espinacas', 'Desayuno bajo en carbohidratos', 10, 320, 22, 6, 24, 1, 'mercadona', '[{"item":"Huevos","amount":"3 ud"},{"item":"Espinacas","amount":"50g"},{"item":"Queso fresco","amount":"30g"}]', '["Saltea espinacas","Añade huevos batidos","Remueve hasta cuajar"]', '["desayuno","keto","proteico"]'),
('Pollo con quinoa y verduras', 'Comida equilibrada alta en proteína', 25, 520, 45, 48, 12, 1, 'mercadona', '[{"item":"Pechuga pollo","amount":"200g"},{"item":"Quinoa","amount":"80g"},{"item":"Brócoli","amount":"150g"}]', '["Cuece quinoa","Cocina pollo","Cuece verduras","Sirve junto"]', '["comida","proteico","meal-prep"]'),
('Salmón al horno con boniato', 'Cena rica en omega-3', 30, 480, 35, 42, 18, 1, 'lidl', '[{"item":"Salmón","amount":"150g"},{"item":"Boniato","amount":"200g"},{"item":"Espárragos","amount":"100g"}]', '["Precalienta horno 200°C","Hornea boniato 20min","Añade salmón 12min"]', '["cena","omega-3","horno"]'),
('Ensalada de atún y garbanzos', 'Comida rápida y nutritiva', 15, 380, 28, 35, 12, 1, 'mercadona', '[{"item":"Atún","amount":"2 latas"},{"item":"Garbanzos","amount":"150g"},{"item":"Lechuga","amount":"100g"}]', '["Mezcla ingredientes","Aliña con aceite"]', '["comida","rápido","económico"]'),
('Pasta integral con pavo', 'Comida completa con carbohidratos', 20, 550, 38, 62, 14, 1, 'lidl', '[{"item":"Pasta integral","amount":"100g"},{"item":"Pavo","amount":"150g"},{"item":"Calabacín","amount":"150g"}]', '["Cuece pasta","Saltea pavo y verduras","Mezcla todo"]', '["comida","pasta","completo"]'),
('Lentejas con verduras', 'Comida tradicional rica en hierro', 45, 420, 22, 58, 8, 2, 'mercadona', '[{"item":"Lentejas","amount":"200g"},{"item":"Zanahoria","amount":"2 ud"},{"item":"Patata","amount":"1 ud"}]', '["Remoja lentejas","Sofríe verduras","Cuece 40min"]', '["comida","legumbres","hierro"]'),
('Wrap de pollo y lechuga', 'Comida rápida y portátil', 15, 380, 32, 28, 14, 1, 'mercadona', '[{"item":"Tortilla trigo","amount":"1 ud"},{"item":"Pollo","amount":"120g"},{"item":"Lechuga","amount":"50g"}]', '["Corta pollo en tiras","Calienta tortilla","Rellena y enrolla"]', '["comida","portátil","rápido"]'),
('Arroz integral con verduras', 'Comida vegana completa', 30, 420, 12, 78, 8, 1, 'aldi', '[{"item":"Arroz integral","amount":"100g"},{"item":"Pimiento","amount":"1 ud"},{"item":"Calabacín","amount":"1/2 ud"}]', '["Cuece arroz 25min","Saltea verduras","Mezcla todo"]', '["comida","vegano","arroz"]'),
('Pavo al horno con patatas', 'Comida tradicional fácil', 40, 480, 42, 45, 12, 2, 'mercadona', '[{"item":"Pavo","amount":"300g"},{"item":"Patatas","amount":"300g"},{"item":"Cebolla","amount":"1 ud"}]', '["Precalienta horno 180°C","Coloca en bandeja","Hornear 35-40min"]', '["comida","horno","tradicional"]'),
('Ensalada César con pollo', 'Comida clásica rejuvenecida', 20, 450, 35, 22, 24, 1, 'lidl', '[{"item":"Lechuga romana","amount":"150g"},{"item":"Pollo","amount":"150g"},{"item":"Picatostes","amount":"30g"}]', '["Corta lechuga","Cocina pollo","Mezcla con salsa"]', '["comida","ensalada","clasico"]'),
('Tortilla francesa con espinacas', 'Cena ligera y proteica', 10, 320, 22, 8, 22, 1, 'mercadona', '[{"item":"Huevos","amount":"3 ud"},{"item":"Espinacas","amount":"50g"},{"item":"Queso","amount":"30g"}]', '["Saltea espinacas","Añade huevos batidos","Cuaja tortilla"]', '["cena","ligero","proteico"]'),
('Merluza al vapor con patatas', 'Cena ligera de pescado blanco', 25, 340, 32, 38, 4, 1, 'lidl', '[{"item":"Merluza","amount":"180g"},{"item":"Patatas","amount":"200g"},{"item":"Zanahoria","amount":"1 ud"}]', '["Corta verduras","Coloca en vaporera","Cuece 20min"]', '["cena","pescado","ligero"]'),
('Gambas al ajillo', 'Cena rápida de marisco', 10, 220, 24, 4, 12, 1, 'mercadona', '[{"item":"Gambas","amount":"200g"},{"item":"Ajo","amount":"4 dientes"},{"item":"Guindilla","amount":"1 ud"}]', '["Lamina ajos","Calienta aceite","Añade gambas 2-3min"]', '["cena","marisco","rápido"]'),
('Tofu salteado con verduras', 'Cena vegana rica en proteína', 20, 320, 22, 18, 18, 1, 'lidl', '[{"item":"Tofu firme","amount":"200g"},{"item":"Brócoli","amount":"150g"},{"item":"Pimiento","amount":"1/2 ud"}]', '["Corta tofu en cubos","Saltea hasta dorar","Añade verduras y soja"]', '["cena","vegano","tofu"]'),
('Revuelto de champiñones', 'Cena baja en carbohidratos', 12, 240, 18, 6, 16, 1, 'aldi', '[{"item":"Huevos","amount":"2 ud"},{"item":"Champiñones","amount":"150g"},{"item":"Ajo","amount":"1 diente"}]', '["Lamina champiñones","Saltea con ajo","Añade huevos batidos"]', '["cena","keto","bajo-carb"]'),
('Huevos rellenos de atún', 'Cena creativa y proteica', 20, 320, 26, 6, 22, 2, 'mercadona', '[{"item":"Huevos","amount":"4 ud"},{"item":"Atún","amount":"2 latas"},{"item":"Mayonesa","amount":"2 cd"}]', '["Cuece huevos 10min","Mezcla yemas con atún","Rellena claras"]', '["cena","huevos","proteico"]'),
('Batido de proteínas y plátano', 'Snack post-entreno', 5, 280, 25, 32, 4, 1, 'familycash', '[{"item":"Proteína whey","amount":"30g"},{"item":"Plátano","amount":"1 ud"},{"item":"Leche","amount":"250ml"}]', '["Pon todo en batidora","Tritura hasta suave"]', '["snack","post-entreno","proteico"]'),
('Yogur con nueces y miel', 'Snack saludable', 3, 220, 12, 24, 10, 1, 'mercadona', '[{"item":"Yogur griego","amount":"150g"},{"item":"Nueces","amount":"30g"},{"item":"Miel","amount":"1 cd"}]', '["Pon yogur en bowl","Añade nueces","Rocía miel"]', '["snack","saludable","rápido"]'),
('Palitos de zanahoria con hummus', 'Snack crujiente', 5, 180, 8, 22, 6, 1, 'aldi', '[{"item":"Zanahoria","amount":"2 ud"},{"item":"Hummus","amount":"100g"}]', '["Corta zanahoria en palitos","Sirve con hummus"]', '["snack","vegano","crujiente"]'),
('Tostada integral con tomate', 'Snack ligero', 5, 150, 6, 28, 2, 1, 'mercadona', '[{"item":"Pan integral","amount":"2 rebanadas"},{"item":"Tomate","amount":"2 ud"},{"item":"Aceite","amount":"1 cd"}]', '["Tuesta pan","Ralla tomate","Rocía con aceite"]', '["snack","ligero","vegetariano"]'),
('Puñado de almendras', 'Snack energético', 1, 200, 8, 8, 18, 1, 'familycash', '[{"item":"Almendras","amount":"30g"}]', '["Come directamente del puñado"]', '["snack","energia","frutos-secos"]');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Contar recetas
SELECT COUNT(*) as total_recetas FROM public.recipes;

-- Ver políticas RLS
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ✅ ¡Listo! Ahora puedes registrarte y usar la app
