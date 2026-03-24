-- Diet Tracker Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  weight_kg DECIMAL,
  height_cm INTEGER,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain')),
  speed TEXT CHECK (speed IN ('slow', 'medium', 'fast')),
  daily_calories INTEGER,
  preferred_meals INTEGER DEFAULT 4 CHECK (preferred_meals BETWEEN 3 AND 5),
  dietary_restrictions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time_minutes INTEGER,
  calories INTEGER NOT NULL,
  protein_g DECIMAL,
  carbs_g DECIMAL,
  fat_g DECIMAL,
  servings INTEGER DEFAULT 1,
  supermarket TEXT CHECK (supermarket IN ('mercadona', 'lidl', 'aldi', 'familycash', 'generic')),
  ingredients JSONB DEFAULT '[]',
  instructions TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  total_calories INTEGER NOT NULL,
  meals_per_day INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE TABLE IF NOT EXISTS public.plan_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES public.weekly_plans(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.plan_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_day_id UUID REFERENCES public.plan_days(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'snack', 'dinner')),
  recipe_id UUID REFERENCES public.recipes(id),
  planned_calories INTEGER NOT NULL,
  custom_name TEXT,
  custom_calories INTEGER
);

CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'snack', 'dinner')),
  description TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_g DECIMAL,
  carbs_g DECIMAL,
  fat_g DECIMAL,
  image_url TEXT,
  source TEXT CHECK (source IN ('recipe', 'barcode', 'photo', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices críticos para rendimiento
CREATE INDEX IF NOT EXISTS idx_food_logs_date ON food_logs(date);
CREATE INDEX IF NOT EXISTS idx_food_logs_user ON food_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, date);

CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.weekly_plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  supermarket TEXT,
  category TEXT,
  checked BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: own" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Recipes: public" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Plans: own" ON public.weekly_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Food logs: own" ON public.food_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Shopping: own" ON public.shopping_lists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Shopping items: own" ON public.shopping_items FOR ALL USING (list_id IN (SELECT id FROM public.shopping_lists WHERE user_id = auth.uid()));
